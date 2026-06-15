import Link from "next/link";

export default function QuestionNotFound() {
  return (
    <div className="question-page">
      <h1>Question not found</h1>
      <p>The question you are looking for does not exist in this repo.</p>
      <Link href="/" className="back-link">
        ← Back to all questions
      </Link>
    </div>
  );
}
