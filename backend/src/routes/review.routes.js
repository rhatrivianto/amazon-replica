import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import { 
  getAllReviews, 
  createReview,
  updateReview,
  deleteReview
} from '../controllers/review.controller.js';

const router = express.Router();

router.route('/')
  .get(getAllReviews)
  .post(protect, createReview); // Hanya user login yang bisa post review

router.route('/:id')
  .patch(protect, updateReview)
  .delete(protect, deleteReview);

export default router;