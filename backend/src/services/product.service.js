// 2. Buat Produk Baru
import Product from '../models/product.model.js';
import AppError from '../utils/AppError.js';
import { deleteFromCloudinary } from '../services/upload.service.js';
import slugify from 'slugify';
import { nanoid } from 'nanoid'; // Opsional: untuk generate ASIN jika tidak diinput manual

// 1. Ambil Semua Produk (Logic Search & Filter Amazon)
// backend/src/services/product.service.js

export const getAllProducts = async (filters) => {
  const { search, category, sort, minPrice, maxPrice, page, limit, seller } = filters;
  
  let queryObj = { isDeleted: { $ne: true } };

  // PERBAIKAN: Gunakan Regex agar pencarian lebih fleksibel
  if (search) {
    queryObj.$or = [
      { name: { $regex: search, $options: 'i' } },
      { tags: { $regex: search, $options: 'i' } }
    ];
  }

  // Perbaikan typo: baris 'if (seller) queryObj.seller = seller; category;' di kode Anda
  if (category) queryObj.category = category;
  if (seller) queryObj.seller = seller;

  if (!isNaN(minPrice) || !isNaN(maxPrice)) {
    queryObj.price = {};
    if (!isNaN(minPrice)) queryObj.price.$gte = minPrice;
    if (!isNaN(maxPrice)) queryObj.price.$lte = maxPrice;
  }

  const skip = (page - 1) * limit;
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
  if (!product) throw new AppError('Product not found', 404);
  return product;
};

export const getSuggestions = async (searchTerm) => {
  return await Product.find({ 
    name: { $regex: searchTerm, $options: 'i' },
    isDeleted: { $ne: true }
  })
  .select('name') 
  .limit(8)
  .lean(); // .lean() untuk performa lebih cepat
};