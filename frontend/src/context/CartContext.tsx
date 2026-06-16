import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity: number) => void;
  removeFromCart: (id: string, size: string) => void;
  updateQuantity: (id: string, size: string, quantity: number) => void;
  clearCart: () => void;
  getCartCount: () => number;
  getCartSubtotal: () => number;
}

// Helper function to safely parse potential string anomalies or raw numbers
const parseSafePrice = (price: any): number => {
  if (typeof price === 'number') return isNaN(price) ? 0 : price;
  if (typeof price === 'string') {
    // Strips out symbols ("Rs.", "PKR"), commas, or extra whitespace cleanly
    const cleanStr = price.replace(/[^0-9.]/g, '');
    const parsed = parseFloat(cleanStr);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('eloura_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('eloura_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // const addToCart = (item: Omit<CartItem, 'quantity'>, quantity: number) => {
  //   // Clean and sanitize the base product price profile before state injection
  //   const sanitizedPrice = parseSafePrice(item.price);
  //   const safeItem = { ...item, price: sanitizedPrice };

  //   setCartItems((prevItems) => {
  //     const existingItemIndex = prevItems.findIndex(
  //       (i) => i._id === safeItem._id && i.size === safeItem.size
  //     );

  //     if (existingItemIndex > -1) {
  //       const newItems = [...prevItems];
  //       newItems[existingItemIndex].quantity += quantity;
  //       return newItems;
  //     }
  //     return [...prevItems, { ...safeItem, quantity }];
  //   });
  // };

  const addToCart = (item: Omit<CartItem, 'quantity'>, quantity: number) => {
    // Ensure incoming quantity parameter is cleanly sanitized and is at least 1
    const cleanQuantity = isNaN(quantity) || quantity <= 0 ? 1 : Number(quantity);
    
    const sanitizedPrice = parseSafePrice(item.price);
    const safeItem = { ...item, price: sanitizedPrice };

    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (i) => i._id === safeItem._id && i.size === safeItem.size
      );

      if (existingItemIndex > -1) {
        const newItems = [...prevItems];
        // Ensure existing quantity is also sanitized before adding
        const currentQty = Number(newItems[existingItemIndex].quantity) || 1;
        newItems[existingItemIndex].quantity = currentQty + cleanQuantity;
        return newItems;
      }
      
      // Inject explicitly with a verified numeric baseline quantity configuration
      return [...prevItems, { ...safeItem, quantity: cleanQuantity }];
    });
  };

  const removeFromCart = (id: string, size: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => !(item._id === id && item.size === size)));
  };

  const updateQuantity = (id: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id, size);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === id && item.size === size ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCartItems([]);

  // Bulletproof count calculation to keep the Header cart badges accurate
  const getCartCount = () => {
    if (!cartItems) return 0;
    return cartItems.reduce((count, item) => count + (Number(item.quantity) || 1), 0);
  };
  
  // Real-time calculation parsing to avoid NaN displaying on checkout grids
  const getCartSubtotal = () => {
    if (!cartItems || cartItems.length === 0) return 0;
    
    return cartItems.reduce((total, item) => {
      const validPrice = parseSafePrice(item.price);
      const validQuantity = Number(item.quantity) || 1;
      return total + (validPrice * validQuantity);
    }, 0);
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, addToCart, removeFromCart, updateQuantity, clearCart, getCartCount, getCartSubtotal 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};