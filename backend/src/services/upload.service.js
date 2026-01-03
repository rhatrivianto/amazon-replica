import { v2 as cloudinary } from 'cloudinary';
import AppError from '../utils/AppError.js';

export const uploadToCloudinary = async (fileBuffer, folder = 'amazon-clone/products') => {
  return new Promise((resolve, reject) => {
    if (!fileBuffer) return reject(new AppError('No file buffer provided', 400));

    const uploadStream = cloudinary.uploader.upload_stream(
      { 
        folder, 
        resource_type: 'auto',
        transformation: [{ width: 1000, crop: "limit", quality: "auto" }] // Optimasi otomatis
      },
      (error, result) => {
        if (error) reject(new AppError('Cloudinary Upload Failed', 500));
        else resolve({
          url: result.secure_url,
          publicId: result.public_id
        });
      }
    );
    uploadStream.end(fileBuffer);
  });
};

export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new AppError('Failed to delete file from cloud', 500);
  }
};