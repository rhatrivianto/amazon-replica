// backend/routes/index.js
import express from 'express';
import authRoutes from './auth.route.js'; // Pastikan path ini benar
import productRoute from './product.route.js';
import categoryRoute from "./category.route.js";
import cartRoute from './cart.route.js';
import orderRoute from './order.route.js';
import paymentRoute from './payment.route.js';
import brandRoute from './brand.route.js';

const router = express.Router();

// Daftarkan rute auth dengan prefix /auth
router.use('/auth', authRoutes); 
router.use('/products', productRoute);
router.use('/categories', categoryRoute);
router.use('/cart', cartRoute);
router.use('/orders', orderRoute);
router.use('/payments', paymentRoute);
router.use('/brands', brandRoute);



export default router;



