import express from "express";
import { getCategories,
      createCategory,
      updateCategory,
      deleteCategory,
} from "../controllers/productController";
import { protect , adminOnly} from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", getCategories);// if  get/api/product -> then run getcategories fun

// -----------------
// CATEGORY CRUD
// --------------------
// Admin protected routes
router.post('/', protect, adminOnly, createCategory);
router.put('/:id', protect, adminOnly, updateCategory);
router.delete('/:id', protect, adminOnly, deleteCategory);

export default router;