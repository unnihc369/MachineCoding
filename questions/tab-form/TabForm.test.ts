import { describe, expect, it } from "vitest";
import {
  validateInterests,
  validateProfile,
  validateSettings,
  type FormData,
} from "./TabForm";

const validProfile: FormData = {
  name: "Alex",
  age: "25",
  email: "alex@example.com",
  interests: ["Coding"],
  theme: "dark",
};

describe("validateProfile", () => {
  it("passes for valid profile fields", () => {
    expect(validateProfile(validProfile)).toEqual({});
  });

  it("requires name with at least 2 characters", () => {
    expect(validateProfile({ ...validProfile, name: "A" }).name).toBeDefined();
    expect(validateProfile({ ...validProfile, name: "" }).name).toBeDefined();
  });

  it("requires age at least 18", () => {
    expect(validateProfile({ ...validProfile, age: "17" }).age).toBeDefined();
  });

  it("requires valid email format", () => {
    expect(
      validateProfile({ ...validProfile, email: "not-email" }).email
    ).toBeDefined();
  });
});

describe("validateInterests", () => {
  it("requires at least one interest", () => {
    expect(
      validateInterests({ ...validProfile, interests: [] }).interests
    ).toBeDefined();
  });

  it("passes when interests are selected", () => {
    expect(validateInterests(validProfile)).toEqual({});
  });
});

describe("validateSettings", () => {
  it("always passes", () => {
    expect(validateSettings(validProfile)).toEqual({});
  });
});
