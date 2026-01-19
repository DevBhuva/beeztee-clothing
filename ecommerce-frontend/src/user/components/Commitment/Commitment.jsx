import React from 'react'
import './Commitment.css';

const Commitment = () => {
  return (
    <div>
      {/* Sustainability Section */}
<section className="sustainability reveal">
  <div className="section-header">
    <h2 className="section-title">OUR COMMITMENT</h2>
    <p>Fashion with a conscience</p>
  </div>
  <div className="sustainability-content">
    <div className="sustainability-card">
      <div className="sustainability-icon">
        <i className="fas fa-leaf" />
      </div>
      <h3>Sustainable Materials</h3>
      <p>We use eco-friendly fabrics and sustainable production methods to minimize our environmental impact.</p>
    </div>
    <div className="sustainability-card">
      <div className="sustainability-icon">
        <i className="fas fa-recycle" />
      </div>
      <h3>Circular Fashion</h3>
      <p>Our recycling program allows customers to return old garments for store credit, promoting a circular economy.</p>
    </div>
    <div className="sustainability-card">
      <div className="sustainability-icon">
        <i className="fas fa-hand-holding-heart" />
      </div>
      <h3>Ethical Production</h3>
      <p>We ensure fair wages and safe working conditions for all workers in our supply chain.</p>
    </div>
  </div>
</section>
    </div>
  )
}

export default Commitment
