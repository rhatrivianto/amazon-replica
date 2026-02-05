import * as sellerService from '../services/seller.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getMyInventory = asyncHandler(async (req, res) => {
  // Mendukung query params untuk dashboard yang lebih advanced
  const filters = {
    search: req.query.search,
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 10
  };

  const inventory = await sellerService.getMyInventory(req.user.id, filters);
  
  res.status(200).json({
    status: 'success',
    results: inventory.total,
    pagination: {
      total: inventory.total,
      pages: inventory.totalPages,
      currentPage: filters.page
    },
    data: inventory.products
  });
});
export const createSellerProduct = asyncHandler(async (req, res) => {
  // 1. Salin body
  let productData = { ...req.body };

  // 2. Parse field yang dikirim sebagai JSON string dari FormData
  if (typeof productData.specifications === 'string') {
    productData.specifications = JSON.parse(productData.specifications);
  }
  if (typeof productData.bulletPoints === 'string') {
    productData.bulletPoints = JSON.parse(productData.bulletPoints);
  }
  if (typeof productData.shippingInfo === 'string') {
    productData.shippingInfo = JSON.parse(productData.shippingInfo);
  }

  // 3. Pastikan Tipe Data Angka
  productData.price = Number(productData.price);
  productData.stock = Number(productData.stock);

  // 4. Proses File Gambar (jika menggunakan Cloudinary/Multer)
  if (req.files && req.files.length > 0) {
    productData.images = req.files.map(file => file.path); // Sesuai setup upload Anda
  }

  // 5. Panggil Service
  const newProduct = await sellerService.createProduct(productData, req.user.id);

  res.status(201).json({ 
    status: 'success', 
    data: newProduct 
  });
});

export const updateSellerProduct = asyncHandler(async (req, res) => {
  // Kirim req.user.id dan role untuk validasi kepemilikan
  const updatedProduct = await sellerService.updateProduct(
    req.params.id, 
    req.body, 
    req.user.id, 
    req.user.role
  );

  res.status(200).json({ 
    status: 'success', 
    data: updatedProduct 
  });
});

export const deleteSellerProduct = asyncHandler(async (req, res) => {
  await sellerService.deleteProduct(req.params.id, req.user.id, req.user.role);
  
  res.status(204).json({ 
    status: 'success', 
    data: null 
  });
});