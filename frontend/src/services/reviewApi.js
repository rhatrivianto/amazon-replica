import { apiSlice } from './apiSlice.js';

export const reviewApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProductReviews: builder.query({
      query: (productId) => `/reviews/product/${productId}`,
      providesTags: ['Reviews'],
    }),
    createReview: builder.mutation({
      query: ({ productId, reviewData }) => ({
        url: `/reviews/product/${productId}`,
        method: 'POST',
        body: reviewData,
      }),
      invalidatesTags: ['Reviews', 'Products'],
    }),
  }),
});

export const { useGetProductReviewsQuery, useCreateReviewMutation } = reviewApi;