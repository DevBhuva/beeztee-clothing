import "./Customer.css";

const REVIEWS = [
  {
    quote:
      "Beautiful fabrics and a fit that feels intentional. Beestee has become my first stop for elevated everyday wear.",
    name: "Sarah Johnson",
    role: "Verified buyer",
  },
  {
    quote:
      "Quiet luxury done right. The attention to detail is rare—and the pieces hold up beautifully.",
    name: "Michael Chen",
    role: "Verified buyer",
  },
  {
    quote:
      "Modern, refined, and easy to style. Every order feels thoughtfully curated.",
    name: "Emma Williams",
    role: "Verified buyer",
  },
];

export default function Customer() {
  return (
    <section className="bh-section bh-reviews">
      <div className="bh-section__inner">
        <div className="bh-section__head">
          <div className="bh-section__copy">
            <p className="bh-eyebrow">Community Talk</p>
            <h2 className="bh-section__title">The Community Raves</h2>
            <p className="bh-section__text">
              Unfiltered takes from the people keeping our fits in heavy rotation.
            </p>
          </div>
        </div>

        <div className="bh-reviews__grid">
          {REVIEWS.map((review) => (
            <blockquote key={review.name} className="bh-reviews__card">
              <div className="bh-reviews__stars" aria-label="5 star rating">
                {Array.from({ length: 5 }).map((_, i) => (
                  <i key={i} className="fas fa-star" />
                ))}
              </div>
              <p className="bh-reviews__quote">“{review.quote}”</p>
              <footer className="bh-reviews__author">
                <strong>{review.name}</strong>
                <span>{review.role}</span>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
