// frontend/src/services/sellerApi.js
import { apiSlice } from './apiSlice.js';

export const sellerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Mengambil inventori (tambahkan params untuk search/pagination)
    getMyInventory: builder.query({
      query: (params) => ({
        url: '/seller/inventory',
        params, 
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
        url: `/seller/products/${id}`, // Pastikan plural 'products'
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