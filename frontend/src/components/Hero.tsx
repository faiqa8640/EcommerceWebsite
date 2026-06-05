import { Link } from "react-router-dom";


export default function Hero() {
  return (
    <>
      <style>{`
        .hero {
          min-height: 90vh;
          background: linear-gradient(
            135deg,
            #111844 0%,
            #182055 50%,
            #111844 100%
          );
          display: flex;
          align-items: center;
          position: relative;
          overflow: hidden;
        }

        .hero::before {
          content: "";
          position: absolute;
          width: 600px;
          height: 600px;
          background: rgba(75, 86, 148, 0.15);
          border-radius: 50%;
          top: -200px;
          right: -150px;
          filter: blur(120px);
        }

        .hero::after {
          content: "";
          position: absolute;
          width: 500px;
          height: 500px;
          background: rgba(114, 136, 174, 0.12);
          border-radius: 50%;
          bottom: -200px;
          left: -150px;
          filter: blur(120px);
        }

        .hero-container {
          max-width: 1200px;
          margin: auto;
          width: 100%;
          padding: 2rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          gap: 4rem;
          position: relative;
          z-index: 2;
        }

        .hero-subtitle {
          color: #7288AE;
          text-transform: uppercase;
          letter-spacing: 0.3em;
          font-size: 0.8rem;
          margin-bottom: 1rem;
        }

        .hero-title {
          color: #EAE0CF;
          font-size: 4.5rem;
          line-height: 1;
          margin-bottom: 1.5rem;
          font-family: "Cormorant Garamond", serif;
          font-weight: 300;
        }

        .hero-title span {
          display: block;
          background: linear-gradient(
            90deg,
            #7288AE,
            #EAE0CF
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-description {
          color: rgba(234,224,207,0.8);
          font-size: 1.05rem;
          line-height: 1.8;
          max-width: 550px;
          margin-bottom: 2rem;
        }

        .hero-buttons {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          margin-bottom: 3rem;
        }

        .btn-primary {
          text-decoration: none;
          padding: 1rem 2rem;
          background: linear-gradient(
            135deg,
            #4B5694,
            #7288AE
          );
          color: #EAE0CF;
          border-radius: 10px;
          font-size: 0.85rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          transition: 0.3s;
        }

        .btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 25px rgba(75,86,148,.4);
        }

        .btn-secondary {
          text-decoration: none;
          padding: 1rem 2rem;
          border: 1px solid #7288AE;
          color: #EAE0CF;
          border-radius: 10px;
          font-size: 0.85rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          transition: 0.3s;
        }

        .btn-secondary:hover {
          background: rgba(114,136,174,0.15);
        }

        .hero-stats {
          display: flex;
          gap: 3rem;
        }

        .hero-stat h3 {
          color: #EAE0CF;
          font-size: 2rem;
          margin-bottom: .3rem;
        }

        .hero-stat p {
          color: #7288AE;
          font-size: .85rem;
          text-transform: uppercase;
          letter-spacing: .1em;
        }

        .hero-image-wrapper {
          position: relative;
          display: flex;
          justify-content: center;
        }

        .hero-image-glow {
          position: absolute;
          width: 450px;
          height: 450px;
          background: radial-gradient(
            circle,
            rgba(114,136,174,.35),
            transparent 70%
          );
          border-radius: 50%;
          filter: blur(60px);
          z-index: 0;
        }

        .hero-image {
          position: relative;
          width: 350px;
          height: 470px;
          z-index: 2;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(114, 136, 174, 0.15);
          animation: float 5s ease-in-out infinite;
        }

        .hero-image img {
          width: 100%;
          object-fit: contain;
          display: block;
        }

        .floating-card {
          position: absolute;
          bottom: 30px;
          left: -60px;
          background: rgba(234,224,207,0.08);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(114,136,174,0.25);
          padding: 1rem 1.4rem;
          z-index: 3;
          border-radius: 14px;
        }

        .floating-card p:first-child {
          color: #7288AE;
          font-size: .7rem;
          text-transform: uppercase;
          letter-spacing: .15em;
        }

        .floating-card p:last-child {
          color: #EAE0CF;
          font-size: 1.1rem;
          margin-top: .3rem;
        }

        @keyframes float {
          0%,100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }

        @media(max-width:900px){
          .hero-container{
            grid-template-columns:1fr;
            text-align:center;
          }

          .hero-description{
            margin-left:auto;
            margin-right:auto;
          }

          .hero-buttons,
          .hero-stats{
            justify-content:center;
          }

          .hero-title{
            font-size:3rem;
          }

          .floating-card{
            display:none;
          }
        }
      `}</style>

      <section className="hero">
        <div className="hero-container">
          {/* Left Side */}
          <div>
            <p className="hero-subtitle">Luxury Fragrance Collection</p>

            <h1 className="hero-title">
              Discover Your
              <span>Signature Scent</span>
            </h1>

            <p className="hero-description">
              Experience the art of perfumery with Eloura. Each fragrance is
              crafted to capture elegance, sophistication, and unforgettable
              moments in every drop.
            </p>

            <div className="hero-buttons">
              <Link to="/shop" className="btn-primary">
                Shop Collection
              </Link>

              <Link to="/about" className="btn-secondary">
                Our Story
              </Link>
            </div>

            <div className="hero-stats">
              <div className="hero-stat">
                <h3>50+</h3>
                <p>Luxury Scents</p>
              </div>

              <div className="hero-stat">
                <h3>10K+</h3>
                <p>Happy Customers</p>
              </div>

              <div className="hero-stat">
                <h3>100%</h3>
                <p>Authentic</p>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="hero-image-wrapper">
            <div className="hero-image-glow"></div>

            <div className="hero-image">
              <img src="/logo.jpg" alt="Eloura Perfume" />
            </div>

            <div className="floating-card">
              <p>Featured Collection</p>
              <p>Essence 2026</p>
            </div>
          </div>
        </div>
      </section>

      {/* COMMENTS 
      position : relative -> means that everything will remain inside the container
      without it -> the element in it can flow outside
      grid->split the into 2 portions
      btn-primary - more important button
      btn-secondary - less important button 
      z-index:number ->it decide that which element will come on the top of the other element 
      -> the higher the number -> that element will comes in front 
      ->if lower element then it will goes to behind
      position: absolute means that it can come outside also 
      z only when the element has a position relative , absolute etc .,. it dont work with the static element
      @keyframes float -> is used for the animation -> this create a floating of element
      0%->start ->element in the normal position , 50%(middle)->move the element up by 15px ,100%(end)->move the element back to the original position
      this keep remaining and create the floating effect
      i use to repeat the loop forever
      @media(max-width:900px)-> is used for the responsive design
      it apply these changes when the screen width is 900px or smaller-> is used for the phones
      grid-template-columns:1fr-> before the element appear left and right after it -> it appears top and bottom on phone-> everything becomes vertical
      */}
    </>
  );
}