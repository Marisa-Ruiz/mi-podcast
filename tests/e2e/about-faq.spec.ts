import { test, expect } from '@playwright/test';

test.describe('US3 — About & FAQ (quickstart V4)', () => {
  test('About page shows show description and host info', async ({ page }) => {
    await page.goto('/about/');

    await expect(
      page.getByRole('heading', { level: 1, name: 'Mi Podcast' }),
    ).toBeVisible();

    const hosts = page.getByTestId('host-card');
    await expect(hosts).toHaveCount(2);
    await expect(hosts.first()).toContainText('Mara Iversen');
    await expect(hosts.first()).toContainText('Host & Producer');

    // Production info
    await expect(page.getByText(/New episodes land/i)).toBeVisible();
  });

  test('FAQ lists ordered questions and toggling reveals answers without reload', async ({
    page,
  }) => {
    await page.goto('/faq/');

    const items = page.getByTestId('faq-item');
    await expect(items).toHaveCount(5);

    // Answers start expanded (readable without JS) — Constitution IV
    const firstAnswer = items.first().getByTestId('faq-answer');
    await expect(firstAnswer).toBeVisible();

    await page.evaluate(() => {
      (window as unknown as { __noReload?: boolean }).__noReload = true;
    });

    // Toggle twice: collapse then reveal again — no page reload
    await items.first().getByTestId('faq-question').click();
    await expect(firstAnswer).toBeHidden();
    await items.first().getByTestId('faq-question').click();
    await expect(firstAnswer).toBeVisible();

    const marker = await page.evaluate(
      () => (window as unknown as { __noReload?: boolean }).__noReload,
    );
    expect(marker).toBe(true);
  });

  test('FAQ answers remain readable with JavaScript disabled', async ({
    browser,
  }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto('/faq/');

    await expect(page.getByTestId('faq-answer').first()).toBeVisible();
    await expect(page.getByTestId('faq-question').first()).toBeVisible();
    await context.close();
  });
});
