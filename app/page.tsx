import Link from "next/link";
import { questions } from "@/lib/questions";

export default function HomePage() {
  return (
    <div className="home">
      <header className="home-header">
        <h1>Machine Coding Examples</h1>
        <p>
          Practice frontend machine-coding questions. Each example lives in its
          own folder with a dedicated TSX and CSS file.
        </p>
      </header>

      <section className="home-section">
        <h2>Questions ({questions.length})</h2>

        {questions.length === 0 ? (
          <p className="home-empty">No questions yet. Add one under questions/.</p>
        ) : (
          <ul className="question-list">
            {questions.map((question) => (
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
        )}
      </section>
    </div>
  );
}
