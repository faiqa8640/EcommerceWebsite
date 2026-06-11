// All authentication logic: signup, signin, verify email, forgot/reset password, logout

import { Request, Response } from "express";
import crypto from "crypto";  // it is used to generate and hash tokens
import jwt from "jsonwebtoken"; // it is used for jwt authtication/ login authentication
import User from "../models/userModel";
import { // importing th email functions from the emailService
  sendVerificationEmail,
  sendPasswordResetEmail,
} from "../config/emailService";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const generateToken = (id: string): string => { // it create the jwt token after the login
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: "7d", 
  });
};

// funtion to create the random token -> using the crypto
const generateRawToken = (): string => crypto.randomBytes(32).toString("hex");
// generate the token that is of 256 bits  

// this is  used to hash the token  using the crypto
const hashToken = (token: string): string =>
  crypto.createHash("sha256").update(token).digest("hex");

// ══════════════════════════════════════════════════════════════════════════════
// POST /api/auth/signup
// ══════════════════════════════════════════════════════════════════════════════
export const signUp = async (req: Request, res: Response) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
 
    if (!name || !email || !password || !confirmPassword) { // if anything missing 
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    if (password !== confirmPassword) { // if password dont not matches
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const userExists = await User.findOne({ email }); // checks the existing user if the user already exists 
    if (userExists) {
      return res
        .status(400)
        .json({ message: "An account with this email already exists" });
    }

    const rawVerifyToken = generateRawToken(); // generating the token  -> for email verification
    const hashedVerifyToken = hashToken(rawVerifyToken); // hashing the token

    await User.create({ // creating the user 
      name,
      email,
      password,
      isVerified: false,
      emailVerifyToken: hashedVerifyToken,
      emailVerifyExpire: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
 
    const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${rawVerifyToken}`;// creating the URL 
    await sendVerificationEmail(email, name, verifyUrl); // sending the verification email

    res.status(201).json({  // response 
      success: true,
      message:
        "Account created! Please check your email to verify your account before logging in.",
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// ══════════════════════════════════════════════════════════════════════════════
// POST /api/auth/signin -> login
// ══════════════════════════════════════════════════════════════════════════════
export const signIn = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body; // get the email and password

    if (!email || !password) { // if anything missing 
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    const user = await User.findOne({ email }); //   if dont exist then error
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.matchPassword(password); // matchh the password using the bcrypt
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" }); // if not match -> error
    }

    if (!user.isVerified) {  // if is not verified then error 
      return res.status(403).json({
        message:
          "Please verify your email before logging in. Check your inbox.",
        notVerified: true,
      });
    }

    const token = generateToken(user._id.toString()); // generate the token -> used for login token-> jwt the frontend save the token in localstorage or cookies

    res.status(200).json({ // if success
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
    const { token } = req.params; // extact the token 

    if (!token || Array.isArray(token))  { // if token missing or array so error
      return res.status(400).json({ message: "Invalid token" });
    }

    const hashedToken = hashToken(token); // hash the token 

    const user = await User.findOne({ // finding the matching user
      emailVerifyToken: hashedToken,
      emailVerifyExpire: { $gt: Date.now() },
    });

    if (!user) { // if not user found then token is invalid
      return res.status(400).json({
        message: "Verification link is invalid or has expired.",
      });
    }

    user.isVerified = true; // user is valid then isverifed is set to true 
    user.set("emailVerifyToken", undefined); //  verification token set to null
    user.set("emailVerifyExpire", undefined); 
    await user.save(); // saving the user in the db 

    res.json({ // sending the response 
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
    const { email } = req.body; // get the email

    const user = await User.findOne({ email }); // finding the the user exist 
    if (!user) { // if account dont found  send the verification link
      return res.json({
        success: true,
        message:
          "If an unverified account exists with that email, a new link has been sent.",
      });
    }

    if (user.isVerified) { // if isverified is true then the user is already  verified
      return res
        .status(400)
        .json({ message: "This account is already verified." });
    }

    const rawToken = generateRawToken(); // generate the token
    user.emailVerifyToken = hashToken(rawToken); // then has it 
    user.emailVerifyExpire = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save(); // and save it

    const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${rawToken}`; // generte the verificaton link
    await sendVerificationEmail(email, user.name, verifyUrl);

    res.json({// repsonse
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
    const { email } = req.body;// get the email
    const user = await User.findOne({ email }); // find the user

    const safeResponse = { // return the save response -> coz other wise the hacker can get the idea that the user email exist or  not
      success: true,
      message:
        "If an account with that email exists, a reset link has been sent.",
    };

    if (!user) return res.json(safeResponse); // if not found user send the safe response

    const rawToken = generateRawToken(); // generate the token
    user.resetPasswordToken = hashToken(rawToken);// hash token
    user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);
    await user.save(); // save the user

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${rawToken}`; // generate the url
    await sendPasswordResetEmail(email, user.name, resetUrl);// seding the email

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
    const { password, confirmPassword } = req.body; // after reseting get the password and confirmpassword
    const { token } = req.params;// and get the token

    if (!password || !confirmPassword) {// if anything missing
      return res
        .status(400)
        .json({ message: "Please provide both password fields" });
    }

    if (password !== confirmPassword) { // if pass not match
      return res.status(400).json({ message: "Passwords do not match" });
    }

    if (password.length < 6) { // if length is small
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    if (!token || Array.isArray(token)) { // if token is missing 
      return res.status(400).json({ message: "Invalid token" });
    }

    const hashedToken = hashToken(token); // hash the token

    const user = await User.findOne({
      resetPasswordToken: hashedToken, // find the user
      resetPasswordExpire: { $gt: Date.now() },
    });
 
    if (!user) { // if not find
      return res
        .status(400)
        .json({ message: "Reset link is invalid or has expired." });
    }
    //  if found -> set user new password
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
