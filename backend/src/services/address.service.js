import Address from '../models/address.model.js'; // MODEL DIIMPORT DI SINI

export const addAddress = async (userId, addressData) => {
  if (addressData.isDefault) {
    // Reset default lama agar hanya ada satu alamat utama
    await Address.updateMany({ user: userId }, { isDefault: false });
  }
  return await Address.create({ ...addressData, user: userId });
};

export const getAddressesByUserId = async (userId) => {
  // Mencari di tabel Address berdasarkan ID user
  return await Address.find({ user: userId }).sort({ isDefault: -1, createdAt: -1 });
};