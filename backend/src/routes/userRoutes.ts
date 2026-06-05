// Protected user routes — require valid JWT

import express from "express";
import { protect, adminOnly, AuthRequest } from "../middleware/authMiddleware";
import { Response } from "express";

const router = express.Router();

// GET /api/user/profile — get current logged-in user's profile
router.get("/profile", protect, (req: AuthRequest, res: Response) => {
  res.json({
    success: true,
    user: req.user,
  });
});

// GET /api/user/admin-only — example admin-only route
router.get(
  "/admin-only",
  protect,
  adminOnly,
  (_req: AuthRequest, res: Response) => {
    res.json({
      success: true,
      message: "Welcome, Admin! This is a protected admin route.",
    });
  }
);

export default router;
