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
import Cart from "@/questions/cart/Cart";
import InfiniteScroll from "@/questions/infinite-scroll/InfiniteScroll";
import Carousel from "@/questions/carousel/Carousel";
import BarGraph from "@/questions/bar-graph/BarGraph";
import Calendar from "@/questions/calendar/Calendar";
import NestedComments from "@/questions/nested-comments/NestedComments";
import KanbanBoard from "@/questions/kanban-board/KanbanBoard";
import AutocompleteSearch from "@/questions/autocomplete-search/AutocompleteSearch";
import DataTable from "@/questions/data-table/DataTable";
import ModalManager from "@/questions/modal-manager/ModalManager";
import MemoryGame from "@/questions/memory-game/MemoryGame";
import TrafficLight from "@/questions/traffic-light/TrafficLight";
import StarRating from "@/questions/star-rating/StarRating";
import Tabs from "@/questions/tabs/Tabs";
import PasswordStrength from "@/questions/password-strength/PasswordStrength";
import TreeView from "@/questions/tree-view/TreeView";

const questionRegistry: Question[] = [
  {
    slug: "tree-view",
    title: "Tree View",
    description:
      "Recursive tree with expand/collapse, node search with highlight, and auto-expand matching branches.",
    topics: ["tree", "recursion", "search", "expand-collapse"],
    difficulty: "medium",
    sourceFiles: {
      tsx: "questions/tree-view/TreeView.jsx",
      css: "questions/tree-view/TreeView.css",
    },
    Component: TreeView,
  },
  {
    slug: "password-strength",
    title: "Password Strength Meter",
    description:
      "Generate passwords by length and character options — Weak/Medium/Strong rating with regex rule validation.",
    topics: ["password", "regex", "forms", "generator", "validation"],
    difficulty: "medium",
    sourceFiles: {
      tsx: "questions/password-strength/PasswordStrength.jsx",
      css: "questions/password-strength/PasswordStrength.css",
    },
    Component: PasswordStrength,
  },
  {
    slug: "kanban-board",
    title: "Kanban Board",
    description:
      "Drag-and-drop task board with To Do, In Progress, and Done columns.",
    topics: ["drag-and-drop", "kanban", "state", "html5-dnd"],
    difficulty: "hard",
    sourceFiles: {
      tsx: "questions/kanban-board/KanbanBoard.jsx",
      css: "questions/kanban-board/KanbanBoard.css",
    },
    Component: KanbanBoard,
  },
  {
    slug: "modal-manager",
    title: "Modal Manager",
    description:
      "Context-driven modals with portal rendering, open/close, click-outside, ESC key, and stacking.",
    topics: ["modal", "context-api", "portal", "ui"],
    difficulty: "medium",
    sourceFiles: {
      tsx: "questions/modal-manager/ModalManager.jsx",
      css: "questions/modal-manager/ModalManager.css",
    },
    Component: ModalManager,
  },
  {
    slug: "data-table",
    title: "Data Table",
    description:
      "Sortable, filterable, paginated table with status badges and column sorting.",
    topics: ["table", "sorting", "filtering", "pagination"],
    difficulty: "medium",
    sourceFiles: {
      tsx: "questions/data-table/DataTable.jsx",
      css: "questions/data-table/DataTable.css",
    },
    Component: DataTable,
  },
  {
    slug: "autocomplete-search",
    title: "Autocomplete Search",
    description:
      "Debounced search input (300ms) with filtered dropdown suggestions.",
    topics: ["autocomplete", "debounce", "search", "useEffect"],
    difficulty: "medium",
    sourceFiles: {
      tsx: "questions/autocomplete-search/AutocompleteSearch.jsx",
      css: "questions/autocomplete-search/AutocompleteSearch.css",
    },
    Component: AutocompleteSearch,
  },
  {
    slug: "nested-comments",
    title: "Nested Comments",
    description:
      "Infinite nesting — reply to any comment, expand/collapse threads, recursive rendering.",
    topics: ["comments", "recursion", "tree", "expand-collapse"],
    difficulty: "hard",
    sourceFiles: {
      tsx: "questions/nested-comments/NestedComments.jsx",
      css: "questions/nested-comments/NestedComments.css",
    },
    Component: NestedComments,
  },
  {
    slug: "memory-game",
    title: "Memory Game",
    description:
      "Flip cards to find matching emoji pairs — track moves and win state.",
    topics: ["game", "state", "useEffect", "matching"],
    difficulty: "medium",
    sourceFiles: {
      tsx: "questions/memory-game/MemoryGame.jsx",
      css: "questions/memory-game/MemoryGame.css",
    },
    Component: MemoryGame,
  },
  {
    slug: "traffic-light",
    title: "Traffic Light",
    description:
      "Auto-cycling red → yellow → green signal with pause/resume control.",
    topics: ["useEffect", "setTimeout", "animation", "state-machine"],
    difficulty: "easy",
    sourceFiles: {
      tsx: "questions/traffic-light/TrafficLight.jsx",
      css: "questions/traffic-light/TrafficLight.css",
    },
    Component: TrafficLight,
  },
  {
    slug: "star-rating",
    title: "Star Rating",
    description:
      "Partial star rating (0.5 steps) with hover fill, keyboard arrows, text input, and read-only mode.",
    topics: ["rating", "hover", "controlled-component", "ui"],
    difficulty: "easy",
    sourceFiles: {
      tsx: "questions/star-rating/StarRating.jsx",
      css: "questions/star-rating/StarRating.css",
    },
    Component: StarRating,
  },
  {
    slug: "tabs",
    title: "Tabs",
    description:
      "Tabbed interface with static panels, lazy-loaded content via Suspense, and dynamic add-tab.",
    topics: ["tabs", "accessibility", "conditional-rendering"],
    difficulty: "easy",
    sourceFiles: {
      tsx: "questions/tabs/Tabs.jsx",
      css: "questions/tabs/Tabs.css",
    },
    Component: Tabs,
  },
  {
    slug: "calendar",
    title: "Calendar",
    description:
      "Month view with prev/next navigation, current-month badge, and today highlighted.",
    topics: ["calendar", "date", "useState", "grid"],
    difficulty: "medium",
    sourceFiles: {
      tsx: "questions/calendar/Calendar.jsx",
      css: "questions/calendar/Calendar.css",
    },
    Component: Calendar,
  },
  {
    slug: "bar-graph",
    title: "Bar Graph",
    description:
      "Animated bar chart with hover tooltip (cursor % from bottom), asc/desc sorting, and max-value scaling.",
    topics: ["charts", "css", "data-visualization"],
    difficulty: "easy",
    sourceFiles: {
      tsx: "questions/bar-graph/BarGraph.jsx",
      css: "questions/bar-graph/BarGraph.css",
    },
    Component: BarGraph,
  },
  {
    slug: "carousel",
    title: "Image Carousel",
    description:
      "Auto-playing image carousel with prev/next arrows, dot indicators, and 3-second interval.",
    topics: ["carousel", "useEffect", "setInterval", "ui"],
    difficulty: "easy",
    sourceFiles: {
      tsx: "questions/carousel/Carousel.jsx",
      css: "questions/carousel/Carousel.css",
    },
    Component: Carousel,
  },
  {
    slug: "infinite-scroll",
    title: "Infinite Scroll",
    description:
      "Fetch paginated posts from JSONPlaceholder and load more using IntersectionObserver.",
    topics: ["infinite-scroll", "intersection-observer", "api", "useEffect"],
    difficulty: "medium",
    sourceFiles: {
      tsx: "questions/infinite-scroll/InfiniteScroll.jsx",
      css: "questions/infinite-scroll/InfiniteScroll.css",
    },
    Component: InfiniteScroll,
  },
  {
    slug: "cart",
    title: "Shopping Cart",
    description:
      "Add products, update quantities, apply SAVE10 promo for 10% off — cart state via Context API.",
    topics: ["context-api", "state", "cart", "promo-code"],
    difficulty: "medium",
    sourceFiles: {
      tsx: "questions/cart/Cart.jsx",
      css: "questions/cart/Cart.css",
    },
    Component: Cart,
  },
  {
    slug: "accordion",
    title: "Accordion",
    description:
      "Accordion with single/multiple open modes, nested items, expand/collapse, and empty-state handling.",
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
      "Controlled OTP field — auto-advance, backspace navigation, paste support, and configurable digit count.",
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
      "Full todo app — add, edit, delete, complete, search, filter (All/Pending/Completed), drag-and-drop reorder, and localStorage persistence.",
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
      "Recursive tree explorer with expand/collapse, create folder/file, rename, and delete.",
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
