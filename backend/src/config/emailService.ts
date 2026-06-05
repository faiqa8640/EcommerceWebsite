// Nodemailer setup — sends verification and password reset emails

import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();



// Create reusable transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER as string,
    pass: process.env.EMAIL_PASS as string,
    // Use an App Password from Google Account → Security → App Passwords
    // NOT your normal Gmail password
  },
});

// ─── Send Email Verification ─────────────────────────────────────────────────
export const sendVerificationEmail = async (
  email: string,
  name: string,
  verifyUrl: string
): Promise<void> => {
  await transporter.sendMail({
    from: `"Eloura Fragrance House" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify Your Email — Eloura",
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: auto; background: #111844; color: #EAE0CF; padding: 40px; border-radius: 12px;">
        <h1 style="font-size: 2rem; letter-spacing: 0.2em; margin-bottom: 8px;">ELOURA</h1>
        <p style="color: #7288AE; letter-spacing: 0.2em; font-size: 0.75rem; text-transform: uppercase; margin-bottom: 32px;">The Fragrance House</p>

        <h2 style="font-size: 1.4rem; font-weight: 300; margin-bottom: 16px;">Welcome, ${name}</h2>
        <p style="line-height: 1.8; color: rgba(234,224,207,0.85); margin-bottom: 32px;">
          Thank you for joining Eloura. Please verify your email address to complete your registration and unlock your full account.
        </p>

        <a href="${verifyUrl}"
           style="display: inline-block; padding: 14px 32px; background: #4B5694; color: #EAE0CF; text-decoration: none; border-radius: 8px; letter-spacing: 0.15em; text-transform: uppercase; font-size: 0.85rem;">
          Verify Email
        </a>

        <p style="margin-top: 32px; font-size: 0.8rem; color: rgba(234,224,207,0.5);">
          This link expires in <strong>24 hours</strong>. If you did not create an account, you can safely ignore this email.
        </p>
      </div>
    `,
  });
};

// ─── Send Password Reset Email ────────────────────────────────────────────────
export const sendPasswordResetEmail = async (
  email: string,
  name: string,
  resetUrl: string
): Promise<void> => {
  await transporter.sendMail({
    from: `"Eloura Fragrance House" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Reset Your Password — Eloura",
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: auto; background: #111844; color: #EAE0CF; padding: 40px; border-radius: 12px;">
        <h1 style="font-size: 2rem; letter-spacing: 0.2em; margin-bottom: 8px;">ELOURA</h1>
        <p style="color: #7288AE; letter-spacing: 0.2em; font-size: 0.75rem; text-transform: uppercase; margin-bottom: 32px;">The Fragrance House</p>

        <h2 style="font-size: 1.4rem; font-weight: 300; margin-bottom: 16px;">Password Reset Request</h2>
        <p style="line-height: 1.8; color: rgba(234,224,207,0.85); margin-bottom: 32px;">
          Hi ${name}, we received a request to reset your password. Click the button below to choose a new one.
        </p>

        <a href="${resetUrl}"
           style="display: inline-block; padding: 14px 32px; background: #4B5694; color: #EAE0CF; text-decoration: none; border-radius: 8px; letter-spacing: 0.15em; text-transform: uppercase; font-size: 0.85rem;">
          Reset Password
        </a>

        <p style="margin-top: 32px; font-size: 0.8rem; color: rgba(234,224,207,0.5);">
          This link expires in <strong>10 minutes</strong>. If you did not request a reset, please ignore this email — your password will remain unchanged.
        </p>
      </div>
    `,
  });
};
