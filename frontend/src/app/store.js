// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '../services/apiSlice.js';
import adminAuthReducer from '../features/admin/auth/adminAuthSlice.js'; // Reducer Admin
import userAuthReducer from '../features/auth/authSlice.js'; // Asumsi ada reducer User



export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    adminAuth: adminAuthReducer,
    auth: userAuthReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      apiSlice.middleware
      // , currencyApi.middleware // Tambahkan jika pakai API terpisah
    ),
  devTools: import.meta.env.MODE !== 'production',
});