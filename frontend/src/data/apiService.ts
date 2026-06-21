import { Product, Order, OrderPayload, Review , ApiResponse} from "../types";

const API_BASE_URL = "http://localhost:5000/api";

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {}),
  };
};

// --- Product API ---
export const fetchProducts = async (categorySlug?: string): Promise<Product[]> => {
  try {
    const url = categorySlug && categorySlug !== "all" 
      ? `${API_BASE_URL}/products?category=${categorySlug}`
      : `${API_BASE_URL}/products`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch products");
    return await response.json();
  } catch (error) {
    console.error("fetchProducts Error:", error);
    return [];
  }
};

export const fetchProductById = async (id: string): Promise<Product | undefined> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    if (!response.ok) throw new Error("Product not found");
    return await response.json();
  } catch (error) {
    console.error(`fetchProductById (${id}) Error:`, error);
    return undefined;
  }
};



export const createOrder = async (orderPayload: any): Promise<ApiResponse<Order>> => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(orderPayload)
  });

  const data = await response.json();
  
  // Return the full response object
  return data;
};

// Fetch a single order by its ID — used by the Thank You / order confirmation page
export const getOrderByIdAPI = async (orderId: string): Promise<ApiResponse<Order>> => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const data = await response.json();
  return data;
};

// Customer cancels their own order (only works while status is before "Shipped")
export const cancelOrderAPI = async (orderId: string, reason?: string): Promise<ApiResponse<Order>> => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}/cancel`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ reason }),
  });

  const data = await response.json();
  return data;
};

// --- Wishlist API ---
export const getWishlistAPI = async (): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/wishlist`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error("Failed to fetch wishlist");
    return await response.json();
  } catch (error) {
    console.error("getWishlistAPI Error:", error);
    return [];
  }
};

export const addToWishlistAPI = async (productId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/wishlist`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ productId }),
    });
    if (!response.ok) throw new Error("Failed to add to wishlist");
    return await response.json();
  } catch (error) {
    console.error("addToWishlistAPI Error:", error);
    throw error;
  }
};

export const removeFromWishlistAPI = async (productId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/wishlist/${productId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to remove from wishlist");
    return await response.json();
  } catch (error) {
    console.error("removeFromWishlistAPI Error:", error);
    throw error;
  }
};



export const addReviewAPI = async (productId: string, rating: number, comment: string): Promise<any> => {
  try {
    const token = localStorage.getItem("token");
    // .trim() removes accidental spaces or newlines that cause "Invalid ID" errors
    const cleanId = productId.trim(); 

    const response = await fetch(`${API_BASE_URL}/products/${cleanId}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token || ""}`,
      },
      body: JSON.stringify({ rating, comment }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to submit review");
    return data;
  } catch (error: any) {
    console.error("Error in addReviewAPI:", error.message);
    throw error;
  }
};

// --- Categories API ---
export const fetchCategories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`);
    if (!response.ok) throw new Error("Failed to fetch categories");
    return await response.json();
  } catch (error) {
    console.error("fetchCategories Error:", error);
    return [];
  }
};



