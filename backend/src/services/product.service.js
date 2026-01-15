// 2. Buat Produk Baru
import Product from '../models/product.model.js';
import AppError from '../utils/AppError.js';
import { deleteFromCloudinary } from '../services/upload.service.js';
import slugify from 'slugify';
import { nanoid } from 'nanoid'; // Opsional: untuk generate ASIN jika tidak diinput manual

// 1. Ambil Semua Produk (Logic Search & Filter Amazon)
export const getAllProducts = async (filters) => {
  const { search, category, sort, minPrice, maxPrice, page, limit, seller } = filters;
  
  // PENEMPATAN LOGIKA AKTIF:
  // Secara default, query hanya mengambil yang statusnya active (jika Anda punya field status)
  // Atau setidaknya filter yang stoknya > 0 jika ingin gaya Amazon yang ketat.
  let queryObj = { isDeleted: { $ne: true } }; // Contoh: Jangan ambil yang sudah dihapus

  if (search) {
    queryObj.$text = { $search: search };
  }

  if (category && category !== 'all') queryObj.category = category;
  
  // Jika ini dipanggil oleh User Publik, jangan biarkan mereka melihat produk draft
  // Tambahkan baris ini:
  // queryObj.status = 'published'; 

  if (seller) queryObj.seller = seller; category;
  
  // Filter by Seller (Untuk Inventory Dashboard)
  if (seller) queryObj.seller = seller;

  if (!isNaN(minPrice) || !isNaN(maxPrice)) {
    queryObj.price = {};
    if (!isNaN(minPrice)) queryObj.price.$gte = minPrice;
    if (!isNaN(maxPrice)) queryObj.price.$lte = maxPrice;
  }

  const skip = (page - 1) * limit;
  
  // Amazon Sort Style: Default terbaru
  const sortBy = sort || '-createdAt';

  const products = await Product.find(queryObj)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .populate('category', 'name');

  const total = await Product.countDocuments(queryObj);

  return { products, total, totalPages: Math.ceil(total / limit) };
};

export const getProductById = async (id) => {
  const product = await Product.findById(id).populate('category', 'name');
  if (!product) throw new AppError('Produk tidak ditemukan', 404);
  return product;
};

