import Address from '../models/address.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// 1. Get My Addresses
export const getMyAddresses = asyncHandler(async (req, res) => {
  const addresses = await Address.find({ user: req.user._id }).sort({ isDefault: -1, createdAt: -1 });
  res.status(200).json({ status: 'success', data: addresses });
});

// 2. Add New Address
export const addAddress = asyncHandler(async (req, res) => {
  // Jika alamat baru diset default, hilangkan default dari alamat lain
  if (req.body.isDefault) {
    await Address.updateMany({ user: req.user._id }, { isDefault: false });
  }
  
  // Jika ini alamat pertama user, otomatis jadikan default
  const count = await Address.countDocuments({ user: req.user._id });
  if (count === 0) req.body.isDefault = true;

  const address = await Address.create({ ...req.body, user: req.user._id });
  res.status(201).json({ status: 'success', data: address });
});

// 3. Delete Address
export const deleteAddress = asyncHandler(async (req, res) => {
  await Address.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  res.status(200).json({ status: 'success', message: 'Address deleted' });
});
