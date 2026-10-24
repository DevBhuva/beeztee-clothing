import "./Marquee.css";

const DEFAULT_ITEMS = [
  "Cop the drop",
  "For the connoisseurs",
  "Heavy rotation",
  "We exist to replace the ordinary",
  "Estd. 2025",
  "Only hits, no misses",
  "The ethos",
];

export default function Marquee({ items = DEFAULT_ITEMS }) {
  const loop = [...items, ...items];

  return (
    <div className="bh-marquee" aria-hidden="true">
      <div className="bh-marquee__track">
        {loop.map((text, index) => (
          <span key={`${text}-${index}`} className="bh-marquee__item">
            {text}
            <span className="bh-marquee__sep">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
