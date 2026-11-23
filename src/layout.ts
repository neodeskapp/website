// The HTML around the docs: one frame, and the three kinds of page inside it.
import type { Page, Pager, Section, Shared } from './types.ts';

export const esc = (s: unknown) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const SEARCH_ICON =
	'<svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="8.5" cy="8.5" r="5.5"/><path d="M12.8 12.8 17 17"/></svg>';

const formatDate = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

function sidebar(sections: Section[], current: string) {
	return sections
		.map(
			(s) => `<div class="side-section">
      <p class="side-label"><a href="/docs/${s.slug}/"${current === s.slug ? ' aria-current="page"' : ''}>${esc(s.label)}</a></p>
      <ul>
${s.items
	.map((p) => `        <li${p.parent ? ' class="child"' : ''}><a href="/docs/${p.slug}/"${current === p.slug ? ' aria-current="page"' : ''}>${esc(p.title)}</a></li>`)
	.join('\n')}
      </ul>
    </div>`
		)
		.join('\n    ');
}

interface FrameOptions extends Shared {
	title: string;
	description: string;
	path: string;
	current: string;
	main: string;
	toc?: string;
	markdown?: string;
	jsonLd?: object;
	type?: string;
	noindex?: boolean;
}

function frame({ config, sections, assets, siteUrl, production, title, description, path, current, main, toc = '', markdown, jsonLd, type = 'website', noindex = false }: FrameOptions) {
	const full = title === 'Documentation' ? `${config.name} documentation` : `${title} - ${config.name} docs`;
	const canonical = `${siteUrl}${path}`;
	return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(full)}</title>
<meta name="description" content="${esc(description)}">
<meta name="color-scheme" content="dark light">
<meta name="theme-color" content="#141616" media="(prefers-color-scheme: dark)">
<meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">
${noindex || !production ? '<meta name="robots" content="noindex">\n' : ''}${noindex ? '' : `<link rel="canonical" href="${esc(canonical)}">`}
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
<a class="skip" href="#content">Skip to the content</a>

<header class="top">
  <button type="button" class="menu-button" aria-controls="sidebar" aria-expanded="false">Menu</button>
  <a class="logo" href="/" aria-label="${esc(config.name)} home">
    <img class="only-dark" src="/img/logo-on-dark.svg" alt="${esc(config.name)}" width="118" height="28">
    <img class="only-light" src="/img/logo-on-light.svg" alt="${esc(config.name)}" width="118" height="28">
  </a>
  <a class="top-docs" href="/docs/">Docs</a>
  <button type="button" class="search-button" aria-haspopup="dialog">${SEARCH_ICON}<span>Search the docs</span><kbd>Ctrl K</kbd></button>
  <nav class="top-links" aria-label="Site">
    <a href="${esc(config.repo)}" rel="noopener">GitHub</a>
  </nav>
</header>

<div class="layout${toc ? '' : ' no-toc'}">
  <nav id="sidebar" class="sidebar" aria-label="Documentation">
    ${sidebar(sections, current)}
  </nav>
  <main id="content" class="article">
${main}
  </main>
  ${toc}
</div>

<footer class="foot">
  <p>NeoDesk started as a fork of <a href="https://github.com/UNITRONIX/BetterDesk" rel="noopener">BetterDesk</a> by UNITRONIX and works with RustDesk clients. Open source under AGPL-3.0.</p>
  <nav aria-label="More">
    <a href="/docs/">Docs</a>
    <a href="/llms.txt">llms.txt</a>
    <a href="${esc(config.repo)}/blob/main/CHANGELOG.md" rel="noopener">Changelog</a>
    <a href="${esc(config.repo)}/blob/main/SECURITY.md" rel="noopener">Security</a>
    <a href="${esc(config.repo)}" rel="noopener">GitHub</a>
  </nav>
</footer>

<dialog class="search" aria-label="Search the docs">
  <div class="search-field">
    ${SEARCH_ICON}
    <input type="search" id="search-input" placeholder="Search the docs" aria-label="Search the docs" autocomplete="off" spellcheck="false" aria-controls="search-results">
    <button type="button" class="search-close">Close</button>
  </div>
  <ul id="search-results" role="listbox" aria-label="Results"></ul>
  <p class="search-status" role="status" aria-live="polite">Type to search every page and section.</p>
</dialog>
</body>
</html>
`;
}

function rows(items: Page[]) {
	return `<ul class="rows">
${items
	.map(
		(p) => `      <li${p.parent ? ' class="child"' : ''}><a href="/docs/${p.slug}/">${esc(p.title)}</a>${p.description ? `<p>${esc(p.description)}</p>` : ''}</li>`
	)
	.join('\n')}
    </ul>`;
}

const crumbList = (siteUrl: string, crumbs: { name: string; path: string }[]) => ({
	'@context': 'https://schema.org',
	'@type': 'BreadcrumbList',
	itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: `${siteUrl}${c.path}` }))
});

export function docsIndexPage(shared: Shared) {
	const { sections, version } = shared;
	const main = `    <div class="docs-home">
      <h1 class="display">Documentation</h1>
      <p class="lead">How to install NeoDesk, connect RustDesk clients to it and run it. Written for version ${esc(version)}.</p>
      <p><button type="button" class="search-button search-button-wide" aria-haspopup="dialog">${SEARCH_ICON}<span>Search the docs</span><kbd>Ctrl K</kbd></button></p>
    </div>
${sections
	.map(
		(s) => `    <section class="docs-section">
      <h2><a href="/docs/${s.slug}/">${esc(s.label)}</a></h2>
      <p class="section-intro">${esc(s.intro)}</p>
      ${rows(s.items)}
    </section>`
	)
	.join('\n')}`;
	return frame({
		...shared,
		title: 'Documentation',
		description: 'How to install NeoDesk, connect RustDesk clients to it and run it.',
		path: '/docs/',
		current: '',
		main
	});
}

export function sectionPage(shared: Shared & { section: Section }) {
	const { section, siteUrl } = shared;
	const main = `    <div class="crumb"><span><a href="/docs/">Docs</a></span><span class="crumb-actions"><a href="/docs/${section.slug}.md">Markdown</a></span></div>
    <h1>${esc(section.label)}</h1>
    <p class="lead">${esc(section.intro)}</p>
    ${rows(section.items)}`;
	return frame({
		...shared,
		title: section.label,
		description: section.intro,
		path: `/docs/${section.slug}/`,
		current: section.slug,
		main,
		markdown: `/docs/${section.slug}.md`,
		jsonLd: crumbList(siteUrl, [
			{ name: 'Docs', path: '/docs/' },
			{ name: section.label, path: `/docs/${section.slug}/` }
		])
	});
}

export function docPage(shared: Shared & { page: Page; sectionLabel: string; prev: Pager | null; next: Pager | null }) {
	const { page, sectionLabel, prev, next, config, siteUrl } = shared;
	const tocItems = page.headings.filter((h) => h.level === 2 || h.level === 3);
	const toc =
		tocItems.length >= 2
			? `<aside class="toc" aria-label="On this page">
    <p class="toc-label">On this page</p>
    <ul>
${tocItems.map((h) => `      <li${h.level === 3 ? ' class="sub"' : ''}><a href="#${h.id}">${esc(h.text)}</a></li>`).join('\n')}
    </ul>
  </aside>`
			: '';
	const actions = [
		page.updated ? `<span>Updated <time datetime="${page.updated}">${formatDate(page.updated)}</time></span>` : '',
		`<a href="/docs/${page.slug}.md">Markdown</a>`,
		config.editBase ? `<a href="${esc(config.editBase)}/${page.slug}.md" rel="noopener">Edit on GitHub</a>` : ''
	]
		.filter(Boolean)
		.join('\n        ');
	const pagerLink = (p: Pager | null, cls: string) => (p ? `<a class="${cls}" href="${p.href}"><span>${esc(p.label)}</span>${esc(p.title)}</a>` : '<span></span>');
	const main = `    <div class="crumb">
      <span><a href="/docs/">Docs</a> / <a href="/docs/${page.section}/">${esc(sectionLabel)}</a></span>
      <span class="crumb-actions">
        ${actions}
      </span>
    </div>
    <h1>${esc(page.title)}</h1>
    <div class="prose">
${page.html}
    </div>
    ${prev || next ? `<nav class="pager" aria-label="Previous and next page">${pagerLink(prev, 'pager-prev')}${pagerLink(next, 'pager-next')}</nav>` : ''}`;
	return frame({
		...shared,
		title: page.title,
		description: page.description,
		path: `/docs/${page.slug}/`,
		current: page.slug,
		main,
		toc,
		type: 'article',
		markdown: `/docs/${page.slug}.md`,
		jsonLd: [
			crumbList(siteUrl, [
				{ name: 'Docs', path: '/docs/' },
				{ name: sectionLabel, path: `/docs/${page.section}/` },
				{ name: page.title, path: `/docs/${page.slug}/` }
			]),
			{
				'@context': 'https://schema.org',
				'@type': 'TechArticle',
				headline: page.title,
				description: page.description,
				url: `${siteUrl}/docs/${page.slug}/`,
				...(page.updated ? { dateModified: page.updated } : {})
			}
		]
	});
}

export function notFoundPage(shared: Shared) {
	const main = `    <h1>Page not found</h1>
    <p class="lead">There is no page at this address. It may have moved.</p>
    <p><button type="button" class="search-button search-button-wide" aria-haspopup="dialog">${SEARCH_ICON}<span>Search the docs</span><kbd>Ctrl K</kbd></button></p>
    <ul class="rows">
      <li><a href="/docs/">Documentation</a><p>Every section and page.</p></li>
      <li><a href="/">Home</a><p>What NeoDesk is.</p></li>
    </ul>`;
	return frame({ ...shared, title: 'Page not found', description: 'There is no page at this address.', path: '/404.html', current: '', main, noindex: true });
}
