import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
  productId: string; // Links the review directly to a specific product slug/id (e.g., 'allure')
  user: string;
  rating: number;
  comment: string;
  date: string;
}

const reviewSchema = new Schema<IReview>(
  {
    productId: { type: String, required: true, index: true }, // Indexed for lightning-fast lookups
    user: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    date: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model<IReview>("Review", reviewSchema);