import { Request, Response } from "express"; 
import mongoose from "mongoose";
import Product from "../models/productModel";
import Category from "../models/categoryModel";
import Review from "../models/reviewModel";
import { AuthRequest } from "../middleware/authMiddleware";

// @desc    Get all products or filter by category slug
// @route   GET /api/products
export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category } = req.query;  
    let filter = {}; 

    if (category && typeof category === "string" && category !== "all") { 
      filter = { category: category };  
    }

    const products = await Product.find(filter);  
    res.status(200).json(products);
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
};

// @desc    Get single product details by native database ObjectId along with its reviews
// @route   GET /api/products/:id
export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Type Guard Fix: Explicitly ensure 'id' is a singular string and a valid ObjectId
    if (!id || typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid native product identifier code sequence" });
      return;
    }

    // Aligned to use standard native primary key safely
    const product = await Product.findById(id);

    if (!product) {
      res.status(404).json({ message: "Product profile not found in tracking records" });
      return;
    }

    // Fetch the separated relational reviews targeting the product document
    const reviews = await Review.find({ productId: product._id }).sort({ createdAt: -1 });

    res.status(200).json({
      ...product.toObject(),
      reviews: reviews
    });
  } catch (error: any) {
    res.status(500).json({ message: "Error querying internal collections", error: error.message });
  }
};

export const addProductReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    console.log("DEBUG: Received ID from params:", id);
    const { rating, comment } = req.body;

    // 1. Validate Authentication
    // NOTE: authMiddleware's AuthRequest sets req.user.id (a string), not req.user._id
    if (!req.user || !req.user.id) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }

    // 2. Normalize and Validate Product ID
    // Check if ID exists, is a string, and is a valid MongoDB ObjectId
    if (!id || typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid or missing product ID" });
      return;
    }

    const productObjectId = new mongoose.Types.ObjectId(id);

    // 3. Verify Product Existence
    const targetProduct = await Product.findById(productObjectId);
    if (!targetProduct) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    // 4. Create Review
    // Mapping: req.user._id (ObjectId) and req.user.name (Snapshot)
    const newReview = new Review({
      productId: productObjectId,
      userId: new mongoose.Types.ObjectId(req.user.id),
      userName: req.user.name,
      rating: Number(rating),
      comment: comment.trim()
    });

    const savedReview = await newReview.save();

    // 5. Update Average Rating
    const allReviews = await Review.find({ productId: productObjectId });
    const total = allReviews.reduce((sum, r) => sum + r.rating, 0);
    const newAverage = allReviews.length > 0 
      ? parseFloat((total / allReviews.length).toFixed(1)) 
      : 0;

    await Product.findByIdAndUpdate(
      productObjectId,
      { averageRating: newAverage },
      { runValidators: true }
    );

    res.status(201).json(savedReview);

  } catch (error: any) {
    // 6. Handle Unique Index Violation (User already reviewed)
    if (error.code === 11000) {
      res.status(400).json({ message: "You have already reviewed this product" });
    } else {
      console.error("Error adding review:", error);
      res.status(500).json({ message: "Internal server error adding review", error: error.message });
    }
  }
};

// @desc    Get all categories
// @route   GET /api/categories
export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.find({});
    res.status(200).json(categories);
  } catch (error: any) {
    res.status(500).json({ message: "Error mapping category records", error: error.message });
  }
};


// -------------------
// for the admin ->PRODUCT CRUD
// -------------------

// @desc    Create a new product
// @route   POST /api/products
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json({ success: true, product: savedProduct });
  } catch (error: any) {
    res.status(500).json({ message: "Error creating product", error: error.message });
  }
};

// @desc    Update an existing product
// @route   PUT /api/products/:id
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
    
    if (!updatedProduct) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    
    res.status(200).json({ success: true, product: updatedProduct });
  } catch (error: any) {
    res.status(500).json({ message: "Error updating product", error: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    
    if (!deletedProduct) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    
    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: "Error deleting product", error: error.message });
  }
};


// -------------------
// for the admin ->CATEGORY CRUD
// -------------------

// @desc    Create a new category
// @route   POST /api/categories
export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const newCategory = new Category(req.body);
    const savedCategory = await newCategory.save();
    res.status(201).json({ success: true, category: savedCategory });
  } catch (error: any) {
    res.status(500).json({ message: "Error creating category", error: error.message });
  }
};

// @desc    Update an existing category
// @route   PUT /api/categories/:id
export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updatedCategory = await Category.findByIdAndUpdate(id, req.body, { new: true });
    
    if (!updatedCategory) {
      res.status(404).json({ message: "Category not found" });
      return;
    }
    
    res.status(200).json({ success: true, category: updatedCategory });
  } catch (error: any) {
    res.status(500).json({ message: "Error updating category", error: error.message });
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedCategory = await Category.findByIdAndDelete(id);
    
    if (!deletedCategory) {
      res.status(404).json({ message: "Category not found" });
      return;
    }
    
    res.status(200).json({ success: true, message: "Category deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: "Error deleting category", error: error.message });
  }
};