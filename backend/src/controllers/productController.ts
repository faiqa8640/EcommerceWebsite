import { Request, Response } from "express";
import Product from "../models/productModel";
import Category from "../models/categoryModel";
import Review from "../models/reviewModel";

// @desc    Get all products or filter by category slug
// @route   GET /api/products
export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category } = req.query; 
    let filter = {};

    if (category && category !== "all") {
      filter = { category: category as string }; 
    }

    const products = await Product.find(filter); 
    res.status(200).json(products);
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
};

// @desc    Get single product details by string ID along with its individual reviews
// @route   GET /api/products/:id
export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const productId: string = String(req.params.id);

    // 1. Find the product in the db
    const product = await Product.findOne({ id: productId });
    
    if (!product) { 
      res.status(404).json({ message: "Fragrance product not found" });
      return; 
    }

    // 2. Gather all reviews written for this specific custom product ID
    const reviews = await Review.find({ productId: productId }).sort({ createdAt: -1 });

    // 3. Stencil the separate reviews directly into the returning object
    const productWithReviews = {
      ...product.toObject(),
      reviews: reviews
    };
    
    res.status(200).json(productWithReviews);
  } catch (error: any) {
    res.status(500).json({ message: "Server error tracking down product details", error: error.message });
  }
};

// @desc    Post a new review, saves it, then recalculates and updates averageRating on the product
// @route   POST /api/products/:productId/reviews
export const addProductReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId } = req.params;
    const { user, rating, comment } = req.body;

    if (!user || !rating || !comment) {
      res.status(400).json({ message: "All review fields are required" });
      return;
    }

    // 1. Save the new standalone review document
    const newReview = new Review({
      productId,
      user,
      rating: Number(rating),
      comment,
      date: new Date().toISOString().split('T')[0]
    });
    const savedReview = await newReview.save();

    // 2. Fetch ALL reviews for this product to recalculate fresh metrics
    const allReviews = await Review.find({ productId: productId as string });

    // 3. Calculate the new arithmetic average rating
    const total = allReviews.reduce((sum, r) => sum + r.rating, 0);
    const newAverage = allReviews.length > 0 ? parseFloat((total / allReviews.length).toFixed(1)) : 0;

    // 4. Update and cache the newly computed average directly onto the Product document
    await Product.findOneAndUpdate(
      { id: productId as string },
      { averageRating: newAverage },
      { runValidators: true }
    );

    res.status(201).json(savedReview);
  } catch (error: any) {
    console.error("Error writing to reviews collection:", error);
    res.status(500).json({ message: "Internal server error adding review", error: error.message });
  }
};

// @desc    Get all categories
// @route   GET /api/categories
export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.find(); 
    res.status(200).json(categories);
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching categories", error: error.message });
  }
};