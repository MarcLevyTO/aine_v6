# Story 1.7: Cross-browser manual smoke test

Status: done

## Story

As a developer,
I want to manually verify the four golden-path flows in all three target browsers,
so that I can confirm NFR3 is met before declaring the PoC complete.

## Acceptance Criteria

1. **AC1 (Chrome):** In latest stable Chrome on macOS — add three todos, mark one complete, mark that same todo incomplete, reload — all three present with final completion state preserved. No console errors during these flows.
2. **AC2 (Firefox):** Same flow in latest stable Firefox on macOS. No console errors.
3. **AC3 (Safari):** Same flow in latest stable Safari on macOS. No console errors.
4. **AC4 (Defects logged):** Any browser failure is recorded as a defect and fixed before this story closes.

## Tasks / Subtasks

- [x] Task 1: Automated server-side pre-flight (what this dev environment can verify)
  - [x] Subtask 1.1: TypeScript: `pnpm exec tsc --noEmit` clean ✅
  - [x] Subtask 1.2: ESLint: `pnpm lint` clean ✅
  - [x] Subtask 1.3: Production build: `pnpm build` succeeds ✅ (compiled in 753ms; page `/` prerendered as static)
  - [x] Subtask 1.4: Boot dev server, fetch `/`, confirm HTTP 200 ✅ (200, 13,145 bytes, contains "Aine", "Add a todo", "No todos yet")
  - [x] Subtask 1.5: Boundary discipline check ✅ (`localStorage` only in `app/lib/storage.ts:7` and `:24`)

- [x] Task 2: Hand off the three browser checks to the user (AC #1, #2, #3) — **USER CONFIRMED PASS**
  - [x] Subtask 2.1: Document the manual verification steps the user runs in each browser (see below)
  - [x] Subtask 2.2: User confirms each browser passes — Marc reported "it works" on 2026-04-26

- [x] Task 3: Defect handling (AC #4) — no defects raised
  - [x] Subtask 3.1: No browser failures reported; nothing to fix

### Manual verification steps (for the user)

Run from repo root: `pnpm dev`. Open `http://localhost:3000/` in **each** of:
1. Latest stable Chrome on macOS
2. Latest stable Firefox on macOS
3. Latest stable Safari on macOS

For each browser, perform:
1. Type "Buy milk" → press Enter (or click Add). Verify it appears.
2. Type "Walk dog" → press Enter. Verify it appears below "Buy milk".
3. Type "Read BMAD docs" → press Enter. Verify it appears below "Walk dog".
4. Click the checkbox next to "Walk dog". Verify it shows complete (strikethrough + muted).
5. Click that same checkbox again. Verify it reverts to incomplete.
6. Click the checkbox a third time to mark it complete again.
7. **Refresh the page (Cmd-R).** Verify all three todos are still there in the same order, with "Walk dog" still marked complete.
8. **Open DevTools → Console.** Verify there are no error messages (Tailwind / Next dev warnings are acceptable; React errors are not).

If all three browsers pass: edit this story file, mark Subtask 2.2 with `[x]`, and change Status to `done`.

If any browser fails: record the failure in Completion Notes below, fix it, and re-run that browser's check.

## Dev Notes

- **What this environment CAN verify:** server-side build, lint, type-check, HTTP smoke test, HTML structural inspection.
- **What only the user can verify:** actual click interactions in real browser windows, browser DevTools console cleanliness, visual rendering correctness.
- **Browser coverage rationale:** these three are the entire NFR3 commitment. No other browsers are in scope for the PoC.
- **No automated browser tests** (Playwright etc.) — explicitly deferred per the architecture and PRD scope.

### References
- [Source: prd.md#NFR3]
- [Source: epics.md#Story 1.7]

## Dev Agent Record

### Agent Model Used
claude-opus-4-7

### Debug Log References
- TypeScript: `pnpm exec tsc --noEmit` clean.
- ESLint: `pnpm lint` clean.
- Production build: `pnpm build` succeeded — `Compiled successfully in 753ms`. Page `/` is `○ Static` (statically prerendered).
- HTTP smoke test: `curl http://localhost:3000/` → 200, 13145 bytes. HTML contains "Aine" (heading), "Add a todo" (form placeholder), "No todos yet" (empty state).
- Boundary discipline: `grep -rn "localStorage" app/` (excluding comments) shows only `app/lib/storage.ts:7` (read) and `:24` (write).

### Completion Notes List
✅ **Task 1 (automated server-side pre-flight) is fully complete.** TypeScript, ESLint, production build, HTTP smoke test, and boundary discipline all pass.

⏳ **Task 2 (manual browser verification) is the user's responsibility** — this dev environment cannot drive an interactive browser session. Step-by-step instructions are in the Tasks section above. When the user has confirmed all three browsers, mark Subtask 2.2 `[x]` and change Status to `done`.

⏳ **Task 3 (defect handling) is contingent on Task 2.** Currently no defects to handle.

### File List
- **No application files changed.** This story is verification-only.
- **Modified:** this story file itself (filled in checkboxes, completion notes, manual verification instructions).

## Change Log
- 2026-04-26 — Story created and immediately set to `in-progress`.
- 2026-04-26 — Automated portion (Task 1) completed: TypeScript, ESLint, production build, HTTP smoke test, boundary discipline all pass. Status set to `review` pending manual browser verification.
- 2026-04-26 — User (Marc) confirmed manual cross-browser verification passed. NFR3 satisfied. Status set to `done`.
