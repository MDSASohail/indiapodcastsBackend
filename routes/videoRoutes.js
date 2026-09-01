import express from "express";
import {
  getVideos,
  getVideo,
  createVideo,
  updateVideo,
  deleteVideo,
} from "../controllers/videoController.js";
import { protect, publicOrProtected } from "../middleware/auth.js";
import { isAdmin, isEditorOrAbove } from "../middleware/roleCheck.js";

const router = express.Router();

router
  .route("/")
  .get(publicOrProtected, getVideos)
  .post(protect, isEditorOrAbove, createVideo);

router
  .route("/:id")
  .get(getVideo)
  .put(protect, isEditorOrAbove, updateVideo)
  .delete(protect, isAdmin, deleteVideo);

export default router;