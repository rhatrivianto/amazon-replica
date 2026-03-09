// src/app/api/apiSlice.js
import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from '../axiosBaseQuery.js';

export const apiSlice = createApi({
  reducerPath: 'api',
  // Menggunakan axiosBaseQuery agar terintegrasi dengan Interceptor (Refresh Token & Error Handling)
  baseQuery: axiosBaseQuery(), // PENTING: Jangan isi baseUrl di sini agar tidak double dengan instance.js
  tagTypes: [
    'Products',
    'Category',
    'Order',
    'User',
    'Brands',
    'Cart',
    'Current',
    'AdminStats',
    'Wishlist',
    'Address',
    'Reviews',
    'SellerContent'
  ],
  endpoints: () => ({}),
});
