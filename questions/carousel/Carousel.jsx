"use client";

import { useCallback, useEffect, useState } from "react";
import "./Carousel.css";

const IMAGES = [
  "https://picsum.photos/id/100/800/400",
  "https://picsum.photos/id/101/800/400",
  "https://picsum.photos/id/102/800/400",
  "https://picsum.photos/id/103/800/400",
];

const AUTO_PLAY_MS = 3000;

export default function Carousel() {
  const [current, setCurrent] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % IMAGES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev - 1 + IMAGES.length) % IMAGES.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, AUTO_PLAY_MS);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <div className="carousel-demo">
      <header className="carousel-demo__header">
        <h2 className="carousel-demo__title">Image Carousel</h2>
        <p className="carousel-demo__subtitle">
          Auto-plays every 3s — use arrows or dots to navigate.
        </p>
      </header>

      <div className="carousel">
        <button
          type="button"
          className="carousel__arrow carousel__arrow--prev"
          aria-label="Previous slide"
          onClick={prevSlide}
        >
          ❮
        </button>

        <img
          className="carousel__image"
          src={IMAGES[current]}
          alt={`Slide ${current + 1} of ${IMAGES.length}`}
        />

        <button
          type="button"
          className="carousel__arrow carousel__arrow--next"
          aria-label="Next slide"
          onClick={nextSlide}
        >
          ❯
        </button>

        <div className="carousel__dots" role="tablist" aria-label="Slide dots">
          {IMAGES.map((_, idx) => (
            <button
              key={idx}
              type="button"
              role="tab"
              aria-label={`Go to slide ${idx + 1}`}
              aria-selected={current === idx}
              className={`carousel__dot ${
                current === idx ? "carousel__dot--active" : ""
              }`}
              onClick={() => setCurrent(idx)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
