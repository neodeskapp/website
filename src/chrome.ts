// The header and the footer of every page: the home page, the docs and every other page
// use these two, so they have the same height, the logo at the same spot and the same
// entries in the same order. Their styles are in src/chrome.css, which the build puts in
// front of site.css and into the home page's own styles.
import type { Strings, Locale } from './i18n.ts';
import type { SiteConfig } from './types.ts';
import type { SitePageSlug } from './pages.ts';

const esc = (s: unknown) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export interface ChromeOptions {
	config: SiteConfig;
	t: Strings;
	locale: Locale;
	/** The home page in the page's language */
	home: string;
	/** The docs index in the page's language */
	docs: string;
	/** The brand page in the page's language; a right-click on the logo opens it */
	brand: string;
	/** The download page in the page's language */
	download: string;
	/** The site's small pages (src/pages.ts) in the page's language: address and name */
	pages: Record<SitePageSlug, { href: string; title: string }>;
	/** The same page in the other languages, for the language entry */
	languages: { locale: Locale; href: string }[];
	/** Controls a kind of page adds between the logo and the entries, such as the docs' search */
	tools?: string;
}

/**
 * A right-click on the logo, or the context menu key or Shift+F10 while it has focus,
 * opens the brand page instead of the browser's menu. A left click still goes home, and
 * nothing else on the page changes.
 */
const LOGO_SCRIPT =
	"(function(){var a=document.querySelector('header.top .logo');if(!a)return;function go(e){e.preventDefault();location.href=a.getAttribute('data-brand');}a.addEventListener('contextmenu',go);a.addEventListener('keydown',function(e){if(e.key==='ContextMenu'||(e.key==='F10'&&e.shiftKey))go(e);});})();";

/** The entries of the header, in their order: Docs, Download, Compare, Use cases, Support, Discord, GitHub, then the other languages. */
function entries(o: ChromeOptions) {
	return [
		`<a href="${esc(o.docs)}">${esc(o.t.docs)}</a>`,
		`<a href="${esc(o.download)}">${esc(o.t.download)}</a>`,
		`<a href="${esc(o.docs)}compare/">${esc(o.t.compare)}</a>`,
		`<a href="${esc(o.docs)}use-cases/">${esc(o.t.useCases)}</a>`,
		`<a href="${esc(o.pages.support.href)}">${esc(o.pages.support.title)}</a>`,
		`<a href="${esc(o.config.discord)}" rel="noopener">Discord</a>`,
		`<a href="${esc(o.config.repo)}" rel="noopener">GitHub</a>`,
		...o.languages.map((l) => `<a class="top-lang" href="${esc(l.href)}" hreflang="${l.locale.code}" lang="${l.locale.code}">${esc(l.locale.label)}</a>`)
	].join('');
}

/**
 * The header. Wide screens show the entries in a row; narrow screens put them in a menu,
 * a <details> element, so it opens without scripts.
 */
export function siteHeader(o: ChromeOptions) {
	const links = entries(o);
	return `<header class="top">
  <a class="logo" href="${esc(o.home)}" data-brand="${esc(o.brand)}" aria-label="${esc(o.t.homeLabel.replace('{name}', o.config.name))}">
    <img class="only-dark" src="/img/logo-on-dark.svg" alt="${esc(o.config.name)}" width="118" height="28">
    <img class="only-light" src="/img/logo-on-light.svg" alt="${esc(o.config.name)}" width="118" height="28">
  </a>
  <div class="top-tools">${o.tools ?? ''}</div>
  <nav class="top-nav" aria-label="${esc(o.t.site)}">${links}</nav>
  <details class="top-menu">
    <summary>${esc(o.t.menu)}</summary>
    <nav class="top-menu-panel" aria-label="${esc(o.t.site)}">${links}</nav>
  </details>
</header>
<script>${LOGO_SCRIPT}</script>`;
}

/** The flag of the European Union, 3:2, with its twelve stars */
const EU_FLAG =
	'<svg class="eu-flag" width="21" height="14" viewBox="0 0 30 20" aria-hidden="true" focusable="false"><rect class="eu-field" width="30" height="20"></rect><path class="eu-stars" d="M15.000,2.083L15.281,2.947L16.189,2.947L15.454,3.481L15.735,4.345L15.000,3.811L14.265,4.345L14.546,3.481L13.811,2.947L14.719,2.947ZM18.333,2.976L18.614,3.840L19.522,3.840L18.787,4.374L19.068,5.238L18.333,4.704L17.599,5.238L17.879,4.374L17.145,3.840L18.053,3.840ZM20.774,5.417L21.054,6.280L21.962,6.280L21.228,6.814L21.508,7.678L20.774,7.144L20.039,7.678L20.319,6.814L19.585,6.280L20.493,6.280ZM21.667,8.750L21.947,9.614L22.855,9.614L22.121,10.148L22.401,11.011L21.667,10.477L20.932,11.011L21.213,10.148L20.478,9.614L21.386,9.614ZM20.774,12.083L21.054,12.947L21.962,12.947L21.228,13.481L21.508,14.345L20.774,13.811L20.039,14.345L20.319,13.481L19.585,12.947L20.493,12.947ZM18.333,14.524L18.614,15.387L19.522,15.387L18.787,15.921L19.068,16.785L18.333,16.251L17.599,16.785L17.879,15.921L17.145,15.387L18.053,15.387ZM15.000,15.417L15.281,16.280L16.189,16.280L15.454,16.814L15.735,17.678L15.000,17.144L14.265,17.678L14.546,16.814L13.811,16.280L14.719,16.280ZM11.667,14.524L11.947,15.387L12.855,15.387L12.121,15.921L12.401,16.785L11.667,16.251L10.932,16.785L11.213,15.921L10.478,15.387L11.386,15.387ZM9.226,12.083L9.507,12.947L10.415,12.947L9.681,13.481L9.961,14.345L9.226,13.811L8.492,14.345L8.772,13.481L8.038,12.947L8.946,12.947ZM8.333,8.750L8.614,9.614L9.522,9.614L8.787,10.148L9.068,11.011L8.333,10.478L7.599,11.011L7.879,10.148L7.145,9.614L8.053,9.614ZM9.226,5.417L9.507,6.280L10.415,6.280L9.681,6.814L9.961,7.678L9.226,7.144L8.492,7.678L8.772,6.814L8.038,6.280L8.946,6.280ZM11.667,2.976L11.947,3.840L12.855,3.840L12.121,4.374L12.401,5.238L11.667,4.704L10.932,5.238L11.213,4.374L10.478,3.840L11.386,3.840Z"></path></svg>';

/**
 * The footer: what NeoDesk is with "Made in the EU" under it, the links in four groups
 * (the product, help, the project, the legal pages), and the wordmark.
 */
export function siteFooter(o: ChromeOptions) {
	const { config, t } = o;
	const group = (label: string, links: [string, string, boolean?][]) =>
		`      <div class="foot-group">
        <p class="foot-label">${esc(label)}</p>
        <ul>
${links.map(([href, text, outside]) => `          <li><a href="${esc(href)}"${outside ? ' rel="noopener"' : ''}>${esc(text)}</a></li>`).join('\n')}
        </ul>
      </div>`;
	return `<footer class="foot">
  <div class="foot-top">
    <div class="foot-about">
      <p>${t.footer}</p>
      <p class="eu-made">${EU_FLAG}${esc(t.madeInEu)}</p>
    </div>
    <nav class="foot-nav" aria-label="${esc(t.more)}">
${group(t.footProduct, [
	[o.docs, t.docs],
	[o.download, t.download],
	[o.pages.releases.href, o.pages.releases.title],
	[`${o.docs}compare/`, t.compare],
	[`${o.docs}use-cases/`, t.useCases]
])}
${group(t.footHelp, [
	[o.pages.support.href, o.pages.support.title],
	[o.pages.security.href, o.pages.security.title],
	[config.discord, 'Discord', true]
])}
${group(t.footProject, [
	[config.repo, 'GitHub', true],
	[`${config.repo}/blob/main/CHANGELOG.md`, t.changelog, true],
	[o.brand, t.brand],
	['/llms.txt', 'llms.txt']
])}
${group(t.footLegal, [
	[o.pages.imprint.href, o.pages.imprint.title],
	[o.pages.privacy.href, o.pages.privacy.title]
])}
    </nav>
  </div>
  <img class="wordmark only-dark" src="/img/logo-on-dark.svg" alt="" width="562" height="133" loading="lazy" decoding="async">
  <img class="wordmark only-light" src="/img/logo-on-light.svg" alt="" width="562" height="133" loading="lazy" decoding="async">
</footer>`;
}
