import express from "express";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoriesController.js";

import { handleMulterError, uploadCategoryImage } from "../middleware/upload.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();
router.use(authenticate);
router.use(authorize("seller"));

// PUBLIC
router.get("/all", getAllCategories);
router.get("/:id", getCategoryById);

// ADMIN
router.post(
  "/",
  uploadCategoryImage,
  handleMulterError,
  createCategory
);

router.put("/:id", uploadCategoryImage, handleMulterError, updateCategory);

router.delete("/:id", deleteCategory);

export default router;
