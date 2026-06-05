
// Protects routes — verifies JWT and attaches user to request
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/userModel";

// Extend Express Request to carry the authenticated user
export interface AuthRequest extends Request {
  user?: {
    id: string;
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
    let token: string | undefined;

    // Token expected in Authorization header: "Bearer <token>"
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res
        .status(401)
        .json({ message: "Not authorized — no token provided" });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ message: "JWT secret not configured" });
    }

    // Verify token and decode payload
    const decoded = jwt.verify(token, secret) as { id: string };

    // Fetch fresh user data from DB (ensures token isn't from a deleted account)
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res
        .status(401)
        .json({ message: "Not authorized — user not found" });
    }

    // Attach user to request for use in route handlers
    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    };

    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized — invalid or expired token" });
  }
};

// ─── adminOnly: require admin role ───────────────────────────────────────────
export const adminOnly = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};


















