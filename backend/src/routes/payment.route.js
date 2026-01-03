import express from 'express';
import * as paymentController from '../controllers/payment.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Endpoint untuk Frontend mendapatkan URL bayar
router.get('/checkout-session/:orderId', protect, paymentController.getCheckoutSession);

// Endpoint Webhook (Tanpa 'protect' karena dipanggil oleh server Stripe)
router.post('/webhook', express.raw({ type: 'application/json' }), paymentController.stripeWebhook);

export default router;