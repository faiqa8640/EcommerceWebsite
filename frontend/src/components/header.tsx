import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const searchRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount] = useState<number>(0);
  const [wishlistCount] = useState<number>(0);

  const isOnResultsPage = location.pathname === "/shop/all";

  useEffect(() => {
    const handleScroll = (): void => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  useEffect(() => {
    if (searchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchOpen]);

  const doSearch = (query: string) => {
    navigate(`/shop/all?search=${encodeURIComponent(query.trim())}`);
  };

  useEffect(() => {
    if (!searchQuery.trim()) return;
    if (!isOnResultsPage) return;

    const handler = setTimeout(() => {
      doSearch(searchQuery);
    }, 400);

    return () => clearTimeout(handler);
  }, [searchQuery, isOnResultsPage]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
        setSearchQuery("");
      }
    };
    if (searchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchOpen]);

  useEffect(() => {
    const handleKeys = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setSearchQuery("");
      }
      if (e.key === "Enter" && searchOpen && searchQuery.trim()) {
        doSearch(searchQuery);
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeys);
    return () => window.removeEventListener("keydown", handleKeys);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchOpen, searchQuery]);

  const navLinks: { label: string; to: string }[] = [
    { label: "Home", to: "/" },
    { label: "Shop", to: "/shop" },
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
  ];

  const isActive = (path: string): boolean => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSearchIconClick = () => {
    if (searchOpen) {
      if (searchQuery.trim()) {
        doSearch(searchQuery);
        setSearchOpen(false);
      } else {
        setSearchOpen(false);
      }
    } else {
      setSearchOpen(true);
    }
  };

  return (
    <>
      <style>{`
        :root {
          --primary: #111844;
          --accent: #4B5694;
          --accent-light: #7288AE;
          --text: #EAE0CF;
          --text-muted: #7288AE;
        }

        .eloura-header {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 1000;
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(234,224,207,0.15);
          transition: all 0.4s ease;
        }

        .eloura-header::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--accent), var(--accent-light), var(--accent), transparent);
          opacity: 0.6;
        }

        .eloura-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
        }

        .eloura-logo {
          text-decoration: none;
          display: flex;
          flex-direction: column;
          gap: 3px;
          flex-shrink: 0;
        }

        .eloura-logo-name {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.85rem;
          font-weight: 300;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          line-height: 1;
          color: var(--text);
          transition: color 0.3s;
        }

        .eloura-logo:hover .eloura-logo-name { color: var(--accent-light); }

        .eloura-logo-tag {
          font-family: 'Jost', system-ui, sans-serif;
          font-size: 0.5rem;
          font-weight: 400;
          letter-spacing: 0.42em;
          text-transform: uppercase;
          color: var(--text-muted);
        }

        .eloura-nav {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          flex: 1;
          justify-content: center;
        }

        .eloura-nav-link {
          font-family: 'Jost', system-ui, sans-serif;
          font-size: 0.7rem;
          font-weight: 400;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          text-decoration: none;
          padding: 0.5rem 1rem;
          position: relative;
          transition: color 0.3s;
          white-space: nowrap;
          color: var(--text);
        }

        .eloura-nav-link::after {
          content: '';
          position: absolute;
          bottom: 4px; left: 50%;
          transform: translateX(-50%);
          height: 1px;
          background: var(--accent-light);
          transition: width 0.3s ease;
        }

        .eloura-nav-link.active::after,
        .eloura-nav-link:hover::after { width: 55%; }
        .eloura-nav-link:not(.active)::after { width: 0; }

        /* ── ICON ACTIONS AREA ──────────────────────────────── */
        .eloura-actions {
          display: flex;
          align-items: center;
          gap: 0.2rem;
          flex-shrink: 0;
        }

        /* ── SEARCH ──────────────────────────────────────────── */
        .search-box {
          display: flex;
          align-items: center;
          position: relative;
        }

        .search-input {
          width: 0;
          opacity: 0;
          padding: 0;
          border: none;
          background: transparent;
          color: var(--text);
          font-family: 'Jost', system-ui, sans-serif;
          font-size: 0.85rem;
          letter-spacing: 0.05em;
          outline: none;
          transition: width 0.35s ease, opacity 0.35s ease, padding 0.35s ease, border 0.35s ease;
          border-radius: 6px;
          box-sizing: border-box;
        }

        .search-input::placeholder { color: rgba(234,224,207,0.45); }

        .search-input.open {
          width: 180px;
          opacity: 1;
          padding: 6px 12px;
          border: 1px solid rgba(114,136,174,0.45);
          background: rgba(255,255,255,0.08);
        }

        .search-hint {
          position: absolute;
          top: calc(100% + 6px);
          right: 0;
          background: rgba(17,24,68,0.92);
          color: rgba(234,224,207,0.65);
          font-size: 0.62rem;
          letter-spacing: 0.1em;
          padding: 5px 10px;
          border-radius: 6px;
          white-space: nowrap;
          pointer-events: none;
          border: 1px solid rgba(114,136,174,0.2);
          z-index: 10;
        }

        /* ── ICON BUTTON BASE ───────────────────────────────── */
        .icon-btn {
          position: relative;
          background: transparent;
          border: none;
          color: var(--text);
          cursor: pointer;
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.3s, transform 0.2s;
          border-radius: 8px;
          text-decoration: none;
        }

        .icon-btn:hover {
          color: var(--accent-light);
          transform: translateY(-1px);
        }

        .icon-btn svg {
          width: 20px;
          height: 20px;
          stroke: currentColor;
          fill: none;
          stroke-width: 1.6;
          stroke-linecap: round;
          stroke-linejoin: round;
          display: block;
        }

        /* Badge for cart / wishlist counts */
        .icon-badge {
          position: absolute;
          top: 2px;
          right: 2px;
          background: var(--accent);
          color: #EAE0CF;
          font-size: 0.55rem;
          font-family: 'Jost', system-ui, sans-serif;
          font-weight: 600;
          letter-spacing: 0;
          min-width: 16px;
          height: 16px;
          border-radius: 999px;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
          padding: 0 3px;
          border: 1.5px solid rgba(17,24,68,0.85);
          pointer-events: none;
        }

        /* Thin divider between icon groups */
        .icon-divider {
          width: 1px;
          height: 20px;
          background: rgba(114,136,174,0.3);
          margin: 0 0.3rem;
          flex-shrink: 0;
        }

        /* ── USER ICON TOOLTIP ──────────────────────────────── */
        .user-icon-wrap {
          position: relative;
        }

        .user-tooltip {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          background: rgba(17,24,68,0.96);
          border: 1px solid rgba(114,136,174,0.25);
          border-radius: 10px;
          padding: 0.8rem;
          min-width: 160px;
          box-shadow: 0 12px 30px rgba(0,0,0,0.4);
          backdrop-filter: blur(16px);
          z-index: 200;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .user-tooltip-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1rem;
          color: #EAE0CF;
          letter-spacing: 0.05em;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid rgba(114,136,174,0.2);
          margin-bottom: 0.2rem;
        }

        .user-tooltip-link {
          font-family: 'Jost', system-ui, sans-serif;
          font-size: 0.7rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(234,224,207,0.75);
          text-decoration: none;
          padding: 5px 8px;
          border-radius: 6px;
          transition: background 0.2s, color 0.2s;
          cursor: pointer;
          background: transparent;
          border: none;
          text-align: left;
          width: 100%;
        }

        .user-tooltip-link:hover {
          background: rgba(75,86,148,0.25);
          color: #EAE0CF;
        }

        .user-tooltip-logout {
          color: rgba(234,180,180,0.8);
          margin-top: 0.2rem;
          border-top: 1px solid rgba(114,136,174,0.15);
          padding-top: 0.5rem;
        }

        .user-tooltip-logout:hover {
          background: rgba(200,80,80,0.15);
          color: #ff9999;
        }

        /* ── HAMBURGER ───────────────────────────────────────── */
        .eloura-hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          cursor: pointer;
          background: none;
          border: none;
          padding: 4px;
          flex-shrink: 0;
        }

        .eloura-hamburger span {
          display: block;
          width: 24px;
          height: 1px;
          background: var(--text);
          transition: all 0.3s ease;
          transform-origin: center;
        }

        .eloura-hamburger.open span:nth-child(1) { transform: translateY(6px) rotate(45deg); }
        .eloura-hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .eloura-hamburger.open span:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }

        /* ── MOBILE MENU ─────────────────────────────────────── */
        .eloura-mobile {
          position: fixed;
          inset: 0;
          z-index: 999;
          background: rgba(17,24,68,0.98);
          backdrop-filter: blur(20px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: opacity 0.3s ease;
        }

        .eloura-mobile-link {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 2.5rem;
          font-weight: 300;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          text-decoration: none;
          padding: 0.6rem 2rem;
          color: var(--text);
          transition: all 0.3s;
        }

        .eloura-mobile-link:hover, .eloura-mobile-link.active {
          color: var(--accent-light);
          transform: translateX(8px);
        }

        .eloura-mobile-btn {
          margin-top: 2rem;
          font-family: 'Jost', system-ui, sans-serif;
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          text-decoration: none;
          padding: 0.8rem 3rem;
          background: var(--accent);
          color: var(--text);
          border-radius: 2px;
          transition: background 0.3s;
          border: none;
          cursor: pointer;
        }

        .eloura-mobile-btn:hover { background: var(--accent-light); }

        .mobile-icons-row {
          display: flex;
          gap: 1.5rem;
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(114,136,174,0.2);
        }

        .mobile-icons-row .icon-btn svg {
          width: 24px;
          height: 24px;
        }

        @media (max-width: 768px) {
          .eloura-nav { display: none; }
          .eloura-actions { display: none; }
          .eloura-hamburger { display: flex; }
        }
      `}</style>

      <header
        className="eloura-header"
        style={{
          backgroundColor: scrolled ? "rgba(17,24,68,0.97)" : "rgba(17,24,68,0.85)",
          padding: scrolled ? "0.75rem 0" : "1.1rem 0",
          boxShadow: scrolled ? "0 4px 40px rgba(0,0,0,0.4)" : "none",
        }}
      >
        <div className="eloura-inner">
          {/* Logo */}
          <Link to="/" className="eloura-logo">
            <span className="eloura-logo-name">Eloura</span>
            <span className="eloura-logo-tag">THE FRAGRANCE HOUSE</span>
          </Link>

          {/* Nav Links */}
          <nav className="eloura-nav">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`eloura-nav-link${isActive(link.to) ? " active" : ""}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop: Search + Icons */}
          <div className="eloura-actions">

            {/* Search */}
            <div className="search-box" ref={searchRef}>
              <button
                className="icon-btn"
                onClick={handleSearchIconClick}
                title="Search perfumes"
              >
                <svg viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="7" />
                  <line x1="16.5" y1="16.5" x2="22" y2="22" />
                </svg>
              </button>

              <input
                ref={inputRef}
                type="text"
                placeholder="Search perfumes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`search-input${searchOpen ? " open" : ""}`}
              />

              {searchOpen && !isOnResultsPage && searchQuery.trim().length > 0 && (
                <span className="search-hint">Press Enter to search</span>
              )}
            </div>

            <div className="icon-divider" />

            {/* Wishlist */}
            <Link to="/wishlist" className="icon-btn" title="Wishlist">
              <svg viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {wishlistCount > 0 && (
                <span className="icon-badge">{wishlistCount}</span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/cart" className="icon-btn" title="Shopping Cart">
              <svg viewBox="0 0 24 24">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {cartCount > 0 && (
                <span className="icon-badge">{cartCount}</span>
              )}
            </Link>

            <div className="icon-divider" />

            {/* User / Login */}
            <UserIconArea user={user} onLogout={handleLogout} />
          </div>

          {/* Hamburger */}
          <button
            className={`eloura-hamburger${menuOpen ? " open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span /><span /><span />
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className="eloura-mobile"
        style={{
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "all" : "none",
        }}
      >
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`eloura-mobile-link${isActive(link.to) ? " active" : ""}`}
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </Link>
        ))}

        {/* Mobile icon row */}
        <div className="mobile-icons-row">
          <Link to="/wishlist" className="icon-btn" onClick={() => setMenuOpen(false)} title="Wishlist">
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </Link>
          <Link to="/cart" className="icon-btn" onClick={() => setMenuOpen(false)} title="Cart">
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </Link>
          {user ? (
            <button
              className="eloura-mobile-btn"
              onClick={() => { handleLogout(); setMenuOpen(false); }}
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="eloura-mobile-btn"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
          )}
        </div>
      </div>

      <div style={{ height: scrolled ? "60px" : "76px", transition: "height 0.4s ease" }} />
    </>
  );
}

// ── Sub-component: User icon with dropdown ──────────────────────────────────
function UserIconArea({ user, onLogout }: { user: { name: string } | null; onLogout: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  if (!user) {
    return (
      <Link to="/login" className="icon-btn" title="Login">
        <svg viewBox="0 0 24 24">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </Link>
    );
  }

  return (
    <div className="user-icon-wrap" ref={ref}>
      <button
        className="icon-btn"
        onClick={() => setOpen((prev) => !prev)}
        title={`Hi, ${user.name.split(" ")[0]}`}
      >
        <svg viewBox="0 0 24 24">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </button>

      {open && (
        <div className="user-tooltip">
          <div className="user-tooltip-name">Hi, {user.name.split(" ")[0]}</div>
          <Link to="/profile" className="user-tooltip-link" onClick={() => setOpen(false)}>
            My Profile
          </Link>
          <Link to="/orders" className="user-tooltip-link" onClick={() => setOpen(false)}>
            My Orders
          </Link>
          <Link to="/wishlist" className="user-tooltip-link" onClick={() => setOpen(false)}>
            Wishlist
          </Link>
          <button
            className="user-tooltip-link user-tooltip-logout"
            onClick={() => { onLogout(); setOpen(false); }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
