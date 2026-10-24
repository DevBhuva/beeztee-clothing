import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./HeroSection.css";

const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/api$/, "") || "http://localhost:3000";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=2400&q=80";

export default function HeroSection() {
  const [heroData, setHeroData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mediaReady, setMediaReady] = useState(false);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/hero-sections/active`);
        if (response.data.success && response.data.data.length > 0) {
          setHeroData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching hero data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroData();
  }, []);

  useEffect(() => {
    if (heroData.length <= 1) return undefined;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroData.length);
      setMediaReady(false);
    }, 6500);
    return () => clearInterval(interval);
  }, [heroData.length]);

  const getMediaUrl = (url) => {
    if (!url) return null;
    if (url.startsWith("/uploads/")) return `${API_BASE}${url}`;
    return url;
  };

  const defaultHero = {
    title: "BEEZTEE",
    tagline: "We exist to replace the ordinary",
    primaryButtonText: "Cop the drop",
    primaryButtonLink: "/shop",
    secondaryButtonText: "The ethos",
    secondaryButtonLink: "/about",
    backgroundImage: FALLBACK_IMAGE,
  };

  const active = heroData.length > 0 ? heroData[currentSlide] : defaultHero;

  const videoUrl = getMediaUrl(active?.video_url || active?.videoUrl);
  const backgroundImage =
    getMediaUrl(active?.background_image || active?.backgroundImage) ||
    (!videoUrl ? FALLBACK_IMAGE : null);
  const primaryButtonLink =
    active?.primary_button_link || active?.primaryButtonLink || "/shop";
  const secondaryButtonLink =
    active?.secondary_button_link || active?.secondaryButtonLink || "/about";
  const tagline = "We exist to replace the ordinary";
  const primaryButtonText = "Cop the drop";
  const secondaryButtonText = "The ethos";
  const headline = "For the connoisseurs";

  if (loading) {
    return (
      <section id="home" className="bh-hero bh-hero--loading">
        <div className="bh-hero__loader">
          <div className="bh-hero__spinner" />
        </div>
      </section>
    );
  }

  return (
    <section id="home" className="bh-hero">
      <div className="bh-hero__media" aria-hidden="true">
        {videoUrl ? (
          <video
            key={`video-${currentSlide}`}
            className={`bh-hero__video ${mediaReady ? "is-ready" : ""}`}
            autoPlay
            loop
            muted
            playsInline
            onLoadedData={() => setMediaReady(true)}
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        ) : (
          <div
            key={`image-${currentSlide}`}
            className={`bh-hero__image ${mediaReady ? "is-ready" : ""}`}
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
        )}
        {!videoUrl && (
          <img
            src={backgroundImage}
            alt=""
            className="bh-hero__preload"
            onLoad={() => setMediaReady(true)}
          />
        )}
        <div className="bh-hero__overlay" />
      </div>

      <div className="bh-hero__content" key={`content-${currentSlide}`}>
        <h1 className="bh-hero__wordmark">Beeztee</h1>
        <p className="bh-hero__kicker">{headline}</p>
        <p className="bh-hero__tagline">{tagline}</p>
        <div className="bh-hero__actions">
          <Link to={primaryButtonLink} className="bh-hero__btn bh-hero__btn--primary">
            {primaryButtonText}
          </Link>
          <Link to={secondaryButtonLink} className="bh-hero__btn bh-hero__btn--ghost">
            {secondaryButtonText}
          </Link>
        </div>
      </div>

      <div className="bh-hero__scroll" aria-hidden="true">
        <span>Scroll</span>
        <div className="bh-hero__scroll-line" />
      </div>

      {heroData.length > 1 && (
        <div className="bh-hero__dots" role="tablist" aria-label="Hero slides">
          {heroData.map((_, index) => (
            <button
              key={index}
              type="button"
              role="tab"
              aria-selected={currentSlide === index}
              className={`bh-hero__dot ${currentSlide === index ? "is-active" : ""}`}
              onClick={() => {
                setCurrentSlide(index);
                setMediaReady(false);
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}
