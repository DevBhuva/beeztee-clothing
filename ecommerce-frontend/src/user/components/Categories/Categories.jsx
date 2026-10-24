import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import categoryService from "../../../services/categoryService";
import "./Categories.css";

const CATEGORY_IMAGES = {
  "mens-clothing":
    "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&w=1200&q=80",
  "womens-clothing":
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80",
  "mens-accessories":
    "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=1200&q=80",
  "womens-accessories":
    "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1200&q=80",
  footwear:
    "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=80",
};

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80";

export default function Categories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await categoryService.getAllCategories();
        if (response.status && response.data) {
          setCategories(response.data.filter((cat) => cat.isActive).slice(0, 5));
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const getCategoryImage = (category) =>
    CATEGORY_IMAGES[category.slug] || DEFAULT_IMAGE;

  return (
    <section className="bh-section bh-cats" id="categories">
      <div className="bh-section__inner">
        <div className="bh-section__head">
          <div className="bh-section__copy">
            <p className="bh-eyebrow">The rotation</p>
            <h2 className="bh-section__title">Build the fit</h2>
            <p className="bh-section__text">
              Only hits, no misses across the whole drop.
            </p>
          </div>
          <Link to="/shop" className="bh-link">
            Whole Vibe <i className="fas fa-arrow-right" aria-hidden="true" />
          </Link>
        </div>

        {loading ? (
          <div className="bh-loading">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="bh-empty">No categories available yet.</div>
        ) : (
          <div className="bh-cats__grid">
            {categories.map((category, index) => (
              <button
                key={category.id}
                type="button"
                className={`bh-cats__card ${index === 0 ? "bh-cats__card--feature" : ""}`}
                onClick={() => navigate(`/shop?categories=${category.id}`)}
              >
                <img
                  src={getCategoryImage(category)}
                  alt=""
                  className="bh-cats__image"
                  loading="lazy"
                />
                <span className="bh-cats__overlay" />
                <span className="bh-cats__meta">
                  <span className="bh-cats__name">
                    {category.name === "Men"
                      ? "For Him"
                      : category.name === "Women"
                        ? "For Her"
                        : category.name}
                  </span>
                  <span className="bh-cats__cta">The Drop</span>
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
