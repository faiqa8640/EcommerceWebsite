// import { useEffect, useState } from "react";
// import { useAuth } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";

// type Stats = {
//   message: string;
// };

// export default function AdminDashboard() {
//   const { user, token, logout } = useAuth();
//   const navigate = useNavigate(); // used to redirect user properly
//   const [stats, setStats] = useState<Stats | null>(null); // stores the admin data from backend
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchAdminData = async () => { //api function
//       try {
//         const res = await fetch( // send request to the backend->admin api
//           "http://localhost:5000/api/user/admin-only",
//           {
//             headers: {
//               Authorization: `Bearer ${token}`, // sending the json token to backend
//             },
//           }
//         );

//         const data = await res.json();

//         if (res.status === 401) {
//           logout("expired");
//           return;
//         }

//         if (res.status === 403) { // user is login not admin
//           navigate("/", { replace: true });
//           return;
//         }

//         if (!res.ok) {
//           setError(data.message || "Failed to load admin data.");
//           return;
//         }

//         setStats(data); // store admin data
//       } catch {
//         setError("Could not connect to server.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (token) fetchAdminData(); // if user is login then call tha api
//   }, [token, logout, navigate]);

//   return (
//     <>
//       <style>{`
//         .admin-page {
//           min-height: 100vh;
//           background: #EAE0CF;
//           padding: 2rem;
//           color: #111844;
//           font-family: "Jost", sans-serif;
//         }

//         .container {
//           max-width: 1100px;
//           margin: auto;
//         }

//         /* TOP WELCOME BOX (SMALLER NOW) */
//         .welcome-box {
//           background: rgba(17,24,68,0.05);
//           border: 1px solid rgba(75,86,148,0.2);
//           padding: 1.5rem 2rem;
//           border-radius: 14px;
//           margin-bottom: 2rem;
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//         }

//         .welcome-box h2 {
//           font-size: 1.3rem;
//           font-weight: 500;
//           margin-bottom: 0.2rem;
//           font-family: "Cormorant Garamond", serif;
//         }

//         .welcome-box p {
//           font-size: 0.85rem;
//           color: #4B5694;
//         }

//         .badge {
//           background: rgba(17,24,68,0.08);
//           padding: 0.4rem 1rem;
//           border-radius: 999px;
//           font-size: 0.7rem;
//           letter-spacing: 0.15em;
//           text-transform: uppercase;
//           color: #111844;
//         }

//         /* MAIN LAYOUT */
//         .layout {
//           display: grid;
//           grid-template-columns: 260px 1fr;
//           gap: 2rem;
//         }

//         /* LEFT MENU */
//         .sidebar {
//           background: rgba(17,24,68,0.04);
//           border: 1px solid rgba(75,86,148,0.2);
//           border-radius: 16px;
//           padding: 1.2rem;
//           display: flex;
//           flex-direction: column;
//           gap: 0.8rem;
//           height: fit-content;
//         }

//         .menu-btn {
//           padding: 0.9rem 1rem;
//           border-radius: 12px;
//           border: 1px solid rgba(75,86,148,0.25);
//           background: transparent;
//           color: #111844;
//           text-align: left;
//           font-size: 0.8rem;
//           letter-spacing: 0.1em;
//           text-transform: uppercase;
//           cursor: pointer;
//           transition: 0.3s;
//         }

//         .menu-btn:hover {
//           background: rgba(75,86,148,0.12);
//           transform: translateX(4px);
//         }

//         .logout {
//           border-color: rgba(255,107,107,0.3);
//           color: #c0392b;
//         }

//         .logout:hover {
//           background: rgba(255,107,107,0.1);
//         }

//         /* RIGHT CONTENT */
//         .content {
//           background: rgba(17,24,68,0.03);
//           border: 1px solid rgba(75,86,148,0.2);
//           border-radius: 16px;
//           padding: 1.5rem;
//         }

//         .section-title {
//           font-size: 1.1rem;
//           margin-bottom: 1rem;
//           font-family: "Cormorant Garamond", serif;
//         }

//         /* STATES */
//         .loading {
//           text-align: center;
//           padding: 3rem;
//           color: #4B5694;
//         }

//         .error {
//           background: rgba(255,0,0,0.08);
//           padding: 1rem;
//           border-radius: 10px;
//           color: #c0392b;
//         }

//         /* RESPONSIVE */
//         @media (max-width: 768px) {
//           .layout {
//             grid-template-columns: 1fr;
//           }

//           .sidebar {
//             flex-direction: row;
//             overflow-x: auto;
//           }

//           .menu-btn {
//             white-space: nowrap;
//           }
//         }
//       `}</style>

//       <div className="admin-page">
//         <div className="container">

//           {loading ? (
//             <div className="loading">Loading dashboard...</div>
//           ) : error ? (
//             <div className="error">⚠ {error}</div>
//           ) : (
//             <>
//               {/* WELCOME */}
//               <div className="welcome-box">
//                 <div>
//                   <h2>Welcome back, {user?.name}</h2>
//                   <p>{user?.email}</p>
//                 </div>

//                 <div className="badge">
//                   Admin Panel
//                 </div>
//               </div>

//               {/* LAYOUT */}
//               <div className="layout">

//                 {/* LEFT MENU */}
//                 <div className="sidebar">
//                   <button className="menu-btn">
//                     Manage Users
//                   </button>

//                   <button className="menu-btn">
//                     View Orders
//                   </button>

//                   <button className="menu-btn">
//                     Manage Products
//                   </button>

//                   <button className="menu-btn">
//                     Analytics
//                   </button>

//                   <button
//                     className="menu-btn logout"
//                     onClick={() => logout("manual")}
//                   >
//                     Logout
//                   </button>
//                 </div>

//                 {/* RIGHT CONTENT */}
//                 <div className="content">
//                   <h3 className="section-title">
//                     Dashboard Overview
//                   </h3>

//                   <p style={{ color: "#4B5694", fontSize: "0.9rem" }}>
//                     Select an option from the left menu to manage your store.
//                   </p>
//                 </div>

//               </div>
//             </>
//           )}

//         </div>
//       </div>
//     </>
//   );
// }



// src/pages/AdminDashboard.tsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");

  const stats = {
    revenue: 3368,
    orders: 4,
    products: 5,
    categories: 5,
  };

  const recentOrders = [
    { id: "#0854F3A0", customer: "Sadia Mustafa", amount: 600, status: "Delivered", date: "Apr 10, 2026" },
    { id: "#0854F394", customer: "Faiqa Mustafa", amount: 600, status: "Pending", date: "Apr 10, 2026" },
    { id: "#0C011FF5", customer: "Faiqa Mustafa", amount: 1250, status: "Processing", date: "Apr 1, 2026" },
    { id: "#CF012C29", customer: "Zain Arshad", amount: 918, status: "Cancelled", date: "Feb 22, 2026" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <style>{`
        :root {
          --navy: #111844;
          --accent: #4B5694;
          --cream: #EAE0CF;
          --light: #F8F4EB;
          --muted: #7288AE;
        }

        .admin-page {
          background: var(--cream);
          min-height: 100vh;
          display: flex;
          font-family: 'Jost', system-ui, sans-serif;
        }

        /* Sidebar */
        .sidebar {
          width: 260px;
          background: var(--navy);
          color: white;
          padding: 2rem 1rem;
          position: fixed;
          height: 100vh;
          border-right: 1px solid rgba(255,255,255,0.1);
        }

        .logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.2rem;
          letter-spacing: 0.25em;
          margin-bottom: 3rem;
          color: white;
        }

        .nav-link {
          padding: 0.85rem 1.2rem;
          border-radius: 10px;
          color: rgba(234,224,207,0.9);
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 6px;
          transition: all 0.3s;
        }

        .nav-link.active,
        .nav-link:hover {
          background: rgba(234,224,207,0.15);
          color: white;
        }

        /* Sign Out Button - Matches Screenshot */
        .signout-btn {
          margin-top: auto;
          padding: 0.85rem 1.2rem;
          background: white;
          color: var(--navy);
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.3s;
        }

        .signout-btn:hover {
          background: #f0e9db;
        }

        /* Main Content */
        .main-content {
          margin-left: 260px;
          flex: 1;
          padding: 2rem;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .stat-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .stat-card {
          background: white;
          padding: 1.6rem 1.8rem;
          border-radius: 12px;
          box-shadow: 0 8px 25px rgba(17,24,68,0.08);
          border: 1px solid #f0e9db;
        }

        .stat-label {
          font-size: 0.75rem;
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: 0.12em;
        }

        .stat-value {
          font-size: 2.1rem;
          font-weight: 600;
          color: var(--navy);
          margin-top: 0.4rem;
        }

        .orders-table {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 8px 25px rgba(17,24,68,0.08);
        }

        table { width: 100%; border-collapse: collapse; }
        th {
          text-align: left;
          padding: 1.1rem 1rem;
          background: var(--light);
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--accent);
        }
        td { padding: 1.1rem 1rem; border-top: 1px solid #f0e9db; }

        .status {
          padding: 4px 14px;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 500;
        }
        .Delivered { background: #d1fae5; color: #065f46; }
        .Pending { background: #fef3c7; color: #92400e; }
        .Processing { background: #dbeafe; color: #1e40af; }
        .Cancelled { background: #fee2e2; color: #b91c1c; }
      `}</style>

      <div className="admin-page">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="logo">ELOURA</div>

          <nav>
            <a href="#" className={`nav-link ${activeTab === "dashboard" ? "active" : ""}`} onClick={() => setActiveTab("dashboard")}>
              📊 Dashboard
            </a>
            <a href="#" className={`nav-link ${activeTab === "products" ? "active" : ""}`} onClick={() => setActiveTab("products")}>
              📦 Products
            </a>
            <a href="#" className={`nav-link ${activeTab === "categories" ? "active" : ""}`} onClick={() => setActiveTab("categories")}>
              🗂️ Categories
            </a>
            <a href="#" className={`nav-link ${activeTab === "orders" ? "active" : ""}`} onClick={() => setActiveTab("orders")}>
              🛒 Orders
            </a>
          </nav>

          <button className="signout-btn" onClick={handleLogout}>
            Sign Out
          </button>
        </div>

        {/* Main Content */}
        <div className="main-content">
          <div className="header">
            <h1 style={{ fontSize: "2.1rem", fontWeight: 400, color: "#111844" }}>
              {activeTab === "dashboard" && "Dashboard"}
              {activeTab === "products" && "Products"}
              {activeTab === "categories" && "Categories"}
              {activeTab === "orders" && "Orders"}
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontWeight: 500 }}>{user?.name}</span>
              <span style={{ background: "#4B5694", color: "white", padding: "4px 12px", borderRadius: "999px", fontSize: "0.78rem" }}>
                Administrator
              </span>
            </div>
          </div>

          {/* Dashboard */}
          {activeTab === "dashboard" && (
            <>
              <div className="stat-grid">
                <div className="stat-card">
                  <div className="stat-label">TOTAL REVENUE</div>
                  <div className="stat-value">Rs. {stats.revenue.toLocaleString()}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">TOTAL ORDERS</div>
                  <div className="stat-value">{stats.orders}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">TOTAL PRODUCTS</div>
                  <div className="stat-value">{stats.products}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">TOTAL CATEGORIES</div>
                  <div className="stat-value">{stats.categories}</div>
                </div>
              </div>

              <div className="orders-table">
                <h3 style={{ padding: "1.5rem 1.5rem 1rem", margin: 0, fontSize: "1.5rem", color: "#111844" }}>
                  Recent Orders
                </h3>
                <table>
                  <thead>
                    <tr>
                      <th>ORDER ID</th>
                      <th>CUSTOMER</th>
                      <th>AMOUNT</th>
                      <th>STATUS</th>
                      <th>DATE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id}>
                        <td><strong>{order.id}</strong></td>
                        <td>{order.customer}</td>
                        <td>Rs. {order.amount}</td>
                        <td><span className={`status ${order.status}`}>{order.status}</span></td>
                        <td>{order.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Other Tabs */}
          {(activeTab === "products" || activeTab === "categories" || activeTab === "orders") && (
            <div style={{ background: "white", padding: "3rem", borderRadius: "16px", boxShadow: "0 10px 30px rgba(17,24,68,0.08)", textAlign: "center" }}>
              <h3 style={{ color: "#111844", marginBottom: "1rem" }}>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h3>
              <p style={{ color: "#7288AE" }}>Management panel coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}