// User-related logic: profile, admin-only data

import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";

// ══════════════════════════════════════════════════════════════════════════════
// GET /api/user/profile
// ══════════════════════════════════════════════════════════════════════════════
export const getProfile = (req: AuthRequest, res: Response) => {
  res.json({
    success: true,
    user: req.user,
  });
};

// ══════════════════════════════════════════════════════════════════════════════
// GET /api/user/admin-only
// ══════════════════════════════════════════════════════════════════════════════
export const getAdminData = (_req: AuthRequest, res: Response) => {
  res.json({
    success: true,
    message: "Welcome, Admin! This is a protected admin route.",
  });
};
