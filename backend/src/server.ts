import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import productRoutes from "./routes/productRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import orderRoutes from './routes/orderRoutes';
import wishlistRoutes from "./routes/wishlistRoutes";
import uploadRoutes from "./routes/uploadRoutes"

dotenv.config();
connectDB();

const app = express();

app.use(express.json());// covert the json to the js object
app.use(express.urlencoded({ extended: true })); // covert the html data into the js object
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   })
// );
app.use(
  cors({
    origin: [process.env.CLIENT_URL || "http://localhost:5173"],
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/upload", uploadRoutes);


app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "Eloura API is running", status: "ok" });
});

// ADD THIS before app.listen()
app.use((err: any, req: any, res: any, next: any) => {
  console.error("💥 EXPRESS GLOBAL ERROR:", err);
  res.status(500).json({ message: err.message });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
