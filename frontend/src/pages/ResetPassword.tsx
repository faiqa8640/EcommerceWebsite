// User sets a new password using the token from the email link

import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    if (password !== confirmPassword) {
      setIsError(true);
      setMessage("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setIsError(true);
      setMessage("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:5000/api/auth/reset-password/${token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password, confirmPassword }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setIsError(true);
        setMessage(data.message || "Reset failed.");
        return;
      }

      setSuccess(true);
      setMessage(data.message);

      // Auto-redirect to login after 2 seconds
      setTimeout(() => navigate("/login"), 2500);
    } catch (err: unknown) {
      setIsError(true);
      setMessage(err instanceof Error ? err.message : "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .rp-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at top, #1b2355 0%, #111844 60%);
          padding: 2rem;
          font-family: 'Jost', sans-serif;
        }

        .rp-card {
          width: 100%;
          max-width: 420px;
          padding: 2.5rem;
          border-radius: 18px;
          background: rgba(234,224,207,0.06);
          backdrop-filter: blur(18px);
          border: 1px solid rgba(114,136,174,0.25);
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
          color: #EAE0CF;
        }

        .rp-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.7rem;
          letter-spacing: 0.1em;
          margin-bottom: 0.5rem;
          text-align: center;
        }

        .rp-subtitle {
          text-align: center;
          color: #7288AE;
          font-size: 0.8rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          margin-bottom: 2rem;
        }

        .form-group { margin-bottom: 1.1rem; }

        label {
          display: block;
          font-size: 0.75rem;
          letter-spacing: 0.2em;
          color: #7288AE;
          margin-bottom: 0.4rem;
          text-transform: uppercase;
        }

        input {
          width: 100%;
          padding: 0.85rem 1rem;
          border-radius: 10px;
          border: 1px solid rgba(114,136,174,0.3);
          background: rgba(17,24,68,0.4);
          color: #EAE0CF;
          font-size: 0.9rem;
          outline: none;
          transition: 0.3s;
          box-sizing: border-box;
        }

        input:focus { border-color: #7288AE; box-shadow: 0 0 0 3px rgba(114,136,174,0.15); }

        .rp-btn {
          width: 100%;
          margin-top: 1rem;
          padding: 0.9rem;
          border: none;
          border-radius: 10px;
          background: linear-gradient(135deg, #4B5694, #7288AE);
          color: #EAE0CF;
          font-size: 0.85rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          cursor: pointer;
          transition: 0.3s;
        }

        .rp-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 25px rgba(75,86,148,0.4); }
        .rp-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .msg { margin-top: 1rem; font-size: 0.85rem; text-align: center; line-height: 1.6; }
        .msg.error { color: #ff6b6b; }
        .msg.success { color: #7de88e; }

        .redirect-note {
          font-size: 0.78rem;
          color: #7288AE;
          text-align: center;
          margin-top: 0.5rem;
        }

        .back-link {
          display: block;
          text-align: center;
          margin-top: 1.5rem;
          font-size: 0.8rem;
          color: #7288AE;
          text-decoration: none;
        }

        .back-link:hover { color: #EAE0CF; }
      `}</style>

      <div className="rp-page">
        <div className="rp-card">
          <div className="rp-title">Reset Password</div>
          <div className="rp-subtitle">Choose a new password</div>

          {!success ? (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  required
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <button className="rp-btn" type="submit" disabled={loading}>
                {loading ? "RESETTING..." : "RESET PASSWORD"}
              </button>

              {isError && <div className="msg error">{message}</div>}
            </form>
          ) : (
            <>
              <div className="msg success">✅ {message}</div>
              <p className="redirect-note">Redirecting you to login...</p>
            </>
          )}

          <Link to="/login" className="back-link">
            ← Back to Login
          </Link>
        </div>
      </div>
    </>
  );
}
