// User routes — just wires URLs to controller functions
import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware";
import { getProfile, getAdminData } from "../controllers/userController";

const router = express.Router();

router.get("/profile", protect, getProfile);
router.get("/admin-only", protect, adminOnly, getAdminData);

export default router;
