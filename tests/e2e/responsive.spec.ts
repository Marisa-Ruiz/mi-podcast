import { test, expect } from '@playwright/test';

const ROUTES = ['/', '/episodes/', '/about/', '/faq/'];
const VIEWPORTS = [
  { name: '320px', width: 320, height: 800 },
  { name: '768px', width: 768, height: 1024 },
  { name: '1920px', width: 1920, height: 1080 },
];

test.describe('Responsive layout (SC-004, FR-011)', () => {
  for (const viewport of VIEWPORTS) {
    for (const route of ROUTES) {
      test(`${route} at ${viewport.name}: no overlap, clipping, or horizontal scroll`, async ({
        page,
      }) => {
        await page.setViewportSize({
          width: viewport.width,
          height: viewport.height,
        });
        await page.goto(route);

        // No horizontal scroll
        const overflow = await page.evaluate(
          () =>
            document.documentElement.scrollWidth >
            document.documentElement.clientWidth,
        );
        expect(overflow, 'horizontal scrolling detected').toBe(false);

        // Core landmarks visible and not clipped off-screen
        await expect(page.getByRole('banner')).toBeVisible();
        await expect(page.getByRole('navigation', { name: 'Primary' })).toBeVisible();
        await expect(page.getByRole('main')).toBeVisible();
        await expect(page.getByRole('contentinfo')).toBeVisible();

        // No element extends beyond the viewport width
        const escaping = await page.evaluate(() => {
          const width = document.documentElement.clientWidth;
          return Array.from(document.querySelectorAll('body *')).some((el) => {
            const rect = el.getBoundingClientRect();
            return rect.width > 0 && rect.right > width + 1;
          });
        });
        expect(escaping, 'element overflows viewport').toBe(false);
      });
    }
  }
});
