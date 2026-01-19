import React from 'react'

const Men = () => {
  return (
    <div>
      <div>
  {/* Custom Cursor */}
  <div className="cursor" />
  <div className="cursor-follower" />
  {/* Hero Section */}
  <section className="hero-section">
    <div className="hero-bg" />
    <video className="hero-video" autoPlay muted loop>
      <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
    </video>
    <div className="hero-content">
      <p className="hero-subtitle">His Collection</p>
      <h1 className="hero-title">Define Your Style</h1>
      <p className="hero-description">Sophisticated menswear crafted for the modern gentleman who values quality, comfort, and timeless elegance.</p>
      <div className="hero-buttons">
        <a href="#collections" className="btn btn-primary">Shop Now</a>
        <a href="#lookbook" className="btn btn-outline">View Lookbook</a>
      </div>
    </div>
  </section>
  {/* Collections Section */}
  <section className="collections-section" id="collections">
    <div className="container">
      <div className="section-header">
        <h2 className="section-title">Collections</h2>
        <p className="section-subtitle">Curated pieces for every aspect of your lifestyle</p>
      </div>
      <div className="collections-grid">
        <div className="collection-card">
          <img src="https://picsum.photos/seed/suits/600/800.jpg" alt="Suits" className="collection-image" />
          <div className="collection-overlay">
            <h3 className="collection-name">Suits</h3>
            <p className="collection-count">48 Items</p>
            <a href="#" className="collection-link">
              Explore Collection <i className="fas fa-arrow-right" />
            </a>
          </div>
        </div>
        <div className="collection-card">
          <img src="https://picsum.photos/seed/casual/600/800.jpg" alt="Casual Wear" className="collection-image" />
          <div className="collection-overlay">
            <h3 className="collection-name">Casual Wear</h3>
            <p className="collection-count">126 Items</p>
            <a href="#" className="collection-link">
              Explore Collection <i className="fas fa-arrow-right" />
            </a>
          </div>
        </div>
        <div className="collection-card">
          <img src="https://picsum.photos/seed/accessories/600/800.jpg" alt="Accessories" className="collection-image" />
          <div className="collection-overlay">
            <h3 className="collection-name">Accessories</h3>
            <p className="collection-count">84 Items</p>
            <a href="#" className="collection-link">
              Explore Collection <i className="fas fa-arrow-right" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
  {/* Featured Products */}
  <section className="featured-section">
    <div className="container">
      <div className="section-header">
        <h2 className="section-title">Featured Products</h2>
        <p className="section-subtitle">Handpicked essentials for the modern gentleman</p>
      </div>
      <div className="product-grid">
        <div className="product-card">
          <div className="product-image-container">
            <span className="product-badge">New</span>
            <img src="https://picsum.photos/seed/blazer1/400/500.jpg" alt="Navy Blazer" className="product-image" />
            <div className="product-overlay">
              <div className="product-actions">
                <button className="product-action-btn">
                  <i className="far fa-heart" />
                </button>
                <button className="product-action-btn">
                  <i className="fas fa-search" />
                </button>
                <button className="product-action-btn">
                  <i className="fas fa-sync" />
                </button>
              </div>
            </div>
          </div>
          <div className="product-info">
            <p className="product-category">Blazers</p>
            <h3 className="product-name">Premium Navy Blazer</h3>
            <div className="product-price">
              <span className="price-current">$399.99</span>
              <span className="price-original">$599.99</span>
            </div>
            <div className="product-rating">
              <div className="rating-stars">
                <i className="fas fa-star" />
                <i className="fas fa-star" />
                <i className="fas fa-star" />
                <i className="fas fa-star" />
                <i className="fas fa-star-half-alt" />
              </div>
              <span className="rating-count">(42)</span>
            </div>
            <button className="add-to-cart-btn">Add to Cart</button>
          </div>
        </div>
        <div className="product-card">
          <div className="product-image-container">
            <span className="product-badge">Bestseller</span>
            <img src="https://picsum.photos/seed/shirt1/400/500.jpg" alt="White Shirt" className="product-image" />
            <div className="product-overlay">
              <div className="product-actions">
                <button className="product-action-btn">
                  <i className="far fa-heart" />
                </button>
                <button className="product-action-btn">
                  <i className="fas fa-search" />
                </button>
                <button className="product-action-btn">
                  <i className="fas fa-sync" />
                </button>
              </div>
            </div>
          </div>
          <div className="product-info">
            <p className="product-category">Shirts</p>
            <h3 className="product-name">Classic White Shirt</h3>
            <div className="product-price">
              <span className="price-current">$149.99</span>
            </div>
            <div className="product-rating">
              <div className="rating-stars">
                <i className="fas fa-star" />
                <i className="fas fa-star" />
                <i className="fas fa-star" />
                <i className="fas fa-star" />
                <i className="fas fa-star" />
              </div>
              <span className="rating-count">(68)</span>
            </div>
            <button className="add-to-cart-btn">Add to Cart</button>
          </div>
        </div>
        <div className="product-card">
          <div className="product-image-container">
            <img src="https://picsum.photos/seed/pants1/400/500.jpg" alt="Dress Pants" className="product-image" />
            <div className="product-overlay">
              <div className="product-actions">
                <button className="product-action-btn">
                  <i className="far fa-heart" />
                </button>
                <button className="product-action-btn">
                  <i className="fas fa-search" />
                </button>
                <button className="product-action-btn">
                  <i className="fas fa-sync" />
                </button>
              </div>
            </div>
          </div>
          <div className="product-info">
            <p className="product-category">Pants</p>
            <h3 className="product-name">Tailored Dress Pants</h3>
            <div className="product-price">
              <span className="price-current">$179.99</span>
              <span className="price-original">$249.99</span>
            </div>
            <div className="product-rating">
              <div className="rating-stars">
                <i className="fas fa-star" />
                <i className="fas fa-star" />
                <i className="fas fa-star" />
                <i className="fas fa-star" />
                <i className="far fa-star" />
              </div>
              <span className="rating-count">(31)</span>
            </div>
            <button className="add-to-cart-btn">Add to Cart</button>
          </div>
        </div>
        <div className="product-card">
          <div className="product-image-container">
            <span className="product-badge">Limited</span>
            <img src="https://picsum.photos/seed/watch1/400/500.jpg" alt="Luxury Watch" className="product-image" />
            <div className="product-overlay">
              <div className="product-actions">
                <button className="product-action-btn">
                  <i className="far fa-heart" />
                </button>
                <button className="product-action-btn">
                  <i className="fas fa-search" />
                </button>
                <button className="product-action-btn">
                  <i className="fas fa-sync" />
                </button>
              </div>
            </div>
          </div>
          <div className="product-info">
            <p className="product-category">Accessories</p>
            <h3 className="product-name">Luxury Swiss Watch</h3>
            <div className="product-price">
              <span className="price-current">$1,299.99</span>
            </div>
            <div className="product-rating">
              <div className="rating-stars">
                <i className="fas fa-star" />
                <i className="fas fa-star" />
                <i className="fas fa-star" />
                <i className="fas fa-star" />
                <i className="fas fa-star" />
              </div>
              <span className="rating-count">(19)</span>
            </div>
            <button className="add-to-cart-btn">Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
  </section>
  {/* Lookbook Section */}
  <section className="lookbook-section" id="lookbook">
    <div className="container">
      <div className="section-header">
        <h2 className="section-title">Lookbook</h2>
        <p className="section-subtitle">Style inspiration for every occasion</p>
      </div>
      <div className="lookbook-grid">
        <div className="lookbook-item">
          <img src="https://picsum.photos/seed/look1/400/800.jpg" alt="Business Look" className="lookbook-image" />
          <div className="lookbook-overlay">
            <h3 className="lookbook-title">Business Elite</h3>
            <p className="lookbook-description">Command the boardroom with sophisticated power dressing</p>
            <a href="#" className="lookbook-btn">
              Shop the Look <i className="fas fa-arrow-right" />
            </a>
          </div>
        </div>
        <div className="lookbook-item">
          <img src="https://picsum.photos/seed/look2/400/400.jpg" alt="Casual Friday" className="lookbook-image" />
          <div className="lookbook-overlay">
            <h3 className="lookbook-title">Casual Friday</h3>
            <p className="lookbook-description">Relaxed yet refined for the modern workplace</p>
            <a href="#" className="lookbook-btn">
              Shop the Look <i className="fas fa-arrow-right" />
            </a>
          </div>
        </div>
        <div className="lookbook-item">
          <img src="https://picsum.photos/seed/look3/400/400.jpg" alt="Weekend Style" className="lookbook-image" />
          <div className="lookbook-overlay">
            <h3 className="lookbook-title">Weekend Style</h3>
            <p className="lookbook-description">Effortless comfort meets sophisticated design</p>
            <a href="#" className="lookbook-btn">
              Shop the Look <i className="fas fa-arrow-right" />
            </a>
          </div>
        </div>
        <div className="lookbook-item">
          <img src="https://picsum.photos/seed/look4/400/400.jpg" alt="Evening Elegance" className="lookbook-image" />
          <div className="lookbook-overlay">
            <h3 className="lookbook-title">Evening Elegance</h3>
            <p className="lookbook-description">Make a statement at formal occasions</p>
            <a href="#" className="lookbook-btn">
              Shop the Look <i className="fas fa-arrow-right" />
            </a>
          </div>
        </div>
        <div className="lookbook-item">
          <img src="https://picsum.photos/seed/look5/400/400.jpg" alt="Urban Explorer" className="lookbook-image" />
          <div className="lookbook-overlay">
            <h3 className="lookbook-title">Urban Explorer</h3>
            <p className="lookbook-description">City-ready style for the modern adventurer</p>
            <a href="#" className="lookbook-btn">
              Shop the Look <i className="fas fa-arrow-right" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
  {/* Services Section */}
  <section className="services-section">
    <div className="container">
      <div className="section-header">
        <h2 className="section-title" style={{"color":"var(--white)"}}>Premium Services</h2>
        <p className="section-subtitle" style={{"color":"rgba(255, 255, 255, 0.9)"}}>Elevate your shopping experience with our exclusive services</p>
      </div>
      <div className="services-grid">
        <div className="service-card">
          <div className="service-icon">
            <i className="fas fa-cut" />
          </div>
          <h3 className="service-title">Custom Tailoring</h3>
          <p className="service-description">Perfect fit guaranteed with our expert tailoring services for all your purchases</p>
        </div>
        <div className="service-card">
          <div className="service-icon">
            <i className="fas fa-user-tie" />
          </div>
          <h3 className="service-title">Personal Styling</h3>
          <p className="service-description">One-on-one consultations with our professional stylists to curate your perfect wardrobe</p>
        </div>
        <div className="service-card">
          <div className="service-icon">
            <i className="fas fa-truck" />
          </div>
          <h3 className="service-title">White Glove Delivery</h3>
          <p className="service-description">Premium delivery service with scheduled appointments and personalized setup</p>
        </div>
      </div>
    </div>
  </section>
  {/* Newsletter Section */}
  <section className="newsletter-section">
    <div className="newsletter-container">
      <h2 className="newsletter-title">Stay Updated</h2>
      <p className="newsletter-description">Get exclusive access to new collections and special offers</p>
      <form className="newsletter-form">
        <input type="email" className="newsletter-input" placeholder="Enter your email address" />
        <button type="submit" className="newsletter-btn">Subscribe</button>
      </form>
    </div>
  </section>
</div>
    </div>
  )
}

export default Men
