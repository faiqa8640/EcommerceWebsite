// All authentication logic: signup, signin, verify email, forgot/reset password, logout

import { Request, Response } from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "../models/userModel";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from "../config/emailService";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });
};

const generateRawToken = (): string => crypto.randomBytes(32).toString("hex");

const hashToken = (token: string): string =>
  crypto.createHash("sha256").update(token).digest("hex");

// ══════════════════════════════════════════════════════════════════════════════
// POST /api/auth/signup
// ══════════════════════════════════════════════════════════════════════════════
export const signUp = async (req: Request, res: Response) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ message: "An account with this email already exists" });
    }

    const rawVerifyToken = generateRawToken();
    const hashedVerifyToken = hashToken(rawVerifyToken);

    await User.create({
      name,
      email,
      password,
      isVerified: false,
      emailVerifyToken: hashedVerifyToken,
      emailVerifyExpire: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${rawVerifyToken}`;
    await sendVerificationEmail(email, name, verifyUrl);

    res.status(201).json({
      success: true,
      message:
        "Account created! Please check your email to verify your account before logging in.",
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// ══════════════════════════════════════════════════════════════════════════════
// POST /api/auth/signin
// ══════════════════════════════════════════════════════════════════════════════
export const signIn = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message:
          "Please verify your email before logging in. Check your inbox.",
        notVerified: true,
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
    res.status(500).json({ message: (error as Error).message });
  }
};

// ══════════════════════════════════════════════════════════════════════════════
// GET /api/auth/verify-email/:token
// ══════════════════════════════════════════════════════════════════════════════
export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    if (!token || Array.isArray(token)) {
      return res.status(400).json({ message: "Invalid token" });
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

    user.isVerified = true;
    user.set("emailVerifyToken", undefined);
    user.set("emailVerifyExpire", undefined);
    await user.save();

    res.json({
      success: true,
      message: "Email verified successfully! You can now log in.",
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// ══════════════════════════════════════════════════════════════════════════════
// POST /api/auth/resend-verification
// ══════════════════════════════════════════════════════════════════════════════
export const resendVerification = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
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
    res.status(500).json({ message: (error as Error).message });
  }
};

// ══════════════════════════════════════════════════════════════════════════════
// POST /api/auth/forgot-password
// ══════════════════════════════════════════════════════════════════════════════
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    const safeResponse = {
      success: true,
      message:
        "If an account with that email exists, a reset link has been sent.",
    };

    if (!user) return res.json(safeResponse);

    const rawToken = generateRawToken();
    user.resetPasswordToken = hashToken(rawToken);
    user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${rawToken}`;
    await sendPasswordResetEmail(email, user.name, resetUrl);

    res.json(safeResponse);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// ══════════════════════════════════════════════════════════════════════════════
// POST /api/auth/reset-password/:token
// ══════════════════════════════════════════════════════════════════════════════
export const resetPassword = async (req: Request, res: Response) => {
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

    if (!token || Array.isArray(token)) {
      return res.status(400).json({ message: "Invalid token" });
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

    user.password = password;
    user.set("resetPasswordToken", undefined);
    user.set("resetPasswordExpire", undefined);
    await user.save();

    res.json({
      success: true,
      message: "Password reset successful. You can now log in.",
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// ══════════════════════════════════════════════════════════════════════════════
// POST /api/auth/logout
// ══════════════════════════════════════════════════════════════════════════════
export const logout = (_req: Request, res: Response) => {
  res.json({ success: true, message: "Logged out successfully" });
};
