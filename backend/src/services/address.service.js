import Address from '../models/address.model.js';

export const addAddress = async (userId, addressData) => {
  if (addressData.isDefault) {
    await Address.updateMany({ user: userId }, { isDefault: false });
  }
  return await Address.create({ ...addressData, user: userId });
};

export const getAddressesByUserId = async (userId) => {
  return await Address.find({ user: userId }).sort({ isDefault: -1, createdAt: -1 });
};

export const updateAddress = async (userId, addressId, addressData) => {
  // Jika update ingin set jadi Default, matikan yang lain dulu
  if (addressData.isDefault) {
    await Address.updateMany({ user: userId }, { isDefault: false });
  }

  return await Address.findOneAndUpdate(
    { _id: addressId, user: userId },
    addressData,
    { new: true, runValidators: true }
  );
};

export const deleteAddress = async (userId, addressId) => {
  return await Address.findOneAndDelete({ _id: addressId, user: userId });
};