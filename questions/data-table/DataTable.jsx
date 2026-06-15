"use client";

import { useMemo, useState } from "react";
import "./DataTable.css";

const TABLE_DATA = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Admin", status: "Active" },
  { id: 2, name: "Bob Smith", email: "bob@example.com", role: "Editor", status: "Active" },
  { id: 3, name: "Charlie Brown", email: "charlie@example.com", role: "Viewer", status: "Inactive" },
  { id: 4, name: "Diana Prince", email: "diana@example.com", role: "Admin", status: "Active" },
  { id: 5, name: "Eve Adams", email: "eve@example.com", role: "Editor", status: "Pending" },
  { id: 6, name: "Frank Miller", email: "frank@example.com", role: "Viewer", status: "Active" },
  { id: 7, name: "Grace Lee", email: "grace@example.com", role: "Editor", status: "Inactive" },
  { id: 8, name: "Henry Wilson", email: "henry@example.com", role: "Admin", status: "Active" },
  { id: 9, name: "Ivy Chen", email: "ivy@example.com", role: "Viewer", status: "Pending" },
  { id: 10, name: "Jack Davis", email: "jack@example.com", role: "Editor", status: "Active" },
  { id: 11, name: "Kate Moore", email: "kate@example.com", role: "Admin", status: "Inactive" },
  { id: 12, name: "Leo Garcia", email: "leo@example.com", role: "Viewer", status: "Active" },
];

const PAGE_SIZE = 5;
const COLUMNS = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "role", label: "Role" },
  { key: "status", label: "Status" },
];

export default function DataTable() {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("name");
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return TABLE_DATA;

    return TABLE_DATA.filter((row) =>
      Object.values(row).some((val) =>
        String(val).toLowerCase().includes(q)
      )
    );
  }, [search]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const aVal = String(a[sortKey]).toLowerCase();
      const bVal = String(b[sortKey]).toLowerCase();
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE) || 1;
  const safePage = Math.min(page, totalPages - 1);

  const pageRows = useMemo(() => {
    const start = safePage * PAGE_SIZE;
    return sorted.slice(start, start + PAGE_SIZE);
  }, [sorted, safePage]);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(0);
  };

  return (
    <div className="data-table">
      <header className="data-table__header">
        <h2 className="data-table__title">Data Table</h2>
        <p className="data-table__subtitle">
          Sort by column, filter rows, and paginate results.
        </p>
      </header>

      <input
        className="data-table__search"
        type="search"
        placeholder="Filter by name, email, role…"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(0);
        }}
      />

      <div className="data-table__wrap">
        <table className="data-table__table">
          <thead>
            <tr>
              {COLUMNS.map((col) => (
                <th key={col.key}>
                  <button
                    type="button"
                    className="data-table__sort"
                    onClick={() => handleSort(col.key)}
                  >
                    {col.label}
                    {sortKey === col.key && (
                      <span>{sortDir === "asc" ? " ↑" : " ↓"}</span>
                    )}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                <td colSpan={COLUMNS.length} className="data-table__empty">
                  No rows match your filter.
                </td>
              </tr>
            ) : (
              pageRows.map((row) => (
                <tr key={row.id}>
                  <td>{row.name}</td>
                  <td>{row.email}</td>
                  <td>{row.role}</td>
                  <td>
                    <span
                      className={`data-table__badge data-table__badge--${row.status.toLowerCase()}`}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <footer className="data-table__footer">
        <span>
          {sorted.length} row{sorted.length !== 1 ? "s" : ""} · Page{" "}
          {safePage + 1} of {totalPages}
        </span>
        <div className="data-table__pager">
          <button
            type="button"
            disabled={safePage === 0}
            onClick={() => setPage((p) => p - 1)}
          >
            Prev
          </button>
          <button
            type="button"
            disabled={safePage >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </footer>
    </div>
  );
}
