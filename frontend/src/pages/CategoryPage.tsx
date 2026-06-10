// Category page — shows all products for a given category slug

import { Link, useParams, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "../components/header";
import Footer from "../components/Footer";
import {
  getProductsByCategory,
  getCategoryBySlug,
} from "../data/productsData";

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const location = useLocation();

  // Read search query from URL (set by header search)
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("search") || "";

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const cat = getCategoryBySlug(category ?? "");

  // Reset to page 1 whenever the search query or category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, category]);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  // Unknown category → back to shop
  if (!cat) return <Navigate to="/shop" replace />;

  // Get products for this category (getProductsByCategory handles "all" too)
  const baseItems = getProductsByCategory(category ?? "");

  const [maxPrice, setMaxPrice] = useState(100000); // keep track of max price

  // get the highest price from  the products 
  const highestPrice = Math.max(
  ...baseItems.map(p => p.priceNum));

  const filteredItems = (searchQuery.trim()
  ? baseItems.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.shortDesc.toLowerCase().includes(searchQuery.toLowerCase())
    )
  : baseItems
).filter(
  (p) =>
    p.priceNum <= maxPrice
);

    //pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);// tells us the total pages 
  const startIndex = (currentPage - 1) * itemsPerPage; // will give the starting index of each page
  const paginatedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage); // slice the items in each page

  return (
    <>
      <style>{`
        .cat-page {
          background: #EAE0CF;
          min-height: 100vh;
          font-family: 'Jost', sans-serif;
        }

        .about-hero {
          position: relative;
          margin-top: -300px;
          padding-top: 100px;
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

        .detail-breadcrumb-bar {
          background: #11184452;
          padding: 1rem 2rem;
        }

        .detail-breadcrumb {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.9rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #EAE0CF;
        }

        .detail-breadcrumb a {
          color: #EAE0CF;
          text-decoration: none;
          transition: color 0.2s;
        }

        .detail-breadcrumb a:hover { color: rgba(17,24,68,0.5); }
        .detail-breadcrumb span { color: #EAE0CF; }

        /* ── SEARCH BANNER ───────────────────────────────── */
        .search-result-banner {
          background: rgba(17,24,68,0.07);
          border-bottom: 1px solid rgba(75,86,148,0.15);
          padding: 1rem 2rem;
        }

        .search-result-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }

        .search-result-text {
          font-size: 0.82rem;
          letter-spacing: 0.12em;
          color: #4B5694;
        }

        .search-result-text strong {
          color: #111844;
        }

        .search-clear-btn {
          font-size: 0.72rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #4B5694;
          text-decoration: none;
          border: 1px solid rgba(75,86,148,0.3);
          padding: 5px 12px;
          border-radius: 999px;
          transition: 0.25s;
        }

        .search-clear-btn:hover {
          background: #111844;
          color: #EAE0CF;
          border-color: #111844;
        }

        
        .cat-layout {
          display: flex;
          gap: 2rem;
          align-items: stretch;
        }

        .filter-bar {
          width: 220px;
          padding: 1.5rem;
          background: rgba(255,255,255,0.5);
          border: 1px solid rgba(75,86,148,0.2);
          position:relative;
          font-family: 'Cormorant Garamond', serif
        }

        
        .filter-bar input[type="range"] {
          width: 100%;
          accent-color: #111844;
        }

        .filter-bar h3 {
          font-family: 'Cormorant Garamond', serif;
          margin-bottom: 10px;
          font-size: 14px;
          letter-spacing: 2px;
          color: #1a2779f6;
          text-transform: uppercase;
        }

        .filter-btn{
          background: #111844;
          border: 1px solid rgba(75,86,148,0.2);
          font-size: 0.8rem;
          color: rgba(255,255,255,0.9);
          padding-top: 8px;
          padding-bottom: 8px;
          border-radius: 1100px;
          cursor: pointer;
          transition: all 0.25s ease;
 
        }

        .filter-btn:hover {
          background: #1118442f;
          color: #111844;
          transform: translateY(-1px);
        }
        /* ── PRODUCT GRID ────────────────────────────────── */
        .cat-body {
          max-width: 1200px;
          margin: 0 auto;
          padding: 4rem 2rem 6rem;
          flex: 1;
        }

        .cat-count {
          font-size: 0.78rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(17,24,68,0.5);
          margin-bottom: 2.5rem;
        }

        .no-results {
          text-align: center;
          padding: 5rem 2rem;
          color: rgba(17,24,68,0.5);
        }

        .no-results h3 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.8rem;
          color: #111844;
          margin-bottom: 0.8rem;
        }

        .no-results p {
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
        }

        .no-results a {
          display: inline-block;
          padding: 10px 24px;
          background: #111844;
          color: #EAE0CF;
          text-decoration: none;
          border-radius: 8px;
          font-size: 0.78rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          transition: 0.25s;
        }

        .no-results a:hover {
          background: #4B5694;
        }

        .product-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.6rem;
        }

        .product-card-link {
          text-decoration: none;
          display: block;
        }

        .product-card {
          background: rgba(255,255,255,0.6);
          border: 1px solid rgba(75,86,148,0.18);
          border-radius: 18px;
          overflow: hidden;
          backdrop-filter: blur(10px);
          transition: transform 0.32s ease, box-shadow 0.32s ease;
        }

        .product-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 18px 45px rgba(17,24,68,0.16);
        }

        .product-card-img {
          position: relative;
          height: 220px;
          overflow: hidden;
          background: linear-gradient(135deg, #1a245c, #111844);
        }

        .product-card-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .product-card:hover .product-card-img img {
          transform: scale(1.07);
        }

        .product-card-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background: rgba(17,24,68,0.82);
          color: #EAE0CF;
          font-size: 0.6rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 999px;
        }

        .product-card-body {
          padding: 1.2rem 1.2rem 1.4rem;
        }

        .product-card-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.15rem;
          color: #111844;
          font-weight: 400;
          margin-bottom: 0.4rem;
        }

        .product-card-desc {
          font-size: 0.8rem;
          color: rgba(17,24,68,0.62);
          line-height: 1.6;
          margin-bottom: 1rem;
        }

        .product-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .product-card-price {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.1rem;
          color: #4B5694;
          font-weight: 500;
        }

        .product-card-btn {
          font-size: 0.65rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #111844;
          border: 1px solid rgba(17,24,68,0.3);
          padding: 6px 14px;
          border-radius: 999px;
          transition: 0.25s;
        }

        .product-card:hover .product-card-btn {
          background: #111844;
          color: #EAE0CF;
          border-color: #111844;
        }

        /* ── PAGINATION ──────────────────────────────────── */
        .pagination {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-top: 3rem;
        }

        .pagination button {
          padding: 8px 14px;
          border-radius: 8px;
          border: 1px solid rgba(75,86,148,0.4);
          background: transparent;
          cursor: pointer;
          transition: 0.3s;
          font-size: 0.8rem;
          color: #111844;
        }

        .pagination button:hover {
          background: #111844;
          color: #EAE0CF;
          border-color: #111844;
        }

        .pagination button.active {
          background: #111844;
          color: #EAE0CF;
          border-color: #111844;
        }

        /* ── RESPONSIVE ──────────────────────────────────── */
        @media (max-width: 1024px) {
          .product-grid { grid-template-columns: repeat(3, 1fr); }
        }

        @media (max-width: 768px) {
          .product-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 480px) {
          .product-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <Header />

      <div className="cat-page">
        {/* Banner */}
        <section className="about-hero">
          <img src={cat.bannerImg} alt={cat.label} />
          <div className="about-hero-overlay" />
          <div className="about-hero-text">
            <p className="about-hero-label">Collection</p>
            <h1 className="about-hero-title">{cat.label}</h1>
            <p>{cat.desc}</p>
          </div>
        </section>

        {/* Breadcrumb */}
        <div className="detail-breadcrumb-bar">
          <div className="detail-breadcrumb">
            <Link to="/shop">Shop</Link>
            <span>/</span>
            <span>{cat.label}</span>
          </div>
        </div>

        {/* Search result banner — only shown when searching */}
        {searchQuery.trim() && (
          <div className="search-result-banner">
            <div className="search-result-inner">
              <p className="search-result-text">
                Showing results for <strong>"{searchQuery}"</strong>
                {" "}— {filteredItems.length} item{filteredItems.length !== 1 ? "s" : ""} found
              </p>
              <Link to={`/shop/${category}`} className="search-clear-btn">
                Clear Search
              </Link>
            </div>
          </div>
        )}

        
        {/* side bar for filters */}
        <div className="cat-layout">
          <aside className="filter-bar">
            <h3>Select Your Budget</h3>
            <p style={{ marginBottom: "10px" }}>Under: <b> PKR  {maxPrice}</b></p>

            <input
              type="range"
              min={0}
              max={highestPrice}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
            />

            <div style={{ marginTop: "15px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <button className= "filter-btn" onClick={() => setMaxPrice(2000)}>Under PKR 2000</button>
              <button className= "filter-btn" onClick={() => setMaxPrice(5000)}>Under PKR 5000</button>
              <button className= "filter-btn" onClick={() => setMaxPrice(10000)}>Under PKR 10000</button>
            </div>

            {/* <p>Range: {minPrice} - {maxPrice}</p> */}
          </aside>

          {/* products */}
          <section className="cat-body">
            <p className="cat-count">
              {filteredItems.length} product{filteredItems.length !== 1 ? "s" : ""} found
            </p>
            {filteredItems.length === 0 ? (
              <div className="no-results">
                <h3>No Fragrances Found</h3>
                <p>
                  No perfumes matched "{searchQuery}". Try a different search term.
                </p>
                <Link to="/shop/all">Browse All Collections</Link>
              </div>
            ) : (
              <>
                <div className="product-grid">
                  {paginatedItems.map((product) => (
                    <Link
                      key={product.id}
                      to={`/shop/${category}/${product.id}`}
                      className="product-card-link"
                    >
                      <div className="product-card">
                        <div className="product-card-img">
                          <img src={product.images[0]} alt={product.name} />
                          {product.badge && (
                            <span className="product-card-badge">{product.badge}</span>
                          )}
                        </div>
                        <div className="product-card-body">
                          <div className="product-card-name">{product.name}</div>
                          <div className="product-card-desc">{product.shortDesc}</div>
                          <div className="product-card-footer">
                            <span className="product-card-price">{product.price}</span>
                            <span className="product-card-btn">View →</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination — only show if more than one page */}
                {totalPages > 1 && (
                  <div className="pagination">
                    {Array.from({ length: totalPages }).map((_, index) => (
                      <button
                      key={index}
                      onClick={() => setCurrentPage(index + 1)}
                      className={currentPage === index + 1 ? "active" : ""}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}

          </section>

        </div>
      </div>
      <Footer />
    </>
  );
}








//         <section className="cat-body">
//           <p className="cat-count">
//             {filteredItems.length} product{filteredItems.length !== 1 ? "s" : ""} found
//           </p>

//           {filteredItems.length === 0 ? (
//             <div className="no-results">
//               <h3>No Fragrances Found</h3>
//               <p>
//                 No perfumes matched "{searchQuery}". Try a different search term.
//               </p>
//               <Link to="/shop/all">Browse All Collections</Link>
//             </div>
//           ) : (
//             <>
//               <div className="product-grid">
//                 {paginatedItems.map((product) => (
//                   <Link
//                     key={product.id}
//                     to={`/shop/${category}/${product.id}`}
//                     className="product-card-link"
//                   >
//                     <div className="product-card">
//                       <div className="product-card-img">
//                         <img src={product.images[0]} alt={product.name} />
//                         {product.badge && (
//                           <span className="product-card-badge">{product.badge}</span>
//                         )}
//                       </div>
//                       <div className="product-card-body">
//                         <div className="product-card-name">{product.name}</div>
//                         <div className="product-card-desc">{product.shortDesc}</div>
//                         <div className="product-card-footer">
//                           <span className="product-card-price">{product.price}</span>
//                           <span className="product-card-btn">View →</span>
//                         </div>
//                       </div>
//                     </div>
//                   </Link>
//                 ))}
//               </div>

//               {/* Pagination — only show if more than one page */}
//               {totalPages > 1 && (
//                 <div className="pagination">
//                   {Array.from({ length: totalPages }).map((_, index) => (
//                     <button
//                       key={index}
//                       onClick={() => setCurrentPage(index + 1)}
//                       className={currentPage === index + 1 ? "active" : ""}
//                     >
//                       {index + 1}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </>
//           )}
//         </section>
//       </div>

//       <Footer />
//     </>
//   );
// }
