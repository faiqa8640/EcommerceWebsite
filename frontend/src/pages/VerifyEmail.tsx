// // Handles the email verification link: /verify-email/:token
// // Calls backend and shows success or error

// import { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";

// type Status = "loading" | "success" | "error";

// export default function VerifyEmail() {
//   const { token } = useParams<{ token: string }>();
//   const [status, setStatus] = useState<Status>("loading");
//   const [message, setMessage] = useState<string>("");

//   useEffect(() => {
//     const verify = async () => {
//       try {
//         const res = await fetch(
//           `http://localhost:5000/api/auth/verify-email/${token}`
//         );
//         const data = await res.json();

//         if (!res.ok) {
//           setStatus("error");
//           setMessage(data.message || "Verification failed.");
//           return;
//         }

//         setStatus("success");
//         setMessage(data.message);
//       } catch {
//         setStatus("error");
//         setMessage("Something went wrong. Please try again.");
//       }
//     };

//     if (token) verify();
//   }, [token]);

//   return (
//     <>
//       <style>{`
//         .verify-page {
//           min-height: 100vh;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           background: radial-gradient(circle at top, #1b2355 0%, #111844 60%);
//           padding: 2rem;
//           font-family: 'Jost', sans-serif;
//         }

//         .verify-card {
//           width: 100%;
//           max-width: 420px;
//           padding: 3rem 2.5rem;
//           border-radius: 18px;
//           background: rgba(234,224,207,0.06);
//           backdrop-filter: blur(18px);
//           border: 1px solid rgba(114,136,174,0.25);
//           box-shadow: 0 20px 60px rgba(0,0,0,0.5);
//           text-align: center;
//           color: #EAE0CF;
//         }

//         .verify-icon { font-size: 3.5rem; margin-bottom: 1.2rem; }

//         .verify-title {
//           font-family: 'Cormorant Garamond', serif;
//           font-size: 1.6rem;
//           letter-spacing: 0.1em;
//           margin-bottom: 1rem;
//         }

//         .verify-message {
//           color: rgba(234,224,207,0.8);
//           font-size: 0.95rem;
//           line-height: 1.7;
//           margin-bottom: 2rem;
//         }

//         .verify-btn {
//           display: inline-block;
//           padding: 0.85rem 2rem;
//           background: linear-gradient(135deg, #4B5694, #7288AE);
//           color: #EAE0CF;
//           text-decoration: none;
//           border-radius: 10px;
//           font-size: 0.85rem;
//           letter-spacing: 0.2em;
//           text-transform: uppercase;
//           transition: 0.3s;
//         }

//         .verify-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 25px rgba(75,86,148,0.4); }

//         .loading-dots {
//           display: flex;
//           justify-content: center;
//           gap: 8px;
//           margin-bottom: 1rem;
//         }

//         .loading-dots span {
//           width: 10px;
//           height: 10px;
//           border-radius: 50%;
//           background: #7288AE;
//           animation: bounce 1.4s infinite ease-in-out;
//         }

//         .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
//         .loading-dots span:nth-child(3) { animation-delay: 0.4s; }

//         @keyframes bounce {
//           0%, 80%, 100% { transform: scale(0.7); opacity: 0.5; }
//           40% { transform: scale(1); opacity: 1; }
//         }
//       `}</style>

//       <div className="verify-page">
//         <div className="verify-card">
//           {status === "loading" && (
//             <>
//               <div className="loading-dots">
//                 <span /><span /><span />
//               </div>
//               <div className="verify-title">Verifying your email...</div>
//               <p className="verify-message">Please wait a moment.</p>
//             </>
//           )}

//           {status === "success" && (
//             <>
//               <div className="verify-icon">✅</div>
//               <div className="verify-title">Email Verified!</div>
//               <p className="verify-message">{message}</p>
//               <Link to="/login" className="verify-btn">
//                 Log In Now
//               </Link>
//             </>
//           )}

//           {status === "error" && (
//             <>
//               <div className="verify-icon">❌</div>
//               <div className="verify-title">Verification Failed</div>
//               <p className="verify-message">{message}</p>
//               <Link to="/resend-verification" className="verify-btn">
//                 Resend Link
//               </Link>
//             </>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }


// pages/VerifyEmail.tsx
// Handles the email verification link: /verify-email/:token
// useRef guard prevents React StrictMode double-invocation bug

import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";

type Status = "loading" | "success" | "error";

export default function VerifyEmail() {
  const { token } = useParams<{ token: string }>();
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState<string>("");
  const hasCalled = useRef(false); // ← prevents double-call in StrictMode

  useEffect(() => {
    // StrictMode mounts twice in dev — this ref ensures we only call once
    if (hasCalled.current) return;
    hasCalled.current = true;

    const verify = async () => {
      if (!token) {
        setStatus("error");
        setMessage("No verification token found.");
        return;
      }

      try {
        const res = await fetch(
          `http://localhost:5000/api/auth/verify-email/${token}`
        );
        const data = await res.json();

        if (!res.ok) {
          setStatus("error");
          setMessage(data.message || "Verification failed.");
          return;
        }

        setStatus("success");
        setMessage(data.message || "Email verified successfully! You can now log in.");
      } catch {
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
      }
    };

    verify();
  }, [token]);

  return (
    <>
      <style>{`
        .verify-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at top, #1b2355 0%, #111844 60%);
          padding: 2rem;
          font-family: 'Jost', sans-serif;
        }

        .verify-card {
          width: 100%;
          max-width: 420px;
          padding: 3rem 2.5rem;
          border-radius: 18px;
          background: rgba(234,224,207,0.06);
          backdrop-filter: blur(18px);
          border: 1px solid rgba(114,136,174,0.25);
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
          text-align: center;
          color: #EAE0CF;
        }

        .verify-icon { font-size: 3.5rem; margin-bottom: 1.2rem; }

        .verify-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.6rem;
          letter-spacing: 0.1em;
          margin-bottom: 1rem;
        }

        .verify-message {
          color: rgba(234,224,207,0.8);
          font-size: 0.95rem;
          line-height: 1.7;
          margin-bottom: 2rem;
        }

        .verify-btn {
          display: inline-block;
          padding: 0.85rem 2rem;
          background: linear-gradient(135deg, #4B5694, #7288AE);
          color: #EAE0CF;
          text-decoration: none;
          border-radius: 10px;
          font-size: 0.85rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          transition: 0.3s;
        }

        .verify-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 25px rgba(75,86,148,0.4); }

        .loading-dots {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-bottom: 1rem;
        }

        .loading-dots span {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #7288AE;
          animation: bounce 1.4s infinite ease-in-out;
        }

        .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
        .loading-dots span:nth-child(3) { animation-delay: 0.4s; }

        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0.7); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>

      <div className="verify-page">
        <div className="verify-card">
          {status === "loading" && (
            <>
              <div className="loading-dots">
                <span /><span /><span />
              </div>
              <div className="verify-title">Verifying your email...</div>
              <p className="verify-message">Please wait a moment.</p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="verify-icon">✅</div>
              <div className="verify-title">Email Verified!</div>
              <p className="verify-message">{message}</p>
              <Link to="/login" className="verify-btn">
                Log In Now
              </Link>
            </>
          )}

          {status === "error" && (
            <>
              <div className="verify-icon">❌</div>
              <div className="verify-title">Verification Failed</div>
              <p className="verify-message">{message}</p>
              <Link to="/resend-verification" className="verify-btn">
                Resend Link
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
