import { Request, Response } from "express";
import Product from "../models/productModel";
import Category from "../models/categoryModel";

// @desc    Get all products or filter by category slug
// @route   GET /api/products
export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category } = req.query;
    let filter = {};

    if (category && category !== "all") {
      // Cast category as string to satisfy TypeScript
      filter = { category: category as string };
    }

    const products = await Product.find(filter);
    res.status(200).json(products);
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
};

// @desc    Get single product details by string ID
// @route   GET /api/products/:id
export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    // 1. Force extraction to a strict string primitive type
    const productId: string = String(req.params.id);

    // 2. Query Mongoose using the confirmed clean string variable
    const product = await Product.findOne({ id: productId });
    
    if (!product) {
      res.status(404).json({ message: "Perfume not found" });
      return; 
    }
    
    res.status(200).json(product);
  } catch (error: any) {
    res.status(500).json({ message: "Server error tracking down product", error: error.message });
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