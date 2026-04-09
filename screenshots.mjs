import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

// Wait for fonts and animations
await page.waitForTimeout(3000);

// Screenshot opening
await page.screenshot({ path: '/vibespace/.agents/dev/output/screenshots/01-opening.png' });

// Scroll to Tesla slide
const container = page.locator('#scrollContainer');
await container.evaluate(el => el.scrollTop = el.scrollHeight * 0.12);
await page.waitForTimeout(2000);
await page.screenshot({ path: '/vibespace/.agents/dev/output/screenshots/02-tesla-slide.png' });

// Scroll to first interstitial
await container.evaluate(el => el.scrollTop = el.scrollHeight * 0.22);
await page.waitForTimeout(1500);
await page.screenshot({ path: '/vibespace/.agents/dev/output/screenshots/03-interstitial.png' });

// Scroll to Ehrlich split
await container.evaluate(el => el.scrollTop = el.scrollHeight * 0.30);
await page.waitForTimeout(2000);
await page.screenshot({ path: '/vibespace/.agents/dev/output/screenshots/04-ehrlich-split.png' });

// Scroll to gallery/archive
await container.evaluate(el => el.scrollTop = el.scrollHeight * 0.70);
await page.waitForTimeout(2000);
await page.screenshot({ path: '/vibespace/.agents/dev/output/screenshots/05-archive-masonry.png' });

// Individual prediction page
await page.goto('http://localhost:3000/predictions/edison-alternating-current-1889', { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);
await page.screenshot({ path: '/vibespace/.agents/dev/output/screenshots/06-prediction-page.png' });

await browser.close();
console.log('Done — 6 screenshots captured');
