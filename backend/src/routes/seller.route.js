// backend/src/routes/seller.route.js
import express from 'express';
import * as sellerController from '../controllers/seller.controller.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Semua rute di sini wajib Login dan harus memiliki role 'seller' atau 'admin'
router.use(protect);
router.use(restrictTo('seller', 'admin'));

router.get('/inventory', sellerController.getMyInventory);
router.post('/products', sellerController.createSellerProduct);
router.patch('/products/:id', sellerController.updateSellerProduct);

export default router;