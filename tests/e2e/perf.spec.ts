import { test, expect } from '@playwright/test';

const ROUTES = ['/', '/episodes/', '/about/', '/faq/'];

test.describe('Performance & progressive enhancement (SC-007, Constitution IV)', () => {
  test('no third-party scripts are loaded on any page', async ({ page }) => {
    for (const route of ROUTES) {
      await page.goto(route);
      const externalScripts = await page.evaluate(() =>
        Array.from(document.querySelectorAll('script[src]'))
          .map((s) => s.getAttribute('src') ?? '')
          .filter((src) => /^https?:\/\//.test(src) || src.startsWith('//')),
      );
      expect(externalScripts, `external scripts on ${route}`).toEqual([]);
    }
  });

  test('core content is readable with JavaScript disabled', async ({
    browser,
  }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();

    // Landing: identity + featured episode
    await page.goto('/');
    await expect(page.getByTestId('featured-episode')).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Primary' })).toBeVisible();

    // Episodes: full catalog as static content
    await page.goto('/episodes/');
    await expect(page.getByTestId('episode-card')).toHaveCount(20);

    // About + FAQ
    await page.goto('/about/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await page.goto('/faq/');
    await expect(page.getByTestId('faq-answer').first()).toBeVisible();

    await context.close();
  });
});
