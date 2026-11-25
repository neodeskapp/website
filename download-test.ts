// Checks the download page in a headless browser: for emulated Windows, macOS, Linux and
// iPhone browsers the primary button names the right file; without scripts every file of
// the release is linked; the scam notice is on the first screen at 1280 x 800 and within
// the first two screens at 390 x 844.   node download-test.ts
//
// Like search-test.ts it answers every request from dist/ (DIST_DIR for another folder)
// for the address the site was built for (SITE_URL and DOCS_URL), so nothing goes to the
// network, and it needs Playwright with Chromium: PLAYWRIGHT_MODULE, or the playwright
// package next to this file. The files it expects are the release that the build recorded
// in src/client-release.json.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import config from './site.config.ts';
import { makeUrls } from './src/urls.ts';
import type { ClientOffer } from './src/client-release.ts';

const root = path.dirname(fileURLToPath(import.meta.url));
const DIST = process.env.DIST_DIR ? path.resolve(process.env.DIST_DIR) : path.join(root, 'dist');
const SITE_URL = (process.env.SITE_URL || config.url).replace(/\/$/, '');
const DOCS_URL = process.env.DOCS_URL || (SITE_URL === config.url ? config.docsUrl : `${SITE_URL}/docs`);
const urls = makeUrls(SITE_URL, DOCS_URL);
const offer = JSON.parse(fs.readFileSync(path.join(root, 'src/client-release.json'), 'utf8')) as ClientOffer;
const release = offer.main;
if (!release) {
	console.error('src/client-release.json has no release; build the site first');
	process.exit(1);
}
const fileName = (os: string, kind: string, arch: string) => release.files.find((f) => f.os === os && f.kind === kind && f.arch === arch)!.name;

const TYPES: Record<string, string> = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.woff2': 'font/woff2' };

interface Hints {
	platform: string;
	mobile: boolean;
	architecture?: string;
}
// A browser: its user agent, what navigator.userAgentData says (null: it has none, as
// Safari and Firefox), its touch points, and the files the primary buttons must name
const CASES: { name: string; ua: string; hints: Hints | null; touch: number; want: string[]; phone?: boolean }[] = [
	{ name: 'Chrome on Windows x64', ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', hints: { platform: 'Windows', mobile: false, architecture: 'x86' }, touch: 0, want: [fileName('windows', 'exe', 'x64')] },
	{ name: 'Edge on Windows on ARM', ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0', hints: { platform: 'Windows', mobile: false, architecture: 'arm' }, touch: 0, want: [fileName('windows', 'exe', 'arm64')] },
	{ name: 'Firefox on Windows', ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0', hints: null, touch: 0, want: [fileName('windows', 'exe', 'x64')] },
	{ name: 'Safari on a Mac', ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Safari/605.1.15', hints: null, touch: 0, want: [fileName('macos', 'dmg', 'arm64'), fileName('macos', 'dmg', 'x64')] },
	{ name: 'Chrome on an Apple silicon Mac', ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', hints: { platform: 'macOS', mobile: false, architecture: 'arm' }, touch: 0, want: [fileName('macos', 'dmg', 'arm64')] },
	{ name: 'Firefox on Ubuntu', ua: 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:133.0) Gecko/20100101 Firefox/133.0', hints: null, touch: 0, want: [fileName('linux', 'deb', 'x64')] },
	{ name: 'Chrome on ARM Linux', ua: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', hints: { platform: 'Linux', mobile: false, architecture: 'arm' }, touch: 0, want: [fileName('linux', 'deb', 'arm64'), fileName('linux', 'rpm', 'arm64')] },
	{ name: 'Safari on an iPhone', ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Mobile/15E148 Safari/604.1', hints: null, touch: 5, want: [], phone: true }
];

interface Route {
	request(): { url(): string };
	fulfill(o: { status?: number; path?: string; body?: string; contentType?: string }): Promise<void>;
	abort(): Promise<void>;
}
interface Page {
	route(url: string, handler: (route: Route) => Promise<void>): Promise<void>;
	addInitScript(script: string): Promise<void>;
	goto(url: string): Promise<unknown>;
	evaluate<T, A>(fn: (arg: A) => T, arg?: A): Promise<T>;
	waitForTimeout(ms: number): Promise<void>;
	close(): Promise<void>;
}
interface Context {
	newPage(): Promise<Page>;
	close(): Promise<void>;
}
interface Browser {
	newContext(o: { userAgent?: string; viewport?: { width: number; height: number }; javaScriptEnabled?: boolean; hasTouch?: boolean; isMobile?: boolean }): Promise<Context>;
	close(): Promise<void>;
}
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright') as { chromium: { launch(): Promise<Browser> } };

async function open(browser: Browser, o: Parameters<Browser['newContext']>[0], init?: string, address = '/download/') {
	const context = await browser.newContext(o);
	const page = await context.newPage();
	if (init) await page.addInitScript(init);
	await page.route('**/*', async (route) => {
		const file = urls.fileOfUrl(route.request().url());
		const full = file && path.join(DIST, file);
		if (full && fs.existsSync(full) && fs.statSync(full).isFile()) await route.fulfill({ path: full, contentType: TYPES[path.extname(full)] ?? 'application/octet-stream' });
		else if (file) await route.fulfill({ status: 404, body: 'not found' });
		else await route.abort();
	});
	await page.goto(urls.url(address));
	return { context, page };
}

/** What the browser says about itself: navigator.userAgentData as the case has it, and its touch points */
const emulate = (hints: Hints | null, touch: number) => `(() => {
	const hints = ${JSON.stringify(hints)};
	Object.defineProperty(Navigator.prototype, 'userAgentData', { configurable: true, get: () => hints && {
		platform: hints.platform, mobile: hints.mobile, brands: [],
		getHighEntropyValues: () => Promise.resolve(hints.architecture ? { architecture: hints.architecture } : {})
	} });
	Object.defineProperty(Navigator.prototype, 'maxTouchPoints', { configurable: true, get: () => ${touch} });
})();`;

const browser = await chromium.launch();
let failed = 0;
const report = (ok: boolean, what: string, detail = '') => {
	if (!ok) failed++;
	console.log(`${ok ? 'ok  ' : 'FAIL'} ${what}${ok || !detail ? '' : `\n     ${detail}`}`);
};

// The primary buttons for each emulated browser, and the one announcement
for (const c of CASES) {
	const { context, page } = await open(browser, { userAgent: c.ua, viewport: { width: 1280, height: 800 } }, emulate(c.hints, c.touch));
	await page.waitForTimeout(700);
	const seen = await page.evaluate(() => {
		const card = Array.from(document.querySelectorAll<HTMLElement>('#dl-rec [data-rec]')).filter((el) => !el.hidden);
		return {
			cards: card.map((el) => el.dataset.rec),
			files: card.flatMap((el) => Array.from(el.querySelectorAll<HTMLAnchorElement>('.dl-btn')).map((a) => a.href.split('/').pop())),
			said: document.getElementById('dl-said')?.textContent ?? ''
		};
	}, undefined);
	if (c.phone) report(seen.cards.length === 1 && seen.cards[0] === 'phone' && seen.files.length === 0, `${c.name}: says there is no app for phones`, JSON.stringify(seen));
	else report(seen.cards.length === 1 && JSON.stringify(seen.files) === JSON.stringify(c.want), `${c.name}: ${c.want.join(' and ')}`, `got ${JSON.stringify(seen)}`);
	report(!!seen.said, `${c.name}: the recommendation is announced`, `status is "${seen.said}"`);
	await context.close();
}

// A click on the recommended download opens the window with the file's name and its steps
{
	const c = CASES[0];
	const { context, page } = await open(browser, { userAgent: c.ua, viewport: { width: 1280, height: 800 } }, emulate(c.hints, c.touch));
	await page.waitForTimeout(700);
	const seen = await page.evaluate(() => {
		// The test's server has no release files, so the click must not leave the page
		document.addEventListener('click', (e) => e.preventDefault(), true);
		const win = document.getElementById('dl-window') as HTMLDialogElement | null;
		const before = !!win?.open;
		const inPage = Array.from(document.querySelectorAll<HTMLElement>('#dl-rec [data-rec]:not([hidden]) .dl-steps')).some((el) => el.offsetParent !== null);
		document.querySelector<HTMLAnchorElement>('#dl-rec [data-rec]:not([hidden]) .dl-btn')?.click();
		return {
			before,
			inPage,
			open: !!win?.open,
			file: win?.querySelector('.dl-window-file')?.textContent ?? '',
			steps: win?.querySelectorAll('.dl-window-steps li').length ?? 0,
			again: win?.querySelector<HTMLAnchorElement>('.dl-window-again')?.href.split('/').pop() ?? ''
		};
	}, undefined);
	report(!seen.before && seen.open, `${c.name}: a click on the download opens the window`, JSON.stringify(seen));
	report(seen.file.includes(c.want[0]) && seen.again === c.want[0], `${c.name}: the window names ${c.want[0]} and offers it again`, JSON.stringify(seen));
	report(seen.steps === 3 && !seen.inPage, `${c.name}: the window lists three steps, and they are not under the button too`, JSON.stringify(seen));
	await context.close();
}

// Without scripts: "Pick your system", and a link to every file of the release
for (const address of ['/download/', '/de/download/']) {
	const { context, page } = await open(browser, { javaScriptEnabled: false, viewport: { width: 1280, height: 800 } }, undefined, address);
	const seen = await page.evaluate(() => ({
		links: Array.from(document.querySelectorAll<HTMLAnchorElement>('.dl-all a.dl-get')).map((a) => a.href),
		visible: Array.from(document.querySelectorAll<HTMLElement>('#dl-rec [data-rec]')).filter((el) => !el.hidden).map((el) => el.dataset.rec)
	}), undefined);
	const missing = release.files.filter((f) => !seen.links.includes(f.url)).map((f) => f.name);
	report(!missing.length && seen.links.length === release.files.length, `${address} without scripts links all ${release.files.length} files`, `missing ${missing.join(', ')}; ${seen.links.length} links`);
	report(JSON.stringify(seen.visible) === '["other"]', `${address} without scripts shows "Pick your system"`, JSON.stringify(seen.visible));
	await context.close();
}

// The scam notice: on the first screen of a laptop, within two screens of a phone
for (const [width, height, screens] of [[1280, 800, 1], [390, 844, 2]] as const) {
	const { context, page } = await open(browser, { userAgent: CASES[0].ua, viewport: { width, height }, hasTouch: width < 600, isMobile: width < 600 }, emulate(CASES[0].hints, 0));
	await page.waitForTimeout(700);
	const box = await page.evaluate(() => {
		const r = document.querySelector('.dl-scam')!.getBoundingClientRect();
		return { top: r.top, bottom: r.bottom, scrollWidth: document.documentElement.scrollWidth };
	}, undefined);
	report(box.top >= 0 && box.bottom <= height * screens, `${width} x ${height}: the scam notice ends within ${screens === 1 ? 'the first screen' : 'the first two screens'}`, `from ${Math.round(box.top)} to ${Math.round(box.bottom)} px`);
	report(box.scrollWidth <= width, `${width} x ${height}: no sideways scrolling`, `the page is ${box.scrollWidth} px wide`);
	await context.close();
}

await browser.close();
if (failed) {
	console.error(`${failed} checks failed`);
	process.exit(1);
}
