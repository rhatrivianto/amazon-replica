import { asyncHandler } from '../utils/asyncHandler.js';
import * as pageSectionService from '../services/pageSection.service.js';

export const getSections = asyncHandler(async (req, res) => {
  const sections = await pageSectionService.getAllSections();
  res.status(200).json({ status: 'success', data: sections });
});

// Admin Only Controllers
export const createSection = asyncHandler(async (req, res) => {
  const newSection = await pageSectionService.createSection(req.body);
  res.status(201).json({ status: 'success', data: newSection });
});

export const updateSection = asyncHandler(async (req, res) => {
  const updated = await pageSectionService.updateSection(req.params.id, req.body);
  res.status(200).json({ status: 'success', data: updated });
});

export const deleteSection = asyncHandler(async (req, res) => {
  await pageSectionService.deleteSection(req.params.id);
  res.status(204).json({ status: 'success', data: null });
});