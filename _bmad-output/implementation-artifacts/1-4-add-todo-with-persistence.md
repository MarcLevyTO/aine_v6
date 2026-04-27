# Story 1.4: Add a todo via the form, with persistence

Status: review

## Story

As a user,
I want to type a todo into a form and click Add (or press Enter) to save it,
so that I can capture something I need to do and have it persist across reloads.

## Acceptance Criteria

1. **AC1 (`AddTodoForm` component):** Stateless component at `app/components/AddTodoForm.tsx` with prop `onAdd: (text: string) => void`, renders text input + submit button, handles Enter and click.
2. **AC2 (Add valid):** Non-empty input → trim → call `onAdd(trimmedText)` → clear input. (FR1)
3. **AC3 (Reject empty):** Empty / whitespace-only input → `onAdd` NOT called, no error message, no todo appears. (FR2)
4. **AC4 (Page wires it up):** `app/page.tsx` renders `<AddTodoForm onAdd={handleAdd} />` above the list area. `handleAdd` uses functional setter: `setTodos(prev => [...prev, { id: crypto.randomUUID(), text, completed: false }])`.
5. **AC5 (Save effect):** Second `useEffect` watches the `todos` array and calls `saveTodos(todos)` on every change.
6. **AC6 (Persistence):** Adding a todo and reloading the page preserves the todo in the list. (FR8, FR9)

## Tasks / Subtasks

- [x] Task 1: Create `app/components/AddTodoForm.tsx` (AC #1, #2, #3)
  - [x] Subtask 1.1: Create `app/components/` directory if missing
  - [x] Subtask 1.2: Stateless component, props `{ onAdd }`, internal text state via local `useState<string>('')`
  - [x] Subtask 1.3: Form with `onSubmit` handler — `e.preventDefault()`, trim, guard empty, call `onAdd`, clear text
  - [x] Subtask 1.4: Tailwind-styled input + button

- [x] Task 2: Wire `AddTodoForm` into `app/page.tsx` (AC #4, #5)
  - [x] Subtask 2.1: Import `AddTodoForm` and `saveTodos`
  - [x] Subtask 2.2: Add `handleAdd` using functional setter form with `crypto.randomUUID()`
  - [x] Subtask 2.3: Render `<AddTodoForm onAdd={handleAdd} />` above the list area
  - [x] Subtask 2.4: Add second `useEffect` watching `todos` that calls `saveTodos(todos)`

- [x] Task 3: Verify (AC #2, #3, #6)
  - [x] Subtask 3.1: `pnpm exec tsc --noEmit` clean
  - [x] Subtask 3.2: `pnpm lint` clean
  - [x] Subtask 3.3: Boot dev server and HTTP-fetch — page renders with form

## Dev Notes

- **Local state in form is OK:** the form has its own `useState<string>('')` for the text input — that's a UI concern, not application data. Application data (`Todo[]`) lives only in `page.tsx`.
- **`crypto.randomUUID()` is browser-native** and supported in all target browsers without polyfill (architecture verified this).
- **Functional setter form `setTodos(prev => ...)` is mandatory** per architecture's anti-stale-closure rule.
- **The save-effect WILL fire on initial mount** with the empty `[]` initial state, before the load-effect repopulates. This is harmless — `saveTodos([])` writes `{ version: 1, todos: [] }` which is a valid no-op. The load-effect then sets the actual state and the next save reflects it. Architecture acknowledged this.
- **The lint suppression for `react-hooks/set-state-in-effect`** from Story 1.3 stays. The save-effect is fine (it doesn't call `setState`).

### Source tree changes

- **New:** `app/components/AddTodoForm.tsx`
- **New:** `app/components/` directory
- **Modified:** `app/page.tsx` (add wiring)

### References

- [Source: architecture.md#Frontend Architecture]
- [Source: architecture.md#Pattern Examples] (validation at boundary)
- [Source: epics.md#Story 1.4]

## Dev Agent Record

### Agent Model Used
claude-opus-4-7

### Debug Log References
- `pnpm exec tsc --noEmit` clean.
- `pnpm lint` clean (no new suppressions needed beyond the one inherited from Story 1.3).
- `grep -rn "localStorage" app/` shows the only real usage is still in `storage.ts:7` and `:24`. The `page.tsx:13` match is a comment, not an actual API call.

### Completion Notes List
✅ All 6 ACs met.
1. **Local UI state in `AddTodoForm`** uses `useState<string>('')` — this is a UI-input concern, not application data, so it doesn't violate the "state lives only in `page.tsx`" rule (which is specifically about the `Todo[]` model).
2. **Save effect fires on initial mount** with `[]` (writes `{ version: 1, todos: [] }` — harmless), then again immediately when the load-effect populates state. Architecture acknowledged this; not a defect.
3. **Used `aria-label="New todo text"`** on the input since there's no visible label (placeholder is the only visual cue). This satisfies the "best-effort semantic HTML" guidance from the architecture.

### File List
- **New:** `app/components/AddTodoForm.tsx` (35 lines)
- **New:** `app/components/` directory
- **Modified:** `app/page.tsx` (added form import, save effect, handleAdd; 47 lines total)

## Change Log

- 2026-04-26 — Story created and immediately set to `in-progress`.
