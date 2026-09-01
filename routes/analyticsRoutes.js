import express from "express";
import { getAnalytics } from "../controllers/analyticsController.js";
import { protect } from "../middleware/auth.js";
import { isAnyRole } from "../middleware/roleCheck.js";

const router = express.Router();
router.get("/", protect, isAnyRole, getAnalytics);

export default router;