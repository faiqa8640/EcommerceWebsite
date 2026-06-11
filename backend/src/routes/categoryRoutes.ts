import express from "express";
import { getCategories } from "../controllers/productController";

const router = express.Router();

router.get("/", getCategories);

export default router;