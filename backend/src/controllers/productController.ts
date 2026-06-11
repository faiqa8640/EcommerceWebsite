import { Request, Response } from "express";
import Product from "../models/productModel";
import Category from "../models/categoryModel";

// @desc    Get all products or filter by category slug
// @route   GET /api/products
export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category } = req.query; // if the category =men 
    let filter = {};// create a filer object 

    // category based filering 
    if (category && category !== "all") {
      // Cast category as string to satisfy TypeScript
      filter = { category: category as string }; // it will return only men perfume
    }

    const products = await Product.find(filter); // return the men category perfumes
    res.status(200).json(products);
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching products", error: error.message }); //errors

  }
};

// ---------------------
// it search one object and return it 
// ---------------------

// @desc    Get single product details by string ID
// @route   GET /api/products/:id
export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    //GET /api/products/allure
    // 1. Force extraction to a strict string primitive type
    const productId: string = String(req.params.id);

    // 2. find the product in the db
    const product = await Product.findOne({ id: productId });
    
    if (!product) { // if no product found
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
    const categories = await Category.find(); // find the categories in db 
    res.status(200).json(categories);
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching categories", error: error.message });
  }
};