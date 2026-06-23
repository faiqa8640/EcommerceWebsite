import mongoose, { Schema, Document, Types } from "mongoose";

// ── Enums ─────────────────────────────────────────────────────────────────────
export enum PaymentMethod {
  COD = "cash_on_delivery",
  BANK_TRANSFER = "direct_bank_transfer",
}

export enum ShippingMethod {
  STANDARD = "standard_shipping",
  EXPRESS = "express_shipping",
}

export enum OrderStatus {
  PENDING   = "pending",
  CONFIRMED = "confirmed",
  SHIPPED   = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}

export enum PaymentStatus {
  PENDING  = "pending",
  VERIFIED = "verified",
  PAID     = "paid",
}

// ── Sub-document interfaces ───────────────────────────────────────────────────

export interface IOrderItem {
  product: Types.ObjectId;
  price: number;
  quantity: number;
  size: string;
}
export interface ISnapshotAddress {
  label: string;
  streetAddress: string;
  apartment?: string;
  city: string;
  postalCode: string;
  country: string;
}

// ── Main document interface ───────────────────────────────────────────────────

export interface IOrder extends Document {
  user: Types.ObjectId;
  items: IOrderItem[];

  addressId?: Types.ObjectId | null;

  shippingAddress: ISnapshotAddress;

  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  shippingMethod:  ShippingMethod;
  status: OrderStatus;
  shippingCost: number;
  // total: number;
  createdAt: Date;
  cancelledAt?: Date;
  cancelReason?: string;
}

// ── Schemas ───────────────────────────────────────────────────────────────────

const OrderItemSchema = new Schema<IOrderItem>(
  {
    product:  { type: Schema.Types.ObjectId, ref: "Product", required: true },
    price:    { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    size:     { type: String, required: true },
  },
  { _id: false }
);

const SnapshotAddressSchema = new Schema<ISnapshotAddress>(
  {
    label:         { type: String, required: true },
    streetAddress: { type: String, required: true },
    apartment:     { type: String },
    city:          { type: String, required: true },
    postalCode:    { type: String, required: true },
    country:       { type: String, required: true, default: "Pakistan" },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    user:  { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: { type: [OrderItemSchema], required: true },

    // ── Address: reference + snapshot ─────────────────────────────────────
    addressId: {
      type: Schema.Types.ObjectId,
      ref: "Address",
      default: null,
      // Not required — the referenced doc may be deleted; snapshot is the source of truth
    },
    shippingAddress: {
      type: SnapshotAddressSchema,
      required: true,
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
    },
    shippingMethod: {
      type: String,
      enum: Object.values(ShippingMethod),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
    },
    shippingCost: { type: Number, required: true },
    // total:        { type: Number, required: true },
    cancelledAt:  { type: Date },
    cancelReason: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>("Order", OrderSchema);

