import React from 'react';
import { useFilters } from '../../../context/FilterContext';
import './Filters.css';

const FilterChips = () => {
  const {
    filters,
    availableFilters,
    toggleFilter,
    setSingleFilter,
    clearFilter,
    clearAllFilters,
    getActiveFilterCount
  } = useFilters();

  const activeFilterCount = getActiveFilterCount();

  if (activeFilterCount === 0) {
    return null;
  }

  const getCategoryName = (id) => {
    const category = availableFilters.categories?.find(c => c.id.toString() === id);
    return category?.name || id;
  };

  const getBrandName = (id) => {
    const brand = availableFilters.brands?.find(b => b.id.toString() === id);
    return brand?.name || id;
  };

  const formatPriceRange = () => {
    const { minPrice, maxPrice } = filters;
    if (minPrice !== null && maxPrice !== null) {
      return `₹${minPrice} - ₹${maxPrice}`;
    } else if (minPrice !== null) {
      return `Above ₹${minPrice}`;
    } else if (maxPrice !== null) {
      return `Under ₹${maxPrice}`;
    }
    return null;
  };

  return (
    <div className="filter-chips-container">
      <div className="filter-chips-header">
        <span className="filter-chips-count">
          {activeFilterCount} Filter{activeFilterCount !== 1 ? 's' : ''} Applied
        </span>
        <button 
          className="clear-all-filters-btn"
          onClick={clearAllFilters}
        >
          <i className="fas fa-times-circle"></i>
          Clear All
        </button>
      </div>

      <div className="filter-chips">
        {/* Category Chips */}
        {filters.categories?.map(categoryId => (
          <div key={`cat-${categoryId}`} className="filter-chip">
            <span className="filter-chip-label">
              <i className="fas fa-tag"></i>
              {getCategoryName(categoryId)}
            </span>
            <button 
              className="filter-chip-remove"
              onClick={() => toggleFilter('categories', categoryId)}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        ))}

        {/* Brand Chips */}
        {filters.brands?.map(brandId => (
          <div key={`brand-${brandId}`} className="filter-chip">
            <span className="filter-chip-label">
              <i className="fas fa-copyright"></i>
              {getBrandName(brandId)}
            </span>
            <button 
              className="filter-chip-remove"
              onClick={() => toggleFilter('brands', brandId)}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        ))}

        {/* Size Chips */}
        {filters.sizes?.map(size => (
          <div key={`size-${size}`} className="filter-chip">
            <span className="filter-chip-label">
              <i className="fas fa-ruler"></i>
              Size: {size}
            </span>
            <button 
              className="filter-chip-remove"
              onClick={() => toggleFilter('sizes', size)}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        ))}

        {/* Color Chips */}
        {filters.colors?.map(color => (
          <div key={`color-${color}`} className="filter-chip">
            <span className="filter-chip-label">
              <i className="fas fa-palette"></i>
              {color}
            </span>
            <button 
              className="filter-chip-remove"
              onClick={() => toggleFilter('colors', color)}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        ))}

        {/* Material Chips */}
        {filters.materials?.map(material => (
          <div key={`material-${material}`} className="filter-chip">
            <span className="filter-chip-label">
              <i className="fas fa-tshirt"></i>
              {material}
            </span>
            <button 
              className="filter-chip-remove"
              onClick={() => toggleFilter('materials', material)}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        ))}

        {/* Pattern Chips */}
        {filters.patterns?.map(pattern => (
          <div key={`pattern-${pattern}`} className="filter-chip">
            <span className="filter-chip-label">
              <i className="fas fa-border-all"></i>
              {pattern}
            </span>
            <button 
              className="filter-chip-remove"
              onClick={() => toggleFilter('patterns', pattern)}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        ))}

        {/* Fit Chips */}
        {filters.fits?.map(fit => (
          <div key={`fit-${fit}`} className="filter-chip">
            <span className="filter-chip-label">
              <i className="fas fa-user-tie"></i>
              {fit} Fit
            </span>
            <button 
              className="filter-chip-remove"
              onClick={() => toggleFilter('fits', fit)}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        ))}

        {/* Occasion Chips */}
        {filters.occasions?.map(occasion => (
          <div key={`occasion-${occasion}`} className="filter-chip">
            <span className="filter-chip-label">
              <i className="fas fa-calendar-alt"></i>
              {occasion}
            </span>
            <button 
              className="filter-chip-remove"
              onClick={() => toggleFilter('occasions', occasion)}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        ))}

        {/* Season Chips */}
        {filters.seasons?.map(season => (
          <div key={`season-${season}`} className="filter-chip">
            <span className="filter-chip-label">
              <i className="fas fa-sun"></i>
              {season}
            </span>
            <button 
              className="filter-chip-remove"
              onClick={() => toggleFilter('seasons', season)}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        ))}

        {/* Price Range Chip */}
        {(filters.minPrice !== null || filters.maxPrice !== null) && (
          <div className="filter-chip">
            <span className="filter-chip-label">
              <i className="fas fa-rupee-sign"></i>
              {formatPriceRange()}
            </span>
            <button 
              className="filter-chip-remove"
              onClick={() => {
                clearFilter('minPrice');
                clearFilter('maxPrice');
              }}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}

        {/* Rating Chip */}
        {filters.minRating !== null && (
          <div className="filter-chip">
            <span className="filter-chip-label">
              <i className="fas fa-star"></i>
              {filters.minRating}★ & Up
            </span>
            <button 
              className="filter-chip-remove"
              onClick={() => clearFilter('minRating')}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}

        {/* Gender Chip */}
        {filters.gender && (
          <div className="filter-chip">
            <span className="filter-chip-label">
              <i className="fas fa-venus-mars"></i>
              {filters.gender}
            </span>
            <button 
              className="filter-chip-remove"
              onClick={() => clearFilter('gender')}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}

        {/* In Stock Chip */}
        {filters.inStock && (
          <div className="filter-chip">
            <span className="filter-chip-label">
              <i className="fas fa-check-circle"></i>
              In Stock
            </span>
            <button 
              className="filter-chip-remove"
              onClick={() => setSingleFilter('inStock', false)}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}

        {/* Featured Chip */}
        {filters.isFeatured && (
          <div className="filter-chip">
            <span className="filter-chip-label">
              <i className="fas fa-fire"></i>
              Featured
            </span>
            <button 
              className="filter-chip-remove"
              onClick={() => setSingleFilter('isFeatured', false)}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}

        {/* New Arrival Chip */}
        {filters.isNewArrival && (
          <div className="filter-chip">
            <span className="filter-chip-label">
              <i className="fas fa-sparkles"></i>
              New Arrival
            </span>
            <button 
              className="filter-chip-remove"
              onClick={() => setSingleFilter('isNewArrival', false)}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}

        {/* Trending Chip */}
        {filters.isTrending && (
          <div className="filter-chip">
            <span className="filter-chip-label">
              <i className="fas fa-arrow-trend-up"></i>
              Trending
            </span>
            <button 
              className="filter-chip-remove"
              onClick={() => setSingleFilter('isTrending', false)}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}

        {/* Bestseller Chip */}
        {filters.isBestseller && (
          <div className="filter-chip">
            <span className="filter-chip-label">
              <i className="fas fa-trophy"></i>
              Bestseller
            </span>
            <button 
              className="filter-chip-remove"
              onClick={() => setSingleFilter('isBestseller', false)}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}

        {/* Search Chip */}
        {filters.search && (
          <div className="filter-chip">
            <span className="filter-chip-label">
              <i className="fas fa-search"></i>
              "{filters.search}"
            </span>
            <button 
              className="filter-chip-remove"
              onClick={() => clearFilter('search')}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterChips;
