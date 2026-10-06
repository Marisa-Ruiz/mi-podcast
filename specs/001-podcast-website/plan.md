# Implementation Plan: Modern Podcast Website

**Branch**: `001-podcast-website` | **Date**: 2026-10-02 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-podcast-website/spec.md`

## Summary

Build an elegant, distinctive, fully static podcast website with four pages
(landing with one featured episode, Episodes, About, FAQ), 20 mocked
episodes with embedded data, in-page audio playback, and a responsive,
accessible design. Technical approach (from user input): **Next.js configured
for static export**, no databases or server runtime, all episode data
embedded in the repository as source content.

## Technical Context

**Language/Version**: TypeScript (strict) on Next.js 15+ / React 19 — chosen
as the ecosystem default; user specified Next.js only, TS assumed per
industry convention (see research.md D1)

**Primary Dependencies**: Next.js (static export mode), React, styling via
Tailwind CSS (decision D2), native HTML `<audio>` for playback (decision D4)

**Storage**: N/A — no database; mock episode/show/FAQ data embedded as typed
content modules in the repository (decision D3)

**Testing**: Vitest for unit/component tests, Playwright for end-to-end
browser flows, production build as a release gate (decision D5)

**Target Platform**: Evergreen mobile & desktop browsers; deployable to any
static host/CDN (per constitution: Static-Only Delivery)

**Project Type**: Web application (static site, single deployable unit)

**Performance Goals**: Landing page usable in <3s on typical mobile
connection (SC-007); no layout breakage 320px–1920px (SC-004)

**Constraints**: Constitution v1.0.0 — static-only output, template-driven
shared layouts, WCAG AA contrast + keyboard navigation, minified assets,
no unjustified third-party scripts, unique title/meta/canonical per page,
ISO-8601 dates, zero broken links

**Scale/Scope**: 4 pages, 20 episodes, 1 shared nav/footer, ~1 data module
set — small single-site scope

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| # | Gate | Status | Evidence |
|---|------|--------|----------|
| I | Static-Only Delivery (NON-NEGOTIABLE) | ✅ PASS | Next.js static export produces only HTML/CSS/JS/assets; no server runtime, DB, or server API. Audio playback is client-side `<audio>`. |
| II | Template-Driven Structure | ✅ PASS | All four pages render from shared Next.js layouts/partials (header, nav, footer); no one-off hand-written HTML. |
| III | Responsive & Accessible | ✅ PASS | Mobile-first responsive layout (SC-004); semantic HTML, alt text, AA contrast, keyboard-reachable player (SC-005) are explicit requirements FR-011/FR-012. |
| IV | Performance Budget | ✅ PASS | Built-in asset minification; images sized/compressed to display dimensions; third-party scripts avoided (analytics out of scope); content readable without JS (FR/edge case). |
| V | Content Integrity | ✅ PASS | Static link check in validation; ISO-8601 dates enforced in data validation (research D3); placeholder branding documented in Assumptions, not shipped as "draft" markers. |
| Tech Constraints | Existing template/stack, repo-hosted content, SEO minimums | ✅ PASS | Next.js static export is the approved stack (user decision); all data in repo; per-page title/meta/canonical via metadata API. |
| Workflow | Local build verified, automated deploy from main | ✅ PASS | Production build is a hard gate in quickstart/CI; deployment automation is out of this feature's scope but noted as follow-up. |

**Gate result: PASS — no violations, Complexity Tracking table stays empty.**

## Project Structure

### Documentation (this feature)

```text
specs/001-podcast-website/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   ├── routes.md        # Page/route contract
│   └── data-schema.md   # Embedded content schema contract
├── checklists/
│   └── requirements.md  # Spec quality checklist (/speckit.specify)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── layout.tsx            # Root layout: header, nav, footer partials
│   ├── page.tsx              # Landing page (featured episode)
│   ├── episodes/page.tsx     # Episodes catalog (20 entries)
│   ├── about/page.tsx        # About page
│   ├── faq/page.tsx          # FAQ page
│   └── not-found.tsx         # Branded 404 (FR-014)
├── components/
│   ├── layout/               # SiteHeader, SiteNav, SiteFooter
│   ├── episode/              # EpisodeCard, EpisodeList, FeaturedEpisode, AudioPlayer
│   └── ui/                   # shared presentational primitives
├── content/
│   ├── episodes.ts           # 20 mocked episodes (typed, embedded)
│   ├── show.ts               # Show identity/branding data
│   └── faq.ts                # FAQ items
├── lib/
│   └── validation.ts         # Content schema checks (dates, uniqueness)
└── styles/                   # Global styles / design tokens

tests/
├── unit/                     # content validation, helpers (Vitest)
└── e2e/                      # page flows, playback, responsive (Playwright)

public/
├── audio/                    # mocked/sample audio files
└── images/                   # show + episode artwork (compressed)
```

**Structure Decision**: Single Next.js application (Option 1, web-app shape).
One deployable static unit; content lives under `src/content/` as embedded,
typed mock data per the user's "no database, data embedded" constraint.
Components grouped by domain (layout/episode/ui) to enforce the shared-layout
rule from Constitution Principle II.

## Complexity Tracking

> No constitution violations — table intentionally empty.
