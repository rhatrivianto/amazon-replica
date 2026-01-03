import express from "express";
import * as categoryController from "../controllers/category.controller.js";

const router = express.Router();

// Route: /api/v1/categories
router
  .route("/")
  .get(categoryController.getAllCategories)   // Ambil semua kategori
  .post(categoryController.createCategory);   // Tambah kategori baru

// Route: /api/v1/categories/:id
router
  .route("/:id")
  .get(categoryController.getCategoryById)    // Tambahkan baris i
  .patch(categoryController.updateCategory)   // Update kategori
  .delete(categoryController.deleteCategory); // Hapus kategori
  // Endpoint baru untuk mendapatkan semua ID keturunan
  
router.get("/:id/descendants", categoryController.getCategoryTreeIds);

export default router;