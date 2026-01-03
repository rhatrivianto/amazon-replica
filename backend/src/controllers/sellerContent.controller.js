import SellerContent from '../models/sellerContent.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import AppError from '../utils/AppError.js';

// @desc    Get all seller contents (Public)
// @route   GET /api/v1/seller-contents
export const getSellerContents = asyncHandler(async (req, res, next) => {
  const contents = await SellerContent.find().sort({ order: 1 });

  res.status(200).json({
    status: 'success',
    results: contents.length,
    data: contents
  });
});

// @desc    Create new content (Admin only)
// @route   POST /api/v1/seller-contents
export const createSellerContent = asyncHandler(async (req, res, next) => {
  const newContent = await SellerContent.create(req.body);

  res.status(201).json({
    status: 'success',
    data: newContent
  });
});

// @desc    Update content (Admin only)
// @route   PATCH /api/v1/seller-contents/:id
export const updateSellerContent = asyncHandler(async (req, res, next) => {
  const content = await SellerContent.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!content) {
    return next(new AppError('Content not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: content
  });
});

// @desc    Delete content (Admin only)
// @route   DELETE /api/v1/seller-contents/:id
export const deleteSellerContent = asyncHandler(async (req, res, next) => {
  const content = await SellerContent.findByIdAndDelete(req.params.id);

  if (!content) {
    return next(new AppError('Content not found', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});
