import React, { useState } from 'react';
import './ProductTabs.css';

const ProductTabs = ({ product, selectedVariant }) => {
  const [activeTab, setActiveTab] = useState('description');

  const tabs = [
    { id: 'description', label: 'Description', icon: 'fas fa-align-left' },
    { id: 'specifications', label: 'Specifications', icon: 'fas fa-list-ul' },
    { id: 'care', label: 'Care Instructions', icon: 'fas fa-hand-sparkles' },
    { id: 'shipping', label: 'Shipping & Returns', icon: 'fas fa-shipping-fast' }
  ];

  return (
    <div className="product-tabs-section">
      <div className="tabs-header">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <i className={tab.icon}></i>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tabs-content">
        {activeTab === 'description' && (
          <div className="tab-pane">
            <h3>Product Description</h3>
            <div dangerouslySetInnerHTML={{ __html: product.description || 'No description available' }} />
          </div>
        )}

        {activeTab === 'specifications' && (
          <div className="tab-pane">
            <h3>Specifications</h3>
            <table className="specifications-table">
              <tbody>
                {product.attributes?.map((attr, index) => (
                  <tr key={index}>
                    <td className="spec-label">{attr.attributeName}</td>
                    <td className="spec-value">{attr.attributeValue}</td>
                  </tr>
                ))}
                {selectedVariant && (
                  <>
                    {selectedVariant.material && (
                      <tr>
                        <td className="spec-label">Material</td>
                        <td className="spec-value">{selectedVariant.material}</td>
                      </tr>
                    )}
                    {selectedVariant.weight && (
                      <tr>
                        <td className="spec-label">Weight</td>
                        <td className="spec-value">{selectedVariant.weight} kg</td>
                      </tr>
                    )}
                  </>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'care' && (
          <div className="tab-pane">
            <h3>Care Instructions</h3>
            <ul className="care-instructions">
              <li><i className="fas fa-hand-holding-water"></i> Hand wash in cold water</li>
              <li><i className="fas fa-tint-slash"></i> Do not bleach</li>
              <li><i className="fas fa-temperature-low"></i> Dry in shade</li>
              <li><i className="fas fa-tshirt"></i> Warm iron if needed</li>
              <li><i className="fas fa-ban"></i> Do not dry clean</li>
            </ul>
          </div>
        )}

        {activeTab === 'shipping' && (
          <div className="tab-pane">
            <h3>Shipping & Returns</h3>
            <div className="shipping-info">
              <div className="info-block">
                <h4><i className="fas fa-truck"></i> Shipping</h4>
                <ul>
                  <li>Free shipping on orders above ₹499</li>
                  <li>Delivery within 5-7 business days</li>
                  <li>Cash on Delivery available</li>
                </ul>
              </div>
              <div className="info-block">
                <h4><i className="fas fa-undo"></i> Returns & Exchanges</h4>
                <ul>
                  <li>7 days easy return policy</li>
                  <li>Product must be unused with tags</li>
                  <li>Refund processed within 7-10 days</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;
