import mongoose, { Schema, Document } from "mongoose";

// review -> for typescript it tells that the our review objectc model have these changes
// export interface IReview {
//   user: string;
//   rating: number;
//   comment: string;
//   date: string;
// }

// product
export interface IProduct extends Document {
  id: string; // Custom string ID matching your frontend data (e.g., 'allure')
  name: string;
  price: string;
  priceNum: number;
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
}

// schemas -> 1) review
// const reviewSchema = new Schema<IReview>({
//   user: { type: String, required: true },
//   rating: { type: Number, required: true, min: 1, max: 5 },
//   comment: { type: String, required: true },
//   date: { type: String, required: true }
// });

// 2)product schema
const productSchema = new Schema<IProduct>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: String, required: true },
  priceNum: { type: Number, required: true },
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
}, { timestamps: true });

export default mongoose.model<IProduct>("Product", productSchema);