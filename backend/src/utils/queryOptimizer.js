// Kita ganti importnya agar menggunakan constant yang sudah kita buat
import { PAGINATION } from '../config/constants.js';

export const optimizeProductQuery = (filters = {}) => {
  const safeFilters = {};
  const allowedFilters = ['category', 'brand', 'price', 'status', 'isFeatured'];
  
  Object.keys(filters).forEach(key => {
    if (allowedFilters.includes(key)) {
      safeFilters[key] = filters[key];
    }
  });
  
  return {
    ...safeFilters,
    limit: Math.min(filters.limit || PAGINATION.DEFAULT_LIMIT, 50) // Maksimal 50 item sekali tarik
  };
};