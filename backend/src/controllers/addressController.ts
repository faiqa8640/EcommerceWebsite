import { Response } from "express";
import { Types } from "mongoose";
import { AuthRequest } from "../middleware/authMiddleware";
import Address from "../models/addressModel";

// ── GET /api/addresses ─────────────────────────────────────────────────────────
export const getMyAddresses = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const addresses = await Address.find({ user: new Types.ObjectId(userId) }).sort({
      isDefault: -1,
      createdAt: -1,
    });

    res.status(200).json({ success: true, addresses });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error fetching addresses", error: error.message });
  }
};

// ── POST /api/addresses ────────────────────────────────────────────────────────
export const addAddress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const {
      label, customLabel, recipientName, phone,
      streetAddress, apartment, city, postalCode, country, isDefault,
    } = req.body;

    if (!label || !recipientName || !phone || !streetAddress || !city || !postalCode || !country) {
      res.status(400).json({ success: false, message: "Missing required address fields" });
      return;
    }

    const uid = new Types.ObjectId(userId);

    const existingCount = await Address.countDocuments({ user: uid });
    const shouldBeDefault = isDefault || existingCount === 0;

    if (shouldBeDefault) {
      await Address.updateMany({ user: uid }, { $set: { isDefault: false } });
    }

    const newAddress = await Address.create({
      user: uid,
      label,
      customLabel: label === "Other" ? customLabel : undefined,
      recipientName,
      phone,
      streetAddress,
      apartment,
      city,
      postalCode,
      country: country || "Pakistan",
      isDefault: shouldBeDefault,
    });

    res.status(201).json({ success: true, address: newAddress });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error adding address", error: error.message });
  }
};

// ── PUT /api/addresses/:id ─────────────────────────────────────────────────────
export const updateAddress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    const id = req.params.id as string;

    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const uid = new Types.ObjectId(userId);

    const address = await Address.findOne({ _id: new Types.ObjectId(id), user: uid });
    if (!address) {
      res.status(404).json({ success: false, message: "Address not found" });
      return;
    }

    const {
      label, customLabel, recipientName, phone,
      streetAddress, apartment, city, postalCode, country, isDefault,
    } = req.body;

    // If promoting to default, demote all others first
    if (isDefault && !address.isDefault) {
      await Address.updateMany(
        { user: uid, _id: { $ne: new Types.ObjectId(id) } },
        { $set: { isDefault: false } }
      );
    }

    const updated = await Address.findByIdAndUpdate(
      new Types.ObjectId(id),
      {
        label,
        customLabel: label === "Other" ? customLabel : undefined,
        recipientName,
        phone,
        streetAddress,
        apartment,
        city,
        postalCode,
        country,
        isDefault: isDefault ?? address.isDefault,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, address: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error updating address", error: error.message });
  }
};

// ── DELETE /api/addresses/:id ──────────────────────────────────────────────────
export const deleteAddress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    const id = req.params.id as string;

    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const uid = new Types.ObjectId(userId);

    const address = await Address.findOne({ _id: new Types.ObjectId(id), user: uid });
    if (!address) {
      res.status(404).json({ success: false, message: "Address not found" });
      return;
    }

    const wasDefault = address.isDefault;
    await Address.findByIdAndDelete(new Types.ObjectId(id));

    // If we deleted the default, promote the next most recent address
    if (wasDefault) {
      const next = await Address.findOne({ user: uid }).sort({ createdAt: -1 });
      if (next) {
        next.isDefault = true;
        await next.save();
      }
    }

    res.status(200).json({ success: true, message: "Address deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error deleting address", error: error.message });
  }
};

// ── PATCH /api/addresses/:id/set-default ──────────────────────────────────────
export const setDefaultAddress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    const id = req.params.id as string;

    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const uid = new Types.ObjectId(userId);

    const address = await Address.findOne({ _id: new Types.ObjectId(id), user: uid });
    if (!address) {
      res.status(404).json({ success: false, message: "Address not found" });
      return;
    }

    await Address.updateMany({ user: uid }, { $set: { isDefault: false } });
    address.isDefault = true;
    await address.save();

    res.status(200).json({ success: true, message: "Default address updated", address });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error setting default address", error: error.message });
  }
};