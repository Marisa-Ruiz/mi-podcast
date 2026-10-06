import { test, expect } from '@playwright/test';

test.describe('US1 — Landing page (quickstart V1 + V3)', () => {
  test('shows identity, nav, and exactly one featured episode', async ({
    page,
  }) => {
    await page.goto('/');

    // Site identity
    await expect(page.getByRole('banner').getByRole('link', { name: 'Mi Podcast' })).toBeVisible();

    // Primary navigation — FR-010
    const nav = page.getByRole('navigation', { name: 'Primary' });
    for (const label of ['Home', 'Episodes', 'About', 'FAQ']) {
      await expect(nav.getByRole('link', { name: label })).toBeVisible();
    }

    // Exactly one featured episode — FR-001
    const featured = page.getByTestId('featured-episode');
    await expect(featured).toHaveCount(1);
    await expect(featured.getByTestId('featured-title')).toBeVisible();
    await expect(featured.getByTestId('featured-description')).toBeVisible();
  });

  test('playback toggles play and pause without reload — V3', async ({
    page,
  }) => {
    await page.goto('/');

    const playButton = page.getByTestId('audio-toggle');
    await expect(playButton).toBeVisible();

    // Marker to detect navigation (reload would reset it)
    await page.evaluate(() => {
      (window as unknown as { __noReload?: boolean }).__noReload = true;
    });

    await playButton.click();
    await expect(playButton).toHaveAttribute('data-state', 'playing');

    await playButton.click();
    await expect(playButton).toHaveAttribute('data-state', 'paused');

    const marker = await page.evaluate(
      () => (window as unknown as { __noReload?: boolean }).__noReload,
    );
    expect(marker).toBe(true);
  });

  test('responsive: no horizontal scroll at 320px (SC-004 excerpt)', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto('/');
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(overflow).toBe(false);
  });
});
