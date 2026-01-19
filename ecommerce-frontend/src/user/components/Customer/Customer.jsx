import React from 'react'
import './Customer.css';

const Customer = () => {
  return (
    <div>
      {/* Customer Reviews */}
<section className="reviews reveal">
  <div className="reviews-container">
    <div className="section-header">
      <h2 className="section-title">CUSTOMER LOVE</h2>
      <p>What our customers say about us</p>
    </div>
    <div className="reviews-grid">
      <div className="review-card">
        <div className="review-stars">
          <i className="fas fa-star" />
          <i className="fas fa-star" />
          <i className="fas fa-star" />
          <i className="fas fa-star" />
          <i className="fas fa-star" />
        </div>
        <p className="review-text">"Absolutely in love with the quality and design! Every piece feels like it was made just for me. AETHER has become my go-to for special occasions."</p>
        <div className="review-author">
          <img src="https://picsum.photos/seed/reviewer1/50/50" alt="Reviewer" className="author-avatar" />
          <div className="author-info">
            <h4>Sarah Johnson</h4>
            <p>Verified Buyer</p>
          </div>
        </div>
      </div>
      <div className="review-card">
        <div className="review-stars">
          <i className="fas fa-star" />
          <i className="fas fa-star" />
          <i className="fas fa-star" />
          <i className="fas fa-star" />
          <i className="fas fa-star" />
        </div>
        <p className="review-text">"The attention to detail is unmatched. I've never received so many compliments on my outfits. Worth every penny!"</p>
        <div className="review-author">
          <img src="https://picsum.photos/seed/reviewer2/50/50" alt="Reviewer" className="author-avatar" />
          <div className="author-info">
            <h4>Michael Chen</h4>
            <p>Verified Buyer</p>
          </div>
        </div>
      </div>
      <div className="review-card">
        <div className="review-stars">
          <i className="fas fa-star" />
          <i className="fas fa-star" />
          <i className="fas fa-star" />
          <i className="fas fa-star" />
          <i className="fas fa-star" />
        </div>
        <p className="review-text">"Sustainable fashion that doesn't compromise on style. AETHER is leading the way in conscious luxury."</p>
        <div className="review-author">
          <img src="https://picsum.photos/seed/reviewer3/50/50" alt="Reviewer" className="author-avatar" />
          <div className="author-info">
            <h4>Emma Williams</h4>
            <p>Verified Buyer</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
    </div>
  )
}

export default Customer
