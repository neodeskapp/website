// The HTML around the docs: one frame, and the kinds of page inside it.
import type { Page, Pager, Section, Shared } from './types.ts';
import { DEFAULT_LOCALE, fill } from './i18n.ts';
import { siteHeader, siteFooter } from './chrome.ts';

export const esc = (s: unknown) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const SEARCH_ICON =
	'<svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="8.5" cy="8.5" r="5.5"/><path d="M12.8 12.8 17 17"/></svg>';

const CONTENTS_ICON =
	'<svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M8 5h9M8 10h9M8 15h9M3.5 5h.01M3.5 10h.01M3.5 15h.01" stroke-width="2.2"/></svg>';

/** The button that opens search. Its words are hidden on small screens, so it carries an aria-label. */
/**
 * Search. It is a link to the list of all pages, which is the search without scripts;
 * docs.js opens the search dialog on a click instead.
 */
const searchButton = (shared: Shared, wide = false) =>
	`<a class="search-button${wide ? ' search-button-wide' : ''}" href="${inLocale(shared, '/docs/all/')}" aria-haspopup="dialog" aria-label="${esc(shared.t.searchDocs)}">${SEARCH_ICON}<span>${esc(shared.t.searchDocs)}</span><kbd>${esc(shared.t.searchKey)}</kbd></a>`;

const formatDate =(iso: string, dateLocale: string) =>
	new Date(iso).toLocaleDateString(dateLocale, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

/** A logical address in the page's language: /docs/ becomes /de/docs/ in German. */
const logical = (shared: Pick<Shared, 'locale'>, p: string) => `${shared.locale.prefix}${p}`;
/** The address a visitor uses for a logical address in the page's language (see src/urls.ts). */
const inLocale = (shared: Shared, p: string) => shared.urls.url(logical(shared, p));

/**
 * The <link rel="alternate" hreflang> tags of a page: one for every language that has it,
 * and x-default for the default language's version.
 */
export function hreflangLinks(shared: Pick<Shared, 'urls' | 'versions'>, p: string) {
	const versions = shared.versions(p);
	if (!versions.length) return '';
	const links = versions.map((l) => `<link rel="alternate" hreflang="${l.code}" href="${esc(shared.urls.url(`${l.prefix}${p}`))}">`);
	const fallback = versions.find((l) => l.default) ?? versions[0];
	links.push(`<link rel="alternate" hreflang="x-default" href="${esc(shared.urls.url(`${fallback.prefix}${p}`))}">`);
	return links.join('\n');
}

/**
 * The Open Graph and Twitter tags of a page: title, description, address, type, site name,
 * language, and the link preview image with its size and alt text.
 */
export function socialTags(o: { type: string; siteName: string; title: string; description: string; url: string; locale: string; image?: { url: string; alt: string } }) {
	return [
		`<meta property="og:type" content="${esc(o.type)}">`,
		`<meta property="og:site_name" content="${esc(o.siteName)}">`,
		`<meta property="og:title" content="${esc(o.title)}">`,
		`<meta property="og:description" content="${esc(o.description)}">`,
		`<meta property="og:url" content="${esc(o.url)}">`,
		`<meta property="og:locale" content="${esc(o.locale)}">`,
		...(o.image
			? [
					`<meta property="og:image" content="${esc(o.image.url)}">`,
					'<meta property="og:image:type" content="image/png">',
					'<meta property="og:image:width" content="1200">',
					'<meta property="og:image:height" content="630">',
					`<meta property="og:image:alt" content="${esc(o.image.alt)}">`
				]
			: []),
		'<meta name="twitter:card" content="summary_large_image">'
	].join('\n');
}

/**
 * The pages a list shows: the children of a page with `fold: true` only while the reader
 * is on that page or one of its children (current), and never in lists without a current page.
 */
function unfolded(items: Page[], current = ''): Page[] {
	const folded = new Set(items.filter((p) => p.fold).map((p) => p.slug));
	const open = items.find((p) => p.slug === current)?.parent ?? current;
	return items.filter((p) => !p.parent || !folded.has(p.parent) || p.parent === open);
}

function sidebar(shared: Shared, current: string) {
	return shared.sections
		.map(
			(s) => `<div class="side-section">
      <p class="side-label"><a href="${inLocale(shared, `/docs/${s.slug}/`)}"${current === s.slug ? ' aria-current="page"' : ''}>${esc(s.label)}</a></p>
      <ul>
${unfolded(s.items, current)
	.map(
		(p) =>
			`        <li${p.parent ? ' class="child"' : ''}><a href="${inLocale(shared, `/docs/${p.slug}/`)}"${current === p.slug ? ' aria-current="page"' : ''}>${esc(p.title)}</a></li>`
	)
	.join('\n')}
      </ul>
    </div>`
		)
		.join('\n    ');
}

interface FrameOptions extends Shared {
	/** The page's own title; the frame adds the site's name */
	title: string;
	description: string;
	/** The page's address without the language prefix, such as /docs/console/ */
	path: string;
	current: string;
	main: string;
	toc?: string;
	markdown?: string;
	jsonLd?: object;
	type?: string;
	noindex?: boolean;
	/** The docs index has a title of its own */
	fullTitle?: string;
	/** Whether the page's h1 is set in Funnel Display, so that font is loaded early */
	display?: boolean;
}

function frame(o: FrameOptions) {
	const { config, assets, production, locale, t, title, description, current, main, toc = '', markdown, jsonLd, type = 'website', noindex = false } = o;
	const full = o.fullTitle ?? fill(t.pageTitle, { title, name: config.name });
	const own = logical(o, o.path);
	const canonical = o.urls.url(own);
	const docsHome = inLocale(o, '/docs/');
	// The search dialog is on the docs host's pages; elsewhere search is the link to all pages
	const docsHost = o.urls.isDocsFile(o.urls.distOf(own.slice(1)));
	// The docs add the button that opens the sidebar on narrow screens, and search
	const tools = `<button type="button" class="menu-button" aria-controls="sidebar" aria-expanded="false" aria-label="${esc(t.contents)}">${CONTENTS_ICON}</button>${searchButton(o)}`;
	const chrome = {
		config,
		t,
		locale,
		home: inLocale(o, '/'),
		docs: docsHome,
		languages: noindex ? [] : o.versions(o.path).filter((l) => l.code !== locale.code).map((l) => ({ locale: l, href: o.urls.url(`${l.prefix}${o.path}`) })),
		tools
	};
	return `<!doctype html>
<html lang="${locale.code}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(full)}</title>
<meta name="description" content="${esc(description)}">
<meta name="color-scheme" content="dark light">
<meta name="theme-color" content="#141616" media="(prefers-color-scheme: dark)">
<meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">
${noindex || !production ? '<meta name="robots" content="noindex">\n' : ''}${noindex ? '' : `<link rel="canonical" href="${esc(canonical)}">\n${hreflangLinks(o, o.path)}`}
${socialTags({ type, siteName: config.name, title: full, description, url: canonical, locale: locale.ogLocale, image: o.previewOf(own) })}
${markdown ? `<link rel="alternate" type="text/markdown" href="${esc(markdown)}">` : ''}
<link rel="icon" href="/img/favicon.svg" type="image/svg+xml">
${o.display ? '<link rel="preload" href="/fonts/FunnelDisplay-latin.woff2" as="font" type="font/woff2" crossorigin>\n' : ''}<link rel="preload" href="/fonts/IBMPlexSans-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${assets['site.css']}">
<link rel="stylesheet" href="${assets['docs.css']}">
<noscript><style>.copy, .menu-button, .search-button kbd { display: none !important; } @media (max-width: 860px) { .layout { display: flex !important; flex-direction: column; } .sidebar { display: block; position: static; order: 2; border-top: 1px solid var(--rule); } }</style></noscript>
${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>` : ''}
<script src="${assets['docs.js']}" defer></script>
<script defer src="https://stats.neode.sk/script.js" data-website-id="dfeff665-7d84-4338-adc7-dbae4e24d1a3" data-domains="neode.sk" data-do-not-track="true" data-exclude-search="true" data-exclude-hash="true"></script>
</head>
<body>
<a class="skip" href="#content">${esc(t.skip)}</a>

${siteHeader(chrome)}

<div class="layout${toc ? '' : ' no-toc'}">
  <nav id="sidebar" class="sidebar" aria-label="${esc(t.documentation)}">
    ${sidebar(o, current)}
  </nav>
  <main id="content" class="article">
${main}
  </main>
  ${toc}
</div>

${siteFooter(chrome)}

${docsHost ? `<dialog class="search" aria-label="${esc(t.searchDocs)}" data-index="${inLocale(o, '/docs/search.json')}" data-base="${esc(o.urls.url('/docs/'))}" data-groups="${esc([t.groupPages, t.groupSections, t.groupCommands, t.groupSettings].join('|'))}" data-results="${esc(t.resultsCount)}" data-nothing="${esc(t.nothingFound)}" data-failed="${esc(t.searchFailed)}">
  <div class="search-field">
    ${SEARCH_ICON}
    <input type="search" id="search-input" placeholder="${esc(t.searchDocs)}" aria-label="${esc(t.searchDocs)}" autocomplete="off" spellcheck="false" aria-controls="search-results">
    <button type="button" class="search-close">${esc(t.close)}</button>
  </div>
  <ul id="search-results" role="listbox" aria-label="${esc(t.results)}"></ul>
  <p class="search-status" role="status" aria-live="polite">${esc(t.searchHint)}</p>
</dialog>` : ''}
</body>
</html>
`;
}

/**
 * The title, with "Copy as Markdown" next to it: a plain link to the page's .md copy.
 * With scripts, docs.js copies the Markdown on a click instead of opening it.
 */
function pageHead(shared: Shared, title: string, markdownPath: string) {
	const href = inLocale(shared, markdownPath);
	return `<div class="page-head">
      <h1>${esc(title)}</h1>
      <a class="md-link" href="${href}" type="text/markdown" data-copied="${esc(shared.t.copied)}">${esc(shared.t.copyMarkdown)}</a>
    </div>`;
}

function rows(shared: Shared, items: Page[]) {
	return `<ul class="rows">
${unfolded(items)
	.map(
		(p) =>
			`      <li${p.parent ? ' class="child"' : ''}><a href="${inLocale(shared, `/docs/${p.slug}/`)}">${esc(p.title)}</a>${p.description ? `<p>${esc(p.description)}</p>` : ''}</li>`
	)
	.join('\n')}
    </ul>`;
}

const crumbList = (shared: Shared, crumbs: { name: string; path: string }[]) => ({
	'@context': 'https://schema.org',
	'@type': 'BreadcrumbList',
	itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: inLocale(shared, c.path) }))
});

export function docsIndexPage(shared: Shared) {
	const { sections, version, t, config } = shared;
	const main = `    <div class="docs-home">
      <h1 class="display">${esc(t.documentation)}</h1>
      <p class="lead">${esc(t.docsLead)} ${esc(fill(t.writtenFor, { version }))}</p>
      <p>${searchButton(shared, true)}</p>
      <p class="all-pages"><a href="${inLocale(shared, '/docs/all/')}">${esc(t.allPages)}</a></p>
    </div>
${sections
	.map(
		(s) => `    <section class="docs-section">
      <h2><a href="${inLocale(shared, `/docs/${s.slug}/`)}">${esc(s.label)}</a></h2>
      <p class="section-intro">${esc(s.intro)}</p>
      ${rows(shared, s.items)}
    </section>`
	)
	.join('\n')}`;
	return frame({
		...shared,
		title: t.documentation,
		fullTitle: fill(t.docsTitle, { name: config.name }),
		display: true,
		description: t.docsDescription,
		path: '/docs/',
		current: '',
		main
	});
}

/**
 * Every page of the docs in one list, by section, folded pages included. It is what
 * the search link opens without scripts, and a plain map of the docs.
 */
export function allPagesPage(shared: Shared) {
	const { sections, t } = shared;
	const main = `    <div class="crumb"><span><a href="${inLocale(shared, '/docs/')}">${esc(t.docs)}</a></span></div>
    ${pageHead(shared, t.allPages, '/docs/all.md')}
    <p class="lead">${esc(t.allPagesLead)}</p>
${sections
	.map(
		(s) => `    <section class="docs-section">
      <h2><a href="${inLocale(shared, `/docs/${s.slug}/`)}">${esc(s.label)}</a></h2>
      <ul class="all-list">
${s.items.map((p) => `        <li${p.parent ? ' class="child"' : ''}><a href="${inLocale(shared, `/docs/${p.slug}/`)}">${esc(p.title)}</a></li>`).join('\n')}
      </ul>
    </section>`
	)
	.join('\n')}`;
	return frame({
		...shared,
		title: t.allPages,
		description: t.allPagesDescription,
		path: '/docs/all/',
		current: '',
		main,
		markdown: inLocale(shared, '/docs/all.md'),
		jsonLd: crumbList(shared, [
			{ name: t.docs, path: '/docs/' },
			{ name: t.allPages, path: '/docs/all/' }
		])
	});
}

export function sectionPage(shared: Shared & { section: Section }) {
	const { section, t } = shared;
	const main = `    <div class="crumb"><span><a href="${inLocale(shared, '/docs/')}">${esc(t.docs)}</a></span></div>
    ${pageHead(shared, section.label, `/docs/${section.slug}.md`)}
    <p class="lead">${esc(section.intro)}</p>
    ${rows(shared, section.items)}`;
	return frame({
		...shared,
		title: section.label,
		description: section.description ?? section.intro,
		path: `/docs/${section.slug}/`,
		current: section.slug,
		main,
		markdown: inLocale(shared, `/docs/${section.slug}.md`),
		jsonLd: crumbList(shared, [
			{ name: t.docs, path: '/docs/' },
			{ name: section.label, path: `/docs/${section.slug}/` }
		])
	});
}

export function docPage(shared: Shared & { page: Page; sectionLabel: string; prev: Pager | null; next: Pager | null }) {
	const { page, sectionLabel, prev, next, config, t, locale } = shared;
	const tocItems = page.headings.filter((h) => h.level === 2 || h.level === 3);
	const toc =
		tocItems.length >= 2
			? `<aside class="toc" aria-label="${esc(t.onThisPage)}">
    <p class="toc-label">${esc(t.onThisPage)}</p>
    <ul>
${tocItems.map((h) => `      <li${h.level === 3 ? ' class="sub"' : ''}><a href="#${h.id}">${esc(h.text)}</a></li>`).join('\n')}
    </ul>
  </aside>`
			: '';
	const actions = [
		`<span>${esc(t.updated)} <time datetime="${page.updated}">${formatDate(page.updated, locale.dateLocale)}</time></span>`,
		// editBase points at content/docs; another language's files are in content/<code>/docs
		config.editBase ? `<a href="${esc(locale.default ? config.editBase : config.editBase.replace(/\/docs$/, `/${locale.code}/docs`))}/${page.slug}.md" rel="noopener">${esc(t.editOnGitHub)}</a>` : ''
	]
		.filter(Boolean)
		.join('\n        ');
	const pagerLink = (p: Pager | null, cls: string) => (p ? `<a class="${cls}" href="${p.href}"><span>${esc(p.label)}</span>${esc(p.title)}</a>` : '<span></span>');
	const main = `    <div class="crumb">
      <span><a href="${inLocale(shared, '/docs/')}">${esc(t.docs)}</a> / <a href="${inLocale(shared, `/docs/${page.section}/`)}">${esc(sectionLabel)}</a></span>
      <span class="crumb-actions">
        ${actions}
      </span>
    </div>
    ${pageHead(shared, page.title, `/docs/${page.slug}.md`)}
    <div class="prose">
${page.html}
    </div>
    ${prev || next ? `<nav class="pager" aria-label="${esc(t.pager)}">${pagerLink(prev, 'pager-prev')}${pagerLink(next, 'pager-next')}</nav>` : ''}`;
	return frame({
		...shared,
		title: page.title,
		description: page.description,
		path: `/docs/${page.slug}/`,
		current: page.slug,
		main,
		toc,
		type: 'article',
		markdown: inLocale(shared, `/docs/${page.slug}.md`),
		jsonLd: [
			crumbList(shared, [
				{ name: t.docs, path: '/docs/' },
				{ name: sectionLabel, path: `/docs/${page.section}/` },
				{ name: page.title, path: `/docs/${page.slug}/` }
			]),
			{
				'@context': 'https://schema.org',
				'@type': 'TechArticle',
				headline: page.title,
				description: page.description,
				url: inLocale(shared, `/docs/${page.slug}/`),
				inLanguage: locale.code,
				dateModified: page.updated
			}
		]
	});
}

export interface PreviewItem {
	/** The page's address, or none for a template that no page uses yet */
	page?: string;
	title: string;
	image: string;
	template: string;
	bytes: number;
}

/** The page that shows every link preview image with its title. Not in the sitemap, noindex. */
export function contactSheetPage(shared: Shared & { items: PreviewItem[]; templates: PreviewItem[] }) {
	const kb = (b: number) => `${Math.round(b / 1024)} KB`;
	const figure = (p: PreviewItem) => `      <figure class="og-item">
        <img src="${esc(p.image)}" width="600" height="315" alt="${esc(`The link preview of ${p.title}`)}" loading="lazy" decoding="async">
        <figcaption>${p.page ? `<a href="${esc(shared.urls.url(p.page))}">${esc(p.title)}</a>` : esc(p.title)}<span>${esc(p.template)}, ${kb(p.bytes)}</span></figcaption>
      </figure>`;
	const main = `    <h1>Link preview images</h1>
    <p class="lead">Every page's link preview, 1200 by 630 pixels, with the title the page gives it. ${shared.items.length} images.</p>
    <div class="og-grid">
${shared.items.map(figure).join('\n')}
    </div>
    <h2>Templates no page uses yet</h2>
    <p>These show sample text. A page uses one with <code>og: comparison</code>, <code>og: use-case</code> or <code>og: release</code> in its front matter.</p>
    <div class="og-grid">
${shared.templates.map(figure).join('\n')}
    </div>`;
	return frame({ ...shared, title: 'Link preview images', description: 'Every link preview image of the site with the title it shows.', path: '/og/', current: '', main, noindex: true });
}

/** The 404 page; path is where it lives, /404.html on the www host or /docs/404.html on the docs host. */
export function notFoundPage(shared: Shared, path = '/404.html') {
	const { t } = shared;
	const main = `    <h1>${esc(t.notFound)}</h1>
    <p class="lead">${esc(t.notFoundLead)}</p>
    <p>${searchButton(shared, true)}</p>
    <ul class="rows">
      <li><a href="${inLocale(shared, '/docs/')}">${esc(t.documentation)}</a><p>${esc(t.everySection)}</p></li>
      <li><a href="${inLocale(shared, '/')}">${esc(t.home)}</a><p>${esc(t.whatItIs)}</p></li>
    </ul>`;
	return frame({ ...shared, title: t.notFound, description: t.notFoundDescription, path, current: '', main, noindex: true, ...(path.startsWith('/docs/') ? {} : { fullTitle: `${t.notFound} - ${shared.config.name}` }) });
}

export { DEFAULT_LOCALE };
