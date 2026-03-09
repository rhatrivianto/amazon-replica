import { apiSlice } from './apiSlice.js';

export const accountApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updateMe: builder.mutation({
      query: (data) => ({
        url: '/users/update-me',
        method: 'PATCH',
        body: data,
      }),
      // Kita akan handle update state secara manual di komponen
    }),
    updateMyPassword: builder.mutation({
      query: (data) => ({
        url: '/users/update-my-password',
        method: 'PATCH',
        body: data,
      }),
    }),
  }),
});

export const {
  useUpdateMeMutation,
  useUpdateMyPasswordMutation,
} = accountApi;