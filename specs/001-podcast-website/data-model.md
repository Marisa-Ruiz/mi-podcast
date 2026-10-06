# Phase 1: Data Model

**Feature**: Modern Podcast Website (`001-podcast-website`)
**Date**: 2026-10-02
**Source**: spec.md § Key Entities, FR-002/FR-005/FR-006, research.md D3

All entities are static, embedded content — no persistence layer, no state
transitions beyond presentation state (e.g., player play/pause).

## Entities

### Show

Represents the podcast program identity shown across the site.

| Field | Type | Required | Validation / Notes |
|-------|------|----------|--------------------|
| `title` | string | yes | Non-empty; used in page titles/meta |
| `tagline` | string | yes | Short hero/landing copy |
| `description` | string | yes | About page + meta description source |
| `artworkUrl` | string | yes | Path under `public/`; must exist (Principle V) |
| `hosts` | Host[] | yes | At least one host |
| `releaseCadence` | string | no | Displayed on About/FAQ (e.g., "Weekly") |
| `contactEmail` | string | no | Format-checked if present |
| `socialLinks` | Link[] | no | Each: `label`, `url` — internal links must resolve |

**Host**: `{ name: string; role?: string; bio?: string; imageUrl?: string }`
— `name` required; images must exist if provided.

### Episode

One show installment; the core catalog record. Exactly **20** instances
(FR-002).

| Field | Type | Required | Validation / Notes |
|-------|------|----------|--------------------|
| `id` / `slug` | string | yes | URL-safe, unique across episodes |
| `number` | integer | yes | > 0, unique across episodes |
| `title` | string | yes | Non-empty |
| `publishedAt` | string | yes | ISO-8601 date `YYYY-MM-DD` (Principle V) |
| `durationSeconds` | integer | yes | > 0 (displayed as mm:ss / h:mm:ss) |
| `description` | string | yes | Short summary shown in list + landing |
| `longDescription?` | string | no | Episode detail expansion |
| `audioUrl` | string \| null | yes | Path under `public/audio/` that exists, or `null` → graceful player state (spec edge case) |
| `artworkUrl?` | string | yes* | Path under `public/`; falls back to `show.artworkUrl` when absent |
| `featured` | boolean | no | At most **one** episode may be `true`; default = newest by `publishedAt` (FR-008) |

**Derived views** (not stored): `latestEpisode`, `featuredEpisode`,
`episodesByDateDesc`.

### FaqItem

A question/answer pair on the FAQ page (FR-004).

| Field | Type | Required | Validation / Notes |
|-------|------|----------|--------------------|
| `question` | string | yes | Non-empty |
| `answer` | string | yes | Non-empty; may contain simple markup |
| `order` | integer | yes | Unique; controls display sequence |

### NavLink

Shared navigation contract (FR-010), defined once and rendered by
`SiteNav` in the root layout.

| Field | Type | Required | Validation / Notes |
|-------|------|----------|--------------------|
| `label` | string | yes | "Home", "Episodes", "About", "FAQ" |
| `href` | string | yes | `/`, `/episodes`, `/about`, `/faq` — all must resolve |

## Relationships

```text
Show 1 ──── * Episode        (all episodes belong to the single show)
Show 1 ──── * Host           (hosts[] on Show)
Show 1 ──── 1 SiteNav set    (NavLink[] shared across pages)
Show 1 ──── * FaqItem        (FAQ belongs to the show)
Episode * ── 0..1 artwork    (falls back to Show.artworkUrl)
```

## Validation Rules (summary)

Enforced by `src/lib/validation.ts` in unit tests and as a pre-build check:

1. `episodes.length === 20` (FR-002).
2. `number` and `slug` unique across episodes.
3. `publishedAt` matches `^\d{4}-\d{2}-\d{2}$` and parses as a valid date.
4. `durationSeconds > 0`.
5. At most one episode with `featured === true`.
6. Every referenced local asset path (`audioUrl`, `artworkUrl`) exists in
   `public/`, or `audioUrl` is explicitly `null`.
7. FAQ `order` values unique; nav hrefs exactly cover the four pages.
8. Placeholder/draft markers MUST NOT appear in production content
   (Principle V) — checked as a string scan for `TODO`/`TBD`/`[placeholder]`.

## Presentation State (not persisted)

- `AudioPlayer`: `idle | playing | paused | unavailable` — client-side only,
  resets per page navigation.
- FAQ accordion: per-item `expanded` boolean — client-side only.
