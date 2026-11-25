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
	/** The button that opens the docs' sidebar on narrow screens */
	contents: string;
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
	copied: string;
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
	/** The copy button of a code block, its label for screen readers, and what it says after a copy */
	copy: string;
	copyCode: string;
	/** "{name} home", the logo's label */
	homeLabel: string;
	/** "{count} results", under the search field */
	resultsCount: string;
	/** "Nothing found for "{query}". ...", under the search field */
	nothingFound: string;
	searchFailed: string;
	/** The heading over a page's related pages */
	seeAlso: string;
	/** The groups of search results */
	groupPages: string;
	groupCommands: string;
	groupSettings: string;
	groupSections: string;
	/** The page that lists every docs page, the search without scripts */
	allPages: string;
	allPagesLead: string;
	allPagesDescription: string;
	/** The lines at the top of a page's Markdown copy: "Source: <address>" and "Last updated: <date>" */
	source: string;
	lastUpdated: string;
	/** Section labels, intros and descriptions; the default language takes them from site.config.ts */
	sections?: Record<string, { label: string; intro: string; description?: string }>;
}

export const STRINGS: Record<string, Partial<Strings>> = {
	en: {
		skip: 'Skip to the content',
		menu: 'Menu',
		contents: 'Contents',
		close: 'Close',
		docs: 'Docs',
		documentation: 'Documentation',
		searchDocs: 'Search the docs',
		searchKey: 'Ctrl K',
		searchHint: 'Type to search pages, sections, commands and settings.',
		results: 'Results',
		site: 'Site',
		more: 'More',
		language: 'Language',
		onThisPage: 'On this page',
		updated: 'Updated',
		copyMarkdown: 'Copy as Markdown',
		copied: 'Copied',
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
		footer: 'NeoDesk works with RustDesk clients. Open source under AGPL-3.0.',
		changelog: 'Changelog',
		security: 'Security',
		note: 'Note',
		warning: 'Warning',
		copy: 'Copy',
		copyCode: 'Copy this code',
		homeLabel: '{name} home',
		resultsCount: '{count} results',
		nothingFound: 'Nothing found for "{query}". Try fewer or other words.',
		searchFailed: 'The search index could not be loaded.',
		seeAlso: 'See also',
		groupPages: 'Pages',
		groupCommands: 'Commands',
		groupSettings: 'Settings and flags',
		groupSections: 'Sections',
		allPages: 'All pages',
		allPagesLead: 'Every page of the docs, by section, the command reference included.',
		allPagesDescription: 'Every page of the NeoDesk docs in one list, by section, with the command reference.',
		source: 'Source',
		lastUpdated: 'Last updated'
	},
	de: {
		skip: 'Zum Inhalt springen',
		menu: 'Menü',
		contents: 'Inhalt',
		close: 'Schließen',
		docs: 'Doku',
		documentation: 'Dokumentation',
		searchDocs: 'Doku durchsuchen',
		searchKey: 'Strg K',
		searchHint: 'Durchsucht Seiten, Abschnitte, Befehle und Einstellungen.',
		results: 'Ergebnisse',
		site: 'Website',
		more: 'Mehr',
		language: 'Sprache',
		onThisPage: 'Auf dieser Seite',
		updated: 'Geändert am',
		copyMarkdown: 'Als Markdown kopieren',
		copied: 'Kopiert',
		editOnGitHub: 'Auf GitHub bearbeiten',
		previous: 'Zurück',
		next: 'Weiter',
		previousIn: 'Zurück: {section}',
		nextIn: 'Weiter: {section}',
		pager: 'Vorherige und nächste Seite',
		home: 'Startseite',
		docsTitle: '{name}-Dokumentation',
		pageTitle: '{title} - {name}-Doku',
		docsLead: 'Wie du NeoDesk installierst, RustDesk-Clients damit verbindest und den Server betreibst.',
		writtenFor: 'Geschrieben für Version {version}.',
		docsDescription: 'Wie du NeoDesk installierst, RustDesk-Clients damit verbindest und den Server betreibst.',
		notFound: 'Seite nicht gefunden',
		notFoundLead: 'Unter dieser Adresse gibt es keine Seite. Vielleicht ist sie umgezogen.',
		notFoundDescription: 'Unter dieser Adresse gibt es keine Seite.',
		everySection: 'Alle Abschnitte und Seiten.',
		whatItIs: 'Was NeoDesk ist.',
		footer: 'NeoDesk funktioniert mit RustDesk-Clients. Open Source unter der AGPL-3.0.',
		changelog: 'Changelog',
		security: 'Sicherheit',
		note: 'Hinweis',
		warning: 'Achtung',
		copy: 'Kopieren',
		copyCode: 'Diesen Code kopieren',
		homeLabel: '{name} Startseite',
		resultsCount: '{count} Ergebnisse',
		nothingFound: 'Nichts gefunden für „{query}“. Versuch es mit weniger oder anderen Wörtern.',
		searchFailed: 'Der Suchindex ließ sich nicht laden.',
		seeAlso: 'Siehe auch',
		groupPages: 'Seiten',
		groupCommands: 'Befehle',
		groupSettings: 'Einstellungen und Flags',
		groupSections: 'Abschnitte',
		allPages: 'Alle Seiten',
		allPagesLead: 'Jede Seite der Doku, nach Abschnitten, mit der Befehlsreferenz.',
		allPagesDescription: 'Jede Seite der NeoDesk-Doku in einer Liste, nach Abschnitten, mit der Befehlsreferenz.',
		source: 'Quelle',
		lastUpdated: 'Zuletzt geändert',
		sections: {
			'getting-started': {
				label: 'Erste Schritte',
				intro: 'Hier fängst du an: was NeoDesk ist, die Installation mit Docker, unter Linux oder Windows, die erste Anmeldung und der erste RustDesk-Client.'
			},
			console: {
				label: 'Die Konsole',
				intro: 'Die Web-Konsole Seite für Seite: die Übersicht, die Geräteliste, einen Computer per Einladung hinzufügen, die Details eines Geräts und wie du dich verbindest, Registrierungsanfragen, Schnellhilfe, Remote Desktop im Browser und das Aktivitätsprotokoll.',
				description: 'Die Web-Konsole Seite für Seite: Geräte, Computer hinzufügen, Registrierung, Schnellhilfe, Remote Desktop im Browser und das Aktivitätsprotokoll.'
			},
			people: {
				label: 'Benutzer und Anmeldung',
				intro: 'Wer sich anmelden darf und was dann erlaubt ist: Benutzer, Rollen und Berechtigungen, Zwei-Faktor-Anmeldung, LDAP oder Active Directory, Single Sign-on mit OIDC und Organisationen.',
				description: 'Wer sich anmelden darf und was erlaubt ist: Benutzer, Rollen, Berechtigungen, Zwei-Faktor-Anmeldung, LDAP oder Active Directory, OIDC, Organisationen.'
			},
			operations: {
				label: 'Server betreiben',
				intro: 'Für alle, die den Server betreiben: Konfiguration, Ports und Firewall, ein Reverse Proxy mit TLS, PostgreSQL, Updates, Backup und Fehlersuche.'
			},
			'command-line': {
				label: 'Kommandozeile',
				intro: 'Die Kommandozeile neodesk für Skripte und KI-Agenten: die Anmeldung mit einem API-Token, der MCP-Server für KI-Agenten und die Referenz aller Befehle.'
			},
			development: {
				label: 'Entwicklung',
				intro: 'Für alle, die an NeoDesk mitarbeiten oder darauf aufbauen: mitmachen, aus dem Quellcode bauen, Tests und Prüfungen, wie der Code zusammenhängt, Releases sowie die APIs und Protokolle.',
				description: 'Für alle, die an NeoDesk mitarbeiten oder darauf aufbauen: mitmachen, bauen, Tests, Aufbau des Codes, Releases, APIs und Protokolle.'
			},
			project: {
				label: 'Das Projekt',
				intro: 'Die Lizenz und was das Projekt mit deinen Daten macht.'
			}
		}
	}
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
