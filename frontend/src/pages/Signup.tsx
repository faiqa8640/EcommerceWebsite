import { useState, type JSX } from "react";
import { Link, useNavigate } from "react-router-dom";

type UserData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function Signup(): JSX.Element {
  const [userData, setUserData] = useState<UserData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  //state for the user data

  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
    // this function run whenever user inputs
    //e.target.name -> give the feild and e.target.value gives what user type
    //keep the rest feild same and change only the feild in  which user is typing
  };

  // after user press submit button this button is run
  const handlesubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault(); // stop the reloading
    setError(""); // clear old error
    setLoading(true); // start loading state

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/signup",
        {
          //calling backend api
          method: "POST",
          headers: {
            "Content-Type": "application/json", // sending json
          },
          body: JSON.stringify(userData), // convert the user data into the json
        }
      );

      const data = await response.json(); // get the backend response

      if (!response.ok) {
        // error handle it
        setError(data.message || "Signup failed");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token); // store the token in browswer
      localStorage.setItem("user", JSON.stringify(data.user)); // local storage save string

      alert("Account created successfully!");
      navigate("/");
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
          background: linear-gradient(
            135deg,
            rgba(75, 86, 148, 0.25),
            transparent,
            rgba(114, 136, 174, 0.15)
          );
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

        .form-group {
          margin-bottom: 1.1rem;
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
          border: 1px solid rgba(114, 136, 174, 0.3);
          background: rgba(17, 24, 68, 0.4);
          color: #EAE0CF;
          font-size: 0.9rem;
          outline: none;
          transition: all 0.3s ease;
        }

        input:focus {
          border-color: #7288AE;
          box-shadow: 0 0 0 3px rgba(114, 136, 174, 0.15);
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

        .auth-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(75, 86, 148, 0.4);
        }

        .auth-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .error {
          margin-top: 1rem;
          color: #ff6b6b;
          font-size: 0.8rem;
          text-align: center;
        }

        .switch {
          text-align: center;
          margin-top: 1.5rem;
          font-size: 0.8rem;
          color: #7288AE;
        }

        .switch a {
          color: #EAE0CF;
          text-decoration: none;
          font-weight: 500;
          letter-spacing: 0.1em;
        }

        .switch a:hover {
          color: #7288AE;
        }
      `}</style>

      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-title">Eloura</div>
          <div className="auth-subtitle">Create your account</div>

          <form onSubmit={handlesubmit}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                required
                placeholder="your name"
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
                placeholder="••••••••"
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
              {loading ? "CREATING..." : "CREATE ACCOUNT"}
            </button>

            {error && <div className="error">{error}</div>}
          </form>

          <div className="switch">
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </div>
      </div>
    </>
  );
}