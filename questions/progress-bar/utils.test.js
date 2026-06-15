import { describe, expect, it } from "vitest";
import { clampProgress, getLabelColor, getTranslateX } from "./ProgressBar.jsx";

describe("clampProgress", () => {
  it("clamps values to 0–100", () => {
    expect(clampProgress(70)).toBe(70);
    expect(clampProgress(-10)).toBe(0);
    expect(clampProgress(150)).toBe(100);
    expect(clampProgress("bad")).toBe(0);
  });
});

describe("getTranslateX", () => {
  it("returns correct translate for fill amount", () => {
    expect(getTranslateX(70)).toBe("-30%");
    expect(getTranslateX(0)).toBe("-100%");
    expect(getTranslateX(100)).toBe("0%");
  });
});

describe("getLabelColor", () => {
  it("uses dark text below 5%", () => {
    expect(getLabelColor(4)).toBe("#171717");
    expect(getLabelColor(5)).toBe("#ffffff");
  });
});
