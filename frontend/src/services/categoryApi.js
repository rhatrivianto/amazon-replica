// src/features/admin/products/services/categoryApi.js
import { apiSlice } from './apiSlice.js';

export const categoryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Pastikan URL sesuai dengan backend (misal: /admin/categories atau /categories)
    getCategories: builder.query({
      query: () => '/categories', 
      providesTags: ['Category'],
    }),
    
    getCategoryById: builder.query({
      query: (id) => `/categories/${id}`,
      providesTags: (result, error, id) => [{ type: 'Category', id }],
    }),
    
    createCategory: builder.mutation({
      query: (newCategory) => ({
        url: '/categories',
        method: 'POST',
        body: newCategory,
      }),
      invalidatesTags: ['Category'],
    }),
    
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Category'],
    }),
  }),
});

export const { 
  useGetCategoriesQuery, 
  useCreateCategoryMutation,
  useGetCategoryByIdQuery,
  useDeleteCategoryMutation 
} = categoryApi;