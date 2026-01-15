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
  // Logic ASIN & Slug otomatis diproses di service
  const newProduct = await sellerService.createProduct(req.body, req.user.id);

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