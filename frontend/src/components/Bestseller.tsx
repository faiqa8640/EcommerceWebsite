import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Product } from "../types"; // Core Data Blueprint interface
import { fetchProducts } from "../data/apiService"; // API stream layer

export default function BestSellers() {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const getLiveBestSellers = async () => {
      try {
        setIsLoading(true);
        // Passing an empty string pulls all store items across every category
        const allItems = await fetchProducts("");
        
        // Filter down to show products marked as best sellers in MongoDB
        const filteredBestsellers = allItems.filter(p => 
          p.badge?.toLowerCase().includes("best") || 
          p.badge?.toLowerCase().includes("popular") ||
          ["Allure Homme", "Irresistible", "Amber Bloom"].includes(p.name) // Fallback matching your favorites list
        );

        // If your database seeds don't have badges yet, fall back gracefully to the first 5 entries
        setProducts(filteredBestsellers.length > 0 ? filteredBestsellers : allItems.slice(0, 6));
      } catch (err) {
        console.error("Failed to fetch live trending collection items:", err);
      } finally {
        setIsLoading(false);
      }
    };

    getLiveBestSellers();
  }, []);

  const scroll = (direction: "left" | "right"): void => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <style>{`
        .best-section {
          background: #eae0cfd6; 
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

        .best-card-link {
          text-decoration: none;
          color: inherit;
          display: block;
        }

        .product-card {
          min-width: 240px;
          max-width: 240px;
          background: rgba(255,255,255,0.6);
          border: 1px solid rgba(75,86,148,0.2);
          border-radius: 18px;
          padding: 1rem;
          backdrop-filter: blur(10px);
          transition: 0.3s;
          height: 100%;
          box-sizing: border-box;
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
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
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

          {/* Products Row Slider */}
          {isLoading ? (
            <div style={{ textAlign: "center", padding: "2rem", fontFamily: "Cormorant Garamond", fontSize: "1.2rem", color: "#4B5694" }}>
              Polling current store favorites...
            </div>
          ) : (
            <div className="products-row" ref={scrollRef}>
              {products.map((p: Product) => (
                <Link 
                  key={p.id} 
                  to={`/shop/all/${p.id}`} 
                  className="best-card-link"
                >
                  <div className="product-card">
                    {/* Maps image arrays from MongoDB correctly */}
                    <img src={p.images?.[0] } alt={p.name} className="product-img" />
                    <div className="product-name">{p.name}</div>
                    <div className="product-price">{p.price}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}