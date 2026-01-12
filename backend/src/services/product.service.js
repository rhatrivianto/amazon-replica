// 2. Buat Produk Baru
import Product from '../models/product.model.js';
import AppError from '../utils/AppError.js';
import { deleteFromCloudinary } from '../services/upload.service.js';
import slugify from 'slugify';
import { nanoid } from 'nanoid'; // Opsional: untuk generate ASIN jika tidak diinput manual

// 1. Ambil Semua Produk (Logic Search & Filter Amazon)
export const getAllProducts = async (filters) => {
  const { search, category, sort, minPrice, maxPrice, page, limit, seller } = filters;
  let queryObj = {};

  // Amazon Search Style: Menggunakan text search jika ada, atau regex
  if (search) {
    queryObj.$text = { $search: search }; // Menggunakan Index Text yang Anda buat di Schema
  }

  if (category && category !== 'all') queryObj.category = category;
  
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


export const createProduct = async (productData) => {
  // 1. Generate SEO Friendly Slug
  if (productData.name) {
    productData.slug = slugify(productData.name, { lower: true, strict: true });
  }

  // 2. AMAZON LOGIC: Generate ASIN otomatis jika admin tidak mengisi
  // ASIN biasanya 10 karakter alfanumerik uppercase
  if (!productData.asin) {
    productData.asin = nanoid(10).toUpperCase();
  }

  return await Product.create(productData);
};

export const updateProduct = async (id, updateData) => {
  const oldProduct = await Product.findById(id);
  if (!oldProduct) throw new AppError('Produk tidak ditemukan', 404);

  if (updateData.name) {
    updateData.slug = slugify(updateData.name, { lower: true, strict: true });
  }

  // Gunakan runValidators agar schema baru tetap tervalidasi saat update
  const product = await Product.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true
  });

  // Cleanup Cloudinary (Tetap seperti logika Anda)
  if (updateData.images && updateData.images.length > 0) {
    for (const imgUrl of oldProduct.images) {
      // Pastikan service ini mengekstrak public_id dari URL
      await deleteFromCloudinary(imgUrl); 
    }
  }

  return product;
};

// 4. Hapus Produk (Full Cleanup)
export const deleteProduct = async (id) => {
  const product = await Product.findById(id);
  if (!product) throw new AppError('Produk tidak ditemukan!', 404);

  // Amazon Philosophy: Jangan tinggalkan sampah gambar di Cloud
  for (const imgId of product.images) {
    await deleteFromCloudinary(imgId);
  }

  await Product.findByIdAndDelete(id);
  return true;
};