# aine_v6 — A BMAD v6 Learning Project

This repository is a hands-on learning vehicle for the **BMAD v6 methodology**. The deliverable is twofold:

1. **A complete chain of BMAD planning artifacts** — a brief, a PRD, an architecture, epics with stories, and a readiness validation — all produced by walking through the corresponding BMAD skills end-to-end.
2. **Working code** — a minimal, persistent todo web app (called Aine) that the artifacts produce, traceable back through every planning stage.

The todo app is intentionally trivial. The point of the project is the *process*, not the app.

---

## What is BMAD?

**BMAD** (Breakthrough Method for Agile AI-Driven Development) is a structured, opinionated workflow for taking software from a vague idea to working code by passing it through a sequence of well-defined planning artifacts. Each stage is a "skill" — a self-contained, micro-step workflow that produces one specific kind of artifact (a brief, a PRD, an architecture document, etc.).

In this workspace, BMAD is installed as a set of Claude Code skills under `.claude/skills/bmad-*/`. Each skill is invoked by name (e.g., `bmad-product-brief`, `bmad-create-prd`). Skills run sequentially through small step files, halting at menus for user input, with all output appended to artifact files in `_bmad-output/planning-artifacts/`.

The discipline of BMAD comes from:

- **Sequential, gated stages** — you don't move to the next stage until the current one is approved.
- **Bidirectional traceability** — every functional requirement maps to a story, every story maps to architecture, every architectural decision maps to a PRD requirement.
- **Honest scope** — explicitly excluded items are documented as exclusions, not omissions.
- **Artifact persistence** — every decision lives in a file you can re-read, not a conversation you can forget.

---

## The Process We Followed

We executed five major BMAD stages in order, plus one validation gate. Each stage produced one artifact in `_bmad-output/planning-artifacts/`.

### Stage 1 — Product Brief

**Skill:** `bmad-product-brief`
**Output:** [`_bmad-output/planning-artifacts/product-brief.md`](_bmad-output/planning-artifacts/product-brief.md)
**Purpose:** Captures the *what* and *why* of the project before any requirements or design decisions. Establishes vision, target user, scope guardrails, and what makes the project distinct.

**Sub-stages walked through:**
1. **Understand Intent** — open conversation about what the project is and why it exists.
2. **Contextual Discovery** — scan available materials (none in this case; greenfield).
3. **Guided Elicitation** — fill gaps through structured questions.
4. **Draft & Review** — produce a 1-2 page executive brief.
5. **Finalize** — polish and save.

**Outcome:** A brief framing Aine as a learning vehicle for BMAD, with deliberately small scope and an honest "the app exists for the methodology" framing.

---

### Stage 2 — Product Requirements Document (PRD)

**Skill:** `bmad-create-prd`
**Output:** [`_bmad-output/planning-artifacts/prd.md`](_bmad-output/planning-artifacts/prd.md)
**Purpose:** Translates the brief into testable functional requirements (FRs), non-functional requirements (NFRs), success criteria, scope, and user journeys.

**Sub-stages walked through (12 micro-steps):**

1. **Init** — initialize the PRD workspace, discover and load the brief.
2. **Project Discovery** — classify the project (type, domain, complexity, greenfield/brownfield).
3. **Vision** — discover and articulate the product vision.
4. **Executive Summary** — draft the opening narrative.
5. **Success Criteria** — define what "done" looks like across user, learning, and technical axes.
6. **User Journey Mapping** — write narrative journeys (3 written, covering happy path, toggle, defensive empty-input).
7. **Domain Requirements** *(skipped — low complexity)*.
8. **Innovation Focus** *(skipped — intentionally unremarkable PoC)*.
9. **Project-Type Analysis** — answer web-app-specific questions (SPA vs MPA, browser support, SEO, accessibility).
10. **Scoping** — define MVP / Phase 2 / Phase 3 with risk mitigation.
11. **Functional Requirements** — synthesize the binding capability contract (FR1 – FR9).
12. **Non-Functional Requirements** — define quality attributes (NFR1 – NFR5), explicitly exclude N/A categories.
13. **Polish** — consolidate duplication, reorder for narrative flow.
14. **Complete** — finalize.

**Outcome:** 9 FRs, 5 NFRs, 6 deliberately-excluded NFR categories, 3 user journeys, phased delivery plan.

---

### Stage 3 — Architecture

**Skill:** `bmad-create-architecture`
**Output:** [`_bmad-output/planning-artifacts/architecture.md`](_bmad-output/planning-artifacts/architecture.md)
**Purpose:** Translates the PRD into concrete technical decisions — framework, file structure, persistence approach, patterns that prevent AI agents from making conflicting choices.

**Sub-stages walked through (8 micro-steps):**

1. **Init** — set up the architecture workspace, load the brief and PRD.
2. **Project Context Analysis** — extract architectural implications from the PRD's FRs and NFRs.
3. **Starter Template Evaluation** — research and select `create-next-app@latest` (Next.js 16.2 + TypeScript + Tailwind + Turbopack) based on user preference.
4. **Core Architectural Decisions** — pin the decisions that shape the codebase: `localStorage`, on-disk shape (`{ version: 1, todos: [...] }`), `crypto.randomUUID()` IDs, `useState` + `useEffect` state management, defensive read with `try/catch`.
5. **Implementation Patterns** — define naming conventions, file organization, state-update rules, persistence-boundary discipline, error handling, and explicit anti-patterns.
6. **Project Structure** — produce the complete file tree, FR-to-file mapping, and data-flow diagram.
7. **Validation** — coherence check, requirements coverage, gap analysis (surfaced and resolved the SSR/hydration concern).
8. **Complete** — finalize.

**Outcome:** A binding technical specification covering 5 application files plus the starter's generated config files. Every FR has a documented home.

---

### Stage 4 — Epics & Stories

**Skill:** `bmad-create-epics-and-stories`
**Output:** [`_bmad-output/planning-artifacts/epics.md`](_bmad-output/planning-artifacts/epics.md)
**Purpose:** Decomposes the PRD + Architecture into discrete, implementable stories with Given/When/Then acceptance criteria.

**Sub-stages walked through (4 micro-steps):**

1. **Validate Prerequisites** — load PRD + Architecture, extract all FRs/NFRs/additional requirements.
2. **Design Epics** — group requirements by user value (one epic for PoC; future Phase 2/3 epics listed for traceability).
3. **Create Stories** — break the epic into 7 sequentially-implementable stories, each with detailed Given/When/Then acceptance criteria.
4. **Final Validation** — verify FR coverage, story sizing, and dependency direction.

**Outcome:** Epic 1 with 7 stories (1.1 init → 1.2 types/storage → 1.3 empty-state shell → 1.4 add+persist → 1.5 list rendering → 1.6 toggle → 1.7 cross-browser smoke test). 100% FR coverage. No forward dependencies.

---

### Stage 4.5 — Implementation Readiness Validation (Gate)

**Skill:** `bmad-check-implementation-readiness`
**Output:** [`_bmad-output/planning-artifacts/implementation-readiness-report-2026-04-26.md`](_bmad-output/planning-artifacts/implementation-readiness-report-2026-04-26.md)
**Purpose:** A pre-implementation gate that audits the PRD, Architecture, Epics, and (if present) UX docs together — catches gaps and inconsistencies before code is written.

**Sub-stages walked through (6 micro-steps):**

1. **Document Discovery** — inventory all planning artifacts.
2. **PRD Analysis** — extract and audit every FR/NFR.
3. **Epic Coverage Validation** — verify every PRD FR has an epic/story.
4. **UX Alignment** — check that UX-equivalent content (in PRD + Architecture, since no separate UX doc) is consistent.
5. **Epic Quality Review** — adversarial pass for technical-milestone epics, forward dependencies, weak ACs, story sizing problems.
6. **Final Assessment** — produce a verdict and roll-up of findings.

**Note:** This skill is designed to run *after* all planning stages exist. We initially attempted it after just the PRD (which only confirmed the obvious — that downstream artifacts didn't exist yet) and then re-ran it cleanly after Stage 4.

**Outcome:** ✅ READY FOR IMPLEMENTATION. Zero critical or major issues. Six minor flags, all documented with rationale, none requiring remediation.

---

### Stage 5 — Implementation (in progress)

**Skills used per story:** `bmad-create-story` (per-story spec file with rich context) → `bmad-dev-story` (executes the spec, marks status `review`).

This stage executes the 7 stories from Stage 4 in order, producing the actual Next.js application code in the `aine/` subdirectory.

**Per-story status:**

| Story | Title | Status | Notes |
|---|---|---|---|
| 1.1 | Initialize the Next.js project | ✅ review | Next.js 16.2.4, React 19.2.4, TS 5.9.3, Tailwind 4.2.4. App scaffolded at repo root (originally in `aine/` subfolder, then flattened per user request — see story file for details). Three minor notes: Tailwind v4 uses CSS-based config; browser-console check verified server-side only; structural flatten added mid-story. |
| 1.2 | Create the types and storage modules | ✅ review | `app/lib/types.ts` and `app/lib/storage.ts` created. `localStorage` is now isolated to one module per architecture mandate. TypeScript clean, ESLint clean. |
| 1.3 | Build the empty-state page shell | ⏳ pending | |
| 1.4 | Add a todo via the form, with persistence | ⏳ pending | |
| 1.5 | Render the list of todos | ⏳ pending | |
| 1.6 | Toggle todo completion bidirectionally | ⏳ pending | |
| 1.7 | Cross-browser manual smoke test | ⏳ pending | |

**Per-story files** (rich implementation specs) live in `_bmad-output/implementation-artifacts/`:

- [`1-1-initialize-the-nextjs-project.md`](_bmad-output/implementation-artifacts/1-1-initialize-the-nextjs-project.md) — done
- [`1-2-create-types-and-storage.md`](_bmad-output/implementation-artifacts/1-2-create-types-and-storage.md) — done

---

## Workspace Layout

```
aine_v6/
├── README.md                          # this file
├── .claude/
│   └── skills/
│       └── bmad-*/                    # the BMAD skills (installed)
├── _bmad/                             # BMAD installer config + scripts
│   ├── bmm/config.yaml                # project-level config (user_name, paths, etc.)
│   ├── custom/                        # team / personal customization overrides
│   ├── core/                          # shared BMAD core
│   └── scripts/                       # helper scripts (e.g., resolve_customization.py)
├── _bmad-output/                      # BMAD-produced artifacts
│   ├── planning-artifacts/            # the artifacts we produced in Stages 1-4.5
│   │   ├── product-brief.md
│   │   ├── prd.md
│   │   ├── architecture.md
│   │   ├── epics.md
│   │   └── implementation-readiness-report-2026-04-26.md
│   └── implementation-artifacts/      # per-story implementation spec files (Stage 5)
│       └── 1-1-initialize-the-nextjs-project.md   # status: review
├── docs/                              # currently empty; reserved for project-level docs
│
├── # ────────────────  Next.js app (lives at repo root) ────────────────
├── package.json                       # Next.js 16.2.4, React 19.2.4, TS 5.9.3, Tailwind 4.2.4
├── pnpm-lock.yaml
├── tsconfig.json                      # TS strict mode enabled
├── next.config.ts
├── next-env.d.ts                      # Next.js managed; do not edit
├── postcss.config.mjs
├── eslint.config.mjs
├── AGENTS.md                          # Next.js 16 agent guidance
├── CLAUDE.md                          # also generated by create-next-app 16.2.x
├── .gitignore                         # Next.js standard
├── public/                            # static assets (default favicon, SVGs)
├── node_modules/                      # gitignored
├── .next/                             # gitignored build cache
└── app/                               # App Router pages and components
    ├── layout.tsx
    ├── page.tsx
    ├── globals.css                    # Tailwind v4 config lives here (no separate tailwind.config.ts in v4)
    ├── favicon.ico
    ├── components/                    # added in Stories 1.4–1.6
    │   ├── AddTodoForm.tsx
    │   ├── TodoList.tsx
    │   └── TodoItem.tsx
    └── lib/                           # added in Story 1.2
        ├── storage.ts                 # the only module that touches localStorage
        └── types.ts                   # Todo and StoredState types
```

**Why the flat structure:** Story 1.1 originally produced an `aine/` subfolder via `pnpm create next-app@latest aine`. Per user request after Task 3 of Story 1.1, all Next.js files were moved up to the repo root and the `aine/` directory was removed. The BMAD planning artifacts (`_bmad-output/`, `_bmad/`) and the Next.js app code now share the same root, but the namespacing keeps them clearly separated.

---

## How Each BMAD Skill Works (Mechanically)

Every BMAD skill follows the same shape:

1. **Activation block** at the top of `SKILL.md` — resolves customization (via `python3 _bmad/scripts/resolve_customization.py`), loads project config (`_bmad/bmm/config.yaml`), greets the user, and loads `step-01-*.md`.

2. **Sequential step files** under `steps/` — each step is a self-contained markdown file with strict execution rules (`🛑 NEVER do X`, `📖 ALWAYS read complete step file`, etc.). Steps are loaded one at a time; the LLM is forbidden from reading ahead.

3. **A/P/C menus** at most steps — `[A]` = Advanced Elicitation (deeper critique), `[P]` = Party Mode (multi-agent perspectives), `[C]` = Continue. The skill halts and waits for user selection. Only `C` advances.

4. **Append-only document building** — the artifact file is built up across steps via Edit/Write operations. Frontmatter tracks `stepsCompleted` so a skill can be resumed mid-flow.

5. **Final completion step** — marks `status: complete` in frontmatter, points the user to the next recommended skill.

This structure makes the LLM behave more like a disciplined facilitator and less like a freeform content generator — which is the point.

---

## Key Files in `_bmad/`

- **`_bmad/bmm/config.yaml`** — project-level configuration. `user_name`, `communication_language`, `document_output_language`, paths for `planning_artifacts` and `implementation_artifacts`, etc.
- **`_bmad/scripts/resolve_customization.py`** — every skill activation calls this. It merges `customize.toml` (skill default) → `_bmad/custom/<skill>.toml` (team override) → `_bmad/custom/<skill>.user.toml` (personal override) and returns the resolved workflow block.
- **`_bmad/core/`** — shared BMAD core (templates, common utilities).
- **`_bmad/custom/`** — currently empty for this project. Where you'd put project-specific overrides (e.g., a different brief template, custom activation steps).

---

## Reading the Artifacts

The artifacts in `_bmad-output/planning-artifacts/` are **the source of truth** for everything about this project. They were produced in dependency order, and each downstream artifact references the upstream ones:

- **`product-brief.md`** — the *why*.
- **`prd.md`** — the *what* (FRs, NFRs, success criteria, journeys, scope).
- **`architecture.md`** — the *how* (decisions, patterns, file structure).
- **`epics.md`** — the *implementation plan* (epic + stories with ACs).
- **`implementation-readiness-report-2026-04-26.md`** — the *audit* of all of the above.

Any code change should trace back through these documents. If a change requires an architecture revision, update `architecture.md` first; same pattern at every level.

---

## Project Status

| Stage | Status |
|---|---|
| 1. Product Brief | ✅ Complete |
| 2. PRD | ✅ Complete |
| 3. Architecture | ✅ Complete |
| 4. Epics & Stories | ✅ Complete |
| 4.5. Readiness Validation | ✅ Complete — green light |
| 5. Implementation | 🔄 In progress — Stories 1.1 + 1.2 done; 1.3 next |

**Next step:** Create the per-story file for Story 1.3 (empty-state page shell), then implement it.

---

## A Note on Honesty

This project is a learning exercise. Several BMAD stages (domain requirements, innovation analysis, dedicated UX) were deliberately skipped because they don't apply to a single-screen local todo app. Those skips are documented as deliberate scope decisions, not oversights. The architecture and epic-quality reviews are also honest about minor concerns (deferred styling decisions, scaffolding stories framed for developers rather than end-users) rather than glossing them over.

This honesty is itself part of the BMAD discipline. The artifact trail is meant to be defensible, not impressive.
