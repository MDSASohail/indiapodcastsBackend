import express from "express";
import { getTeam, getTeamMember, createTeamMember, updateTeamMember, deleteTeamMember } from "../controllers/teamController.js";
import { protect } from "../middleware/auth.js";
import { isAdmin, isEditorOrAbove } from "../middleware/roleCheck.js";

const router = express.Router();

router.route("/").get(getTeam).post(protect, isEditorOrAbove, createTeamMember);
router.route("/:id").get(getTeamMember).put(protect, isEditorOrAbove, updateTeamMember).delete(protect, isAdmin, deleteTeamMember);

export default router;