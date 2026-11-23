// Checks that run on the built site in dist/. Each returns a list of problems;
// the build fails when any check finds one.
import fs from 'node:fs';
import path from 'node:path';
import { parse, find, findAll, byTag, isHidden, textOf, decode } from './html.ts';
import { localeOfPath } from './i18n.ts';

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

// Where the old name may stay. Everything else in the built site is an error.
export const OLD_NAME_ALLOW = {
	// Pages that are about the project's origin: every mention on them is attribution
	pages: ['project/license', 'project/sponsors'],
	// Phrases allowed on any page: the upstream repository and the credit line
	phrases: [
		/(?:https?:\/\/)?github\.com\/UNITRONIX\/BetterDesk\b[\w/#.?=&-]*/gi,
		/\bUNITRONIX\/BetterDesk\b(?:#\d+)?/gi,
		// "started as a fork of BetterDesk by UNITRONIX", as HTML or Markdown, across a line break
		/fork of\s+(?:<a [^>]*>|\[)?BetterDesk(?:<\/a>|\]\([^)]*\))?\s+by\s+UNITRONIX/gi
	]
};
const OLD_NAME = /betterdesk|betterde\.sk/gi;
const OLD_IMAGE = /ghcr\.io\/[\w.-]+\/betterdesk[\w.-]*/gi;

/** The docs page a file is the copy of: docs/a/b/index.html and docs/a/b.md are page a/b. */
function pageOfFile(rel: string) {
	const m = rel.match(/^docs\/(.+?)(?:\/index\.html|\.md)$/);
	return m ? m[1] : null;
}

/**
 * The page each part of a file belongs to. A line that links to a page (a list of
 * pages with their descriptions) belongs to that page; in the collected llms files
 * the rest belongs to the page under the last "Source:" line.
 */
function pageAt(text: string, index: number, rel: string) {
	const start = text.lastIndexOf('\n', index) + 1;
	const end = text.indexOf('\n', index);
	const line = text.slice(start, end === -1 ? text.length : end);
	const listed = [...line.matchAll(/(?:href="|\]\()(?:[a-z]+:\/\/[^/"]+)?\/docs\/([\w/-]+?)(?:\/|\.md)?(?:#[\w-]*)?(?:"|\))/g)].map((m) => m[1]);
	if (listed.length === 1) return listed[0];
	const sources = [...text.slice(0, index).matchAll(/^Source: \S+?\/docs\/([\w/-]+?)\/?$/gm)];
	if (sources.length && rel.endsWith('.txt')) return sources[sources.length - 1][1];
	return pageOfFile(rel);
}

export interface CheckInput {
	dist: string;
	siteUrl: string;
	version: string;
	production: boolean;
	aiCrawlers: string[];
}

export function checkOldNames({ dist }: CheckInput) {
	const problems: string[] = [];
	for (const rel of listFiles(dist).filter((f) => TEXT.test(f))) {
		const raw = fs.readFileSync(path.join(dist, rel), 'utf8');
		for (const m of raw.matchAll(OLD_IMAGE)) problems.push(`${rel}:${lineOf(raw, m.index)}: old image path "${m[0]}"`);
		// Blank out the allowed phrases, keeping every other character where it was
		let text = raw;
		for (const re of OLD_NAME_ALLOW.phrases) text = text.replace(re, (s) => ' '.repeat(s.length));
		if (rel === 'docs/search.json') {
			for (const entry of JSON.parse(raw) as { u: string }[]) {
				const page = entry.u.replace(/^\/docs\/|\/(#.*)?$|#.*$/g, '');
				if (OLD_NAME_ALLOW.pages.includes(page)) continue;
				let fields = JSON.stringify(entry);
				for (const re of OLD_NAME_ALLOW.phrases) fields = fields.replace(re, '');
				const hit = fields.match(OLD_NAME);
				if (hit) problems.push(`${rel}: "${hit[0]}" in the search entry for ${entry.u}`);
			}
			continue;
		}
		for (const m of text.matchAll(OLD_NAME)) {
			const page = pageAt(raw, m.index, rel);
			if (page && OLD_NAME_ALLOW.pages.includes(page)) continue;
			const around = raw.slice(Math.max(0, m.index - 40), m.index + 40).replace(/\s+/g, ' ');
			problems.push(`${rel}:${lineOf(raw, m.index)}: old name "${m[0]}" in "...${around}..."`);
		}
	}
	return problems;
}

/* ---------- the old console port ---------- */

// 21114 is the server's API port on Linux and Windows. A sentence that names it and
// the console, the browser or signing in, without saying API, means the console.
const CONSOLE_WORDS = /\b(console|sign(?:s|ed)? in|browser|web interface|dashboard|admin panel)\b/i;
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
const VERSION_MENTIONS = [
	/\bNeoDesk v?(\d+\.\d+\.\d+(?:-[\w.]+)?)/g,
	/\bneodesk-server v?(\d+\.\d+\.\d+(?:-[\w.]+)?)/g,
	/"softwareVersion":\s*"([^"]*)"/g,
	/\bWritten for version (\d+\.\d+\.\d+(?:-[\w.]+)?)/g
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
export function checkWithoutScripts({ dist }: CheckInput) {
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
		if (rel.startsWith('docs/') && rel !== 'docs/index.html') {
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

/* ---------- technical SEO ---------- */

export const TITLE_MAX = 60;
export const DESCRIPTION_MAX = 155;

/** The file a link in a built page points at, with its fragment, or null for an outside link. */
function target(href: string, fromRel: string, siteUrl: string): { file: string; hash: string } | null {
	let h = href;
	if (h.startsWith(siteUrl)) h = h.slice(siteUrl.length) || '/';
	if (/^[a-z][\w+.-]*:/i.test(h) || h.startsWith('//')) return null;
	const [pathAndQuery, hash = ''] = h.split('#');
	const p = pathAndQuery.split('?')[0];
	const base = urlOfFile(fromRel).replace(/[^/]*$/, '');
	const abs = !p ? urlOfFile(fromRel) : p.startsWith('/') ? p : new URL(p, `http://x${base}`).pathname;
	return { file: abs.endsWith('/') ? `${abs.slice(1)}index.html` : decodeURIComponent(abs.slice(1)), hash };
}

/**
 * Titles, descriptions, headings, canonical addresses, images and links of every page:
 * a title of at most 60 characters, unique in its language; a description of at most 155;
 * exactly one h1 and no skipped heading level; a canonical address on every page that may
 * be indexed; alt, width and height on every image; every link and anchor inside the site
 * leads somewhere; and every page is linked from another page.
 */
export function checkSeo({ dist, siteUrl }: CheckInput) {
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
			const to = target(url, rel, siteUrl);
			if (!to) continue;
			if (!fs.existsSync(path.join(dist, to.file))) {
				problems.push(`${rel}:${el.line}: ${kind === 'link' ? 'a link' : 'a file'} to ${url}, which is not in the site`);
				continue;
			}
			if (to.hash && to.file.endsWith('.html') && docs.has(to.file) && !ids(to.file).has(decodeURIComponent(to.hash))) problems.push(`${rel}:${el.line}: a link to ${url}, which has no "#${to.hash}"`);
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
export function checkPreviews({ dist, siteUrl }: CheckInput) {
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
		const file = fileOfUrl(image, siteUrl);
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
export function checkMarkdownLinks({ dist }: CheckInput) {
	const problems: string[] = [];
	for (const rel of listFiles(dist).filter((f) => /(^|\/)docs\/.+\/index\.html$/.test(f))) {
		const doc = parse(fs.readFileSync(path.join(dist, rel), 'utf8'));
		const head = find(doc, (el) => el.attrs.class === 'page-head');
		const h1 = head && find(head, byTag('h1'));
		const link = head && find(head, (el) => el.tag === 'a' && (el.attrs.class ?? '').split(' ').includes('md-link'));
		if (!h1 || !link) {
			problems.push(`${rel}: no "Copy as Markdown" link next to the h1`);
			continue;
		}
		const want = `${urlOfFile(rel).replace(/\/$/, '')}.md`;
		if (link.attrs.href !== want) problems.push(`${rel}: "Copy as Markdown" leads to ${link.attrs.href}, not ${want}`);
		else if (!fs.existsSync(path.join(dist, want.slice(1)))) problems.push(`${rel}: ${want} was not built`);
		if (Object.keys(link.attrs).some((a) => a.startsWith('on'))) problems.push(`${rel}: "Copy as Markdown" has an inline script`);
	}
	return problems;
}

/* ---------- languages ---------- */

/** The address a built HTML file is served at: docs/a/index.html is /docs/a/. */
export const urlOfFile = (rel: string) => `/${rel.replace(/(^|\/)index\.html$/, '$1')}`;
/** The built file an address of the site is served from, or null when it is outside the site. */
export function fileOfUrl(url: string, siteUrl: string): string | null {
	if (!url.startsWith(siteUrl)) return null;
	const p = url.slice(siteUrl.length).split('#')[0] || '/';
	return p.endsWith('/') ? `${p.slice(1)}index.html` : p.slice(1);
}

/**
 * Every page says its language in <html lang>, which matches its address (/de/... is German),
 * and lists every language version of itself with hreflang, itself and x-default included.
 * Each version it lists exists and lists it back.
 */
export function checkLocales({ dist, siteUrl }: CheckInput) {
	const problems: string[] = [];
	const alternates = new Map<string, Map<string, string>>();
	const files = listFiles(dist).filter((f) => f.endsWith('.html') && !NOINDEX_PAGES.has(f));
	for (const rel of files) {
		const html = fs.readFileSync(path.join(dist, rel), 'utf8');
		const head = html.split('</head>')[0];
		const url = urlOfFile(rel);
		const locale = localeOfPath(url);
		const lang = head.match(/<html lang="([^"]*)"/)?.[1];
		if (lang !== locale.code) problems.push(`${rel}: <html lang="${lang}">, but its address is in ${locale.label} (${locale.code})`);
		const links = new Map<string, string>();
		for (const m of head.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)">/g)) links.set(m[1], decode(m[2]));
		alternates.set(rel, links);
		if (links.get(locale.code) !== `${siteUrl}${url}`) problems.push(`${rel}: no hreflang="${locale.code}" link to itself`);
		if (!links.has('x-default')) problems.push(`${rel}: no hreflang="x-default" link`);
	}
	for (const [rel, links] of alternates) {
		for (const [code, href] of links) {
			const target = fileOfUrl(href, siteUrl);
			if (!target || !fs.existsSync(path.join(dist, target))) {
				problems.push(`${rel}: hreflang="${code}" names ${href}, which is not a page of the site`);
				continue;
			}
			if (code === 'x-default' || target === rel) continue;
			const back = alternates.get(target);
			if (!back || ![...back.values()].includes(`${siteUrl}${urlOfFile(rel)}`)) problems.push(`${rel}: hreflang="${code}" names ${href}, which does not name this page back`);
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
export function checkStructuredData({ dist, siteUrl, version }: CheckInput) {
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
				else if (!fs.existsSync(path.join(dist, fileOfUrl(item.item, siteUrl) ?? '-'))) problems.push(`${rel}: breadcrumb ${i + 1} leads to ${item.item}, which is not a page`);
			});
			if (items.length && items[items.length - 1].item !== canonical) problems.push(`${rel}: the last breadcrumb is not the page itself`);
		}
	}
	const sitemap = fs.readFileSync(path.join(dist, 'sitemap.xml'), 'utf8');
	const listed = new Set<string>();
	for (const m of sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
		const loc = m[1].match(/<loc>([^<]+)<\/loc>/)?.[1] ?? '';
		listed.add(loc);
		if (!validDate(m[1].match(/<lastmod>([^<]+)<\/lastmod>/)?.[1])) problems.push(`sitemap.xml: ${loc} has no valid lastmod`);
		if (!canonicals.has(loc)) problems.push(`sitemap.xml: ${loc} is not the canonical address of a built page`);
	}
	for (const c of canonicals) if (!listed.has(c)) problems.push(`sitemap.xml: does not list ${c}`);
	return problems;
}

/* ---------- the files for AI tools ---------- */

/**
 * llms.txt starts with the section for AI agents, lists every llms-*.txt file with its
 * size, and every page of llms-full.txt is in exactly one section file. No agent tool
 * that does not exist yet is named anywhere in the built site.
 */
export function checkLlms({ dist, siteUrl }: CheckInput, unavailable: string[]) {
	const problems: string[] = [];
	const llms = fs.readFileSync(path.join(dist, 'llms.txt'), 'utf8');
	const agents = llms.indexOf('\n## For AI agents\n');
	if (agents === -1 || llms.indexOf('\n## ') !== agents) problems.push('llms.txt: "## For AI agents" is not the first section');
	const listed = new Set<string>();
	for (const m of llms.matchAll(/^- \[[^\]]+\]\((\S+?\.txt)\): (\d+) KB/gm)) {
		const file = fileOfUrl(m[1], siteUrl);
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

// Pages that are never indexed, on any host
export const NOINDEX_PAGES = new Set(['404.html', 'og/index.html']);

/**
 * On production, robots.txt allows everything and names each AI crawler as allowed, and
 * only the pages in NOINDEX_PAGES say noindex. On any other host every page says noindex.
 */
export function checkIndexing({ dist, production, aiCrawlers }: CheckInput) {
	const problems: string[] = [];
	const robots = fs.readFileSync(path.join(dist, 'robots.txt'), 'utf8');
	const groups = robots.split(/\n\s*\n/).map((g) => g.split('\n').filter((l) => l && !l.startsWith('#')));
	const allowed = (agent: string) =>
		groups.some((g) => g.some((l) => l.toLowerCase() === `user-agent: ${agent.toLowerCase()}`) && g.includes('Allow: /') && !g.some((l) => /^Disallow:\s*\S/.test(l)));
	if (!allowed('*')) problems.push('robots.txt: "User-agent: *" is not allowed everything');
	if (production) for (const agent of aiCrawlers) if (!allowed(agent)) problems.push(`robots.txt: ${agent} is not named as allowed`);
	if (!/^Sitemap: \S+\/sitemap\.xml$/m.test(robots)) problems.push('robots.txt: no Sitemap line');
	for (const rel of listFiles(dist).filter((f) => f.endsWith('.html'))) {
		const head = fs.readFileSync(path.join(dist, rel), 'utf8').split('</head>')[0];
		const noindex = /<meta name="robots" content="[^"]*noindex/.test(head);
		const wanted = !production || NOINDEX_PAGES.has(rel);
		if (noindex && !wanted) problems.push(`${rel}: says noindex on the production site`);
		if (!noindex && wanted) problems.push(`${rel}: has no noindex${production ? '' : ', and this build is not for the production address'}`);
	}
	return problems;
}
