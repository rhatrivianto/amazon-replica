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

/**
 * Melakukan pencarian full-text untuk halaman hasil pencarian utama.
 * Menggunakan MongoDB Atlas Search untuk performa dan relevansi tinggi.
 * @param {string} query - Kata kunci pencarian.
 * @param {object} pagination - Opsi pagination (page, limit).
 */
export const getSearchResults = async (query, pagination = {}) => {
  if (!query) {
    return { products: [], totalResults: 0, totalPages: 0, currentPage: 1 };
  }

  const page = parseInt(pagination.page, 10) || 1;
  const limit = parseInt(pagination.limit, 10) || 12;
  const skip = (page - 1) * limit;

  // Tahap 1: Pencarian Full-Text menggunakan Atlas Search
  const searchStage = {
    $search: {
      index: 'default', // Nama Search Index di MongoDB Atlas
      text: {
        query: query,
        path: {
          wildcard: '*' // Cari di semua field yang di-index
        },
        fuzzy: {
          maxEdits: 1, // Toleransi untuk 1 kesalahan ketik
          prefixLength: 2
        }
      }
    }
  };

  // Tahap 2: Proyeksi (memilih field dan menambahkan skor relevansi)
  const projectStage = {
    $project: {
      name: 1,
      slug: 1,
      images: 1,
      price: 1,
      ratingsAverage: 1,
      numReviews: 1,
      stock: 1,
      score: { $meta: "searchScore" } // Ambil skor relevansi dari hasil pencarian
    }
  };

  // Tahap 3: Menghitung total hasil dan data untuk halaman saat ini
  const facetStage = {
    $facet: {
      metadata: [{ $count: "total" }],
      data: [{ $skip: skip }, { $limit: limit }]
    }
  };

  const pipeline = [searchStage, projectStage, facetStage];
  const results = await Product.aggregate(pipeline);

  const products = results[0].data;
  const totalResults = results[0].metadata[0] ? results[0].metadata[0].total : 0;

  return { products, totalResults, totalPages: Math.ceil(totalResults / limit), currentPage: page };
};