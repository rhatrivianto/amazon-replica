import { apiSlice } from './apiSlice.js';

export const addressApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyAddresses: builder.query({
      query: () => '/addresses',
      providesTags: ['Address'],
    }),
    addAddress: builder.mutation({
      query: (body) => ({
        url: '/addresses',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Address'],
    }),
    deleteAddress: builder.mutation({
      query: (id) => ({
        url: `/addresses/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Address'],
    }),
  }),
});

export const { useGetMyAddressesQuery, useAddAddressMutation, useDeleteAddressMutation } = addressApi;
