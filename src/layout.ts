// The HTML around the docs: one frame, and the kinds of page inside it.
import type { Page, Pager, Section, Shared } from './types.ts';
import { DEFAULT_LOCALE, fill } from './i18n.ts';

export const esc = (s: unknown) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const SEARCH_ICON =
	'<svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="8.5" cy="8.5" r="5.5"/><path d="M12.8 12.8 17 17"/></svg>';

const formatDate = (iso: string, dateLocale: string) =>
	new Date(iso).toLocaleDateString(dateLocale, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

/** An address of the site in the page's language: /docs/ becomes /de/docs/ in German. */
const inLocale = (shared: Shared, p: string) => `${shared.locale.prefix}${p}`;

/**
 * The <link rel="alternate" hreflang> tags of a page: one for every language that has it,
 * and x-default for the default language's version.
 */
export function hreflangLinks(shared: Pick<Shared, 'siteUrl' | 'versions'>, p: string) {
	const versions = shared.versions(p);
	if (!versions.length) return '';
	const links = versions.map((l) => `<link rel="alternate" hreflang="${l.code}" href="${esc(`${shared.siteUrl}${l.prefix}${p}`)}">`);
	const fallback = versions.find((l) => l.default) ?? versions[0];
	links.push(`<link rel="alternate" hreflang="x-default" href="${esc(`${shared.siteUrl}${fallback.prefix}${p}`)}">`);
	return links.join('\n');
}

/** Links to the same page in the other languages; nothing while a page has one language only. */
export function languageSwitch(shared: Pick<Shared, 'versions' | 'locale' | 't'>, p: string) {
	const others = shared.versions(p).filter((l) => l.code !== shared.locale.code);
	if (!others.length) return '';
	return `<nav class="lang-switch" aria-label="${esc(shared.t.language)}">${others
		.map((l) => `<a href="${esc(`${l.prefix}${p}`)}" hreflang="${l.code}" lang="${l.code}">${esc(l.label)}</a>`)
		.join('')}</nav>`;
}

function sidebar(shared: Shared, current: string) {
	return shared.sections
		.map(
			(s) => `<div class="side-section">
      <p class="side-label"><a href="${inLocale(shared, `/docs/${s.slug}/`)}"${current === s.slug ? ' aria-current="page"' : ''}>${esc(s.label)}</a></p>
      <ul>
${s.items
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
}

function frame(o: FrameOptions) {
	const { config, assets, siteUrl, production, locale, t, title, description, current, main, toc = '', markdown, jsonLd, type = 'website', noindex = false } = o;
	const full = o.fullTitle ?? fill(t.pageTitle, { title, name: config.name });
	const own = inLocale(o, o.path);
	const canonical = `${siteUrl}${own}`;
	const docsHome = inLocale(o, '/docs/');
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
<meta property="og:type" content="${type}">
<meta property="og:site_name" content="${esc(config.name)}">
<meta property="og:title" content="${esc(full)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(canonical)}">
${markdown ? `<link rel="alternate" type="text/markdown" href="${esc(markdown)}">` : ''}
<link rel="icon" href="/img/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/fonts/IBMPlexSans-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${assets['site.css']}">
<link rel="stylesheet" href="${assets['docs.css']}">
<noscript><style>.copy, .search-button, .menu-button { display: none !important; } @media (max-width: 860px) { .layout { display: flex !important; flex-direction: column; } .sidebar { display: block; position: static; order: 2; border-top: 1px solid var(--rule); } .top-docs, .top-links { display: inline-block; } }</style></noscript>
${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>` : ''}
<script src="${assets['docs.js']}" defer></script>
</head>
<body>
<a class="skip" href="#content">${esc(t.skip)}</a>

<header class="top">
  <button type="button" class="menu-button" aria-controls="sidebar" aria-expanded="false">${esc(t.menu)}</button>
  <a class="logo" href="${inLocale(o, '/')}" aria-label="${esc(config.name)} ${esc(t.home.toLowerCase())}">
    <img class="only-dark" src="/img/logo-on-dark.svg" alt="${esc(config.name)}" width="118" height="28">
    <img class="only-light" src="/img/logo-on-light.svg" alt="${esc(config.name)}" width="118" height="28">
  </a>
  <a class="top-docs" href="${docsHome}">${esc(t.docs)}</a>
  <button type="button" class="search-button" aria-haspopup="dialog">${SEARCH_ICON}<span>${esc(t.searchDocs)}</span><kbd>${esc(t.searchKey)}</kbd></button>
${noindex || !languageSwitch(o, o.path) ? '' : `  ${languageSwitch(o, o.path)}\n`}  <nav class="top-links" aria-label="${esc(t.site)}">
    <a href="${esc(config.repo)}" rel="noopener">GitHub</a>
  </nav>
</header>

<div class="layout${toc ? '' : ' no-toc'}">
  <nav id="sidebar" class="sidebar" aria-label="${esc(t.documentation)}">
    ${sidebar(o, current)}
  </nav>
  <main id="content" class="article">
${main}
  </main>
  ${toc}
</div>

<footer class="foot">
  <p>${t.footer}</p>
  <nav aria-label="${esc(t.more)}">
    <a href="${docsHome}">${esc(t.docs)}</a>
    <a href="/llms.txt">llms.txt</a>
    <a href="${esc(config.repo)}/blob/main/CHANGELOG.md" rel="noopener">${esc(t.changelog)}</a>
    <a href="${esc(config.repo)}/blob/main/SECURITY.md" rel="noopener">${esc(t.security)}</a>
    <a href="${esc(config.repo)}" rel="noopener">GitHub</a>
  </nav>
</footer>

<dialog class="search" aria-label="${esc(t.searchDocs)}">
  <div class="search-field">
    ${SEARCH_ICON}
    <input type="search" id="search-input" placeholder="${esc(t.searchDocs)}" aria-label="${esc(t.searchDocs)}" autocomplete="off" spellcheck="false" aria-controls="search-results">
    <button type="button" class="search-close">${esc(t.close)}</button>
  </div>
  <ul id="search-results" role="listbox" aria-label="${esc(t.results)}"></ul>
  <p class="search-status" role="status" aria-live="polite">${esc(t.searchHint)}</p>
</dialog>
</body>
</html>
`;
}

function rows(shared: Shared, items: Page[]) {
	return `<ul class="rows">
${items
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
	itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: `${shared.siteUrl}${inLocale(shared, c.path)}` }))
});

export function docsIndexPage(shared: Shared) {
	const { sections, version, t, config } = shared;
	const main = `    <div class="docs-home">
      <h1 class="display">${esc(t.documentation)}</h1>
      <p class="lead">${esc(t.docsLead)} ${esc(fill(t.writtenFor, { version }))}</p>
      <p><button type="button" class="search-button search-button-wide" aria-haspopup="dialog">${SEARCH_ICON}<span>${esc(t.searchDocs)}</span><kbd>${esc(t.searchKey)}</kbd></button></p>
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
		description: t.docsDescription,
		path: '/docs/',
		current: '',
		main
	});
}

export function sectionPage(shared: Shared & { section: Section }) {
	const { section, t } = shared;
	const main = `    <div class="crumb"><span><a href="${inLocale(shared, '/docs/')}">${esc(t.docs)}</a></span><span class="crumb-actions"><a href="${inLocale(shared, `/docs/${section.slug}.md`)}">Markdown</a></span></div>
    <h1>${esc(section.label)}</h1>
    <p class="lead">${esc(section.intro)}</p>
    ${rows(shared, section.items)}`;
	return frame({
		...shared,
		title: section.label,
		description: section.intro,
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
	const { page, sectionLabel, prev, next, config, siteUrl, t, locale } = shared;
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
		`<a href="${inLocale(shared, `/docs/${page.slug}.md`)}">Markdown</a>`,
		config.editBase ? `<a href="${esc(config.editBase)}/${page.slug}.md" rel="noopener">${esc(t.editOnGitHub)}</a>` : ''
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
    <h1>${esc(page.title)}</h1>
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
				url: `${siteUrl}${inLocale(shared, `/docs/${page.slug}/`)}`,
				inLanguage: locale.code,
				dateModified: page.updated
			}
		]
	});
}

export function notFoundPage(shared: Shared) {
	const { t } = shared;
	const main = `    <h1>${esc(t.notFound)}</h1>
    <p class="lead">${esc(t.notFoundLead)}</p>
    <p><button type="button" class="search-button search-button-wide" aria-haspopup="dialog">${SEARCH_ICON}<span>${esc(t.searchDocs)}</span><kbd>${esc(t.searchKey)}</kbd></button></p>
    <ul class="rows">
      <li><a href="${inLocale(shared, '/docs/')}">${esc(t.documentation)}</a><p>${esc(t.everySection)}</p></li>
      <li><a href="${inLocale(shared, '/')}">${esc(t.home)}</a><p>${esc(t.whatItIs)}</p></li>
    </ul>`;
	return frame({ ...shared, title: t.notFound, description: t.notFoundDescription, path: '/404.html', current: '', main, noindex: true });
}

export { DEFAULT_LOCALE };
