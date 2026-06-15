"use client";

import { useEffect, useState } from "react";
import "./ProgressBar.css";

const DEMO_VALUES = [1, 5, 10, 20, 50, 70, 90, 100];
const ANIMATION_DELAY_MS = 100;

export function clampProgress(value) {
  const num = Number(value);
  if (Number.isNaN(num)) return 0;
  return Math.min(100, Math.max(0, num));
}

export function getTranslateX(progress) {
  return `${clampProgress(progress) - 100}%`;
}

export function getLabelColor(progress) {
  return clampProgress(progress) < 5 ? "#171717" : "#ffffff";
}

function ProgressBarItem({ progress = 0, label }) {
  const target = clampProgress(progress);
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    setAnimatedProgress(0);
    const timer = window.setTimeout(() => {
      setAnimatedProgress(target);
    }, ANIMATION_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [target]);

  const displayLabel = label ?? `${animatedProgress}%`;

  return (
    <div
      className="progress-bar-item"
      role="progressbar"
      aria-valuenow={animatedProgress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Progress ${target}%`}
    >
      <div className="progress-bar-item__track">
        <div
          className="progress-bar-item__fill"
          style={{ transform: `translateX(${getTranslateX(animatedProgress)})` }}
        >
          <span
            className="progress-bar-item__label"
            style={{ color: getLabelColor(animatedProgress) }}
          >
            {displayLabel}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function ProgressBar() {
  const [customValue, setCustomValue] = useState(70);

  return (
    <div className="progress-bar-demo">
      <header className="progress-bar-demo__header">
        <h2 className="progress-bar-demo__title">Progress Bar</h2>
        <p className="progress-bar-demo__subtitle">
          Animated 0–100% bar with translateX, accessible labels, and dynamic
          text color for low values.
        </p>
      </header>

      <section className="progress-bar-demo__control">
        <label htmlFor="progress-slider" className="progress-bar-demo__label">
          Custom progress: {customValue}%
        </label>
        <input
          id="progress-slider"
          type="range"
          min={0}
          max={100}
          value={customValue}
          onChange={(e) => setCustomValue(Number(e.target.value))}
        />
        <ProgressBarItem progress={customValue} />
      </section>

      <section className="progress-bar-demo__grid">
        <h3 className="progress-bar-demo__section-title">Test values</h3>
        {DEMO_VALUES.map((value) => (
          <ProgressBarItem key={value} progress={value} />
        ))}
      </section>
    </div>
  );
}
