# Product Brief: Aine — A Learning-Vehicle Todo App

## Executive Summary

Aine is a minimal todo application built as a hands-on learning vehicle for the BMAD v6 methodology. The primary deliverable is not the app itself — it is **the experience of working through every stage of the BMAD planning and implementation workflow**, producing the artifacts that BMAD prescribes (product brief, PRD, architecture, epics, stories) and culminating in working code.

The todo domain was chosen deliberately because it is small, well-understood, and forgiving — keeping cognitive load on the *process* (BMAD) rather than on the *problem* (todos). The project starts as a proof-of-concept with the smallest useful feature set and is intended to grow incrementally as the author becomes more comfortable with each BMAD stage.

This brief therefore serves dual purposes: it is the first BMAD artifact in the chain (proof that the workflow was followed), and it sets sensible scope guardrails so subsequent stages stay tractable for a first-time BMAD user.

## The Problem

The author wants to learn BMAD v6. Reading documentation alone does not build fluency — the methodology only sticks when applied to a real project, end to end, with each stage producing the artifact it is supposed to produce. Without a concrete project to anchor the learning, BMAD's stages remain abstract.

A todo app provides that anchor without introducing domain complexity that would distract from the methodology itself.

## The Solution

A deliberately small todo application, planned and built using BMAD v6 in its intended sequence:

1. **Product Brief** (this document)
2. **PRD** — requirements for the minimal todo feature set
3. **Architecture** — a simple, defensible technical design
4. **Epics & Stories** — broken-down implementation work
5. **Implementation** — working code produced via the BMAD dev workflow

The app itself supports the smallest set of behaviors that still gives BMAD's planning and implementation stages something real to chew on.

## What Makes This Different

This is not a product competing in the todo-app market. Its differentiator is **process fidelity**: the value lies in following BMAD's prescribed flow honestly, producing each artifact, and arriving at working code through the methodology — not in the novelty of the app.

A secondary differentiator is **deliberate restraint on scope**. Most learning projects fail by over-scoping. This one stays minimal at the proof-of-concept stage and grows only when the author is ready to exercise additional BMAD capabilities (e.g., adding a feature to practice the story-creation flow a second time).

## Who This Serves

- **Primary user:** Marc Levy — the learner. He uses the app only enough to verify it works.
- **Primary stakeholder:** Marc Levy — the same person, in his learner capacity. The artifacts and code exist to deepen his understanding of BMAD, not to satisfy any external reviewer.

## Success Criteria

The project succeeds when **all of the following** are true:

1. Each BMAD planning artifact exists in `_bmad-output/planning-artifacts/` and was produced via the corresponding BMAD skill.
2. At least one epic is broken down into stories using the BMAD story-creation flow.
3. The stories are implemented as real, runnable code (not pseudocode or stubs).
4. A user can add a todo, mark it complete, and see their list — locally, end-to-end.
5. The author can articulate, for each artifact, *why* BMAD asked for it and *what* it informed downstream.

Explicitly **not** success criteria: user adoption, performance, deployment, polish, accessibility audits, or comparison to existing todo apps.

## Scope

**In scope (proof-of-concept):**
- Add a todo item
- Mark a todo as complete / incomplete
- View the list of todos
- Local persistence (so the list survives a refresh / restart)

**Explicitly out of scope for the PoC** (candidates for later growth as BMAD practice continues):
- Authentication / multi-user support
- Due dates, reminders, notifications
- Categories, tags, projects, priorities
- Sync across devices
- Mobile / native apps
- Deployment to production infrastructure
- Analytics, telemetry, metrics

Technology choices are deferred to the Architecture stage. No platform, framework, or storage commitments are made here.

## Vision

If the author continues to use this project as a BMAD learning sandbox, Aine grows one BMAD-stage-exercise at a time — each new feature chosen because it lets the author practice a specific BMAD capability (e.g., "add due dates" to practice the change-management workflow; "add user accounts" to practice architecture revisions). The end state is not a shipped product, but a fluent BMAD practitioner with a working artifact trail.
