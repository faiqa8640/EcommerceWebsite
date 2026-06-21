import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Footer from "../components/Footer";
import { getOrderByIdAPI, cancelOrderAPI } from '../data/apiService';
import { Order } from '../types';

// Your store's helpline + bank/JazzCash receiving details.
// Edit these to match your real numbers/accounts.
const HELPLINE_NUMBER = "+92 3447175455";
const BANK_DETAILS = [
  { label: "JazzCash", accountName: "MYBRAND", accountNumber: "0328-7175455" },
  { label: "Easypaisa", accountName: "MYBRAND", accountNumber: "0344-7175455" },
];

const LOCKED_STATUSES = ["Shipped", "Delivered", "Cancelled"];

export const ThankYou: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      setIsLoading(true);
      try {
        const data = await getOrderByIdAPI(orderId);
        if (data.success && data.order) {
          setOrder(data.order);
        } else {
          setError(data.message || "We couldn't find this order.");
        }
      } catch (err: any) {
        setError(err.message || "Something went wrong loading your order.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handleCancelOrder = async () => {
    if (!order) return;
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order? This cannot be undone."
    );
    if (!confirmed) return;

    setIsCancelling(true);
    try {
      const data = await cancelOrderAPI(order._id);
      if (data.success && data.order) {
        setOrder(data.order);
      } else {
        alert(data.message || "Couldn't cancel the order. Please try again.");
      }
    } catch (err: any) {
      alert(err.message || "Something went wrong cancelling the order.");
    } finally {
      setIsCancelling(false);
    }
  };

  const canCancel = order && !LOCKED_STATUSES.includes(order.status);

  return (
    <>
      <style>{`
        .thankyou-page {
          background: #eae0cfd6;
          color: #1b234a;
          min-height: 100vh;
          padding: 48px 24px 64px 24px;
          font-family: serif;
          box-sizing: border-box;
        }
        .thankyou-wrapper {
          max-width: 760px;
          margin: 0 auto;
        }
        .thankyou-banner {
          background-color: #fcfaf7;
          border: 1px solid rgba(27, 35, 74, 0.15);
          border-radius: 12px;
          padding: 28px;
          text-align: center;
          margin-bottom: 28px;
          box-shadow: 0 2px 8px rgba(27, 35, 74, 0.04);
        }
        .thankyou-banner h1 {
          font-size: 22px;
          letter-spacing: 0.05em;
          margin: 0 0 8px 0;
          font-weight: 600;
        }
        .thankyou-banner p {
          font-family: sans-serif;
          font-size: 14px;
          color: #6b6661;
          margin: 0;
        }
        .meta-grid {
          background-color: #fcfaf7;
          border: 1px solid rgba(27, 35, 74, 0.15);
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 28px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          text-align: center;
          box-shadow: 0 2px 8px rgba(27, 35, 74, 0.02);
        }
        .meta-item-label {
          font-family: sans-serif;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #6b6661;
          margin-bottom: 6px;
        }
        .meta-item-value {
          font-family: sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: #1b234a;
        }
        .bank-card {
          background-color: #f4efe6;
          border: 1px solid rgba(27, 35, 74, 0.15);
          border-radius: 12px;
          padding: 24px 28px;
          margin-bottom: 28px;
        }
        .bank-card h2 {
          font-size: 17px;
          letter-spacing: 0.05em;
          margin: 0 0 16px 0;
        }
        .bank-row {
          font-family: sans-serif;
          font-size: 14px;
          padding: 10px 0;
          border-top: 1px solid rgba(27, 35, 74, 0.1);
        }
        .bank-row:first-of-type {
          border-top: none;
        }
        .bank-row-label {
          font-weight: 600;
          color: #1b234a;
        }
        .bank-row-detail {
          color: #4a4540;
        }
        .bank-note {
          font-family: sans-serif;
          font-size: 12px;
          color: #6b6661;
          margin-top: 12px;
          line-height: 1.6;
        }
        .section-heading {
          font-size: 18px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          text-align: center;
          margin: 0 0 18px 0;
          font-weight: 600;
        }
        .order-table-card {
          background-color: #fcfaf7;
          border: 1px solid rgba(27, 35, 74, 0.15);
          border-radius: 12px;
          padding: 24px 28px;
          margin-bottom: 28px;
          box-shadow: 0 2px 8px rgba(27, 35, 74, 0.02);
        }
        .order-table-head {
          display: flex;
          justify-content: space-between;
          font-family: sans-serif;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #6b6661;
          padding-bottom: 10px;
          border-bottom: 1px solid rgba(27, 35, 74, 0.15);
          margin-bottom: 6px;
        }
        .order-table-row {
          display: flex;
          justify-content: space-between;
          font-family: sans-serif;
          font-size: 14px;
          padding: 12px 0;
          border-bottom: 1px solid rgba(27, 35, 74, 0.08);
        }
        .order-table-row.total-row {
          border-bottom: none;
          font-weight: 700;
          font-size: 16px;
          padding-top: 16px;
        }
        .item-name-cell {
          color: #1b234a;
        }
        .item-name-cell span {
          color: #6b6661;
          font-size: 12px;
        }
        .addresses-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 28px;
        }
        .address-card {
          background-color: #fcfaf7;
          border: 1px solid rgba(27, 35, 74, 0.15);
          border-radius: 12px;
          padding: 22px;
        }
        .address-card h3 {
          font-size: 15px;
          margin: 0 0 12px 0;
          letter-spacing: 0.05em;
        }
        .address-card p {
          font-family: sans-serif;
          font-size: 13px;
          color: #4a4540;
          margin: 0 0 4px 0;
          line-height: 1.6;
        }
        .helpline-card {
          background-color: #f4efe6;
          border: 1px solid rgba(27, 35, 74, 0.15);
          border-radius: 12px;
          padding: 22px 28px;
          text-align: center;
          margin-bottom: 28px;
          font-family: sans-serif;
        }
        .helpline-card p {
          margin: 0 0 4px 0;
          font-size: 13px;
          color: #6b6661;
        }
        .helpline-number {
          font-size: 18px;
          font-weight: 700;
          color: #1b234a;
          letter-spacing: 0.04em;
        }
        .action-row {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }
        .btn-primary {
          flex: 1;
          min-width: 180px;
          height: 50px;
          background-color: #1b234a;
          color: #ffffff;
          border: none;
          border-radius: 6px;
          font-family: sans-serif;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .btn-secondary {
          flex: 1;
          min-width: 180px;
          height: 50px;
          background-color: transparent;
          color: #b3261e;
          border: 1px solid #b3261e;
          border-radius: 6px;
          font-family: sans-serif;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          font-weight: 600;
          cursor: pointer;
        }
        .btn-secondary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .status-pill {
          display: inline-block;
          font-family: sans-serif;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-weight: 600;
          padding: 4px 12px;
          border-radius: 20px;
          background-color: rgba(27, 35, 74, 0.08);
          color: #1b234a;
        }
        .status-pill.cancelled {
          background-color: rgba(179, 38, 30, 0.1);
          color: #b3261e;
        }
        .loading-state, .error-state {
          text-align: center;
          padding: 80px 20px;
          font-family: sans-serif;
          color: #6b6661;
        }
        .cancelled-note {
          font-family: sans-serif;
          font-size: 13px;
          color: #b3261e;
          text-align: center;
          margin-bottom: 20px;
        }
        @media (max-width: 700px) {
          .meta-grid {
            grid-template-columns: 1fr 1fr;
          }
          .addresses-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="thankyou-page">
        <div className="thankyou-wrapper">

          {isLoading && (
            <div className="loading-state">Loading your order details…</div>
          )}

          {!isLoading && error && (
            <div className="error-state">
              <p>{error}</p>
              <Link to="/shop" style={{ color: '#1b234a', fontFamily: 'sans-serif' }}>
                Continue shopping →
              </Link>
            </div>
          )}

          {!isLoading && order && (
            <>
              <div className="thankyou-banner">
                <h1>Thank you. Your order has been received.</h1>
                <p>A confirmation has been saved to your account.</p>
              </div>

              <div className="meta-grid">
                <div>
                  <div className="meta-item-label">Order Number</div>
                  <div className="meta-item-value">#{order._id.slice(-6).toUpperCase()}</div>
                </div>
                <div>
                  <div className="meta-item-label">Date</div>
                  <div className="meta-item-value">
                    {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                </div>
                <div>
                  <div className="meta-item-label">Total</div>
                  <div className="meta-item-value">Rs. {order.total.toLocaleString()}</div>
                </div>
                <div>
                  <div className="meta-item-label">Order Status</div>
                  <div className="meta-item-value">
                    <span className={`status-pill ${order.status === 'Cancelled' ? 'cancelled' : ''}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>

              {order.status === 'Cancelled' && (
                <p className="cancelled-note">This order has been cancelled.</p>
              )}

              {order.paymentMethod === 'Direct Bank Transfer' && order.status !== 'Cancelled' && (
                <div className="bank-card">
                  <h2>Our Bank Details</h2>
                  {BANK_DETAILS.map((b, i) => (
                    <div className="bank-row" key={i}>
                      <div className="bank-row-label">{b.label} — {b.accountName}</div>
                      <div className="bank-row-detail">Account number: {b.accountNumber}</div>
                    </div>
                  ))}
                  <p className="bank-note">
                    Please use order number <strong>#{order._id.slice(-6).toUpperCase()}</strong> as your payment reference, and keep your transaction screenshot handy. Your order will ship once we verify the payment.
                  </p>
                </div>
              )}

              <h2 className="section-heading">Order Details</h2>
              <div className="order-table-card">
                <div className="order-table-head">
                  <span>Product</span>
                  <span>Total</span>
                </div>
                {order.items.map((item, i) => (
                  <div className="order-table-row" key={i}>
                    <span className="item-name-cell">
                      {item.name} <span>× {item.quantity} ({item.size})</span>
                    </span>
                    <span>Rs. {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
                <div className="order-table-row">
                  <span>Subtotal</span>
                  <span>Rs. {order.subtotal.toLocaleString()}</span>
                </div>
                <div className="order-table-row">
                  <span>Shipping ({order.shippingMethod})</span>
                  <span>Rs. {order.shippingCost.toLocaleString()}</span>
                </div>
                <div className="order-table-row">
                  <span>Payment Method</span>
                  <span>{order.paymentMethod}</span>
                </div>
                <div className="order-table-row total-row">
                  <span>Total</span>
                  <span>Rs. {order.total.toLocaleString()}</span>
                </div>
              </div>

              <div className="addresses-grid">
                <div className="address-card">
                  <h3>Shipping Address</h3>
                  <p>{order.shippingAddress.streetAddress}</p>
                  {order.shippingAddress.apartment && <p>{order.shippingAddress.apartment}</p>}
                  <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                  <p>{order.shippingAddress.country}</p>
                </div>
                <div className="address-card">
                  <h3>Need Help?</h3>
                  <p>Call or WhatsApp us with your order number and we'll sort it out.</p>
                  <p style={{ color: '#1b234a', fontWeight: 600, marginTop: 10 }}>{HELPLINE_NUMBER}</p>
                </div>
              </div>

              <div className="action-row">
                <Link to="/shop" className="btn-primary">
                  Continue Shopping
                </Link>
                {canCancel && (
                  <button
                    className="btn-secondary"
                    onClick={handleCancelOrder}
                    disabled={isCancelling}
                  >
                    {isCancelling ? 'Cancelling…' : 'Cancel Order'}
                  </button>
                )}
              </div>
            </>
          )}

        </div>
      </div>
      <Footer />
    </>
  );
};
