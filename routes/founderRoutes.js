import express from "express";
import { getFounder, updateFounder, addMilestone, deleteMilestone } from "../controllers/founderController.js";
import { protect } from "../middleware/auth.js";
import { isEditorOrAbove } from "../middleware/roleCheck.js";

const router = express.Router();

router.route("/").get(getFounder).put(protect, isEditorOrAbove, updateFounder);
router.route("/milestones").post(protect, isEditorOrAbove, addMilestone);
router.route("/milestones/:milestoneId").delete(protect, isEditorOrAbove, deleteMilestone);

export default router;