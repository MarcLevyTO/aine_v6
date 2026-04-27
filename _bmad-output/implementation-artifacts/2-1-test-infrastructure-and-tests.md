# Story 2.1: Test infrastructure + unit/component/E2E tests + ≥70% coverage

Status: done

## Story

As a developer aligning with the activity rubric,
I want automated unit, component, and E2E test suites with ≥70% coverage,
so that the project meets the rubric's testing requirements (Vitest, Playwright, ≥5 E2E tests, 70% coverage).

## Acceptance Criteria

1. **AC1 (Vitest configured):** `vitest.config.ts` and `vitest.setup.ts` exist; `pnpm test` runs unit/component tests.
2. **AC2 (Playwright configured):** `playwright.config.ts` exists; `pnpm test:e2e` runs E2E tests against a dev server.
3. **AC3 (Unit tests for storage):** `app/lib/storage.test.ts` covers happy path, malformed JSON, wrong shape, unknown version, and save-failure paths.
4. **AC4 (Component tests):** `AddTodoForm`, `TodoList`, `TodoItem`, and the `Home` page have component tests covering their public behavior.
5. **AC5 (E2E tests, ≥5):** `tests/e2e/todo-flows.spec.ts` covers empty state, add (button), add (Enter), reject empty, toggle bidirectional, persistence across reload, list-order — at least 5 tests.
6. **AC6 (Coverage ≥70%):** `pnpm test:coverage` reports lines/statements/functions/branches all ≥70%.

## Tasks / Subtasks

- [x] Task 1: Install dependencies — vitest, @vitejs/plugin-react, @vitest/coverage-v8, jsdom, @testing-library/{react,jest-dom,user-event}, @playwright/test, @axe-core/playwright
- [x] Task 2: Add `vitest.config.ts` (jsdom env, coverage thresholds 70%)
- [x] Task 3: Add `vitest.setup.ts` (stub localStorage and crypto.randomUUID per test)
- [x] Task 4: Add `playwright.config.ts` (Chromium project, dev server reuse)
- [x] Task 5: Add `package.json` scripts: `test`, `test:watch`, `test:coverage`, `test:e2e`, `test:e2e:ui`
- [x] Task 6: Write tests
  - [x] Subtask 6.1: `app/lib/storage.test.ts` — 7 tests
  - [x] Subtask 6.2: `app/components/AddTodoForm.test.tsx` — 4 tests
  - [x] Subtask 6.3: `app/components/TodoItem.test.tsx` — 5 tests
  - [x] Subtask 6.4: `app/components/TodoList.test.tsx` — 3 tests
  - [x] Subtask 6.5: `app/page.test.tsx` — 4 tests
  - [x] Subtask 6.6: `tests/e2e/todo-flows.spec.ts` — 7 E2E tests
  - [x] Subtask 6.7: `tests/e2e/accessibility.spec.ts` — 2 axe-core checks
- [x] Task 7: Verify all tests pass and coverage ≥70%

## Dev Notes / Completion Notes

- **Vitest results:** 23 / 23 unit/component tests pass. Coverage: 100% statements, 100% lines, 100% functions, 93.75% branches. (Far exceeds the 70% target.)
- **Playwright results:** 9 / 9 E2E tests pass (7 todo-flow + 2 accessibility).
- **Accessibility fix found:** the `text-foreground/50` styling on completed todos failed WCAG AA color contrast (≈3.4:1). Bumped to `text-foreground/70` (≈7:1, passes AA). Found by `@axe-core/playwright` — exactly the kind of issue the rubric's accessibility check is designed to catch.
- **Test layout:** unit/component tests co-located in `app/`; E2E tests in `tests/e2e/` per Playwright convention.
- **`vitest.setup.ts`** stubs `localStorage` and `crypto.randomUUID` per test to give each unit test a clean store and deterministic IDs.

## File List

- **New:** `vitest.config.ts`, `vitest.setup.ts`, `playwright.config.ts`
- **New:** `app/lib/storage.test.ts`, `app/components/AddTodoForm.test.tsx`, `app/components/TodoItem.test.tsx`, `app/components/TodoList.test.tsx`, `app/page.test.tsx`
- **New:** `tests/e2e/todo-flows.spec.ts`, `tests/e2e/accessibility.spec.ts`
- **Modified:** `package.json` (added test scripts + 9 devDependencies)
- **Modified:** `app/components/TodoItem.tsx` (color contrast fix: `text-foreground/50` → `text-foreground/70`)

## Change Log

- 2026-04-26 — Story created and executed in one pass. All 6 ACs met. 23 unit tests + 9 E2E tests, ≥70% coverage. One real WCAG issue found and fixed.
