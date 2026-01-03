import express from 'express';
const router = express.Router();
import { getBrands, createBrand } from '../controllers/brand.controller.js';

router.route('/').get(getBrands).post(createBrand);
export default router;