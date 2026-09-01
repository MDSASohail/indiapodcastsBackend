import express from "express";
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import { protect } from "../middleware/auth.js";
import { isAdmin, isEditorOrAbove } from "../middleware/roleCheck.js";

const router = express.Router();

router.route("/").get(getCategories).post(protect, isEditorOrAbove, createCategory);
router
  .route("/:id")
  .get(getCategory)
  .put(protect, isEditorOrAbove, updateCategory)
  .delete(protect, isAdmin, deleteCategory);

export default router;