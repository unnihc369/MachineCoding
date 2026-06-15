import { describe, expect, it } from "vitest";
import {
  createEmptyOtpArray,
  isOtpComplete,
  joinOtp,
  sanitizeDigit,
} from "./OtpInput.jsx";

describe("sanitizeDigit", () => {
  it("keeps only the last numeric character", () => {
    expect(sanitizeDigit("a")).toBe("");
    expect(sanitizeDigit("12")).toBe("2");
    expect(sanitizeDigit(" 7 ")).toBe("7");
  });
});

describe("otp helpers", () => {
  it("detects complete otp", () => {
    expect(isOtpComplete(["1", "2", "3", ""])).toBe(false);
    expect(isOtpComplete(["1", "2", "3", "4"])).toBe(true);
  });

  it("joins digits", () => {
    expect(joinOtp(["1", "2", "3"])).toBe("123");
  });
});

describe("createEmptyOtpArray", () => {
  it("creates array of given length", () => {
    expect(createEmptyOtpArray(5)).toEqual(["", "", "", "", ""]);
    expect(createEmptyOtpArray(4)).toHaveLength(4);
  });
});
