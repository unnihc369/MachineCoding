# Machine Coding Examples

A Next.js repo for practicing frontend machine-coding questions. Each question is a self-contained TypeScript component with its own CSS, registered in a central catalog and served via App Router dynamic routes.

## Quick start

```bash
npm install
npm run dev
```

- **Home (question list):** [http://localhost:3000](http://localhost:3000)
- **Single question:** `http://localhost:3000/questions/<slug>` (e.g. `/questions/gmail-like-to-field`)

## Project structure

```
my-app/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # / — lists all questions
│   ├── globals.css             # Shared layout & list styles
│   └── questions/
│       └── [slug]/
│           ├── page.tsx        # Dynamic route — renders one question
│           └── not-found.tsx   # 404 for unknown slugs
├── lib/
│   ├── types.ts                # Shared TypeScript types
│   └── questions.ts            # Question registry (single source of truth)
└── questions/
    └── <question-slug>/
        ├── <ComponentName>.tsx # Client component (TypeScript)
        └── <ComponentName>.css # Scoped styles for that question only
```

### Rules

| Rule | Detail |
|------|--------|
| **One folder per question** | Use kebab-case for the folder name (e.g. `gmail-like-to-field`). |
| **TSX + CSS required** | Every question must have a `.tsx` and a `.css` file in its folder. |
| **Register every question** | Add metadata and the component import in `lib/questions.ts`. |
| **Slug = URL segment** | The folder name must match the `slug` in the registry. |
| **Client components** | Interactive questions use `"use client"` at the top of the TSX file. |
| **Scoped CSS** | Prefix class names with the question name (e.g. `gmail-to-*`) to avoid clashes. |
| **No global question styles** | Question-specific styles stay in that question’s CSS file, not `globals.css`. |

## Routing

This app uses the [Next.js App Router](https://nextjs.org/docs/app).

### Static route: `/`

- File: `app/page.tsx`
- Lists every question from `lib/questions.ts`
- Links use `<Link href={/questions/${slug}}>` — client-side navigation without full reload

### Dynamic route: `/questions/[slug]`

- File: `app/questions/[slug]/page.tsx`
- `[slug]` is a **dynamic segment** — the folder name in brackets creates a param
- Example URLs:
  - `/questions/gmail-like-to-field` → `slug = "gmail-like-to-field"`
  - `/questions/unknown` → triggers `notFound()`

#### How the dynamic page works

1. **`params`** — In Next.js 15+, `params` is a `Promise`. Await it in the page:

   ```ts
   type PageProps = { params: Promise<{ slug: string }> };

   export default async function QuestionPage({ params }: PageProps) {
     const { slug } = await params;
     // ...
   }
   ```

2. **`getQuestionBySlug(slug)`** — Looks up the question in `lib/questions.ts`. If missing, call `notFound()` from `next/navigation`.

3. **`generateStaticParams()`** — Pre-builds a static HTML page per known slug at build time:

   ```ts
   export function generateStaticParams() {
     return getAllQuestionSlugs().map((slug) => ({ slug }));
   }
   ```

   Add a new slug to the registry and it is included automatically on the next `npm run build`.

4. **`generateMetadata()`** — Sets per-question `<title>` and description from registry metadata.

5. **`not-found.tsx`** — Custom UI when `notFound()` is called for an invalid slug.

### Routing checklist when adding a question

- [ ] Folder under `questions/<slug>/` matches registry `slug`
- [ ] Entry added to `lib/questions.ts`
- [ ] `generateStaticParams` picks it up via `getAllQuestionSlugs()` (no extra change needed)
- [ ] Home page lists it via `questions` export (no extra change needed)
- [ ] Visit `/questions/<slug>` locally to verify

## Adding a new question

### 1. Create files

```
questions/infinite-scroll/
├── InfiniteScroll.tsx
└── InfiniteScroll.css
```

`InfiniteScroll.tsx` (minimal template):

```tsx
"use client";

import "./InfiniteScroll.css";

export default function InfiniteScroll() {
  return <div className="infinite-scroll-root">{/* implementation */}</div>;
}
```

Use a unique CSS prefix (e.g. `infinite-scroll-*`) for all classes in `InfiniteScroll.css`.

### 2. Register in `lib/questions.ts`

```ts
import InfiniteScroll from "@/questions/infinite-scroll/InfiniteScroll";

// Add to questionRegistry array:
{
  slug: "infinite-scroll",
  title: "Infinite Scroll",
  description: "Load more items as the user scrolls.",
  topics: ["scroll", "pagination"],
  difficulty: "medium",
  Component: InfiniteScroll,
},
```

### 3. Verify

```bash
npm run dev
```

- Open `/` — new card should appear
- Open `/questions/infinite-scroll` — demo should render

## TypeScript conventions

- Shared types live in `lib/types.ts` (e.g. `User`, `Question`, `QuestionMeta`).
- Question components import types from `@/lib/types` when needed.
- Strict mode is enabled in `tsconfig.json` — avoid `any` unless justified.
- Path alias `@/*` maps to the project root.

## Client vs server components

| Location | Type | Why |
|----------|------|-----|
| `app/page.tsx` | Server | Static list, no hooks |
| `app/questions/[slug]/page.tsx` | Server | Metadata, `generateStaticParams`, lookup |
| `questions/**/<Name>.tsx` | Client (`"use client"`) | `useState`, `useEffect`, events |

The dynamic page imports the client component and renders `<Component />` inside the server layout.

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Development server |
| `npm run build` | Production build (runs `generateStaticParams`) |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |

## Current questions

| Slug | Title | Difficulty |
|------|-------|------------|
| `gmail-like-to-field` | Gmail-like To Field | medium |

## Learn more

- [Next.js App Router](https://nextjs.org/docs/app)
- [Dynamic Routes](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)
- [generateStaticParams](https://nextjs.org/docs/app/api-reference/functions/generate-static-params)
- [notFound](https://nextjs.org/docs/app/api-reference/functions/not-found)
