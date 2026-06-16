import express from "express";
import { protect } from "../middleware/authMiddleware";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} from "../controllers/wishlistController";

const router = express.Router();

// mandate authorization for all endpoints downstream on this path
router.use(protect);

router.route("/")
  .get(getWishlist)
  .post(addToWishlist);

router.route("/clear")
  .delete(clearWishlist);

router.route("/:id")
  .delete(removeFromWishlist);

export default router;