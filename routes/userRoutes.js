import express from "express";
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";
import { isAdmin } from "../middleware/roleCheck.js";

const router = express.Router();

router.use(protect, isAdmin);

router.route("/").get(getUsers).post(createUser);
router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

export default router;