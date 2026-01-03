import { createSlice } from '@reduxjs/toolkit';

const adminAuthSlice = createSlice({
  name: 'adminAuth',
  initialState: {
    token: localStorage.getItem('adminToken') || null,
    admin: JSON.parse(localStorage.getItem('adminData')) || null,
    isAuthenticated: !!localStorage.getItem('adminToken'),
  },
  reducers: {
    setAdminCredentials: (state, action) => {
      const { admin, token } = action.payload;
      state.admin = admin;
      state.token = token;
      state.isAuthenticated = true;
      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminData', JSON.stringify(admin));
    },
    adminLogout: (state) => {
      state.admin = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminData');
    },
  },
});

export const { setAdminCredentials, adminLogout } = adminAuthSlice.actions;

// Selectors
export const selectCurrentAdmin = (state) => state.adminAuth.admin;
export const selectIsAdminAuthenticated = (state) => state.adminAuth.isAuthenticated;

export default adminAuthSlice.reducer;