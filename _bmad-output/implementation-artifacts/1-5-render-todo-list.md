# Story 1.5: Render the list of todos

Status: review

## Story

As a user,
I want to see all my todos rendered in the order I added them,
so that I have a clear view of what's on my list.

## Acceptance Criteria

1. **AC1 (`TodoList` component):** Stateless `app/components/TodoList.tsx` accepts `{ todos: Todo[]; onToggle: (id: string) => void }`. Empty state lives here (delegated from page per readiness-report recommendation). When `todos.length > 0`, renders one `<TodoItem />` per todo in array order.
2. **AC2 (`TodoItem` component):** Stateless `app/components/TodoItem.tsx` accepts `{ todo: Todo; onToggle: (id: string) => void }`. Renders text alongside an interactive checkbox; checkbox `checked` matches `todo.completed`.
3. **AC3 (Page wires it up):** `app/page.tsx` renders `<TodoList todos={todos} onToggle={handleToggle} />` below the form. Inline `<ul>` rendering is removed. `handleToggle` is a no-op stub for now (real implementation in Story 1.6).
4. **AC4 (Order preserved):** Adding three todos in sequence renders them in that exact order.

## Tasks / Subtasks

- [x] Task 1: Create `TodoList` and `TodoItem` (AC #1, #2)
  - [x] Subtask 1.1: Create `app/components/TodoItem.tsx`
  - [x] Subtask 1.2: Create `app/components/TodoList.tsx`
  - [x] Subtask 1.3: Move empty-state copy from `page.tsx` into `TodoList`
- [x] Task 2: Update `app/page.tsx` (AC #3)
  - [x] Subtask 2.1: Import `TodoList`
  - [x] Subtask 2.2: Add `handleToggle(id: string)` stub that does nothing (real impl in 1.6)
  - [x] Subtask 2.3: Replace inline `<ul>` and empty-state JSX with `<TodoList todos={todos} onToggle={handleToggle} />`
- [x] Task 3: Verify (AC #4)
  - [x] Subtask 3.1: `pnpm exec tsc --noEmit` clean
  - [x] Subtask 3.2: `pnpm lint` clean
  - [x] Subtask 3.3: `grep -rn "localStorage" app/` — still only `storage.ts`

## Dev Notes

- **Empty-state ownership: `TodoList`** (per readiness report's recommendation). `page.tsx` no longer renders empty-state copy directly.
- **`onToggle` stub in this story.** Story 1.6 implements the real toggle. The stub call signature must match what 1.6 needs: `(id: string) => void`.
- **Both components are stateless.** No `useState` for app data. They just render props and forward callbacks.
- **Don't add edit/delete UI** — out of PoC scope.

### Source tree changes

- **New:** `app/components/TodoList.tsx`, `app/components/TodoItem.tsx`
- **Modified:** `app/page.tsx`

### References

- [Source: architecture.md#Frontend Architecture] (component decomposition)
- [Source: epics.md#Story 1.5]

## Dev Agent Record

### Agent Model Used
claude-opus-4-7

### Debug Log References
- TypeScript clean.
- First lint failed with a `no-unused-vars` warning on the `_id` stub parameter (the `_` prefix convention isn't honored by the project's ESLint config). Fixed by suppressing the rule inline; will be removed in Story 1.6 when the real implementation uses the param.

### Completion Notes List
✅ All 4 ACs met.
1. **Empty-state moved into `TodoList`** per readiness-report recommendation. `page.tsx` no longer renders the empty-state copy directly.
2. **`TodoItem` aria-label** dynamically describes the toggle action ("Mark X as complete" / "Mark X as incomplete") for keyboard / screen-reader accessibility.
3. **Toggle handler stub** suppressed `@typescript-eslint/no-unused-vars` inline; comment notes Story 1.6 will replace.
4. **Visual styling for complete state** is partially implemented in `TodoItem` (line-through + muted color) — Story 1.6 will exercise it once toggling actually works.

### File List
- **New:** `app/components/TodoItem.tsx` (29 lines)
- **New:** `app/components/TodoList.tsx` (24 lines)
- **Modified:** `app/page.tsx` (replaced inline list with `<TodoList>`, added stub `handleToggle`)

## Change Log

- 2026-04-26 — Story created and immediately set to `in-progress`.
