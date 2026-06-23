import { Link, useParams, Navigate, useNavigate } from "react-router-dom"; 
import { useRef, useState, useEffect } from "react";
import Header from "../components/header";
import Footer from "../components/Footer";
import ReviewFormModal from "../components/ReviewFormModal"; 
import { Product, Category, Review } from "../types"; 
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

// ── Star rating ──────────────────
function DynamicStars({ rating }: { rating: number }) { 
  return (
    <>
      <style>{`
        .star-rating-container {
          display: inline-flex;
          gap: 2px;
          align-items: center;
        }
        .luxury-star {
          position: relative;
          display: inline-block;
          font-size: 1rem;
          color: rgba(17, 24, 68, 0.18); /* Default empty color */
        }
        .luxury-star::before {
          content: '★';
          position: absolute;
          top: 0; 
          left: 0;
          width: var(--fill-width, 0%);
          overflow: hidden;
          color: #4B5694; /* Elegant brand purple/blue fill */
          transition: width 0.3s ease;
        }
      `}</style>
      <div className="star-rating-container">
        {[1, 2, 3, 4, 5].map((index) => {
          const fillWidth = Math.max(0, Math.min(100, (rating - (index - 1)) * 100));
          return (
            <span 
              key={index} 
              className="luxury-star" 
              style={{ '--fill-width': `${fillWidth}%` } as React.CSSProperties}
            >
              ★
            </span>
          );
        })}
      </div>
    </>
  );
}

export default function ProductDetail() {
  const { category, productId } = useParams<{ // get the category and productid from url 
    category: string; 
    productId: string;
  }>();

  const navigate = useNavigate(); 

  // Context Hooks
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // State managers
  const [product, setProduct] = useState<Product | null>(null); 
  const [cat, setCat] = useState<Category | null>(null); 
  const [related, setRelated] = useState<Product[]>([]);
  
  // Loading and Error states
  const [loading, setLoading] = useState<boolean>(true); 
  const [redirect, setRedirect] = useState<boolean>(false);

  // UI States
  const [currentImage, setCurrentImage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [selectedSize, setSelectedSize] = useState<string>("100ml");
  const reviewScrollRef = useRef<HTMLDivElement | null>(null);

  // FETCH DATA FROM BACKEND API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 1. Fetch Main Product Details
        const productRes = await fetch(`http://localhost:5000/api/products/${productId}`);
        if (!productRes.ok) throw new Error("Product not found");
        const productData: Product = await productRes.json();

        // 2. Fetch All Categories to find the current active category
        const categoryRes = await fetch(`http://localhost:5000/api/categories`);
        if (!categoryRes.ok) throw new Error("Categories not found");
        const categoriesData: Category[] = await categoryRes.json();
        const currentCat = categoriesData.find((c) => c.slug === category);

        // 3. Fetch Related Products (Filtering by the same category)
        const relatedRes = await fetch(`http://localhost:5000/api/products?category=${category}`);
        if (!relatedRes.ok) throw new Error("Related products not found");
        const relatedData: Product[] = await relatedRes.json();

        // Save data to our states
        setProduct(productData);
        setCat(currentCat || null);
        setRelated(relatedData.filter((p) => (p._id ) !== productId).slice(0, 3));
        setCurrentImage(0); 
        
        if (productData.size) {
          setSelectedSize(productData.size);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error connecting to database:", error);
        setRedirect(true); 
        setLoading(false);
      }
    };

    if (productId && category) {
      fetchData();
    }
  }, [category, productId]);

  // HANDLES THE CART ADDITION ACTION

  const handleAddToCartClick = () => {
    if (!product) return;
    addToCart({
      _id: product._id,
      name: product.name,
      price: product.price, 
      image: product.images[0],
      size: selectedSize
    }, 1);
    
    alert(`${product.name} (${selectedSize}) added to your luxury selection!`);
  };
  // HANDLES THE NEW REVIEW
  const handleNewReview = (newReview: Review) => {
    if (product) {
      setProduct({
        ...product,
        // Ensure newReview structure matches your backend response
        reviews: [newReview, ...(product.reviews || [])],
      });
    }
  };

  // ROUTE PROTECTION INTERCEPTOR FOR REVIEW CREATION
  const handleAddReviewClick = () => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      alert("✨ Please sign in to write and share a review for this fragrance!");
      navigate("/login");
      return;
    }
    
    setIsModalOpen(true);
  };

  // Handle redirects safely
  if (redirect) return <Navigate to="/shop" replace />;// if product not founf redirect to the shop
  if (loading) return <div className="text-center py-20 bg-[#EAE0CF] min-height-100vh text-[#111844]">Loading luxury fragrance...</div>;
  if (!product || !cat) return <Navigate to="/shop" replace />;

  // Filter out any falsy/malformed entries defensively — guards against
  // a bad API response or stale state ever crashing this calculation again.
  const reviews = (product.reviews ?? []).filter(
    (r): r is NonNullable<typeof r> => Boolean(r) && typeof r.rating === "number"
  );

  // Calculate Average Rating Summary
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1) 
    : "0.0";

  const scrollReviews = (direction: "left" | "right") => {
    if (reviewScrollRef.current) {
      reviewScrollRef.current.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  const nextImage = () => {
    setCurrentImage((prev) => Math.min(prev + 1, product.images.length - 1));
  };

  const prevImage = () => {
    setCurrentImage((prev) => Math.max(prev - 1, 0));
  };

  // Safe ID resolution string for hook keys
  const activeProductId = product._id  || "";

  return (
    <>
      <style>{`
        .detail-page {
         background: #eae0cfd6; 
         min-height: 100vh; 
         font-family: 'Jost', sans-serif; 
        }
        .detail-breadcrumb-bar { 
         background: #11184452; 
         padding: 1rem 2rem; 
         margin-top:-80px; 
        }
        .detail-breadcrumb { 
         max-width: 1200px; 
         margin: 0 auto; 
         display: flex; 
         align-items: center; 
         gap: 0.6rem; 
         font-size: 0.7rem; 
         letter-spacing: 0.15em; 
         text-transform: uppercase; 
         color: #EAE0CF; 
        }
        .detail-breadcrumb a { 
         color: #EAE0CF;
         text-decoration: none; 
         transition: color 0.2s; 
        }
        .detail-breadcrumb a:hover { 
         color: rgba(17,24,68,0.5); 
        }
        .detail-breadcrumb span {
         color: #EAE0CF;
        }
        .detail-breadcrumb .current { 
         color: #EAE0CF; 
        }
        .detail-main { 
         max-width: 1200px; 
         margin: 0 auto; 
         padding: 4rem 2rem; 
         display: grid; 
         grid-template-columns: 1fr 1fr; 
         gap: 5rem; 
         align-items: start; 
        }
        .detail-img-wrap { 
         position: relative; 
         border-radius: 24px; 
         overflow: hidden; 
         height: 560px; 
         box-shadow: 0 30px 70px rgba(17,24,68,0.2); 
         background: linear-gradient(135deg, #1a245c, #111844); 
         position: sticky; 
         top: 100px; 
        }
        .detail-img-wrap img { 
         width: 100%; 
         height: 100%; 
         object-fit: cover; 
        }
        .detail-img-badge { 
         position: absolute; 
         top: 20px; 
         left: 20px; 
         background: rgba(17,24,68,0.88); 
         color: #EAE0CF; 
         font-size: 0.65rem; 
         letter-spacing: 0.2em; 
         text-transform: uppercase; 
         padding: 6px 14px; 
         border-radius: 999px; 
         border: 1px solid rgba(114,136,174,0.3); 
        }
        .carousel-btn { 
         position: absolute; 
         top: 50%; 
         transform: translateY(-50%); 
         background: #EAE0CF; 
         color: rgb(15, 30, 57); 
         border: none; 
         width: 40px; 
         height: 40px; 
         border-radius: 50%; 
         cursor: pointer; 
         font-size: 18px; 
         transition: 0.3s; 
         display: flex;
         align-items: center; 
         justify-content: center; 
        }
        .carousel-btn:hover { 
         background: #111844; 
         color:#EAE0CF; 
        }
        .carousel-btn.left { left: 10px; }
        .carousel-btn.right { right: 10px; }
        .carousel-btn:disabled { 
         opacity: 0.3; 
         cursor: not-allowed; 
         pointer-events: none; 
         }
        .carousel-indicator { 
         position: absolute; 
         bottom: 16px; 
         left: 50%; 
         transform: translateX(-50%); 
         background: rgba(255,255,255,0.6); 
         color: rgb(15, 30, 57); 
         padding: 6px 14px; 
         border-radius: 999px; 
         font-size: 0.75rem; 
         letter-spacing: 0.12em; 
         backdrop-filter: blur(8px); 
        }
        .detail-category-tag { 
         display: inline-block; 
         font-size: 0.65rem; 
         letter-spacing: 0.25em; 
         text-transform: uppercase; 
         color: #4B5694; 
         border: 1px solid rgba(75,86,148,0.35); 
         padding: 4px 14px; 
         border-radius: 999px; 
         margin-bottom: 1.2rem; 
        }
        .detail-name { 
         font-family: 'Cormorant Garamond', serif; font-size: clamp(2rem, 3.5vw, 3rem); 
         font-weight: 300; 
         color: #111844; 
         line-height: 1.15; 
         margin-bottom: 0.6rem; 
        }
        .detail-price { 
         font-family: 'Cormorant Garamond', serif; font-size: 1.8rem; 
         color: #4B5694; 
         font-weight: 400; 
         margin-bottom: 1.5rem; 
        }
        .detail-divider { 
         height: 1px; 
         background: rgba(17,24,68,0.12); 
         margin: 1.5rem 0; 
        }
        .detail-desc { 
         font-size: 0.92rem; 
         line-height: 1.9; 
         color: rgba(17,24,68,0.72); 
         margin-bottom: 2rem; 
        }
        .detail-specs { 
         display: grid; 
         grid-template-columns: repeat(2, 1fr); 
         gap: 1rem; 
         margin-bottom: 2rem; 
        }
        .spec-box { 
         background: rgba(255,255,255,0.5) ; 
         border: 1px solid rgba(75,86,148,0.15); 
         border-radius: 14px; 
         padding: 1rem 1.2rem; 
        }
        .spec-label { font-size: 0.62rem; 
         letter-spacing: 0.22em; 
         text-transform: uppercase; 
         color: #7288AE; 
         margin-bottom: 0.3rem; 
        }
        .spec-value { 
         font-family: 'Cormorant Garamond', serif; 
         font-size: 1rem; 
         color: #111844; 
         font-weight: 500; 
        }
        .detail-notes { margin-bottom: 2rem; }
        .detail-notes h4 { 
         font-size: 0.68rem; 
         letter-spacing: 0.28em; 
         text-transform: uppercase; 
         color: #4B5694; 
         margin-bottom: 1rem; 
        }
        .notes-row { 
         display: grid; 
         grid-template-columns: repeat(3, 1fr); 
         gap: 0.8rem; 
         }
        .note-group { 
         background: linear-gradient(135deg, #111844, #4B5694);
         border-radius: 14px;
         padding: 1rem; 
         color: #EAE0CF; 
        }
        .note-group-title { 
         font-size: 0.6rem; 
         letter-spacing: 0.22em; 
         text-transform: uppercase; 
         color: rgba(234,224,207,0.6); 
         margin-bottom: 0.6rem; 
        }
        .note-list { list-style: none; padding: 0; margin: 0; }
        .note-list li { 
         font-size: 0.82rem; 
         color: rgba(234,224,207,0.9); 
         margin-bottom: 0.25rem; 
         padding-left: 0.6rem; 
         position: relative; 
        }
        .note-list li::before { 
         content: '·'; 
         position: absolute; 
         left: 0; 
         color: #7288AE; 
        }
        .season-tags { 
         display: flex; 
         flex-wrap: wrap; 
         gap: 0.5rem; 
         margin-bottom: 2rem; 
        }
        .season-tag { 
         font-size: 0.68rem; 
         letter-spacing: 0.15em; 
         text-transform: uppercase; 
         padding: 5px 14px; 
         border-radius: 999px; 
         border: 1px solid rgba(75,86,148,0.3); 
         color: #4B5694; 
        }
        .detail-actions { display: flex; gap: 1rem; align-items: center; }
        .detail-btn-primary { 
         flex: 1; 
         height: 52px; 
         background: linear-gradient(135deg, #111844, #4B5694); 
         color: #EAE0CF; 
         border: none; 
         border-radius: 12px; 
         font-size: 0.78rem; 
         letter-spacing: 0.22em; 
         text-transform: uppercase; 
         cursor: pointer; 
         transition: 0.3s; 
         box-shadow: 0 10px 28px rgba(17,24,68,0.22); 
        }
        .detail-btn-primary:hover { 
         transform: translateY(-3px);
         box-shadow: 0 16px 38px rgba(17,24,68,0.3); 
        }
        .detail-btn-secondary { 
         width: 52px; 
         height: 52px; 
         background: rgba(255,255,255,0.5); 
         color: #111844; 
         border: 1px solid rgba(17,24,68,0.3); 
         border-radius: 12px; 
         font-size: 1.3rem; 
         cursor: pointer; 
         transition: 0.3s; 
         display: flex; 
         align-items: center; 
         justify-content: center; 
        }
        .detail-btn-secondary:hover {
         background: rgba(17,24,68,0.06);
         border-color: #111844; 
        }
        .reviews-section { 
         max-width: 1200px; 
         margin: 0 auto; 
         padding: 2rem 2rem 4rem; 
        }
        .reviews-title { 
         font-family: 'Cormorant Garamond', serif; 
         font-size: 1.8rem; 
         font-weight: 300; 
         color: #111844; 
         margin: 0;
        }
        .reviews-title span { color: #4B5694; }
        .reviews-row { 
         display: flex; 
         gap: 1.5rem; 
         overflow-x: auto; 
         padding-bottom: 1rem; 
         scroll-behavior: smooth; 
        }
        .reviews-row::-webkit-scrollbar { display: none; }
        .review-card { 
         min-width: 280px; 
         background: rgba(255,255,255,0.5); 
         border: 1px solid rgba(75,86,148,0.2); 
         border-radius: 16px; 
         padding: 1.2rem; 
         backdrop-filter: blur(8px); 
         transition: 0.3s; 
        }
        .review-card:hover { 
         transform: translateY(-6px); 
         box-shadow: 0 15px 35px rgba(17,24,68,0.15); 
        }
        .review-top { 
         display: flex; 
         justify-content: space-between; 
         align-items: center;
         margin-bottom: 0.6rem; 
        }
        .review-user { 
         font-weight: 600; 
         color: #111844; 
         }
        .review-rating { font-size: 0.9rem; }
        .review-comment { 
         font-size: 0.85rem; 
         color: rgba(17,24,68,0.75); 
         line-height: 1.6; 
         margin-bottom: 0.8rem; 
        }
        .review-date { font-size: 0.7rem; color: rgba(114,136,174,0.8); }
        .reviews-header { 
         display: flex; 
         justify-content: space-between; 
         align-items: center; 
         margin-bottom: 2rem; 
        }
        .reviews-actions { display: flex; align-items: center; gap: 12px; }
        .add-review-btn { 
         padding: 8px 14px; 
         border-radius: 999px; 
         border: 1px solid rgba(75,86,148,0.4); 
         background: rgba(255,255,255,0.5); 
         color: #111844; 
         font-size: 0.7rem; 
         letter-spacing: 0.15em; 
         text-transform: uppercase; 
         cursor: pointer; 
         transition: 0.3s; 
        }
        .add-review-btn:hover {
         background: #111844; 
         color: #EAE0CF; 
         transform: translateY(-2px); 
        }
        .reviews-arrows { display: flex; gap: 10px; }
        .review-arrow { 
         width: 42px; 
         height: 42px; 
         border-radius: 50%; 
         border: 1px solid #4B5694; 
         background: transparent; 
         color: #111844; 
         cursor: pointer; 
         transition: 0.3s; 
         font-size: 18px; 
         display: flex; 
         align-items: center; 
         justify-content: center; 
        }
        .review-arrow:hover { 
         background: #4B5694; 
         color: #EAE0CF; 
         transform: scale(1.05); 
        }
        .related-section { 
         max-width: 1200px; 
         margin: 0 auto; 
         padding: 0 2rem 6rem; 
        }
        .related-header { 
         display: flex; 
         justify-content: space-between; 
         align-items: baseline; 
         margin-bottom: 2rem; 
        }
        .related-header h3 { 
         font-family: 'Cormorant Garamond', serif; 
         font-size: 1.8rem; 
         font-weight: 300; 
         color: #111844; 
        }
        .related-header h3 span { color: #4B5694; }
        .related-see-all { 
         font-size: 0.7rem; 
         letter-spacing: 0.18em; 
         text-transform: uppercase; 
         color: #4B5694; 
         text-decoration: none; 
         transition: color 0.2s; 
        }
        .related-see-all:hover { color: #111844; }
        .related-grid { 
         display: grid; 
         grid-template-columns: repeat(3, 1fr); 
         gap: 1.4rem; 
        }
        .product-card-link { text-decoration: none; display: block; }
        .product-card { 
         background: rgba(255,255,255,0.6); 
         border: 1px solid rgba(75,86,148,0.18); 
         border-radius: 18px; 
         overflow: hidden; 
         transition: transform 0.32s ease, box-shadow 0.32s ease; 
        }
        .product-card:hover { 
         transform: translateY(-8px); 
         box-shadow: 0 18px 45px rgba(17,24,68,0.16); 
        }
        .product-card-img { 
         position: relative; 
         height: 200px; 
         overflow: hidden; 
         background: linear-gradient(135deg, #1a245c, #111844); 
        }
        .product-card-img img { 
         width: 100%; 
         height: 100%; 
         object-fit: cover; 
         transition: transform 0.4s ease; 
        }
        .product-card:hover .product-card-img img { transform: scale(1.07); }
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
        .product-card-body { padding: 1.1rem 1.2rem 1.3rem; }
        .product-card-name { 
         font-family: 'Cormorant Garamond', serif; 
         font-size: 1.1rem; 
         color: #111844; 
         margin-bottom: 0.4rem; 
        }
        .product-card-desc { 
         font-size: 0.78rem; 
         color: rgba(17,24,68,0.62); 
         line-height: 1.6; 
         margin-bottom: 0.9rem; 
        }
        .product-card-footer { display: flex; justify-content: space-between; align-items: center; }
        .product-card-price { font-family: 'Cormorant Garamond', serif; font-size: 1.05rem; color: #4B5694; }
        .product-card-btn { 
         font-size: 0.62rem; 
         letter-spacing: 0.18em; 
         text-transform: uppercase; 
         color: #111844; 
         border: 1px solid rgba(17,24,68,0.28); 
         padding: 5px 12px; 
         border-radius: 999px; 
         transition: 0.25s; 
        }
        .product-card:hover .product-card-btn { 
         background: #111844; 
         color: #EAE0CF; 
        }
        @media (max-width: 900px) { 
          .detail-main { grid-template-columns: 1fr; gap: 2.5rem; } 
          .detail-img-wrap { position: relative; top: 0; height: 360px; } 
          .related-grid { grid-template-columns: 1fr 1fr; } 
        }
        @media (max-width: 600px) { 
          .notes-row { grid-template-columns: 1fr; } 
          .detail-specs { grid-template-columns: 1fr 1fr; } 
          .related-grid { grid-template-columns: 1fr; } 
          .reviews-header { flex-direction: column; align-items: flex-start; gap: 15px; }
        }
      `}</style>

      <Header />

      <div className="detail-page">
        {/* Breadcrumb Navigation */}
        <div className="detail-breadcrumb-bar">
          <div className="detail-breadcrumb">
            <Link to="/shop">Shop</Link>
            <span>/</span>
            <Link to={`/shop/${category}`}>{cat.label}</Link>
            <span>/</span>
            <span className="current">{product.name}</span>
          </div>
        </div>

        {/* Main Context Grid */}
        <div className="detail-main">
          {/* Left Gallery Section */}
          <div className="detail-img-wrap">
            <img 
              src={product.images[currentImage]} 
              alt={`${product.name} setup view ${currentImage + 1}`}
            />
            <button onClick={prevImage} disabled={currentImage === 0} className="carousel-btn left">
              ←
            </button>
            <button onClick={nextImage} disabled={currentImage === product.images.length - 1} className="carousel-btn right">
              →
            </button>
            {product.badge && <span className="detail-img-badge">{product.badge}</span>}
            <div className="carousel-indicator">
              {currentImage + 1} / {product.images.length}
            </div>
          </div>

          {/* Right Descriptions Section */}
          <div className="detail-info">
            <span className="detail-category-tag">{cat.label}</span>
            <h1 className="detail-name">{product.name}</h1>
            <div className="detail-price">PKR {product.price}</div>

            <div className="detail-divider" />
            <p className="detail-desc">{product.description}</p>

            {/* Spec Matrix */}
            <div className="detail-specs">
              <div className="spec-box"><div className="spec-label">Size</div><div className="spec-value">{product.size}</div></div>
              <div className="spec-box"><div className="spec-label">Longevity</div><div className="spec-value">{product.longevity}</div></div>
              <div className="spec-box"><div className="spec-label">Sillage</div><div className="spec-value">{product.sillage}</div></div>
              <div className="spec-box"><div className="spec-label">Brand</div><div className="spec-value">{product.brand}</div></div>
            </div>

            <div className="season-tags">
              {product.season?.map((s, idx) => (
                <span className="season-tag" key={`${s}-${idx}`}>{s}</span>
              ))}
            </div>

            {/* Notes Section */}
            {product.notes && (
              <div className="detail-notes">
                <h4>Fragrance Notes</h4>
                <div className="notes-row">
                  {(["top", "heart", "base"] as const).map((layer) => (
                    <div className="note-group" key={layer}>
                      <div className="note-group-title">{layer} notes</div>
                      <ul className="note-list">
                        {product.notes[layer]?.map((n, idx) => (
                          <li key={`${n}-${idx}`}>{n}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="detail-divider" />

            <div className="detail-actions">
              <button onClick={handleAddToCartClick} className="detail-btn-primary">
                Add to Cart
              </button>
              
              {/* Reactive Wishlist Action Trigger Heart Button */}
              <button 
                onClick={() => toggleWishlist(product)} 
                className="detail-btn-secondary" 
                aria-label="Save item"
                style={{ 
                  color: isInWishlist(activeProductId) ? "#4B5694" : "inherit",
                  transition: "color 0.2s ease, transform 0.1s ease"
                }}
              >
                {isInWishlist(activeProductId) ? "♥" : "♡"}
              </button>
            </div>
          </div>
        </div>

        {/* ── INTERACTIVE APP STORE REVIEWS VIEW ───────────────────────────── */}
        <section className="reviews-section">
          <div className="reviews-header">
            <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
              <h3 className="reviews-title">
                Customer <span>Reviews</span>
              </h3>
              {reviews.length > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.45)", padding: "5px 12px", borderRadius: "10px" }}>
                  <span style={{ fontWeight: 700, color: "#111844", fontSize: "0.95rem" }}>{averageRating}</span>
                  <DynamicStars rating={parseFloat(averageRating)} />
                  <span style={{ fontSize: "0.75rem", color: "rgba(17,24,68,0.55)" }}>({reviews.length})</span>
                </div>
              )}
            </div>

            <div className="reviews-actions">
              <button className="add-review-btn" onClick={handleAddReviewClick}>
                + Add Review
              </button>

              <div className="reviews-arrows">
                <button onClick={() => scrollReviews("left")} className="review-arrow">←</button>
                <button onClick={() => scrollReviews("right")} className="review-arrow">→</button>
              </div>
            </div>
          </div>

          {reviews.length > 0 ? (
            <div className="reviews-row" ref={reviewScrollRef}>
              {reviews.map((r, i) => (
                <div className="review-card" key={r._id || i}>
                  <div className="review-top">
                    <div className="review-user" style={{ textTransform: "capitalize" }}>{r.userId?.name || "Anonymous"}</div>
                    <div className="review-rating">
                      <DynamicStars rating={r.rating} />
                    </div>
                  </div>
                  <p className="review-comment">"{r.comment}"</p>
                  {/* <div className="review-date">{r.date}</div> */}
                  <div className="review-date">
                    {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "Just now"}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: "rgba(17,24,68,0.6)", fontStyle: "italic", fontSize: "0.9rem" }}>
              No reviews yet. Be the first to share your experience with this fragrance!
            </p>
          )}
        </section>

        {/* Related Collections */}
        {related.length > 0 && (
          <section className="related-section">
            <div className="related-header">
              <h3>You Might Also <span>Like</span></h3>
              <Link to={`/shop/${category}`} className="related-see-all">View All →</Link>
            </div>
            <div className="related-grid">
              {related.map((p) => {
                const relId = p._id ;
                return (
                  <Link key={relId} to={`/shop/${category}/${relId}`} className="product-card-link">
                    <div className="product-card">
                      <div className="product-card-img">
                        <img src={p.images[0]} alt={p.name} />
                        {p.badge && <span className="product-card-badge">{p.badge}</span>}
                      </div>
                      <div className="product-card-body">
                        <div className="product-card-name">{p.name}</div>
                        <div className="product-card-desc">{p.shortDesc}</div>
                        <div className="product-card-footer">
                          <span className="product-card-price">PKR {p.price}</span>
                          <span className="product-card-btn">View →</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>

      <Footer />

      <ReviewFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productId={product?._id || ""}
        onReviewSubmitted={handleNewReview}
      />
    </>
  );
}