import axios from 'axios';
// import { store } from '../app/store.js'; // HAPUS INI untuk mencegah Circular Dependency

// Buat instance axios khusus untuk API internal
const apiInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  withCredentials: true, // Penting untuk cookie/session
});

// INTERCEPTOR: Sisipkan Token sebelum request dikirim
apiInstance.interceptors.request.use(
  (config) => {
    // GANTI LOGIKA: Ambil langsung dari LocalStorage
    // 'adminToken' diset oleh adminAuthApi, 'token' diset oleh user login biasa
    const token = localStorage.getItem('adminToken') || localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiInstance;