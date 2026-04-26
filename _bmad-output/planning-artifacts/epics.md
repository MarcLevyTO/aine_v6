---
stepsCompleted:
  - step-01-validate-prerequisites
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/architecture.md
  - _bmad-output/planning-artifacts/product-brief.md
---

# aine_v6 - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for aine_v6, decomposing the requirements from the PRD and Architecture into implementable stories.

## Requirements Inventory

### Functional Requirements

**Todo Management:**

- **FR1:** User can add a new todo by providing non-empty text input.
- **FR2:** User attempting to add an empty or whitespace-only todo has no todo added; the action is silently rejected with no error displayed.
- **FR3:** User can view the complete list of all todos in the order they were added.
- **FR4:** User can mark any incomplete todo as complete.
- **FR5:** User can mark any complete todo as incomplete (state changes are bidirectional).
- **FR6:** User can visually distinguish complete todos from incomplete todos at a glance.
- **FR7:** User sees an empty-state indication when no todos exist.

**Persistence:**

- **FR8:** All todos and their completion state survive a browser page reload.
- **FR9:** All todos and their completion state survive closing and reopening the browser tab on the same device and browser.

### NonFunctional Requirements

**Performance:**

- **NFR1:** All user actions (add, toggle, render) feel instantaneous on a modern laptop — within 100ms perceived latency.
- **NFR2:** The app loads and renders the initial empty or populated state within 1 second of opening the page on a modern laptop.

**Reliability:**

- **NFR3:** The four golden-path flows (add, complete, uncomplete, refresh-and-still-there) work without error in the latest stable Chrome, Firefox, and Safari on macOS.
- **NFR4:** A corrupted or unreadable persistence record does not crash the app — the worst-case outcome is the app starting with an empty list rather than throwing an unhandled error.

**Maintainability:**

- **NFR5:** The implementation is small enough and structured clearly enough that any feature can be traced from its rendered behavior back to the story that produced it, the FR(s) that justified that story, and the section of this PRD that drove those FRs.

### Additional Requirements

Extracted from the Architecture document — these are technical / implementation requirements that shape stories:

- **Starter Template:** Use `pnpm create next-app@latest aine` to bootstrap the project. Accept defaults for TypeScript, ESLint, Tailwind CSS, App Router, Turbopack, and `@/*` import alias. **Opt out of `src/` directory** so paths match the architecture document.
- **No backend services in PoC** — no API routes (`app/api/`), no server actions, no data fetching infrastructure.
- **Persistence boundary discipline** — `localStorage` is touched only inside `app/lib/storage.ts`. No component or other module imports `localStorage` directly.
- **Storage key:** `aine.todos.v1` (versioned for future migration).
- **On-disk shape:** `{ version: 1, todos: Todo[] }` where `Todo = { id: string; text: string; completed: boolean }`.
- **ID generation:** `crypto.randomUUID()` (browser-native, no library).
- **Defensive read (NFR4):** wrap `JSON.parse` and validation in `try/catch`; `loadTodos()` returns empty array on any failure with a `console.warn`. `saveTodos()` is fire-and-forget; failures are logged, never surfaced to the UI.
- **State management:** React's built-in `useState` + `useEffect`. No Redux/Zustand/Jotai. Functional setter form for state updates that depend on previous state.
- **Component architecture:** `app/page.tsx` is the only client component holding state; `AddTodoForm`, `TodoList`, `TodoItem` are stateless presentation components receiving props and emitting callbacks.
- **SSR/hydration rule:** `useState<Todo[]>([])` for initial value; `useEffect(() => setTodos(loadTodos()), [])` to populate after mount. Do NOT call `loadTodos()` in `useState` initializer (runs on server) or read `localStorage` during initial render.
- **Validation boundary:** trim and reject empty input in `AddTodoForm` submit handler. Downstream code assumes valid non-empty trimmed text.
- **No tests in PoC** — manual cross-browser smoke test instead. Testing framework decision deferred.
- **No deployment in PoC** — Vercel-ready by default; deployment exercise is post-PoC.
- **No analytics, telemetry, error reporting, or third-party services.**

### UX Design Requirements

Not applicable — no separate UX Design document exists for this PoC. UI scope is defined within the PRD and Architecture. UX-relevant items (component decomposition, empty-state behavior, visual distinction of complete vs incomplete) are covered by FRs and the architecture's component breakdown.

### FR Coverage Map

_To be populated in the next step (epic design)._

## Epic List

_To be populated in the next step (epic design)._
