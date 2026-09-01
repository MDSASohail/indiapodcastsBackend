// import express from "express";
// import { getGuests, getGuest, createGuest, updateGuest, deleteGuest } from "../controllers/guestController.js";
// import { protect } from "../middleware/auth.js";
// import { isAdmin, isEditorOrAbove } from "../middleware/roleCheck.js";

// const router = express.Router();

// router.route("/").get(getGuests).post(protect, isEditorOrAbove, createGuest);
// router.route("/:id").get(getGuest).put(protect, isEditorOrAbove, updateGuest).delete(protect, isAdmin, deleteGuest);

// export default router;

import express from "express";
import {
  getGuests,
  getGuest,
  createGuest,
  updateGuest,
  deleteGuest,
  getGuestContent,
} from "../controllers/guestController.js";
import { protect } from "../middleware/auth.js";
import { isAdmin, isEditorOrAbove } from "../middleware/roleCheck.js";

const router = express.Router();

router.route("/").get(getGuests).post(protect, isEditorOrAbove, createGuest);
router.route("/:id/content").get(getGuestContent);
router.route("/:id")
  .get(getGuest)
  .put(protect, isEditorOrAbove, updateGuest)
  .delete(protect, isAdmin, deleteGuest);

export default router;