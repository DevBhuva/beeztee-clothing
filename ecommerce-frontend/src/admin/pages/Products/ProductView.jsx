import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './ProductView.css';
import { 
  FaEdit, 
  FaArrowLeft,
  FaTag,
  FaBoxes,
  FaDollarSign,
  FaChartLine,
  FaEye,
  FaCalendar,
  FaCheckCircle,
  FaTimesCircle,
  FaStar,
  FaImage
} from 'react-icons/fa';
import productService from '../../../services/productService';
import { showError } from '../../../utils/toast';

const ProductView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchProductData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchProductData = async () => {
    try {
      setLoading(true);
      const response = await productService.getProductById(id);
      
      if (response && response.data && response.data.data) {
        const productData = response.data.data;
        setProduct(productData);
        
        // Set first image as selected
        if (productData.images && productData.images.length > 0) {
          const primaryImage = productData.images.find(img => img.isPrimary) || productData.images[0];
          setSelectedImage(primaryImage);
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      showError('Failed to load product data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPrice = (price) => {
    if (!price) return 'N/A';
    return `₹${parseFloat(price).toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="product-view-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-view-page">
        <div className="error-container">
          <h2>Product not found</h2>
          <button onClick={() => navigate('/admin/products')} className="btn-back">
            <FaArrowLeft /> Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="product-view-page">
      {/* Header */}
      <div className="view-header">
        <div className="header-left">
          <button onClick={() => navigate('/admin/products')} className="btn-back">
            <FaArrowLeft /> Back
          </button>
          <div className="header-info">
            <h1>{product.name}</h1>
            <div className="header-meta">
              <span className="sku-badge">
                <FaTag /> SKU: {product.sku}
              </span>
              <span className={`status-badge status-${product.status}`}>
                {product.status}
              </span>
              {product.isActive ? (
                <span className="badge badge-success">
                  <FaCheckCircle /> Active
                </span>
              ) : (
                <span className="badge badge-danger">
                  <FaTimesCircle /> Inactive
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="header-actions">
          <button 
            onClick={() => navigate(`/admin/products/${id}/edit`)}
            className="btn-edit"
          >
            <FaEdit /> Edit Product
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon price-icon">
            <FaDollarSign />
          </div>
          <div className="stat-info">
            <h3>Base Price</h3>
            <p className="stat-value">{formatPrice(product.basePrice)}</p>
            {product.salePrice && (
              <span className="stat-subtext">Sale: {formatPrice(product.salePrice)}</span>
            )}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stock-icon">
            <FaBoxes />
          </div>
          <div className="stat-info">
            <h3>Stock Quantity</h3>
            <p className="stat-value">{product.stockQuantity}</p>
            <span className="stat-subtext">Low threshold: {product.lowStockThreshold}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon views-icon">
            <FaEye />
          </div>
          <div className="stat-info">
            <h3>View Count</h3>
            <p className="stat-value">{product.viewCount || 0}</p>
            <span className="stat-subtext">Total views</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon rating-icon">
            <FaStar />
          </div>
          <div className="stat-info">
            <h3>Average Rating</h3>
            <p className="stat-value">{product.averageRating || '0.0'}</p>
            <span className="stat-subtext">{product.reviewCount || 0} reviews</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="content-grid">
        {/* Left Column - Images */}
        <div className="images-section">
          <div className="main-image-container">
            {selectedImage ? (
              <img 
                src={`http://localhost:3000${selectedImage.imagePath}`} 
                alt={product.name}
                className="main-image"
              />
            ) : (
              <div className="no-image-placeholder">
                <FaImage size={64} />
                <p>No image available</p>
              </div>
            )}
          </div>
          
          {product.images && product.images.length > 1 && (
            <div className="image-thumbnails">
              {product.images.map((image) => (
                <div 
                  key={image.id}
                  className={`thumbnail ${selectedImage?.id === image.id ? 'active' : ''}`}
                  onClick={() => setSelectedImage(image)}
                >
                  <img 
                    src={`http://localhost:3000${image.imagePath}`} 
                    alt={`${product.name} thumbnail`}
                  />
                  {image.isPrimary && <span className="primary-badge">Primary</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Details */}
        <div className="details-section">
          {/* Basic Information */}
          <div className="info-card">
            <h2>Product Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <label>Category</label>
                <p>{product.category?.name || 'N/A'}</p>
              </div>
              {product.subCategory && (
                <div className="info-item">
                  <label>Subcategory</label>
                  <p>{product.subCategory.name}</p>
                </div>
              )}
              {product.brand && (
                <div className="info-item">
                  <label>Brand</label>
                  <p>{product.brand.name}</p>
                </div>
              )}
              <div className="info-item">
                <label>Display Order</label>
                <p>{product.displayOrder}</p>
              </div>
            </div>

            {product.shortDescription && (
              <div className="info-item full-width">
                <label>Short Description</label>
                <p>{product.shortDescription}</p>
              </div>
            )}

            {product.description && (
              <div className="info-item full-width">
                <label>Full Description</label>
                <p className="description-text">{product.description}</p>
              </div>
            )}
          </div>

          {/* Pricing Details */}
          <div className="info-card">
            <h2>Pricing Details</h2>
            <div className="info-grid">
              <div className="info-item">
                <label>Base Price</label>
                <p className="price-value">{formatPrice(product.basePrice)}</p>
              </div>
              {product.salePrice && (
                <div className="info-item">
                  <label>Sale Price</label>
                  <p className="price-value sale-price">{formatPrice(product.salePrice)}</p>
                </div>
              )}
              {product.costPrice && (
                <div className="info-item">
                  <label>Cost Price</label>
                  <p className="price-value">{formatPrice(product.costPrice)}</p>
                </div>
              )}
              <div className="info-item">
                <label>Tax Rate</label>
                <p>{product.taxRate}%</p>
              </div>
            </div>
          </div>

          {/* Physical Details */}
          <div className="info-card">
            <h2>Physical Details</h2>
            <div className="info-grid">
              {product.weight && (
                <div className="info-item">
                  <label>Weight</label>
                  <p>{product.weight} kg</p>
                </div>
              )}
              {product.dimensions && (
                <>
                  <div className="info-item">
                    <label>Length</label>
                    <p>{product.dimensions.length} {product.dimensions.unit}</p>
                  </div>
                  <div className="info-item">
                    <label>Width</label>
                    <p>{product.dimensions.width} {product.dimensions.unit}</p>
                  </div>
                  <div className="info-item">
                    <label>Height</label>
                    <p>{product.dimensions.height} {product.dimensions.unit}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Visibility Flags */}
          <div className="info-card">
            <h2>Visibility & Features</h2>
            <div className="flags-grid">
              {product.isFeatured && (
                <div className="flag-badge featured">
                  <FaStar /> Featured
                </div>
              )}
              {product.isTrending && (
                <div className="flag-badge trending">
                  <FaChartLine /> Trending
                </div>
              )}
              {product.isNewArrival && (
                <div className="flag-badge new">
                  <FaTag /> New Arrival
                </div>
              )}
              {product.isBestseller && (
                <div className="flag-badge bestseller">
                  <FaStar /> Bestseller
                </div>
              )}
            </div>
          </div>

          {/* Dates */}
          <div className="info-card">
            <h2>Timeline</h2>
            <div className="info-grid">
              <div className="info-item">
                <label><FaCalendar /> Created At</label>
                <p>{formatDate(product.createdAt)}</p>
              </div>
              <div className="info-item">
                <label><FaCalendar /> Updated At</label>
                <p>{formatDate(product.updatedAt)}</p>
              </div>
              {product.publishedAt && (
                <div className="info-item">
                  <label><FaCalendar /> Published At</label>
                  <p>{formatDate(product.publishedAt)}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Attributes Section */}
      {product.attributes && product.attributes.length > 0 && (
        <div className="full-width-section">
          <div className="info-card">
            <h2>Product Attributes</h2>
            <div className="attributes-grid">
              {product.attributes.map((attr) => (
                <div key={attr.id} className="attribute-card">
                  <label>{attr.attributeName}</label>
                  <p>{attr.attributeValue}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Variants Section */}
      {product.variants && product.variants.length > 0 && (
        <div className="full-width-section">
          <div className="info-card">
            <h2>Product Variants ({product.variants.length})</h2>
            <div className="variants-table-wrapper">
              <table className="variants-table">
                <thead>
                  <tr>
                    <th>SKU</th>
                    <th>Size</th>
                    <th>Color</th>
                    <th>Material</th>
                    <th>Style</th>
                    <th>Price</th>
                    <th>Sale Price</th>
                    <th>Stock</th>
                    <th>Weight</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {product.variants.map((variant) => (
                    <tr key={variant.id} className={variant.isDefault ? 'default-variant' : ''}>
                      <td>
                        <span className="variant-sku">{variant.sku}</span>
                        {variant.isDefault && <span className="default-badge">Default</span>}
                      </td>
                      <td>{variant.size || '-'}</td>
                      <td>
                        {variant.color && (
                          <div className="color-display">
                            {variant.colorCode && (
                              <span 
                                className="color-swatch" 
                                style={{ backgroundColor: variant.colorCode }}
                              ></span>
                            )}
                            <span>{variant.color}</span>
                          </div>
                        )}
                        {!variant.color && '-'}
                      </td>
                      <td>{variant.material || '-'}</td>
                      <td>{variant.style || '-'}</td>
                      <td>{variant.price ? formatPrice(variant.price) : formatPrice(product.basePrice)}</td>
                      <td>{variant.salePrice ? formatPrice(variant.salePrice) : (product.salePrice ? formatPrice(product.salePrice) : '-')}</td>
                      <td>
                        <span className={`stock-badge ${variant.stockQuantity === 0 ? 'out-of-stock' : variant.stockQuantity <= product.lowStockThreshold ? 'low-stock' : 'in-stock'}`}>
                          {variant.stockQuantity}
                        </span>
                      </td>
                      <td>{variant.weight ? `${variant.weight} kg` : (product.weight ? `${product.weight} kg` : '-')}</td>
                      <td>
                        {variant.isActive ? (
                          <span className="badge badge-success">Active</span>
                        ) : (
                          <span className="badge badge-inactive">Inactive</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SEO Meta Information */}
      {product.meta && (
        <div className="full-width-section">
          <div className="info-card">
            <h2>SEO Meta Information</h2>
            <div className="info-grid">
              <div className="info-item full-width">
                <label>Meta Title</label>
                <p>{product.meta.metaTitle || 'Not set'}</p>
              </div>
              <div className="info-item full-width">
                <label>Meta Description</label>
                <p>{product.meta.metaDescription || 'Not set'}</p>
              </div>
              <div className="info-item full-width">
                <label>Meta Keywords</label>
                <p>{product.meta.metaKeywords || 'Not set'}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductView;
