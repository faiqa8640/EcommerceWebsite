export default function Categories(){
  type Category = {
    title: string;
    desc: string;
    img: string;
  };

  const categories: Category[] = [
    // array of the categories
    {
      title: "Women Perfumes",
      desc: "Soft floral and elegant long-lasting fragrances.",
      img: "/categories/women.jpg",
    },
    {
      title: "Men Perfumes",
      desc: "Bold, strong and luxury masculine scents.",
      img: "/categories/men.jpg",
    },
    {
      title: "Unisex Collection",
      desc: "Balanced fragrances perfect for everyone.",
      img: "/categories/unisex.jpg",
    },
    {
      title: "Luxury Exclusive",
      desc: "Premium rare perfumes for special occasions.",
      img: "/categories/luxury.jpg",
    },
  ];

  return (
    <>
      <style>{`
        .category-section {
          background: #EAE0CF;
          padding: 2rem 2rem;
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

          background: linear-gradient(
            115deg,
            #070f4ecc 8%,
            #ffffffb5
          );
          

          box-shadow: 0 18px 40px rgba(17,24,68,0.25);

          cursor: pointer;

          transition: all 0.4s ease;
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
            {categories.map((cat: Category, i: number) => (
              <div className="category-card" key={i}>
                <img src={cat.img} alt={cat.title} />

                <div className="overlay"></div>

                <div className="badge">Explore</div>

                <div className="content">
                  <h3>{cat.title}</h3>
                  <p>{cat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMMENTS:
      .map -> display all the boxes one after another including all the content 
      linear-gradient -> it makes colors fade with each other 
      overlay -> it is the dark layer on top of image
      */}
    </>
  );
}