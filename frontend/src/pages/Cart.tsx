import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext'; 
import Footer from "../components/Footer";

interface CartItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
  category?: string;
}

export const Cart: React.FC = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartSubtotal } = useCart();
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState("");

  const subtotal = getCartSubtotal();
  const shippingCost = subtotal > 50000 || subtotal === 0 ? 0 : 500; 
  const totalCost = subtotal + shippingCost;

  // Premium Brand Palette Theme Objects
  const theme = {
    primary: '#1b234a',      
    background: '#f4efe6',   
    cardBg: '#fcfaf7',       
    textMuted: '#6b6661',    
    border: 'rgba(27, 35, 74, 0.15)', 
  };

  // Inline Style Structural Configurations
  const styles = {
    pageContainer: {
      backgroundColor: theme.background,
      color: theme.primary,
      minHeight: '100vh',
      padding: '12px 24px 64px 24px',
      fontFamily: 'serif',
      boxSizing: 'border-box' as const,
    },
    innerWrapper: {
      maxWidth: '1200px',
      margin: '0 auto',
    },
    heading: {
      fontSize: '28px',
      letterSpacing: '0.15em',
      textTransform: 'uppercase' as const,
      marginBottom: '40px',
      fontWeight: '600' as const,
    },
    layoutGrid: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: '40px',
      alignItems: 'start',
    },
    itemList: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '20px',
    },
    cartItemCard: {
      backgroundColor: theme.cardBg,
      padding: '24px',
      borderRadius: '12px',
      border: `1px solid ${theme.border}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '24px',
    },
    productMeta: {
      display: 'flex',
      alignItems: 'center',
      gap: '24px',
    },
    imageContainer: {
      width: '96px',
      height: '112px',
      borderRadius: '8px',
      overflow: 'hidden',
      flexShrink: 0,
      border: `1px solid rgba(27, 35, 74, 0.05)`,
    },
    productImg: {
      width: '100%',
      height: '100%',
      objectFit: 'cover' as const,
    },
    detailsBlock: {
      fontFamily: 'serif',
    },
    categoryTag: {
      fontFamily: 'sans-serif',
      fontSize: '10px',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.15em',
      color: theme.textMuted,
      marginBottom: '4px',
      display: 'block',
    },
    itemName: {
      fontSize: '18px',
      margin: '0 0 6px 0',
      textTransform: 'capitalize' as const,
      color: theme.primary,
      letterSpacing: '0.02em',
    },
    itemSize: {
      fontFamily: 'sans-serif',
      fontSize: '13px',
      color: theme.textMuted,
      margin: '0 0 8px 0',
    },
    itemPrice: {
      fontFamily: 'sans-serif',
      fontSize: '14px',
      fontWeight: '600' as const,
      margin: 0,
    },
    actionControlGroup: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '32px',
    },
    quantitySelector: {
      display: 'flex',
      alignItems: 'center',
      border: `1px solid ${theme.border}`,
      borderRadius: '8px',
      backgroundColor: theme.background,
      overflow: 'hidden',
    },
    quantityBtn: {
      background: 'none',
      border: 'none',
      width: '36px',
      height: '36px',
      cursor: 'pointer',
      fontSize: '16px',
      color: theme.primary,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    quantityVal: {
      fontFamily: 'sans-serif',
      fontSize: '14px',
      fontWeight: '600' as const,
      width: '32px',
      textAlign: 'center' as const,
    },
    priceWrapper: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
    },
    totalLinePrice: {
      fontFamily: 'sans-serif',
      fontSize: '15px',
      fontWeight: '700' as const,
      minWidth: '100px',
      textAlign: 'right' as const,
    },
    removeBtn: {
      background: 'none',
      border: 'none',
      color: theme.textMuted,
      cursor: 'pointer',
      padding: '4px',
      fontSize: '18px',
    },
    sidebarCard: {
      backgroundColor: theme.cardBg,
      padding: '32px',
      borderRadius: '12px',
      border: `1px solid ${theme.border}`,
      position: 'sticky' as const,
      top: '120px',
    },
    sidebarTitle: {
      fontSize: '20px',
      margin: '0 0 24px 0',
      borderBottom: `1px solid ${theme.border}`,
      paddingBottom: '12px',
      letterSpacing: '0.05em',
    },
    promoBox: {
      display: 'flex',
      gap: '8px',
      marginBottom: '24px',
    },
    promoInput: {
      flex: 1,
      height: '40px',
      padding: '0 12px',
      backgroundColor: theme.background,
      border: `1px solid ${theme.border}`,
      borderRadius: '6px',
      fontSize: '13px',
      color: theme.primary,
      fontFamily: 'sans-serif',
    },
    promoBtn: {
      height: '40px',
      padding: '0 16px',
      backgroundColor: 'transparent',
      border: `1px solid ${theme.border}`,
      borderRadius: '6px',
      cursor: 'pointer',
      fontFamily: 'sans-serif',
      fontSize: '12px',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.1em',
    },
    summaryRows: {
      fontFamily: 'sans-serif',
      fontSize: '14px',
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '16px',
      paddingBottom: '20px',
      borderBottom: `1px solid ${theme.border}`,
      color: theme.textMuted,
    },
    rowSpace: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    grandTotalBlock: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      padding: '24px 0',
    },
    checkoutBtn: {
      width: '100%',
      height: '50px',
      backgroundColor: theme.primary,
      color: '#ffffff',
      border: 'none',
      borderRadius: '6px',
      fontFamily: 'sans-serif',
      fontSize: '12px',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.2em',
      fontWeight: '600' as const,
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(27, 35, 74, 0.15)',
    },
    emptyState: {
      backgroundColor: theme.background,
      color: theme.primary,
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      boxSizing: 'border-box' as const,
    }
  };

  if (cartItems.length === 0) {
    return (
      <>
        <div style={styles.emptyState}>
          <h2 style={{ fontSize: '28px', letterSpacing: '0.15em', marginBottom: '12px', textTransform: 'uppercase' }}>Your Cart is Empty</h2>
          <p style={{ fontFamily: 'sans-serif', fontSize: '13px', color: theme.textMuted, marginBottom: '32px', letterSpacing: '0.1em' }}>
            Discover your signature essence.
          </p>
          <Link to="/shop">
            <button style={{ ...styles.checkoutBtn, width: 'auto', padding: '0 32px' }}>
              Continue Shopping
            </button>
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <div style={styles.pageContainer}>
        <div style={styles.innerWrapper}>
          <h1 style={styles.heading}>Shopping Cart</h1>

          <div style={styles.layoutGrid}>
            {/* List of Cart Items */}
            <div style={styles.itemList}>
              {cartItems.map((item: CartItem) => (
                <div key={`${item._id}-${item.size}`} style={styles.cartItemCard}>
                  
                  {/* Left Side: Product Details */}
                  <div style={styles.productMeta}>
                    <div style={styles.imageContainer}>
                      <img src={item.image} alt={item.name} style={styles.productImg} />
                    </div>
                    <div style={styles.detailsBlock}>
                      <span style={styles.categoryTag}>{item.category || 'Premium Fragrance'}</span>
                      <h3 style={styles.itemName}>{item.name}</h3>
                      <p style={styles.itemSize}>Size: <span style={{ fontWeight: 600, color: theme.primary }}>{item.size}</span></p>
                      
                      {/* Integrated Fix 1: Safe Base Item Price Parsing */}
                      <p style={styles.itemPrice}>
                        Rs. {(() => {
                          const numericPrice = typeof item.price === 'string' 
                            ? parseFloat(String(item.price).replace(/[^0-9.]/g, '')) 
                            : Number(item.price);
                          return isNaN(numericPrice) ? "0.00" : numericPrice.toLocaleString();
                        })()}
                      </p>
                    </div>
                  </div>

                  {/* Right Side: Handlers & Aggregates */}
                  <div style={styles.actionControlGroup}>
                    {/* Plus/Minus Custom Selector */}
                    <div style={styles.quantitySelector}>
                      <button 
                        type="button"
                        style={styles.quantityBtn} 
                        onClick={() => updateQuantity(item._id, item.size, item.quantity - 1)}
                      >
                        −
                      </button>
                      <span style={styles.quantityVal}>{item.quantity}</span>
                      <button 
                        type="button"
                        style={styles.quantityBtn} 
                        onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>

                    {/* Calculated Cost Display & Delete Cross */}
                    <div style={styles.priceWrapper}>
                      {/* Integrated Fix 2: Safe Cumulative Product Row Subtotal Calculations */}
                      <span style={styles.totalLinePrice}>
                        Rs. {(() => {
                          const numericPrice = typeof item.price === 'string' 
                            ? parseFloat(String(item.price).replace(/[^0-9.]/g, '')) 
                            : Number(item.price);
                          const numericQty = Number(item.quantity) || 1;
                          const subtotalValue = numericPrice * numericQty;
                          return isNaN(subtotalValue) ? "0.00" : subtotalValue.toLocaleString();
                        })()}
                      </span>
                      <button 
                        type="button"
                        style={styles.removeBtn} 
                        onClick={() => removeFromCart(item._id, item.size)}
                        title="Remove Item"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                </div>
              ))}

              <div style={{ marginTop: '12px' }}>
                <Link to="/shop" style={{ textDecoration: 'none' }}>
                  <span style={{ fontFamily: 'sans-serif', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', color: theme.primary, fontWeight: 600 }}>
                    ← Continue Shopping
                  </span>
                </Link>
              </div>
            </div>

            {/* Checkout Breakdown Sidebar */}
            <div style={styles.sidebarCard}>
              <h2 style={styles.sidebarTitle}>Order Summary</h2>
              
              <div style={styles.promoBox}>
                <input 
                  type="text" 
                  placeholder="Promo code" 
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  style={styles.promoInput} 
                />
                <button type="button" style={styles.promoBtn}>Apply</button>
              </div>

              <div style={styles.summaryRows}>
                <div style={styles.rowSpace}>
                  <span>Subtotal</span>
                  <span style={{ fontWeight: 600, color: theme.primary }}>Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div style={styles.rowSpace}>
                  <span>Shipping</span>
                  <span style={{ fontWeight: 600, color: '#065f46' }}>
                    {shippingCost === 0 ? "Complimentary" : `Rs. ${shippingCost.toLocaleString()}`}
                  </span>
                </div>
              </div>

              <div style={styles.grandTotalBlock}>
                <span style={{ fontSize: '18px', fontWeight: '600' }}>Total</span>
                <span style={{ fontFamily: 'sans-serif', fontSize: '22px', fontWeight: '700' }}>
                  Rs. {totalCost.toLocaleString()}
                </span>
              </div>

              <button 
                type="button"
                onClick={() => navigate('/checkout')} 
                style={styles.checkoutBtn}
              >
                Proceed to Checkout →
              </button>

              <div style={{ marginTop: '24px', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.1em', textAlign: 'center', color: theme.textMuted, fontFamily: 'sans-serif' }}>
                🔒 Secure Checkout • SSL Encrypted
              </div>
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};