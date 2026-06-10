// Shop page — shows 4 category cards, click to enter category
import { Link } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/Footer";
import { categories } from "../data/productsData";

export default function Shop() {
  return (
    <>
      <style>{`
        .shop-page {
          background: #EAE0CF;
          min-height: 100vh;
          font-family: 'Jost', sans-serif;
        }
        
        /* ── HERO ─────────────────────────────────────────────── */
        .about-hero {
          position: relative;
          margin-top: -160px;   /* must be on the FIRST child after Header */
          padding-top: 15px;   /* so text inside still clears the navbar */
          height: 120vh;
        }

        .about-hero img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center center;
          display: block;
          filter: brightness(0.78);
        }

        .about-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to right,
            rgba(17,24,68,0.45) 0%,
            rgba(17,24,68,0.10) 45%,
            transparent 100%
          );
        }

        .about-hero-text {
          position: absolute;
          bottom: 60px;
          left: 60px;
          right: 60px; /* Prevents long text from jumping off-screen on smaller windows */
        }

        .about-hero-label {
          font-family: 'Jost', sans-serif;
          font-size: 0.75rem;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: rgba(234,224,207,0.75);
          margin-bottom: 0.6rem;
        }

        .about-hero-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(3.5rem, 8vw, 7rem);
          font-weight: 300;
          color: #EAE0CF;
          line-height: 0.9;
          letter-spacing: -0.01em;
        }

        .about-hero p {
          font-size: 1rem;
          line-height: 1.3;
          color: rgba(234,224,207,0.72);
        }

        /* ── CATEGORIES SECTION ──────────────────────────────── */
        .shop-categories {
          max-width: 1200px;
          margin: 0 auto;
          padding: 5rem 2rem 6rem;
        }

        .shop-section-label {
          text-align: center;
          margin-bottom: 3.5rem;
        }

        .shop-section-label .eyebrow {
          font-size: 0.7rem;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: #4B5694;
          margin-bottom: 0.9rem;
        }

        .shop-section-label h2 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2rem, 3.5vw, 2.8rem);
          font-weight: 300;
          color: #111844;
        }

        .shop-section-label h2 span {
          color: #4B5694;
          font-style: italic;
        }

        /* same 2×2 grid as home Categories */
        .shop-cat-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2rem;
        }

        .shop-cat-card {
          position: relative;
          height: 360px;
          border-radius: 22px;
          overflow: hidden;
          background: linear-gradient(135deg, #bfc1cd77, #1a245c);
          box-shadow: 0 18px 45px rgba(17,24,68,0.22);
          cursor: pointer;
          transition: transform 0.4s ease, box-shadow 0.4s ease;
          text-decoration: none;
          display: block;
        }

        .shop-cat-card:hover {
          transform: translateY(-12px) scale(1.015);
          box-shadow: 0 28px 65px rgba(17,24,68,0.32);
        }

        .shop-cat-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.28;
          transition: opacity 0.4s ease, transform 0.4s ease;
        }

        .shop-cat-card:hover img {
          opacity: 0.55;
          transform: scale(1.06);
        }

        .shop-cat-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(17,24,68,0.92),
            rgba(75,86,148,0.25),
            transparent
          );
        }

        .shop-cat-badge {
          position: absolute;
          top: 20px;
          left: 20px;
          background: rgba(234,224,207,0.13);
          color: #EAE0CF;
          padding: 6px 16px;
          border-radius: 999px;
          font-size: 0.68rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          border: 1px solid rgba(234,224,207,0.18);
        }

        .shop-cat-content {
          position: absolute;
          bottom: 28px;
          left: 28px;
          right: 28px;
          color: #EAE0CF;
        }

        .shop-cat-content h3 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.6rem;
          font-weight: 400;
          margin-bottom: 0.5rem;
          letter-spacing: 0.04em;
        }

        .shop-cat-content p {
          font-size: 0.85rem;
          line-height: 1.6;
          color: rgba(234,224,207,0.82);
          margin-bottom: 1rem;
        }

        .shop-cat-cta {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.7rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #7288AE;
          transition: gap 0.3s ease, color 0.3s ease;
        }

        .shop-cat-card:hover .shop-cat-cta {
          gap: 0.9rem;
          color: #EAE0CF;
        }

        /* ── RESPONSIVE RESPONSIVENESS FIXES (LOOK STAYS EXACTLY THE SAME) ── */
        @media (max-width: 768px) {
          .about-hero {
            height: 90vh; /* Prevents ultra-long empty spaces below hero background images on long screens */
          }
          .about-hero-text {
            left: 24px;
            right: 24px;
            bottom: 40px;
          }
          .shop-categories {
            padding: 3rem 1rem 4rem; /* Safely reduces page margins so cards stretch wider on tiny views */
          }
          .shop-section-label {
            margin-bottom: 2.5rem;
          }
          .shop-cat-grid { 
            grid-template-columns: 1fr; 
            gap: 1.5rem; /* Slightly closer items for elegant mobile layout density */
          }
          .shop-cat-card { 
            height: 280px; 
          }
        }

        @media (max-width: 480px) {
          .about-hero {
            height: 80vh;
          }
          .shop-cat-content {
            bottom: 20px;
            left: 20px;
            right: 20px;
          }
          .shop-cat-content h3 {
            font-size: 1.4rem; /* Gently scales down font sizing so header text never squishes or clips wrapping boundaries */
          }
        }
      `}</style>

      <Header />

      <div className="shop-page">
        {/* Banner */}
        <section className="about-hero">
          <img src="/about-shop.jpg" alt="Eloura — Our Story" />
          <div className="about-hero-overlay" />
          <div className="about-hero-text">
            <p className="about-hero-label">Scents</p>
            <h1 className="about-hero-title">Eloura Collections</h1>
            <p>
              Explore our curated fragrance collections — each crafted with
              the finest ingredients from around the world.
            </p>
          </div>
        </section>

        {/* Category Grid */}
        <section className="shop-categories">
          <div className="shop-section-label">
            <p className="eyebrow">Browse by Collection</p>
            <h2>Choose Your <span>Category</span></h2>
          </div>

          <div className="shop-cat-grid">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                to={`/shop/${cat.slug}`}
                className="shop-cat-card"
              >
                <img src={cat.img} alt={cat.label} />
                <div className="shop-cat-overlay" />
                <div className="shop-cat-badge">Explore</div>
                <div className="shop-cat-content">
                  <h3>{cat.label}</h3>
                  <p>{cat.desc}</p>
                  <span className="shop-cat-cta">
                    View Collection →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}