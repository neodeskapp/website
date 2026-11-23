// A small HTML parser for the checks: enough for the pages this build writes, no browser.
// It builds a tree of elements and text, knows void and raw-text elements, and closes
// open elements when it meets a closing tag further up.

export interface El {
	tag: string;
	attrs: Record<string, string>;
	children: Node[];
	parent: El | null;
	line: number;
}
export type Node = El | string;

const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
const RAW = new Set(['script', 'style', 'textarea', 'title']);
// Closing tags that close a <p> or <li> left open, as browsers do
const CLOSES_P = new Set(['p', 'div', 'ul', 'ol', 'table', 'pre', 'section', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'nav', 'aside', 'main', 'header', 'footer', 'figure']);

const ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', '#39': "'" };
export const decode = (s: string) =>
	s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+\d*);/gi, (m, e: string) => {
		if (e[0] === '#') return String.fromCodePoint(e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : Number(e.slice(1)));
		return ENTITIES[e.toLowerCase()] ?? m;
	});

function parseAttrs(src: string): Record<string, string> {
	const attrs: Record<string, string> = {};
	for (const m of src.matchAll(/([^\s=/>"']+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)) {
		attrs[m[1].toLowerCase()] = decode(m[2] ?? m[3] ?? m[4] ?? '');
	}
	return attrs;
}

export function parse(html: string): El {
	const doc: El = { tag: '#document', attrs: {}, children: [], parent: null, line: 1 };
	let cur = doc;
	let i = 0;
	let line = 1;
	const advance = (to: number) => {
		for (let k = i; k < to; k++) if (html.charCodeAt(k) === 10) line++;
		i = to;
	};
	while (i < html.length) {
		const lt = html.indexOf('<', i);
		if (lt === -1) {
			cur.children.push(decode(html.slice(i)));
			advance(html.length);
			break;
		}
		if (lt > i) {
			cur.children.push(decode(html.slice(i, lt)));
			advance(lt);
		}
		if (html.startsWith('<!--', i)) {
			const end = html.indexOf('-->', i + 4);
			advance(end === -1 ? html.length : end + 3);
			continue;
		}
		if (html.startsWith('<!', i)) {
			advance(html.indexOf('>', i) + 1);
			continue;
		}
		const m = html.slice(i).match(/^<(\/?)([a-zA-Z][\w:-]*)((?:\s+[^\s=/>"']+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?)*)\s*(\/?)>/);
		if (!m) {
			cur.children.push('<');
			advance(i + 1);
			continue;
		}
		const [whole, closing, rawTag, attrSrc] = m;
		const tag = rawTag.toLowerCase();
		const startLine = line;
		advance(i + whole.length);
		if (closing) {
			let el: El | null = cur;
			while (el && el.tag !== tag) el = el.parent;
			if (el && el.parent) cur = el.parent;
			continue;
		}
		if (cur.tag === 'p' && CLOSES_P.has(tag) && cur.parent) cur = cur.parent;
		if (tag === 'li' && cur.tag === 'li' && cur.parent) cur = cur.parent;
		const el: El = { tag, attrs: parseAttrs(attrSrc), children: [], parent: cur, line: startLine };
		cur.children.push(el);
		if (VOID.has(tag) || m[4]) continue;
		if (RAW.has(tag)) {
			const end = html.toLowerCase().indexOf(`</${tag}`, i);
			const stop = end === -1 ? html.length : end;
			el.children.push(tag === 'textarea' || tag === 'title' ? decode(html.slice(i, stop)) : html.slice(i, stop));
			advance(stop);
			const close = html.indexOf('>', i);
			advance(close === -1 ? html.length : close + 1);
			continue;
		}
		cur = el;
	}
	return doc;
}

export const isEl = (n: Node): n is El => typeof n !== 'string';

/** Every element under `root` (not root itself) that matches. */
export function findAll(root: El, match: (el: El) => boolean): El[] {
	const out: El[] = [];
	const walk = (el: El) => {
		for (const c of el.children) {
			if (!isEl(c)) continue;
			if (match(c)) out.push(c);
			walk(c);
		}
	};
	walk(root);
	return out;
}
export const find = (root: El, match: (el: El) => boolean) => findAll(root, match)[0] ?? null;
export const byTag = (tag: string) => (el: El) => el.tag === tag;

/** Whether an element or one of its parents carries the hidden attribute. */
export function isHidden(el: El | null): boolean {
	for (let e = el; e; e = e.parent) if ('hidden' in e.attrs || e.attrs['aria-hidden'] === 'true') return true;
	return false;
}

/** The text a reader sees without scripts: no script, style or template, nothing hidden. */
export function textOf(el: El): string {
	if (el.tag === 'script' || el.tag === 'style' || el.tag === 'template' || 'hidden' in el.attrs) return '';
	return el.children.map((c) => (isEl(c) ? textOf(c) : c)).join('');
}
