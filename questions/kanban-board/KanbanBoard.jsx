"use client";

import { useState } from "react";
import "./KanbanBoard.css";

const INITIAL_COLUMNS = [
  {
    id: "todo",
    title: "To Do",
    cards: [
      { id: "c1", title: "Design wireframes" },
      { id: "c2", title: "Set up project" },
    ],
  },
  {
    id: "inprogress",
    title: "In Progress",
    cards: [{ id: "c3", title: "Build Kanban board" }],
  },
  {
    id: "done",
    title: "Done",
    cards: [{ id: "c4", title: "Research drag & drop" }],
  },
];

export default function KanbanBoard() {
  const [columns, setColumns] = useState(INITIAL_COLUMNS);
  const [dragCard, setDragCard] = useState(null);

  const handleDragStart = (card, sourceColumnId) => {
    setDragCard({ card, sourceColumnId });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (targetColumnId) => {
    if (!dragCard) return;

    const { card, sourceColumnId } = dragCard;
    if (sourceColumnId === targetColumnId) {
      setDragCard(null);
      return;
    }

    setColumns((prev) =>
      prev.map((col) => {
        if (col.id === sourceColumnId) {
          return {
            ...col,
            cards: col.cards.filter((c) => c.id !== card.id),
          };
        }
        if (col.id === targetColumnId) {
          return { ...col, cards: [...col.cards, card] };
        }
        return col;
      })
    );

    setDragCard(null);
  };

  const addCard = (columnId) => {
    const title = window.prompt("Card title");
    if (!title?.trim()) return;

    const newCard = {
      id: `c-${Date.now()}`,
      title: title.trim(),
    };

    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId
          ? { ...col, cards: [...col.cards, newCard] }
          : col
      )
    );
  };

  return (
    <div className="kanban-board">
      <header className="kanban-board__header">
        <h2 className="kanban-board__title">Kanban Board</h2>
        <p className="kanban-board__subtitle">
          Drag cards between columns — native HTML5 drag and drop.
        </p>
      </header>

      <div className="kanban-board__columns">
        {columns.map((column) => (
          <section
            key={column.id}
            className="kanban-board__column"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(column.id)}
          >
            <header className="kanban-board__column-header">
              <h3>{column.title}</h3>
              <span className="kanban-board__count">{column.cards.length}</span>
            </header>

            <div className="kanban-board__cards">
              {column.cards.map((card) => (
                <article
                  key={card.id}
                  className="kanban-board__card"
                  draggable
                  onDragStart={() => handleDragStart(card, column.id)}
                  onDragEnd={() => setDragCard(null)}
                >
                  {card.title}
                </article>
              ))}
            </div>

            <button
              type="button"
              className="kanban-board__add"
              onClick={() => addCard(column.id)}
            >
              + Add card
            </button>
          </section>
        ))}
      </div>
    </div>
  );
}
