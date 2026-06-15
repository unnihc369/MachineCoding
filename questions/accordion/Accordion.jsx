"use client";

import { useState } from "react";
import "./Accordion.css";

const ACCORDION_DATA = [
  {
    title: "JavaScript Basics",
    content:
      "Learn variables, functions, arrays, objects, and ES6+ features that form the foundation of modern JavaScript.",
  },
  {
    title: "React Hooks",
    content:
      "Understand useState, useEffect, useRef, and custom hooks to build interactive React applications.",
  },
  {
    title: "Full Stack Development",
    content:
      "Connect frontend and backend, work with APIs, databases, and deploy full-stack applications.",
  },
  {
    title: "Performance Optimization",
    content:
      "Use memoization, lazy loading, and efficient rendering patterns to keep apps fast at scale.",
  },
];

function AccordionList({ items = [] }) {
  const [openIndex, setOpenIndex] = useState(null);

  if (!items || items.length === 0) {
    return <p className="accordion-empty">No items available</p>;
  }

  const handleToggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="accordion">
      {items.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <div key={`${item.title}-${index}`} className="accordion-item">
            <button
              type="button"
              className="accordion-title"
              aria-expanded={isOpen}
              onClick={() => handleToggle(index)}
            >
              <span className="accordion-title__text">{item.title}</span>
              <span className="accordion-title__icon right" aria-hidden="true">
                {isOpen ? "▲" : "▼"}
              </span>
            </button>

            {isOpen && (
              <div className="accordion-content" role="region">
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function Accordion() {
  const [showEmpty, setShowEmpty] = useState(false);

  return (
    <div className="accordion-demo">
      <header className="accordion-demo__header">
        <h2 className="accordion-demo__title">Accordion</h2>
        <p className="accordion-demo__subtitle">
          Single-open accordion — click a title to expand; only one panel open at
          a time.
        </p>
      </header>

      <label className="accordion-demo__toggle">
        <input
          type="checkbox"
          checked={showEmpty}
          onChange={(e) => setShowEmpty(e.target.checked)}
        />
        Show empty state
      </label>

      <AccordionList items={showEmpty ? [] : ACCORDION_DATA} />

      <ul className="accordion-demo__hints">
        <li>Click title → expands content, closes others</li>
        <li>Click open title again → collapses</li>
        <li>Empty list → &quot;No items available&quot;</li>
      </ul>
    </div>
  );
}
