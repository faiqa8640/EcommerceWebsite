
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/userModel";

// Extend Express Request structure to hold the authenticated user context object safely
export interface AuthRequest extends Request {
  user?: {
    id: string;
    _id: mongoose.Types.ObjectId | string; // 👈 OPTIMIZATION: Supports both native Mongoose ObjectIds and string variations across all controllers!
    name: string;
    email: string;
    role: string;
    isVerified: boolean;
  };
}

// ─── protect: require valid JWT ───────────────────────────────────────────────
export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("🔒 [protect] Headers:", req.headers.authorization);
    let token: string | undefined;
    
    // Check for Authorization token in request headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      console.error(" [AUTH MIDDLEWARE]: Request blocked. No Bearer token provided in headers.");
      return res
        .status(401)
        .json({ message: "Not authorized — no token provided" });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("[AUTH MIDDLEWARE CRITICAL]: Environment configuration error. JWT_SECRET variable is missing from your .env file.");
      return res.status(500).json({ message: "JWT secret configuration mismatch on server" });
    }

    // Verify token validity against signature secret
    const decoded = jwt.verify(token, secret) as { id: string };

    // Fetch account from database to verify profile status
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      console.error(` [AUTH MIDDLEWARE]: Token is valid, but no account exists in MongoDB for User ID: ${decoded.id}`);
      return res
        .status(401)
        .json({ message: "Not authorized — user account no longer exists" });
    }

    // Attach complete unified profile payload properties to the request object
    req.user = {
      id: user._id.toString(),
      _id: user._id, // 👈 Directly passing the native ObjectId now matches standard Mongoose operations perfectly
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    };

    next();
  } catch (error: any) {
    console.error("❌ [AUTH MIDDLEWARE JWT EXCEPTION]:", error.message);

    res.status(401).json({ 
      message: "Not authorized — invalid or expired token signature",
      error: error.message 
    });
  }
};

// ─── adminOnly: require admin privileges ────────────────────────────────────
export const adminOnly = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== "admin") {
    console.warn(`⚠️ [AUTH MIDDLEWARE]: Access denied. User ${req.user?.email} attempted admin action without required permissions.`);
    return res.status(403).json({ message: "Admin access privileges required" });
  }
  next();
};