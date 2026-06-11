import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  slug: string;
  label: string;
  desc: string;
  img: string;
  bannerImg: string;
}

const categorySchema = new Schema<ICategory>({
  slug: { type: String, required: true, unique: true },
  label: { type: String, required: true },
  desc: { type: String, required: true },
  img: { type: String, required: true },
  bannerImg: { type: String, required: true }
});

export default mongoose.model<ICategory>("Category", categorySchema);