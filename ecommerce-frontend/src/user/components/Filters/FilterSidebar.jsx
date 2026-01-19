import React, { useState } from 'react';
import { useFilters } from '../../../context/FilterContext';
import './Filters.css';

const FilterSidebar = ({ className = '' }) => {
  const {
    filters,
    availableFilters,
    toggleFilter,
    setSingleFilter,
    setPriceRange,
    setRatingFilter,
    clearFilter
  } = useFilters();

  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    brands: false,
    sizes: false,
    colors: false,
    materials: false,
    patterns: false,
    fits: false,
    occasions: false,
    seasons: false,
    rating: false,
    availability: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const pricePresets = [
    { label: 'Under ₹500', min: 0, max: 500 },
    { label: '₹500 - ₹1000', min: 500, max: 1000 },
    { label: '₹1000 - ₹2000', min: 1000, max: 2000 },
    { label: '₹2000 - ₹5000', min: 2000, max: 5000 },
    { label: '₹5000 - ₹10000', min: 5000, max: 10000 },
    { label: 'Above ₹10000', min: 10000, max: null }
  ];

  const ratingOptions = [4, 3, 2, 1];

  const isPricePresetActive = (min, max) => {
    return filters.minPrice === min && (max === null ? filters.maxPrice === null : filters.maxPrice === max);
  };

  return (
    <div className={`filter-sidebar ${className}`}>
      <div className="filter-sidebar-header">
        <h2 className="filter-sidebar-title">Filters</h2>
      </div>

      <div className="filter-sections">
        
        {/* CATEGORY FILTER */}
        {availableFilters.categories?.length > 0 && (
          <div className="filter-section">
            <div 
              className="filter-section-header" 
              onClick={() => toggleSection('categories')}
            >
              <h3 className="filter-section-title">Category</h3>
              <i className={`fas fa-chevron-${expandedSections.categories ? 'up' : 'down'}`}></i>
            </div>
            {expandedSections.categories && (
              <div className="filter-section-content">
                {availableFilters.categories.map(category => (
                  <label key={category.id} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(category.id.toString())}
                      onChange={() => toggleFilter('categories', category.id.toString())}
                    />
                    <span className="filter-checkbox-label">
                      {category.name}
                      {category.image && (
                        <img 
                          src={`http://localhost:3000${category.image}`} 
                          alt={category.name} 
                          className="category-icon"
                        />
                      )}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PRICE FILTER */}
        <div className="filter-section">
          <div 
            className="filter-section-header" 
            onClick={() => toggleSection('price')}
          >
            <h3 className="filter-section-title">Price</h3>
            <i className={`fas fa-chevron-${expandedSections.price ? 'up' : 'down'}`}></i>
          </div>
          {expandedSections.price && (
            <div className="filter-section-content">
              <div className="price-presets">
                {pricePresets.map((preset, index) => (
                  <label key={index} className="filter-radio">
                    <input
                      type="radio"
                      name="priceRange"
                      checked={isPricePresetActive(preset.min, preset.max)}
                      onChange={() => setPriceRange(preset.min, preset.max)}
                    />
                    <span className="filter-radio-label">{preset.label}</span>
                  </label>
                ))}
              </div>
              {(filters.minPrice !== null || filters.maxPrice !== null) && (
                <button 
                  className="clear-filter-btn"
                  onClick={() => clearFilter('minPrice') && clearFilter('maxPrice')}
                >
                  Clear Price Filter
                </button>
              )}
            </div>
          )}
        </div>

        {/* BRAND FILTER */}
        {availableFilters.brands?.length > 0 && (
          <div className="filter-section">
            <div 
              className="filter-section-header" 
              onClick={() => toggleSection('brands')}
            >
              <h3 className="filter-section-title">Brand</h3>
              <i className={`fas fa-chevron-${expandedSections.brands ? 'up' : 'down'}`}></i>
            </div>
            {expandedSections.brands && (
              <div className="filter-section-content filter-scrollable">
                {availableFilters.brands.map(brand => (
                  <label key={brand.id} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={filters.brands.includes(brand.id.toString())}
                      onChange={() => toggleFilter('brands', brand.id.toString())}
                    />
                    <span className="filter-checkbox-label">
                      {brand.name}
                      {brand.logo && (
                        <img 
                          src={`http://localhost:3000${brand.logo}`} 
                          alt={brand.name} 
                          className="brand-logo-small"
                        />
                      )}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SIZE FILTER */}
        {availableFilters.sizes?.length > 0 && (
          <div className="filter-section">
            <div 
              className="filter-section-header" 
              onClick={() => toggleSection('sizes')}
            >
              <h3 className="filter-section-title">Size</h3>
              <i className={`fas fa-chevron-${expandedSections.sizes ? 'up' : 'down'}`}></i>
            </div>
            {expandedSections.sizes && (
              <div className="filter-section-content">
                <div className="size-grid">
                  {availableFilters.sizes.map(size => (
                    <button
                      key={size}
                      className={`size-button ${filters.sizes.includes(size) ? 'active' : ''}`}
                      onClick={() => toggleFilter('sizes', size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* COLOR FILTER */}
        {availableFilters.colors?.length > 0 && (
          <div className="filter-section">
            <div 
              className="filter-section-header" 
              onClick={() => toggleSection('colors')}
            >
              <h3 className="filter-section-title">Color</h3>
              <i className={`fas fa-chevron-${expandedSections.colors ? 'up' : 'down'}`}></i>
            </div>
            {expandedSections.colors && (
              <div className="filter-section-content">
                <div className="color-grid">
                  {availableFilters.colors.map(color => (
                    <button
                      key={color.color}
                      className={`color-swatch ${filters.colors.includes(color.color) ? 'active' : ''}`}
                      onClick={() => toggleFilter('colors', color.color)}
                      style={{ backgroundColor: color.colorCode || '#ccc' }}
                      title={color.color}
                    >
                      {filters.colors.includes(color.color) && (
                        <i className="fas fa-check"></i>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* MATERIAL FILTER */}
        {availableFilters.materials?.length > 0 && (
          <div className="filter-section">
            <div 
              className="filter-section-header" 
              onClick={() => toggleSection('materials')}
            >
              <h3 className="filter-section-title">Material</h3>
              <i className={`fas fa-chevron-${expandedSections.materials ? 'up' : 'down'}`}></i>
            </div>
            {expandedSections.materials && (
              <div className="filter-section-content filter-scrollable">
                {availableFilters.materials.map(material => (
                  <label key={material} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={filters.materials.includes(material)}
                      onChange={() => toggleFilter('materials', material)}
                    />
                    <span className="filter-checkbox-label">{material}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PATTERN FILTER */}
        {availableFilters.patterns?.length > 0 && (
          <div className="filter-section">
            <div 
              className="filter-section-header" 
              onClick={() => toggleSection('patterns')}
            >
              <h3 className="filter-section-title">Pattern</h3>
              <i className={`fas fa-chevron-${expandedSections.patterns ? 'up' : 'down'}`}></i>
            </div>
            {expandedSections.patterns && (
              <div className="filter-section-content">
                {availableFilters.patterns.map(pattern => (
                  <label key={pattern} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={filters.patterns.includes(pattern)}
                      onChange={() => toggleFilter('patterns', pattern)}
                    />
                    <span className="filter-checkbox-label">{pattern}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* FIT FILTER */}
        {availableFilters.fits?.length > 0 && (
          <div className="filter-section">
            <div 
              className="filter-section-header" 
              onClick={() => toggleSection('fits')}
            >
              <h3 className="filter-section-title">Fit</h3>
              <i className={`fas fa-chevron-${expandedSections.fits ? 'up' : 'down'}`}></i>
            </div>
            {expandedSections.fits && (
              <div className="filter-section-content">
                {availableFilters.fits.map(fit => (
                  <label key={fit} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={filters.fits.includes(fit)}
                      onChange={() => toggleFilter('fits', fit)}
                    />
                    <span className="filter-checkbox-label">{fit}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* OCCASION FILTER */}
        {availableFilters.occasions?.length > 0 && (
          <div className="filter-section">
            <div 
              className="filter-section-header" 
              onClick={() => toggleSection('occasions')}
            >
              <h3 className="filter-section-title">Occasion</h3>
              <i className={`fas fa-chevron-${expandedSections.occasions ? 'up' : 'down'}`}></i>
            </div>
            {expandedSections.occasions && (
              <div className="filter-section-content">
                {availableFilters.occasions.map(occasion => (
                  <label key={occasion} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={filters.occasions.includes(occasion)}
                      onChange={() => toggleFilter('occasions', occasion)}
                    />
                    <span className="filter-checkbox-label">{occasion}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SEASON FILTER */}
        {availableFilters.seasons?.length > 0 && (
          <div className="filter-section">
            <div 
              className="filter-section-header" 
              onClick={() => toggleSection('seasons')}
            >
              <h3 className="filter-section-title">Season</h3>
              <i className={`fas fa-chevron-${expandedSections.seasons ? 'up' : 'down'}`}></i>
            </div>
            {expandedSections.seasons && (
              <div className="filter-section-content">
                {availableFilters.seasons.map(season => (
                  <label key={season} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={filters.seasons.includes(season)}
                      onChange={() => toggleFilter('seasons', season)}
                    />
                    <span className="filter-checkbox-label">{season}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* RATING FILTER */}
        <div className="filter-section">
          <div 
            className="filter-section-header" 
            onClick={() => toggleSection('rating')}
          >
            <h3 className="filter-section-title">Customer Rating</h3>
            <i className={`fas fa-chevron-${expandedSections.rating ? 'up' : 'down'}`}></i>
          </div>
          {expandedSections.rating && (
            <div className="filter-section-content">
              {ratingOptions.map(rating => (
                <label key={rating} className="filter-radio rating-option">
                  <input
                    type="radio"
                    name="rating"
                    checked={filters.minRating === rating}
                    onChange={() => setRatingFilter(rating)}
                  />
                  <span className="filter-radio-label">
                    <div className="rating-stars">
                      {[...Array(5)].map((_, i) => (
                        <i 
                          key={i} 
                          className={`fas fa-star ${i < rating ? 'filled' : 'empty'}`}
                        ></i>
                      ))}
                    </div>
                    <span className="rating-text">& Up</span>
                  </span>
                </label>
              ))}
              {filters.minRating !== null && (
                <button 
                  className="clear-filter-btn"
                  onClick={() => clearFilter('minRating')}
                >
                  Clear Rating Filter
                </button>
              )}
            </div>
          )}
        </div>

        {/* AVAILABILITY FILTER */}
        <div className="filter-section">
          <div 
            className="filter-section-header" 
            onClick={() => toggleSection('availability')}
          >
            <h3 className="filter-section-title">Availability</h3>
            <i className={`fas fa-chevron-${expandedSections.availability ? 'up' : 'down'}`}></i>
          </div>
          {expandedSections.availability && (
            <div className="filter-section-content">
              <label className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={filters.inStock}
                  onChange={(e) => setSingleFilter('inStock', e.target.checked)}
                />
                <span className="filter-checkbox-label">In Stock Only</span>
              </label>
              <label className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={filters.isFeatured}
                  onChange={(e) => setSingleFilter('isFeatured', e.target.checked)}
                />
                <span className="filter-checkbox-label">Featured</span>
              </label>
              <label className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={filters.isNewArrival}
                  onChange={(e) => setSingleFilter('isNewArrival', e.target.checked)}
                />
                <span className="filter-checkbox-label">New Arrivals</span>
              </label>
              <label className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={filters.isTrending}
                  onChange={(e) => setSingleFilter('isTrending', e.target.checked)}
                />
                <span className="filter-checkbox-label">Trending</span>
              </label>
              <label className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={filters.isBestseller}
                  onChange={(e) => setSingleFilter('isBestseller', e.target.checked)}
                />
                <span className="filter-checkbox-label">Bestsellers</span>
              </label>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default FilterSidebar;
