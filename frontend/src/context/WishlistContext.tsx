import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "../types";
import { fetchWishlist, addToWishlistAPI, removeFromWishlistAPI } from "../data/apiService"; 
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

interface WishlistContextType {
  wishlist: Product[];
  addToWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  clearWishlist: () => Promise<void>;
  refreshWishlist: () => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const { user } = useAuth() as any;
  const navigate = useNavigate();

  // Helper check to verify if a logged-in session token exists
  const isAuthenticated = (): boolean => {
    const token = localStorage.getItem("token");
    return !!token && !!user;
  };

  // Centralized function to fetch fresh data from MongoDB
  const refreshWishlist = async () => {
    if (!isAuthenticated()) {
      setWishlist([]);
      return;
    }
    try {
      const remoteWishlist = await fetchWishlist();
      setWishlist(remoteWishlist);
    } catch (error) {
      console.error("Failed to refresh wishlist from server:", error);
    }
  };

  // Automatically fetch items when the application mounts or when user login state changes
  useEffect(() => {
    refreshWishlist();
  }, [user]);

  // Check if a product is already in the wishlist
  const isInWishlist = (productId: string): boolean => {
    if (!isAuthenticated() || !productId || !wishlist) return false;
    return wishlist.some((item) => {
      const idToCheck = item._id || item.id;
      return String(idToCheck) === String(productId);
    });
  };

  // Handle adding an item safely to the database
  const addToWishlist = async (product: Product) => {
    if (!isAuthenticated()) {
      alert("🔒 Please login to access your personal wishlist profile functionality!");
      navigate("/login");
      return;
    }

    const uniqueId = product._id || product.id;
    if (!uniqueId) return;

    try {
      // Optimistic UI state update
      if (!wishlist.some(item => (item._id || item.id) === uniqueId)) {
        setWishlist(prev => [...prev, product]);
      }
      
      await addToWishlistAPI(String(uniqueId));
      await refreshWishlist(); 
    } catch (error: any) {
      console.error("Context error adding item:", error.message);
      await refreshWishlist(); // Rollback on failure
    }
  };

  // Handle removing an item safely from the database
  const removeFromWishlist = async (productId: string) => {
    if (!isAuthenticated()) return;
    if (!productId) return;
    
    try {
      // Optimistic UI update
      setWishlist(prev => prev.filter(item => String(item._id || item.id) !== String(productId)));
      await removeFromWishlistAPI(productId);
    } catch (error: any) {
      console.error("Context error removing item:", error.message);
      await refreshWishlist();
    }
  };

  // Toggle function with explicit authentication checks
  const toggleWishlist = async (product: Product) => {
    // 1. Core Gate Check: Block unauthenticated users immediately
    if (!isAuthenticated()) {
      alert("✨ Please sign in to save items to your personal wishlist!");
      navigate("/login");
      return;
    }

    const uniqueId = product._id || product.id;
    if (!uniqueId) return;

    try {
      if (isInWishlist(String(uniqueId))) {
        await removeFromWishlist(String(uniqueId));
        console.log(`Removed ${product.name} from wishlist.`);
      } else {
        await addToWishlist(product);
        alert(`✨ ${product.name} has been added to your wishlist!`);
      }
    } catch (error: any) {
      console.error("Error managing wishlist click feedback:", error.message);
    }
  };

  // Clear all items
  const clearWishlist = async () => {
    if (!isAuthenticated()) return;
    try {
      setWishlist([]);
      const token = localStorage.getItem("token");
      if (token) {
        await fetch("http://localhost:5000/api/wishlist/clear", {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (error) {
      console.error("Context error clearing items:", error);
      await refreshWishlist();
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, clearWishlist, refreshWishlist, isInWishlist, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be handled inside a WishlistProvider wrapper environment");
  }
  return context;
};