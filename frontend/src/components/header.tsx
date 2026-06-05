// Header with dynamic Login/Logout based on auth state

import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState<boolean>(false); // state that control the phone menu
  const [scrolled, setScrolled] = useState<boolean>(false);// track if the user track down
  const location = useLocation();// it is used for the active linking 
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // get auth state

  useEffect(() => { // is used to handle the scrolling 
    const handleScroll = (): void => setScrolled(window.scrollY > 20);// if scrolling >20 then true 
    window.addEventListener("scroll", handleScroll);// if true then handle the scroll like dim opacity->header become smaller and dark
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {// it closes the mobile menu when user navigate
    setMenuOpen(false);
  }, [location]);

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

        /* Auth buttons area */
        .eloura-auth {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          flex-shrink: 0;
        }

        .eloura-user-name {
          font-family: 'Jost', system-ui, sans-serif;
          font-size: 0.68rem;
          letter-spacing: 0.1em;
          color: var(--text-muted);
          white-space: nowrap;
        }

        .eloura-login {
          font-family: 'Jost', system-ui, sans-serif;
          font-size: 0.68rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          text-decoration: none;
          padding: 0.55rem 1.4rem;
          border-radius: 2px;
          border: 1px solid var(--accent);
          background: var(--accent);
          color: var(--text);
          transition: all 0.3s ease;
          white-space: nowrap;
          cursor: pointer;
        }

        .eloura-login:hover {
          background: var(--accent-light);
          border-color: var(--accent-light);
          transform: translateY(-1px);
        }

        .eloura-logout {
          font-family: 'Jost', system-ui, sans-serif;
          font-size: 0.68rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          padding: 0.55rem 1.4rem;
          border-radius: 2px;
          border: 1px solid rgba(114,136,174,0.4);
          background: transparent;
          color: var(--text-muted);
          transition: all 0.3s ease;
          white-space: nowrap;
          cursor: pointer;
        }

        .eloura-logout:hover {
          border-color: var(--accent-light);
          color: var(--text);
        }

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

        @media (max-width: 768px) {
          .eloura-nav { display: none; }
          .eloura-auth { display: none; }
          .eloura-hamburger { display: flex; }
        }
      `}</style>

      <header
        className="eloura-header"
        style={{
          backgroundColor: scrolled
            ? "rgba(17,24,68,0.97)"
            : "rgba(17,24,68,0.85)",
          padding: scrolled ? "0.75rem 0" : "1.1rem 0",
          boxShadow: scrolled ? "0 4px 40px rgba(0,0,0,0.4)" : "none",
        }}
      >
        <div className="eloura-inner">
          <Link to="/" className="eloura-logo">
            <span className="eloura-logo-name">Eloura</span>
            <span className="eloura-logo-tag">THE FRAGRANCE HOUSE</span>
          </Link>

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

          {/* Desktop auth area */}
          <div className="eloura-auth">
            {user ? (
              <>
                <span className="eloura-user-name">Hi, {user.name.split(" ")[0]}</span>
                <button className="eloura-logout" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="eloura-login">
                Login
              </Link>
            )}
          </div>

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

      <div
        style={{
          height: scrolled ? "60px" : "76px",
          transition: "height 0.4s ease",
        }}
      />

      {/* COMMENTS:
      useAuth() → gets user and logout from AuthContext
      user exists → show "Hi, Name" + Logout button
      user is null → show Login link
      handleLogout() → clears auth state + localStorage then redirects to /login
      */}
    </>
  );
}
