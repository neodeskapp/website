// The search index of the docs, one per language, and its check.
//
// The index is built at build time and loaded the first time a reader opens search.
// It holds every page (title, section, description and the words on the page), every
// ## and ### heading, every command of the command reference with its flags, and every
// setting and flag the docs list in a table (an environment variable such as
// `RELAY_SERVERS`, or an option such as `--domain`). docs.js searches it in the
// browser; there is no server and no outside service behind it.
//
// The file is JSON in arrays, to stay small, and written twice: search.json, and
// search.json.gz, which browsers with DecompressionStream load instead.
import zlib from 'node:zlib';
import type { Page } from './types.ts';

/** A heading line of Markdown that ends in an attribute block: "## Title {#id alias=old-id}". */
const ATTR = String.raw`(?:#[a-z0-9][\w-]*|alias=[\w-]+(?:,[\w-]+)*)`;
export const HEADING_ATTRS_LINE = new RegExp(String.raw`^(#{2,6} .*?)\s*\{${ATTR}(?:\s+${ATTR})*\}\s*$`, 'gm');

/** Markdown as plain text, for search. */
export function plain(markdown: string) {
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
		.replace(/\\\|/g, '|')
		.replace(/\|/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}

/** The words docs.js matches against: lower case, letters, digits and _. The same rule as words() there. */
export const wordsOf = (text: string) => text.toLowerCase().match(/[\p{L}\p{N}_]+/gu) ?? [];

export const KIND = { heading: 1, command: 2, setting: 3 } as const;

/** A heading's id as the build makes it from its text; docs.js does the same to restore an elided id. */
const slug = (text: string) => text.toLowerCase().trim().replace(/[^\p{L}\p{N}\s_-]/gu, '').replace(/\s/g, '-');
const ownId = (text: string, id: string) => (slug(text) === id ? '' : id);

/** [title, section, address relative to the docs' root, description, the page's words] */
type PageRow = [string, number, string, string, string];
/** [page, kind, label, heading id, text]; the id is empty when it is the label's own id (docs.js derives it) */
type EntryRow = [number, number, string, string, string];
export interface SearchIndex {
	/** The section labels */
	s: string[];
	p: PageRow[];
	e: EntryRow[];
}

// A table row whose first cell is a setting: an environment variable or a command-line option
const SETTING = /^\|\s*`(--[a-z][\w-]*|[A-Z][A-Z0-9]*_[A-Z0-9_]+|[A-Z]{3,}[A-Z0-9]*)(?:[ =][^`]*)?`\s*\|(.*?)\|?\s*$/;
const FLAG_ROW = /^\|\s*`(--[a-z][\w-]*)[^`]*`\s*\|/;
const excerpt = (text: string, max = 160) => (text.length <= max ? text : `${text.slice(0, text.lastIndexOf(' ', max) > 80 ? text.lastIndexOf(' ', max) : max)}…`);

/**
 * The index of one language. `address` gives a page's address relative to the docs'
 * root, such as getting-started/docker/ or de/getting-started/docker/.
 */
export function buildIndex(pages: Page[], sectionLabels: string[], sectionOf: (p: Page) => number, address: (p: Page) => string): SearchIndex {
	const index: SearchIndex = { s: sectionLabels, p: [], e: [] };
	pages.forEach((page, n) => {
		const lines = page.body.split('\n');
		const words = new Set(wordsOf(`${page.title} ${page.description} ${plain(page.body)}`).filter((w) => w.length > 1));
		const row: PageRow = [page.title, sectionOf(page), address(page), page.description, ''];
		index.p.push(row);
		const first = index.e.length;
		const headings = page.headings.filter((h) => h.level === 2 || h.level === 3);
		headings.forEach((h, i) => {
			const body = lines.slice(h.line + 1, headings[i + 1]?.line ?? lines.length);
			if (page.quoted && h.level === 2 && h.text.startsWith('neodesk ')) {
				// A command: its one-line description, and the names of its own flags
				const first = body.findIndex((l) => l.trim() !== '');
				const end = body.findIndex((l, j) => j > first && l.trim() === '');
				const summary = first === -1 ? '' : plain(body.slice(first, end === -1 ? body.length : end).join(' '));
				const flags = body.map((l) => l.match(FLAG_ROW)?.[1]).filter(Boolean);
				index.e.push([n, KIND.command, h.text, ownId(h.text, h.id), `${summary}${flags.length ? ` ${flags.join(' ')}` : ''}`]);
			} else {
				index.e.push([n, KIND.heading, h.text, ownId(h.text, h.id), excerpt(plain(body.join('\n')))]);
			}
		});
		// Settings and flags in tables, under the heading they belong to. The command
		// reference's flags belong to their commands, above.
		const seen = new Set<string>();
		if (!page.quoted) lines.forEach((line, i) => {
			const m = line.match(SETTING);
			if (!m) return;
			const under = [...page.headings].reverse().find((h) => h.line < i);
			const key = `${m[1]}#${under?.id ?? ''}`;
			if (seen.has(key)) return;
			seen.add(key);
			index.e.push([n, KIND.setting, m[1], under?.id ?? '', excerpt(plain(m[2].split(/(?<!\\)\|/).map((c) => c.trim()).filter(Boolean).pop() ?? ''))]);
		});
		// The page's words, less those its title, description and entries already have
		const own = new Set(wordsOf(`${row[0]} ${row[3]} ${index.e.slice(first).map((e) => `${e[2]} ${e[4]}`).join(' ')}`));
		row[4] = [...words].filter((w) => !own.has(w)).join(' ');
	});
	return index;
}

/** The index as the two files the build writes. */
export function indexFiles(index: SearchIndex) {
	const json = JSON.stringify(index);
	return { json, gz: zlib.gzipSync(json, { level: 9 }) };
}

/**
 * Every page of a language is in its index, and every command of its command reference
 * is there as a command: a page by its address, a command by its heading id.
 */
export function checkIndex(index: SearchIndex, pages: Page[], address: (p: Page) => string, where: string): string[] {
	const problems: string[] = [];
	const addresses = new Set(index.p.map((p) => p[2]));
	for (const page of pages) if (!addresses.has(address(page))) problems.push(`${where}: the page ${page.slug} is not in the search index`);
	const commands = new Set(index.e.filter((e) => e[1] === KIND.command).map((e) => `${index.p[e[0]][2]}#${e[3] || slug(e[2])}`));
	let count = 0;
	for (const page of pages.filter((p) => p.quoted)) {
		for (const h of page.headings.filter((x) => x.level === 2 && x.text.startsWith('neodesk '))) {
			count++;
			if (!commands.has(`${address(page)}#${h.id}`)) problems.push(`${where}: the command "${h.text}" is not in the search index`);
		}
	}
	if (pages.some((p) => p.quoted) && count === 0) problems.push(`${where}: no command found in the command reference`);
	return problems;
}
