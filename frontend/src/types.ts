// export type Review = {
//   _id?: string;
//   productId: string; // The MongoDB ObjectId as a string
//   userId: {
//     _id: string;
//     name: string;
//   }; // Populated from User — gives the CURRENT name, not a stored snapshot
//   rating: number;
//   comment: string;
//   createdAt?: string;
// };

// export type Product = {
//   _id: string; // Updated to match backend
//   name: string;
//   price: number;
//   category: string;
//   brand: string;
//   images: string[];
//   badge?: string;
//   shortDesc: string;
//   description: string;
//   notes: {
//     top: string[];
//     heart: string[];
//     base: string[];
//   };
//   size: string;
//   longevity: string;
//   sillage: string;
//   season: string[];
//   reviews?: Review[];
//   averageRating?: number;

// };


// export type Category = {
//   slug: string;
//   label: string;
//   desc: string;
//   img: string;
//   bannerImg: string;
// };

// export type OrderItem = {
//   product: string; // ID of the product
//   name: string;
//   price: number;
//   quantity: number;
//   size: string;
// };

// export interface ShippingAddress {
//   streetAddress: string;
//   apartment?: string;
//   city: string;
//   postalCode: string;
//   country: string;
// }

// // Add this to types.ts
// export type OrderPayload = {
//   items: OrderItem[];
//   shippingAddress: {
//     streetAddress: string;
//     apartment?: string;
//     city: string;
//     postalCode: string;
//     country: string;
//   };
//   paymentMethod: Order["paymentMethod"];
//   shippingMethod: Order["shippingMethod"];
//   subtotal: number;
//   shippingCost: number;
//   total: number;
// };
// export type Order = {
//   _id: string;
//   user: string; // User ID
//   items: OrderItem[];
//   shippingAddress: {
//     streetAddress: string;
//     apartment?: string;
//     city: string;
//     postalCode: string;
//     country: string;
//   };
//   paymentMethod: "Cash on Delivery" | "Direct Bank Transfer"; // called union type that only these values are allowed
//   paymentStatus: "Pending" | "Verified" | "Paid";
//   shippingMethod: "Standard Shipping" | "Express Shipping";
//   status: "Pending" | "Confirmed" | "Shipped" | "Delivered" | "Cancelled";
//   subtotal: number;
//   shippingCost: number;
//   total: number;
//   createdAt: string;
// };

// // Add this to your types.ts
// // NOTE: your backend controllers (createOrder, getOrderById, cancelOrder, etc.)
// // return the payload under the key "order", not "data" — this type now matches that.
// export type ApiResponse<T = any> = {
//   success: boolean;
//   message: string;
//   order?: T;  // This holds the Order object on success (matches backend's actual response key)
//   data?: T;   // Kept for any endpoints that use "data" instead — optional, rarely used
// };










export type Review = {
  _id?: string;
  productId: string;
  userId: {
    _id: string;
    name: string;
  };
  rating: number;
  comment: string;
  createdAt?: string;
};

export type Product = {
  _id: string;
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

// ─── Address ──────────────────────────────────────────────────────────────────

export type AddressLabel = "Home" | "Office" | "University" | "Other";

export type Address = {
  _id: string;
  label: AddressLabel;
  customLabel?: string;
  recipientName: string;
  phone: string;
  streetAddress: string;
  apartment?: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  createdAt?: string;
};

// What we send to the server when creating/editing an address
export type AddressPayload = Omit<Address, "_id" | "createdAt">;

// Snapshot stored inside an order (mirrors ISnapshotAddress in orderModel)
// Note: recipientName and phone are NOT stored here — they live on the Address
// document itself and are accessible via the addressId ref when populated.
export type OrderAddress = {
  label: string;
  streetAddress: string;
  apartment?: string;
  city: string;
  postalCode: string;
  country: string;
};

// ─── Order ────────────────────────────────────────────────────────────────────

export type OrderItem = {
  product: string | {         // string when not populated, object when populated
    _id: string;
    name: string;
    brand: string;
    images: string[];
    price: number;
  };
  price: number;              // snapshot price at purchase time
  quantity: number;
  size: string;
};

export type Order = {
  _id: string;
  user: string | { _id: string; name: string; email: string };
  items: OrderItem[];

  // ── Address: reference + snapshot ─────────────────────────────────────────
  // addressId: ObjectId ref to the Address document (nullable — user may delete it later)
  // shippingAddress: full snapshot copied at order time (always present, never changes)
  addressId?: string | Address | null;  // string when not populated, Address when populated
  shippingAddress: OrderAddress;

  paymentMethod: "cash_on_delivery" | "direct_bank_transfer";   // mirrors PaymentMethod enum
  paymentStatus: "pending" | "verified" | "paid";               // mirrors PaymentStatus enum
  shippingMethod: "standard_shipping" | "express_shipping";     // mirrors ShippingMethod enum
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"; // mirrors OrderStatus enum
  shippingCost: number;
  // total: number;
  // subtotal is derived: total - shippingCost (not stored in DB)
  createdAt: string;
  cancelledAt?: string;
  cancelReason?: string;
};

// What we POST to /api/orders
export type OrderPayload = {
  items: {
    product: string;
    price: number;
    quantity: number;
    size: string;
  }[];

  // ── Address: send BOTH the ref ID and the snapshot ─────────────────────────
  addressId: string;           // _id of the chosen Address document
  shippingAddress: OrderAddress; // snapshot copied from the selected Address on frontend

  paymentMethod: Order["paymentMethod"];
  shippingMethod: Order["shippingMethod"];
  shippingCost: number;
  // NOTE: "total" and "subtotal" are NOT sent — server computes total from items + shippingCost
};

export type ApiResponse<T = any> = {
  success: boolean;
  message?: string;
  order?: T;
  orders?: T;
  data?: T;
};
