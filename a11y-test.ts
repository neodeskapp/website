// Checks the built site's accessibility in a headless browser: axe-core on sample pages
// in both themes and at phone and desktop width, and what axe can't see: the search
// dialog's keyboard and screen reader behaviour, copy feedback, the sidebar panel on
// phones, contrast of a few states, reflow at 320 px, target sizes and forced colours.
//   node a11y-test.ts [name ...]
//
// Names pick checks by the start of their name ("search", "sidebar"). Like
// download-test.ts it answers every request from dist/ (DIST_DIR for another folder) for
// the address the site was built for (SITE_URL and DOCS_URL), so nothing goes to the
// network. It needs Playwright with Chromium (PLAYWRIGHT_MODULE, or the playwright
// package next to this file) and axe-core (AXE_FILE, the path of axe.min.js, or the
// axe-core package next to this file).
//
// The light theme's code blue (#1f6feb on #f4f6f6, 4.27:1) is a known gap the
// accessibility statement names; axe's reports of exactly that pair are left out.
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
const require = createRequire(import.meta.url);
const AXE = fs.readFileSync(process.env.AXE_FILE || require.resolve('axe-core/axe.min.js'), 'utf8');

const TYPES: Record<string, string> = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.gz': 'application/gzip', '.md': 'text/markdown; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.woff2': 'font/woff2' };

/* eslint-disable @typescript-eslint/no-explicit-any */
type Page = any;
type Context = any;
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright') as { chromium: { launch(): Promise<any> } };

interface Open {
	width?: number;
	height?: number;
	scheme?: 'light' | 'dark';
	js?: boolean;
	forced?: boolean;
	init?: string;
}
const browser = await chromium.launch();
async function open(address: string, o: Open = {}): Promise<{ context: Context; page: Page }> {
	const context = await browser.newContext({ viewport: { width: o.width ?? 1280, height: o.height ?? 900 }, colorScheme: o.scheme ?? 'light', javaScriptEnabled: o.js ?? true, forcedColors: o.forced ? 'active' : 'none', reducedMotion: 'reduce' });
	await context.grantPermissions(['clipboard-read', 'clipboard-write']);
	const page = await context.newPage();
	if (o.init) await page.addInitScript(o.init);
	await page.route('**/*', async (route: any) => {
		const file = urls.fileOfUrl(route.request().url());
		const full = file && path.join(DIST, file);
		if (full && fs.existsSync(full) && fs.statSync(full).isFile()) await route.fulfill({ path: full, contentType: TYPES[path.extname(full)] ?? 'application/octet-stream' });
		else if (file) await route.fulfill({ status: 404, body: 'not found' });
		else await route.abort();
	});
	await page.goto(urls.url(address));
	await page.evaluate(() => document.fonts.ready);
	return { context, page };
}

let failed = 0;
const report = (ok: boolean, what: string, detail = '') => {
	if (!ok) failed++;
	console.log(`${ok ? 'ok  ' : 'FAIL'} ${what}${ok || !detail ? '' : `\n     ${detail.replace(/\n/g, '\n     ')}`}`);
};

/** Contrast of two colours given as [r, g, b] */
function ratio(a: number[], b: number[]) {
	const lum = (c: number[]) => {
		const [r, g, bl] = c.map((v) => {
			const s = v / 255;
			return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
		});
		return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
	};
	const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
	return (x + 0.05) / (y + 0.05);
}

/**
 * The colour an element's text has on screen and the colour behind it: its text colour
 * with its own and its parents' opacity, over the first opaque background further up.
 * pseudo reads a ::placeholder or similar.
 */
const COLOURS = `(function (el, pseudo) {
	var rgba = function (s) { var m = s.match(/[\\d.]+/g).map(Number); return [m[0], m[1], m[2], m.length > 3 ? m[3] : 1]; };
	var cs = getComputedStyle(el, pseudo || null);
	var fg = rgba(cs.color);
	var alpha = fg[3] * (pseudo ? Number(cs.opacity) : 1);
	var bg = null;
	for (var n = el; n && n.nodeType === 1; n = n.parentElement) {
		alpha *= Number(getComputedStyle(n).opacity);
		var b = rgba(getComputedStyle(n).backgroundColor);
		if (!bg && b[3] === 1) bg = b;
	}
	bg = bg || [255, 255, 255];
	return { fg: [0, 1, 2].map(function (i) { return Math.round(fg[i] * alpha + bg[i] * (1 - alpha)); }), bg: bg.slice(0, 3) };
})`;
async function contrastOf(page: Page, selector: string, pseudo = ''): Promise<number | null> {
	const c = await page.evaluate(([s, p, src]: string[]) => {
		const el = document.querySelector(s);
		return el ? (0, eval)(src)(el, p) : null;
	}, [selector, pseudo, COLOURS]);
	return c ? ratio(c.fg, c.bg) : null;
}

const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];
/** axe on the page; the known code blue gap in light mode is left out. */
async function axe(page: Page, options: { include?: string; rules?: string[] } = {}) {
	if (!(await page.evaluate(() => 'axe' in window))) await page.evaluate(AXE);
	const r = await page.evaluate(
		([include, rules, tags]: [string | undefined, string[] | undefined, string[]]) =>
			(window as any).axe.run(include ? { include: [include] } : document, {
				...(rules ? { runOnly: { type: 'rule', values: rules } } : { runOnly: { type: 'tag', values: tags } }),
				rules: { 'label-content-name-mismatch': { enabled: true } }
			}),
		[options.include, options.rules, AXE_TAGS]
	);
	const knownGap = (n: any) => n.any?.some((c: any) => c.id === 'color-contrast' && c.data?.fgColor === '#1f6feb' && c.data?.bgColor === '#f4f6f6');
	const violations = r.violations
		.map((v: any) => ({ ...v, nodes: v.id === 'color-contrast' ? v.nodes.filter((n: any) => !knownGap(n)) : v.nodes }))
		.filter((v: any) => v.nodes.length);
	return { violations, incomplete: r.incomplete };
}
const listViolations = (vs: any[]) => vs.map((v) => `${v.id} (${v.nodes.length}): ${v.nodes.slice(0, 3).map((n: any) => n.target.join(' ')).join(', ')}`).join('\n');

const DOCKER = '/docs/getting-started/docker/';
/** Marks the first visible element that matches, for a click on it. */
async function markVisible(page: Page, selector: string) {
	await page.evaluate((s: string) => {
		const all = Array.from(document.querySelectorAll(s)) as HTMLElement[];
		const el = all.find((e) => e.checkVisibility()) ?? all[0];
		// One inside a closed <details> is opened first
		for (let d = el?.closest('details'); d; d = d.parentElement?.closest('details') ?? null) d.open = true;
		el?.setAttribute('data-test-target', '');
	}, selector);
}
async function openSearch(page: Page, query: string) {
	await page.keyboard.press('Control+K');
	await page.waitForSelector('dialog.search[open]');
	await page.keyboard.type(query, { delay: 60 });
	await page.waitForTimeout(900);
}

const CHECKS: Record<string, () => Promise<void>> = {
	/* ---- axe on sample pages ---- */
	async 'axe sample pages'() {
		const pages = ['/', '/de/', '/docs/', DOCKER, '/de/docs/getting-started/docker/', '/docs/compare/anydesk/', '/docs/console/add-a-computer/', '/download/', '/de/download/', '/brand/', '/brand/elements/', '/brand/fonts/', '/support/'];
		for (const p of pages)
			for (const width of [320, 1280])
				for (const scheme of ['light', 'dark'] as const) {
					const { context, page } = await open(p, { width, scheme });
					const { violations, incomplete } = await axe(page);
					const prohibited = incomplete.filter((v: any) => v.id === 'aria-prohibited-attr');
					report(!violations.length && !prohibited.length, `axe: ${p} at ${width} px, ${scheme}`, listViolations([...violations, ...prohibited]));
					await context.close();
				}
	},

	/* ---- 1.2 the file line on the download button ---- */
	async 'contrast download button file line'() {
		for (const scheme of ['light', 'dark'] as const) {
			const { context, page } = await open('/download/', { scheme });
			await page.waitForTimeout(700);
			const r = await contrastOf(page, '#dl-rec [data-rec]:not([hidden]) .dl-btn-file');
			report(r !== null && r >= 4.5, `contrast: the download button's file line, ${scheme}`, `${r?.toFixed(2)}:1`);
			await context.close();
		}
	},

	/* ---- 1.3 the search placeholder ---- */
	async 'contrast search placeholder'() {
		for (const scheme of ['light', 'dark'] as const) {
			const { context, page } = await open(DOCKER, { scheme });
			await page.keyboard.press('Control+K');
			await page.waitForSelector('dialog.search[open]');
			const r = await contrastOf(page, '#search-input', '::placeholder');
			report(r !== null && r >= 4.5, `contrast: the search field's placeholder, ${scheme}`, `${r?.toFixed(2)}:1`);
			await context.close();
		}
	},

	/* ---- 1.4 the terminal's system name without scripts ---- */
	async 'contrast terminal label'() {
		for (const scheme of ['light', 'dark'] as const) {
			const { context, page } = await open('/', { scheme, js: false });
			const r = await contrastOf(page, '.term-os');
			report(r !== null && r >= 4.5, `contrast: the install terminal's system name without scripts, ${scheme}`, `${r?.toFixed(2)}:1`);
			await context.close();
		}
	},

	/* ---- 1.5 borders of controls ---- */
	async 'contrast control borders'() {
		for (const scheme of ['light', 'dark'] as const) {
			for (const [p, sel, width] of [[DOCKER, '.menu-button', 320], [DOCKER, 'header .search-button', 1280], [DOCKER, '.top-menu summary', 320], ['/download/', '.dl-get', 1280]] as const) {
				const { context, page } = await open(p, { scheme, width });
				const c = await page.evaluate(([s, src]: string[]) => {
					const el = document.querySelector(s) as HTMLElement;
					if (!el) return null;
					const border = getComputedStyle(el).borderTopColor;
					const probe = document.createElement('span');
					probe.style.color = border;
					el.parentElement!.appendChild(probe);
					const out = (0, eval)(src)(probe, '');
					probe.remove();
					return out;
				}, [sel, COLOURS]);
				const r = c ? ratio(c.fg, c.bg) : null;
				report(r !== null && r >= 3, `contrast: the border of ${sel} on ${p}, ${scheme}`, `${r?.toFixed(2)}:1`);
				await context.close();
			}
		}
	},

	/* ---- 2.1 the number of results is said once, after typing ---- */
	async 'search result count'() {
		const { context, page } = await open(DOCKER);
		await page.keyboard.press('Control+K');
		await page.waitForSelector('dialog.search[open]');
		// Wait for the index, then record every change of a live region while typing
		await page.waitForTimeout(800);
		await page.evaluate(() => {
			const w = window as any;
			w.__said = [];
			const regions = Array.from(document.querySelectorAll('dialog.search [role="status"], dialog.search [aria-live]')).filter((el) => el.getAttribute('aria-live') !== 'off');
			for (const el of regions) new MutationObserver(() => w.__said.push({ text: el.textContent, hidden: (el as HTMLElement).hidden || getComputedStyle(el).display === 'none' })).observe(el, { childList: true, characterData: true, subtree: true });
		});
		await page.keyboard.type('docker', { delay: 80 });
		await page.waitForTimeout(1200);
		const said = (await page.evaluate(() => (window as any).__said)) as { text: string; hidden: boolean }[];
		const heard = said.filter((s) => !s.hidden && s.text.trim());
		report(heard.length === 1 && /\d+/.test(heard[0].text), 'search: the number of results is announced once after typing', JSON.stringify(said));
		await context.close();
	},

	/* ---- 2.2 the combobox pattern ---- */
	async 'search combobox'() {
		const { context, page } = await open(DOCKER);
		await openSearch(page, 'docker');
		const seen = await page.evaluate(() => {
			const input = document.getElementById('search-input')!;
			const list = document.getElementById('search-results')!;
			const options = Array.from(list.querySelectorAll('[role="option"]'));
			const groups = Array.from(list.querySelectorAll('[role="group"]'));
			return {
				role: input.getAttribute('role'),
				expanded: input.getAttribute('aria-expanded'),
				autocomplete: input.getAttribute('aria-autocomplete'),
				controls: input.getAttribute('aria-controls'),
				active: input.getAttribute('aria-activedescendant'),
				options: options.length,
				interactive: options.filter((o) => o.querySelector('a, button, input, [tabindex]')).length,
				groups: groups.length,
				namedGroups: groups.filter((g) => {
					const id = g.getAttribute('aria-labelledby');
					return id && document.getElementById(id)?.textContent?.trim();
				}).length,
				presentation: list.querySelectorAll('[role="presentation"]').length
			};
		});
		report(seen.role === 'combobox' && seen.expanded === 'true' && seen.autocomplete === 'list' && seen.controls === 'search-results', 'search: the field is a combobox that controls the results', JSON.stringify(seen));
		report(seen.options > 0 && seen.interactive === 0, 'search: results are options without links or buttons inside', JSON.stringify(seen));
		report(seen.groups > 0 && seen.namedGroups === seen.groups && seen.presentation === 0, 'search: result groups are named groups', JSON.stringify(seen));
		const { violations, incomplete } = await axe(page, { include: 'dialog.search' });
		const required = incomplete.filter((v: any) => /^aria-required/.test(v.id));
		report(!violations.length && !required.length, 'search: axe finds nothing in the dialog with results', listViolations([...violations, ...required]));
		// The arrow keys and Enter still open a result
		await page.keyboard.press('ArrowDown');
		const want = await page.evaluate(() => {
			const id = document.getElementById('search-input')!.getAttribute('aria-activedescendant');
			const li = id ? document.getElementById(id) : null;
			return li ? li.getAttribute('data-href') || li.querySelector('a')?.getAttribute('href') : null;
		});
		await page.keyboard.press('Enter');
		await page.waitForTimeout(600);
		report(!!want && page.url() === new URL(want, page.url()).href, 'search: Enter opens the selected result', `${page.url()} want ${want}`);
		// Without results the list is collapsed
		await page.keyboard.press('Control+K');
		await page.fill('#search-input', 'zzqxv');
		await page.waitForTimeout(800);
		const collapsed = await page.evaluate(() => document.getElementById('search-input')!.getAttribute('aria-expanded'));
		report(collapsed === 'false', 'search: aria-expanded is false without results', String(collapsed));
		await context.close();
	},

	/* ---- 2.3 copy buttons say they copied ---- */
	async 'copy feedback'() {
		for (const [p, sel] of [[DOCKER, '.code .copy'], ['/download/', '.code .copy'], ['/', '.term:not([hidden]) .term-copy']] as const) {
			const { context, page } = await open(p);
			await page.waitForTimeout(300);
			await page.evaluate(() => {
				const w = window as any;
				w.__said = [];
				new MutationObserver((records) => {
					for (const r of records) {
						const el = (r.target.nodeType === 1 ? r.target : r.target.parentElement) as HTMLElement;
						const live = el.closest('[role="status"], [aria-live="polite"], [aria-live="assertive"]');
						if (live && live.textContent!.trim()) w.__said.push(live.textContent!.trim());
					}
				}).observe(document.body, { childList: true, characterData: true, subtree: true });
			});
			await markVisible(page, sel);
			await page.click('[data-test-target]');
			await page.waitForTimeout(300);
			const after = await page.evaluate(() => {
				const b = document.querySelector('[data-test-target]')!;
				return { said: (window as any).__said as string[], text: b.textContent!.trim(), label: b.getAttribute('aria-label') };
			});
			report(after.said.some((s: string) => /cop|kopiert/i.test(s)), `copy: ${p} announces the copy`, JSON.stringify(after));
			report(!after.label || after.label.toLowerCase().includes(after.text.toLowerCase()), `copy: ${p} the button's name holds its visible text after the click`, JSON.stringify(after));
			await context.close();
			// A copy that fails says so
			const failing = `(() => {
				Object.defineProperty(navigator, 'clipboard', { configurable: true, get: () => ({ writeText: () => Promise.reject(new Error('no')) }) });
				document.execCommand = () => false;
			})();`;
			const f = await open(p, { init: failing });
			await f.page.waitForTimeout(300);
			await markVisible(f.page, sel);
			await f.page.click('[data-test-target]');
			await f.page.waitForTimeout(300);
			const statusText = await f.page.evaluate(() => Array.from(document.querySelectorAll('[role="status"], [aria-live="polite"]')).map((el) => el.textContent!.trim()).join('|'));
			report(/couldn|fehlgeschlagen/i.test(statusText), `copy: ${p} says when the copy failed`, statusText);
			await f.context.close();
		}
	},

	/* ---- 2.4 no single-character shortcut ---- */
	async 'search slash key'() {
		const { context, page } = await open(DOCKER);
		await page.waitForTimeout(300);
		await page.keyboard.press('/');
		const opened = await page.evaluate(() => !!document.querySelector('dialog.search[open]'));
		report(!opened, 'search: "/" outside a field does not open search', `open: ${opened}`);
		await page.keyboard.press('Control+K');
		const ctrlK = await page.evaluate(() => !!document.querySelector('dialog.search[open]'));
		report(ctrlK, 'search: Ctrl+K opens search');
		await context.close();
	},

	/* ---- 2.5 focus indicator on the search field ---- */
	async 'search focus style'() {
		for (const scheme of ['light', 'dark'] as const) {
			const { context, page } = await open(DOCKER, { scheme });
			await page.keyboard.press('Control+K');
			await page.waitForSelector('dialog.search[open]');
			const seen = await page.evaluate(() => {
				const input = document.getElementById('search-input')!;
				const field = input.closest('.search-field')!;
				const a = getComputedStyle(input);
				const b = getComputedStyle(field);
				return { focused: document.activeElement === input, input: `${a.outlineStyle} ${a.outlineWidth}`, field: `${b.outlineStyle} ${b.outlineWidth}`, shadow: b.boxShadow };
			});
			const visible = (s: string) => !/^none/.test(s) && !/ 0px$/.test(s);
			report(seen.focused && (visible(seen.input) || visible(seen.field) || seen.shadow !== 'none'), `search: the field shows focus, ${scheme}`, JSON.stringify(seen));
			await context.close();
		}
	},

	/* ---- 2.6 Escape closes the search at once ---- */
	async 'search escape'() {
		const { context, page } = await open(DOCKER);
		await page.focus('header .search-button');
		await page.keyboard.press('Enter');
		await page.waitForSelector('dialog.search[open]');
		await page.keyboard.type('docker');
		await page.keyboard.press('Escape');
		const seen = await page.evaluate(() => ({ open: !!document.querySelector('dialog.search[open]'), focus: document.activeElement?.className ?? '' }));
		report(!seen.open && /search-button/.test(seen.focus), 'search: one Escape closes the dialog and focus returns to the search button', JSON.stringify(seen));
		await context.close();
	},

	/* ---- 3.1 the sidebar panel on phones is modal ---- */
	async 'sidebar panel'() {
		for (const width of [320, 768]) {
			const { context, page } = await open(DOCKER, { width });
			await page.click('.menu-button');
			const links = await page.evaluate(() => document.querySelectorAll('#sidebar a').length);
			const outside: string[] = [];
			for (let i = 0; i < links + 6; i++) {
				await page.keyboard.press('Tab');
				const where = await page.evaluate(() => {
					const el = document.activeElement as HTMLElement;
					if (!el || el === document.body) return 'body';
					if (el.closest('#sidebar') || el.classList.contains('menu-button')) return '';
					return el.outerHTML.slice(0, 80);
				});
				if (where) outside.push(where);
			}
			report(!outside.length, `sidebar: at ${width} px Tab stays in the open panel`, outside.slice(0, 3).join('\n'));
			const inert = await page.evaluate(() => ({ main: (document.getElementById('content') as any).inert || !!document.getElementById('content')!.closest('[inert]'), foot: !!document.querySelector('footer.foot')?.closest('[inert]') }));
			report(inert.main && inert.foot, `sidebar: at ${width} px the page behind the open panel is inert`, JSON.stringify(inert));
			await page.keyboard.press('Escape');
			const after = await page.evaluate(() => ({ expanded: document.querySelector('.menu-button')!.getAttribute('aria-expanded'), focus: document.activeElement?.classList.contains('menu-button'), inert: !!document.querySelector('[inert]') }));
			report(after.expanded === 'false' && !!after.focus && !after.inert, `sidebar: at ${width} px Escape closes the panel, returns focus and frees the page`, JSON.stringify(after));
			await context.close();
		}
	},

	/* ---- 4.1, 4.2 only scrolling blocks are named tab stops ---- */
	async 'scroll regions'() {
		for (const p of [DOCKER, '/docs/compare/anydesk/', '/brand/elements/', '/brand/fonts/', '/download/'])
			for (const width of [320, 1280]) {
				const { context, page } = await open(p, { width });
				await page.waitForTimeout(300);
				const seen = await page.evaluate(() => {
					const blocks = Array.from(document.querySelectorAll('main pre, main .table-wrap')) as HTMLElement[];
					const bad: string[] = [];
					for (const el of blocks) {
						if (el.offsetParent === null) continue;
						const scrolls = el.scrollWidth > el.clientWidth + 1;
						const stop = el.tabIndex >= 0 && el.hasAttribute('tabindex');
						const named = !!(el.getAttribute('aria-label') || (el.getAttribute('aria-labelledby') && document.getElementById(el.getAttribute('aria-labelledby')!)?.textContent?.trim()));
						const region = el.getAttribute('role') === 'region';
						if (scrolls && !(stop && named && region)) bad.push(`scrolls but is not a named region tab stop: ${el.outerHTML.slice(0, 70)}`);
						if (!scrolls && stop) bad.push(`a tab stop that does not scroll: ${el.outerHTML.slice(0, 70)}`);
					}
					return bad;
				});
				report(!seen.length, `scroll regions: ${p} at ${width} px`, `${seen.length} blocks\n${seen.slice(0, 3).join('\n')}`);
				await context.close();
			}
	},

	/* ---- 6.1 display headings reflow ---- */
	async 'reflow'() {
		const spacing = '* { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; } p { margin-bottom: 2em !important; }';
		for (const p of ['/', '/de/', '/docs/', '/de/docs/', '/download/', '/de/download/', '/brand/', '/de/brand/', '/support/', '/de/support/', '/404.html', '/de/404.html', DOCKER])
			for (const spaced of [false, true]) {
				const { context, page } = await open(p, { width: 320 });
				if (spaced) await page.addStyleTag({ content: spacing });
				await page.waitForTimeout(200);
				const w = await page.evaluate(() => {
					const wide = Array.from(document.querySelectorAll('h1, h2')).filter((h) => (h as HTMLElement).offsetParent !== null && h.scrollWidth > h.clientWidth + 1).map((h) => h.textContent!.trim().slice(0, 30));
					return { page: document.documentElement.scrollWidth, wide };
				});
				report(w.page <= 320 && !w.wide.length, `reflow: ${p} at 320 px${spaced ? ' with text spacing' : ''}`, JSON.stringify(w));
				await context.close();
			}
	},

	/* ---- 6.2 a skip link on every page ---- */
	async 'skip link'() {
		for (const p of ['/', '/de/', DOCKER, '/download/']) {
			const { context, page } = await open(p);
			await page.keyboard.press('Tab');
			const seen = await page.evaluate(() => {
				const a = document.activeElement as HTMLAnchorElement;
				const target = a?.hash ? document.getElementById(a.hash.slice(1)) : null;
				return { text: a?.textContent?.trim(), target: target?.tagName ?? null, visible: a ? a.getBoundingClientRect().top >= 0 : false };
			});
			report(seen.target === 'MAIN' && seen.visible, `skip link: ${p}, the first Tab shows a link to the main content`, JSON.stringify(seen));
			await context.close();
		}
	},

	/* ---- 6.3 small links at least 24 px ---- */
	async 'target size'() {
		for (const p of [DOCKER, '/docs/getting-started/', '/docs/all/']) {
			const { context, page } = await open(p, { width: 320 });
			const small = await page.evaluate(() =>
				Array.from(document.querySelectorAll('.crumb a, .md-link'))
					.map((a) => ({ text: a.textContent!.trim(), h: Math.round(a.getBoundingClientRect().height) }))
					.filter((x) => x.h < 24)
			);
			report(!small.length, `target size: ${p} at 320 px, breadcrumb and page links are 24 px high`, JSON.stringify(small));
			await context.close();
		}
	},

	/* ---- 7.1 forced colours ---- */
	async 'forced colours'() {
		for (const [p, sel] of [['/download/', '#dl-rec [data-rec]:not([hidden]) .dl-btn'], ['/download/', '.dl-get'], ['/404.html', '.nf-btn'], ['/', '.btn']] as const) {
			const { context, page } = await open(p, { forced: true });
			await page.waitForTimeout(700);
			const b = await page.evaluate((s: string) => {
				const cs = getComputedStyle(document.querySelector(s)!);
				return `${cs.borderTopStyle} ${cs.borderTopWidth}`;
			}, sel);
			report(!/^none/.test(b) && b !== 'solid 0px', `forced colours: ${sel} on ${p} keeps a border`, b);
			await context.close();
		}
		const { context, page } = await open(DOCKER, { forced: true });
		const marker = await page.evaluate(() => {
			const cur = document.querySelector('.sidebar li a[aria-current="page"]')!;
			const other = document.querySelector('.sidebar li a:not([aria-current])')!;
			return { current: getComputedStyle(cur).borderLeftColor, other: getComputedStyle(other).borderLeftColor };
		});
		report(marker.current !== marker.other && !/rgba\(0, 0, 0, 0\)/.test(marker.current), 'forced colours: the current page keeps its marker in the sidebar', JSON.stringify(marker));
		await context.close();
	},

	/* ---- 7.2 the keyboard's context menu on the logo ---- */
	async 'logo context menu'() {
		const { context, page } = await open(DOCKER);
		const before = page.url();
		await page.focus('header .logo');
		const prevented = await page.evaluate(() => {
			const a = document.querySelector('header .logo')!;
			const out: boolean[] = [];
			for (const init of [{ key: 'ContextMenu' }, { key: 'F10', shiftKey: true }]) {
				const e = new KeyboardEvent('keydown', { ...init, bubbles: true, cancelable: true });
				a.dispatchEvent(e);
				out.push(e.defaultPrevented);
			}
			return out;
		});
		await page.waitForTimeout(400);
		report(!prevented.some(Boolean) && page.url() === before, 'logo: the context menu key and Shift+F10 keep the browser menu', `${JSON.stringify(prevented)} ${page.url()}`);
		// The same with the keys pressed, which also fires the contextmenu event
		for (const key of ['Shift+F10', 'ContextMenu']) {
			await page.focus('header .logo');
			await page.keyboard.press(key);
			await page.waitForTimeout(400);
			report(page.url() === before, `logo: pressing ${key} on the logo stays on the page`, page.url());
			if (page.url() !== before) await page.goto(before);
		}
		await context.close();
	}
};

const only = process.argv.slice(2);
for (const [name, run] of Object.entries(CHECKS)) {
	if (only.length && !only.some((o) => name.startsWith(o))) continue;
	console.log(`-- ${name}`);
	try {
		await run();
	} catch (e) {
		report(false, `${name}: the check itself failed`, String((e as Error).stack ?? e).slice(0, 600));
	}
}
await browser.close();
if (failed) {
	console.error(`${failed} checks failed`);
	process.exit(1);
}
