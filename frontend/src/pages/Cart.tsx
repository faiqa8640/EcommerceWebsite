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

  if (cartItems.length === 0) {
    return (
      <>
        <style>{`
          .empty-state-container {
            background-color: #f4efe6;
            color: #1b234a;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 24px;
            box-sizing: border-box;
          }
          .empty-heading {
            font-size: 28px; 
            letter-spacing: 0.15em; 
            margin-bottom: 12px; 
            text-transform: uppercase;
            font-family: serif;
          }
          .empty-text {
            font-family: sans-serif; 
            font-size: 13px; 
            color: #6b6661; 
            margin-bottom: 32px; 
            letter-spacing: 0.1em;
          }
          .continue-shopping-btn {
            height: 50px;
            background-color: #1b234a;
            color: #ffffff;
            border: none;
            border-radius: 6px;
            font-family: sans-serif;
            fontSize: 12px;
            text-transform: uppercase;
            letter-spacing: 0.2em;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(27, 35, 74, 0.15);
            width: auto; 
            padding: 0 32px;
          }
        `}</style>

        <div className="empty-state-container">
          <h2 className="empty-heading">Your Cart is Empty</h2>
          <p className="empty-text">Discover your signature essence.</p>
          <Link to="/shop">
            <button className="continue-shopping-btn">
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
      {/* Premium Luxury Stylesheet Tag Injection */}
      <style>{`
        .cart-page {
          background-color: #f4efe6;
          color: #1b234a;
          min-height: 100vh;
          padding: 12px 24px 64px 24px;
          font-family: serif;
          box-sizing: border-box;
        }
        .cart-wrapper {
          max-width: 1200px;
          margin: 0 auto;
        }
        .cart-heading {
          font-size: 28px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin-bottom: 40px;
          font-weight: 600;
        }
        .cart-layout-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 40px;
          align-items: start;
        }
        .item-list-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .cart-item-card {
          background-color: #fcfaf7;
          padding: 24px;
          border-radius: 12px;
          border: 1px solid rgba(27, 35, 74, 0.15);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }
        .product-meta-block {
          display: flex;
          align-items: center;
          gap: 24px;
        }
        .image-container-frame {
          width: 96px;
          height: 112px;
          border-radius: 8px;
          overflow: hidden;
          flex-shrink: 0;
          border: 1px solid rgba(27, 35, 74, 0.05);
        }
        .product-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .details-text-block {
          font-family: serif;
        }
        .category-tag-label {
          font-family: sans-serif;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #6b6661;
          margin-bottom: 4px;
          display: block;
        }
        .item-name-heading {
          font-size: 18px;
          margin: 0 0 6px 0;
          text-transform: capitalize;
          color: #1b234a;
          letter-spacing: 0.02em;
        }
        .item-size-spec {
          font-family: sans-serif;
          font-size: 13px;
          color: #6b6661;
          margin: 0 0 8px 0;
        }
        .highlighted-size {
          font-weight: 600;
          color: #1b234a;
        }
        .item-base-price {
          font-family: sans-serif;
          font-size: 14px;
          font-weight: 600;
          margin: 0;
        }
        .action-control-group {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 32px;
        }
        .quantity-selector-matrix {
          display: flex;
          align-items: center;
          border: 1px solid rgba(27, 35, 74, 0.15);
          border-radius: 8px;
          background-color: #f4efe6;
          overflow: hidden;
        }
        .quantity-control-btn {
          background: none;
          border: none;
          width: 36px;
          height: 36px;
          cursor: pointer;
          font-size: 16px;
          color: #1b234a;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .quantity-current-val {
          font-family: sans-serif;
          font-size: 14px;
          font-weight: 600;
          width: 32px;
          text-align: center;
        }
        .price-wrapper-block {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .total-line-price-display {
          font-family: sans-serif;
          font-size: 15px;
          font-weight: 700;
          min-width: 100px;
          text-align: right;
        }
        .remove-cross-btn {
          background: none;
          border: none;
          color: #6b6661;
          cursor: pointer;
          padding: 4px;
          font-size: 18px;
        }
        .continue-shopping-link-wrap {
          margin-top: 12px;
        }
        .continue-shopping-text-btn {
          font-family: sans-serif;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #1b234a;
          font-weight: 600;
        }
        .summary-sidebar-card {
          background-color: #fcfaf7;
          padding: 32px;
          border-radius: 12px;
          border: 1px solid rgba(27, 35, 74, 0.15);
          position: sticky;
          top: 120px;
        }
        .sidebar-title-heading {
          font-size: 20px;
          margin: 0 0 24px 0;
          border-bottom: 1px solid rgba(27, 35, 74, 0.15);
          padding-bottom: 12px;
          letter-spacing: 0.05em;
        }
        .promo-flex-box {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
        }
        .promo-code-input {
          flex: 1;
          height: 40px;
          padding: 0 12px;
          background-color: #f4efe6;
          border: 1px solid rgba(27, 35, 74, 0.15);
          border-radius: 6px;
          font-size: 13px;
          color: #1b234a;
          font-family: sans-serif;
        }
        .promo-apply-btn {
          height: 40px;
          padding: 0 16px;
          background-color: transparent;
          border: 1px solid rgba(27, 35, 74, 0.15);
          border-radius: 6px;
          cursor: pointer;
          font-family: sans-serif;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        .summary-calculation-rows {
          font-family: sans-serif;
          font-size: 14px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(27, 35, 74, 0.15);
          color: #6b6661;
        }
        .row-space-flex {
          display: flex;
          justify-content: space-between;
        }
        .summary-dark-value {
          font-weight: 600;
          color: #1b234a;
        }
        .summary-complimentary-value {
          font-weight: 600;
          color: #065f46;
        }
        .grand-total-sum-block {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding: 24px 0;
        }
        .total-title-lbl {
          font-size: 18px;
          font-weight: 600;
        }
        .total-numeric-val {
          font-family: sans-serif;
          font-size: 22px;
          font-weight: 700;
        }
        .proceed-checkout-btn {
          width: 100%;
          height: 50px;
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
          box-shadow: 0 4px 12px rgba(27, 35, 74, 0.15);
        }
        .secure-checkout-footer {
          margin-top: 24px;
          text-transform: uppercase;
          font-size: 10px;
          letter-spacing: 0.1em;
          text-align: center;
          color: #6b6661;
          font-family: sans-serif;
        }

        /* Clean Responsive Screen Adjustments via Media Queries */
        @media (max-width: 1024px) {
          .cart-layout-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          .summary-sidebar-card {
            position: relative;
            top: 0;
          }
          .cart-item-card {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
          .action-control-group {
            width: 100%;
            justify-content: space-between;
          }
          .total-line-price-display {
            text-align: left;
            min-width: auto;
          }
        }
      `}</style>

      <div className="cart-page">
        <div className="cart-wrapper">
          <h1 className="cart-heading">Shopping Cart</h1>

          <div className="cart-layout-grid">
            {/* List of Cart Items */}
            <div className="item-list-container">
              {cartItems.map((item: CartItem) => (
                <div key={`${item._id}-${item.size}`} className="cart-item-card">
                  
                  {/* Left Side: Product Details */}
                  <div className="product-meta-block">
                    <div className="image-container-frame">
                      <img src={item.image} alt={item.name} className="product-card-img" />
                    </div>
                    <div className="details-text-block">
                      <span className="category-tag-label">{item.category || 'Premium Fragrance'}</span>
                      <h3 className="item-name-heading">{item.name}</h3>
                      <p className="item-size-spec">Size: <span className="highlighted-size">{item.size}</span></p>
                      
                      <p className="item-base-price">
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
                  <div className="action-control-group">
                    {/* Plus/Minus Custom Selector */}
                    <div className="quantity-selector-matrix">
                      <button 
                        type="button"
                        className="quantity-control-btn" 
                        onClick={() => updateQuantity(item._id, item.size, item.quantity - 1)}
                      >
                        −
                      </button>
                      <span className="quantity-current-val">{item.quantity}</span>
                      <button 
                        type="button"
                        className="quantity-control-btn" 
                        onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>

                    {/* Calculated Cost Display & Delete Cross */}
                    <div className="price-wrapper-block">
                      <span className="total-line-price-display">
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
                        className="remove-cross-btn" 
                        onClick={() => removeFromCart(item._id, item.size)}
                        title="Remove Item"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                </div>
              ))}

              <div className="continue-shopping-link-wrap">
                <Link to="/shop" style={{ textDecoration: 'none' }}>
                  <span className="continue-shopping-text-btn">
                    ← Continue Shopping
                  </span>
                </Link>
              </div>
            </div>

            {/* Checkout Breakdown Sidebar */}
            <div className="summary-sidebar-card">
              <h2 className="sidebar-title-heading">Order Summary</h2>
              
              <div className="promo-flex-box">
                <input 
                  type="text" 
                  placeholder="Promo code" 
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="promo-code-input" 
                />
                <button type="button" className="promo-apply-btn">Apply</button>
              </div>

              <div className="summary-calculation-rows">
                <div className="row-space-flex">
                  <span>Subtotal</span>
                  <span className="summary-dark-value">Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="row-space-flex">
                  <span>Shipping</span>
                  <span className="summary-complimentary-value">
                    {shippingCost === 0 ? "Complimentary" : `Rs. ${shippingCost.toLocaleString()}`}
                  </span>
                </div>
              </div>

              <div className="grand-total-sum-block">
                <span className="total-title-lbl">Total</span>
                <span className="total-numeric-val">
                  Rs. {totalCost.toLocaleString()}
                </span>
              </div>

              <button 
                type="button"
                onClick={() => navigate('/checkout')} 
                className="proceed-checkout-btn"
              >
                Proceed to Checkout →
              </button>

              <div className="secure-checkout-footer">
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