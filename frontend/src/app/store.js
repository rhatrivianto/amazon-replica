// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '../services/apiSlice.js';
import adminAuthReducer from '../features/admin/auth/adminAuthSlice.js'; // Reducer Admin
import userAuthReducer from '../features/auth/authSlice.js'; // Asumsi ada reducer User


export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    adminAuth: adminAuthReducer, // State khusus Admin
    auth: userAuthReducer,       // State khusus User

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});