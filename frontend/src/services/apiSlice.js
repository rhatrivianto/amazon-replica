// src/app/api/apiSlice.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Definisikan URL di luar agar bisa di-log untuk debugging
const prodUrl = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
const baseUrl = import.meta.env.MODE === 'production'
  ? (prodUrl.endsWith('/api/v1') ? prodUrl : `${prodUrl}/api/v1`)
  : 'http://localhost:5000/api/v1';

console.log("🚀 API Base URL being used:", baseUrl);

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ 
    baseUrl: baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const state = getState();
      
      // Ambil kedua token
      const Token = state.adminAuth?.token;
      const userToken = state.auth?.token;

      // Prioritaskan adminToken jika sedang di area admin, atau kirim yang tersedia
      if (Token) {
        headers.set('authorization', `Bearer ${Token}`);
      } else if (userToken) {
        headers.set('authorization', `Bearer ${userToken}`);
      }
      
      return headers;
    },
  }),
  tagTypes: ['Products', 'Category', 'Order', 'User', 'Brand', 'Cart', 'current'],
  endpoints: () => ({}),
});
