import mongoose from 'mongoose';
import cloudinary  from '../config/cloudinary.js'; // Pastikan config sudah benar
import streamifier from 'streamifier'; // Library kecil untuk stream buffer ke cloud
import * as productService from '../services/product.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import Category from '../models/category.model.js';
import Product from '../models/product.model.js'; // FIX: Import Model Product
import slugify from 'slugify'; // Import slugify untuk generate URL produk
import AppError from '../utils/AppError.js'; // Import AppError untuk handle 404


// --- HELPER: Get Category ID + All Descendant IDs ---
const getCategoryWithDescendants = async (identifier) => {
  // 1. Find the root category (by ID, Slug, or Name)
  const query = mongoose.isValidObjectId(identifier) 
? { _id: identifier } 
  : { $or: [{ slug: identifier }, { name: { $regex: `^${identifier}$`, $options: 'i' } }] };

  const rootCategory = await Category.findOne(query);
  if (!rootCategory) return null;

  // 2. Recursive function to find all children
  const getChildrenIds = async (parentId) => {
    const children = await Category.find({ parent: parentId });
    let ids = children.map(c => c._id);
    
    for (const child of children) {
      const grandChildrenIds = await getChildrenIds(child._id);
      ids = [...ids, ...grandChildrenIds];
    }
    return ids;
  };

  const allIds = await getChildrenIds(rootCategory._id);
  return [rootCategory._id, ...allIds]; // Return Root + Children
};

/**
 * @desc    Ambil semua produk dengan filter (Pencarian, Kategori, Harga, Urutan)
 */
export const getProducts = asyncHandler(async (req, res) => {
  let { q, category, sortBy, minPrice, maxPrice, page = 1, limit = 12, seller } = req.query;

  // FIX: If category is selected, include all its sub-categories in the query
  if (category) {
    const categoryIds = await getCategoryWithDescendants(category);
    if (categoryIds) {
      // MongoDB query: Find products where category is IN this list of IDs
      category = { $in: categoryIds };
    }
  }

  const result = await productService.getAllProducts({
    search: q,
    category,
    sort: sortBy,
    minPrice: Number(minPrice),
    maxPrice: Number(maxPrice),
    page: Number(page),
    limit: Number(limit),
    seller // Tambahkan filter seller
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

export const getSuggestions = asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q) return res.json({ status: 'success', data: [] });

  // Panggil dari service
  const suggestions = await productService.getSuggestions(q);

  res.status(200).json({ 
    status: 'success', 
    data: suggestions 
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

// Di Backend (Product Controller)
export const createProduct = async (req, res, next) => {
    try {
        // --- FIX: Upload Images ke Cloudinary sebelum simpan ke DB ---
        // Jika tidak ada ini, yang tersimpan hanya nama file (misal: "gambar.jpg") bukan URL Cloudinary
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

        // Trik Amazon: Parse kembali string JSON dari FormData
        if (typeof req.body.shippingInfo === 'string') {
            req.body.shippingInfo = JSON.parse(req.body.shippingInfo);
        }
        if (typeof req.body.specifications === 'string') {
            req.body.specifications = JSON.parse(req.body.specifications);
        }
        if (typeof req.body.bulletPoints === 'string') {
            req.body.bulletPoints = JSON.parse(req.body.bulletPoints);
        }

        // --- FIX: Generate Slug Otomatis dari Nama Produk ---
        if (req.body.name) {
            req.body.slug = slugify(req.body.name, { lower: true, strict: true });
        }
        
        // --- FIX: Hapus field unik jika string kosong ("") agar tidak error duplikat ---
        // MongoDB menganggap "" sebagai nilai unik. Kita harus menghapusnya agar dianggap null/missing.
        if (req.body.asin === "") delete req.body.asin;
        if (req.body.modelNumber === "") delete req.body.modelNumber;

        console.log("📦 [Create Product] Final Data:", { name: req.body.name, slug: req.body.slug, asin: req.body.asin });

        // Lanjutkan ke validasi dan penyimpanan...
        const newProduct = await Product.create(req.body);
        res.status(201).json({ success: true, data: newProduct });
    } catch (error) {
        // Gunakan next(error) agar ditangani oleh globalErrorHandler (termasuk error Duplicate Key E11000)
        next(error);
    }
};
export const updateProduct = asyncHandler(async (req, res, next) => {
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

  // --- FIX: Update Slug jika Nama Produk berubah ---
  if (req.body.name) {
    req.body.slug = slugify(req.body.name, { lower: true, strict: true });
  }
  
  // --- FIX: Hapus field unik jika string kosong saat update ---
  if (req.body.asin === "") delete req.body.asin;
  if (req.body.modelNumber === "") delete req.body.modelNumber;

  // --- FIX: Update langsung via Model (Bypass Service) agar logika slug & unique field jalan ---
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!product) {
    return next(new AppError('No product found with that ID', 404));
  }

  res.status(200).json({ status: 'success', data: product });
});
/**
 * @desc    Admin: Hapus produk
 */
export const deleteProduct = asyncHandler(async (req, res) => {
  await productService.deleteProduct(req.params.id);
  res.status(204).json({ status: 'success', data: null });
});