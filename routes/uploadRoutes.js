import express from "express";
import { uploadImage, deleteImage } from "../controllers/uploadController.js";
import { protect } from "../middleware/auth.js";
import { isEditorOrAbove } from "../middleware/roleCheck.js";
import upload from "../middleware/upload.js";
import { uploadLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.use(protect, isEditorOrAbove);
router.post("/", uploadLimiter, upload.single("image"), uploadImage);
router.delete("/:publicId", deleteImage);

export default router;