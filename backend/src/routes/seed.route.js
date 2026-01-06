import express from 'express';
import { seedProducts, resetDatabase } from '../controllers/seed.controller.js';

const router = express.Router();

// Endpoint untuk memicu seeding: GET /api/v1/seed/products
router.get('/products', seedProducts);

// Endpoint untuk mereset database: DELETE /api/v1/seed/reset
router.delete('/reset', resetDatabase);

export default router;