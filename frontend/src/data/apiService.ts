;import { Product, Category } from "../types";
const API_BASE_URL = "http://localhost:5000/api";

// Fetch all products or filter by category directly from MongoDB
export const fetchProducts = async (categorySlug?: string): Promise<Product[]> => {
  try {
    const url = categorySlug && categorySlug !== "all" 
      ? `${API_BASE_URL}/products?category=${categorySlug}`
      : `${API_BASE_URL}/products`;
      
    const response = await fetch(url);// fetching the object 
    if (!response.ok) throw new Error("Failed to fetch products");
    return await response.json();
  } catch (error) {
    console.error("Error loading products from server:", error);
    return []; // Fallback to empty array so frontend doesn't crash
  }
};

// Fetch a single perfume's details by its string ID (e.g., 'allure')
export const fetchProductById = async (id: string): Promise<Product | undefined> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    if (!response.ok) return undefined;
    return await response.json();
  } catch (error) {
    console.error(`Error loading product ${id}:`, error);
    return undefined;
  }
};

// Fetch all categories from MongoDB
export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`);
    if (!response.ok) throw new Error("Failed to fetch categories");
    return await response.json();
  } catch (error) {
    console.error("Error loading categories from server:", error);
    return [];
  }
};