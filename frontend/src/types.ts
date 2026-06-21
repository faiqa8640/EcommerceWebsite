
export type Review = {
  _id?: string;
  productId: string; // The MongoDB ObjectId as a string
  userId: string;    // Updated to match backend: userId (ObjectId)
  userName: string;  // Snapshot of user name
  rating: number;
  comment: string;
  createdAt?: string;
};

export type Product = {
  _id: string; // Updated to match backend
  name: string;
  price: number;
  category: string;
  brand: string;
  images: string[];
  badge?: string;
  shortDesc: string;
  description: string;
  notes: {
    top: string[];
    heart: string[];
    base: string[];
  };
  size: string;
  longevity: string;
  sillage: string;
  season: string[];
  reviews?: Review[];
  averageRating?: number;

};


export type Category = {
  slug: string;
  label: string;
  desc: string;
  img: string;
  bannerImg: string;
};

export type OrderItem = {
  product: string; // ID of the product
  name: string;
  price: number;
  quantity: number;
  size: string;
};

export interface ShippingAddress {
  streetAddress: string;
  apartment?: string;
  city: string;
  postalCode: string;
  country: string;
}

// Add this to types.ts
export type OrderPayload = {
  items: OrderItem[];
  shippingAddress: {
    streetAddress: string;
    apartment?: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: Order["paymentMethod"];
  shippingMethod: Order["shippingMethod"];
  subtotal: number;
  shippingCost: number;
  total: number;
};
export type Order = {
  _id: string;
  user: string; // User ID
  items: OrderItem[];
  shippingAddress: {
    streetAddress: string;
    apartment?: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: "Cash on Delivery" | "Direct Bank Transfer";
  paymentStatus: "Pending" | "Verified" | "Paid";
  shippingMethod: "Standard Shipping" | "Express Shipping";
  status: "Pending" | "Confirmed" | "Shipped" | "Delivered" | "Cancelled";
  subtotal: number;
  shippingCost: number;
  total: number;
  createdAt: string;
};

// Add this to your types.ts
// NOTE: your backend controllers (createOrder, getOrderById, cancelOrder, etc.)
// return the payload under the key "order", not "data" — this type now matches that.
export type ApiResponse<T = any> = {
  success: boolean;
  message: string;
  order?: T;  // This holds the Order object on success (matches backend's actual response key)
  data?: T;   // Kept for any endpoints that use "data" instead — optional, rarely used
};
