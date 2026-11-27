// The site's small pages on the www host: /support/, /releases/, /security/, /imprint/
// and /privacy/, each in every language. Their facts come from the security policy in
// neodeskapp/.github, the docs (Hardening, Security model, Privacy) and the release data
// the build reads; what those don't say is not on the pages.
import type { ClientOffer, ClientRelease } from './client-release.ts';

const esc = (s: unknown) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const SITE_PAGES = ['support', 'releases', 'security', 'imprint', 'privacy'] as const;
export type SitePageSlug = (typeof SITE_PAGES)[number];

export interface SitePage {
	slug: SitePageSlug;
	/** The h1, and the name in the header and footer */
	title: string;
	/** <title>, at most 60 characters, unlike any other page's */
	pageTitle: string;
	/** The meta description, at most 155 characters */
	description: string;
	/** The title on the link preview image; no other page has the same */
	previewTitle: string;
	main: string;
}

/** What the pages link to and show, in the page's language */
export interface SitePageContext {
	/** A docs page by its logical address (/docs/...), in the page's language */
	docs: (p: string) => string;
	/** One of these pages, or the download page, in the page's language */
	page: (slug: SitePageSlug | 'download') => string;
	repo: string;
	clientRepo: string;
	discord: string;
	/** The server's current version */
	version: string;
	client: ClientOffer;
	dateLocale: string;
}

/** Who runs the site: the imprint and the privacy page name them */
const COMPANY = { name: 'Rath & Blume GbR', street: 'Weingärten 22', city: '31134 Hildesheim', email: 'support@neode.sk' };
const SECURITY_MAIL = 'security@neode.sk';

const dateOf = (iso: string, dateLocale: string) => new Date(iso).toLocaleDateString(dateLocale, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
const mail = (address: string) => `<a href="mailto:${address}">${address}</a>`;
const out = (href: string, text: string) => `<a href="${esc(href)}" rel="noopener">${esc(text)}</a>`;
const to = (href: string, text: string) => `<a href="${esc(href)}">${esc(text)}</a>`;
const head = (title: string, lead: string) => `    <h1 class="display">${esc(title)}</h1>\n    <p class="lead">${lead}</p>`;
const h2 = (id: string, text: string) => `    <h2 id="${id}">${esc(text)}</h2>`;
const p = (html: string) => `    <p>${html}</p>`;
const list = (items: string[]) => `    <ul>\n${items.map((x) => `      <li>${x}</li>`).join('\n')}\n    </ul>`;
/** Links with a line under each, as the docs list their pages */
const rows = (items: [string, string][]) => `    <ul class="rows">\n${items.map(([link, text]) => `      <li>${link}<p>${text}</p></li>`).join('\n')}\n    </ul>`;
const address = (country: string) => `    <address class="page-address">${esc(COMPANY.name)}<br>${esc(COMPANY.street)}<br>${esc(COMPANY.city)}<br>${esc(country)}</address>`;

function en(c: SitePageContext): SitePage[] {
	const advisory = `${c.repo}/security/advisories/new`;
	const candidate = (version: string) => (/-rc\./.test(version) ? ' It is a release candidate, for testing.' : '');
	const clientLine = (r: ClientRelease) => `Version ${esc(r.version)}, published ${dateOf(r.published, c.dateLocale)}.${r.prerelease ? ' It is a release candidate, for testing.' : ''}`;
	return [
		{
			slug: 'support',
			title: 'Support',
			pageTitle: 'Support for NeoDesk: where to get help',
			description: 'Where to get help with NeoDesk: the docs, the Discord, discussions and bug reports on GitHub, private security reports, and paid support.',
			previewTitle: 'Support',
			main: [
				head('Support', 'Where to get help with NeoDesk, and what to send along so someone can answer.'),
				h2('look-it-up', 'Look it up'),
				rows([
					[to(c.docs('/docs/'), 'Documentation'), 'Installing, the console page by page, running the server and the command line.'],
					[to(c.docs('/docs/operations/troubleshooting'), 'Troubleshooting'), 'What to check when something does not work.'],
					[to(c.page('download'), 'Download'), 'The desktop client for Windows, macOS and Linux.']
				]),
				h2('ask', 'Ask'),
				p('Help with questions is free.'),
				rows([
					[out(c.discord, 'NeoDesk Discord'), 'Questions, help and announcements.'],
					[out(`${c.repo}/discussions`, 'Discussions on GitHub'), 'Questions and ideas that should stay findable.']
				]),
				h2('report-a-bug', 'Report a bug'),
				p(`Open an issue in ${out(`${c.repo}/issues`, 'the issues on GitHub')}. It helps to include:`),
				list([
					'the NeoDesk version, and the client and its version if a client is involved',
					'how NeoDesk runs: Docker, the Linux or Windows installer, or a build from source',
					'what you did, what you expected and what happened',
					'logs or screenshots, with passwords, keys and addresses removed'
				]),
				h2('security-problem', 'Report a security problem'),
				p(`Please don't post a security problem in public. Report it privately, as ${to(c.page('security'), 'Security')} describes.`),
				h2('paid-support', 'Paid support'),
				p(`Paid support and help with a setup are available on request: write to ${mail(COMPANY.email)}.`)
			].join('\n')
		},
		{
			slug: 'releases',
			title: 'Releases',
			pageTitle: 'NeoDesk releases: current server and client versions',
			description: 'The current versions of the NeoDesk server and the desktop client, with their release notes, the changelog and how to update.',
			previewTitle: 'Releases',
			main: [
				head('Releases', 'The current versions of the NeoDesk server and the desktop client, and where their release notes are.'),
				h2('server', 'Server'),
				p(`The current version is <b>${esc(c.version)}</b>.${candidate(c.version)}`),
				rows([
					[out(`${c.repo}/releases/tag/v${c.version}`, `Release notes of ${c.version}`), 'What this version changes, on GitHub.'],
					[out(`${c.repo}/blob/main/CHANGELOG.md`, 'Changelog'), 'Every version, newest first.'],
					[to(c.docs('/docs/operations/updating'), 'Updating'), 'How to update a server, for each way of installing it.'],
					[out(`${c.repo}/releases`, 'All server releases'), 'Every release with its files, on GitHub.']
				]),
				h2('client', 'Desktop client'),
				...(c.client.main
					? [
							p(clientLine(c.client.main)),
							rows([
								[to(c.page('download'), 'Download'), 'The file for your computer, and every file with its checksum.'],
								[out(c.client.main.page, `Release notes of ${c.client.main.version}`), 'What this version changes, on GitHub.'],
								...(c.client.preview ? [[out(c.client.preview.page, `Preview: ${c.client.preview.version}`), `The next version, published ${dateOf(c.client.preview.published, c.dateLocale)}, for testing.`] as [string, string]] : []),
								[out(`${c.clientRepo}/releases`, 'All client releases'), 'Every release with its files, on GitHub.']
							])
						]
					: [p(`There is no published release of the client yet. See ${out(`${c.clientRepo}/releases`, 'the client releases on GitHub')}.`)]),
				h2('how', 'How releases are made'),
				p(`${to(c.docs('/docs/development/releasing'), 'Branches, versions and releases')} in the docs describes how a release is built, signed and published.`)
			].join('\n')
		},
		{
			slug: 'security',
			title: 'Security',
			pageTitle: 'Security of NeoDesk: reporting a problem and what follows',
			description: 'How to report a security problem in NeoDesk privately, how fast you get an answer, which versions get fixes, and how to run a server safely.',
			previewTitle: 'Security',
			main: [
				head('Security', 'How to report a security problem in NeoDesk, what happens after you do, and where the docs say how to run a server safely.'),
				h2('report', 'Report a problem'),
				p(`Please don't post a security problem in public, on Discord or in the discussions on GitHub. Report it privately: ${out(advisory, 'through a private report on GitHub')}, or by email to ${mail(SECURITY_MAIL)}. That address is for the desktop client's security problems too.`),
				p('Please include, where you can:'),
				list([
					'what the problem is and what an attacker gains',
					'how to reproduce it: a proof of concept, a request and its answer, or a test case',
					'the affected version or commit, and how NeoDesk runs (Docker, the Linux or Windows installer, a build from source)',
					'logs, screenshots or traffic captures, with sensitive data removed'
				]),
				h2('what-follows', 'What follows'),
				list([
					'<b>Acknowledgement:</b> within 7 days of the report.',
					'<b>Triage decision:</b> within 14 days, with severity, scope and a plan for the fix.',
					'<b>Coordinated disclosure:</b> at most 90 days from the acknowledgement, shorter if the problem is being exploited.',
					'<b>Credit:</b> if you want it, in the release notes or the advisory.'
				]),
				p(`If you get no acknowledgement within 7 days, write on the ${out(c.discord, 'NeoDesk Discord')} only that you are waiting for an answer to a security report, with no details.`),
				h2('versions', 'Versions that get fixes'),
				p('Security fixes go into the main branch and the next release. Older releases may get a fix for a critical problem, at the maintainers\' discretion.'),
				h2('scope', 'Scope'),
				p(`${out(`https://github.com/neodeskapp/.github/blob/main/SECURITY.md`, 'The security policy')} lists what is in scope and what is not.`),
				h2('your-server', 'Your own server'),
				rows([
					[to(c.docs('/docs/operations/security'), 'Hardening'), 'The settings and steps that make a server on the internet safer.'],
					[to(c.docs('/docs/development/security-model'), 'Security model'), 'What the server trusts and how the code protects each boundary.'],
					[to(c.docs('/docs/project/privacy'), 'Privacy'), 'What NeoDesk keeps on your server, and every host it contacts.']
				])
			].join('\n')
		},
		{
			slug: 'imprint',
			title: 'Imprint',
			pageTitle: 'Imprint - NeoDesk',
			description: 'Who runs neode.sk and the NeoDesk project: Rath & Blume GbR in Hildesheim, Germany, with the address and how to reach us.',
			previewTitle: 'Imprint',
			main: [
				head('Imprint', 'Who runs neode.sk and the NeoDesk project.'),
				h2('provider', 'Provider'),
				address('Germany'),
				h2('contact', 'Contact'),
				p(`Email: ${mail(COMPANY.email)}`),
				p(`Security problems go to ${mail(SECURITY_MAIL)}, as ${to(c.page('security'), 'Security')} describes.`),
				h2('more', 'See also'),
				p(`${to(c.page('privacy'), 'Privacy of this website')} says what neode.sk records about a visit.`)
			].join('\n')
		},
		{
			slug: 'privacy',
			title: 'Privacy of this website',
			pageTitle: 'Privacy of this website - NeoDesk',
			description: 'What neode.sk records about a visit: self-hosted statistics without cookies, the web server\'s log, and what happens when you follow a link or write to us.',
			previewTitle: 'Privacy of this website',
			main: [
				head('Privacy of this website', `What neode.sk and docs.neode.sk record about a visit. For what the NeoDesk software keeps and contacts on your own server, see ${to(c.docs('/docs/project/privacy'), 'Privacy')} in the docs.`),
				h2('who', 'Who is responsible'),
				address('Germany'),
				p(`Email: ${mail(COMPANY.email)}`),
				h2('statistics', 'Statistics'),
				p(`The site counts its visits with ${out('https://umami.is', 'Umami')}, an open-source analytics tool that we run ourselves on our server in Germany, at stats.neode.sk. No data goes to anyone else.`),
				list([
					'No cookies and nothing in your browser\'s storage.',
					'For each page view we store the page and its title, the page you came from, your browser, operating system, device type, screen size and language, and the country, region and city that your IP address points to.',
					'Your IP address is not stored. The stats server keeps no access log. Umami uses the address only while it handles the page view: together with your browser\'s user agent and a value that changes every day, it turns it into a visitor ID. So we can count visitors per day but can\'t follow anyone from one day to the next.',
					'The address in the browser is recorded without the part after <code>?</code> or <code>#</code>.',
					'If your browser sends Do Not Track or Global Privacy Control, nothing is recorded.'
				]),
				h2('log', 'The web server\'s log'),
				p('The web server logs every request with the visitor\'s IP address, like most web servers, and deletes these logs after 14 days. Copies in our encrypted nightly backup are kept for up to four months.'),
				h2('basis', 'Why we may do this'),
				p('We keep the log to run the site and keep it safe, and the statistics to see which pages are used. The legal basis for both is our legitimate interest, Article 6(1)(f) of the GDPR.'),
				h2('elsewhere', 'Links and downloads'),
				p('Fonts, styles and scripts come from this site itself. The downloads of NeoDesk are files on GitHub, and the community is on Discord: when you follow such a link, that service receives your request and its own privacy terms apply.'),
				h2('email', 'When you write to us'),
				p('We use your address and what you write to answer you.'),
				h2('rights', 'Your rights'),
				p(`Under the GDPR you can ask us what we store about you, and to correct, delete or restrict it, and you can object to its use. Write to ${mail(COMPANY.email)}. You can also complain to a data protection authority.`)
			].join('\n')
		}
	];
}

function de(c: SitePageContext): SitePage[] {
	const advisory = `${c.repo}/security/advisories/new`;
	const candidate = (version: string) => (/-rc\./.test(version) ? ' Sie ist ein Release Candidate, zum Testen.' : '');
	const clientLine = (r: ClientRelease) => `Version ${esc(r.version)}, veröffentlicht am ${dateOf(r.published, c.dateLocale)}.${r.prerelease ? ' Sie ist ein Release Candidate, zum Testen.' : ''}`;
	return [
		{
			slug: 'support',
			title: 'Support',
			pageTitle: 'Support für NeoDesk: Wo du Hilfe bekommst',
			description: 'Wo du Hilfe zu NeoDesk bekommst: Doku, Discord, Diskussionen und Fehlerberichte auf GitHub, vertrauliche Sicherheitsmeldungen und bezahlter Support.',
			previewTitle: 'Support',
			main: [
				head('Support', 'Wo du Hilfe zu NeoDesk bekommst, und was du mitschicken solltest, damit jemand antworten kann.'),
				h2('look-it-up', 'Nachlesen'),
				rows([
					[to(c.docs('/docs/'), 'Dokumentation'), 'Die Installation, die Konsole Seite für Seite, der Betrieb des Servers und die Kommandozeile.'],
					[to(c.docs('/docs/operations/troubleshooting'), 'Fehlersuche'), 'Was du prüfst, wenn etwas nicht funktioniert.'],
					[to(c.page('download'), 'Download'), 'Der Desktop-Client für Windows, macOS und Linux.']
				]),
				h2('ask', 'Fragen'),
				p('Hilfe bei Fragen ist kostenlos.'),
				rows([
					[out(c.discord, 'NeoDesk-Discord'), 'Fragen, Hilfe und Ankündigungen.'],
					[out(`${c.repo}/discussions`, 'Diskussionen auf GitHub'), 'Fragen und Ideen, die auffindbar bleiben sollen.']
				]),
				h2('report-a-bug', 'Einen Fehler melden'),
				p(`Leg ein Issue in ${out(`${c.repo}/issues`, 'den Issues auf GitHub')} an. Es hilft, wenn du dazuschreibst:`),
				list([
					'die Version von NeoDesk, und den Client mit seiner Version, wenn ein Client beteiligt ist',
					'wie NeoDesk läuft: Docker, der Installer für Linux oder Windows oder ein eigener Build',
					'was du getan hast, was du erwartet hast und was passiert ist',
					'Logs oder Screenshots, ohne Passwörter, Schlüssel und Adressen'
				]),
				h2('security-problem', 'Ein Sicherheitsproblem melden'),
				p(`Bitte schreib ein Sicherheitsproblem nicht öffentlich. Melde es vertraulich, wie es unter ${to(c.page('security'), 'Sicherheit')} steht.`),
				h2('paid-support', 'Bezahlter Support'),
				p(`Bezahlten Support und Hilfe bei der Einrichtung gibt es auf Anfrage: Schreib an ${mail(COMPANY.email)}.`)
			].join('\n')
		},
		{
			slug: 'releases',
			title: 'Releases',
			pageTitle: 'NeoDesk-Releases: aktuelle Versionen von Server und Client',
			description: 'Die aktuellen Versionen des NeoDesk-Servers und des Desktop-Clients, mit Release Notes, Changelog und dem Weg zum Update.',
			previewTitle: 'Releases',
			main: [
				head('Releases', 'Die aktuellen Versionen des NeoDesk-Servers und des Desktop-Clients, und wo ihre Release Notes stehen.'),
				h2('server', 'Server'),
				p(`Die aktuelle Version ist <b>${esc(c.version)}</b>.${candidate(c.version)}`),
				rows([
					[out(`${c.repo}/releases/tag/v${c.version}`, `Release Notes von ${c.version}`), 'Was diese Version ändert, auf GitHub.'],
					[out(`${c.repo}/blob/main/CHANGELOG.md`, 'Changelog'), 'Jede Version, die neueste zuerst.'],
					[to(c.docs('/docs/operations/updating'), 'Aktualisieren'), 'Wie du einen Server aktualisierst, für jede Art der Installation.'],
					[out(`${c.repo}/releases`, 'Alle Server-Releases'), 'Jedes Release mit seinen Dateien, auf GitHub.']
				]),
				h2('client', 'Desktop-Client'),
				...(c.client.main
					? [
							p(clientLine(c.client.main)),
							rows([
								[to(c.page('download'), 'Download'), 'Die Datei für deinen Computer, und jede Datei mit Prüfsumme.'],
								[out(c.client.main.page, `Release Notes von ${c.client.main.version}`), 'Was diese Version ändert, auf GitHub.'],
								...(c.client.preview ? [[out(c.client.preview.page, `Vorschau: ${c.client.preview.version}`), `Die nächste Version, veröffentlicht am ${dateOf(c.client.preview.published, c.dateLocale)}, zum Testen.`] as [string, string]] : []),
								[out(`${c.clientRepo}/releases`, 'Alle Client-Releases'), 'Jedes Release mit seinen Dateien, auf GitHub.']
							])
						]
					: [p(`Vom Client gibt es noch kein veröffentlichtes Release. Siehe ${out(`${c.clientRepo}/releases`, 'die Client-Releases auf GitHub')}.`)]),
				h2('how', 'Wie Releases entstehen'),
				p(`${to(c.docs('/docs/development/releasing'), 'Branches, Versionen und Releases')} in der Doku beschreibt, wie ein Release gebaut, signiert und veröffentlicht wird.`)
			].join('\n')
		},
		{
			slug: 'security',
			title: 'Sicherheit',
			pageTitle: 'Sicherheit von NeoDesk: Probleme melden und was dann folgt',
			description: 'Ein Sicherheitsproblem in NeoDesk vertraulich melden: wie schnell du Antwort bekommst, welche Versionen Fixes erhalten und wie ein Server sicher läuft.',
			previewTitle: 'Sicherheit',
			main: [
				head('Sicherheit', 'Wie du ein Sicherheitsproblem in NeoDesk meldest, was danach passiert, und wo die Doku erklärt, wie ein Server sicher läuft.'),
				h2('report', 'Ein Problem melden'),
				p(`Bitte schreib ein Sicherheitsproblem nicht öffentlich, auch nicht auf Discord oder in den Diskussionen auf GitHub. Melde es vertraulich: ${out(advisory, 'über eine private Meldung auf GitHub')} oder per E-Mail an ${mail(SECURITY_MAIL)}. Die Adresse gilt auch für Sicherheitsprobleme des Desktop-Clients.`),
				p('Schreib dazu, soweit du kannst:'),
				list([
					'was das Problem ist und was ein Angreifer damit erreicht',
					'wie es sich nachstellen lässt: ein Proof of Concept, eine Anfrage mit ihrer Antwort oder ein Testfall',
					'die betroffene Version oder den Commit, und wie NeoDesk läuft (Docker, der Installer für Linux oder Windows, ein eigener Build)',
					'Logs, Screenshots oder Mitschnitte des Datenverkehrs, ohne sensible Daten'
				]),
				h2('what-follows', 'Was dann folgt'),
				list([
					'<b>Bestätigung:</b> innerhalb von 7 Tagen nach der Meldung.',
					'<b>Einschätzung:</b> innerhalb von 14 Tagen, mit Schweregrad, Umfang und einem Plan für den Fix.',
					'<b>Abgestimmte Veröffentlichung:</b> spätestens 90 Tage nach der Bestätigung, früher, wenn das Problem ausgenutzt wird.',
					'<b>Nennung:</b> wenn du möchtest, in den Release Notes oder im Advisory.'
				]),
				p(`Bekommst du innerhalb von 7 Tagen keine Bestätigung, schreib auf dem ${out(c.discord, 'NeoDesk-Discord')} nur, dass du auf die Antwort zu einer Sicherheitsmeldung wartest, ohne Details.`),
				h2('versions', 'Versionen, die Fixes bekommen'),
				p('Sicherheitsfixes gehen in den Branch main und ins nächste Release. Ältere Releases können bei einem kritischen Problem einen Fix bekommen, das entscheiden die Maintainer.'),
				h2('scope', 'Umfang'),
				p(`${out(`https://github.com/neodeskapp/.github/blob/main/SECURITY.md`, 'Die Sicherheitsrichtlinie')} nennt, was dazugehört und was nicht.`),
				h2('your-server', 'Dein eigener Server'),
				rows([
					[to(c.docs('/docs/operations/security'), 'Härtung'), 'Die Einstellungen und Schritte, die einen Server im Internet sicherer machen.'],
					[to(c.docs('/docs/development/security-model'), 'Sicherheitsmodell'), 'Wem der Server vertraut und wie der Code jede Grenze schützt.'],
					[to(c.docs('/docs/project/privacy'), 'Datenschutz'), 'Was NeoDesk auf deinem Server speichert, und jeden Host, den es kontaktiert.']
				])
			].join('\n')
		},
		{
			slug: 'imprint',
			title: 'Impressum',
			pageTitle: 'Impressum - NeoDesk',
			description: 'Wer neode.sk und das Projekt NeoDesk betreibt: die Rath & Blume GbR in Hildesheim, mit Anschrift und Kontakt.',
			previewTitle: 'Impressum',
			main: [
				head('Impressum', 'Wer neode.sk und das Projekt NeoDesk betreibt.'),
				h2('provider', 'Anbieter'),
				address('Deutschland'),
				h2('contact', 'Kontakt'),
				p(`E-Mail: ${mail(COMPANY.email)}`),
				p(`Sicherheitsprobleme gehen an ${mail(SECURITY_MAIL)}, wie es unter ${to(c.page('security'), 'Sicherheit')} steht.`),
				h2('more', 'Siehe auch'),
				p(`${to(c.page('privacy'), 'Datenschutz dieser Website')} nennt, was neode.sk über einen Besuch aufzeichnet.`)
			].join('\n')
		},
		{
			slug: 'privacy',
			title: 'Datenschutz dieser Website',
			pageTitle: 'Datenschutz dieser Website - NeoDesk',
			description: 'Was neode.sk über einen Besuch aufzeichnet: eigene Statistik ohne Cookies, das Log des Webservers, und was bei Links und E-Mails passiert.',
			previewTitle: 'Datenschutz dieser Website',
			main: [
				head('Datenschutz dieser Website', `Was neode.sk und docs.neode.sk über einen Besuch aufzeichnen. Was die Software NeoDesk auf deinem eigenen Server speichert und kontaktiert, steht unter ${to(c.docs('/docs/project/privacy'), 'Datenschutz')} in der Doku.`),
				h2('who', 'Wer verantwortlich ist'),
				address('Deutschland'),
				p(`E-Mail: ${mail(COMPANY.email)}`),
				h2('statistics', 'Statistik'),
				p(`Die Website zählt ihre Besuche mit ${out('https://umami.is', 'Umami')}, einem Open-Source-Werkzeug, das wir selbst auf unserem Server in Deutschland betreiben, unter stats.neode.sk. Keine Daten gehen an Dritte.`),
				list([
					'Keine Cookies und nichts im Speicher deines Browsers.',
					'Zu jedem Seitenaufruf speichern wir die Seite und ihren Titel, die Seite, von der du kamst, Browser, Betriebssystem, Gerätetyp, Bildschirmgröße und Sprache sowie Land, Region und Stadt, auf die deine IP-Adresse zeigt.',
					'Deine IP-Adresse wird nicht gespeichert. Der Statistik-Server führt kein Zugriffslog. Umami nutzt die Adresse nur, während es den Seitenaufruf verarbeitet: Zusammen mit dem User-Agent deines Browsers und einem Wert, der sich jeden Tag ändert, macht es daraus eine Besucher-ID. So können wir Besucher pro Tag zählen, aber niemanden von einem Tag zum nächsten verfolgen.',
					'Die Adresse im Browser wird ohne den Teil nach <code>?</code> oder <code>#</code> aufgezeichnet.',
					'Sendet dein Browser Do Not Track oder Global Privacy Control, wird nichts aufgezeichnet.'
				]),
				h2('log', 'Das Log des Webservers'),
				p('Der Webserver protokolliert jede Anfrage mit der IP-Adresse des Besuchers, wie die meisten Webserver, und löscht diese Logs nach 14 Tagen. Kopien in unserem verschlüsselten nächtlichen Backup bleiben bis zu vier Monate erhalten.'),
				h2('basis', 'Warum wir das dürfen'),
				p('Das Log brauchen wir, um die Website zu betreiben und zu schützen, die Statistik, um zu sehen, welche Seiten genutzt werden. Rechtsgrundlage für beides ist unser berechtigtes Interesse, Artikel 6 Absatz 1 Buchstabe f DSGVO.'),
				h2('elsewhere', 'Links und Downloads'),
				p('Schriften, Styles und Skripte kommen von dieser Website selbst. Die Downloads von NeoDesk sind Dateien auf GitHub, und die Community ist auf Discord: Folgst du so einem Link, erhält dieser Dienst deine Anfrage, und es gelten seine eigenen Datenschutzbestimmungen.'),
				h2('email', 'Wenn du uns schreibst'),
				p('Wir nutzen deine Adresse und das, was du schreibst, um dir zu antworten.'),
				h2('rights', 'Deine Rechte'),
				p(`Nach der DSGVO kannst du von uns Auskunft darüber verlangen, was wir über dich speichern, und es berichtigen, löschen oder einschränken lassen, und du kannst der Nutzung widersprechen. Schreib an ${mail(COMPANY.email)}. Du kannst dich außerdem bei einer Datenschutzaufsichtsbehörde beschweren.`)
			].join('\n')
		}
	];
}

const BY_LOCALE: Record<string, (c: SitePageContext) => SitePage[]> = { en, de };

/** Whether these pages exist in a language */
export const hasSitePages = (code: string) => code in BY_LOCALE;

/** The five pages in one language */
export const sitePages = (code: string, c: SitePageContext): SitePage[] => (BY_LOCALE[code] ?? en)(c);

/** The pages' names in a language, for the header and the footer, without building them */
export function sitePageTitles(code: string): Record<SitePageSlug, string> {
	const blank: SitePageContext = { docs: (x) => x, page: (x) => `/${x}/`, repo: '', clientRepo: '', discord: '', version: '', client: { main: null, preview: null }, dateLocale: 'en-GB' };
	return Object.fromEntries(sitePages(code, blank).map((x) => [x.slug, x.title])) as Record<SitePageSlug, string>;
}
