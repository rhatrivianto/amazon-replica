import express from 'express';
import * as sellerController from '../controllers/seller.controller.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';
import { upload, parseFormDataJSON } from '../middlewares/upload.middleware.js';

const router = express.Router();

router.use(protect);
router.use(restrictTo('seller', 'admin'));

router.get('/inventory', sellerController.getMyInventory);

router.post(
  '/products', 
  upload.array('images', 5), 
  parseFormDataJSON, 
  sellerController.createSellerProduct
);

router.patch(
  '/products/:id', 
  upload.array('images', 5), 
  parseFormDataJSON, 
  sellerController.updateSellerProduct
);

router.delete('/products/:id', sellerController.deleteSellerProduct);

export default router;