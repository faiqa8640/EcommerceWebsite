import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import User from "../models/userModel";

// @desc    Get logged-in user's wishlist items
// @route   GET /api/wishlist
// @access  Private
export const getWishlist = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?.id).populate("wishlist");
    if (!user) {
      return res.status(404).json({ message: "User account not found" });
    }
    res.status(200).json(user.wishlist);
  } catch (error: any) {
    res.status(500).json({ message: "Server error fetching wishlist", error: error.message });
  }
};

// @desc    Add a product to wishlist
// @route   POST /api/wishlist
// @access  Private
export const addToWishlist = async (req: AuthRequest, res: Response) => {
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({ message: "Product ID is required" });
  }

  try {
    const user = await User.findById(req.user?.id);
    if (!user) {
      return res.status(404).json({ message: "User account not found" });
    }

    // Check if the product is already in the wishlist array
    const isAlreadyAdded = user.wishlist.some(
      (id) => id.toString() === productId
    );

    if (isAlreadyAdded) {
      return res.status(400).json({ message: "Product is already in your wishlist" });
    }

    // Push the productId into the user's embedded wishlist array
    user.wishlist.push(productId as any);
    await user.save();

    res.status(200).json({ message: "Product added to wishlist successfully" });
  } catch (error: any) {
    res.status(500).json({ message: "Server error adding to wishlist", error: error.message });
  }
};

// @desc    Remove a single item from wishlist
// @route   DELETE /api/wishlist/:id
// @access  Private
export const removeFromWishlist = async (req: AuthRequest, res: Response) => {
  const productIdToRemove = req.params.id;

  try {
    const user = await User.findById(req.user?.id);
    if (!user) {
      return res.status(404).json({ message: "User account not found" });
    }

    // Filter out the target product ID from the array
    user.wishlist = user.wishlist.filter(
      (id) => id.toString() !== productIdToRemove
    );
    
    await user.save();
    res.status(200).json({ message: "Product removed from wishlist" });
  } catch (error: any) {
    res.status(500).json({ message: "Server error removing from wishlist", error: error.message });
  }
};

// @desc    Clear entire wishlist array
// @route   DELETE /api/wishlist/clear
// @access  Private
export const clearWishlist = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?.id);
    if (!user) {
      return res.status(404).json({ message: "User account not found" });
    }

    // Reset array to empty state
    user.wishlist = [];
    await user.save();

    res.status(200).json({ message: "Wishlist cleared completely" });
  } catch (error: any) {
    res.status(500).json({ message: "Server error clearing wishlist", error: error.message });
  }
};