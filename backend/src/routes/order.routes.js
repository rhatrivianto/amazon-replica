import express from 'express';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';
import * as orderController from '../controllers/order.controller.js';

const router = express.Router();

// Public webhook from Stripe. It needs the raw body for signature verification.
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  orderController.stripeWebhook
);

// --- User-specific routes (must be logged in) ---
router.use(protect);

router.post('/checkout-session', orderController.createCheckoutSession);
router.post('/verify-payment', orderController.verifyPaymentSession);

// FIX: Kembalikan route '/' ke getMyOrders agar kompatibel dengan Frontend User
router.get('/', orderController.getMyOrders);

// --- Admin-specific routes ---
router.get('/admin/all-orders', restrictTo('admin'), orderController.getAllOrders);
router.patch('/:id/status', restrictTo('admin'), orderController.updateOrderStatus);

router.get('/:id', orderController.getOrderById);
export default router;