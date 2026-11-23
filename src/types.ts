// The shapes the build passes between its parts.
import type { Locale, Strings } from './i18n.ts';

export interface SectionConfig {
	slug: string;
	label: string;
	intro: string;
}

export interface SiteConfig {
	name: string;
	url: string;
	repo: string;
	license: string;
	downloadUrl: string;
	versionUrl: string;
	version: string;
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
	/** Whether this build is for the production address, which search engines may index */
	production: boolean;
	locale: Locale;
	t: Strings;
	/** The languages that have a page at this address, given without the language prefix */
	versions: (path: string) => Locale[];
}

export interface Pager {
	label: string;
	title: string;
	href: string;
}
