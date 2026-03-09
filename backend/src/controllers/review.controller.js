import Review from '../models/review.model.js';
import AppError from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// 1. Ambil Semua Review (Bisa difilter by Product ID)
export const getAllReviews = asyncHandler(async (req, res, next) => {
  let filter = {};
  if (req.query.productId) filter = { product: req.query.productId };

  const reviews = await Review.find(filter).populate('user', 'name avatar').sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: reviews
  });
});

// 2. Buat Review Baru
export const createReview = asyncHandler(async (req, res, next) => {
  // Set user and product from params/logged-in user
  req.body.user = req.user.id;
  if (req.params.productId) req.body.product = req.params.productId;

  const newReview = await Review.create(req.body);

  res.status(201).json({
    status: 'success',
    data: newReview
  });
});

// 3. Update Review
export const updateReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError('No review found with that ID', 404));
  }

  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('You are not authorized to update this review', 403));
  }

  review.review = req.body.review || review.review;
  review.rating = req.body.rating || review.rating;
  
  await review.save();
  
  res.status(200).json({ status: 'success', data: review });
});

// 4. Delete Review
export const deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError('No review found with that ID', 404));
  }

  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('You are not authorized to delete this review', 403));
  }

  await review.remove(); // .remove() will trigger the 'post' middleware in the model

  res.status(204).json({ status: 'success', data: null });
});