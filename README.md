# mi-podcast

<img width="1920" height="1532" alt="image" src="https://github.com/user-attachments/assets/29079f75-89a3-470c-93fd-d164d262d58f" />

A modern, elegant podcast website — fully static, four pages, 20 mocked
episodes with in-page audio playback. Built with Next.js (static export),
TypeScript, and Tailwind CSS. No databases, no feeds, no server runtime:
all content is embedded in the repository as typed TypeScript modules.

## Pages

| Route | Content |
|-------|---------|
| `/` | Landing page with site identity and one featured episode |
| `/episodes` | Catalog of exactly 20 mocked episodes with playback |
| `/about` | Show premise, hosts, and production details |
| `/faq` | Ordered, expandable FAQ (readable without JavaScript) |

Unknown URLs render a branded 404 with working navigation.

## Prerequisites

- Node.js LTS (18.18+ / 20+)
- npm

## Setup & Run

```bash
npm install          # install dependencies
npm run dev          # local development → http://localhost:3000
```

## Testing

```bash
npm test             # Vitest — content schema invariants (INV-1…INV-8)
npm run test:e2e     # Playwright — page flows, playback, responsive, a11y, SEO
```

The Playwright suite serves the static export automatically (port 4173) via
`npm run serve:static`.

## Build & Deploy

```bash
npm run build        # static export → out/ (hard release gate)
npm run serve:static # serve the export locally on http://localhost:4173
npm run check:links  # internal link + asset check against out/ (zero broken links)
```

The `out/` directory contains only static files (HTML/CSS/JS/assets) and can
be deployed to any static host or CDN. Deploy automatically from the `main`
branch; never edit files in `out/` directly — always rebuild from source.

## Project Structure

```text
src/
├── app/          # Pages: landing, episodes, about, faq, 404 + root layout
├── components/   # layout/ (header, nav, footer), episode/ (cards, player), ui/
├── content/      # Embedded mock data: show, episodes (20), faq, nav, types
├── lib/          # Content schema validation + episode helpers
└── styles/       # Global styles + design tokens (AA palette, type scale)
tests/
├── unit/         # Vitest content-schema tests
└── e2e/          # Playwright: landing, catalog, about/faq, responsive, a11y, SEO
public/
├── audio/        # Mocked sample audio
└── images/       # Show + episode artwork
```

## Editing Content

All episode/show/FAQ data lives under `src/content/`. Content edits are
schema-checked: exactly 20 episodes, unique slugs and numbers, ISO-8601
dates (`YYYY-MM-DD`), at most one `featured` episode, and no placeholder
markers. Run `npm test` after any content change.
