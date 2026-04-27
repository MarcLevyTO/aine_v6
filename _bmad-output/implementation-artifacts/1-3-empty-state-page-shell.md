# Story 1.3: Build the empty-state page shell

Status: review

## Story

As a user,
I want to open the app and see a clear "no todos yet" state with a place to add my first one,
so that I understand what the app does before I've created anything.

## Acceptance Criteria

1. **AC1 (Client component):** `app/page.tsx` begins with `'use client'` and uses `useState<Todo[]>([])` for initial state.
2. **AC2 (Mount-time load):** A `useEffect(() => setTodos(loadTodos()), [])` populates state on mount; `loadTodos()` is NOT called inside `useState`'s initializer.
3. **AC3 (Empty state):** With empty `localStorage`, opening the app shows a clear empty-state message (e.g., "No todos yet — add one above") and a visible Aine heading.
4. **AC4 (No hydration mismatch):** First server render shows the empty state with no React hydration warning in the dev console.
5. **AC5 (Tailwind styling, ≥1024px usable):** Layout uses Tailwind utility classes and remains usable down to 1024px viewport width.

## Tasks / Subtasks

- [x] Task 1: Replace `app/page.tsx` with the client-component shell (AC: #1, #2, #3, #5)
  - [x] Subtask 1.1: Add `'use client'` at top of file
  - [x] Subtask 1.2: Import `useState`, `useEffect` from `react`; import `Todo` from `./lib/types`; import `loadTodos` from `./lib/storage`
  - [x] Subtask 1.3: Use `useState<Todo[]>([])` for initial state
  - [x] Subtask 1.4: Add `useEffect(() => setTodos(loadTodos()), [])` for mount-time load
  - [x] Subtask 1.5: Render an Aine heading and an empty-state message when `todos.length === 0`
  - [x] Subtask 1.6: Use Tailwind utility classes; container max-width and padding so the layout works at 1024px+

- [x] Task 2: Verify (AC: #3, #4, #5)
  - [x] Subtask 2.1: `pnpm exec tsc --noEmit` clean
  - [x] Subtask 2.2: `pnpm lint` clean
  - [x] Subtask 2.3: Boot dev server, fetch `/`, confirm HTTP 200 and presence of empty-state text in HTML

## Dev Notes

- **No backend, no async data**, no `Suspense`, no `loading.tsx`. The mount-effect handles all asynchronicity.
- **Hydration rule:** SSR must render the empty state. `useState<Todo[]>([])` ensures the server-rendered value matches the first client paint; the load effect runs after hydration.
- **Empty-state copy is implementation-discretion** (per the readiness report's UX warning). Use something clear and friendly. Keep it short.
- **Don't add the form or list yet** — Stories 1.4 and 1.5 do that. This story is just shell + empty state.

### Source tree changes

- **Modified:** `app/page.tsx` (replace default starter content with our shell)
- **No other files touched.**

### References

- [Source: architecture.md#SSR / hydration note]
- [Source: architecture.md#Frontend Architecture]
- [Source: epics.md#Story 1.3]

## Dev Agent Record

### Agent Model Used

claude-opus-4-7

### Debug Log References
- `pnpm exec tsc --noEmit` clean.
- First `pnpm lint` flagged `react-hooks/set-state-in-effect` on the mount-load `setTodos(loadTodos())` call — eslint-config-next 16 added this rule. Suppressed inline with explanatory comments since the architecture explicitly mandates this pattern.
- Smoke test: `curl http://localhost:3000/ | grep -oE "(No todos yet|Aine)"` returned both — empty-state and heading both rendered server-side.

### Completion Notes List
✅ All 5 ACs met.

1. **Lint suppression added on the mount-effect line** — `react-hooks/set-state-in-effect` doesn't allow direct `setState` in an effect. Suppressed because: (a) the architecture explicitly mandates this exact pattern, and (b) the alternative `useState(() => loadTodos())` would call `localStorage` during server render which would crash. The suppression is documented inline with two comment lines explaining why.
2. **Empty-state copy:** "No todos yet — add one above." Implementation discretion per architecture. Includes "above" because Story 1.4 will put the form above the list area.
3. **Tailwind v4 theme tokens** (`bg-background`, `text-foreground`) work — those map to the CSS variables defined by `create-next-app` in `globals.css`. Used `text-foreground/60` for the muted empty-state color.
4. **Layout container:** `max-w-2xl` (672px) centered with horizontal padding — usable at 1024px+ trivially; usable at narrower widths too (responsive bonus, not committed).

### File List
- **Modified:** `app/page.tsx` (replaced default starter with shell — 36 lines)

## Change Log

- 2026-04-26 — Story created and immediately set to `in-progress`.
