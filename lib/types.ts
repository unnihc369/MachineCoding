import type { ComponentType } from "react";

export type User = {
  name: string;
  email: string;
};

export type QuestionSourceFiles = {
  tsx: string;
  css: string;
};

export type QuestionMeta = {
  slug: string;
  title: string;
  description: string;
  topics: string[];
  difficulty: "easy" | "medium" | "hard";
  sourceFiles: QuestionSourceFiles;
};

export type Question = QuestionMeta & {
  Component: ComponentType;
};
