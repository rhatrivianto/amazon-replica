import express from 'express';
import {
  getSellerContents,
  createSellerContent,
  updateSellerContent,
  deleteSellerContent
} from '../controllers/sellerContent.controller.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js'; // Asumsi middleware auth ada di sini

const router = express.Router();

router.route('/')
  .get(getSellerContents)
  .post(protect, restrictTo('admin'), createSellerContent);

router.route('/:id')
  .patch(protect, restrictTo('admin'), updateSellerContent)
  .delete(protect, restrictTo('admin'), deleteSellerContent);

export default router;
