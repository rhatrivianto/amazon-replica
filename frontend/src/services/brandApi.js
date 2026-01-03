import { apiSlice } from './apiSlice.js';

export const brandApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBrands: builder.query({
      query: () => '/brands',
      providesTags: ['Brands'],
    }),
    createBrand: builder.mutation({
      query: (newBrand) => ({
        url: '/brands',
        method: 'POST',
        body: newBrand,
      }),
      invalidatesTags: ['Brands'],
    }),
    deleteBrand: builder.mutation({
      query: (id) => ({
        url: `/brands/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Brands'],
    }),
  }),
});

export const { 
  useGetBrandsQuery, 
  useCreateBrandMutation, 
  useDeleteBrandMutation 
} = brandApi;