import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAddresses } from "../context/AddressContext";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";
import { createOrder } from "../data/apiService";
import { Address, AddressPayload, OrderPayload } from "../types";

// ── Label icon map ────────────────────────────────────────────────────────────
const LABEL_ICONS: Record<string, string> = {
  Home: "🏠",
  Office: "🏢",
  University: "🎓",
  Other: "📍",
};

const LABEL_OPTIONS = ["Home", "Office", "University", "Other"] as const;

// ── Blank form state ──────────────────────────────────────────────────────────
const BLANK_ADDRESS_FORM: AddressPayload = {
  label: "Home",
  customLabel: "",
  recipientName: "",
  phone: "",
  streetAddress: "",
  apartment: "",
  city: "",
  postalCode: "",
  country: "Pakistan",
  isDefault: false,
};

export const Checkout: React.FC = () => {
  const { cartItems, getCartSubtotal, clearCart } = useCart();
  const { addresses, defaultAddress, addAddress, refreshAddresses } = useAddresses();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  // Selected delivery address
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  // Address picker modal state
  const [showAddressPicker, setShowAddressPicker] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addressForm, setAddressForm] = useState<AddressPayload>(BLANK_ADDRESS_FORM);
  const [addingAddress, setAddingAddress] = useState(false);

  // Shipping / payment
  const [shippingMethod, setShippingMethod] = useState<"standard_shipping" | "express_shipping">("standard_shipping");
  const [paymentMethod, setPaymentMethod] = useState<"cash_on_delivery" | "direct_bank_transfer">("cash_on_delivery");

  // Pricing
  const subtotal = getCartSubtotal();
  const shippingCost = shippingMethod === "express_shipping" ? 2000 : 500;
  const total = subtotal + shippingCost;

  // Auto-select default address on load
  useEffect(() => {
    if (!selectedAddressId && defaultAddress) {
      setSelectedAddressId(defaultAddress._id);
    }
  }, [defaultAddress, selectedAddressId]);

  const selectedAddress = addresses.find((a) => a._id === selectedAddressId) || null;

  // ── Add new address ─────────────────────────────────────────────────────────
  const handleAddNewAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressForm.recipientName || !addressForm.phone || !addressForm.streetAddress || !addressForm.city || !addressForm.postalCode) {
      alert("Please fill in all required fields");
      return;
    }
    setAddingAddress(true);
    try {
      const newAddr = await addAddress(addressForm);
      if (newAddr) {
        setSelectedAddressId(newAddr._id);
        setShowAddForm(false);
        setShowAddressPicker(false);
        setAddressForm(BLANK_ADDRESS_FORM);
      } else {
        alert("Failed to save address. Please try again.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAddingAddress(false);
    }
  };

  // ── Place order ─────────────────────────────────────────────────────────────
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to place an order");
      navigate("/login");
      return;
    }

    if (!selectedAddress) {
      alert("Please select or add a delivery address");
      setShowAddressPicker(true);
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty");
      return;
    }

    setIsLoading(true);

    // ── Build the address snapshot ──────────────────────────────────────────
    // This is an immutable copy stored on the order.
    // Even if the user deletes or edits the address later, the order keeps this.
    // recipientName and phone are NOT part of the snapshot — they remain on the
    // Address document and are accessible via the addressId ref when populated.
    const shippingAddressSnapshot = {
      label: selectedAddress.label === "Other"
        ? (selectedAddress.customLabel || "Other")
        : selectedAddress.label,
      streetAddress: selectedAddress.streetAddress,
      apartment: selectedAddress.apartment || undefined,
      city: selectedAddress.city,
      postalCode: selectedAddress.postalCode,
      country: selectedAddress.country,
    };

    const orderPayload: OrderPayload = {
      items: cartItems.map((item) => ({
        product: item._id,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        // name is intentionally omitted — resolved via populate on backend
      })),

      // ── Send BOTH the reference ID and the snapshot ──────────────────────
      addressId: selectedAddress._id,          // ref to the Address collection document
      shippingAddress: shippingAddressSnapshot, // snapshot copied at checkout time

      paymentMethod,
      shippingMethod,
      shippingCost,
      // total & subtotal NOT sent — server computes total from items + shippingCost
    };

    try {
      const data = await createOrder(orderPayload);
      if (data.success && data.order) {
        clearCart();
        navigate(`/order-confirmation/${data.order._id}`);
      } else {
        alert(`Failed to place order: ${data.message || "Please try again."}`);
      }
    } catch (err: any) {
      console.error("Checkout error:", err);
      alert(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        /* ── Base ─────────────────────────────────── */
        .checkout-page {
          background: #eae0cfd6;
          color: #1b234a;
          min-height: 100vh;
          padding: 12px 24px 64px;
          font-family: serif;
          box-sizing: border-box;
        }
        .checkout-wrapper { max-width: 1200px; margin: 0 auto; }
        .checkout-heading {
          font-size: 28px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin-bottom: 40px;
          font-weight: 600;
          border-bottom: 1px solid rgba(27,35,74,0.15);
          padding-bottom: 16px;
        }
        .checkout-form {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 40px;
          align-items: start;
        }
        .left-stack { display: flex; flex-direction: column; gap: 32px; }
        .form-section-card {
          background-color: #fcfaf7;
          padding: 28px;
          border-radius: 12px;
          border: 1px solid rgba(27,35,74,0.15);
          box-shadow: 0 2px 8px rgba(27,35,74,0.02);
        }
        .section-title {
          font-size: 18px;
          margin: 0 0 20px;
          letter-spacing: 0.05em;
          border-bottom: 1px solid rgba(27,35,74,0.08);
          padding-bottom: 10px;
        }

        /* ── Contact info display ─────────────────── */
        .contact-info-display {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 16px;
          background: #f5f0e8;
          border-radius: 8px;
          border: 1px solid rgba(27,35,74,0.1);
        }
        .contact-info-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          font-family: sans-serif;
        }
        .contact-info-label {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #6b6661;
        }
        .contact-info-value {
          font-size: 14px;
          font-weight: 600;
          color: #1b234a;
        }
        .contact-info-note {
          margin: 12px 0 0;
          font-size: 12px;
          font-family: sans-serif;
          color: #6b6661;
        }
        .contact-info-note a {
          color: #1b234a;
          text-decoration: underline;
        }

        /* ── Selected address display ─────────────── */
        .selected-address-display {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 16px;
          background: #f5f0e8;
          border-radius: 8px;
          border: 1px solid rgba(27,35,74,0.1);
        }
        .selected-address-info { flex: 1; }
        .selected-address-label {
          font-weight: 600;
          font-size: 14px;
          margin-bottom: 4px;
          color: #1b234a;
        }
        .selected-address-name {
          font-size: 13px;
          color: #555;
          margin-bottom: 2px;
        }
        .selected-address-text {
          font-size: 13px;
          color: #555;
        }
        .change-address-btn {
          background: none;
          border: 1px solid #1b234a;
          padding: 6px 14px;
          border-radius: 6px;
          font-size: 13px;
          cursor: pointer;
          color: #1b234a;
          white-space: nowrap;
          font-family: sans-serif;
        }
        .change-address-btn:hover { background: #1b234a; color: #fff; }

        .no-address-prompt {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px;
          background: #fff8f0;
          border: 1px dashed rgba(27,35,74,0.25);
          border-radius: 8px;
        }
        .no-address-prompt p { margin: 0; font-size: 14px; color: #888; font-family: sans-serif; }
        .add-address-prompt-btn {
          background: #1b234a;
          color: #fff;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 13px;
          cursor: pointer;
          font-family: sans-serif;
        }

        /* ── Shipping & Payment options ───────────── */
        .option-list { display: flex; flex-direction: column; gap: 12px; }
        .option-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 14px 16px;
          border: 1px solid rgba(27,35,74,0.12);
          border-radius: 8px;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
          background: #fff;
        }
        .option-item.selected {
          border-color: #1b234a;
          background: #f5f0e8;
        }
        .option-item input[type="radio"] { margin-top: 3px; accent-color: #1b234a; }
        .option-label { font-size: 14px; font-weight: 600; font-family: sans-serif; }
        .option-desc  { font-size: 12px; color: #666; font-family: sans-serif; margin-top: 2px; }

        /* ── Order summary ────────────────────────── */
        .order-summary-card {
          background: #fcfaf7;
          padding: 28px;
          border-radius: 12px;
          border: 1px solid rgba(27,35,74,0.15);
          position: sticky;
          top: 24px;
        }
        .summary-items { display: flex; flex-direction: column; gap: 14px; margin-bottom: 20px; }
        .summary-item  { display: flex; align-items: center; gap: 12px; }
        .summary-item-img {
          width: 60px;
          height: 60px;
          object-fit: cover;
          border-radius: 8px;
          background: #eee;
        }
        .summary-item-info { flex: 1; }
        .summary-item-name { font-size: 13px; font-weight: 600; margin-bottom: 2px; }
        .summary-item-meta { font-size: 12px; color: #777; font-family: sans-serif; }
        .summary-item-price { font-size: 13px; font-weight: 600; font-family: sans-serif; }

        .summary-divider { border: none; border-top: 1px solid rgba(27,35,74,0.08); margin: 16px 0; }
        .summary-row {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          font-family: sans-serif;
          margin-bottom: 8px;
          color: #555;
        }
        .summary-row.total {
          font-size: 16px;
          font-weight: 700;
          color: #1b234a;
          margin-top: 4px;
        }

        .place-order-btn {
          width: 100%;
          padding: 14px;
          background: #1b234a;
          color: #f5e6c8;
          border: none;
          border-radius: 8px;
          font-size: 15px;
          letter-spacing: 0.08em;
          cursor: pointer;
          margin-top: 20px;
          font-family: serif;
          transition: background 0.2s;
        }
        .place-order-btn:hover:not(:disabled) { background: #2a3560; }
        .place-order-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        /* ── Modal ────────────────────────────────── */
        .modal-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.45);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }
        .modal-box {
          background: #fcfaf7;
          border-radius: 14px;
          width: 100%;
          max-width: 520px;
          max-height: 85vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0,0,0,0.2);
        }
        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px 16px;
          border-bottom: 1px solid rgba(27,35,74,0.1);
          position: sticky;
          top: 0;
          background: #fcfaf7;
          z-index: 1;
        }
        .modal-title { font-size: 17px; font-weight: 600; margin: 0; }
        .modal-close-btn {
          background: none; border: none; font-size: 18px;
          cursor: pointer; color: #666; padding: 4px 8px;
        }
        .modal-body { padding: 20px 24px 24px; }

        /* Saved address cards in modal */
        .saved-addresses-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px; }
        .address-card {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 14px;
          border: 1.5px solid rgba(27,35,74,0.12);
          border-radius: 10px;
          cursor: pointer;
          transition: border-color 0.15s, background 0.15s;
        }
        .address-card.selected { border-color: #1b234a; background: #f0eee8; }
        .address-card-radio {
          width: 16px; height: 16px; border-radius: 50%;
          border: 2px solid #bbb; margin-top: 3px; flex-shrink: 0;
          transition: border-color 0.15s;
        }
        .address-card-radio.checked { border-color: #1b234a; background: #1b234a; }
        .address-card-content { flex: 1; }
        .address-card-top { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
        .address-card-label { font-size: 13px; font-weight: 600; }
        .default-tag {
          font-size: 10px; padding: 2px 6px; border-radius: 10px;
          background: #1b234a; color: #fff; font-family: sans-serif;
        }
        .address-card-name { font-size: 13px; color: #555; margin: 2px 0; font-family: sans-serif; }
        .address-card-text { font-size: 12px; color: #777; font-family: sans-serif; }

        .add-new-address-btn {
          width: 100%; padding: 12px;
          border: 1.5px dashed rgba(27,35,74,0.3); border-radius: 10px;
          background: none; cursor: pointer; font-size: 14px;
          color: #1b234a; font-family: sans-serif;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          margin-bottom: 16px;
          transition: background 0.15s;
        }
        .add-new-address-btn:hover { background: rgba(27,35,74,0.04); }

        .confirm-address-btn {
          width: 100%; padding: 13px;
          background: #1b234a; color: #fff; border: none;
          border-radius: 8px; font-size: 14px; cursor: pointer;
          font-family: sans-serif; letter-spacing: 0.05em;
        }
        .confirm-address-btn:hover { background: #2a3560; }

        /* Address form inside modal */
        .address-form { display: flex; flex-direction: column; gap: 16px; }
        .field-group { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .field-wrap { display: flex; flex-direction: column; gap: 5px; }
        .field-wrap.full { grid-column: 1 / -1; }
        .field-label-sm { font-size: 12px; font-weight: 600; color: #555; font-family: sans-serif; }
        .field-input {
          padding: 9px 12px; border: 1px solid rgba(27,35,74,0.2);
          border-radius: 7px; font-size: 13px; background: #fff;
          font-family: sans-serif; outline: none; transition: border-color 0.15s;
        }
        .field-input:focus { border-color: #1b234a; }

        .label-picker { display: flex; gap: 8px; flex-wrap: wrap; }
        .label-chip {
          padding: 6px 12px; border-radius: 20px;
          border: 1.5px solid rgba(27,35,74,0.2); background: none;
          cursor: pointer; font-size: 13px; font-family: sans-serif;
          transition: all 0.15s;
        }
        .label-chip.active { background: #1b234a; color: #fff; border-color: #1b234a; }

        .form-actions { display: flex; gap: 10px; }
        .btn-primary {
          flex: 1; padding: 12px; background: #1b234a; color: #fff;
          border: none; border-radius: 8px; font-size: 14px; cursor: pointer;
          font-family: sans-serif;
        }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
        .btn-secondary {
          flex: 1; padding: 12px; background: none;
          border: 1px solid rgba(27,35,74,0.25); border-radius: 8px;
          font-size: 14px; cursor: pointer; font-family: sans-serif; color: #1b234a;
        }
      `}</style>

      <div className="checkout-page">
        <div className="checkout-wrapper">
          <h1 className="checkout-heading">Checkout</h1>

          <form className="checkout-form" onSubmit={handlePlaceOrder}>
            <div className="left-stack">

              {/* ── Contact Information ──────────────────────────────────── */}
              <div className="form-section-card">
                <h2 className="section-title">Contact Information</h2>
                <div className="contact-info-display">
                  <div className="contact-info-row">
                    <span className="contact-info-label">Full Name</span>
                    <span className="contact-info-value">{user?.name || "—"}</span>
                  </div>
                  <div className="contact-info-row">
                    <span className="contact-info-label">Email Address</span>
                    <span className="contact-info-value">{user?.email || "—"}</span>
                  </div>
                </div>
                <p className="contact-info-note">
                  Your order confirmation and shipping updates will be sent here. To change
                  it, update your <Link to="/profile">account details</Link>.
                </p>
              </div>

              {/* ── Delivery Address ─────────────────────────────────────── */}
              <div className="form-section-card">
                <h2 className="section-title">Delivery Address</h2>

                {selectedAddress ? (
                  <div className="selected-address-display">
                    <div className="selected-address-info">
                      <p className="selected-address-label">
                        {LABEL_ICONS[selectedAddress.label] || "📍"}{" "}
                        {selectedAddress.label === "Other"
                          ? selectedAddress.customLabel || "Other"
                          : selectedAddress.label}
                        {selectedAddress.isDefault && (
                          <span className="default-tag" style={{ marginLeft: 8 }}>Default</span>
                        )}
                      </p>
                      <p className="selected-address-name">
                        {selectedAddress.recipientName} · {selectedAddress.phone}
                      </p>
                      <p className="selected-address-text">
                        {selectedAddress.streetAddress}
                        {selectedAddress.apartment ? `, ${selectedAddress.apartment}` : ""},{" "}
                        {selectedAddress.city}, {selectedAddress.postalCode}, {selectedAddress.country}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="change-address-btn"
                      onClick={() => setShowAddressPicker(true)}
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <div className="no-address-prompt">
                    <p>No delivery address selected</p>
                    <button
                      type="button"
                      className="add-address-prompt-btn"
                      onClick={() => { setShowAddressPicker(true); setShowAddForm(addresses.length === 0); }}
                    >
                      + Add Address
                    </button>
                  </div>
                )}
              </div>

              {/* ── Shipping Method ───────────────────────────────────────── */}
              <div className="form-section-card">
                <h2 className="section-title">Shipping Method</h2>
                <div className="option-list">
                  {(["standard_shipping", "express_shipping"] as const).map((method) => (
                    <label
                      key={method}
                      className={`option-item ${shippingMethod === method ? "selected" : ""}`}
                    >
                      <input
                        type="radio"
                        name="shippingMethod"
                        value={method}
                        checked={shippingMethod === method}
                        onChange={() => setShippingMethod(method)}
                      />
                      <div>
                        <p className="option-label">
                          {method === "standard_shipping" ? "Standard Shipping" : "Express Shipping"}
                        </p>
                        <p className="option-desc">
                          {method === "standard_shipping"
                            ? "5–7 business days · PKR 500"
                            : "1–2 business days · PKR 2,000"}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* ── Payment Method ────────────────────────────────────────── */}
              <div className="form-section-card">
                <h2 className="section-title">Payment Method</h2>
                <div className="option-list">
                  {(["cash_on_delivery", "direct_bank_transfer"] as const).map((method) => (
                    <label
                      key={method}
                      className={`option-item ${paymentMethod === method ? "selected" : ""}`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method}
                        checked={paymentMethod === method}
                        onChange={() => setPaymentMethod(method)}
                      />
                      <div>
                        <p className="option-label">
                          {method === "cash_on_delivery" ? "Cash on Delivery" : "Direct Bank Transfer"}
                        </p>
                        <p className="option-desc">
                          {method === "cash_on_delivery"
                            ? "Pay when your order arrives"
                            : "Transfer directly to our bank account"}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Order Summary ─────────────────────────────────────────────── */}
            <div className="order-summary-card">
              <h2 className="section-title">Order Summary</h2>

              <div className="summary-items">
                {cartItems.map((item) => (
                  <div key={`${item._id}-${item.size}`} className="summary-item">
                    <img
                      src={item.image || ""}
                      alt={item.name}
                      className="summary-item-img"
                    />
                    <div className="summary-item-info">
                      <p className="summary-item-name">{item.name}</p>
                      <p className="summary-item-meta">{item.size} · Qty {item.quantity}</p>
                    </div>
                    <span className="summary-item-price">
                      PKR {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <hr className="summary-divider" />

              <div className="summary-row">
                <span>Subtotal</span>
                <span>PKR {subtotal.toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>PKR {shippingCost.toLocaleString()}</span>
              </div>
              <hr className="summary-divider" />
              <div className="summary-row total">
                <span>Total</span>
                <span>PKR {total.toLocaleString()}</span>
              </div>

              <button type="submit" className="place-order-btn" disabled={isLoading}>
                {isLoading ? "Placing Order..." : "Place Order"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ── Address Picker Modal ─────────────────────────────────────────────── */}
      {showAddressPicker && (
        <div
          className="modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowAddressPicker(false);
              setShowAddForm(false);
            }
          }}
        >
          <div className="modal-box">
            <div className="modal-header">
              <h3 className="modal-title">
                {showAddForm ? "Add New Address" : "Select Delivery Address"}
              </h3>
              <button
                className="modal-close-btn"
                onClick={() => {
                  setShowAddressPicker(false);
                  setShowAddForm(false);
                  setAddressForm(BLANK_ADDRESS_FORM);
                }}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              {!showAddForm ? (
                <>
                  {addresses.length > 0 && (
                    <div className="saved-addresses-list">
                      {addresses.map((addr) => (
                        <div
                          key={addr._id}
                          className={`address-card ${selectedAddressId === addr._id ? "selected" : ""}`}
                          onClick={() => setSelectedAddressId(addr._id)}
                        >
                          <div
                            className={`address-card-radio ${
                              selectedAddressId === addr._id ? "checked" : ""
                            }`}
                          />
                          <div className="address-card-content">
                            <div className="address-card-top">
                              <span className="address-card-label">
                                {LABEL_ICONS[addr.label] || "📍"}
                                {addr.label === "Other"
                                  ? addr.customLabel || "Other"
                                  : addr.label}
                              </span>
                              {addr.isDefault && (
                                <span className="default-tag">Default</span>
                              )}
                            </div>
                            <p className="address-card-name">
                              {addr.recipientName} · {addr.phone}
                            </p>
                            <p className="address-card-text">
                              {addr.streetAddress}
                              {addr.apartment ? `, ${addr.apartment}` : ""},{" "}
                              {addr.city}, {addr.postalCode}, {addr.country}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    className="add-new-address-btn"
                    onClick={() => setShowAddForm(true)}
                  >
                    <span style={{ fontSize: "18px" }}>+</span> Add New Address
                  </button>

                  {selectedAddressId && (
                    <button
                      className="confirm-address-btn"
                      onClick={() => {
                        setShowAddressPicker(false);
                        setShowAddForm(false);
                      }}
                    >
                      Deliver Here
                    </button>
                  )}
                </>
              ) : (
                /* ── Add New Address Form ── */
                <form onSubmit={handleAddNewAddress} className="address-form">
                  <div>
                    <p className="field-label-sm" style={{ marginBottom: "8px" }}>
                      Address Type
                    </p>
                    <div className="label-picker">
                      {LABEL_OPTIONS.map((lbl) => (
                        <button
                          key={lbl}
                          type="button"
                          className={`label-chip ${
                            addressForm.label === lbl ? "active" : ""
                          }`}
                          onClick={() =>
                            setAddressForm({ ...addressForm, label: lbl })
                          }
                        >
                          {LABEL_ICONS[lbl]} {lbl}
                        </button>
                      ))}
                    </div>
                  </div>

                  {addressForm.label === "Other" && (
                    <div className="field-wrap">
                      <label className="field-label-sm">
                        Custom Label (e.g. "Mom's Place")
                      </label>
                      <input
                        className="field-input"
                        value={addressForm.customLabel}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            customLabel: e.target.value,
                          })
                        }
                        placeholder="e.g. Mom's Place"
                      />
                    </div>
                  )}

                  <div className="field-group">
                    <div className="field-wrap">
                      <label className="field-label-sm">Recipient Name *</label>
                      <input
                        className="field-input"
                        value={addressForm.recipientName}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            recipientName: e.target.value,
                          })
                        }
                        placeholder="Full name"
                        required
                      />
                    </div>
                    <div className="field-wrap">
                      <label className="field-label-sm">Phone Number *</label>
                      <input
                        className="field-input"
                        value={addressForm.phone}
                        onChange={(e) =>
                          setAddressForm({ ...addressForm, phone: e.target.value })
                        }
                        placeholder="03XX-XXXXXXX"
                        required
                      />
                    </div>
                    <div className="field-wrap full">
                      <label className="field-label-sm">Street Address *</label>
                      <input
                        className="field-input"
                        value={addressForm.streetAddress}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            streetAddress: e.target.value,
                          })
                        }
                        placeholder="House / building / street"
                        required
                      />
                    </div>
                    <div className="field-wrap full">
                      <label className="field-label-sm">
                        Apartment / Floor / Suite (optional)
                      </label>
                      <input
                        className="field-input"
                        value={addressForm.apartment}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            apartment: e.target.value,
                          })
                        }
                        placeholder="Apt, floor, etc."
                      />
                    </div>
                    <div className="field-wrap">
                      <label className="field-label-sm">City *</label>
                      <input
                        className="field-input"
                        value={addressForm.city}
                        onChange={(e) =>
                          setAddressForm({ ...addressForm, city: e.target.value })
                        }
                        placeholder="City"
                        required
                      />
                    </div>
                    <div className="field-wrap">
                      <label className="field-label-sm">Postal Code *</label>
                      <input
                        className="field-input"
                        value={addressForm.postalCode}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            postalCode: e.target.value,
                          })
                        }
                        placeholder="54000"
                        required
                      />
                    </div>
                    <div className="field-wrap full">
                      <label className="field-label-sm">Country *</label>
                      <input
                        className="field-input"
                        value={addressForm.country}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            country: e.target.value,
                          })
                        }
                        placeholder="Pakistan"
                        required
                      />
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <input
                      type="checkbox"
                      id="set-default"
                      checked={addressForm.isDefault}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
                          isDefault: e.target.checked,
                        })
                      }
                      style={{ accentColor: "#1b234a", width: 16, height: 16 }}
                    />
                    <label
                      htmlFor="set-default"
                      style={{
                        fontFamily: "sans-serif",
                        fontSize: 13,
                        cursor: "pointer",
                      }}
                    >
                      Set as default address
                    </label>
                  </div>

                  <div className="form-actions">
                    <button
                      type="submit"
                      className="btn-primary"
                      disabled={addingAddress}
                    >
                      {addingAddress ? "Saving..." : "Save Address"}
                    </button>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => {
                        setShowAddForm(false);
                        setAddressForm(BLANK_ADDRESS_FORM);
                      }}
                    >
                      Back
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};
