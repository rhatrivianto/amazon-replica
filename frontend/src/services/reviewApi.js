import { apiSlice } from './apiSlice.js';

export const reviewApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProductReviews: builder.query({
      query: (productId) => `/reviews?productId=${productId}`, // Sesuaikan dengan Controller baru
      providesTags: ['Reviews'],
    }),
    createReview: builder.mutation({
      query: ({ productId, reviewData }) => ({
        url: `/reviews`, // Post ke root /reviews
        method: 'POST',
        body: { ...reviewData, product: productId }, // Sertakan productId di body
      }),
      invalidatesTags: ['Reviews', 'Products'],
    }),
  }),
});

export const { useGetProductReviewsQuery, useCreateReviewMutation } = reviewApi;