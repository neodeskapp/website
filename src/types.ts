// The shapes the build passes between its parts.

export interface SectionConfig {
	slug: string;
	label: string;
	intro: string;
}

export interface SiteConfig {
	name: string;
	url: string;
	repo: string;
	versionUrl: string;
	version: string;
	editBase: string;
	summary: string;
	sections: SectionConfig[];
}

export interface Heading {
	level: number;
	id: string;
	text: string;
	line: number;
}

export interface Page {
	file: string;
	rel: string;
	slug: string;
	section: string;
	parent?: string;
	title: string;
	description: string;
	order: number;
	body: string;
	updated: string | null;
	headings: Heading[];
	links: string[];
	html: string;
}

export interface Section extends SectionConfig {
	items: Page[];
}

export interface Shared {
	config: SiteConfig;
	sections: Section[];
	assets: Record<string, string>;
	version: string;
	siteUrl: string;
}

export interface Pager {
	label: string;
	title: string;
	href: string;
}
