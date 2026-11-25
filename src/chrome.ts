// The header and the footer of every page: the home page, the docs and every other page
// use these two, so they have the same height, the logo at the same spot and the same
// entries in the same order. Their styles are in src/chrome.css, which the build puts in
// front of site.css and into the home page's own styles.
import type { Strings, Locale } from './i18n.ts';
import type { SiteConfig } from './types.ts';

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

/** The entries of the header, in their order: Docs, Discord, GitHub, then the other languages. */
function entries(o: ChromeOptions) {
	return [
		`<a href="${esc(o.docs)}">${esc(o.t.docs)}</a>`,
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

/** The footer: one line about NeoDesk, the links, and the wordmark. */
export function siteFooter(o: ChromeOptions) {
	const { config, t } = o;
	return `<footer class="foot">
  <div class="foot-line">
    <p>${t.footer}</p>
    <nav aria-label="${esc(t.more)}">
      <a href="${esc(o.docs)}">${esc(t.docs)}</a>
      <a href="/llms.txt">llms.txt</a>
      <a href="${esc(config.repo)}/blob/main/CHANGELOG.md" rel="noopener">${esc(t.changelog)}</a>
      <a href="${esc(config.repo)}/blob/main/SECURITY.md" rel="noopener">${esc(t.security)}</a>
      <a href="${esc(config.discord)}" rel="noopener">Discord</a>
      <a href="${esc(config.repo)}" rel="noopener">GitHub</a>
      <a href="${esc(o.brand)}">${esc(t.brand)}</a>
    </nav>
  </div>
  <img class="wordmark only-dark" src="/img/logo-on-dark.svg" alt="" width="562" height="133" loading="lazy" decoding="async">
  <img class="wordmark only-light" src="/img/logo-on-light.svg" alt="" width="562" height="133" loading="lazy" decoding="async">
</footer>`;
}
