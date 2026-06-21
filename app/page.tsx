import QuestionCatalog from "@/components/QuestionCatalog";
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

      <QuestionCatalog questions={questions} />
    </div>
  );
}
