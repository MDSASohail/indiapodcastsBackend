import express from "express";
import { createContact, getContacts, updateContactStatus, deleteContact } from "../controllers/contactController.js";
import { protect } from "../middleware/auth.js";
import { isModeratorOrAbove } from "../middleware/roleCheck.js";

const router = express.Router();

router.post("/", createContact);
router.get("/", protect, isModeratorOrAbove, getContacts);
router.put("/:id/status", protect, isModeratorOrAbove, updateContactStatus);
router.delete("/:id", protect, isModeratorOrAbove, deleteContact);

export default router;