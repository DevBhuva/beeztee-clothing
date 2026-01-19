import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Products.css';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch, 
  FaFilter,
  FaToggleOn,
  FaToggleOff,
  FaStar,
  FaRegStar,
  FaImage,
  FaBox,
  FaDollarSign,
  FaChartLine,
  FaEye
} from 'react-icons/fa';
import productService from '../../../services/productService';
import { showSuccess, showError, showConfirmDialog } from '../../../utils/toast';

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterFeatured, setFilterFeatured] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Stats
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    lowStock: 0,
    outOfStock: 0,
    featured: 0
  });

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    filterProductsList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, searchTerm, filterStatus, filterFeatured]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAllProducts({
        page: currentPage,
        limit: 50
      });
      
      console.log('Products Response:', response);
      
      if (response.data && response.data.data) {
        const productsData = response.data.data.products || [];
        setProducts(productsData);
        
        // Calculate stats
        const statsData = {
          total: productsData.length,
          active: productsData.filter(p => p.isActive).length,
          lowStock: productsData.filter(p => p.stockQuantity > 0 && p.stockQuantity <= p.lowStockThreshold).length,
          outOfStock: productsData.filter(p => p.stockQuantity === 0).length,
          featured: productsData.filter(p => p.isFeatured).length
        };
        setStats(statsData);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      showError(error.response?.data?.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const filterProductsList = () => {
    let filtered = [...products];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.name?.toLowerCase().includes(term) ||
        product.sku?.toLowerCase().includes(term) ||
        product.category?.name?.toLowerCase().includes(term) ||
        product.brand?.name?.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      if (filterStatus === 'active') {
        filtered = filtered.filter(p => p.isActive);
      } else if (filterStatus === 'inactive') {
        filtered = filtered.filter(p => !p.isActive);
      } else if (filterStatus === 'published') {
        filtered = filtered.filter(p => p.status === 'published');
      } else if (filterStatus === 'draft') {
        filtered = filtered.filter(p => p.status === 'draft');
      }
    }

    // Featured filter
    if (filterFeatured === 'featured') {
      filtered = filtered.filter(p => p.isFeatured);
    } else if (filterFeatured === 'not-featured') {
      filtered = filtered.filter(p => !p.isFeatured);
    }

    setFilteredProducts(filtered);
  };

  const handleDelete = async (id, name) => {
    const result = await showConfirmDialog({
      title: 'Delete Product',
      text: `Are you sure you want to delete "${name}"?`,
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        const response = await productService.deleteProduct(id);
        if (response.data.status) {
          showSuccess('Product deleted successfully!');
          await fetchProducts();
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        showError(error.response?.data?.message || 'Failed to delete product');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      setLoading(true);
      const response = await productService.toggleProductStatus(id);
      if (response.data.status) {
        showSuccess(`Product ${currentStatus ? 'deactivated' : 'activated'} successfully!`);
        await fetchProducts();
      }
    } catch (error) {
      console.error('Error toggling status:', error);
      showError(error.response?.data?.message || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const getStockStatus = (product) => {
    if (product.stockQuantity === 0) return 'out-of-stock';
    if (product.stockQuantity <= product.lowStockThreshold) return 'low-stock';
    return 'in-stock';
  };

  const getStockStatusText = (product) => {
    if (product.stockQuantity === 0) return 'Out of Stock';
    if (product.stockQuantity <= product.lowStockThreshold) return 'Low Stock';
    return 'In Stock';
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="products-page">
      {/* Header */}
      <div className="products-header">
        <div className="header-content">
          <h1>Products Management</h1>
          <p className="header-subtitle">Manage your product catalog</p>
        </div>
        <button 
          className="create-product-btn"
          onClick={() => navigate('/admin/products/create')}
        >
          <FaPlus /> Create Product
        </button>
      </div>

      {/* Stats Cards */}
      <div className="products-stats">
        <div className="stat-card">
          <div className="stat-icon total">
            <FaBox />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Products</span>
            <span className="stat-value">{stats.total}</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon active">
            <FaChartLine />
          </div>
          <div className="stat-info">
            <span className="stat-label">Active</span>
            <span className="stat-value">{stats.active}</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon warning">
            <FaDollarSign />
          </div>
          <div className="stat-info">
            <span className="stat-label">Low Stock</span>
            <span className="stat-value">{stats.lowStock}</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon danger">
            <FaBox />
          </div>
          <div className="stat-info">
            <span className="stat-label">Out of Stock</span>
            <span className="stat-value">{stats.outOfStock}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon featured">
            <FaStar />
          </div>
          <div className="stat-info">
            <span className="stat-label">Featured</span>
            <span className="stat-value">{stats.featured}</span>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="products-controls">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by name, SKU, category or brand..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button 
          className="filter-toggle-btn"
          onClick={() => setShowFilters(!showFilters)}
        >
          <FaFilter /> Filters
        </button>
      </div>

      {showFilters && (
        <div className="filters-panel">
          <div className="filter-group">
            <label>Status</label>
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Featured</label>
            <select 
              value={filterFeatured} 
              onChange={(e) => setFilterFeatured(e.target.value)}
            >
              <option value="all">All Products</option>
              <option value="featured">Featured Only</option>
              <option value="not-featured">Not Featured</option>
            </select>
          </div>

          <button 
            className="clear-filters-btn"
            onClick={() => {
              setSearchTerm('');
              setFilterStatus('all');
              setFilterFeatured('all');
            }}
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Products Table */}
      <div className="products-table-container">
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading products...</p>
          </div>
        ) : currentItems.length === 0 ? (
          <div className="no-products">
            <FaBox className="no-products-icon" />
            <h3>No Products Found</h3>
            <p>Start by creating your first product</p>
            <button 
              className="create-first-btn"
              onClick={() => navigate('/admin/products/create')}
            >
              <FaPlus /> Create Product
            </button>
          </div>
        ) : (
          <>
            <table className="products-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Category</th>
                  <th>Brand</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Featured</th>
                  <th>Active</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className="product-info">
                        {product.images && product.images.length > 0 ? (
                          <img 
                            src={`http://localhost:3000${product.images[0].imagePath}`} 
                            alt={product.name}
                            className="product-thumbnail"
                          />
                        ) : (
                          <div className="product-thumbnail-placeholder">
                            <FaImage />
                          </div>
                        )}
                        <div className="product-details">
                          <span className="product-name">{product.name}</span>
                          <span className="product-id">#{product.id}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="product-sku">{product.sku}</span>
                    </td>
                    <td>
                      <span className="category-name">
                        {product.category?.name || 'N/A'}
                      </span>
                    </td>
                    <td>
                      <span className="brand-name">
                        {product.brand?.name || 'N/A'}
                      </span>
                    </td>
                    <td>
                      <div className="price-info">
                        {product.salePrice ? (
                          <>
                            <span className="sale-price">₹{product.salePrice}</span>
                            <span className="base-price">₹{product.basePrice}</span>
                          </>
                        ) : (
                          <span className="current-price">₹{product.basePrice}</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className={`stock-badge ${getStockStatus(product)}`}>
                        {product.stockQuantity} {getStockStatusText(product)}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${product.status}`}>
                        {product.status}
                      </span>
                    </td>
                    <td>
                      {product.isFeatured ? (
                        <FaStar className="featured-icon active" />
                      ) : (
                        <FaRegStar className="featured-icon" />
                      )}
                    </td>
                    <td>
                      <button
                        className="toggle-btn"
                        onClick={() => handleToggleStatus(product.id, product.isActive)}
                        title={product.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {product.isActive ? (
                          <FaToggleOn className="toggle-icon active" />
                        ) : (
                          <FaToggleOff className="toggle-icon" />
                        )}
                      </button>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn view"
                          onClick={() => navigate(`/admin/products/${product.id}/view`)}
                          title="View Product"
                        >
                          View
                        </button>
                        <button
                          className="action-btn edit"
                          onClick={() => navigate(`/admin/products/${product.id}/edit`)}
                          title="Edit Product"
                        >
                          Edit
                        </button>
                        <button
                          className="action-btn delete"
                          onClick={() => handleDelete(product.id, product.name)}
                          title="Delete Product"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="pagination-btn"
                >
                  Previous
                </button>
                
                <div className="pagination-numbers">
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => paginate(index + 1)}
                      className={`pagination-number ${currentPage === index + 1 ? 'active' : ''}`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="pagination-btn"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Products;
