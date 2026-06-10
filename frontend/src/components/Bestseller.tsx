import {useRef } from "react";

type Product = {
  name: string;
  img: string;
  price: string;
};

export default function BestSellers(){
  const scrollRef = useRef<HTMLDivElement | null>(null); 
  // is used to scroll the object row -> as we need scrolling of the object 

  const products: Product[] = [
    // array of the products along with their prices
    { name: "Allure Homme", img: "/perfumes/p1-1.jpg", price: "PKR 8,500" },
    { name: "Irresistible", img: "/perfumes/p2-1.jpg", price: "PKR 9,200" },
    { name: "Amber Bloom", img: "/perfumes/p3.jpg", price: "PKR 7,800" },
    { name: "Rose Mystique", img: "/perfumes/p4.jpg", price: "PKR 8,000" },
    { name: "Golden Musk", img: "/perfumes/p5.jpg", price: "PKR 9,500" },
  ];

  const scroll = (direction: "left" | "right"): void => {
    // the product row is moved horizontally
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        // if left is clicked then move -300px else +300px
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <style>{`
        .best-section {
          background: #EAE0CF;
          padding: 5rem 2rem;
          position: relative;
        }

        .best-container {
          max-width: 1300px;
          margin: auto;
        }

        .best-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2.5rem;
        }

        .best-title {
          font-size: 2.2rem;
          font-family: "Cormorant Garamond", serif;
          color: #111844;
          letter-spacing: 0.1em;
        }

        .best-title span {
          color: #4B5694;
        }

        .arrow-btns {
          display: flex;
          gap: 10px;
        }

        .arrow {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          border: 1px solid #4B5694;
          background: transparent;
          color: #111844;
          cursor: pointer;
          transition: 0.3s;
          font-size: 18px;
        }

        .arrow:hover {
          background: #4B5694;
          color: #EAE0CF;
          transform: scale(1.05);
        }

        .products-row {
          display: flex;
          gap: 1.5rem;
          overflow-x: auto;
          scroll-behavior: smooth;
          padding-bottom: 1rem;
        }

        .products-row::-webkit-scrollbar {
          display: none;
        }

        .product-card {
          min-width: 240px;
          background: rgba(255,255,255,0.6);
          border: 1px solid rgba(75,86,148,0.2);
          border-radius: 18px;
          padding: 1rem;
          backdrop-filter: blur(10px);
          transition: 0.3s;
        }

        .product-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 35px rgba(17,24,68,0.15);
        }

        .product-img {
          width: 100%;
          height: 220px;
          object-fit: cover;
          border-radius: 14px;
          margin-bottom: 1rem;
        }

        .product-name {
          color: #111844;
          font-size: 1rem;
          font-weight: 500;
          letter-spacing: 0.05em;
        }

        .product-price {
          color: #4B5694;
          font-size: 0.85rem;
          margin-top: 0.3rem;
        }
      `}</style>

      <section className="best-section">
        <div className="best-container">
          {/* Header */}
          <div className="best-header">
            <h2 className="best-title">
              Best <span>Selling</span> Perfumes
            </h2>

            <div className="arrow-btns">
              <button className="arrow" onClick={() => scroll("left")}>
                ←
              </button>
              <button className="arrow" onClick={() => scroll("right")}>
                →
              </button>
            </div>
          </div>

          {/* Products */}
          <div className="products-row" ref={scrollRef}>
            {products.map((p: Product, i: number) => (
              <div className="product-card" key={i}>
                <img src={p.img} alt={p.name} className="product-img" />
                <div className="product-name">{p.name}</div>
                <div className="product-price">{p.price}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMMENTS:
      overflow-x:auto -> it enables horizontal scrolling
      .products-row::-webkit-scrollbar-> display none-> it hide the ugly scrollbar
      transform :->it is used to lift up the cards
      .map-> loop on the array and it display each flex box one by one this is BestSellers.tsx
      */}
    </>
  );
}