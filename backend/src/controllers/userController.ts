
// User-related logic: profile, address management, admin-only data
import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import User from "../models/userModel";
import Order from "../models/orderModel"; 
import Review from "../models/reviewModel";
import bcrypt from "bcrypt";

// ══════════════════════════════════════════════════════════════════════════════
// GET /api/user/profile
// ═════════════════════════════════════════════════════════════════════════════

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    // 1. Fetch user (it remains 'null' | 'UserDocument')
    const fullUser = await User.findById(req.user.id).select("-password").populate("wishlist");

    // 2. CHECK FOR NULL BEFORE PROCEEDING
    if (!fullUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // 3. Now TypeScript knows 'fullUser' exists because the function would have returned above
    const reviewCount = await Review.countDocuments({ userId: req.user.id });
    const userOrders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      user: {
        ...fullUser.toObject(), // TypeScript is now happy!
        stats: {
          ordersPlaced: userOrders.length,
          scentsExplored: userOrders.length > 0 ? userOrders.length * 2 + 1 : 3,
          reviewsWritten: reviewCount
        },
        lastOrder: userOrders.length > 0 ? userOrders[0] : null
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// // ══════════════════════════════════════════════════════════════════════════════
// PUT /api/user/address
// ═════════════════════════════════════════════════════════════════════════════


export const updateAddress = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user.id) return res.status(401).json({ message: "Not authorized" });

    // Frontend is sending { street, city, postal, country }
    const { street, city, postal, country } = req.body;

    if (!street || !city || !postal || !country) {
      return res.status(400).json({ success: false, message: "Missing address fields" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          address: { 
            streetAddress: street, // Map frontend "street" to backend "streetAddress"
            city, 
            postalCode: postal,   // Map frontend "postal" to backend "postalCode"
            country 
          }
        }
      },
      { new: true, runValidators: true }
    ).select("-password");

    res.json({ success: true, user: updatedUser });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
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

// ══════════════════════════════════════════════════════════════════════════════
// PUT /api/user/update-settings
// ══════════════════════════════════════════════════════════════════════════════
export const updateProfileSettings = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    const { name, email, currentPassword, newPassword } = req.body;
    
    // Crucial: Do NOT select("-password") here because we NEED to read the old hash to compare it!
    const userToUpdate = await User.findById(req.user.id);

    if (!userToUpdate) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // SCENARIO A: User is updating Password
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ success: false, message: "Current password is required to set a new one" });
      }
      
      // Verify current password matches
      const isMatch = await bcrypt.compare(currentPassword, userToUpdate.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: "Incorrect current password" });
      }

      // ✅ FIX: Assign the PLAIN TEXT new password directly.
      // Let your userModel's .pre("save") hook do the hashing so it doesn't double-hash!
      userToUpdate.password = newPassword;
    }

    // SCENARIO B: User is updating Name or Email
    if (name) userToUpdate.name = name;
    if (email) {
      // Check if email is already taken by someone else
      const emailExists = await User.findOne({ email });
      if (emailExists && emailExists._id.toString() !== req.user.id) {
        return res.status(400).json({ success: false, message: "This email address is already taken" });
      }
      userToUpdate.email = email;
    }

    // This triggers the pre("save") hook perfectly and hashes the password exactly once!
    await userToUpdate.save();

    res.json({
      success: true,
      message: "Security settings updated successfully",
      user: {
        _id: userToUpdate._id,
        name: userToUpdate.name,
        email: userToUpdate.email,
        role: userToUpdate.role
      }
    });
  } catch (error: any) {
    console.error("❌ Error in updateProfileSettings controller:", error.message);
    res.status(500).json({ success: false, message: "Server error updating profile settings" });
  }
};