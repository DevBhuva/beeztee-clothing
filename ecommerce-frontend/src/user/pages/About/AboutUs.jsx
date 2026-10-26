import { Link } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './AboutUs.css';

export default function AboutUs() {
  return (
    <>
      <Header />
      <div className="about-us-page bh-page">
        <section className="bh-page-banner">
          <div className="bh-page-banner__inner">
            <p className="bh-page-banner__eyebrow">The ethos</p>
            <h1 className="bh-page-banner__title">The Philosophy</h1>
            <p className="bh-page-banner__text">
              Immaculate silhouettes, low-key flexes, and a wardrobe that never misses.
            </p>
          </div>
        </section>

        <section className="journey-section">
          <div className="container">
            <p className="section-eyebrow">2025</p>
            <h2>The Evolution</h2>
            <p>From a simple vision to a destination for heavy-rotation essentials.</p>
          </div>
        </section>

        <section className="story-section">
          <div className="container">
            <div className="story-content-new">
              <div className="story-text">
                <p className="section-eyebrow">Our story</p>
                <h2>Where it all began</h2>
                <p>
                  Beeztee wasn’t built on some corporate origin story. we just got tired of clothes that don’t last.
                  We make heavy-rotation essentials designed to look effortless and hold their shape.
                </p>
                <p>
                  Every drop is dialed in for clean silhouettes and zero filler. No noise, no gimmicks just solid
                  pieces that permanently live in your daily rotation.
                </p>
                <p>
                  The baseline is simple: buy less, wear it constantly, and keep the fit immaculate.
                </p>
              </div>
              <div className="story-image">
                <img
                  src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=900&q=80"
                  alt="Beeztee studio"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="values-section">
          <div className="container">
            <div className="section-header">
              <p className="section-eyebrow">What we stand for</p>
              <h2 className="section-title">How we move</h2>
              <p className="section-subtitle">The principles behind every Beeztee collection</p>
            </div>
            <div className="values-grid">
              <div className="value-card">
                <div className="value-icon"><i className="fas fa-bolt" /></div>
                <h3 className="value-title">Edge</h3>
                <p className="value-description">
                  Unapologetic design with zero excess. Pieces made to stand out while keeping it low-key.
                </p>
              </div>
              <div className="value-card">
                <div className="value-icon"><i className="fas fa-cut" /></div>
                <h3 className="value-title">Finish</h3>
                <p className="value-description">
                  Fabric, fit, and finish. We dial in every detail so your Beeztee pieces stay immaculate wear after wear.
                </p>
              </div>
              <div className="value-card">
                <div className="value-icon"><i className="fas fa-gem" /></div>
                <h3 className="value-title">Rotation</h3>
                <p className="value-description">
                  Heavy-rotation essentials only. No filler, no trend chase—just pieces that stay in the daily.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="process-section">
          <div className="container">
            <div className="section-header">
              <p className="section-eyebrow">The Blueprint</p>
              <h2 className="section-title">How We Drop</h2>
              <p className="section-subtitle">From inspiration to the pieces you love</p>
            </div>
            <div className="process-timeline">
              <div className="process-item">
                <div className="process-content">
                  <div className="process-number">1</div>
                  <h3 className="process-title">Inspiration</h3>
                  <p className="process-description">Each collection begins with art, architecture, travel, and the stories of people who inspire us.</p>
                </div>
              </div>
              <div className="process-item">
                <div className="process-content">
                  <div className="process-number">2</div>
                  <h3 className="process-title">Design</h3>
                  <p className="process-description">We translate ideas into sketches and prototypes with fit, comfort, and longevity in mind.</p>
                </div>
              </div>
              <div className="process-item">
                <div className="process-content">
                  <div className="process-number">3</div>
                  <h3 className="process-title">Creation</h3>
                  <p className="process-description">We dial in every single detail with absolute precision crafted to look clean and hold up in your daily rotation.</p>
                </div>
              </div>
              <div className="process-item">
                <div className="process-content">
                  <div className="process-number">4</div>
                  <h3 className="process-title">Presentation</h3>
                  <p className="process-description">Every piece arrives with care ready to become part of your everyday ritual.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="cta-content">
            <h2 className="cta-title">Be the Family</h2>
            <p className="cta-description">
              Get early access to fresh drops, styling breakdowns, and heavy-rotation essentials before anyone else.
            </p>
            <div className="cta-buttons">
              <Link to="/#journal" className="btn btn-primary">Inner Circle</Link>
              <Link to="/contact" className="btn btn-outline">Hit us up</Link>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
