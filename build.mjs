// Builds the website and the docs into dist/.   node build.mjs [--serve]
// See README.md for the layout and for how a docs page is written.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import config from './site.config.mjs';
import { docsIndexPage, docPage, sectionPage, notFoundPage, esc } from './src/layout.mjs';

const root = path.dirname(fileURLToPath(import.meta.url));
const at = (...p) => path.join(root, ...p);
// DOCS_DIR builds another content folder, for trying the generator on sample pages
const DOCS = process.env.DOCS_DIR ? path.resolve(process.env.DOCS_DIR) : at('content/docs');
const SHOTS = at('content/screenshots');
// DIST_DIR writes the build somewhere else than dist/, for a check that runs next to another build
const DIST = process.env.DIST_DIR ? path.resolve(process.env.DIST_DIR) : at('dist');
const SITE_URL = (process.env.SITE_URL || config.url).replace(/\/$/, '');
const problems = [];

/* ---------- small helpers ---------- */

const read = (file) => fs.readFileSync(file, 'utf8').replace(/\r\n?/g, '\n');
function write(rel, data) {
	const file = path.join(DIST, rel);
	fs.mkdirSync(path.dirname(file), { recursive: true });
	fs.writeFileSync(file, data);
}
function copyDir(from, to) {
	if (!fs.existsSync(from)) return;
	fs.mkdirSync(to, { recursive: true });
	for (const e of fs.readdirSync(from, { withFileTypes: true })) {
		if (e.isDirectory()) copyDir(path.join(from, e.name), path.join(to, e.name));
		else fs.copyFileSync(path.join(from, e.name), path.join(to, e.name));
	}
}
const hashOf = (data) => crypto.createHash('sha256').update(data).digest('hex').slice(0, 10);
/** A PNG's width and height, from its IHDR chunk. */
function pngSize(file) {
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
function slugify(text) {
	return text
		.toLowerCase()
		.trim()
		.replace(/[^\p{L}\p{N}\s_-]/gu, '')
		.replace(/\s/g, '-');
}
function slugger() {
	const seen = new Map();
	return (text) => {
		const base = slugify(text) || 'section';
		const n = seen.get(base) ?? 0;
		seen.set(base, n + 1);
		return n ? `${base}-${n}` : base;
	};
}

async function currentVersion() {
	if (process.env.BD_VERSION) return process.env.BD_VERSION.trim();
	try {
		const res = await fetch(config.versionUrl, { signal: AbortSignal.timeout(5000) });
		const text = (await res.text()).trim();
		if (res.ok && /^\d+\.\d+\.\d+/.test(text)) return text;
	} catch {
		/* offline: use the version in the config */
	}
	return config.version;
}

/** The last commit that changed a file, when the content is in a git repository. */
function updatedOf(file) {
	try {
		const out = execFileSync('git', ['log', '-1', '--format=%cI', '--', file], {
			cwd: path.dirname(file),
			stdio: ['ignore', 'pipe', 'ignore']
		})
			.toString()
			.trim();
		return out || null;
	} catch {
		return null;
	}
}

/* ---------- loading the pages ---------- */

function frontMatter(source, file) {
	const m = source.match(/^---\n([\s\S]*?)\n---\n?/);
	if (!m) {
		problems.push(`${file}: no front matter`);
		return { data: {}, body: source };
	}
	const data = {};
	for (const line of m[1].split('\n')) {
		const kv = line.match(/^([A-Za-z]+):\s*(.*)$/);
		if (!kv) continue;
		let value = kv[2].trim();
		if (/^(".*"|'.*')$/.test(value)) value = value.slice(1, -1);
		data[kv[1]] = value;
	}
	return { data, body: source.slice(m[0].length) };
}

function loadPages(version) {
	const pages = [];
	const add = (file, slug, section, parent) => {
		const rel = path.relative(root, file).replace(/\\/g, '/');
		const { data, body } = frontMatter(read(file).replaceAll('{{VERSION}}', version), rel);
		if (!data.title) problems.push(`${rel}: no title`);
		if (!data.description) problems.push(`${rel}: no description`);
		if (/^# /m.test(body.replace(/```[\s\S]*?```/g, ''))) problems.push(`${rel}: the body has a "# " heading; the title is the h1`);
		pages.push({
			file,
			rel,
			slug,
			section,
			parent,
			title: data.title ?? slug,
			description: data.description ?? '',
			order: Number(data.order ?? 99),
			body: body.trim() + '\n',
			updated: updatedOf(file)
		});
	};
	for (const s of fs.readdirSync(DOCS, { withFileTypes: true })) {
		if (!s.isDirectory()) continue;
		if (!config.sections.some((c) => c.slug === s.name)) problems.push(`content/docs/${s.name}: not listed in site.config.mjs`);
		const dir = path.join(DOCS, s.name);
		for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
			if (e.isFile() && e.name.endsWith('.md')) add(path.join(dir, e.name), `${s.name}/${e.name.slice(0, -3)}`, s.name);
			else if (e.isDirectory()) {
				for (const c of fs.readdirSync(path.join(dir, e.name))) {
					if (c.endsWith('.md')) add(path.join(dir, e.name, c), `${s.name}/${e.name}/${c.slice(0, -3)}`, s.name, `${s.name}/${e.name}`);
				}
			}
		}
	}
	return pages;
}

/** A section's pages as the sidebar shows them: top-level pages by order, each followed by its children. */
function inSidebarOrder(items) {
	const byOrder = (a, b) => a.order - b.order || a.title.localeCompare(b.title);
	const top = items.filter((i) => !i.parent).sort(byOrder);
	const ordered = top.flatMap((p) => [p, ...items.filter((c) => c.parent === p.slug).sort(byOrder)]);
	const orphans = items.filter((i) => i.parent && !top.some((p) => p.slug === i.parent)).sort(byOrder);
	return [...ordered, ...orphans];
}

/* ---------- Markdown ---------- */

const LANG = { sh: 'bash', shell: 'bash', ps1: 'powershell', yml: 'yaml', conf: 'nginx', env: 'ini', text: 'plaintext', txt: 'plaintext' };

function makeMarkdown(page, usedShots) {
	const md = new MarkdownIt({ html: true, linkify: false, typographer: false });
	const slug = slugger();
	page.headings = [];
	page.links = [];

	// ::: note / ::: warning blocks
	md.block.ruler.before('fence', 'note', (state, start, end, silent) => {
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
		state.parentType = 'note';
		state.md.block.tokenize(state, start + 1, close);
		state.lineMax = oldMax;
		state.parentType = oldParent;
		state.push('note_close', 'div', -1);
		state.line = close + 1;
		return true;
	});
	md.renderer.rules.note_open = (tokens, i) =>
		`<div class="note note-${tokens[i].meta}" role="note"><p class="note-label">${tokens[i].meta === 'warning' ? 'Warning' : 'Note'}</p>\n`;

	// Heading ids, the "On this page" list, and a link on each heading
	md.core.ruler.push('headings', (state) => {
		const t = state.tokens;
		for (let i = 0; i < t.length; i++) {
			if (t[i].type !== 'heading_open') continue;
			const level = Number(t[i].tag.slice(1));
			const inline = t[i + 1];
			const text = inline.children.filter((c) => c.type === 'text' || c.type === 'code_inline').map((c) => c.content).join('');
			if (level === 1) continue;
			const id = slug(text);
			t[i].attrSet('id', id);
			page.headings.push({ level, id, text, line: t[i].map?.[0] ?? 0 });
			const a = new state.Token('link_open', 'a', 1);
			a.attrSet('href', `#${id}`);
			a.attrSet('class', 'anchor');
			a.meta = { anchor: true };
			inline.children.unshift(a);
			inline.children.push(new state.Token('link_close', 'a', -1));
		}
	});

	// Links: checked after every page is rendered; docs links get a trailing slash; outside links open safely
	const defaultLinkOpen = md.renderer.rules.link_open ?? ((tokens, i, opts, env, self) => self.renderToken(tokens, i, opts));
	md.renderer.rules.link_open = (tokens, i, opts, env, self) => {
		const token = tokens[i];
		const href = token.attrGet('href') ?? '';
		if (!token.meta?.anchor) {
			page.links.push(href);
			if (/^https?:\/\//.test(href)) token.attrSet('rel', 'noopener');
			else if (href.startsWith('/docs')) token.attrSet('href', docHref(href));
		}
		return defaultLinkOpen(tokens, i, opts, env, self);
	};

	// ![alt](shot:name) is a console screenshot in the reader's theme
	const defaultImage = md.renderer.rules.image;
	md.renderer.rules.image = (tokens, i, opts, env, self) => {
		const token = tokens[i];
		const src = token.attrGet('src') ?? '';
		const alt = self.renderInlineAsText(token.children, opts, env);
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
			`<source media="(prefers-color-scheme: dark)" srcset="/docs/shots/${name}-dark.png">` +
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
			if (lang && lang !== 'plaintext') problems.push(`${page.rel}: unknown code language "${info}"`);
			html = esc(code);
		}
		if (!info) problems.push(`${page.rel}: a code block has no language (line ${(token.map?.[0] ?? 0) + 1})`);
		const output = lang === 'plaintext';
		return (
			`<div class="code${output ? ' code-output' : ''}">` +
			(output ? '' : '<button type="button" class="copy" aria-label="Copy this code">Copy</button>') +
			`<pre tabindex="0"><code>${html}</code></pre></div>\n`
		);
	};

	md.renderer.rules.table_open = () => '<div class="table-wrap" tabindex="0"><table>\n';
	md.renderer.rules.table_close = () => '</table></div>\n';
	return md;
}

/** A docs address as the site serves it: /docs/a/b/ with its anchor kept. */
function docHref(href) {
	const [p, hash] = href.split('#');
	const clean = p.replace(/\/$/, '');
	return `${clean}/${hash ? `#${hash}` : ''}`;
}

/* ---------- plain text for search ---------- */

function plain(markdown) {
	return markdown
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

/** One entry for the page and one for each ## section, so a result can link to the heading. */
function searchEntries(page, sectionLabel) {
	const lines = page.body.split('\n');
	const h2 = page.headings.filter((h) => h.level === 2);
	const entries = [
		{ t: page.title, s: sectionLabel, u: `/docs/${page.slug}/`, d: page.description, x: plain(lines.slice(0, h2[0]?.line ?? lines.length).join('\n')) }
	];
	h2.forEach((h, i) => {
		const body = lines.slice(h.line + 1, h2[i + 1]?.line ?? lines.length).join('\n');
		entries.push({ t: page.title, s: sectionLabel, u: `/docs/${page.slug}/#${h.id}`, h: h.text, x: plain(body) });
	});
	return entries;
}

/* ---------- Markdown copies for AI tools ---------- */

const mdUrl = (slug) => `${SITE_URL}/docs/${slug}.md`;

/** A page's body as plain Markdown: notes become quotes, screenshots plain images, site links absolute. */
function agentMarkdown(body) {
	const out = [];
	let fence = null;
	let note = null;
	for (const line of body.split('\n')) {
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
		const open = line.match(/^:::\s*(note|warning)\s*$/);
		if (open) {
			note = open[1];
			out.push(`> **${note === 'warning' ? 'Warning' : 'Note'}:**`);
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
							.replace(/\]\((\/docs\/[^)#\s]+?)\/?(#[^)\s]*)?\)/g, (_, p, hash) => `](${SITE_URL}${p}.md${hash ?? ''})`)
							.replace(/\]\((\/[^)\s]*)\)/g, (_, p) => `](${SITE_URL}${p})`)
			)
			.join('');
		out.push(note ? `> ${rewritten}`.trimEnd() : rewritten);
	}
	return out.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

function pageMarkdown(page) {
	const head = [`# ${page.title}`, `Source: ${SITE_URL}/docs/${page.slug}/${page.updated ? `\nLast updated: ${page.updated.slice(0, 10)}` : ''}`];
	if (page.description) head.push(`> ${page.description}`);
	return `${head.join('\n\n')}\n\n${agentMarkdown(page.body)}`;
}

const pageList = (items) =>
	items.map((p) => `${p.parent ? '  ' : ''}- [${p.title}](${mdUrl(p.slug)})${p.description ? `: ${p.description}` : ''}`).join('\n');

/* ---------- the build ---------- */

async function build() {
	const started = Date.now();
	problems.length = 0;
	const version = await currentVersion();
	const pages = loadPages(version);
	const sections = config.sections
		.map((s) => ({ ...s, items: inSidebarOrder(pages.filter((p) => p.section === s.slug)) }))
		.filter((s) => s.items.length);
	const reading = sections.flatMap((s) => s.items);
	const labelOf = (slug) => sections.find((s) => s.slug === slug)?.label ?? slug;

	fs.rmSync(DIST, { recursive: true, force: true });
	copyDir(at('public'), DIST);

	// Styles and scripts, with a hash in the address so a new build is never served from cache
	const assets = {};
	for (const name of ['site.css', 'docs.css', 'docs.js']) {
		const data = fs.readFileSync(at('src', name));
		assets[name] = `/assets/${name}?v=${hashOf(data)}`;
		write(`assets/${name}`, data);
	}

	// Render every page
	const usedShots = new Set();
	for (const page of pages) page.html = makeMarkdown(page, usedShots).render(page.body);

	// Check every link between pages
	const known = new Map(pages.map((p) => [`/docs/${p.slug}`, p]));
	for (const page of pages) {
		for (const href of page.links) {
			if (/^(https?:|mailto:)/.test(href)) continue;
			const [p, hash] = href.split('#');
			if (!p) {
				if (!page.headings.some((h) => h.id === hash)) problems.push(`${page.rel}: no heading "#${hash}" on this page`);
				continue;
			}
			const target = p.replace(/\/$/, '');
			if (target === '' || target === '/docs' || sections.some((s) => `/docs/${s.slug}` === target)) continue;
			if (p.endsWith('.md')) problems.push(`${page.rel}: link "${href}" should not end in .md`);
			const to = known.get(target);
			if (!to) problems.push(`${page.rel}: link to "${href}", which is not a page`);
			else if (hash && !to.headings.some((h) => h.id === hash)) problems.push(`${page.rel}: "${href}": no heading "#${hash}" on that page`);
		}
	}

	const shared = { config, sections, assets, version, siteUrl: SITE_URL };
	const search = [];

	reading.forEach((page, i) => {
		const prev = reading[i - 1] ?? null;
		const next = reading[i + 1] ?? null;
		const pager = (word, other) => (other ? { label: other.section === page.section ? word : `${word} in ${labelOf(other.section)}`, title: other.title, href: `/docs/${other.slug}/` } : null);
		write(
			`docs/${page.slug}/index.html`,
			docPage({ ...shared, page, sectionLabel: labelOf(page.section), prev: pager('Previous', prev), next: pager('Next', next) })
		);
		write(`docs/${page.slug}.md`, pageMarkdown(page));
		search.push(...searchEntries(page, labelOf(page.section)));
	});

	for (const section of sections) {
		write(`docs/${section.slug}/index.html`, sectionPage({ ...shared, section }));
		write(`docs/${section.slug}.md`, `# ${section.label}\n\nSource: ${SITE_URL}/docs/${section.slug}/\n\n${section.intro}\n\n${pageList(section.items)}\n`);
	}
	write('docs/index.html', docsIndexPage(shared));
	write('docs/search.json', JSON.stringify(search));
	write('404.html', notFoundPage(shared));
	for (const name of usedShots) {
		for (const theme of ['dark', 'light']) {
			fs.mkdirSync(path.join(DIST, 'docs/shots'), { recursive: true });
			fs.copyFileSync(path.join(SHOTS, `${name}-${theme}.png`), path.join(DIST, 'docs/shots', `${name}-${theme}.png`));
		}
	}

	// The landing page
	write('index.html', read(at('src/home.html')).replaceAll('{{VERSION}}', version).replaceAll('{{SITE_URL}}', SITE_URL));

	// For AI tools: llms.txt lists every page, llms-full.txt holds them all
	const about = `# ${config.name}\n\n> ${config.summary}\n\nEvery docs page below is Markdown at the address shown. The same page as HTML is at that address without .md. All docs in one file: ${SITE_URL}/llms-full.txt`;
	write(
		'llms.txt',
		`${about}\n\n## Start here\n\n- [Source code](${config.repo}): the repository, with the installers and the changelog\n\n` +
			sections.map((s) => `## ${s.label}\n\n${s.intro}\n\n${pageList(s.items)}`).join('\n\n') +
			'\n'
	);
	write('llms-full.txt', `${about}\n\n---\n\n${reading.map(pageMarkdown).join('\n---\n\n')}`);

	// For search engines
	const urls = ['/', '/docs/', ...sections.map((s) => `/docs/${s.slug}/`), ...reading.map((p) => `/docs/${p.slug}/`)];
	write(
		'sitemap.xml',
		`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
			urls.map((u) => `  <url><loc>${SITE_URL}${u}</loc></url>`).join('\n') +
			'\n</urlset>\n'
	);
	write('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);

	if (problems.length) {
		console.error(`\n${problems.length} problem${problems.length === 1 ? '' : 's'}:\n` + problems.map((p) => `  ${p}`).join('\n'));
		return false;
	}
	console.log(`Built ${reading.length} pages in ${sections.length} sections for ${SITE_URL} (BetterDesk ${version}) in ${Date.now() - started} ms`);
	return true;
}

/* ---------- a small server for looking at dist/ ---------- */

const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.md': 'text/markdown; charset=utf-8', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.ttf': 'font/ttf' };

function serve(port) {
	http
		.createServer((req, res) => {
			const url = decodeURIComponent(new URL(req.url, 'http://x').pathname);
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
