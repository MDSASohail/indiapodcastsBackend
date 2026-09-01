import express from "express";
import { getComments, createComment, updateCommentStatus, deleteComment, likeComment } from "../controllers/commentController.js";
import { protect, publicOrProtected } from "../middleware/auth.js";
import { isAdmin, isModeratorOrAbove } from "../middleware/roleCheck.js";

const router = express.Router();

router.route("/").get(publicOrProtected, getComments).post(createComment);
router.route("/:id/status").put(protect, isModeratorOrAbove, updateCommentStatus);
router.route("/:id/like").put(likeComment);
router.route("/:id").delete(protect, isModeratorOrAbove, deleteComment);

export default router;