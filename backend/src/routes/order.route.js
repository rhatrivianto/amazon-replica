import express from 'express';
import * as orderController from '../controllers/order.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();
// Webhook harus bisa diakses oleh Stripe tanpa token kita (Stripe punya secret sendiri)
// Letakkan di paling atas
// WAJIB: Gunakan express.raw() agar signature verification berhasil
router.post('/webhook', express.raw({ type: 'application/json' }), orderController.stripeWebhook);

// Rute di bawah ini wajib Login
router.use(protect);
router.post('/checkout', orderController.checkout);
router.get('/my-orders', orderController.getOrders);
export default router;