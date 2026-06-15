"use client";

import { useMemo, useState, type KeyboardEvent } from "react";
import "./TodoList.css";

type Todo = {
  id: string;
  text: string;
  completed: boolean;
};

type Filter = "all" | "active" | "completed";

function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function TodoList() {
  const [input, setInput] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const activeCount = useMemo(
    () => todos.filter((t) => !t.completed).length,
    [todos],
  );
  const completedCount = todos.length - activeCount;

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case "active":
        return todos.filter((t) => !t.completed);
      case "completed":
        return todos.filter((t) => t.completed);
      case "all":
      default:
        return todos;
    }
  }, [todos, filter]);

  const addTodo = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const duplicate = todos.some(
      (t) => t.text.toLowerCase() === trimmed.toLowerCase(),
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
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
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
    if (todo.completed) return; // Prevent editing completed todos
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const saveEdit = (id: string) => {
    const trimmed = editText.trim();
    if (!trimmed) {
      deleteTodo(id);
      return;
    }
    // Prevent duplicates on edit (case-insensitive, ignore self)
    if (
      todos.some(
        (t) => t.text.toLowerCase() === trimmed.toLowerCase() && t.id !== id,
      )
    ) {
      // If duplicate found, do not save
      setEditText("");
      setEditingId(null);
      return;
    }

    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, text: trimmed } : t)),
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
    id: string,
  ) => {
    if (e.key === "Enter") saveEdit(id);
    else if (e.key === "Escape") cancelEdit();
  };

  let emptyMessage = "";
  if (todos.length === 0) {
    emptyMessage = "No todos yet. Add one above.";
  } else if (filter === "active" && activeCount === 0) {
    emptyMessage = "No active todos.";
  } else if (filter === "completed" && completedCount === 0) {
    emptyMessage = "No completed todos.";
  }

  return (
    <div className="todo-list-container">
      <header className="todo-list-header">
        <h2 className="todo-list-title">Todo List</h2>
        <p className="todo-list-subtitle">
          Add tasks, mark complete, edit, filter, and clear done items.
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
        <div
          className="todo-list-filters"
          role="tablist"
          aria-label="Filter todos"
        >
          {(["all", "active", "completed"] as const).map((f) => (
            <button
              key={f}
              type="button"
              role="tab"
              aria-selected={filter === f}
              className={`todo-list-filter-btn ${filter === f ? "todo-list-filter-btn--active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              <span className="todo-list-filter-count">
                {f === "all"
                  ? todos.length
                  : f === "active"
                    ? activeCount
                    : completedCount}
              </span>
            </button>
          ))}
        </div>
      )}

      {filteredTodos.length > 0 ? (
        <ul className="todo-list-items">
          {filteredTodos.map((todo) => (
            <li
              key={todo.id}
              className={`todo-list-item ${
                todo.completed ? "todo-list-item--completed" : ""
              }`}
            >
              <label className="todo-list-check">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  aria-label={`Mark "${todo.text}" as ${todo.completed ? "incomplete" : "complete"}`}
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
                {editingId !== todo.id && !todo.completed && (
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

      {todos.length > 0 && (
        <footer className="todo-list-footer">
          <span className="todo-list-stats">
            {activeCount} item{activeCount !== 1 ? "s" : ""} left
          </span>

          <div>
            {activeCount > 0 && (
              <button
                type="button"
                className="todo-list-clear-btn"
                onClick={markAllCompleted}
              >
                Mark all Completed ({activeCount})
              </button>
            )}
            {completedCount > 0 && (
              <button
                type="button"
                className="todo-list-clear-btn"
                onClick={clearCompleted}
              >
                Clear completed ({completedCount})
              </button>
            )}
          </div>
        </footer>
      )}
    </div>
  );
}
