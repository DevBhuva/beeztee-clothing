import React, { useState } from 'react';
import './PincodeChecker.css';

const PincodeChecker = ({ productId }) => {
  const [pincode, setPincode] = useState('');
  const [checking, setChecking] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState(null);

  const handleCheck = async () => {
    if (!pincode || pincode.length !== 6) {
      alert('Please enter a valid 6-digit pincode');
      return;
    }

    setChecking(true);
    
    // Simulate API call
    setTimeout(() => {
      setDeliveryInfo({
        available: true,
        estimatedDays: 5,
        cod: true
      });
      setChecking(false);
    }, 1000);
  };

  return (
    <div className="pincode-checker">
      <h4>
        <i className="fas fa-map-marker-alt"></i>
        Check Delivery
      </h4>
      <div className="pincode-input-group">
        <input
          type="text"
          className="pincode-input"
          placeholder="Enter Pincode"
          value={pincode}
          onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          maxLength="6"
        />
        <button
          className="pincode-check-btn"
          onClick={handleCheck}
          disabled={checking}
        >
          {checking ? 'Checking...' : 'Check'}
        </button>
      </div>

      {deliveryInfo && (
        <div className="delivery-info">
          {deliveryInfo.available ? (
            <>
              <div className="delivery-available">
                <i className="fas fa-check-circle"></i>
                <span>Delivery available in {deliveryInfo.estimatedDays} days</span>
              </div>
              {deliveryInfo.cod && (
                <div className="cod-available">
                  <i className="fas fa-money-bill-wave"></i>
                  <span>Cash on Delivery available</span>
                </div>
              )}
            </>
          ) : (
            <div className="delivery-unavailable">
              <i className="fas fa-times-circle"></i>
              <span>Delivery not available to this pincode</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PincodeChecker;
