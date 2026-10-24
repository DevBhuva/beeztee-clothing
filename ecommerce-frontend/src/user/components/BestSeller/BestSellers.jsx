import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import categoryService from "../../../services/categoryService";
import productService from "../../../services/productService";
import { useCart } from "../../../context/CartContext";
import { useWishlist } from "../../../context/WishlistContext";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "react-toastify";
import "./BestSellers.css";

export default function BestSellers() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("all");
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesResponse, productsResponse] = await Promise.all([
          categoryService.getAllCategories(),
          productService.getBestsellers(24),
        ]);

        if (categoriesResponse.status && categoriesResponse.data) {
          setCategories(categoriesResponse.data.filter((cat) => cat.isActive));
        }

        if (productsResponse?.data?.status && Array.isArray(productsResponse?.data?.data?.products)) {
          setProducts(productsResponse.data.data.products);
        } else if (productsResponse?.data?.status && Array.isArray(productsResponse?.data?.data)) {
          setProducts(productsResponse.data.data);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching bestsellers:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = useMemo(() => {
    const list =
      activeFilter === "all"
        ? products
        : products.filter((product) => product.categoryId === Number(activeFilter));
    return list.slice(0, 8);
  }, [products, activeFilter]);

  const PRODUCT_FALLBACKS = [
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1523381216130-8b3f99a87a6d?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1467043237213-65a2c69bb749?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80",
  ];

  const fallbackImage = (product) =>
    PRODUCT_FALLBACKS[(product.id || 0) % PRODUCT_FALLBACKS.length];

  const getProductImage = (product) => fallbackImage(product);

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
    <section className="bh-section bh-bestsellers" id="shop">
      <div className="bh-section__inner">
        <div className="bh-section__head">
          <div className="bh-section__copy">
            <p className="bh-eyebrow">Top Tier</p>
            <h2 className="bh-section__title">The Faves</h2>
            <p className="bh-section__text">
              Customer favorites, refined for a modern wardrobe.
            </p>
          </div>
          <Link to="/shop" className="bh-link">
            Dive in <i className="fas fa-arrow-right" aria-hidden="true" />
          </Link>
        </div>

        <div className="bh-bestsellers__filters" role="tablist" aria-label="Filter bestsellers">
          <button
            type="button"
            role="tab"
            aria-selected={activeFilter === "all"}
            className={`bh-bestsellers__filter ${
              activeFilter === "all" ? "is-active" : ""
            }`}
            onClick={() => setActiveFilter("all")}
          >
            All
          </button>
          {categories.slice(0, 5).map((category) => (
            <button
              key={category.id}
              type="button"
              role="tab"
              aria-selected={activeFilter === String(category.id)}
              className={`bh-bestsellers__filter ${
                activeFilter === String(category.id) ? "is-active" : ""
              }`}
              onClick={() => setActiveFilter(String(category.id))}
            >
              {category.name === "Men" ? "Him" : category.name === "Women" ? "Her" : category.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="bh-loading">Loading bestsellers...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="bh-empty">No bestsellers found in this category.</div>
        ) : (
          <div className="bh-bestsellers__grid">
            {filteredProducts.map((product) => {
              const price = product.salePrice || product.basePrice;
              const hasSale =
                product.salePrice && product.salePrice < product.basePrice;
              const discount =
                hasSale
                  ? Math.round(
                      ((product.basePrice - product.salePrice) / product.basePrice) * 100
                    )
                  : null;

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
                    {discount ? (
                      <span className="bh-product__badge bh-product__badge--sale">
                        -{discount}%
                      </span>
                    ) : (
                      <span className="bh-product__badge">Best</span>
                    )}
                    <div className="bh-product__actions">
                      <button
                        type="button"
                        className="bh-product__action"
                        onClick={(e) => handleWishlistToggle(e, product)}
                        aria-label="Toggle wishlist"
                      >
                        <i
                          className={`${
                            isInWishlist(product.id) ? "fas" : "far"
                          } fa-heart`}
                        />
                      </button>
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
