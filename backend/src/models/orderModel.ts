import mongoose, { Schema, Document } from "mongoose";

/* =========================
   ENUMS
========================= */

export enum PaymentMethod {
  COD = "Cash on Delivery",
  BANK_TRANSFER = "Direct Bank Transfer",
}

export enum PaymentStatus {
  PENDING = "Pending",         // COD: pending until delivered. Bank transfer: pending until you confirm funds received.
  VERIFIED = "Verified",       // Admin confirmed the bank transfer landed
  PAID = "Paid",                // COD collected on delivery
}

export enum ShippingMethod {
  STANDARD = "Standard Shipping",
  EXPRESS = "Express Shipping",
}

export enum OrderStatus {
  PENDING = "Pending",
  CONFIRMED = "Confirmed",
  SHIPPED = "Shipped",
  DELIVERED = "Delivered",
  CANCELLED = "Cancelled",
}

/* =========================
   INTERFACES
========================= */

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  size: string;
}

export interface IShippingAddress {
  streetAddress: string;
  apartment?: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;

  items: IOrderItem[];

  shippingAddress: IShippingAddress;

  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  shippingMethod: ShippingMethod;
  status: OrderStatus;

  subtotal: number;
  shippingCost: number;
  total: number;

  cancelledAt?: Date;
  cancelReason?: string;

  createdAt: Date;
  updatedAt: Date;
}

/* =========================
   SCHEMA
========================= */

const OrderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        name: {
          type: String,
          required: true,
        },

        price: {
          type: Number,
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
          min: 1,
        },

        size: {
          type: String,
          required: true,
        },
      },
    ],

    shippingAddress: {
      streetAddress: {
        type: String,
        required: true,
      },

      apartment: {
        type: String,
      },

      city: {
        type: String,
        required: true,
      },

      postalCode: {
        type: String,
        required: true,
      },

      country: {
        type: String,
        required: true,
      },
    },

    paymentMethod: {
      type: String,
      enum: Object.values(PaymentMethod),
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
      required: true,
    },

    shippingMethod: {
      type: String,
      enum: Object.values(ShippingMethod),
      default: ShippingMethod.STANDARD,
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
      required: true,
    },

    subtotal: {
      type: Number,
      required: true,
    },

    shippingCost: {
      type: Number,
      required: true,
    },

    total: {
      type: Number,
      required: true,
    },

    cancelledAt: {
      type: Date,
    },

    cancelReason: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IOrder>("Order", OrderSchema);
