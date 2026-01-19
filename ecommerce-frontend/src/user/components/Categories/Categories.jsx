import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import './Categories.css';
import categoryService from '../../../services/categoryService';
import productService from '../../../services/productService';

const Categories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryCounts, setCategoryCounts] = useState({});
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        
        // Fetch all active categories
        const response = await categoryService.getAllCategories();
        if (response.status && response.data) {
          const activeCategories = response.data.filter(cat => cat.isActive);
          setCategories(activeCategories);
          
          // Fetch product count for each category
          const counts = {};
          for (const category of activeCategories) {
            try {
              const productsResponse = await productService.getAllProducts({
                categoryId: category.id,
                status: 'published',
                isActive: 'true'
              });
              counts[category.id] = productsResponse?.data?.data?.pagination?.total || 0;
            } catch {
              counts[category.id] = 0;
            }
          }
          setCategoryCounts(counts);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Auto-slide carousel every 5 seconds
  useEffect(() => {
    if (categories.length === 0) return;

    const totalSlides = Math.ceil(categories.length / 4);
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);

    return () => clearInterval(interval);
  }, [categories.length]);

  const getCategoryImage = (category) => {
    const baseURL = 'http://localhost:3000';
    if (category.image) {
      return `${baseURL}${category.image}`;
    }
    return `https://picsum.photos/seed/${category.slug}/400/500`;
  };

  const handleCategoryClick = (categoryId) => {
    // Navigate to shop page with category filter
    navigate(`/shop?categories=${categoryId}`);
  };

  const nextSlide = () => {
    const totalSlides = Math.ceil(categories.length / 4);
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    const totalSlides = Math.ceil(categories.length / 4);
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const totalSlides = Math.ceil(categories.length / 4);

  return (
    <div>
      {/* Shop by Category */}
      <section className="categories reveal" id="categories">
        <div className="section-header">
          <h2 className="section-title">SHOP BY CATEGORY</h2>
          <p>Find your perfect style</p>
        </div>
        
        {loading ? (
          <div className="categories-loading">Loading categories...</div>
        ) : (
          <div className="categories-carousel-wrapper">
            <button className="carousel-btn prev-btn" onClick={prevSlide}>
              <i className="fas fa-chevron-left"></i>
            </button>
            
            <div className="categories-carousel">
              <div 
                className="categories-track"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                  <div key={slideIndex} className="categories-slide">
                    {categories.slice(slideIndex * 4, slideIndex * 4 + 4).map((category) => (
                      <div 
                        key={category.id}
                        className="category-card" 
                        onClick={() => handleCategoryClick(category.id)}
                      >
                        <img 
                          src={getCategoryImage(category)} 
                          alt={category.name} 
                          className="home-category-image" 
                        />
                        <div className="category-overlay">
                          <h3 className="category-name">{category.name}</h3>
                          <p className="category-count">
                            {categoryCounts[category.id] || 0}+ Items
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <button className="carousel-btn next-btn" onClick={nextSlide}>
              <i className="fas fa-chevron-right"></i>
            </button>

            {/* Carousel Dots */}
            <div className="carousel-dots">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  className={`dot ${currentSlide === index ? 'active' : ''}`}
                  onClick={() => goToSlide(index)}
                />
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

export default Categories
