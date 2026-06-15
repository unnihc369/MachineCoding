"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import type { User } from "@/lib/types";
import "./GmailLikeToField.css";

export type DropdownOption =
  | { type: "suggestion"; user: User }
  | { type: "custom"; email: string };

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

export function filterUsers(
  allUsers: User[],
  selected: User[],
  input: string
): User[] {
  const search = input.trim().toLowerCase();
  if (search.length < 3) return [];

  return allUsers.filter((item) => {
    const alreadyAdded = selected.some((s) => s.email === item.email);
    if (alreadyAdded) return false;

    return (
      item.name.toLowerCase().includes(search) ||
      item.email.toLowerCase().includes(search)
    );
  });
}

export function getDropdownOptions(
  allUsers: User[],
  selected: User[],
  input: string
): DropdownOption[] {
  const trimmed = input.trim();
  if (trimmed.length < 3) return [];

  const suggestions = filterUsers(allUsers, selected, input).map(
    (user): DropdownOption => ({ type: "suggestion", user })
  );

  if (!isValidEmail(trimmed)) {
    return suggestions;
  }

  const alreadySelected = selected.some(
    (s) => s.email.toLowerCase() === trimmed.toLowerCase()
  );
  if (alreadySelected) {
    return suggestions;
  }

  const alreadyInSuggestions = suggestions.some(
    (opt) =>
      opt.type === "suggestion" &&
      opt.user.email.toLowerCase() === trimmed.toLowerCase()
  );
  if (alreadyInSuggestions) {
    return suggestions;
  }

  return [...suggestions, { type: "custom", email: trimmed }];
}

export function formatTagLabel(user: User): string {
  return `${user.name}(${user.email})`;
}

export function createUserFromEmail(email: string): User {
  const trimmed = email.trim();
  return { name: trimmed, email: trimmed };
}

const INITIAL_DATA: User[] = [
  { name: "Tom Hardy", email: "tom@hardy.com" },
  { name: "Emma Stone", email: "emma@stone.com" },
  { name: "Chris Evans", email: "chris@evans.com" },
  { name: "Scarlett Johansson", email: "scarlett@johansson.com" },
  { name: "Robert Downey", email: "robert@downey.com" },
  { name: "Jennifer Lawrence", email: "jennifer@lawrence.com" },
  { name: "Ryan Reynolds", email: "ryan@reynolds.com" },
  { name: "Natalie Portman", email: "natalie@portman.com" },
  { name: "Leonardo Dicaprio", email: "leo@dicaprio.com" },
  { name: "Anne Hathaway", email: "anne@hathaway.com" },
];

export default function GmailLikeToField() {
  const [allUsers, setAllUsers] = useState<User[]>(INITIAL_DATA);
  const [selected, setSelected] = useState<User[]>([]);
  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [activeTagIndex, setActiveTagIndex] = useState(-1);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const dropdownOptions = useMemo(
    () => getDropdownOptions(allUsers, selected, input),
    [allUsers, selected, input]
  );

  const showDropdown = dropdownOptions.length > 0;
  const showToLabel =
    !isFocused && selected.length === 0 && input.length === 0;

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const addTag = useCallback(
    (item: User) => {
      const exists = selected.some((s) => s.email === item.email);
      if (exists) return;

      setSelected((prev) => [...prev, item]);
      setInput("");
      setActiveIndex(-1);
      setActiveTagIndex(-1);

      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    },
    [selected]
  );

  const addCustomEmail = useCallback(() => {
    const trimmed = input.trim();
    if (!isValidEmail(trimmed)) return;

    const existing = allUsers.find(
      (u) => u.email.toLowerCase() === trimmed.toLowerCase()
    );
    const user = existing ?? createUserFromEmail(trimmed);

    if (!existing) {
      setAllUsers((prev) => [...prev, user]);
    }

    addTag(user);
  }, [input, allUsers, addTag]);

  const selectDropdownOption = useCallback(
    (option: DropdownOption) => {
      if (option.type === "suggestion") {
        addTag(option.user);
      } else {
        const trimmed = option.email;
        if (!isValidEmail(trimmed)) return;

        const existing = allUsers.find(
          (u) => u.email.toLowerCase() === trimmed.toLowerCase()
        );
        const user = existing ?? createUserFromEmail(trimmed);

        if (!existing) {
          setAllUsers((prev) => [...prev, user]);
        }
        addTag(user);
      }
    },
    [addTag, allUsers]
  );

  const removeTag = useCallback(
    (email: string) => {
      setSelected((prev) => prev.filter((item) => item.email !== email));
      setActiveTagIndex(-1);
      focusInput();
    },
    [focusInput]
  );

  const removeLastTag = useCallback(() => {
    if (selected.length === 0) return;
    const last = selected[selected.length - 1];
    removeTag(last.email);
  }, [selected, removeTag]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsFocused(false);
        setActiveTagIndex(-1);
        setActiveIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (activeIndex < 0) return;
    itemRefs.current[activeIndex]?.scrollIntoView({
      block: "nearest",
    });
  }, [activeIndex, dropdownOptions]);

  const navigateDropdown = (direction: 1 | -1) => {
    if (!dropdownOptions.length) return;
    setActiveIndex((prev) => {
      if (prev < 0) return direction === 1 ? 0 : dropdownOptions.length - 1;
      const next = prev + direction;
      if (next < 0) return dropdownOptions.length - 1;
      if (next >= dropdownOptions.length) return 0;
      return next;
    });
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      if (!dropdownOptions.length) return;
      e.preventDefault();
      setActiveTagIndex(-1);
      navigateDropdown(1);
      return;
    }

    if (e.key === "ArrowUp") {
      if (!dropdownOptions.length) return;
      e.preventDefault();
      setActiveTagIndex(-1);
      navigateDropdown(-1);
      return;
    }

    if (e.key === "Tab") {
      if (showDropdown && dropdownOptions.length > 0) {
        e.preventDefault();
        setActiveTagIndex(-1);
        navigateDropdown(e.shiftKey ? -1 : 1);
        return;
      }

      if (input === "" && selected.length > 0) {
        e.preventDefault();
        if (e.shiftKey) {
          setActiveTagIndex((prev) =>
            prev <= 0 ? selected.length - 1 : prev - 1
          );
        } else {
          setActiveTagIndex((prev) =>
            prev >= selected.length - 1 ? 0 : prev + 1
          );
        }
        return;
      }

      if (!e.shiftKey && isValidEmail(input.trim())) {
        e.preventDefault();
        addCustomEmail();
      }
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && dropdownOptions[activeIndex]) {
        selectDropdownOption(dropdownOptions[activeIndex]);
      } else if (isValidEmail(input.trim())) {
        addCustomEmail();
      }
      return;
    }

    if (e.key === "Backspace" || e.key === "Delete") {
      if (input !== "") return;

      if (activeTagIndex >= 0) {
        e.preventDefault();
        removeTag(selected[activeTagIndex].email);
        return;
      }

      if (selected.length > 0) {
        e.preventDefault();
        removeLastTag();
      }
    }
  };

  const handleWrapperClick = () => {
    setIsFocused(true);
    focusInput();
  };

  return (
    <div className="gmail-to-container">
      <div
        ref={wrapperRef}
        className={`gmail-to-wrapper ${
          isFocused ? "gmail-to-focused" : ""
        } ${selected.length > 0 || input.length > 0 ? "gmail-to-has-content" : ""}`}
        onClick={handleWrapperClick}
        role="group"
        aria-label="To recipients"
      >
        {selected.map((item, index) => (
          <div
            key={item.email}
            className={`gmail-to-tag ${
              activeTagIndex === index ? "gmail-to-active-tag" : ""
            }`}
          >
            <span>{formatTagLabel(item)}</span>
            <button
              type="button"
              className="gmail-to-remove-btn"
              aria-label={`Remove ${item.email}`}
              onClick={(e) => {
                e.stopPropagation();
                removeTag(item.email);
              }}
            >
              ×
            </button>
          </div>
        ))}

        {showToLabel && (
          <span className="gmail-to-label" aria-hidden="true">
            To
          </span>
        )}

        <input
          ref={inputRef}
          type="text"
          className="gmail-to-input-field"
          value={input}
          aria-label="Add recipient"
          onFocus={() => {
            setIsFocused(true);
            setActiveTagIndex(-1);
          }}
          onChange={(e) => {
            setInput(e.target.value);
            setActiveIndex(-1);
            setActiveTagIndex(-1);
          }}
          onKeyDown={handleKeyDown}
        />

        {showDropdown && (
          <div
            ref={dropdownRef}
            className="gmail-to-dropdown"
            role="listbox"
            aria-label="Email suggestions"
          >
            {dropdownOptions.map((option, index) => (
              <div
                key={
                  option.type === "suggestion"
                    ? option.user.email
                    : `custom-${option.email}`
                }
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                role="option"
                aria-selected={activeIndex === index}
                className={`gmail-to-dropdown-item ${
                  activeIndex === index ? "gmail-to-active-item" : ""
                }`}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  selectDropdownOption(option);
                }}
              >
                {option.type === "suggestion" ? (
                  <>
                    <div className="gmail-to-name">{option.user.name}</div>
                    <div className="gmail-to-email">{option.user.email}</div>
                  </>
                ) : (
                  <div className="gmail-to-custom-option">
                    Add &quot;{option.email}&quot;
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
