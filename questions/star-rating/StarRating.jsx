"use client";

import { useState } from "react";
import "./StarRating.css";

const MAX_STARS = 5;

function StarRatingInput({ value = 0, onChange, readOnly = false }) {
  const [hover, setHover] = useState(0);
  const display = hover || value;

  return (
    <div
      className="star-rating"
      role={readOnly ? "img" : "radiogroup"}
      aria-label={`Rating: ${value} out of ${MAX_STARS}`}
      onMouseLeave={() => !readOnly && setHover(0)}
    >
      {Array.from({ length: MAX_STARS }, (_, index) => {
        const starValue = index + 1;
        const filled = starValue <= display;

        return (
          <button
            key={starValue}
            type="button"
            className={`star-rating__star ${
              filled ? "star-rating__star--filled" : ""
            }`}
            disabled={readOnly}
            aria-label={`${starValue} star${starValue > 1 ? "s" : ""}`}
            onMouseEnter={() => !readOnly && setHover(starValue)}
            onClick={() => onChange?.(starValue)}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}

export default function StarRating() {
  const [rating, setRating] = useState(3);

  return (
    <div className="star-rating-demo">
      <header className="star-rating-demo__header">
        <h2 className="star-rating-demo__title">Star Rating</h2>
        <p className="star-rating-demo__subtitle">
          Click to rate — hover preview before selecting.
        </p>
      </header>

      <StarRatingInput value={rating} onChange={setRating} />

      <p className="star-rating-demo__meta">
        You rated: <strong>{rating}</strong> / {MAX_STARS}
      </p>

      <div className="star-rating-demo__readonly">
        <span>Read-only preview:</span>
        <StarRatingInput value={4} readOnly />
      </div>
    </div>
  );
}
