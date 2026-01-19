import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./BestSellers.css";
import categoryService from "../../../services/categoryService";
import productService from "../../../services/productService";
import { useCart } from "../../../context/CartContext";
import { useWishlist } from "../../../context/WishlistContext";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "react-toastify";

const BestSellers = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(4); // Show 4 products initially
  const [showLoadMore, setShowLoadMore] = useState(false);
  
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  // Fetch categories and products on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch all categories
        const categoriesResponse = await categoryService.getAllCategories();
        if (categoriesResponse.status && categoriesResponse.data) {
          // Filter only active categories
          const activeCategories = categoriesResponse.data.filter(
            (cat) => cat.isActive
          );
          setCategories(activeCategories);
        }

        // Fetch all bestseller products
        const productsResponse = await productService.getBestsellers(50);
        console.log("Products Response:", productsResponse);

        // Handle the actual response structure: response.data.data.products
        if (
          productsResponse?.data?.status &&
          Array.isArray(productsResponse?.data?.data?.products)
        ) {
          const productsData = productsResponse.data.data.products;
          console.log("First product with images:", productsData[0]);
          setProducts(productsData);
        } else if (
          productsResponse?.data?.status &&
          Array.isArray(productsResponse?.data?.data)
        ) {
          setProducts(productsResponse.data.data);
        } else if (
          productsResponse?.status &&
          Array.isArray(productsResponse?.data)
        ) {
          setProducts(productsResponse.data);
        } else if (Array.isArray(productsResponse)) {
          setProducts(productsResponse);
        } else {
          console.error(
            "Unexpected products response structure:",
            productsResponse
          );
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setProducts([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter products based on active filter (by categoryId)
  const allFilteredProducts = Array.isArray(products)
    ? activeFilter === "all"
      ? products
      : products.filter(
          (product) => product.categoryId === parseInt(activeFilter)
        )
    : [];

  // Products to display based on displayCount
  const filteredProducts = allFilteredProducts.slice(0, displayCount);

  // Update showLoadMore when filter changes or products change
  useEffect(() => {
    setShowLoadMore(allFilteredProducts.length > displayCount);
  }, [allFilteredProducts.length, displayCount]);

  // Handle filter tab click
  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    setDisplayCount(4); // Reset to 4 products when changing filters
  };

  // Handle Load More button click
  const handleLoadMore = () => {
    setDisplayCount(12); // Show 12 products total
  };

  // Handle add to cart
  const handleAddToCart = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }

    await addToCart(product.id, 1);
  };

  // Handle wishlist toggle
  const handleWishlistToggle = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('Please login to add items to wishlist');
      return;
    }

    await toggleWishlist(product.id);
  };

  // Get product image URL
  const getProductImage = (product) => {
    const baseURL = "http://localhost:3000";

    // Check for 'images' alias (used by backend)
    if (product.images && product.images.length > 0) {
      const primaryImage =
        product.images.find((img) => img.isPrimary) || product.images[0];
      // Use imagePath field from database
      const imageUrl = `${baseURL}${
        primaryImage.imagePath || primaryImage.imageUrl
      }`;
      return imageUrl;
    }

    // Fallback check for 'ProductImages' alias
    if (product.ProductImages && product.ProductImages.length > 0) {
      const primaryImage =
        product.ProductImages.find((img) => img.isPrimary) ||
        product.ProductImages[0];
      const imageUrl = `${baseURL}${
        primaryImage.imagePath || primaryImage.imageUrl
      }`;
      return imageUrl;
    }

    return "https://via.placeholder.com/400x500?text=No+Image";
  };

  // Calculate discount percentage
  const getDiscountPercentage = (basePrice, salePrice) => {
    if (!salePrice || salePrice >= basePrice) return null;
    const discount = (((basePrice - salePrice) / basePrice) * 100).toFixed(0);
    return `-${discount}%`;
  };

  // Get product colors from variants
  const getProductColors = (product) => {
    if (product.ProductVariants && product.ProductVariants.length > 0) {
      const colors = product.ProductVariants.filter(
        (variant) => variant.colorCode
      ).map((variant) => variant.colorCode);
      return [...new Set(colors)]; // Remove duplicates
    }
    return ["#f8f8f8", "#333", "#c9a961"]; // Default colors
  };

  // Calculate average rating from reviews
  const getAverageRating = (product) => {
    // For now, return a default rating since we don't have reviews yet
    // You can implement this when you add reviews feature
    return 4.5;
  };

  // Get reviews count
  const getReviewsCount = (product) => {
    // Return 0 for now, implement when you have reviews
    return 0;
  };

  // Render star rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className="fas fa-star"></i>);
    }
    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt"></i>);
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(<i key={`empty-${i}`} className="far fa-star"></i>);
    }
    return stars;
  };

  return (
    <div>
      {/* Best Sellers Section */}
      <section id="shop" className="best-sellers">
        {/* Filter Tabs */}
        <div className="filter-tabs">
          <div
            className={`filter-tab ${activeFilter === "all" ? "active" : ""}`}
            onClick={() => handleFilterClick("all")}
          >
            All Products
          </div>
          {categories.map((category) => (
            <div
              key={category.id}
              className={`filter-tab ${
                activeFilter === category.id.toString() ? "active" : ""
              }`}
              onClick={() => handleFilterClick(category.id.toString())}
              data-category-id={category.id}
            >
              {category.name}
            </div>
          ))}
        </div>

        {/* Products Grid */}
        <div className="products-grid" id="products-grid">
          {loading ? (
            <div className="loading-message">Loading products...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="no-products-message">
              No bestseller products found in this category.
            </div>
          ) : (
            filteredProducts.map((product) => {
              const productColors = getProductColors(product);
              const discountPercent = getDiscountPercentage(
                product.basePrice,
                product.salePrice
              );
              const rating = getAverageRating(product);
              const reviewCount = getReviewsCount(product);

              return (
                <div
                  key={product.id}
                  className="product-card"
                  data-category={product.categoryId}
                >
                  <Link to={`/product/${product.slug}`} className="product-image-container">
                    <img
                      src={getProductImage(product)}
                      alt={product.name}
                      className="product-image"
                    />
                    <div className="product-badge">Best Seller</div>
                    <div className="product-actions">
                      <button
                        className="action-btn"
                        onClick={(e) => handleWishlistToggle(e, product)}
                      >
                        <i
                          className={
                            isInWishlist(product.id)
                              ? "fas fa-heart"
                              : "far fa-heart"
                          }
                          style={{
                            color: isInWishlist(product.id)
                              ? "#ff0080"
                              : "",
                          }}
                        ></i>
                      </button>
                      <button
                        className="action-btn"
                        onClick={(e) => handleAddToCart(e, product)}
                      >
                        <i className="fas fa-shopping-bag"></i>
                      </button>
                    </div>
                  </Link>
                  <div className="product-info">
                    <div className="product-category">
                      {product.category?.name || product.Category?.name || "Uncategorized"}
                    </div>
                    <Link to={`/product/${product.slug}`}>
                      <h3 className="product-name">{product.name}</h3>
                    </Link>
                    <div className="product-rating">
                      <div className="stars">{renderStars(rating)}</div>
                      <span className="rating-count">({reviewCount})</span>
                    </div>
                    <div className="product-price">
                      <span className="current-price">
                        ₹{product.salePrice || product.basePrice}
                      </span>
                      {product.salePrice &&
                        product.salePrice < product.basePrice && (
                          <>
                            <span className="original-price">
                              ₹{product.basePrice}
                            </span>
                            <span className="discount">{discountPercent}</span>
                          </>
                        )}
                    </div>
                   
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Load More Button */}
        {!loading && showLoadMore && (
          <div className="load-more-container">
            <button className="load-more-btn" onClick={handleLoadMore}>
              Load More Products
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default BestSellers;
