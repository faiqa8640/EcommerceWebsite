import express from "express";
import { getProducts, getProductById } from "../controllers/productController";
import Product from "../models/productModel";
import Review from "../models/reviewModel";

const router = express.Router();

router.get("/", getProducts);

// GET single product by ID + its reviews
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findOne({ id: id });
    if (!product) {
      return res.status(404).json({ message: "Fragrance product not found" });
    }

    const reviews = await Review.find({ productId: id }).sort({ createdAt: -1 });

    const productWithReviews = {
      ...product.toObject(),
      reviews: reviews
    };

    return res.status(200).json(productWithReviews);
  } catch (error) {
    return res.status(500).json({ message: "Server error fetching product details", error });
  }
});

// POST a new review — saves it, then recalculates and updates averageRating on the product
router.post('/:productId/reviews', async (req, res) => {
  try {
    const { productId } = req.params;
    const { user, rating, comment } = req.body;

    if (!user || !rating || !comment) {
      return res.status(400).json({ message: "All review fields are required" });
    }

    // 1. Save the new review
    const newReview = new Review({
      productId,
      user,
      rating: Number(rating),
      comment,
      date: new Date().toISOString().split('T')[0]
    });
    const savedReview = await newReview.save();

    // 2. Fetch ALL reviews for this product (including the one just saved)
    const allReviews = await Review.find({ productId });

    // 3. Calculate the new average
    const total = allReviews.reduce((sum, r) => sum + r.rating, 0);
    const newAverage = parseFloat((total / allReviews.length).toFixed(1));

    // 4. Save the new average back into the Product document in MongoDB
    await Product.findOneAndUpdate(
      { id: productId },
      { averageRating: newAverage }
    );

    return res.status(201).json(savedReview);

  } catch (error) {
    console.error("Error writing to reviews collection:", error);
    let errorMessage = "An unknown error occurred";
    if (error instanceof Error) errorMessage = error.message;
    return res.status(500).json({ message: "Internal server error", error: errorMessage });
  }
});

export default router;