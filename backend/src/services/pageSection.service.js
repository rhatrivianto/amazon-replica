import PageSection from '../models/pageSection.model.js';
import AppError from '../utils/AppError.js';

export const getAllSections = async () => {
  return await PageSection.find({ isActive: true }).sort({ order: 1 });
};

export const createSection = async (data) => {
  return await PageSection.create(data);
};

export const updateSection = async (id, data) => {
  const section = await PageSection.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!section) throw new AppError('Section not found', 404);
  return section;
};

export const deleteSection = async (id) => {
  const section = await PageSection.findByIdAndDelete(id);
  if (!section) throw new AppError('Section not found', 404);
  return section;
};