import Link from "next/link";
import { notFound } from "next/navigation";
import QuestionWorkspace, {
  QuestionDemo,
} from "@/components/QuestionWorkspace";
import { readQuestionSources } from "@/lib/readQuestionSources";
import {
  getAllQuestionSlugs,
  getQuestionBySlug,
} from "@/lib/questions";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllQuestionSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const question = getQuestionBySlug(slug);

  if (!question) {
    return { title: "Question not found" };
  }

  return {
    title: `${question.title} | Machine Coding Examples`,
    description: question.description,
  };
}

export default async function QuestionPage({ params }: PageProps) {
  const { slug } = await params;
  const question = getQuestionBySlug(slug);

  if (!question) {
    notFound();
  }

  const sources = await readQuestionSources(question.sourceFiles);

  return (
    <div className="question-page">
      <nav className="question-nav">
        <Link href="/" className="back-link">
          ← All questions
        </Link>
      </nav>

      <header className="question-page-header">
        <h1>{question.title}</h1>
        <p>{question.description}</p>
        <div className="question-meta">
          <span className={`difficulty difficulty-${question.difficulty}`}>
            {question.difficulty}
          </span>
          {question.topics.map((topic) => (
            <span key={topic} className="topic-tag">
              {topic}
            </span>
          ))}
        </div>
      </header>

      <QuestionWorkspace
        preview={<QuestionDemo Component={question.Component} />}
        sources={sources}
      />
    </div>
  );
}
