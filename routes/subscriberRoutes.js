import express from "express";
import { subscribe, unsubscribe, getSubscribers, deleteSubscriber } from "../controllers/subscriberController.js";
import { protect } from "../middleware/auth.js";
import { isModeratorOrAbove } from "../middleware/roleCheck.js";

const router = express.Router();

router.post("/subscribe", subscribe);
router.post("/unsubscribe", unsubscribe);
router.get("/", protect, isModeratorOrAbove, getSubscribers);
router.delete("/:id", protect, isModeratorOrAbove, deleteSubscriber);

export default router;