// User-related logic: profile, admin-only data
import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import User from "../models/userModel"; // 👈 1. Make sure to import your User model

// ══════════════════════════════════════════════════════════════════════════════
// GET /api/user/profile
// ══════════════════════════════════════════════════════════════════════════════
export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    // 2. Ensure we have a valid user ID from the protect middleware
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    // 3. Fetch the full user from the database and populate the wishlist array items
    const fullUser = await User.findById(req.user.id)
      .select("-password")
      .populate("wishlist"); // 👈 This turns the [ObjectId] strings into an array of full Product objects!

    if (!fullUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      user: fullUser, // 👈 Sends back the user including the populated wishlist!
    });
  } catch (error: any) {
    console.error("❌ Error in getProfile controller:", error.message);
    res.status(500).json({ success: false, message: "Server error parsing profile data" });
  }
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