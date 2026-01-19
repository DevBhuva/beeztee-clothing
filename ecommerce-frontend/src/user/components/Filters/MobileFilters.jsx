import React, { useEffect } from 'react';
import FilterSidebar from './FilterSidebar';
import { useFilters } from '../../../context/FilterContext';
import './Filters.css';

const MobileFilters = ({ isOpen, onClose }) => {
  const { getActiveFilterCount, clearAllFilters } = useFilters();
  const activeFilterCount = getActiveFilterCount();

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="mobile-filters-backdrop"
        onClick={onClose}
      ></div>

      {/* Bottom Sheet */}
      <div className={`mobile-filters-drawer ${isOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="mobile-filters-header">
          <div className="mobile-filters-header-left">
            <button 
              className="mobile-filters-close-btn"
              onClick={onClose}
            >
              <i className="fas fa-times"></i>
            </button>
            <h2 className="mobile-filters-title">
              Filters
              {activeFilterCount > 0 && (
                <span className="mobile-filters-count">({activeFilterCount})</span>
              )}
            </h2>
          </div>
          {activeFilterCount > 0 && (
            <button 
              className="mobile-filters-clear-btn"
              onClick={() => {
                clearAllFilters();
                onClose();
              }}
            >
              Clear All
            </button>
          )}
        </div>

        {/* Content */}
        <div className="mobile-filters-content">
          <FilterSidebar className="mobile-filter-sidebar" />
        </div>

        {/* Footer */}
        <div className="mobile-filters-footer">
          <button 
            className="mobile-filters-apply-btn"
            onClick={onClose}
          >
            <i className="fas fa-check"></i>
            Apply Filters
          </button>
        </div>
      </div>
    </>
  );
};

export default MobileFilters;
