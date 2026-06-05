// Login form — uses AuthContext to store auth state globally

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";// link is used for navigation without page reload

import { useAuth } from "../context/AuthContext";

type UserData = {
  email: string;
  password: string;
};

export default function Login() {
  const [userData, setUserData] = useState<UserData>({ email: "", password: "" });//state for the user data
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [notVerified, setNotVerified] = useState<boolean>(false); // show resend option

  const { login } = useAuth(); // get login function from context
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
    setNotVerified(false); // reset on new input
    // this function run whenever user inputs
    //e.target.name -> give the feild and e.target.value gives what user type
    //keep the rest feild same and change only the feild in  which user is typing
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();// stop the reloading -> usually forms reload the page so it stop it
    setError("");
    setNotVerified(false);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Special case: unverified account
        if (data.notVerified) {
          setNotVerified(true);
        }
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }

      // Save to context (and localStorage inside context)
      login(data.token, data.user);
      navigate("/"); // redirect to homepage
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at top, #1b2355 0%, #111844 60%);
          padding: 2rem;
          font-family: 'Jost', sans-serif;
        }

        .login-card {
          width: 100%;
          max-width: 420px;
          padding: 2.5rem;
          border-radius: 18px;
          background: rgba(234,224,207,0.06);
          backdrop-filter: blur(18px);
          border: 1px solid rgba(114,136,174,0.25);
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
          position: relative;
          overflow: hidden;
        }

        .login-card::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(75,86,148,0.25), transparent, rgba(114,136,174,0.15));
          pointer-events: none;
        }

        .login-title {
          font-size: 1.8rem;
          font-weight: 300;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #EAE0CF;
          text-align: center;
          margin-bottom: 0.3rem;
          font-family: 'Cormorant Garamond', serif;
        }

        .login-subtitle {
          text-align: center;
          color: #7288AE;
          font-size: 0.8rem;
          letter-spacing: 0.2em;
          margin-bottom: 2rem;
          text-transform: uppercase;
        }

        .form-group { margin-bottom: 1.2rem; }

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

        .forgot-link {
          display: block;
          text-align: right;
          font-size: 0.75rem;
          color: #7288AE;
          text-decoration: none;
          margin-top: 0.3rem;
          letter-spacing: 0.05em;
        }

        .forgot-link:hover { color: #EAE0CF; }

        .login-btn {
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

        .login-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 25px rgba(75,86,148,0.4); }
        .login-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .error { margin-top: 1rem; color: #ff6b6b; font-size: 0.8rem; text-align: center; }

        .not-verified-box {
          margin-top: 1rem;
          padding: 0.8rem 1rem;
          border-radius: 10px;
          background: rgba(114,136,174,0.15);
          border: 1px solid rgba(114,136,174,0.3);
          font-size: 0.8rem;
          color: #EAE0CF;
          text-align: center;
          line-height: 1.6;
        }

        .not-verified-box a { color: #7288AE; text-decoration: underline; cursor: pointer; }

        .signup {
          text-align: center;
          margin-top: 1.5rem;
          font-size: 0.8rem;
          color: #7288AE;
        }

        .signup a { color: #EAE0CF; text-decoration: none; font-weight: 500; }
        .signup a:hover { color: #7288AE; }
      `}</style>

      <div className="login-page">
        <div className="login-card">
          <div className="login-title">Eloura</div>
          <div className="login-subtitle">THE FRAGRANCE HOUSE</div>

          <form onSubmit={handleSubmit}>
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
                placeholder="••••••••"
                value={userData.password}
                onChange={handleChange}
              />
              <Link to="/forgot-password" className="forgot-link">
                Forgot password?
              </Link>
            </div>

            <button className="login-btn" type="submit" disabled={loading}>
              {loading ? "SIGNING IN..." : "LOGIN"}
            </button>

            {error && !notVerified && <div className="error">{error}</div>}

            {/* Email not verified — offer resend link */}
            {notVerified && (
              <div className="not-verified-box">
                Your email is not verified yet. Please check your inbox, or{" "}
                <Link to="/resend-verification">resend the verification email</Link>.
              </div>
            )}
          </form>

          <div className="signup">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </div>
        </div>
      </div>
    </>
  );
}
