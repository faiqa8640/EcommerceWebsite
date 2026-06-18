import express from "express";
import {
  getProducts,
  getProductById,
  addProductReview,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController";
import { protect , adminOnly} from "../middleware/authMiddleware";

const router = express.Router();

// GET /api/products            → list all products (optionally filtered by ?category=)
router.get("/", getProducts);

// -----------------
// PRODUCT CRUD
// --------------------
// Protected Admin routes (Use your middleware to ensure only admins can perform these)
router.post('/', protect, adminOnly, createProduct); 
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);


// GET /api/products/:id        → single product + its reviews
router.get("/:id", getProductById);

// POST /api/products/:id/reviews   → add a review (must be logged in)
router.post("/:id/reviews", protect, addProductReview);

export default router;
