import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  _id: string; // Cleanly linked to Product MongoDB native identifier _id string
  name: string;
  price: number; // Strictly enforced numeric tracking signature matching updated models
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

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('eloura_cart'); // if item then load from broswer storage
    // hence cart is not load on refresh  
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => { // if cart item change store it on the local storage 
    localStorage.setItem('eloura_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item: Omit<CartItem, 'quantity'>, quantity: number) => {
    const cleanQuantity = isNaN(quantity) || quantity <= 0 ? 1 : Number(quantity);
    
    // chechk that price should always be a number 
    const baselinePrice = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0;
    const safeItem = { ...item, price: baselinePrice };

    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (i) => i._id === safeItem._id && i.size === safeItem.size // same product +same size 
      );

      if (existingItemIndex > -1) { // if  item already exist  then just increase the quantity
        const newItems = [...prevItems];
        const currentQty = Number(newItems[existingItemIndex].quantity) || 1;
        newItems[existingItemIndex].quantity = currentQty + cleanQuantity;
        return newItems;
      }
      
      return [...prevItems, { ...safeItem, quantity: cleanQuantity }]; // otherwise add the new item 
    });
  };

  const removeFromCart = (id: string, size: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => !(item._id === id && item.size === size)));
    // remove the item whoese id and size matches 
  };

  const updateQuantity = (id: string, size: string, quantity: number) => {
    if (quantity <= 0) { // if quantity is zero or less then zero then remove the product from the cart
      removeFromCart(id, size);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) => // map therough all the items and find the item whose id and size match and then just update the quantity of that object
        item._id === id && item.size === size ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCartItems([]);

  const getCartCount = () => { // give the cart count
    if (!cartItems) return 0; 
    return cartItems.reduce((count, item) => count + (Number(item.quantity) || 1), 0);
  };
  
  const getCartSubtotal = () => {
    if (!cartItems || cartItems.length === 0) return 0; // if cart empty then zero
    return cartItems.reduce((total, item) => {
      const validPrice = typeof item.price === 'number' ? item.price : 0; // if valid price then use it else zero
      const validQuantity = Number(item.quantity) || 1; // if valid quantity use it else 1
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