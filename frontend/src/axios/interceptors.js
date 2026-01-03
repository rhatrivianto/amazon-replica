import useAuthStore from "../stores/auth.store"; // Sesuaikan path-nya
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
  axiosInstance.interceptors.request.use(
    (config) => {
      // SINKRONISASI: Gunakan accessToken (bukan token)
      const token = useAuthStore.getState().token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // RESPONSE INTERCEPTOR (Amazon Scale: Auto-Refresh Logic)
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Jika error 401 (Unauthorized) dan bukan karena retry
      if (error.response?.status === 401 && !originalRequest._retry) {
        
        // Jangan coba refresh jika memang sedang di halaman login
        if (window.location.pathname.includes('/login')) {
          useAuthStore.getState().logout();
          return Promise.reject(error);
        }

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return axiosInstance(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

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
              
              // SINKRONISASI: Update store dengan token baru
              useAuthStore.getState().setAuth(useAuthStore.getState().user, accessToken);

              processQueue(null, accessToken);
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              resolve(axiosInstance(originalRequest));
            } catch (refreshError) {
              processQueue(refreshError, null);
              useAuthStore.getState().logout();
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