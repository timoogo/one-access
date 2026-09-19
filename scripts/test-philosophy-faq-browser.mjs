import assert from 'node:assert/strict';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(path.join(process.env.PLAYWRIGHT_MODULE, 'index.mjs')).href : 'playwright');
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_EXECUTABLE, headless: true });
const url = process.env.PHILOSOPHY_URL || 'http://localhost:3000/philosophie';
const errors = [];
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.on('pageerror', e => errors.push(e.message));
  const stage = page.locator('[data-philosophy-stage]');
  const skip = page.getByRole('button', { name: 'Passer l’animation' });
  const faq = page.locator('#philosophy-faq');
  const title = page.locator('#philosophy-faq-title');
  const triggers = faq.getByRole('button');
  const load = async () => {
    await page.goto(url);
    await page.locator('[data-mode=animated]').waitFor();
  };
  const checkSkipped = async () => {
    await page.waitForTimeout(100);
    assert.equal(await title.evaluate(e => e === document.activeElement), true);
    assert.equal(await stage.getAttribute('data-label'), 'exit');
    assert.equal(await stage.evaluate(e => +e.dataset.time === +e.dataset.duration), true);
    assert.notEqual(await stage.evaluate(e => getComputedStyle(e).position), 'fixed');
    assert.ok((await faq.boundingBox()).y >= 0 && (await faq.boundingBox()).y < 30);
    assert.equal(await page.locator('[data-replay-route]').evaluate(e => +e.style.opacity), 0);
    const y = await page.evaluate(() => scrollY);
    await page.waitForTimeout(700);
    assert.equal(await page.evaluate(() => scrollY), y, 'No delayed return to canvas');
    await page.keyboard.press('Tab');
    assert.equal(await triggers.nth(0).evaluate(e => e === document.activeElement), true);
  };
  for (const activation of ['click', 'Enter', 'Space']) {
    await load();
    assert.ok((await faq.boundingBox()).y >= 900, 'FAQ outside pinned viewport');
    if (activation === 'click') {
      // Exercise skip while an explicit narrative navigation is still running.
      await page.keyboard.press('ArrowDown');
      await skip.click();
    } else {
      for (let i = 0; i < 20 && !await skip.evaluate(e => e === document.activeElement); i++) await page.keyboard.press('Tab');
      assert.equal(await skip.evaluate(e => e === document.activeElement), true, 'Native Tab reaches skip');
      assert.equal(await skip.evaluate(e => getComputedStyle(e).outlineWidth), '3px');
      await page.keyboard.press(activation);
    }
    await checkSkipped();
  }
  assert.equal(await triggers.count(), 5);
  assert.equal(await faq.locator('h3').count(), 5, 'Questions are headings below FAQ h2');
  for (let i = 0; i < 5; i++) {
    await triggers.nth(i).click();
    assert.equal(await triggers.nth(i).getAttribute('aria-expanded'), 'true');
    assert.equal(await faq.locator('button[aria-expanded=true]').count(), 1);
  }
  await triggers.nth(4).click();
  assert.equal(await faq.locator('button[aria-expanded=true]').count(), 0);
  await triggers.nth(0).focus();
  for (const key of ['Enter', 'Space']) {
    for (const expanded of ['true', 'false']) {
      await page.keyboard.press(key);
      assert.equal(await triggers.nth(0).getAttribute('aria-expanded'), expanded);
      assert.equal(await triggers.nth(0).evaluate(e => e === document.activeElement), true);
      assert.equal(await stage.getAttribute('data-label'), 'exit');
    }
  }
  await page.keyboard.press('Tab');
  assert.equal(await triggers.nth(1).evaluate(e => e === document.activeElement), true);
  await page.keyboard.press('Shift+Tab');
  assert.equal(await triggers.nth(0).evaluate(e => e === document.activeElement), true);
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('Escape');
  assert.equal(await faq.locator('button[aria-expanded=true]').count(), 0);
  assert.equal(await stage.getAttribute('data-label'), 'exit');
  assert.match(await triggers.nth(0).ariaSnapshot(), /ONE:ACCESS est-il déjà un référentiel définitif/);
  assert.equal(await faq.locator('[aria-live]').count(), 0);
  // Re-entering the pin uses the same reversible timeline, without a skip state.
  await stage.evaluate(e => window.scrollTo({ top: +e.dataset.scrollEnd - 300, behavior: 'instant' }));
  await page.waitForTimeout(100);
  assert.equal(await stage.evaluate(e => getComputedStyle(e).position), 'fixed');
  assert.ok(await stage.evaluate(e => +e.dataset.time < +e.dataset.duration));
  await skip.click();
  await checkSkipped();
  // The final dezoom remains entirely before the FAQ in document flow.
  await stage.evaluate(e => {
    const label = JSON.parse(e.dataset.labels).find(l => l.id === 'final-overview');
    window.scrollTo({ top: +e.dataset.scrollStart + label.time / +e.dataset.duration * (+e.dataset.scrollEnd - +e.dataset.scrollStart), behavior: 'instant' });
  });
  await page.waitForTimeout(100);
  assert.ok((await faq.boundingBox()).y >= 900);
  await skip.click();
  for (const theme of ['carbon', 'concrete']) {
    await page.evaluate(theme => document.documentElement.dataset.theme = theme, theme);
    await page.waitForTimeout(350);
    const contrast = await page.evaluate(() => {
      const style = getComputedStyle(document.documentElement);
      const luminance = token => {
        const rgb = style.getPropertyValue(token).match(/[\d.]+/g).slice(0, 3).map(Number).map(c => {
          c /= 255; return c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4;
        });
        return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
      };
      const surface = luminance('--surface');
      return ['--ink', '--ink-muted'].map(token => {
        const ink = luminance(token);
        return (Math.max(ink, surface) + .05) / (Math.min(ink, surface) + .05);
      });
    });
    assert.ok(contrast.every(ratio => ratio >= 4.5), theme + ' text/focus contrast ' + contrast);
    // 720/360 CSS px also exercise reflow equivalent to 200/400% of 1440px.
    for (const width of [1440, 720, 360, 320]) {
      await page.setViewportSize({ width, height: 900 });
      await page.waitForTimeout(150);
      await triggers.nth(3).click();
      await triggers.nth(3).focus();
      assert.equal(await triggers.nth(3).evaluate(e => getComputedStyle(e).outlineWidth), '3px');
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), theme + ' reflow ' + width);
      assert.ok((await triggers.nth(3).boundingBox()).height >= 44);
      assert.equal(await triggers.nth(3).evaluate(e => e.scrollWidth <= e.clientWidth), true);
      await triggers.nth(3).click();
    }
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.waitForTimeout(100);
  assert.equal(await skip.isVisible(), false, 'Reduced motion already offers a static narrative');
  assert.equal(await page.locator('.pin-spacer').count(), 0);
  await triggers.nth(3).click();
  assert.equal(await triggers.nth(3).getAttribute('aria-expanded'), 'true');
  assert.equal(await faq.locator('[data-slot=accordion-content]').nth(3).evaluate(e => getComputedStyle(e).animationName), 'none');
  await page.screenshot({ path: '/tmp/philosophy-faq-mobile.png', fullPage: false });
  await page.setViewportSize({ width: 1440, height: 900 });
  await faq.scrollIntoViewIfNeeded();
  await page.screenshot({ path: '/tmp/philosophy-faq-desktop.png' });
  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await mobile.goto(url);
  await mobile.locator('[data-mode=animated]').waitFor();
  const touchSkip = mobile.getByRole('button', { name: 'Passer l’animation' });
  assert.ok((await touchSkip.boundingBox()).height >= 44);
  await touchSkip.tap();
  assert.equal(await mobile.locator('#philosophy-faq-title').evaluate(e => e === document.activeElement), true);
  const touchTrigger = mobile.locator('#philosophy-faq').getByRole('button').first();
  await touchTrigger.tap();
  assert.equal(await touchTrigger.getAttribute('aria-expanded'), 'true');
  await mobile.close();
  assert.deepEqual(errors, []);
  console.log('PASS FAQ/skip: mouse, native keyboard, focus, semantics, touch, themes, 320px reflow, reduced motion, terminal state and reverse');
} finally {
  await browser.close();
}
