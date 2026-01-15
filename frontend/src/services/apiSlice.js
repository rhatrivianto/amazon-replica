// src/app/api/apiSlice.js
import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../axiosBaseQuery.js';

export const apiSlice = createApi({
  reducerPath: 'api',
  // Menggunakan axiosBaseQuery agar terintegrasi dengan Interceptor (Refresh Token & Error Handling)
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Products', 'Category', 'Order', 'User', 'Brand', 'Cart', 'Current', 'AdminStats'],
  endpoints: () => ({}),
});
