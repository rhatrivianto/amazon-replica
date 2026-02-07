import * as brandService from '../services/brand.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import AppError from '../utils/AppError.js';

export const getBrands = asyncHandler(async (req, res) => {
    const brands = await brandService.getAllBrands();
    res.json({ status: 'success', data: brands });
});

export const createBrand = asyncHandler(async (req, res) => {
    const brand = await brandService.createBrand(req.body);
    res.status(201).json({ status: 'success', data: brand });
});

export const deleteBrand = asyncHandler(async (req, res, next) => {
    const brand = await brandService.deleteBrandById(req.params.id);

    if (!brand) {
        return next(new AppError('No brand found with that ID', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
});

export const updateBrand = asyncHandler(async (req, res, next) => {
    const brand = await brandService.updateBrandById(req.params.id, req.body);

    if (!brand) {
        return next(new AppError('No brand found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: brand
    });
});