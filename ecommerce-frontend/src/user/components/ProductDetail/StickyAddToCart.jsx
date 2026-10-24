import React from 'react';
import { getPrimaryProductImage } from '../../../utils/productImage';
import './StickyAddToCart.css';

const StickyAddToCart = ({ product, currentPrice, isInStock, onAddToCart, onBuyNow, addingToCart }) => {
  const imageUrl = getPrimaryProductImage(product);

  return (
    <div className="sticky-add-to-cart">
      <div className="sticky-container">
        <div className="sticky-product-info">
          <img
            src={imageUrl}
            alt={product.name}
            className="sticky-product-image"
          />
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
            {addingToCart ? 'Adding...' : 'Bag it'}
          </button>
          <button
            className="btn btn-secondary"
            onClick={onBuyNow}
            disabled={!isInStock}
          >
            Claim it
          </button>
        </div>
      </div>
    </div>
  );
};

export default StickyAddToCart;
