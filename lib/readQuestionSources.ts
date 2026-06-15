import { readFile } from "fs/promises";
import path from "path";
import type { QuestionSourceFiles } from "@/lib/types";

export type SourceFile = {
  name: string;
  content: string;
  language: "tsx" | "css";
};

export async function readQuestionSources(
  sourceFiles: QuestionSourceFiles
): Promise<SourceFile[]> {
  const entries: { name: string; filePath: string; language: "tsx" | "css" }[] =
    [
      {
        name: path.basename(sourceFiles.tsx),
        filePath: sourceFiles.tsx,
        language: "tsx",
      },
      {
        name: path.basename(sourceFiles.css),
        filePath: sourceFiles.css,
        language: "css",
      },
    ];

  return Promise.all(
    entries.map(async ({ name, filePath, language }) => {
      const absolutePath = path.join(process.cwd(), filePath);
      const content = await readFile(absolutePath, "utf-8");
      return { name, content, language };
    })
  );
}
