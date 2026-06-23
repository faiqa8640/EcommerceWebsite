
import React, { useState } from "react";
import { useAddresses } from "../context/AddressContext";
import { Address, AddressPayload } from "../types";

type AddressLabel = "Home" | "Office" | "University" | "Other";

const LABEL_ICONS: Record<string, string> = {
  Home: "🏠",
  Office: "🏢",
  University: "🎓",
  Other: "📍",
};

const LABEL_OPTIONS: AddressLabel[] = ["Home", "Office", "University", "Other"];

const BLANK_FORM: AddressPayload = {
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

type Mode = "list" | "add" | "edit";

export default function AddressesSection() {
  const { addresses, isLoading, addAddress, updateAddress, deleteAddress, setDefaultAddress } = useAddresses();

  const [mode, setMode] = useState<Mode>("list");
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [form, setForm] = useState<AddressPayload>(BLANK_FORM);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const openAdd = () => {
    setForm(BLANK_FORM);
    setEditingAddress(null);
    setMode("add");
  };

  const openEdit = (addr: Address) => {
    setForm({
      label: addr.label,
      customLabel: addr.customLabel || "",
      recipientName: addr.recipientName,
      phone: addr.phone,
      streetAddress: addr.streetAddress,
      apartment: addr.apartment || "",
      city: addr.city,
      postalCode: addr.postalCode,
      country: addr.country,
      isDefault: addr.isDefault,
    });
    setEditingAddress(addr);
    setMode("edit");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.recipientName || !form.phone || !form.streetAddress || !form.city || !form.postalCode) {
      showToast("Please fill in all required fields");
      return;
    }
    setSaving(true);
    try {
      if (mode === "add") {
        const result = await addAddress(form);
        if (result) {
          showToast("Address saved successfully");
          setMode("list");
        } else {
          showToast("Failed to save address");
        }
      } else if (mode === "edit" && editingAddress) {
        const result = await updateAddress(editingAddress._id, form);
        if (result) {
          showToast("Address updated");
          setMode("list");
        } else {
          showToast("Failed to update address");
        }
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Remove this address?")) return;
    await deleteAddress(id);
    showToast("Address removed");
  };

  const handleSetDefault = async (id: string) => {
    await setDefaultAddress(id);
    showToast("Default address updated");
  };

  return (
    <>
      <style>{`
        .addr-section { max-width: 680px; }
        .addr-section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }
        .addr-section-eyebrow {
          font-family: sans-serif;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #4B5694;
          margin: 0 0 4px;
        }
        .addr-section-title {
          font-size: 22px;
          font-weight: 600;
          margin: 0;
          letter-spacing: 0.04em;
          color: #111844;
        }
        .addr-section-title span { color: #4B5694; }

        .addr-add-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #111844;
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 10px 20px;
          font-family: sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          white-space: nowrap;
        }

        /* ── Address Cards Grid ────────────────────── */
        .addr-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
        }
        .addr-card {
          background: #fcfaf7;
          border: 1.5px solid rgba(17,24,68,0.12);
          border-radius: 14px;
          padding: 20px;
          position: relative;
          transition: border-color 0.15s;
        }
        .addr-card.is-default {
          border-color: #4B5694;
          box-shadow: 0 0 0 1px #4B5694;
        }
        .addr-card-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #111844;
          color: #fff;
          font-family: sans-serif;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          padding: 3px 10px;
          border-radius: 20px;
          margin-bottom: 10px;
        }
        .addr-card-badge.default-badge {
          background: #4B5694;
        }
        .addr-card-name {
          font-weight: 700;
          font-size: 15px;
          color: #111844;
          margin: 0 0 2px;
        }
        .addr-card-phone {
          font-family: sans-serif;
          font-size: 13px;
          color: #4B5694;
          margin: 0 0 8px;
        }
        .addr-card-text {
          font-family: sans-serif;
          font-size: 13px;
          color: #5a5a6e;
          line-height: 1.55;
          margin: 0 0 16px;
        }
        .addr-card-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .addr-btn {
          font-family: sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 6px 14px;
          border-radius: 6px;
          cursor: pointer;
          border: none;
          transition: opacity 0.15s;
        }
        .addr-btn:hover { opacity: 0.8; }
        .addr-btn.edit { background: #111844; color: #fff; }
        .addr-btn.default { background: #e8eaf6; color: #4B5694; }
        .addr-btn.default.active { background: #4B5694; color: #fff; }
        .addr-btn.del { background: #fce8e8; color: #c0392b; }

        .addr-empty {
          text-align: center;
          padding: 48px 24px;
          background: #fcfaf7;
          border: 2px dashed rgba(17,24,68,0.15);
          border-radius: 14px;
        }
        .addr-empty-icon { font-size: 40px; margin-bottom: 12px; }
        .addr-empty p { font-family: sans-serif; font-size: 14px; color: #888; margin: 0 0 20px; }
        .addr-empty-add-btn {
          background: #111844;
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 12px 28px;
          font-family: sans-serif;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          cursor: pointer;
        }

        /* ── Form ─────────────────────────────────── */
        .addr-form-header {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 28px;
        }
        .addr-back-btn {
          background: none;
          border: 1px solid rgba(17,24,68,0.25);
          border-radius: 8px;
          padding: 8px 14px;
          font-family: sans-serif;
          font-size: 12px;
          font-weight: 600;
          color: #111844;
          cursor: pointer;
        }
        .addr-form-title { font-size: 20px; font-weight: 600; color: #111844; margin: 0; }

        .addr-form { display: flex; flex-direction: column; gap: 16px; }
        .label-picker { display: flex; gap: 8px; flex-wrap: wrap; }
        .label-chip {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 8px 16px;
          border-radius: 20px;
          border: 1.5px solid rgba(17,24,68,0.2);
          background: #fcfaf7;
          font-family: sans-serif;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s;
        }
        .label-chip.active { background: #111844; color: #fff; border-color: #111844; }
        .field-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }
        .field-item { display: flex; flex-direction: column; gap: 5px; }
        .field-item.span-2 { grid-column: span 2; }
        .field-lbl {
          font-family: sans-serif;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #6b6661;
        }
        .field-inp {
          height: 42px;
          padding: 0 12px;
          border: 1px solid rgba(17,24,68,0.18);
          border-radius: 8px;
          background: #f4efe6;
          font-family: sans-serif;
          font-size: 14px;
          color: #111844;
          box-sizing: border-box;
          outline: none;
          width: 100%;
        }
        .field-inp:focus { border-color: #4B5694; }
        .default-checkbox-row {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: sans-serif;
          font-size: 14px;
          color: #111844;
          cursor: pointer;
        }
        .addr-form-actions { display: flex; gap: 10px; }
        .save-btn {
          flex: 1;
          height: 46px;
          background: #111844;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-family: sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
        }
        .save-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .cancel-btn {
          height: 46px;
          padding: 0 22px;
          background: none;
          border: 1px solid rgba(17,24,68,0.25);
          border-radius: 8px;
          font-family: sans-serif;
          font-size: 12px;
          font-weight: 600;
          color: #111844;
          cursor: pointer;
        }

        @media (max-width: 600px) {
          .field-grid { grid-template-columns: 1fr; }
          .field-item.span-2 { grid-column: span 1; }
          .addr-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="addr-section">
        {/* ── LIST MODE ──────────────────────────────────── */}
        {mode === "list" && (
          <>
            <div className="addr-section-header">
              <div>
                <p className="addr-section-eyebrow">Delivery Locations</p>
                <h2 className="addr-section-title">
                  Saved <span>Addresses</span>
                </h2>
              </div>
              {addresses.length > 0 && (
                <button className="addr-add-btn" onClick={openAdd}>
                  + Add Address
                </button>
              )}
            </div>

            {isLoading ? (
              <p style={{ fontFamily: "sans-serif", color: "#888" }}>Loading addresses...</p>
            ) : addresses.length === 0 ? (
              <div className="addr-empty">
                <div className="addr-empty-icon">📍</div>
                <p>You haven't saved any addresses yet.</p>
                <button className="addr-empty-add-btn" onClick={openAdd}>
                  + Add Your First Address
                </button>
              </div>
            ) : (
              <div className="addr-grid">
                {addresses.map((addr) => (
                  <div key={addr._id} className={`addr-card ${addr.isDefault ? "is-default" : ""}`}>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "10px" }}>
                      <span className="addr-card-badge">
                        {LABEL_ICONS[addr.label] || "📍"}
                        &nbsp;{addr.label === "Other" ? addr.customLabel || "Other" : addr.label}
                      </span>
                      {addr.isDefault && (
                        <span className="addr-card-badge default-badge">✓ Default</span>
                      )}
                    </div>

                    <p className="addr-card-name">{addr.recipientName}</p>
                    <p className="addr-card-phone">{addr.phone}</p>
                    <p className="addr-card-text">
                      {addr.streetAddress}
                      {addr.apartment ? `, ${addr.apartment}` : ""}
                      <br />
                      {addr.city}, {addr.postalCode}
                      <br />
                      {addr.country}
                    </p>

                    <div className="addr-card-actions">
                      <button className="addr-btn edit" onClick={() => openEdit(addr)}>
                        Edit
                      </button>
                      {!addr.isDefault && (
                        <button className="addr-btn default" onClick={() => handleSetDefault(addr._id)}>
                          Set Default
                        </button>
                      )}
                      <button className="addr-btn del" onClick={() => handleDelete(addr._id)}>
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── ADD / EDIT FORM MODE ──────────────────────── */}
        {(mode === "add" || mode === "edit") && (
          <>
            <div className="addr-form-header">
              <button className="addr-back-btn" onClick={() => { setMode("list"); setEditingAddress(null); }}>
                ← Back
              </button>
              <h2 className="addr-form-title">
                {mode === "add" ? "Add New Address" : "Edit Address"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="addr-form">
              {/* Label type chips */}
              <div>
                <p className="field-lbl" style={{ marginBottom: "8px" }}>Address Type</p>
                <div className="label-picker">
                  {LABEL_OPTIONS.map((lbl) => (
                    <button
                      key={lbl}
                      type="button"
                      className={`label-chip ${form.label === lbl ? "active" : ""}`}
                      onClick={() => setForm({ ...form, label: lbl })}
                    >
                      {LABEL_ICONS[lbl]} {lbl}
                    </button>
                  ))}
                </div>
              </div>

              {form.label === "Other" && (
                <div className="field-item">
                  <label className="field-lbl">Custom Label (e.g. "Mom's Place")</label>
                  <input
                    className="field-inp"
                    value={form.customLabel}
                    onChange={(e) => setForm({ ...form, customLabel: e.target.value })}
                    placeholder="e.g. Mom's Place, Farmhouse..."
                  />
                </div>
              )}

              <div className="field-grid">
                <div className="field-item">
                  <label className="field-lbl">Recipient Name *</label>
                  <input className="field-inp" value={form.recipientName} onChange={(e) => setForm({ ...form, recipientName: e.target.value })} placeholder="Full name" required />
                </div>
                <div className="field-item">
                  <label className="field-lbl">Phone Number *</label>
                  <input className="field-inp" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="03XX-XXXXXXX" required />
                </div>
                <div className="field-item span-2">
                  <label className="field-lbl">Street Address *</label>
                  <input className="field-inp" value={form.streetAddress} onChange={(e) => setForm({ ...form, streetAddress: e.target.value })} placeholder="House no., street, area" required />
                </div>
                <div className="field-item span-2">
                  <label className="field-lbl">Apartment / Floor / Suite (optional)</label>
                  <input className="field-inp" value={form.apartment} onChange={(e) => setForm({ ...form, apartment: e.target.value })} placeholder="Apt, floor, suite..." />
                </div>
                <div className="field-item">
                  <label className="field-lbl">City *</label>
                  <input className="field-inp" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Lahore" required />
                </div>
                <div className="field-item">
                  <label className="field-lbl">Postal Code *</label>
                  <input className="field-inp" value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} placeholder="54000" required />
                </div>
                <div className="field-item span-2">
                  <label className="field-lbl">Country *</label>
                  <input className="field-inp" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} required />
                </div>
              </div>

              <label className="default-checkbox-row">
                <input
                  type="checkbox"
                  checked={form.isDefault}
                  onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
                  style={{ accentColor: "#111844", width: 16, height: 16 }}
                />
                Set as my default delivery address
              </label>

              <div className="addr-form-actions">
                <button type="submit" className="save-btn" disabled={saving}>
                  {saving ? "Saving..." : mode === "add" ? "Save Address" : "Update Address"}
                </button>
                <button type="button" className="cancel-btn" onClick={() => { setMode("list"); setEditingAddress(null); }}>
                  Cancel
                </button>
              </div>
            </form>
          </>
        )}
      </div>

      {/* Toast notification */}
      {toast && (
        <div style={{
          position: "fixed", bottom: "32px", left: "50%", transform: "translateX(-50%)",
          background: "#111844", color: "#fff", padding: "12px 24px",
          borderRadius: "8px", fontFamily: "sans-serif", fontSize: "13px",
          fontWeight: 600, zIndex: 9999, boxShadow: "0 4px 16px rgba(0,0,0,0.2)"
        }}>
          ✓ {toast}
        </div>
      )}
    </>
  );
}
