import { Link } from "react-router-dom";

export default function Footer(){
  return (
    <>
      <style>{`
        .footer {
          background: linear-gradient(
            135deg,
            #111844,
            #1a245c
          );

          color: #EAE0CF;
          padding: 5rem 2rem 1.5rem;
          position: relative;
          overflow: hidden;
        }

        /* decorative glow */
        .footer::before {
          content: "";
          position: absolute;
          top: -200px;
          right: -200px;

          width: 450px;
          height: 450px;

          background: rgba(114,136,174,0.08);

          border-radius: 50%;
          filter: blur(80px);
        }

        .footer-container {
          max-width: 1200px;
          margin: auto;
        }

        .footer-top {
          display: grid;
          grid-template-columns: 1.4fr 1fr 1fr;
          gap: 4rem;
          margin-bottom: 3rem;
        }

        /* BRAND */

        .footer-logo {
          font-family: "Cormorant Garamond", serif;
          font-size: 2.4rem;
          letter-spacing: 0.2em;
          margin-bottom: 1rem;
        }

        .footer-tagline {
          color: #7288AE;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          font-size: 0.7rem;
          margin-bottom: 1.5rem;
        }

        .footer-desc {
          max-width: 320px;
          line-height: 1.8;
          color: rgba(234,224,207,0.85);
          font-size: 0.95rem;
        }

        /* HEADINGS */

        .footer-heading {
          font-family: "Cormorant Garamond", serif;
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
          color: #EAE0CF;
        }

        /* LINKS */

        .footer-links {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .footer-links a {
          color: rgba(234,224,207,0.85);
          text-decoration: none;
          transition: 0.3s;
        }

        .footer-links a:hover {
          color: #7288AE;
          transform: translateX(6px);
        }

        /* CONTACT */

        .footer-contact {
          display: flex;
          flex-direction: column;
          color: rgba(234,224,207,0.85);
        }

        /* DIVIDER */

        .footer-divider {
          height: 1px;
          background: rgba(114,136,174,0.2);
          margin-bottom: 1.5rem;
        }

        /* BOTTOM */

        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;

          color: rgba(234,224,207,0.6);
          font-size: 0.85rem;
        }

        .footer-bottom span {
          color: #7288AE;
        }

        /* MOBILE */

        @media (max-width: 900px) {

          .footer-top {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }

          .footer-bottom {
            flex-direction: column;
            gap: 0.8rem;
            text-align: center;
          }
        }
      `}</style>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-top">

            {/* BRAND */}
            <div>
              <h2 className="footer-logo">ELOURA</h2>

              <div className="footer-tagline">
                THE FRAGNANCE HOUSE
              </div>

              <p className="footer-desc">
                Discover timeless fragrances crafted with
                elegance, sophistication, and luxury.
                Every bottle is designed to leave a lasting
                impression.
              </p>
            </div>

            {/* LINKS */}
            <div>
              <h3 className="footer-heading">Quick Links</h3>

              <div className="footer-links">
                <Link to="/">Home</Link>
                <Link to="/shop">Shop</Link>
                <Link to="/about">About</Link>
                <Link to="/contact">Contact</Link>
              </div>
            </div>

            {/* CONTACT */}
            <div>
              <h3 className="footer-heading">Contact</h3>

              <div className="footer-contact">
                <p>eloura@gmail.com</p>
                <p>+92 3447175455</p>
                <p>Lahore, Pakistan</p>
              </div>
            </div>

          </div>

          <div className="footer-divider"></div>

          <div className="footer-bottom">
            <p>© 2026 Eloura. All Rights Reserved.</p>
            <p>
              Crafted with <span>Elegance</span>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}