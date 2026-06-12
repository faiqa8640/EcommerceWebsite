import express from "express";
import { getProducts, getProductById } from "../controllers/productController"; // Added .js extension if needed by your setup
import Product from "../models/productModel"; // Fixed: Changed from require to ES Import

const router = express.Router();

// GET all products
router.get("/", getProducts); 

// GET single product by ID
router.get("/:id", getProductById); 
// POST /api/products/:productId/reviews
router.post('/:productId/reviews', async (req, res) => {
  try {
    const { productId } = req.params;
    const { user, rating, comment } = req.body;

    if (!user || !rating || !comment) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Search by your custom string 'id' field instead of default '_id'
    const product = await Product.findOne({ id: productId });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Create the clean review object matching your IReview interface
    const newReview = {
      user,
      rating: Number(rating),
      comment,
      date: new Date().toISOString().split('T')[0]
    };

    if (!product.reviews) {
      product.reviews = [];
    }

    // Typecast to 'any' or 'IReview' during the push to satisfy TypeScript's strict check
    product.reviews.push(newReview as any);
    
    // Mark the sub-document path as modified so Mongoose saves it reliably
    product.markModified('reviews');
    await product.save();

    const savedReview = product.reviews[product.reviews.length - 1];
    return res.status(201).json(savedReview);

  } catch (error) {
    console.error("Error saving review to database:", error);
    let errorMessage = "An unknown error occurred";
    if (error instanceof Error) errorMessage = error.message;
    
    return res.status(500).json({ message: "Internal server error", error: errorMessage });
  }
});

export default router;