# Phase 0: Research & Decisions

**Feature**: Modern Podcast Website (`001-podcast-website`)
**Date**: 2026-10-02
**Status**: Complete — no NEEDS CLARIFICATION items remain in plan.md

## D1. Language & Framework Configuration

**Decision**: TypeScript (strict) with Next.js App Router, configured with
`output: 'export'` for fully static generation of all four routes.

**Rationale**: User specified "Next.js with static site configuration".
Static export satisfies Constitution Principle I (Static-Only Delivery)
while giving file-based routing, built-in metadata/SEO support, and shared
layouts (Principle II). TypeScript is the ecosystem default and gives
compile-time validation of the embedded mock data.

**Alternatives considered**:
- Pages Router — works for static export but App Router is current default.
- Plain HTML/CSS/JS — no user said Next.js.
- Next.js with server rendering — violates Principle I; rejected.

**Static-export caveats to honor** (from framework constraints):
- No server-only features (middleware rewrites, route handlers requiring a
  server, server actions) — none needed for this feature.
- Image optimization via server is unavailable; use `images.unoptimized`
  or pre-sized static assets — aligns with Principle IV (size images to
  display dimensions).

## D2. Styling & Design System Approach

**Decision**: Tailwind CSS with a small custom design-token layer
(typography scale, color palette, spacing, subtle motion) to deliver the
"elegant, distinctive" requirement (FR-009).

**Rationale**: Utility-first styling keeps shared components consistent
(Principle II), ships no runtime CSS-in-JS cost (Principle IV), and makes
the AA-contrast palette (Principle III) explicit in tokens. Distinctiveness
comes from a deliberate palette + type pairing, not from a generic template
theme.

**Alternatives considered**:
- CSS Modules — viable, slower to establish a cohesive system by hand.
- Component library (e.g., MUI/Chakra) — heavier bundle, generic look;
  conflicts with "stand out" and performance budget.
- CSS-in-JS — runtime cost; rejected under Principle IV.

**Accessibility guardrails**: contrast-checked palette tokens (WCAG AA),
visible focus states, reduced-motion support (`prefers-reduced-motion`).

## D3. Mock Data Storage & Content Embedding

**Decision**: Typed TypeScript modules under `src/content/`
(`episodes.ts`, `show.ts`, `faq.ts`) exported as typed constants, validated
by a small runtime schema check in `src/lib/validation.ts` run as a
pre-build/test step.

**Rationale**: User constraint: "no databases — data is embedded in the
content for the mock episodes." TS modules give type safety at zero runtime
cost, are tree-shaken into the static build, and let tests enforce Content
Integrity (Principle V): ISO-8601 dates, unique episode numbers, unique
slugs, exactly 20 episodes.

**Alternatives considered**:
- Markdown/MDX files — good for long-form prose; overkill for structured
  episode records and adds a content pipeline.
- JSON fetched at runtime — extra fetch and failure mode; rejected.
- Headless CMS / real feed — explicitly excluded by user and by FR-006.

**Validation rules encoded** (from spec FR-002/FR-005, Principle V):
- Exactly 20 episodes; episode numbers unique and positive.
- Slugs unique; dates `YYYY-MM-DD`; durations positive.
- Every episode has title, date, duration, description, audio source,
  artwork (or shared fallback).

## D4. Audio Playback

**Decision**: Native HTML `<audio>` element wrapped in a small accessible
`AudioPlayer` component (play/pause, progress display, keyboard operable).
No third-party audio library.

**Rationale**: Satisfies FR-007 with zero dependencies (Principle IV
"third-party scripts avoided unless justified"). Native element inherits
browser accessibility and mobile autoplay/gesture rules. Graceful fallback
state when audio file is missing (spec edge case).

**Alternatives considered**:
- Howler.js / audio libraries — unnecessary weight for play/pause only.
- Embedded platform players (Spotify/YouTube) — external scripts, real
  services; violates FR-006 spirit and the performance budget.

## D5. Testing & Validation Strategy

**Decision**:
- **Vitest** — unit tests for content schema validation and small helpers.
- **Playwright** — e2e for the four critical flows (landing, episodes
  catalog, playback interaction, FAQ toggle) plus responsive checks at
  320px/768px/1920px and keyboard navigation.
- **Production build gate** — `next build` (static export) must succeed;
  internal link check run against exported output (Principle V, SC-006).

**Rationale**: Matches spec success criteria (SC-002…SC-006, SC-007) with
technology-appropriate tools; static export makes link checking trivial.

**Alternatives considered**:
- Playwright only — slower inner loop for pure data validation.
- Cypress — comparable; Playwright chosen for multi-viewport/mobile
  emulation ergonomics.

## D6. Typography, Fonts & Artwork

**Decision**: Self-hosted fonts loaded at build time (bundled font files),
coupled with a curated type scale; show/episode artwork generated as
static placeholder assets in `public/images/` (compressed, sized to display
dimensions).

**Rationale**: Build-time fonts avoid render-blocking network requests
(Principle IV); placeholder branding matches the spec Assumption that no
real brand assets were supplied, and static images keep Principle IV's
"compressed and sized to display dimensions" enforceable.

**Alternatives considered**:
- Runtime Google Fonts CDN — extra third-party request; rejected.
- Waiting for real brand assets — blocks the feature; use placeholders
  that can be swapped 1:1 later.

## Research Summary

| ID | Unknown | Resolution |
|----|---------|------------|
| D1 | Framework/stack details | Next.js static export + TypeScript strict |
| D2 | Styling approach for "elegant/distinctive" | Tailwind + custom design tokens |
| D3 | Where embedded mock data lives | Typed TS content modules + schema validation |
| D4 | Audio playback mechanism | Native `<audio>` wrapper component |
| D5 | Testing tooling | Vitest + Playwright + build/link gates |
| D6 | Fonts/artwork strategy | Build-time fonts, static placeholder artwork |

All plan.md unknowns resolved; proceeding to Phase 1 design.
