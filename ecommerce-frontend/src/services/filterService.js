import api from './api';

const filterService = {
  // Get available filter options
  getFilterOptions: async () => {
    try {
      const response = await api.get('/products/filters/options');
      return response.data;
    } catch (error) {
      console.error('Error fetching filter options:', error);
      throw error;
    }
  },

  // Build query params from filters
  buildQueryParams: (filters) => {
    const params = {};

    // Array filters
    if (filters.categories?.length) params.categories = filters.categories.join(',');
    if (filters.subCategories?.length) params.subCategories = filters.subCategories.join(',');
    if (filters.brands?.length) params.brands = filters.brands.join(',');
    if (filters.sizes?.length) params.sizes = filters.sizes.join(',');
    if (filters.colors?.length) params.colors = filters.colors.join(',');
    if (filters.materials?.length) params.materials = filters.materials.join(',');
    if (filters.patterns?.length) params.patterns = filters.patterns.join(',');
    if (filters.fits?.length) params.fits = filters.fits.join(',');
    if (filters.occasions?.length) params.occasions = filters.occasions.join(',');
    if (filters.seasons?.length) params.seasons = filters.seasons.join(',');

    // Single value filters
    if (filters.gender) params.gender = filters.gender;
    if (filters.minPrice !== null && filters.minPrice !== undefined) params.minPrice = filters.minPrice;
    if (filters.maxPrice !== null && filters.maxPrice !== undefined) params.maxPrice = filters.maxPrice;
    if (filters.minRating !== null && filters.minRating !== undefined) params.minRating = filters.minRating;
    if (filters.search) params.search = filters.search;

    // Boolean filters
    if (filters.inStock) params.inStock = 'true';
    if (filters.isFeatured) params.isFeatured = 'true';
    if (filters.isTrending) params.isTrending = 'true';
    if (filters.isNewArrival) params.isNewArrival = 'true';
    if (filters.isBestseller) params.isBestseller = 'true';

    // Always include these
    params.isActive = 'true';
    params.status = 'published';

    // Sorting
    if (filters.sortBy) params.sortBy = filters.sortBy;
    if (filters.order) params.order = filters.order;

    // Pagination
    if (filters.page) params.page = filters.page;
    if (filters.limit) params.limit = filters.limit;

    return params;
  },

  // Get filtered products
  getFilteredProducts: async (filters) => {
    try {
      const params = filterService.buildQueryParams(filters);
      const response = await api.get('/products', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching filtered products:', error);
      throw error;
    }
  },

  // Parse URL query string to filters object
  parseUrlToFilters: (searchString) => {
    const params = new URLSearchParams(searchString);
    const filters = {};

    // Parse array filters
    const arrayFilters = ['categories', 'subCategories', 'brands', 'sizes', 'colors', 
                          'materials', 'patterns', 'fits', 'occasions', 'seasons'];
    arrayFilters.forEach(key => {
      const value = params.get(key);
      filters[key] = value ? value.split(',').filter(Boolean) : [];
    });

    // Parse single value filters
    filters.gender = params.get('gender') || null;
    filters.minPrice = params.get('minPrice') ? parseFloat(params.get('minPrice')) : null;
    filters.maxPrice = params.get('maxPrice') ? parseFloat(params.get('maxPrice')) : null;
    filters.minRating = params.get('minRating') ? parseFloat(params.get('minRating')) : null;
    filters.search = params.get('search') || '';

    // Parse boolean filters
    filters.inStock = params.get('inStock') === 'true';
    filters.isFeatured = params.get('isFeatured') === 'true';
    filters.isTrending = params.get('isTrending') === 'true';
    filters.isNewArrival = params.get('isNewArrival') === 'true';
    filters.isBestseller = params.get('isBestseller') === 'true';

    // Parse sorting
    filters.sortBy = params.get('sortBy') || 'createdAt';
    filters.order = params.get('order') || 'DESC';

    // Parse pagination
    filters.page = params.get('page') ? parseInt(params.get('page')) : 1;
    filters.limit = params.get('limit') ? parseInt(params.get('limit')) : 12;

    return filters;
  },

  // Convert filters to URL query string
  filtersToUrlString: (filters) => {
    const params = filterService.buildQueryParams(filters);
    return new URLSearchParams(params).toString();
  }
};

export default filterService;
