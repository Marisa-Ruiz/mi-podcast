import { test, expect } from '@playwright/test';

test.describe('Keyboard & accessibility (SC-005, FR-012, Constitution III)', () => {
  test('nav marks the active page with aria-current', async ({ page }) => {
    for (const route of ['/', '/episodes/', '/about/', '/faq/']) {
      await page.goto(route);
      const nav = page.getByRole('navigation', { name: 'Primary' });
      const current = nav.locator('[aria-current="page"]');
      await expect(current).toHaveCount(1);
    }
  });

  test('keyboard-only: reach nav and start/stop playback without a mouse', async ({
    page,
  }) => {
    await page.goto('/');

    const playButton = page.getByTestId('audio-toggle');
    await playButton.focus();
    await expect(playButton).toBeFocused();

    // Space activates the focused button
    await page.keyboard.press('Space');
    await expect(playButton).toHaveAttribute('data-state', 'playing');

    await page.keyboard.press('Space');
    await expect(playButton).toHaveAttribute('data-state', 'paused');
  });

  test('focus is always visible on interactive elements', async ({ page }) => {
    await page.goto('/');
    const link = page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Episodes' });
    await link.focus();
    const outline = await link.evaluate((el) => {
      const style = getComputedStyle(el);
      return { style: style.outlineStyle, width: style.outlineWidth };
    });
    expect(outline.style).not.toBe('none');
  });

  test('images carry alt text', async ({ page }) => {
    for (const route of ['/', '/episodes/', '/about/']) {
      await page.goto(route);
      const missingAlt = await page.evaluate(() =>
        Array.from(document.querySelectorAll('img')).filter(
          (img) => !img.hasAttribute('alt'),
        ).length,
      );
      expect(missingAlt, `images without alt on ${route}`).toBe(0);
    }
  });

  test('semantic landmarks present on every page', async ({ page }) => {
    for (const route of ['/', '/episodes/', '/about/', '/faq/']) {
      await page.goto(route);
      await expect(page.getByRole('banner')).toBeVisible();
      await expect(page.getByRole('main')).toBeVisible();
      await expect(page.getByRole('contentinfo')).toBeVisible();
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    }
  });
});
