//  this check that weather the user if login or admin
// Protects routes — verifies JWT and attaches user to request
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken"; // used to verify token
import User from "../models/userModel";

// Extend Express Request to carry the authenticated user
export interface AuthRequest extends Request {
  user?: { // after login we want req.user so for that purpose  so after it the typescript understand req.user
    id: string;
    name: string;
    email: string;
    role: string;
    isVerified: boolean;
  };
}

//  check ->are you login?
// ─── protect: require valid JWT ───────────────────────────────────────────────
export const protect = async ( // prtect middle ware -> this run before protect routes
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let token: string | undefined; // get the token
    
    // this check that the fronent send the token with a request 
    // Token expected in Authorization header: "Bearer <token>"
    if ( // get the authentication header
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1]; // extract the token from the header
    }

    if (!token) { // if token not found
      return res
        .status(401)
        .json({ message: "Not authorized — no token provided" });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) { // check jwt secret 
      return res.status(500).json({ message: "JWT secret not configured" });
    }

    // Verify token and decode payload
    const decoded = jwt.verify(token, secret) as { id: string }; // it verify the token
    // is it created by sever, has expired? or is modifed?


    // IF VALID TOKEN -> find the user 
    // Fetch fresh user data from DB (ensures token isn't from a deleted account)
    const user = await User.findById(decoded.id).select("-password"); //
    if (!user) {
      return res
        .status(401)
        .json({ message: "Not authorized — user not found" });
    }

    //  in simple words we are storing the user in the middleware so that we dont neend to do findone etc we can directly assess the user 
    // Attach user to request for use in route handlers -> now after it we can use the req.user.name etc in the controlleretc 
    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    };

    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized — invalid or expired token" });
  }
};

// ─── adminOnly: require admin role ───────────────────────────────────────────
export const adminOnly = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== "admin") { // if the admin has login or not 
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};


















