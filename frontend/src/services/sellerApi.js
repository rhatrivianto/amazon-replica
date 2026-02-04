// frontend/src/services/sellerApi.js
import { apiSlice } from './apiSlice.js';

export const sellerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Tambahkan params agar mendukung pagination (?page=1&limit=12)
    getMyInventory: builder.query({
      query: (params) => ({
        url: '/seller/inventory',
        params: params, // Ini krusial untuk pagination di halaman Seller
      }),
      providesTags: ['Products'],
    }),
    
    createMyProduct: builder.mutation({
      query: (formData) => ({
        url: '/seller/products',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Products'],
    }),

    updateMyProduct: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/seller/products/${id}`, 
        method: 'PATCH',
        body: formData,
      }),
      invalidatesTags: ['Products'],
    }),

    deleteMyProduct: builder.mutation({
      query: (id) => ({
        url: `/seller/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Products'],
    }),
  }),
});

export const { 
  useGetMyInventoryQuery, 
  useCreateMyProductMutation,
  useUpdateMyProductMutation,
  useDeleteMyProductMutation 
} = sellerApi;