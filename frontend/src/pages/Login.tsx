import { useState, type JSX } from "react";
import { Link, useNavigate } from "react-router-dom";
// link is used for navigation without page reload
// usenavigation

type UserData = {
  email: string;
  password: string;
};

export default function Login(): JSX.Element {
  const [userData, setUserData] = useState<UserData>({
    email: "",
    password: "",
  });
  //state for the user data

  const [error, setError] = useState<string>(""); // for error -> send the error to frontend
  const [loading, setLoading] = useState<boolean>(false); // as the user start login then true if not then false

  const navigate = useNavigate(); // use to redirect user to certain route

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
    // this function run whenever user inputs
    //e.target.name -> give the feild and e.target.value gives what user type
    //keep the rest feild same and change only the feild in  which user is typing
  };

  // after user press submit button this function runs
  const handlesubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault(); // stop the reloading -> usually forms reload the page so it stop it
    setError(""); // clear old error
    setLoading(true); // start loading state

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/signin",
        {
          //calling backend api / send request to the backend api
          method: "POST", // user is sending data to backend therefor using the post
          headers: {
            "Content-Type": "application/json", //  informing that sending json
          },
          body: JSON.stringify(userData), // convert the user data  from json to string as the http request detail with strings
        }
      );

      const data = await response.json(); // covert the json back into java script object

      if (!response.ok) {
        // error handle it
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token); // store the token in browswer so that it could be used for the future
      localStorage.setItem("user", JSON.stringify(data.user)); // local storage save string

      alert("Login successful!");
      navigate("/"); // after login moving the user to the homepage
    } catch (err: unknown) {
      // catch error
      const message =
        err instanceof Error ? err.message : "An error occurred";
      setError(message);
    } finally {
      // after login seting the loading again false
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
          background: rgba(234, 224, 207, 0.06);
          backdrop-filter: blur(18px);
          border: 1px solid rgba(114, 136, 174, 0.25);
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
          position: relative;
          overflow: hidden;
        }

        .login-card::before {
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

        .form-group {
          margin-bottom: 1.2rem;
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

        .login-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(75, 86, 148, 0.4);
        }

        .login-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .error {
          margin-top: 1rem;
          color: #ff6b6b;
          font-size: 0.8rem;
          text-align: center;
        }

        .signup {
          text-align: center;
          margin-top: 1.5rem;
          font-size: 0.8rem;
          color: #7288AE;
        }

        .signup a {
          color: #EAE0CF;
          text-decoration: none;
          font-weight: 500;
          letter-spacing: 0.1em;
        }

        .signup a:hover {
          color: #7288AE;
        }
      `}</style>

      <div className="login-page">
        <div className="login-card">
          <div className="login-title">Eloura</div>
          <div className="login-subtitle">THE FRAGRANCE HOUSE</div>

          <form onSubmit={handlesubmit}>
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

            <button className="login-btn" type="submit" disabled={loading}>
              {loading ? "SIGNING IN..." : "LOGIN"}
            </button>

            {error && <div className="error">{error}</div>}
          </form>

          <div className="signup">
            Don't have an account?{" "}
            <Link to="/signup">Sign Up</Link>
          </div>
        </div>
      </div>
    </>
  );
}