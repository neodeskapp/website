// Checks that run on the built site in dist/. Each returns a list of problems;
// the build fails when any check finds one.
import fs from 'node:fs';
import path from 'node:path';
import { parse, find, findAll, byTag, isHidden, textOf } from './html.ts';

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
