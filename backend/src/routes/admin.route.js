import express from 'express';
import { validate } from '../middlewares/validation.middleware.js';
import { createProductSchema, updateProductSchema } from '../validators/product.validator.js';
import * as productController from '../controllers/product.controller.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';
import { upload, parseFormDataJSON } from '../middlewares/upload.middleware.js';

const router = express.Router();

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