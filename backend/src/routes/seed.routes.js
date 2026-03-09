import express from 'express';
import { seedProducts, resetDatabase, checkBreadcrumbs } from '../controllers/seed.controller.js';

const router = express.Router();

// Endpoint untuk memicu seeding: GET /api/v1/seed/products
router.get('/products', seedProducts);

// Endpoint untuk mereset database: DELETE /api/v1/seed/reset
router.delete('/reset', resetDatabase);

// Endpoint untuk mengecek breadcrumb: GET /api/v1/seed/check-breadcrumbs
router.get('/check-breadcrumbs', checkBreadcrumbs);

export default router;