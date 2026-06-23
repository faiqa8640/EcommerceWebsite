import { Router } from "express";
import { protect } from "../middleware/authMiddleware";
import {
  getMyAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../controllers/addressController";

const router = Router();

// All address routes require authentication
router.get("/", protect, getMyAddresses);
router.post("/", protect, addAddress);
router.put("/:id", protect, updateAddress);
router.delete("/:id", protect, deleteAddress);
router.patch("/:id/set-default", protect, setDefaultAddress);

export default router;
