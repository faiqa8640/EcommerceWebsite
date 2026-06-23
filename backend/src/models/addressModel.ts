import mongoose, { Schema, Document } from "mongoose";

export type AddressLabel = "Home" | "Office" | "University" | "Other";

export interface IAddress extends Document {
  user: mongoose.Types.ObjectId;
  label: AddressLabel;
  customLabel?: string;          // used when label === "Other"
  recipientName: string;
  phone: string;
  streetAddress: string;
  apartment?: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AddressSchema = new Schema<IAddress>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    label: {
      type: String,
      enum: ["Home", "Office", "University", "Other"],
      default: "Home",
      required: true,
    },

    customLabel: {
      type: String, // e.g. "Mom's Place" — only meaningful when label === "Other"
    },

    recipientName: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    streetAddress: {
      type: String,
      required: true,
      trim: true,
    },

    apartment: {
      type: String,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    postalCode: {
      type: String,
      required: true,
      trim: true,
    },

    country: {
      type: String,
      required: true,
      trim: true,
      default: "Pakistan",
    },

    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IAddress>("Address", AddressSchema);
