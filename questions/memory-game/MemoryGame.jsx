"use client";

import { useCallback, useEffect, useState } from "react";
import "./MemoryGame.css";

const EMOJIS = ["🍎", "🍌", "🍇", "🍊", "🍓", "🥝", "🍑", "🍒"];

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function createDeck() {
  const pairs = EMOJIS.flatMap((emoji, index) => [
    { id: `${index}-a`, emoji, pairId: index },
    { id: `${index}-b`, emoji, pairId: index },
  ]);
  return shuffle(pairs);
}

export default function MemoryGame() {
  const [cards, setCards] = useState(createDeck);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [lock, setLock] = useState(false);

  const isWon = matched.length === EMOJIS.length;

  const resetGame = useCallback(() => {
    setCards(createDeck());
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setLock(false);
  }, []);

  const handleCardClick = (card) => {
    if (lock || flipped.includes(card.id) || matched.includes(card.pairId)) {
      return;
    }

    const nextFlipped = [...flipped, card.id];
    setFlipped(nextFlipped);

    if (nextFlipped.length === 2) {
      setMoves((prev) => prev + 1);
      setLock(true);

      const [firstId, secondId] = nextFlipped;
      const first = cards.find((c) => c.id === firstId);
      const second = cards.find((c) => c.id === secondId);

      if (first.pairId === second.pairId) {
        setMatched((prev) => [...prev, first.pairId]);
        setFlipped([]);
        setLock(false);
      } else {
        setTimeout(() => {
          setFlipped([]);
          setLock(false);
        }, 800);
      }
    }
  };

  useEffect(() => {
    if (isWon) return;
  }, [isWon]);

  return (
    <div className="memory-game">
      <header className="memory-game__header">
        <h2 className="memory-game__title">Memory Game</h2>
        <p className="memory-game__subtitle">
          Flip cards to find matching pairs — fewer moves is better.
        </p>
      </header>

      <div className="memory-game__stats">
        <span>Moves: {moves}</span>
        <span>
          Pairs: {matched.length} / {EMOJIS.length}
        </span>
        <button type="button" className="memory-game__reset" onClick={resetGame}>
          Reset
        </button>
      </div>

      {isWon && (
        <p className="memory-game__win" role="status">
          You won in {moves} moves!
        </p>
      )}

      <div className="memory-game__grid">
        {cards.map((card) => {
          const isFlipped =
            flipped.includes(card.id) || matched.includes(card.pairId);

          return (
            <button
              key={card.id}
              type="button"
              className={`memory-game__card ${
                isFlipped ? "memory-game__card--flipped" : ""
              }`}
              aria-label={isFlipped ? card.emoji : "Hidden card"}
              onClick={() => handleCardClick(card)}
            >
              <span className="memory-game__front">?</span>
              <span className="memory-game__back">{card.emoji}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
