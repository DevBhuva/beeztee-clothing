import React from 'react';
import { toast } from 'react-toastify';
import './ProductDetail_v2.css';

const ProductInfo = ({
  product,
  selectedVariant,
  selectedSize,
  selectedColor,
  quantity,
  isInWishlist,
  isInStock,
  stockQuantity,
  currentPrice,
  originalPrice,
  discount,
  onVariantChange,
  onQuantityChange,
  onAddToCart,
  onBuyNow,
  onWishlistToggle,
  onShare,
  onShowSizeChart,
  addingToCart,
  addingToWishlist,
  isAuthenticated
}) => {
  // Get unique sizes and colors
  const sizes = [...new Set(product.variants?.map(v => v.size).filter(Boolean))];
  const colors = [...new Set(product.variants?.map(v => ({ color: v.color, colorCode: v.colorCode })).filter(c => c.color))];

  // Check if size/color is available
  const isVariantAvailable = (size, color) => {
    const variant = product.variants?.find(
      v => (!size || v.size === size) && (!color || v.color === color)
    );
    return variant && variant.stockQuantity > 0;
  };

  return (
    <div className="product-details">
      {/* Brand */}
      {product.brand && (
        <div className="product-brand">Brand: {product.brand.name}</div>
      )}

      {/* Product Name */}
      <h1 className="product-title">{product.name}</h1>

      {/* Rating & Reviews */}
      <div className="product-rating-section">
        <div className="rating-display">
          <div className="rating-stars">
            {[...Array(5)].map((_, i) => (
              <i
                key={i}
                className={`fas fa-star ${i < Math.floor(Number(product.averageRating) || 0) ? 'filled' : ''}`}
              ></i>
            ))}
          </div>
          <span className="rating-value">
            {product.averageRating ? Number(product.averageRating).toFixed(1) : '0.0'}
          </span>
          <span className="rating-count">({product.reviewCount || 0} reviews)</span>
        </div>
      </div>

      {/* Price */}
      <div className="product-price-section">
        <div className="price-display">
          <span className="current-price">₹{currentPrice.toFixed(2)}</span>
          {discount > 0 && (
            <>
              <span className="original-price">₹{originalPrice.toFixed(2)}</span>
              <span className="discount-badge">{discount}% OFF</span>
            </>
          )}
        </div>
        <p className="tax-info">Inclusive of all taxes</p>
      </div>

      {/* Color Selector */}
      {colors.length > 0 && (
        <div className="variant-selector color-selector">
          <label className="selector-label">
            Color: <strong>{selectedColor || 'Select'}</strong>
          </label>
          <div className="color-options">
            {colors.map((colorItem, index) => (
              <button
                key={index}
                className={`color-option ${selectedColor === colorItem.color ? 'selected' : ''} ${
                  !isVariantAvailable(selectedSize, colorItem.color) ? 'disabled' : ''
                }`}
                onClick={() => onVariantChange(selectedSize, colorItem.color)}
                disabled={!isVariantAvailable(selectedSize, colorItem.color)}
                title={colorItem.color}
                style={{
                  backgroundColor: colorItem.colorCode || '#ddd'
                }}
              >
                {selectedColor === colorItem.color && (
                  <i className="fas fa-check"></i>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Size Selector */}
      {sizes.length > 0 && (
        <div className="variant-selector size-selector">
          <div className="selector-header">
            <label className="selector-label">
              Size: <strong>{selectedSize || 'Select'}</strong>
            </label>
            <button className="size-chart-btn" onClick={onShowSizeChart}>
              <i className="fas fa-ruler"></i>
              Size Chart
            </button>
          </div>
          <div className="size-options">
            {sizes.map((size, index) => (
              <button
                key={index}
                className={`size-option ${selectedSize === size ? 'selected' : ''} ${
                  !isVariantAvailable(size, selectedColor) ? 'disabled' : ''
                }`}
                onClick={() => onVariantChange(size, selectedColor)}
                disabled={!isVariantAvailable(size, selectedColor)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Stock Status */}
      <div className={`stock-status ${isInStock ? 'in-stock' : 'out-of-stock'}`}>
        {isInStock ? (
          <>
            <i className="fas fa-check-circle"></i>
            <span>In Stock</span>
            {stockQuantity < 10 && (
              <span className="low-stock">Only {stockQuantity} left!</span>
            )}
          </>
        ) : (
          <>
            <i className="fas fa-times-circle"></i>
            <span>Out of Stock</span>
          </>
        )}
      </div>

      {/* Quantity Selector */}
      {isInStock && (
        <div className="quantity-selector">
          <label className="selector-label">Quantity:</label>
          <div className="quantity-controls">
            <button
              className="qty-btn"
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              <i className="fas fa-minus"></i>
            </button>
            <input
              type="number"
              className="qty-input"
              value={quantity}
              onChange={(e) => {
                const newQty = parseInt(e.target.value) || 1;
                if (newQty > stockQuantity) {
                  toast.warning(`Only ${stockQuantity} items available in stock`);
                  onQuantityChange(stockQuantity);
                } else {
                  onQuantityChange(Math.max(1, newQty));
                }
              }}
              min="1"
              max={stockQuantity}
            />
            <button
              className="qty-btn"
              onClick={() => {
                if (quantity >= stockQuantity) {
                  toast.warning(`Only ${stockQuantity} items available in stock`);
                } else {
                  onQuantityChange(quantity + 1);
                }
              }}
              disabled={quantity >= stockQuantity}
              title={quantity >= stockQuantity ? `Maximum stock: ${stockQuantity}` : ''}
            >
              <i className="fas fa-plus"></i>
            </button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="action-buttons">
        <button
          className="btn-primary"
          onClick={onAddToCart}
          disabled={!isInStock || addingToCart}
        >
          {addingToCart ? (
            <>
              <i className="fas fa-spinner fa-spin"></i>
              Adding...
            </>
          ) : (
            <>
              <i className="fas fa-shopping-cart"></i>
              Add to Cart
            </>
          )}
        </button>

        <button
          className={`btn-wishlist ${isInWishlist ? 'active' : ''}`}
          onClick={onWishlistToggle}
          disabled={addingToWishlist}
          title={isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          {addingToWishlist ? (
            <i className="fas fa-spinner fa-spin"></i>
          ) : (
            <i className={`${isInWishlist ? 'fas' : 'far'} fa-heart`}></i>
          )}
        </button>
      </div>

      {/* Share Buttons */}
      <div className="product-share">
        <span className="share-label">Share:</span>
        <div className="share-buttons">
          <button className="share-btn facebook" onClick={() => onShare('facebook')} title="Share on Facebook">
            <i className="fab fa-facebook-f"></i>
          </button>
          <button className="share-btn twitter" onClick={() => onShare('twitter')} title="Share on Twitter">
            <i className="fab fa-twitter"></i>
          </button>
          <button className="share-btn whatsapp" onClick={() => onShare('whatsapp')} title="Share on WhatsApp">
            <i className="fab fa-whatsapp"></i>
          </button>
          <button className="share-btn pinterest" onClick={() => onShare('pinterest')} title="Share on Pinterest">
            <i className="fab fa-pinterest-p"></i>
          </button>
          <button className="share-btn copy" onClick={() => onShare('copy')} title="Copy Link">
            <i className="fas fa-link"></i>
          </button>
        </div>
      </div>

      {/* Product Features */}
      <div className="product-features">
        <div className="feature">
          <i className="fas fa-lock"></i>
          <span>100% Secure Payment</span>
        </div>
        <div className="feature">
          <i className="fas fa-truck"></i>
          <span>Free Shipping Above ₹499</span>
        </div>
        <div className="feature">
          <i className="fas fa-undo"></i>
          <span>Easy 7 Days Return</span>
        </div>
      </div>

      {/* Short Description */}
      {product.shortDescription && (
        <div className="product-short-description">
          <span className="share-label">Description:</span>
          <p>{product.shortDescription}</p>
        </div>
      )}

      {/* Key Features */}
      {product.attributes && product.attributes.length > 0 && (
        <div className="product-features">
          <h3>Key Features:</h3>
          <ul>
            {product.attributes.slice(0, 5).map((attr, index) => (
              <li key={index}>
                <i className="fas fa-check-circle"></i>
                <strong>{attr.attributeName}:</strong> {attr.attributeValue}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Seller Info */}
      {product.seller && (
        <div className="seller-info">
          <h4>Sold By:</h4>
          <div className="seller-details">
            <span className="seller-name">{product.seller.name}</span>
            {product.seller.rating && (
              <div className="seller-rating">
                <i className="fas fa-star"></i>
                <span>{product.seller.rating}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductInfo;
