---
stepsCompleted:
  - step-01-validate-prerequisites
  - step-02-design-epics
  - step-03-create-stories
  - step-04-final-validation
status: 'complete'
completedAt: '2026-04-26'
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

| FR | Epic | What it contributes |
|---|---|---|
| FR1 | Epic 1 | User can add a todo |
| FR2 | Epic 1 | Empty/whitespace input is silently rejected |
| FR3 | Epic 1 | Todos render in insertion order |
| FR4 | Epic 1 | User can mark a todo complete |
| FR5 | Epic 1 | User can mark a complete todo incomplete |
| FR6 | Epic 1 | Visual distinction between complete and incomplete |
| FR7 | Epic 1 | Empty-state shown when no todos exist |
| FR8 | Epic 1 | Todos persist across page reload |
| FR9 | Epic 1 | Todos persist across browser tab restart |

**100% FR coverage.** No FR is unmapped.

## Epic List

### Epic 1: Manage a Persistent Todo List

The user can capture, view, mark-complete, and re-open todo items in a single-screen browser app. All todos and their completion state survive page reloads and browser-tab restarts on the same device.

**FRs covered:** FR1, FR2, FR3, FR4, FR5, FR6, FR7, FR8, FR9

### Future Epics (out of PoC, listed for traceability to the PRD's Phase 2/3 plan)

These are explicitly out of scope for this BMAD iteration — they will each be their own epic in future BMAD runs:

- **Epic 2 (Phase 2):** Edit and delete todos
- **Epic 3 (Phase 2):** Due dates on todos
- **Epic 4 (Phase 2):** Categories or tags
- **Epic 5 (Phase 3):** User accounts and authentication
- **Epic 6 (Phase 3):** Cross-device sync (introduces backend)

### Epic 2: Activity Rubric Closure (added 2026-04-26)

Bring the project into line with the originating learning-activity rubric: automated test coverage, Docker deployment, QA audits, and an AI integration log. The original frontend-only architecture is retained; only what the rubric demands is added.

**Stories:**

- **Story 2.1** — Test infrastructure + unit/component/E2E tests + ≥70% coverage
- **Story 2.2** — Dockerfile + docker-compose + `/api/health` route + dev/test profiles
- **Story 2.3** — QA reports (coverage, accessibility via axe-in-Playwright, security review)
- **Story 2.4** — AI integration log + README updates

## Epic 1: Manage a Persistent Todo List

The user can capture, view, mark-complete, and re-open todo items in a single-screen browser app. All todos and their completion state survive page reloads and browser-tab restarts on the same device.

### Story 1.1: Initialize the Next.js project

As a developer,
I want to bootstrap the Aine project using `create-next-app`,
So that I have a runnable Next.js + TypeScript foundation that matches the architecture document and is ready for feature work.

**Acceptance Criteria:**

**Given** an empty working directory and `pnpm` installed globally
**When** the developer runs `pnpm create next-app@latest aine` and answers the prompts
**Then** TypeScript ✓, ESLint ✓, Tailwind CSS ✓, App Router ✓, Turbopack ✓, `@/*` import alias ✓ are all enabled
**And** the `Would you like your code inside a 'src/' directory?` prompt is answered **No**
**And** the resulting project structure has `app/page.tsx` and `app/layout.tsx` at the repository root (no `src/` directory)

**Given** the project has been generated
**When** the developer runs `pnpm install` followed by `pnpm dev`
**Then** the dev server starts on `http://localhost:3000` without errors
**And** opening that URL in a modern browser displays the default Next.js starter page
**And** the browser console shows no errors

**Given** the generated project
**When** inspecting the file tree
**Then** `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `eslint.config.mjs`, and `AGENTS.md` exist at the repo root
**And** TypeScript strict mode is enabled in `tsconfig.json`

### Story 1.2: Create the types and storage modules

As a developer,
I want a typed `Todo` model and an isolated storage module,
So that all subsequent stories can read and write todos through a single, defensive boundary as the architecture mandates.

**Acceptance Criteria:**

**Given** the project initialized in Story 1.1
**When** `app/lib/types.ts` is created
**Then** it exports a `Todo` type defined as `{ id: string; text: string; completed: boolean }`
**And** it exports a `StoredState` type defined as `{ version: 1; todos: Todo[] }`

**Given** the types module from above
**When** `app/lib/storage.ts` is created
**Then** it imports the `Todo` and `StoredState` types from `./types`
**And** it defines a private constant `STORAGE_KEY = 'aine.todos.v1'` (not exported)
**And** it exports `loadTodos(): Todo[]`
**And** it exports `saveTodos(todos: Todo[]): void`

**Given** `loadTodos()` is called
**When** `localStorage` has no entry for `STORAGE_KEY`
**Then** the function returns an empty array
**And** does not throw

**Given** `loadTodos()` is called
**When** the stored value is malformed JSON, has the wrong shape, or has an unrecognized `version`
**Then** the function logs a `console.warn` describing the situation
**And** returns an empty array
**And** does not throw

**Given** `loadTodos()` is called
**When** the stored value is valid `StoredState` with `version: 1`
**Then** the function returns the persisted `todos` array exactly as stored

**Given** `saveTodos(todos)` is called
**When** `localStorage` is available
**Then** the function writes `JSON.stringify({ version: 1, todos })` to `STORAGE_KEY`

**Given** `saveTodos(todos)` is called
**When** `localStorage` throws (e.g., quota exceeded, disabled storage)
**Then** the function logs a `console.warn`
**And** does not throw

**Given** the codebase after this story
**When** searching the entire codebase for `localStorage`
**Then** the only matches are inside `app/lib/storage.ts`

### Story 1.3: Build the empty-state page shell

As a user,
I want to open the app and see a clear "no todos yet" state with a place to add my first one,
So that I understand what the app does before I've created anything.

**Acceptance Criteria:**

**Given** the storage module from Story 1.2
**When** `app/page.tsx` is implemented
**Then** the file begins with the `'use client'` directive
**And** it uses `useState<Todo[]>([])` for initial state
**And** it uses a `useEffect(() => setTodos(loadTodos()), [])` to load todos on mount
**And** it does NOT call `loadTodos()` inside `useState`'s initializer
**And** it does NOT read `localStorage` during initial render

**Given** an empty `localStorage` (no `aine.todos.v1` entry)
**When** the user opens the app at `http://localhost:3000`
**Then** an empty-state message is displayed (e.g., "No todos yet — add one above")
**And** the page renders without error in Chrome, Firefox, and Safari
(satisfies **FR7**)

**Given** the page chrome
**When** rendered
**Then** there is a visible heading or app title identifying this as Aine
**And** the layout uses Tailwind utility classes for styling
**And** the page is usable at viewport widths down to 1024px

**Given** the page on first paint (server render)
**When** a user views the source HTML
**Then** the empty-state is rendered (todos cannot have been loaded yet — they load on the client after hydration)
**And** the client hydrates without a hydration mismatch warning in the console

### Story 1.4: Add a todo via the form, with persistence

As a user,
I want to type a todo into a form and click Add (or press Enter) to save it,
So that I can capture something I need to do and have it persist across reloads.

**Acceptance Criteria:**

**Given** the page shell from Story 1.3
**When** `app/components/AddTodoForm.tsx` is created
**Then** it is a stateless component (no state holding application data)
**And** it accepts an `onAdd: (text: string) => void` prop
**And** it renders a single text input and a submit button
**And** form submission (button click or Enter key) is handled

**Given** the form is rendered and the input contains non-empty text
**When** the user submits
**Then** the input is trimmed
**And** `onAdd(trimmedText)` is called
**And** the input is cleared
(satisfies **FR1**)

**Given** the form is rendered and the input is empty or contains only whitespace
**When** the user submits
**Then** `onAdd` is NOT called
**And** no error or message is displayed
**And** no todo appears in the list
(satisfies **FR2**)

**Given** `app/page.tsx` from Story 1.3
**When** updated for this story
**Then** the page renders `<AddTodoForm onAdd={handleAdd} />` above the list area
**And** `handleAdd(text)` uses the functional setter form: `setTodos(prev => [...prev, { id: crypto.randomUUID(), text, completed: false }])`
**And** a second `useEffect` watches the todos array and calls `saveTodos(todos)` on every change
**And** the persistence effect does not run on the initial render before the load effect has populated state (or, equivalently, the initial save with an empty array is harmless)

**Given** the user has added one or more todos
**When** the user reloads the browser tab
**Then** the previously added todos appear in the same order
**And** none are lost
(satisfies **FR8**)

**Given** the user has added one or more todos
**When** the user closes the tab and re-opens the app on the same device and browser
**Then** the previously added todos appear in the same order
(satisfies **FR9**)

### Story 1.5: Render the list of todos

As a user,
I want to see all my todos rendered in the order I added them,
So that I have a clear view of what's on my list.

**Acceptance Criteria:**

**Given** state contains at least one todo
**When** `app/components/TodoList.tsx` is created
**Then** it is a stateless component
**And** it accepts `todos: Todo[]` and `onToggle: (id: string) => void` props
**And** when `todos.length === 0`, it renders the empty-state message (delegated from page or implemented here — pick one and document)
**And** when `todos.length > 0`, it renders one `<TodoItem />` per todo, in array order

**Given** the list of todos
**When** `app/components/TodoItem.tsx` is created
**Then** it is a stateless component
**And** it accepts `todo: Todo` and `onToggle: (id: string) => void` props
**And** it renders the todo's text alongside an interactive checkbox
**And** the checkbox's checked state matches `todo.completed`

**Given** the page from Story 1.4
**When** updated for this story
**Then** the page renders `<TodoList todos={todos} onToggle={handleToggle} />` below the form
**And** the empty-state from Story 1.3 still appears when `todos.length === 0`
(satisfies **FR3**, **FR7**)

**Given** the user adds three todos in sequence ("Buy milk", "Walk dog", "Read BMAD docs")
**When** the page renders
**Then** the three todos appear in that exact order

### Story 1.6: Toggle todo completion bidirectionally with visual feedback

As a user,
I want to click the checkbox next to a todo to mark it complete (and click again to mark it incomplete),
So that I can track what I've finished and recover from accidental clicks.

**Acceptance Criteria:**

**Given** the page from Story 1.5
**When** updated to handle toggle
**Then** `handleToggle(id: string)` uses the functional setter: `setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t))`
**And** the persistence effect from Story 1.4 picks up the change and writes it via `saveTodos`

**Given** an incomplete todo is rendered
**When** the user clicks its checkbox
**Then** the todo's `completed` flag flips to `true`
**And** the todo is visually distinguished as complete (e.g., strikethrough, muted color, checked checkbox)
(satisfies **FR4**, **FR6**)

**Given** a complete todo is rendered
**When** the user clicks its checkbox
**Then** the todo's `completed` flag flips to `false`
**And** the todo's visual styling reverts to the incomplete style
(satisfies **FR5**)

**Given** the user toggles a todo's state
**When** the user reloads the browser tab
**Then** the todo's most-recent state (complete or incomplete) is preserved
(satisfies **FR8**, in combination with the toggle direction)

**Given** the visual styling for complete vs. incomplete
**When** rendered side-by-side
**Then** a viewer can identify completion state at a glance without reading the text
(satisfies **FR6**)

### Story 1.7: Cross-browser manual smoke test

As a developer,
I want to manually verify the four golden-path flows in all three target browsers,
So that I can confirm NFR3 is met before declaring the PoC complete.

**Acceptance Criteria:**

**Given** the app from Stories 1.1 – 1.6 running locally
**When** opened in the latest stable Chrome on macOS
**Then** the developer can: (1) add three todos, (2) mark one complete, (3) mark that same todo incomplete, (4) reload the page and see all three todos with their final completion state preserved
**And** the browser console shows no errors during these flows

**Given** the app running locally
**When** the same flow is performed in the latest stable Firefox on macOS
**Then** all four steps succeed with no console errors

**Given** the app running locally
**When** the same flow is performed in the latest stable Safari on macOS
**Then** all four steps succeed with no console errors

**Given** the smoke test results
**When** any browser fails any step
**Then** a defect is recorded and the failure is fixed before this story is closed

(satisfies **NFR3**, and end-to-end validates **FR1**, **FR3**, **FR4**, **FR5**, **FR6**, **FR8**)
