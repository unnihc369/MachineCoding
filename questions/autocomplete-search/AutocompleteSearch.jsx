"use client";

import { useEffect, useMemo, useState } from "react";
import "./AutocompleteSearch.css";

const SUGGESTIONS = [
  "Apple",
  "Apricot",
  "Banana",
  "Blackberry",
  "Blueberry",
  "Cherry",
  "Coconut",
  "Grape",
  "Grapefruit",
  "Kiwi",
  "Lemon",
  "Lime",
  "Mango",
  "Melon",
  "Orange",
  "Papaya",
  "Peach",
  "Pear",
  "Pineapple",
  "Plum",
  "Raspberry",
  "Strawberry",
  "Watermelon",
];

function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

export default function AutocompleteSearch() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  const results = useMemo(() => {
    const trimmed = debouncedQuery.trim().toLowerCase();
    if (trimmed.length < 1) return [];

    return SUGGESTIONS.filter((item) =>
      item.toLowerCase().includes(trimmed)
    ).slice(0, 8);
  }, [debouncedQuery]);

  const handleSelect = (item) => {
    setSelected(item);
    setQuery(item);
    setIsOpen(false);
  };

  return (
    <div className="autocomplete-search">
      <header className="autocomplete-search__header">
        <h2 className="autocomplete-search__title">Autocomplete Search</h2>
        <p className="autocomplete-search__subtitle">
          Debounced search (300ms) — type to filter fruit suggestions.
        </p>
      </header>

      <div className="autocomplete-search__field">
        <input
          className="autocomplete-search__input"
          type="text"
          placeholder="Search fruits…"
          value={query}
          aria-autocomplete="list"
          aria-expanded={isOpen && results.length > 0}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelected("");
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 150)}
        />

        {isOpen && debouncedQuery && results.length > 0 && (
          <ul className="autocomplete-search__dropdown" role="listbox">
            {results.map((item) => (
              <li key={item} role="option">
                <button
                  type="button"
                  className="autocomplete-search__option"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleSelect(item)}
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        )}

        {isOpen && debouncedQuery && results.length === 0 && (
          <p className="autocomplete-search__empty">No matches found</p>
        )}
      </div>

      <p className="autocomplete-search__meta">
        Debounced query: <code>{debouncedQuery || "—"}</code>
        {selected && (
          <>
            {" "}
            · Selected: <strong>{selected}</strong>
          </>
        )}
      </p>
    </div>
  );
}
