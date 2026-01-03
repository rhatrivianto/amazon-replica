import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    userInfo: localStorage.getItem('userInfo') 
      ? JSON.parse(localStorage.getItem('userInfo')) 
      : null,
    token: localStorage.getItem('token') || null,
  },
  reducers: {
    setUserCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.userInfo = user;
      state.token = token;
      
      localStorage.setItem('userInfo', JSON.stringify(user));
      localStorage.setItem('token', token);
    },
    logout: (state) => {
      state.userInfo = null;
      state.token = null;
      localStorage.removeItem('userInfo');
      localStorage.removeItem('token');
    },
  },
});

export const { setUserCredentials, logout } = authSlice.actions;

// Selectors
export const selectIsAuthenticated = (state) => !!state.auth.token;
export const selectUserInfo = (state) => state.auth.userInfo;

export default authSlice.reducer;