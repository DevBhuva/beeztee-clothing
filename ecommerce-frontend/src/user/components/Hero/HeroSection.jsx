import { useEffect, useState } from 'react';
import axios from 'axios';
import './HeroSection.css';

export default function HeroSection() {
  const [heroData, setHeroData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    // Fetch active hero sections from API
    const fetchHeroData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/hero-sections/active');
        if (response.data.success && response.data.data.length > 0) {
          // Use all active hero sections for slider
          setHeroData(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching hero data:', error);
        // Keep default data if API fails
      } finally {
        setLoading(false);
      }
    };

    fetchHeroData();

    // Create particles on mount
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;

    const particleCount = 50;
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 15 + 's';
      particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
      particlesContainer.appendChild(particle);
    }

    return () => {
      if (particlesContainer) {
        particlesContainer.innerHTML = '';
      }
    };
  }, []);

  // Auto-slide effect
  useEffect(() => {
    if (heroData.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroData.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [heroData.length]);

  const handleDotClick = (index) => {
    setCurrentSlide(index);
  };

  // Default data if no hero sections from API
  const defaultHeroData = {
    title: 'ÉCLAT',
    tagline: 'Wear the Future. Redefine the Present.',
    primaryButtonText: 'Explore Collection',
    primaryButtonLink: '/shop',
    secondaryButtonText: 'Discover More',
    secondaryButtonLink: '/about',
  };

  const activeHeroData = heroData.length > 0 ? heroData[currentSlide] : defaultHeroData;

  // Helper function to get media URL
  const getMediaUrl = (url) => {
    if (!url) return null;
    // If it's a relative path (uploaded file), prepend the server URL
    if (url.startsWith('/uploads/')) {
      return `http://localhost:3000${url}`;
    }
    // Otherwise, it's an external URL
    return url;
  };

  // Get current slide data with proper field mapping
  const title = activeHeroData?.title || 'ÉCLAT';
  const tagline = activeHeroData?.tagline || 'Wear the Future. Redefine the Present.';
  const videoUrl = activeHeroData?.video_url || activeHeroData?.videoUrl;
  const backgroundImage = activeHeroData?.background_image || activeHeroData?.backgroundImage;
  const primaryButtonText = activeHeroData?.primary_button_text || activeHeroData?.primaryButtonText || 'Explore Collection';
  const primaryButtonLink = activeHeroData?.primary_button_link || activeHeroData?.primaryButtonLink || '/shop';
  const secondaryButtonText = activeHeroData?.secondary_button_text || activeHeroData?.secondaryButtonText || 'Discover More';
  const secondaryButtonLink = activeHeroData?.secondary_button_link || activeHeroData?.secondaryButtonLink || '/about';

  const finalVideoUrl = getMediaUrl(videoUrl);
  const finalBackgroundImage = getMediaUrl(backgroundImage);

  if (loading) {
    return (
      <section id="home" className="hero-section">
        <div className="hero-loading">
          <div className="spinner"></div>
        </div>
      </section>
    );
  }

  return (
    <section id="home" className="hero-section">
      {finalVideoUrl && (
        <video key={currentSlide} className="hero-video" autoPlay loop muted playsInline>
          <source src={finalVideoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      
      {finalBackgroundImage && !finalVideoUrl && (
        <div 
          key={currentSlide}
          className="hero-background-image" 
          style={{ backgroundImage: `url(${finalBackgroundImage})` }}
        ></div>
      )}
      
      {/* Video Overlay with Gradient */}
      <div className="video-overlay"></div>
      
      {/* Animated Particles Background */}
      <div className="particles" id="particles"></div>
      
      {/* Hero Content */}
      <div className="hero-content" key={`content-${currentSlide}`}>
        <h1 className="glitch" data-text={title}>{title}</h1>
        <p className="tagline">{tagline}</p>
        <div className="btn-container">
          <a href={primaryButtonLink} className="btn btn-primary magnetic-btn">
            {primaryButtonText}
          </a>
          <a href={secondaryButtonLink} className="btn btn-secondary">
            {secondaryButtonText}
          </a>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="scroll-indicator">
        <span className="scroll-text">Scroll</span>
        <div className="mouse"></div>
      </div>
      
      {/* Navigation Dots - Dynamic based on hero sections */}
      {heroData.length > 1 && (
        <div className="nav-dots">
          {heroData.map((_, index) => (
            <div 
              key={index}
              className={`dot ${currentSlide === index ? 'active' : ''}`}
              onClick={() => handleDotClick(index)}
            ></div>
          ))}
        </div>
      )}
    </section>
  );
}
