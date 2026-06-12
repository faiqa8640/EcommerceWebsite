import express from "express";
import { 
  getProducts, 
  getProductById, 
  addProductReview ,
  // createProduct
} from "../controllers/productController";

const router = express.Router();

// @route   GET /api/products
router.get("/", getProducts);

// @route   GET /api/products/:id (Fetches product info combined with its reviews)
router.get("/:id", getProductById);

// @route   POST /api/products/:productId/reviews (Adds a standalone review & updates averageRating)
router.post("/:productId/reviews", addProductReview);

// router.post("/", createProduct);

export default router;