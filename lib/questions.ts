import type { Question, QuestionMeta } from "@/lib/types";
import GmailLikeToField from "@/questions/gmail-like-to-field/GmailLikeToField";
import TodoList from "@/questions/todolist/TodoList";
import FileExplorer from "@/questions/file-explorer/FileExplorer.jsx";
import CustomHook from "@/questions/custom-hook/CustomHook";
import TabForm from "@/questions/tab-form/TabForm";
import ProductPagination from "@/questions/product-pagination/ProductPagination";
import ProgressBar from "@/questions/progress-bar/ProgressBar";
import OtpInput from "@/questions/otp-input/OtpInput";
import NestedCheckbox from "@/questions/nested-checkbox/NestedCheckbox";
import Accordion from "@/questions/accordion/Accordion";

const questionRegistry: Question[] = [
  {
    slug: "accordion",
    title: "Accordion",
    description:
      "Single-expand accordion with title/content items, toggle collapse, and empty-state handling.",
    topics: ["accordion", "useState", "conditional-rendering", "ui"],
    difficulty: "easy",
    sourceFiles: {
      tsx: "questions/accordion/Accordion.jsx",
      css: "questions/accordion/Accordion.css",
    },
    Component: Accordion,
  },
  {
    slug: "nested-checkbox",
    title: "Nested Checkbox Tree",
    description:
      "Recursive checkbox tree — parent checks all children, children check parent when all siblings are selected.",
    topics: ["tree", "recursion", "state", "checkbox", "data-structures"],
    difficulty: "hard",
    sourceFiles: {
      tsx: "questions/nested-checkbox/NestedCheckbox.jsx",
      css: "questions/nested-checkbox/NestedCheckbox.css",
    },
    Component: NestedCheckbox,
  },
  {
    slug: "otp-input",
    title: "OTP Input",
    description:
      "Generic scalable OTP field — configurable digit count, numeric-only, auto-advance, backspace navigation, and first-box focus.",
    topics: ["forms", "useRef", "useEffect", "keyboard", "generic-component"],
    difficulty: "medium",
    sourceFiles: {
      tsx: "questions/otp-input/OtpInput.jsx",
      css: "questions/otp-input/OtpInput.css",
    },
    Component: OtpInput,
  },
  {
    slug: "progress-bar",
    title: "Progress Bar",
    description:
      "Animated 0–100% progress bar with translateX animation, ARIA attributes, and readable labels on narrow fills.",
    topics: ["css", "animation", "accessibility", "useEffect", "transform"],
    difficulty: "easy",
    sourceFiles: {
      tsx: "questions/progress-bar/ProgressBar.jsx",
      css: "questions/progress-bar/ProgressBar.css",
    },
    Component: ProgressBar,
  },
  {
    slug: "product-pagination",
    title: "Product Pagination",
    description:
      "Fetch products from DummyJSON API, render cards, and implement client-side pagination with page numbers and prev/next controls.",
    topics: ["api", "pagination", "useEffect", "state", "dummyjson"],
    difficulty: "medium",
    sourceFiles: {
      tsx: "questions/product-pagination/ProductPagination.jsx",
      css: "questions/product-pagination/ProductPagination.css",
    },
    Component: ProductPagination,
  },
  {
    slug: "tab-form",
    title: "Multi-step Tab Form",
    description:
      "Config-driven tab form with Profile, Interests, and Settings — validation, data persistence, and submit on the last tab. (Zepto / Myntra style)",
    topics: ["forms", "tabs", "validation", "state", "config-driven"],
    difficulty: "medium",
    sourceFiles: {
      tsx: "questions/tab-form/TabForm.tsx",
      css: "questions/tab-form/TabForm.css",
    },
    Component: TabForm,
  },
  {
    slug: "custom-hook",
    title: "Custom Hook",
    description:
      "Create a custom hook to manage a list of items with search, filter, and pagination.",
    topics: ["hooks", "search", "filter", "pagination"],
    difficulty: "medium",
    sourceFiles: {
      tsx: "questions/custom-hook/CustomHook.tsx",
      css: "questions/custom-hook/CustomHook.css",
    },
    Component: CustomHook,
  },
  {
    slug: "todolist",
    title: "Todo List",
    description:
      "Add, complete, edit, delete, and filter todos with active/completed views.",
    topics: ["forms", "state", "lists", "filters"],
    difficulty: "easy",
    sourceFiles: {
      tsx: "questions/todolist/TodoList.tsx",
      css: "questions/todolist/TodoList.css",
    },
    Component: TodoList,
  },
  {
    slug: "gmail-like-to-field",
    title: "Gmail-like To Field",
    description:
      "Multi-select email input with search, keyboard navigation, custom email tags, and dropdown suggestions.",
    topics: ["forms", "keyboard-navigation", "autocomplete", "tags"],
    difficulty: "medium",
    sourceFiles: {
      tsx: "questions/gmail-like-to-field/GmailLikeToField.tsx",
      css: "questions/gmail-like-to-field/GmailLikeToField.css",
    },
    Component: GmailLikeToField,
  },
  {
    slug: "file-explorer",
    title: "File & Folder Explorer",
    description:
      "Recursive tree explorer with expand/collapse, per-folder state, add folder, and delete node (Google / Atlassian style).",
    topics: ["tree", "recursion", "data-structures", "state"],
    difficulty: "hard",
    sourceFiles: {
      tsx: "questions/file-explorer/FileExplorer.jsx",
      css: "questions/file-explorer/FileExplorer.css",
    },
    Component: FileExplorer,
  },
];

export const questions: QuestionMeta[] = questionRegistry.map(
  ({ Component: _component, ...meta }) => meta
);

export function getQuestionBySlug(slug: string): Question | undefined {
  return questionRegistry.find((q) => q.slug === slug);
}

export function getAllQuestionSlugs(): string[] {
  return questionRegistry.map((q) => q.slug);
}
