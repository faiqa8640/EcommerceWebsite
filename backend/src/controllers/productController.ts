import { Request, Response } from "express"; // this is a request and reponse object 
import Product from "../models/productModel";
import Category from "../models/categoryModel";
import Review from "../models/reviewModel";

// @desc    Get all products or filter by category slug
// @route   GET /api/products
export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category } = req.query;  // get the category from the url .. if url = api/men ->category-men
    let filter = {}; //to store the object 

    if (category && category !== "all") { // if category exits and it is not equal to the all 
      filter = { category: category as string };  // then filter= {category:men}
    }

    const products = await Product.find(filter);  // now getting the products based on the products
    res.status(200).json(products);// return the response->send the products based on the category
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
};

// @desc    Get single product details by string ID along with its individual reviews
// @route   GET /api/products/:id
export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const productId: string = String(req.params.id); // get the product id from the url okay ->i.e allure

    // 1. Find the product in the db
    const product = await Product.findOne({ id: productId });// find that product into db 
    
    if (!product) { // if product not find -> then return error 
      res.status(404).json({ message: "Fragrance product not found" });
      return; 
    }

    // 2. Gather all reviews written for this specific custom product ID
    const reviews = await Review.find({ productId: productId }).sort({ createdAt: -1 });
    // get all the reviews and newest will come first

    // 3. sending the review with the product 
    const productWithReviews = {
      ...product.toObject(),// convert the product to the object
      reviews: reviews // and the review we get attach them
    };
    
    res.status(200).json(productWithReviews); // and returning the product +its all reviews
  } catch (error: any) {
    res.status(500).json({ message: "Server error tracking down product details", error: error.message });
  }
};

//handling the logic of adding the review 

// @desc    Post a new review, saves it, then recalculates and updates averageRating on the product
// @route   POST /api/products/:productId/reviews
export const addProductReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId } = req.params;// from the url get the product
    const { user, rating, comment } = req.body;// from the body get the user , rating and comment

    if (!user || !rating || !comment) {// if anything is missing then generate the errror
      res.status(400).json({ message: "All review fields are required" });
      return;
    }

    // 1. it create a new review record
    const newReview = new Review({
      productId,
      user,
      rating: Number(rating),// as frontend send the data as a string so we convert that into the number
      comment,
      date: new Date().toISOString().split('T')[0]// create the current date and time  but we are only taking the date part
    });
    const savedReview = await newReview.save(); // save the new review

    // 2. Fetch ALL reviews for this product to recalculate fresh metrics
    const allReviews = await Review.find({ productId: productId as string });
    // get then all the review of that collection 

    // 3. Calculate the new arithmetic average rating
    const total = allReviews.reduce((sum, r) => sum + r.rating, 0);// calcuate the total fo review ranting i.e 3+4+5 = 12
    const newAverage = allReviews.length > 0 ? parseFloat((total / allReviews.length).toFixed(1)) : 0;
    // if the  review exist then we calculate the avg and we round off to the one decimal place and store it in the flot form 

    // 4. Update the product in to the db 
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
    const categories = await Category.find(); // it get all te categories -> we need them in shop function
    res.status(200).json(categories);
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching categories", error: error.message });
  }
};