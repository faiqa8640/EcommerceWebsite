export default function ServicesAndReviews(){
  type Service = {
    title: string;
    desc: string;
  };

  type Review = {
    name: string;
    image: string;
    review: string;
  };

  const services: Service[] = [
    // array for service
    {
      title: "Premium Fragrances",
      desc: "Crafted with high-quality exotic ingredients for long-lasting scent.",
    },
    {
      title: "Luxury Packaging",
      desc: "Elegant bottles designed to reflect true sophistication.",
    },
    {
      title: "Fast Delivery",
      desc: "Quick and secure delivery across all major cities.",
    },
    {
      title: "Authentic Quality",
      desc: "100% original perfumes with guaranteed longevity.",
    },
  ];

  const reviews: Review[] = [
    // array for reviews
    {
      name: "Zia Arshad",
      image: "/reviews/review1.jpg",
      review:
        "Absolutely love the fragrance quality. The scent lasts all day and feels incredibly luxurious.",
    },
    {
      name: "Ayesha Khan",
      image: "/reviews/review2.jpg",
      review:
        "Beautiful packaging and amazing perfume collection. Definitely my new favorite brand.",
    },
    {
      name: "Hussain Ali",
      image: "/reviews/review3.jpg",
      review:
        "The fragrance is elegant and sophisticated. I receive compliments everywhere I go.",
    },
  ];

  return (
    <>
      <style>{`
        .section {
          background: #eae0cfd6; 
          padding: 1.5rem 2rem 5rem;
        }

        .container {
          max-width: 1200px;
          margin: auto;
        }

        /* TITLE */

        .title {
          font-size: 2.2rem;
          font-family: "Cormorant Garamond", serif;
          color: #111844;
          margin-bottom: 2rem;
          letter-spacing: 0.1em;
        }

        .title span {
          color: #4B5694;
        }

        /* SERVICES */

        .services-wrapper {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6rem;
          align-items: center;
          margin-bottom: 6rem;
        }

        .services-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.2rem;
        }

        .service-card {
          background: linear-gradient(
            135deg,
            #111844,
            #4B5694
          );

          padding: 1.8rem;
          border-radius: 18px;
          color: #EAE0CF;
          border: 1px solid rgba(114,136,174,0.25);

          box-shadow: 0 12px 30px rgba(17,24,68,0.25);

          transition: all 0.35s ease;

          position: relative;
          overflow: hidden;
        }

        .service-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 45px rgba(17,24,68,0.35);
        }

        .service-badge {
          display: inline-block;
          font-size: 1rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;

          padding: 6px 14px;
          border-radius: 999px;

          background: rgba(234,224,207,0.12);
          margin-bottom: 1rem;
        }

        .service-card h3 {
          font-size: 1rem;
          margin-bottom: 0.6rem;
        }

        .service-card p {
          font-size: 0.85rem;
          line-height: 1.6;
          opacity: 0.95;
        }

        .service-line {
          width: 50px;
          height: 2px;
          background: #EAE0CF;
          margin-top: 1.2rem;
          opacity: 0.6;
        }

        .service-image {
          display: flex;
          justify-content: center;
        }

        .service-image img {
          width: 100%;
          max-width: 420px;
          border-radius: 24px;
          box-shadow: 0 20px 50px rgba(17,24,68,0.25);
          transition: 0.4s;
        }

        .service-image img:hover {
          transform: scale(1.04);
        }

        /* REVIEWS */

        .sub-title {
          font-size: 2rem;
          color: #111844;
          margin-bottom: 2rem;
          font-family: "Cormorant Garamond", serif;
        }

        .sub-title span {
          color: #4B5694;
        }

        .reviews-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .review-card {
          background: linear-gradient(
            135deg,
            #111844,
            #4B5694
          );

          border-radius: 18px;
          padding: 2rem;
          color: #EAE0CF;

          position: relative;
          overflow: hidden;

          border: 1px solid rgba(114,136,174,0.25);

          box-shadow: 0 12px 30px rgba(17,24,68,0.25);

          transition: all 0.35s ease;
        }

        .review-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 45px rgba(17,24,68,0.35);
        }

        .quote-mark {
          position: absolute;
          top: 15px;
          right: 20px;

          font-size: 5rem;
          opacity: 0.08;
          font-family: serif;
        }

        .review-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .review-avatar {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid rgba(234,224,207,0.3);
        }

        .review-name {
          font-size: 1rem;
          font-weight: 500;
          margin-bottom: 0.35rem;
        }

        .review-stars {
          color: #EAE0CF;
          letter-spacing: 2px;
          font-size: 0.95rem;
        }

        .review-divider {
          width: 50px;
          height: 2px;
          background: #EAE0CF;
          opacity: 0.6;
          margin-bottom: 1rem;
        }

        .review-text {
          font-size: 0.9rem;
          line-height: 1.8;
          opacity: 0.95;
        }

        @media (max-width: 900px) {
          .services-wrapper {
            grid-template-columns: 1fr;
          }

          .service-image {
            order: -1;
          }

          .reviews-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <section className="section">
        <div className="container">

          <h2 className="title">
            Our <span>Services</span>
          </h2>

          <div className="services-wrapper">

            <div className="services-grid">

              {services.map((service: Service, i: number) => (
                <div className="service-card" key={i}>
                  <div className="service-badge">
                    {["Luxury", "Premium", "Fast", "Trusted"][i]}
                  </div>

                  <h3>{service.title}</h3>
                  <p>{service.desc}</p>

                  <div className="service-line"></div>
                </div>
              ))}

            </div>

            <div className="service-image">
              <img src="/services.jpg" alt="Eloura Services" />
            </div>

          </div>

          <h2 className="sub-title">
            Customer <span>Reviews</span>
          </h2>

          <div className="reviews-grid">
            {reviews.map((review: Review, index: number) => (
              <div className="review-card" key={index}>
                <div className="quote-mark">"</div>

                <div className="review-header">
                  <img
                    src={review.image}
                    alt={review.name}
                    className="review-avatar"
                  />

                  <div>
                    <div className="review-name">
                      {review.name}
                    </div>

                    <div className="review-stars">
                      ★★★★★
                    </div>
                  </div>
                </div>

                <div className="review-divider"></div>

                <div className="review-text">
                  {review.review}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* COMMENTS:
      grid-template-columns: repeat(3, 1fr);
      -> it makes three review cards in one row

      service-image { order: -1; }
      -> image appears first on mobile
      */}
    </>
  );
}