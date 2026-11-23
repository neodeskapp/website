// Link preview images: one 1200 x 630 PNG per page, drawn from SVG templates with resvg.
// The fonts come from fonts/ and no system font is loaded, so every machine draws the
// same picture. An image is drawn again only when its text or its template changed.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;
/** The largest file an image may be */
export const OG_MAX_BYTES = 300 * 1024;

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const FONT_FILES = ['fonts/FunnelDisplay-Bold.ttf', 'fonts/IBMPlexSans-Regular.ttf', 'fonts/IBMPlexSans-SemiBold.ttf'].map((f) => path.join(root, f));
const LOGO = path.join(root, 'public/img/logo-on-dark.svg');
const font = { fontFiles: FONT_FILES, loadSystemFonts: false, defaultFontFamily: 'IBM Plex Sans' };

/* The brand: the console's dark surface, its text colours, and the mark's colours on dark */
const BG = '#141616';
const TEXT = '#e4e7e7';
const MUTED = '#a3abad';
const BLUE = '#58a6ff';
const LIME = '#a3e635';
const TEAL = '#3fd0c4';

export type OgTemplate = 'landing' | 'docs' | 'comparison' | 'use-case' | 'release';

export interface OgData {
	template: OgTemplate;
	/** The headline: a page title, or the product for a comparison */
	title: string;
	/** The page's description; the docs template shows a short line from it */
	description: string;
	/** The small line above the title: the docs section */
	kicker?: string;
	/** For the release template */
	version?: string;
	/** The address shown at the bottom, without https:// */
	host: string;
}

/** What the drawing depends on besides the text: this file, the fonts and the logo. */
const TEMPLATE_HASH = crypto
	.createHash('sha256')
	.update(fs.readFileSync(fileURLToPath(import.meta.url)))
	.update(Buffer.concat([...FONT_FILES, LOGO].map((f) => fs.readFileSync(f))))
	.digest('hex')
	.slice(0, 16);

/* ---------- measuring and wrapping text ---------- */

interface Face {
	family: string;
	weight: number;
	/** Letter spacing as a share of the font size */
	tracking: number;
}
const DISPLAY: Face = { family: 'Funnel Display', weight: 700, tracking: -0.03 };
const SANS: Face = { family: 'IBM Plex Sans', weight: 400, tracking: 0 };
const SANS_BOLD: Face = { family: 'IBM Plex Sans SemiBold', weight: 600, tracking: 0 };

const xml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const widths = new Map<string, number>();
/** The width of a line as resvg sets it, kerning included. */
function measure(text: string, face: Face, size: number): number {
	const key = `${face.family}|${size}|${text}`;
	const known = widths.get(key);
	if (known !== undefined) return known;
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="4000" height="400"><text x="0" y="200" font-family="${face.family}" font-weight="${face.weight}" font-size="${size}" letter-spacing="${face.tracking * size}">${xml(text)}</text></svg>`;
	const box = new Resvg(svg, { font }).getBBox();
	const w = box ? box.x + box.width : 0;
	widths.set(key, w);
	return w;
}

/** Words into lines no wider than `max`, greedily. */
function wrap(words: string[], face: Face, size: number, max: number): string[] {
	const lines: string[] = [];
	let line = '';
	for (const word of words) {
		const next = line ? `${line} ${word}` : word;
		if (line && measure(next, face, size) > max) {
			lines.push(line);
			line = word;
		} else line = next;
	}
	if (line) lines.push(line);
	return lines;
}

export interface Fitted {
	size: number;
	lines: string[];
	/** Whether words had to be left out */
	cut: boolean;
}

/**
 * Text set at the largest size from `sizes` at which it fits in `maxLines` lines. At the
 * smallest size it is cut after the last whole word that fits, with an ellipsis; a word is
 * never broken.
 */
export function fit(text: string, face: Face, sizes: number[], max: number, maxLines: number, balance = false): Fitted {
	const words = text.trim().split(/\s+/);
	for (const size of sizes) {
		const lines = wrap(words, face, size, max);
		if (lines.length <= maxLines) return { size, lines: balance ? balanced(words, face, size, max, lines) : lines, cut: false };
	}
	const size = sizes[sizes.length - 1];
	const lines = wrap(words, face, size, max).slice(0, maxLines);
	const last = lines[maxLines - 1].split(' ');
	while (last.length > 1 && measure(`${last.join(' ')}…`, face, size) > max) last.pop();
	// Don't end on a word that leads into the cut-off part
	while (last.length > 1 && LEADING.has(last[last.length - 1].toLowerCase())) last.pop();
	lines[maxLines - 1] = `${last.join(' ').replace(/[,;:.]$/, '')}…`;
	return { size, lines, cut: true };
}

/** Words a cut line should not end on, such as "the" in "the Docker images from a…" */
const LEADING = new Set(['a', 'an', 'the', 'and', 'or', 'of', 'to', 'with', 'for', 'from', 'in', 'on', 'at', 'by', 'its', 'their', 'that', 'what', 'how', 'which', 'who', 'as']);

/**
 * The same number of lines, as even as they go: the narrowest width that still needs no
 * more lines, so a title does not end with one word on a line of its own.
 */
function balanced(words: string[], face: Face, size: number, max: number, greedy: string[]): string[] {
	if (greedy.length < 2) return greedy;
	let lo = 0;
	let hi = max;
	while (hi - lo > 4) {
		const mid = (lo + hi) / 2;
		const lines = wrap(words, face, size, mid);
		if (lines.length <= greedy.length && lines.every((l) => measure(l, face, size) <= mid || !l.includes(' '))) hi = mid;
		else lo = mid;
	}
	return wrap(words, face, size, hi);
}

/* ---------- drawing ---------- */

function textBlock(lines: string[], face: Face, size: number, x: number, y: number, lineHeight: number, fill: string) {
	return lines
		.map(
			(l, i) =>
				`<text x="${x}" y="${(y + i * size * lineHeight).toFixed(1)}" font-family="${face.family}" font-weight="${face.weight}" font-size="${size}" letter-spacing="${(face.tracking * size).toFixed(2)}" fill="${fill}">${xml(l)}</text>`
		)
		.join('\n');
}

/** The mark (square, circle and their overlap) drawn at a size and place, as on the website. */
function mark(x: number, y: number, size: number) {
	const s = size / 44;
	return `<g transform="translate(${x} ${y}) scale(${s.toFixed(4)}) translate(-10 -10)">
<clipPath id="og-ci"><circle cx="38" cy="26" r="16"/></clipPath>
<rect x="10" y="22" width="32" height="32" rx="10" fill="${BLUE}"/>
<circle cx="38" cy="26" r="16" fill="${LIME}"/>
<rect x="10" y="22" width="32" height="32" rx="10" fill="${TEAL}" clip-path="url(#og-ci)"/>
</g>`;
}

let logoData = '';
/** The full logo, the owner's file as it is, placed at a height. */
function logo(x: number, y: number, height: number) {
	logoData ||= `data:image/svg+xml;base64,${fs.readFileSync(LOGO).toString('base64')}`;
	const [, , w, h] = fs.readFileSync(LOGO, 'utf8').match(/viewBox="([^"]+)"/)![1].split(/\s+/).map(Number);
	return `<image x="${x}" y="${y}" width="${((height * w) / h).toFixed(1)}" height="${height}" href="${logoData}"/>`;
}

const frame = (body: string) =>
	`<svg xmlns="http://www.w3.org/2000/svg" width="${OG_WIDTH}" height="${OG_HEIGHT}" viewBox="0 0 ${OG_WIDTH} ${OG_HEIGHT}"><rect width="${OG_WIDTH}" height="${OG_HEIGHT}" fill="${BG}"/>${body}</svg>`;

const LEFT = 72;
/** The lowest baseline text may have above the footer */
const TEXT_BOTTOM = 512;

/** A short line from the description, in as many lines as fit between `top` and the footer. */
function description(text: string, top: number, width: number, maxLines: number) {
	const room = Math.min(maxLines, Math.floor((TEXT_BOTTOM - top) / (28 * 1.4)) + 1);
	if (room < 1 || !text.trim()) return '';
	const set = fit(text, SANS, [28], width, room);
	// A cut that leaves a few words says nothing; leave the line out then
	if (set.cut && set.lines.join(' ').split(' ').length < 6) return '';
	return textBlock(set.lines, SANS, 28, LEFT, top, 1.4, MUTED);
}
const footer = (host: string) => `<text x="${LEFT}" y="566" font-family="${SANS.family}" font-weight="400" font-size="26" fill="${MUTED}">${xml(host)}</text>`;

export interface Drawn {
	svg: string;
	/** What was set, for the contact sheet and for problems */
	title: Fitted;
}

/** The SVG of one image. */
export function draw(d: OgData): Drawn {
	switch (d.template) {
		case 'landing': {
			// A big headline left of the large mark, which runs off the right edge
			// Two lines when the title fits in two at a large size, else three
			const two = fit(d.title, DISPLAY, [88, 80, 72], 640, 2, true);
			const title = two.cut ? fit(d.title, DISPLAY, [88, 80, 72, 64, 58], 640, 3, true) : two;
			const top = 200 + title.size * 0.8;
			const descTop = top + (title.lines.length - 1) * title.size * 1.0 + 64;
			return {
				title,
				svg: frame(
					mark(790, 70, 500) +
						logo(LEFT, 64, 44) +
						textBlock(title.lines, DISPLAY, title.size, LEFT - 3, top, 1.0, TEXT) +
						description(d.description, descTop, 600, 3) +
						footer(d.host)
				)
			};
		}
		case 'docs':
		case 'use-case': {
			// Section (or "Use case"), the title in up to three lines, a short line from the description
			const title = fit(d.title, DISPLAY, [76, 70, 64, 58, 52], 900, 3, true);
			const kicker = d.template === 'use-case' ? 'Use case' : (d.kicker ?? '');
			const kickerY = 186;
			const top = kickerY + 34 + title.size * 0.92;
			const descTop = top + (title.lines.length - 1) * title.size * 1.02 + 60;
			return {
				title,
				svg: frame(
					mark(1010, 430, 260) +
						logo(LEFT, 64, 40) +
						`<text x="${LEFT}" y="${kickerY}" font-family="${SANS_BOLD.family}" font-weight="600" font-size="28" fill="${d.template === 'use-case' ? LIME : BLUE}">${xml(kicker)}</text>` +
						textBlock(title.lines, DISPLAY, title.size, LEFT - 2, top, 1.02, TEXT) +
						description(d.description, descTop, 860, title.lines.length === 1 ? 3 : 2) +
						footer(d.host)
				)
			};
		}
		case 'comparison': {
			// "NeoDesk vs <product>", the product as text only
			const title = fit(d.title, DISPLAY, [84, 76, 68, 60, 54], 760, 2, true);
			const top = 228;
			const descTop = top + 96 + (title.lines.length - 1) * title.size * 1.02 + 56;
			return {
				title,
				svg: frame(
					mark(900, 150, 400) +
						logo(LEFT, 64, 40) +
						`<text x="${LEFT - 3}" y="${top}" font-family="${DISPLAY.family}" font-weight="700" font-size="84" letter-spacing="${(-0.03 * 84).toFixed(2)}"><tspan fill="${BLUE}">NeoDesk</tspan><tspan fill="${MUTED}"> vs</tspan></text>` +
						textBlock(title.lines, DISPLAY, title.size, LEFT - 3, top + 96, 1.02, TEXT) +
						description(d.description, descTop, 760, 2) +
						footer(d.host)
				)
			};
		}
		case 'release': {
			// The version large, the title under it
			const version = d.version ?? '';
			const vSize = fit(`NeoDesk ${version}`, DISPLAY, [120, 108, 96, 84], 760, 1).size;
			const title = fit(d.title, DISPLAY, [56, 50, 44], 760, 2, true);
			const top = 300;
			const descTop = top + 76 + (title.lines.length - 1) * title.size * 1.05 + 52;
			return {
				title,
				svg: frame(
					mark(900, 150, 400) +
						logo(LEFT, 64, 40) +
						`<text x="${LEFT - 4}" y="${top}" font-family="${DISPLAY.family}" font-weight="700" font-size="${vSize}" letter-spacing="${(-0.03 * vSize).toFixed(2)}"><tspan fill="${TEXT}">NeoDesk </tspan><tspan fill="${BLUE}">${xml(version)}</tspan></text>` +
						textBlock(title.lines, DISPLAY, title.size, LEFT - 2, top + 76, 1.05, TEXT) +
						description(d.description, descTop, 800, 2) +
						footer(d.host)
				)
			};
		}
	}
}

/**
 * The PNG of one image, from the cache when the same text was drawn with the same
 * template before. The cache key is the text and the template's own hash.
 */
export function render(d: OgData, cacheDir: string): { png: Buffer; title: Fitted | null; cached: boolean } {
	const key = crypto.createHash('sha256').update(TEMPLATE_HASH).update(JSON.stringify(d)).digest('hex').slice(0, 24);
	const file = path.join(cacheDir, 'og', `${key}.png`);
	if (fs.existsSync(file)) return { png: fs.readFileSync(file), title: null, cached: true };
	const drawn = draw(d);
	const png = new Resvg(drawn.svg, { font, fitTo: { mode: 'original' } }).render().asPng();
	fs.mkdirSync(path.dirname(file), { recursive: true });
	fs.writeFileSync(file, png);
	return { png, title: drawn.title, cached: false };
}
