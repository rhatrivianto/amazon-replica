import Review from '../models/review.model.js';
import Product from '../models/product.model.js';

export const createReview = async (reviewData) => {
  const review = await Review.create(reviewData);
  
  // Skala Amazon: Update rating rata-rata produk secara asinkron atau atomic
  // (Idealnya menggunakan MongoDB Aggregation pipeline atau update field di Product)
  return review;
};

export const getProductReviews = async (productId) => {
  return await Review.find({ product: productId })
    .populate('user', 'name')
    .sort({ createdAt: -1 })
    .lean();
};