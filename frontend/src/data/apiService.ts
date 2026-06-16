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




export const createOrder = async (orderPayload: any): Promise<any> => {
  try {
    const token = localStorage.getItem('token'); 
    
    const response = await fetch('http://localhost:5000/api/orders', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(orderPayload),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(errorBody.message || `Server Error: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error inside apiService.ts:", error.message);
    throw error;
  }
};


// Fetch logged-in user's populated wishlist
export const fetchWishlist = async (): Promise<Product[]> => {
  try {
    const token = localStorage.getItem("token");
    if (!token || token.trim() === "") {
      console.warn("⚠️ No token available in localStorage.");
      return [];
    }

    const response = await fetch(`${API_BASE_URL}/wishlist`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      console.error("❌ Wishlist fetch unauthorized. Stale or invalid token.");
      return [];
    }

    if (!response.ok) {
      throw new Error(`Server returned status code: ${response.status}`);
    }

    const data = await response.json();
    // Return data directly if it's already an array, otherwise check for a wrapped property
    return Array.isArray(data) ? data : (data.wishlist || []);
  } catch (error: any) {
    console.error("❌ Error loading wishlist inside apiService.ts:", error.message);
    return []; // Return empty array fallback so UI rendering context never breaks
  }
};

// Add a product ID to the user's document array
export const addToWishlistAPI = async (productId: string): Promise<any> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Authentication token required to save items");

    const response = await fetch(`${API_BASE_URL}/wishlist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to add to wishlist");
    return data;
  } catch (error: any) {
    console.error("Error adding to wishlist API:", error.message);
    throw error;
  }
};

// Remove an explicit product ID from the user's array
export const removeFromWishlistAPI = async (productId: string): Promise<any> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Authentication token required");

    const response = await fetch(`${API_BASE_URL}/wishlist/${productId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to remove from wishlist");
    return data;
  } catch (error: any) {
    console.error("Error removing from wishlist API:", error.message);
    throw error;
  }
};