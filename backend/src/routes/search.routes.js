import express from 'express';
import * as searchController from '../controllers/search.controller.js';

const router = express.Router();

// Endpoint: /api/v1/search/suggestions?q=...
router.get('/suggestions', searchController.getSuggestions);

export default router;