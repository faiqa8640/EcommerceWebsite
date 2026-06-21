import { Request, Response } from 'express';
import Order, { IOrder } from '../models/orderModel';
import { AuthRequest } from "../middleware/authMiddleware";



export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { items, shippingAddress, paymentMethod, shippingMethod, subtotal, shippingCost, total } = req.body;

    // 1. Verify user is authenticated and access the _id from middleware
    if (!req.user || !req.user._id) {
      res.status(401).json({ 
        success: false, 
        message: "Authentication failed. Please log in again." 
      });
      return;
    }

    // 2. Basic Validation
    if (!items || items.length === 0) {
      res.status(400).json({ success: false, message: 'No order items found' });
      return;
    }

    // 3. Create New Order Instance
    // Map the user ID directly from the authenticated request object
    const newOrder = new Order({
      user: req.user._id, 
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
      order: savedOrder 
    });
  } catch (error: any) {
    console.error("📦 [createOrder] Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error creating order", 
      error: error.message 
    });
  }
};
// @desc    Get logged in user's orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    
    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized access detected." });
      return;
    }

    // Populate user details and product reference items inside the order array
    const orders = await Order.find({ user: userId })
      .populate("user", "name email")
      .populate("items.product", "name brand images price");

    res.status(200).json({ success: true, orders });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error fetching order database profiles", error: error.message });
  }
};

// @desc    Get single order details
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId)
      .populate("user", "name email")
      .populate("items.product", "name brand images price");

    if (!order) {
      res.status(404).json({ success: false, message: "Order records not found." });
      return;
    }

    // Authorization safeguard check
    if (order.user._id.toString() !== req.user?._id.toString() && req.user?.role !== 'admin') {
      res.status(403).json({ success: false, message: "Not authorized to view this order transaction statement." });
      return;
    }

    res.status(200).json({ success: true, order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error looking up order details", error: error.message });
  }
};

// @desc    Update order shipping address statement (Before fulfillment processing window completes)
// @route   PUT /api/orders/:id/address
// @access  Private
export const updateOrderAddress = async (req: AuthRequest, res: Response) => {
  try {
    const orderId = req.params.id;
    const { shippingAddress } = req.body;

    // Aligned address check to use streetAddress instead of old string street
    if (!shippingAddress || !shippingAddress.streetAddress || !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.country) {
      return res.status(400).json({ success: false, message: "Incomplete address parameters provided." });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: "Target order record not found." });
    }

    if (order.user.toString() !== req.user?._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to modify this order data." });
    }

    // Strictly mapping fields according to your explicit Schema contract definition
    order.shippingAddress = {
      streetAddress: shippingAddress.streetAddress,
      apartment: shippingAddress.apartment,
      city: shippingAddress.city,
      postalCode: shippingAddress.postalCode,
      country: shippingAddress.country,
    };

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order address updated successfully",
      order,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Internal application error saving address metrics", error: error.message });
  }
};

// @desc    Customer cancels their own order (allowed any time before it ships)
// @route   PATCH /api/orders/:id/cancel
// @access  Private
export const cancelOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId);

    if (!order) {
      res.status(404).json({ success: false, message: "Order not found." });
      return;
    }

    // Only the order owner can cancel it
    if (order.user.toString() !== req.user?._id.toString()) {
      res.status(403).json({ success: false, message: "Not authorized to cancel this order." });
      return;
    }

    // Can't cancel once it's already shipped, delivered, or cancelled
    const lockedStatuses = ["Shipped", "Delivered", "Cancelled"];
    if (lockedStatuses.includes(order.status)) {
      res.status(400).json({
        success: false,
        message: `This order can no longer be cancelled — it is already "${order.status}". Please contact support if you need help.`,
      });
      return;
    }

    order.status = "Cancelled" as any;
    order.cancelledAt = new Date();
    order.cancelReason = req.body?.reason || "Cancelled by customer";

    await order.save();

    res.status(200).json({ success: true, message: "Order cancelled successfully.", order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Server error cancelling order", error: error.message });
  }
};

// -------------------
// ADMIN 
// ---------------------

// ── Admin: get ALL orders with user details populated ─────────────────────────
export const getAllOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email')   // pull name + email from User collection
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error retrieving all orders', error: error.message });
  }
};

// ── Admin: update order status ─────────────────────────────────────────────────
export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ message: 'Invalid status value' });
      return;
    }

    const updated = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    ).populate('user', 'name email');

    if (!updated) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    res.status(200).json({ success: true, order: updated });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error updating order status', error: error.message });
  }
};


// ── Admin: update payment status (e.g. verify a bank transfer) ─────────────────
export const updatePaymentStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId } = req.params;
    const { paymentStatus } = req.body;

    const validStatuses = ['Pending', 'Verified', 'Paid'];
    if (!validStatuses.includes(paymentStatus)) {
      res.status(400).json({ message: 'Invalid payment status value' });
      return;
    }

    const updated = await Order.findByIdAndUpdate(
      orderId,
      { paymentStatus },
      { new: true }
    ).populate('user', 'name email');

    if (!updated) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    res.status(200).json({ success: true, order: updated });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error updating payment status', error: error.message });
  }
};

// @desc    Delete an order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
export const deleteOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      res.status(404).json({ success: false, message: "Order not found" });
      return;
    }

    res.status(200).json({ success: true, message: "Order deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      message: "Server error deleting order", 
      error: error.message 
    });
  }
};