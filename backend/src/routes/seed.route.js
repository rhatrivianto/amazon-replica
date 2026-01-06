import express from 'express';
import { seedProducts } from '../controllers/seed.controller.js';

const router = express.Router();

// Endpoint untuk memicu seeding: GET /api/v1/seed/products
router.get('/products', seedProducts);

export default router;