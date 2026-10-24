import { useState } from "react";
import "./Journal.css";

const SUPPORT_EMAIL = "support@beeztee.com";

export default function Journal() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
      "Beeztee journal subscribe"
    )}&body=${encodeURIComponent(`Please add this email to The Journal: ${email}`)}`;

    setStatus("Thank you — we will keep you in the journal.");
    setEmail("");
  };

  return (
    <section className="bh-journal" id="journal" aria-labelledby="journal-title">
      <p className="bh-journal__eyebrow">The Journal</p>
      <h2 id="journal-title" className="bh-journal__title">
        Correspondence, quietly.
      </h2>
      <p className="bh-journal__text">
        New arrivals, private previews, and notes on craft. No noise.
      </p>

      <form className="bh-journal__form" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="journal-email">
          Your email address
        </label>
        <input
          id="journal-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          className="bh-journal__input"
        />
        <button type="submit" className="bh-journal__submit">
          Subscribe
        </button>
      </form>

      {status && <p className="bh-journal__status">{status}</p>}
    </section>
  );
}
