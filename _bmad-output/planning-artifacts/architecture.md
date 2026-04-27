---
stepsCompleted:
  - step-01-init
  - step-02-context
  - step-03-starter
  - step-04-decisions
  - step-05-patterns
  - step-06-structure
  - step-07-validation
  - step-08-complete
status: 'complete'
completedAt: '2026-04-26'
lastStep: 8
inputDocuments:
  - _bmad-output/planning-artifacts/product-brief.md
  - _bmad-output/planning-artifacts/prd.md
documentCounts:
  prdCount: 1
  uxCount: 0
  researchCount: 0
  projectDocsCount: 0
  briefCount: 1
workflowType: 'architecture'
project_name: 'aine_v6'
user_name: 'Marclevy'
date: '2026-04-26'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**

The PRD specifies **9 functional requirements organized into 2 capability areas** — Todo Management (FR1 – FR7) and Persistence (FR8 – FR9). Architecturally this means we need exactly two concerns to build for: (1) an in-memory model of todos that supports add and bidirectional toggle operations, and (2) a persistence boundary that round-trips that model to and from browser-local storage. There are no other capabilities. There is no auth, no API, no integrations, no multi-resource model, and no relationships between entities — every todo is an independent record with two fields (text, completion-state) and an implicit ordering.

**Non-Functional Requirements:**

The 5 NFRs that *will* drive architectural decisions:

- **NFR1 / NFR2 (Performance):** Trivial — there is no network, no remote data, and the dataset is bounded by what one user types. Any reasonable architecture meets these targets by default.
- **NFR3 (Reliability):** Cross-browser compatibility (latest Chrome, Firefox, Safari on macOS) — this constrains framework and storage-API choices to widely-supported standards, not bleeding-edge experimental features.
- **NFR4 (Reliability):** A corrupted persistence record must not crash the app — this is the **only NFR that has real architectural weight**. It mandates defensive read-from-storage logic with a clear fallback path (start with empty list).
- **NFR5 (Maintainability):** Traceability from rendered behavior back to story → FR → PRD section — this constrains code organization (small modules with clear naming) more than it constrains technology.

The PRD also explicitly **excludes** security, scalability, formal accessibility, integration, i18n, and compliance from architectural consideration. Those are real reductions in design surface, not omissions.

**Scale & Complexity:**

- **Project scale:** Trivial. ~9 functional requirements, single user role, single screen, single device, no backend. This is genuinely the smallest viable web app.
- **Complexity level:** **Low.** No real architectural risk from the requirements themselves. The only risk (called out in the PRD's risk section) is over-engineering the architecture in response to imagined future needs.
- **Primary technical domain:** Frontend web only — single-page browser app delivered as static assets.
- **Estimated architectural components:** 3 logical concerns (state model, persistence layer, view/render layer). Whether they are 3 modules, 3 functions, or 3 React hooks is a later decision.

### Technical Constraints & Dependencies

- **Browser matrix constraint:** Latest stable Chrome / Firefox / Safari on macOS. Anything we use must be supported in all three without polyfills.
- **No-backend constraint:** No HTTP, no fetch, no auth, no remote APIs. The app is a closed system.
- **Local-runnable constraint:** Must boot with a single command and view in a browser — meaning the build system, if any, must be one a beginner can operate without ceremony.
- **Persistence constraint:** Must use a browser-native storage API (`localStorage`, `IndexedDB`, or similar). The PRD deliberately leaves the specific choice to this stage.
- **No external services constraint:** No analytics, no telemetry, no error reporting, no CDN dependencies at runtime.
- **Anti-bloat constraint (from PRD risk section):** Framework and tooling choices must be justified on simplicity grounds, not on hypothetical future-feature support.

### Cross-Cutting Concerns Identified

1. **State management** — a single source of truth for the todo list that the view renders from and the persistence layer mirrors. Even at this small scale, this concern is non-trivial because every FR (add, toggle, render, validate) touches it.
2. **Persistence boundary** — read on app start (with defensive fallback per NFR4), write on every state change. This is the only real I/O in the whole app.
3. **Input validation (FR2)** — silent rejection of empty/whitespace-only input is a recurring pattern at the input/state boundary, not a one-off.
4. **Rendering** — keeping the DOM in sync with the state model. Implementation depends entirely on framework choice (next step).

## Starter Template Evaluation

### Primary Technology Domain

Frontend single-page web application, with no backend services in the PoC. The user has stated a preference for **Next.js + TypeScript** with **Vercel deployability** as a forward-compatibility constraint, even though the PoC itself targets local-only execution.

### Starter Options Considered

Three options were on the table for a React-based single-screen app:

1. **Vite + React + TypeScript** — minimal, fast, zero ceremony, but no Vercel-native deployment story.
2. **Next.js (`create-next-app`)** — Vercel-native, App Router, opinionated, ships with a sensible default toolchain. **Selected.**
3. **Plain HTML + vanilla JS** — was the simplest possible option, but explicitly ruled out by the user's preference for React + Next.js.

### Selected Starter: `create-next-app@latest`

**Rationale for Selection:**

- **Vercel-native deployment path** is built in — Next.js is Vercel's reference framework, and a Vercel deployment is a single CLI command (or a GitHub connect) without additional configuration. Satisfies the user's forward-compatibility constraint without adding any work in the PoC.
- **TypeScript-first** by default — no opt-in needed.
- **Modern defaults** (App Router, Turbopack, ESLint, Tailwind) — all current best practice as of April 2026, no manual configuration to debate.
- **AGENTS.md included** — Next.js now ships an agent-guidance file, which is a small but real win for AI-assisted implementation in the BMAD dev workflow.
- **Acknowledged trade-off:** Next.js is heavier than the PoC strictly needs. The PoC has no SSR, no routing, no API routes, and no backend. Most of Next.js's surface area will be unused. This was accepted because (a) the user explicitly chose it, (b) the unused surface area is invisible at this scope, and (c) it preserves a clean growth path for Phase 2/3 features (auth, sync, due dates) without re-platforming.

**Initialization Command:**

```bash
pnpm create next-app@latest aine
```

When prompted, accept the defaults: TypeScript ✓, ESLint ✓, Tailwind CSS ✓, App Router ✓, Turbopack ✓, import alias `@/*` ✓.

### Architectural Decisions Provided by Starter

**Language & Runtime:**
- TypeScript (strict mode by default in modern `create-next-app`)
- Node.js runtime (whatever `create-next-app@latest` requires; verify at install time)
- React 19+ (current with Next.js 16.2)

**Styling Solution:**
- Tailwind CSS (default in modern `create-next-app`). Acceptable for the PoC; utility classes are small and traceable. Plain CSS modules remain available if needed.

**Build Tooling:**
- Turbopack (default dev bundler in Next.js 16.x — replaces Webpack for `next dev`)
- Standard Next.js production build (`next build`)

**Testing Framework:**
- **Not included by default.** Explicit decision deferred to a later step. For PoC scope, manual browser testing of the four golden-path flows (per NFR3) is sufficient. If we later add tests, candidates are Vitest (unit) and Playwright (e2e).

**Code Organization:**
- App Router structure (`app/` directory).
- For our PoC, the entire app lives at `app/page.tsx` plus a small set of component and library files. We'll codify the exact module split in the next architectural decision step.

**Development Experience:**
- `pnpm dev` runs the local dev server with hot reload.
- ESLint configured out of the box.
- VS Code / Cursor-friendly TypeScript and import aliases.
- AGENTS.md is included in the project root for AI-assisted development.

**Note:** Project initialization using this command should be the **first implementation story** in the epics/stories phase.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (block implementation):**
- Persistence mechanism (localStorage vs IndexedDB)
- On-disk data shape and storage key
- Todo ID generation strategy
- State management approach
- Defensive read-from-storage strategy (per NFR4)

**Important Decisions (shape architecture):**
- Component structure (single component vs decomposed)
- Server vs client component boundary
- Persistence sync timing

**Deferred Decisions (post-MVP):**
- Testing framework (deferred per Starter Template Evaluation)
- Deployment configuration (Vercel-ready by default; no PoC deployment)
- Routing strategy (no routing needed in PoC; reconsider for Phase 2/3)

### Data Architecture

- **Persistence mechanism:** `localStorage`. Synchronous API (matches React state-flush model with no async ceremony), 5MB+ capacity (orders of magnitude more than this app will ever need), supported in all target browsers without polyfill. **IndexedDB rejected** — async, structured-clone overhead, and migration ceremony are all wasted complexity at this scope.
- **Storage key:** `aine.todos.v1`. The `v1` suffix is deliberate — if the data shape ever evolves (Phase 2 features), we can introduce `v2` and a migration path without losing v1 data. Costs nothing now.
- **On-disk data shape:**
  ```ts
  type StoredTodo = { id: string; text: string; completed: boolean };
  type StoredState = { version: 1; todos: StoredTodo[] };
  ```
  The wrapper object with explicit `version` is the contract for the migration story above. Order in the array = display order.
- **ID generation:** `crypto.randomUUID()`. Browser-native, supported in all three target browsers, no dependency required. Deterministic, collision-free, no library needed.
- **Validation:** trim whitespace; reject empty string after trimming (FR2). Single guard at the add boundary.
- **Defensive read (NFR4):** wrap `JSON.parse` in try/catch. On any failure (`null`, malformed JSON, wrong shape, unknown version), log a console warning and start with an empty list. Never throw to the user.

### Authentication & Security

**Not applicable.** No users, no accounts, no sessions, no PII, no network. Explicitly excluded by the PRD. No decision required.

### API & Communication Patterns

**Not applicable.** No backend, no API routes, no inter-service communication, no third-party APIs. Explicitly excluded by the PRD. No decision required.

### Frontend Architecture

- **State management:** React's built-in `useState` + `useEffect`. No external library (Redux, Zustand, Jotai, etc.) — they would be net-negative cognitive load at this scope. The state model is a single `Todo[]`; one `useState` hook owns it.
- **Persistence sync timing:** read once on mount via `useEffect` (with the defensive parse above); write on every state change via a second `useEffect` watching the todos array. No debouncing — writes are synchronous and trivial; debouncing is a future-feature concern.
- **Server vs client component boundary:** the entire interactive surface is a single client component (`'use client'` directive at the top of `app/page.tsx`). There is no server data, no RSC payload, and no server-side concern. Next.js's RSC architecture is intentionally **not used** in the PoC.
- **Component structure:** decomposed for maintainability (NFR5 traceability), not for performance:
  - `app/page.tsx` — thin client-component shell that owns state and renders the children
  - `app/components/AddTodoForm.tsx` — input + submit handler, calls back to parent
  - `app/components/TodoList.tsx` — renders the list or the empty state
  - `app/components/TodoItem.tsx` — single todo row with checkbox and label
  - `app/lib/storage.ts` — `loadTodos()` and `saveTodos(todos)` — the only module that touches `localStorage`
  - `app/lib/types.ts` — shared `Todo` and `StoredState` types
- **Routing:** no routing in the PoC. Single page at `/`. Next.js App Router is present but only one route exists.
- **Styling:** Tailwind utility classes inline in the components. Plain CSS modules available if a component grows enough to warrant extraction.

### Infrastructure & Deployment

- **PoC environment:** local dev only (`pnpm dev`). No deployment in the PoC — explicitly excluded from PRD success criteria.
- **Vercel-ready posture:** zero additional configuration. `create-next-app` produces a Vercel-deployable repo by default. When the user is ready (post-PoC), `vercel deploy` or a GitHub-Vercel connect is sufficient.
- **No CI/CD in PoC.** No GitHub Actions, no environment configs, no secrets management. All deferred until something needs them.
- **Monitoring/logging:** none. Browser DevTools console is the only observability surface, and that's appropriate for a single-user local app.

### Decision Impact Analysis

**Implementation Sequence (informs Story ordering):**

1. **Project initialization** — run `create-next-app`, accept defaults, verify `pnpm dev` works. (First story.)
2. **Define types and storage module** — `lib/types.ts`, `lib/storage.ts` with `loadTodos`/`saveTodos` and the defensive parse.
3. **Build the empty-state shell** — `app/page.tsx` as a client component, render the page chrome + empty state, wire `useState` and the load-on-mount effect.
4. **Build the add-todo flow** — `AddTodoForm` component, validation, append to state, write-on-change effect.
5. **Build the list and item rendering** — `TodoList` and `TodoItem`, render the data.
6. **Build toggle behavior** — clicking the checkbox flips `completed`, state updates, persistence follows.
7. **Manual cross-browser smoke test** — exercise all four golden-path flows in Chrome, Firefox, Safari (NFR3).

**Cross-Component Dependencies:**

- `lib/storage.ts` is the only module aware of `localStorage`. Every other module sees only typed `Todo[]` data. This isolation means swapping storage in Phase 3 (e.g., to a backend service for sync) only changes one file.
- `lib/types.ts` is the shared contract — components import `Todo` from there, and `storage.ts` produces/consumes the same type.
- All UI components are stateless (props in, callbacks out). State lives only in `app/page.tsx`. This makes every component independently testable later if we add tests.

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical Conflict Points Identified:** 5 areas where AI agents could otherwise diverge — code naming, file naming, state-update patterns, persistence-boundary discipline, and error/validation handling.

**Categories Not Applicable to PoC:** database naming, API naming, event-system patterns, loading-state patterns, date/time formats. All explicitly out of scope.

### Naming Patterns

**Code Naming (TypeScript / React conventions):**
- **Variables, functions, hooks:** `camelCase` — e.g., `addTodo`, `loadTodos`, `useTodos`.
- **React components:** `PascalCase` — e.g., `AddTodoForm`, `TodoList`, `TodoItem`.
- **Types and interfaces:** `PascalCase` — e.g., `Todo`, `StoredState`. Prefer `type` over `interface` unless extending is required.
- **Constants:** `UPPER_SNAKE_CASE` only for true module-level constants — e.g., `STORAGE_KEY`. Local `const` bindings stay `camelCase`.
- **Boolean variables and props:** prefix with `is`, `has`, or `should` — e.g., `isCompleted`, `hasTodos`. Avoid bare `done` or `completed` for booleans (the model field `completed` is the one exception, since it matches the persisted shape).
- **Event handlers:** prefix with `handle` for the function definition, `on` for the prop — e.g., `<button onClick={handleClick}>`, `<TodoItem onToggle={handleToggle} />`.

**File Naming:**
- **Component files:** `PascalCase.tsx` — e.g., `AddTodoForm.tsx`. One component per file; the file name matches the default export name.
- **Library / utility files:** `camelCase.ts` — e.g., `storage.ts`, `types.ts`. Multiple named exports allowed.
- **Next.js route files:** as Next.js requires — `page.tsx`, `layout.tsx`, `loading.tsx`. Do not rename.
- **No index files** for re-exports unless there's a clear ergonomic win. Direct imports preferred for traceability (NFR5).

### Structure Patterns

**Project Organization (binding):**
```
app/
  page.tsx                    # only client component with state
  layout.tsx                  # generated by create-next-app, minimal edits
  components/
    AddTodoForm.tsx
    TodoList.tsx
    TodoItem.tsx
  lib/
    storage.ts                # the only module that imports localStorage
    types.ts                  # shared Todo and StoredState types
```

- Components live in `app/components/`. Only the page itself sits at `app/page.tsx`.
- Pure logic (storage, types, helpers) lives in `app/lib/`. Never in `components/`.
- No tests in PoC (deferred). When added later, co-locate as `Foo.test.tsx` next to `Foo.tsx`.

### Format Patterns

**Data Format Conventions:**
- **In-memory and on-disk JSON field names:** `camelCase` — matches TypeScript convention. Same shape in memory and on disk; no field-name translation layer.
- **Boolean representations:** real `true` / `false`, never `1` / `0` or strings.
- **Null handling:** prefer absence over `null`. Optional fields use `?:` in types. Don't use `null` as a sentinel.

**Persistence Format:**
- The on-disk shape is the `StoredState` type defined in Step 4. Any change to that shape requires bumping `version` and adding a migration path in `storage.ts`. The `version` field is **load-bearing**, not decoration.

### Communication Patterns (intra-component)

**State Update Patterns (binding for React):**
- **Immutable updates only.** Never mutate state directly. Use spread (`...todos`) and array methods that return new arrays (`map`, `filter`, `concat`). Never `push`, `splice`, or property assignment on state objects.
- **State setters take a function when the new state depends on the previous state** — e.g., `setTodos(prev => [...prev, newTodo])`, not `setTodos([...todos, newTodo])`. This avoids stale closures.
- **One source of truth.** State lives in `app/page.tsx`. Components never hold their own copies of todos. Components receive `todos` and callbacks as props.

**Component Contracts:**
- All components below `page.tsx` are **stateless** (no `useState` for app data). They render from props and call back via prop callbacks.
- Callbacks are named `on...` from the parent's perspective: `onAdd`, `onToggle`. The parent's handler is `handle...`: `handleAdd`, `handleToggle`.

### Process Patterns

**Error Handling:**
- **No errors are shown to the user in the PoC.** Validation failures (FR2) are silent no-ops. Storage failures (NFR4) are logged to the console and degrade gracefully (start with empty list).
- **`try/catch` is only used at the storage boundary** (`storage.ts`) and around `JSON.parse`. Do not wrap React render code in try/catch.
- **No error boundary component in the PoC.** A corrupted state would already have been caught at the storage boundary and recovered to empty.
- **Console messages:** use `console.warn` for recoverable degradations (corrupted storage), `console.error` only for genuinely unexpected failures. No `console.log` in committed code.

**Validation:**
- Input validation happens at the **add-todo boundary**, in `AddTodoForm`'s submit handler. Trim the string, check for non-empty, and only then call `onAdd`.
- The state model can assume all todos have non-empty trimmed text. No defensive checks downstream of the input boundary.

**Persistence Discipline:**
- **`localStorage` is touched only inside `app/lib/storage.ts`.** No component imports `localStorage` directly.
- The `STORAGE_KEY` constant lives in `storage.ts` and is not exported.
- `loadTodos()` always returns a `Todo[]` (possibly empty). Never throws.
- `saveTodos(todos)` is fire-and-forget. If it fails, log a warning; do not surface to the UI.

### Enforcement Guidelines

**All AI agents implementing stories MUST:**

1. Follow the file/folder structure exactly as specified above. New files require justification in the story description.
2. Treat `app/lib/storage.ts` as the only module aware of `localStorage` — any new persistence code goes there.
3. Use immutable state updates with the functional setter form (`setTodos(prev => ...)`).
4. Trim and validate input at the `AddTodoForm` boundary. Downstream code can assume valid input.
5. Never display errors to the user in the PoC. Use `console.warn` / `console.error` for diagnostics only.

**Pattern Enforcement:**
- Patterns are enforced by code review against this section, not by tooling. ESLint defaults from `create-next-app` cover obvious mistakes (unused imports, hook-rule violations).
- If a pattern needs to change, update this section *before* writing the divergent code, not after.

### Pattern Examples

**Good Examples:**

```tsx
// State update with functional setter (handles stale closures)
const handleToggle = (id: string) => {
  setTodos(prev => prev.map(t =>
    t.id === id ? { ...t, completed: !t.completed } : t
  ));
};

// Validation at the boundary
const handleSubmit = (e: FormEvent) => {
  e.preventDefault();
  const trimmed = text.trim();
  if (!trimmed) return; // FR2: silent rejection
  onAdd(trimmed);
  setText('');
};

// Storage boundary with defensive read
export function loadTodos(): Todo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredState;
    if (parsed.version !== 1 || !Array.isArray(parsed.todos)) {
      console.warn('[aine] storage shape unrecognized, starting fresh');
      return [];
    }
    return parsed.todos;
  } catch (err) {
    console.warn('[aine] storage parse failed, starting fresh', err);
    return [];
  }
}
```

**Anti-Patterns (do not do these):**

```tsx
// Direct mutation of state — forbidden
todos.push(newTodo);
setTodos(todos);

// Stale-closure setter — use the functional form instead
setTodos([...todos, newTodo]);

// Validation duplicated downstream — already validated at boundary
const handleAdd = (text: string) => {
  if (!text.trim()) return; // remove this
  setTodos(prev => [...prev, { id: ..., text, completed: false }]);
};

// Component touching localStorage directly — must go through storage.ts
function TodoItem({ todo }: Props) {
  localStorage.setItem(...);
}

// Surfacing storage errors to user — PoC uses silent + console.warn
try { saveTodos(todos); }
catch { setError('Failed to save'); }
```

## Project Structure & Boundaries

### Init-Time Decision Pinned

**Bootstrap command:** `pnpm create next-app@latest aine`. Answer the `Would you like your code inside a 'src/' directory?` prompt with **No**. All other prompts: accept defaults (TypeScript, ESLint, Tailwind, App Router, Turbopack, `@/*` alias).

**Post-creation restructure (decision made after Story 1.1):** the user opted to flatten the structure — `create-next-app` produces a subfolder (`aine/`), and we then move every file from that subfolder up to the repository root. The result is that the Next.js app lives at the repository root alongside `_bmad/`, `_bmad-output/`, `.claude/`, etc. The `aine/` subfolder no longer exists after the move.

Why: the user prefers a flat structure for this PoC. The trade-off is that BMAD planning artifacts and Next.js app code share the same root; this is acceptable because the BMAD artifacts live under `_bmad-output/` and `_bmad/` (clearly namespaced), while Next.js owns the conventional roots (`app/`, `public/`, `package.json`, etc.).

### Complete Project Directory Structure

```
<repo root>/
├── README.md                   # BMAD process documentation (NOT the Next.js starter README)
├── package.json
├── pnpm-lock.yaml
├── next.config.ts              # generated, no edits in PoC
├── tsconfig.json               # generated, strict mode confirmed
├── postcss.config.mjs          # generated
├── eslint.config.mjs           # generated, no rule overrides in PoC
├── next-env.d.ts               # generated; do not edit (Next.js manages this)
├── AGENTS.md                   # generated by create-next-app, guides AI agents
├── CLAUDE.md                   # also generated by create-next-app 16.2.x
├── .gitignore                  # Next.js standard (includes .DS_Store, node_modules, .next, etc.)
├── _bmad/                      # BMAD installer config + scripts
├── _bmad-output/               # BMAD planning + implementation artifacts
├── .claude/                    # Claude Code skills
├── docs/                       # currently empty; reserved for project-level docs
├── public/                     # generated; static assets — default favicon and SVGs
└── app/
    ├── layout.tsx              # generated; root layout, minimal edits
    ├── page.tsx                # the only client component holding state
    ├── globals.css             # generated; Tailwind v4 CSS-based config lives here
    ├── components/
    │   ├── AddTodoForm.tsx     # form + validation, calls onAdd
    │   ├── TodoList.tsx        # renders list or empty state
    │   └── TodoItem.tsx        # single row with checkbox + label
    └── lib/
        ├── storage.ts          # ONLY module that touches localStorage
        └── types.ts            # Todo and StoredState type definitions
```

**Note on `tailwind.config.ts`:** Tailwind v4 (shipped with Next.js 16.2.x) moved its configuration into CSS via `@import "tailwindcss"` and `@theme inline { ... }` directives in `app/globals.css`. There is no separate `tailwind.config.ts` file in modern starters; Tailwind is fully configured through CSS plus `postcss.config.mjs`.

**File count delta from starter:** 5 new application files (`AddTodoForm.tsx`, `TodoList.tsx`, `TodoItem.tsx`, `storage.ts`, `types.ts`) plus minimal edits to the generated `page.tsx`. Everything else is starter output, untouched.

### Architectural Boundaries

**No API boundaries** — no backend, no API routes. The `app/api/` directory is not created.

**Component Boundaries:**
- `app/page.tsx` is the **state-owner boundary**. Only this file holds React state for application data (the `Todo[]`).
- `app/components/*.tsx` are the **presentation boundary**. They receive props and emit callbacks; they never call `useState` for app data and never import from `app/lib/storage.ts`.
- `app/lib/storage.ts` is the **persistence boundary**. It is the only module in the entire codebase that imports `localStorage` (or any storage API). All other modules see only `Todo[]`.
- `app/lib/types.ts` is the **type contract**. Components and the storage module both import their `Todo` type from here. There is exactly one definition.

**Data Boundaries:**
- The `localStorage` key `aine.todos.v1` is the only persisted state in the entire app.
- The on-disk shape (`StoredState`) and in-memory shape (`Todo[]`) are deliberately the same — no translation layer.

### Requirements to Structure Mapping

| FR / NFR | Lives In | Notes |
|---|---|---|
| FR1 (add todo) | `AddTodoForm.tsx` (input + submit), `page.tsx` (state append) | Validation in form; state update in page |
| FR2 (reject empty) | `AddTodoForm.tsx` | Trim + non-empty guard at submit handler |
| FR3 (render list in order) | `TodoList.tsx` | Reads `todos` array in order |
| FR4 / FR5 (toggle complete bidirectionally) | `TodoItem.tsx` (checkbox), `page.tsx` (state map) | Stateless item; toggle handler in page |
| FR6 (visual distinction complete vs incomplete) | `TodoItem.tsx` | Tailwind classes conditional on `completed` |
| FR7 (empty-state) | `TodoList.tsx` | Renders empty-state message when `todos.length === 0` |
| FR8 / FR9 (persistence across reload / restart) | `storage.ts` + `page.tsx` | Read effect on mount, write effect on todos change |
| NFR1 / NFR2 (perf) | n/a — falls out of architecture by default | No active mitigation needed |
| NFR3 (cross-browser) | Manual smoke test (last story) | All chosen APIs are universally supported |
| NFR4 (corrupted-storage resilience) | `storage.ts` | Defensive `try/catch` + version check + console.warn fallback |
| NFR5 (traceability) | This table is the artifact | Every component file maps to one or more FRs |

### Integration Points

**Internal Communication (the only flavor in the PoC):**
- React props down (parent → child): `todos`, callback handlers
- React callbacks up (child → parent): `onAdd(text)`, `onToggle(id)`
- Effects in `page.tsx` synchronize React state with `lib/storage.ts` — this is the *only* I/O path in the entire app

**External Integrations:** none in the PoC. No HTTP, no third-party services, no analytics, no telemetry, no auth provider, no CDN at runtime.

**Data Flow:**

```
                                  ┌────────────────────┐
                                  │  app/page.tsx      │
                                  │  (state owner)     │
                                  └──────┬─────────────┘
                                         │
        ┌──── on mount ──────────────────┤
        │ loadTodos()                    │ todos, callbacks (props)
        ▼                                ▼
  ┌──────────────┐              ┌─────────────────────┐
  │ lib/         │              │ components/         │
  │  storage.ts  │              │  AddTodoForm        │
  │              │              │  TodoList           │
  │  localStorage│              │  TodoItem           │
  └──────▲───────┘              └─────────┬───────────┘
         │                                │
         │ saveTodos(todos)               │ onAdd / onToggle
         │ (effect on every change)       │
         └────── from page.tsx ◄──────────┘
```

### File Organization Patterns

**Configuration Files:** all live at the repo root, all generated by `create-next-app`, none edited in the PoC. Any future config changes (e.g., enabling a Tailwind plugin, adjusting tsconfig strictness) require an update to this section first.

**Source Organization:** Next.js App Router convention — all application code under `app/`. The two-level split inside `app/` (`components/` for UI, `lib/` for non-UI code) is a hard rule per the patterns section.

**Test Organization:** none in PoC (deferred). When added later: co-locate (`Foo.test.tsx` next to `Foo.tsx`) per the patterns section.

**Asset Organization:** `public/` for static assets if any are added. None expected in the PoC beyond the default favicon.

### Development Workflow Integration

**Development:**
- `pnpm install` once after init
- `pnpm dev` starts the Turbopack dev server on `http://localhost:3000`
- Hot reload updates the page on save
- Browser DevTools console is the only observability surface (per Decision Impact Analysis)

**Build:**
- `pnpm build` produces a production build using the standard Next.js build pipeline
- Not exercised in the PoC, but available for confidence-checking

**Deployment:**
- Not performed in the PoC
- Repo is Vercel-ready out of the box; `vercel deploy` or a GitHub-Vercel connect is the path when needed

## Architecture Validation Results

### Coherence Validation

**Decision Compatibility:**
- Next.js 16.2 + React 19 + TypeScript (strict) + Tailwind: standard, well-tested combination as of April 2026. No version conflicts.
- `localStorage` + React `useEffect`: compatible — `localStorage` is synchronous and effects run client-side after mount, which is exactly the right place to touch a client-only API.
- `'use client'` directive + `localStorage` access: necessary pairing. `localStorage` is not available during server render, and the architecture correctly confines all state and storage logic to a single client component.
- Tailwind utility-class styling + small component count: proportional. Not over-engineered.

**Pattern Consistency:**
- Naming patterns (PascalCase components, camelCase functions, UPPER_SNAKE constants) are standard React/TypeScript and match what `create-next-app` ESLint defaults enforce.
- State-update patterns (immutable, functional setter form) align with React 19 best practice and are enforceable by the React `react-hooks/exhaustive-deps` ESLint rule.
- Persistence-boundary discipline (`storage.ts` is the only consumer of `localStorage`) is a hard rule with one obvious enforcement: grep for `localStorage` should only match in `storage.ts`.

**Structure Alignment:**
- App Router structure (`app/` at root, opt-out of `src/`) is honored consistently throughout the document.
- Component / library split (`app/components/` vs `app/lib/`) is supported by the `@/*` import alias and matches Next.js conventions.
- Boundary separation (state owner = page, presentation = components, persistence = lib) is consistently described in steps 4, 5, and 6.

### Requirements Coverage Validation

**Functional Requirements Coverage (9 / 9):**

Every FR maps to a specific component and has architectural support — see the Requirements to Structure Mapping table in the Project Structure section. No FR is left unaddressed.

**Non-Functional Requirements Coverage (5 / 5):**

- **NFR1 / NFR2 (Performance):** Trivially satisfied by stack — no network, no large data, no async work in the hot path.
- **NFR3 (Cross-browser):** All chosen APIs (`localStorage`, `crypto.randomUUID`, React 19) are universally supported in target browsers. Final story is a manual smoke test in Chrome / Firefox / Safari.
- **NFR4 (Corrupted-storage resilience):** Defensive `try/catch` + version check + `console.warn` fallback in `storage.ts`, with example code provided.
- **NFR5 (Traceability):** The Requirements to Structure Mapping table is the artifact. Plus the small file count (5 application files) keeps the codebase scannable end-to-end.

### Implementation Readiness Validation

**Decision Completeness:**
- All critical decisions are documented with rationale.
- Technology versions are pinned to "current at install time" via `@latest`, with verified versions from web search (Next.js 16.2.2 as of April 1, 2026).
- Implementation patterns include enforceable rules and concrete code examples.

**Structure Completeness:**
- The complete project tree is laid out file-by-file. No directories or files are left as placeholders.
- All component boundaries are specified.

**Pattern Completeness:**
- Naming, structure, format, communication, and process patterns are all defined for the categories that apply.
- N/A categories (database, API, events, loading states) are explicitly called out as N/A so an agent doesn't fabricate them.

### Gap Analysis Results

**Critical Gaps:** none.

**Important Gaps:**

1. **SSR hydration assumption is implicit, not explicit.** Because the component reads `localStorage` in `useEffect` (client-only), the initial server-rendered HTML will show the empty state — and then immediately re-render to show the loaded todos once the effect runs. This is correct behavior but could surprise an agent unfamiliar with the pattern. **Resolved below in Validation Issues Addressed.**

**Minor Gaps:**

2. **Package manager is assumed to be `pnpm`** throughout (`pnpm create next-app`, `pnpm dev`, `pnpm build`). If the user prefers `npm` or `yarn`, the substitutions are direct (`npm create next-app@latest`, `npm run dev`, etc.). Flagged here so the init story can adapt if needed. Not blocking.

3. **Empty-state copy is not specified.** The architecture says "render an empty-state message" without dictating wording (e.g., "No todos yet — add one above"). This is intentional — copy is a story-level detail, not architecture.

### Validation Issues Addressed

**SSR / hydration note (resolves Important Gap #1):** Because `app/page.tsx` reads from `localStorage` only inside a `useEffect`, the server-rendered HTML will always show the empty state on first paint. Immediately after hydration, the load effect runs and the component re-renders with the persisted todos. This is the intended behavior. Agents implementing the page MUST NOT attempt to read `localStorage` during the initial render (it does not exist on the server) or rely on `useState`'s initializer to call `loadTodos()` (this also runs on the server). The correct pattern is `useState<Todo[]>([])` for the initial value, and a separate `useEffect(() => setTodos(loadTodos()), [])` to populate after mount.

### Architecture Completeness Checklist

**Requirements Analysis**
- [x] Project context analyzed
- [x] Scale and complexity assessed (low)
- [x] Technical constraints identified (browser matrix, no backend, simplicity mandate)
- [x] Cross-cutting concerns mapped (state, persistence, validation, rendering)

**Architectural Decisions**
- [x] Critical decisions documented
- [x] Technology stack specified (Next.js 16.2 + TS + Tailwind + Turbopack)
- [x] Integration patterns defined (props down / callbacks up; storage isolated)
- [x] Performance trivially addressed by stack

**Implementation Patterns**
- [x] Naming conventions established
- [x] Structure patterns defined
- [x] Communication patterns specified (intra-component only)
- [x] Process patterns documented (validation, error handling, persistence discipline)

**Project Structure**
- [x] Complete directory structure defined
- [x] Component boundaries established
- [x] Integration points mapped
- [x] Requirements-to-structure mapping complete

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** **High.** The scope is small, decisions are coherent, every requirement has a home, and the patterns prevent the small set of plausible AI-agent divergences (state mutation, persistence-boundary leakage, validation duplication).

**Key Strengths:**
- Genuine traceability from FR to file (NFR5 satisfied by construction).
- Persistence isolation makes Phase 3 backend introduction a single-file change.
- Versioned on-disk shape (`v1`) preserves a migration path without paying for it now.
- Anti-patterns explicitly documented prevent the most common React mistakes.

**Areas for Future Enhancement (post-PoC, not now):**
- Add a testing framework (Vitest + Playwright) when the first behavioral regression matters.
- Add an error boundary at the layout level when user-facing error reporting becomes a requirement (likely with Phase 3 sync).
- Add a route-level `loading.tsx` and a more explicit hydration strategy if Phase 2 features introduce server-side data.

### Implementation Handoff

**AI Agent Guidelines:**
- Follow all architectural decisions exactly. Deviations require updating this document first.
- Use the file structure as binding. New files require justification in the relevant story.
- Apply the patterns and anti-patterns from the Implementation Patterns section to all generated code.
- When in doubt, prefer the simpler implementation — the PRD's anti-bloat constraint outranks personal taste.

**First Implementation Priority:**

```bash
pnpm create next-app@latest aine
```

Answer prompts as documented in the Project Structure section (notably: opt **out** of `src/`). Then move every file from the generated `aine/` subfolder up to the repository root and remove the now-empty `aine/` directory — see "Post-creation restructure" in the Init-Time Decision Pinned section above.
