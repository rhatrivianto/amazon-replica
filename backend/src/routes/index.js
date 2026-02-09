// backend/routes/index.js
import express from 'express';
import authRoutes from './auth.route.js'; // Pastikan path ini benar
import adminRoute from './admin.route.js'; // Import Admin Route
import sellerRoute from './seller.route.js'; // Import Seller Route
import productRoute from './product.route.js';
import categoryRoute from "./category.route.js";
import cartRoute from './cart.route.js';
import orderRoute from './order.route.js';
import paymentRoute from './payment.route.js';
import brandRoute from './brand.route.js';
import reviewRoutes from './review.route.js'; // Import Review Routes
import SearchRoutes from './search.route.js'; 

const router = express.Router();

// Daftarkan rute auth dengan prefix /auth
router.use('/auth', authRoutes); 
router.use('/admin', adminRoute);   // Daftarkan /api/v1/admin
router.use('/seller', sellerRoute); // Daftarkan /api/v1/seller
router.use('/products', productRoute);
router.use('/categories', categoryRoute);
router.use('/cart', cartRoute);
router.use('/orders', orderRoute);
router.use('/reviews', reviewRoutes); // Daftarkan /api/v1/reviews
router.use('/search', SearchRoutes);
router.use('/payments', paymentRoute);
router.use('/brands', brandRoute);
router.get('/', (req, res) => res.json({ message: "Welcome to Amazon API V1" }));


export default router;
