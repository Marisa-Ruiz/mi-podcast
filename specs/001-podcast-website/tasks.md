---

description: "Task list template for feature implementation"
---

# Tasks: Modern Podcast Website

**Input**: Design documents from `/specs/001-podcast-website/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/](./contracts/), [quickstart.md](./quickstart.md)

**Tests**: Included — plan.md (Testing: Vitest + Playwright) and quickstart.md make unit/e2e tests runnable validation gates, so test tasks are part of the deliverable.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Single Next.js application at repository root: `src/`, `tests/`, `public/` per plan.md Project Structure. All paths below are repository-relative.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Initialize Next.js + TypeScript (strict) project at repository root per plan.md: create `package.json`, `tsconfig.json`, `next.config.mjs` with `output: 'export'`, and `src/app/` skeleton (research D1)
- [X] T002 [P] Configure Tailwind CSS and wire the global stylesheet at `src/styles/globals.css` (research D2)
- [X] T003 [P] Configure ESLint + Prettier in `.eslintrc.json` / `.prettierrc` at repository root
- [X] T004 [P] Add npm scripts to `package.json`: `dev`, `build`, `test`, `test:e2e`, `serve:static`, `check:links` exactly as required by quickstart.md Setup & Run
- [X] T005 [P] Create static asset structure `public/audio/` and `public/images/` per plan.md source tree

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**?? CRITICAL**: No user story work can begin until this phase is complete

- [X] T006 Define shared content types — `Show`, `Host`, `Episode`, `FaqItem`, `NavLink` — in `src/content/types.ts`, encoding data-model.md constraints verbatim: slug `/^[a-z0-9]+(?:-[a-z0-9]+)*$/` and unique; `number` integer > 0 and unique; `publishedAt` `/^\d{4}-\d{2}-\d{2}$/` valid date; `durationSeconds` integer > 0; `audioUrl` `string | null`; at most one `featured === true`
- [X] T007 Implement content schema validator in `src/lib/validation.ts` enforcing INV-1…INV-8 exactly as specified in contracts/data-schema.md (20 episodes, unique slug/number/order, ISO dates, asset paths exist, nav covers 4 routes, no TODO/TBD/[placeholder] markers)
- [X] T008 [P] Create show identity content module `src/content/show.ts` with invented placeholder branding (spec Assumptions) — title, tagline, description, artwork at `public/images/`, ≥ 1 host
- [X] T009 Create navigation content `src/content/nav.ts` with exactly 4 links: `/`, `/episodes`, `/about`, `/faq` (INV-6, FR-010)
- [X] T010 Implement root layout with shared partials `src/app/layout.tsx` plus `src/components/layout/SiteHeader.tsx`, `src/components/layout/SiteNav.tsx`, `src/components/layout/SiteFooter.tsx` rendering `navLinks` on every page (Constitution II, FR-010)
- [X] T011 Create design-token layer in `src/styles/tokens.css`: typography scale, WCAG AA contrast palette, `:focus-visible` styles, `prefers-reduced-motion` support (Constitution III/IV, research D2)
- [X] T012 Create branded not-found page `src/app/not-found.tsx` with working shared navigation (FR-014)
- [X] T013 [P] Write unit tests for schema invariants INV-1…INV-8 in `tests/unit/content-schema.test.ts` (Vitest; quickstart step 2) — tests must fail until T014 content exists for INV-1

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Discover the show on an elegant landing page (Priority: P1) ?? MVP

**Goal**: Elegant landing page with site identity, navigation, and exactly one featured episode with working playback

**Independent Test**: Open `/` and verify branding + exactly one featured episode card with a functioning play control; no other pages required (spec US1 Acceptance Scenarios 1–4)

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T014 [P] [US1] Playwright landing test in `tests/e2e/landing.spec.ts` covering quickstart V1 (identity, nav, exactly one featured episode) and V3 (play/pause toggle, no reload)

### Implementation for User Story 1

- [X] T015 [US1] Create `src/content/episodes.ts` with exactly 20 mocked episodes per contracts/data-schema.md Episode schema — title, number, `YYYY-MM-DD` date, durationSeconds, description, audioUrl, artwork or fallback; no external feed references (FR-002, FR-005, FR-006, INV-1…INV-5)
- [X] T016 [US1] Implement episode helpers in `src/lib/episodes.ts`: featured derivation (explicit `featured` flag, else newest by `publishedAt`), sort descending by date, duration formatting (FR-008, data-model derived views)
- [X] T017 [P] [US1] Implement `AudioPlayer` component in `src/components/episode/AudioPlayer.tsx`: native `<audio>`, states `idle | playing | paused | unavailable`, Space/Enter keyboard toggle, `audioUrl: null` renders graceful `unavailable` state (FR-007, spec edge case, research D4)
- [X] T018 [P] [US1] Add mocked sample audio files to `public/audio/` and placeholder episode/show artwork to `public/images/` compressed and sized to display dimensions (INV-5, Constitution IV)
- [X] T019 [US1] Implement `FeaturedEpisode` component in `src/components/episode/FeaturedEpisode.tsx` — hero block with title, description, date, duration, `AudioPlayer` (FR-001, FR-008)
- [X] T020 [US1] Build landing page `src/app/page.tsx`: site identity, `FeaturedEpisode`, shared nav via layout, unique title/meta description/canonical (FR-001, Constitution SEO minimums)
- [X] T021 [US1] Validate User Story 1: run quickstart V1 + V3 and the static export gate `npm run build` (Constitution Workflow: build verified)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently — MVP deliverable

---

## Phase 4: User Story 2 - Browse the full episode catalog (Priority: P2)

**Goal**: Episodes page listing all 20 mocked episodes with full metadata and playback

**Independent Test**: Open `/episodes` directly and verify exactly 20 episodes with metadata; select one and play it (spec US2 Acceptance Scenarios 1–4)

### Tests for User Story 2

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T022 [P] [US2] Playwright catalog test in `tests/e2e/episodes.spec.ts` asserting count === 20, metadata presence and format, and play control behavior (quickstart V2, SC-002)

### Implementation for User Story 2

- [ ] T023 [P] [US2] Implement `EpisodeCard` component in `src/components/episode/EpisodeCard.tsx`: number, title, `YYYY-MM-DD` date, formatted duration, description, artwork with `show.artworkUrl` fallback, play control (FR-005)
- [ ] T024 [P] [US2] Implement `EpisodeList` component in `src/components/episode/EpisodeList.tsx` rendering episodes sorted by `publishedAt` descending (data-model derived views)
- [ ] T025 [US2] Build Episodes page `src/app/episodes/page.tsx` rendering all 20 episodes via `EpisodeList` with unique title/meta/canonical (FR-002, Constitution SEO minimums)
- [ ] T026 [US2] Validate User Story 2: run quickstart V2 + playback V3 and `npm run build` gate

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Learn about the show and get answers (Priority: P3)

**Goal**: About page with show/host info and FAQ page with expandable, JS-resilient answers

**Independent Test**: Open `/about` and `/faq` directly; verify content renders and FAQ toggles without reload (spec US3 Acceptance Scenarios 1–4)

### Tests for User Story 3

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T027 [P] [US3] Playwright tests in `tests/e2e/about-faq.spec.ts` covering quickstart V4: About content present, FAQ ordered list, toggle reveals answer without reload, answers readable with JS disabled

### Implementation for User Story 3

- [ ] T028 [P] [US3] Create `src/content/faq.ts` with FAQ items per contracts/data-schema.md — question/answer non-empty, unique `order`, sorted display (FR-004, INV-8)
- [ ] T029 [P] [US3] Build About page `src/app/about/page.tsx` rendering show description and host/production info from `src/content/show.ts` with unique title/meta/canonical (FR-003)
- [ ] T030 [US3] Implement `FaqAccordion` component in `src/components/ui/FaqAccordion.tsx`: expand/collapse without page reload, fully readable content with JavaScript disabled (FR-004, spec edge case, Constitution IV)
- [ ] T031 [US3] Build FAQ page `src/app/faq/page.tsx` composing `FaqAccordion` with unique title/meta/canonical (FR-004, Constitution SEO minimums)
- [ ] T032 [US3] Validate User Story 3: run quickstart V4 and `npm run build` gate

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories; full acceptance validation

- [ ] T033 [P] Responsive verification across all 4 pages at 320px / 768px / 1920px in `tests/e2e/responsive.spec.ts` — no overlap, clipping, or horizontal scroll (SC-004, FR-011)
- [ ] T034 [P] Keyboard & accessibility pass in `tests/e2e/a11y.spec.ts`: tab through nav and player, Space/Enter toggles playback, visible focus, `aria-current="page"` on active nav link (SC-005, FR-012, Constitution III)
- [ ] T035 [P] Implement internal link + asset checker script in `scripts/check-links.mjs` wired to `npm run check:links`, run against the static export output (SC-006, Constitution V)
- [ ] T036 [P] Run content integrity scan (INV-7) for `TODO`/`TBD`/`[placeholder]` markers across shipped content via `tests/unit/content-schema.test.ts` (Constitution V)
- [ ] T037 SEO metadata audit across `/`, `/episodes`, `/about`, `/faq`: unique title, unique meta description, matching canonical URL per page (Constitution SEO minimums)
- [ ] T038 Performance pass: compress and size images to display dimensions, confirm minified output and zero third-party scripts, core content readable with JavaScript disabled (SC-007, Constitution IV)
- [ ] T039 Execute full quickstart.md validation — scenarios V1 through V7 with `npm test`, `npm run build`, `npm run test:e2e`, `npm run check:links` — fix any regressions
- [ ] T040 Update `README.md` with setup, dev, build, test, and static-deploy instructions (Constitution Development Workflow: build verified, automated deploy from main)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
  - T006 → T007 → T013 (types → validator → tests)
  - T008, T009 independent of each other; both feed T010
- **User Story 1 (Phase 3)**: Depends on Foundational (Phase 2); episodes data (T015) is reused by US2
- **User Story 2 (Phase 4)**: Depends on Foundational + US1's `src/content/episodes.ts` (T015) and `AudioPlayer` (T017); card/list work is otherwise independent
- **User Story 3 (Phase 5)**: Depends on Foundational only (show/nav/layout from Phase 2) — independent of US1/US2 data
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories → MVP
- **User Story 2 (P2)**: Needs US1's episode content (T015) and `AudioPlayer` (T017); otherwise independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - fully independent of US1/US2

### Within Each User Story

- Tests before implementation (must FAIL first)
- Content data → components → pages → validation run
- Story complete before moving to next priority

### Parallel Opportunities

- Phase 1: T002, T003, T004, T005 all parallel after T001
- Phase 2: T008 ∥ T009 ∥ T011 ∥ T013 (different files)
- US1: T014 (test) ∥ T017 (player) ∥ T018 (assets) can run in parallel
- US2: T022 (test) ∥ T023 (card) ∥ T024 (list) in parallel
- US3: T027 (test) ∥ T028 (faq content) ∥ T029 (about page) in parallel
- Polish: T033 ∥ T034 ∥ T035 ∥ T036
- Once Foundational completes: US1 ∥ US3 in parallel (different content/files); US2 follows US1's data

---

## Parallel Example: User Story 1

```bash
# Launch test + independent components together:
Task: "Playwright landing test in tests/e2e/landing.spec.ts (T014)"
Task: "AudioPlayer component in src/components/episode/AudioPlayer.tsx (T017)"
Task: "Mock audio + artwork assets in public/ (T018)"

# Then sequentially: episodes data (T015) → helpers (T016) → FeaturedEpisode (T019) → page (T020)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: quickstart V1/V3 + `npm run build` (T021)
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Polish phase → full V1–V7 acceptance run
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (landing + episodes data + player)
   - Developer B: User Story 3 (About + FAQ — fully independent files)
3. After US1 lands: Developer A/C pick up User Story 2 (catalog)
4. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- All content is mocked and embedded in the repo — no feeds, APIs, or databases (FR-006, Constitution Principle I)
