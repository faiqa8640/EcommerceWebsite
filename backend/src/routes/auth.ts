import express, { Request, Response } from "express";
import User from "../models/userModel";
import jwt from "jsonwebtoken"; // use to generate the tokens

const router = express.Router(); // express  router is used to write the  routes 

// function for generating tokens
const generateToken = (id: string) => {
  // jwt.sign -> generate the token 
  // jwt.sign(payload,secret,options)->syntax
  // id-> this token belong to which id
  // secret-> it keep the token secure and only the server would know it 
  // options-> it tells that when the token gonna expires
  return jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: "7d" });
};


// when user try to signup
router.post("/signup", async (req: Request, res: Response) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) { // check if any feild is missing if yes then tell the user
      return res.status(400).json({ message: "please provide all required fields" });
    }

    if (password !== confirmPassword) { // if paswords dont match
      return res.status(400).json({ message: "passwords dont match" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "user already exist" }); // if user already exist  in db
    }

    const user = await User.create({ name, email, password }); // creating the user
    const token = generateToken(user._id.toString()); // generating token

    res.status(201).json({ // sending response ->success
      success: true,
      message: "user registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
});


//  Login / signin
router.post("/signin", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) { // check if any feild is missing if yes then tell the user
      return res.status(400).json({ message: "please provide all required fields" });
    }

    const user = await User.findOne({ email });
    if (!user) { // if the user dont exist in the db
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      // if password is incorrect 
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id.toString()); // generating the token 

    res.status(201).json({ // sending response ->success
      success: true,
      message: "user signed in successfully successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
});

export default router;