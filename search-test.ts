// Types sample queries into the docs search in a headless browser and checks that the
// expected page comes first, in each language.   node search-test.ts
//
// It reads the built site in dist/ (DIST_DIR for another folder) for the address it was
// built for (SITE_URL and DOCS_URL, as for the build), and answers every request from
// those files, so nothing goes to the network. It needs Playwright with Chromium, like
// shots.ts: PLAYWRIGHT_MODULE, or the playwright package installed next to this file.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import config from './site.config.ts';
import { makeUrls } from './src/urls.ts';

const root = path.dirname(fileURLToPath(import.meta.url));
const DIST = process.env.DIST_DIR ? path.resolve(process.env.DIST_DIR) : path.join(root, 'dist');
const SITE_URL = (process.env.SITE_URL || config.url).replace(/\/$/, '');
const DOCS_URL = process.env.DOCS_URL || (SITE_URL === config.url ? config.docsUrl : `${SITE_URL}/docs`);
const urls = makeUrls(SITE_URL, DOCS_URL);

// What a reader types, and the page (with its heading) that must come first
const CASES: Record<string, [string, string][]> = {
	'/docs/': [
		['install docker', '/docs/getting-started/docker/'],
		['devices list', '/docs/command-line/reference/devices/#neodesk-devices-list'],
		['RELAY_SERVERS', '/docs/operations/configuration/#addresses-and-ports'],
		['two-factor', '/docs/people/two-factor/'],
		['--include-deleted', '/docs/command-line/reference/devices/#neodesk-devices-list']
	],
	'/de/docs/': [
		['Docker installieren', '/de/docs/getting-started/docker/'],
		['devices list', '/de/docs/command-line/reference/devices/#neodesk-devices-list'],
		['Zwei-Faktor', '/de/docs/people/two-factor/'],
		['Ports', '/de/docs/operations/ports/']
	]
};

const TYPES: Record<string, string> = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.gz': 'application/gzip', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.woff2': 'font/woff2' };

interface Route {
	request(): { url(): string };
	fulfill(o: { status?: number; path?: string; body?: string; contentType?: string }): Promise<void>;
	abort(): Promise<void>;
}
interface Page {
	route(url: string, handler: (route: Route) => Promise<void>): Promise<void>;
	goto(url: string): Promise<unknown>;
	keyboard: { press(key: string): Promise<void>; type(text: string): Promise<void> };
	fill(selector: string, text: string): Promise<void>;
	waitForFunction(fn: () => boolean, arg: undefined, options: { timeout: number }): Promise<unknown>;
	evaluate<T>(fn: () => T): Promise<T>;
}
interface Browser {
	newPage(): Promise<Page>;
	close(): Promise<void>;
}
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright') as { chromium: { launch(): Promise<Browser> } };

const browser = await chromium.launch();
let failed = 0;
for (const [start, cases] of Object.entries(CASES)) {
	const page = await browser.newPage();
	await page.route('**/*', async (route) => {
		const file = urls.fileOfUrl(route.request().url());
		const full = file && path.join(DIST, file);
		if (full && fs.existsSync(full) && fs.statSync(full).isFile()) await route.fulfill({ path: full, contentType: TYPES[path.extname(full)] ?? 'application/octet-stream' });
		else if (file) await route.fulfill({ status: 404, body: 'not found' });
		else await route.abort();
	});
	await page.goto(urls.url(start));
	for (const [query, want] of cases) {
		await page.keyboard.press('Control+K');
		await page.fill('#search-input', query);
		try {
			await page.waitForFunction(() => !!document.querySelector('#search-results li[role="option"]'), undefined, { timeout: 8000 });
		} catch {
			/* nothing found: reported below */
		}
		const top = await page.evaluate(() => Array.from(document.querySelectorAll('#search-results li[role="option"] a')).slice(0, 3).map((a) => (a as HTMLAnchorElement).href));
		const ok = top[0] === urls.url(want);
		if (!ok) failed++;
		console.log(`${ok ? 'ok  ' : 'FAIL'} ${start.startsWith('/de') ? 'de' : 'en'} "${query}" -> ${top[0] ?? 'nothing'}${ok ? '' : `\n     want ${urls.url(want)}\n     then ${top.slice(1).join(', ')}`}`);
		await page.fill('#search-input', '');
		await page.keyboard.press('Escape');
	}
}
await browser.close();
if (failed) {
	console.error(`${failed} queries did not find the expected page first`);
	process.exit(1);
}
