import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import productService from '../../../services/productService';
import './SimilarProducts.css';

const SimilarProducts = ({ categoryId, currentProductId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSimilarProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId]);

  const fetchSimilarProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAllProducts({
        categoryId,
        limit: 8,
        isActive: 'true',
        status: 'published'
      });

      if (response.data.status && response.data.data) {
        const filtered = response.data.data.products.filter(p => p.id !== currentProductId);
        setProducts(filtered.slice(0, 6));
      }
    } catch (error) {
      console.error('Error fetching similar products:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProductImage = (product) => {
    if (product.images && product.images.length > 0) {
      return `http://localhost:3000${product.images[0].imagePath}`;
    }
    return 'https://via.placeholder.com/250x300?text=No+Image';
  };

  if (loading || products.length === 0) return null;

  return (
    <div className="similar-products-section">
      <h2>Similar Products</h2>
      <div className="similar-products-grid">
        {products.map(product => (
          <Link
            key={product.id}
            to={`/product/${product.slug}`}
            className="similar-product-card"
          >
            <div className="product-image">
              <img src={getProductImage(product)} alt={product.name} />
            </div>
            <div className="product-info">
              <h4>{product.name}</h4>
              <div className="product-price">
                <span className="current">₹{product.salePrice || product.basePrice}</span>
                {product.salePrice && product.salePrice < product.basePrice && (
                  <span className="original">₹{product.basePrice}</span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SimilarProducts;
