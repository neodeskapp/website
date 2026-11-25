// The shapes the build passes between its parts.
import type { Locale, Strings } from './i18n.ts';
import type { Urls } from './urls.ts';

export interface SectionConfig {
	slug: string;
	label: string;
	/** The paragraph on the section's own page */
	intro: string;
	/** The meta description, at most 155 characters, when the intro is longer */
	description?: string;
}

export interface SiteConfig {
	name: string;
	url: string;
	/** Where the docs are served on production: their own host */
	docsUrl: string;
	repo: string;
	discord: string;
	license: string;
	downloadUrl: string;
	versionUrl: string;
	version: string;
	clientRepo: string;
	clientReleasesUrl: string;
	editBase: string;
	aiCrawlers: string[];
	summary: string;
	sections: SectionConfig[];
}

export interface Heading {
	level: number;
	id: string;
	/** Old ids that still lead to this heading */
	aliases: string[];
	text: string;
	line: number;
}

export interface Page {
	file: string;
	rel: string;
	/** The language code of the page */
	locale: string;
	slug: string;
	section: string;
	parent?: string;
	title: string;
	description: string;
	order: number;
	body: string;
	/** When the file last changed, from git */
	updated: string;
	/** The line of the file where the body starts. */
	bodyLine: number;
	headings: Heading[];
	links: string[];
	html: string;
	/** The link preview template, from front matter `og`; docs by default */
	og?: string;
	/** For the comparison template: the other product, from front matter `product` */
	product?: string;
	/** Front matter `logo`: a file in public/img/compare, shown before the page's row in section lists */
	logo?: string;
	/** For the release template: the version, from front matter `release` */
	release?: string;
	/** Front matter `seoTitle`: the whole <title>, when the page's title alone is not what people search for */
	seoTitle?: string;
	/** Front matter `related`: docs pages for "See also", by address; translations take the English page's */
	related?: string[];
	/** Front matter `howto`: the ids of the headings that are the steps, in order, for HowTo structured data */
	howto?: string[];
	/**
	 * Front matter `fold: true`: the sidebar lists this page's children only on the page
	 * and its children, and the section page and the docs index leave them out
	 */
	fold?: boolean;
	/**
	 * Front matter `quoted: true`: the page quotes NeoDesk's own help text, so its inline
	 * code keeps NeoDesk's placeholders (`--file PATH`, `{id}`); see src/commands.ts
	 */
	quoted?: boolean;
}

export interface Section extends SectionConfig {
	items: Page[];
}

export interface Shared {
	config: SiteConfig;
	/** The sections of the page's language, with their pages */
	sections: Section[];
	assets: Record<string, string>;
	version: string;
	siteUrl: string;
	/** The www and docs hosts, and the address of every logical address (src/urls.ts) */
	urls: Urls;
	/** Whether this build is for the production address, which search engines may index */
	production: boolean;
	locale: Locale;
	t: Strings;
	/** The languages that have a page at this address, given without the language prefix */
	versions: (path: string) => Locale[];
	/** The link preview image of a page, by its full address (/de/docs/... for German) */
	previewOf: (path: string) => { url: string; alt: string } | undefined;
}

export interface Pager {
	label: string;
	title: string;
	href: string;
}
