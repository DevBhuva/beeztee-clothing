import React from 'react'
import './SesoneSale.css';

const SesoneSale = () => {
  return (
    <div>
      {/* Sale Section */}
<section className="sale reveal" id="sale">
  <div className="sale-banner">
    <h2 className="sale-title">SEASON SALE</h2>
    <p className="sale-subtitle">Up to 50% off selected items</p>
    <div className="countdown" id="countdown">
      <div className="countdown-item">
        <span className="countdown-number" id="days">05</span>
        <span className="countdown-label">Days</span>
      </div>
      <div className="countdown-item">
        <span className="countdown-number" id="hours">12</span>
        <span className="countdown-label">Hours</span>
      </div>
      <div className="countdown-item">
        <span className="countdown-number" id="minutes">34</span>
        <span className="countdown-label">Minutes</span>
      </div>
      <div className="countdown-item">
        <span className="countdown-number" id="seconds">56</span>
        <span className="countdown-label">Seconds</span>
      </div>
    </div>
  </div>
  <div className="sale-products" id="saleProducts">
    {/* Sale products will be dynamically loaded */}
  </div>
</section>
    </div>
  )
}

export default SesoneSale
