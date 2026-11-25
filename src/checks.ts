// Checks that run on the built site in dist/. Each returns a list of problems;
// the build fails when any check finds one.
import fs from 'node:fs';
import path from 'node:path';
import { parse, find, findAll, byTag, isHidden, textOf, decode } from './html.ts';
import { LOCALES } from './i18n.ts';
import type { Urls } from './urls.ts';

/** Every file under a folder, as paths relative to it with forward slashes. */
export function listFiles(dir: string, base = dir): string[] {
	const out: string[] = [];
	for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
		const file = path.join(dir, e.name);
		if (e.isDirectory()) out.push(...listFiles(file, base));
		else out.push(path.relative(base, file).replace(/\\/g, '/'));
	}
	return out;
}

const TEXT = /\.(html|md|txt|json|xml)$/;
const lineOf = (text: string, index = 0) => text.slice(0, index).split('\n').length;

/* ---------- the old name ---------- */

// The old project's names; betterdesk also catches trybetterdesk
const OLD_NAME = /betterdesk|betterde\.sk|unitronix/gi;
const OLD_IMAGE = /ghcr\.io\/[\w.-]+\/betterdesk[\w.-]*/gi;
// The built files the check reads: pages, Markdown copies, llms files, search, sitemap, scripts, styles and SVGs
const OLD_NAME_FILES = /\.(html|md|txt|json|xml|js|css|svg)$/;

/** A sentence as a pattern that matches it exactly, also across a line break. */
const sentence = (text: string) => new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/ /g, '\\s+'), 'g');

// The only sentences that may name the old project, each only on its own page, in
// English and German: the notices on the license page and the copyright policy on the
// contributing page. Any other mention in the built site fails the build. A change to
// one of these sentences in the docs needs the same change here.
export const OLD_NAME_ALLOW: { page: string; sentence: RegExp }[] = [
	...[
		'NeoDesk is a modified version of BetterDesk by UNITRONIX, released under the AGPL-3.0.',
		'UNITRONIX holds the copyright the LICENSE file names.',
		'NeoDesk ist eine veränderte Version von BetterDesk von UNITRONIX, veröffentlicht unter der AGPL-3.0.',
		'UNITRONIX hält das Urheberrecht, das die LICENSE-Datei nennt.'
	].map((s) => ({ page: 'project/license', sentence: sentence(s) })),
	...[
		"The copyright notice in LICENSE names the project's copyright holder, UNITRONIX.",
		'It does not transfer the copyright in later contributions to UNITRONIX.',
		"Where UNITRONIX has no assignment, the contributor's copyright and the AGPL treatment of their code are kept, and nobody claims exclusive ownership of it.",
		'Where UNITRONIX needs exclusive control of a contribution, it gets a written copyright assignment or a suitable contributor agreement before the code is accepted.',
		'A commercial grant or a dual license can only be offered for material whose copyright and third-party permissions UNITRONIX actually controls.',
		'Der Urheberrechtsvermerk in LICENSE nennt den Urheberrechtsinhaber des Projekts, UNITRONIX.',
		'Er überträgt das Urheberrecht an späteren Beiträgen nicht auf UNITRONIX.',
		'Wo UNITRONIX keine Abtretung hat, bleiben das Urheberrecht der Mitwirkenden und die AGPL-Behandlung ihres Codes erhalten, und niemand beansprucht exklusives Eigentum daran.',
		'Wo UNITRONIX die exklusive Kontrolle über einen Beitrag braucht, bekommt es vor der Annahme des Codes eine schriftliche Abtretung des Urheberrechts oder eine passende Vereinbarung mit den Mitwirkenden.',
		'Eine kommerzielle Rechteeinräumung oder eine Doppellizenz lässt sich nur für Material anbieten, dessen Urheberrecht und Genehmigungen Dritter UNITRONIX tatsächlich kontrolliert.'
	].map((s) => ({ page: 'development/contributing', sentence: sentence(s) }))
];

/** The docs page a file is the copy of: docs/a/b/index.html, docs/a/b.md and docs/de/a/b.md are page a/b. */
function pageOfFile(urls: Urls, rel: string) {
	const m = urls.withoutLocale(rel).match(/^docs\/(.+?)(?:\/index\.html|\.md)$/);
	return m ? m[1] : null;
}

/**
 * The page each part of a file belongs to. A line that links to a page (a list of
 * pages with their descriptions) belongs to that page; in the collected llms files
 * the rest belongs to the page under the last "Source:" line.
 */
function pageAt(urls: Urls, text: string, index: number, rel: string) {
	const start = text.lastIndexOf('\n', index) + 1;
	const end = text.indexOf('\n', index);
	const line = text.slice(start, end === -1 ? text.length : end);
	const pageOfUrl = (u: string) => {
		const file = urls.fileOfUrl(u.replace(/\.md$/, '/'));
		return file ? pageOfFile(urls, file) : null;
	};
	const listed = [...line.matchAll(/(?:href="|\]\()(https?:\/\/[^"\s)]+)(?:"|\))/g)].map((m) => pageOfUrl(m[1])).filter(Boolean);
	if (listed.length === 1) return listed[0];
	const sources = [...text.slice(0, index).matchAll(/^Source: (\S+?)$/gm)];
	if (sources.length && rel.endsWith('.txt')) return pageOfUrl(sources[sources.length - 1][1]);
	return pageOfFile(urls, rel);
}

export interface CheckInput {
	dist: string;
	siteUrl: string;
	urls: Urls;
	version: string;
	production: boolean;
	aiCrawlers: string[];
}

export function checkOldNames({ dist, urls }: CheckInput) {
	const problems: string[] = [];
	for (const rel of listFiles(dist).filter((f) => OLD_NAME_FILES.test(f))) {
		const raw = fs.readFileSync(path.join(dist, rel), 'utf8');
		for (const m of raw.matchAll(OLD_IMAGE)) problems.push(`${rel}:${lineOf(raw, m.index)}: old image path "${m[0]}"`);
		if (urls.withoutLocale(rel) === 'docs/search.json') {
			// The index holds the words of each page, not its sentences: a page that may name
			// the old project (its page is checked sentence by sentence) may have them in its rows
			const index = JSON.parse(raw) as { p: [string, number, string, string, string][]; e: [number, number, string, string, string][] };
			const allowed = new Set(OLD_NAME_ALLOW.map((x) => x.page));
			index.p.forEach((row, n) => {
				const page = pageOfFile(urls, `docs/${row[2]}index.html`);
				if (page && allowed.has(page)) return;
				const fields = JSON.stringify([row, index.e.filter((e) => e[0] === n)]);
				const hit = fields.match(OLD_NAME);
				if (hit) problems.push(`${rel}: "${hit[0]}" in the search entries of ${row[2]}`);
			});
			continue;
		}
		// Blank out the allowed sentences where they are on their own page, keeping every other character where it was
		let text = raw;
		for (const a of OLD_NAME_ALLOW) {
			for (const m of raw.matchAll(a.sentence)) {
				if (pageAt(urls, raw, m.index, rel) === a.page) text = text.slice(0, m.index) + ' '.repeat(m[0].length) + text.slice(m.index + m[0].length);
			}
		}
		for (const m of text.matchAll(OLD_NAME)) {
			const around = raw.slice(Math.max(0, m.index - 40), m.index + 40).replace(/\s+/g, ' ');
			problems.push(`${rel}:${lineOf(raw, m.index)}: old name "${m[0]}" in "...${around}..."`);
		}
	}
	return problems;
}

/* ---------- the old console port ---------- */

// 21114 is the server's API port on Linux and Windows. A sentence that names it and
// the console, the browser or signing in, without saying API, means the console.
const CONSOLE_WORDS = /\b(console|sign(?:s|ed)? in|browser|web interface|dashboard|admin panel|konsole\w*|anmeld\w*|angemeldet|weboberfläche)\b/i;
const API_WORDS = /\bAPI\b|\/api\b|api[-_ ]port|metrics/i;

/** A file's text as sentences: tags, scripts and styles dropped, one block or line at a time. */
function sentences(raw: string, rel: string) {
	let text = raw;
	if (rel.endsWith('.html')) {
		text = text
			.replace(/<(script|style)[\s\S]*?<\/\1>/gi, '\n')
			.replace(/<\/?(p|li|tr|td|th|h[1-6]|pre|div|section|ul|ol|table|dd|dt|br)\b[^>]*>/gi, '\n')
			.replace(/<[^>]+>/g, '')
			.replace(/&lt;/g, '<')
			.replace(/&gt;/g, '>')
			.replace(/&quot;/g, '"')
			.replace(/&amp;/g, '&');
	}
	return text.split(/\n+|(?<=[.!?])\s+(?=[A-Z])/);
}

export function checkConsolePort({ dist }: CheckInput) {
	const problems: string[] = [];
	for (const rel of listFiles(dist).filter((f) => /\.(html|md|txt)$/.test(f))) {
		const raw = fs.readFileSync(path.join(dist, rel), 'utf8');
		for (const s of sentences(raw, rel)) {
			if (!s.includes('21114')) continue;
			if (CONSOLE_WORDS.test(s) && !API_WORDS.test(s)) problems.push(`${rel}: 21114 is the server's API port, not the console's: "${s.trim().slice(0, 160)}"`);
		}
	}
	return problems;
}

/* ---------- the version ---------- */

// Places where the site names NeoDesk's version. Each must say the build's version.
// A pre-release part ends on a letter or digit, so the full stop after
// "3.6.0-rc.2." is not part of the version.
const VERSION_MENTIONS = [
	/\bNeoDesk v?(\d+\.\d+\.\d+(?:-[\w.]*\w)?)/g,
	/\bneodesk-server v?(\d+\.\d+\.\d+(?:-[\w.]*\w)?)/g,
	/"softwareVersion":\s*"([^"]*)"/g,
	/\bWritten for version (\d+\.\d+\.\d+(?:-[\w.]*\w)?)/g,
	/\bGeschrieben für Version (\d+\.\d+\.\d+(?:-[\w.]*\w)?)/g
];

export function checkVersion({ dist, version }: CheckInput) {
	const problems: string[] = [];
	for (const rel of listFiles(dist).filter((f) => TEXT.test(f))) {
		const raw = fs.readFileSync(path.join(dist, rel), 'utf8');
		if (raw.includes('{{VERSION}}')) problems.push(`${rel}: "{{VERSION}}" was not replaced`);
		for (const re of VERSION_MENTIONS) {
			for (const m of raw.matchAll(re)) {
				if (m[1] !== version) problems.push(`${rel}:${lineOf(raw, m.index)}: names version ${m[1]}, the build is for ${version}: "${m[0]}"`);
			}
		}
	}
	return problems;
}

/* ---------- readable without scripts ---------- */

const squash = (s: string) => s.replace(/\s+/g, ' ').trim();

/**
 * Every page has its content, navigation and code in the HTML the server sends:
 * the main content and a navigation with links are not empty, no code block is
 * empty, and every tab has a panel of its own with content in it.
 */
export function checkWithoutScripts({ dist, urls }: CheckInput) {
	const problems: string[] = [];
	for (const rel of listFiles(dist).filter((f) => f.endsWith('.html'))) {
		const doc = parse(fs.readFileSync(path.join(dist, rel), 'utf8'));
		const main = find(doc, byTag('main'));
		if (!main) problems.push(`${rel}: no <main>`);
		else if (squash(textOf(main)).length < 40) problems.push(`${rel}: the main content is empty without scripts`);
		const links = findAll(doc, byTag('nav'))
			.filter((nav) => !isHidden(nav))
			.flatMap((nav) => findAll(nav, (el) => el.tag === 'a' && !!el.attrs.href && !isHidden(el) && squash(textOf(el)) !== ''));
		if (!links.length) problems.push(`${rel}: no navigation links without scripts`);
		if (urls.withoutLocale(rel).startsWith('docs/') && urls.withoutLocale(rel) !== 'docs/index.html') {
			const side = find(doc, (el) => el.attrs.id === 'sidebar');
			if (!side || findAll(side, byTag('a')).length < 2) problems.push(`${rel}: the docs sidebar is empty`);
		}
		for (const pre of findAll(main ?? doc, byTag('pre'))) {
			if (!squash(textOf(pre))) problems.push(`${rel}:${pre.line}: an empty code block`);
		}
		const seen = new Map<string, number>();
		for (const tab of findAll(doc, (el) => el.attrs.role === 'tab')) {
			const id = tab.attrs['aria-controls'];
			const panel = id ? find(doc, (el) => el.attrs.id === id) : null;
			if (!panel) problems.push(`${rel}:${tab.line}: tab "${squash(textOf(tab))}" controls no panel in the page`);
			else if (!squash(textOf(panel))) problems.push(`${rel}:${tab.line}: the panel of tab "${squash(textOf(tab))}" is empty without scripts`);
			if (id) seen.set(id, (seen.get(id) ?? 0) + 1);
		}
		for (const [id, n] of seen) if (n > 1) problems.push(`${rel}: ${n} tabs share the panel #${id}, so only one tab's content is in the page`);
	}
	return problems;
}

/* ---------- names of buttons ---------- */

/**
 * Every button has a name for screen readers: an aria-label, or text of its own. Text
 * that sits only in child elements does not count, since the styles may hide it, as they
 * hide the search button's words on small screens.
 */
export function checkButtonNames({ dist }: CheckInput) {
	const problems: string[] = [];
	for (const rel of listFiles(dist).filter((f) => f.endsWith('.html'))) {
		for (const button of findAll(parse(fs.readFileSync(path.join(dist, rel), 'utf8')), byTag('button'))) {
			if ((button.attrs['aria-label'] ?? '').trim() || button.attrs['aria-labelledby']) continue;
			const own = button.children.filter((c): c is string => typeof c === 'string').join('');
			if (!squash(own)) problems.push(`${rel}:${button.line}: a button with no aria-label and no text of its own: "${squash(textOf(button)).slice(0, 60)}"`);
		}
	}
	return problems;
}

/* ---------- technical SEO ---------- */

export const TITLE_MAX = 60;
export const DESCRIPTION_MAX = 155;

/** The file a link in a built page points at, with its fragment, or null for an outside link. */
function target(urls: Urls, href: string, fromRel: string): { file: string; hash: string } | null {
	if (/^[a-z][\w+.-]*:/i.test(href) && !/^https?:/i.test(href)) return null;
	const abs = new URL(href, urls.urlOfFile(fromRel));
	const hash = decodeURIComponent(abs.hash.slice(1));
	if (!href.split('#')[0]) return { file: fromRel, hash };
	const file = urls.fileOfUrl(`${abs.origin}${abs.pathname}`);
	return file === null ? null : { file, hash };
}

/**
 * Titles, descriptions, headings, canonical addresses, images and links of every page:
 * a title of at most 60 characters, unique in its language; a description of at most 155;
 * exactly one h1 and no skipped heading level; a canonical address on every page that may
 * be indexed; alt, width and height on every image; every link and anchor inside the site
 * leads somewhere; and every page is linked from another page.
 */
export function checkSeo({ dist, urls }: CheckInput) {
	const problems: string[] = [];
	const files = listFiles(dist).filter((f) => f.endsWith('.html'));
	const docs = new Map(files.map((rel) => [rel, parse(fs.readFileSync(path.join(dist, rel), 'utf8'))]));
	const ids = (rel: string) => new Set(findAll(docs.get(rel)!, (el) => !!el.attrs.id).map((el) => el.attrs.id));
	const titles = new Map<string, string>();
	const linkedFrom = new Map<string, Set<string>>();
	for (const [rel, doc] of docs) {
		const noindex = !!find(doc, (el) => el.tag === 'meta' && el.attrs.name === 'robots' && /noindex/.test(el.attrs.content ?? '')) && NOINDEX_PAGES.has(rel);
		const title = squash(textOf(find(doc, byTag('title')) ?? doc));
		const lang = find(doc, byTag('html'))?.attrs.lang ?? '';
		if (!title) problems.push(`${rel}: no <title>`);
		else {
			if (title.length > TITLE_MAX) problems.push(`${rel}: the title has ${title.length} characters, more than ${TITLE_MAX}: "${title}"`);
			const key = `${lang}\n${title}`;
			if (titles.has(key)) problems.push(`${rel}: the same title as ${titles.get(key)}: "${title}"`);
			else titles.set(key, rel);
		}
		const description = find(doc, (el) => el.tag === 'meta' && el.attrs.name === 'description')?.attrs.content ?? '';
		if (!description.trim()) problems.push(`${rel}: no meta description`);
		else if (description.length > DESCRIPTION_MAX) problems.push(`${rel}: the description has ${description.length} characters, more than ${DESCRIPTION_MAX}`);
		const headings = findAll(doc, (el) => /^h[1-6]$/.test(el.tag));
		const h1s = headings.filter((h) => h.tag === 'h1');
		if (h1s.length !== 1) problems.push(`${rel}: ${h1s.length} h1 headings, not one`);
		let level = 0;
		for (const h of headings) {
			const n = Number(h.tag[1]);
			if (n > level + 1) problems.push(`${rel}:${h.line}: an h${n} after an h${level || 'nothing'}: "${squash(textOf(h)).slice(0, 60)}"`);
			level = n;
		}
		if (!noindex && !find(doc, (el) => el.tag === 'link' && el.attrs.rel === 'canonical')) problems.push(`${rel}: no canonical link`);
		for (const img of findAll(doc, byTag('img'))) {
			const name = img.attrs.src ?? '?';
			if (!('alt' in img.attrs)) problems.push(`${rel}:${img.line}: the image ${name} has no alt`);
			if (!img.attrs.width || !img.attrs.height) problems.push(`${rel}:${img.line}: the image ${name} has no width and height`);
			const webp = img.parent?.tag === 'picture' && img.parent.children.some((c) => typeof c !== 'string' && c.tag === 'source' && c.attrs.type === 'image/webp');
			if (/\.(png|jpe?g)$/i.test(name) && !name.startsWith('/og/') && !webp) problems.push(`${rel}:${img.line}: the image ${name} has no WebP version`);
		}
		// Fonts: the page loads its text font early, as WOFF2, and every @font-face is WOFF2
		const preloads = findAll(doc, (el) => el.tag === 'link' && el.attrs.rel === 'preload' && el.attrs.as === 'font');
		if (!preloads.length) problems.push(`${rel}: no font is preloaded`);
		for (const p of preloads) {
			if (p.attrs.type !== 'font/woff2' || !('crossorigin' in p.attrs)) problems.push(`${rel}: the font preload ${p.attrs.href} needs type="font/woff2" and crossorigin`);
		}
		for (const style of findAll(doc, byTag('style'))) {
			for (const m of style.children.join('').matchAll(/src:\s*url\("?([^")]+)"?\)\s*format\("([^"]+)"\)/g)) if (m[2] !== 'woff2') problems.push(`${rel}: @font-face loads ${m[1]} as ${m[2]}, not woff2`);
		}
		const refs = [
			...findAll(doc, (el) => el.tag === 'a' && 'href' in el.attrs).map((el) => ({ el, url: el.attrs.href, kind: 'link' })),
			...findAll(doc, (el) => (el.tag === 'img' || el.tag === 'script') && !!el.attrs.src).map((el) => ({ el, url: el.attrs.src, kind: 'file' })),
			...findAll(doc, (el) => el.tag === 'source' && !!el.attrs.srcset).map((el) => ({ el, url: el.attrs.srcset.split(/\s+/)[0], kind: 'file' })),
			...findAll(doc, (el) => el.tag === 'link' && /stylesheet|icon|preload/.test(el.attrs.rel ?? '')).map((el) => ({ el, url: el.attrs.href, kind: 'file' }))
		];
		for (const { el, url, kind } of refs) {
			const to = target(urls, url, rel);
			if (!to) continue;
			if (!fs.existsSync(path.join(dist, to.file))) {
				problems.push(`${rel}:${el.line}: ${kind === 'link' ? 'a link' : 'a file'} to ${url}, which is not in the site`);
				continue;
			}
			if (to.hash && to.file.endsWith('.html') && docs.has(to.file) && !ids(to.file).has(to.hash)) problems.push(`${rel}:${el.line}: a link to ${url}, which has no "#${to.hash}"`);
			if (kind === 'link' && to.file.endsWith('.html') && to.file !== rel) {
				if (!linkedFrom.has(to.file)) linkedFrom.set(to.file, new Set());
				linkedFrom.get(to.file)!.add(rel);
			}
		}
	}
	for (const rel of files) {
		if (NOINDEX_PAGES.has(rel) || CONTACT_SHEET === rel) continue;
		if (!linkedFrom.get(rel)?.size) problems.push(`${rel}: no other page links to it`);
	}
	for (const css of listFiles(dist).filter((f) => f.endsWith('.css'))) {
		for (const m of fs.readFileSync(path.join(dist, css), 'utf8').matchAll(/src:\s*url\("?([^")]+)"?\)\s*format\("([^"]+)"\)/g)) {
			if (m[2] !== 'woff2') problems.push(`${css}: @font-face loads ${m[1]} as ${m[2]}, not woff2`);
			else if (!fs.existsSync(path.join(dist, m[1].replace(/^\//, '')))) problems.push(`${css}: @font-face loads ${m[1]}, which is not in the site`);
		}
	}
	return problems;
}

/** The page that shows every link preview image; it is linked from nowhere on purpose. */
export const CONTACT_SHEET = 'og/index.html';

/* ---------- link previews ---------- */

const OG_TAGS = ['og:title', 'og:description', 'og:url', 'og:type', 'og:image', 'og:image:width', 'og:image:height', 'og:image:alt', 'og:site_name', 'og:locale'];

/**
 * Every page that may be indexed has the Open Graph tags and twitter:card
 * summary_large_image; og:url is the canonical address; its image exists, is a PNG of
 * 1200 x 630 under 300 KB, and belongs to this page alone; no two pages share a title.
 */
export function checkPreviews({ dist, urls }: CheckInput) {
	const problems: string[] = [];
	const titles = new Map<string, string>();
	const images = new Map<string, string>();
	for (const rel of listFiles(dist).filter((f) => f.endsWith('.html') && !NOINDEX_PAGES.has(f))) {
		const head = fs.readFileSync(path.join(dist, rel), 'utf8').split('</head>')[0];
		const meta = new Map<string, string>();
		for (const m of head.matchAll(/<meta (?:property|name)="([^"]+)" content="([^"]*)">/g)) meta.set(m[1], decode(m[2]));
		for (const tag of OG_TAGS) if (!meta.get(tag)) problems.push(`${rel}: no ${tag}`);
		if (meta.get('twitter:card') !== 'summary_large_image') problems.push(`${rel}: twitter:card is not summary_large_image`);
		if (meta.get('og:url') && meta.get('og:url') !== canonicalOf(head)) problems.push(`${rel}: og:url is not the canonical address`);
		if (meta.get('og:image:width') !== '1200' || meta.get('og:image:height') !== '630') problems.push(`${rel}: og:image:width and height are not 1200 and 630`);
		const title = meta.get('og:title');
		if (title) {
			if (titles.has(title)) problems.push(`${rel}: the same og:title as ${titles.get(title)}: "${title}"`);
			titles.set(title, rel);
		}
		const image = meta.get('og:image');
		if (!image) continue;
		const file = urls.fileOfUrl(image);
		if (!file || !fs.existsSync(path.join(dist, file))) {
			problems.push(`${rel}: og:image ${image} was not built`);
			continue;
		}
		if (images.has(file)) problems.push(`${rel}: shares its og:image with ${images.get(file)}`);
		images.set(file, rel);
		const png = fs.readFileSync(path.join(dist, file));
		const isPng = png.subarray(1, 4).toString() === 'PNG';
		if (!isPng || png.readUInt32BE(16) !== 1200 || png.readUInt32BE(20) !== 630) problems.push(`${rel}: ${file} is not a 1200 x 630 PNG`);
		if (png.length > 300 * 1024) problems.push(`${rel}: ${file} has ${Math.round(png.length / 1024)} KB, more than 300`);
	}
	return problems;
}

/* ---------- "Copy as Markdown" ---------- */

/**
 * Every docs page and section page has "Copy as Markdown" next to its h1: a plain link,
 * without query string or inline script, to the page's own .md copy, which exists.
 */
export function checkMarkdownLinks({ dist, urls }: CheckInput) {
	const problems: string[] = [];
	for (const rel of listFiles(dist).filter((f) => /^docs\/.+\/index\.html$/.test(urls.withoutLocale(f)))) {
		const doc = parse(fs.readFileSync(path.join(dist, rel), 'utf8'));
		const head = find(doc, (el) => el.attrs.class === 'page-head');
		const h1 = head && find(head, byTag('h1'));
		const link = head && find(head, (el) => el.tag === 'a' && (el.attrs.class ?? '').split(' ').includes('md-link'));
		if (!h1 || !link) {
			problems.push(`${rel}: no "Copy as Markdown" link next to the h1`);
			continue;
		}
		const want = `${urls.urlOfFile(rel).replace(/\/$/, '')}.md`;
		if (link.attrs.href !== want) problems.push(`${rel}: "Copy as Markdown" leads to ${link.attrs.href}, not ${want}`);
		else if (!fs.existsSync(path.join(dist, urls.fileOfUrl(want) ?? '-'))) problems.push(`${rel}: ${want} was not built`);
		if (Object.keys(link.attrs).some((a) => a.startsWith('on'))) problems.push(`${rel}: "Copy as Markdown" has an inline script`);
	}
	return problems;
}

/* ---------- languages ---------- */

/**
 * Every page says its language in <html lang>, which matches its address (/de/... is German),
 * and lists every language version of itself with hreflang, itself and x-default included.
 * Each version it lists exists and lists it back.
 */
export function checkLocales({ dist, urls }: CheckInput) {
	const problems: string[] = [];
	const alternates = new Map<string, Map<string, string>>();
	const files = listFiles(dist).filter((f) => f.endsWith('.html') && !NOINDEX_PAGES.has(f));
	for (const rel of files) {
		const html = fs.readFileSync(path.join(dist, rel), 'utf8');
		const head = html.split('</head>')[0];
		const url = urls.urlOfFile(rel);
		const locale = LOCALES.find((l) => l.code === urls.localeOfFile(rel))!;
		const lang = head.match(/<html lang="([^"]*)"/)?.[1];
		if (lang !== locale.code) problems.push(`${rel}: <html lang="${lang}">, but its address is in ${locale.label} (${locale.code})`);
		const links = new Map<string, string>();
		for (const m of head.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)">/g)) links.set(m[1], decode(m[2]));
		alternates.set(rel, links);
		if (links.get(locale.code) !== url) problems.push(`${rel}: no hreflang="${locale.code}" link to itself`);
		if (!links.has('x-default')) problems.push(`${rel}: no hreflang="x-default" link`);
	}
	for (const [rel, links] of alternates) {
		for (const [code, href] of links) {
			const target = urls.fileOfUrl(href);
			if (!target || !fs.existsSync(path.join(dist, target))) {
				problems.push(`${rel}: hreflang="${code}" names ${href}, which is not a page of the site`);
				continue;
			}
			if (code === 'x-default' || target === rel) continue;
			const back = alternates.get(target);
			if (!back || ![...back.values()].includes(urls.urlOfFile(rel))) problems.push(`${rel}: hreflang="${code}" names ${href}, which does not name this page back`);
		}
	}
	return problems;
}

/**
 * Every page of the default language exists in every other language, at the same
 * address under that language's prefix: docs/console/devices/index.html needs
 * de/docs/console/devices/index.html. The contact sheet of link previews is English only.
 */
export function checkTranslations({ dist, urls }: CheckInput) {
	const problems: string[] = [];
	const files = listFiles(dist).filter((f) => f.endsWith('.html'));
	const have = new Set(files);
	const english = files.filter((f) => urls.localeOfFile(f) === LOCALES.find((l) => l.default)!.code && f !== CONTACT_SHEET);
	for (const locale of LOCALES.filter((l) => !l.default)) {
		for (const rel of english) {
			const other = urls.inLanguage(rel, locale.prefix);
			if (have.has(other)) continue;
			const page = rel.match(/^docs\/(.+\/.+)\/index\.html$/)?.[1];
			const hint = page ? `: translate content/docs/${page}.md into content/${locale.code}/docs/${page}.md` : '';
			problems.push(`${other}: ${rel} has no ${locale.label} version${hint}`);
		}
	}
	return problems;
}

/* ---------- structured data and the sitemap ---------- */

type Thing = Record<string, unknown>;
const validDate = (d: unknown) => typeof d === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(d) && !Number.isNaN(Date.parse(d));
const canonicalOf = (head: string) => head.match(/<link rel="canonical" href="([^"]+)">/)?.[1];

/**
 * The home page has a SoftwareApplication with name, license, operating systems, version
 * and download address. Every docs page has a TechArticle with dateModified and a
 * BreadcrumbList that ends at the page. The sitemap lists every page with a canonical
 * address, and only those, each with a lastmod date.
 */
export function checkStructuredData({ dist, urls, version }: CheckInput) {
	const problems: string[] = [];
	const canonicals = new Set<string>();
	for (const rel of listFiles(dist).filter((f) => f.endsWith('.html'))) {
		const html = fs.readFileSync(path.join(dist, rel), 'utf8');
		const head = html.split('</head>')[0];
		const things: Thing[] = [];
		for (const m of head.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
			try {
				const v = JSON.parse(m[1]);
				things.push(...(Array.isArray(v) ? v : [v]));
			} catch {
				problems.push(`${rel}: JSON-LD that does not parse`);
			}
		}
		const ofType = (type: string) => things.find((t) => t['@type'] === type);
		const canonical = canonicalOf(head);
		if (canonical) canonicals.add(canonical);
		if (rel === 'index.html') {
			const app = ofType('SoftwareApplication');
			if (!app) problems.push('index.html: no SoftwareApplication in JSON-LD');
			else {
				for (const key of ['name', 'license', 'operatingSystem', 'softwareVersion', 'downloadUrl']) if (!app[key]) problems.push(`index.html: the SoftwareApplication has no ${key}`);
				if (app.softwareVersion !== version) problems.push(`index.html: softwareVersion is ${app.softwareVersion}, the build is for ${version}`);
			}
		}
		if (/<meta property="og:type" content="article">/.test(head)) {
			const article = ofType('TechArticle');
			if (!article) problems.push(`${rel}: no TechArticle in JSON-LD`);
			else {
				if (!validDate(article.dateModified)) problems.push(`${rel}: the TechArticle has no valid dateModified`);
				if (!article.headline) problems.push(`${rel}: the TechArticle has no headline`);
				if (article.url !== canonical) problems.push(`${rel}: the TechArticle's url is not the canonical address`);
			}
			if (!ofType('BreadcrumbList')) problems.push(`${rel}: no BreadcrumbList in JSON-LD`);
		}
		const crumbs = ofType('BreadcrumbList');
		if (crumbs) {
			const items = (crumbs.itemListElement ?? []) as Thing[];
			if (items.length < 2) problems.push(`${rel}: the BreadcrumbList has fewer than two items`);
			items.forEach((item, i) => {
				if (item.position !== i + 1 || !item.name || typeof item.item !== 'string') problems.push(`${rel}: breadcrumb ${i + 1} lacks a position, name or address`);
				else if (!fs.existsSync(path.join(dist, urls.fileOfUrl(item.item) ?? '-'))) problems.push(`${rel}: breadcrumb ${i + 1} leads to ${item.item}, which is not a page`);
			});
			if (items.length && items[items.length - 1].item !== canonical) problems.push(`${rel}: the last breadcrumb is not the page itself`);
		}
	}
	// One sitemap per host: each lists only its own host's pages
	const listed = new Set<string>();
	for (const [file, base] of [['sitemap.xml', urls.www], ['docs/sitemap.xml', urls.docs]]) {
		const sitemap = fs.readFileSync(path.join(dist, file), 'utf8');
		for (const m of sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
			const loc = m[1].match(/<loc>([^<]+)<\/loc>/)?.[1] ?? '';
			listed.add(loc);
			if (!loc.startsWith(`${base}/`)) problems.push(`${file}: ${loc} is not on ${base}`);
			if (!validDate(m[1].match(/<lastmod>([^<]+)<\/lastmod>/)?.[1])) problems.push(`${file}: ${loc} has no valid lastmod`);
			if (!canonicals.has(loc)) problems.push(`${file}: ${loc} is not the canonical address of a built page`);
		}
	}
	for (const c of canonicals) if (!listed.has(c)) problems.push(`sitemap.xml: no sitemap lists ${c}`);
	return problems;
}

/* ---------- the files for AI tools ---------- */

/**
 * llms.txt starts with the section for AI agents, lists every llms-*.txt file with its
 * size, and every page of llms-full.txt is in exactly one section file. No agent tool
 * that does not exist yet is named anywhere in the built site.
 */
export function checkLlms({ dist, urls }: CheckInput, unavailable: string[]) {
	const problems: string[] = [];
	const llms = fs.readFileSync(path.join(dist, 'llms.txt'), 'utf8');
	const agents = llms.indexOf('\n## For AI agents\n');
	if (agents === -1 || llms.indexOf('\n## ') !== agents) problems.push('llms.txt: "## For AI agents" is not the first section');
	const listed = new Set<string>();
	for (const m of llms.matchAll(/^- \[[^\]]+\]\((\S+?\.txt)\): (\d+) KB/gm)) {
		const file = urls.fileOfUrl(m[1]);
		if (!file || !fs.existsSync(path.join(dist, file))) {
			problems.push(`llms.txt: lists ${m[1]}, which was not built`);
			continue;
		}
		listed.add(file);
		const size = Math.max(1, Math.round(fs.statSync(path.join(dist, file)).size / 1024));
		if (size !== Number(m[2])) problems.push(`llms.txt: gives ${file} as ${m[2]} KB, it is ${size} KB`);
	}
	const bundles = fs.readdirSync(dist).filter((f) => /^llms-.+\.txt$/.test(f));
	for (const f of bundles) if (!listed.has(f)) problems.push(`llms.txt: does not list ${f}`);
	const sources = (file: string) => [...fs.readFileSync(path.join(dist, file), 'utf8').matchAll(/^Source: (\S+)$/gm)].map((m) => m[1]);
	const inSections = bundles.filter((f) => f !== 'llms-full.txt').flatMap((f) => sources(f).slice(1));
	for (const page of sources('llms-full.txt')) {
		const n = inSections.filter((s) => s === page).length;
		if (n !== 1) problems.push(`llms-*.txt: ${page} is in ${n} section files, not one`);
	}
	for (const rel of listFiles(dist).filter((f) => TEXT.test(f))) {
		const text = fs.readFileSync(path.join(dist, rel), 'utf8');
		for (const name of unavailable) if (text.includes(name)) problems.push(`${rel}: names "${name}", which does not exist yet (src/agents.ts)`);
	}
	return problems;
}

/* ---------- who may index the site ---------- */

// Pages that are never indexed, on any host: every language's 404 page and the contact sheet
export const NOINDEX_PAGES = new Set(['og/index.html', ...LOCALES.flatMap((l) => [`${l.prefix ? `${l.prefix.slice(1)}/` : ''}404.html`, `docs/${l.prefix ? `${l.prefix.slice(1)}/` : ''}404.html`])]);

/**
 * On production, robots.txt allows everything and names each AI crawler as allowed, and
 * only the pages in NOINDEX_PAGES say noindex. On any other host every page says noindex.
 */
export function checkIndexing({ dist, urls, production, aiCrawlers }: CheckInput) {
	const problems: string[] = [];
	// Each host has its robots.txt, which allows everything and names that host's sitemap
	for (const [file, base] of [['robots.txt', urls.www], ['docs/robots.txt', urls.docs]]) {
		const robots = fs.readFileSync(path.join(dist, file), 'utf8');
		const groups = robots.split(/\n\s*\n/).map((g) => g.split('\n').filter((l) => l && !l.startsWith('#')));
		const allowed = (agent: string) =>
			groups.some((g) => g.some((l) => l.toLowerCase() === `user-agent: ${agent.toLowerCase()}`) && g.includes('Allow: /') && !g.some((l) => /^Disallow:\s*\S/.test(l)));
		if (!allowed('*')) problems.push(`${file}: "User-agent: *" is not allowed everything`);
		if (production) for (const agent of aiCrawlers) if (!allowed(agent)) problems.push(`${file}: ${agent} is not named as allowed`);
		if (!robots.includes(`Sitemap: ${base}/sitemap.xml`)) problems.push(`${file}: does not name ${base}/sitemap.xml`);
	}
	for (const rel of listFiles(dist).filter((f) => f.endsWith('.html'))) {
		const head = fs.readFileSync(path.join(dist, rel), 'utf8').split('</head>')[0];
		const noindex = /<meta name="robots" content="[^"]*noindex/.test(head);
		const wanted = !production || NOINDEX_PAGES.has(rel);
		if (noindex && !wanted) problems.push(`${rel}: says noindex on the production site`);
		if (!noindex && wanted) problems.push(`${rel}: has no noindex${production ? '' : ', and this build is not for the production address'}`);
	}
	return problems;
}
