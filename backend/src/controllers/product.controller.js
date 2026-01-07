import cloudinary  from '../config/cloudinary.js'; // Pastikan config sudah benar
import streamifier from 'streamifier'; // Library kecil untuk stream buffer ke cloud
import * as productService from '../services/product.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import Category from '../models/category.model.js';


/**
 * @desc    Ambil semua produk dengan filter (Pencarian, Kategori, Harga, Urutan)
 */
export const getProducts = asyncHandler(async (req, res) => {
  const { q, category, sortBy, minPrice, maxPrice, page = 1, limit = 12 } = req.query;

  const result = await productService.getAllProducts({
    search: q,
    category,
    sort: sortBy,
    minPrice: Number(minPrice),
    maxPrice: Number(maxPrice),
    page: Number(page),
    limit: Number(limit)
  });

  res.status(200).json({ 
    status: 'success', 
    results: result.products.length,
    pagination: { 
      total: result.total, 
      pages: result.totalPages,
      currentPage: Number(page)
    },
    data: result.products 
  });
});

/**
 * @desc    Ambil satu produk berdasarkan ID
 */
export const getProductById = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.id);

  // --- GENERATE BREADCRUMB (Silsilah Kategori) ---
  let breadcrumbs = [];
  if (product && product.category) {
    // Cek apakah category berupa Object (populated) atau ID string
    let currentId = product.category._id || product.category;
    
    let currentCat = await Category.findById(currentId);
    while (currentCat) {
      breadcrumbs.unshift({ 
        name: currentCat.name, 
        slug: currentCat.slug,
        _id: currentCat._id 
      });
      currentCat = currentCat.parent ? await Category.findById(currentCat.parent) : null;
    }
  }

  // Konversi ke object biasa agar bisa menambah field 'breadcrumbs'
  const productData = product && product.toObject ? product.toObject() : product;
  if (productData) productData.breadcrumbs = breadcrumbs;

  res.status(200).json({ status: 'success', data: productData });
});

/**
 * @desc    Admin: Membuat produk baru
 */



const parseJsonFields = (body) => {
  const jsonFields = ['specifications', 'bulletPoints', 'shippingInfo', 'tags'];
  jsonFields.forEach(field => {
    if (typeof body[field] === 'string') {
      try {
        body[field] = JSON.parse(body[field]);
      } catch (e) {
        console.error(`Failed to parse ${field}`);
      }
    }
  });
};

export const createProduct = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ status: 'error', message: 'Images are required' });
  }

  // 1. Parse JSON dari Form-Data
  parseJsonFields(req.body);

  // 2. Parallel Upload to Cloudinary
  const uploadPromises = req.files.map((file) => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'amazon-clone/products' },
        (error, result) => {
          if (result) resolve(result.secure_url);
          else reject(error);
        }
      );
      streamifier.createReadStream(file.buffer).pipe(stream);
    });
  });

  req.body.images = await Promise.all(uploadPromises);

  // 3. Save to DB
  const product = await productService.createProduct(req.body);

  res.status(201).json({ status: 'success', data: product });
});

export const updateProduct = asyncHandler(async (req, res) => {
  parseJsonFields(req.body);

  if (req.files && req.files.length > 0) {
    const uploadPromises = req.files.map((file) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'amazon-clone/products' },
          (error, result) => {
            if (result) resolve(result.secure_url);
            else reject(error);
          }
        );
        streamifier.createReadStream(file.buffer).pipe(stream);
      });
    });
    req.body.images = await Promise.all(uploadPromises);
  }

  const product = await productService.updateProduct(req.params.id, req.body);
  res.status(200).json({ status: 'success', data: product });
});
/**
 * @desc    Admin: Hapus produk
 */
export const deleteProduct = asyncHandler(async (req, res) => {
  await productService.deleteProduct(req.params.id);
  res.status(204).json({ status: 'success', data: null });
});