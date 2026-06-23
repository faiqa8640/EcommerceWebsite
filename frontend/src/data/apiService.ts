// import { Product, Order, OrderPayload, Review , ApiResponse} from "../types";

// const API_BASE_URL = "http://localhost:5000/api"; // backend url 

// const getAuthHeaders = (): HeadersInit => { // automatically attach the jwt token to the request
//   const token = localStorage.getItem("token"); // get the token
//   return {
//     "Content-Type": "application/json", // build header
//     ...(token ? { "Authorization": `Bearer ${token}` } : {}), // if token exist the n added to header of request 
//   };
// };

// // --- Product API --- // fetch the produtcs
// export const fetchProducts = async (categorySlug?: string): Promise<Product[]> => {
//   try {
//     const url = categorySlug && categorySlug !== "all" 
//       ? `${API_BASE_URL}/products?category=${categorySlug}`
//       : `${API_BASE_URL}/products`;
    
//     const response = await fetch(url); // wait for responce 
//     if (!response.ok) throw new Error("Failed to fetch products");
//     return await response.json();
//   } catch (error) {
//     console.error("fetchProducts Error:", error);
//     return [];
//   }
// };


// // fetch products by it 
// export const fetchProductById = async (id: string): Promise<Product | undefined> => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/products/${id}`);
//     if (!response.ok) throw new Error("Product not found");
//     return await response.json();
//   } catch (error) {
//     console.error(`fetchProductById (${id}) Error:`, error);
//     return undefined;
//   }
// };


// //create the order
// export const createOrder = async (orderPayload: any): Promise<ApiResponse<Order>> => {
//   const token = localStorage.getItem('token'); // send the token  coz only the authorized user can create the order 
//   const response = await fetch(`${API_BASE_URL}/orders`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${token}`
//     },
//     body: JSON.stringify(orderPayload)
//   });

//   const data = await response.json();
  
//   // Return the full response object
//   return data;
// };

// // Fetch a single order by its ID — used by the Thank You / order confirmation page
// export const getOrderByIdAPI = async (orderId: string): Promise<ApiResponse<Order>> => {
//   const token = localStorage.getItem('token'); // authorization
//   const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
//     headers: {
//       'Content-Type': 'application/json',
//       ...(token ? { Authorization: `Bearer ${token}` } : {}),
//     },
//   });

//   const data = await response.json();
//   return data;
// };

// // Customer cancels their own order (only works while status is before "Shipped")
// export const cancelOrderAPI = async (orderId: string, reason?: string): Promise<ApiResponse<Order>> => {
//   const token = localStorage.getItem('token');
//   const response = await fetch(`${API_BASE_URL}/orders/${orderId}/cancel`, {
//     method: 'PATCH',
//     headers: {
//       'Content-Type': 'application/json',
//       ...(token ? { Authorization: `Bearer ${token}` } : {}),
//     },
//     body: JSON.stringify({ reason }),
//   });

//   const data = await response.json();
//   return data;
// };

// // --- Wishlist API --- 
// //fetch user whishlist
// export const getWishlistAPI = async (): Promise<Product[]> => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/wishlist`, { headers: getAuthHeaders() });
//     if (!response.ok) throw new Error("Failed to fetch wishlist");
//     return await response.json();
//   } catch (error) {
//     console.error("getWishlistAPI Error:", error);
//     return [];
//   }
// };

// export const addToWishlistAPI = async (productId: string) => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/wishlist`, {
//       method: "POST",
//       headers: getAuthHeaders(),
//       body: JSON.stringify({ productId }), // backend send req.boy.productId
//     });
//     if (!response.ok) throw new Error("Failed to add to wishlist");
//     return await response.json();
//   } catch (error) {
//     console.error("addToWishlistAPI Error:", error);
//     throw error;
//   }
// };

// export const removeFromWishlistAPI = async (productId: string) => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/wishlist/${productId}`, {
//       method: "DELETE",
//       headers: getAuthHeaders(),
//     });
//     if (!response.ok) throw new Error("Failed to remove from wishlist");
//     return await response.json();
//   } catch (error) {
//     console.error("removeFromWishlistAPI Error:", error);
//     throw error;
//   }
// };



// export const addReviewAPI = async (productId: string, rating: number, comment: string): Promise<any> => {
//   try {
//     const token = localStorage.getItem("token");
//     // .trim() removes accidental spaces or newlines that cause "Invalid ID" errors
//     const cleanId = productId.trim(); 

//     const response = await fetch(`${API_BASE_URL}/products/${cleanId}/reviews`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token || ""}`,
//       },
//       body: JSON.stringify({ rating, comment }),
//     });

//     const data = await response.json();
//     if (!response.ok) throw new Error(data.message || "Failed to submit review");
//     return data;
//   } catch (error: any) {
//     console.error("Error in addReviewAPI:", error.message);
//     throw error;
//   }
// };

// // --- Categories API ---
// export const fetchCategories = async () => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/categories`);
//     if (!response.ok) throw new Error("Failed to fetch categories");
//     return await response.json();
//   } catch (error) {
//     console.error("fetchCategories Error:", error);
//     return [];
//   }
// };


import { Product, Order, OrderPayload, Review, ApiResponse, Address, AddressPayload } from "../types";

const API_BASE_URL = "http://localhost:5000/api";

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// ─── Products ──────────────────────────────────────────────────────────────────

export const fetchProducts = async (categorySlug?: string): Promise<Product[]> => {
  try {
    const url =
      categorySlug && categorySlug !== "all"
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

// ─── Orders ───────────────────────────────────────────────────────────────────

export const createOrder = async (orderPayload: OrderPayload): Promise<ApiResponse<Order>> => {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(orderPayload),
  });
  return response.json();
};

export const getOrderByIdAPI = async (orderId: string): Promise<ApiResponse<Order>> => {
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
    headers: getAuthHeaders(),
  });
  return response.json();
};

export const cancelOrderAPI = async (orderId: string, reason?: string): Promise<ApiResponse<Order>> => {
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}/cancel`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ reason }),
  });
  return response.json();
};

// ─── Addresses ────────────────────────────────────────────────────────────────

export const getAddressesAPI = async (): Promise<Address[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/addresses`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch addresses");
    const data = await response.json();
    return data.addresses || [];
  } catch (error) {
    console.error("getAddressesAPI Error:", error);
    return [];
  }
};

export const addAddressAPI = async (payload: AddressPayload): Promise<ApiResponse<Address>> => {
  const response = await fetch(`${API_BASE_URL}/addresses`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return response.json();
};

export const updateAddressAPI = async (id: string, payload: Partial<AddressPayload>): Promise<ApiResponse<Address>> => {
  const response = await fetch(`${API_BASE_URL}/addresses/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return response.json();
};

export const deleteAddressAPI = async (id: string): Promise<ApiResponse> => {
  const response = await fetch(`${API_BASE_URL}/addresses/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return response.json();
};

export const setDefaultAddressAPI = async (id: string): Promise<ApiResponse<Address>> => {
  const response = await fetch(`${API_BASE_URL}/addresses/${id}/set-default`, {
    method: "PATCH",
    headers: getAuthHeaders(),
  });
  return response.json();
};

// ─── Wishlist ─────────────────────────────────────────────────────────────────

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
  const response = await fetch(`${API_BASE_URL}/wishlist`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ productId }),
  });
  if (!response.ok) throw new Error("Failed to add to wishlist");
  return response.json();
};

export const removeFromWishlistAPI = async (productId: string) => {
  const response = await fetch(`${API_BASE_URL}/wishlist/${productId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to remove from wishlist");
  return response.json();
};

// ─── Reviews ──────────────────────────────────────────────────────────────────

export const addReviewAPI = async (productId: string, rating: number, comment: string): Promise<any> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/products/${productId.trim()}/reviews`, {
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
};

// ─── Categories ───────────────────────────────────────────────────────────────

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

