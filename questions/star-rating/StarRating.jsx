"use client";

import { useRef, useState } from "react";
import "./StarRating.css";

function StarRatingInput({
  value = 0,
  onChange = null,
  readOnly = false,
  step = 0.5,
  max = 5,
}) {
  const [hoveredValue, setHoveredValue] = useState(null);
  const containerRef = useRef(null);

  const getStarFill = (index) => {
    const rating = hoveredValue !== null ? hoveredValue : value;
    const starValue = index + 1;
    if (rating >= starValue) return 100;
    if (rating <= index) return 0;
    return (rating - index) * 100;
  };

  const handleMouseEnter = (index) => {
    if (readOnly) return;
    setHoveredValue(index + 1);
  };

  const handleMouseLeave = () => {
    if (readOnly) return;
    setHoveredValue(null);
  };

  const handleClick = (index) => {
    if (readOnly || !onChange) return;
    onChange(index + 1);
  };

  const handleKeyDown = (e) => {
    if (readOnly || !onChange) return;

    const { key } = e;
    let newRating = value;

    if (key === "ArrowRight" || key === "ArrowUp") {
      e.preventDefault();
      newRating = Math.min(max, value + step);
    } else if (key === "ArrowLeft" || key === "ArrowDown") {
      e.preventDefault();
      newRating = Math.max(0, value - step);
    } else {
      return;
    }

    onChange(Math.round(newRating / step) * step);
  };

  return (
    <div
      className="star-rating"
      ref={containerRef}
      tabIndex={readOnly ? -1 : 0}
      role="slider"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label="Star rating"
      onKeyDown={handleKeyDown}
      onMouseLeave={handleMouseLeave}
    >
      {Array.from({ length: max }, (_, index) => {
        const fill = getStarFill(index);

        return (
          <span
            key={index}
            className={`star-rating__wrapper ${
              readOnly ? "star-rating__wrapper--readonly" : ""
            }`}
            onMouseEnter={() => handleMouseEnter(index)}
            onClick={() => handleClick(index)}
          >
            <span className="star-rating__empty" aria-hidden="true">
              ☆
            </span>
            <span
              className="star-rating__filled"
              style={{ width: `${fill}%` }}
              aria-hidden="true"
            >
              ★
            </span>
          </span>
        );
      })}

      <span className="star-rating__value" aria-hidden="true">
        {value.toFixed(1)}
      </span>
    </div>
  );
}

export default function StarRating() {
  const [rating, setRating] = useState(0);
  const [inputValue, setInputValue] = useState("0");

  const handleRatingChange = (newRating) => {
    const clamped = Math.min(5, Math.max(0, newRating));
    setRating(clamped);
    setInputValue(clamped.toString());
  };

  const handleInputChange = (e) => {
    const raw = e.target.value;
    setInputValue(raw);

    const parsed = parseFloat(raw);
    if (!Number.isNaN(parsed)) {
      const clamped = Math.min(5, Math.max(0, parsed));
      setRating(clamped);
    }
  };

  const handleInputBlur = () => {
    setInputValue(rating.toString());
  };

  return (
    <div className="star-rating-demo">
      <header className="star-rating-demo__header">
        <h2 className="star-rating-demo__title">Star Rating</h2>
        <p className="star-rating-demo__subtitle">
          Partial stars (0.5 step), hover preview, keyboard arrows, and manual
          input.
        </p>
      </header>

      <div className="star-rating-demo__controls">
        <StarRatingInput
          value={rating}
          onChange={handleRatingChange}
          step={0.5}
        />
        <input
          type="text"
          className="star-rating-demo__input"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          placeholder="0–5"
          aria-label="Enter rating"
        />
      </div>

      <p className="star-rating-demo__meta">
        Current rating: <strong>{rating.toFixed(1)}</strong> / 5
      </p>

      <div className="star-rating-demo__readonly">
        <span>Read-only (3.5):</span>
        <StarRatingInput value={3.5} readOnly step={0.5} />
      </div>

      <ul className="star-rating-demo__hints">
        <li>Click a star — sets whole-star rating</li>
        <li>Arrow keys — adjust by 0.5 steps (focus the stars first)</li>
        <li>Text input — type values like 2.5 or 4</li>
      </ul>
    </div>
  );
}
