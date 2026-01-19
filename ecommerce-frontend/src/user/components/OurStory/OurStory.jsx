import React from 'react'
import './OurStory.css';

const OurStory = () => {
  return (
    <div>
      {/* Brand Story Section */}
<section className="brand-story reveal">
  <div className="story-content">
    <h2>OUR STORY</h2>
    <p>Founded in 2020, AETHER emerged from a vision to redefine luxury fashion through innovative design and sustainable practices. Our journey began with a simple question: What if elegance could be both timeless and forward-thinking?</p>
    <p>Today, we're proud to be at the forefront of contemporary fashion, creating pieces that not only look beautiful but also feel meaningful. Each collection tells a story of craftsmanship, creativity, and conscious design.</p>
    <div className="story-stats">
      <div className="stat-item">
        <span className="stat-number">50+</span>
        <span className="stat-label">Countries</span>
      </div>
      <div className="stat-item">
        <span className="stat-number">100K+</span>
        <span className="stat-label">Happy Customers</span>
      </div>
      <div className="stat-item">
        <span className="stat-number">500+</span>
        <span className="stat-label">Unique Designs</span>
      </div>
    </div>
  </div>
  <div className="story-image">
    <img src="https://picsum.photos/seed/story/600/600" alt="Our Story" />
  </div>
</section>
    </div>
  )
}

export default OurStory
