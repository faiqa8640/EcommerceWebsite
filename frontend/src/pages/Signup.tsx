// Registration form — creates account and shows "check your email" message

import { useState } from "react";
import { Link } from "react-router-dom";

type UserData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function Signup() {
  const [userData, setUserData] = useState<UserData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false); // show success state

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
     // this function run whenever user inputs
    //e.target.name -> give the feild and e.target.value gives what user type
    //keep the rest feild same and change only the feild in  which user is typing
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Signup failed");
        setLoading(false);
        return;
      }

      // Show success message (don't navigate — user must verify email first)
      setSuccess(true);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An error occurred";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at top, #1b2355 0%, #111844 60%);
          padding: 2rem;
          font-family: 'Jost', sans-serif;
        }

        .auth-card {
          width: 100%;
          max-width: 440px;
          padding: 2.5rem;
          border-radius: 18px;
          background: rgba(234, 224, 207, 0.06);
          backdrop-filter: blur(18px);
          border: 1px solid rgba(114, 136, 174, 0.25);
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
          position: relative;
          overflow: hidden;
        }

        .auth-card::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(75,86,148,0.25), transparent, rgba(114,136,174,0.15));
          pointer-events: none;
        }

        .auth-title {
          font-size: 1.8rem;
          font-weight: 300;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #EAE0CF;
          text-align: center;
          font-family: 'Cormorant Garamond', serif;
          margin-bottom: 0.3rem;
        }

        .auth-subtitle {
          text-align: center;
          color: #7288AE;
          font-size: 0.8rem;
          letter-spacing: 0.2em;
          margin-bottom: 2rem;
          text-transform: uppercase;
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
          transition: all 0.3s ease;
          box-sizing: border-box;
        }

        input:focus {
          border-color: #7288AE;
          box-shadow: 0 0 0 3px rgba(114,136,174,0.15);
        }

        .auth-btn {
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
          transition: all 0.3s ease;
        }

        .auth-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 25px rgba(75,86,148,0.4); }
        .auth-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .error { margin-top: 1rem; color: #ff6b6b; font-size: 0.8rem; text-align: center; }

        .switch {
          text-align: center;
          margin-top: 1.5rem;
          font-size: 0.8rem;
          color: #7288AE;
        }

        .switch a { color: #EAE0CF; text-decoration: none; font-weight: 500; }
        .switch a:hover { color: #7288AE; }

        /* Success state */
        .success-box {
          text-align: center;
          padding: 1rem 0;
        }

        .success-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .success-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.5rem;
          color: #EAE0CF;
          margin-bottom: 1rem;
          letter-spacing: 0.1em;
        }

        .success-text {
          color: rgba(234,224,207,0.8);
          font-size: 0.9rem;
          line-height: 1.7;
          margin-bottom: 1.5rem;
        }

        .success-note {
          font-size: 0.78rem;
          color: #7288AE;
          line-height: 1.6;
        }
      `}</style>

      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-title">Eloura</div>

          {success ? (
            // ── Success: show "check your email" message ──
            <div className="success-box">
              <div className="success-icon">✉️</div>
              <div className="success-title">Check Your Email</div>
              <p className="success-text">
                We've sent a verification link to <strong>{userData.email}</strong>.
                Please open it to activate your account.
              </p>
              <p className="success-note">
                Didn't receive it? Check your spam folder, or{" "}
                <Link to="/resend-verification" style={{ color: "#7288AE" }}>
                  resend the link
                </Link>
                .
              </p>
              <div className="switch" style={{ marginTop: "1.5rem" }}>
                Already verified? <Link to="/login">Log In</Link>
              </div>
            </div>
          ) : (
            // ── Registration Form ──
            <>
              <div className="auth-subtitle">Create your account</div>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Your full name"
                    value={userData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="you@email.com"
                    value={userData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    required
                    placeholder="Min 6 characters"
                    value={userData.password}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    placeholder="••••••••"
                    value={userData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>

                <button className="auth-btn" type="submit" disabled={loading}>
                  {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
                </button>

                {error && <div className="error">{error}</div>}
              </form>

              <div className="switch">
                Already have an account? <Link to="/login">Log In</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
