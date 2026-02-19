import axios from "axios";
import apiInstance from "./axios/instance.js"; // Pastikan path ini benar
import { toast } from "react-hot-toast";
// Import action logout dari kedua slice
import { logout } from './features/auth/authSlice.js';
import { adminLogout } from './features/admin/auth/adminAuthSlice.js';

 export const axiosBaseQuery = () => async (args, api) => {
  // 1. Normalisasi args (Support string shorthand dari RTK Query)
  // Jika args hanya string (misal: "/admin/dashboard"), ubah jadi object { url: ... }
  const queryArgs = typeof args === 'string' ? { url: args } : args;

  // Defensive check to prevent crash if a query is misconfigured
  if (!queryArgs || typeof queryArgs.url !== 'string') {
    const errorMessage = `Invalid query configuration: 'url' is missing or not a string. Received: ${JSON.stringify(args)}`;
    console.error("axiosBaseQuery Error:", errorMessage);
    return {
      error: { status: 500, data: errorMessage }
    };
  }
  const { url, method, data, body, params, headers } = queryArgs;

  try {
    // Cek apakah URL diawali dengan http (API Eksternal)
    const isExternal = url.startsWith('http');
    
    // 1. Ambil Token dari Redux State (Cara paling aman & anti-circular dependency)
    const state = api.getState();
    // Cek token di adminAuth (Admin) atau auth (User biasa), atau fallback ke localStorage
      // FIX: Tambahkan 'adminToken' di sini agar terbaca saat refresh page
    const token = state.adminAuth?.token || localStorage.getItem('adminToken') || state.auth?.token || localStorage.getItem('token');

    // 2. Siapkan Headers
    const requestHeaders = { ...headers };
    if (token && !isExternal) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
    }

    // Jika eksternal, gunakan axios murni. Jika internal, gunakan apiInstance.
    const result = await (isExternal ? axios : apiInstance)({
      url,
      method,
      data: data || body,
      params,
      headers: isExternal ? {} : requestHeaders, // Kirim headers yang sudah ada tokennya
    });

    return { data: result.data };
  } catch (axiosError) {
    // --- INTERCEPTOR 401: AUTO LOGOUT (AMAZON STYLE) ---
    if (axiosError.response?.status === 401) {
      const state = api.getState();
      // Hanya jalankan jika masih ada token di state (mencegah loop)
      if (state.auth.token || state.adminAuth.token) {
        // Tampilkan pesan error ke user
        toast.error("Sesi Anda telah berakhir. Silakan login kembali.", { 
          id: 'session-expired-toast' // ID untuk mencegah toast duplikat
        });
        
        // Dispatch kedua action logout untuk membersihkan semua sesi
        api.dispatch(logout());
        api.dispatch(adminLogout());
      }
    }

    // Kembalikan error asli ke RTK Query agar bisa ditangkap di komponen jika perlu
    return {
      error: {
        status: axiosError.response?.status || 500,
        data: axiosError.response?.data?.message || axiosError.message || "Network Error",
      },
    };
  }
};