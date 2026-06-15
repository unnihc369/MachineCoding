import { describe, expect, it } from "vitest";
import {
  addNodeToTree,
  deleteNodeFromTree,
  collectFolderIds,
} from "./FileExplorer.jsx";

const sampleTree = [
  {
    id: 1,
    name: "public",
    isFolder: true,
    children: [{ id: 2, name: "index.html", isFolder: false }],
  },
  {
    id: 3,
    name: "src",
    isFolder: true,
    children: [{ id: 4, name: "app.js", isFolder: false }],
  },
];

describe("addNodeToTree", () => {
  it("adds a folder under the matching parent id", () => {
    const newNode = { id: 99, name: "new-folder", isFolder: true, children: [] };
    const result = addNodeToTree(sampleTree, 3, newNode);
    const src = result.find((n) => n.id === 3);

    expect(src.children).toHaveLength(2);
    expect(src.children[1]).toEqual(newNode);
  });
});

describe("deleteNodeFromTree", () => {
  it("removes a node at the root level", () => {
    const result = deleteNodeFromTree(sampleTree, 1);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(3);
  });

  it("removes a nested node", () => {
    const result = deleteNodeFromTree(sampleTree, 2);
    const publicNode = result.find((n) => n.id === 1);
    expect(publicNode.children).toHaveLength(0);
  });
});

describe("collectFolderIds", () => {
  it("collects all folder ids in the tree", () => {
    expect(collectFolderIds(sampleTree)).toEqual([1, 3]);
  });
});
