// The site's languages and the words of the frame around the pages.
//
// English is the default and lives at the root (/docs/...). Another language lives under
// its prefix (/de/docs/...) and gets pages only for the docs files that exist in
// content/<code>/docs. Until a language has files there, the build writes no page for it,
// and its strings below may stay empty. Once it has pages, every string must be there,
// or the build fails.

export interface Locale {
	/** The language code, also used for <html lang> and hreflang */
	code: string;
	/** The name of the language in that language, for the language switch */
	label: string;
	/** The path in front of every address in this language: '' for the default, '/de' for German */
	prefix: string;
	/** The locale dates are written in */
	dateLocale: string;
	/** The og:locale value */
	ogLocale: string;
	default?: boolean;
}

export const LOCALES: Locale[] = [
	{ code: 'en', label: 'English', prefix: '', dateLocale: 'en-GB', ogLocale: 'en_US', default: true },
	{ code: 'de', label: 'Deutsch', prefix: '/de', dateLocale: 'de-DE', ogLocale: 'de_DE' }
];
export const DEFAULT_LOCALE = LOCALES.find((l) => l.default)!;
export const localeOf = (code: string) => LOCALES.find((l) => l.code === code) ?? DEFAULT_LOCALE;
/** The locale an address in the built site belongs to, from its first folder. */
export const localeOfPath = (urlPath: string) => LOCALES.find((l) => l.prefix && (urlPath === l.prefix || urlPath.startsWith(`${l.prefix}/`))) ?? DEFAULT_LOCALE;

export interface Strings {
	skip: string;
	menu: string;
	close: string;
	docs: string;
	documentation: string;
	searchDocs: string;
	searchKey: string;
	searchHint: string;
	results: string;
	site: string;
	more: string;
	language: string;
	onThisPage: string;
	updated: string;
	copyMarkdown: string;
	editOnGitHub: string;
	previous: string;
	next: string;
	previousIn: string;
	nextIn: string;
	pager: string;
	home: string;
	/** "{name} documentation", the title of the docs index */
	docsTitle: string;
	/** "{title} - {name} docs", the title of every other docs page */
	pageTitle: string;
	docsLead: string;
	/** Appended to the lead of the docs index; {version} is replaced */
	writtenFor: string;
	docsDescription: string;
	notFound: string;
	notFoundLead: string;
	notFoundDescription: string;
	everySection: string;
	whatItIs: string;
	footer: string;
	changelog: string;
	security: string;
	note: string;
	warning: string;
	/** Section labels and intros; the default language takes them from site.config.ts */
	sections?: Record<string, { label: string; intro: string }>;
}

export const STRINGS: Record<string, Partial<Strings>> = {
	en: {
		skip: 'Skip to the content',
		menu: 'Menu',
		close: 'Close',
		docs: 'Docs',
		documentation: 'Documentation',
		searchDocs: 'Search the docs',
		searchKey: 'Ctrl K',
		searchHint: 'Type to search every page and section.',
		results: 'Results',
		site: 'Site',
		more: 'More',
		language: 'Language',
		onThisPage: 'On this page',
		updated: 'Updated',
		copyMarkdown: 'Copy as Markdown',
		editOnGitHub: 'Edit on GitHub',
		previous: 'Previous',
		next: 'Next',
		previousIn: 'Previous in {section}',
		nextIn: 'Next in {section}',
		pager: 'Previous and next page',
		home: 'Home',
		docsTitle: '{name} documentation',
		pageTitle: '{title} - {name} docs',
		docsLead: 'How to install NeoDesk, connect RustDesk clients to it and run it.',
		writtenFor: 'Written for version {version}.',
		docsDescription: 'How to install NeoDesk, connect RustDesk clients to it and run it.',
		notFound: 'Page not found',
		notFoundLead: 'There is no page at this address. It may have moved.',
		notFoundDescription: 'There is no page at this address.',
		everySection: 'Every section and page.',
		whatItIs: 'What NeoDesk is.',
		footer:
			'NeoDesk started as a fork of <a href="https://github.com/UNITRONIX/BetterDesk" rel="noopener">BetterDesk</a> by UNITRONIX and works with RustDesk clients. Open source under AGPL-3.0.',
		changelog: 'Changelog',
		security: 'Security',
		note: 'Note',
		warning: 'Warning'
	},
	// German: no text yet. Fill in every key of Strings, and sections, before adding content/de/docs.
	de: {}
};

const KEYS = Object.keys(STRINGS.en) as (keyof Strings)[];

/** The strings a language still lacks; empty when it has them all. */
export function missingStrings(code: string, sectionSlugs: string[]): string[] {
	const have = STRINGS[code] ?? {};
	const missing: string[] = KEYS.filter((k) => !have[k]);
	if (code !== DEFAULT_LOCALE.code) for (const s of sectionSlugs) if (!have.sections?.[s]) missing.push(`sections.${s}`);
	return missing;
}

/** The strings of a language. Only call it for a language that has them all. */
export const stringsOf = (code: string) => ({ ...STRINGS.en, ...STRINGS[code] }) as Strings;

/** A string with {name} parts filled in. */
export const fill = (s: string, values: Record<string, string>) => s.replace(/\{(\w+)\}/g, (m, k: string) => values[k] ?? m);
