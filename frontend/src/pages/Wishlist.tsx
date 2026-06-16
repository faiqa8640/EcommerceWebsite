import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

// Import the centralized Product type from your types.ts file
import { Product } from "../types"; 

export function Wishlist() {
  // Use "as any" to bypass temporary type mismatches while context transitions to populated objects
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist() as any;
  const { addToCart } = useCart() as any;

  // Inside your Wishlist view/handler file:
  const handleAddToCartFromWishlist = (product: any) => {
    // 1. Explicitly ensure quantity is passed as a valid number 1
    const baselineQuantity = 1;

    // 2. Format the product schema to fit what CartContext expects
    const cartPayload = {
      _id: product._id,
      name: product.name,
      price: product.price, // Our updated CartContext handles messy strings cleanly now!
      image: product.image || product.images?.[0],
      size: product.selectedSize || "100ml", // Fallback default size to protect against crashes
    };

    // 3. Dispatch to your Cart Context
    addToCart(cartPayload, baselineQuantity);

    // 4. Remove it from your wishlist database backend tracking collection
    removeFromWishlist(product._id); 
  };
  return (
    <div className="wishlist-page">
      <style>{`
        .wishlist-page {
          min-height: 80vh;
          background-color: #F4F0E8;
          font-family: 'Playfair Display', Georgia, serif;
          padding: 60px 40px;
          color: #1A1A1A;
        }

        .wishlist-container {
          max-w: 7xl;
          margin: 0 auto;
        }

        .wishlist-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 40px;
        }

        .wishlist-title {
          font-size: 2.5rem;
          font-weight: 500;
          margin: 0;
          color: #111;
        }

        .clear-all-btn {
          font-family: 'Inter', sans-serif;
          background: transparent;
          border: 1px solid #D1C9BC;
          padding: 8px 16px;
          border-radius: 4px;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s ease;
          color: #333;
        }

        .clear-all-btn:hover {
          background-color: #1C1B1A;
          color: #FFF;
          border-color: #1C1B1A;
        }

        .wishlist-empty {
          text-align: center;
          padding: 100px 20px;
          font-family: 'Inter', sans-serif;
        }

        .wishlist-empty p {
          font-size: 1.1rem;
          color: #666;
          margin-bottom: 24px;
        }

        .explore-btn {
          display: inline-block;
          background-color: #1C1B1A;
          color: #FFF;
          text-decoration: none;
          padding: 12px 30px;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          transition: opacity 0.2s ease;
        }

        .explore-btn:hover {
          opacity: 0.9;
        }

        .wishlist-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 30px;
        }

        .product-card {
          background: #FFF;
          border-radius: 12px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          position: relative;
          box-shadow: 0 2px 8px rgba(0,0,0,0.02);
          transition: transform 0.3s ease;
        }

        .image-container {
          position: relative;
          width: 100%;
          aspect-ratio: 1 / 1;
          overflow: hidden;
          background-color: #EFEFEF;
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
          position: absolute; top: 15px; right: 15px; background: #FFF; border: none; width: 34px; height: 34px; border-radius: 6px; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 2px 6px rgba(0,0,0,0.1); color: #555; z-index: 5; transition: color 0.2s ease;
        }

        .remove-btn:hover {
          color: #BA3C2A;
        }

        .product-info-link {
          text-decoration: none;
          color: inherit;
          display: block;
        }

        .info-block {
          padding: 20px 20px 10px 20px;
        }

        .product-name {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.15rem;
          margin: 0 0 8px 0;
          color: #222;
          font-weight: 400;
          text-transform: lowercase;
        }

        .product-price {
          font-family: 'Inter', sans-serif;
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0;
          color: #111;
        }

        .action-block {
          padding: 0 20px 20px 20px;
          margin-top: auto;
        }

        .add-to-cart-btn {
          width: 100%; background-color: #1C1B1A; color: #FFF; border: none; padding: 12px; border-radius: 6px; font-family: 'Inter', sans-serif; font-size: 0.9rem; font-weight: 500; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: opacity 0.2s ease;
        }

        .add-to-cart-btn:hover {
          opacity: 0.95;
        }

        @media (max-width: 768px) {
          .wishlist-page { padding: 40px 20px; }
          .wishlist-title { font-size: 2rem; }
          .wishlist-grid { grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; }
        }
      `}</style>

      <div className="wishlist-container">
        
        {/* Header Area */}
        <div className="wishlist-header">
          <h1 className="wishlist-title">My Wishlist</h1>
          {wishlist && wishlist.length > 0 && (
            <button onClick={clearWishlist} className="clear-all-btn">
              Clear All
            </button>
          )}
        </div>

        {/* Empty State Fallback Check */}
        {!wishlist || wishlist.length === 0 ? (
          <div className="wishlist-empty">
            <p>Your wishlist is currently empty.</p>
            <Link to="/shop" className="explore-btn">
              Explore Shop
            </Link>
          </div>
        ) : (
          /* Wishlist Grid Display */
          <div className="wishlist-grid">
            {wishlist.map((product: Product) => {
              // Extract the unique ID from MongoDB's _id structure securely
              const uniqueId = product._id || product.id;
              
              // Handle your backend data scheme where images are stored inside an array strings
              const displayImage = product.images && product.images.length > 0 
                ? product.images[0] 
                : (product as any).image;

              return (
                <div key={String(uniqueId)} className="product-card">
                  
                  {/* Remove Overlay Button */}
                  <button
                    onClick={() => removeFromWishlist(uniqueId)}
                    className="remove-btn"
                    title="Remove from wishlist"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-16v1M4 7h16" />
                    </svg>
                  </button>

                  {/* Product Details Block */}
                  <Link to={`/shop/${product.category || "fragrance"}/${uniqueId}`} className="product-info-link">
                    <div className="image-container">
                      <img
                        src={displayImage}
                        alt={product.name}
                        className="product-image"
                      />
                    </div>
                    <div className="info-block">
                      <h3 className="product-name">{product.name}</h3>
                      <p className="product-price">
                        {product.price && (product.price.toString().startsWith('$') || product.price.toString().startsWith('Rs')) 
                          ? product.price 
                          : `Rs. ${product.price}`}
                      </p>
                    </div>
                  </Link>

                  {/* Main Action Footer */}
                  <div className="action-block">
                    <button
                      onClick={() => handleAddToCartFromWishlist(product)}
                      className="add-to-cart-btn"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
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