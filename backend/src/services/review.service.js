import Review from '../models/review.model.js';

export const createReview = async (reviewData) => {
  // Create review (Middleware di Model akan otomatis update rating produk)
  const review = await Review.create(reviewData);
  return review;
};

export const getProductReviews = async (productId) => {
  return await Review.find({ product: productId })
    .populate('user', 'name')
    .sort({ createdAt: -1 })
    .lean();
};