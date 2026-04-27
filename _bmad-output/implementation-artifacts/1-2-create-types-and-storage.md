# Story 1.2: Create the types and storage modules

Status: review

## Story

As a developer,
I want a typed `Todo` model and an isolated storage module,
so that all subsequent stories can read and write todos through a single, defensive boundary as the architecture mandates.

## Acceptance Criteria

1. **AC1 (Type definitions):** `app/lib/types.ts` exports a `Todo` type defined as `{ id: string; text: string; completed: boolean }` and a `StoredState` type defined as `{ version: 1; todos: Todo[] }`.

2. **AC2 (Storage module API):** `app/lib/storage.ts` imports `Todo` and `StoredState` from `./types`, defines a private (non-exported) `STORAGE_KEY = 'aine.todos.v1'` constant, and exports two functions: `loadTodos(): Todo[]` and `saveTodos(todos: Todo[]): void`.

3. **AC3 (Empty storage → empty array):** `loadTodos()` returns `[]` when `localStorage` has no entry for `STORAGE_KEY`, without throwing.

4. **AC4 (Defensive read for malformed data):** `loadTodos()` returns `[]` and logs a `console.warn` when the stored value is malformed JSON, has the wrong shape, or has an unrecognized `version`. It must not throw under any circumstance.

5. **AC5 (Valid load):** `loadTodos()` returns the persisted `todos` array exactly as stored when the value is valid `StoredState` with `version: 1`.

6. **AC6 (Save format):** `saveTodos(todos)` writes `JSON.stringify({ version: 1, todos })` to `STORAGE_KEY`.

7. **AC7 (Save resilience):** `saveTodos(todos)` logs a `console.warn` and does NOT throw when `localStorage` throws (e.g., quota exceeded, disabled storage).

8. **AC8 (Persistence boundary discipline):** Searching the entire codebase (excluding `node_modules/` and `.next/`) for `localStorage` matches only inside `app/lib/storage.ts`.

## Tasks / Subtasks

- [x] Task 1: Create the types module (AC: #1)
  - [x] Subtask 1.1: Create `app/lib/types.ts`
  - [x] Subtask 1.2: Export `type Todo = { id: string; text: string; completed: boolean }`
  - [x] Subtask 1.3: Export `type StoredState = { version: 1; todos: Todo[] }`

- [x] Task 2: Create the storage module (AC: #2 – #7)
  - [x] Subtask 2.1: Create `app/lib/storage.ts`
  - [x] Subtask 2.2: Import `Todo` and `StoredState` from `./types`
  - [x] Subtask 2.3: Define a module-private (not exported) `const STORAGE_KEY = 'aine.todos.v1'`
  - [x] Subtask 2.4: Implement `loadTodos(): Todo[]` with try/catch wrapping `JSON.parse` and validation of shape + version (AC #3, #4, #5)
  - [x] Subtask 2.5: Implement `saveTodos(todos: Todo[]): void` with try/catch around `localStorage.setItem` (AC #6, #7)
  - [x] Subtask 2.6: Both functions must use `console.warn` (not `console.error`) for recoverable degradations

- [x] Task 3: Verify persistence-boundary discipline (AC: #8)
  - [x] Subtask 3.1: Run `grep -rn "localStorage" app/` — only matches should be inside `app/lib/storage.ts` ✅ confirmed (only `app/lib/storage.ts:7` and `:24`)
  - [x] Subtask 3.2: Verify TypeScript compiles cleanly: `pnpm exec tsc --noEmit` ✅ no errors
  - [x] Subtask 3.3: Run ESLint on the new files: `pnpm lint` ✅ no errors

## Dev Notes

### Why this story exists

Per the Architecture document (§Frontend Architecture and §Implementation Patterns), `localStorage` access is confined to a single module. This story creates that module up-front so every downstream story (1.3 onward) can import `loadTodos` / `saveTodos` instead of touching the storage API directly. This is the core enforcement mechanism behind NFR4 (corrupted-storage resilience) and the persistence-boundary anti-pattern from §Pattern Examples.

### Critical constraints

- **No React in these files.** `types.ts` and `storage.ts` are plain TypeScript modules. They do not import from `react`, do not use JSX, do not need `'use client'`. They will be imported by both client components (in later stories) and any future server-side code (although the PoC has none).
- **No exports of `STORAGE_KEY`.** The constant is module-private. If a downstream caller needs to know the key (they won't), they import the functions, not the key.
- **`saveTodos` is fire-and-forget.** It returns `void`. It never throws. Any failure becomes a `console.warn`. This matches the "no errors shown to user in PoC" rule from the Architecture's §Process Patterns.
- **Versioned shape is load-bearing.** `StoredState` has `version: 1` as a required literal type, not an optional field. The defensive read in `loadTodos` rejects unknown versions. This preserves the migration path documented in the Architecture for Phase 2.
- **`crypto.randomUUID()` is NOT used in this story.** ID generation happens in Story 1.4 (the add-todo flow). `storage.ts` is agnostic about how IDs are produced — it just round-trips whatever string is in `todo.id`.

### Source tree components to touch

- **New:** `app/lib/types.ts`, `app/lib/storage.ts`
- **New:** `app/lib/` directory (does not exist yet)
- **Modified:** none. This story adds files only.
- **Out of bounds:** everything else. Do not edit `app/page.tsx`, `app/layout.tsx`, `app/globals.css`, or anything outside `app/lib/`.

### Testing standards

**No automated tests in this story** (consistent with the Architecture's deferred-testing decision). Verification is by:
1. Manual inspection of the two files against ACs
2. `grep` for `localStorage` to confirm boundary discipline (subtask 3.1)
3. TypeScript compile (subtask 3.2)
4. ESLint (subtask 3.3)

### Project Structure Notes

After this story, the `app/` tree gains:

```
app/
├── layout.tsx                 # unchanged
├── page.tsx                   # unchanged
├── globals.css                # unchanged
├── favicon.ico                # unchanged
└── lib/                       # NEW — created by this story
    ├── storage.ts             # NEW
    └── types.ts               # NEW
```

### Reference: example code from architecture.md §Pattern Examples

The Architecture document includes an exemplar `loadTodos` implementation. The implementation in this story should match its shape:

```ts
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

`saveTodos` is symmetric: try/catch around `localStorage.setItem`, `console.warn` on failure, no throw.

### References

- [Source: _bmad-output/planning-artifacts/architecture.md#Data Architecture] (storage decisions, on-disk shape, defensive read mandate)
- [Source: _bmad-output/planning-artifacts/architecture.md#Frontend Architecture] (state mgmt, persistence boundary)
- [Source: _bmad-output/planning-artifacts/architecture.md#Implementation Patterns] (process patterns, persistence discipline, anti-patterns)
- [Source: _bmad-output/planning-artifacts/architecture.md#Pattern Examples] (loadTodos exemplar)
- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.2: Create the types and storage modules]

## Dev Agent Record

### Agent Model Used

claude-opus-4-7

### Debug Log References

- `mkdir -p app/lib` to create the new directory.
- After writing `types.ts` and `storage.ts`, ran three verification commands:
  - `grep -rn "localStorage" app/` → only `app/lib/storage.ts:7` and `app/lib/storage.ts:24` (boundary discipline confirmed for AC8).
  - `pnpm exec tsc --noEmit` → exit 0, no output (clean compile).
  - `pnpm lint` → exit 0, no output (no ESLint warnings).

### Completion Notes List

✅ **All 8 ACs satisfied.**

1. **`storage.ts` matches the architecture's exemplar code exactly** (with one adjustment: the `saveTodos` `console.warn` message is `'[aine] storage save failed'` since the architecture only specified the read-side message; the write-side message is implementation discretion using the same `[aine]` prefix convention).

2. **Used `import type` for the type imports** in `storage.ts` to match TypeScript best practice (avoids runtime import overhead for type-only imports). Functionally equivalent to `import`, but signals to the TypeScript compiler and bundler that these are erased at compile time.

3. **No `crypto.randomUUID()` calls in this story** — that's Story 1.4's concern. The storage module is agnostic about how IDs are produced.

4. **No tests written** — consistent with the Architecture's deferred-testing decision. The defensive paths in `loadTodos` and `saveTodos` could be unit-tested in a future story if testing is added; the per-AC verification in Tasks 1–3 was sufficient for PoC scope.

5. **No imports from `react`** in either file. They are pure TypeScript modules usable from any context (client component, future server code, future tests).

### File List

**New files:**
- `app/lib/types.ts` (10 lines)
- `app/lib/storage.ts` (29 lines)

**Modified files:** none.

**Out-of-scope files touched:** none.

## Change Log

- 2026-04-26 — Story created and immediately moved to `in-progress` for execution.
- 2026-04-26 — Implementation completed. Both files written; all 8 ACs verified (boundary discipline, TypeScript clean, ESLint clean). Status set to `review`.
