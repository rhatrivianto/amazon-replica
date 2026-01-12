// src/app/api/apiSlice.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Definisikan URL di luar agar bisa di-log untuk debugging
const prodUrl = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
const baseUrl = import.meta.env.MODE === 'production'
  ? (prodUrl.endsWith('/api/v1') ? prodUrl : `${prodUrl}/api/v1`)
  : 'http://localhost:5000/api/v1';

console.log("🚀 API Base URL being used:", baseUrl);
console.log("🔧 Environment Mode:", import.meta.env.MODE);

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ 
    baseUrl: baseUrl || 'http://localhost:5000/api/v1',
    prepareHeaders: (headers, { getState }) => {
      // 1. Ambil token dari Redux State
      // Gunakan optional chaining (?.) untuk keamanan jika state auth belum terinisialisasi
      const token = getState()?.auth?.token;
      
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      } 
      
      return headers;
    },
  }),
  tagTypes: ['Products', 'Category', 'Order', 'User', 'Brand', 'Cart', 'current'],
  endpoints: () => ({}),
});
