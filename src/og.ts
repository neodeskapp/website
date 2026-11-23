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

/** What a page's image shows: the logo and the title in large type, nothing else. */
export interface OgData {
	template: OgTemplate;
	/** The headline: a page title, or the product for a comparison */
	title: string;
	/** For the release template */
	version?: string;
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

/** A part of a text that wrapping keeps whole, and what joins it to the part before it on a line */
interface Piece {
	text: string;
	glue: '' | ' ';
}

/** Pieces into lines no wider than `max`, greedily. */
function wrapPieces(pieces: Piece[], face: Face, size: number, max: number): string[] {
	const lines: string[] = [];
	let line = '';
	for (const p of pieces) {
		const next = line ? `${line}${p.glue}${p.text}` : p.text;
		if (line && measure(next, face, size) > max) {
			lines.push(line);
			line = p.text;
		} else line = next;
	}
	if (line) lines.push(line);
	return lines;
}

/** Words into lines no wider than `max`, greedily. */
const wrap = (words: string[], face: Face, size: number, max: number) => wrapPieces(words.map((text): Piece => ({ text, glue: ' ' })), face, size, max);

export interface Fitted {
	size: number;
	lines: string[];
	/** Whether words had to be left out */
	cut: boolean;
}

/**
 * Text set at the largest size from `sizes` at which it fits in `maxLines` lines. At the
 * smallest size it is cut after the last whole word that fits, with an ellipsis; a word is
 * never broken. The release cards use it; a page's title is set by `fitTitle`.
 */
export function fit(text: string, face: Face, sizes: number[], max: number, maxLines: number): Fitted {
	const words = text.trim().split(/\s+/);
	for (const size of sizes) {
		const lines = wrap(words, face, size, max);
		if (lines.length <= maxLines) return { size, lines, cut: false };
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

/** Words a cut line should not end on, such as "the" in "the Docker images from a…", in English and German */
const LEADING = new Set([
	...['a', 'an', 'the', 'and', 'or', 'of', 'to', 'with', 'for', 'from', 'in', 'on', 'at', 'by', 'its', 'their', 'that', 'what', 'how', 'which', 'who', 'as'],
	...['der', 'die', 'das', 'den', 'dem', 'des', 'ein', 'eine', 'einen', 'einem', 'einer', 'und', 'oder', 'mit', 'für', 'von', 'vom', 'zu', 'zum', 'zur', 'im', 'auf', 'am', 'bei', 'aus', 'nach', 'über', 'wie', 'was', 'als', 'sein', 'seine', 'ihre', 'dass']
]);

/** A page's title as set on its image */
export interface TitleSet {
	size: number;
	lines: string[];
	/** False when the title needs more lines than it may have, or a word is wider than the box, even at the smallest size */
	fits: boolean;
}

/**
 * The words of a text; with `split`, a word wider than `max` at the size is cut after its
 * hyphens, so "Remote-Desktop-Server" can break after "Remote-". Other words stay whole.
 */
function piecesOf(text: string, face: Face, size: number, max: number, split: boolean): Piece[] {
	return text
		.trim()
		.split(/\s+/)
		.flatMap((word): Piece[] =>
			split && measure(word, face, size) > max ? word.split(/(?<=-)(?=.)/).map((text, i) => ({ text, glue: i ? '' : ' ' })) : [{ text: word, glue: ' ' }]
		);
}

/** What one, two and three lines count as: a title this much smaller */
const LINES_COST = [1, 0.85, 0.68];
/** What a word broken after a hyphen counts as */
const SPLIT_COST = 0.8;

/**
 * A title at the size from `sizes` that sets it largest in at most `maxLines` lines, none
 * wider than `max`, where a second line counts as 15 % smaller, a third as 20 % smaller
 * again, and a word broken after a hyphen as 20 % smaller. So "The overview page" takes two
 * lines at 128 px rather than one at 104, "Your own remote desktop server" two at 80 rather
 * than three at 96, and "MeshAgent-Geräte" stays whole at 96 rather than broken at 128.
 * The lines are as even as they go. When it fits at no size, `fits` is false and the lines
 * are those of the smallest size, for the check to name.
 */
function fitTitle(text: string, face: Face, sizes: number[], max: number, maxLines: number): TitleSet {
	let best: { size: number; pieces: Piece[]; count: number; score: number } | undefined;
	for (const size of sizes) {
		const whole = piecesOf(text, face, size, max, false);
		const split = piecesOf(text, face, size, max, true);
		for (const pieces of split.length > whole.length ? [whole, split] : [whole]) {
			const lines = wrapPieces(pieces, face, size, max);
			if (lines.length > maxLines || lines.some((l) => measure(l, face, size) > max)) continue;
			const score = size * LINES_COST[lines.length - 1] * (pieces === split ? SPLIT_COST : 1);
			if (!best || score > best.score) best = { size, pieces, count: lines.length, score };
		}
	}
	if (best) return { size: best.size, lines: even(best.pieces, face, best.size, max, best.count), fits: true };
	const size = sizes[sizes.length - 1];
	return { size, lines: wrapPieces(piecesOf(text, face, size, max, true), face, size, max), fits: false };
}

/**
 * The same number of lines, as even as they go: the narrowest width that still needs no
 * more lines, so a title does not end with one word on a line of its own.
 */
function even(pieces: Piece[], face: Face, size: number, max: number, count: number): string[] {
	if (count < 2) return wrapPieces(pieces, face, size, max);
	let lo = 0;
	let hi = max;
	while (hi - lo > 2) {
		const mid = (lo + hi) / 2;
		if (wrapPieces(pieces, face, size, mid).length <= count) hi = mid;
		else lo = mid;
	}
	return wrapPieces(pieces, face, size, hi);
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

/* ---------- page images ---------- */

/** The room a title has on an image: under the logo, inside the margins, clear of the mark */
interface Box {
	x: number;
	y: number;
	width: number;
	height: number;
}
/** 40 px under the logo, and as far above the bottom edge as the logo is below the top */
const boxOf = (width: number): Box => ({ x: LEFT, y: 144, width, height: OG_HEIGHT - 64 - 144 });

/** The display face's capital height, as a share of the size */
const CAP = 0.675;
/** A title's line height, as a share of the size */
const LINE = 1.05;
/** A line starts this much left of the margin, so a capital's stem lines up with the logo's edge */
const lineStart = (size: number) => LEFT - Math.round(size * 0.07);
/**
 * The first baseline of a block that is `height` from its first line's capitals to its last
 * baseline, in the middle of the box. Capital umlauts stick out above about as far as
 * descenders below, so this centres what is drawn as well.
 */
const firstBaseline = (box: Box, height: number, size: number) => box.y + (box.height - height) / 2 + CAP * size;

const displayText = (x: number, y: number, size: number, body: string) =>
	`<text x="${x}" y="${y.toFixed(1)}" font-family="${DISPLAY.family}" font-weight="${DISPLAY.weight}" font-size="${size}" letter-spacing="${(DISPLAY.tracking * size).toFixed(2)}">${body}</text>`;

export interface Drawn {
	svg: string;
	title: TitleSet;
	/** Why the title does not fit its box; nothing when it fits */
	problem?: string;
}

/**
 * Why a title does not fit its image: it needs more lines than the image has room for, or a
 * word is wider than the box, even at the smallest size; or the text as resvg draws it runs
 * out of its box, into the logo, the mark or the margin.
 */
function problemOf(text: string, title: TitleSet, box: Box, maxLines: number): string | undefined {
	const at = `at ${title.size} px${title.fits ? '' : ', the smallest size'}`;
	const wide = title.lines.find((l) => measure(l, DISPLAY, title.size) > box.width);
	if (wide) return `"${wide}" is wider than the ${box.width} px the title has, ${at}`;
	if (title.lines.length > maxLines) return `the title needs ${title.lines.length} lines ${at}; there is room for ${maxLines}`;
	if (!title.fits) return `the title does not fit ${at}`;
	const ink = new Resvg(`<svg xmlns="http://www.w3.org/2000/svg" width="${OG_WIDTH}" height="${OG_HEIGHT}">${text}</svg>`, { font }).getBBox();
	if (!ink) return 'the title draws nothing';
	// A line starts a little left of the box on purpose, see lineStart
	const past = (
		[
			['left', box.x - 16 - ink.x],
			['right', ink.x + ink.width - (box.x + box.width)],
			['top', box.y - ink.y],
			['bottom', ink.y + ink.height - (box.y + box.height)]
		] as const
	).filter(([, px]) => px > 0.5);
	if (past.length) return `the title runs past its box: ${past.map(([edge, px]) => `${Math.ceil(px)} px at the ${edge}`).join(', ')}`;
	return undefined;
}

/** The SVG of one image: the logo, the brand's shapes and the title in large type. */
export function draw(d: OgData): Drawn {
	const image = (art: string, text: string, title: TitleSet, box: Box, maxLines: number): Drawn => ({
		svg: frame(art + text),
		title,
		problem: problemOf(text, title, box, maxLines)
	});
	switch (d.template) {
		case 'landing': {
			// The headline left of the large mark, which runs off the right edge
			const box = boxOf(660);
			const title = fitTitle(d.title, DISPLAY, [120, 112, 104, 96, 88, 80, 72, 64], box.width, 3);
			const y = firstBaseline(box, CAP * title.size + (title.lines.length - 1) * LINE * title.size, title.size);
			return image(mark(790, 70, 500) + logo(LEFT, 64, 44), textBlock(title.lines, DISPLAY, title.size, lineStart(title.size), y, LINE, TEXT), title, box, 3);
		}
		case 'docs':
		case 'use-case': {
			// The title in up to three lines, with the mark in the corner
			const box = boxOf(900);
			const title = fitTitle(d.title, DISPLAY, [128, 120, 112, 104, 96, 88, 80, 72, 64], box.width, 3);
			const y = firstBaseline(box, CAP * title.size + (title.lines.length - 1) * LINE * title.size, title.size);
			return image(mark(1010, 430, 260) + logo(LEFT, 64, 40), textBlock(title.lines, DISPLAY, title.size, lineStart(title.size), y, LINE, TEXT), title, box, 3);
		}
		case 'comparison': {
			// "NeoDesk vs" and the product under it, as text only, at one size
			const box = boxOf(760);
			const title = fitTitle(d.title, DISPLAY, [112, 104, 96, 88, 80, 72, 64], box.width, 2);
			const s = title.size;
			const y = firstBaseline(box, CAP * s + title.lines.length * LINE * s, s);
			const text =
				displayText(lineStart(s), y, s, `<tspan fill="${BLUE}">NeoDesk</tspan><tspan fill="${MUTED}"> vs</tspan>`) +
				textBlock(title.lines, DISPLAY, s, lineStart(s), y + LINE * s, LINE, TEXT);
			return image(mark(900, 150, 400) + logo(LEFT, 64, 40), text, title, box, 2);
		}
		case 'release': {
			// The version large, the title under it
			const box = boxOf(760);
			const version = d.version ?? '';
			const vSize = fit(`NeoDesk ${version}`, DISPLAY, [120, 108, 96, 84], box.width, 1).size;
			const title = fitTitle(d.title, DISPLAY, [72, 64, 56, 50, 44], box.width, 2);
			// From the version's baseline to the title's first one
			const gap = 0.3 * vSize + CAP * title.size;
			const y = firstBaseline(box, CAP * vSize + gap + (title.lines.length - 1) * LINE * title.size, vSize);
			const text =
				displayText(lineStart(vSize), y, vSize, `<tspan fill="${TEXT}">NeoDesk </tspan><tspan fill="${BLUE}">${xml(version)}</tspan>`) +
				textBlock(title.lines, DISPLAY, title.size, lineStart(title.size), y + gap, LINE, TEXT);
			return image(mark(900, 150, 400) + logo(LEFT, 64, 40), text, title, box, 2);
		}
	}
}

/* ---------- release cards ---------- */

const GREEN = '#72c98c';
const RED = '#ff8f80';

/** One labelled number on a release card, such as 48 commits. */
export interface CardFigure {
	value: string;
	label: string;
	/** Lines added are green and lines removed red, as GitHub shows them */
	tone?: 'add' | 'remove';
}

/** The picture at the top of a release's notes: the version, a title and the release's numbers. */
export interface ReleaseCard {
	/** v3.6.0-rc.2 */
	version: string;
	title: string;
	/** "Pre-release", "Desktop client pre-release" */
	kicker: string;
	/** The kicker's colour: blue for the server, lime for the client */
	accent: 'blue' | 'lime';
	/** 23 November 2026 */
	date: string;
	figures: CardFigure[];
	/** A short line under the numbers, such as what makes them large */
	note?: string;
}

/**
 * The SVG of a release card, on the canvas of the link previews: few elements and large
 * type, so it reads at the width GitHub shows release notes and as a 400 px chat embed.
 */
export function drawReleaseCard(c: ReleaseCard): string {
	const accent = c.accent === 'lime' ? LIME : BLUE;
	const kickerY = 178;
	const kickerWidth = measure(c.kicker, SANS_BOLD, 30);
	const kicker =
		`<text x="${LEFT}" y="${kickerY}" font-family="${SANS_BOLD.family}" font-weight="600" font-size="30" fill="${accent}">${xml(c.kicker)}</text>` +
		`<text x="${(LEFT + kickerWidth).toFixed(1)}" y="${kickerY}" font-family="${SANS.family}" font-weight="400" font-size="30" fill="${MUTED}">${xml(`, ${c.date}`)}</text>`;
	// The version is the largest thing on the card; it stays left of the mark
	const vSize = fit(c.version, DISPLAY, [136, 124, 112, 100, 88], 820, 1).size;
	const versionY = kickerY + 18 + vSize * 0.78;
	const version = `<text x="${LEFT - 5}" y="${versionY.toFixed(1)}" font-family="${DISPLAY.family}" font-weight="700" font-size="${vSize}" letter-spacing="${(-0.03 * vSize).toFixed(2)}" fill="${TEXT}">${xml(c.version)}</text>`;
	const title = fit(c.title, DISPLAY, [50, 46, 42], 1056, 1);
	const titleY = versionY + 22 + title.size * 0.8;
	// The numbers in one row: the value large, its label under it
	// at the largest size that fits; below 52 px a 400 px embed can't be read, so the last
	// figures (the optional ones) go first
	const room = OG_WIDTH - 2 * LEFT;
	const gap = 52;
	const widthOf = (f: CardFigure, s: number) => Math.max(measure(f.value, DISPLAY, s), measure(f.label, SANS, 28));
	const fits = (list: CardFigure[], s: number) => list.reduce((w, f) => w + widthOf(f, s), 0) + gap * (list.length - 1) <= room;
	let shown = c.figures;
	let size = 64;
	while (!fits(shown, size)) {
		if (size > 52) size -= 4;
		else if (shown.length > 4) {
			shown = shown.slice(0, -1);
			size = 64;
		} else break;
	}
	const valueY = 506;
	let x = LEFT;
	let figures = '';
	for (const f of shown) {
		const fill = f.tone === 'add' ? GREEN : f.tone === 'remove' ? RED : TEXT;
		figures +=
			`<text x="${x.toFixed(1)}" y="${valueY}" font-family="${DISPLAY.family}" font-weight="700" font-size="${size}" letter-spacing="${(-0.02 * size).toFixed(2)}" fill="${fill}">${xml(f.value)}</text>` +
			`<text x="${x.toFixed(1)}" y="${valueY + 42}" font-family="${SANS.family}" font-weight="400" font-size="28" fill="${MUTED}">${xml(f.label)}</text>`;
		x += widthOf(f, size) + gap;
	}
	const note = c.note ? `<text x="${LEFT}" y="598" font-family="${SANS.family}" font-weight="400" font-size="26" fill="${MUTED}">${xml(c.note)}</text>` : '';
	return frame(
		mark(930, -36, 340) +
			logo(LEFT, 60, 40) +
			kicker +
			version +
			textBlock(title.lines, DISPLAY, title.size, LEFT - 2, titleY, 1, TEXT) +
			figures +
			note
	);
}

/** The PNG of a release card at a width; the card is drawn as vectors, so any width is sharp. */
export function renderReleaseCard(c: ReleaseCard, width = 1600): Buffer {
	return new Resvg(drawReleaseCard(c), { font, fitTo: { mode: 'width', value: width } }).render().asPng();
}

/**
 * The PNG of one image, from the cache when the same text was drawn with the same
 * template before. The cache key is the text and the template's own hash. An image whose
 * title does not fit is not kept, so every build draws it again and names the problem.
 */
export function render(d: OgData, cacheDir: string): { png: Buffer; cached: boolean; problem?: string } {
	const key = crypto.createHash('sha256').update(TEMPLATE_HASH).update(JSON.stringify(d)).digest('hex').slice(0, 24);
	const file = path.join(cacheDir, 'og', `${key}.png`);
	if (fs.existsSync(file)) return { png: fs.readFileSync(file), cached: true };
	const drawn = draw(d);
	const png = new Resvg(drawn.svg, { font, fitTo: { mode: 'original' } }).render().asPng();
	if (!drawn.problem) {
		fs.mkdirSync(path.dirname(file), { recursive: true });
		fs.writeFileSync(file, png);
	}
	return { png, cached: false, problem: drawn.problem };
}
