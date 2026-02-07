import express from 'express';
import { validate } from '../middlewares/validation.middleware.js';
import { createProductSchema, updateProductSchema } from '../validators/product.validator.js';
import * as productController from '../controllers/product.controller.js';
import * as adminController from '../controllers/admin.controller.js'; // Import Admin Controller
import { protect, restrictTo } from '../middlewares/auth.middleware.js';
import { upload, parseFormDataJSON } from '../middlewares/upload.middleware.js';

const router = express.Router();

// 0. ADMIN LOGIN (Public Route)
// Harus diletakkan SEBELUM middleware protect di bawah
router.post('/login', adminController.loginAdmin);

// --- FIX: Dashboard Route ---
// Harus diletakkan SEBELUM rute '/:id' agar "dashboard" tidak dianggap sebagai ID produk
router.get('/dashboard', protect, restrictTo('admin'), adminController.getDashboardStats);

// 1. RUTE TERBUKA (Agar Dashboard Admin bisa loading data produk)
router.get('/suggestions', productController.getSuggestions);
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);

// 2. PROTEKSI (Hanya untuk rute yang MEMODIFIKASI data)
// Jika Login Gagal, pastikan rute login Anda TIDAK ada di file ini.
router.use(protect, restrictTo('admin'));

router.post(
  '/', 
  upload.array('images', 5), 
  parseFormDataJSON, 
  validate(createProductSchema), 
  productController.createProduct
);

router.patch(
  '/:id', 
  upload.array('images', 5), 
  parseFormDataJSON, 
  validate(updateProductSchema), 
  productController.updateProduct
);

router.delete('/:id', productController.deleteProduct);

export default router;