import { apiSlice } from './apiSlice.js';

export const sellerContentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSellerContents: builder.query({
      query: () => '/seller-contents',
      providesTags: ['SellerContent'],
    }),
    createSellerContent: builder.mutation({
      query: (data) => ({
        url: '/seller-contents',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['SellerContent'],
    }),
    updateSellerContent: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/seller-contents/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['SellerContent'],
    }),
    deleteSellerContent: builder.mutation({
      query: (id) => ({
        url: `/seller-contents/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['SellerContent'],
    }),
  }),
});

export const {
  useGetSellerContentsQuery,
  useCreateSellerContentMutation,
  useUpdateSellerContentMutation,
  useDeleteSellerContentMutation
} = sellerContentApi;
