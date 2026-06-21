"use client";

import {
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type DragEvent,
  type KeyboardEvent,
} from "react";
import "./TodoList.css";

type Todo = {
  id: string;
  text: string;
  completed: boolean;
};

type Filter = "all" | "pending" | "completed";

const STORAGE_KEY = "todo-list-items";

function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function loadTodos(): Todo[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored) as Todo[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function TodoListContent() {
  const [todos, setTodos] = useState<Todo[]>(loadTodos);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [dragId, setDragId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const pendingCount = useMemo(
    () => todos.filter((t) => !t.completed).length,
    [todos]
  );
  const completedCount = todos.length - pendingCount;

  const filteredTodos = useMemo(() => {
    const query = search.trim().toLowerCase();

    return todos.filter((todo) => {
      const matchesFilter =
        filter === "all" ||
        (filter === "pending" && !todo.completed) ||
        (filter === "completed" && todo.completed);

      const matchesSearch =
        !query || todo.text.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [todos, filter, search]);

  const addTodo = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const duplicate = todos.some(
      (t) => t.text.toLowerCase() === trimmed.toLowerCase()
    );
    if (duplicate) return;

    setTodos((prev) => [
      ...prev,
      { id: createId(), text: trimmed, completed: false },
    ]);
    setInput("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") addTodo();
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setEditText("");
    }
  };

  const clearCompleted = () => {
    setTodos((prev) => prev.filter((t) => !t.completed));
    if (filter === "completed") setFilter("all");
  };

  const markAllCompleted = () => {
    setTodos((prev) => prev.map((t) => ({ ...t, completed: true })));
  };

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const saveEdit = (id: string) => {
    const trimmed = editText.trim();
    if (!trimmed) {
      deleteTodo(id);
      return;
    }

    if (
      todos.some(
        (t) => t.text.toLowerCase() === trimmed.toLowerCase() && t.id !== id
      )
    ) {
      setEditText("");
      setEditingId(null);
      return;
    }

    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, text: trimmed } : t))
    );
    setEditingId(null);
    setEditText("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const handleEditKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    id: string
  ) => {
    if (e.key === "Enter") saveEdit(id);
    else if (e.key === "Escape") cancelEdit();
  };

  const reorderTodos = (fromId: string, toId: string) => {
    if (fromId === toId) return;

    setTodos((prev) => {
      const fromIndex = prev.findIndex((t) => t.id === fromId);
      const toIndex = prev.findIndex((t) => t.id === toId);
      if (fromIndex === -1 || toIndex === -1) return prev;

      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  };

  const handleDragStart = (id: string) => {
    setDragId(id);
  };

  const handleDragOver = (e: DragEvent, targetId: string) => {
    e.preventDefault();
    if (!dragId || dragId === targetId) return;
    reorderTodos(dragId, targetId);
    setDragId(targetId);
  };

  const handleDragEnd = () => {
    setDragId(null);
  };

  const filterOptions: { key: Filter; label: string; count: number }[] = [
    { key: "all", label: "All", count: todos.length },
    { key: "pending", label: "Pending", count: pendingCount },
    { key: "completed", label: "Completed", count: completedCount },
  ];

  let emptyMessage = "";
  if (todos.length === 0) {
    emptyMessage = "No todos yet. Add one above.";
  } else if (search.trim() && filteredTodos.length === 0) {
    emptyMessage = `No todos match "${search.trim()}".`;
  } else if (filter === "pending" && pendingCount === 0) {
    emptyMessage = "No pending todos.";
  } else if (filter === "completed" && completedCount === 0) {
    emptyMessage = "No completed todos.";
  }

  const canDrag = !search.trim() && filter === "all";

  return (
    <div className="todo-list-container">
      <header className="todo-list-header">
        <h2 className="todo-list-title">Todo List</h2>
        <p className="todo-list-subtitle">
          Add, edit, delete, complete, search, filter, drag to reorder — saved
          in localStorage.
        </p>
      </header>

      <div className="todo-list-input-row">
        <input
          className="todo-list-input"
          value={input}
          placeholder="What needs to be done?"
          aria-label="New todo"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          className="todo-list-add-btn"
          onClick={addTodo}
          disabled={!input.trim()}
        >
          Add
        </button>
      </div>

      {todos.length > 0 && (
        <>
          <input
            className="todo-list-search"
            type="search"
            placeholder="Search todos…"
            value={search}
            aria-label="Search todos"
            onChange={(e) => setSearch(e.target.value)}
          />

          <div
            className="todo-list-filters"
            role="tablist"
            aria-label="Filter todos"
          >
            {filterOptions.map(({ key, label, count }) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={filter === key}
                className={`todo-list-filter-btn ${
                  filter === key ? "todo-list-filter-btn--active" : ""
                }`}
                onClick={() => setFilter(key)}
              >
                {label}
                <span className="todo-list-filter-count">{count}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {filteredTodos.length > 0 ? (
        <ul className="todo-list-items">
          {filteredTodos.map((todo) => (
            <li
              key={todo.id}
              className={`todo-list-item ${
                todo.completed ? "todo-list-item--completed" : ""
              } ${dragId === todo.id ? "todo-list-item--dragging" : ""}`}
              draggable={canDrag && editingId !== todo.id}
              onDragStart={() => handleDragStart(todo.id)}
              onDragOver={(e) => handleDragOver(e, todo.id)}
              onDragEnd={handleDragEnd}
            >
              {canDrag && (
                <span
                  className="todo-list-drag-handle"
                  aria-hidden="true"
                  title="Drag to reorder"
                >
                  ⠿
                </span>
              )}

              <label className="todo-list-check">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  aria-label={`Mark "${todo.text}" as ${
                    todo.completed ? "pending" : "complete"
                  }`}
                />
                <span className="todo-list-checkmark" />
              </label>

              {editingId === todo.id ? (
                <input
                  className="todo-list-edit-input"
                  value={editText}
                  autoFocus
                  aria-label="Edit todo"
                  onChange={(e) => setEditText(e.target.value)}
                  onBlur={() => saveEdit(todo.id)}
                  onKeyDown={(e) => handleEditKeyDown(e, todo.id)}
                />
              ) : (
                <span
                  className="todo-list-text"
                  onDoubleClick={() => startEditing(todo)}
                >
                  {todo.text}
                </span>
              )}

              <div className="todo-list-actions">
                {editingId !== todo.id && (
                  <button
                    type="button"
                    className="todo-list-icon-btn"
                    aria-label={`Edit "${todo.text}"`}
                    onClick={() => startEditing(todo)}
                  >
                    ✎
                  </button>
                )}
                <button
                  type="button"
                  className="todo-list-icon-btn todo-list-icon-btn--delete"
                  aria-label={`Delete "${todo.text}"`}
                  onClick={() => deleteTodo(todo.id)}
                >
                  ×
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        emptyMessage && <p className="todo-list-empty">{emptyMessage}</p>
      )}

      {canDrag && filteredTodos.length > 1 && (
        <p className="todo-list-hint">Drag the handle to reorder tasks.</p>
      )}

      {todos.length > 0 && (
        <footer className="todo-list-footer">
          <span className="todo-list-stats">
            {pendingCount} pending · {completedCount} completed
          </span>

          <div>
            {pendingCount > 0 && (
              <button
                type="button"
                className="todo-list-clear-btn"
                onClick={markAllCompleted}
              >
                Mark all complete
              </button>
            )}
            {completedCount > 0 && (
              <button
                type="button"
                className="todo-list-clear-btn"
                onClick={clearCompleted}
              >
                Clear completed
              </button>
            )}
          </div>
        </footer>
      )}
    </div>
  );
}

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export default function TodoList() {
  const isClient = useIsClient();

  if (!isClient) {
    return (
      <div className="todo-list-container">
        <p className="todo-list-empty">Loading todos…</p>
      </div>
    );
  }

  return <TodoListContent />;
}
