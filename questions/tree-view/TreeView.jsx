"use client";

import { useEffect, useMemo, useState } from "react";
import "./TreeView.css";

const TREE_DATA = [
  {
    id: "eng",
    label: "Engineering",
    children: [
      {
        id: "frontend",
        label: "Frontend",
        children: [
          { id: "react", label: "React Team" },
          { id: "design-sys", label: "Design System" },
          { id: "mobile", label: "Mobile Web" },
        ],
      },
      {
        id: "backend",
        label: "Backend",
        children: [
          { id: "api", label: "API Team" },
          { id: "database", label: "Database" },
          { id: "infra", label: "Infrastructure" },
        ],
      },
    ],
  },
  {
    id: "product",
    label: "Product",
    children: [
      { id: "research", label: "User Research" },
      { id: "roadmap", label: "Roadmap Planning" },
    ],
  },
  {
    id: "support",
    label: "Support",
    children: [
      { id: "tickets", label: "Ticket Queue" },
      {
        id: "docs",
        label: "Documentation",
        children: [
          { id: "api-docs", label: "API Docs" },
          { id: "guides", label: "User Guides" },
        ],
      },
    ],
  },
];

function nodeMatchesQuery(node, query) {
  return node.label.toLowerCase().includes(query);
}

export function filterTree(nodes, query) {
  const q = query.trim().toLowerCase();
  if (!q) return nodes;

  return nodes
    .map((node) => {
      const filteredChildren = node.children ? filterTree(node.children, q) : [];
      const selfMatch = nodeMatchesQuery(node, q);

      if (selfMatch) {
        return { ...node };
      }

      if (filteredChildren.length > 0) {
        return { ...node, children: filteredChildren };
      }

      return null;
    })
    .filter(Boolean);
}

export function collectExpandableIds(nodes, ids = []) {
  for (const node of nodes) {
    if (node.children?.length) {
      ids.push(node.id);
      collectExpandableIds(node.children, ids);
    }
  }
  return ids;
}

function highlightLabel(label, query) {
  const q = query.trim().toLowerCase();
  if (!q) return label;

  const lower = label.toLowerCase();
  const index = lower.indexOf(q);
  if (index === -1) return label;

  return (
    <>
      {label.slice(0, index)}
      <mark className="tree-view__highlight">
        {label.slice(index, index + q.length)}
      </mark>
      {label.slice(index + q.length)}
    </>
  );
}

function TreeNode({
  node,
  depth = 0,
  expandedMap,
  onToggle,
  searchQuery,
}) {
  const hasChildren = node.children?.length > 0;
  const isExpanded = Boolean(expandedMap[node.id]);
  const isMatch =
    searchQuery.trim() &&
    nodeMatchesQuery(node, searchQuery.trim().toLowerCase());

  return (
    <div className="tree-view__branch">
      <div
        className={`tree-view__row ${isMatch ? "tree-view__row--match" : ""}`}
        style={{ paddingLeft: `${depth * 18 + 8}px` }}
      >
        {hasChildren ? (
          <button
            type="button"
            className="tree-view__toggle"
            aria-label={isExpanded ? "Collapse" : "Expand"}
            aria-expanded={isExpanded}
            onClick={() => onToggle(node.id)}
          >
            {isExpanded ? "▼" : "▶"}
          </button>
        ) : (
          <span className="tree-view__spacer" aria-hidden="true" />
        )}

        <span className="tree-view__icon" aria-hidden="true">
          {hasChildren ? "📁" : "📄"}
        </span>

        <span className="tree-view__label">
          {highlightLabel(node.label, searchQuery)}
        </span>
      </div>

      {hasChildren && isExpanded && (
        <div className="tree-view__children">
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              expandedMap={expandedMap}
              onToggle={onToggle}
              searchQuery={searchQuery}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function TreeView({ data = TREE_DATA }) {
  const [search, setSearch] = useState("");
  const [expandedMap, setExpandedMap] = useState(() => {
    const ids = collectExpandableIds(TREE_DATA);
    return Object.fromEntries(ids.map((id) => [id, true]));
  });

  const filteredData = useMemo(
    () => filterTree(data, search),
    [data, search]
  );

  useEffect(() => {
    if (!search.trim()) return;

    const ids = collectExpandableIds(filteredData);
    setExpandedMap((prev) => {
      const next = { ...prev };
      for (const id of ids) {
        next[id] = true;
      }
      return next;
    });
  }, [search, filteredData]);

  const handleToggle = (nodeId) => {
    setExpandedMap((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId],
    }));
  };

  const expandAll = () => {
    const ids = collectExpandableIds(data);
    setExpandedMap(Object.fromEntries(ids.map((id) => [id, true])));
  };

  const collapseAll = () => {
    setExpandedMap({});
  };

  const matchCount = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return 0;

    let count = 0;
    const walk = (nodes) => {
      for (const node of nodes) {
        if (nodeMatchesQuery(node, q)) count += 1;
        if (node.children) walk(node.children);
      }
    };
    walk(data);
    return count;
  }, [data, search]);

  return (
    <div className="tree-view">
      <div className="tree-view__toolbar">
        <input
          type="search"
          className="tree-view__search"
          placeholder="Search nodes…"
          value={search}
          aria-label="Search tree nodes"
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="button" className="tree-view__tool-btn" onClick={expandAll}>
          Expand all
        </button>
        <button type="button" className="tree-view__tool-btn" onClick={collapseAll}>
          Collapse all
        </button>
      </div>

      {search.trim() && (
        <p className="tree-view__search-meta">
          {matchCount} match{matchCount !== 1 ? "es" : ""} for &quot;{search.trim()}&quot;
        </p>
      )}

      {filteredData.length === 0 ? (
        <p className="tree-view__empty">No nodes match your search.</p>
      ) : (
        <div className="tree-view__tree" role="tree">
          {filteredData.map((node) => (
            <TreeNode
              key={node.id}
              node={node}
              expandedMap={expandedMap}
              onToggle={handleToggle}
              searchQuery={search}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function TreeViewDemo() {
  return (
    <div className="tree-view-demo">
      <header className="tree-view-demo__header">
        <h2 className="tree-view-demo__title">Tree View</h2>
        <p className="tree-view-demo__subtitle">
          Recursive tree with expand/collapse — search filters nodes and
          auto-expands matching branches.
        </p>
      </header>

      <TreeView data={TREE_DATA} />

      <ul className="tree-view-demo__hints">
        <li>▶ / ▼ toggles folder expand and collapse</li>
        <li>Search — filters tree, highlights matches, expands parents</li>
        <li>Expand all / Collapse all — bulk tree controls</li>
      </ul>
    </div>
  );
}
