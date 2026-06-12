// src/components/AddProductForm.tsx
import React, { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../config/firebase";

export const AddProductForm: React.FC = () => {
  const [name, setName] = useState("");
  const [priceNum, setPriceNum] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("men");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) {
      alert("Please select a perfume product image first!");
      return;
    }

    try {
      setIsUploading(true);

      // 1. Create a unique file name reference path inside Firebase Storage
      const uniqueFileName = `${Date.now()}_${imageFile.name}`;
      const storageRef = ref(storage, `products/${uniqueFileName}`);

      // 2. Upload the raw binary file directly to Google Firebase Storage
      const snapshot = await uploadBytes(storageRef, imageFile);

      // 3. Request the permanent web URL string for the uploaded asset
      const firebaseImageUrl = await getDownloadURL(snapshot.ref);
      console.log("Image uploaded successfully! URL:", firebaseImageUrl);

      // 4. Send a clean JSON string request to your local Express server
      const response = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          priceNum: Number(priceNum),
          brand,
          category,
          description,
          imageUrl: firebaseImageUrl, // Send the Firebase URL string directly to your MongoDB document structure!
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Perfume Product added successfully!");
        // Reset form states here if needed
      } else {
        alert(`Server error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error creating full product package:", error);
      alert("Failed to create product.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "400px" }}>
      <input type="text" placeholder="Product Name" value={name} onChange={(e) => setName(e.target.value)} required />
      <input type="number" placeholder="Price" value={priceNum} onChange={(e) => setPriceNum(e.target.value)} required />
      <input type="text" placeholder="Brand" value={brand} onChange={(e) => setBrand(e.target.value)} required />
      <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
      
      <label>Product Image File:</label>
      <input type="file" accept="image/*" onChange={handleFileChange} required />

      <button type="submit" disabled={isUploading}>
        {isUploading ? "Uploading Data to Cloud..." : "Save Product"}
      </button>
    </form>
  );
};