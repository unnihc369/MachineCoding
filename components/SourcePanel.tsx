"use client";

import { useState } from "react";
import type { SourceFile } from "@/lib/readQuestionSources";

type SourcePanelProps = {
  files: SourceFile[];
};

export default function SourcePanel({ files }: SourcePanelProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeFile = files[activeIndex] ?? files[0];

  if (!activeFile) return null;

  return (
    <aside className="source-panel" aria-label="Source code (view only)">
      <div className="source-panel-header">
        <div
          className="source-tab-list"
          role="tablist"
          aria-label="Source files"
        >
          {files.map((file, index) => {
            const label = file.language === "tsx" ? "JSX" : "CSS";
            return (
              <button
                key={file.name}
                type="button"
                role="tab"
                aria-selected={activeIndex === index}
                aria-controls={`source-panel-${file.language}`}
                id={`source-tab-${file.language}`}
                className={`source-tab ${
                  activeIndex === index ? "source-tab--active" : ""
                }`}
                onClick={() => setActiveIndex(index)}
              >
                <span
                  className={`source-tab-icon source-tab-icon--${file.language}`}
                >
                  {label}
                </span>
                {file.name}
              </button>
            );
          })}
        </div>
        <span className="source-panel-badge">View only</span>
      </div>

      <div
        className="source-panel-content"
        role="tabpanel"
        id={`source-panel-${activeFile.language}`}
        aria-labelledby={`source-tab-${activeFile.language}`}
      >
        <pre className="source-code" tabIndex={0}>
          <code>{activeFile.content || "/* empty */"}</code>
        </pre>
      </div>
    </aside>
  );
}
