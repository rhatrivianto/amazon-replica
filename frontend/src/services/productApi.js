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
    
    // TAMBAHKAN INI: Endpoint untuk Search Suggestions
    getSuggestions: builder.query({
      query: (keyword) => ({
        url: '/products/suggestions',
        params: { q: keyword },
      }),
      // Kita tidak perlu provideTags karena data ini sangat sementara (transient)
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
  useGetProductByIdQuery,
  useGetSuggestionsQuery 
} = productApi;

