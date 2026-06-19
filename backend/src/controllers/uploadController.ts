import { Request, Response } from 'express';
import { uploadFileToS3 } from '../config/s3Service'; // Keep it clean

export const handleImageUpload = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file provided" });
    }

    // Allow caller to specify which S3 "folder" this image belongs to
    // (e.g. "products" or "categories"). Falls back to "products" to
    // stay backward-compatible with existing calls that don't send it.
    const folder = (req.body?.folder as string) || "products";

    // Upload the file to S3
    const imageUrl = await uploadFileToS3(req.file, folder);
    
    res.status(200).json({ imageUrl });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Upload failed" });
  }
};