
import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware";
import { getProfile, updateAddress, getAdminData , updateProfileSettings} from "../controllers/userController";

const router = express.Router(); 

// Profile matching parameters
router.get("/profile", protect, getProfile);

// Address update connector match -> handles PUT requests seamlessly
router.put("/address", protect, updateAddress);

// Admin spaces
router.get("/admin-only", protect, adminOnly, getAdminData);

// to update the setting of the user .. 
router.put("/update-settings", protect, updateProfileSettings);

export default router;