import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

// Import the centralized Product type from your types.ts file
import { Product } from "../types"; 

export function Wishlist() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist() as any;
  const { addToCart } = useCart() as any;

  const handleAddToCartFromWishlist = (product: any) => {
    const baselineQuantity = 1;

    // Direct clean price parser to prevent context leakage or NaN duplication downstream
    const cleanNumericPrice = typeof product.price === 'string' 
      ? Number(product.price.replace(/[^0-9.]/g, '')) 
      : Number(product.price || 0);

    const cartPayload = {
      _id: product._id || product.id,
      name: product.name,
      price: isNaN(cleanNumericPrice) ? 0 : cleanNumericPrice,
      image: product.image || product.images?.[0],
      size: product.selectedSize || "100ml", 
    };

    addToCart(cartPayload, baselineQuantity);
    removeFromWishlist(product._id || product.id); 
  };

  return (
    <div className="wishlist-page">
      <style>{`
        .wishlist-page {
          min-height: 100vh;
          background-color: #f4efe6;
          font-family: serif;
          padding: 12px 24px 64px 24px;
          color: #1b234a;
          box-sizing: border-box;
        }

        .wishlist-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .wishlist-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 40px;
        }

        .wishlist-title {
          font-size: 28px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin-bottom: 0px;
          font-weight: 600;
          color: #1b234a;
        }

        .clear-all-btn {
          font-family: sans-serif;
          background: transparent;
          border: 1px solid rgba(27, 35, 74, 0.2);
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          cursor: pointer;
          transition: all 0.2s ease;
          color: #1b234a;
          font-weight: 600;
        }

        .clear-all-btn:hover {
          background-color: #1b234a;
          color: #ffffff;
          border-color: #1b234a;
        }

        .wishlist-empty {
          text-align: center;
          padding: 100px 20px;
        }

        .wishlist-empty p {
          font-size: 13px;
          color: #6b6661;
          margin-bottom: 32px;
          font-family: sans-serif;
          letter-spacing: 0.1em;
        }

        .explore-btn {
          display: inline-block;
          background-color: #1b234a;
          color: #ffffff;
          text-decoration: none;
          padding: 0 32px;
          height: 50px;
          line-height: 50px;
          font-family: sans-serif;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          font-weight: 600;
          border-radius: 6px;
          box-shadow: 0 4px 12px rgba(27, 35, 74, 0.15);
          transition: opacity 0.2s ease;
        }

        .explore-btn:hover {
          opacity: 0.95;
        }

        .wishlist-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 30px;
        }

        .product-card {
          background: #fcfaf7;
          border-radius: 12px;
          border: 1px solid rgba(27, 35, 74, 0.15);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          position: relative;
          box-shadow: 0 2px 8px rgba(27, 35, 74, 0.02);
          transition: transform 0.3s ease;
        }

        .image-container {
          position: relative;
          width: 100%;
          aspect-ratio: 1 / 1;
          overflow: hidden;
          background-color: #f4efe6;
          border-bottom: 1px solid rgba(27, 35, 74, 0.05);
        }

        .product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.4s ease;
        }

        .product-card:hover .product-image {
          transform: scale(1.03);
        }

        .remove-btn {
          position: absolute; 
          top: 15px; 
          right: 15px; 
          background: #fcfaf7; 
          border: 1px solid rgba(27, 35, 74, 0.1); 
          width: 34px; 
          height: 34px; 
          border-radius: 6px; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          cursor: pointer; 
          box-shadow: 0 2px 6px rgba(0,0,0,0.05); 
          color: #6b6661; 
          z-index: 5; 
          transition: all 0.2s ease;
        }

        .remove-btn:hover {
          color: #BA3C2A;
          border-color: rgba(186, 60, 42, 0.2);
          background-color: #fff;
        }

        .product-info-link {
          text-decoration: none;
          color: inherit;
          display: block;
        }

        .info-block {
          padding: 20px 20px 10px 20px;
        }

        .product-category-lbl {
          font-family: sans-serif;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #6b6661;
          margin-bottom: 4px;
          display: block;
        }

        .product-name {
          font-size: 18px;
          margin: 0 0 6px 0;
          color: #1b234a;
          font-weight: 500;
          text-transform: capitalize;
          letter-spacing: 0.02em;
        }

        .product-price {
          font-family: sans-serif;
          font-size: 14px;
          font-weight: 600;
          margin: 0;
          color: #1b234a;
        }

        .action-block {
          padding: 0 20px 20px 20px;
          margin-top: auto;
        }

        .add-to-cart-btn {
          width: 100%; 
          background-color: #1b234a; 
          color: #ffffff; 
          border: none; 
          padding: 12px; 
          border-radius: 6px; 
          font-family: sans-serif; 
          font-size: 12px; 
          text-transform: uppercase;
          letter-spacing: 0.15em;
          font-weight: 600; 
          cursor: pointer; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          gap: 8px; 
          box-shadow: 0 4px 10px rgba(27, 35, 74, 0.1);
          transition: opacity 0.2s ease;
        }

        .add-to-cart-btn:hover {
          opacity: 0.95;
        }

        @media (max-width: 768px) {
          .wishlist-page { padding: 24px 16px; }
          .wishlist-title { font-size: 22px; }
          .wishlist-grid { grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; }
        }
      `}</style>

      <div className="wishlist-container">
        
        <div className="wishlist-header">
          <h1 className="wishlist-title">Shopping Wishlist</h1>
          {wishlist && wishlist.length > 0 && (
            <button onClick={clearWishlist} className="clear-all-btn">
              Clear All
            </button>
          )}
        </div>

        {!wishlist || wishlist.length === 0 ? (
          <div className="wishlist-empty">
            <p>Your wishlist is currently empty.</p>
            <Link to="/shop" className="explore-btn">
              Explore Shop
            </Link>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlist.map((product: Product) => {
              const uniqueId = product._id || product.id;
              
              const displayImage = product.images && product.images.length > 0 
                ? product.images[0] 
                : (product as any).image;

              // FIX 1: Generate clean dynamic URL slug from your product name strings
              // Example: "Irresistible" -> "irresistible", "Amber Spice" -> "amber-spice"
              const productSlug = product.name
                ? product.name.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')
                : 'all';

              // FIX 2: Bulletproof validation for values returning fallback values instead of NaN text outputs
              let parsedPriceString = "Rs. 0";
              if (product.price) {
                const normalizedStr = product.price.toString();
                // If it already contains localized currency, use directly
                if (normalizedStr.includes('Rs') || normalizedStr.includes('PKR')) {
                  parsedPriceString = normalizedStr;
                } else {
                  // Strip everything except values and commas/decimals
                  const numbersOnly = normalizedStr.replace(/[^0-9.]/g, '');
                  const cleanNum = Number(numbersOnly);
                  parsedPriceString = isNaN(cleanNum) ? "Rs. 0" : `Rs. ${cleanNum.toLocaleString()}`;
                }
              }

              return (
                <div key={String(uniqueId)} className="product-card">
                  
                  <button
                    onClick={() => removeFromWishlist(uniqueId)}
                    className="remove-btn"
                    title="Remove from wishlist"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-16v1M4 7h16" />
                    </svg>
                  </button>

                  {/* ROUTE FIX: Redirects directly to match your custom single item location profile path */}
                  <Link to={`/shop/all/${productSlug}`} className="product-info-link">
                    <div className="image-container">
                      <img
                        src={displayImage}
                        alt={product.name}
                        className="product-image"
                      />
                    </div>
                    <div className="info-block">
                      <span className="product-category-lbl">{product.category || 'Premium Collection'}</span>
                      <h3 className="product-name">{product.name}</h3>
                      <p className="product-price">{parsedPriceString}</p>
                    </div>
                  </Link>

                  <div className="action-block">
                    <button
                      onClick={() => handleAddToCartFromWishlist(product)}
                      className="add-to-cart-btn"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 11h14l1 12H4L5 11z" />
                      </svg>
                      Add to Cart
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}