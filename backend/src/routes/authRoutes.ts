// Auth routes — just wires URLs to controller functions

import express from "express";
import {
  signUp,
  signIn,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
  logout,
} from "../controllers/authController";

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.get("/verify-email/:token", verifyEmail);
router.post("/resend-verification", resendVerification);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/logout", logout);

export default router;
