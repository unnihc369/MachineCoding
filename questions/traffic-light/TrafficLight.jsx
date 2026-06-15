"use client";

import { useEffect, useState } from "react";
import "./TrafficLight.css";

const SEQUENCE = [
  { color: "red", duration: 3000, label: "Stop" },
  { color: "yellow", duration: 1000, label: "Get ready" },
  { color: "green", duration: 3000, label: "Go" },
];

export default function TrafficLight() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const current = SEQUENCE[index];

  useEffect(() => {
    if (paused) return;

    const timer = setTimeout(() => {
      setIndex((prev) => (prev + 1) % SEQUENCE.length);
    }, current.duration);

    return () => clearTimeout(timer);
  }, [index, paused, current.duration]);

  return (
    <div className="traffic-light-demo">
      <header className="traffic-light-demo__header">
        <h2 className="traffic-light-demo__title">Traffic Light</h2>
        <p className="traffic-light-demo__subtitle">
          Cycles red → yellow → green automatically with useEffect timers.
        </p>
      </header>

      <div className="traffic-light">
        {SEQUENCE.map((light) => (
          <div
            key={light.color}
            className={`traffic-light__bulb traffic-light__bulb--${light.color} ${
              current.color === light.color
                ? "traffic-light__bulb--active"
                : ""
            }`}
            aria-hidden="true"
          />
        ))}
      </div>

      <p className="traffic-light-demo__status" role="status">
        {current.label}
      </p>

      <button
        type="button"
        className="traffic-light-demo__btn"
        onClick={() => setPaused((prev) => !prev)}
      >
        {paused ? "Resume" : "Pause"}
      </button>
    </div>
  );
}
