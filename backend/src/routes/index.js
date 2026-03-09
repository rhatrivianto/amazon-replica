// backend/routes/index.js
import express from 'express';
import authRoutes from './auth.routes.js'; // Pastikan path ini benar
import adminRoute from './admin.routes.js'; // Import Admin Route
import sellerRoute from './seller.routes.js'; // Import Seller Route
import productRoute from './product.routes.js';
import categoryRoute from "./category.routes.js";
import cartRoute from './cart.routes.js';
import orderRoute from './order.routes.js';
import paymentRoute from './payment.routes.js';
import brandRoute from './brand.routes.js';
import reviewRoutes from './review.routes.js'; // FIX: Gunakan file plural yang baru
import SearchRoutes from './search.routes.js'; 

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
