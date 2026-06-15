"use client";

import { useMemo, useState } from "react";
import "./NestedCheckbox.css";

const TREE_DATA = [
  {
    id: 1,
    name: "Fruits",
    children: [
      {
        id: 2,
        name: "Citrus",
        children: [
          { id: 3, name: "Orange" },
          { id: 4, name: "Lemon" },
        ],
      },
      {
        id: 5,
        name: "Berries",
        children: [
          { id: 6, name: "Strawberry" },
          { id: 7, name: "Blueberry" },
        ],
      },
    ],
  },
  {
    id: 8,
    name: "Tropical",
    children: [
      { id: 9, name: "Mango" },
      { id: 10, name: "Banana" },
    ],
  },
  {
    id: 11,
    name: "Apple",
  },
];

function updateChildren(node, isChecked, state) {
  if (!node.children?.length) return;

  for (const child of node.children) {
    state[child.id] = isChecked;
    updateChildren(child, isChecked, state);
  }
}

function verifyChecked(node, state) {
  if (!node.children?.length) {
    return Boolean(state[node.id]);
  }

  const allChildrenChecked = node.children.every((child) =>
    verifyChecked(child, state)
  );

  state[node.id] = allChildrenChecked;
  return allChildrenChecked;
}

function CheckboxTree({ data, checked, setChecked }) {
  const handleChange = (node, isChecked) => {
    setChecked((prev) => {
      const next = { ...prev, [node.id]: isChecked };

      if (node.children?.length) {
        updateChildren(node, isChecked, next);
      }

      for (const root of data) {
        verifyChecked(root, next);
      }

      return next;
    });
  };

  const renderNodes = (nodes, depth = 0) =>
    nodes.map((node) => (
      <div key={node.id} className="checkbox-tree__branch">
        <label
          className="checkbox-tree__row"
          style={{ paddingLeft: `${depth * 20}px` }}
        >
          <input
            type="checkbox"
            checked={Boolean(checked[node.id])}
            onChange={(e) => handleChange(node, e.target.checked)}
          />
          <span className="checkbox-tree__label">{node.name}</span>
        </label>

        {node.children?.length > 0 && (
          <div className="checkbox-tree__children">
            {renderNodes(node.children, depth + 1)}
          </div>
        )}
      </div>
    ));

  return (
    <div className="checkbox-tree" role="tree" aria-label="Nested checkboxes">
      {renderNodes(data)}
    </div>
  );
}

function countChecked(checked) {
  return Object.values(checked).filter(Boolean).length;
}

export default function NestedCheckbox() {
  const [checked, setChecked] = useState({});

  const selectedCount = useMemo(() => countChecked(checked), [checked]);

  const selectedNames = useMemo(() => {
    const names = [];

    const walk = (nodes) => {
      for (const node of nodes) {
        if (checked[node.id]) names.push(node.name);
        if (node.children) walk(node.children);
      }
    };

    walk(TREE_DATA);
    return names;
  }, [checked]);

  return (
    <div className="nested-checkbox">
      <header className="nested-checkbox__header">
        <h2 className="nested-checkbox__title">Nested Checkbox Tree</h2>
        <p className="nested-checkbox__subtitle">
          Parent selects all descendants; selecting all siblings checks the
          parent (bottom-up verification).
        </p>
      </header>

      <div className="nested-checkbox__panel">
        <CheckboxTree
          data={TREE_DATA}
          checked={checked}
          setChecked={setChecked}
        />
      </div>

      <p className="nested-checkbox__meta">
        Selected: {selectedCount} node{selectedCount !== 1 ? "s" : ""}
        {selectedNames.length > 0 && (
          <>
            {" "}
            — <code>{selectedNames.join(", ")}</code>
          </>
        )}
      </p>

      <ul className="nested-checkbox__hints">
        <li>Check Fruits → all nested items select</li>
        <li>Check Orange + Lemon → Citrus auto-selects</li>
        <li>Uncheck parent → all children uncheck</li>
      </ul>
    </div>
  );
}
