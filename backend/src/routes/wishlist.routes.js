import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import {
  getMyWishlist,
  addProductToWishlist,
  removeProductFromWishlist,
} from '../controllers/wishlist.controller.js';

const router = express.Router();

// Semua rute wishlist dilindungi, hanya user login yang bisa akses
router.use(protect);

router.route('/').get(getMyWishlist).post(addProductToWishlist);

router.route('/:productId').delete(removeProductFromWishlist);

export default router;