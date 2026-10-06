# Quickstart & Validation Guide

**Feature**: Modern Podcast Website (`001-podcast-website`)
**Purpose**: Run-order validation that proves the feature works end-to-end.
Implementation code belongs in tasks.md / the implementation phase.

## Prerequisites

- Node.js LTS (18.18+ / 20+) and npm or pnpm installed
- Repo checked out; dependencies installed (`npm install`)
- A modern browser + one mobile-width emulation (Playwright provides this)

## Setup & Run

```bash
# 1. Install
npm install

# 2. Unit tests — content schema invariants (data-schema.md INV-1…INV-8)
npm test                # Vitest

# 3. Local development (for manual inspection)
npm run dev             # → http://localhost:3000

# 4. Production static export (hard gate — must succeed, Constitution: build verified)
npm run build           # next build with output: 'export'

# 5. Serve the exported output and check links (Principle V, SC-006)
npm run serve:static    # any static file server over the export directory
npm run check:links     # internal link + asset check against export

# 6. End-to-end flows (run against the static export)
npm run test:e2e        # Playwright
```

## Validation Scenarios

### V1 — Landing page (FR-001, SC-001, SC-007)

1. Open `/`.
2. **Expect**: site identity visible, nav shows 4 links, exactly **one**
   featured episode card (title, date, duration, description, play control).
3. Lighthouse/mobile check: content visible < 3s (SC-007).

### V2 — Episodes catalog (FR-002, FR-005, SC-002)

1. Open `/episodes`.
2. **Expect**: exactly **20** episode entries; each shows number, title,
   `YYYY-MM-DD` date, duration, description, artwork or shared fallback.
3. Automated assertion: count === 20 fails the e2e run otherwise.

### V3 — Playback (FR-007, spec edge cases)

1. On landing or episodes page, activate a play control (click or keyboard).
2. **Expect**: playback starts / player shows `playing` state; toggle again →
   `paused`. No page reload.
3. Episode with `audioUrl: null` (if present in fixtures): player shows the
   graceful `unavailable` state — never a raw browser error.

### V4 — About & FAQ (FR-003, FR-004, US3)

1. Open `/about`: show description + host info present.
2. Open `/faq`: ordered Q&A list; if collapsible, toggling reveals the
   answer without reload; with JS disabled, answers remain readable.

### V5 — Navigation & 404 (FR-010, FR-014, SC-003)

1. From each of the 4 pages, reach every other page in ≤ 1 click.
2. Visit an unknown URL: branded 404 with working nav.
3. `npm run check:links`: zero broken internal links (SC-006).

### V6 — Responsive & accessible (FR-011, FR-012, SC-004, SC-005)

1. Playwright viewports: 320px, 768px, 1920px — no overlap, clipping, or
   horizontal scroll on any of the four pages.
2. Keyboard-only pass: tab through nav and player; Space/Enter toggles
   playback; focus always visible; `aria-current` marks active page.
3. Contrast spot-check on palette tokens ≥ WCAG AA.

### V7 — Static & content integrity (FR-006, FR-013, Principles I & V)

1. `npm run build` output contains only static assets — no server code
   required to serve it.
2. Grep/export check: no external feed or API references in content modules.
3. Schema tests confirm no `TODO`/`TBD`/placeholder markers shipped (INV-7).

## Expected Outcome

All commands exit 0; every scenario above passes; the exported directory can
be served by any static host and behaves identically to `npm run dev`.

## Troubleshooting

- **Images not rendering in export**: ensure `images.unoptimized` or
  pre-sized static assets (research D1 caveat).
- **Link checker flags hash links**: ensure anchors resolve to element IDs.
- **Count assertion fails**: content edit broke INV-1 — see
  contracts/data-schema.md change policy.
