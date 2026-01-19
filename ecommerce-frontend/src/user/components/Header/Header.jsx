import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useCart } from "../../../context/CartContext";
import { useWishlist } from "../../../context/WishlistContext";
import { useSiteSettings } from "../../../context/SiteSettingsContext";
import "./Header.css";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { settings } = useSiteSettings();
  const navigate = useNavigate();

  useEffect(() => {
    // Navbar scroll effect
    const handleScroll = () => {
      const navbar = document.getElementById("navbar");
      if (navbar) {
        if (window.scrollY > 100) {
          navbar.classList.add("scrolled");
        } else {
          navbar.classList.remove("scrolled");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleCart = () => {
    if (isAuthenticated) {
      navigate('/cart');
    } else {
      navigate('/login');
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuOpen && !event.target.closest('.user-menu-container')) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userMenuOpen]);

  return (
    <nav id="navbar">
      <div className="nav-container">
        <div className="logo">{settings?.siteName || 'Beestee'}</div>

        {/* Mobile Menu Toggle */}
        <div
          className={`mobile-menu-toggle ${mobileMenuOpen ? "active" : ""}`}
          onClick={toggleMobileMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        <ul className={`nav-links ${mobileMenuOpen ? "active" : ""}`}>
          <li>
            <Link to="/" className="active" onClick={closeMobileMenu}>
              HOME
            </Link>
          </li>
          <li>
            <Link to="/shop" onClick={closeMobileMenu}>
              SHOP
            </Link>
          </li>
          {/* <li>
            <Link to="/men" onClick={closeMobileMenu}>
              MEN
            </Link>
          </li>
          <li>
            <Link to="/women" onClick={closeMobileMenu}>
              WOMEN
            </Link>
          </li> */}
          <li>
            <Link to="/sale" onClick={closeMobileMenu}>
              SALE
            </Link>
          </li>
          <li>
            <Link to="/about" onClick={closeMobileMenu}>
              ABOUT
            </Link>
          </li>
          <li>
            <Link to="/contact" onClick={closeMobileMenu}>
              CONTACT
            </Link>
          </li>
        </ul>

        <div className="nav-icons">
          {isAuthenticated ? (
            <div className="user-menu-container">
              <div className="user-icon logged-in" onClick={toggleUserMenu}>
                <i className="fas fa-user"></i>
              </div>
              {userMenuOpen && (
                <div className="user-dropdown">
                  <div className="user-info">
                    <p className="user-name">{user?.name}</p>
                    <p className="user-email">{user?.email}</p>
                  </div>
                  <div className="user-menu-divider"></div>
                  <ul className="user-menu-items">
                    <li>
                      <Link to="/profile" onClick={() => setUserMenuOpen(false)}>
                        <i className="fas fa-user-circle"></i>
                        My Profile
                      </Link>
                    </li>
                   
                   
                    <li>
                      <button onClick={handleLogout} className="logout-btn">
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
              <Link to="/login" className="login-btn">
                <i className="fas fa-sign-in-alt"></i>
                <span>Login</span>
              </Link>
              <Link to="/register" className="register-btn">
                <i className="fas fa-user-plus"></i>
                <span>Register</span>
              </Link>
            </div>
          )}
          
          {/* Wishlist Icon */}
          {isAuthenticated && (
            <div className="wishlist-icon" onClick={() => navigate('/wishlist')}>
              <i className="fas fa-heart"></i>
              {wishlistCount > 0 && <span className="badge">{wishlistCount}</span>}
            </div>
          )}
          
          {/* Cart Icon */}
          <div className="cart-icon" onClick={toggleCart}>
            <i className="fas fa-shopping-bag"></i>
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </div>
        </div>
      </div>
    </nav>
  );
}
