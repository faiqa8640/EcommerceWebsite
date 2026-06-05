import {useState } from "react";


export default function Newsletter(){
  const [email, setEmail] = useState<string>(""); // it is used for storing the email

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    // handling submit button
    e.preventDefault(); // it stop the page refresh

    alert(`Subscribed with: ${email}`);

    setEmail(""); // it clear the input field after submit
  };

  return (
    <>
      <style>{`
        .newsletter-section {
          background: #EAE0CF;
          padding: 5rem 2rem;
        }

        .container {
          max-width: 1200px;
          margin: auto;
        }

        /* INNER BOX */
        .newsletter-box {
          background: #f1e9db;
          border: 1px solid rgba(17,24,68,0.15);

          border-radius: 24px;
          padding: 4rem 2rem;
          box-shadow: 0 20px 50px rgba(17,24,68,0.12);

          position: relative;
          overflow: hidden;
        }

        /* soft glow */
        .newsletter-box::before {
          content: "";
          position: absolute;
          top: -100px;
          left: -100px;

          width: 280px;
          height: 280px;

          background: rgba(75,86,148,0.08);
          border-radius: 50%;
          filter: blur(70px);
        }

        .newsletter-box::after {
          content: "";
          position: absolute;
          bottom: -100px;
          right: -100px;

          width: 300px;
          height: 300px;

          background: rgba(17,24,68,0.08);
          border-radius: 50%;
          filter: blur(80px);
        }

        /* TITLE */
        .title-newsletter {
          font-size: 2.3rem;
          font-family: "Cormorant Garamond", serif;
          color: #111844;
          text-align: center;
          margin-bottom: 1rem;
          letter-spacing: 0.12em;
        }

        .title-newsletter span {
          color: #4B5694;
        }

        .subtitle {
          text-align: center;
          font-size: 0.95rem;
          color: rgba(17,24,68,0.75);
          margin-bottom: 2.5rem;
          line-height: 1.7;
        }

        /* FORM */
        .form {
          display: flex;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .input {
          width: 340px;

          padding: 0.95rem 1.2rem;

          border-radius: 14px;
          border: 1px solid rgba(75,86,148,0.3);

          outline: none;

          font-size: 0.9rem;

          background: rgba(255,255,255,0.7);

          backdrop-filter: blur(8px);

          transition: 0.3s;
        }

        .input:focus {
          border-color: #4B5694;
          box-shadow: 0 0 0 3px rgba(75,86,148,0.2);
        }

        .button {
          padding: 0.95rem 1.8rem;

          background: linear-gradient(
            135deg,
            #111844,
            #4B5694
          );

          color: #EAE0CF;

          border: none;

          border-radius: 14px;

          font-size: 0.9rem;
          letter-spacing: 0.12em;

          cursor: pointer;

          transition: 0.3s;

          box-shadow: 0 12px 30px rgba(17,24,68,0.2);
        }

        .button:hover {
          transform: translateY(-3px);
          box-shadow: 0 18px 40px rgba(17,24,68,0.3);
        }

        .note {
          text-align: center;
          margin-top: 1.5rem;
          font-size: 0.8rem;
          color: rgba(17,24,68,0.6);
        }

        /* MOBILE */
        @media (max-width: 600px) {
          .input {
            width: 100%;
          }

          .form {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>

      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-box">
            <h2 className="title-newsletter">
              Join Our <span>Newsletter</span>
            </h2>

            <p className="subtitle">
              Subscribe to receive exclusive perfume launches,
              luxury offers, and early access to new collections.
            </p>

            <form className="form" onSubmit={handleSubmit}>
              <input
                className="input"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
                required
              />

              <button className="button" type="submit">
                Subscribe
              </button>
            </form>

            <p className="note">
              No spam. Only elegance and exclusive updates.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}