import express from 'express';
import { getBrands, updateBrand, createBrand, deleteBrand } from '../controllers/brand.controller.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public: Siapa saja bisa melihat brand (untuk filter di halaman depan)
router.route('/').get(getBrands);

// Protected: Hanya Admin yang bisa menambah dan menghapus brand
router.use(protect);
router.use(restrictTo('admin'));

router.route('/').post(createBrand);
router.route('/:id').delete(deleteBrand);
router.route('/:id').patch(updateBrand); // Tambahkan route delete dengan ID

export default router;