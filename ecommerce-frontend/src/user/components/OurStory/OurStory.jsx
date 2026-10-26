import { Link } from "react-router-dom";
import { useSiteSettings } from "../../../context/SiteSettingsContext";
import "./OurStory.css";

export default function OurStory() {
  const { settings } = useSiteSettings();
  const brand = settings?.siteName || "Beeztee";

  return (
    <section className="bh-story">
      <div className="bh-story__inner">
        <div className="bh-story__media">
          <img
            src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80"
            alt={`${brand} atelier`}
            loading="lazy"
          />
        </div>
        <div className="bh-story__content">
          <p className="bh-eyebrow">The brand</p>
          <h2 className="bh-story__title">Designed for the Feed</h2>
          <p className="bh-story__text">
            {brand} merges zero-effort styling with everyday luxury—pieces that permanently live in
            your rotation.
          </p>
          <p className="bh-story__text">
            From fabric to finish, everything is dialed in for immaculate silhouettes and low-key flexes.
          </p>
          <div className="bh-story__stats">
            <div>
              <strong>2025</strong>
              <span>Estd.</span>
            </div>
          </div>
          <Link to="/#journal" className="bh-story__cta">
            Inner Circle
          </Link>
        </div>
      </div>
    </section>
  );
}
