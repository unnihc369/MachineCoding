"use client";

import { useState } from "react";
import "./Accordion.css";

const ACCORDION_DATA = [
  {
    title: "JavaScript Basics",
    content:
      "Core language concepts every frontend developer should know.",
    children: [
      {
        title: "Variables & Types",
        content: "let, const, typeof, and primitive vs reference types.",
      },
      {
        title: "Functions",
        content: "Declarations, arrow functions, closures, and callbacks.",
      },
      {
        title: "Arrays & Objects",
        content: "map, filter, reduce, destructuring, and spread syntax.",
      },
    ],
  },
  {
    title: "React Hooks",
    content: "Build interactive UIs with modern React patterns.",
    children: [
      {
        title: "useState & useEffect",
        content: "Local state and side effects in functional components.",
      },
      {
        title: "Advanced Hooks",
        children: [
          {
            title: "useRef",
            content: "Persist values across renders without re-rendering.",
          },
          {
            title: "useMemo & useCallback",
            content: "Memoize expensive calculations and stable callbacks.",
          },
        ],
      },
    ],
  },
  {
    title: "Full Stack Development",
    content:
      "Connect frontend and backend, work with APIs, databases, and deploy applications.",
  },
  {
    title: "Performance Optimization",
    content:
      "Use memoization, lazy loading, and efficient rendering patterns to keep apps fast at scale.",
  },
];

function AccordionList({ items = [], allowMultiple = false, nested = false }) {
  const [openIndices, setOpenIndices] = useState(() => new Set());

  if (!items || items.length === 0) {
    return nested ? null : (
      <p className="accordion-empty">No items available</p>
    );
  }

  const isOpen = (index) => openIndices.has(index);

  const handleToggle = (index) => {
    setOpenIndices((prev) => {
      if (allowMultiple) {
        const next = new Set(prev);
        if (next.has(index)) next.delete(index);
        else next.add(index);
        return next;
      }

      if (prev.has(index)) return new Set();
      return new Set([index]);
    });
  };

  return (
    <div className={`accordion ${nested ? "accordion--nested" : ""}`}>
      {items.map((item, index) => {
        const expanded = isOpen(index);
        const hasChildren = item.children?.length > 0;

        return (
          <div key={`${item.title}-${index}`} className="accordion-item">
            <button
              type="button"
              className="accordion-title"
              aria-expanded={expanded}
              onClick={() => handleToggle(index)}
            >
              <span className="accordion-title__text">{item.title}</span>
              <span className="accordion-title__icon right" aria-hidden="true">
                {expanded ? "▲" : "▼"}
              </span>
            </button>

            {expanded && (
              <div className="accordion-content" role="region">
                {item.content && (
                  <p className="accordion-content__text">{item.content}</p>
                )}
                {hasChildren && (
                  <AccordionList
                    items={item.children}
                    allowMultiple={allowMultiple}
                    nested
                  />
                )}
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
  const [allowMultiple, setAllowMultiple] = useState(false);

  return (
    <div className="accordion-demo">
      <header className="accordion-demo__header">
        <h2 className="accordion-demo__title">Accordion</h2>
        <p className="accordion-demo__subtitle">
          Single or multiple open panels — supports nested accordion items with
          recursive rendering.
        </p>
      </header>

      <div className="accordion-demo__controls">
        <label className="accordion-demo__toggle">
          <input
            type="checkbox"
            checked={allowMultiple}
            onChange={(e) => setAllowMultiple(e.target.checked)}
          />
          Allow multiple open
        </label>

        <label className="accordion-demo__toggle">
          <input
            type="checkbox"
            checked={showEmpty}
            onChange={(e) => setShowEmpty(e.target.checked)}
          />
          Show empty state
        </label>
      </div>

      <AccordionList
        items={showEmpty ? [] : ACCORDION_DATA}
        allowMultiple={allowMultiple}
      />

      <ul className="accordion-demo__hints">
        <li>Single mode — one panel open per level; click again to collapse</li>
        <li>Multiple mode — open several panels at the same level</li>
        <li>Nested items — expand parent to reveal child accordions</li>
        <li>Empty list → &quot;No items available&quot;</li>
      </ul>
    </div>
  );
}
