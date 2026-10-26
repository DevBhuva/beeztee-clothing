import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useCart } from "../../../context/CartContext";
import { useWishlist } from "../../../context/WishlistContext";
import { useSiteSettings } from "../../../context/SiteSettingsContext";
import "./Header.css";

const brandLogo = "/logo.png?v=3";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { settings } = useSiteSettings();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  const brandName = settings?.siteName || "Beeztee";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const headerSolid = !isHome || scrolled;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuOpen && !event.target.closest(".user-menu-container")) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [userMenuOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate("/");
  };

  const toggleCart = () => {
    navigate(isAuthenticated ? "/cart" : "/login");
  };

  const navItems = [
    { to: "/", label: "Hub", end: true },
    { to: "/shop", label: "Vault" },
    { to: "/sale", label: "Archive" },
    { to: "/about", label: "Ethos" },
    { to: "/contact", label: "Hit us up" },
  ];

  return (
    <nav id="navbar" className={headerSolid ? "scrolled" : ""}>
      <div className="nav-container">
        <Link to="/" className="logo" onClick={closeMobileMenu} aria-label={brandName}>
          <img src={brandLogo} alt={brandName} className="logo-img" />
        </Link>

        <ul className={`nav-links ${mobileMenuOpen ? "active" : ""}`}>
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                onClick={closeMobileMenu}
                className={({ isActive }) => (isActive ? "active" : undefined)}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="nav-actions">
          {isAuthenticated ? (
            <div className="user-menu-container">
              <button
                type="button"
                className="nav-icon-btn user-icon logged-in"
                onClick={() => setUserMenuOpen((open) => !open)}
                aria-label="Account menu"
              >
                <i className="fas fa-user"></i>
              </button>
              {userMenuOpen && (
                <div className="user-dropdown">
                  <div className="user-info">
                    <p className="user-name">{user?.name}</p>
                    <p className="user-email">{user?.email}</p>
                  </div>
                  <ul className="user-menu-items">
                    <li>
                      <Link to="/profile" onClick={() => setUserMenuOpen(false)}>
                        <i className="fas fa-user-circle"></i>
                        My Profile
                      </Link>
                    </li>
                    <li>
                      <button type="button" onClick={handleLogout} className="logout-btn">
                        <i className="fas fa-sign-out-alt"></i>
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="login-btn" aria-label="Login">
                <i className="fas fa-sign-in-alt"></i>
                <span>Login</span>
              </Link>
              <Link to="/register" className="register-btn" aria-label="Register">
                <span>Join</span>
              </Link>
            </div>
          )}

          {isAuthenticated && (
            <button
              type="button"
              className="nav-icon-btn wishlist-icon"
              onClick={() => navigate("/wishlist")}
              aria-label="Wishlist"
            >
              <i className="fas fa-heart"></i>
              {wishlistCount > 0 && <span className="badge">{wishlistCount}</span>}
            </button>
          )}

          <button
            type="button"
            className="nav-icon-btn cart-icon"
            onClick={toggleCart}
            aria-label="Cart"
          >
            <i className="fas fa-shopping-bag"></i>
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </button>

          <button
            type="button"
            className={`mobile-menu-toggle ${mobileMenuOpen ? "active" : ""}`}
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <button
          type="button"
          className="nav-backdrop"
          aria-label="Close menu"
          onClick={closeMobileMenu}
        />
      )}
    </nav>
  );
}
