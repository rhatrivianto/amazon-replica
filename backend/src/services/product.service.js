// 2. Buat Produk Baru
import Product from '../models/product.model.js';
import mongoose from 'mongoose';
import AppError from '../utils/AppError.js';
import { deleteFromCloudinary } from '../services/upload.service.js';
import slugify from 'slugify';
import { nanoid } from 'nanoid'; // Opsional: untuk generate ASIN jika tidak diinput manual

// 1. Ambil Semua Produk (Logic Search & Filter Amazon)
// backend/src/services/product.service.js

export const getAllProducts = async (filters) => {
  const { search, category, sort, minPrice, maxPrice, page, limit, seller } = filters;
  
  // 1. Build Match Stage (Filter Dasar)
  const matchStage = { isDeleted: { $ne: true } };

  if (search) {
    matchStage.$or = [
      { name: { $regex: search, $options: 'i' } },
      { tags: { $regex: search, $options: 'i' } }
    ];
  }

  if (category) {
    // category sudah berupa object { $in: [...] } dari controller
    matchStage.category = category;
  }
  
  if (seller) {
    matchStage.seller = new mongoose.Types.ObjectId(seller);
  }

  // FIX: Pastikan minPrice/maxPrice adalah angka valid sebelum membuat filter
  const hasMinPrice = minPrice !== undefined && !isNaN(minPrice);
  const hasMaxPrice = maxPrice !== undefined && !isNaN(maxPrice);

  if (hasMinPrice || hasMaxPrice) {
    matchStage.price = {};
    if (hasMinPrice) matchStage.price.$gte = Number(minPrice);
    if (hasMaxPrice) matchStage.price.$lte = Number(maxPrice);
  }

  const skip = (page - 1) * limit;
  
  // 2. Build Sort Stage
  let sortStage = { createdAt: -1 };
  if (sort) {
    if (sort === 'price-asc') sortStage = { price: 1 };
    else if (sort === 'price-desc') sortStage = { price: -1 };
    else if (sort === 'rating') sortStage = { ratingsAverage: -1 };
  }

  // 3. Aggregation Pipeline (Magic Happens Here ✨)
  const pipeline = [
    { $match: matchStage },
    {
      $facet: {
        // A. Data Produk (Paginated)
        products: [
          { $sort: sortStage },
          { $skip: skip },
          { $limit: Number(limit) },
          // Populate Category & Brand manual karena ini aggregate
          { $lookup: { from: 'categories', localField: 'category', foreignField: '_id', as: 'category' } },
          { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
          { $lookup: { from: 'brands', localField: 'brand', foreignField: '_id', as: 'brand' } },
          { $unwind: { path: '$brand', preserveNullAndEmptyArrays: true } },
        ],
        // B. Total Count
        totalCount: [{ $count: 'count' }],
        // C. Facets: Brands yang tersedia di hasil pencarian ini
        brands: [
          { $group: { _id: '$brand', count: { $sum: 1 } } },
          { $lookup: { from: 'brands', localField: '_id', foreignField: '_id', as: 'brandInfo' } },
          { $unwind: { path: '$brandInfo', preserveNullAndEmptyArrays: true } },
          { $project: { _id: 1, name: '$brandInfo.name', count: 1 } }
        ],
        // D. Facets: Spesifikasi Dinamis (RAM, Color, dll)
        specs: [
          { $unwind: '$specifications' },
          { $group: { _id: { key: '$specifications.key', value: '$specifications.value' }, count: { $sum: 1 } } },
          { $group: { _id: '$_id.key', options: { $push: { value: '$_id.value', count: '$count' } } } },
          { $sort: { _id: 1 } }
        ]
      }
    }
  ];

  const results = await Product.aggregate(pipeline);
  const result = results[0];

  const products = result.products;
  const total = result.totalCount[0]?.count || 0;
  const facets = { brands: result.brands, specs: result.specs };

  return { products, total, totalPages: Math.ceil(total / limit), facets };
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