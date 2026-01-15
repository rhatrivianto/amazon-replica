// frontend/src/services/productApi.js
import { apiSlice } from './apiSlice.js';

export const productApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Pembeli melihat semua produk atau filter by kategori
    getProducts: builder.query({
      query: (params) => ({
        url: '/products',
        params: params, 
      }),
      providesTags: ['Products'],
    }),
    
    // Pembeli melihat detail satu produk
    getProductById: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Products', id }],
    }),
  }),
});

export const { 
  useGetProductsQuery, 
  useGetProductByIdQuery 
} = productApi;