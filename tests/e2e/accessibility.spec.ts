import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('home page has no critical or serious WCAG violations', async ({
  page,
}) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();

  const blocking = results.violations.filter((v) =>
    ['critical', 'serious'].includes(v.impact ?? ''),
  );

  if (blocking.length > 0) {
    // Surface the violations in the test output for the QA report.
    console.log(JSON.stringify(blocking, null, 2));
  }

  expect(blocking).toEqual([]);
});

test('populated list has no critical or serious WCAG violations', async ({
  page,
}) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  await page.getByLabel(/new todo text/i).fill('Buy milk');
  await page.getByLabel(/new todo text/i).press('Enter');
  await page.getByLabel(/new todo text/i).fill('Walk dog');
  await page.getByLabel(/new todo text/i).press('Enter');
  await page
    .getByRole('listitem')
    .filter({ hasText: 'Walk dog' })
    .getByRole('checkbox')
    .click();

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();

  const blocking = results.violations.filter((v) =>
    ['critical', 'serious'].includes(v.impact ?? ''),
  );

  if (blocking.length > 0) {
    console.log(JSON.stringify(blocking, null, 2));
  }

  expect(blocking).toEqual([]);
});
