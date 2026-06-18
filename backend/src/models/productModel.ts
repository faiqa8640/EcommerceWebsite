import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  _id: mongoose.Types.ObjectId; 
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
  averageRating: number; 
}

const productSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  price: { type: Number, required: true }, 
  category: { type: String, required: true },
  brand: { type: String, required: true },
  images: { type: [String], required: true },
  badge: { type: String },
  shortDesc: { type: String, required: true },
  description: { type: String, required: true },
  notes: {
    top: { type: [String], required: true },
    heart: { type: [String], required: true },
    base: { type: [String], required: true }
  },
  size: { type: String, required: true },
  longevity: { type: String, required: true },
  sillage: { type: String, required: true },
  season: { type: [String], required: true },
  averageRating: { type: Number, default: 0 }, 
}, { timestamps: true });

export default mongoose.model<IProduct>("Product", productSchema);