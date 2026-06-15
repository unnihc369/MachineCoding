"use client";

import { useMemo, useState } from "react";
import "./FileExplorer.css";

const INITIAL_TREE_DATA = [
  {
    id: 1,
    name: "public",
    isFolder: true,
    children: [
      {
        id: 2,
        name: "index.html",
        isFolder: false,
      },
    ],
  },
  {
    id: 3,
    name: "src",
    isFolder: true,
    children: [
      {
        id: 4,
        name: "components",
        isFolder: true,
        children: [
          {
            id: 5,
            name: "test",
            isFolder: true,
            children: [
              {
                id: 6,
                name: "file.js",
                isFolder: false,
              },
              {
                id: 7,
                name: "folder",
                isFolder: true,
                children: [],
              },
            ],
          },
        ],
      },
      {
        id: 8,
        name: "app.js",
        isFolder: false,
      },
      {
        id: 9,
        name: "data.json",
        isFolder: false,
      },
      {
        id: 10,
        name: "index.js",
        isFolder: false,
      },
      {
        id: 11,
        name: "styles.css",
        isFolder: false,
      },
    ],
  },
  {
    id: 12,
    name: "package.json",
    isFolder: false,
  },
];

export function createNodeId() {
  return Date.now() + Math.floor(Math.random() * 1000);
}

export function addNodeToTree(list, parentId, newNode) {
  return list.map((node) => {
    if (node.id === parentId) {
      return {
        ...node,
        children: [...(node.children ?? []), newNode],
      };
    }

    if (node.children?.length) {
      return {
        ...node,
        children: addNodeToTree(node.children, parentId, newNode),
      };
    }

    return node;
  });
}

export function deleteNodeFromTree(list, itemId) {
  return list
    .filter((node) => node.id !== itemId)
    .map((node) => {
      if (!node.children?.length) {
        return node;
      }

      return {
        ...node,
        children: deleteNodeFromTree(node.children, itemId),
      };
    });
}

export function renameNodeInTree(list, itemId, newName) {
  return list.map((node) => {
    if (node.id === itemId) {
      return { ...node, name: newName };
    }

    if (node.children?.length) {
      return {
        ...node,
        children: renameNodeInTree(node.children, itemId, newName),
      };
    }

    return node;
  });
}

export function collectFolderIds(list, ids = []) {
  for (const node of list) {
    if (node.isFolder) {
      ids.push(node.id);
      if (node.children?.length) {
        collectFolderIds(node.children, ids);
      }
    }
  }
  return ids;
}

export function buildExpandedMap(folderIds) {
  return folderIds.reduce((acc, id) => {
    acc[id] = true;
    return acc;
  }, {});
}

export function toggleExpandedMap(prev, nodeId) {
  return {
    ...prev,
    [nodeId]: !prev[nodeId],
  };
}

function ExplorerList({
  list,
  depth = 0,
  expandedMap,
  onToggleExpand,
  onAddFolder,
  onAddFile,
  onRenameNode,
  onDeleteNode,
}) {
  return (
    <ul className="explorer-list" style={{ paddingLeft: depth === 0 ? 0 : 20 }}>
      {list.map((node) => {
        const isExpanded = Boolean(expandedMap[node.id]);

        return (
          <li key={node.id} className="explorer-list__item">
            <div className="explorer-row">
              {node.isFolder ? (
                <button
                  type="button"
                  className="explorer-row__toggle"
                  aria-label={isExpanded ? "Collapse folder" : "Expand folder"}
                  onClick={() => onToggleExpand(node.id)}
                >
                  {isExpanded ? "−" : "+"}
                </button>
              ) : (
                <span className="explorer-row__spacer" aria-hidden="true" />
              )}

              <span className="explorer-row__icon" aria-hidden="true">
                {node.isFolder ? "📁" : "📄"}
              </span>
              <span className="explorer-row__name">{node.name}</span>

              <div className="explorer-row__actions">
                {node.isFolder && (
                  <>
                    <button
                      type="button"
                      className="explorer-row__action"
                      aria-label={`Add folder inside ${node.name}`}
                      title="Add folder"
                      onClick={() => onAddFolder(node.id)}
                    >
                      📁+
                    </button>
                    <button
                      type="button"
                      className="explorer-row__action"
                      aria-label={`Add file inside ${node.name}`}
                      title="Add file"
                      onClick={() => onAddFile(node.id)}
                    >
                      📄+
                    </button>
                  </>
                )}
                <button
                  type="button"
                  className="explorer-row__action"
                  aria-label={`Rename ${node.name}`}
                  title="Rename"
                  onClick={() => onRenameNode(node.id, node.name)}
                >
                  ✎
                </button>
                <button
                  type="button"
                  className="explorer-row__action explorer-row__action--delete"
                  aria-label={`Delete ${node.name}`}
                  title="Delete"
                  onClick={() => onDeleteNode(node.id)}
                >
                  🗑
                </button>
              </div>
            </div>

            {node.isFolder && isExpanded && (
              <ExplorerList
                list={node.children ?? []}
                depth={depth + 1}
                expandedMap={expandedMap}
                onToggleExpand={onToggleExpand}
                onAddFolder={onAddFolder}
                onAddFile={onAddFile}
                onRenameNode={onRenameNode}
                onDeleteNode={onDeleteNode}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default function FileExplorer() {
  const [treeData, setTreeData] = useState(INITIAL_TREE_DATA);
  const [expandedMap, setExpandedMap] = useState(() =>
    buildExpandedMap(collectFolderIds(INITIAL_TREE_DATA))
  );

  const folderCount = useMemo(
    () => collectFolderIds(treeData).length,
    [treeData]
  );

  const handleToggleExpand = (nodeId) => {
    setExpandedMap((prev) => toggleExpandedMap(prev, nodeId));
  };

  const handleAddFolder = (parentId) => {
    const name = window.prompt("Enter folder name");
    if (!name?.trim()) return;

    const newNode = {
      id: createNodeId(),
      name: name.trim(),
      isFolder: true,
      children: [],
    };

    setTreeData((prev) => addNodeToTree(prev, parentId, newNode));
    setExpandedMap((prev) => ({ ...prev, [parentId]: true, [newNode.id]: true }));
  };

  const handleAddFile = (parentId) => {
    const name = window.prompt("Enter file name");
    if (!name?.trim()) return;

    const newNode = {
      id: createNodeId(),
      name: name.trim(),
      isFolder: false,
    };

    setTreeData((prev) => addNodeToTree(prev, parentId, newNode));
    setExpandedMap((prev) => ({ ...prev, [parentId]: true }));
  };

  const handleRenameNode = (itemId, currentName) => {
    const name = window.prompt("Enter new name", currentName);
    if (!name?.trim() || name.trim() === currentName) return;

    setTreeData((prev) => renameNodeInTree(prev, itemId, name.trim()));
  };

  const handleDeleteNode = (itemId) => {
    const confirmed = window.confirm("Delete this item?");
    if (!confirmed) return;

    setTreeData((prev) => deleteNodeFromTree(prev, itemId));
    setExpandedMap((prev) => {
      const next = { ...prev };
      delete next[itemId];
      return next;
    });
  };

  return (
    <div className="file-explorer">
      <header className="file-explorer__header">
        <h2 className="file-explorer__title">File &amp; Folder Explorer</h2>
        <p className="file-explorer__subtitle">
          Recursive tree UI with expand/collapse, create folder/file, rename,
          and delete.
        </p>
        <p className="file-explorer__meta">
          {treeData.length} root items · {folderCount} folders
        </p>
      </header>

      <div className="file-explorer__panel">
        <ExplorerList
          list={treeData}
          expandedMap={expandedMap}
          onToggleExpand={handleToggleExpand}
          onAddFolder={handleAddFolder}
          onAddFile={handleAddFile}
          onRenameNode={handleRenameNode}
          onDeleteNode={handleDeleteNode}
        />
      </div>
    </div>
  );
}
