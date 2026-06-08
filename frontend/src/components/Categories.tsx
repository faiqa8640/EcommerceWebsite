import { Link } from "react-router-dom";
import { categories } from "../data/productsData";

export default function Categories() {
  const allowedCategories = ["men", "women", "unisex", "luxury"];

  const filteredCategories = categories.filter((cat) =>
    allowedCategories.includes(cat.slug)
  );
  return (
    <>
      <style>{`
        .category-section {
          background: #EAE0CF;
          padding: 2rem;
        }

        .container {
          max-width: 1200px;
          margin: auto;
        }

        .title {
          font-size: 2.4rem;
          font-family: "Cormorant Garamond", serif;
          color: #111844;
          margin-bottom: 3rem;
          letter-spacing: 0.12em;
        }

        .title span {
          color: #4B5694;
        }

        /* GRID */
        .category-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2rem;
        }

        /* CARD */
        .category-card {
          position: relative;
          height: 320px;
          border-radius: 22px;
          overflow: hidden;
          cursor: pointer;
          text-decoration: none;
          display: block;
          transition: all 0.4s ease;
          box-shadow: 0 18px 40px rgba(17,24,68,0.25);
          background: linear-gradient(135deg, #bfc1cd77, #1a245c);
        }

        .category-card:hover {
          transform: translateY(-12px) scale(1.02);
          box-shadow: 0 25px 60px rgba(17,24,68,0.35);
        }

        /* IMAGE */
        .category-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.25;
          transition: 0.4s;
        }

        .category-card:hover img {
          transform: scale(1.08);
          opacity: 0.6;
        }

        /* OVERLAY */
        .overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(17,24,68,0.9),
            rgba(75,86,148,0.3),
            transparent
          );
        }

        /* CONTENT */
        .content {
          position: absolute;
          bottom: 20px;
          left: 20px;
          right: 20px;
          color: #EAE0CF;
        }

        .content h3 {
          font-size: 1.5rem;
          letter-spacing: 0.08em;
          margin-bottom: 0.5rem;
        }

        .content p {
          font-size: 0.9rem;
          opacity: 0.9;
          line-height: 1.5;
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
          margin-top: 10px;
        }

        .category-card:hover .shop-cat-cta {
          gap: 0.9rem;
          color: #ffffff;
        }

        /* BADGE */
        .badge {
          position: absolute;
          top: 18px;
          left: 18px;
          background: rgba(234,224,207,0.15);
          color: #EAE0CF;
          padding: 6px 14px;
          border-radius: 999px;
          font-size: 0.75rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }

        /* RESPONSIVE */
        @media (max-width: 900px) {
          .category-grid {
            grid-template-columns: 1fr;
          }

          .category-card {
            height: 260px;
          }
        }
      `}</style>

      <section className="category-section">
        <div className="container">
          <h2 className="title">
            Perfume <span>Categories</span>
          </h2>

          <div className="category-grid">
            {filteredCategories.map((cat) => (
              <Link
                key={cat.slug}
                to={`/shop/${cat.slug}`}
                className="category-card"
              >
                <img src={cat.img} alt={cat.label} />

                <div className="overlay"></div>

                <div className="badge">Explore</div>

                <div className="content">
                  <h3>{cat.label}</h3>
                  <p>{cat.desc}</p>

                  <span className="shop-cat-cta">
                    View Collection →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}