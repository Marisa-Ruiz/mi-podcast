import { test, expect } from '@playwright/test';

const ROUTES = ['/', '/episodes/', '/about/', '/faq/'];

test.describe('SEO metadata audit (Constitution SEO minimums)', () => {
  test('every page emits a unique title, description, and canonical', async ({
    page,
  }) => {
    const titles: string[] = [];
    const descriptions: string[] = [];
    const canonicals: string[] = [];

    for (const route of ROUTES) {
      await page.goto(route);

      const title = await page.title();
      expect(title.trim().length, `title on ${route}`).toBeGreaterThan(0);

      const description = await page
        .locator('meta[name="description"]')
        .getAttribute('content');
      expect(description?.trim().length, `description on ${route}`).toBeGreaterThan(0);

      const canonical = await page
        .locator('link[rel="canonical"]')
        .getAttribute('href');
      expect(canonical, `canonical on ${route}`).toBeTruthy();
      expect(canonical, `canonical on ${route} must be absolute`).toMatch(
        /^https?:\/\//,
      );

      titles.push(title);
      descriptions.push(description ?? '');
      canonicals.push(canonical ?? '');
    }

    // Uniqueness across the four pages
    expect(new Set(titles).size).toBe(ROUTES.length);
    expect(new Set(descriptions).size).toBe(ROUTES.length);
    expect(new Set(canonicals).size).toBe(ROUTES.length);

    // Canonicals match their routes
    expect(canonicals[0]).toContain('/');
    expect(canonicals[1]).toContain('/episodes');
    expect(canonicals[2]).toContain('/about');
    expect(canonicals[3]).toContain('/faq');
  });
});
