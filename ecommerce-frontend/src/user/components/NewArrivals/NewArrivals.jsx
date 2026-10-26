import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import productService from "../../../services/productService";
import { useCart } from "../../../context/CartContext";
import { useWishlist } from "../../../context/WishlistContext";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "react-toastify";
import "./NewArrivals.css";

export default function NewArrivals() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        setLoading(true);
        const response = await productService.getNewArrivals(8);
        if (response?.data?.status && Array.isArray(response?.data?.data?.products)) {
          setProducts(response.data.data.products);
        } else if (response?.data?.status && Array.isArray(response?.data?.data)) {
          setProducts(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching new arrivals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  const PRODUCT_FALLBACKS = [
    "https://images.unsplash.com/photo-1523381216130-8b3f99a87a6d?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1467043237213-65a2c69bb749?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80",
  ];

  const fallbackImage = (product) =>
    PRODUCT_FALLBACKS[(product.id || 0) % PRODUCT_FALLBACKS.length];

  const getProductImage = (product) => {
    // Local upload files are often missing in this project — use polished fallbacks on homepage
    return fallbackImage(product);
  };

  const handleAddToCart = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }
    await addToCart(product.id, 1);
  };

  const handleWishlistToggle = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error("Please login to add items to wishlist");
      navigate("/login");
      return;
    }
    await toggleWishlist(product.id);
  };

  return (
    <section className="bh-section bh-arrivals" id="new-arrivals">
      <div className="bh-section__inner">
        <div className="bh-section__head">
          <div className="bh-section__copy">
            <p className="bh-eyebrow">Current Obsession</p>
            <h2 className="bh-section__title">Fresh In</h2>
            <p className="bh-section__text">
              Only hits, curated for your daily aesthetic.
            </p>
          </div>
          <Link to="/shop" className="bh-link">
            All the looks <i className="fas fa-arrow-right" aria-hidden="true" />
          </Link>
        </div>

        {loading ? (
          <div className="bh-loading">Loading new arrivals...</div>
        ) : products.length === 0 ? (
          <div className="bh-empty">No new arrivals at the moment.</div>
        ) : (
          <div className="bh-arrivals__grid">
            {products.map((product) => {
              const price = product.salePrice || product.basePrice;
              const hasSale =
                product.salePrice && product.salePrice < product.basePrice;

              return (
                <article key={product.id} className="bh-product">
                  <div className="bh-product__media">
                    <Link to={`/product/${product.slug}`} className="bh-product__link">
                      <img
                        src={getProductImage(product)}
                        alt={product.name}
                        loading="lazy"
                      />
                    </Link>
                    <span className="bh-product__badge">New</span>
                    <button
                      type="button"
                      className="bh-product__wishlist"
                      onClick={(e) => handleWishlistToggle(e, product)}
                      aria-label="Toggle wishlist"
                    >
                      <i
                        className={`${
                          isInWishlist(product.id) ? "fas" : "far"
                        } fa-heart`}
                      />
                    </button>
                    <div className="bh-product__actions">
                      <button
                        type="button"
                        className="bh-product__action bh-product__action--cart"
                        onClick={(e) => handleAddToCart(e, product)}
                      >
                        Bag it
                      </button>
                    </div>
                  </div>
                  <div className="bh-product__info">
                    <p className="bh-product__category">
                      {product.category?.name ||
                        product.Category?.name ||
                        "Collection"}
                    </p>
                    <Link to={`/product/${product.slug}`} className="bh-product__name">
                      {product.name}
                    </Link>
                    <p className="bh-product__price">
                      <span>₹{Number(price).toLocaleString("en-IN")}</span>
                      {hasSale && (
                        <s>₹{Number(product.basePrice).toLocaleString("en-IN")}</s>
                      )}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
