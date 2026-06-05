// Defines how our user data looks in MongoDB

import mongoose, { Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

// 1. TypeScript interface for user document
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";

  // Email verification
  isVerified: boolean;
  emailVerifyToken?: string;
  emailVerifyExpire?: Date;

  // Password reset
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;

  matchPassword(enteredPassword: string): Promise<boolean>;
}

// 2. Mongoose schema
const userSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ["user", "admin"], default: "user" },

    // Email verification fields
    isVerified: { type: Boolean, default: false },
    emailVerifyToken: String,
    emailVerifyExpire: Date,

    // Password reset fields
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true } // adds createdAt and updatedAt automatically
);

// 3. Hash password before saving (only when modified)
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
  // salt=10 → standard security/performance balance
});

// 4. Compare entered password with hashed DB password
userSchema.methods.matchPassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export default User;
