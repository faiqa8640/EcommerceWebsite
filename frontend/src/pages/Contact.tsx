import React, { useState } from "react";
import Header from "../components/header";
import Footer from "../components/Footer";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Temporary simulated submission pipeline
      await new Promise((resolve) => setTimeout(resolve, 1200));
      alert("Thank you for reaching out to Eloura. Our team will contact you shortly.");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Jost:wght@300;400;500&display=swap');

        /* ── HERO ─────────────────────────────────────────────── */
        .contact-hero {
          position: relative;
          margin-top: -320px;   /* Must be on the FIRST child after Header to match About layout */
          padding-top: 80px;   
          height: 100vh;
        }

        .contact-hero img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center center;
          display: block;
          filter: brightness(0.72);
        }

        .contact-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to right,
            rgba(17,24,68,0.5) 0%,
            rgba(17,24,68,0.15) 55%,
            transparent 100-px%
          );
        }

        .contact-hero-text {
          position: absolute;
          bottom: 60px;
          left: 60px;
        }

        .contact-hero-label {
          font-family: 'Jost', sans-serif;
          font-size: 0.75rem;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: rgba(234,224,207,0.75);
          margin-bottom: 0.6rem;
        }

        .contact-hero-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(3.5rem, 8vw, 7rem);
          font-weight: 300;
          color: #EAE0CF;
          line-height: 0.9;
          letter-spacing: -0.01em;
        }

        /* ── PAGE LAYOUT BASE ─────────────────────────────────── */
        .contact-page {
          background: #eae0cfd6; 
          font-family: 'Jost', sans-serif;
          margin-top: 0;
          padding-top: 0;
        }

        .section-wrap {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        /* ── SPLIT CONTEXT GRID ───────────────────────────────── */
        .contact-section {
          padding: 8rem 2rem;
        }

        .contact-grid {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 6rem;
          align-items: start;
        }

        /* Left Side: Form Elements */
        .contact-form-container .eyebrow {
          font-size: 0.7rem;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: #4B5694;
          margin-bottom: 1.2rem;
        }

        .contact-form-container h2 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2rem, 3.5vw, 3rem);
          font-weight: 300;
          color: #111844;
          line-height: 1.2;
          margin-bottom: 1.5rem;
        }

        .contact-form-container h2 span {
          color: #4B5694;
          font-style: italic;
        }

        .contact-form-container p {
          font-size: 0.95rem;
          line-height: 1.8;
          color: rgba(17,24,68,0.75);
          margin-bottom: 3rem;
        }

        .luxury-form {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .input-group {
          position: relative;
        }

        .luxury-input {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(17, 24, 68, 0.3);
          padding: 0.6rem 0;
          font-family: 'Jost', sans-serif;
          font-size: 0.95rem;
          color: #111844;
          outline: none;
          transition: border-color 0.3s ease;
        }

        .luxury-input:focus {
          border-bottom-color: #4B5694;
        }

        .luxury-input::placeholder {
          color: rgba(17, 24, 68, 0.4);
          font-weight: 300;
        }

        textarea.luxury-input {
          min-height: 120px;
          resize: vertical;
        }

        .submit-btn-wrap {
          margin-top: 1rem;
        }

        .submit-btn {
          background: linear-gradient(135deg, #4B5694, #111844);
          color: #EAE0CF;
          border: none;
          border-radius: 10px;
          padding: 1.1rem 2.5rem;
          font-family: 'Jost', sans-serif;
          font-size: 0.8rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 12px 30px rgba(75,86,148,0.25);
        }

        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 18px 40px rgba(75,86,148,0.35);
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Right Side: Information Panel */
        .contact-info-panel {
          background: linear-gradient(135deg, #1a245c 70%, #253382 100%);
          border-radius: 20px;
          padding: 3.5rem;
          color: #EAE0CF;
          box-shadow: 0 30px 70px rgba(17,24,68,0.18);
        }

        .contact-info-panel h3 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem;
          font-weight: 300;
          margin-bottom: 2.5rem;
          color: #EAE0CF;
          border-bottom: 1px solid rgba(234, 224, 207, 0.15);
          padding-bottom: 1rem;
        }

        .info-item {
          display: flex;
          align-items: flex-start;
          gap: 1.5rem;
          margin-bottom: 2.2rem;
        }

        .info-icon {
          font-size: 1.4rem;
          color: #7288AE;
          line-height: 1;
          margin-top: 0.2rem;
        }

        .info-text h5 {
          font-size: 0.75rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #7288AE;
          margin-bottom: 0.4rem;
          font-weight: 500;
        }

        .info-text p {
          font-size: 0.95rem;
          line-height: 1.7;
          color: rgba(234, 224, 207, 0.85);
          margin: 0;
        }

        .info-text a {
          color: rgba(234, 224, 207, 0.85);
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .info-text a:hover {
          color: #7288AE;
        }

        /* ── RESPONSIVE BRACKETS ──────────────────────────────── */
        @media (max-width: 900px) {
          .contact-hero { height: 70vh; }
          .contact-hero-text { left: 28px; bottom: 36px; }
          .contact-grid {
            grid-template-columns: 1fr;
            gap: 4rem;
          }
          .contact-info-panel {
            padding: 2.5rem;
          }
        }
      `}</style>

      <Header />

      <div className="contact-page">
        
        {/* ── HERO BANNER ──────────────────────────────────────── */}
        <section className="contact-hero">
          <img src="/contact.jpg" alt="Contact Eloura" />
          <div className="contact-hero-overlay" />
          <div className="contact-hero-text">
            <p className="contact-hero-label">Get In Touch</p>
            <h1 className="contact-hero-title">Connect Us</h1>
          </div>
        </section>

        {/* ── MAIN INTERACTIVE SECTION ─────────────────────────── */}
        <section className="contact-section">
          <div className="section-wrap">
            <div className="contact-grid">
              
              {/* LEFT COLUMN: LUXURY INPUT FORM */}
              <div className="contact-form-container">
                <p className="eyebrow">Connoisseur Support</p>
                <h2>
                  Let us assist your <span>olfactory journey</span>
                </h2>
                <p>
                  Whether you seek guidance selecting a unique signature scent, require 
                  assistance tracking your package, or wish to explore bespoke corporate collections, 
                  our fragrance experts await your message.
                </p>

                <form className="luxury-form" onSubmit={handleFormSubmit}>
                  <div className="input-group">
                    <input
                      type="text"
                      className="luxury-input"
                      placeholder="Your Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="input-group">
                    <input
                      type="email"
                      className="luxury-input"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="input-group">
                    <input
                      type="text"
                      className="luxury-input"
                      placeholder="Subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                    />
                  </div>

                  <div className="input-group">
                    <textarea
                      className="luxury-input"
                      placeholder="How may we assist you today?"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    ></textarea>
                  </div>

                  <div className="submit-btn-wrap">
                    <button type="submit" className="submit-btn" disabled={isSubmitting}>
                      {isSubmitting ? "Sending Message..." : "Send Message"}
                    </button>
                  </div>
                </form>
              </div>

              {/* RIGHT COLUMN: BRAND INFORMATION PANEL */}
              <div className="contact-info-panel">
                <h3>Eloura House</h3>
                
                <div className="info-item">
                  <div className="info-icon">📍</div>
                  <div className="info-text">
                    <h5>Atelier Location</h5>
                    <p>
                      Main Boulevard, Gulberg III,<br />
                      Lahore, Punjab, Pakistan
                    </p>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">✉️</div>
                  <div className="info-text">
                    <h5>Digital Inquiries</h5>
                    <p><a href="mailto:concierge@eloura.com">concierge@eloura.com</a></p>
                    <p><a href="mailto:info@eloura.com">info@eloura.com</a></p>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">📞</div>
                  <div className="info-text">
                    <h5>Concierge &amp; WhatsApp</h5>
                    <p><a href="tel:+923001234567">+92 (300) 123-4567</a></p>
                    <p style={{ fontSize: "0.85rem", opacity: 0.7 }}>Mon - Sat: 11:00 AM - 8:00 PM</p>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">✦</div>
                  <div className="info-text">
                    <h5>Corporate Gifting &amp; Orders</h5>
                    <p>
                      For custom fragrance creations, wedding favors, or corporate commissions, 
                      please reach out directly via email with details.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

      </div>

      <Footer />
    </>
  );
}