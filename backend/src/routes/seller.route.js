// backend/src/routes/seller.route.js
import express from 'express';
import * as sellerController from '../controllers/seller.controller.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';
import { parseProductData } from '../middlewares/parseFormData.js'; // Import middleware baru
// import { upload } from '../middlewares/upload.middleware.js'; // Pastikan multer di-import jika ada

const router = express.Router();

// Semua rute di sini wajib Login dan harus memiliki role 'seller' atau 'admin'
router.use(protect);
router.use(restrictTo('seller', 'admin'));

router.get('/inventory', sellerController.getMyInventory);

/**
 * PROSES:
 * 1. upload.array('images') -> Menangkap file gambar & field body (masih string)
 * 2. parseProductData -> Mengubah string JSON (shippingInfo, dll) menjadi Object asli
 * 3. createSellerProduct -> Controller menerima data yang sudah "bersih"
 */
router.post(
  '/products', 
  // upload.array('images', 5), // Pasang multer di sini jika Anda menangani upload gambar
  parseProductData, 
  sellerController.createSellerProduct
);

router.patch(
  '/products/:id', 
  // upload.array('images', 5), 
  parseProductData, 
  sellerController.updateSellerProduct
);

router.delete('/products/:id', sellerController.deleteSellerProduct);

export default router;