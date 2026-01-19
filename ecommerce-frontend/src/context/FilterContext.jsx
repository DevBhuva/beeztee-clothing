import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const FilterContext = createContext();

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilters must be used within FilterProvider');
  }
  return context;
};

export const FilterProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Parse URL params on mount
  const parseUrlParams = () => {
    const params = new URLSearchParams(location.search);
    return {
      categories: params.get('categories')?.split(',').filter(Boolean) || [],
      subCategories: params.get('subCategories')?.split(',').filter(Boolean) || [],
      brands: params.get('brands')?.split(',').filter(Boolean) || [],
      sizes: params.get('sizes')?.split(',').filter(Boolean) || [],
      colors: params.get('colors')?.split(',').filter(Boolean) || [],
      materials: params.get('materials')?.split(',').filter(Boolean) || [],
      patterns: params.get('patterns')?.split(',').filter(Boolean) || [],
      fits: params.get('fits')?.split(',').filter(Boolean) || [],
      occasions: params.get('occasions')?.split(',').filter(Boolean) || [],
      seasons: params.get('seasons')?.split(',').filter(Boolean) || [],
      gender: params.get('gender') || null,
      minPrice: params.get('minPrice') ? parseFloat(params.get('minPrice')) : null,
      maxPrice: params.get('maxPrice') ? parseFloat(params.get('maxPrice')) : null,
      minRating: params.get('minRating') ? parseFloat(params.get('minRating')) : null,
      inStock: params.get('inStock') === 'true',
      isFeatured: params.get('isFeatured') === 'true',
      isTrending: params.get('isTrending') === 'true',
      isNewArrival: params.get('isNewArrival') === 'true',
      isBestseller: params.get('isBestseller') === 'true',
      sortBy: params.get('sortBy') || 'createdAt',
      order: params.get('order') || 'DESC',
      search: params.get('search') || '',
      page: params.get('page') ? parseInt(params.get('page')) : 1,
      limit: params.get('limit') ? parseInt(params.get('limit')) : 12
    };
  };

  const [filters, setFilters] = useState(parseUrlParams());
  const [availableFilters, setAvailableFilters] = useState({
    categories: [],
    subCategories: [],
    brands: [],
    sizes: [],
    colors: [],
    materials: [],
    patterns: [],
    fits: [],
    occasions: [],
    seasons: [],
    priceRange: { min: 0, max: 50000 }
  });

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    // Add array filters
    if (filters.categories.length) params.set('categories', filters.categories.join(','));
    if (filters.subCategories.length) params.set('subCategories', filters.subCategories.join(','));
    if (filters.brands.length) params.set('brands', filters.brands.join(','));
    if (filters.sizes.length) params.set('sizes', filters.sizes.join(','));
    if (filters.colors.length) params.set('colors', filters.colors.join(','));
    if (filters.materials.length) params.set('materials', filters.materials.join(','));
    if (filters.patterns.length) params.set('patterns', filters.patterns.join(','));
    if (filters.fits.length) params.set('fits', filters.fits.join(','));
    if (filters.occasions.length) params.set('occasions', filters.occasions.join(','));
    if (filters.seasons.length) params.set('seasons', filters.seasons.join(','));
    
    // Add single value filters
    if (filters.gender) params.set('gender', filters.gender);
    if (filters.minPrice !== null) params.set('minPrice', filters.minPrice);
    if (filters.maxPrice !== null) params.set('maxPrice', filters.maxPrice);
    if (filters.minRating !== null) params.set('minRating', filters.minRating);
    if (filters.inStock) params.set('inStock', 'true');
    if (filters.isFeatured) params.set('isFeatured', 'true');
    if (filters.isTrending) params.set('isTrending', 'true');
    if (filters.isNewArrival) params.set('isNewArrival', 'true');
    if (filters.isBestseller) params.set('isBestseller', 'true');
    if (filters.search) params.set('search', filters.search);
    if (filters.sortBy !== 'createdAt') params.set('sortBy', filters.sortBy);
    if (filters.order !== 'DESC') params.set('order', filters.order);
    if (filters.page > 1) params.set('page', filters.page);

    const newSearch = params.toString();
    const currentSearch = location.search.replace('?', '');
    if (currentSearch !== newSearch) {
      navigate(`${location.pathname}${newSearch ? `?${newSearch}` : ''}`, { replace: true });
    }
  }, [filters, navigate, location.pathname, location.search]);

  // Toggle multi-select filter (category, size, color, etc.)
  const toggleFilter = (filterType, value) => {
    setFilters(prev => {
      const currentValues = prev[filterType] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      
      return { ...prev, [filterType]: newValues, page: 1 };
    });
  };

  // Set single value filter (gender, minPrice, etc.)
  const setSingleFilter = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value, page: 1 }));
  };

  // Set price range
  const setPriceRange = (min, max) => {
    setFilters(prev => ({ ...prev, minPrice: min, maxPrice: max, page: 1 }));
  };

  // Set rating filter
  const setRatingFilter = (rating) => {
    setFilters(prev => ({ ...prev, minRating: rating, page: 1 }));
  };

  // Set sorting
  const setSorting = (sortBy, order = 'DESC') => {
    setFilters(prev => ({ ...prev, sortBy, order, page: 1 }));
  };

  // Set search
  const setSearch = (search) => {
    setFilters(prev => ({ ...prev, search, page: 1 }));
  };

  // Clear specific filter
  const clearFilter = (filterType) => {
    setFilters(prev => {
      if (Array.isArray(prev[filterType])) {
        return { ...prev, [filterType]: [], page: 1 };
      }
      return { ...prev, [filterType]: null, page: 1 };
    });
  };

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({
      categories: [],
      subCategories: [],
      brands: [],
      sizes: [],
      colors: [],
      materials: [],
      patterns: [],
      fits: [],
      occasions: [],
      seasons: [],
      gender: null,
      minPrice: null,
      maxPrice: null,
      minRating: null,
      inStock: false,
      isFeatured: false,
      isTrending: false,
      isNewArrival: false,
      isBestseller: false,
      sortBy: 'createdAt',
      order: 'DESC',
      search: '',
      page: 1,
      limit: 12
    });
  };

  // Get active filter count
  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.categories.length) count += filters.categories.length;
    if (filters.subCategories.length) count += filters.subCategories.length;
    if (filters.brands.length) count += filters.brands.length;
    if (filters.sizes.length) count += filters.sizes.length;
    if (filters.colors.length) count += filters.colors.length;
    if (filters.materials.length) count += filters.materials.length;
    if (filters.patterns.length) count += filters.patterns.length;
    if (filters.fits.length) count += filters.fits.length;
    if (filters.occasions.length) count += filters.occasions.length;
    if (filters.seasons.length) count += filters.seasons.length;
    if (filters.gender) count++;
    if (filters.minPrice !== null || filters.maxPrice !== null) count++;
    if (filters.minRating !== null) count++;
    if (filters.inStock) count++;
    if (filters.search) count++;
    return count;
  };

  // Set page
  const setPage = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const value = {
    filters,
    availableFilters,
    setAvailableFilters,
    toggleFilter,
    setSingleFilter,
    setPriceRange,
    setRatingFilter,
    setSorting,
    setSearch,
    clearFilter,
    clearAllFilters,
    getActiveFilterCount,
    setPage
  };

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
};

export default FilterContext;
