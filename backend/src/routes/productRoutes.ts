// import express from "express";
// import { getProducts, getProductById } from "../controllers/productController"; // Added .js extension if needed by your setup
// import Product from "../models/productModel"; // Fixed: Changed from require to ES Import

// const router = express.Router();

// // GET all products
// router.get("/", getProducts); 

// // GET single product by ID
// router.get("/:id", getProductById); 
// // POST /api/products/:productId/reviews
// router.post('/:productId/reviews', async (req, res) => {
//   try {
//     const { productId } = req.params;
//     const { user, rating, comment } = req.body;

//     if (!user || !rating || !comment) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     // Search by your custom string 'id' field instead of default '_id'
//     const product = await Product.findOne({ id: productId });
//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     // Create the clean review object matching your IReview interface
//     const newReview = {
//       user,
//       rating: Number(rating),
//       comment,
//       date: new Date().toISOString().split('T')[0]
//     };

//     if (!product.reviews) {
//       product.reviews = [];
//     }

//     // Typecast to 'any' or 'IReview' during the push to satisfy TypeScript's strict check
//     product.reviews.push(newReview as any);
    
//     // Mark the sub-document path as modified so Mongoose saves it reliably
//     product.markModified('reviews');
//     await product.save();

//     const savedReview = product.reviews[product.reviews.length - 1];
//     return res.status(201).json(savedReview);

//   } catch (error) {
//     console.error("Error saving review to database:", error);
//     let errorMessage = "An unknown error occurred";
//     if (error instanceof Error) errorMessage = error.message;
    
//     return res.status(500).json({ message: "Internal server error", error: errorMessage });
//   }
// });

// export default router;



import express from "express";
import { getProducts, getProductById } from "../controllers/productController";
import Product from "../models/productModel";
import Review from "../models/reviewModel"; // Import your brand-new model

const router = express.Router();

router.get("/", getProducts); 

// 1. GET Single Product BY ID + Pull its respective reviews dynamically
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the product item
    const product = await Product.findOne({ id: id }); 
    if (!product) {
      return res.status(404).json({ message: "Fragrance product not found" });
    }

    // Pull all corresponding reviews from the new dedicated collection
    const reviews = await Review.find({ productId: id }).sort({ createdAt: -1 });

    // Combine them safely into a single JSON response for your frontend
    const productWithReviews = {
      ...product.toObject(),
      reviews: reviews
    };

    return res.status(200).json(productWithReviews);
  } catch (error) {
    return res.status(500).json({ message: "Server error fetching product details", error });
  }
});

// 2. POST /api/products/:productId/reviews -> Save to the new isolated collection
router.post('/:productId/reviews', async (req, res) => {
  try {
    const { productId } = req.params;
    const { user, rating, comment } = req.body;

    if (!user || !rating || !comment) {
      return res.status(400).json({ message: "All review fields are required" });
    }

    // Create a new separate document inside the reviews collection
    const newReview = new Review({
      productId, // link identifier
      user,
      rating: Number(rating),
      comment,
      date: new Date().toISOString().split('T')[0]
    });

    const savedReview = await newReview.save();
    return res.status(201).json(savedReview);

  } catch (error) {
    console.error("Error writing to reviews collection:", error);
    let errorMessage = "An unknown error occurred";
    if (error instanceof Error) errorMessage = error.message;
    
    return res.status(500).json({ message: "Internal server error", error: errorMessage });
  }
});

export default router;