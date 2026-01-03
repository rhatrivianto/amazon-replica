import * as categoryService from '../services/category.service.js';

export const createCategory = async (req, res, next) => {
  try {
    const category = await categoryService.createCategory(req.body);
    res.status(201).json({
      status: 'success',
      data: category
    });
  } catch (error) {
    next(error);
  }
};

export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.status(200).json({
      status: 'success',
      results: categories.length,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

export const getCategoryById = async (req, res, next) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    if (!category) {
      return res.status(404).json({ status: 'fail', message: 'Category not found' });
    }
    res.status(200).json({
      status: 'success',
      data: category
    });
  } catch (error) {
    next(error);
  }
};

export const getCategoryTreeIds = async (req, res, next) => {
  try {
    const { id } = req.params;
    const allIds = await categoryService.getCategoryWithAllDescendants(id);
    
    res.status(200).json({
      status: 'success',
      count: allIds.length,
      data: allIds // Mengembalikan array ID [ "id1", "id2", ... ]
    });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const category = await categoryService.updateCategory(req.params.id, req.body);
    if (!category) {
      return res.status(404).json({ status: 'fail', message: 'Category not found' });
    }
    res.status(200).json({
      status: 'success',
      data: category
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const category = await categoryService.deleteCategory(req.params.id);
    if (!category) {
      return res.status(404).json({ status: 'fail', message: 'Category not found' });
    }
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
};