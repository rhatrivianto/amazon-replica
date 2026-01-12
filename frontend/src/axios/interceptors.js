import axios from "axios";

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

export const applyInterceptors = (axiosInstance) => {
  // REQUEST INTERCEPTOR
  // Berjalan SEBELUM request dikirim ke backend
  axiosInstance.interceptors.request.use(
    (config) => {
      // FIX: Ambil token langsung dari localStorage (Sinkron dengan authSlice/Redux)
      const token = localStorage.getItem('token');
      if (token) {
        // Sisipkan token ke header jika ada
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // RESPONSE INTERCEPTOR (Amazon Scale: Auto-Refresh Logic)
  // Berjalan SETELAH menerima respon dari backend (Baik sukses maupun error)
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // --- FIX: Handle "User no longer exists" (Database Reset) ---
      if (error.response?.status === 401 && error.response?.data?.message === 'User no longer exists.') {
        localStorage.removeItem('userInfo');
        localStorage.removeItem('token');
        window.location.href = '/'; // Hard redirect ke home untuk login ulang
        return Promise.reject(error);
      }

      // Jika error 401 (Unauthorized) dan bukan karena retry
      if (error.response?.status === 401 && !originalRequest._retry) {
        
        // Jangan coba refresh jika memang sedang di halaman login
        if (window.location.pathname.includes('/login')) {
          localStorage.removeItem('userInfo');
          localStorage.removeItem('token');
          return Promise.reject(error);
        }

        // Jika sedang proses refresh token, masukkan request lain ke antrian (Queue)
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              // Saat antrian diproses, gunakan token baru
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return axiosInstance(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        // Mulai proses Refresh Token
        return new Promise((resolve, reject) => {
          const attemptRefresh = async () => {
            try {
              // SINKRONISASI: Endpoint backend kita adalah /auth/refresh-token
              // Pastikan baseURL sudah termasuk /api/v1
              const response = await axios.post(
                `${originalRequest.baseURL}/auth/refresh-token`,
                {},
                { withCredentials: true }
              );

              const { accessToken } = response.data.data;
              
              // FIX: Update localStorage agar request berikutnya pakai token baru
              localStorage.setItem('token', accessToken);

              // Proses antrian request yang tertunda dengan token baru
              processQueue(null, accessToken);
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              resolve(axiosInstance(originalRequest));
            } catch (refreshError) {
              processQueue(refreshError, null);
              localStorage.removeItem('userInfo');
              localStorage.removeItem('token');
              window.location.href = '/'; // Redirect ke login
              reject(refreshError);
            } finally {
              isRefreshing = false;
            }
          };

          attemptRefresh();
        });
      }

      return Promise.reject(error);
    }
  );
};