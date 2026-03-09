import axios from 'axios';
// import { store } from '../app/store.js'; // HAPUS INI untuk mencegah Circular Dependency
import { applyInterceptors } from './interceptors.js';
import { API_BASE_URL } from './base.js'; // Import URL yang sudah dinormalisasi

// Buat instance axios khusus untuk API internal
const apiInstance = axios.create({
  baseURL: API_BASE_URL, // Gunakan URL dari base.js agar konsisten
  timeout: 15000, // Samakan timeout
  headers: { 
    "Content-Type": "application/json",
    "Accept": "application/json"
  }, 
  withCredentials: true, // Penting untuk cookie/session
});

// Terapkan interceptor (Request & Response/Refresh Token) dari file terpisah
// Ini mencegah duplikasi dan memastikan logika refresh token berjalan
applyInterceptors(apiInstance);

export default apiInstance;