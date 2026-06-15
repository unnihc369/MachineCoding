"use client";

import { useMemo } from "react";
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

function BarGraph({ data = CHART_DATA }) {
  const maxValue = useMemo(
    () => Math.max(...data.map((item) => item.value), 1),
    [data]
  );

  if (!data.length) {
    return <p className="bar-graph__empty">No data to display.</p>;
  }

  return (
    <div className="bar-graph" role="img" aria-label="Bar chart">
      <div className="bar-graph__chart">
        {data.map((item) => {
          const heightPercent = (item.value / maxValue) * 100;

          return (
            <div key={item.id} className="bar-graph__column">
              <span className="bar-graph__value">{item.value}</span>
              <div className="bar-graph__track">
                <div
                  className="bar-graph__bar"
                  style={{ height: `${heightPercent}%` }}
                  title={`Item ${item.id}: ${item.value}`}
                />
              </div>
              <span className="bar-graph__label">#{item.id}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function BarGraphDemo() {
  return (
    <div className="bar-graph-demo">
      <header className="bar-graph-demo__header">
        <h2 className="bar-graph-demo__title">Bar Graph</h2>
        <p className="bar-graph-demo__subtitle">
          CSS bar chart scaled to the highest value in the dataset.
        </p>
      </header>

      <BarGraph data={CHART_DATA} />
    </div>
  );
}
