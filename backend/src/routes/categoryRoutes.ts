import express from "express";
import { getCategories } from "../controllers/productController";

const router = express.Router();

router.get("/", getCategories);// if  get/api/product -> then run getcategories fun

export default router;