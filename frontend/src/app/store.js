import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '../services/apiSlice';
import authReducer from '../features/auth/authSlice';
import cartReducer from '../features/cart/cartSlice'; // Jika masih ada
import uiReducer from '../features/ui/uiSlice'; // Jika masih ada

export const store = configureStore({
  reducer: {
    // 1. Reducer API (Wajib untuk RTK Query)
    [apiSlice.reducerPath]: apiSlice.reducer,
    
    // 2. Reducer Auth
    auth: authReducer,
    
    // 3. Reducer Lainnya
    cart: cartReducer,
    ui: uiReducer,
  },
  // 4. MIDDLEWARE (INI YANG SERING LUPUT)
  // Tanpa ini, fitur 'invalidatesTags' tidak akan jalan (Navbar tidak refresh)
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
    
  devTools: true,
});