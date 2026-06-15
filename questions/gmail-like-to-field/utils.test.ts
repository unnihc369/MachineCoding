import { describe, expect, it } from "vitest";
import {
  createUserFromEmail,
  filterUsers,
  formatTagLabel,
  getDropdownOptions,
  isValidEmail,
} from "./GmailLikeToField";
import type { User } from "@/lib/types";

const SAMPLE_USERS: User[] = [
  { name: "Tom Hardy", email: "tom@hardy.com" },
  { name: "Emma Stone", email: "emma@stone.com" },
];

describe("isValidEmail", () => {
  it("accepts valid emails", () => {
    expect(isValidEmail("user@example.com")).toBe(true);
    expect(isValidEmail("  user@example.com  ")).toBe(true);
  });

  it("rejects invalid emails", () => {
    expect(isValidEmail("not-an-email")).toBe(false);
    expect(isValidEmail("missing@domain")).toBe(false);
    expect(isValidEmail("")).toBe(false);
  });
});

describe("filterUsers", () => {
  it("returns empty when input is shorter than 3 characters", () => {
    expect(filterUsers(SAMPLE_USERS, [], "to")).toEqual([]);
  });

  it("matches name or email anywhere in the string", () => {
    expect(filterUsers(SAMPLE_USERS, [], "hard")).toHaveLength(1);
    expect(filterUsers(SAMPLE_USERS, [], "stone.com")).toHaveLength(1);
    expect(filterUsers(SAMPLE_USERS, [], "EMM")).toHaveLength(1);
  });

  it("excludes already selected users", () => {
    const selected = [SAMPLE_USERS[0]];
    expect(filterUsers(SAMPLE_USERS, selected, "tom")).toEqual([]);
  });
});

describe("getDropdownOptions", () => {
  it("returns no options before 3 characters", () => {
    expect(getDropdownOptions(SAMPLE_USERS, [], "ab")).toEqual([]);
  });

  it("returns suggestions when matches exist", () => {
    const options = getDropdownOptions(SAMPLE_USERS, [], "tom");
    expect(options).toHaveLength(1);
    expect(options[0]).toEqual({
      type: "suggestion",
      user: SAMPLE_USERS[0],
    });
  });

  it("appends custom option when email is valid and not in suggestions", () => {
    const options = getDropdownOptions(SAMPLE_USERS, [], "new@user.com");
    expect(options).toHaveLength(1);
    expect(options[0]).toEqual({
      type: "custom",
      email: "new@user.com",
    });
  });

  it("does not duplicate custom option when email already matches a suggestion", () => {
    const options = getDropdownOptions(SAMPLE_USERS, [], "tom@hardy.com");
    expect(options).toHaveLength(1);
    expect(options[0].type).toBe("suggestion");
  });

  it("omits custom option when email is already selected", () => {
    const options = getDropdownOptions(
      SAMPLE_USERS,
      [{ name: "x", email: "solo@me.com" }],
      "solo@me.com"
    );
    expect(options).toEqual([]);
  });
});

describe("formatTagLabel", () => {
  it("formats as Name(email) without spaces", () => {
    expect(
      formatTagLabel({ name: "Tom Hardy", email: "tom@hardy.com" })
    ).toBe("Tom Hardy(tom@hardy.com)");
  });
});

describe("createUserFromEmail", () => {
  it("uses email for both name and email fields", () => {
    expect(createUserFromEmail("  test@x.com  ")).toEqual({
      name: "test@x.com",
      email: "test@x.com",
    });
  });
});
