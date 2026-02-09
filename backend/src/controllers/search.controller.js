import { asyncHandler } from '../utils/asyncHandler.js';
import * as searchService from '../services/search.service.js';

/**
 * @desc    Get search suggestions (Autocomplete)
 * @route   GET /api/v1/search/suggestions?q=keyword
 */
export const getSuggestions = asyncHandler(async (req, res) => {
  const { q } = req.query;
  const suggestions = await searchService.getSuggestions(q);

  res.status(200).json({
    status: 'success',
    results: suggestions.length,
    data: suggestions
  });
});