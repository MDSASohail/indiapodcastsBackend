import express from "express";
import { getSettings, updateSettings } from "../controllers/settingsController.js";
import { protect } from "../middleware/auth.js";
import { isAdmin } from "../middleware/roleCheck.js";

const router = express.Router();

router.get("/", getSettings);
router.put("/", protect, isAdmin, updateSettings);

export default router;