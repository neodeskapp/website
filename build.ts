// Builds the website and the docs into dist/.   node build.ts [--serve]
// See README.md for the layout and for how a docs page is written.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import MarkdownIt from 'markdown-it';
import type { StateBlock, StateCore, Token, RendererRule } from 'markdown-it';
import hljs from 'highlight.js';
import sharp from 'sharp';
import config from './site.config.ts';
import { docsIndexPage, allPagesPage, brandPage, downloadPage, sitePage, docPage, sectionPage, notFoundPage, contactSheetPage, hreflangLinks, socialTags, esc } from './src/layout.ts';
import { siteHeader, siteFooter } from './src/chrome.ts';
import { makeUrls } from './src/urls.ts';
import { brandPages, hasBrand, brandProblems, BRAND_SLUGS, brandPath } from './src/brand.ts';
import { DOWNLOAD, downloadMain, clientSoftware, repoCommands } from './src/download.ts';
import { SITE_PAGES, hasSitePages, sitePages, sitePageTitles } from './src/pages.ts';
import type { SitePageSlug } from './src/pages.ts';
import { pickRelease, parseSums, toClientRelease } from './src/client-release.ts';
import type { ClientOffer, GitHubRelease } from './src/client-release.ts';
import { zipFolder } from './src/zip.ts';
import { HEADING_ATTRS_LINE, buildIndex, indexFiles, checkIndex } from './src/search.ts';
import { answersOf, answerHtml, answerText, answerMarkdown } from './src/answers.ts';
import type { Answer } from './src/answers.ts';
import type { PreviewItem } from './src/layout.ts';
import { render as renderPreview } from './src/og.ts';
import type { OgData, OgTemplate } from './src/og.ts';
import type { Page, Section, Shared, Pager } from './src/types.ts';
import { LOCALES, DEFAULT_LOCALE, missingStrings, stringsOf, fill } from './src/i18n.ts';
import type { Locale, Strings } from './src/i18n.ts';
import { checkOldNames, checkConsolePort, checkVersion, checkWithoutScripts, checkButtonNames, checkIndexing, checkLocales, checkTranslations, checkLlms, checkStructuredData, checkMarkdownLinks, checkSeo, checkPreviews } from './src/checks.ts';
import { checkSkipLinks, checkHeadingLinks, checkAriaLabels, checkLabelInName, checkTablesAndRegions, checkLinkNames, checkBreadcrumbs } from './src/checks.ts';
import { checkCommands } from './src/commands.ts';
import { AGENT_TOOLS } from './src/agents.ts';
import { INSTALLS, blocksOf, clientPorts, protocolsOf, PORTS_PAGE } from './src/install.ts';
import { missingHomeStrings, homeStringsOf } from './src/home.ts';
import type { HomeStrings } from './src/home.ts';
import { hasIcon } from './src/icons.ts';

const root = path.dirname(fileURLToPath(import.meta.url));
const at = (...p: string[]) => path.join(root, ...p);
// DOCS_DIR builds another content folder, for trying the generator on sample pages
const DOCS = process.env.DOCS_DIR ? path.resolve(process.env.DOCS_DIR) : at('content/docs');
const SHOTS = at('content/screenshots');
// Converted images and rendered link previews, kept between builds; safe to delete
const CACHE = at('.cache');
// DIST_DIR writes the build somewhere else than dist/, for a check that runs next to another build
const DIST = process.env.DIST_DIR ? path.resolve(process.env.DIST_DIR) : at('dist');
// `--serve` without SITE_URL builds for the local server, so every link stays on it
const SERVE_PORT = Number(process.env.PORT) || 4173;
const SITE_URL = (process.env.SITE_URL || (process.argv.includes('--serve') ? `http://localhost:${SERVE_PORT}` : config.url)).replace(/\/$/, '');
// Only the production address may be indexed; a build for any other host, such as the beta, says noindex
const PRODUCTION = SITE_URL === config.url.replace(/\/$/, '');
// The docs have a host of their own on production; any other build keeps them under /docs (src/urls.ts)
const DOCS_URL = (process.env.DOCS_URL || (PRODUCTION ? config.docsUrl : `${SITE_URL}/docs`)).replace(/\/$/, '');
const urls = makeUrls(SITE_URL, DOCS_URL);
const url = urls.url;
const problems: string[] = [];
// The brand guide's colours reach the contrast its pages promise, and its good examples follow its rules
problems.push(...brandProblems());

/* ---------- small helpers ---------- */

const read = (file: string) => fs.readFileSync(file, 'utf8').replace(/\r\n?/g, '\n');
/** Writes a file at its logical place; the docs tree goes to dist/docs/, each language under it (src/urls.ts). */
function write(rel: string, data: string | Buffer) {
	const file = path.join(DIST, urls.distOf(rel));
	fs.mkdirSync(path.dirname(file), { recursive: true });
	fs.writeFileSync(file, data);
}
function copyDir(from: string, to: string) {
	if (!fs.existsSync(from)) return;
	fs.mkdirSync(to, { recursive: true });
	for (const e of fs.readdirSync(from, { withFileTypes: true })) {
		if (e.isDirectory()) copyDir(path.join(from, e.name), path.join(to, e.name));
		else fs.copyFileSync(path.join(from, e.name), path.join(to, e.name));
	}
}
const hashOf = (data: string | Buffer) => crypto.createHash('sha256').update(data).digest('hex').slice(0, 10);
/**
 * A lossless WebP copy of a PNG: the same pixels in about a third of the bytes. Cached by
 * the PNG's content, so a build converts only new or changed images.
 */
async function webpOf(file: string): Promise<Buffer> {
	const data = fs.readFileSync(file);
	const cached = path.join(CACHE, 'webp', `${hashOf(data)}.webp`);
	if (fs.existsSync(cached)) return fs.readFileSync(cached);
	const out = await sharp(data).webp({ lossless: true, effort: 4 }).toBuffer();
	fs.mkdirSync(path.dirname(cached), { recursive: true });
	fs.writeFileSync(cached, out);
	return out;
}

/** A screenshot of the home page's first screen as a WebP at quality 88, at a width; cached like webpOf. */
async function heroWebp(file: string, width: number): Promise<Buffer> {
	const data = fs.readFileSync(file);
	const cached = path.join(CACHE, 'webp', `${hashOf(data)}-q88-${width}.webp`);
	if (fs.existsSync(cached)) return fs.readFileSync(cached);
	const out = await sharp(data).resize({ width }).webp({ quality: 88, effort: 5 }).toBuffer();
	fs.mkdirSync(path.dirname(cached), { recursive: true });
	fs.writeFileSync(cached, out);
	return out;
}

/** The home page's screenshots as <picture> with a WebP source in front of the PNG. */
function withWebp(html: string) {
	return html.replace(/<img class="shot ([^"]*)" src="\/img\/([\w-]+)\.png"([^>]*)>/g, (_, cls, name, rest) => `<picture class="${cls}"><source type="image/webp" srcset="/img/${name}.webp"><img class="shot ${cls}" src="/img/${name}.png"${rest}></picture>`);
}

/** A PNG's width and height, from its IHDR chunk. */
function pngSize(file: string) {
	const head = Buffer.alloc(24);
	const fd = fs.openSync(file, 'r');
	try {
		fs.readSync(fd, head, 0, 24, 0);
	} finally {
		fs.closeSync(fd);
	}
	return { width: head.readUInt32BE(16), height: head.readUInt32BE(20) };
}

/** A heading's id: lower case, punctuation dropped, spaces as hyphens, as GitHub does it. */
function slugify(text: string) {
	return text
		.toLowerCase()
		.trim()
		.replace(/[^\p{L}\p{N}\s_-]/gu, '')
		.replace(/\s/g, '-');
}

/** Takes the {#id alias=a,b} block off the end of a heading and returns what it says. */
function headingAttrs(children: Token[]): { id?: string; aliases: string[]; bad?: string } {
	const last = children[children.length - 1];
	if (!last || last.type !== 'text') return { aliases: [] };
	const m = last.content.match(/\s*\{([^}]*)\}\s*$/);
	if (!m) return { aliases: [] };
	const out: { id?: string; aliases: string[] } = { aliases: [] };
	for (const part of m[1].trim().split(/\s+/)) {
		if (/^#[a-z0-9][\w-]*$/.test(part)) out.id = part.slice(1);
		else if (/^alias=[\w-]+(,[\w-]+)*$/.test(part)) out.aliases.push(...part.slice(6).split(','));
		else return { aliases: [], bad: m[1] };
	}
	last.content = last.content.slice(0, m.index);
	return out;
}

function slugger() {
	const seen = new Map<string, number>();
	return (text: string) => {
		const base = slugify(text) || 'section';
		const n = seen.get(base) ?? 0;
		seen.set(base, n + 1);
		return n ? `${base}-${n}` : base;
	};
}

async function currentVersion(): Promise<string> {
	if (process.env.ND_VERSION) return process.env.ND_VERSION.trim();
	try {
		// The newest published release, pre-releases included. The VERSION file on
		// main runs ahead of the releases, so it is not what a visitor can install.
		const headers: Record<string, string> = { accept: 'application/vnd.github+json' };
		if (process.env.GITHUB_TOKEN) headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
		const res = await fetch(config.versionUrl, { headers, signal: AbortSignal.timeout(8000) });
		if (res.ok) {
			const releases = (await res.json()) as { tag_name: string; draft: boolean; published_at: string | null }[];
			const newest = releases
				.filter((r) => !r.draft && r.published_at && /^v\d+\.\d+\.\d+/.test(r.tag_name))
				.sort((a, b) => (a.published_at! < b.published_at! ? 1 : -1))[0];
			if (newest) return newest.tag_name.slice(1);
		}
	} catch {
		/* offline: use the version in the config */
	}
	console.warn(`Could not read ${config.versionUrl}; building for version ${config.version} from site.config.ts. Set ND_VERSION to choose one.`);
	return config.version;
}

/**
 * The desktop client's release for the download page, and a newer release candidate as a
 * preview (src/client-release.ts), read from GitHub with each release's SHA256SUMS.
 * ND_CLIENT_RELEASES=<file> reads the list from a file in the API's shape instead, to try
 * the page with other releases. When GitHub can't be reached, the build uses the release
 * that src/client-release.json recorded; a build that read GitHub records what it read
 * there (not in CI), like content/anchors.json.
 */
async function clientOffer(): Promise<ClientOffer> {
	const file = at('src/client-release.json');
	const recorded: ClientOffer = fs.existsSync(file) ? JSON.parse(read(file)) : { main: null, preview: null };
	const headers: Record<string, string> = { accept: 'application/vnd.github+json' };
	if (process.env.GITHUB_TOKEN) headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
	const fromFile = process.env.ND_CLIENT_RELEASES;
	try {
		let list: GitHubRelease[];
		if (fromFile) list = JSON.parse(read(path.resolve(fromFile)));
		else {
			const res = await fetch(config.clientReleasesUrl, { headers, signal: AbortSignal.timeout(8000) });
			if (!res.ok) throw new Error(`${res.status}`);
			list = (await res.json()) as GitHubRelease[];
		}
		const picked = pickRelease(list.map((r) => ({ ...r, tag: r.tag_name, published: r.published_at })));
		const withSums = async (r: GitHubRelease | null) => {
			if (!r) return null;
			const sumsAsset = r.assets.find((a) => a.name === 'SHA256SUMS');
			let sums = new Map<string, string>();
			if (sumsAsset) {
				try {
					const res = await fetch(sumsAsset.browser_download_url, { signal: AbortSignal.timeout(15000) });
					if (!res.ok) throw new Error(`${res.status}`);
					sums = parseSums(await res.text());
				} catch (e) {
					if (!fromFile) throw e;
				}
			}
			return toClientRelease(r, sums, problems);
		};
		const offer: ClientOffer = { main: await withSums(picked.main), preview: await withSums(picked.preview) };
		const text = `${JSON.stringify(offer, null, '\t')}\n`;
		if (!fromFile && !process.env.CI && (!fs.existsSync(file) || read(file) !== text)) {
			fs.writeFileSync(file, text);
			console.log('Recorded the client release in src/client-release.json; commit it.');
		}
		return offer;
	} catch (e) {
		console.warn(`Could not read the client's releases (${(e as Error).message}); the download page offers ${recorded.main?.tag ?? 'nothing'} from src/client-release.json.`);
		return recorded;
	}
}

/**
 * When a file last changed: the date of the last commit that changed it. A file git does
 * not know yet, or a checkout without history, gives the file's own time instead.
 */
function updatedOf(file: string): string {
	try {
		const out = execFileSync('git', ['log', '-1', '--format=%cI', '--', file], {
			cwd: path.dirname(file),
			stdio: ['ignore', 'pipe', 'ignore']
		})
			.toString()
			.trim();
		if (out) return out;
	} catch {
		/* not in a git repository */
	}
	return fs.statSync(file).mtime.toISOString().replace(/\.\d{3}Z$/, 'Z');
}
/** The newest of some ISO dates. */
const newest = (dates: string[]) => dates.reduce((a, b) => (Date.parse(b) > Date.parse(a) ? b : a));

/* ---------- loading the pages ---------- */

function frontMatter(source: string, file: string) {
	const m = source.match(/^---\n([\s\S]*?)\n---\n?/);
	if (!m) {
		problems.push(`${file}: no front matter`);
		return { data: {} as Record<string, string>, body: source };
	}
	const data: Record<string, string> = {};
	for (const line of m[1].split('\n')) {
		const kv = line.match(/^([A-Za-z]+):\s*(.*)$/);
		if (!kv) continue;
		let value = kv[2].trim();
		if (/^(".*"|'.*')$/.test(value)) value = value.slice(1, -1);
		data[kv[1]] = value;
	}
	return { data, body: source.slice(m[0].length) };
}

function loadPages(dir: string, locale: Locale, version: string): Page[] {
	const pages: Page[] = [];
	const add = (file: string, slug: string, section: string, parent?: string) => {
		const rel = path.relative(root, file).replace(/\\/g, '/');
		const source = read(file).replaceAll('{{VERSION}}', version);
		const { data, body } = frontMatter(source, rel);
		// The file's line where the body starts, so problems name lines of the file
		const bodyLine = source.slice(0, source.length - body.trimStart().length).split('\n').length;
		if (!data.title) problems.push(`${rel}: no title`);
		if (!data.description) problems.push(`${rel}: no description`);
		if (data.icon && !hasIcon(data.icon)) problems.push(`${rel}: icon ${data.icon} is not in src/icons`);
		if (data.logo && !fs.existsSync(at('public/img/compare', data.logo))) problems.push(`${rel}: logo ${data.logo} is not in public/img/compare`);
		if (/^# /m.test(body.replace(/```[\s\S]*?```/g, ''))) problems.push(`${rel}: the body has a "# " heading; the title is the h1`);
		pages.push({
			file,
			rel,
			locale: locale.code,
			slug,
			section,
			parent,
			title: data.title ?? slug,
			description: data.description ?? '',
			order: Number(data.order ?? 99),
			og: data.og,
			product: data.product,
			logo: data.logo,
			icon: data.icon,
			release: data.release,
			seoTitle: data.seoTitle,
			related: data.related ? data.related.split(',').map((s) => s.trim()).filter(Boolean) : undefined,
			howto: data.howto ? data.howto.split(',').map((s) => s.trim()).filter(Boolean) : undefined,
			fold: data.fold === 'true',
			quoted: data.quoted === 'true',
			body: body.trim() + '\n',
			updated: updatedOf(file),
			bodyLine,
			headings: [],
			links: [],
			html: ''
		});
	};
	for (const s of fs.readdirSync(dir, { withFileTypes: true })) {
		if (!s.isDirectory()) continue;
		if (!config.sections.some((c) => c.slug === s.name)) problems.push(`${path.relative(root, dir).replace(/\\/g, '/')}/${s.name}: not listed in site.config.ts`);
		const sectionDir = path.join(dir, s.name);
		for (const e of fs.readdirSync(sectionDir, { withFileTypes: true })) {
			if (e.isFile() && e.name.endsWith('.md')) add(path.join(sectionDir, e.name), `${s.name}/${e.name.slice(0, -3)}`, s.name);
			else if (e.isDirectory()) {
				for (const c of fs.readdirSync(path.join(sectionDir, e.name))) {
					if (c.endsWith('.md')) add(path.join(sectionDir, e.name, c), `${s.name}/${e.name}/${c.slice(0, -3)}`, s.name, `${s.name}/${e.name}`);
				}
			}
		}
	}
	return pages;
}

/** A section's pages as the sidebar shows them: top-level pages by order, each followed by its children. */
function inSidebarOrder(items: Page[]): Page[] {
	const byOrder = (a: Page, b: Page) => a.order - b.order || a.title.localeCompare(b.title);
	const top = items.filter((i) => !i.parent).sort(byOrder);
	const ordered = top.flatMap((p) => [p, ...items.filter((c) => c.parent === p.slug).sort(byOrder)]);
	const orphans = items.filter((i) => i.parent && !top.some((p) => p.slug === i.parent)).sort(byOrder);
	return [...ordered, ...orphans];
}

/* ---------- Markdown ---------- */

const LANG: Record<string, string> = { sh: 'bash', shell: 'bash', ps1: 'powershell', yml: 'yaml', conf: 'nginx', env: 'ini', text: 'plaintext', txt: 'plaintext' };
// Files the reader pastes that highlight.js has no grammar for: shown plain, with a copy button
const PLAIN_PASTE = new Set(['caddy', 'fstab']);

/**
 * The Markdown renderer for one page. `linkTo` turns a docs link into the address in the
 * page's language, or the default language's when the page has no translation.
 */
function makeMarkdown(page: Page, usedShots: Set<string>, t: Strings, linkTo: (href: string) => string) {
	const md = new MarkdownIt({ html: true, linkify: false, typographer: false });
	const slug = slugger();
	page.headings = [];
	page.links = [];

	// ::: note / ::: warning blocks
	md.block.ruler.before('fence', 'note', (state: StateBlock, start: number, end: number, silent: boolean) => {
		const first = state.src.slice(state.bMarks[start] + state.tShift[start], state.eMarks[start]);
		const open = first.match(/^:::\s*(note|warning)\s*$/);
		if (!open) return false;
		let close = start + 1;
		for (; close < end; close++) {
			if (state.src.slice(state.bMarks[close] + state.tShift[close], state.eMarks[close]).trim() === ':::') break;
		}
		if (close >= end) return false;
		if (silent) return true;
		const token = state.push('note_open', 'div', 1);
		token.attrSet('class', `note note-${open[1]}`);
		token.attrSet('role', 'note');
		token.meta = open[1];
		token.map = [start, close + 1];
		const oldMax = state.lineMax;
		const oldParent = state.parentType;
		state.lineMax = close;
		state.parentType = 'note' as StateBlock['parentType'];
		state.md.block.tokenize(state, start + 1, close);
		state.lineMax = oldMax;
		state.parentType = oldParent;
		state.push('note_close', 'div', -1);
		state.line = close + 1;
		return true;
	});
	md.renderer.rules.note_open = (tokens: Token[], i: number) =>
		`<div class="note note-${tokens[i].meta}" role="note"><p class="note-label">${tokens[i].meta === 'warning' ? t.warning : t.note}</p>\n`;

	// Heading ids, the "On this page" list, and a link to each heading next to it. A
	// heading may end in {#id} to fix its id and {alias=old-id} to keep an old id working
	// after a rename.
	md.core.ruler.push('headings', (state: StateCore) => {
		const t = state.tokens;
		for (let i = 0; i < t.length; i++) {
			if (t[i].type !== 'heading_open') continue;
			const level = Number(t[i].tag.slice(1));
			const inline = t[i + 1];
			const children = inline.children ?? [];
			const attrs = headingAttrs(children);
			if (attrs.bad) problems.push(`${page.rel}:${(t[i].map?.[0] ?? 0) + page.bodyLine}: "{${attrs.bad}}" after a heading; write {#id} or {alias=old-id}`);
			const text = children.filter((c) => c.type === 'text' || c.type === 'code_inline').map((c) => c.content).join('');
			if (level === 1) continue;
			const id = attrs.id ?? slug(text);
			t[i].attrSet('id', id);
			t[i].meta = { aliases: attrs.aliases, id, text, level };
			page.headings.push({ level, id, aliases: attrs.aliases, text, line: t[i].map?.[0] ?? 0 });
		}
	});

	// Links: checked after every page is rendered; docs links get a trailing slash; outside links open safely
	const defaultLinkOpen: RendererRule =
		md.renderer.rules.link_open ?? ((tokens, i, opts, env, self) => self.renderToken(tokens, i, opts));
	md.renderer.rules.link_open = (tokens, i, opts, env, self) => {
		const token = tokens[i];
		const href = token.attrGet('href') ?? '';
		page.links.push(href);
		if (/^https?:\/\//.test(href)) token.attrSet('rel', 'noopener');
		else if (href.startsWith('/docs')) token.attrSet('href', url(linkTo(href)));
		else if (href.startsWith('/')) token.attrSet('href', url(href));
		return defaultLinkOpen(tokens, i, opts, env, self);
	};

	// ![alt](shot:name) is a console screenshot in the reader's theme
	const defaultImage = md.renderer.rules.image!;
	md.renderer.rules.image = (tokens, i, opts, env, self) => {
		const token = tokens[i];
		const src = token.attrGet('src') ?? '';
		const alt = self.renderInlineAsText(token.children ?? [], opts, env);
		if (!src.startsWith('shot:')) {
			problems.push(`${page.rel}: image "${src}" is not a shot: screenshot`);
			return defaultImage(tokens, i, opts, env, self);
		}
		const name = src.slice(5);
		if (!alt.trim()) problems.push(`${page.rel}: screenshot "${name}" has no alt text`);
		if (!fs.existsSync(path.join(SHOTS, `${name}-dark.png`)) || !fs.existsSync(path.join(SHOTS, `${name}-light.png`))) {
			problems.push(`${page.rel}: no screenshot named "${name}"`);
			return '';
		}
			usedShots.add(name);
		const { width, height } = pngSize(path.join(SHOTS, `${name}-light.png`));
		const shot = (file: string) => url(`/docs/shots/${file}`);
		return (
			`<a class="shot" href="${shot(`${name}-light.png`)}" data-dark="${shot(`${name}-dark.png`)}"><picture>` +
			`<source media="(prefers-color-scheme: dark)" type="image/webp" srcset="${shot(`${name}-dark.webp`)}">` +
			`<source media="(prefers-color-scheme: dark)" srcset="${shot(`${name}-dark.png`)}">` +
			`<source type="image/webp" srcset="${shot(`${name}-light.webp`)}">` +
			`<img src="${shot(`${name}-light.png`)}" alt="${esc(alt)}" width="${width}" height="${height}" loading="lazy" decoding="async"></picture><span class="vh">${esc(t.fullSize)}</span></a>`
		);
	};

	// Code blocks: highlighted, with a copy button
	md.renderer.rules.fence = (tokens, i) => {
		const token = tokens[i];
		const info = token.info.trim().split(/\s+/)[0].toLowerCase();
		const lang = LANG[info] ?? info;
		const code = token.content.replace(/\n$/, '');
		let html;
		if (lang && lang !== 'plaintext' && hljs.getLanguage(lang)) html = hljs.highlight(code, { language: lang, ignoreIllegals: true }).value;
		else {
			if (lang && lang !== 'plaintext' && !PLAIN_PASTE.has(lang)) problems.push(`${page.rel}: unknown code language "${info}"`);
			html = esc(code);
		}
		if (!info) problems.push(`${page.rel}:${(token.map?.[0] ?? 0) + page.bodyLine}: a code block has no language`);
		const output = lang === 'plaintext';
		return (
			`<div class="code${output ? ' code-output' : ''}">` +
			(output ? '' : `<button type="button" class="copy" aria-label="${esc(t.copyCode)}" data-copied="${esc(t.copied)}" data-failed="${esc(t.copyFailed)}">${esc(t.copy)}</button>`) +
			`<pre aria-label="${esc(output ? t.outputBlock : info ? `${t.codeBlock}, ${info}` : t.codeBlock)}"><code>${html}</code></pre></div>\n`
		);
	};

	// Commands can be copied as they are; see src/commands.ts
	md.core.ruler.push('commands', (state: StateCore) => {
		for (const p of checkCommands(state.tokens, { quotedPage: page.quoted })) problems.push(`${page.rel}:${p.line + page.bodyLine - 1}: ${p.message}`);
	});

	// The old ids of a renamed heading, as empty targets right before it. A heading with
	// an id sits in a row with a link to it after it; the heading itself is no link, so its
	// name stays its text.
	md.renderer.rules.heading_open = (tokens, i, opts, env, self) => {
		const meta = tokens[i].meta;
		const aliases = (meta?.aliases ?? []).map((a: string) => `<span id="${esc(a)}" class="anchor-alias"></span>`).join('');
		return aliases + (meta?.id ? `<div class="heading heading-${meta.level}">` : '') + self.renderToken(tokens, i, opts);
	};
	md.renderer.rules.heading_close = (tokens, i, opts, env, self) => {
		const meta = tokens[i - 2]?.meta;
		const close = self.renderToken(tokens, i, opts);
		return meta?.id ? `${close.trimEnd()}<a class="anchor" href="#${esc(meta.id)}" aria-label="${esc(fill(t.linkToSection, { title: meta.text }))}"></a></div>\n` : close;
	};

	md.renderer.rules.table_open = () => '<div class="table-wrap"><table>\n';
	md.renderer.rules.table_close = () => '</table></div>\n';
	// An empty corner cell gets a hidden name, so every header cell says what it heads
	md.renderer.rules.th_open = (tokens, i, opts, env, self) => self.renderToken(tokens, i, opts) + (tokens[i + 1]?.content.trim() ? '' : `<span class="vh">${esc(t.tableTopic)}</span>`);
	return md;
}

/** A docs address as the site serves it: /docs/a/b/ with its anchor kept. */
function docHref(href: string) {
	const [p, hash] = href.split('#');
	const clean = p.replace(/\/$/, '');
	return `${clean}/${hash ? `#${hash}` : ''}`;
}

/* ---------- Markdown copies for AI tools ---------- */

const mdUrl = (slug: string, prefix = '') => url(`${prefix}/docs/${slug}.md`);

/** A page's body as plain Markdown: notes become quotes, screenshots plain images, site links absolute. */
function agentMarkdown(body: string, linkTo: (href: string) => string, t: Strings) {
	const out: string[] = [];
	let fence: string | null = null;
	let note: string | null = null;
	for (let line of body.split('\n')) {
		const mark = line.match(/^\s*(`{3,}|~{3,})/)?.[1];
		if (fence) {
			out.push(note ? `> ${line}` : line);
			if (mark && mark[0] === fence[0] && mark.length >= fence.length) fence = null;
			continue;
		}
		if (mark) {
			fence = mark;
			out.push(note ? `> ${line}` : line);
			continue;
		}
		if (/^#{2,6} /.test(line)) line = line.replace(HEADING_ATTRS_LINE, '$1');
		const open = line.match(/^:::\s*(note|warning)\s*$/);
		if (open) {
			note = open[1];
			out.push(`> **${note === 'warning' ? t.warning : t.note}:**`);
			continue;
		}
		if (note && line.trim() === ':::') {
			note = null;
			continue;
		}
		const rewritten = line
			.split(/(`[^`]*`)/)
			.map((part) =>
				part.startsWith('`')
					? part
					: part
							.replace(/!\[([^\]]*)\]\(shot:([\w-]+)\)/g, (_, alt, name) => `![${alt}](${url(`/docs/shots/${name}-light.png`)})`)
							.replace(/\]\((\/docs\/[^)#\s]+?)\/?(#[^)\s]*)?\)/g, (_, p, hash) => `](${url(linkTo(p)).replace(/\/$/, '')}.md${hash ?? ''})`)
							.replace(/\]\((\/[^)\s]*)\)/g, (_, p) => `](${url(p)})`)
			)
			.join('');
		out.push(note ? `> ${rewritten}`.trimEnd() : rewritten);
	}
	return out.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

function pageMarkdown(page: Page, locale: Locale, t: Strings, linkTo: (href: string) => string) {
	const head = [`# ${page.title}`, `${t.source}: ${url(`${locale.prefix}/docs/${page.slug}/`)}${page.updated ? `\n${t.lastUpdated}: ${page.updated.slice(0, 10)}` : ''}`];
	if (page.description) head.push(`> ${page.description}`);
	return `${head.join('\n\n')}\n\n${agentMarkdown(page.body, linkTo, t)}`;
}

const pageList = (items: Page[], prefix = '') =>
	items.map((p) => `${p.parent ? '  ' : ''}- [${p.title}](${mdUrl(p.slug, prefix)})${p.description ? `: ${p.description}` : ''}`).join('\n');

/* ---------- the home page's install tabs ---------- */

/** The tabs, notes and terminal panels of the home page's install section, from src/install.ts. */
function installMarkup(locale: Locale, h: HomeStrings) {
	const tabs = `        <div class="tabs" role="tablist" aria-label="${esc(h.installOn)}" hidden>\n${INSTALLS.map(
		(m, i) =>
			`          <button type="button" role="tab" id="tab-${m.id}" aria-controls="install-${m.id}" aria-selected="${i === 0}"${i ? ' tabindex="-1"' : ''} data-os="${m.id}">${esc(m.tab)}</button>`
	).join('\n')}\n        </div>`;
	const notes = INSTALLS.map(
		(m) =>
			`        <p class="body install-note" data-os="${m.id}"><b class="os-label">${esc(m.tab)}: </b>${esc(m.note[locale.code])} ${fill(h.docsPageHas, { href: url(`${locale.prefix}${m.docs}/`) })}</p>`
	).join('\n');
	const panels = INSTALLS.map(
		(m) => `        <div class="term" role="tabpanel" id="install-${m.id}" aria-labelledby="tab-${m.id}" data-os="${m.id}">
          <div class="term-bar"><span class="term-os">${esc(m.tab)}</span><button type="button" class="term-copy" aria-label="${esc(fill(h.copyCommands, { os: m.tab }))}">${esc(h.copy)}</button></div>
          <pre class="term-lines">${m.lines.map((l) => `<code>${esc(l)}</code>`).join('\n')}</pre>
        </div>`
	).join('\n');
	return { tabs: `${tabs}\n${notes}`, panels };
}

/* ---------- llms.txt ---------- */

const kb = (bytes: number) => `${Math.max(1, Math.round(bytes / 1024))} KB`;

/**
 * The top of llms.txt: what NeoDesk is, a section for AI agents with the one-line installs
 * and the agent tools that exist (src/agents.ts), and the docs as one file per section.
 */
function llmsTxt({ bundles, fullBytes, titleOf, answers }: { bundles: { label: string; file: string; bytes: number; pages: number }[]; fullBytes: number; titleOf: (docs: string) => string; answers: Answer[] }) {
	// A docs link in an answer leads to the page's Markdown copy, its heading kept
	const mdHref = (p: string) => {
		if (p.startsWith('/') && !p.startsWith('/docs')) return url(p.replace(/\/?$/, '/'));
		if (!p.startsWith('/docs')) return p;
		const [page, hash] = p.split('#');
		return `${url(`${page.replace(/\/$/, '')}.md`)}${hash ? `#${hash}` : ''}`;
	};
	const installs = INSTALLS.filter((i) => i.oneLine)
		.map((i) => `- ${i.oneLine}. See [${titleOf(i.docs)}](${url(`${i.docs}.md`)}).\n\n  \`\`\`${i.lang}\n  ${i.lines[0]}\n  \`\`\``)
		.join('\n\n');
	const tools = AGENT_TOOLS.filter((t) => t.available).map((t) => `- ${t.name}: ${t.summary} See [the docs](${url(`${t.docs}.md`)}).`);
	return [
		`# ${config.name}`,
		`> ${config.summary}`,
		'## For AI agents',
		`Install NeoDesk on a server with one command:\n\n${installs}`,
		'Both print the address of the web console and the admin password at the end. In the docs every command is in a fenced block with its language, placeholders look like `<server-address>`, and the text next to a block says what to put in.',
		...(tools.length ? [`Tools for agents:\n\n${tools.join('\n')}`] : []),
		`The website is ${SITE_URL}/ and the docs are at ${DOCS_URL}/, in English and in German (${url('/de/docs/')}). Paid support and help with a setup: support@neode.sk. Help on Discord: ${config.discord}.`,
		'## Quick answers',
		answers.map((x) => `### ${x.q}\n\n${answerMarkdown(x.a, mdHref)}`).join('\n\n'),
		'## Docs as text',
		'Every docs page below is Markdown at the address shown. The same page as HTML is at that address without .md. The docs of one section are also in one file:',
		[...bundles.map((b) => `- [${b.label}](${SITE_URL}/${b.file}): ${kb(b.bytes)}, ${b.pages} page${b.pages === 1 ? '' : 's'}`), `- [All docs](${SITE_URL}/llms-full.txt): ${kb(fullBytes)}`].join('\n'),
		''
	].join('\n\n');
}

/* ---------- robots.txt ---------- */

/** Everything is allowed; on production the AI crawlers are also named, so their access is explicit. */
function robotsTxt(sitemaps: string[]) {
	const groups = ['User-agent: *\nAllow: /'];
	if (PRODUCTION) groups.push(`# AI crawlers, allowed by name\n${config.aiCrawlers.map((a) => `User-agent: ${a}`).join('\n')}\nAllow: /`);
	return `${groups.join('\n\n')}\n\n${sitemaps.map((s) => `Sitemap: ${s}`).join('\n')}\n`;
}

/* ---------- the build ---------- */

/** The docs of one language. */
interface Site {
	locale: Locale;
	t: Strings;
	pages: Page[];
	sections: Section[];
	/** The pages in sidebar order, for previous and next */
	reading: Page[];
}

async function build() {
	const started = Date.now();
	problems.length = 0;
	const searchSizes: string[] = [];
	const version = await currentVersion();
	const client = await clientOffer();

	// Every language with docs files: the default from content/docs, the others from content/<code>/docs
	const sites: Site[] = [];
	for (const locale of LOCALES) {
		const dir = locale.default ? DOCS : at('content', locale.code, 'docs');
		if (!fs.existsSync(dir)) continue;
		const pages = loadPages(dir, locale, version);
		if (!pages.length) continue;
		const missing = [
			...missingStrings(locale.code, config.sections.map((s) => s.slug)),
			...missingHomeStrings(locale.code),
			...INSTALLS.filter((m) => !m.note[locale.code]).map((m) => `the note of ${m.id} in src/install.ts`)
		];
		if (missing.length) {
			problems.push(`content/${locale.code}/docs: ${locale.label} has pages, but src/i18n.ts and src/home.ts lack its strings: ${missing.join(', ')}`);
			continue;
		}
		const t = stringsOf(locale.code);
		const sections: Section[] = config.sections
			.map((s) => ({ ...s, ...(locale.default ? {} : { description: undefined, ...t.sections?.[s.slug] }), items: inSidebarOrder(pages.filter((p) => p.section === s.slug)) }))
			.filter((s) => s.items.length);
		sites.push({ locale, t, pages, sections, reading: sections.flatMap((s) => s.items) });
	}
	const main = sites.find((s) => s.locale.default);
	if (!main) {
		console.error(`No docs in ${DOCS}`);
		return false;
	}
	// A translation takes "See also", the HowTo steps and the icon from the English page
	for (const site of sites.filter((s) => s !== main)) {
		for (const page of site.pages) {
			const en = main.pages.find((p) => p.slug === page.slug);
			page.related ??= en?.related;
			page.howto ??= en?.howto;
			page.icon ??= en?.icon;
		}
	}
	for (const page of main.pages) {
		for (const r of page.related ?? []) if (!main.pages.some((p) => `/docs/${p.slug}` === r)) problems.push(`${page.rel}: related: "${r}" is not a page`);
	}

	// Which languages have a page at each address
	const available = new Map<string, Locale[]>();
	const offer = (p: string, l: Locale) => available.set(p, [...(available.get(p) ?? []), l]);
	for (const site of sites) {
		offer('/', site.locale);
		offer('/docs/', site.locale);
		offer('/docs/all/', site.locale);
		if (hasBrand(site.locale.code)) for (const slug of BRAND_SLUGS) offer(brandPath(slug), site.locale);
		if (DOWNLOAD[site.locale.code]) offer('/download/', site.locale);
		if (hasSitePages(site.locale.code)) for (const slug of SITE_PAGES) offer(`/${slug}/`, site.locale);
		for (const s of site.sections) offer(`/docs/${s.slug}/`, site.locale);
		for (const p of site.pages) offer(`/docs/${p.slug}/`, site.locale);
	}
	const versions = (p: string) => available.get(p) ?? [];
	// What the site's small pages (src/pages.ts) link to and show, in one language
	const pageContext = (locale: Locale) => ({
		docs: (p: string) => {
			const [page, hash] = p.split('#');
			return `${url(linkIn(locale)(page))}${hash ? `#${hash}` : ''}`;
		},
		page: (slug: SitePageSlug | 'download') => url(`${locale.prefix}/${slug}/`),
		repo: config.repo,
		clientRepo: config.clientRepo,
		discord: config.discord,
		version,
		client,
		dateLocale: locale.dateLocale
	});
	// A docs link from a page: to the page in the same language when there is one, else to the default language's
	const linkIn = (locale: Locale) => (href: string) => {
		const clean = docHref(href);
		return versions(clean.split('#')[0]).some((l) => l.code === locale.code) ? `${locale.prefix}${clean}` : clean;
	};

	fs.rmSync(DIST, { recursive: true, force: true });
	copyDir(at('public'), DIST);
	// Every logo file in one archive, the same bytes for the same files
	const brandZip = zipFolder(at('public/brand/files'), 'neodesk-logo');
	write('brand/neodesk-logo.zip', brandZip);

	// Styles and scripts, with a hash in the address so a new build is never served from cache
	// The header and footer styles (src/chrome.css) go in front of site.css, and into the home page
	const chromeCss = read(at('src/chrome.css'));
	const assets: Record<string, string> = {};
	for (const name of ['site.css', 'docs.css', 'docs.js']) {
		// site.css gets the header and footer in front; docs.css gets the brand page's styles at the end
		const data =
			name === 'site.css'
				? Buffer.from(`${chromeCss}\n${read(at('src', name))}`)
				: name === 'docs.css'
					? Buffer.from(`${read(at('src', name))}\n${read(at('src/brand.css'))}\n${read(at('src/download.css'))}`)
					: fs.readFileSync(at('src', name));
		assets[name] = `/assets/${name}?v=${hashOf(data)}`;
		write(`assets/${name}`, data);
	}

	// Render every page
	const usedShots = new Set<string>();
	for (const site of sites) for (const page of site.pages) page.html = makeMarkdown(page, usedShots, site.t, linkIn(site.locale)).render(page.body);
	for (const site of sites) {
		for (const page of site.pages) for (const id of page.howto ?? []) if (!page.headings.some((h) => h.id === id)) problems.push(`${page.rel}: howto: no heading "#${id}"`);
	}

	// Check every link between pages. A translated page may link to a page that exists in the default language only.
	const byAddress = (site: Site) => new Map(site.pages.map((p) => [`/docs/${p.slug}`, p]));
	const known = byAddress(main);
	for (const site of sites) {
		const own = byAddress(site);
		for (const page of site.pages) {
			for (const href of page.links) {
				if (/^(https?:|mailto:)/.test(href)) continue;
				const [p, hash] = href.split('#');
				// A link names a heading's id, not one of its old ids, which are for links from outside
				const headingProblem = (on: Page) => {
					if (on.headings.some((h) => h.id === hash)) return null;
					const renamed = on.headings.find((h) => h.aliases.includes(hash));
					return renamed ? `"#${hash}" is an old id; link to "#${renamed.id}"` : `no heading "#${hash}"`;
				};
				if (!p) {
					const wrong = headingProblem(page);
					if (wrong) problems.push(`${page.rel}: ${wrong} on this page`);
					continue;
				}
				const target = p.replace(/\/$/, '');
				// Pages of the www host that are not docs, such as the brand page
				if (new RegExp(`^(/[a-z]{2})?/(brand(/[a-z-]+)?|download|${SITE_PAGES.join('|')})$`).test(target)) continue;
				if (target === '' || target === '/docs' || main.sections.some((s) => `/docs/${s.slug}` === target)) continue;
				if (p.endsWith('.md')) problems.push(`${page.rel}: link "${href}" should not end in .md`);
				const to = own.get(target) ?? known.get(target);
				if (!to) problems.push(`${page.rel}: link to "${href}", which is not a page`);
				else if (hash && headingProblem(to)) problems.push(`${page.rel}: "${href}": ${headingProblem(to)} on that page`);
			}
		}
	}

	// Heading ids stay: every id content/anchors.json has seen must still lead to its page,
	// as a heading's id or as an alias of the heading that replaced it
	const anchorsFile = at('content/anchors.json');
	const recorded: Record<string, string[]> = !process.env.DOCS_DIR && fs.existsSync(anchorsFile) ? JSON.parse(read(anchorsFile)) : {};
	for (const [slug, ids] of Object.entries(recorded)) {
		const page = main.pages.find((p) => p.slug === slug);
		if (!page) {
			problems.push(`content/anchors.json: the page ${slug} is gone; if that is meant, remove it from the file`);
			continue;
		}
		for (const id of ids) {
			if (!page.headings.some((h) => h.id === id || h.aliases.includes(id))) {
				problems.push(`${page.rel}: the heading id "#${id}" is gone; add {alias=${id}} to the heading that took its place (see README.md)`);
			}
		}
	}

	// Link preview images: one per page, named after the page's address, from the template
	// its type asks for. They show the logo and the title. They are drawn after the pages,
	// from the same list.
	const previews: { path: string; title: string; data: OgData }[] = [];
	const preview = (p: string, title: string, data: OgData) => previews.push({ path: p, title, data });
	const TEMPLATES: OgTemplate[] = ['docs', 'comparison', 'use-case', 'release'];
	for (const site of sites) {
		const { locale, t } = site;
		const h = homeStringsOf(locale.code);
		preview(`${locale.prefix}/`, h.title, { template: 'landing', title: h.heroTitle.replace(/<[^>]+>/g, '') });
		preview(`${locale.prefix}/docs/`, fill(t.docsTitle, { name: config.name }), { template: 'landing', title: t.documentation });
		preview(`${locale.prefix}/docs/all/`, t.allPages, { template: 'landing', title: t.allPages });
		if (hasBrand(locale.code)) for (const b of brandPages(locale.code, locale.prefix, 0)) preview(`${locale.prefix}${b.path}`, b.title, { template: 'landing', title: b.title });
		if (DOWNLOAD[locale.code]) preview(`${locale.prefix}/download/`, DOWNLOAD[locale.code].title, { template: 'landing', title: DOWNLOAD[locale.code].title });
		if (hasSitePages(locale.code)) for (const x of sitePages(locale.code, pageContext(locale))) preview(`${locale.prefix}/${x.slug}/`, x.previewTitle, { template: 'landing', title: x.previewTitle });
		for (const s of site.sections) preview(`${locale.prefix}/docs/${s.slug}/`, s.label, { template: 'landing', title: s.label });
		for (const page of site.pages) {
			const template = (page.og ?? 'docs') as OgTemplate;
			if (!TEMPLATES.includes(template)) problems.push(`${page.rel}: og: ${page.og} is not a template; use ${TEMPLATES.join(', ')}`);
			if (template === 'comparison' && !page.product) problems.push(`${page.rel}: og: comparison needs product: in the front matter`);
			preview(`${locale.prefix}/docs/${page.slug}/`, page.title, {
				template,
				title: template === 'comparison' ? (page.product ?? page.title) : page.title,
				version: template === 'release' ? (page.release ?? version) : undefined
			});
		}
	}
	/** The image file of a page: /docs/a/b/ has og/docs/a/b.png, a home page og/index.png or og/de/index.png */
	const imageOf = (p: string) => `og${p === '/' || LOCALES.some((l) => l.prefix && p === `${l.prefix}/`) ? `${p}index` : p.replace(/\/$/, '')}.png`;
	const byPath = new Map(previews.map((p) => [p.path, { url: `${SITE_URL}/${imageOf(p.path)}`, alt: `${config.name}: ${p.data.title}` }]));
	const previewOf = (p: string) => byPath.get(p);

	for (const site of sites) {
		const { locale, t } = site;
		const shared: Shared = { config, sections: site.sections, assets, version, siteUrl: SITE_URL, urls, production: PRODUCTION, locale, t, versions, previewOf };
		// Files of another language go under its prefix: de/docs/...
		const out = (file: string) => `${locale.prefix.replace(/^\//, '')}${locale.prefix ? '/' : ''}${file}`;
		const labelOf = (slug: string) => site.sections.find((s) => s.slug === slug)?.label ?? slug;
		const linkTo = linkIn(locale);
		site.reading.forEach((page, i) => {
			const pager = (word: string, wordIn: string, other: Page | undefined): Pager | null =>
				other
					? { label: other.section === page.section ? word : fill(wordIn, { section: labelOf(other.section) }), title: other.title, href: url(`${locale.prefix}/docs/${other.slug}/`) }
					: null;
			write(
				out(`docs/${page.slug}/index.html`),
				docPage({
					...shared,
					page,
					sectionLabel: labelOf(page.section),
					prev: pager(t.previous, t.previousIn, site.reading[i - 1]),
					next: pager(t.next, t.nextIn, site.reading[i + 1])
				})
			);
			write(out(`docs/${page.slug}.md`), pageMarkdown(page, locale, t, linkTo));
		});
		// The search index: every page, heading, command and setting, plain and gzipped (src/search.ts)
		const addressOf = (p: Page) => url(`${locale.prefix}/docs/${p.slug}/`).slice(DOCS_URL.length + 1);
		const index = buildIndex(site.reading, site.sections.map((s) => s.label), (p) => site.sections.findIndex((s) => s.slug === p.section), addressOf);
		const files = indexFiles(index);
		write(out('docs/search.json'), files.json);
		write(out('docs/search.json.gz'), files.gz);
		searchSizes.push(`${locale.label} ${index.p.length} pages, ${index.e.length} entries, ${kb(files.json.length)} (${kb(files.gz.length)} gzipped)`);
		problems.push(...checkIndex(index, site.reading, addressOf, `${out('docs/search.json')}`));
		// Every page in one list: the search without scripts
		write(out('docs/all/index.html'), allPagesPage(shared));
		write(
			out('docs/all.md'),
			`# ${t.allPages}\n\n${t.source}: ${url(`${locale.prefix}/docs/all/`)}\n\n${site.sections.map((s) => `## ${s.label}\n\n${pageList(s.items, locale.prefix)}`).join('\n\n')}\n`
		);
		for (const section of site.sections) {
			write(out(`docs/${section.slug}/index.html`), sectionPage({ ...shared, section }));
			write(
				out(`docs/${section.slug}.md`),
				`# ${section.label}\n\n${t.source}: ${url(`${locale.prefix}/docs/${section.slug}/`)}\n\n${section.intro}\n\n${pageList(section.items, locale.prefix)}\n`
			);
		}
		write(out('docs/index.html'), docsIndexPage(shared));
		// The brand guide: /brand/ with the logo files of public/brand/files and their zip, and its pages
		if (!hasBrand(locale.code)) problems.push(`src/brand.ts: no brand guide text for ${locale.label}`);
		else for (const b of brandPages(locale.code, locale.prefix, brandZip.length)) write(out(`${b.path.slice(1)}index.html`), brandPage({ ...shared, path: b.path, title: b.title, fullTitle: b.pageTitle, description: b.description, main: b.main }));
		// The download page, with the client's release that clientOffer read
		const dl = DOWNLOAD[locale.code];
		if (!dl) problems.push(`src/download.ts: no download page text for ${locale.label}`);
		else {
			const docsLink = (p: string) => {
				const [page, hash] = p.split('#');
				return `${url(linkTo(page))}${hash ? `#${hash}` : ''}`;
			};
			const main = downloadMain(locale.code, locale.dateLocale, client, {
				docs: docsLink,
				server: `${url(`${locale.prefix}/`)}#server`,
				discord: config.discord,
				discussions: `${config.repo}/discussions`,
				releases: `${config.clientRepo}/releases`
			});
			const pageUrl = url(`${locale.prefix}/download/`);
			write(out('download/index.html'), downloadPage({ ...shared, title: dl.title, fullTitle: dl.pageTitle, description: dl.description, main, jsonLd: clientSoftware(locale.code, client, pageUrl, SITE_URL) }));
		}
		// Support, releases, security, the imprint and the website's privacy page
		if (!hasSitePages(locale.code)) problems.push(`src/pages.ts: no pages for ${locale.label}`);
		else for (const x of sitePages(locale.code, pageContext(locale))) write(out(`${x.slug}/index.html`), sitePage({ ...shared, slug: x.slug, title: x.title, fullTitle: x.pageTitle, description: x.description, main: x.main }));
		// The web server sends 404.html for an address that does not exist, on each host;
		// another language's 404 page needs a rule of its own there, such as one for /de/
		write(out('404.html'), notFoundPage(shared));
		write(out('docs/404.html'), notFoundPage(shared, '/docs/404.html'));
	}

	// Draw the link preview images, or take them from the cache when nothing about them changed
	const items: PreviewItem[] = [];
	let drawn = 0;
	// A title that does not fit its image even at the smallest size stops the build
	const titleProblem = (where: string, title: string, problem: string | undefined) => {
		if (problem) problems.push(`${where}: the link preview image of "${title}": ${problem}; shorten the title`);
	};
	for (const p of previews) {
		const out = renderPreview(p.data, CACHE);
		if (!out.cached) drawn++;
		titleProblem(p.path, p.data.title, out.problem);
		write(imageOf(p.path), out.png);
		items.push({ page: p.path, title: p.title, image: `/${imageOf(p.path)}`, template: p.data.template, bytes: out.png.length });
	}
	// The templates no page uses yet, with sample text, for the contact sheet only
	const samples: [OgTemplate, OgData][] = [
		['comparison', { template: 'comparison', title: 'Example product' }],
		['use-case', { template: 'use-case', title: 'Sample title of a use case page, long enough to wrap' }],
		['release', { template: 'release', title: 'Sample release title', version }]
	];
	const templates: PreviewItem[] = samples
		.filter(([name]) => !previews.some((p) => p.data.template === name))
		.map(([name, data]) => {
			const out = renderPreview(data, CACHE);
			titleProblem(`og/templates/${name}.png`, data.title, out.problem);
			write(`og/templates/${name}.png`, out.png);
			return { title: `Sample: ${data.title}`, image: `/og/templates/${name}.png`, template: name, bytes: out.png.length };
		});
	write(
		'og/index.html',
		contactSheetPage({
			config,
			sections: main.sections,
			assets,
			version,
			siteUrl: SITE_URL,
			urls,
			production: PRODUCTION,
			locale: DEFAULT_LOCALE,
			t: main.t,
			versions,
			previewOf,
			items,
			templates
		})
	);
	// Screenshots as PNG, for the link to the full picture, and as WebP for the page
	for (const name of usedShots) {
		for (const theme of ['dark', 'light']) {
			fs.mkdirSync(path.join(DIST, 'docs/shots'), { recursive: true });
			fs.copyFileSync(path.join(SHOTS, `${name}-${theme}.png`), path.join(DIST, 'docs/shots', `${name}-${theme}.png`));
			write(`docs/shots/${name}-${theme}.webp`, await webpOf(path.join(SHOTS, `${name}-${theme}.png`)));
		}
	}
	for (const f of fs.readdirSync(at('public/img')).filter((f) => f.endsWith('.png'))) write(`img/${f.replace(/\.png$/, '.webp')}`, await webpOf(at('public/img', f)));
	// The home page's first screen: its screenshots as WebP of good quality rather than
	// lossless, and at half their width for narrow screens, so the first screen loads fast
	for (const f of fs.readdirSync(at('public/img')).filter((f) => /^hero-.+\.png$/.test(f))) {
		const name = f.replace(/\.png$/, '');
		const { width } = pngSize(at('public/img', f));
		write(`img/${name}.webp`, await heroWebp(at('public/img', f), width));
		write(`img/${name}-half.webp`, await heroWebp(at('public/img', f), Math.round(width / 2)));
	}

	// The home page of every language: the layout from src/home.html, the words from src/home.ts
	// The ports clients need, from the table on the ports page
	const ports = clientPorts(main.pages.find((p) => p.slug === PORTS_PAGE)?.body ?? '');
	if (!ports.length) problems.push(`src/home.html: no client ports found in the table of content/docs/${PORTS_PAGE}.md`);
	const homeTemplate = withWebp(read(at('src/home.html')));
	let llmsAnswers: Answer[] = [];
	for (const site of sites) {
		const { locale } = site;
		const h = homeStringsOf(locale.code);
		const home = { siteUrl: SITE_URL, urls, versions, locale, t: site.t };
		// Which ports comes from the default language's table, how the protocol is written from this language's
		const protocols = protocolsOf(site.pages.find((p) => p.slug === PORTS_PAGE)?.body ?? '');
		const portList = ports
			// Plain TCP goes without saying; a port that also takes UDP says so
			.map((p) => `<span class="mono lime">${esc(p.port)}</span>${/UDP/.test(p.protocol) ? ` (${esc(protocols.get(p.port) ?? p.protocol)})` : ''}`)
			.join(', ')
			.replace(/, ([^,]*)$/, ` ${h.and} $1`);
		const portsText = ports
			.map((p) => `${p.port}${/UDP/.test(p.protocol) ? ` (${protocols.get(p.port) ?? p.protocol})` : ''}`)
			.join(', ')
			.replace(/, ([^,]*)$/, ` ${h.and} $1`);
		// Short answers to what people ask, shown under "Questions" and as FAQPage data
		const answers = answersOf(locale.code, portsText, version);
		if (locale.default) llmsAnswers = answers;
		const answerHref = (p: string) => (p.startsWith('/') ? url(linkIn(locale)(p.split('#')[0]) + (p.includes('#') ? `#${p.split('#')[1]}` : '')) : p);
		const questions = answers
			.map((x, i) => `        <div class="faq-item">\n          <h3 id="q${i + 1}">${esc(x.q)}</h3>\n          <p>${answerHtml(x.a, answerHref)}</p>\n        </div>`)
			.join('\n');
		const organization = {
			'@context': 'https://schema.org',
			'@type': 'Organization',
			'@id': `${SITE_URL}/#organization`,
			name: config.name,
			url: `${SITE_URL}/`,
			logo: `${SITE_URL}/img/neodesk-app-icon-512.png`,
			email: 'support@neode.sk',
			sameAs: [config.discord, 'https://github.com/neodeskapp']
		};
		const software = {
			'@context': 'https://schema.org',
			'@type': 'SoftwareApplication',
			name: config.name,
			description: locale.default ? config.summary : h.summary,
			url: `${SITE_URL}${locale.prefix}/`,
			applicationCategory: 'UtilitiesApplication',
			applicationSubCategory: 'Remote desktop server',
			operatingSystem: 'Linux, Windows',
			softwareVersion: version,
			license: config.license,
			downloadUrl: config.downloadUrl,
			isAccessibleForFree: true,
			offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
			publisher: { '@id': `${SITE_URL}/#organization` },
			sameAs: [config.repo]
		};
		const faq = {
			'@context': 'https://schema.org',
			'@type': 'FAQPage',
			inLanguage: locale.code,
			mainEntity: answers.map((x) => ({ '@type': 'Question', name: x.q, acceptedAnswer: { '@type': 'Answer', text: answerText(x.a) } }))
		};
		const { tabs, panels } = installMarkup(locale, h);
		const chrome = {
			config,
			t: site.t,
			locale,
			home: `${locale.prefix}/`,
			docs: url(`${locale.prefix}/docs/`),
			brand: `${locale.prefix}/brand/`,
			download: `${locale.prefix}/download/`,
			pages: Object.fromEntries(SITE_PAGES.map((slug) => [slug, { href: `${locale.prefix}/${slug}/`, title: sitePageTitles(locale.code)[slug] }])) as Record<SitePageSlug, { href: string; title: string }>,
			languages: versions('/').filter((l) => l.code !== locale.code).map((l) => ({ locale: l, href: `${l.prefix}/` }))
		};
		const page = homeTemplate
			.replace('{{CHROME_CSS}}', chromeCss.trim())
			.replace('{{HEADER}}', siteHeader(chrome))
			.replace('{{FOOTER}}', siteFooter(chrome))
			.replace(/\{\{t:(\w+)\}\}/g, (m, key: keyof HomeStrings) => h[key] ?? m)
			.replace('{{CLIENT_PORTS}}', portList)
			.replace('{{INSTALL_TABS}}', tabs)
			.replace('{{INSTALL_PANELS}}', panels)
			.replace(
				'{{SOCIAL}}',
				socialTags({ type: 'website', siteName: config.name, title: h.title, description: h.description, url: `${SITE_URL}${locale.prefix}/`, locale: locale.ogLocale, image: previewOf(`${locale.prefix}/`) })
			)
			.replace('{{QUESTIONS}}', questions)
			.replace('{{JSONLD}}', `<script type="application/ld+json">${JSON.stringify([software, organization, faq]).replace(/</g, '\\u003c')}</script>`)
			.replace('{{LANG}}', locale.code)
			.replaceAll('{{PREFIX}}', locale.prefix)
			.replaceAll('{{VERSION}}', version)
			.replaceAll('{{SITE_URL}}', SITE_URL)
			.replace('{{ROBOTS}}', PRODUCTION ? '' : '<meta name="robots" content="noindex">\n')
			.replace('{{HREFLANG}}', hreflangLinks(home, '/'))
			// Links into the docs go to the docs' own address
			.replace(/href="(\/(?:[a-z]{2}\/)?docs\b[^"]*)"/g, (_, p: string) => `href="${url(p)}"`);
		for (const m of page.matchAll(/\{\{[\w:]+\}\}/g)) problems.push(`src/home.html: ${m[0]} was not filled in for ${locale.label}`);
		write(`${locale.prefix.replace(/^\//, '')}${locale.prefix ? '/' : ''}index.html`, page);
	}

	// For AI tools: llms.txt lists every page and file, one file per section holds that
	// section's pages, and llms-full.txt holds them all
	const { sections, reading } = main;
	const linkTo = linkIn(DEFAULT_LOCALE);
	const markdownOf = (p: Page) => pageMarkdown(p, DEFAULT_LOCALE, main.t, linkTo);
	const about = `# ${config.name}\n\n> ${config.summary}\n\nEvery docs page below is Markdown at the address shown. The same page as HTML is at that address without .md. All docs in one file: ${SITE_URL}/llms-full.txt`;
	const full = `${about}\n\n---\n\n${reading.map(markdownOf).join('\n---\n\n')}`;
	write('llms-full.txt', full);
	const bundles = sections.map((s) => {
		const file = `llms-${s.slug}.txt`;
		const text = `# ${config.name} docs: ${s.label}\n\n> ${s.intro}\n\nSource: ${url(`/docs/${s.slug}/`)}\n\n---\n\n${s.items.map(markdownOf).join('\n---\n\n')}`;
		write(file, text);
		return { label: s.label, file, bytes: Buffer.byteLength(text), pages: s.items.length };
	});
	// The install commands of the home page and llms.txt are the docs' own
	for (const m of INSTALLS) {
		const page = main.pages.find((p) => `/docs/${p.slug}` === m.docs);
		if (!page) {
			problems.push(`src/install.ts: ${m.id} names ${m.docs}, which is not a page`);
			continue;
		}
		const inDocs = blocksOf(page.body, m.lang);
		for (const line of m.lines) if (!inDocs.includes(line)) problems.push(`src/install.ts: "${line}" is not in a ${m.lang} block of ${page.rel}`);
	}
	// The download page's package repository commands are the docs' own; the docs write
	// stable in the line that the page writes with testing while there is no final release
	const repoPage = main.pages.find((p) => p.slug === 'getting-started/connect-a-client');
	const repoBlocks = repoPage ? blocksOf(repoPage.body, 'bash') : [];
	for (const suite of ['stable', 'testing']) {
		for (const line of Object.values(repoCommands(suite)).flat()) {
			if (!repoBlocks.includes(line.replace(' testing main', ' stable main'))) problems.push(`src/download.ts: "${line}" is not in a bash block of content/docs/getting-started/connect-a-client.md`);
		}
	}
	for (const tool of AGENT_TOOLS) {
		if (tool.available && !(tool.docs && main.pages.some((p) => `/docs/${p.slug}` === tool.docs))) problems.push(`src/agents.ts: ${tool.id} is available, but its docs page "${tool.docs ?? ''}" does not exist`);
	}
	write(
		'llms.txt',
		llmsTxt({ bundles, fullBytes: Buffer.byteLength(full), titleOf: (docs) => main.pages.find((p) => `/docs/${p.slug}` === docs)?.title ?? docs, answers: llmsAnswers }) +
			`## Start here\n\n- [Source code](${config.repo}): the repository, with the installers and the changelog\n- [Download the desktop client](${url('/download/')}): the NeoDesk client for Windows, macOS and Linux${client.main ? `, version ${client.main.version}${client.main.prerelease ? ', a release candidate for testing' : ''}` : ''}. The page recommends the file for the visitor's computer and lists every file with its SHA-256.\n\n` +
			sections.map((s) => `## ${s.label}\n\n${s.intro}\n\n${pageList(s.items)}`).join('\n\n') +
			'\n'
	);

	// For search engines: every page in every language, dated by the last commit of its file,
	// a list by the newest of its pages
	const homeUpdated = newest([updatedOf(at('src/home.html')), updatedOf(at('src/home.ts'))]);
	const urls_: [string, string][] = [
		...sites.flatMap((site): [string, string][] => [
			[`${site.locale.prefix}/`, homeUpdated],
			[`${site.locale.prefix}/docs/`, newest(site.pages.map((p) => p.updated))],
			[`${site.locale.prefix}/docs/all/`, newest(site.pages.map((p) => p.updated))],
			...brandPages(site.locale.code, site.locale.prefix, 0).map((b): [string, string] => [`${site.locale.prefix}${b.path}`, newest(b.sources.map((f) => updatedOf(at(f))))]),
			[`${site.locale.prefix}/download/`, newest([updatedOf(at('src/download.ts')), ...(client.main ? [client.main.published] : [])])],
			...SITE_PAGES.map((slug): [string, string] => [`${site.locale.prefix}/${slug}/`, slug === 'releases' ? newest([updatedOf(at('src/pages.ts')), ...(client.main ? [client.main.published] : [])]) : updatedOf(at('src/pages.ts'))]),
			...site.sections.map((s): [string, string] => [`${site.locale.prefix}/docs/${s.slug}/`, newest(s.items.map((p) => p.updated))]),
			...site.reading.map((p): [string, string] => [`${site.locale.prefix}/docs/${p.slug}/`, p.updated])
		])
	];
	// One sitemap per host: the www host's pages in sitemap.xml, the docs in docs/sitemap.xml
	// Each entry names its language versions and x-default, as the page's hreflang links do
	const alternates = (u: string) => {
		const locale = LOCALES.find((l) => l.prefix && (u === `${l.prefix}/` || u.startsWith(`${l.prefix}/`))) ?? DEFAULT_LOCALE;
		const bare = u.slice(locale.prefix.length) || '/';
		const langs = versions(bare);
		if (langs.length < 2) return '';
		const fallback = langs.find((l) => l.default) ?? langs[0];
		return [...langs.map((l) => [l.code, url(`${l.prefix}${bare}`)]), ['x-default', url(`${fallback.prefix}${bare}`)]]
			.map(([code, href]) => `\n    <xhtml:link rel="alternate" hreflang="${code}" href="${href}"/>`)
			.join('');
	};
	const sitemap = (list: [string, string][]) =>
		`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n` +
		list.map(([u, date]) => `  <url><loc>${url(u)}</loc><lastmod>${date}</lastmod>${alternates(u)}\n  </url>`).join('\n') +
		'\n</urlset>\n';
	const isDocs = (u: string) => urls.isDocsFile(urls.distOf(u.slice(1)));
	write('sitemap.xml', sitemap(urls_.filter(([u]) => !isDocs(u))));
	write('docs/sitemap.xml', sitemap(urls_.filter(([u]) => isDocs(u))));
	write('robots.txt', robotsTxt(urls.separate ? [`${SITE_URL}/sitemap.xml`] : [`${SITE_URL}/sitemap.xml`, `${DOCS_URL}/sitemap.xml`]));
	// The docs host's own robots.txt; under /docs on the beta it is just a file
	write('docs/robots.txt', robotsTxt([`${DOCS_URL}/sitemap.xml`]));

	// Checks on what was written
	const checked = { dist: DIST, siteUrl: SITE_URL, urls, version, clientVersion: client.main?.version, production: PRODUCTION, aiCrawlers: config.aiCrawlers };
	problems.push(
		...checkOldNames(checked),
		...checkConsolePort(checked),
		...checkVersion(checked),
		...checkWithoutScripts(checked),
		...checkButtonNames(checked),
		// Accessibility of the markup; a11y-test.ts checks what needs a browser
		...checkSkipLinks(checked),
		...checkHeadingLinks(checked),
		...checkAriaLabels(checked),
		...checkLabelInName(checked),
		...checkTablesAndRegions(checked),
		...checkLinkNames(checked),
		...checkBreadcrumbs(checked),
		...checkIndexing(checked),
		...checkLocales(checked),
		// A sample content folder (DOCS_DIR) has no translations
		...(process.env.DOCS_DIR ? [] : checkTranslations(checked)),
		...checkStructuredData(checked),
		...checkMarkdownLinks(checked),
		...checkSeo(checked),
		...checkPreviews(checked),
		...checkLlms(checked, AGENT_TOOLS.filter((t) => !t.available).map((t) => t.name.replace(/`/g, '')))
	);

	// Record the heading ids of this build, so a later build notices one that goes away.
	// CI only reads the file.
	if (!problems.length && !process.env.DOCS_DIR && !process.env.CI) {
		const next: Record<string, string[]> = { ...recorded };
		for (const page of main.pages) next[page.slug] = [...new Set([...(recorded[page.slug] ?? []), ...page.headings.map((h) => h.id)])];
		const sorted = Object.fromEntries(Object.keys(next).sort().map((k) => [k, next[k]]));
		const text = `${JSON.stringify(sorted, null, '\t')}\n`;
		if (!fs.existsSync(anchorsFile) || read(anchorsFile) !== text) {
			fs.writeFileSync(anchorsFile, text);
			console.log('Recorded the heading ids in content/anchors.json; commit it with the pages.');
		}
	}

	if (problems.length) {
		console.error(`\n${problems.length} problem${problems.length === 1 ? '' : 's'}:\n` + problems.map((p) => `  ${p}`).join('\n'));
		return false;
	}
	const languages = sites.length > 1 ? ` in ${sites.map((s) => s.locale.label).join(' and ')}` : '';
	console.log(`Search index: ${searchSizes.join('; ')}`);
	console.log(`Built ${reading.length} pages in ${sections.length} sections${languages} for ${SITE_URL} (NeoDesk ${version}), drew ${drawn} of ${previews.length} link preview images, in ${Date.now() - started} ms`);
	return true;
}

/* ---------- a small server for looking at dist/ ---------- */

const TYPES: Record<string, string> = {
	'.html': 'text/html; charset=utf-8',
	'.css': 'text/css',
	'.js': 'text/javascript',
	'.json': 'application/json',
	'.md': 'text/markdown; charset=utf-8',
	'.txt': 'text/plain; charset=utf-8',
	'.xml': 'application/xml',
	'.svg': 'image/svg+xml',
	'.png': 'image/png',
	'.webp': 'image/webp',
	'.woff2': 'font/woff2',
	'.ttf': 'font/ttf'
};

function serve(port: number) {
	http
		.createServer((req, res) => {
			const url = decodeURIComponent(new URL(req.url ?? '/', 'http://x').pathname);
			let file = path.join(DIST, url);
			if (!file.startsWith(DIST)) return res.writeHead(403).end();
			if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
				if (!url.endsWith('/')) return res.writeHead(301, { Location: `${url}/` }).end();
				file = path.join(file, 'index.html');
			}
			if (!fs.existsSync(file)) {
				res.writeHead(404, { 'Content-Type': TYPES['.html'] });
				return res.end(fs.readFileSync(path.join(DIST, '404.html')));
			}
			res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] ?? 'application/octet-stream' });
			res.end(fs.readFileSync(file));
		})
		.listen(port, () => console.log(`http://localhost:${port}`));
}

const ok = await build();
if (process.argv.includes('--serve')) serve(SERVE_PORT);
else if (!ok) process.exit(1);
