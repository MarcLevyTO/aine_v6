import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // Wipe localStorage between tests so each starts from the empty state.
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test('shows the empty state on first visit', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Aine' })).toBeVisible();
  await expect(page.getByText(/no todos yet/i)).toBeVisible();
});

test('add a todo via the Add button', async ({ page }) => {
  await page.getByLabel(/new todo text/i).fill('Buy milk');
  await page.getByRole('button', { name: /add/i }).click();

  await expect(page.getByText('Buy milk')).toBeVisible();
  await expect(page.getByText(/no todos yet/i)).not.toBeVisible();
});

test('add a todo via Enter key', async ({ page }) => {
  await page.getByLabel(/new todo text/i).fill('Walk dog');
  await page.getByLabel(/new todo text/i).press('Enter');

  await expect(page.getByText('Walk dog')).toBeVisible();
});

test('reject empty / whitespace-only input silently', async ({ page }) => {
  // Click Add with empty input — nothing should happen.
  await page.getByRole('button', { name: /add/i }).click();
  await expect(page.getByText(/no todos yet/i)).toBeVisible();

  // Type only whitespace, click Add — still nothing.
  await page.getByLabel(/new todo text/i).fill('   ');
  await page.getByRole('button', { name: /add/i }).click();
  await expect(page.getByText(/no todos yet/i)).toBeVisible();
});

test('toggle a todo to complete and back to incomplete', async ({ page }) => {
  await page.getByLabel(/new todo text/i).fill('Read BMAD docs');
  await page.getByLabel(/new todo text/i).press('Enter');

  const checkbox = page.getByRole('checkbox');
  await expect(checkbox).not.toBeChecked();
  await checkbox.click();
  await expect(checkbox).toBeChecked();
  await checkbox.click();
  await expect(checkbox).not.toBeChecked();
});

test('todos persist across reload', async ({ page }) => {
  // Add three todos and toggle the middle one.
  for (const text of ['Buy milk', 'Walk dog', 'Read BMAD docs']) {
    await page.getByLabel(/new todo text/i).fill(text);
    await page.getByLabel(/new todo text/i).press('Enter');
  }
  await page
    .getByRole('listitem')
    .filter({ hasText: 'Walk dog' })
    .getByRole('checkbox')
    .click();

  // Reload and confirm everything is preserved including the toggled state.
  await page.reload();

  await expect(page.getByText('Buy milk')).toBeVisible();
  await expect(page.getByText('Walk dog')).toBeVisible();
  await expect(page.getByText('Read BMAD docs')).toBeVisible();
  await expect(
    page
      .getByRole('listitem')
      .filter({ hasText: 'Walk dog' })
      .getByRole('checkbox'),
  ).toBeChecked();
});

test('rendered list preserves insertion order', async ({ page }) => {
  for (const text of ['first', 'second', 'third']) {
    await page.getByLabel(/new todo text/i).fill(text);
    await page.getByLabel(/new todo text/i).press('Enter');
  }
  const items = page.getByRole('listitem');
  await expect(items.nth(0)).toHaveText(/first/);
  await expect(items.nth(1)).toHaveText(/second/);
  await expect(items.nth(2)).toHaveText(/third/);
});
