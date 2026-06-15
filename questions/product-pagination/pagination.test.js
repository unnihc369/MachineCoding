import { describe, expect, it } from "vitest";
import {
  canGoNext,
  canGoPrevious,
  getNumberOfPages,
  getPageSlice,
} from "./ProductPagination.jsx";

describe("pagination utils", () => {
  it("calculates number of pages with ceiling", () => {
    expect(getNumberOfPages(194)).toBe(20);
    expect(getNumberOfPages(200)).toBe(20);
    expect(getNumberOfPages(0)).toBe(0);
  });

  it("returns correct slice range for a page", () => {
    expect(getPageSlice(0, 194)).toEqual({ start: 0, end: 10 });
    expect(getPageSlice(1, 194)).toEqual({ start: 10, end: 20 });
    expect(getPageSlice(19, 194)).toEqual({ start: 190, end: 194 });
  });

  it("tracks previous and next availability", () => {
    expect(canGoPrevious(0)).toBe(false);
    expect(canGoPrevious(2)).toBe(true);
    expect(canGoNext(0, 20)).toBe(true);
    expect(canGoNext(19, 20)).toBe(false);
  });
});
