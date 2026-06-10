// Category page — shows all products for a given category slug

import { Link, useParams, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "../components/header";
import Footer from "../components/Footer";
import {
  getProductsByCategory,
  getCategoryBySlug,
  getAverageRating,
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

  // State to handle mobile filter visibility
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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

  const [selectedRating, setSelectedRating] = useState(0);// ranking 


  const [selectedBrands, setSelectedBrands] = useState<string[]>([]); // filter based on the brand
  const allBrands = [...new Set(baseItems.map(p => p.brand))];

  const [maxPrice, setMaxPrice] = useState(100000); // keep track of max price

  // get the highest price from  the products 
  const highestPrice = Math.max(
  ...baseItems.map(p => p.priceNum));

  const filteredItems = baseItems
    .filter(p =>
      searchQuery.trim()
        ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) || // based  on the search filter
          p.shortDesc.toLowerCase().includes(searchQuery.toLowerCase())
        : true
    )
    .filter(p => p.priceNum <= maxPrice) // based on the price
    .filter(p => // based on the brand
      selectedBrands.length === 0
        ? true
        : selectedBrands.includes(p.brand)
    )
    .filter(p => // based on the ranking
      selectedRating === 0 ||
      getAverageRating(p) >= selectedRating
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

        /* ── LAYOUT CONTENT CONTAINER ────────────────────── */
        .cat-main-wrapper {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }
        
        .cat-layout {
          display: flex;
          gap: 2rem;
          align-items: flex-start;
        }

        .filter-bar {
          width: 220px;
          padding: 1.5rem;
          background: rgba(255,255,255,0.5);
          border: 1px solid rgba(75,86,148,0.2);
          position: relative;
          font-family: 'Cormorant Garamond', serif;
          flex-shrink: 0;
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

        .filter-btn {
          background: #111844;
          border: 1px solid rgba(75,86,148,0.2);
          font-size: 0.8rem;
          color: rgba(255,255,255,0.9);
          padding-top: 8px;
          padding-bottom: 8px;
          border-radius: 1100px;
          cursor: pointer;
          transition: all 0.25s ease;
          width: 100%;
          text-align: center;
        }

        .filter-btn:hover {
          background: #1118442f;
          color: #111844;
          transform: translateY(-1px);
        }

        .filter-bar input[type="checkbox"] {
          appearance: none;
          width: 12px;
          height: 12px;
          border: 2px solid #111844;
          border-radius: 50%;
          display: inline-block;
          position: relative;
          cursor: pointer;
          vertical-align: middle;
          margin-top: -2px;
        }

        .filter-bar input[type="checkbox"]:checked {
          background-color: #1118442f;
        }

        .rating-option input[type="radio"] {
          display: none;
        }

        .rating-option {
          display: block;
          padding: 8px 12px;
          margin-bottom: 8px;
          border: 1px solid rgba(75,86,148,0.2);
          border-radius: 999px;
          cursor: pointer;
          transition: all 0.25s ease;
          background: transparent;
        }

        .rating-option:hover {
          background: #111844;
          color: #EAE0CF;
        }

        /* Mobile specific close block inside the filter bar */
        .mobile-close-container {
          display: none;
        }

        /* Mobile filter floating button style */
        .mobile-filter-trigger {
          display: none;
        }

        /* ── PRODUCT GRID ────────────────────────────────── */
        .cat-body {
          flex: 1;
          padding: 4rem 0 6rem;
          min-width: 0;
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
          height: 100%;
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

        /* ── BREAKPOINTS FOR RESPONSIVE SLIDE MODAL ── */
        @media (min-width: 768px) {
          .filter-bar {
            position: sticky;
            top: 20px;
            height: fit-content;
          }
        }

        @media (max-width: 1024px) {
          .product-grid { grid-template-columns: repeat(3, 1fr); }
        }

        @media (max-width: 768px) {
          .cat-main-wrapper { padding: 0 1rem; }
          .cat-layout {
            flex-direction: column;
            gap: 0rem;
          }
          
          /* Display sticky container for "Apply Filters" on mobile */
          .mobile-filter-trigger {
            display: block;
            padding: 1rem 0;
            text-align: center;
          }
          
          .mobile-filter-trigger button {
            background: #111844;
            color: #EAE0CF;
            border: 1px solid #111844;
            padding: 10px 24px;
            border-radius: 999px;
            font-size: 0.8rem;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            font-family: 'Jost', sans-serif;
            cursor: pointer;
            width: 100%;
          }

          /* Convert your original filter-bar into a slide up action tray */
          .filter-bar {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            max-height: 80vh;
            background: #EAE0CF; /* Matches background */
            border-top: 1px solid rgba(75,86,148,0.3);
            border-left: none;
            border-right: none;
            border-bottom: none;
            z-index: 1000;
            box-sizing: border-box;
            overflow-y: auto;
            padding: 2rem 1.5rem;
            
            /* Toggle functionality handling */
            transform: translateY(${isFilterOpen ? "0%" : "100%"});
            transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            box-shadow: 0 -10px 30px rgba(17,24,68,0.15);
          }

          .mobile-close-container {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 1rem;
          }

          .mobile-close-btn {
            background: transparent;
            border: none;
            font-size: 1.2rem;
            color: #111844;
            cursor: pointer;
            font-family: 'Jost', sans-serif;
            text-transform: uppercase;
            letter-spacing: 0.1em;
          }

          .cat-body {
            padding: 1rem 0 4rem;
          }
          .product-grid { grid-template-columns: repeat(2, 1fr); }
          .about-hero-text {
            left: 20px;
            bottom: 40px;
          }
          .search-result-inner {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.8rem;
          }
        }

        @media (max-width: 480px) {
          .product-grid { grid-template-columns: 1fr; }
          .about-hero {
            height: 80vh;
          }
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

        {/* Search result banner */}
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

        <div className="cat-main-wrapper">
          
          {/* Apply Filters mobile toggle button block */}
          <div className="mobile-filter-trigger">
            <button onClick={() => setIsFilterOpen(true)}>
              Apply Filters
            </button>
          </div>

          <div className="cat-layout">
            
            {/* Filter Bar with Mobile Slide Modal Toggle Logic */}
            <aside className="filter-bar">
              <div className="mobile-close-container">
                <button className="mobile-close-btn" onClick={() => setIsFilterOpen(false)}>
                  ✕
                </button>
              </div>

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
                <button className="filter-btn" onClick={() => { setMaxPrice(2000); setIsFilterOpen(false); }}>Under PKR 2000</button>
                <button className="filter-btn" onClick={() => { setMaxPrice(5000); setIsFilterOpen(false); }}>Under PKR 5000</button>
                <button className="filter-btn" onClick={() => { setMaxPrice(10000); setIsFilterOpen(false); }}>Under PKR 10000</button>
              </div>

              {/* brand filter */}
              <h3 style={{ marginTop: "30px" }}>Select Brand</h3>
              {allBrands.map((brand) => (
                <label key={brand} style={{ display: "block", marginBottom: "6px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedBrands([...selectedBrands, brand]);
                      } else {
                        setSelectedBrands(
                          selectedBrands.filter((b) => b !== brand)
                        );
                      }
                    }}
                  />
                  {" "}{brand}
                </label>
              ))}

              {/* ranking filtering */}
              <h3 className="filter-title">Rating</h3>
              <label className="rating-option">
                <input
                  type="radio"
                  name="rating"
                  checked={selectedRating === 4.5}
                  onChange={() => { setSelectedRating(5); setIsFilterOpen(false); }}
                />
                ⭐⭐⭐⭐⭐
              </label>
              <label className="rating-option">
                <input
                  type="radio"
                  name="rating"
                  checked={selectedRating === 4}
                  onChange={() => { setSelectedRating(4); setIsFilterOpen(false); }}
                />
                ⭐⭐⭐⭐
              </label>

              <label className="rating-option">
                <input
                  type="radio"
                  name="rating"
                  checked={selectedRating === 3}
                  onChange={() => { setSelectedRating(3); setIsFilterOpen(false); }}
                />
                ⭐⭐⭐
              </label>

              <label className="rating-option">
                <input
                  type="radio"
                  name="rating"
                  checked={selectedRating === 2}
                  onChange={() => { setSelectedRating(2); setIsFilterOpen(false); }}
                />
                ⭐⭐
              </label>

              <label className="rating-option">
                <input
                  type="radio"
                  name="rating"
                  checked={selectedRating === 1}
                  onChange={() => { setSelectedRating(1); setIsFilterOpen(false); }}
                />
                ⭐
              </label>

              <label className="rating-option">
                <input
                  type="radio"
                  name="rating"
                  checked={selectedRating === 0}
                  onChange={() => { setSelectedRating(0); setIsFilterOpen(false); }}
                />
                All Ratings
              </label>
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

                  {/* Pagination */}
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
      </div>
      <Footer />
    </>
  );
}