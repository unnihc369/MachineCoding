"use client";

import { useState } from "react";
import "./Tabs.css";

const TAB_ITEMS = [
  {
    id: "overview",
    label: "Overview",
    content:
      "Tabs let users switch between related views without leaving the page. Only one panel is visible at a time.",
  },
  {
    id: "features",
    label: "Features",
    content:
      "Keyboard-friendly tab buttons, active state styling, and conditional panel rendering with useState.",
  },
  {
    id: "settings",
    label: "Settings",
    content:
      "Extend this pattern with lazy loading, URL hash sync, or disabled tabs for multi-step flows.",
  },
];

export default function Tabs() {
  const [activeId, setActiveId] = useState(TAB_ITEMS[0].id);
  const activeTab = TAB_ITEMS.find((tab) => tab.id === activeId);

  return (
    <div className="tabs-demo">
      <header className="tabs-demo__header">
        <h2 className="tabs-demo__title">Tabs</h2>
        <p className="tabs-demo__subtitle">
          Switch panels with tab buttons — one active view at a time.
        </p>
      </header>

      <div className="tabs">
        <div className="tabs__list" role="tablist">
          {TAB_ITEMS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeId === tab.id}
              className={`tabs__tab ${
                activeId === tab.id ? "tabs__tab--active" : ""
              }`}
              onClick={() => setActiveId(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div
          className="tabs__panel"
          role="tabpanel"
          aria-labelledby={activeId}
        >
          <p>{activeTab?.content}</p>
        </div>
      </div>
    </div>
  );
}
