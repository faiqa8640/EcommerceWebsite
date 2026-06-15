import { Request, Response } from 'express';
import Order from '../models/orderModel';

export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("📦 [createOrder] Request Body:", req.body);
    console.log("👤 [createOrder] User from middleware:", (req as any).user);

    const { items, shippingAddress, paymentMethod, shippingMethod, subtotal, shippingCost, total } = req.body;

    const userId = (req as any).user?._id;

    // ←←← CRITICAL CHECK
    if (!userId) {
      res.status(401).json({ 
        success: false, 
        message: "Authentication failed. Please log in again." 
      });
      return;
    }

    if (!items || items.length === 0) {
      res.status(400).json({ message: 'No order items found' });
      return;
    }

    const newOrder = new Order({
      user: userId,
      items,
      shippingAddress,
      paymentMethod,
      shippingMethod,
      subtotal,
      shippingCost,
      total
    });

    const savedOrder = await newOrder.save();

    res.status(201).json({ 
      success: true, 
      message: "Order placed successfully!",
      order: savedOrder 
    });

  } catch (error: any) {
    console.error("❌ [createOrder] Full Error:", error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while placing order', 
      error: error.message 
    });
  }
};

export const getUserOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?._id;
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error retrieving orders', error: error.message });
  }
};