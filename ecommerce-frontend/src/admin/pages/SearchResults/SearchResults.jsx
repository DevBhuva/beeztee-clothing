import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FaSearch, FaBox, FaTags, FaEye, FaEdit } from 'react-icons/fa';
import productService from '../../../services/productService';
import brandService from '../../../services/brandService';
import './SearchResults.css';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  const [activeTab, setActiveTab] = useState('all');
  
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [totalResults, setTotalResults] = useState(0);

  const performSearch = useCallback(async (searchQuery) => {
    setLoading(true);
    try {
      let productResults = [];
      let brandResults = [];

      if (activeTab === 'all' || activeTab === 'products') {
        const productResponse = await productService.getAllProducts({
          search: searchQuery,
          page: 1,
          limit: 20
        });
        productResults = productResponse.data?.products || [];
        setProducts(productResults);
      }

      if (activeTab === 'all' || activeTab === 'brands') {
        const brandResponse = await brandService.getAllBrands({
          search: searchQuery
        });
        brandResults = brandResponse.data?.brands || [];
        setBrands(brandResults);
      }

      const total = productResults.length + brandResults.length;
      setTotalResults(total);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query, performSearch]);

  const renderProductCard = (product) => (
    <div key={product.id} className="search-result-card">
      <div className="result-type-badge">
        <FaBox /> Product
      </div>
      <div className="result-image">
        {product.images && product.images.length > 0 ? (
          <img 
            src={`${import.meta.env.VITE_API_URL}/uploads/products/${product.images[0].imageUrl}`} 
            alt={product.name}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/150?text=No+Image';
            }}
          />
        ) : (
          <div className="no-image">
            <FaBox />
          </div>
        )}
      </div>
      <div className="result-content">
        <h3 className="result-title">{product.name}</h3>
        <p className="result-sku">SKU: {product.sku}</p>
        <p className="result-description">{product.shortDescription}</p>
        <div className="result-meta">
          <div className="result-price">
            {product.salePrice ? (
              <>
                <span className="sale-price">₹{product.salePrice}</span>
                <span className="base-price">₹{product.basePrice}</span>
              </>
            ) : (
              <span className="price">₹{product.basePrice}</span>
            )}
          </div>
          <div className="result-stock">
            <span className={`stock-badge ${product.stockQuantity > 0 ? 'in-stock' : 'out-stock'}`}>
              {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Out of stock'}
            </span>
          </div>
        </div>
        <div className="result-actions">
          <button 
            className="action-btn view-btn"
            onClick={() => navigate(`/admin/products/${product.id}/view`)}
          >
            <FaEye /> View
          </button>
          <button 
            className="action-btn edit-btn"
            onClick={() => navigate(`/admin/products/${product.id}/edit`)}
          >
            <FaEdit /> Edit
          </button>
        </div>
      </div>
    </div>
  );

  const renderBrandCard = (brand) => (
    <div key={brand.id} className="search-result-card">
      <div className="result-type-badge brand-badge">
        <FaTags /> Brand
      </div>
      <div className="result-image">
        {brand.logo ? (
          <img 
            src={`${import.meta.env.VITE_API_URL}/uploads/brands/${brand.logo}`} 
            alt={brand.name}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/150?text=No+Logo';
            }}
          />
        ) : (
          <div className="no-image">
            <FaTags />
          </div>
        )}
      </div>
      <div className="result-content">
        <h3 className="result-title">{brand.name}</h3>
        <p className="result-description">{brand.description}</p>
        <div className="result-meta">
          <span className={`status-badge ${brand.isActive ? 'active' : 'inactive'}`}>
            {brand.isActive ? 'Active' : 'Inactive'}
          </span>
          {brand.isFeatured && <span className="featured-badge">Featured</span>}
        </div>
        <div className="result-actions">
          <button 
            className="action-btn view-btn"
            onClick={() => navigate(`/admin/brands?id=${brand.id}`)}
          >
            <FaEye /> View Brand
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="search-results-page">
      <div className="search-header">
        <div className="search-header-top">
          <div className="search-icon-wrapper">
            <FaSearch />
          </div>
          <div className="search-header-content">
            <h1>Search Results</h1>
            <p className="search-query">
              Showing results for: <span>"{query}"</span>
            </p>
          </div>
        </div>

        <div className="search-tabs">
          <button 
            className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Results ({totalResults})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <FaBox /> Products ({products.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'brands' ? 'active' : ''}`}
            onClick={() => setActiveTab('brands')}
          >
            <FaTags /> Brands ({brands.length})
          </button>
        </div>
      </div>

      <div className="search-results-container">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Searching...</p>
          </div>
        ) : (
          <>
            {totalResults === 0 ? (
              <div className="no-results">
                <FaSearch className="no-results-icon" />
                <h2>No results found</h2>
                <p>Try adjusting your search terms or filters</p>
              </div>
            ) : (
              <div className="results-grid">
                {(activeTab === 'all' || activeTab === 'products') && 
                  products.map(product => renderProductCard(product))
                }
                {(activeTab === 'all' || activeTab === 'brands') && 
                  brands.map(brand => renderBrandCard(brand))
                }
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
