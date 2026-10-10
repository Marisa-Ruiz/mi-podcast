import { test, expect } from '@playwright/test';

test.describe('US2 — Episodes catalog (quickstart V2 + V3)', () => {
  test('lists exactly 20 episodes with full metadata — V2, SC-002', async ({
    page,
  }) => {
    await page.goto('/episodes/');

    const cards = page.getByTestId('episode-card');
    await expect(cards).toHaveCount(20);

    for (let i = 0; i < 20; i++) {
      const card = cards.nth(i);
      await expect(card.getByTestId('episode-number')).toBeVisible();
      await expect(card.getByTestId('episode-title')).toBeVisible();
      await expect(card.getByTestId('episode-date')).toBeVisible();
      await expect(card.getByTestId('episode-duration')).toBeVisible();
      await expect(card.getByTestId('episode-description')).toBeVisible();

      // ISO-8601 YYYY-MM-DD on the time element — Principle V
      const iso = await card.getByTestId('episode-date').getAttribute('datetime');
      expect(iso).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }

    // No duplicate episode numbers — INV-2
    const numbers = await cards
      .getByTestId('episode-number')
      .allTextContents();
    const unique = new Set(numbers);
    expect(unique.size).toBe(20);
  });

  test('play control toggles an episode without reload — V3', async ({
    page,
  }) => {
    await page.goto('/episodes/');

    const firstPlayable = page
      .getByTestId('episode-card')
      .filter({ has: page.locator('[data-testid="audio-toggle"]') })
      .first();
    const playButton = firstPlayable.getByTestId('audio-toggle');

    await expect(playButton).toBeVisible();

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

  test('episode with no audio shows graceful unavailable state', async ({
    page,
  }) => {
    await page.goto('/episodes/');

    // Fixture: episode 7 "On being stuck" has audioUrl: null
    const unavailablePlayer = page.locator(
      '[data-testid="audio-player"][data-state="unavailable"]',
    );
    await expect(unavailablePlayer.first()).toBeVisible();
    await expect(unavailablePlayer.first()).toContainText('Audio unavailable');
  });

  test('responsive: readable and no horizontal scroll at 320px', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto('/episodes/');
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(overflow).toBe(false);
  });
});
