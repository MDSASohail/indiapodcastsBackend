import express from "express";
import {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../controllers/blogController.js";
import { protect, publicOrProtected } from "../middleware/auth.js";
import { isAdmin, isEditorOrAbove } from "../middleware/roleCheck.js";

const router = express.Router();

router.route("/").get(publicOrProtected, getBlogs).post(protect, isEditorOrAbove, createBlog);
router.route("/:id").get(publicOrProtected, getBlog).put(protect, isEditorOrAbove, updateBlog).delete(protect, isAdmin, deleteBlog);

export default router;