import express from "express";
import {
  getShorts,
  getShort,
  createShort,
  updateShort,
  deleteShort,
} from "../controllers/shortController.js";
import { protect, publicOrProtected } from "../middleware/auth.js";
import { isAdmin, isEditorOrAbove } from "../middleware/roleCheck.js";

const router = express.Router();

router.route("/").get(publicOrProtected, getShorts).post(protect, isEditorOrAbove, createShort);
router.route("/:id").get(getShort).put(protect, isEditorOrAbove, updateShort).delete(protect, isAdmin, deleteShort);

export default router;