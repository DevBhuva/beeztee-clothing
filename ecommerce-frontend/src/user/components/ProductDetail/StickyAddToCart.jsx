import React from 'react';
import './StickyAddToCart.css';

const StickyAddToCart = ({ product, currentPrice, isInStock, onAddToCart, onBuyNow, addingToCart }) => {
  return (
    <div className="sticky-add-to-cart">
      <div className="sticky-container">
        <div className="sticky-product-info">
          {product.images && product.images[0] && (
            <img
              src={`http://localhost:3000${product.images[0].imagePath}`}
              alt={product.name}
              className="sticky-product-image"
            />
          )}
          <div className="sticky-product-details">
            <h4>{product.name}</h4>
            <span className="sticky-price">₹{currentPrice.toFixed(2)}</span>
          </div>
        </div>

        <div className="sticky-actions">
          <button
            className="btn btn-primary"
            onClick={onAddToCart}
            disabled={!isInStock || addingToCart}
          >
            {addingToCart ? 'Adding...' : 'Add to Cart'}
          </button>
          <button
            className="btn btn-secondary"
            onClick={onBuyNow}
            disabled={!isInStock}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default StickyAddToCart;
