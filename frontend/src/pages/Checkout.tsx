
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Footer from "../components/Footer";
import { createOrder } from '../data/apiService';

// Explicit type interface declaration matching your item payload logic
interface CheckoutCartItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
}

export const Checkout: React.FC = () => {
  const { cartItems, getCartSubtotal, clearCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please login to place an order");
      navigate('/login');
    }
  }, [navigate]);

  // Core configuration states matching your required form fields
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    streetAddress: '', apartment: '', city: '', postalCode: '', country: 'Pakistan'
  });
  const [shippingMethod, setShippingMethod] = useState('Standard Shipping');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');

  const subtotal = getCartSubtotal();
  const shippingCost = shippingMethod === 'Express Shipping' ? 2000 : 500;
  const total = subtotal + shippingCost;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
        alert("Please log in to place an order");
        // Optionally redirect
        navigate('/login');
        return;
    }
    
    const orderPayload = {
      items: cartItems.map((item: CheckoutCartItem) => ({
        product: item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        size: item.size
      })),
      shippingAddress: {
        streetAddress: formData.streetAddress,
        apartment: formData.apartment,
        city: formData.city,
        postalCode: formData.postalCode,
        country: formData.country
      },
      paymentMethod,
      shippingMethod,
      subtotal,
      shippingCost,
      total
    };

    try {
      // Utilizing the central API service to route the request to your backend
      const data = await createOrder(orderPayload);

      if (data.success) {
        alert('✨ Luxury selection order successfully placed! Viewable now in your database collections.');
        clearCart();
        navigate('/'); 
      } else {
        alert(`Failed to save order: ${data.message || 'Check authentication status.'}`);
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      // Grabs the custom error message thrown by apiService, or falls back to standard message
      alert(err.message || 'Network communication error encountered processing request.');
    }
  };

  // Luxury Brand Architectural Palette
  const theme = {
    primary: '#1b234a',       // Deep Luxury Navy Blue
    background: '#f4efe6',    // Soft Cream Base
    cardBg: '#fcfaf7',        // Pure Ivory Section Boxes
    textMuted: '#6b6661',     // Elegant Taupe Text Labeling
    border: 'rgba(27, 35, 74, 0.15)', // Light Structural Outline Matrix
  };

  // Inline Layout Configuration Objects
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
      borderBottom: `1px solid ${theme.border}`,
      paddingBottom: '16px',
    },
    checkoutForm: {
      display: 'grid',
      gridTemplateColumns: 'window' in window && window.innerWidth < 1024 ? '1fr' : '2fr 1fr',
      gap: '40px',
      alignItems: 'start',
    },
    leftStack: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '32px',
    },
    formSectionCard: {
      backgroundColor: theme.cardBg,
      padding: '28px',
      borderRadius: '12px',
      border: `1px solid ${theme.border}`,
      boxSizing: 'border-box' as const,
      boxShadow: '0 2px 8px rgba(27, 35, 74, 0.02)',
    },
    sectionTitle: {
      fontSize: '18px',
      margin: '0 0 24px 0',
      letterSpacing: '0.05em',
      borderBottom: `1px solid rgba(27, 35, 74, 0.08)`,
      paddingBottom: '10px',
    },
    fieldRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '16px',
      marginBottom: '16px',
    },
    fullWidthField: {
      marginBottom: '16px',
    },
    tripleFieldRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: '16px',
    },
    label: {
      display: 'block',
      fontFamily: 'sans-serif',
      fontSize: '11px',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.1em',
      color: theme.textMuted,
      marginBottom: '6px',
    },
    input: {
      width: '100%',
      height: '40px',
      padding: '0 12px',
      border: `1px solid ${theme.border}`,
      borderRadius: '6px',
      backgroundColor: theme.background,
      fontSize: '14px',
      fontFamily: 'sans-serif',
      color: theme.primary,
      boxSizing: 'border-box' as const,
      outline: 'none',
    },
    selectableOptionRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px',
      border: `1px solid ${theme.border}`,
      borderRadius: '8px',
      backgroundColor: theme.background,
      cursor: 'pointer',
      marginBottom: '12px',
    },
    radioLabelBlock: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    radioInput: {
      accentColor: theme.primary,
      width: '16px',
      height: '16px',
    },
    optionLabelText: {
      fontFamily: 'sans-serif',
      fontSize: '14px',
      fontWeight: '500' as const,
    },
    optionPriceText: {
      fontFamily: 'sans-serif',
      fontSize: '14px',
      fontWeight: '600' as const,
    },
    rightSidebarCard: {
      backgroundColor: theme.cardBg,
      padding: '32px',
      borderRadius: '12px',
      border: `1px solid ${theme.border}`,
      position: 'sticky' as const,
      top: '120px',
      boxShadow: '0 4px 16px rgba(27, 35, 74, 0.04)',
    },
    sidebarTitle: {
      fontSize: '20px',
      margin: '0 0 24px 0',
      borderBottom: `1px solid ${theme.border}`,
      paddingBottom: '12px',
      letterSpacing: '0.05em',
    },
    itemsContainer: {
      maxHeight: '240px',
      overflowY: 'auto' as const,
      marginBottom: '24px',
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '16px',
      paddingRight: '4px',
    },
    sidebarItemRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontSize: '14px',
    },
    itemThumbnail: {
      width: '40px',
      height: '52px',
      objectFit: 'cover' as const,
      borderRadius: '4px',
      backgroundColor: theme.background,
      border: '1px solid rgba(27, 35, 74, 0.05)',
    },
    itemMetaBlock: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    itemTitle: {
      margin: 0,
      fontWeight: '500' as const,
      textTransform: 'capitalize' as const,
    },
    itemSubDetails: {
      margin: '2px 0 0 0',
      fontSize: '11px',
      color: theme.textMuted,
    },
    itemPriceText: {
      fontFamily: 'sans-serif',
      fontWeight: '500' as const,
      color: theme.textMuted,
    },
    breakdownRows: {
      fontFamily: 'sans-serif',
      fontSize: '14px',
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '14px',
      paddingTop: '16px',
      borderTop: `1px solid ${theme.border}`,
      paddingBottom: '20px',
      color: theme.textMuted,
    },
    grandTotalBlock: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      padding: '20px 0',
      borderTop: `1px solid ${theme.border}`,
    },
    submitOrderBtn: {
      width: '100%',
      height: '52px',
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
      boxShadow: '0 4px 14px rgba(27, 35, 74, 0.18)',
      transition: 'background-color 0.2s ease',
    }
  };

  return (
    <>
      <div style={styles.pageContainer}>
        <div style={styles.innerWrapper}>
          <h1 style={styles.heading}>Checkout</h1>
          
          <form onSubmit={handlePlaceOrderSubmit} style={styles.checkoutForm}>
            
            {/* Left Elements: Client Shipment Info Fields */}
            <div style={styles.leftStack}>
              
              {/* Box 1: Contact Info */}
              <div style={styles.formSectionCard}>
                <h2 style={styles.sectionTitle}>Contact Information</h2>
                <div style={styles.fieldRow}>
                  <div>
                    <label style={styles.label}>First Name *</label>
                    <input required type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} style={styles.input} />
                  </div>
                  <div>
                    <label style={styles.label}>Last Name *</label>
                    <input required type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} style={styles.input} />
                  </div>
                </div>
                <div style={styles.fullWidthField}>
                  <label style={styles.label}>Email Address *</label>
                  <input required type="email" name="email" value={formData.email} onChange={handleInputChange} style={styles.input} />
                </div>
                <div style={{ margin: 0 }}>
                  <label style={styles.label}>Phone Number *</label>
                  <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} style={styles.input} />
                </div>
              </div>

              {/* Box 2: Address Specification */}
              <div style={styles.formSectionCard}>
                <h2 style={styles.sectionTitle}>Shipping Address</h2>
                <div style={styles.fullWidthField}>
                  <label style={styles.label}>Street Address *</label>
                  <input required type="text" name="streetAddress" value={formData.streetAddress} onChange={handleInputChange} style={styles.input} />
                </div>
                <div style={styles.fullWidthField}>
                  <label style={styles.label}>Apartment, suite, unit etc. (optional)</label>
                  <input type="text" name="apartment" value={formData.apartment} onChange={handleInputChange} style={styles.input} />
                </div>
                <div style={styles.tripleFieldRow}>
                  <div>
                    <label style={styles.label}>City *</label>
                    <input required type="text" name="city" value={formData.city} onChange={handleInputChange} style={styles.input} />
                  </div>
                  <div>
                    <label style={styles.label}>Postal Code *</label>
                    <input required type="text" name="postalCode" value={formData.postalCode} onChange={handleInputChange} style={styles.input} />
                  </div>
                  <div>
                    <label style={styles.label}>Country *</label>
                    <input required type="text" name="country" value={formData.country} onChange={handleInputChange} style={styles.input} />
                  </div>
                </div>
              </div>

              {/* Box 3: Shipment Mode Radios */}
              <div style={styles.formSectionCard}>
                <h2 style={styles.sectionTitle}>Shipping Method</h2>
                
                <div style={styles.selectableOptionRow} onClick={() => setShippingMethod('Standard Shipping')}>
                  <div style={styles.radioLabelBlock}>
                    <input 
                      type="radio" 
                      name="shippingMethod"
                      checked={shippingMethod === 'Standard Shipping'} 
                      onChange={() => setShippingMethod('Standard Shipping')} 
                      style={styles.radioInput} 
                    />
                    <span style={styles.optionLabelText}>Standard Shipping (3-5 Business Days)</span>
                  </div>
                  <span style={styles.optionPriceText}>Rs. 500</span>
                </div>

                <div style={{ ...styles.selectableOptionRow, marginBottom: 0 }} onClick={() => setShippingMethod('Express Shipping')}>
                  <div style={styles.radioLabelBlock}>
                    <input 
                      type="radio" 
                      name="shippingMethod"
                      checked={shippingMethod === 'Express Shipping'} 
                      onChange={() => setShippingMethod('Express Shipping')} 
                      style={styles.radioInput} 
                    />
                    <span style={styles.optionLabelText}>Express Courier Delivery (Next Day)</span>
                  </div>
                  <span style={styles.optionPriceText}>Rs. 2,000</span>
                </div>
              </div>

              {/* Box 4: Financial Verification Radios */}
              <div style={styles.formSectionCard}>
                <h2 style={styles.sectionTitle}>Payment Method</h2>
                
                <div style={{ ...styles.selectableOptionRow, marginBottom: 12 }} onClick={() => setPaymentMethod('Cash on Delivery')}>
                  <div style={styles.radioLabelBlock}>
                    <input 
                      type="radio" 
                      name="paymentMethod"
                      checked={paymentMethod === 'Cash on Delivery'} 
                      onChange={() => setPaymentMethod('Cash on Delivery')} 
                      style={styles.radioInput} 
                    />
                    <span style={styles.optionLabelText}>Cash on Delivery (COD)</span>
                  </div>
                </div>

                <div style={{ ...styles.selectableOptionRow, marginBottom: 0, opacity: 0.45, cursor: 'not-allowed' }}>
                  <div style={styles.radioLabelBlock}>
                    <input 
                      type="radio" 
                      name="paymentMethod"
                      disabled 
                      checked={paymentMethod === 'Card'} 
                      style={styles.radioInput} 
                    />
                    <span style={styles.optionLabelText}>Credit / Debit Card (Online Gateway Coming Soon)</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Elements: Order Breakdowns Sticky Sidebar */}
            <div style={styles.rightSidebarCard}>
              <h2 style={styles.sidebarTitle}>Your Order</h2>
              
              {/* Scrollable Item Stack View */}
              <div style={styles.itemsContainer}>
                {cartItems.map((item: CheckoutCartItem) => (
                  <div key={`${item._id}-${item.size}`} style={styles.sidebarItemRow}>
                    <div style={styles.itemMetaBlock}>
                      <img src={item.image} alt={item.name} style={styles.itemThumbnail} />
                      <div>
                        <p style={styles.itemTitle}>{item.name}</p>
                        <p style={styles.itemSubDetails}>{item.size} × {item.quantity}</p>
                      </div>
                    </div>
                    <span style={styles.itemPriceText}>
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Calculations Breakdown Container */}
              <div style={styles.breakdownRows}>
                <div style={{ display: 'flex',  justifyContent: 'space-between' }}>
                  <span>Subtotal</span>
                  <span style={{ fontWeight: 600, color: theme.primary }}>Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Shipping cost</span>
                  <span style={{ fontWeight: 600, color: theme.primary }}>Rs. {shippingCost.toLocaleString()}</span>
                </div>
              </div>

              {/* Consolidated Sum Blocks */}
              <div style={styles.grandTotalBlock}>
                <span style={{ fontSize: '18px', fontWeight: '600' }}>Total Amount</span>
                <span style={{ fontFamily: 'sans-serif', fontSize: '22px', fontWeight: '700', color: theme.primary }}>
                  Rs. {total.toLocaleString()}
                </span>
              </div>

              <button type="submit" style={styles.submitOrderBtn}>
                Place Order
              </button>
            </div>

          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};