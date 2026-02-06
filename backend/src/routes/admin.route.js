import express from 'express';
import { validate } from '../middlewares/validation.middleware.js';
import { createProductSchema, updateProductSchema } from '../validators/product.validator.js';
import * as productController from '../controllers/product.controller.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';
import { upload, parseFormDataJSON } from '../middlewares/upload.middleware.js';

const router = express.Router();

// Rute Publik
router.get('/suggestions', productController.getSuggestions);
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);

// Proteksi Admin
router.use(protect, restrictTo('admin'));

router.post(
  '/', 
  upload.array('images', 5), 
  parseFormDataJSON,           // <--- Mengubah string ke Object sebelum divalidasi
  validate(createProductSchema), 
  productController.createProduct
);

router.patch(
  '/:id', 
  upload.array('images', 5), 
  parseFormDataJSON,           // <--- Sama untuk update
  validate(updateProductSchema), 
  productController.updateProduct
);

router.delete('/:id', productController.deleteProduct);

export default router;