import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Footer from "../components/Footer";
import { createOrder } from '../data/apiService';

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
      alert(err.message || 'Network communication error encountered processing request.');
    }
  };

  return (
    <>
      {/* Luxury CSS Architecture Stylesheet Injection */}
      <style>{`
        .checkout-page {
          background-color: #f4efe6;
          color: #1b234a;
          min-height: 100vh;
          padding: 12px 24px 64px 24px;
          font-family: serif;
          box-sizing: border-box;
        }
        .checkout-wrapper {
          max-width: 1200px;
          margin: 0 auto;
        }
        .checkout-heading {
          font-size: 28px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin-bottom: 40px;
          font-weight: 600;
          border-bottom: 1px solid rgba(27, 35, 74, 0.15);
          padding-bottom: 16px;
        }
        .checkout-form {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 40px;
          align-items: start;
        }
        .left-stack {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }
        .form-section-card {
          background-color: #fcfaf7;
          padding: 28px;
          border-radius: 12px;
          border: 1px solid rgba(27, 35, 74, 0.15);
          box-sizing: border-box;
          box-shadow: 0 2px 8px rgba(27, 35, 74, 0.02);
        }
        .section-title {
          font-size: 18px;
          margin: 0 0 24px 0;
          letter-spacing: 0.05em;
          border-bottom: 1px solid rgba(27, 35, 74, 0.08);
          padding-bottom: 10px;
        }
        .field-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }
        .full-width-field {
          margin-bottom: 16px;
        }
        .triple-field-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 16px;
        }
        .field-label {
          display: block;
          font-family: sans-serif;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #6b6661;
          margin-bottom: 6px;
        }
        .form-input {
          width: 100%;
          height: 40px;
          padding: 0 12px;
          border: 1px solid rgba(27, 35, 74, 0.15);
          border-radius: 6px;
          background-color: #f4efe6;
          font-size: 14px;
          font-family: sans-serif;
          color: #1b234a;
          box-sizing: border-box;
          outline: none;
        }
        .selectable-option-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px;
          border: 1px solid rgba(27, 35, 74, 0.15);
          border-radius: 8px;
          background-color: #f4efe6;
          cursor: pointer;
          margin-bottom: 12px;
        }
        .radio-label-block {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .radio-input {
          accent-color: #1b234a;
          width: 16px;
          height: 16px;
        }
        .option-label-text {
          font-family: sans-serif;
          font-size: 14px;
          font-weight: 500;
        }
        .option-price-text {
          font-family: sans-serif;
          font-size: 14px;
          font-weight: 600;
        }
        .disabled-option {
          margin-bottom: 0;
          opacity: 0.45;
          cursor: not-allowed;
        }
        .right-sidebar-card {
          background-color: #fcfaf7;
          padding: 32px;
          border-radius: 12px;
          border: 1px solid rgba(27, 35, 74, 0.15);
          position: sticky;
          top: 120px;
          box-shadow: 0 4px 16px rgba(27, 35, 74, 0.04);
        }
        .sidebar-title {
          font-size: 20px;
          margin: 0 0 24px 0;
          border-bottom: 1px solid rgba(27, 35, 74, 0.15);
          padding-bottom: 12px;
          letter-spacing: 0.05em;
        }
        .items-container {
          max-height: 240px;
          overflow-Y: auto;
          margin-bottom: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding-right: 4px;
        }
        .sidebar-item-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 14px;
        }
        .item-thumbnail {
          width: 40px;
          height: 52px;
          object-fit: cover;
          border-radius: 4px;
          background-color: #f4efe6;
          border: 1px solid rgba(27, 35, 74, 0.05);
        }
        .item-meta-block {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .item-title {
          margin: 0;
          font-weight: 500;
          text-transform: capitalize;
        }
        .item-sub-details {
          margin: 2px 0 0 0;
          font-size: 11px;
          color: #6b6661;
        }
        .item-price-text {
          font-family: sans-serif;
          font-weight: 500;
          color: #6b6661;
        }
        .breakdown-rows {
          font-family: sans-serif;
          font-size: 14px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          padding-top: 16px;
          border-top: 1px solid rgba(27, 35, 74, 0.15);
          padding-bottom: 20px;
          color: #6b6661;
        }
        .breakdown-row-flex {
          display: flex;
          justify-content: space-between;
        }
        .breakdown-value {
          font-weight: 600;
          color: #1b234a;
        }
        .grand-total-block {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding: 20px 0;
          border-top: 1px solid rgba(27, 35, 74, 0.15);
        }
        .grand-total-title {
          font-size: 18px;
          font-weight: 600;
        }
        .grand-total-value {
          font-family: sans-serif;
          font-size: 22px;
          font-weight: 700;
          color: #1b234a;
        }
        .submit-order-btn {
          width: 100%;
          height: 52px;
          background-color: #1b234a;
          color: #ffffff;
          border: none;
          border-radius: 6px;
          font-family: sans-serif;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(27, 35, 74, 0.18);
          transition: background-color 0.2s ease;
        }
        
        /* Clean Responsive Screen Adjustments via Media Queries */
        @media (max-width: 1024px) {
          .checkout-form {
            grid-template-columns: 1fr;
          }
          .right-sidebar-card {
            position: relative;
            top: 0;
          }
        }
      `}</style>

      <div className="checkout-page">
        <div className="checkout-wrapper">
          <h1 className="checkout-heading">Checkout</h1>
          
          <form onSubmit={handlePlaceOrderSubmit} className="checkout-form">
            
            {/* Left Elements: Client Shipment Info Fields */}
            <div className="left-stack">
              
              {/* Box 1: Contact Info */}
              <div className="form-section-card">
                <h2 className="section-title">Contact Information</h2>
                <div className="field-row">
                  <div>
                    <label className="field-label">First Name *</label>
                    <input required type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="form-input" />
                  </div>
                  <div>
                    <label className="field-label">Last Name *</label>
                    <input required type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="form-input" />
                  </div>
                </div>
                <div className="full-width-field">
                  <label className="field-label">Email Address *</label>
                  <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="form-input" />
                </div>
                <div>
                  <label className="field-label">Phone Number *</label>
                  <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="form-input" />
                </div>
              </div>

              {/* Box 2: Address Specification */}
              <div className="form-section-card">
                <h2 className="section-title">Shipping Address</h2>
                <div className="full-width-field">
                  <label className="field-label">Street Address *</label>
                  <input required type="text" name="streetAddress" value={formData.streetAddress} onChange={handleInputChange} className="form-input" />
                </div>
                <div className="full-width-field">
                  <label className="field-label">Apartment, suite, unit etc. (optional)</label>
                  <input type="text" name="apartment" value={formData.apartment} onChange={handleInputChange} className="form-input" />
                </div>
                <div className="triple-field-row">
                  <div>
                    <label className="field-label">City *</label>
                    <input required type="text" name="city" value={formData.city} onChange={handleInputChange} className="form-input" />
                  </div>
                  <div>
                    <label className="field-label">Postal Code *</label>
                    <input required type="text" name="postalCode" value={formData.postalCode} onChange={handleInputChange} className="form-input" />
                  </div>
                  <div>
                    <label className="field-label">Country *</label>
                    <input required type="text" name="country" value={formData.country} onChange={handleInputChange} className="form-input" />
                  </div>
                </div>
              </div>

              {/* Box 3: Shipment Mode Radios */}
              <div className="form-section-card">
                <h2 className="section-title">Shipping Method</h2>
                
                <div className="selectable-option-row" onClick={() => setShippingMethod('Standard Shipping')}>
                  <div className="radio-label-block">
                    <input 
                      type="radio" 
                      name="shippingMethod"
                      checked={shippingMethod === 'Standard Shipping'} 
                      onChange={() => setShippingMethod('Standard Shipping')} 
                      className="radio-input" 
                    />
                    <span className="option-label-text">Standard Shipping (3-5 Business Days)</span>
                  </div>
                  <span className="option-price-text">Rs. 500</span>
                </div>

                <div className="selectable-option-row" style={{ marginBottom: 0 }} onClick={() => setShippingMethod('Express Shipping')}>
                  <div className="radio-label-block">
                    <input 
                      type="radio" 
                      name="shippingMethod"
                      checked={shippingMethod === 'Express Shipping'} 
                      onChange={() => setShippingMethod('Express Shipping')} 
                      className="radio-input" 
                    />
                    <span className="option-label-text">Express Courier Delivery (Next Day)</span>
                  </div>
                  <span className="option-price-text">Rs. 2,000</span>
                </div>
              </div>

              {/* Box 4: Financial Verification Radios */}
              <div className="form-section-card">
                <h2 className="section-title">Payment Method</h2>
                
                <div className="selectable-option-row" onClick={() => setPaymentMethod('Cash on Delivery')}>
                  <div className="radio-label-block">
                    <input 
                      type="radio" 
                      name="paymentMethod"
                      checked={paymentMethod === 'Cash on Delivery'} 
                      onChange={() => setPaymentMethod('Cash on Delivery')} 
                      className="radio-input" 
                    />
                    <span className="option-label-text">Cash on Delivery (COD)</span>
                  </div>
                </div>

                <div className="selectable-option-row disabled-option">
                  <div className="radio-label-block">
                    <input 
                      type="radio" 
                      name="paymentMethod"
                      disabled 
                      checked={paymentMethod === 'Card'} 
                      className="radio-input" 
                    />
                    <span className="option-label-text">Credit / Debit Card (Online Gateway Coming Soon)</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Elements: Order Breakdowns Sticky Sidebar */}
            <div className="right-sidebar-card">
              <h2 className="sidebar-title">Your Order</h2>
              
              {/* Scrollable Item Stack View */}
              <div className="items-container">
                {cartItems.map((item: CheckoutCartItem) => (
                  <div key={`${item._id}-${item.size}`} className="sidebar-item-row">
                    <div className="item-meta-block">
                      <img src={item.image} alt={item.name} className="item-thumbnail" />
                      <div>
                        <p className="item-title">{item.name}</p>
                        <p className="item-sub-details">{item.size} × {item.quantity}</p>
                      </div>
                    </div>
                    <span className="item-price-text">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Calculations Breakdown Container */}
              <div className="breakdown-rows">
                <div className="breakdown-row-flex">
                  <span>Subtotal</span>
                  <span className="breakdown-value">Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="breakdown-row-flex">
                  <span>Shipping cost</span>
                  <span className="breakdown-value">Rs. {shippingCost.toLocaleString()}</span>
                </div>
              </div>

              {/* Consolidated Sum Blocks */}
              <div className="grand-total-block">
                <span className="grand-total-title">Total Amount</span>
                <span className="grand-total-value">
                  Rs. {total.toLocaleString()}
                </span>
              </div>

              <button type="submit" className="submit-order-btn">
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