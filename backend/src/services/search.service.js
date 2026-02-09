import Product from '../models/product.model.js';

/**
 * Mencari saran produk (Autocomplete) berdasarkan kata kunci
 * @param {string} query - Kata kunci pencarian
 */
export const getSuggestions = async (query) => {
  if (!query) return [];

  // Cari produk yang namanya mengandung query (case-insensitive)
  // Limit 10 agar respon cepat & ringan
  const suggestions = await Product.find({
    name: { $regex: query, $options: 'i' }
  })
  .select('name slug images price category') // Ambil field penting saja
  .limit(10)
  .lean();

  return suggestions;
};