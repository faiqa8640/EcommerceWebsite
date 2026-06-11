import express from "express";
import { getProducts, getProductById } from "../controllers/productController";

const router = express.Router();

router.get("/", getProducts); // if  get/api/product -> then run getproducts fun 
router.get("/:id", getProductById); // if get/api/ products/allure-> then run products by id

export default router;