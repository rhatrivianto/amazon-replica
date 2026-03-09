import * as addressService from '../services/address.service.js';
import AppError from '../utils/AppError.js';

// 1. Tambah Alamat Baru
export const addAddress = async (req, res, next) => {
  try {
    const address = await addressService.addAddress(req.user.id, req.body);
    res.status(201).json({ status: 'success', data: address });
  } catch (error) {
    next(error);
  }
};

// 2. Ambil Semua Alamat User
export const getMyAddresses = async (req, res, next) => {
  try {
    const addresses = await addressService.getAddressesByUserId(req.user.id);
    res.status(200).json({
      status: 'success',
      results: addresses.length,
      data: addresses
    });
  } catch (error) {
    next(error);
  }
};

// 3. Update Alamat
export const updateAddress = async (req, res, next) => {
  try {
    const address = await addressService.updateAddress(req.user.id, req.params.id, req.body);
    if (!address) {
      return next(new AppError('Address not found or not authorized', 404));
    }
    res.status(200).json({ status: 'success', data: address });
  } catch (error) {
    next(error);
  }
};

// 4. Hapus Alamat
export const deleteAddress = async (req, res, next) => {
  try {
    const address = await addressService.deleteAddress(req.user.id, req.params.id);
    if (!address) {
      return next(new AppError('Address not found or not authorized', 404));
    }
    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    next(error);
  }
};