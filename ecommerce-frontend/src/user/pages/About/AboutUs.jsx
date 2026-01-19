import { useEffect } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './AboutUs.css';

export default function AboutUs() {
  useEffect(() => {
    // Smooth scrolling for anchor links
    const anchors = document.querySelectorAll('a[href^="#"]');
    const handleClick = (e) => {
      e.preventDefault();
      const target = document.querySelector(e.currentTarget.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    };

    anchors.forEach(anchor => {
      anchor.addEventListener('click', handleClick);
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.value-card, .team-member, .process-item').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });

    // Parallax effect for hero image
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const heroImage = document.querySelector('.hero-image');
      if (heroImage) {
        heroImage.style.transform = `translateY(${scrolled * 0.5}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      anchors.forEach(anchor => {
        anchor.removeEventListener('click', handleClick);
      });
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <Header />
      <div className="about-us-page">
        {/* Hero Section */}
     

        {/* Story Section */}
        <section className="story-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Our Journey</h2>
              <p className="section-subtitle">From a small boutique to a beloved fashion destination</p>
            </div>
            <div className="story-content-new">
              <div className="story-text">
                <h3>Where It All Began</h3>
                <p>Her Collection was born in 2015 from a simple idea: create a clothing brand that celebrates women in all their diversity. Our founder, Sarah Mitchell, started with a small boutique in downtown, driven by her passion for fashion and her desire to empower women through clothing that makes them feel confident and beautiful.</p>
                <p>What began as a curated selection of handpicked pieces quickly grew into a beloved destination for women seeking quality, style, and substance. Today, Her Collection stands as a testament to the power of female entrepreneurship and the enduring appeal of fashion that speaks to the heart.</p>
                <p>Through every season and collection, our commitment remains the same: to design clothing that not only looks beautiful but feels meaningful to wear. We believe that what you wear should be an expression of who you are and who you aspire to be.</p>
              </div>
              <div className="story-image">
                <img src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600" alt="Her Collection Boutique" />
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="values-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Our Values</h2>
              <p className="section-subtitle">The principles that guide everything we do</p>
            </div>
            <div className="values-grid">
              <div className="value-card">
                <div className="value-icon">
                  <i className="fas fa-heart"></i>
                </div>
                <h3 className="value-title">Empowerment</h3>
                <p className="value-description">We design clothing that empowers women to feel confident, beautiful, and unapologetically themselves. Every piece is created with the intention to celebrate the strength and diversity of women.</p>
              </div>
              <div className="value-card">
                <div className="value-icon">
                  <i className="fas fa-leaf"></i>
                </div>
                <h3 className="value-title">Sustainability</h3>
                <p className="value-description">We're committed to responsible fashion practices, from ethically sourced materials to environmentally conscious production methods. Style shouldn't cost the earth.</p>
              </div>
              <div className="value-card">
                <div className="value-icon">
                  <i className="fas fa-gem"></i>
                </div>
                <h3 className="value-title">Quality</h3>
                <p className="value-description">We believe in creating pieces that last. From the fabric to the finishing touches, every detail is carefully considered to ensure longevity and timeless style.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="team-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Meet Our Team</h2>
              <p className="section-subtitle">The creative minds behind Her Collection</p>
            </div>
            <div className="team-grid">
              <div className="team-member">
                <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300" alt="Sarah Mitchell" className="member-image" />
                <h3 className="member-name">Sarah Mitchell</h3>
                <p className="member-position">Founder & Creative Director</p>
                <p className="member-bio">With over 15 years in fashion, Sarah brings her unique vision and passion for empowering women to every collection.</p>
                <div className="member-social">
                  <a href="#" className="social-link"><i className="fab fa-instagram"></i></a>
                  <a href="#" className="social-link"><i className="fab fa-linkedin-in"></i></a>
                </div>
              </div>
              <div className="team-member">
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300" alt="Emma Rodriguez" className="member-image" />
                <h3 className="member-name">Emma Rodriguez</h3>
                <p className="member-position">Head Designer</p>
                <p className="member-bio">Emma's innovative designs blend contemporary trends with timeless elegance, creating pieces that resonate with modern women.</p>
                <div className="member-social">
                  <a href="#" className="social-link"><i className="fab fa-instagram"></i></a>
                  <a href="#" className="social-link"><i className="fab fa-pinterest"></i></a>
                </div>
              </div>
              <div className="team-member">
                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300" alt="Maya Patel" className="member-image" />
                <h3 className="member-name">Maya Patel</h3>
                <p className="member-position">Sustainability Director</p>
                <p className="member-bio">Maya ensures our commitment to ethical practices and environmental responsibility is woven into every aspect of our business.</p>
                <div className="member-social">
                  <a href="#" className="social-link"><i className="fab fa-linkedin-in"></i></a>
                  <a href="#" className="social-link"><i className="fab fa-twitter"></i></a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="process-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Our Process</h2>
              <p className="section-subtitle">From concept to creation, how we bring our vision to life</p>
            </div>
            <div className="process-timeline">
              <div className="process-item">
                <div className="process-content">
                  <div className="process-number">1</div>
                  <h3 className="process-title">Inspiration</h3>
                  <p className="process-description">Every collection begins with inspiration drawn from art, culture, nature, and the stories of women who inspire us.</p>
                </div>
              </div>
              <div className="process-item">
                <div className="process-content">
                  <div className="process-number">2</div>
                  <h3 className="process-title">Design</h3>
                  <p className="process-description">Our design team transforms inspiration into sketches, patterns, and prototypes, focusing on fit, comfort, and style.</p>
                </div>
              </div>
              <div className="process-item">
                <div className="process-content">
                  <div className="process-number">3</div>
                  <h3 className="process-title">Creation</h3>
                  <p className="process-description">We work with skilled artisans and ethical manufacturers to bring our designs to life with attention to every detail.</p>
                </div>
              </div>
              <div className="process-item">
                <div className="process-content">
                  <div className="process-number">4</div>
                  <h3 className="process-title">Presentation</h3>
                  <p className="process-description">Each piece is carefully presented to our customers, complete with styling tips and the story behind its creation.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="cta-content">
            <h2 className="cta-title">Join Our Community</h2>
            <p className="cta-description">Be part of a movement that celebrates women's strength, beauty, and individuality through fashion that empowers.</p>
            <div className="cta-buttons">
              <a href="/shop" className="btn btn-primary">Shop Collection</a>
              <a href="/contact" className="btn btn-outline">Contact Us</a>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
