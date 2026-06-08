// User-related logic: profile, admin-only data

import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
// send the repnse

// ══════════════════════════════════════════════════════════════════════════════
// GET /api/user/profile
// ══════════════════════════════════════════════════════════════════════════════
export const getProfile = (req: AuthRequest, res: Response) => { // it send back the currenty login user
  res.json({
    success: true,
    user: req.user,
  });
};

// ══════════════════════════════════════════════════════════════════════════════
// GET /api/user/admin-only
// ══════════════════════════════════════════════════════════════════════════════
// only admin can assess this 
export const getAdminData = (_req: AuthRequest, res: Response) => {
  res.json({
    success: true,
    message: "Welcome, Admin! This is a protected admin route.",
  });
};


// if admin login->protec middleware check the login->adminonly middleware -> check the role
// ->getAdminData -> sent the response