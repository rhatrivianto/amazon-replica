import express from 'express';
import * as cartController from '../controllers/cart.controller.js';
import { protect } from '../middlewares/auth.middleware.js'; // Pastikan Anda punya ini

const router = express.Router();

// Semua rute cart wajib login
router.use(protect);

router.route('/')
  .get(cartController.getMyCart)      // GET /api/v1/cart
  .post(cartController.addItem);      // POST /api/v1/cart

router.patch('/update-quantity', cartController.updateItemQuantity); 
router.delete('/:productId', cartController.removeItem);

export default router;