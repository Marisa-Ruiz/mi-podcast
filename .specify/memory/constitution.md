<!--
Sync Impact Report
- Version change: (unversioned scaffold) → 1.0.0
- Modified principles: all placeholders filled for the first time
  ([PRINCIPLE_1_NAME] → I. Static-Only Delivery,
   [PRINCIPLE_2_NAME] → II. Template-Driven Structure,
   [PRINCIPLE_3_NAME] → III. Responsive & Accessible,
   [PRINCIPLE_4_NAME] → IV. Performance Budget,
   [PRINCIPLE_5_NAME] → V. Content Integrity)
- Added sections: Technical Constraints (SECTION_2), Development Workflow (SECTION_3)
- Removed sections: none (example comments removed after replacement)
- Follow-up TODOs: none — all placeholders resolved
- NOTE: This report is temporary scratch material and should be removed
  before the file is committed.
-->

# mi-podcast Constitution

## Core Principles

### I. Static-Only Delivery (NON-NEGOTIABLE)

The site MUST build to static files (HTML/CSS/JS/assets) servable by any
static host or CDN. No server-side runtime, databases, or server APIs
MAY be required for the site to function. Anything needing a backend
MUST be out of scope or delegated to an external service.

### II. Template-Driven Structure

All pages MUST be generated from the project's existing template/scaffold
and shared layouts. One-off hand-written HTML pages MUST NOT be added
outside the template system. Common elements (header, nav, footer) MUST
live in shared layout partials so a single edit propagates everywhere.

### III. Responsive & Accessible

Every page MUST work on mobile and desktop viewports. Markup MUST use
semantic HTML elements, images MUST have alt text, and text MUST meet
WCAG AA contrast. Keyboard navigation MUST be usable for all interactive
elements.

### IV. Performance Budget

The site MUST remain lightweight: images MUST be compressed and sized to
their display dimensions, assets MUST be minified by the build, and
third-party scripts MUST be avoided unless justified. Pages MUST remain
usable if JavaScript fails to load (progressive enhancement).

### V. Content Integrity

No broken internal links or missing assets MAY ship to production.
Placeholder or draft content MUST be clearly marked and MUST NOT be
published on the production build. Dates and metadata MUST be accurate
and consistently formatted (ISO 8601: YYYY-MM-DD).

## Technical Constraints

- Output MUST be a fully static build deployable to any static host.
- The project MUST stay within the existing template's tech stack;
  adding frameworks or build tools requires prior approval.
- All content, styles, and scripts MUST live in the repository; no
  reliance on runtime configuration or environment secrets for the
  public site.
- SEO minimums: each page MUST have a unique title, meta description,
  and a canonical URL.

## Development Workflow

- Changes MUST be verified with a successful local build before being
  merged or deployed.
- Every change MUST be reviewed for constitution compliance
  (principles above) as part of review or PR approval.
- The production build MUST be regenerated from source after any content
  or template edit; direct edits to deployed output are forbidden.
- Deployment MUST be automated from the repository's main branch.

## Governance

- This constitution supersedes all other practices for this project.
- Amendments MUST be documented in this file with a version bump
  (semantic versioning: MAJOR = principle removal/redefinition,
  MINOR = new principle/section, PATCH = clarifications) and an updated
  amendment date.
- Amendments require maintainer approval and a migration plan for any
  existing content or code that would become non-compliant.
- All reviews MUST verify compliance with this constitution; unjustified
  complexity or violations MUST block approval.
- Runtime development guidance belongs in the project README/docs, not
  in this constitution.

**Version**: 1.0.0 | **Ratified**: 2026-10-02 | **Last Amended**: 2026-10-02
