import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  product: string;
  name: string;
  quantity: number;
  price: number;
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
  user: mongoose.Types.ObjectId;        // ← This must be ObjectId
  items: IOrderItem[];
  shippingAddress: IShippingAddress;
  paymentMethod: string;
  shippingMethod: string;
  subtotal: number;
  shippingCost: number;
  total: number;
  status: string;
  createdAt: Date;
}

const OrderSchema: Schema = new Schema({
  user: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },   // ← This is the critical fix

  items: [
    {
      product: { type: String, required: true },
      name: { type: String, required: true },
      quantity: { type: Number, required: true, min: 1 },
      price: { type: Number, required: true },
      size: { type: String, required: true }
    }
  ],
  shippingAddress: {
    streetAddress: { type: String, required: true },
    apartment: { type: String },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  paymentMethod: { type: String, required: true },
  shippingMethod: { type: String, required: true },
  subtotal: { type: Number, required: true },
  shippingCost: { type: Number, required: true },
  total: { type: Number, required: true },
  status: { 
    type: String, 
    default: 'Pending', 
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'] 
  }
}, { timestamps: true });

export default mongoose.model<IOrder>('Order', OrderSchema);