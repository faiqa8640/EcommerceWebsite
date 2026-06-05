// models  tell that how does my data look like.. you can say that in we define the schema etc

import mongoose, { Document, Model } from "mongoose";
import bcrypt from "bcryptjs"; // to bcrypt the password

// 1. Define user interface
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  matchPassword(enteredPassword: string): Promise<boolean>;
}

// 2. Defining the userSchema
const userSchema = new mongoose.Schema<IUser>(
  {
    // contain name , email, password, role
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true } // mongodb add created at and updated at automatically
);

// 3. Hash password
// we will hash the password before saying in the db -> for that purpose we will use becrypt
userSchema.pre("save", async function () { // this runs before  everthing is saved to the db -> kind of middleware 
  if (!this.isModified("password")) return; // if the password is modifed only then bcrypt
  this.password = await bcrypt.hash(this.password, 10);//10 is salt number -> higher  salt number means higher security and but slow hashing 
});
// salt number is a random data added before hashing 
// and for one password diff hashes is possible  and remember that 10 is the standard for hashing 

// 4. Match password method
userSchema.methods.matchPassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);// compare theuser type passwprd with the hash passoword
};

//  so overall working is that 
// 1) user enter the password , the password is hashed and then stored into the database okay 
// 2) if the user come and login what happen is that the enetered password is compared with the hased one oky 
// (bcrypt.compare -> apply the same hashing to the enetered password and  then compare)
// 3) if true user login if not then incorrect password 
// 5. Model type
const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;