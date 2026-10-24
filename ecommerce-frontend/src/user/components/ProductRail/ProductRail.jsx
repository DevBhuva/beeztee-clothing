import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../../context/CartContext";
import { useWishlist } from "../../../context/WishlistContext";
import { useAuth } from "../../../context/AuthContext";
import { getPrimaryProductImage } from "../../../utils/productImage";
import { toast } from "react-toastify";
import "./ProductRail.css";

export default function ProductRail({
  eyebrow,
  title,
  text,
  ctaLabel = "View all",
  products = [],
  loading,
  viewAllTo = "/shop",
  filters,
  activeFilter,
  onFilterChange,
}) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  const handleAdd = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }
    await addToCart(product.id, 1);
  };

  const handleWish = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error("Please login to add items to wishlist");
      navigate("/login");
      return;
    }
    await toggleWishlist(product.id);
  };

  const showHead = eyebrow || title || text;

  return (
    <section className="bh-rail">
      {showHead && (
        <div className="bh-rail__head">
          <div>
            {eyebrow && <p className="bh-rail__eyebrow">{eyebrow}</p>}
            {title && <h2 className="bh-rail__title">{title}</h2>}
            {text && <p className="bh-rail__text">{text}</p>}
          </div>
          <Link to={viewAllTo} className="bh-rail__all">
            {ctaLabel} <span aria-hidden="true">→</span>
          </Link>
        </div>
      )}

      {filters?.length > 0 && (
        <div className="bh-rail__filters" role="tablist" aria-label="Filter products">
          {filters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              role="tab"
              aria-selected={activeFilter === filter.id}
              className={activeFilter === filter.id ? "is-active" : ""}
              onClick={() => onFilterChange?.(filter.id)}
            >
              {filter.label}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="bh-rail__empty">Loading...</div>
      ) : (
        <div className="bh-rail__scroller">
          {products.map((product) => {
            const price = product.salePrice || product.basePrice;
            const hasSale = product.salePrice && Number(product.salePrice) < Number(product.basePrice);
            const discount = hasSale
              ? Math.round(((product.basePrice - product.salePrice) / product.basePrice) * 100)
              : 0;
            return (
              <article key={product.id} className="bh-rail__card">
                <div className="bh-rail__media">
                  <Link to={`/product/${product.slug}`}>
                    <img src={getPrimaryProductImage(product)} alt={product.name} loading="lazy" />
                  </Link>
                  {hasSale && <span className="bh-rail__save">Save {discount}%</span>}
                  <button
                    type="button"
                    className="bh-rail__wish"
                    onClick={(e) => handleWish(e, product)}
                    aria-label="Wishlist"
                  >
                    <i className={`${isInWishlist(product.id) ? "fas" : "far"} fa-heart`} />
                  </button>
                </div>
                <h3>
                  <Link to={`/product/${product.slug}`}>{product.name}</Link>
                </h3>
                <p className="bh-rail__price">
                  <span>₹{Number(price).toLocaleString("en-IN")}</span>
                  {hasSale && <s>₹{Number(product.basePrice).toLocaleString("en-IN")}</s>}
                </p>
                <button type="button" className="bh-rail__add" onClick={(e) => handleAdd(e, product)}>
                  Add
                </button>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
