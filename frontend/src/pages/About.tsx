import { Link } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/Footer";

export default function About() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Jost:wght@300;400;500&display=swap');

        /* ── HERO ─────────────────────────────────────────────── */
        .about-hero {
        position: relative;
        margin-top: -320px;   /* must be on the FIRST child after Header */
        padding-top: 76px;   /* so text inside still clears the navbar */
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
            rgba(17,24,68,0.10) 55%,
            transparent 100%
          );
        }

        .about-hero-text {
          position: absolute;
          bottom: 60px;
          left: 60px;
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

        /* ── SHARED SECTION BASE ──────────────────────────────── */
        .about-page {
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

        /* ── STORY INTRO ──────────────────────────────────────── */
        .story-intro {
          padding: 7rem 2rem 5rem;
          text-align: center;
        }

        .story-intro .eyebrow {
          font-size: 0.7rem;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: #4B5694;
          margin-bottom: 1.2rem;
        }

        .story-intro h2 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.2rem, 4vw, 3.2rem);
          font-weight: 300;
          color: #111844;
          line-height: 1.25;
          max-width: 780px;
          margin: 0 auto 1.8rem;
        }

        .story-intro h2 em {
          font-style: italic;
          color: #4B5694;
        }

        .story-intro p {
          font-size: 1rem;
          line-height: 1.9;
          color: rgba(17,24,68,0.75);
          max-width: 640px;
          margin: 0 auto;
        }

        .divider-line {
          width: 60px;
          height: 1px;
          background: #4B5694;
          margin: 2.5rem auto 0;
          opacity: 0.5;
        }

        /* ── MISSION & VISION ─────────────────────────────────── */
        .mission-section {
          padding: 5rem 2rem;
        }

        .mission-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5rem;
          align-items: center;
        }

        .mission-img-wrap {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          height: 520px;
          box-shadow: 0 30px 70px rgba(17,24,68,0.18);
        }

        .mission-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .mission-img-wrap:hover img {
          transform: scale(1.04);
        }

        .mission-img-badge {
          position: absolute;
          bottom: 28px;
          left: 28px;
          background: rgba(17,24,68,0.85);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(114,136,174,0.3);
          padding: 1rem 1.4rem;
          border-radius: 14px;
          color: #EAE0CF;
        }

        .mission-img-badge p:first-child {
          font-size: 0.65rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #7288AE;
          margin-bottom: 0.3rem;
        }

        .mission-img-badge p:last-child {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.1rem;
          font-weight: 400;
        }

        .mission-content .eyebrow {
          font-size: 0.7rem;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: #4B5694;
          margin-bottom: 1.2rem;
        }

        .mission-content h2 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2rem, 3vw, 2.8rem);
          font-weight: 300;
          color: #111844;
          line-height: 1.2;
          margin-bottom: 2rem;
        }

        .mission-content h2 span {
          color: #4B5694;
        }

        .mission-block {
          margin-bottom: 2rem;
          padding-left: 1.2rem;
          border-left: 2px solid rgba(75,86,148,0.3);
        }

        .mission-block h4 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.2rem;
          color: #111844;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        .mission-block p {
          font-size: 0.9rem;
          line-height: 1.8;
          color: rgba(17,24,68,0.72);
        }

        /* ── WHAT MAKES US DIFFERENT ──────────────────────────── */
        .different-section {
          padding: 5rem 2rem;
          background: linear-gradient(180deg, #EAE0CF 0%, #e0d5c2 100%);
        }

        .different-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .different-header .eyebrow {
          font-size: 0.7rem;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: #4B5694;
          margin-bottom: 1rem;
        }

        .different-header h2 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.2rem, 3.5vw, 3rem);
          font-weight: 300;
          color: #111844;
        }

        .different-header h2 span {
          color: #4B5694;
          font-style: italic;
        }

        /* Cards — same scroll-row style as BestSellers */
        .different-scroll-wrap {
          position: relative;
        }

        .different-row {
          display: flex;
          gap: 1.8rem;
          overflow-x: auto;
          scroll-behavior: smooth;
          padding-bottom: 1.2rem;
        }

        .different-row::-webkit-scrollbar { display: none; }

        .diff-card {
          min-width: 240px;
          background: linear-gradient(135deg, #1a245c 65%,  #f1e9db 100%, #f1e9db 100%);
          border: 1px solid rgba(75,86,148,0.2);
          border-radius: 18px;
          padding: 1rem;
          backdrop-filter: blur(10px);
          transition: 0.3s;
        }

        .diff-card::before {
          content: '';
          position: absolute;
          top: -40px;
          right: -40px;
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: rgba(234,224,207,0.05);
        }

        .diff-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 24px 55px rgba(17,24,68,0.32);
        }

        .diff-card-badge {
          display: inline-block;
          font-size: 0.65rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          padding: 5px 14px;
          border-radius: 999px;
          background: rgba(234,224,207,0.12);
          margin-bottom: 1.4rem;
          color: rgba(234,224,207,0.8);
        }

        .diff-card-icon {
          font-size: 2rem;
          margin-bottom: 1rem;
          display: block;
          color: #EAE0CF;
        }

        .diff-card h3 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.35rem;
          margin-bottom: 0.8rem;
          font-weight: 400;
          color: #EAE0CF;
        }

        .diff-card p {
          font-size: 0.88rem;
          line-height: 1.75;
          opacity: 0.88;
          color: #EAE0CF;
        }

        .diff-card-line {
          width: 40px;
          height: 1px;
          background: rgba(234,224,207,0.5);
          margin-top: 1.4rem;
        }

        .diff-arrows {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-top: 2.5rem;
        }

        .diff-arrow {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1px solid #4B5694;
          background: transparent;
          color: #111844;
          cursor: pointer;
          font-size: 18px;
          transition: 0.3s;
        }

        .diff-arrow:hover {
          background: #4B5694;
          color: #EAE0CF;
          transform: scale(1.05);
        }

        /* ── FRAGRANCE PHILOSOPHY ─────────────────────────────── */
        .philosophy-section {
          padding: 5rem 2rem;
        }

        .philosophy-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5rem;
          align-items: center;
        }

        .philosophy-content .eyebrow {
          font-size: 0.7rem;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: #4B5694;
          margin-bottom: 1.2rem;
        }

        .philosophy-content h2 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2rem, 3vw, 2.8rem);
          font-weight: 300;
          color: #111844;
          line-height: 1.2;
          margin-bottom: 1.5rem;
        }

        .philosophy-content h2 span {
          color: #4B5694;
          font-style: italic;
        }

        .philosophy-content p {
          font-size: 0.95rem;
          line-height: 1.9;
          color: rgba(17,24,68,0.72);
          margin-bottom: 1.2rem;
        }

        .philosophy-pillars {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-top: 2rem;
        }

        .pillar {
          background: #f1e9db;
          border: 1px solid rgba(75,86,148,0.2);
          border-radius: 14px;
          padding: 1.2rem;
          transition: 0.3s;
        }

        .pillar:hover {
          background: rgba(17,24,68,0.09);
          transform: translateY(-3px);
        }

        .pillar-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.8rem;
          color: #1a2251;
          opacity: 0.5;
          line-height: 1;
          margin-bottom: 0.4rem;
        }

        .pillar h4 {
          font-size: 0.8rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #111844;
          margin-bottom: 0.3rem;
          font-weight: 500;
        }

        .pillar p {
          font-size: 0.8rem;
          color: rgba(17,24,68,0.65);
          line-height: 1.6;
          margin: 0;
        }

        .philosophy-img-wrap {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          height: 560px;
          box-shadow: 0 30px 70px rgba(17,24,68,0.18);
        }

        .philosophy-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .philosophy-img-wrap:hover img {
          transform: scale(1.04);
        }

        .philosophy-quote {
          position: absolute;
          top: 28px;
          left: 28px;
          right: 28px;
          background: rgba(17,24,68,0.82);
          backdrop-filter: blur(14px);
          border: 1px solid rgba(114,136,174,0.25);
          border-radius: 14px;
          padding: 1.4rem 1.6rem;
          color: #EAE0CF;
        }

        .philosophy-quote span {
          font-size: 2.5rem;
          font-family: 'Cormorant Garamond', serif;
          color: #7288AE;
          line-height: 0.5;
          display: block;
          margin-bottom: 0.6rem;
        }

        .philosophy-quote p {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.05rem;
          font-style: italic;
          font-weight: 300;
          line-height: 1.6;
          opacity: 0.9;
          margin: 0;
          color: #EAE0CF;
        }

        /* ── CALL TO ACTION ───────────────────────────────────── */
        .cta-section {
          padding: 7rem 2rem;
          background: linear-gradient(135deg, #f1e9db 0%, #1a245c 60%, #f1e9db 100%);
          position: relative;
          overflow: hidden;
          text-align: center;
        }

        .cta-section::before {
          content: '';
          position: absolute;
          top: -150px;
          left: -150px;
          width: 400px;
          height: 400px;
          background: rgba(75,86,148,0.15);
          border-radius: 50%;
          filter: blur(100px);
        }

        .cta-section::after {
          content: '';
          position: absolute;
          bottom: -150px;
          right: -150px;
          width: 400px;
          height: 400px;
          background: rgba(114,136,174,0.1);
          border-radius: 50%;
          filter: blur(100px);
        }

        .cta-inner {
          position: relative;
          z-index: 2;
          max-width: 680px;
          margin: 0 auto;
        }

        .cta-inner .eyebrow {
          font-size: 0.7rem;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: #7288AE;
          margin-bottom: 1.2rem;
        }

        .cta-inner h2 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.2rem, 4vw, 3.2rem);
          font-weight: 300;
          color: #EAE0CF;
          line-height: 1.2;
          margin-bottom: 1.4rem;
        }

        .cta-inner h2 span {
          color: #7288AE;
          font-style: italic;
        }

        .cta-inner p {
          font-size: 0.95rem;
          line-height: 1.8;
          color: rgba(234,224,207,0.75);
          margin-bottom: 2.5rem;
        }

        .cta-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .cta-btn-primary {
          text-decoration: none;
          padding: 1rem 2.2rem;
          background: linear-gradient(135deg, #4B5694, #7288AE);
          color: #EAE0CF;
          border-radius: 10px;
          font-size: 0.8rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          transition: 0.3s;
          box-shadow: 0 12px 30px rgba(75,86,148,0.35);
        }

        .cta-btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 18px 40px rgba(75,86,148,0.45);
        }

        .cta-btn-secondary {
          text-decoration: none;
          padding: 1rem 2.2rem;
          border: 1px solid rgba(114,136,174,0.5);
          color: #EAE0CF;
          border-radius: 10px;
          font-size: 0.8rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          transition: 0.3s;
        }

        .cta-btn-secondary:hover {
          background: rgba(114,136,174,0.15);
          border-color: #7288AE;
        }

        /* ── RESPONSIVE ───────────────────────────────────────── */
        @media (max-width: 900px) {
          .about-hero {
            height: 80vh;}
          .about-hero-text { left: 28px; bottom: 36px; }
          .mission-grid,
          .philosophy-grid { grid-template-columns: 1fr; gap: 2.5rem; }
          .philosophy-grid .philosophy-img-wrap { order: -1; height: 320px; }
          .mission-img-wrap { height: 320px; }
          .philosophy-pillars { grid-template-columns: 1fr; }
          .diff-card { min-width: 270px; }
        }
      `}</style>

      <Header />

      <div className="about-page">

        {/* ── HERO ─────────────────────────────────────────────── */}
        <section className="about-hero">
          <img src="/about-hero.jpg" alt="Eloura — Our Story" />
          <div className="about-hero-overlay" />
          <div className="about-hero-text">
            <p className="about-hero-label">Our Story</p>
            <h1 className="about-hero-title">Eloura</h1>
          </div>
        </section>

        {/* ── STORY INTRO ──────────────────────────────────────── */}
        <section className="story-intro">
          <div className="section-wrap">
            <p className="eyebrow">Est. 2020 — Lahore, Pakistan</p>
            <h2>
              Born from a love of <em>rare scents</em> &amp; timeless
              elegance
            </h2>
            <p>
              Eloura was founded on a single belief — that fragrance is not
              merely a scent, but an identity. Every bottle we craft carries
              the soul of artisanal perfumery, blending the finest exotic
              ingredients with a modern sensibility that speaks to those who
              refuse to be ordinary.
            </p>
            <div className="divider-line" />
          </div>
        </section>

        {/* ── MISSION & VISION ─────────────────────────────────── */}
        <section className="mission-section">
          <div className="section-wrap">
            <div className="mission-grid">
              {/* Left — image */}
              <div className="mission-img-wrap">
                <img src="/about-mission.jpg" alt="Our Mission" />
                <div className="mission-img-badge">
                  <p>Founded</p>
                  <p>2020 · Lahore</p>
                </div>
              </div>

              {/* Right — text */}
              <div className="mission-content">
                <p className="eyebrow">Mission &amp; Vision</p>
                <h2>
                  Crafting <span>scents</span> that leave a lasting
                  impression
                </h2>

                <div className="mission-block">
                  <h4>Our Mission</h4>
                  <p>
                    To bring the art of luxury perfumery to every doorstep —
                    delivering 100% authentic, long-lasting fragrances crafted
                    with the finest global ingredients, at a price that honours
                    our customers.
                  </p>
                </div>

                <div className="mission-block">
                  <h4>Our Vision</h4>
                  <p>
                    To become the most beloved fragrance house in South Asia,
                    where every customer finds their signature scent — a
                    personal expression they carry with pride, every single
                    day.
                  </p>
                </div>

                <div className="mission-block">
                  <h4>Our Promise</h4>
                  <p>
                    Authenticity above all. We source, bottle, and deliver
                    with absolute transparency — because trust is the rarest
                    luxury of all.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── WHAT MAKES US DIFFERENT ──────────────────────────── */}
        <section className="different-section">
          <div className="section-wrap">
            <div className="different-header">
              <p className="eyebrow">Our Edge</p>
              <h2>
                What Makes Us <span>Different</span>
              </h2>
            </div>

            <div className="different-scroll-wrap">
              <div className="different-row" id="diffRow">
                {[
                  {
                    badge: "Quality",
                    icon: "✦",
                    title: "Exotic Ingredients",
                    desc:
                      "We source only the finest raw materials — aged oud from the Middle East, rose absolute from Grasse, and rare musks that evolve on your skin.",
                  },
                  {
                    badge: "Packaging",
                    icon: "◈",
                    title: "Luxury Presentation",
                    desc:
                      "Each bottle is a piece of art. From hand-polished glass to magnetic gift boxes — the unboxing experience is as memorable as the fragrance itself.",
                  },
                  {
                    badge: "Authentic",
                    icon: "❋",
                    title: "100% Original",
                    desc:
                      "No imitations, no shortcuts. Every fragrance is certified authentic with a guarantee of origin, so you wear only the real thing.",
                  },
                  {
                    badge: "Delivery",
                    icon: "◉",
                    title: "Swift & Secure",
                    desc:
                      "Tamper-proof packaging, real-time tracking, and express delivery across all major cities — your order arrives as pristine as it left us.",
                  },
                  {
                    badge: "Curation",
                    icon: "✿",
                    title: "Expert Selection",
                    desc:
                      "Our perfumers curate every collection with intention — balancing top, heart, and base notes for fragrances that evolve beautifully over time.",
                  },
                ].map((item, i) => (
                  <div className="diff-card" key={i}>
                    <span className="diff-card-badge">{item.badge}</span>
                    <span className="diff-card-icon">{item.icon}</span>
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                    <div className="diff-card-line" />
                  </div>
                ))}
              </div>
            </div>

            <div className="diff-arrows">
              <button
                className="diff-arrow"
                onClick={() => {
                  const el = document.getElementById("diffRow");
                  if (el) el.scrollBy({ left: -340, behavior: "smooth" });
                }}
              >
                ←
              </button>
              <button
                className="diff-arrow"
                onClick={() => {
                  const el = document.getElementById("diffRow");
                  if (el) el.scrollBy({ left: 340, behavior: "smooth" });
                }}
              >
                →
              </button>
            </div>
          </div>
        </section>

        {/* ── FRAGRANCE PHILOSOPHY ─────────────────────────────── */}
        <section className="philosophy-section">
          <div className="section-wrap">
            <div className="philosophy-grid">
              {/* Left — text */}
              <div className="philosophy-content">
                <p className="eyebrow">Our Philosophy</p>
                <h2>
                  Fragrance is the <span>invisible luxury</span> you wear
                </h2>
                <p>
                  At Eloura, we believe a great fragrance doesn't just smell
                  beautiful — it tells a story. It captures a moment, evokes
                  an emotion, and leaves a trace of your presence long after
                  you've left the room.
                </p>
                <p>
                  Our philosophy is rooted in restraint and intention. We
                  never rush the creation process. Each accord is layered with
                  purpose, each note chosen to complement the next — resulting
                  in fragrances that feel inevitable, as though they were
                  always meant to exist.
                </p>

                <div className="philosophy-pillars">
                  {[
                    { num: "01", title: "Naturality", desc: "Ingredients rooted in nature, never synthetic substitutes." },
                    { num: "02", title: "Longevity", desc: "Formulas that stay with you from morning to midnight." },
                    { num: "03", title: "Artistry", desc: "Each scent is composed like a piece of music." },
                    { num: "04", title: "Emotion", desc: "Fragrances designed to make you feel something." },
                  ].map((p, i) => (
                    <div className="pillar" key={i}>
                      <div className="pillar-num">{p.num}</div>
                      <h4>{p.title}</h4>
                      <p>{p.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — image */}
              <div className="philosophy-img-wrap">
                <img src="/about-philosophy.jpg" alt="Fragrance Philosophy" />
                <div className="philosophy-quote">
                  <span>"</span>
                  <p>
                    A fragrance is the last thing you put on, yet the first
                    thing people remember.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CALL TO ACTION ───────────────────────────────────── */}
        <section className="cta-section">
          <div className="cta-inner">
            <p className="eyebrow">Begin Your Journey</p>
            <h2>
              Find your <span>signature scent</span> today
            </h2>
            <p>
              Explore our curated collections — from bold oud-driven
              masculines to soft floral feminines — and discover the
              fragrance that was made for you.
            </p>
            <div className="cta-buttons">
              <Link to="/shop" className="cta-btn-primary">
                Shop Collection
              </Link>
              <Link to="/contact" className="cta-btn-secondary">
                Get In Touch
              </Link>
            </div>
          </div>
        </section>

      </div>

      <Footer />
    </>
  );
}
