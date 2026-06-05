import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import nodemailer from "nodemailer";  // ← add this import
import connectDB from "./config/db";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/userRoutes";

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "Eloura API is running", status: "ok" });
});

// ── TEMPORARY TEST ROUTE ──────────────────────────────────
app.get("/test-email", async (_req: Request, res: Response) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    await transporter.verify();
    res.json({ success: true, message: "SMTP works!" });
  } catch (error: any) {
    res.json({
      success: false,
      error: error.message,
      code: error.code,
      user: process.env.EMAIL_USER,
      passLength: process.env.EMAIL_PASS?.length,
    });
  }
});
// ─────────────────────────────────────────────────────────

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});