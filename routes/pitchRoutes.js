import express from "express";
import { createPitch, getPitches, updatePitchStatus, deletePitch } from "../controllers/pitchController.js";
import { protect } from "../middleware/auth.js";
import { isModeratorOrAbove } from "../middleware/roleCheck.js";

const router = express.Router();

router.post("/", createPitch);
router.get("/", protect, isModeratorOrAbove, getPitches);
router.put("/:id/status", protect, isModeratorOrAbove, updatePitchStatus);
router.delete("/:id", protect, isModeratorOrAbove, deletePitch);

export default router;