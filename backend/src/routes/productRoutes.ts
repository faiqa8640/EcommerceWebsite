import express from "express";
import {
  getProducts,
  getProductById,
  addProductReview,
} from "../controllers/productController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

// GET /api/products            → list all products (optionally filtered by ?category=)
router.get("/", getProducts);

// GET /api/products/:id        → single product + its reviews
router.get("/:id", getProductById);

// POST /api/products/:id/reviews   → add a review (must be logged in)
router.post("/:id/reviews", protect, addProductReview);

export default router;
