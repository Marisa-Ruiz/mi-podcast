# Contract: Embedded Content Schema

**Feature**: Modern Podcast Website (`001-podcast-website`)
**Type**: Data contract for repository-embedded mock content (no network API)
**Source**: spec.md FR-005, FR-006, FR-008; data-model.md; research.md D3

## Interfaces

The site exposes three typed content modules consumed by pages at build
time. They are the single source of truth; no runtime fetching (FR-006).

```text
src/content/show.ts    → export const show: Show
src/content/episodes.ts → export const episodes: Episode[]   // length 20
src/content/faq.ts     → export const faqItems: FaqItem[]
src/content/nav.ts     → export const navLinks: NavLink[]    // 4 entries
```

## Field Schemas

### Show

```text
title:          string        (required, non-empty)
tagline:        string        (required)
description:    string        (required)
artworkUrl:     string        (required, path exists under public/)
hosts:          Host[]        (required, length >= 1)
  ├ name:       string        (required)
  ├ role?:      string
  ├ bio?:       string
  └ imageUrl?:  string        (if present, path exists under public/)
releaseCadence?: string
contactEmail?:  string        (if present, valid email format)
socialLinks?:   { label: string; url: string }[]
```

### Episode

```text
slug:             string        (required, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, unique)
number:           integer       (required, > 0, unique)
title:            string        (required, non-empty)
publishedAt:      string        (required, /^\d{4}-\d{2}-\d{2}$/, valid date)
durationSeconds:  integer       (required, > 0)
description:      string        (required, non-empty)
longDescription?: string
audioUrl:         string|null   (path exists under public/audio/ OR null)
artworkUrl?:      string        (path exists under public/; else show fallback)
featured?:        boolean       (at most one true across the array)
```

### FaqItem

```text
question: string   (required, non-empty)
answer:   string   (required, non-empty)
order:    integer  (required, unique)
```

### NavLink

```text
label: string   (required)
href:  string   (required, one of: /, /episodes, /about, /faq)
```

## Invariants (machine-checkable)

| ID | Invariant | Linked requirement |
|----|-----------|--------------------|
| INV-1 | `episodes.length === 20` | FR-002 |
| INV-2 | `slug` unique, `number` unique | FR-005, data integrity |
| INV-3 | All `publishedAt` are valid ISO-8601 dates | Principle V |
| INV-4 | Count of `featured === true` ≤ 1 | FR-008 |
| INV-5 | Every local asset path resolves to a file in `public/` | Principle V, SC-006 |
| INV-6 | `navLinks` exactly covers the four routes | FR-010, SC-003 |
| INV-7 | No `TODO` / `TBD` / `[placeholder]` markers in shipped content | Principle V |
| INV-8 | FAQ `order` unique; sequence dense or sorted-stable | FR-004 |

## Change Policy

- Adding/removing episodes requires updating `episodes.ts` **and** passing
  INV-1…INV-7 — content edits are schema-checked, never free-form.
- The site must never reference an external feed, CMS, or API in any
  content module (FR-006).
