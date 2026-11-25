// What the brand guide's pages share: escaping, colour swatches, contrast ratios,
// the guide's own navigation, and the frame that shows one example in the dark
// and the light theme side by side.

export const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** The guide's pages, in the order of its navigation. '' is /brand/ itself. */
export const BRAND_SLUGS = ['', 'colours', 'fonts', 'elements', 'graphics', 'voice'] as const;
export type BrandSlug = (typeof BRAND_SLUGS)[number];

/** The address of a guide page, without the language prefix. */
export const brandPath = (slug: BrandSlug) => (slug ? `/brand/${slug}/` : '/brand/');

/** A page of the guide as the build needs it. */
export interface BrandPage {
	slug: BrandSlug;
	path: string;
	/** h1, link preview title and navigation label */
	title: string;
	/** <title>, at most 60 characters */
	pageTitle: string;
	description: string;
	main: string;
	/** Files whose last commit dates the page in the sitemap, relative to the site folder */
	sources: string[];
}

/** The navigation labels and the theme names, per language. */
export const GUIDE: Record<string, { nav: string; pages: Record<BrandSlug, string>; dark: string; light: string; doLabel: string; dontLabel: string }> = {
	en: {
		nav: 'Brand guide',
		pages: { '': 'Logo', colours: 'Colours', fonts: 'Fonts', elements: 'Interface elements', graphics: 'Graphics', voice: 'Voice and writing' },
		dark: 'Dark',
		light: 'Light',
		doLabel: 'Do',
		dontLabel: 'Don\'t'
	},
	de: {
		nav: 'Markenleitfaden',
		pages: { '': 'Logo', colours: 'Farben', fonts: 'Schriften', elements: 'Bedienelemente', graphics: 'Grafiken', voice: 'Ton und Sprache' },
		dark: 'Dunkel',
		light: 'Hell',
		doLabel: 'So',
		dontLabel: 'Nicht so'
	}
};

/** The guide's navigation, at the top of each of its pages. */
export function brandNav(code: string, prefix: string, current: BrandSlug) {
	const g = GUIDE[code] ?? GUIDE.en;
	const links = BRAND_SLUGS.map((slug) => `<a href="${prefix}${brandPath(slug)}"${slug === current ? ' aria-current="page"' : ''}>${esc(g.pages[slug])}</a>`).join('');
	return `    <nav class="brand-nav" aria-label="${esc(g.nav)}">${links}</nav>`;
}

/* ---------- colours ---------- */

export const swatch = (hex: string) => `<span class="swatch" style="background:${hex}"></span><code>${hex}</code>`;

const channel = (v: number) => {
	const c = v / 255;
	return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};
const luminance = (hex: string) => {
	const n = hex.replace('#', '');
	const [r, g, b] = [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16));
	return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
};

/** The WCAG contrast ratio of two #rrggbb colours. */
export function contrast(a: string, b: string) {
	const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
	return (hi + 0.05) / (lo + 0.05);
}

/** A ratio as the page shows it, "7.1:1" or "7,1:1", rounded down so a shown pass is a pass. */
export const ratio = (a: string, b: string, code: string) => `${(Math.floor(contrast(a, b) * 10) / 10).toFixed(1).replace('.', code === 'de' ? ',' : '.')}:1`;

/* ---------- examples in both themes ---------- */

/**
 * One example in the dark and the light theme, side by side, stacked on narrow
 * screens. The light copy is hidden from screen readers and from the keyboard, so
 * the example is read and tabbed through once. build gets a suffix for ids.
 */
export function pair(code: string, build: (suffix: string) => string, cls = '') {
	const g = GUIDE[code] ?? GUIDE.en;
	return `
    <div class="ds-pair${cls ? ` ${cls}` : ''}">
      <div class="ds ds-dark"><p class="ds-theme">${g.dark}</p>${build('d')}</div>
      <div class="ds ds-light" aria-hidden="true" inert><p class="ds-theme">${g.light}</p>${build('l')}</div>
    </div>`;
}

/** A list of rules, each with an example of how to and how not to. */
export function doDont(code: string, items: { rule: string; do: string; dont: string; note?: string }[]) {
	const g = GUIDE[code] ?? GUIDE.en;
	return `    <ul class="rows brand-voice">
${items.map((v) => `      <li><b>${v.rule}</b>${v.note ? `<p>${v.note}</p>` : ''}<p><span class="ok">${g.doLabel}:</span> ${esc(v.do)}</p><p><span class="no">${g.dontLabel}:</span> ${esc(v.dont)}</p></li>`).join('\n')}
    </ul>`;
}

/** A plain table: a head row and rows of cells, which are HTML. */
export function table(head: string[], rows: string[][], cls = '') {
	return `    <div class="table-wrap" tabindex="0"><table${cls ? ` class="${cls}"` : ''}>
      <thead><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr></thead>
      <tbody>
${rows.map((r) => `        <tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('\n')}
      </tbody>
    </table></div>`;
}
