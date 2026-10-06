# Contract: Page Routes & UI Interfaces

**Feature**: Modern Podcast Website (`001-podcast-website`)
**Type**: UI contract (static site — public surface is its pages and
navigation, not a network API)
**Source**: spec.md FR-001…FR-004, FR-010, FR-014; SC-003

## Route Contract

| Route | Page | Required content | Status behavior |
|-------|------|------------------|-----------------|
| `/` | Landing | Site identity, primary nav, exactly **one** featured episode with play control (FR-001, FR-008), footer | 200 |
| `/episodes` | Episodes | List of exactly **20** episodes, each with number, title, date, duration, description, artwork/fallback, play control (FR-002, FR-005, FR-007) | 200 |
| `/about` | About | Show description, host(s)/production info (FR-003) | 200 |
| `/faq` | FAQ | Ordered Q&A list; answers visible or expandable in-page (FR-004) | 200 |
| any unknown path | Not-found | Branded 404 with working navigation (FR-014) | 404 |

## Metadata Contract (per page, Constitution: SEO minimums)

Every route MUST emit exactly one of each:

- `title` — unique across the four pages (+404 may use default)
- `description` — unique meta description
- `canonical` — absolute canonical URL matching the route
- Open Graph basics (title, description, artwork) — recommended, not gating

## Navigation Contract (FR-010)

Rendered by the shared layout on **every** page:

```text
Home (/) · Episodes (/episodes) · About (/about) · FAQ (/faq)
```

- Links are plain navigable anchors (work without JavaScript).
- Current page is indicated (e.g., `aria-current="page"`).
- Mobile: collapse pattern must remain keyboard- and touch-operable.

## Component Interfaces (internal UI contracts)

```text
SiteHeader / SiteNav / SiteFooter
  input : NavLink[] (data-model.md), show identity (title, artwork)
  output: shared chrome on all routes

FeaturedEpisode
  input : Episode (featured or derived-latest per FR-008)
  output: hero block with title, description, date, duration, AudioPlayer

EpisodeList
  input : Episode[] (sorted by publishedAt desc)
  output: 20 EpisodeCard entries

EpisodeCard
  input : Episode
  output: metadata row + play control; whole-card link to detail/anchor

AudioPlayer
  input : audioUrl (string | null)
  output: states idle | playing | paused | unavailable;
          keyboard operable (Space/Enter toggles);
          unavailable state shown when audioUrl is null

FaqAccordion
  input : FaqItem[] (sorted by order)
  output: expandable Q&A pairs; readable without JavaScript
```

## Behavioral Contract (acceptance anchors)

1. Landing shows **exactly one** featured episode — never a list.
2. Episodes page count is **exactly 20** — verified by automated check.
3. Play control toggles playback without page reload; missing audio →
   `unavailable` state, never a raw error.
4. All in-page and navigation links resolve (zero broken links, SC-006).
5. Pages render readable core content with JavaScript disabled
   (Constitution Principle IV; FAQ may default to expanded).
