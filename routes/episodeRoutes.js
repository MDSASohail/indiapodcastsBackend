import express from "express";
import {
  getEpisodes,
  getEpisode,
  createEpisode,
  updateEpisode,
  deleteEpisode,
  toggleFeatured,
} from "../controllers/episodeController.js";
import { protect, publicOrProtected } from "../middleware/auth.js";
import { isAdmin, isEditorOrAbove } from "../middleware/roleCheck.js";

const router = express.Router();

router
  .route("/")
  .get(publicOrProtected, getEpisodes)
  .post(protect, isEditorOrAbove, createEpisode);

router
  .route("/:id/featured")
  .put(protect, isEditorOrAbove, toggleFeatured);

router
  .route("/:id")
  .get(publicOrProtected, getEpisode)
  .put(protect, isEditorOrAbove, updateEpisode)
  .delete(protect, isAdmin, deleteEpisode);

export default router;