import express from 'express';
import * as orderController from '../controllers/order.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Rute di bawah ini wajib Login
router.use(protect);
router.post('/checkout', orderController.checkout);
router.get('/my-orders', orderController.getOrders);
router.post('/verify-payment', orderController.verifyPayment);
export default router;