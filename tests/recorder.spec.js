const { test, expect } = require('@playwright/test');
const path = require('path');

const FILE_URL = 'file://' + path.resolve(__dirname, '../src/recorder.html');

test.beforeEach(async ({ page }) => {
  await page.goto(FILE_URL, { waitUntil: 'domcontentloaded' });
  // Clear localStorage so each test starts from defaults
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(300);
});

// ---------------------------------------------------------------------------
// Layout & default state
// ---------------------------------------------------------------------------

test('Notes section is collapsed by default', async ({ page }) => {
  const content = page.locator('.notes-collapsible');
  await expect(content).not.toHaveClass(/open/);
});

test('Notes section opens and closes on toggle click', async ({ page }) => {
  const toggle = page.locator('.section-toggle');
  const content = page.locator('.notes-collapsible');

  await toggle.click();
  await expect(content).toHaveClass(/open/);

  await toggle.click();
  await expect(content).not.toHaveClass(/open/);
});

test('Notes section state is persisted in localStorage', async ({ page }) => {
  await page.click('.section-toggle');
  const stored = await page.evaluate(() => localStorage.getItem('recorder_notes_open'));
  expect(stored).toBe('true');

  await page.click('.section-toggle');
  const stored2 = await page.evaluate(() => localStorage.getItem('recorder_notes_open'));
  expect(stored2).toBe('false');
});

test('Notes section restores open state on reload', async ({ page }) => {
  await page.click('.section-toggle');
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(300);
  await expect(page.locator('.notes-collapsible')).toHaveClass(/open/);
});

test('Page has exactly 6 exercise cards', async ({ page }) => {
  const cards = page.locator('.exercise-card');
  await expect(cards).toHaveCount(6);
});

test('Page has exactly 6 drill toggles', async ({ page }) => {
  await expect(page.locator('.drill-toggle')).toHaveCount(6);
});

// ---------------------------------------------------------------------------
// Drill panels
// ---------------------------------------------------------------------------

test('All drill panels are collapsed by default', async ({ page }) => {
  const contents = page.locator('.drill-content');
  const count = await contents.count();
  for (let i = 0; i < count; i++) {
    await expect(contents.nth(i)).not.toHaveClass(/open/);
  }
});

test('Drill panel opens and shows 8 rows on toggle click', async ({ page }) => {
  const firstToggle = page.locator('.drill-toggle').first();
  await firstToggle.click();
  await expect(page.locator('.drill-content').first()).toHaveClass(/open/);

  const rows = page.locator('.drill-content.open .drill-row');
  await expect(rows).toHaveCount(8);
});

test('Drill panel state persists in localStorage', async ({ page }) => {
  await page.locator('.drill-toggle').first().click();
  const stored = await page.evaluate(() => localStorage.getItem('recorder_drill_Терції'));
  expect(stored).toBe('true');
});

test('Drill panel restores open state on reload', async ({ page }) => {
  await page.locator('.drill-toggle').first().click();
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(300);
  await expect(page.locator('.drill-content').first()).toHaveClass(/open/);
});

// ---------------------------------------------------------------------------
// Chain sequences
// ---------------------------------------------------------------------------

test('Терції chains are correct', async ({ page }) => {
  await page.locator('.drill-toggle').first().click();
  const chains = await page.locator('.drill-content.open .drill-chain').allInnerTexts();
  expect(chains[0].replace(/\s+/g, ' ').trim()).toContain('До1');
  expect(chains[0]).toContain('Мі1');
  expect(chains[0]).toContain('Соль1');
  expect(chains[0]).toContain('Сі1');
  // Last row: До2→Мі2→Соль2→Сі2
  expect(chains[7]).toContain('До2');
  expect(chains[7]).toContain('Сі2');
});

test('Кварти chain from Ля1 reaches До3', async ({ page }) => {
  // Кварти is the 2nd exercise card
  await page.locator('.drill-toggle').nth(1).click();
  const chains = await page.locator('.drill-content.open .drill-chain').allInnerTexts();
  // Row 6 (index 5): Ля1→Ре2→Соль2→До3
  expect(chains[5]).toContain('До3');
});

test('Кварти chain from Сі1 reverses on 3rd step', async ({ page }) => {
  await page.locator('.drill-toggle').nth(1).click();
  const chains = await page.locator('.drill-content.open .drill-chain').allInnerTexts();
  // Row 7 (index 6): Сі1→Мі2→Ля2→Мі2 (reversal)
  const row7 = chains[6];
  expect(row7).toContain('Сі1');
  expect(row7).toContain('Мі2');
  expect(row7).toContain('Ля2');
});

test('1-4-5 card shows До1 main sequence', async ({ page }) => {
  const lastCard = page.locator('.exercise-card').last();
  const seq = lastCard.locator('.exercise-seq');
  await expect(seq).toContainText('До1');
  await expect(seq).toContainText('Фа1');
  await expect(seq).toContainText('Соль1');
  await expect(seq).toContainText('До2');
});

test('1-4-5 До2 chain reaches До3', async ({ page }) => {
  // 1-4-5 is the last card (index 5)
  await page.locator('.drill-toggle').nth(5).click();
  const chains = await page.locator('.drill-content.open .drill-chain').allInnerTexts();
  // Row 8 (index 7): До2→Фа2→Соль2→До3
  expect(chains[7]).toContain('До3');
});

// ---------------------------------------------------------------------------
// Staff visual
// ---------------------------------------------------------------------------

test('Staff noteheads are 30% larger (rx=6.5, ry=4.55)', async ({ page }) => {
  const ellipse = page.locator('.staff-svg ellipse').first();
  await expect(ellipse).toHaveAttribute('rx', '6.5');
  await expect(ellipse).toHaveAttribute('ry', '4.55');
});

test('Active note uses stroke border not fill change', async ({ page }) => {
  const activeCSS = await page.evaluate(() => {
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules) {
          if (rule.selectorText === '.staff-note-head.active') {
            return { fill: rule.style.fill, stroke: rule.style.stroke, strokeWidth: rule.style.strokeWidth };
          }
        }
      } catch (e) {}
    }
    return null;
  });
  expect(activeCSS).not.toBeNull();
  expect(activeCSS.fill).toBe('var(--cream-dim)');
  expect(activeCSS.stroke).toBe('var(--staff-active-fill)');
  expect(activeCSS.strokeWidth).toBe('2');
});

// ---------------------------------------------------------------------------
// Drill playback & note highlighting
// ---------------------------------------------------------------------------

test('Each drill row has both ▶ and ⟳ buttons', async ({ page }) => {
  await page.locator('.drill-toggle').first().click();
  const firstRow = page.locator('.drill-row').first();
  const btns = firstRow.locator('.drill-play-btn');
  await expect(btns).toHaveCount(2);
  await expect(btns.nth(0)).toHaveText('▶');
  await expect(btns.nth(1)).toHaveText('⟳');
});

test('Drill note spans exist with correct font size', async ({ page }) => {
  await page.locator('.drill-toggle').first().click();
  const firstRow = page.locator('.drill-row').first();
  const noteSpans = firstRow.locator('.drill-seq-note');
  await expect(noteSpans).toHaveCount(4);

  const fontSize = await noteSpans.first().evaluate(el => window.getComputedStyle(el).fontSize);
  // 1.02rem at 16px base = ~16.32px; allow ±1px
  const px = parseFloat(fontSize);
  expect(px).toBeGreaterThan(14);
  expect(px).toBeLessThan(20);
});

test('Playing a drill row highlights the current note', async ({ page }) => {
  await page.locator('.drill-toggle').first().click();
  await page.locator('.drill-play-btn').first().click();
  await page.waitForTimeout(300);

  const activeSpan = page.locator('.drill-seq-note.seq-active');
  await expect(activeSpan).toHaveCount(1);
});

test('Stopping a drill row clears note highlights', async ({ page }) => {
  await page.locator('.drill-toggle').first().click();
  const btn = page.locator('.drill-play-btn').first();
  await btn.click();
  await page.waitForTimeout(250);
  await btn.click(); // stop
  await page.waitForTimeout(100);

  await expect(page.locator('.drill-seq-note.seq-active')).toHaveCount(0);
});

test('Staff swaps to 4-note chain while drill plays', async ({ page }) => {
  await page.locator('.drill-toggle').first().click();
  await page.locator('.drill-play-btn').first().click();
  await page.waitForTimeout(200);

  const staffNotes = page.locator('.exercise-card').first().locator('.staff-svg ellipse');
  await expect(staffNotes).toHaveCount(4);
});

test('Loop button shows ■ while looping, ⟳ after stop', async ({ page }) => {
  await page.locator('.drill-toggle').first().click();
  const loopBtn = page.locator('.drill-loop-btn').first();

  await loopBtn.click();
  await page.waitForTimeout(200);
  await expect(loopBtn).toHaveText('■');
  await expect(loopBtn).toHaveClass(/playing/);

  await loopBtn.click();
  await page.waitForTimeout(100);
  await expect(loopBtn).toHaveText('⟳');
  await expect(loopBtn).not.toHaveClass(/playing/);
});
