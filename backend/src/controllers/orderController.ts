import { Request, Response } from "express";
import Order, { IOrder, OrderStatus, PaymentStatus, PaymentMethod, ShippingMethod } from "../models/orderModel";
import { AuthRequest } from "../middleware/authMiddleware";

// ── Helper: compute total from items + shippingCost ───────────────────────────
const computeTotal = (
  items: { price: number; quantity: number }[],
  shippingCost: number
): number => {
  const itemsTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return itemsTotal + shippingCost;
};

// ── POST /api/orders ───────────────────────────────────────────────────────────
// Customer: place a new order
export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user?._id) {
      res.status(401).json({ success: false, message: "Authentication failed. Please log in again." });
      return;
    }

    const { items, addressId, shippingAddress, paymentMethod, shippingMethod, shippingCost } = req.body;

    if (!items || items.length === 0) {
      res.status(400).json({ success: false, message: "No order items found" });
      return;
    }

    // shippingAddress snapshot is required (addressId is optional — belt-and-suspenders)
    if (!shippingAddress?.streetAddress || !shippingAddress?.city || !shippingAddress?.postalCode || !shippingAddress?.country) {
      res.status(400).json({ success: false, message: "Incomplete shipping address" });
      return;
    }

    if (!Object.values(PaymentMethod).includes(paymentMethod)) {
      res.status(400).json({ success: false, message: `Invalid paymentMethod. Valid values: ${Object.values(PaymentMethod).join(", ")}` });
      return;
    }

    if (!Object.values(ShippingMethod).includes(shippingMethod)) {
      res.status(400).json({ success: false, message: `Invalid shippingMethod. Valid values: ${Object.values(ShippingMethod).join(", ")}` });
      return;
    }

    if (typeof shippingCost !== "number") {
      res.status(400).json({ success: false, message: "shippingCost is required" });
      return;
    }

    // Strip "name" from items if accidentally sent — only store product ref, price, qty, size
    const cleanItems = items.map((item: any) => ({
      product: item.product,
      price: item.price,
      quantity: item.quantity,
      size: item.size,
    }));

    // Total is always computed server-side — never trust the client's "total"
    const total = computeTotal(cleanItems, shippingCost);

    const newOrder = new Order({
      user: req.user._id,
      items: cleanItems,

      // ── Store BOTH the reference and the snapshot ──────────────────────────
      // addressId: loose ref — nullable if address is deleted later; used for linkback/analytics
      // shippingAddress: immutable snapshot of the address at time of purchase
      addressId: addressId || null,
      shippingAddress,

      paymentMethod,
      shippingMethod,
      shippingCost,
      total,
    });

    const savedOrder = await newOrder.save();

    // Populate addressId so the response includes the full address object if it exists
    await savedOrder.populate("addressId", "-user -__v");

    res.status(201).json({ success: true, order: savedOrder });
  } catch (error: any) {
    console.error("📦 [createOrder] Error:", error);
    res.status(500).json({ success: false, message: "Server error creating order", error: error.message });
  }
};

// ── GET /api/orders/my-orders ──────────────────────────────────────────────────
export const getMyOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const orders = await Order.find({ user: userId })
      .populate("user", "name email")
      .populate("items.product", "name brand images price")
      .populate("addressId", "-user -__v")   // populate the saved address if it still exists
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error fetching orders", error: error.message });
  }
};

// ── GET /api/orders/:id ────────────────────────────────────────────────────────
export const getOrderById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("items.product", "name brand images price")
      .populate("addressId", "-user -__v");  // populate the saved address if it still exists

    if (!order) {
      res.status(404).json({ success: false, message: "Order not found" });
      return;
    }

    if (order.user._id.toString() !== req.user?._id.toString() && req.user?.role !== "admin") {
      res.status(403).json({ success: false, message: "Not authorized to view this order" });
      return;
    }

    res.status(200).json({ success: true, order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error fetching order", error: error.message });
  }
};

// ── PUT /api/orders/:id/address ────────────────────────────────────────────────
// Customer can update shipping address before order is shipped.
// Updates both the snapshot and the addressId reference.
export const updateOrderAddress = async (req: AuthRequest, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    if (order.user.toString() !== req.user?._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    const { addressId, shippingAddress } = req.body;

    if (!shippingAddress?.streetAddress || !shippingAddress?.city || !shippingAddress?.postalCode || !shippingAddress?.country) {
      return res.status(400).json({ success: false, message: "Incomplete address" });
    }

    // Update both: the new reference and the new snapshot
    order.addressId = addressId || null;
    order.shippingAddress = shippingAddress;
    await order.save();

    await order.populate("addressId", "-user -__v");

    return res.status(200).json({ success: true, message: "Address updated", order });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Error updating address", error: error.message });
  }
};

// ── PATCH /api/orders/:id/cancel ──────────────────────────────────────────────
export const cancelOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404).json({ success: false, message: "Order not found" });
      return;
    }

    if (order.user.toString() !== req.user?._id.toString()) {
      res.status(403).json({ success: false, message: "Not authorized" });
      return;
    }

    const lockedStatuses = [OrderStatus.SHIPPED, OrderStatus.DELIVERED, OrderStatus.CANCELLED];
    if (lockedStatuses.includes(order.status)) {
      res.status(400).json({
        success: false,
        message: `Order cannot be cancelled — it is already "${order.status}". Please contact support.`,
      });
      return;
    }

    order.status = OrderStatus.CANCELLED;
    order.cancelledAt = new Date();
    order.cancelReason = req.body?.reason || "Cancelled by customer";
    await order.save();

    res.status(200).json({ success: true, message: "Order cancelled successfully", order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error cancelling order", error: error.message });
  }
};

// ── ADMIN: GET /api/orders/all ─────────────────────────────────────────────────
export const getAllOrders = async (_req: Request, res: Response): Promise<void> => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email")
      .populate("items.product", "name brand images price")
      .populate("addressId", "-user -__v")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error: any) {
    res.status(500).json({ message: "Server error retrieving orders", error: error.message });
  }
};

// ── ADMIN: PATCH /api/orders/:orderId/status ───────────────────────────────────
export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = Object.values(OrderStatus);
    if (!validStatuses.includes(status)) {
      res.status(400).json({ message: `Invalid status. Valid values: ${validStatuses.join(", ")}` });
      return;
    }

    const updated = await Order.findByIdAndUpdate(orderId, { status }, { new: true })
      .populate("user", "name email");

    if (!updated) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    res.status(200).json({ success: true, order: updated });
  } catch (error: any) {
    res.status(500).json({ message: "Error updating order status", error: error.message });
  }
};

// ── ADMIN: PATCH /api/orders/:orderId/payment-status ──────────────────────────
export const updatePaymentStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId } = req.params;
    const { paymentStatus } = req.body;

    const validStatuses = Object.values(PaymentStatus);
    if (!validStatuses.includes(paymentStatus)) {
      res.status(400).json({ message: `Invalid payment status. Valid values: ${validStatuses.join(", ")}` });
      return;
    }

    const updated = await Order.findByIdAndUpdate(orderId, { paymentStatus }, { new: true })
      .populate("user", "name email");

    if (!updated) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    res.status(200).json({ success: true, order: updated });
  } catch (error: any) {
    res.status(500).json({ message: "Error updating payment status", error: error.message });
  }
};

// ── ADMIN: DELETE /api/orders/:id ─────────────────────────────────────────────
export const deleteOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      res.status(404).json({ success: false, message: "Order not found" });
      return;
    }

    res.status(200).json({ success: true, message: "Order deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error deleting order", error: error.message });
  }
};
