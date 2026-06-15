import type { ComponentType, ReactNode } from "react";
import SourcePanel from "@/components/SourcePanel";
import type { SourceFile } from "@/lib/readQuestionSources";

type QuestionWorkspaceProps = {
  preview: ReactNode;
  sources: SourceFile[];
};

export default function QuestionWorkspace({
  preview,
  sources,
}: QuestionWorkspaceProps) {
  return (
    <div className="question-workspace">
      <section className="question-preview" aria-label="Live preview">
        <div className="question-preview-inner">{preview}</div>
      </section>
      <SourcePanel files={sources} />
    </div>
  );
}

export type QuestionDemoProps = {
  Component: ComponentType;
};

export function QuestionDemo({ Component }: QuestionDemoProps) {
  return <Component />;
}
