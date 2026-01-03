import { apiSlice } from './apiSlice.js';

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Mutation untuk Login
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    // Mutation untuk Register
    register: builder.mutation({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),

    // Mutation untuk Verifikasi Email (Menggunakan Query Param)
    verifyEmail: builder.mutation({
      query: (token) => ({
        url: `/auth/verify-email?token=${token}`,
        method: 'GET', // Meskipun method GET, di RTK Query mutation sering digunakan untuk aksi sekali jalan
      }),
    }),
  }),
  overrideExisting: false,
});

export const { 
  useLoginMutation, 
  useRegisterMutation, 
  useVerifyEmailMutation 
} = authApi;