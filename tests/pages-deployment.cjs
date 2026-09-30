const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const {chromium} = require('@playwright/test');

// Run after: npm run build -- --mode github-pages
// Deliberately no SPA fallback: mirrors static hosting at /index-archive/.
const root = path.resolve('dist');
const base = '/index-archive/';
const types = {'.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.svg':'image/svg+xml', '.jpg':'image/jpeg', '.webp':'image/webp', '.ttf':'font/ttf'};
const server = http.createServer((req, res) => {
  const pathname = new URL(req.url, 'http://localhost').pathname;
  if (!pathname.startsWith(base)) { res.writeHead(404).end(); return; }
  const file = path.resolve(root, decodeURIComponent(pathname.slice(base.length) || 'index.html'));
  if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404).end(); return; }
  res.writeHead(200, {'Content-Type': types[path.extname(file)] || 'application/octet-stream'});
  fs.createReadStream(file).pipe(res);
});
(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${server.address().port}${base}`;
  const edge = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
  const browser = await chromium.launch({executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH || (fs.existsSync(edge) ? edge : undefined)});
  try {
    const page = await browser.newPage({reducedMotion:'reduce'});
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
    for (const route of ['', '#/archive?discipline=SPACE', '#/project/making-egypt', '#/boards', '#/board/metallic-studies', '#/about']) {
      await page.goto(url + route);
      await page.reload();
      await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(image => { image.loading = 'eager'; return image.decode(); })); });
      assert.equal(await page.locator('main').count(), 1);
      assert.ok(await page.evaluate(() => [...document.images].every(image => new URL(image.src).pathname.startsWith('/index-archive/'))));
    }
    await page.goto(url);
    await page.locator('.nav>button').click();
    await page.getByRole('searchbox').fill('灯光');
    assert.equal(await page.locator('.inspiration-results article').count(), 13);
    await page.locator('.inspiration-results a').first().click();
    assert.match(page.url(), /\/index-archive\/#\/project\/[^#]+#/);
    await page.reload();
    await page.locator('figure[data-current=true]').waitFor();
    await page.locator('figure[data-current=true] .save').click();
    await page.getByRole('button', {name:/METALLIC STUDIES/}).click();
    await page.getByRole('button', {name:'完成 ↗', exact:true}).click();
    await page.goto(url + '#/board/metallic-studies');
    await page.reload();
    assert.equal(await page.locator('.saved-grid article').count(), 1);
    await page.locator('.skip-link').focus();
    await page.keyboard.press('Enter');
    assert.match(page.url(), /#\/board\/metallic-studies#content$/);
    assert.equal(await page.locator('main').count(), 1);
    await page.locator('.nav nav').getByRole('link', {name:'分类 Categories'}).click();
    assert.match(page.url(), /#\/#disciplines$/);
    await page.locator('.discipline').first().click();
    assert.match(page.url(), /#\/archive\?discipline=SPACE$/);
    assert.deepEqual(errors, []);
    console.log('PASS: Pages base, assets, 6 routes + refresh, Search anchors, save/Boards persistence, skip link and classification.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => server.close());

