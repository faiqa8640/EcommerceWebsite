// User enters email → backend sends reset link via Nodemailer

import { useState } from "react";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(
        "http://localhost:5000/api/auth/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();
      setMessage(data.message);
      setSubmitted(true);
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .fp-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at top, #1b2355 0%, #111844 60%);
          padding: 2rem;
          font-family: 'Jost', sans-serif;
        }

        .fp-card {
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

        .fp-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.7rem;
          letter-spacing: 0.1em;
          margin-bottom: 0.5rem;
          text-align: center;
        }

        .fp-subtitle {
          text-align: center;
          color: #7288AE;
          font-size: 0.8rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          margin-bottom: 2rem;
        }

        .fp-desc {
          color: rgba(234,224,207,0.8);
          font-size: 0.9rem;
          line-height: 1.7;
          text-align: center;
          margin-bottom: 1.5rem;
        }

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
          margin-bottom: 1rem;
        }

        input:focus { border-color: #7288AE; box-shadow: 0 0 0 3px rgba(114,136,174,0.15); }

        .fp-btn {
          width: 100%;
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

        .fp-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 25px rgba(75,86,148,0.4); }
        .fp-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .success-msg {
          margin-top: 1rem;
          padding: 1rem;
          border-radius: 10px;
          background: rgba(125,232,142,0.1);
          border: 1px solid rgba(125,232,142,0.25);
          color: #7de88e;
          font-size: 0.85rem;
          text-align: center;
          line-height: 1.6;
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

      <div className="fp-page">
        <div className="fp-card">
          <div className="fp-title">Forgot Password?</div>
          <div className="fp-subtitle">Eloura Account Recovery</div>

          {!submitted ? (
            <>
              <p className="fp-desc">
                No worries. Enter your email and we'll send you a reset link.
              </p>

              <form onSubmit={handleSubmit}>
                <label>Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <button className="fp-btn" type="submit" disabled={loading}>
                  {loading ? "SENDING..." : "SEND RESET LINK"}
                </button>
              </form>
            </>
          ) : (
            <div className="success-msg">
              ✉️ {message}
            </div>
          )}

          <Link to="/login" className="back-link">
            ← Back to Login
          </Link>
        </div>
      </div>
    </>
  );
}
