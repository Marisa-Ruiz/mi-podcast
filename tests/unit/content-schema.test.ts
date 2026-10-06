import { describe, expect, it } from 'vitest';
import { show } from '@/content/show';
import { navLinks } from '@/content/nav';
import { validateContent, EXPECTED_EPISODE_COUNT } from '@/lib/validation';
import { ISO_DATE_PATTERN, SLUG_PATTERN } from '@/content/types';

import { existsSync } from 'node:fs';
import path from 'node:path';
import { FaqItem } from '@/content/types';

async function loadOptionalFaq(): Promise<FaqItem[]> {
  // faq.ts ships with User Story 3 (T028); optional until then.
  const faqPath = path.join(process.cwd(), 'src', 'content', 'faq.ts');
  if (!existsSync(faqPath)) return [];
  const mod = (await import(faqPath)) as { faqItems?: FaqItem[] };
  return mod.faqItems ?? [];
}

async function loadBundle() {
  const { episodes } = await import('@/content/episodes');
  const faqItems = await loadOptionalFaq();
  return { show, episodes, faqItems, navLinks };
}

describe('content schema invariants (INV-1…INV-8)', () => {
  it('INV-1: exactly 20 episodes', async () => {
    const { episodes } = await import('@/content/episodes');
    expect(episodes).toHaveLength(EXPECTED_EPISODE_COUNT);
  });

  it('INV-2: slugs match pattern and are unique; numbers positive and unique', async () => {
    const { episodes } = await import('@/content/episodes');
    const slugs = episodes.map((e) => e.slug);
    const numbers = episodes.map((e) => e.number);
    for (const slug of slugs) expect(slug).toMatch(SLUG_PATTERN);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const n of numbers) expect(n).toBeGreaterThan(0);
    expect(new Set(numbers).size).toBe(numbers.length);
  });

  it('INV-3: all publishedAt are valid ISO-8601 dates', async () => {
    const { episodes } = await import('@/content/episodes');
    for (const ep of episodes) {
      expect(ep.publishedAt).toMatch(ISO_DATE_PATTERN);
      const d = new Date(`${ep.publishedAt}T00:00:00Z`);
      expect(Number.isNaN(d.getTime())).toBe(false);
      expect(d.toISOString().slice(0, 10)).toBe(ep.publishedAt);
    }
  });

  it('INV-4: at most one featured episode', async () => {
    const { episodes } = await import('@/content/episodes');
    const featured = episodes.filter((e) => e.featured === true);
    expect(featured.length).toBeLessThanOrEqual(1);
  });

  it('INV-6: nav covers exactly the four required routes', () => {
    const hrefs = navLinks.map((n) => n.href).sort();
    expect(hrefs).toEqual(['/', '/about', '/episodes', '/faq']);
  });

  it('INV-7/INV-8: full bundle validates without errors', async () => {
    const bundle = await loadBundle();
    expect(validateContent(bundle)).toEqual([]);
  });

  it('show content is present and valid', () => {
    expect(show.title.trim().length).toBeGreaterThan(0);
    expect(show.hosts.length).toBeGreaterThanOrEqual(1);
    expect(show.artworkUrl).toMatch(/^\//);
  });
});
