import React from 'react';
import { useSiteSettings } from '../../../context/SiteSettingsContext';
import './Price.css';

export default function Price({ amount, className = '', showOriginal = null, discount = null }) {
  const { settings } = useSiteSettings();
  const currencySymbol = settings?.currencySymbol || '₹';

  if (!amount && amount !== 0) return <span className={className}>N/A</span>;

  const formattedPrice = `${currencySymbol}${parseFloat(amount).toFixed(2)}`;

  return (
    <span className={`price-wrapper ${className}`}>
      <span className="price-current">{formattedPrice}</span>
      {showOriginal && showOriginal !== amount && (
        <span className="price-original">{currencySymbol}{parseFloat(showOriginal).toFixed(2)}</span>
      )}
      {discount && discount > 0 && (
        <span className="price-discount">{discount}% OFF</span>
      )}
    </span>
  );
}
