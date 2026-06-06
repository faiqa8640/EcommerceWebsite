import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

type Stats = {
  message: string;
};

export default function AdminDashboard() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/user/admin-only",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (res.status === 401) {
          logout("expired");
          return;
        }

        if (res.status === 403) {
          navigate("/", { replace: true });
          return;
        }

        if (!res.ok) {
          setError(data.message || "Failed to load admin data.");
          return;
        }

        setStats(data);
      } catch {
        setError("Could not connect to server.");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchAdminData();
  }, [token, logout, navigate]);

  return (
    <>
      <style>{`
        .admin-page {
          min-height: 100vh;
          background: #EAE0CF;
          padding: 2rem;
          color: #111844;
          font-family: "Jost", sans-serif;
        }

        .container {
          max-width: 1100px;
          margin: auto;
        }

        /* TOP WELCOME BOX (SMALLER NOW) */
        .welcome-box {
          background: rgba(17,24,68,0.05);
          border: 1px solid rgba(75,86,148,0.2);
          padding: 1.5rem 2rem;
          border-radius: 14px;
          margin-bottom: 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .welcome-box h2 {
          font-size: 1.3rem;
          font-weight: 500;
          margin-bottom: 0.2rem;
          font-family: "Cormorant Garamond", serif;
        }

        .welcome-box p {
          font-size: 0.85rem;
          color: #4B5694;
        }

        .badge {
          background: rgba(17,24,68,0.08);
          padding: 0.4rem 1rem;
          border-radius: 999px;
          font-size: 0.7rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #111844;
        }

        /* MAIN LAYOUT */
        .layout {
          display: grid;
          grid-template-columns: 260px 1fr;
          gap: 2rem;
        }

        /* LEFT MENU */
        .sidebar {
          background: rgba(17,24,68,0.04);
          border: 1px solid rgba(75,86,148,0.2);
          border-radius: 16px;
          padding: 1.2rem;
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          height: fit-content;
        }

        .menu-btn {
          padding: 0.9rem 1rem;
          border-radius: 12px;
          border: 1px solid rgba(75,86,148,0.25);
          background: transparent;
          color: #111844;
          text-align: left;
          font-size: 0.8rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: 0.3s;
        }

        .menu-btn:hover {
          background: rgba(75,86,148,0.12);
          transform: translateX(4px);
        }

        .logout {
          border-color: rgba(255,107,107,0.3);
          color: #c0392b;
        }

        .logout:hover {
          background: rgba(255,107,107,0.1);
        }

        /* RIGHT CONTENT */
        .content {
          background: rgba(17,24,68,0.03);
          border: 1px solid rgba(75,86,148,0.2);
          border-radius: 16px;
          padding: 1.5rem;
        }

        .section-title {
          font-size: 1.1rem;
          margin-bottom: 1rem;
          font-family: "Cormorant Garamond", serif;
        }

        /* STATES */
        .loading {
          text-align: center;
          padding: 3rem;
          color: #4B5694;
        }

        .error {
          background: rgba(255,0,0,0.08);
          padding: 1rem;
          border-radius: 10px;
          color: #c0392b;
        }

        /* RESPONSIVE */
        @media (max-width: 768px) {
          .layout {
            grid-template-columns: 1fr;
          }

          .sidebar {
            flex-direction: row;
            overflow-x: auto;
          }

          .menu-btn {
            white-space: nowrap;
          }
        }
      `}</style>

      <div className="admin-page">
        <div className="container">

          {loading ? (
            <div className="loading">Loading dashboard...</div>
          ) : error ? (
            <div className="error">⚠ {error}</div>
          ) : (
            <>
              {/* WELCOME */}
              <div className="welcome-box">
                <div>
                  <h2>Welcome back, {user?.name}</h2>
                  <p>{user?.email}</p>
                </div>

                <div className="badge">
                  Admin Panel
                </div>
              </div>

              {/* LAYOUT */}
              <div className="layout">

                {/* LEFT MENU */}
                <div className="sidebar">
                  <button className="menu-btn">
                    Manage Users
                  </button>

                  <button className="menu-btn">
                    View Orders
                  </button>

                  <button className="menu-btn">
                    Manage Products
                  </button>

                  <button className="menu-btn">
                    Analytics
                  </button>

                  <button
                    className="menu-btn logout"
                    onClick={() => logout("manual")}
                  >
                    Logout
                  </button>
                </div>

                {/* RIGHT CONTENT */}
                <div className="content">
                  <h3 className="section-title">
                    Dashboard Overview
                  </h3>

                  <p style={{ color: "#4B5694", fontSize: "0.9rem" }}>
                    Select an option from the left menu to manage your store.
                  </p>
                </div>

              </div>
            </>
          )}

        </div>
      </div>
    </>
  );
}