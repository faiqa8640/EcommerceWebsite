// All authentication routes: signup, signin, verify email, forgot/reset password, logout

import express, { Request, Response } from "express";
import User from "../models/userModel";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from "../config/emailService";

const router = express.Router();

// ─── Helper: Generate JWT ─────────────────────────────────────────────────────
const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });
};

// ─── Helper: Generate random hex token ───────────────────────────────────────
const generateRawToken = (): string => crypto.randomBytes(32).toString("hex");

// ─── Helper: Hash a raw token for DB storage ─────────────────────────────────
const hashToken = (token: string): string =>
  crypto.createHash("sha256").update(token).digest("hex");

// ══════════════════════════════════════════════════════════════════════════════
// POST /api/auth/signup
// Register a new user + send verification email
// ══════════════════════════════════════════════════════════════════════════════
router.post("/signup", async (req: Request, res: Response) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Validate all fields present
    if (!name || !email || !password || !confirmPassword) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    // Passwords must match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check duplicate email
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ message: "An account with this email already exists" });
    }

    // Generate email verification token
    const rawVerifyToken = generateRawToken();
    const hashedVerifyToken = hashToken(rawVerifyToken);

    // Create user (password gets hashed in pre-save hook)
    const user = await User.create({
      name,
      email,
      password,
      isVerified: false,
      emailVerifyToken: hashedVerifyToken,
      emailVerifyExpire: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    });

    // Send verification email
    const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${rawVerifyToken}`;
    await sendVerificationEmail(email, name, verifyUrl);

    res.status(201).json({
      success: true,
      message:
        "Account created! Please check your email to verify your account before logging in.",
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
});

// ══════════════════════════════════════════════════════════════════════════════
// POST /api/auth/signin
// Login — only for verified users
// ══════════════════════════════════════════════════════════════════════════════
router.post("/signin", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Block login if email not verified
    if (!user.isVerified) {
      return res.status(403).json({
        message:
          "Please verify your email before logging in. Check your inbox.",
        notVerified: true, // flag so frontend can offer resend option
      });
    }

    const token = generateToken(user._id.toString());

    res.status(200).json({
      success: true,
      message: "Signed in successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
});

// ══════════════════════════════════════════════════════════════════════════════
// GET /api/auth/verify-email/:token
// Verify email from the link sent to the user
// ══════════════════════════════════════════════════════════════════════════════
router.get("/verify-email/:token", async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    // const hashedToken = hashToken(token);
    if (!token || Array.isArray(token)) {
      return res.status(400).json({
        message: "Invalid token",
      });
    }
    
    const hashedToken = hashToken(token);

    const user = await User.findOne({
      emailVerifyToken: hashedToken,
      emailVerifyExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Verification link is invalid or has expired.",
      });
    }

    // Mark verified and clear token fields
    user.isVerified = true;
    user.set("emailVerifyToken", undefined);
    user.set("emailVerifyExpire", undefined);
    await user.save();

    res.json({
      success: true,
      message: "Email verified successfully! You can now log in.",
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
});

// ══════════════════════════════════════════════════════════════════════════════
// POST /api/auth/resend-verification
// Resend verification email if user hasn't verified yet
// ══════════════════════════════════════════════════════════════════════════════
router.post("/resend-verification", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal whether email exists
      return res.json({
        success: true,
        message:
          "If an unverified account exists with that email, a new link has been sent.",
      });
    }

    if (user.isVerified) {
      return res
        .status(400)
        .json({ message: "This account is already verified." });
    }

    // Generate new token
    const rawToken = generateRawToken();
    user.emailVerifyToken = hashToken(rawToken);
    user.emailVerifyExpire = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save();

    const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${rawToken}`;
    await sendVerificationEmail(email, user.name, verifyUrl);

    res.json({
      success: true,
      message: "Verification email resent. Please check your inbox.",
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
});

// ══════════════════════════════════════════════════════════════════════════════
// POST /api/auth/forgot-password
// Send password reset link to user's email
// ══════════════════════════════════════════════════════════════════════════════
router.post("/forgot-password", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    // Always return same message to prevent email enumeration
    const safeResponse = {
      success: true,
      message:
        "If an account with that email exists, a reset link has been sent.",
    };

    if (!user) {
      return res.json(safeResponse);
    }

    const rawToken = generateRawToken();
    user.resetPasswordToken = hashToken(rawToken);
    user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 min
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${rawToken}`;
    await sendPasswordResetEmail(email, user.name, resetUrl);

    res.json(safeResponse);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
});

// ══════════════════════════════════════════════════════════════════════════════
// POST /api/auth/reset-password/:token
// Set a new password using the reset token
// ══════════════════════════════════════════════════════════════════════════════
router.post("/reset-password/:token", async (req: Request, res: Response) => {
  try {
    const { password, confirmPassword } = req.body;
    const { token } = req.params;

    if (!password || !confirmPassword) {
      return res
        .status(400)
        .json({ message: "Please provide both password fields" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    // const hashedToken = hashToken(token);
    if (!token || Array.isArray(token)) {
      return res.status(400).json({
        message: "Invalid token",
      });
    }
    const hashedToken = hashToken(token);

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Reset link is invalid or has expired." });
    }

    // Update password (pre-save hook rehashes it)
    user.password = password;
    user.set("resetPasswordToken", undefined);
    user.set("resetPasswordExpire", undefined);
    await user.save();

    res.json({
      success: true,
      message: "Password reset successful. You can now log in.",
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
});

// ══════════════════════════════════════════════════════════════════════════════
// POST /api/auth/logout
// Client-side logout — just confirmation (JWT is stateless, clear on frontend)
// ══════════════════════════════════════════════════════════════════════════════
router.post("/logout", (_req: Request, res: Response) => {
  res.json({ success: true, message: "Logged out successfully" });
});

export default router;
