"use client";

import { useMemo, useState } from "react";
import "./BarGraph.css";

const CHART_DATA = [
  { id: 1, value: 20 },
  { id: 2, value: 45 },
  { id: 3, value: 30 },
  { id: 4, value: 60 },
  { id: 5, value: 35 },
  { id: 6, value: 80 },
  { id: 7, value: 55 },
];

function BarGraph({ data = CHART_DATA, sortOrder = "none" }) {
  const [tooltip, setTooltip] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);

  const sortedData = useMemo(() => {
    const copy = [...data];
    if (sortOrder === "asc") {
      return copy.sort((a, b) => a.value - b.value);
    }
    if (sortOrder === "desc") {
      return copy.sort((a, b) => b.value - a.value);
    }
    return copy;
  }, [data, sortOrder]);

  const maxValue = useMemo(
    () => Math.max(...sortedData.map((item) => item.value), 1),
    [sortedData]
  );

  const handleTrackMouseMove = (event, item) => {
    const track = event.currentTarget;
    const rect = track.getBoundingClientRect();
    const percentFromBottom = Math.min(
      100,
      Math.max(0, ((rect.bottom - event.clientY) / rect.height) * 100)
    );

    setHoveredId(item.id);
    setTooltip({
      item,
      percentFromBottom: percentFromBottom.toFixed(1),
      x: event.clientX,
      y: event.clientY,
    });
  };

  const clearTooltip = () => {
    setTooltip(null);
    setHoveredId(null);
  };

  if (!sortedData.length) {
    return <p className="bar-graph__empty">No data to display.</p>;
  }

  return (
    <div
      className="bar-graph"
      role="img"
      aria-label="Bar chart"
      onMouseLeave={clearTooltip}
    >
      <div className="bar-graph__chart">
        {sortedData.map((item, index) => {
          const heightPercent = (item.value / maxValue) * 100;
          const isHovered = hoveredId === item.id;

          return (
            <div
              key={item.id}
              className={`bar-graph__column ${
                isHovered ? "bar-graph__column--hovered" : ""
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <span className="bar-graph__value">{item.value}</span>
              <div
                className="bar-graph__track"
                onMouseMove={(e) => handleTrackMouseMove(e, item)}
                onMouseEnter={(e) => handleTrackMouseMove(e, item)}
              >
                <div
                  className="bar-graph__bar"
                  style={{ height: `${heightPercent}%` }}
                />
              </div>
              <span className="bar-graph__label">#{item.id}</span>
            </div>
          );
        })}
      </div>

      {tooltip && (
        <div
          className="bar-graph__tooltip"
          style={{
            left: tooltip.x + 14,
            top: tooltip.y - 12,
          }}
          role="tooltip"
        >
          <p className="bar-graph__tooltip-title">Item #{tooltip.item.id}</p>
          <p className="bar-graph__tooltip-row">
            <span>Value</span>
            <strong>{tooltip.item.value}</strong>
          </p>
          <p className="bar-graph__tooltip-row">
            <span>% of max</span>
            <strong>
              {((tooltip.item.value / maxValue) * 100).toFixed(1)}%
            </strong>
          </p>
          <p className="bar-graph__tooltip-row">
            <span>Cursor from bottom</span>
            <strong>{tooltip.percentFromBottom}%</strong>
          </p>
        </div>
      )}
    </div>
  );
}

export default function BarGraphDemo() {
  const [sortOrder, setSortOrder] = useState("none");

  return (
    <div className="bar-graph-demo">
      <header className="bar-graph-demo__header">
        <h2 className="bar-graph-demo__title">Bar Graph</h2>
        <p className="bar-graph-demo__subtitle">
          Hover bars for tooltip with cursor position — sort ascending or
          descending with animated transitions.
        </p>
      </header>

      <div className="bar-graph-demo__controls">
        <span className="bar-graph-demo__control-label">Sort by value</span>
        <div className="bar-graph-demo__sort-btns">
          {[
            { key: "none", label: "Original" },
            { key: "asc", label: "Asc ↑" },
            { key: "desc", label: "Desc ↓" },
          ].map(({ key, label }) => (
            <button
              key={key}
              type="button"
              className={`bar-graph-demo__sort-btn ${
                sortOrder === key ? "bar-graph-demo__sort-btn--active" : ""
              }`}
              onClick={() => setSortOrder(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <BarGraph data={CHART_DATA} sortOrder={sortOrder} />

      <ul className="bar-graph-demo__hints">
        <li>Hover a bar track — tooltip shows value and cursor % from bottom</li>
        <li>Sort Asc/Desc — bars reorder with height animation</li>
      </ul>
    </div>
  );
}
