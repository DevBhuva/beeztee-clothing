import { useRef } from "react";
import "./InstagramFeed.css";

export const BEEZTEE_INSTAGRAM = "https://www.instagram.com/beeztee_/";

const POSTS = [
  {
    src: "https://images.unsplash.com/photo-1492446845049-9c50cc313f00?auto=format&fit=crop&w=720&h=960&q=80",
    views: "30.5K",
  },
  {
    src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=720&h=960&q=80",
    views: "8,564",
  },
  {
    src: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=720&h=960&q=80",
    views: "38.3K",
  },
  {
    src: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=720&h=960&q=80",
    views: "26K",
  },
  {
    src: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=720&h=960&q=80",
    views: "58.9K",
  },
  {
    src: "https://images.unsplash.com/photo-1523381216130-8b3f99a87a6d?auto=format&fit=crop&w=720&h=960&q=80",
    views: "12.4K",
  },
  {
    src: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=720&h=960&q=80",
    views: "21.7K",
  },
  {
    src: "https://images.unsplash.com/photo-1467043237213-65a2c69bb749?auto=format&fit=crop&w=720&h=960&q=80",
    views: "19.1K",
  },
];

function instagramHandle(url) {
  const match = String(url || "").match(/instagram\.com\/([^/?#]+)/i);
  return match ? `@${match[1]}` : "@beeztee_";
}

export default function InstagramFeed() {
  const instagramUrl = BEEZTEE_INSTAGRAM;
  const handle = instagramHandle(instagramUrl);
  const scrollerRef = useRef(null);

  const scrollByCard = (direction) => {
    const node = scrollerRef.current;
    if (!node) return;
    const card = node.querySelector(".bh-ig__card");
    const amount = (card?.offsetWidth || 260) + 14;
    node.scrollBy({ left: direction * amount, behavior: "smooth" });
  };

  return (
    <section className="bh-ig" aria-labelledby="ig-title">
      <a className="bh-ig__heading" href={instagramUrl} target="_blank" rel="noopener noreferrer">
        <h2 id="ig-title" className="bh-ig__title">
          Our Instagram
        </h2>
        <span className="bh-ig__handle">{handle}</span>
      </a>

      <div className="bh-ig__row">
        <button
          type="button"
          className="bh-ig__arrow bh-ig__arrow--prev"
          onClick={() => scrollByCard(-1)}
          aria-label="Previous Instagram photos"
        >
          <i className="fas fa-chevron-left" />
        </button>

        <div className="bh-ig__scroller" ref={scrollerRef}>
          {POSTS.map((post, index) => (
            <a
              key={`${post.src}-${index}`}
              className="bh-ig__card"
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={post.src} alt="" loading="lazy" />
              <span className="bh-ig__meta">
                <i className="fas fa-play" aria-hidden="true" />
                {post.views}
              </span>
            </a>
          ))}
        </div>

        <button
          type="button"
          className="bh-ig__arrow bh-ig__arrow--next"
          onClick={() => scrollByCard(1)}
          aria-label="Next Instagram photos"
        >
          <i className="fas fa-chevron-right" />
        </button>
      </div>
    </section>
  );
}
