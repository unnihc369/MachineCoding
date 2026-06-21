"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { QuestionMeta } from "@/lib/types";

const PAGE_SIZE = 6;
const DIFFICULTIES = ["all", "easy", "medium", "hard"] as const;

type DifficultyFilter = (typeof DIFFICULTIES)[number];

type QuestionCatalogProps = {
  questions: QuestionMeta[];
};

function matchesSearch(question: QuestionMeta, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  return (
    question.title.toLowerCase().includes(q) ||
    question.description.toLowerCase().includes(q) ||
    question.slug.toLowerCase().includes(q) ||
    question.topics.some((topic) => topic.toLowerCase().includes(q))
  );
}

export default function QuestionCatalog({ questions }: QuestionCatalogProps) {
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState<DifficultyFilter>("all");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    return questions.filter((question) => {
      const matchesDifficulty =
        difficulty === "all" || question.difficulty === difficulty;
      return matchesDifficulty && matchesSearch(question, search);
    });
  }, [questions, search, difficulty]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);

  const pageItems = useMemo(() => {
    const start = safePage * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, safePage]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(0);
  };

  const handleDifficultyChange = (value: DifficultyFilter) => {
    setDifficulty(value);
    setPage(0);
  };

  return (
    <section className="home-section">
      <div className="home-section__top">
        <h2>
          Questions ({filtered.length}
          {filtered.length !== questions.length && ` of ${questions.length}`})
        </h2>
      </div>

      <div className="home-toolbar">
        <input
          className="home-toolbar__search"
          type="search"
          placeholder="Search by title, topic, or description…"
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          aria-label="Search questions"
        />

        <div className="home-toolbar__filters" role="group" aria-label="Filter by difficulty">
          {DIFFICULTIES.map((level) => (
            <button
              key={level}
              type="button"
              className={`home-toolbar__filter ${
                difficulty === level ? "home-toolbar__filter--active" : ""
              }`}
              onClick={() => handleDifficultyChange(level)}
            >
              {level === "all" ? "All" : level}
            </button>
          ))}
        </div>
      </div>

      {questions.length === 0 ? (
        <p className="home-empty">No questions yet. Add one under questions/.</p>
      ) : filtered.length === 0 ? (
        <p className="home-empty">No questions match your search or filter.</p>
      ) : (
        <>
          <ul className="question-list">
            {pageItems.map((question) => (
              <li key={question.slug}>
                <Link
                  href={`/questions/${question.slug}`}
                  className="question-card"
                >
                  <div className="question-card-header">
                    <h3>{question.title}</h3>
                    <span
                      className={`difficulty difficulty-${question.difficulty}`}
                    >
                      {question.difficulty}
                    </span>
                  </div>
                  <p className="question-description">{question.description}</p>
                  <div className="question-topics">
                    {question.topics.map((topic) => (
                      <span key={topic} className="topic-tag">
                        {topic}
                      </span>
                    ))}
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          {totalPages > 1 && (
            <footer className="home-pagination">
              <button
                type="button"
                className="home-pagination__btn"
                disabled={safePage === 0}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </button>

              <span className="home-pagination__meta">
                Page {safePage + 1} of {totalPages}
              </span>

              <button
                type="button"
                className="home-pagination__btn"
                disabled={safePage >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </footer>
          )}
        </>
      )}
    </section>
  );
}
