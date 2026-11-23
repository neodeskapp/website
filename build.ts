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
import { docsIndexPage, docPage, sectionPage, notFoundPage, contactSheetPage, hreflangLinks, languageSwitch, socialTags, esc } from './src/layout.ts';
import type { PreviewItem } from './src/layout.ts';
import { render as renderPreview } from './src/og.ts';
import type { OgData, OgTemplate } from './src/og.ts';
import type { Page, Section, Shared, Pager } from './src/types.ts';
import { LOCALES, DEFAULT_LOCALE, missingStrings, stringsOf, fill } from './src/i18n.ts';
import type { Locale, Strings } from './src/i18n.ts';
import { checkOldNames, checkConsolePort, checkVersion, checkWithoutScripts, checkButtonNames, checkIndexing, checkLocales, checkTranslations, checkLlms, checkStructuredData, checkMarkdownLinks, checkSeo, checkPreviews } from './src/checks.ts';
import { checkCommands } from './src/commands.ts';
import { AGENT_TOOLS } from './src/agents.ts';
import { INSTALLS, blocksOf, clientPorts, protocolsOf, PORTS_PAGE } from './src/install.ts';
import { missingHomeStrings, homeStringsOf } from './src/home.ts';
import type { HomeStrings } from './src/home.ts';

const root = path.dirname(fileURLToPath(import.meta.url));
const at = (...p: string[]) => path.join(root, ...p);
// DOCS_DIR builds another content folder, for trying the generator on sample pages
const DOCS = process.env.DOCS_DIR ? path.resolve(process.env.DOCS_DIR) : at('content/docs');
const SHOTS = at('content/screenshots');
// Converted images and rendered link previews, kept between builds; safe to delete
const CACHE = at('.cache');
// DIST_DIR writes the build somewhere else than dist/, for a check that runs next to another build
const DIST = process.env.DIST_DIR ? path.resolve(process.env.DIST_DIR) : at('dist');
const SITE_URL = (process.env.SITE_URL || config.url).replace(/\/$/, '');
// Only the production address may be indexed; a build for any other host, such as the beta, says noindex
const PRODUCTION = SITE_URL === config.url.replace(/\/$/, '');
const problems: string[] = [];

/* ---------- small helpers ---------- */

const read = (file: string) => fs.readFileSync(file, 'utf8').replace(/\r\n?/g, '\n');
function write(rel: string, data: string | Buffer) {
	const file = path.join(DIST, rel);
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
/** A heading line of Markdown that ends in an attribute block: "## Title {#id alias=old-id}". */
const ATTR = String.raw`(?:#[a-z0-9][\w-]*|alias=[\w-]+(?:,[\w-]+)*)`;
const HEADING_ATTRS_LINE = new RegExp(String.raw`^(#{2,6} .*?)\s*\{${ATTR}(?:\s+${ATTR})*\}\s*$`, 'gm');

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
		const res = await fetch(config.versionUrl, { signal: AbortSignal.timeout(5000) });
		const text = (await res.text()).trim();
		if (res.ok && /^\d+\.\d+\.\d+/.test(text)) return text;
	} catch {
		/* offline: use the version in the config */
	}
	console.warn(`Could not read ${config.versionUrl}; building for version ${config.version} from site.config.ts. Set ND_VERSION to choose one.`);
	return config.version;
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
			release: data.release,
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

	// Heading ids, the "On this page" list, and a link on each heading. A heading may end
	// in {#id} to fix its id and {alias=old-id} to keep an old id working after a rename.
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
			t[i].meta = { aliases: attrs.aliases };
			page.headings.push({ level, id, aliases: attrs.aliases, text, line: t[i].map?.[0] ?? 0 });
			const a = new state.Token('link_open', 'a', 1);
			a.attrSet('href', `#${id}`);
			a.attrSet('class', 'anchor');
			a.meta = { anchor: true };
			children.unshift(a);
			children.push(new state.Token('link_close', 'a', -1));
		}
	});

	// Links: checked after every page is rendered; docs links get a trailing slash; outside links open safely
	const defaultLinkOpen: RendererRule =
		md.renderer.rules.link_open ?? ((tokens, i, opts, env, self) => self.renderToken(tokens, i, opts));
	md.renderer.rules.link_open = (tokens, i, opts, env, self) => {
		const token = tokens[i];
		const href = token.attrGet('href') ?? '';
		if (!token.meta?.anchor) {
			page.links.push(href);
			if (/^https?:\/\//.test(href)) token.attrSet('rel', 'noopener');
			else if (href.startsWith('/docs')) token.attrSet('href', linkTo(href));
		}
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
		return (
			`<a class="shot" href="/docs/shots/${name}-light.png" data-dark="/docs/shots/${name}-dark.png"><picture>` +
			`<source media="(prefers-color-scheme: dark)" type="image/webp" srcset="/docs/shots/${name}-dark.webp">` +
			`<source media="(prefers-color-scheme: dark)" srcset="/docs/shots/${name}-dark.png">` +
			`<source type="image/webp" srcset="/docs/shots/${name}-light.webp">` +
			`<img src="/docs/shots/${name}-light.png" alt="${esc(alt)}" width="${width}" height="${height}" loading="lazy" decoding="async"></picture></a>`
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
			(output ? '' : `<button type="button" class="copy" aria-label="${esc(t.copyCode)}" data-copied="${esc(t.copied)}">${esc(t.copy)}</button>`) +
			`<pre tabindex="0"><code>${html}</code></pre></div>\n`
		);
	};

	// Commands can be copied as they are; see src/commands.ts
	md.core.ruler.push('commands', (state: StateCore) => {
		for (const p of checkCommands(state.tokens)) problems.push(`${page.rel}:${p.line + page.bodyLine - 1}: ${p.message}`);
	});

	// The old ids of a renamed heading, as empty targets right before it
	md.renderer.rules.heading_open = (tokens, i, opts, env, self) =>
		(tokens[i].meta?.aliases ?? []).map((a: string) => `<span id="${esc(a)}" class="anchor-alias"></span>`).join('') + self.renderToken(tokens, i, opts);

	md.renderer.rules.table_open = () => '<div class="table-wrap" tabindex="0"><table>\n';
	md.renderer.rules.table_close = () => '</table></div>\n';
	return md;
}

/** A docs address as the site serves it: /docs/a/b/ with its anchor kept. */
function docHref(href: string) {
	const [p, hash] = href.split('#');
	const clean = p.replace(/\/$/, '');
	return `${clean}/${hash ? `#${hash}` : ''}`;
}

/* ---------- plain text for search ---------- */

function plain(markdown: string) {
	return markdown
		.replace(HEADING_ATTRS_LINE, '$1')
		.replace(/^:::.*$/gm, '')
		.replace(/^```.*$/gm, '')
		.replace(/!\[([^\]]*)\]\([^)]*\)/g, '')
		.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
		.replace(/^#{1,6}\s+/gm, '')
		.replace(/\*\*(.+?)\*\*/g, '$1')
		.replace(/(^|\W)\*(\S.*?)\*(?=\W|$)/g, '$1$2')
		.replace(/`([^`]+)`/g, '$1')
		.replace(/^\s*[-*+]\s+/gm, '')
		.replace(/^\s*\d+\.\s+/gm, '')
		.replace(/^\|?[\s:|-]+\|?$/gm, '')
		.replace(/\|/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}

interface SearchEntry {
	t: string;
	s: string;
	u: string;
	d?: string;
	h?: string;
	x: string;
}

/** One entry for the page and one for each ## section, so a result can link to the heading. */
function searchEntries(page: Page, sectionLabel: string, prefix: string): SearchEntry[] {
	const lines = page.body.split('\n');
	const h2 = page.headings.filter((h) => h.level === 2);
	const entries: SearchEntry[] = [
		{ t: page.title, s: sectionLabel, u: `${prefix}/docs/${page.slug}/`, d: page.description, x: plain(lines.slice(0, h2[0]?.line ?? lines.length).join('\n')) }
	];
	h2.forEach((h, i) => {
		const body = lines.slice(h.line + 1, h2[i + 1]?.line ?? lines.length).join('\n');
		entries.push({ t: page.title, s: sectionLabel, u: `${prefix}/docs/${page.slug}/#${h.id}`, h: h.text, x: plain(body) });
	});
	return entries;
}

/* ---------- Markdown copies for AI tools ---------- */

const mdUrl = (slug: string, prefix = '') => `${SITE_URL}${prefix}/docs/${slug}.md`;

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
							.replace(/!\[([^\]]*)\]\(shot:([\w-]+)\)/g, (_, alt, name) => `![${alt}](${SITE_URL}/docs/shots/${name}-light.png)`)
							.replace(/\]\((\/docs\/[^)#\s]+?)\/?(#[^)\s]*)?\)/g, (_, p, hash) => `](${SITE_URL}${linkTo(p).replace(/\/$/, '')}.md${hash ?? ''})`)
							.replace(/\]\((\/[^)\s]*)\)/g, (_, p) => `](${SITE_URL}${p})`)
			)
			.join('');
		out.push(note ? `> ${rewritten}`.trimEnd() : rewritten);
	}
	return out.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

function pageMarkdown(page: Page, locale: Locale, t: Strings, linkTo: (href: string) => string) {
	const head = [`# ${page.title}`, `${t.source}: ${SITE_URL}${locale.prefix}/docs/${page.slug}/${page.updated ? `\n${t.lastUpdated}: ${page.updated.slice(0, 10)}` : ''}`];
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
			`        <p class="body install-note" data-os="${m.id}"><b class="os-label">${esc(m.tab)}: </b>${esc(m.note[locale.code])} ${fill(h.docsPageHas, { href: `${locale.prefix}${m.docs}/` })}</p>`
	).join('\n');
	const panels = INSTALLS.map(
		(m) => `        <div class="term" role="tabpanel" id="install-${m.id}" aria-labelledby="tab-${m.id}" data-os="${m.id}">
          <div class="term-bar"><span class="term-os">${esc(m.tab)}</span><button type="button" class="term-copy" aria-label="${esc(fill(h.copyCommands, { os: m.tab }))}">${esc(h.copy)}</button></div>
          <pre class="term-lines" tabindex="0" aria-label="${esc(fill(h.commands, { os: m.tab }))}">${m.lines.map((l) => `<code>${esc(l)}</code>`).join('\n')}</pre>
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
function llmsTxt({ bundles, fullBytes, titleOf }: { bundles: { label: string; file: string; bytes: number; pages: number }[]; fullBytes: number; titleOf: (docs: string) => string }) {
	const installs = INSTALLS.filter((i) => i.oneLine)
		.map((i) => `- ${i.oneLine}. See [${titleOf(i.docs)}](${SITE_URL}${i.docs}.md).\n\n  \`\`\`${i.lang}\n  ${i.lines[0]}\n  \`\`\``)
		.join('\n\n');
	const tools = AGENT_TOOLS.filter((t) => t.available).map((t) => `- ${t.name}: ${t.summary} See [the docs](${SITE_URL}${t.docs}.md).`);
	return [
		`# ${config.name}`,
		`> ${config.summary}`,
		'## For AI agents',
		`Install NeoDesk on a server with one command:\n\n${installs}`,
		'Both print the address of the web console and the admin password at the end. In the docs every command is in a fenced block with its language, placeholders look like `<server-address>`, and the text next to a block says what to put in.',
		...(tools.length ? [`Tools for agents:\n\n${tools.join('\n')}`] : []),
		'## Docs as text',
		'Every docs page below is Markdown at the address shown. The same page as HTML is at that address without .md. The docs of one section are also in one file:',
		[...bundles.map((b) => `- [${b.label}](${SITE_URL}/${b.file}): ${kb(b.bytes)}, ${b.pages} page${b.pages === 1 ? '' : 's'}`), `- [All docs](${SITE_URL}/llms-full.txt): ${kb(fullBytes)}`].join('\n'),
		''
	].join('\n\n');
}

/* ---------- robots.txt ---------- */

/** Everything is allowed; on production the AI crawlers are also named, so their access is explicit. */
function robotsTxt() {
	const groups = ['User-agent: *\nAllow: /'];
	if (PRODUCTION) groups.push(`# AI crawlers, allowed by name\n${config.aiCrawlers.map((a) => `User-agent: ${a}`).join('\n')}\nAllow: /`);
	return `${groups.join('\n\n')}\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
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
	const version = await currentVersion();

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

	// Which languages have a page at each address
	const available = new Map<string, Locale[]>();
	const offer = (p: string, l: Locale) => available.set(p, [...(available.get(p) ?? []), l]);
	for (const site of sites) {
		offer('/', site.locale);
		offer('/docs/', site.locale);
		for (const s of site.sections) offer(`/docs/${s.slug}/`, site.locale);
		for (const p of site.pages) offer(`/docs/${p.slug}/`, site.locale);
	}
	const versions = (p: string) => available.get(p) ?? [];
	// A docs link from a page: to the page in the same language when there is one, else to the default language's
	const linkIn = (locale: Locale) => (href: string) => {
		const clean = docHref(href);
		return versions(clean.split('#')[0]).some((l) => l.code === locale.code) ? `${locale.prefix}${clean}` : clean;
	};

	fs.rmSync(DIST, { recursive: true, force: true });
	copyDir(at('public'), DIST);

	// Styles and scripts, with a hash in the address so a new build is never served from cache
	const assets: Record<string, string> = {};
	for (const name of ['site.css', 'docs.css', 'docs.js']) {
		const data = fs.readFileSync(at('src', name));
		assets[name] = `/assets/${name}?v=${hashOf(data)}`;
		write(`assets/${name}`, data);
	}

	// Render every page
	const usedShots = new Set<string>();
	for (const site of sites) for (const page of site.pages) page.html = makeMarkdown(page, usedShots, site.t, linkIn(site.locale)).render(page.body);

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
		const shared: Shared = { config, sections: site.sections, assets, version, siteUrl: SITE_URL, production: PRODUCTION, locale, t, versions, previewOf };
		// Files of another language go under its prefix: de/docs/...
		const out = (file: string) => `${locale.prefix.replace(/^\//, '')}${locale.prefix ? '/' : ''}${file}`;
		const labelOf = (slug: string) => site.sections.find((s) => s.slug === slug)?.label ?? slug;
		const linkTo = linkIn(locale);
		site.reading.forEach((page, i) => {
			const pager = (word: string, wordIn: string, other: Page | undefined): Pager | null =>
				other
					? { label: other.section === page.section ? word : fill(wordIn, { section: labelOf(other.section) }), title: other.title, href: `${locale.prefix}/docs/${other.slug}/` }
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
		write(out('docs/search.json'), JSON.stringify(site.reading.flatMap((page) => searchEntries(page, labelOf(page.section), locale.prefix))));
		for (const section of site.sections) {
			write(out(`docs/${section.slug}/index.html`), sectionPage({ ...shared, section }));
			write(
				out(`docs/${section.slug}.md`),
				`# ${section.label}\n\n${t.source}: ${SITE_URL}${locale.prefix}/docs/${section.slug}/\n\n${section.intro}\n\n${pageList(section.items, locale.prefix)}\n`
			);
		}
		write(out('docs/index.html'), docsIndexPage(shared));
		// The web server sends 404.html for an address that does not exist; another
		// language's 404 page needs a rule of its own there, such as one for /de/
		write(out('404.html'), notFoundPage(shared));
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

	// The home page of every language: the layout from src/home.html, the words from src/home.ts
	// The ports clients need, from the table on the ports page
	const ports = clientPorts(main.pages.find((p) => p.slug === PORTS_PAGE)?.body ?? '');
	if (!ports.length) problems.push(`src/home.html: no client ports found in the table of content/docs/${PORTS_PAGE}.md`);
	const homeTemplate = withWebp(read(at('src/home.html')));
	for (const site of sites) {
		const { locale } = site;
		const h = homeStringsOf(locale.code);
		const home = { siteUrl: SITE_URL, versions, locale, t: site.t };
		// Which ports comes from the default language's table, how the protocol is written from this language's
		const protocols = protocolsOf(site.pages.find((p) => p.slug === PORTS_PAGE)?.body ?? '');
		const portList = ports
			// Plain TCP goes without saying; a port that also takes UDP says so
			.map((p) => `<span class="mono lime">${esc(p.port)}</span>${/UDP/.test(p.protocol) ? ` (${esc(protocols.get(p.port) ?? p.protocol)})` : ''}`)
			.join(', ')
			.replace(/, ([^,]*)$/, ` ${h.and} $1`);
		const software = {
			'@context': 'https://schema.org',
			'@type': 'SoftwareApplication',
			name: config.name,
			description: locale.default ? config.summary : h.summary,
			url: `${SITE_URL}${locale.prefix}/`,
			applicationCategory: 'UtilitiesApplication',
			operatingSystem: 'Linux, Windows',
			softwareVersion: version,
			license: config.license,
			downloadUrl: config.downloadUrl,
			isAccessibleForFree: true
		};
		const { tabs, panels } = installMarkup(locale, h);
		const page = homeTemplate
			.replace(/\{\{t:(\w+)\}\}/g, (m, key: keyof HomeStrings) => h[key] ?? m)
			.replace('{{CLIENT_PORTS}}', portList)
			.replace('{{INSTALL_TABS}}', tabs)
			.replace('{{INSTALL_PANELS}}', panels)
			.replace(
				'{{SOCIAL}}',
				socialTags({ type: 'website', siteName: config.name, title: h.title, description: h.description, url: `${SITE_URL}${locale.prefix}/`, locale: locale.ogLocale, image: previewOf(`${locale.prefix}/`) })
			)
			.replace('{{JSONLD}}', `<script type="application/ld+json">${JSON.stringify(software).replace(/</g, '\\u003c')}</script>`)
			.replace('{{LANG}}', locale.code)
			.replaceAll('{{PREFIX}}', locale.prefix)
			.replaceAll('{{VERSION}}', version)
			.replaceAll('{{SITE_URL}}', SITE_URL)
			.replace('{{ROBOTS}}', PRODUCTION ? '' : '<meta name="robots" content="noindex">\n')
			.replace('{{HREFLANG}}', hreflangLinks(home, '/'))
			.replace(/^ *\{\{LANGUAGES\}\}\n/m, languageSwitch(home, '/') ? `    ${languageSwitch(home, '/')}\n` : '');
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
		const text = `# ${config.name} docs: ${s.label}\n\n> ${s.intro}\n\nSource: ${SITE_URL}/docs/${s.slug}/\n\n---\n\n${s.items.map(markdownOf).join('\n---\n\n')}`;
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
	for (const tool of AGENT_TOOLS) {
		if (tool.available && !(tool.docs && main.pages.some((p) => `/docs/${p.slug}` === tool.docs))) problems.push(`src/agents.ts: ${tool.id} is available, but its docs page "${tool.docs ?? ''}" does not exist`);
	}
	write(
		'llms.txt',
		llmsTxt({ bundles, fullBytes: Buffer.byteLength(full), titleOf: (docs) => main.pages.find((p) => `/docs/${p.slug}` === docs)?.title ?? docs }) +
			`## Start here\n\n- [Source code](${config.repo}): the repository, with the installers and the changelog\n\n` +
			sections.map((s) => `## ${s.label}\n\n${s.intro}\n\n${pageList(s.items)}`).join('\n\n') +
			'\n'
	);

	// For search engines: every page in every language, dated by the last commit of its file,
	// a list by the newest of its pages
	const homeUpdated = newest([updatedOf(at('src/home.html')), updatedOf(at('src/home.ts'))]);
	const urls: [string, string][] = [
		...sites.flatMap((site): [string, string][] => [
			[`${site.locale.prefix}/`, homeUpdated],
			[`${site.locale.prefix}/docs/`, newest(site.pages.map((p) => p.updated))],
			...site.sections.map((s): [string, string] => [`${site.locale.prefix}/docs/${s.slug}/`, newest(s.items.map((p) => p.updated))]),
			...site.reading.map((p): [string, string] => [`${site.locale.prefix}/docs/${p.slug}/`, p.updated])
		])
	];
	write(
		'sitemap.xml',
		`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
			urls.map(([u, date]) => `  <url><loc>${SITE_URL}${u}</loc><lastmod>${date}</lastmod></url>`).join('\n') +
			'\n</urlset>\n'
	);
	write('robots.txt', robotsTxt());

	// Checks on what was written
	const checked = { dist: DIST, siteUrl: SITE_URL, version, production: PRODUCTION, aiCrawlers: config.aiCrawlers };
	problems.push(
		...checkOldNames(checked),
		...checkConsolePort(checked),
		...checkVersion(checked),
		...checkWithoutScripts(checked),
		...checkButtonNames(checked),
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
if (process.argv.includes('--serve')) serve(Number(process.env.PORT) || 4173);
else if (!ok) process.exit(1);
