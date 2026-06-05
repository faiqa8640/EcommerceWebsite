import express, { Request, Response } from "express";
import dotenv from "dotenv"; // is used to load envirnment ->.env
import cors from "cors"; // cors-> cross origin resouce sharing
import connectDB from "./config/db";
import authRoutes from "./routes/auth";

dotenv.config();// loading the envirnmennt
connectDB();///connecting to the db

const app = express();

// middleware
app.use(express.json()); //covert the user data (Email and password) to json
app.use(express.urlencoded({ extended: true }));//it handle the form submission
app.use(cors()); // it allow frontend to call the backend api

// routes
app.use("/api/auth", authRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Backend is running");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});