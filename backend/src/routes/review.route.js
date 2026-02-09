import express from 'express';
import * as reviewController from '../controllers/review.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router({ mergeParams: true });

// URL: /api/v1/reviews/product/:productId
router.route('/product/:productId')
  .get(reviewController.getProductReviews)
  .post(protect, reviewController.createReview);

export default router;
