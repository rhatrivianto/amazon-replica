import { asyncHandler } from '../utils/asyncHandler.js';
import * as reviewService from '../services/review.service.js';
import AppError from '../utils/AppError.js';

/**
 * @desc    Ambil semua review untuk satu produk
 * @route   GET /api/v1/reviews/product/:productId
 */
export const getProductReviews = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const reviews = await reviewService.getProductReviews(productId);
  
  res.status(200).json({ 
    status: 'success', 
    results: reviews.length, 
    data: reviews 
  });
});

/**
 * @desc    Buat review baru
 * @route   POST /api/v1/reviews/product/:productId
 */
export const createReview = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const userId = req.user._id;

  // Gabungkan data dari body dan params
  const reviewData = {
    ...req.body,
    product: productId,
    user: userId
  };

  try {
    const newReview = await reviewService.createReview(reviewData);
    res.status(201).json({ status: 'success', data: newReview });
  } catch (error) {
    // Tangani error duplikat (User sudah review sebelumnya)
    if (error.code === 11000) {
      return next(new AppError('You have already reviewed this product.', 400));
    }
    next(error);
  }
});
