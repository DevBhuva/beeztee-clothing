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
  const COLOR_HEX = {
    White: '#f4efe6',
    Black: '#1a1612',
    'Sky Blue': '#7eb8d6',
    Beige: '#cbb89a',
    Olive: '#6b7a4d',
    Navy: '#1e2a44',
    Brown: '#6b3f2a',
    Grey: '#8a8680',
    Gray: '#8a8680',
    Champagne: '#e6d5b8',
  };

  const sizes = [...new Set((product.variants || []).map((v) => v.size).filter(Boolean))];
  const colors = [];
  (product.variants || []).forEach((variant) => {
    if (!variant.color || colors.some((item) => item.color === variant.color)) return;
    colors.push({
      color: variant.color,
      colorCode: variant.colorCode || COLOR_HEX[variant.color] || '#c8bfb2',
    });
  });

  const formatPrice = (value) =>
    Number(value || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 });

  // Check if size/color is available
  const isVariantAvailable = (size, color) => {
    const variant = product.variants?.find(
      v => (!size || v.size === size) && (!color || v.color === color)
    );
    return variant && variant.stockQuantity > 0;
  };

  return (
    <div className="product-details">
      {product.brand && (
        <div className="product-brand">Brand · {product.brand.name}</div>
      )}

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
          <span className="current-price">₹{formatPrice(currentPrice)}</span>
          {discount > 0 && (
            <>
              <span className="original-price">₹{formatPrice(originalPrice)}</span>
              <span className="discount-badge">{discount}% off</span>
            </>
          )}
        </div>
        <p className="tax-info">Inclusive of all taxes</p>
      </div>

      {/* Color Selector */}
      {colors.length > 0 && (
        <div className="variant-selector color-selector">
          <label className="selector-label">
            Color <strong>{selectedColor || 'Select'}</strong>
          </label>
          <div className="color-options">
            {colors.map((colorItem) => (
              <button
                key={colorItem.color}
                type="button"
                className={`color-option ${selectedColor === colorItem.color ? 'selected' : ''} ${
                  !isVariantAvailable(selectedSize, colorItem.color) ? 'disabled' : ''
                }`}
                onClick={() => onVariantChange(selectedSize, colorItem.color)}
                disabled={!isVariantAvailable(selectedSize, colorItem.color)}
                title={colorItem.color}
                aria-label={colorItem.color}
                style={{ backgroundColor: colorItem.colorCode }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Size Selector */}
      {sizes.length > 0 && (
        <div className="variant-selector size-selector">
          <div className="selector-header">
            <label className="selector-label">
              Size <strong>{selectedSize || 'Select'}</strong>
            </label>
            <button type="button" className="size-chart-btn" onClick={onShowSizeChart}>
              Size chart
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

      {isInStock && (
        <div className="quantity-selector">
          <label className="selector-label">Quantity</label>
          <div className="quantity-controls">
            <button
              type="button"
              className="qty-btn"
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
            >
              −
            </button>
            <input
              type="text"
              inputMode="numeric"
              className="qty-input"
              value={quantity}
              onChange={(e) => {
                const newQty = parseInt(e.target.value.replace(/\D/g, ''), 10) || 1;
                if (newQty > stockQuantity) {
                  toast.warning(`Only ${stockQuantity} items available in stock`);
                  onQuantityChange(stockQuantity);
                } else {
                  onQuantityChange(Math.max(1, newQty));
                }
              }}
              aria-label="Quantity"
            />
            <button
              type="button"
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
              aria-label="Increase quantity"
            >
              +
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
              Bag it
            </>
          )}
        </button>

        {onBuyNow && (
          <button
            className="btn-secondary"
            onClick={onBuyNow}
            disabled={!isInStock}
          >
            Claim it
          </button>
        )}

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
