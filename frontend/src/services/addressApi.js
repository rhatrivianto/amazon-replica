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
    updateAddress: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/addresses/${id}`,
        method: 'PATCH',
        body: data,
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

export const { 
  useGetMyAddressesQuery, 
  useAddAddressMutation, 
  useUpdateAddressMutation, 
  useDeleteAddressMutation 
} = addressApi;
