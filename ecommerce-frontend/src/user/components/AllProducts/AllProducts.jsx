import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import categoryService from "../../../services/categoryService";
import productService from "../../../services/productService";
import { useCart } from "../../../context/CartContext";
import { useWishlist } from "../../../context/WishlistContext";
import { useAuth } from "../../../context/AuthContext";
import { getPrimaryProductImage } from "../../../utils/productImage";
import { toast } from "react-toastify";
import "./AllProducts.css";

export default function AllProducts() {
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
          productService.getAllProducts({
            isActive: true,
            status: "published",
            limit: 60,
            sortBy: "displayOrder",
            order: "ASC",
          }),
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
        console.error("Error fetching catalog:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const visibleProducts = useMemo(() => {
    if (activeFilter === "all") return products;
    return products.filter((product) => product.categoryId === Number(activeFilter));
  }, [products, activeFilter]);

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
    <section className="bh-section bh-catalog" id="the-drop" aria-labelledby="catalog-title">
      <div className="bh-section__inner">
        <div className="bh-section__head">
          <div className="bh-section__copy">
            <p className="bh-eyebrow">The vault</p>
            <h2 id="catalog-title" className="bh-section__title">
              All the looks
            </h2>
            <p className="bh-section__text">
              Every shirt, oversized tee, and crop in the house — shop the full drop.
            </p>
          </div>
          <Link to="/shop" className="bh-link">
            Shop it all <i className="fas fa-arrow-right" aria-hidden="true" />
          </Link>
        </div>

        <div className="bh-catalog__filters" role="tablist" aria-label="Filter catalog">
          <button
            type="button"
            role="tab"
            aria-selected={activeFilter === "all"}
            className={`bh-catalog__filter ${activeFilter === "all" ? "is-active" : ""}`}
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
              className={`bh-catalog__filter ${
                activeFilter === String(category.id) ? "is-active" : ""
              }`}
              onClick={() => setActiveFilter(String(category.id))}
            >
              {category.name === "Men" ? "Him" : category.name === "Women" ? "Her" : category.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="bh-loading">Loading the drop...</div>
        ) : visibleProducts.length === 0 ? (
          <div className="bh-empty">No pieces in this edit yet.</div>
        ) : (
          <div className="bh-catalog__grid">
            {visibleProducts.map((product) => {
              const price = product.salePrice || product.basePrice;
              const hasSale = product.salePrice && Number(product.salePrice) < Number(product.basePrice);
              const discount = hasSale
                ? Math.round(
                    ((Number(product.basePrice) - Number(product.salePrice)) /
                      Number(product.basePrice)) *
                      100
                  )
                : null;

              return (
                <article key={product.id} className="bh-product">
                  <div className="bh-product__media">
                    <Link to={`/product/${product.slug}`} className="bh-product__link">
                      <img
                        src={getPrimaryProductImage(product)}
                        alt={product.name}
                        loading="lazy"
                      />
                    </Link>
                    {discount ? (
                      <span className="bh-product__badge bh-product__badge--sale">
                        -{discount}%
                      </span>
                    ) : product.isNewArrival ? (
                      <span className="bh-product__badge">New</span>
                    ) : null}
                    <div className="bh-product__actions">
                      <button
                        type="button"
                        className="bh-product__action"
                        onClick={(e) => handleWishlistToggle(e, product)}
                        aria-label="Toggle wishlist"
                      >
                        <i className={`${isInWishlist(product.id) ? "fas" : "far"} fa-heart`} />
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
                      {product.category?.name || product.Category?.name || "Collection"}
                    </p>
                    <Link to={`/product/${product.slug}`} className="bh-product__name">
                      {product.name}
                    </Link>
                    <p className="bh-product__price">
                      <span>₹{Number(price).toLocaleString("en-IN")}</span>
                      {hasSale && <s>₹{Number(product.basePrice).toLocaleString("en-IN")}</s>}
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
