// // Defines how our user data looks in MongoDB

// import mongoose, { Document, Model } from "mongoose"; // document is a single document is db 
// // model is a file to interact with db
// import bcrypt from "bcryptjs"; // used for hashing and compareing password

// // 1. TypeScript interface for user document
// export interface IUser extends Document {
//   name: string;
//   email: string;
//   password: string;
//   role: "user" | "admin";

//   // Email verification
//   isVerified: boolean;
//   emailVerifyToken?: string;
//   emailVerifyExpire?: Date;

//   // Password reset
//   resetPasswordToken?: string;
//   resetPasswordExpire?: Date;

//   matchPassword(enteredPassword: string): Promise<boolean>; // add a method to compare the passwords
// }

// // 2. Mongoose schema
// const userSchema = new mongoose.Schema<IUser>(
//   {
//     name: { type: String, required: true, trim: true },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       trim: true,
//     },
//     password: { type: String, required: true, minlength: 6 },
//     role: { type: String, enum: ["user", "admin"], default: "user" },

//     // Email verification fields
//     isVerified: { type: Boolean, default: false },
//     emailVerifyToken: String,
//     emailVerifyExpire: Date,

//     // Password reset fields
//     resetPasswordToken: String,
//     resetPasswordExpire: Date,
//   },
//   { timestamps: true } // adds createdAt and updatedAt automatically
// );

// // 3. Hash password before saving (only when modified)
// userSchema.pre("save", async function () {
//   if (!this.isModified("password")) return;
//   this.password = await bcrypt.hash(this.password, 10); // hash the password before saving to the db
//   // salt=10 → standard security/performance balance
// });

// // 4. Compare entered password with hashed DB password
// userSchema.methods.matchPassword = async function ( // used for the login 
//   enteredPassword: string
// ): Promise<boolean> {
//   return await bcrypt.compare(enteredPassword, this.password); // return true or false
// };

// const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
// export default User;




// Defines how our user data looks in MongoDB

import mongoose, { Document, Model } from "mongoose"; // document is a single document is db 
// model is a file to interact with db
import bcrypt from "bcryptjs"; // used for hashing and compareing password

// 1. TypeScript interface for user document
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  
  // Added wishlist array typing here
  wishlist: mongoose.Types.ObjectId[]; 

  // Email verification
  isVerified: boolean;
  emailVerifyToken?: string;
  emailVerifyExpire?: Date;

  // Password reset
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;

  matchPassword(enteredPassword: string): Promise<boolean>; // add a method to compare the passwords
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
    
    // Added wishlist schema property array pointing to Product documents
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      }
    ],

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
  this.password = await bcrypt.hash(this.password, 10); // hash the password before saving to the db
  // salt=10 → standard security/performance balance
});

// 4. Compare entered password with hashed DB password
userSchema.methods.matchPassword = async function ( // used for the login 
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password); // return true or false
};

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export default User;