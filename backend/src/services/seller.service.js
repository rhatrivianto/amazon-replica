import Product from '../models/product.model.js';
import AppError from '../utils/AppError.js';
import { deleteFromCloudinary } from '../services/upload.service.js';
import slugify from 'slugify';
import { nanoid } from 'nanoid';

/**
 * 1. Ambil Inventori Penjual (Dashboard Seller)
 * Fungsi ini menangani pencarian dan filter di dalam dashboard penjual sendiri
 */
export const getMyInventory = async (sellerId, filters = {}) => {
  const { search, page = 1, limit = 10 } = filters;
  const skip = (page - 1) * limit;

  // Filter dasar: Harus milik seller ini dan tidak dihapus (soft delete)
  let queryObj = { seller: sellerId, isDeleted: { $ne: true } };

  // Jika seller mencari barang di inventorinya sendiri
  if (search) {
    queryObj.name = { $regex: search, $options: 'i' };
  }

  const products = await Product.find(queryObj)
    .sort('-createdAt')
    .skip(skip)
    .limit(limit)
    .populate('category', 'name');

  const total = await Product.countDocuments(queryObj);

  return { products, total, totalPages: Math.ceil(total / limit) };
};

/**
 * 2. Create Product (Amazon Style)
 */
export const createProduct = async (productData, sellerId) => {
  // SEO Friendly Slug
  if (productData.name) {
    productData.slug = slugify(productData.name, { lower: true, strict: true });
  }

  // Generate ASIN otomatis (10 chars uppercase)
  if (!productData.asin) {
    productData.asin = nanoid(10).toUpperCase();
  }

  // Pastikan ID penjual disematkan
  productData.seller = sellerId;

  return await Product.create(productData);
};

/**
 * 3. Update Product (Ownership Secured)
 */
export const updateProduct = async (productId, updateData, sellerId, requesterRole) => {
  const product = await Product.findById(productId);
  if (!product) throw new AppError('Produk tidak ditemukan', 404);

  // SECURITY: Jika bukan Admin, pastikan dia pemilik produknya
  if (requesterRole !== 'admin' && product.seller.toString() !== sellerId.toString()) {
    throw new AppError('Akses ditolak: Ini bukan produk Anda', 403);
  }

  // Update Slug jika nama berubah
  if (updateData.name) {
    updateData.slug = slugify(updateData.name, { lower: true, strict: true });
  }

  // Cleanup Cloudinary jika ada gambar baru yang dikirim
  if (updateData.images && updateData.images.length > 0) {
    for (const imgUrl of product.images) {
      await deleteFromCloudinary(imgUrl);
    }
  }

  return await Product.findByIdAndUpdate(productId, updateData, {
    new: true,
    runValidators: true
  });
};

/**
 * 4. Delete Product (Cleanup images)
 */
export const deleteProduct = async (productId, sellerId, requesterRole) => {
  const product = await Product.findById(productId);
  if (!product) throw new AppError('Produk tidak ditemukan', 404);

  // SECURITY: Cek kepemilikan
  if (requesterRole !== 'admin' && product.seller.toString() !== sellerId.toString()) {
    throw new AppError('Akses ditolak: Tidak bisa menghapus produk orang lain', 403);
  }

  // Hapus semua gambar dari Cloudinary agar tidak jadi sampah
  if (product.images && product.images.length > 0) {
    for (const imgUrl of product.images) {
      await deleteFromCloudinary(imgUrl);
    }
  }

  await Product.findByIdAndDelete(productId);
  return true;
};