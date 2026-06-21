"use client";

import { lazy, Suspense, useState } from "react";
import "./Tabs.css";

function TabOverview() {
  return (
    <div className="tabs__content">
      Tabs let users switch between related views without leaving the page. Only
      one panel is visible at a time.
    </div>
  );
}

function TabFeatures() {
  return (
    <div className="tabs__content">
      Keyboard-friendly tab buttons, active state styling, and conditional panel
      rendering with useState.
    </div>
  );
}

function createLazyComponent(name, delay = 800) {
  return lazy(
    () =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            default: function LazyTabPanel() {
              return (
                <div className="tabs__content">
                  Content of <strong>{name}</strong> — loaded after {delay}ms
                  delay.
                </div>
              );
            },
          });
        }, delay);
      })
  );
}

const INITIAL_TABS = [
  { id: "overview", label: "Overview", component: TabOverview },
  { id: "features", label: "Features", component: TabFeatures },
  {
    id: "lazy",
    label: "Lazy Tab",
    component: createLazyComponent("Lazy Tab", 1000),
  },
];

function TabPanels({ tabs, activeId }) {
  const activeTab = tabs.find((tab) => tab.id === activeId);
  if (!activeTab) return null;

  const ActiveComponent = activeTab.component;

  return (
    <div className="tabs__panel" role="tabpanel" aria-labelledby={activeId}>
      <Suspense fallback={<div className="tabs__loading">Loading tab content…</div>}>
        <ActiveComponent />
      </Suspense>
    </div>
  );
}

function TabsBar({ tabs, activeId, onTabChange }) {
  return (
    <div className="tabs__list" role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={activeId === tab.id}
          className={`tabs__tab ${activeId === tab.id ? "tabs__tab--active" : ""}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default function Tabs() {
  const [tabs, setTabs] = useState(INITIAL_TABS);
  const [activeId, setActiveId] = useState(INITIAL_TABS[0].id);

  const addTab = () => {
    const newId = `tab-${Date.now()}`;
    const label = `Dynamic ${tabs.length - INITIAL_TABS.length + 1}`;

    setTabs((prev) => [
      ...prev,
      {
        id: newId,
        label,
        component: createLazyComponent(label, 1200),
      },
    ]);
    setActiveId(newId);
  };

  return (
    <div className="tabs-demo">
      <header className="tabs-demo__header">
        <h2 className="tabs-demo__title">Tabs</h2>
        <p className="tabs-demo__subtitle">
          Switch panels with tab buttons — includes lazy-loaded content and
          dynamic tab creation.
        </p>
      </header>

      <button type="button" className="tabs-demo__add-btn" onClick={addTab}>
        + Add dynamic tab
      </button>

      <div className="tabs">
        <TabsBar tabs={tabs} activeId={activeId} onTabChange={setActiveId} />
        <TabPanels tabs={tabs} activeId={activeId} />
      </div>

      <ul className="tabs-demo__hints">
        <li>Overview &amp; Features — static tab content</li>
        <li>Lazy Tab — simulates async load with Suspense fallback</li>
        <li>Add dynamic tab — creates a new lazy-loaded panel</li>
      </ul>
    </div>
  );
}
