---
stepsCompleted:
  - step-01-init
  - step-02-discovery
  - step-02b-vision
  - step-02c-executive-summary
  - step-03-success
  - step-04-journeys
  - step-05-domain (skipped — low complexity)
  - step-06-innovation (skipped — intentionally unremarkable)
  - step-07-project-type
  - step-08-scoping
  - step-09-functional
  - step-10-nonfunctional
  - step-11-polish
  - step-12-complete
releaseMode: phased
inputDocuments:
  - _bmad-output/planning-artifacts/product-brief.md
documentCounts:
  briefCount: 1
  researchCount: 0
  brainstormingCount: 0
  projectDocsCount: 0
classification:
  projectType: web_app
  domain: general_consumer_productivity
  complexity: low
  projectContext: greenfield
workflowType: 'prd'
---

# Product Requirements Document - aine_v6

**Author:** Marclevy
**Date:** 2026-04-26

## Executive Summary

Aine is a minimal browser-based todo application built as a hands-on vehicle for learning the BMAD v6 methodology. The app supports the smallest useful feature set — add a todo, mark it complete or incomplete, view the list, and persist it locally — and is intended to grow incrementally as additional BMAD capabilities are practiced.

The deliverable is twofold: (1) the chain of BMAD planning artifacts that this PRD belongs to (brief → PRD → architecture → epics → stories), and (2) working code traceable back through every artifact. The app exists to give the methodology something concrete to be applied to.

### What Makes This Special

This is not a product competing in the todo-app market. Its value is **process fidelity** — every BMAD stage is exercised honestly on a problem small enough that the methodology stays the focus. The deliberate restraint on scope is itself a feature: it keeps each BMAD stage tractable for a first-time practitioner and ensures the artifact trail is coherent and defensible.

The core insight: a methodology is internalized fastest when applied to a problem so small that the methodology — not the problem — is the cognitive load.

## Project Classification

- **Project Type:** Web application (single-page, browser-based)
- **Domain:** General consumer productivity (no regulatory constraints)
- **Complexity:** Low — single user, no auth, no sync, no multi-device, no backend services in the proof-of-concept
- **Project Context:** Greenfield — no existing codebase or product documentation

## Success Criteria

### User Success

The single user (the learner) succeeds when:

- They can add a new todo, see it appear in the list, mark it complete, and have that state persist across browser refreshes — without any error or confusion.
- The app's behavior matches what the PRD and stories describe, with no surprising gaps or undocumented quirks.

### Learning Success

The project succeeds when:

- Each BMAD planning artifact (brief, PRD, architecture, epics, stories) exists in `_bmad-output/planning-artifacts/` and was produced via its corresponding BMAD skill.
- At least one epic is broken down into stories using the BMAD story-creation flow.
- The stories are implemented as runnable code, not pseudocode or stubs.
- The author can articulate, for each artifact, *why* BMAD asked for it and *what* it informed downstream.

### Technical Success

- The app runs locally in a modern desktop browser (latest Chrome / Firefox / Safari) with no build errors or runtime exceptions in the happy path.
- Todos persist across page refreshes via local browser storage.
- The codebase is small enough that a reader can trace any feature back to the story that produced it.

### Measurable Outcomes

- 100% of BMAD planning stages have a corresponding artifact in `_bmad-output/`.
- The four core flows work end-to-end: (1) add a todo, (2) mark complete, (3) mark incomplete, (4) refresh and see todos still there.
- Zero blocking bugs in the happy path on at least one supported browser.

**Explicitly NOT success criteria:** user adoption, performance benchmarks, deployment, accessibility audits, polish, comparison to competitor todo apps, multi-device behavior.

## User Journeys

### Persona: Marc, the Learner

**Situation:** Marc is working through BMAD v6 for the first time. He has the methodology open in one window and his code editor in another. He needs the todo app to *work* well enough to confirm that the BMAD chain ends in something runnable, but he is not the app's "customer" in any commercial sense — the app is the artifact, not the destination.

**Goal:** Verify that the four core flows — add, complete, uncomplete, persist — all work end-to-end.

**Obstacle:** None of his own. The only obstacles would be defects in the app or gaps in the BMAD trail.

### Journey 1 — First Use (Happy Path)

**Opening Scene:** Marc has just finished implementing the last story. He opens his browser, navigates to the local app URL, and sees an empty todo list with a single input field and an "Add" button.

**Rising Action:** He types "Buy milk" into the input and clicks Add. The todo appears in the list, unchecked. He adds two more — "Walk dog", "Read BMAD docs". All three appear in order.

**Climax:** He clicks the checkbox next to "Walk dog". The item updates visually to indicate it's complete (e.g., strikethrough, checked state). He refreshes the browser. All three items are still there, with "Walk dog" still marked complete.

**Resolution:** Marc closes the browser knowing the app — and by extension the BMAD chain that produced it — works as intended. He moves on with confidence in the methodology.

### Journey 2 — Toggling Incomplete (Edge of Happy Path)

**Opening Scene:** Marc realizes he marked "Walk dog" complete by mistake — he hasn't actually walked the dog yet.

**Rising Action:** He clicks the checkbox on the "Walk dog" item again.

**Climax:** The item returns to its incomplete visual state.

**Resolution:** He refreshes the browser to confirm the change persisted. It did.

### Journey 3 — Adding an Empty / Whitespace-Only Todo (Defensive Edge Case)

**Opening Scene:** Marc absent-mindedly clicks "Add" without typing anything, or types only spaces.

**Rising Action:** He expects either nothing to happen or some clear indication that an empty todo isn't accepted.

**Climax:** The app declines to add an empty / whitespace-only todo. No todo appears. The input is unchanged or cleared. No error or scary message — the form simply doesn't submit.

**Resolution:** Marc moves on without confusion. The app didn't pollute his list with blank entries.

### Journey Coverage Notes

The three journeys collectively reveal every capability that the Functional Requirements section formalizes (FR1 – FR9). No admin, moderator, support, or API-consumer journeys are needed for the PoC because no such roles exist in the system.

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP Approach:** *Problem-solving MVP* — the smallest possible app that genuinely lets a user manage a list of todos and persist them, with no tangential capabilities. The app's purpose is to give every BMAD stage something concrete to act on, so the MVP must be small enough that every stage stays tractable, but real enough that the resulting code is non-trivial.

**Resource Requirements:** A single learner working alongside an AI assistant. No team, no external dependencies, no infrastructure budget.

### MVP Feature Set (Phase 1 — Proof of Concept)

**Core User Journeys Supported:** Journeys 1, 2, and 3 above.

**Must-Have Capabilities:** the complete FR1 – FR9 set (see Functional Requirements).

**Nice-to-Have for Phase 1 (in scope only if trivial):**
- A todo count display (e.g., "2 of 5 complete")

### Post-MVP Features

Each item below is a candidate for a future BMAD iteration, chosen specifically to exercise a particular BMAD capability — not for product value.

**Phase 2 (next BMAD exercises — order to be chosen by the learner):**
- **Edit / delete a todo** — exercise the change-management workflow
- **Due dates** — exercise non-trivial requirements and architecture revision
- **Categories or tags** — exercise data-model evolution

**Phase 3 (later, if BMAD practice continues):**
- **User accounts / authentication** — exercise major architecture revision
- **Sync across devices** — exercise introducing a backend service
- Anything else the learner wants to use as a BMAD exercise

### Vision

The app remains intentionally a sandbox — it grows only as the author's BMAD practice grows. The end state is not a shipped, polished product; it is a fluent BMAD practitioner with a working artifact trail. The app itself never needs to leave the learner's machine.

### Risk Mitigation Strategy

**Technical Risks:**
- *Risk:* The learner picks an over-complicated framework or architecture and gets stuck on tooling instead of BMAD. *Mitigation:* the Architecture stage must explicitly justify framework choice on simplicity grounds, not on hypothetical future-feature support.
- *Risk:* Browser local storage edge cases (quota errors, disabled storage, private-browsing limits). *Mitigation:* document the assumption that storage is available; do not engineer for the failure case in the PoC (see also NFR4 for the corrupted-record defense).

**Process Risks (adapted to learning context):**
- *Risk:* The learner produces artifacts that look complete but skip the substance of a BMAD stage. *Mitigation:* every artifact is reviewed against its source artifact (e.g., stories must trace back to PRD requirements; PRD must trace back to brief).
- *Risk:* Over-scoping kills momentum before any BMAD stage completes. *Mitigation:* aggressive use of "explicitly out of scope" sections (present throughout this PRD).

**Resource Risks:**
- *Risk:* Time runs out mid-implementation. *Mitigation:* the PoC scope is small enough that even a partial implementation produces meaningful BMAD evidence (the planning artifacts exist regardless of code completion).

## Web Application Specific Requirements

### Project-Type Overview

Aine is a single-page web application that runs entirely in the user's browser. It has no backend services, no server-side rendering, and no public deployment in the proof-of-concept. The full application — UI, state management, persistence — is delivered as static assets and runs client-side.

### Technical Architecture Considerations

- **Architecture style:** Single-page application (SPA). No routing in the PoC; the entire UI is one screen.
- **Browser matrix:** Latest stable versions of desktop Chrome, Firefox, and Safari. No support commitment for legacy browsers, IE, or in-app browsers (e.g., Instagram, Facebook embedded views).
- **No backend:** All logic and data live in the browser. No HTTP API, no auth flow, no server-side state.
- **Persistence:** Browser-local storage (specific mechanism — `localStorage`, `IndexedDB`, etc. — to be decided in the Architecture stage).
- **Build & runtime:** Specific framework, build tool, and bundler choices are deferred to the Architecture stage. Constraint: must be runnable locally with a single command and viewable in a browser.

### Responsive Design

- Desktop-first. Layout should remain usable down to ~1024px width.
- No mobile-first effort or testing is committed in the PoC. Mobile layout is "should not break catastrophically" — not a graded experience.

### Performance Targets

See NFR1 and NFR2 in the Non-Functional Requirements section. No additional performance targets apply.

### SEO Strategy

**None.** The app is local-only, has no public URL, and is not intended to be discovered by search engines. SEO concerns do not apply.

### Accessibility Level

Best-effort semantic HTML (proper `<button>`, `<input>`, `<label>`, `<ul>`/`<li>` elements; keyboard-operable form interactions) as a code-hygiene practice. No formal WCAG audit is committed — see the Categories Deliberately Excluded note in Non-Functional Requirements.

### Implementation Considerations

- All third-party dependencies should be minimal and chosen with the goal of keeping the codebase small and readable.
- No analytics, telemetry, error reporting, or external service calls of any kind in the PoC.
- The app should work fully offline, since there is nothing online for it to depend on.

## Functional Requirements

### Todo Management

- **FR1:** User can add a new todo by providing non-empty text input.
- **FR2:** User attempting to add an empty or whitespace-only todo has no todo added; the action is silently rejected with no error displayed.
- **FR3:** User can view the complete list of all todos in the order they were added.
- **FR4:** User can mark any incomplete todo as complete.
- **FR5:** User can mark any complete todo as incomplete (state changes are bidirectional).
- **FR6:** User can visually distinguish complete todos from incomplete todos at a glance.
- **FR7:** User sees an empty-state indication when no todos exist.

### Persistence

- **FR8:** All todos and their completion state survive a browser page reload.
- **FR9:** All todos and their completion state survive closing and reopening the browser tab on the same device and browser.

## Non-Functional Requirements

### Performance

- **NFR1:** All user actions (add, toggle, render) feel instantaneous on a modern laptop — defined as completing within 100ms perceived latency. Since there is no network or backend, this is the natural baseline.
- **NFR2:** The app loads and renders the initial empty or populated state within 1 second of opening the page on a modern laptop.

### Reliability

- **NFR3:** The four golden-path flows (add, complete, uncomplete, refresh-and-still-there) work without error in the latest stable Chrome, Firefox, and Safari on macOS.
- **NFR4:** A corrupted or unreadable persistence record does not crash the app — the worst-case outcome is the app starting with an empty list rather than throwing an unhandled error.

### Maintainability

- **NFR5:** The implementation is small enough and structured clearly enough that any feature can be traced from its rendered behavior back to the story that produced it, the FR(s) that justified that story, and the section of this PRD that drove those FRs.

### Categories Deliberately Excluded

The following NFR categories do **not** apply to this PoC and are intentionally omitted to avoid requirement bloat:

- **Security:** No sensitive data, no authentication, no network calls, no payments, no PII, single-user single-device.
- **Scalability:** Single user, single device, no growth plan, no traffic.
- **Accessibility:** Excluded from formal success criteria. Best-effort semantic HTML is documented in Web Application Specific Requirements as a code-hygiene practice; no graded accessibility NFR is committed.
- **Integration:** No external systems, no APIs, no third-party services.
- **Internationalization:** Single language (English), no localization scope.
- **Compliance / Regulatory:** No regulatory framework applies to a single-user local todo app.
