// Format price with currency symbol from site settings
export const formatPrice = (price, currencySymbol = '$') => {
  if (!price && price !== 0) return 'N/A';
  return `${currencySymbol}${parseFloat(price).toFixed(2)}`;
};

// Format price range
export const formatPriceRange = (minPrice, maxPrice, currencySymbol = '$') => {
  if (!minPrice && !maxPrice) return 'N/A';
  if (minPrice === maxPrice) return formatPrice(minPrice, currencySymbol);
  return `${formatPrice(minPrice, currencySymbol)} - ${formatPrice(maxPrice, currencySymbol)}`;
};

// Calculate discount percentage
export const calculateDiscount = (originalPrice, salePrice) => {
  if (!originalPrice || !salePrice || originalPrice <= salePrice) return 0;
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
};

// Format number with currency
export const formatCurrency = (amount, currency = 'USD', locale = 'en-US') => {
  if (!amount && amount !== 0) return 'N/A';
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return `$${parseFloat(amount).toFixed(2)}`;
  }
};

export default {
  formatPrice,
  formatPriceRange,
  calculateDiscount,
  formatCurrency
};
