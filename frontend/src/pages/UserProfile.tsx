// import { useState ,useEffect} from "react";
// import { Link } from "react-router-dom";
// import Header from "../components/header";
// import Footer from "../components/Footer";
// import { useAuth } from "../context/AuthContext";


// // --- TypeScript Backend Object Interfaces ---
// interface ScentProfile {
//   family: string;
//   intensity: string;
//   seasons: string[];
//   moods: string[];
//   notes: string[];
// }

// interface OrderItem {
//   name: string;
//   size: string;
//   qty: number;
//   price: number;
// }

// interface Order {
//   _id: string; // Updated to standard TypeScript/MongoDB ID notation
//   createdAt: string;
//   orderItems: OrderItem[];
//   status: string;
//   totalPrice: number;
//   shippingMethod: string;
// }

// interface UserProfileData {
//   memberSince: string;
//   preferredCategory: string;
//   scentProfile: ScentProfile;
//   lastOrder: Order | null;
//   stats: {
//     ordersPlaced: number;
//     scentsExplored: number;
//     reviewsWritten: number;
//   };
// }

// export default function UserProfile() {
//   const { user, logout } = useAuth();
//   const [activeSection, setActiveSection] = useState("overview");
//   const [editingAddress, setEditingAddress] = useState(false);
//   const [savedMessage, setSavedMessage] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // Dynamic backend-driven state variables
//   const [profileData, setProfileData] = useState<UserProfileData | null>(null);

//   const [preferences, setPreferences] = useState({
//     newsletter: true,
//     smsUpdates: false,
//     orderAlerts: true,
//     newArrivals: true,
//   });

//   const [address, setAddress] = useState({
//     street: "123 Main Boulevard, Gulberg III",
//     city: "Lahore",
//     postal: "54000",
//     country: "Pakistan",
//   });

//   // --- FETCH LIVE PROFILE DATA FROM TYPESCRIPT BACKEND ---
// useEffect(() => {
//   const fetchProfileData = async () => {
//     try {
//       setLoading(true);
//       setError(""); // Reset error state on fetch retry
//       const token = localStorage.getItem("token"); 
      
//       const response = await fetch("http://localhost:5000/api/user/profile", {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`,
//         },
//       });

//       // If backend is active and accepts the route
//       if (response.ok) {
//         // const data: UserProfileData = await response.json();
//         const data = await response.json();
//         setProfileData(data);
//       } else {
//         // If the server returns a 404 or 401, fall back gracefully instead of throwing a hard error
//         // console.warn(`Backend responded with status ${response.status}. Using client-side profile fallback.`);
//         throw new Error("Failed to fetch user details from backend");
//         // useFallbackProfile();
//       }
//     } catch (err: any) {
//       console.error("Network or connection error:", err);
//       // Fallback if the Node server isn't running at all
//       useFallbackProfile();
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Helper function to keep your luxury page populated while fixing routes
//   const useFallbackProfile = () => {
//     setProfileData({
//       memberSince: "March 2025",
//       preferredCategory: "Woody Eaux de Parfum",
//       scentProfile: {
//         family: "Oriental & Woody",
//         intensity: "Moderate–Heavy",
//         seasons: ["Autumn", "Winter"],
//         moods: ["Confident", "Mysterious", "Sophisticated"],
//         notes: ["Oud", "Amber", "Sandalwood", "Rose", "Vanilla"],
//       },
//       lastOrder: {
//         _id: "666edc5f8b91c2001f3c5b12",
//         createdAt: new Date().toISOString(),
//         orderItems: [{ name: "Allure Homme", size: "100ml", qty: 1, price: 8500 }],
//         status: "Processing",
//         totalPrice: 8500,
//         shippingMethod: "Standard Luxury Courier",
//       },
//       stats: {
//         ordersPlaced: 1,
//         scentsExplored: 5,
//         reviewsWritten: 0,
//       }
//     });
//   };

//   fetchProfileData();
// }, []);

//   const [scentProfile] = useState({
//     family: "Oriental & Woody",
//     intensity: "Moderate–Heavy",
//     seasons: ["Autumn", "Winter"],
//     moods: ["Confident", "Mysterious", "Sophisticated"],
//     notes: ["Oud", "Amber", "Sandalwood", "Rose", "Vanilla"],
//   });

//   const lastOrder = {
//     id: "ELR-20240615-001",
//     date: "June 15, 2026",
//     items: [{ name: "Allure Homme", size: "100ml", qty: 1, price: 8500 }],
//     status: "Processing",
//     total: 9000,
//     shippingMethod: "Standard Shipping",
//   };

//   const navItems = [
//     { id: "overview", label: "Overview", icon: "ti-layout-dashboard" },
//     { id: "scent", label: "Scent Profile", icon: "ti-star" },
//     { id: "orders", label: "Order Preview", icon: "ti-package" },
//     { id: "addresses", label: "Saved Addresses", icon: "ti-map-pin" },
//     { id: "preferences", label: "Preferences", icon: "ti-adjustments" },
//     { id: "settings", label: "Account Settings", icon: "ti-settings" },
//   ];

//   const statusColor: Record<string, string> = {
//     Processing: "#4B5694",
//     Pending: "#b87333",
//     Shipped: "#2d7a4f",
//     Delivered: "#2d7a4f",
//     Cancelled: "#c0392b",
//   };

//   const handleSave = (msg: string) => {
//     setSavedMessage(msg);
//     setTimeout(() => setSavedMessage(""), 2800);
//   };


//   // --- SUBMIT ADDRESS CHANGES TO API ---
//   const handleAddressSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch("http://localhost:5000/api/user/address", {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`,
//         },
//         body: JSON.stringify(address),
//       });

//       if (!response.ok) throw new Error("Could not save address matrix updates.");

//       setEditingAddress(false);
//       handleSave("Address saved successfully");
//     } catch (err: any) {
//       handleSave("Error updating address details");
//     }
//   };

//   if (loading) {
//     return (
//       <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#EAE0CF", fontFamily: "'Jost', sans-serif", color: "#111844" }}>
//         <p style={{ letterSpacing: "0.2em", textTransform: "uppercase" }}>Loading your luxury profile lounge...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100vh", background: "#EAE0CF", fontFamily: "'Jost', sans-serif", gap: "1rem" }}>
//         <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, color: "#111844" }}>Could not load profile. Please sign in again.</h2>
//         <Link to="/login" style={{ padding: "0.75rem 2rem", background: "#111844", color: "#EAE0CF", textDecoration: "none", borderRadius: "8px", fontSize: "0.85rem" }}>Go to Login</Link>
//       </div>
//     );
//   }

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;400;500&display=swap');

//         .profile-root {
//           background: #EAE0CF;
//           min-height: 100vh;
//           font-family: 'Jost', sans-serif;
//           padding-bottom: 6rem;
//         }

//         /* ── HEADER BANNER ─────────────────────────── */
//         .profile-banner {
//           background: linear-gradient(135deg, #111844 0%, #1a245c 60%, #253382 100%);
//           padding: 5rem 2rem 4rem;
//           text-align: center;
//           position: relative;
//           overflow: hidden;
//         }

//         .profile-banner::before {
//           content: '';
//           position: absolute;
//           top: -80px; left: -80px;
//           width: 280px; height: 280px;
//           border-radius: 50%;
//           background: rgba(75,86,148,0.18);
//           filter: blur(60px);
//         }

//         .profile-banner::after {
//           content: '';
//           position: absolute;
//           bottom: -60px; right: -60px;
//           width: 220px; height: 220px;
//           border-radius: 50%;
//           background: rgba(114,136,174,0.12);
//           filter: blur(50px);
//         }

//         .profile-avatar {
//           width: 84px;
//           height: 84px;
//           border-radius: 50%;
//           background: rgba(234,224,207,0.12);
//           border: 2px solid rgba(234,224,207,0.3);
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           margin: 0 auto 1.2rem;
//           position: relative;
//           z-index: 2;
//         }

//         .profile-avatar span {
//           font-family: 'Cormorant Garamond', serif;
//           font-size: 2rem;
//           font-weight: 300;
//           color: #EAE0CF;
//           letter-spacing: 0.05em;
//         }

//         .profile-name {
//           font-family: 'Cormorant Garamond', serif;
//           font-size: clamp(1.8rem, 3vw, 2.4rem);
//           font-weight: 300;
//           color: #EAE0CF;
//           letter-spacing: 0.04em;
//           margin-bottom: 0.3rem;
//           position: relative;
//           z-index: 2;
//         }

//         .profile-email {
//           font-size: 0.82rem;
//           color: rgba(234,224,207,0.6);
//           letter-spacing: 0.15em;
//           text-transform: uppercase;
//           position: relative;
//           z-index: 2;
//         }

//         .profile-badge {
//           display: inline-flex;
//           align-items: center;
//           gap: 6px;
//           margin-top: 1rem;
//           background: rgba(234,224,207,0.1);
//           border: 1px solid rgba(234,224,207,0.2);
//           padding: 5px 16px;
//           border-radius: 999px;
//           font-size: 0.68rem;
//           letter-spacing: 0.2em;
//           text-transform: uppercase;
//           color: rgba(234,224,207,0.75);
//           position: relative;
//           z-index: 2;
//         }

//         /* ── LAYOUT ─────────────────────────────────── */
//         .profile-layout {
//           max-width: 1200px;
//           margin: 0 auto;
//           padding: 3rem 2rem 0;
//           display: grid;
//           grid-template-columns: 240px 1fr;
//           gap: 2.5rem;
//           align-items: start;
//         }

//         /* ── SIDEBAR NAV ────────────────────────────── */
//         .profile-nav {
//           background: rgba(255,255,255,0.5);
//           border: 1px solid rgba(75,86,148,0.18);
//           border-radius: 20px;
//           padding: 1.2rem;
//           position: sticky;
//           top: 100px;
//           backdrop-filter: blur(10px);
//         }

//         .nav-label {
//           font-size: 0.62rem;
//           letter-spacing: 0.3em;
//           text-transform: uppercase;
//           color: rgba(17,24,68,0.4);
//           padding: 0 0.8rem;
//           margin-bottom: 0.8rem;
//         }

//         .nav-item {
//           display: flex;
//           align-items: center;
//           gap: 10px;
//           padding: 0.75rem 0.9rem;
//           border-radius: 12px;
//           cursor: pointer;
//           transition: all 0.22s ease;
//           border: 1px solid transparent;
//           font-size: 0.83rem;
//           color: rgba(17,24,68,0.65);
//           margin-bottom: 3px;
//           background: transparent;
//           width: 100%;
//           text-align: left;
//         }

//         .nav-item i { font-size: 16px; }

//         .nav-item:hover {
//           background: rgba(17,24,68,0.06);
//           color: #111844;
//         }

//         .nav-item.active {
//           background: #111844;
//           color: #EAE0CF;
//           border-color: transparent;
//         }

//         .nav-item.active i { color: #EAE0CF; }

//         .nav-divider {
//           height: 1px;
//           background: rgba(75,86,148,0.15);
//           margin: 0.8rem 0;
//         }

//         .nav-logout {
//           display: flex;
//           align-items: center;
//           gap: 10px;
//           padding: 0.75rem 0.9rem;
//           border-radius: 12px;
//           cursor: pointer;
//           font-size: 0.83rem;
//           color: #c0392b;
//           background: transparent;
//           border: 1px solid transparent;
//           width: 100%;
//           text-align: left;
//           transition: 0.22s;
//         }

//         .nav-logout:hover {
//           background: rgba(192,57,43,0.08);
//           border-color: rgba(192,57,43,0.2);
//         }

//         /* ── CONTENT AREA ───────────────────────────── */
//         .profile-content {
//           display: flex;
//           flex-direction: column;
//           gap: 1.6rem;
//         }

//         .section-card {
//           background: rgba(255,255,255,0.55);
//           border: 1px solid rgba(75,86,148,0.18);
//           border-radius: 20px;
//           padding: 2rem 2.2rem;
//           backdrop-filter: blur(10px);
//         }

//         .section-eyebrow {
//           font-size: 0.62rem;
//           letter-spacing: 0.3em;
//           text-transform: uppercase;
//           color: #4B5694;
//           margin-bottom: 0.5rem;
//         }

//         .section-title {
//           font-family: 'Cormorant Garamond', serif;
//           font-size: 1.55rem;
//           font-weight: 300;
//           color: #111844;
//           margin-bottom: 1.8rem;
//           line-height: 1.2;
//         }

//         .section-title span { color: #4B5694; font-style: italic; }

//         /* ── OVERVIEW GRID ──────────────────────────── */
//         .overview-stats {
//           display: grid;
//           grid-template-columns: repeat(3, 1fr);
//           gap: 1rem;
//           margin-bottom: 1.8rem;
//         }

//         .stat-box {
//           background: linear-gradient(135deg, #111844, #1a245c);
//           border-radius: 16px;
//           padding: 1.4rem 1.2rem;
//           color: #EAE0CF;
//           text-align: center;
//         }

//         .stat-num {
//           font-family: 'Cormorant Garamond', serif;
//           font-size: 2.2rem;
//           font-weight: 300;
//           line-height: 1;
//           margin-bottom: 0.3rem;
//         }

//         .stat-lbl {
//           font-size: 0.65rem;
//           letter-spacing: 0.2em;
//           text-transform: uppercase;
//           color: rgba(234,224,207,0.6);
//         }

//         .overview-info-grid {
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//           gap: 1rem;
//         }

//         .info-block {
//           background: rgba(17,24,68,0.04);
//           border: 1px solid rgba(75,86,148,0.15);
//           border-radius: 14px;
//           padding: 1.1rem 1.2rem;
//         }

//         .info-block-label {
//           font-size: 0.62rem;
//           letter-spacing: 0.2em;
//           text-transform: uppercase;
//           color: #7288AE;
//           margin-bottom: 0.35rem;
//         }

//         .info-block-value {
//           font-size: 0.9rem;
//           color: #111844;
//           font-weight: 500;
//         }

//         /* ── SCENT PROFILE ──────────────────────────── */
//         .scent-family-badge {
//           display: inline-block;
//           padding: 6px 18px;
//           background: linear-gradient(135deg, #111844, #4B5694);
//           color: #EAE0CF;
//           border-radius: 999px;
//           font-size: 0.75rem;
//           letter-spacing: 0.15em;
//           text-transform: uppercase;
//           margin-bottom: 1.5rem;
//         }

//         .scent-grid {
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//           gap: 1rem;
//           margin-bottom: 1.5rem;
//         }

//         .scent-block {
//           background: rgba(17,24,68,0.04);
//           border: 1px solid rgba(75,86,148,0.15);
//           border-radius: 14px;
//           padding: 1.2rem;
//         }

//         .scent-block h4 {
//           font-size: 0.62rem;
//           letter-spacing: 0.2em;
//           text-transform: uppercase;
//           color: #7288AE;
//           margin-bottom: 0.8rem;
//         }

//         .tag-row {
//           display: flex;
//           flex-wrap: wrap;
//           gap: 6px;
//         }

//         .tag {
//           font-size: 0.72rem;
//           padding: 4px 12px;
//           border-radius: 999px;
//           border: 1px solid rgba(75,86,148,0.3);
//           color: #4B5694;
//           background: rgba(75,86,148,0.06);
//           letter-spacing: 0.08em;
//         }

//         .notes-row {
//           display: flex;
//           flex-wrap: wrap;
//           gap: 8px;
//         }

//         .note-pill {
//           display: flex;
//           align-items: center;
//           gap: 6px;
//           background: linear-gradient(135deg, #111844, #4B5694);
//           color: #EAE0CF;
//           font-size: 0.75rem;
//           padding: 6px 14px;
//           border-radius: 999px;
//           letter-spacing: 0.08em;
//         }

//         /* ── ORDER PREVIEW ──────────────────────────── */
//         .order-card {
//           background: rgba(17,24,68,0.04);
//           border: 1px solid rgba(75,86,148,0.2);
//           border-radius: 16px;
//           padding: 1.5rem;
//           margin-bottom: 1.2rem;
//         }

//         .order-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: flex-start;
//           margin-bottom: 1.2rem;
//         }

//         .order-id {
//           font-family: 'Cormorant Garamond', serif;
//           font-size: 1.1rem;
//           color: #111844;
//           margin-bottom: 0.2rem;
//         }

//         .order-date {
//           font-size: 0.75rem;
//           color: rgba(17,24,68,0.5);
//           letter-spacing: 0.1em;
//         }

//         .order-status-badge {
//           font-size: 0.65rem;
//           letter-spacing: 0.18em;
//           text-transform: uppercase;
//           padding: 5px 14px;
//           border-radius: 999px;
//           border-width: 1px;
//           border-style: solid;
//         }

//         .order-item-row {
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           padding: 0.8rem 0;
//           border-top: 1px solid rgba(75,86,148,0.12);
//           font-size: 0.88rem;
//         }

//         .order-item-name { color: #111844; font-weight: 500; }
//         .order-item-sub { font-size: 0.75rem; color: rgba(17,24,68,0.5); margin-top: 2px; }
//         .order-item-price { font-size: 0.9rem; color: #4B5694; font-weight: 500; }

//         .order-total-row {
//           display: flex;
//           justify-content: space-between;
//           align-items: baseline;
//           margin-top: 1rem;
//           padding-top: 1rem;
//           border-top: 1px solid rgba(75,86,148,0.18);
//         }

//         .view-orders-btn {
//           display: inline-flex;
//           align-items: center;
//           gap: 8px;
//           padding: 0.8rem 1.8rem;
//           border: 1px solid rgba(17,24,68,0.3);
//           border-radius: 10px;
//           background: transparent;
//           color: #111844;
//           font-size: 0.75rem;
//           letter-spacing: 0.18em;
//           text-transform: uppercase;
//           cursor: pointer;
//           transition: 0.25s;
//           text-decoration: none;
//           font-family: 'Jost', sans-serif;
//         }

//         .view-orders-btn:hover {
//           background: #111844;
//           color: #EAE0CF;
//         }

//         /* ── ADDRESS ────────────────────────────────── */
//         .address-card {
//           background: rgba(17,24,68,0.04);
//           border: 1px solid rgba(75,86,148,0.18);
//           border-radius: 16px;
//           padding: 1.5rem;
//           position: relative;
//         }

//         .address-label-tag {
//           display: inline-block;
//           font-size: 0.6rem;
//           letter-spacing: 0.22em;
//           text-transform: uppercase;
//           padding: 3px 12px;
//           border-radius: 999px;
//           background: rgba(17,24,68,0.08);
//           color: #4B5694;
//           margin-bottom: 0.8rem;
//         }

//         .address-text {
//           font-size: 0.92rem;
//           color: #111844;
//           line-height: 1.8;
//         }

//         .edit-btn {
//           position: absolute;
//           top: 1.2rem;
//           right: 1.2rem;
//           background: transparent;
//           border: 1px solid rgba(75,86,148,0.3);
//           border-radius: 8px;
//           padding: 5px 12px;
//           font-size: 0.7rem;
//           letter-spacing: 0.12em;
//           text-transform: uppercase;
//           color: #4B5694;
//           cursor: pointer;
//           transition: 0.25s;
//           font-family: 'Jost', sans-serif;
//         }

//         .edit-btn:hover { background: #111844; color: #EAE0CF; border-color: #111844; }

//         .address-form {
//           display: grid;
//           gap: 12px;
//         }

//         .form-field label {
//           display: block;
//           font-size: 0.65rem;
//           letter-spacing: 0.2em;
//           text-transform: uppercase;
//           color: #7288AE;
//           margin-bottom: 5px;
//         }

//         .form-field input {
//           width: 100%;
//           padding: 0.7rem 1rem;
//           border: 1px solid rgba(75,86,148,0.25);
//           border-radius: 10px;
//           background: rgba(255,255,255,0.7);
//           font-size: 0.88rem;
//           color: #111844;
//           font-family: 'Jost', sans-serif;
//           outline: none;
//           transition: 0.25s;
//           box-sizing: border-box;
//         }

//         .form-field input:focus {
//           border-color: #4B5694;
//           box-shadow: 0 0 0 3px rgba(75,86,148,0.1);
//         }

//         .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

//         .save-btn {
//           padding: 0.75rem 2rem;
//           background: linear-gradient(135deg, #111844, #4B5694);
//           color: #EAE0CF;
//           border: none;
//           border-radius: 10px;
//           font-size: 0.75rem;
//           letter-spacing: 0.2em;
//           text-transform: uppercase;
//           cursor: pointer;
//           transition: 0.25s;
//           font-family: 'Jost', sans-serif;
//           box-shadow: 0 8px 20px rgba(17,24,68,0.18);
//         }

//         .save-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 28px rgba(17,24,68,0.25); }

//         .cancel-btn {
//           padding: 0.75rem 1.5rem;
//           background: transparent;
//           border: 1px solid rgba(75,86,148,0.3);
//           border-radius: 10px;
//           font-size: 0.75rem;
//           letter-spacing: 0.2em;
//           text-transform: uppercase;
//           cursor: pointer;
//           color: #4B5694;
//           font-family: 'Jost', sans-serif;
//           transition: 0.25s;
//         }

//         /* ── PREFERENCES ────────────────────────────── */
//         .pref-row {
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           padding: 1rem 0;
//           border-bottom: 1px solid rgba(75,86,148,0.1);
//         }

//         .pref-row:last-child { border-bottom: none; }

//         .pref-info h4 {
//           font-size: 0.9rem;
//           color: #111844;
//           margin-bottom: 0.2rem;
//           font-weight: 500;
//         }

//         .pref-info p {
//           font-size: 0.78rem;
//           color: rgba(17,24,68,0.55);
//           line-height: 1.5;
//         }

//         .toggle-wrap {
//           position: relative;
//           width: 46px;
//           height: 26px;
//           flex-shrink: 0;
//         }

//         .toggle-wrap input { opacity: 0; width: 0; height: 0; }

//         .toggle-slider {
//           position: absolute;
//           inset: 0;
//           border-radius: 999px;
//           background: rgba(17,24,68,0.15);
//           cursor: pointer;
//           transition: 0.3s;
//         }

//         .toggle-slider::before {
//           content: '';
//           position: absolute;
//           width: 20px; height: 20px;
//           left: 3px; top: 3px;
//           border-radius: 50%;
//           background: white;
//           transition: 0.3s;
//           box-shadow: 0 1px 4px rgba(0,0,0,0.15);
//         }

//         .toggle-wrap input:checked + .toggle-slider {
//           background: #111844;
//         }

//         .toggle-wrap input:checked + .toggle-slider::before {
//           transform: translateX(20px);
//         }

//         /* ── SETTINGS ───────────────────────────────── */
//         .settings-row {
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           padding: 1.1rem 0;
//           border-bottom: 1px solid rgba(75,86,148,0.1);
//         }

//         .settings-row:last-child { border-bottom: none; }

//         .settings-info h4 {
//           font-size: 0.9rem;
//           color: #111844;
//           margin-bottom: 0.15rem;
//           font-weight: 500;
//         }

//         .settings-info p {
//           font-size: 0.75rem;
//           color: rgba(17,24,68,0.5);
//         }

//         .settings-action {
//           background: transparent;
//           border: 1px solid rgba(75,86,148,0.3);
//           border-radius: 8px;
//           padding: 6px 16px;
//           font-size: 0.7rem;
//           letter-spacing: 0.12em;
//           text-transform: uppercase;
//           color: #4B5694;
//           cursor: pointer;
//           transition: 0.22s;
//           font-family: 'Jost', sans-serif;
//           white-space: nowrap;
//         }

//         .settings-action:hover { background: #111844; color: #EAE0CF; border-color: #111844; }

//         .settings-action.danger { color: #c0392b; border-color: rgba(192,57,43,0.3); }
//         .settings-action.danger:hover { background: #c0392b; color: white; border-color: #c0392b; }

//         /* ── TOAST ──────────────────────────────────── */
//         .toast-msg {
//           position: fixed;
//           bottom: 2rem;
//           right: 2rem;
//           background: #111844;
//           color: #EAE0CF;
//           padding: 0.9rem 1.6rem;
//           border-radius: 12px;
//           font-size: 0.82rem;
//           letter-spacing: 0.1em;
//           z-index: 999;
//           box-shadow: 0 12px 30px rgba(17,24,68,0.3);
//           animation: slideUp 0.3s ease;
//         }

//         @keyframes slideUp {
//           from { opacity: 0; transform: translateY(12px); }
//           to   { opacity: 1; transform: translateY(0); }
//         }

//         /* ── RESPONSIVE ─────────────────────────────── */
//         @media (max-width: 860px) {
//           .profile-layout {
//             grid-template-columns: 1fr;
//             padding: 1.5rem 1rem 0;
//           }
//           .profile-nav {
//             position: static;
//             display: flex;
//             overflow-x: auto;
//             gap: 6px;
//             padding: 0.8rem;
//             border-radius: 14px;
//           }
//           .nav-label { display: none; }
//           .nav-divider { display: none; }
//           .nav-item { white-space: nowrap; flex-shrink: 0; margin-bottom: 0; }
//           .overview-stats { grid-template-columns: 1fr 1fr; }
//           .overview-info-grid { grid-template-columns: 1fr; }
//           .scent-grid { grid-template-columns: 1fr; }
//           .form-row { grid-template-columns: 1fr; }
//         }

//         @media (max-width: 480px) {
//           .overview-stats { grid-template-columns: 1fr; }
//           .section-card { padding: 1.4rem 1.2rem; }
//         }
//       `}</style>

//       <Header />

//       <div className="profile-root">

//         {/* ── BANNER ─────────────────────────────────── */}
//         <div className="profile-banner">
//           <div className="profile-avatar">
//             <span>
//               {user?.name ? user.name.slice(0, 2).toUpperCase() : "EL"}
//             </span>
//           </div>
//           <h1 className="profile-name">{user?.name || "Eloura Member"}</h1>
//           <p className="profile-email">{user?.email || "member@eloura.com"}</p>
//           <div className="profile-badge">
//             <i className="ti ti-crown" style={{ fontSize: 13 }} />
//             Connoisseur Member
//           </div>
//         </div>

//         {/* ── LAYOUT ─────────────────────────────────── */}
//         <div className="profile-layout">

//           {/* ── SIDEBAR ────────────────────────────────── */}
//           <nav className="profile-nav">
//             <p className="nav-label">My Account</p>
//             {navItems.map((item) => (
//               <button
//                 key={item.id}
//                 className={`nav-item ${activeSection === item.id ? "active" : ""}`}
//                 onClick={() => setActiveSection(item.id)}
//               >
//                 <i className={`ti ${item.icon}`} aria-hidden="true" />
//                 {item.label}
//               </button>
//             ))}
//             <div className="nav-divider" />
//             <button className="nav-logout" onClick={() => logout("manual")}>
//               <i className="ti ti-logout" aria-hidden="true" />
//               Sign Out
//             </button>
//           </nav>

//           {/* ── CONTENT ────────────────────────────────── */}
//           <div className="profile-content">

//             {/* ══ OVERVIEW ══════════════════════════════ */}
//             {activeSection === "overview" && (
//               <div className="section-card">
//                 <p className="section-eyebrow">Welcome Back</p>
//                 <h2 className="section-title">
//                   Account <span>Overview</span>
//                 </h2>

//                 <div className="overview-stats">
//                   <div className="stat-box">
//                     <div className="stat-num">1</div>
//                     <div className="stat-lbl">Orders Placed</div>
//                   </div>
//                   <div className="stat-box">
//                     <div className="stat-num">3</div>
//                     <div className="stat-lbl">Scents Explored</div>
//                   </div>
//                   <div className="stat-box">
//                     <div className="stat-num">0</div>
//                     <div className="stat-lbl">Reviews Written</div>
//                   </div>
//                 </div>

//                 <div className="overview-info-grid">
//                   <div className="info-block">
//                     <div className="info-block-label">Full Name</div>
//                     <div className="info-block-value">{user?.name || "—"}</div>
//                   </div>
//                   <div className="info-block">
//                     <div className="info-block-label">Email Address</div>
//                     <div className="info-block-value">{user?.email || "—"}</div>
//                   </div>
//                   <div className="info-block">
//                     <div className="info-block-label">Account Status</div>
//                     <div className="info-block-value" style={{ color: "#2d7a4f" }}>
//                       ✦ Verified &amp; Active
//                     </div>
//                   </div>
//                   <div className="info-block">
//                     <div className="info-block-label">Member Since</div>
//                     <div className="info-block-value">June 2026</div>
//                   </div>
//                   <div className="info-block">
//                     <div className="info-block-label">Preferred Category</div>
//                     <div className="info-block-value">Oriental &amp; Woody</div>
//                   </div>
//                   <div className="info-block">
//                     <div className="info-block-label">Last Order</div>
//                     <div className="info-block-value">June 15, 2026</div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* ══ SCENT PROFILE ════════════════════════ */}
//             {activeSection === "scent" && (
//               <div className="section-card">
//                 <p className="section-eyebrow">Your Olfactory Identity</p>
//                 <h2 className="section-title">
//                   Scent <span>Profile</span>
//                 </h2>

//                 <div className="scent-family-badge">
//                   <i className="ti ti-star" style={{ fontSize: 12, marginRight: 6 }} />
//                   {scentProfile.family}
//                 </div>

//                 <div className="scent-grid">
//                   <div className="scent-block">
//                     <h4>Preferred Seasons</h4>
//                     <div className="tag-row">
//                       {scentProfile.seasons.map((s) => (
//                         <span className="tag" key={s}>{s}</span>
//                       ))}
//                     </div>
//                   </div>
//                   <div className="scent-block">
//                     <h4>Typical Intensity</h4>
//                     <div className="tag-row">
//                       <span className="tag">{scentProfile.intensity}</span>
//                     </div>
//                   </div>
//                   <div className="scent-block" style={{ gridColumn: "1 / -1" }}>
//                     <h4>Your Mood Palette</h4>
//                     <div className="tag-row">
//                       {scentProfile.moods.map((m) => (
//                         <span className="tag" key={m}>{m}</span>
//                       ))}
//                     </div>
//                   </div>
//                 </div>

//                 <div>
//                   <p style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#7288AE", marginBottom: "0.8rem" }}>
//                     Signature Notes You Love
//                   </p>
//                   <div className="notes-row">
//                     {scentProfile.notes.map((n) => (
//                       <span className="note-pill" key={n}>
//                         <i className="ti ti-droplet" style={{ fontSize: 12 }} aria-hidden="true" />
//                         {n}
//                       </span>
//                     ))}
//                   </div>
//                 </div>

//                 <div style={{ marginTop: "2rem", padding: "1.2rem", background: "rgba(17,24,68,0.04)", borderRadius: 14, border: "1px solid rgba(75,86,148,0.15)" }}>
//                   <p style={{ fontSize: "0.78rem", color: "rgba(17,24,68,0.6)", lineHeight: 1.7, margin: 0 }}>
//                     ✦ Your scent profile is automatically built from your browsing and purchase history. It helps us recommend fragrances that match your unique taste.
//                   </p>
//                 </div>
//               </div>
//             )}

//             {/* ══ ORDER PREVIEW ════════════════════════ */}
//             {activeSection === "orders" && (
//               <div className="section-card">
//                 <p className="section-eyebrow">Recent Activity</p>
//                 <h2 className="section-title">
//                   Order <span>Preview</span>
//                 </h2>

//                 <div className="order-card">
//                   <div className="order-header">
//                     <div>
//                       <div className="order-id">{lastOrder.id}</div>
//                       <div className="order-date">
//                         <i className="ti ti-calendar" style={{ fontSize: 13, marginRight: 5, verticalAlign: -1 }} aria-hidden="true" />
//                         {lastOrder.date}
//                       </div>
//                     </div>
//                     <div
//                       className="order-status-badge"
//                       style={{
//                         color: statusColor[lastOrder.status],
//                         borderColor: statusColor[lastOrder.status] + "55",
//                         background: statusColor[lastOrder.status] + "11",
//                       }}
//                     >
//                       {lastOrder.status}
//                     </div>
//                   </div>

//                   {lastOrder.items.map((item, i) => (
//                     <div className="order-item-row" key={i}>
//                       <div>
//                         <div className="order-item-name">{item.name}</div>
//                         <div className="order-item-sub">{item.size} × {item.qty}</div>
//                       </div>
//                       <div className="order-item-price">
//                         Rs. {item.price.toLocaleString()}
//                       </div>
//                     </div>
//                   ))}

//                   <div className="order-total-row">
//                     <div>
//                       <div style={{ fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(17,24,68,0.45)", marginBottom: 3 }}>
//                         {lastOrder.shippingMethod}
//                       </div>
//                       <div style={{ fontSize: "1rem", fontWeight: 600, color: "#111844" }}>
//                         Total Amount
//                       </div>
//                     </div>
//                     <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", color: "#4B5694", fontWeight: 400 }}>
//                       Rs. {lastOrder.total.toLocaleString()}
//                     </div>
//                   </div>
//                 </div>

//                 <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
//                   <p style={{ fontSize: "0.82rem", color: "rgba(17,24,68,0.5)", lineHeight: 1.6 }}>
//                     Showing your most recent order. View all orders for full history and tracking.
//                   </p>
//                   <Link to="/orders" className="view-orders-btn">
//                     View All Orders
//                     <i className="ti ti-arrow-right" style={{ fontSize: 15 }} aria-hidden="true" />
//                   </Link>
//                 </div>
//               </div>
//             )}

//             {/* ══ SAVED ADDRESSES ══════════════════════ */}
//             {activeSection === "addresses" && (
//               <div className="section-card">
//                 <p className="section-eyebrow">Delivery Details</p>
//                 <h2 className="section-title">
//                   Saved <span>Addresses</span>
//                 </h2>

//                 {!editingAddress ? (
//                   <>
//                     <div className="address-card">
//                       <button className="edit-btn" onClick={() => setEditingAddress(true)}>
//                         <i className="ti ti-edit" style={{ marginRight: 4 }} />
//                         Edit
//                       </button>
//                       <div className="address-label-tag">Default — Home</div>
//                       <div className="address-text">
//                         {user?.name}<br />
//                         {address.street}<br />
//                         {address.city}, {address.postal}<br />
//                         {address.country}
//                       </div>
//                     </div>

//                     <button
//                       onClick={() => setEditingAddress(true)}
//                       style={{ marginTop: "1.2rem", display: "flex", alignItems: "center", gap: 8, background: "transparent", border: "1px dashed rgba(75,86,148,0.4)", borderRadius: 14, padding: "1rem 1.4rem", cursor: "pointer", color: "#4B5694", fontSize: "0.8rem", letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "'Jost', sans-serif", width: "100%", justifyContent: "center", transition: "0.25s" }}
//                     >
//                       <i className="ti ti-plus" style={{ fontSize: 16 }} />
//                       Add New Address
//                     </button>
//                   </>
//                 ) : (
//                   <div className="address-form">
//                     <div className="form-field">
//                       <label>Street Address</label>
//                       <input
//                         value={address.street}
//                         onChange={(e) => setAddress({ ...address, street: e.target.value })}
//                         placeholder="Street address"
//                       />
//                     </div>
//                     <div className="form-row">
//                       <div className="form-field">
//                         <label>City</label>
//                         <input
//                           value={address.city}
//                           onChange={(e) => setAddress({ ...address, city: e.target.value })}
//                           placeholder="City"
//                         />
//                       </div>
//                       <div className="form-field">
//                         <label>Postal Code</label>
//                         <input
//                           value={address.postal}
//                           onChange={(e) => setAddress({ ...address, postal: e.target.value })}
//                           placeholder="Postal code"
//                         />
//                       </div>
//                     </div>
//                     <div className="form-field">
//                       <label>Country</label>
//                       <input
//                         value={address.country}
//                         onChange={(e) => setAddress({ ...address, country: e.target.value })}
//                         placeholder="Country"
//                       />
//                     </div>
//                     <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
//                       <button className="save-btn" onClick={() => { setEditingAddress(false); handleSave("Address saved successfully"); }}>
//                         Save Address
//                       </button>
//                       <button className="cancel-btn" onClick={() => setEditingAddress(false)}>
//                         Cancel
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* ══ PREFERENCES ══════════════════════════ */}
//             {activeSection === "preferences" && (
//               <div className="section-card">
//                 <p className="section-eyebrow">Communication &amp; Experience</p>
//                 <h2 className="section-title">
//                   My <span>Preferences</span>
//                 </h2>

//                 {[
//                   { key: "newsletter", title: "Eloura Newsletter", desc: "Curated fragrance stories, house updates, and exclusive member content delivered monthly." },
//                   { key: "orderAlerts", title: "Order Notifications", desc: "Real-time updates when your order is confirmed, shipped, and delivered." },
//                   { key: "newArrivals", title: "New Arrivals", desc: "Be the first to discover new fragrances and limited-edition drops." },
//                   { key: "smsUpdates", title: "SMS Updates", desc: "Delivery alerts and flash sale notifications sent directly to your phone." },
//                 ].map((pref) => (
//                   <div className="pref-row" key={pref.key}>
//                     <div className="pref-info">
//                       <h4>{pref.title}</h4>
//                       <p>{pref.desc}</p>
//                     </div>
//                     <label className="toggle-wrap">
//                       <input
//                         type="checkbox"
//                         checked={preferences[pref.key as keyof typeof preferences]}
//                         onChange={() => {
//                           setPreferences((prev) => ({ ...prev, [pref.key]: !prev[pref.key as keyof typeof preferences] }));
//                           handleSave("Preferences updated");
//                         }}
//                       />
//                       <span className="toggle-slider" />
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {/* ══ ACCOUNT SETTINGS ═════════════════════ */}
//             {activeSection === "settings" && (
//               <div className="section-card">
//                 <p className="section-eyebrow">Security &amp; Privacy</p>
//                 <h2 className="section-title">
//                   Account <span>Settings</span>
//                 </h2>

//                 {[
//                   { label: "Full Name", value: user?.name || "—", desc: "Update how your name appears on orders and communications.", action: "Change Name" },
//                   { label: "Email Address", value: user?.email || "—", desc: "Your login email and where we send receipts.", action: "Change Email" },
//                   { label: "Password", value: "••••••••••••", desc: "Last changed: unknown. We recommend updating every 90 days.", action: "Change Password" },
//                   { label: "Two-Factor Auth", value: "Not enabled", desc: "Add an extra layer of security to your account login.", action: "Enable 2FA" },
//                 ].map((item, i) => (
//                   <div className="settings-row" key={i}>
//                     <div className="settings-info">
//                       <h4>{item.label}</h4>
//                       <p>{item.value} — {item.desc}</p>
//                     </div>
//                     <button className="settings-action" onClick={() => handleSave(`${item.label} update coming soon`)}>
//                       {item.action}
//                     </button>
//                   </div>
//                 ))}

//                 <div style={{ marginTop: "1.5rem", padding: "1.4rem", background: "rgba(192,57,43,0.04)", border: "1px solid rgba(192,57,43,0.15)", borderRadius: 14 }}>
//                   <div className="settings-row" style={{ paddingTop: 0, borderBottom: "none" }}>
//                     <div className="settings-info">
//                       <h4 style={{ color: "#c0392b" }}>Delete Account</h4>
//                       <p>Permanently remove your account and all associated data. This cannot be undone.</p>
//                     </div>
//                     <button className="settings-action danger">
//                       Delete
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}

//           </div>
//         </div>
//       </div>

//       {savedMessage && (
//         <div className="toast-msg">
//           <i className="ti ti-check" style={{ marginRight: 8 }} />
//           {savedMessage}
//         </div>
//       )}

//       <Footer />
//     </>
//   );
// }










































// import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import Header from "../components/header";
// import Footer from "../components/Footer";
// import { useAuth } from "../context/AuthContext";

// // --- TypeScript Backend Object Interfaces ---
// interface ScentProfile {
//   family: string;
//   intensity: string;
//   seasons: string[];
//   moods: string[];
//   notes: string[];
// }

// interface OrderItem {
//   name: string;
//   size: string;
//   qty: number;
//   price: number;
// }

// interface Order {
//   _id: string; 
//   createdAt: string;
//   orderItems: OrderItem[];
//   status: string;
//   totalPrice: number;
//   shippingMethod: string;
// }

// // Updated schema definition to map accurately to your live DB documents
// interface UserProfileData {
//   _id: string;
//   name: string;
//   email: string;
//   role?: string;
//   createdAt?: string;
//   preferredCategory?: string;
//   scentProfile?: ScentProfile;
//   lastOrder?: Order | null;
//   stats?: {
//     ordersPlaced: number;
//     scentsExplored: number;
//     reviewsWritten: number;
//   };
// }

// export default function UserProfile() {
//   const { user, logout } = useAuth();
//   const [activeSection, setActiveSection] = useState("overview");
//   const [editingAddress, setEditingAddress] = useState(false);
//   const [savedMessage, setSavedMessage] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // Dynamic backend-driven state variables
//   const [profileData, setProfileData] = useState<UserProfileData | null>(null);

//   const [preferences, setPreferences] = useState({
//     newsletter: true,
//     smsUpdates: false,
//     orderAlerts: true,
//     newArrivals: true,
//   });

//   const [address, setAddress] = useState({
//     street: "123 Main Boulevard, Gulberg III",
//     city: "Lahore",
//     postal: "54000",
//     country: "Pakistan",
//   });

//   // --- FETCH LIVE PROFILE DATA FROM BACKEND ---
//   useEffect(() => {
//     const fetchProfileData = async () => {
//       try {
//         setLoading(true);
//         setError(""); 
//         const token = localStorage.getItem("token"); 
        
//         const response = await fetch("http://localhost:5000/api/user/profile", {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${token}`,
//           },
//         });

//         if (response.ok) {
//           const data = await response.json();
//           // Extract the nested 'user' object sent by your backend controller
//           setProfileData(data.user || data);
//         } else {
//           throw new Error("Failed to fetch user details from backend");
//         }
//       } catch (err: any) {
//         console.error("Network or connection error:", err);
//         setError("Could not sync data with server.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfileData();
//   }, []);

//   // Safe fallback metadata objects for luxury aesthetic elements 
//   const scentProfile = profileData?.scentProfile || {
//     family: "Oriental & Woody",
//     intensity: "Moderate–Heavy",
//     seasons: ["Autumn", "Winter"],
//     moods: ["Confident", "Mysterious", "Sophisticated"],
//     notes: ["Oud", "Amber", "Sandalwood", "Rose", "Vanilla"],
//   };

//   const lastOrder = profileData?.lastOrder || {
//     id: "ELR-20240615-001",
//     date: "June 15, 2026",
//     items: [{ name: "Allure Homme", size: "100ml", qty: 1, price: 8500 }],
//     status: "Processing",
//     total: 9000,
//     shippingMethod: "Standard Shipping",
//   };

//   const navItems = [
//     { id: "overview", label: "Overview", icon: "ti-layout-dashboard" },
//     { id: "scent", label: "Scent Profile", icon: "ti-star" },
//     { id: "orders", label: "Order Preview", icon: "ti-package" },
//     { id: "addresses", label: "Saved Addresses", icon: "ti-map-pin" },
//     { id: "preferences", label: "Preferences", icon: "ti-adjustments" },
//     { id: "settings", label: "Account Settings", icon: "ti-settings" },
//   ];

//   const statusColor: Record<string, string> = {
//     Processing: "#4B5694",
//     Pending: "#b87333",
//     Shipped: "#2d7a4f",
//     Delivered: "#2d7a4f",
//     Cancelled: "#c0392b",
//   };

//   const handleSave = (msg: string) => {
//     setSavedMessage(msg);
//     setTimeout(() => setSavedMessage(""), 2800);
//   };

//   const handleAddressSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch("http://localhost:5000/api/user/address", {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`,
//         },
//         body: JSON.stringify(address),
//       });

//       if (!response.ok) throw new Error("Could not save address matrix updates.");

//       setEditingAddress(false);
//       handleSave("Address saved successfully");
//     } catch (err: any) {
//       handleSave("Error updating address details");
//     }
//   };

//   if (loading) {
//     return (
//       <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#EAE0CF", fontFamily: "'Jost', sans-serif", color: "#111844" }}>
//         <p style={{ letterSpacing: "0.2em", textTransform: "uppercase" }}>Loading your luxury profile lounge...</p>
//       </div>
//     );
//   }

//   return (
//     <>
//       <style>{`
//         /* Keep all your pristine custom CSS styling code completely untouched here */
//         @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;400;500&display=swap');
//         .profile-root { background: #EAE0CF; min-height: 100vh; font-family: 'Jost', sans-serif; padding-bottom: 6rem; }
//         .profile-banner { background: linear-gradient(135deg, #111844 0%, #1a245c 60%, #253382 100%); padding: 5rem 2rem 4rem; text-align: center; position: relative; overflow: hidden; }
//         .profile-avatar { width: 84px; height: 84px; border-radius: 50%; background: rgba(234,224,207,0.12); border: 2px solid rgba(234,224,207,0.3); display: flex; align-items: center; justify-content: center; margin: 0 auto 1.2rem; position: relative; z-index: 2; }
//         .profile-avatar span { font-family: 'Cormorant Garamond', serif; font-size: 2rem; font-weight: 300; color: #EAE0CF; letter-spacing: 0.05em; }
//         .profile-name { font-family: 'Cormorant Garamond', serif; font-size: clamp(1.8rem, 3vw, 2.4rem); font-weight: 300; color: #EAE0CF; letter-spacing: 0.04em; margin-bottom: 0.3rem; position: relative; z-index: 2; }
//         .profile-email { font-size: 0.82rem; color: rgba(234,224,207,0.6); letter-spacing: 0.15em; text-transform: uppercase; position: relative; z-index: 2; }
//         .profile-badge { display: inline-flex; align-items: center; gap: 6px; margin-top: 1rem; background: rgba(234,224,207,0.1); border: 1px solid rgba(234,224,207,0.2); padding: 5px 16px; border-radius: 999px; font-size: 0.68rem; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(234,224,207,0.75); position: relative; z-index: 2; }
//         .profile-layout { max-width: 1200px; margin: 0 auto; padding: 3rem 2rem 0; display: grid; grid-template-columns: 240px 1fr; gap: 2.5rem; align-items: start; }
//         .profile-nav { background: rgba(255,255,255,0.5); border: 1px solid rgba(75,86,148,0.18); border-radius: 20px; padding: 1.2rem; position: sticky; top: 100px; backdrop-filter: blur(10px); }
//         .nav-label { font-size: 0.62rem; letter-spacing: 0.3em; text-transform: uppercase; color: rgba(17,24,68,0.4); padding: 0 0.8rem; margin-bottom: 0.8rem; }
//         .nav-item { display: flex; align-items: center; gap: 10px; padding: 0.75rem 0.9rem; border-radius: 12px; cursor: pointer; transition: all 0.22s ease; border: 1px solid transparent; font-size: 0.83rem; color: rgba(17,24,68,0.65); margin-bottom: 3px; background: transparent; width: 100%; text-align: left; }
//         .nav-item:hover { background: rgba(17,24,68,0.06); color: #111844; }
//         .nav-item.active { background: #111844; color: #EAE0CF; border-color: transparent; }
//         .nav-divider { height: 1px; background: rgba(75,86,148,0.15); margin: 0.8rem 0; }
//         .nav-logout { display: flex; align-items: center; gap: 10px; padding: 0.75rem 0.9rem; border-radius: 12px; cursor: pointer; font-size: 0.83rem; color: #c0392b; background: transparent; border: 1px solid transparent; width: 100%; text-align: left; transition: 0.22s; }
//         .nav-logout:hover { background: rgba(192,57,43,0.08); border-color: rgba(192,57,43,0.2); }
//         .profile-content { display: flex; flex-direction: column; gap: 1.6rem; }
//         .section-card { background: rgba(255,255,255,0.55); border: 1px solid rgba(75,86,148,0.18); border-radius: 20px; padding: 2rem 2.2rem; backdrop-filter: blur(10px); }
//         .section-eyebrow { font-size: 0.62rem; letter-spacing: 0.3em; text-transform: uppercase; color: #4B5694; margin-bottom: 0.5rem; }
//         .section-title { font-family: 'Cormorant Garamond', serif; font-size: 1.55rem; font-weight: 300; color: #111844; margin-bottom: 1.8rem; line-height: 1.2; }
//         .overview-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.8rem; }
//         .stat-box { background: linear-gradient(135deg, #111844, #1a245c); border-radius: 16px; padding: 1.4rem 1.2rem; color: #EAE0CF; text-align: center; }
//         .stat-num { font-family: 'Cormorant Garamond', serif; font-size: 2.2rem; font-weight: 300; line-height: 1; margin-bottom: 0.3rem; }
//         .stat-lbl { font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(234,224,207,0.6); }
//         .overview-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
//         .info-block { background: rgba(17,24,68,0.04); border: 1px solid rgba(75,86,148,0.15); border-radius: 14px; padding: 1.1rem 1.2rem; }
//         .info-block-label { font-size: 0.62rem; letter-spacing: 0.2em; text-transform: uppercase; color: #7288AE; margin-bottom: 0.35rem; }
//         .info-block-value { font-size: 0.9rem; color: #111844; font-weight: 500; }
//         .scent-family-badge { display: inline-block; padding: 6px 18px; background: linear-gradient(135deg, #111844, #4B5694); color: #EAE0CF; border-radius: 999px; font-size: 0.75rem; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 1.5rem; }
//         .scent-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem; }
//         .scent-block { background: rgba(17,24,68,0.04); border: 1px solid rgba(75,86,148,0.15); border-radius: 14px; padding: 1.2rem; }
//         .scent-block h4 { font-size: 0.62rem; letter-spacing: 0.2em; text-transform: uppercase; color: #7288AE; margin-bottom: 0.8rem; }
//         .tag-row { display: flex; flex-wrap: wrap; gap: 6px; }
//         .tag { font-size: 0.72rem; padding: 4px 12px; border-radius: 999px; border: 1px solid rgba(75,86,148,0.3); color: #4B5694; background: rgba(75,86,148,0.06); letter-spacing: 0.08em; }
//         .notes-row { display: flex; flex-wrap: wrap; gap: 8px; }
//         .note-pill { display: flex; align-items: center; gap: 6px; background: linear-gradient(135deg, #111844, #4B5694); color: #EAE0CF; font-size: 0.75rem; padding: 6px 14px; border-radius: 999px; letter-spacing: 0.08em; }
//         .order-card { background: rgba(17,24,68,0.04); border: 1px solid rgba(75,86,148,0.2); border-radius: 16px; padding: 1.5rem; margin-bottom: 1.2rem; }
//         .order-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.2rem; }
//         .order-id { font-family: 'Cormorant Garamond', serif; font-size: 1.1rem; color: #111844; margin-bottom: 0.2rem; }
//         .order-date { font-size: 0.75rem; color: rgba(17,24,68,0.5); letter-spacing: 0.1em; }
//         .order-status-badge { font-size: 0.65rem; letter-spacing: 0.18em; text-transform: uppercase; padding: 5px 14px; border-radius: 999px; border-width: 1px; border-style: solid; }
//         .order-item-row { display: flex; align-items: center; justify-content: space-between; padding: 0.8rem 0; border-top: 1px solid rgba(75,86,148,0.12); font-size: 0.88rem; }
//         .order-item-name { color: #111844; font-weight: 500; }
//         .order-item-sub { font-size: 0.75rem; color: rgba(17,24,68,0.5); margin-top: 2px; }
//         .order-item-price { font-size: 0.9rem; color: #4B5694; font-weight: 500; }
//         .order-total-row { display: flex; justify-content: space-between; align-items: baseline; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid rgba(75,86,148,0.18); }
//         .view-orders-btn { display: inline-flex; align-items: center; gap: 8px; padding: 0.8rem 1.8rem; border: 1px solid rgba(17,24,68,0.3); border-radius: 10px; background: transparent; color: #111844; font-size: 0.75rem; letter-spacing: 0.18em; text-transform: uppercase; cursor: pointer; transition: 0.25s; text-decoration: none; font-family: 'Jost', sans-serif; }
//         .view-orders-btn:hover { background: #111844; color: #EAE0CF; }
//         .address-card { background: rgba(17,24,68,0.04); border: 1px solid rgba(75,86,148,0.18); border-radius: 16px; padding: 1.5rem; position: relative; }
//         .address-label-tag { display: inline-block; font-size: 0.6rem; letter-spacing: 0.22em; text-transform: uppercase; padding: 3px 12px; border-radius: 999px; background: rgba(17,24,68,0.08); color: #4B5694; margin-bottom: 0.8rem; }
//         .address-text { font-size: 0.92rem; color: #111844; line-height: 1.8; }
//         .edit-btn { position: absolute; top: 1.2rem; right: 1.2rem; background: transparent; border: 1px solid rgba(75,86,148,0.3); border-radius: 8px; padding: 5px 12px; font-size: 0.7rem; letter-spacing: 0.12em; text-transform: uppercase; color: #4B5694; cursor: pointer; transition: 0.25s; font-family: 'Jost', sans-serif; }
//         .edit-btn:hover { background: #111844; color: #EAE0CF; border-color: #111844; }
//         .address-form { display: grid; gap: 12px; }
//         .form-field label { display: block; font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase; color: #7288AE; margin-bottom: 5px; }
//         .form-field input { width: 100%; padding: 0.7rem 1rem; border: 1px solid rgba(75,86,148,0.25); border-radius: 10px; background: rgba(255,255,255,0.7); font-size: 0.88rem; color: #111844; font-family: 'Jost', sans-serif; outline: none; transition: 0.25s; box-sizing: border-box; }
//         .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
//         .save-btn { padding: 0.75rem 2rem; background: linear-gradient(135deg, #111844, #4B5694); color: #EAE0CF; border: none; border-radius: 10px; font-size: 0.75rem; letter-spacing: 0.2em; text-transform: uppercase; cursor: pointer; transition: 0.25s; font-family: 'Jost', sans-serif; box-shadow: 0 8px 20px rgba(17,24,68,0.18); }
//         .cancel-btn { padding: 0.75rem 1.5rem; background: transparent; border: 1px solid rgba(75,86,148,0.3); border-radius: 10px; font-size: 0.75rem; letter-spacing: 0.2em; text-transform: uppercase; cursor: pointer; color: #4B5694; font-family: 'Jost', sans-serif; transition: 0.25s; }
//         .pref-row { display: flex; align-items: center; justify-content: space-between; padding: 1rem 0; border-bottom: 1px solid rgba(75,86,148,0.1); }
//         .pref-info h4 { font-size: 0.9rem; color: #111844; margin-bottom: 0.2rem; font-weight: 500; }
//         .pref-info p { font-size: 0.78rem; color: rgba(17,24,68,0.55); line-height: 1.5; }
//         .toggle-wrap { position: relative; width: 46px; height: 26px; flex-shrink: 0; }
//         .toggle-wrap input { opacity: 0; width: 0; height: 0; }
//         .toggle-slider { position: absolute; inset: 0; border-radius: 999px; background: rgba(17,24,68,0.15); cursor: pointer; transition: 0.3s; }
//         .toggle-slider::before { content: ''; position: absolute; width: 20px; height: 20px; left: 3px; top: 3px; border-radius: 50%; background: white; transition: 0.3s; box-shadow: 0 1px 4px rgba(0,0,0,0.15); }
//         .toggle-wrap input:checked + .toggle-slider { background: #111844; }
//         .toggle-wrap input:checked + .toggle-slider::before { transform: translateX(20px); }
//         .settings-row { display: flex; align-items: center; justify-content: space-between; padding: 1.1rem 0; border-bottom: 1px solid rgba(75,86,148,0.1); }
//         .settings-info h4 { font-size: 0.9rem; color: #111844; margin-bottom: 0.15rem; font-weight: 500; }
//         .settings-info p { font-size: 0.75rem; color: rgba(17,24,68,0.5); }
//         .settings-action { background: transparent; border: 1px solid rgba(75,86,148,0.3); border-radius: 8px; padding: 6px 16px; font-size: 0.7rem; letter-spacing: 0.12em; text-transform: uppercase; color: #4B5694; cursor: pointer; transition: 0.22s; font-family: 'Jost', sans-serif; white-space: nowrap; }
//         .settings-action:hover { background: #111844; color: #EAE0CF; border-color: #111844; }
//         .toast-msg { position: fixed; bottom: 2rem; right: 2rem; background: #111844; color: #EAE0CF; padding: 0.9rem 1.6rem; border-radius: 12px; font-size: 0.82rem; letter-spacing: 0.1em; z-index: 999; box-shadow: 0 12px 30px rgba(17,24,68,0.3); animation: slideUp 0.3s ease; }
//       `}</style>

//       <Header />

//       <div className="profile-root">

//         {/* ── BANNER ─────────────────────────────────── */}
//         <div className="profile-banner">
//           <div className="profile-avatar">
//             <span>
//               {profileData?.name ? profileData.name.slice(0, 2).toUpperCase() : "EL"}
//             </span>
//           </div>
//           {/* Dynamic dynamic naming from backend database state */}
//           <h1 className="profile-name">{profileData?.name || "Eloura Member"}</h1>
//           <p className="profile-email">{profileData?.email || "member@eloura.com"}</p>
//           <div className="profile-badge">
//             <i className="ti ti-crown" style={{ fontSize: 13 }} />
//             Connoisseur Member
//           </div>
//         </div>

//         {/* ── LAYOUT ─────────────────────────────────── */}
//         <div className="profile-layout">

//           {/* ── SIDEBAR ────────────────────────────────── */}
//           <nav className="profile-nav">
//             <p className="nav-label">My Account</p>
//             {navItems.map((item) => (
//               <button
//                 key={item.id}
//                 className={`nav-item ${activeSection === item.id ? "active" : ""}`}
//                 onClick={() => setActiveSection(item.id)}
//               >
//                 <i className={`ti ${item.icon}`} aria-hidden="true" />
//                 {item.label}
//               </button>
//             ))}
//             <div className="nav-divider" />
//             <button className="nav-logout" onClick={() => logout("manual")}>
//               <i className="ti ti-logout" aria-hidden="true" />
//               Sign Out
//             </button>
//           </nav>

//           {/* ── CONTENT ────────────────────────────────── */}
//           <div className="profile-content">

//             {/* ══ OVERVIEW ══════════════════════════════ */}
//             {activeSection === "overview" && (
//               <div className="section-card">
//                 <p className="section-eyebrow">Welcome Back</p>
//                 <h2 className="section-title">
//                   Account <span>Overview</span>
//                 </h2>

//                 <div className="overview-stats">
//                   <div className="stat-box">
//                     <div className="stat-num">{profileData?.stats?.ordersPlaced || 1}</div>
//                     <div className="stat-lbl">Orders Placed</div>
//                   </div>
//                   <div className="stat-box">
//                     <div className="stat-num">{profileData?.stats?.scentsExplored || 3}</div>
//                     <div className="stat-lbl">Scents Explored</div>
//                   </div>
//                   <div className="stat-box">
//                     <div className="stat-num">{profileData?.stats?.reviewsWritten || 0}</div>
//                     <div className="stat-lbl">Reviews Written</div>
//                   </div>
//                 </div>

//                 <div className="overview-info-grid">
//                   <div className="info-block">
//                     <div className="info-block-label">Full Name</div>
//                     <div className="info-block-value">{profileData?.name || "—"}</div>
//                   </div>
//                   <div className="info-block">
//                     <div className="info-block-label">Email Address</div>
//                     <div className="info-block-value">{profileData?.email || "—"}</div>
//                   </div>
//                   <div className="info-block">
//                     <div className="info-block-label">Account Status</div>
//                     <div className="info-block-value" style={{ color: "#2d7a4f" }}>
//                       ✦ Verified &amp; Active
//                     </div>
//                   </div>
//                   <div className="info-block">
//                     <div className="info-block-label">Member Since</div>
//                     <div className="info-block-value">
//                       {profileData?.createdAt ? new Date(profileData.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "June 2026"}
//                     </div>
//                   </div>
//                   <div className="info-block">
//                     <div className="info-block-label">Preferred Category</div>
//                     <div className="info-block-value">{profileData?.preferredCategory || "Oriental & Woody"}</div>
//                   </div>
//                   <div className="info-block">
//                     <div className="info-block-label">Last Order</div>
//                     <div className="info-block-value">
//                       {profileData?.lastOrder?.createdAt ? new Date(profileData.lastOrder.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : "June 15, 2026"}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* ══ SCENT PROFILE ════════════════════════ */}
//             {activeSection === "scent" && (
//               <div className="section-card">
//                 <p className="section-eyebrow">Your Olfactory Identity</p>
//                 <h2 className="section-title">
//                   Scent <span>Profile</span>
//                 </h2>

//                 <div className="scent-family-badge">
//                   <i className="ti ti-star" style={{ fontSize: 12, marginRight: 6 }} />
//                   {scentProfile.family}
//                 </div>

//                 <div className="scent-grid">
//                   <div className="scent-block">
//                     <h4>Preferred Seasons</h4>
//                     <div className="tag-row">
//                       {scentProfile.seasons.map((s) => (
//                         <span className="tag" key={s}>{s}</span>
//                       ))}
//                     </div>
//                   </div>
//                   <div className="scent-block">
//                     <h4>Typical Intensity</h4>
//                     <div className="tag-row">
//                       <span className="tag">{scentProfile.intensity}</span>
//                     </div>
//                   </div>
//                   <div className="scent-block" style={{ gridColumn: "1 / -1" }}>
//                     <h4>Your Mood Palette</h4>
//                     <div className="tag-row">
//                       {scentProfile.moods.map((m) => (
//                         <span className="tag" key={m}>{m}</span>
//                       ))}
//                     </div>
//                   </div>
//                 </div>

//                 <div>
//                   <p style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#7288AE", marginBottom: "0.8rem" }}>
//                     Signature Notes You Love
//                   </p>
//                   <div className="notes-row">
//                     {scentProfile.notes.map((n) => (
//                       <span className="note-pill" key={n}>
//                         <i className="ti ti-droplet" style={{ fontSize: 12 }} aria-hidden="true" />
//                         {n}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* ══ ORDER PREVIEW ════════════════════════ */}
//             {activeSection === "orders" && (
//               <div className="section-card">
//                 <p className="section-eyebrow">Recent Activity</p>
//                 <h2 className="section-title">
//                   Order <span>Preview</span>
//                 </h2>

//                 <div className="order-card">
//                   <div className="order-header">
//                     <div>
//                       <div className="order-id">{lastOrder.id || lastOrder._id}</div>
//                       <div className="order-date">
//                         <i className="ti ti-calendar" style={{ fontSize: 13, marginRight: 5, verticalAlign: -1 }} aria-hidden="true" />
//                         {lastOrder.date || new Date(lastOrder.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
//                       </div>
//                     </div>
//                     <div
//                       className="order-status-badge"
//                       style={{
//                         color: statusColor[lastOrder.status],
//                         borderColor: statusColor[lastOrder.status] + "55",
//                         background: statusColor[lastOrder.status] + "11",
//                       }}
//                     >
//                       {lastOrder.status}
//                     </div>
//                   </div>

//                   {lastOrder.items ? lastOrder.items.map((item, i) => (
//                     <div className="order-item-row" key={i}>
//                       <div>
//                         <div className="order-item-name">{item.name}</div>
//                         <div className="order-item-sub">{item.size} × {item.qty}</div>
//                       </div>
//                       <div className="order-item-price">
//                         Rs. {item.price.toLocaleString()}
//                       </div>
//                     </div>
//                   )) : lastOrder.orderItems?.map((item: any, i: number) => (
//                     <div className="order-item-row" key={i}>
//                       <div>
//                         <div className="order-item-name">{item.name}</div>
//                         <div className="order-item-sub">{item.size} × {item.qty}</div>
//                       </div>
//                       <div className="order-item-price">
//                         Rs. {item.price.toLocaleString()}
//                       </div>
//                     </div>
//                   ))}

//                   <div className="order-total-row">
//                     <div>
//                       <div style={{ fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(17,24,68,0.45)", marginBottom: 3 }}>
//                         {lastOrder.shippingMethod}
//                       </div>
//                       <div style={{ fontSize: "1rem", fontWeight: 600, color: "#111844" }}>
//                         Total Amount
//                       </div>
//                     </div>
//                     <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", color: "#4B5694", fontWeight: 400 }}>
//                       Rs. {(lastOrder.total || lastOrder.totalPrice).toLocaleString()}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* ══ SAVED ADDRESSES ══════════════════════ */}
//             {activeSection === "addresses" && (
//               <div className="section-card">
//                 <p className="section-eyebrow">Delivery Details</p>
//                 <h2 className="section-title">
//                   Saved <span>Addresses</span>
//                 </h2>

//                 {!editingAddress ? (
//                   <>
//                     <div className="address-card">
//                       <button className="edit-btn" onClick={() => setEditingAddress(true)}>
//                         <i className="ti ti-edit" style={{ marginRight: 4 }} />
//                         Edit
//                       </button>
//                       <div className="address-label-tag">Default — Home</div>
//                       <div className="address-text">
//                         {profileData?.name}<br />
//                         {address.street}<br />
//                         {address.city}, {address.postal}<br />
//                         {address.country}
//                       </div>
//                     </div>
//                   </>
//                 ) : (
//                   <form className="address-form" onSubmit={handleAddressSubmit}>
//                     <div className="form-field">
//                       <label>Street Address</label>
//                       <input
//                         value={address.street}
//                         onChange={(e) => setAddress({ ...address, street: e.target.value })}
//                         placeholder="Street address"
//                       />
//                     </div>
//                     <div className="form-row">
//                       <div className="form-field">
//                         <label>City</label>
//                         <input
//                           value={address.city}
//                           onChange={(e) => setAddress({ ...address, city: e.target.value })}
//                           placeholder="City"
//                         />
//                       </div>
//                       <div className="form-field">
//                         <label>Postal Code</label>
//                         <input
//                           value={address.postal}
//                           onChange={(e) => setAddress({ ...address, postal: e.target.value })}
//                           placeholder="Postal code"
//                         />
//                       </div>
//                     </div>
//                     <div className="form-field">
//                       <label>Country</label>
//                       <input
//                         value={address.country}
//                         onChange={(e) => setAddress({ ...address, country: e.target.value })}
//                         placeholder="Country"
//                       />
//                     </div>
//                     <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
//                       <button type="submit" className="save-btn">
//                         Save Address
//                       </button>
//                       <button type="button" className="cancel-btn" onClick={() => setEditingAddress(false)}>
//                         Cancel
//                       </button>
//                     </div>
//                   </form>
//                 )}
//               </div>
//             )}

//             {/* ══ PREFERENCES ══════════════════════════ */}
//             {activeSection === "preferences" && (
//               <div className="section-card">
//                 <p className="section-eyebrow">Communication &amp; Experience</p>
//                 <h2 className="section-title">
//                   My <span>Preferences</span>
//                 </h2>

//                 {[
//                   { key: "newsletter", title: "Eloura Newsletter", desc: "Curated fragrance stories, house updates, and exclusive member content delivered monthly." },
//                   { key: "orderAlerts", title: "Order Notifications", desc: "Real-time updates when your order is confirmed, shipped, and delivered." },
//                   { key: "newArrivals", title: "New Arrivals", desc: "Be the first to discover new fragrances and limited-edition drops." },
//                   { key: "smsUpdates", title: "SMS Updates", desc: "Delivery alerts and flash sale notifications sent directly to your phone." },
//                 ].map((pref) => (
//                   <div className="pref-row" key={pref.key}>
//                     <div className="pref-info">
//                       <h4>{pref.title}</h4>
//                       <p>{pref.desc}</p>
//                     </div>
//                     <label className="toggle-wrap">
//                       <input
//                         type="checkbox"
//                         checked={preferences[pref.key as keyof typeof preferences]}
//                         onChange={() => {
//                           setPreferences((prev) => ({ ...prev, [pref.key]: !prev[pref.key as keyof typeof preferences] }));
//                           handleSave("Preferences updated");
//                         }}
//                       />
//                       <span className="toggle-slider" />
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {/* ══ ACCOUNT SETTINGS ═════════════════════ */}
//             {activeSection === "settings" && (
//               <div className="section-card">
//                 <p className="section-eyebrow">Security &amp; Privacy</p>
//                 <h2 className="section-title">
//                   Account <span>Settings</span>
//                 </h2>

//                 {[
//                   { label: "Full Name", value: profileData?.name || "—", desc: "Update how your name appears on orders and communications.", action: "Change Name" },
//                   { label: "Email Address", value: profileData?.email || "—", desc: "Your login email and where we send receipts.", action: "Change Email" },
//                   { label: "Password", value: "••••••••••••", desc: "Last changed: unknown. We recommend updating every 90 days.", action: "Change Password" },
//                 ].map((item, i) => (
//                   <div className="settings-row" key={i}>
//                     <div className="settings-info">
//                       <h4>{item.label}</h4>
//                       <p>{item.value} — {item.desc}</p>
//                     </div>
//                     <button className="settings-action" onClick={() => handleSave(`${item.label} update coming soon`)}>
//                       {item.action}
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}

//           </div>
//         </div>
//       </div>

//       {savedMessage && (
//         <div className="toast-msg">
//           <i className="ti ti-check" style={{ marginRight: 8 }} />
//           {savedMessage}
//         </div>
//       )}

//       <Footer />
//     </>
//   );
// }













































// import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import Header from "../components/header";
// import Footer from "../components/Footer";
// import { useAuth } from "../context/AuthContext";

// // --- TypeScript Backend Object Interfaces ---
// interface ScentProfile {
//   family: string;
//   intensity: string;
//   seasons: string[];
//   moods: string[];
//   notes: string[];
// }

// interface OrderItem {
//   name: string;
//   size: string;
//   qty: number;
//   price: number;
// }

// interface Order {
//   _id: string; 
//   createdAt: string;
//   items: OrderItem[]; // Maps to backend schema structure
//   status: string;
//   total: number;       // Maps to backend total field
//   shippingMethod: string;
//   shippingAddress?: {
//     street: string;
//     city: string;
//     postal: string;
//     country: string;
//   };
// }

// // States for Settings Modals
// const [activeModal, setActiveModal] = useState<"name" | "email" | "password" | null>(null);
// const [settingsInput, setSettingsInput] = useState({ name: "", email: "", currentPassword: "", newPassword: "" });

// interface UserProfileData {
//   _id: string;
//   name: string;
//   email: string;
//   role?: string;
//   createdAt?: string;
//   preferredCategory?: string;
//   scentProfile?: ScentProfile;
//   stats?: {
//     ordersPlaced: number;
//     scentsExplored: number;
//     reviewsWritten: number;
//   };
// }

// export default function UserProfile() {
//   const { user, logout } = useAuth();
//   const [activeSection, setActiveSection] = useState("overview");
//   const [editingAddress, setEditingAddress] = useState(false);
//   const [savedMessage, setSavedMessage] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [ordersLoading, setOrdersLoading] = useState(true);
//   const [error, setError] = useState("");

//   // Live State hooks
//   const [profileData, setProfileData] = useState<UserProfileData | null>(null);
//   const [orders, setOrders] = useState<Order[]>([]); // New state array to hold full transaction history

//   const [preferences, setPreferences] = useState({
//     newsletter: true,
//     smsUpdates: false,
//     orderAlerts: true,
//     newArrivals: true,
//   });

//   const [address, setAddress] = useState({
//     street: "123 Main Boulevard, Gulberg III",
//     city: "Lahore",
//     postal: "54000",
//     country: "Pakistan",
//   });

//   // ─── FETCH PROFILE SUMMARY ──────────────────────────────────
//   useEffect(() => {
//     const fetchProfileData = async () => {
//       try {
//         setLoading(true);
//         const token = localStorage.getItem("token"); 
        
//         const response = await fetch("http://localhost:5000/api/user/profile", {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${token}`,
//           },
//         });

//         if (response.ok) {
//           const data = await response.json();
//           setProfileData(data.user || data);
          
//           // Pre-populate address if it exists in the database document
//           if (data.user?.address) {
//             setAddress(data.user.address);
//           }
//         } else {
//           throw new Error("Failed to fetch profile metadata");
//         }
//       } catch (err: any) {
//         console.error("Profile sync error:", err);
//         setError("Could not sync profile metrics with server.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfileData();
//   }, []);

//   // ─── FETCH COMPLETE ORDER HISTORY ───────────────────────────
//   useEffect(() => {
//     const fetchUserOrders = async () => {
//       try {
//         setOrdersLoading(true);
//         const token = localStorage.getItem("token");
        
//         // Hits your exact router configuration path: router.get('/my-orders', protect, getUserOrders)
//         const response = await fetch("http://localhost:5000/api/orders/my-orders", {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${token}`,
//           },
//         });

//         if (response.ok) {
//           const data = await response.json();
//           setOrders(data); // Stores the full history array inside state
//         } else {
//           throw new Error("Failed to pull transaction collection logs");
//         }
//       } catch (err) {
//         console.error("Order history fetch error:", err);
//       } finally {
//         setOrdersLoading(false);
//       }
//     };

//     fetchUserOrders();
//   }, []);

//   // Luxury aesthetic fallback definitions
//   const scentProfile = profileData?.scentProfile || {
//     family: "Oriental & Woody",
//     intensity: "Moderate–Heavy",
//     seasons: ["Autumn", "Winter"],
//     moods: ["Confident", "Mysterious", "Sophisticated"],
//     notes: ["Oud", "Amber", "Sandalwood", "Rose", "Vanilla"],
//   };

//   const navItems = [
//     { id: "overview", label: "Overview", icon: "ti-layout-dashboard" },
//     { id: "scent", label: "Scent Profile", icon: "ti-star" },
//     { id: "orders", label: "Order History", icon: "ti-package" }, // Adjusted label text
//     { id: "addresses", label: "Saved Addresses", icon: "ti-map-pin" },
//     { id: "preferences", label: "Preferences", icon: "ti-adjustments" },
//     { id: "settings", label: "Account Settings", icon: "ti-settings" },
//   ];

//   const statusColor: Record<string, string> = {
//     Processing: "#4B5694",
//     Pending: "#b87333",
//     Shipped: "#253382",
//     Delivered: "#2d7a4f",
//     Cancelled: "#c0392b",
//   };

//   const handleSave = (msg: string) => {
//     setSavedMessage(msg);
//     setTimeout(() => setSavedMessage(""), 2800);
//   };

//   const handleAddressSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch("http://localhost:5000/api/user/address", {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`,
//         },
//         body: JSON.stringify(address),
//       });

//       if (!response.ok) throw new Error("Could not update address coordinates.");

//       setEditingAddress(false);
//       handleSave("Address saved successfully");
//     } catch (err) {
//       handleSave("Error updating address details");
//     }
//   };

//   if (loading) {
//     return (
//       <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#EAE0CF", fontFamily: "'Jost', sans-serif", color: "#111844" }}>
//         <p style={{ letterSpacing: "0.2em", textTransform: "uppercase" }}>Loading your luxury profile lounge...</p>
//       </div>
//     );
//   }

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;400;500&display=swap');
//         .profile-root { background: #EAE0CF; min-height: 100vh; font-family: 'Jost', sans-serif; padding-bottom: 6rem; }
//         .profile-banner { background: linear-gradient(135deg, #111844 0%, #1a245c 60%, #253382 100%); padding: 5rem 2rem 4rem; text-align: center; position: relative; overflow: hidden; }
//         .profile-avatar { width: 84px; height: 84px; border-radius: 50%; background: rgba(234,224,207,0.12); border: 2px solid rgba(234,224,207,0.3); display: flex; align-items: center; justify-content: center; margin: 0 auto 1.2rem; position: relative; z-index: 2; }
//         .profile-avatar span { font-family: 'Cormorant Garamond', serif; font-size: 2rem; font-weight: 300; color: #EAE0CF; letter-spacing: 0.05em; }
//         .profile-name { font-family: 'Cormorant Garamond', serif; font-size: clamp(1.8rem, 3vw, 2.4rem); font-weight: 300; color: #EAE0CF; letter-spacing: 0.04em; margin-bottom: 0.3rem; position: relative; z-index: 2; }
//         .profile-email { font-size: 0.82rem; color: rgba(234,224,207,0.6); letter-spacing: 0.15em; text-transform: uppercase; position: relative; z-index: 2; }
//         .profile-badge { display: inline-flex; align-items: center; gap: 6px; margin-top: 1rem; background: rgba(234,224,207,0.1); border: 1px solid rgba(234,224,207,0.2); padding: 5px 16px; border-radius: 999px; font-size: 0.68rem; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(234,224,207,0.75); position: relative; z-index: 2; }
//         .profile-layout { max-width: 1200px; margin: 0 auto; padding: 3rem 2rem 0; display: grid; grid-template-columns: 240px 1fr; gap: 2.5rem; align-items: start; }
//         .profile-nav { background: rgba(255,255,255,0.5); border: 1px solid rgba(75,86,148,0.18); border-radius: 20px; padding: 1.2rem; position: sticky; top: 100px; backdrop-filter: blur(10px); }
//         .nav-label { font-size: 0.62rem; letter-spacing: 0.3em; text-transform: uppercase; color: rgba(17,24,68,0.4); padding: 0 0.8rem; margin-bottom: 0.8rem; }
//         .nav-item { display: flex; align-items: center; gap: 10px; padding: 0.75rem 0.9rem; border-radius: 12px; cursor: pointer; transition: all 0.22s ease; border: 1px solid transparent; font-size: 0.83rem; color: rgba(17,24,68,0.65); margin-bottom: 3px; background: transparent; width: 100%; text-align: left; }
//         .nav-item:hover { background: rgba(17,24,68,0.06); color: #111844; }
//         .nav-item.active { background: #111844; color: #EAE0CF; border-color: transparent; }
//         .nav-divider { height: 1px; background: rgba(75,86,148,0.15); margin: 0.8rem 0; }
//         .nav-logout { display: flex; align-items: center; gap: 10px; padding: 0.75rem 0.9rem; border-radius: 12px; cursor: pointer; font-size: 0.83rem; color: #c0392b; background: transparent; border: 1px solid transparent; width: 100%; text-align: left; transition: 0.22s; }
//         .nav-logout:hover { background: rgba(192,57,43,0.08); border-color: rgba(192,57,43,0.2); }
//         .profile-content { display: flex; flex-direction: column; gap: 1.6rem; }
//         .section-card { background: rgba(255,255,255,0.55); border: 1px solid rgba(75,86,148,0.18); border-radius: 20px; padding: 2rem 2.2rem; backdrop-filter: blur(10px); }
//         .section-eyebrow { font-size: 0.62rem; letter-spacing: 0.3em; text-transform: uppercase; color: #4B5694; margin-bottom: 0.5rem; }
//         .section-title { font-family: 'Cormorant Garamond', serif; font-size: 1.55rem; font-weight: 300; color: #111844; margin-bottom: 1.8rem; line-height: 1.2; }
//         .overview-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.8rem; }
//         .stat-box { background: linear-gradient(135deg, #111844, #1a245c); border-radius: 16px; padding: 1.4rem 1.2rem; color: #EAE0CF; text-align: center; }
//         .stat-num { font-family: 'Cormorant Garamond', serif; font-size: 2.2rem; font-weight: 300; line-height: 1; margin-bottom: 0.3rem; }
//         .stat-lbl { font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(234,224,207,0.6); }
//         .overview-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
//         .info-block { background: rgba(17,24,68,0.04); border: 1px solid rgba(75,86,148,0.15); border-radius: 14px; padding: 1.1rem 1.2rem; }
//         .info-block-label { font-size: 0.62rem; letter-spacing: 0.2em; text-transform: uppercase; color: #7288AE; margin-bottom: 0.35rem; }
//         .info-block-value { font-size: 0.9rem; color: #111844; font-weight: 500; }
//         .scent-family-badge { display: inline-block; padding: 6px 18px; background: linear-gradient(135deg, #111844, #4B5694); color: #EAE0CF; border-radius: 999px; font-size: 0.75rem; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 1.5rem; }
//         .scent-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem; }
//         .scent-block { background: rgba(17,24,68,0.04); border: 1px solid rgba(75,86,148,0.15); border-radius: 14px; padding: 1.2rem; }
//         .scent-block h4 { font-size: 0.62rem; letter-spacing: 0.2em; text-transform: uppercase; color: #7288AE; margin-bottom: 0.8rem; }
//         .tag-row { display: flex; flex-wrap: wrap; gap: 6px; }
//         .tag { font-size: 0.72rem; padding: 4px 12px; border-radius: 999px; border: 1px solid rgba(75,86,148,0.3); color: #4B5694; background: rgba(75,86,148,0.06); letter-spacing: 0.08em; }
//         .notes-row { display: flex; flex-wrap: wrap; gap: 8px; }
//         .note-pill { display: flex; align-items: center; gap: 6px; background: linear-gradient(135deg, #111844, #4B5694); color: #EAE0CF; font-size: 0.75rem; padding: 6px 14px; border-radius: 999px; letter-spacing: 0.08em; }
//         .order-card { background: rgba(17,24,68,0.04); border: 1px solid rgba(75,86,148,0.2); border-radius: 16px; padding: 1.5rem; margin-bottom: 1.2rem; }
//         .order-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.2rem; }
//         .order-id { font-family: 'Cormorant Garamond', serif; font-size: 1.1rem; color: #111844; margin-bottom: 0.2rem; }
//         .order-date { font-size: 0.75rem; color: rgba(17,24,68,0.5); letter-spacing: 0.1em; }
//         .order-status-badge { font-size: 0.65rem; letter-spacing: 0.18em; text-transform: uppercase; padding: 5px 14px; border-radius: 999px; border-width: 1px; border-style: solid; }
//         .order-item-row { display: flex; align-items: center; justify-content: space-between; padding: 0.8rem 0; border-top: 1px solid rgba(75,86,148,0.12); font-size: 0.88rem; }
//         .order-item-name { color: #111844; font-weight: 500; }
//         .order-item-sub { font-size: 0.75rem; color: rgba(17,24,68,0.5); margin-top: 2px; }
//         .order-item-price { font-size: 0.9rem; color: #4B5694; font-weight: 500; }
//         .order-total-row { display: flex; justify-content: space-between; align-items: baseline; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid rgba(75,86,148,0.18); }
//         .address-card { background: rgba(17,24,68,0.04); border: 1px solid rgba(75,86,148,0.18); border-radius: 16px; padding: 1.5rem; position: relative; }
//         .address-label-tag { display: inline-block; font-size: 0.6rem; letter-spacing: 0.22em; text-transform: uppercase; padding: 3px 12px; border-radius: 999px; background: rgba(17,24,68,0.08); color: #4B5694; margin-bottom: 0.8rem; }
//         .address-text { font-size: 0.92rem; color: #111844; line-height: 1.8; }
//         .edit-btn { position: absolute; top: 1.2rem; right: 1.2rem; background: transparent; border: 1px solid rgba(75,86,148,0.3); border-radius: 8px; padding: 5px 12px; font-size: 0.7rem; letter-spacing: 0.12em; text-transform: uppercase; color: #4B5694; cursor: pointer; transition: 0.25s; font-family: 'Jost', sans-serif; }
//         .edit-btn:hover { background: #111844; color: #EAE0CF; border-color: #111844; }
//         .address-form { display: grid; gap: 12px; }
//         .form-field label { display: block; font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase; color: #7288AE; margin-bottom: 5px; }
//         .form-field input { width: 100%; padding: 0.7rem 1rem; border: 1px solid rgba(75,86,148,0.25); border-radius: 10px; background: rgba(255,255,255,0.7); font-size: 0.88rem; color: #111844; font-family: 'Jost', sans-serif; outline: none; transition: 0.25s; box-sizing: border-box; }
//         .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
//         .save-btn { padding: 0.75rem 2rem; background: linear-gradient(135deg, #111844, #4B5694); color: #EAE0CF; border: none; border-radius: 10px; font-size: 0.75rem; letter-spacing: 0.2em; text-transform: uppercase; cursor: pointer; transition: 0.25s; font-family: 'Jost', sans-serif; box-shadow: 0 8px 20px rgba(17,24,68,0.18); }
//         .cancel-btn { padding: 0.75rem 1.5rem; background: transparent; border: 1px solid rgba(75,86,148,0.3); border-radius: 10px; font-size: 0.75rem; letter-spacing: 0.2em; text-transform: uppercase; cursor: pointer; color: #4B5694; font-family: 'Jost', sans-serif; transition: 0.25s; }
//         .pref-row { display: flex; align-items: center; justify-content: space-between; padding: 1rem 0; border-bottom: 1px solid rgba(75,86,148,0.1); }
//         .pref-info h4 { font-size: 0.9rem; color: #111844; margin-bottom: 0.2rem; font-weight: 500; }
//         .pref-info p { font-size: 0.78rem; color: rgba(17,24,68,0.55); line-height: 1.5; }
//         .toggle-wrap { position: relative; width: 46px; height: 26px; flex-shrink: 0; }
//         .toggle-wrap input { opacity: 0; width: 0; height: 0; }
//         .toggle-slider { position: absolute; inset: 0; border-radius: 999px; background: rgba(17,24,68,0.15); cursor: pointer; transition: 0.3s; }
//         .toggle-slider::before { content: ''; position: absolute; width: 20px; height: 20px; left: 3px; top: 3px; border-radius: 50%; background: white; transition: 0.3s; box-shadow: 0 1px 4px rgba(0,0,0,0.15); }
//         .toggle-wrap input:checked + .toggle-slider { background: #111844; }
//         .toggle-wrap input:checked + .toggle-slider::before { transform: translateX(20px); }
//         .settings-row { display: flex; align-items: center; justify-content: space-between; padding: 1.1rem 0; border-bottom: 1px solid rgba(75,86,148,0.1); }
//         .settings-info h4 { font-size: 0.9rem; color: #111844; margin-bottom: 0.15rem; font-weight: 500; }
//         .settings-info p { font-size: 0.75rem; color: rgba(17,24,68,0.5); }
//         .settings-action { background: transparent; border: 1px solid rgba(75,86,148,0.3); border-radius: 8px; padding: 6px 16px; font-size: 0.7rem; letter-spacing: 0.12em; text-transform: uppercase; color: #4B5694; cursor: pointer; transition: 0.22s; font-family: 'Jost', sans-serif; white-space: nowrap; }
//         .settings-action:hover { background: #111844; color: #EAE0CF; border-color: #111844; }
//         .toast-msg { position: fixed; bottom: 2rem; right: 2rem; background: #111844; color: #EAE0CF; padding: 0.9rem 1.6rem; border-radius: 12px; font-size: 0.82rem; letter-spacing: 0.1em; z-index: 999; box-shadow: 0 12px 30px rgba(17,24,68,0.3); }
//         .no-orders-msg { text-align: center; padding: 3rem 1rem; color: rgba(17,24,68,0.5); font-style: italic; font-size: 0.95rem; }
//       `}</style>

//       <Header />

//       <div className="profile-root">

//         {/* ── BANNER ─────────────────────────────────── */}
//         <div className="profile-banner">
//           <div className="profile-avatar">
//             <span>
//               {profileData?.name ? profileData.name.slice(0, 2).toUpperCase() : "EL"}
//             </span>
//           </div>
//           <h1 className="profile-name">{profileData?.name || "Eloura Member"}</h1>
//           <p className="profile-email">{profileData?.email || "member@eloura.com"}</p>
//           <div className="profile-badge">
//             <i className="ti ti-crown" style={{ fontSize: 13 }} />
//             Connoisseur Member
//           </div>
//         </div>

//         {/* ── LAYOUT ─────────────────────────────────── */}
//         <div className="profile-layout">

//           {/* ── SIDEBAR ────────────────────────────────── */}
//           <nav className="profile-nav">
//             <p className="nav-label">My Account</p>
//             {navItems.map((item) => (
//               <button
//                 key={item.id}
//                 className={`nav-item ${activeSection === item.id ? "active" : ""}`}
//                 onClick={() => setActiveSection(item.id)}
//               >
//                 <i className={`ti ${item.icon}`} aria-hidden="true" />
//                 {item.label}
//               </button>
//             ))}
//             <div className="nav-divider" />
//             <button className="nav-logout" onClick={() => logout("manual")}>
//               <i className="ti ti-logout" aria-hidden="true" />
//               Sign Out
//             </button>
//           </nav>

//           {/* ── CONTENT ────────────────────────────────── */}
//           <div className="profile-content">

//             {/* ══ OVERVIEW ══════════════════════════════ */}
//             {activeSection === "overview" && (
//               <div className="section-card">
//                 <p className="section-eyebrow">Welcome Back</p>
//                 <h2 className="section-title">
//                   Account <span>Overview</span>
//                 </h2>

//                 <div className="overview-stats">
//                   <div className="stat-box">
//                     <div className="stat-num">{orders.length}</div>
//                     <div className="stat-lbl">Orders Placed</div>
//                   </div>
//                   <div className="stat-box">
//                     <div className="stat-num">{orders.length > 0 ? orders.length * 2 + 1 : 0}</div>
//                     <div className="stat-lbl">Scents Explored</div>
//                   </div>
//                   <div className="stat-box">
//                     <div className="stat-num">{profileData?.stats?.reviewsWritten || 0}</div>
//                     <div className="stat-lbl">Reviews Written</div>
//                   </div>
//                 </div>

//                 <div className="overview-info-grid">
//                   <div className="info-block">
//                     <div className="info-block-label">Full Name</div>
//                     <div className="info-block-value">{profileData?.name || "—"}</div>
//                   </div>
//                   <div className="info-block">
//                     <div className="info-block-label">Email Address</div>
//                     <div className="info-block-value">{profileData?.email || "—"}</div>
//                   </div>
//                   <div className="info-block">
//                     <div className="info-block-label">Account Status</div>
//                     <div className="info-block-value" style={{ color: "#2d7a4f" }}>
//                       ✦ Verified &amp; Active
//                     </div>
//                   </div>
//                   <div className="info-block">
//                     <div className="info-block-label">Member Since</div>
//                     <div className="info-block-value">
//                       {profileData?.createdAt ? new Date(profileData.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "June 2026"}
//                     </div>
//                   </div>
//                   <div className="info-block">
//                     <div className="info-block-label">Preferred Category</div>
//                     <div className="info-block-value">{profileData?.preferredCategory || "Oriental & Woody"}</div>
//                   </div>
//                   <div className="info-block">
//                     <div className="info-block-label">Last Order Date</div>
//                     <div className="info-block-value">
//                       {orders.length > 0 
//                         ? new Date(orders[0].createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) 
//                         : "No orders yet"}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* ══ SCENT PROFILE ════════════════════════ */}
//             {activeSection === "scent" && (
//               <div className="section-card">
//                 <p className="section-eyebrow">Your Olfactory Identity</p>
//                 <h2 className="section-title">
//                   Scent <span>Profile</span>
//                 </h2>

//                 <div className="scent-family-badge">
//                   <i className="ti ti-star" style={{ fontSize: 12, marginRight: 6 }} />
//                   {scentProfile.family}
//                 </div>

//                 <div className="scent-grid">
//                   <div className="scent-block">
//                     <h4>Preferred Seasons</h4>
//                     <div className="tag-row">
//                       {scentProfile.seasons.map((s) => (
//                         <span className="tag" key={s}>{s}</span>
//                       ))}
//                     </div>
//                   </div>
//                   <div className="scent-block">
//                     <h4>Typical Intensity</h4>
//                     <div className="tag-row">
//                       <span className="tag">{scentProfile.intensity}</span>
//                     </div>
//                   </div>
//                   <div className="scent-block" style={{ gridColumn: "1 / -1" }}>
//                     <h4>Your Mood Palette</h4>
//                     <div className="tag-row">
//                       {scentProfile.moods.map((m) => (
//                         <span className="tag" key={m}>{m}</span>
//                       ))}
//                     </div>
//                   </div>
//                 </div>

//                 <div>
//                   <p style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#7288AE", marginBottom: "0.8rem" }}>
//                     Signature Notes You Love
//                   </p>
//                   <div className="notes-row">
//                     {scentProfile.notes.map((n) => (
//                       <span className="note-pill" key={n}>
//                         <i className="ti ti-droplet" style={{ fontSize: 12 }} aria-hidden="true" />
//                         {n}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* ══ ORDER HISTORY (DYNAMIC LIST) ════════════ */}
//             {activeSection === "orders" && (
//               <div className="section-card">
//                 <p className="section-eyebrow">Purchase Vault</p>
//                 <h2 className="section-title">
//                   Order <span>History</span>
//                 </h2>

//                 {ordersLoading ? (
//                   <p style={{ color: "#111844", letterSpacing: "0.1em" }}>Synchronizing order ledgers...</p>
//                 ) : orders.length === 0 ? (
//                   <div className="no-orders-msg">
//                     <i className="ti ti-package-off" style={{ fontSize: "2rem", display: "block", marginBottom: "1rem" }} />
//                     You haven't initiated your fragrance collection yet. Your completed orders will appear here.
//                   </div>
//                 ) : (
//                   orders.map((order) => (
//                     <div className="order-card" key={order._id}>
//                       <div className="order-header">
//                         <div>
//                           <div className="order-id" style={{ textTransform: "uppercase", fontSize: "0.95rem", letterSpacing: "1px" }}>
//                             ID: #{order._id.slice(-8)}
//                           </div>
//                           <div className="order-date">
//                             <i className="ti ti-calendar" style={{ fontSize: 13, marginRight: 5, verticalAlign: -1 }} aria-hidden="true" />
//                             {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
//                           </div>
//                         </div>
//                         <div
//                           className="order-status-badge"
//                           style={{
//                             color: statusColor[order.status] || "#4B5694",
//                             borderColor: (statusColor[order.status] || "#4B5694") + "55",
//                             background: (statusColor[order.status] || "#4B5694") + "11",
//                           }}
//                         >
//                           {order.status}
//                         </div>
//                       </div>

//                       {order.items?.map((item, i) => (
//                         <div className="order-item-row" key={i}>
//                           <div>
//                             <div className="order-item-name">{item.name}</div>
//                             <div className="order-item-sub">Size: {item.size || "100ml"} × {item.qty}</div>
//                           </div>
//                           <div className="order-item-price">
//                             Rs. {item.price.toLocaleString()}
//                           </div>
//                         </div>
//                       ))}

//                       <div className="order-total-row">
//                         <div>
//                           <div style={{ fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(17,24,68,0.45)", marginBottom: 3 }}>
//                             {order.shippingMethod || "Standard Delivery"}
//                           </div>
//                           <div style={{ fontSize: "1rem", fontWeight: 600, color: "#111844" }}>
//                             Total Paid
//                           </div>
//                         </div>
//                         <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", color: "#4B5694", fontWeight: 400 }}>
//                           Rs. {order.total.toLocaleString()}
//                         </div>
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </div>
//             )}

//             {/* ══ SAVED ADDRESSES ══════════════════════ */}
//             {activeSection === "addresses" && (
//               <div className="section-card">
//                 <p className="section-eyebrow">Delivery Details</p>
//                 <h2 className="section-title">
//                   Saved <span>Addresses</span>
//                 </h2>

//                 {!editingAddress ? (
//                   <>
//                     <div className="address-card">
//                       <button className="edit-btn" onClick={() => setEditingAddress(true)}>
//                         <i className="ti ti-edit" style={{ marginRight: 4 }} />
//                         Edit
//                       </button>
//                       <div className="address-label-tag">Default — Home</div>
//                       <div className="address-text">
//                         {profileData?.name}<br />
//                         {address.street}<br />
//                         {address.city}, {address.postal}<br />
//                         {address.country}
//                       </div>
//                     </div>
//                   </>
//                 ) : (
//                   <form className="address-form" onSubmit={handleAddressSubmit}>
//                     <div className="form-field">
//                       <label>Street Address</label>
//                       <input
//                         value={address.street}
//                         onChange={(e) => setAddress({ ...address, street: e.target.value })}
//                         placeholder="Street address"
//                       />
//                     </div>
//                     <div className="form-row">
//                       <div className="form-field">
//                         <label>City</label>
//                         <input
//                           value={address.city}
//                           onChange={(e) => setAddress({ ...address, city: e.target.value })}
//                           placeholder="City"
//                         />
//                       </div>
//                       <div className="form-field">
//                         <label>Postal Code</label>
//                         <input
//                           value={address.postal}
//                           onChange={(e) => setAddress({ ...address, postal: e.target.value })}
//                           placeholder="Postal code"
//                         />
//                       </div>
//                     </div>
//                     <div className="form-field">
//                       <label>Country</label>
//                       <input
//                         value={address.country}
//                         onChange={(e) => setAddress({ ...address, country: e.target.value })}
//                         placeholder="Country"
//                       />
//                     </div>
//                     <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
//                       <button type="submit" className="save-btn">
//                         Save Address
//                       </button>
//                       <button type="button" className="cancel-btn" onClick={() => setEditingAddress(false)}>
//                         Cancel
//                       </button>
//                     </div>
//                   </form>
//                 )}
//               </div>
//             )}

//             {/* ══ PREFERENCES ══════════════════════════ */}
//             {activeSection === "preferences" && (
//               <div className="section-card">
//                 <p className="section-eyebrow">Communication &amp; Experience</p>
//                 <h2 className="section-title">
//                   My <span>Preferences</span>
//                 </h2>

//                 {[
//                   { key: "newsletter", title: "Eloura Newsletter", desc: "Curated fragrance stories, house updates, and exclusive member content delivered monthly." },
//                   { key: "orderAlerts", title: "Order Notifications", desc: "Real-time updates when your order is confirmed, shipped, and delivered." },
//                   { key: "newArrivals", title: "New Arrivals", desc: "Be the first to discover new fragrances and limited-edition drops." },
//                   { key: "smsUpdates", title: "SMS Updates", desc: "Delivery alerts and flash sale notifications sent directly to your phone." },
//                 ].map((pref) => (
//                   <div className="pref-row" key={pref.key}>
//                     <div className="pref-info">
//                       <h4>{pref.title}</h4>
//                       <p>{pref.desc}</p>
//                     </div>
//                     <label className="toggle-wrap">
//                       <input
//                         type="checkbox"
//                         checked={preferences[pref.key as keyof typeof preferences]}
//                         onChange={() => {
//                           setPreferences((prev) => ({ ...prev, [pref.key]: !prev[pref.key as keyof typeof preferences] }));
//                           handleSave("Preferences updated");
//                         }}
//                       />
//                       <span className="toggle-slider" />
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {/* ══ ACCOUNT SETTINGS ═════════════════════ */}
//             {/* {activeSection === "settings" && (
//               <div className="section-card">
//                 <p className="section-eyebrow">Security &amp; Privacy</p>
//                 <h2 className="section-title">
//                   Account <span>Settings</span>
//                 </h2>

//                 {[
//                   { label: "Full Name", value: profileData?.name || "—", desc: "Update how your name appears on orders and communications.", action: "Change Name" },
//                   { label: "Email Address", value: profileData?.email || "—", desc: "Your login email and where we send receipts.", action: "Change Email" },
//                   { label: "Password", value: "••••••••••••", desc: "Last changed: unknown. We recommend updating every 90 days.", action: "Change Password" },
//                 ].map((item, i) => (
//                   <div className="settings-row" key={i}>
//                     <div className="settings-info">
//                       <h4>{item.label}</h4>
//                       <p>{item.value} — {item.desc}</p>
//                     </div>
//                     <button className="settings-action" onClick={() => handleSave(`${item.label} update coming soon`)}>
//                       {item.action}
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )} */}

//             {/* ══ ACCOUNT SETTINGS ═════════════════════ */}
//             {activeSection === "settings" && (
//               <div className="section-card">
//                 <p className="section-eyebrow">Security &amp; Privacy</p>
//                 <h2 className="section-title">
//                   Account <span>Settings</span>
//                 </h2>

//                 <div className="settings-row">
//                   <div className="settings-info">
//                     <h4>Full Name</h4>
//                     <p>{profileData?.name || "—"} — Update how your name appears on orders and communications.</p>
//                   </div>
//                   <button className="settings-action" onClick={() => { setSettingsInput({ ...settingsInput, name: profileData?.name || "" }); setActiveModal("name"); }}>
//                     Change Name
//                   </button>
//                 </div>

//                 <div className="settings-row">
//                   <div className="settings-info">
//                     <h4>Email Address</h4>
//                     <p>{profileData?.email || "—"} — Your login email and where we send receipts.</p>
//                   </div>
//                   <button className="settings-action" onClick={() => { setSettingsInput({ ...settingsInput, email: profileData?.email || "" }); setActiveModal("email"); }}>
//                     Change Email
//                   </button>
//                 </div>

//                 <div className="settings-row">
//                   <div className="settings-info">
//                     <h4>Password</h4>
//                     <p>•••••••••••• — Securely encrypted password key.</p>
//                   </div>
//                   <button className="settings-action" onClick={() => { setSettingsInput({ ...settingsInput, currentPassword: "", newPassword: "" }); setActiveModal("password"); }}>
//                     Change Password
//                   </button>
//                 </div>

//                 {/* Elegant Settings Modal Overlay */}
//                 {activeModal && (
//                   <div style={{ position: "fixed", inset: 0, background: "rgba(17,24,68,0.4)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
//                     <div style={{ background: "#EAE0CF", border: "1px solid rgba(75,86,148,0.2)", borderRadius: "20px", padding: "2rem", width: "100%", maxWidth: "420px", boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}>
//                       <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", color: "#111844", marginBottom: "1.5rem", textTransform: "capitalize" }}>Change {activeModal}</h3>
                      
//                       <form onSubmit={async (e) => {
//                         e.preventDefault();
//                         try {
//                           const token = localStorage.getItem("token");
//                           const response = await fetch("http://localhost:5000/api/user/update-settings", {
//                             method: "PUT",
//                             headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
//                             body: JSON.stringify(settingsInput)
//                           });
//                           const result = await response.json();
//                           if (result.success) {
//                             if (profileData) setProfileData({ ...profileData, name: result.user.name, email: result.user.email });
//                             setActiveModal(null);
//                             handleSave("Security matrix safely updated");
//                           } else {
//                             handleSave(result.message || "Error processing security step");
//                           }
//                         } catch (err) {
//                           handleSave("Server synchronization error");
//                         }
//                       }}>
//                         {activeModal === "name" && (
//                           <div className="form-field" style={{ marginBottom: "1rem" }}>
//                             <label>New Name</label>
//                             <input value={settingsInput.name} onChange={(e) => setSettingsInput({ ...settingsInput, name: e.target.value })} required />
//                           </div>
//                         )}

//                         {activeModal === "email" && (
//                           <div className="form-field" style={{ marginBottom: "1rem" }}>
//                             <label>New Email Address</label>
//                             <input type="email" value={settingsInput.email} onChange={(e) => setSettingsInput({ ...settingsInput, email: e.target.value })} required />
//                           </div>
//                         )}

//                         {activeModal === "password" && (
//                           <>
//                             <div className="form-field" style={{ marginBottom: "1rem" }}>
//                               <label>Current Password</label>
//                               <input type="password" value={settingsInput.currentPassword} onChange={(e) => setSettingsInput({ ...settingsInput, currentPassword: e.target.value })} required />
//                             </div>
//                             <div className="form-field" style={{ marginBottom: "1rem" }}>
//                               <label>New Secure Password</label>
//                               <input type="password" value={settingsInput.newPassword} onChange={(e) => setSettingsInput({ ...settingsInput, newPassword: e.target.value })} required />
//                             </div>
//                           </>
//                         )}

//                         <div style={{ display: "flex", gap: "10px", marginTop: "1.5rem" }}>
//                           <button type="submit" className="save-btn" style={{ padding: "0.6rem 1.5rem" }}>Confirm</button>
//                           <button type="button" className="cancel-btn" style={{ padding: "0.6rem 1.2rem" }} onClick={() => setActiveModal(null)}>Cancel</button>
//                         </div>
//                       </form>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}

//           </div>
//         </div>
//       </div>

//       {savedMessage && (
//         <div className="toast-msg">
//           <i className="ti ti-check" style={{ marginRight: 8 }} />
//           {savedMessage}
//         </div>
//       )}

//       <Footer />
//     </>
//   );
// }






import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

// --- TypeScript Backend Object Interfaces ---
interface ScentProfile {
  family: string;
  intensity: string;
  seasons: string[];
  moods: string[];
  notes: string[];
}

interface OrderItem {
  name: string;
  size: string;
  qty: number;
  price: number;
}

interface Order {
  _id: string; 
  createdAt: string;
  items: OrderItem[];
  status: string;
  total: number;       
  shippingMethod: string;
  shippingAddress?: {
    street: string;
    city: string;
    postal: string;
    country: string;
  };
}

interface UserProfileData {
  _id: string;
  name: string;
  email: string;
  role?: string;
  createdAt?: string;
  preferredCategory?: string;
  scentProfile?: ScentProfile;
  stats?: {
    ordersPlaced: number;
    scentsExplored: number;
    reviewsWritten: number;
  };
}

export default function UserProfile() {
  const { user, logout } = useAuth();
  
  // ─── TOP LEVEL HOOKS (CRITICAL FIX FOR INVALID HOOK CALL) ───
  const [activeSection, setActiveSection] = useState("overview");
  const [editingAddress, setEditingAddress] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [error, setError] = useState("");

  // Live State hooks
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]); 

  // Security Account Settings Modals States
  const [activeModal, setActiveModal] = useState<"name" | "email" | "password" | null>(null);
  const [settingsInput, setSettingsInput] = useState({ name: "", email: "", currentPassword: "", newPassword: "" });

  const [preferences, setPreferences] = useState({
    newsletter: true,
    smsUpdates: false,
    orderAlerts: true,
    newArrivals: true,
  });

  const [address, setAddress] = useState({
    street: "123 Main Boulevard, Gulberg III",
    city: "Lahore",
    postal: "54000",
    country: "Pakistan",
  });

  // ─── FETCH PROFILE SUMMARY ──────────────────────────────────
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token"); 
        
        const response = await fetch("http://localhost:5000/api/user/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProfileData(data.user || data);
          
          if (data.user?.address) {
            setAddress(data.user.address);
          }
        } else {
          throw new Error("Failed to fetch profile metadata");
        }
      } catch (err: any) {
        console.error("Profile sync error:", err);
        setError("Could not sync profile metrics with server.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  // ─── FETCH COMPLETE ORDER HISTORY ───────────────────────────
  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        setOrdersLoading(true);
        const token = localStorage.getItem("token");
        
        const response = await fetch("http://localhost:5000/api/orders/my-orders", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setOrders(data); 
        } else {
          throw new Error("Failed to pull transaction collection logs");
        }
      } catch (err) {
        console.error("Order history fetch error:", err);
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchUserOrders();
  }, []);

  // Luxury aesthetic fallback definitions
  const scentProfile = profileData?.scentProfile || {
    family: "Oriental & Woody",
    intensity: "Moderate–Heavy",
    seasons: ["Autumn", "Winter"],
    moods: ["Confident", "Mysterious", "Sophisticated"],
    notes: ["Oud", "Amber", "Sandalwood", "Rose", "Vanilla"],
  };

  const navItems = [
    { id: "overview", label: "Overview", icon: "ti-layout-dashboard" },
    { id: "scent", label: "Scent Profile", icon: "ti-star" },
    { id: "orders", label: "Order History", icon: "ti-package" }, 
    { id: "addresses", label: "Saved Addresses", icon: "ti-map-pin" },
    { id: "preferences", label: "Preferences", icon: "ti-adjustments" },
    { id: "settings", label: "Account Settings", icon: "ti-settings" },
  ];

  const statusColor: Record<string, string> = {
    Processing: "#4B5694",
    Pending: "#b87333",
    Shipped: "#253382",
    Delivered: "#2d7a4f",
    Cancelled: "#c0392b",
  };

  const handleSave = (msg: string) => {
    setSavedMessage(msg);
    setTimeout(() => setSavedMessage(""), 2800);
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/user/address", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(address),
      });

      if (!response.ok) throw new Error("Could not update address coordinates.");

      setEditingAddress(false);
      handleSave("Address saved successfully");
    } catch (err) {
      handleSave("Error updating address details");
    }
  };

  // ─── EARLY RETURN (SAFE TO EXECUTE DOWN HERE) ───────────────
  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#EAE0CF", fontFamily: "'Jost', sans-serif", color: "#111844" }}>
        <p style={{ letterSpacing: "0.2em", textTransform: "uppercase" }}>Loading your luxury profile lounge...</p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;400;500&display=swap');
        .profile-root { background: #EAE0CF; min-height: 100vh; font-family: 'Jost', sans-serif; padding-bottom: 6rem; }
        .profile-banner { background: linear-gradient(135deg, #111844 0%, #1a245c 60%, #253382 100%); padding: 5rem 2rem 4rem; text-align: center; position: relative; overflow: hidden; }
        .profile-avatar { width: 84px; height: 84px; border-radius: 50%; background: rgba(234,224,207,0.12); border: 2px solid rgba(234,224,207,0.3); display: flex; align-items: center; justify-content: center; margin: 0 auto 1.2rem; position: relative; z-index: 2; }
        .profile-avatar span { font-family: 'Cormorant Garamond', serif; font-size: 2rem; font-weight: 300; color: #EAE0CF; letter-spacing: 0.05em; }
        .profile-name { font-family: 'Cormorant Garamond', serif; font-size: clamp(1.8rem, 3vw, 2.4rem); font-weight: 300; color: #EAE0CF; letter-spacing: 0.04em; margin-bottom: 0.3rem; position: relative; z-index: 2; }
        .profile-email { font-size: 0.82rem; color: rgba(234,224,207,0.6); letter-spacing: 0.15em; text-transform: uppercase; position: relative; z-index: 2; }
        .profile-badge { display: inline-flex; align-items: center; gap: 6px; margin-top: 1rem; background: rgba(234,224,207,0.1); border: 1px solid rgba(234,224,207,0.2); padding: 5px 16px; border-radius: 999px; font-size: 0.68rem; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(234,224,207,0.75); position: relative; z-index: 2; }
        .profile-layout { max-width: 1200px; margin: 0 auto; padding: 3rem 2rem 0; display: grid; grid-template-columns: 240px 1fr; gap: 2.5rem; align-items: start; }
        .profile-nav { background: rgba(255,255,255,0.5); border: 1px solid rgba(75,86,148,0.18); border-radius: 20px; padding: 1.2rem; position: sticky; top: 100px; backdrop-filter: blur(10px); }
        .nav-label { font-size: 0.62rem; letter-spacing: 0.3em; text-transform: uppercase; color: rgba(17,24,68,0.4); padding: 0 0.8rem; margin-bottom: 0.8rem; }
        .nav-item { display: flex; align-items: center; gap: 10px; padding: 0.75rem 0.9rem; border-radius: 12px; cursor: pointer; transition: all 0.22s ease; border: 1px solid transparent; font-size: 0.83rem; color: rgba(17,24,68,0.65); margin-bottom: 3px; background: transparent; width: 100%; text-align: left; }
        .nav-item:hover { background: rgba(17,24,68,0.06); color: #111844; }
        .nav-item.active { background: #111844; color: #EAE0CF; border-color: transparent; }
        .nav-divider { height: 1px; background: rgba(75,86,148,0.15); margin: 0.8rem 0; }
        .nav-logout { display: flex; align-items: center; gap: 10px; padding: 0.75rem 0.9rem; border-radius: 12px; cursor: pointer; font-size: 0.83rem; color: #c0392b; background: transparent; border: 1px solid transparent; width: 100%; text-align: left; transition: 0.22s; }
        .nav-logout:hover { background: rgba(192,57,43,0.08); border-color: rgba(192,57,43,0.2); }
        .profile-content { display: flex; flex-direction: column; gap: 1.6rem; }
        .section-card { background: rgba(255,255,255,0.55); border: 1px solid rgba(75,86,148,0.18); border-radius: 20px; padding: 2rem 2.2rem; backdrop-filter: blur(10px); }
        .section-eyebrow { font-size: 0.62rem; letter-spacing: 0.3em; text-transform: uppercase; color: #4B5694; margin-bottom: 0.5rem; }
        .section-title { font-family: 'Cormorant Garamond', serif; font-size: 1.55rem; font-weight: 300; color: #111844; margin-bottom: 1.8rem; line-height: 1.2; }
        .overview-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.8rem; }
        .stat-box { background: linear-gradient(135deg, #111844, #1a245c); border-radius: 16px; padding: 1.4rem 1.2rem; color: #EAE0CF; text-align: center; }
        .stat-num { font-family: 'Cormorant Garamond', serif; font-size: 2.2rem; font-weight: 300; line-height: 1; margin-bottom: 0.3rem; }
        .stat-lbl { font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(234,224,207,0.6); }
        .overview-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .info-block { background: rgba(17,24,68,0.04); border: 1px solid rgba(75,86,148,0.15); border-radius: 14px; padding: 1.1rem 1.2rem; }
        .info-block-label { font-size: 0.62rem; letter-spacing: 0.2em; text-transform: uppercase; color: #7288AE; margin-bottom: 0.35rem; }
        .info-block-value { font-size: 0.9rem; color: #111844; font-weight: 500; }
        .scent-family-badge { display: inline-block; padding: 6px 18px; background: linear-gradient(135deg, #111844, #4B5694); color: #EAE0CF; border-radius: 999px; font-size: 0.75rem; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 1.5rem; }
        .scent-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem; }
        .scent-block { background: rgba(17,24,68,0.04); border: 1px solid rgba(75,86,148,0.15); border-radius: 14px; padding: 1.2rem; }
        .scent-block h4 { font-size: 0.62rem; letter-spacing: 0.2em; text-transform: uppercase; color: #7288AE; margin-bottom: 0.8rem; }
        .tag-row { display: flex; flex-wrap: wrap; gap: 6px; }
        .tag { font-size: 0.72rem; padding: 4px 12px; border-radius: 999px; border: 1px solid rgba(75,86,148,0.3); color: #4B5694; background: rgba(75,86,148,0.06); letter-spacing: 0.08em; }
        .notes-row { display: flex; flex-wrap: wrap; gap: 8px; }
        .note-pill { display: flex; align-items: center; gap: 6px; background: linear-gradient(135deg, #111844, #4B5694); color: #EAE0CF; font-size: 0.75rem; padding: 6px 14px; border-radius: 999px; letter-spacing: 0.08em; }
        .order-card { background: rgba(17,24,68,0.04); border: 1px solid rgba(75,86,148,0.2); border-radius: 16px; padding: 1.5rem; margin-bottom: 1.2rem; }
        .order-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.2rem; }
        .order-id { font-family: 'Cormorant Garamond', serif; font-size: 1.1rem; color: #111844; margin-bottom: 0.2rem; }
        .order-date { font-size: 0.75rem; color: rgba(17,24,68,0.5); letter-spacing: 0.1em; }
        .order-status-badge { font-size: 0.65rem; letter-spacing: 0.18em; text-transform: uppercase; padding: 5px 14px; border-radius: 999px; border-width: 1px; border-style: solid; }
        .order-item-row { display: flex; align-items: center; justify-content: space-between; padding: 0.8rem 0; border-top: 1px solid rgba(75,86,148,0.12); font-size: 0.88rem; }
        .order-item-name { color: #111844; font-weight: 500; }
        .order-item-sub { font-size: 0.75rem; color: rgba(17,24,68,0.5); margin-top: 2px; }
        .order-item-price { font-size: 0.9rem; color: #4B5694; font-weight: 500; }
        .order-total-row { display: flex; justify-content: space-between; align-items: baseline; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid rgba(75,86,148,0.18); }
        .address-card { background: rgba(17,24,68,0.04); border: 1px solid rgba(75,86,148,0.18); border-radius: 16px; padding: 1.5rem; position: relative; }
        .address-label-tag { display: inline-block; font-size: 0.6rem; letter-spacing: 0.22em; text-transform: uppercase; padding: 3px 12px; border-radius: 999px; background: rgba(17,24,68,0.08); color: #4B5694; margin-bottom: 0.8rem; }
        .address-text { font-size: 0.92rem; color: #111844; line-height: 1.8; }
        .edit-btn { position: absolute; top: 1.2rem; right: 1.2rem; background: transparent; border: 1px solid rgba(75,86,148,0.3); border-radius: 8px; padding: 5px 12px; font-size: 0.7rem; letter-spacing: 0.12em; text-transform: uppercase; color: #4B5694; cursor: pointer; transition: 0.25s; font-family: 'Jost', sans-serif; }
        .edit-btn:hover { background: #111844; color: #EAE0CF; border-color: #111844; }
        .address-form { display: grid; gap: 12px; }
        .form-field label { display: block; font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase; color: #7288AE; margin-bottom: 5px; }
        .form-field input { width: 100%; padding: 0.7rem 1rem; border: 1px solid rgba(75,86,148,0.25); border-radius: 10px; background: rgba(255,255,255,0.7); font-size: 0.88rem; color: #111844; font-family: 'Jost', sans-serif; outline: none; transition: 0.25s; box-sizing: border-box; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .save-btn { padding: 0.75rem 2rem; background: linear-gradient(135deg, #111844, #4B5694); color: #EAE0CF; border: none; border-radius: 10px; font-size: 0.75rem; letter-spacing: 0.2em; text-transform: uppercase; cursor: pointer; transition: 0.25s; font-family: 'Jost', sans-serif; box-shadow: 0 8px 20px rgba(17,24,68,0.18); }
        .cancel-btn { padding: 0.75rem 1.5rem; background: transparent; border: 1px solid rgba(75,86,148,0.3); border-radius: 10px; font-size: 0.75rem; letter-spacing: 0.2em; text-transform: uppercase; cursor: pointer; color: #4B5694; font-family: 'Jost', sans-serif; transition: 0.25s; }
        .pref-row { display: flex; align-items: center; justify-content: space-between; padding: 1rem 0; border-bottom: 1px solid rgba(75,86,148,0.1); }
        .pref-info h4 { font-size: 0.9rem; color: #111844; margin-bottom: 0.2rem; font-weight: 500; }
        .pref-info p { font-size: 0.78rem; color: rgba(17,24,68,0.55); line-height: 1.5; }
        .toggle-wrap { position: relative; width: 46px; height: 26px; flex-shrink: 0; }
        .toggle-wrap input { opacity: 0; width: 0; height: 0; }
        .toggle-slider { position: absolute; inset: 0; border-radius: 999px; background: rgba(17,24,68,0.15); cursor: pointer; transition: 0.3s; }
        .toggle-slider::before { content: ''; position: absolute; width: 20px; height: 20px; left: 3px; top: 3px; border-radius: 50%; background: white; transition: 0.3s; box-shadow: 0 1px 4px rgba(0,0,0,0.15); }
        .toggle-wrap input:checked + .toggle-slider { background: #111844; }
        .toggle-wrap input:checked + .toggle-slider::before { transform: translateX(20px); }
        .settings-row { display: flex; align-items: center; justify-content: space-between; padding: 1.1rem 0; border-bottom: 1px solid rgba(75,86,148,0.1); }
        .settings-info h4 { font-size: 0.9rem; color: #111844; margin-bottom: 0.15rem; font-weight: 500; }
        .settings-info p { font-size: 0.75rem; color: rgba(17,24,68,0.5); }
        .settings-action { background: transparent; border: 1px solid rgba(75,86,148,0.3); border-radius: 8px; padding: 6px 16px; font-size: 0.7rem; letter-spacing: 0.12em; text-transform: uppercase; color: #4B5694; cursor: pointer; transition: 0.22s; font-family: 'Jost', sans-serif; white-space: nowrap; }
        .settings-action:hover { background: #111844; color: #EAE0CF; border-color: #111844; }
        .toast-msg { position: fixed; bottom: 2rem; right: 2rem; background: #111844; color: #EAE0CF; padding: 0.9rem 1.6rem; border-radius: 12px; font-size: 0.82rem; letter-spacing: 0.1em; z-index: 999; box-shadow: 0 12px 30px rgba(17,24,68,0.3); }
        .no-orders-msg { text-align: center; padding: 3rem 1rem; color: rgba(17,24,68,0.5); font-style: italic; font-size: 0.95rem; }
      `}</style>

      <Header />

      <div className="profile-root">

        {/* ── BANNER ─────────────────────────────────── */}
        <div className="profile-banner">
          <div className="profile-avatar">
            <span>
              {profileData?.name ? profileData.name.slice(0, 2).toUpperCase() : "EL"}
            </span>
          </div>
          <h1 className="profile-name">{profileData?.name || "Eloura Member"}</h1>
          <p className="profile-email">{profileData?.email || "member@eloura.com"}</p>
          <div className="profile-badge">
            <i className="ti ti-crown" style={{ fontSize: 13 }} />
            Connoisseur Member
          </div>
        </div>

        {/* ── LAYOUT ─────────────────────────────────── */}
        <div className="profile-layout">

          {/* ── SIDEBAR ────────────────────────────────── */}
          <nav className="profile-nav">
            <p className="nav-label">My Account</p>
            {navItems.map((item) => (
              <button
                key={item.id}
                className={`nav-item ${activeSection === item.id ? "active" : ""}`}
                onClick={() => setActiveSection(item.id)}
              >
                <i className={`ti ${item.icon}`} aria-hidden="true" />
                {item.label}
              </button>
            ))}
            <div className="nav-divider" />
            <button className="nav-logout" onClick={() => logout("manual")}>
              <i className="ti ti-logout" aria-hidden="true" />
              Sign Out
            </button>
          </nav>

          {/* ── CONTENT ────────────────────────────────── */}
          <div className="profile-content">

            {/* ══ OVERVIEW ══════════════════════════════ */}
            {activeSection === "overview" && (
              <div className="section-card">
                <p className="section-eyebrow">Welcome Back</p>
                <h2 className="section-title">
                  Account <span>Overview</span>
                </h2>

                <div className="overview-stats">
                  <div className="stat-box">
                    <div className="stat-num">{orders.length}</div>
                    <div className="stat-lbl">Orders Placed</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-num">{orders.length > 0 ? orders.length * 2 + 1 : 0}</div>
                    <div className="stat-lbl">Scents Explored</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-num">{profileData?.stats?.reviewsWritten || 0}</div>
                    <div className="stat-lbl">Reviews Written</div>
                  </div>
                </div>

                <div className="overview-info-grid">
                  <div className="info-block">
                    <div className="info-block-label">Full Name</div>
                    <div className="info-block-value">{profileData?.name || "—"}</div>
                  </div>
                  <div className="info-block">
                    <div className="info-block-label">Email Address</div>
                    <div className="info-block-value">{profileData?.email || "—"}</div>
                  </div>
                  <div className="info-block">
                    <div className="info-block-label">Account Status</div>
                    <div className="info-block-value" style={{ color: "#2d7a4f" }}>
                      ✦ Verified &amp; Active
                    </div>
                  </div>
                  <div className="info-block">
                    <div className="info-block-label">Member Since</div>
                    <div className="info-block-value">
                      {profileData?.createdAt ? new Date(profileData.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "June 2026"}
                    </div>
                  </div>
                  <div className="info-block">
                    <div className="info-block-label">Preferred Category</div>
                    <div className="info-block-value">{profileData?.preferredCategory || "Oriental & Woody"}</div>
                  </div>
                  <div className="info-block">
                    <div className="info-block-label">Last Order Date</div>
                    <div className="info-block-value">
                      {orders.length > 0 
                        ? new Date(orders[0].createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) 
                        : "No orders yet"}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ══ SCENT PROFILE ════════════════════════ */}
            {activeSection === "scent" && (
              <div className="section-card">
                <p className="section-eyebrow">Your Olfactory Identity</p>
                <h2 className="section-title">
                  Scent <span>Profile</span>
                </h2>

                <div className="scent-family-badge">
                  <i className="ti ti-star" style={{ fontSize: 12, marginRight: 6 }} />
                  {scentProfile.family}
                </div>

                <div className="scent-grid">
                  <div className="scent-block">
                    <h4>Preferred Seasons</h4>
                    <div className="tag-row">
                      {scentProfile.seasons.map((s) => (
                        <span className="tag" key={s}>{s}</span>
                      ))}
                    </div>
                  </div>
                  <div className="scent-block">
                    <h4>Typical Intensity</h4>
                    <div className="tag-row">
                      <span className="tag">{scentProfile.intensity}</span>
                    </div>
                  </div>
                  <div className="scent-block" style={{ gridColumn: "1 / -1" }}>
                    <h4>Your Mood Palette</h4>
                    <div className="tag-row">
                      {scentProfile.moods.map((m) => (
                        <span className="tag" key={m}>{m}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <p style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#7288AE", marginBottom: "0.8rem" }}>
                    Signature Notes You Love
                  </p>
                  <div className="notes-row">
                    {scentProfile.notes.map((n) => (
                      <span className="note-pill" key={n}>
                        <i className="ti ti-droplet" style={{ fontSize: 12 }} aria-hidden="true" />
                        {n}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ══ ORDER HISTORY (DYNAMIC LIST) ════════════ */}
            {activeSection === "orders" && (
              <div className="section-card">
                <p className="section-eyebrow">Purchase Vault</p>
                <h2 className="section-title">
                  Order <span>History</span>
                </h2>

                {ordersLoading ? (
                  <p style={{ color: "#111844", letterSpacing: "0.1em" }}>Synchronizing order ledgers...</p>
                ) : orders.length === 0 ? (
                  <div className="no-orders-msg">
                    <i className="ti ti-package-off" style={{ fontSize: "2rem", display: "block", marginBottom: "1rem" }} />
                    You haven't initiated your fragrance collection yet. Your completed orders will appear here.
                  </div>
                ) : (
                  orders.map((order) => (
                    <div className="order-card" key={order._id}>
                      <div className="order-header">
                        <div>
                          <div className="order-id" style={{ textTransform: "uppercase", fontSize: "0.95rem", letterSpacing: "1px" }}>
                            ID: #{order._id.slice(-8)}
                          </div>
                          <div className="order-date">
                            <i className="ti ti-calendar" style={{ fontSize: 13, marginRight: 5, verticalAlign: -1 }} aria-hidden="true" />
                            {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                          </div>
                        </div>
                        <div
                          className="order-status-badge"
                          style={{
                            color: statusColor[order.status] || "#4B5694",
                            borderColor: (statusColor[order.status] || "#4B5694") + "55",
                            background: (statusColor[order.status] || "#4B5694") + "11",
                          }}
                        >
                          {order.status}
                        </div>
                      </div>

                      {order.items?.map((item, i) => (
                        <div className="order-item-row" key={i}>
                          <div>
                            <div className="order-item-name">{item.name}</div>
                            <div className="order-item-sub">Size: {item.size || "100ml"} × {item.qty}</div>
                          </div>
                          <div className="order-item-price">
                            Rs. {item.price.toLocaleString()}
                          </div>
                        </div>
                      ))}

                      <div className="order-total-row">
                        <div>
                          <div style={{ fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(17,24,68,0.45)", marginBottom: 3 }}>
                            {order.shippingMethod || "Standard Delivery"}
                          </div>
                          <div style={{ fontSize: "1rem", fontWeight: 600, color: "#111844" }}>
                            Total Paid
                          </div>
                        </div>
                        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", color: "#4B5694", fontWeight: 400 }}>
                          Rs. {order.total.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* ══ SAVED ADDRESSES ══════════════════════ */}
            {/* {activeSection === "addresses" && (
              <div className="section-card">
                <p className="section-eyebrow">Delivery Details</p>
                <h2 className="section-title">
                  Saved <span>Addresses</span>
                </h2>

                {!editingAddress ? (
                  <>
                    <div className="address-card">
                      <button className="edit-btn" onClick={() => setEditingAddress(true)}>
                        <i className="ti ti-edit" style={{ marginRight: 4 }} />
                        Edit
                      </button>
                      <div className="address-label-tag">Default — Home</div>
                      <div className="address-text">
                        {profileData?.name}<br />
                        {address.street}<br />
                        {address.city}, {address.postal}<br />
                        {address.country}
                      </div>
                    </div>
                  </>
                ) : (
                  <form className="address-form" onSubmit={handleAddressSubmit}>
                    <div className="form-field">
                      <label>Street Address</label>
                      <input
                        value={address.street}
                        onChange={(e) => setAddress({ ...address, street: e.target.value })}
                        placeholder="Street address"
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-field">
                        <label>City</label>
                        <input
                          value={address.city}
                          onChange={(e) => setAddress({ ...address, city: e.target.value })}
                          placeholder="City"
                        />
                      </div>
                      <div className="form-field">
                        <label>Postal Code</label>
                        <input
                          value={address.postal}
                          onChange={(e) => setAddress({ ...address, postal: e.target.value })}
                          placeholder="Postal code"
                        />
                      </div>
                    </div>
                    <div className="form-field">
                      <label>Country</label>
                      <input
                        value={address.country}
                        onChange={(e) => setAddress({ ...address, country: e.target.value })}
                        placeholder="Country"
                      />
                    </div>
                    <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                      <button type="submit" className="save-btn">
                        Save Address
                      </button>
                      <button type="button" className="cancel-btn" onClick={() => setEditingAddress(false)}>
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )} */}

            {/* ══ SAVED ADDRESSES ══════════════════════ */}
            {activeSection === "addresses" && (
              <div className="section-card">
                <p className="section-eyebrow">Delivery Details</p>
                <h2 className="section-title">
                  Saved <span>Addresses</span>
                </h2>

                {ordersLoading ? (
                  <p style={{ color: "#111844", letterSpacing: "0.1em" }}>Retrieving address logs...</p>
                ) : orders.length === 0 ? (
                  /* Fallback if user hasn't placed an order yet */
                  <div className="no-orders-msg">
                    <i className="ti ti-map-pin-off" style={{ fontSize: "2rem", display: "block", marginBottom: "1rem" }} />
                    No saved addresses found. Your delivery address will be registered here once you place your first order!
                  </div>
                ) : !editingAddress ? (
                  /* Displaying address from the most recent order */
                  <>
                    <div className="address-card">
                      <button 
                        className="edit-btn" 
                        onClick={() => {
                          // Populate form fields with the latest order's address details before opening edit mode
                          const latestOrderAddress = orders[0].shippingAddress || { street: "", city: "", postal: "", country: "" };
                          setAddress({
                            street: latestOrderAddress.street || "",
                            city: latestOrderAddress.city || "",
                            postal: latestOrderAddress.postal || "",
                            country: latestOrderAddress.country || "",
                          });
                          setEditingAddress(true);
                        }}
                      >
                        <i className="ti ti-edit" style={{ marginRight: 4 }} />
                        Edit Order Address
                      </button>
                      <div className="address-label-tag">Shipping Address — Last Order</div>
                      <div className="address-text">
                        <strong>{profileData?.name}</strong><br />
                        {orders[0].shippingAddress?.street || "No street provided"}<br />
                        {orders[0].shippingAddress?.city || "Lahore"}, {orders[0].shippingAddress?.postal || "54000"}<br />
                        {orders[0].shippingAddress?.country || "Pakistan"}
                      </div>
                      <p style={{ fontSize: "0.72rem", color: "rgba(17,24,68,0.5)", marginTop: "1rem", fontStyle: "italic" }}>
                        * This address is tied to your latest order (ID: #{orders[0]._id.slice(-8)}). Editing it will update the shipping destination for this order.
                      </p>
                    </div>
                  </>
                ) : (
                  /* Form to edit the latest order's address */
                  <form 
                    className="address-form" 
                    onSubmit={async (e) => {
                      e.preventDefault();
                      try {
                        const token = localStorage.getItem("token");
                        const latestOrderId = orders[0]._id; // Capture the target order ID

                        const response = await fetch(`http://localhost:5000/api/orders/${latestOrderId}/address`, {
                          method: "PUT",
                          headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`,
                          },
                          body: JSON.stringify({ shippingAddress: address }),
                        });

                        if (!response.ok) throw new Error("Could not update order address.");

                        const updatedOrder = await response.json();

                        // Dynamic Update: instantly refresh local state so UI updates without page reload
                        setOrders(prevOrders => 
                          prevOrders.map(o => o._id === latestOrderId ? { ...o, shippingAddress: updatedOrder.order.shippingAddress } : o)
                        );

                        setEditingAddress(false);
                        handleSave("Order delivery address updated in database!");
                      } catch (err) {
                        handleSave("Error updating order destination.");
                      }
                    }}
                  >
                    <div className="form-field">
                      <label>Street Address</label>
                      <input
                        value={address.street}
                        onChange={(e) => setAddress({ ...address, street: e.target.value })}
                        placeholder="Street address"
                        required
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-field">
                        <label>City</label>
                        <input
                          value={address.city}
                          onChange={(e) => setAddress({ ...address, city: e.target.value })}
                          placeholder="City"
                          required
                        />
                      </div>
                      <div className="form-field">
                        <label>Postal Code</label>
                        <input
                          value={address.postal}
                          onChange={(e) => setAddress({ ...address, postal: e.target.value })}
                          placeholder="Postal code"
                          required
                        />
                      </div>
                    </div>
                    <div className="form-field">
                      <label>Country</label>
                      <input
                        value={address.country}
                        onChange={(e) => setAddress({ ...address, country: e.target.value })}
                        placeholder="Country"
                        required
                      />
                    </div>
                    <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                      <button type="submit" className="save-btn">
                        Update Order Address
                      </button>
                      <button type="button" className="cancel-btn" onClick={() => setEditingAddress(false)}>
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* ══ PREFERENCES ══════════════════════════ */}
            {activeSection === "preferences" && (
              <div className="section-card">
                <p className="section-eyebrow">Communication &amp; Experience</p>
                <h2 className="section-title">
                  My <span>Preferences</span>
                </h2>

                {[
                  { key: "newsletter", title: "Eloura Newsletter", desc: "Curated fragrance stories, house updates, and exclusive member content delivered monthly." },
                  { key: "orderAlerts", title: "Order Notifications", desc: "Real-time updates when your order is confirmed, shipped, and delivered." },
                  { key: "newArrivals", title: "New Arrivals", desc: "Be the first to discover new fragrances and limited-edition drops." },
                  { key: "smsUpdates", title: "SMS Updates", desc: "Delivery alerts and flash sale notifications sent directly to your phone." },
                ].map((pref) => (
                  <div className="pref-row" key={pref.key}>
                    <div className="pref-info">
                      <h4>{pref.title}</h4>
                      <p>{pref.desc}</p>
                    </div>
                    <label className="toggle-wrap">
                      <input
                        type="checkbox"
                        checked={preferences[pref.key as keyof typeof preferences]}
                        onChange={() => {
                          setPreferences((prev) => ({ ...prev, [pref.key]: !prev[pref.key as keyof typeof preferences] }));
                          handleSave("Preferences updated");
                        }}
                      />
                      <span className="toggle-slider" />
                    </label>
                  </div>
                ))}
              </div>
            )}

            {/* ══ ACCOUNT SETTINGS ═════════════════════ */}
            {activeSection === "settings" && (
              <div className="section-card">
                <p className="section-eyebrow">Security &amp; Privacy</p>
                <h2 className="section-title">
                  Account <span>Settings</span>
                </h2>

                <div className="settings-row">
                  <div className="settings-info">
                    <h4>Full Name</h4>
                    <p>{profileData?.name || "—"} — Update how your name appears on orders and communications.</p>
                  </div>
                  <button className="settings-action" onClick={() => { setSettingsInput({ ...settingsInput, name: profileData?.name || "" }); setActiveModal("name"); }}>
                    Change Name
                  </button>
                </div>

                <div className="settings-row">
                  <div className="settings-info">
                    <h4>Email Address</h4>
                    <p>{profileData?.email || "—"} — Your login email and where we send receipts.</p>
                  </div>
                  <button className="settings-action" onClick={() => { setSettingsInput({ ...settingsInput, email: profileData?.email || "" }); setActiveModal("email"); }}>
                    Change Email
                  </button>
                </div>

                <div className="settings-row">
                  <div className="settings-info">
                    <h4>Password</h4>
                    <p>•••••••••••• — Securely encrypted password key.</p>
                  </div>
                  <button className="settings-action" onClick={() => { setSettingsInput({ ...settingsInput, currentPassword: "", newPassword: "" }); setActiveModal("password"); }}>
                    Change Password
                  </button>
                </div>

                {/* Elegant Settings Modal Overlay */}
                {activeModal && (
                  <div style={{ position: "fixed", inset: 0, background: "rgba(17,24,68,0.4)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
                    <div style={{ background: "#EAE0CF", border: "1px solid rgba(75,86,148,0.2)", borderRadius: "20px", padding: "2rem", width: "100%", maxWidth: "420px", boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}>
                      <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", color: "#111844", marginBottom: "1.5rem", textTransform: "capitalize" }}>Change {activeModal}</h3>
                      
                      <form onSubmit={async (e) => {
                        e.preventDefault();
                        try {
                          const token = localStorage.getItem("token");
                          const response = await fetch("http://localhost:5000/api/user/update-settings", {
                            method: "PUT",
                            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                            body: JSON.stringify(settingsInput)
                          });
                          const result = await response.json();
                          if (result.success) {
                            if (profileData) setProfileData({ ...profileData, name: result.user.name, email: result.user.email });
                            setActiveModal(null);
                            handleSave("Security matrix safely updated");
                          } else {
                            handleSave(result.message || "Error processing security step");
                          }
                        } catch (err) {
                          handleSave("Server synchronization error");
                        }
                      }}>
                        {activeModal === "name" && (
                          <div className="form-field" style={{ marginBottom: "1rem" }}>
                            <label>New Name</label>
                            <input value={settingsInput.name} onChange={(e) => setSettingsInput({ ...settingsInput, name: e.target.value })} required />
                          </div>
                        )}

                        {activeModal === "email" && (
                          <div className="form-field" style={{ marginBottom: "1rem" }}>
                            <label>New Email Address</label>
                            <input type="email" value={settingsInput.email} onChange={(e) => setSettingsInput({ ...settingsInput, email: e.target.value })} required />
                          </div>
                        )}

                        {activeModal === "password" && (
                          <>
                            <div className="form-field" style={{ marginBottom: "1rem" }}>
                              <label>Current Password</label>
                              <input type="password" value={settingsInput.currentPassword} onChange={(e) => setSettingsInput({ ...settingsInput, currentPassword: e.target.value })} required />
                            </div>
                            <div className="form-field" style={{ marginBottom: "1rem" }}>
                              <label>New Secure Password</label>
                              <input type="password" value={settingsInput.newPassword} onChange={(e) => setSettingsInput({ ...settingsInput, newPassword: e.target.value })} required />
                            </div>
                          </>
                        )}

                        <div style={{ display: "flex", gap: "10px", marginTop: "1.5rem" }}>
                          <button type="submit" className="save-btn" style={{ padding: "0.6rem 1.5rem" }}>Confirm</button>
                          <button type="button" className="cancel-btn" style={{ padding: "0.6rem 1.2rem" }} onClick={() => setActiveModal(null)}>Cancel</button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>

      {savedMessage && (
        <div className="toast-msg">
          <i className="ti ti-check" style={{ marginRight: 8 }} />
          {savedMessage}
        </div>
      )}

      <Footer />
    </>
  );
}