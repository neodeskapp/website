// The glyphs in front of the rows of the docs' section lists: Material Symbols Outlined,
// the icon set of the console and the desktop client, one file per glyph in src/icons.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'icons');
const cache = new Map<string, string>();

export const hasIcon = (name: string) => /^[a-z0-9_]+$/.test(name) && fs.existsSync(path.join(dir, `${name}.svg`));

/** The glyph as inline SVG, drawn in the text colour around it */
export function iconSvg(name: string) {
	let svg = cache.get(name);
	if (svg === undefined) {
		svg = fs.readFileSync(path.join(dir, `${name}.svg`), 'utf8').trim().replace('<svg ', '<svg width="24" height="24" fill="currentColor" aria-hidden="true" focusable="false" ');
		cache.set(name, svg);
	}
	return svg;
}
