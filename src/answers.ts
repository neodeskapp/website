// Short, direct answers to the questions people ask most, in each language. The home
// page shows them under "Questions" with FAQPage structured data, and llms.txt has the
// English ones. Every answer is true of the docs as they are; each ends with the page
// that has the details. Links name docs pages by their logical address (/docs/...).
//
// An answer is plain text with [links](/docs/...) and `code`. {ports} is the list of
// ports RustDesk clients need, from the ports page, and {version} answers which version
// is current.

export interface Answer {
	q: string;
	a: string;
}

export const ANSWERS: Record<string, Answer[]> = {
	en: [
		{
			q: 'What is NeoDesk?',
			a: 'A remote desktop server you run yourself. It speaks the RustDesk protocol, so the stock RustDesk client connects to it, and one Go binary serves the ID server, the relay, the client API and a web console for your devices. See [Introduction](/docs/getting-started/introduction).'
		},
		{
			q: 'What does the server need?',
			a: 'Docker with Compose 2.24 or newer, or a Linux machine with systemd, or 64-bit Windows. It needs no Go and no Node.js: the installers run the published image or download a release. RustDesk clients must reach it on {ports}. See [What you need](/docs/getting-started/introduction#what-you-need).'
		},
		{
			q: 'How do I install it?',
			a: 'The shortest way is Docker: on a Linux server, run `curl -fsSL https://neode.sk/install.sh | sudo bash`. The script installs Docker when it is missing, runs the server and the web console in one container, and prints the console\'s address and the admin password. See [Install with Docker](/docs/getting-started/docker), or install [on Linux](/docs/getting-started/linux) or [on Windows](/docs/getting-started/windows) without Docker.'
		},
		{
			q: 'Which ports does it use?',
			a: 'RustDesk clients connect on {ports}. The web console listens on 3375. On Docker that is plain HTTP: put it behind a reverse proxy with TLS before people use it over the internet. The Linux and Windows installers give the console HTTPS on 5443, and 3375 sends browsers there. See [Ports and firewall](/docs/operations/ports).'
		},
		{
			q: 'How do I add a computer?',
			a: 'In the console, open Devices and choose Add a computer. Its invite link installs the NeoDesk client and joins the computer to your server. With the stock RustDesk client, enter the ID server, relay server, API server and key from the console\'s Overview page instead. See [Add a computer](/docs/console/add-a-computer) and [Connect a RustDesk client](/docs/getting-started/connect-a-client).'
		},
		{
			q: 'Can I connect when nobody is at the computer?',
			a: 'Yes, with a permanent password that is set on the device itself, in the NeoDesk client or in stock RustDesk. The console can\'t set that password. See [Unattended access](/docs/console/unattended-access).'
		},
		{
			q: 'Is NeoDesk free?',
			a: 'Yes. It is open source under the AGPL-3.0, there is no paid version, and every feature is in the release everyone gets. See [Price and support](/docs/project/license#price-and-support).'
		},
		{
			q: 'Is there a free web console for RustDesk?',
			a: 'Yes, NeoDesk. RustDesk\'s free server, hbbs and hbbr, has no console, and RustDesk\'s own console comes with the paid Server Pro. NeoDesk is a free server for the stock RustDesk client with the console built in: the device list, accounts and the address book in the client, LDAP or OIDC sign-in, approval of new devices and an audit log. See [A free web console for your RustDesk clients](/docs/use-cases/rustdesk-web-console).'
		},
		{
			q: 'Is NeoDesk a free alternative to RustDesk Server Pro?',
			a: 'For most of what Pro is bought for, yes: a web console, accounts, two-factor sign-in, LDAP and OIDC, the address book and an audit log, with no license fee, no user or device limit and no license check. Pro has several relay servers and a custom client generator, which NeoDesk doesn\'t. See [NeoDesk and RustDesk Server Pro compared](/docs/compare/rustdesk-server-pro).'
		},
		{
			q: 'Is there paid support?',
			a: 'Yes, on request: paid support and help with a setup are available at support@neode.sk. Help with questions and bugs is free on the [NeoDesk Discord](https://discord.gg/nwERSawufr) and in the [discussions on GitHub](https://github.com/neodeskapp/neodesk/discussions).'
		},
		{
			q: 'Where do I download the NeoDesk client?',
			a: 'On [the download page](/download). It recommends the file for your computer and lists every file of the newest release with its SHA-256: `.exe` and `.msi` for Windows, `.dmg` for macOS, and `.deb`, `.rpm` and a portable archive for Linux. The files are also on [the client\'s releases page](https://github.com/neodeskapp/neodesk-client/releases). On Linux it also comes from the package repository at pkg.neode.sk: its `testing` suite has the release candidates, and its `stable` suite has no packages until the client has a final release. An invite from Add a computer downloads and installs it for you. See [Install from the package repository](/docs/getting-started/connect-a-client#install-from-the-package-repository).'
		},
		{
			q: 'Which version is current, and is it final?',
			a: '{version} See [Updating](/docs/operations/updating).'
		},
		{
			q: 'Which license does it have?',
			a: 'The GNU Affero General Public License, version 3 (AGPL-3.0). You may use, change and run NeoDesk, for personal or commercial purposes. If you change it and run it as a network service, you must make your changes available to the people who use that service. See [License](/docs/project/license).'
		}
	],
	de: [
		{
			q: 'Was ist NeoDesk?',
			a: 'Ein Remote-Desktop-Server, den du selbst betreibst. Er spricht das RustDesk-Protokoll, deshalb verbindet sich der normale RustDesk-Client mit ihm, und ein einziges Go-Binary stellt ID-Server, Relay, Client-API und eine Web-Konsole für deine Geräte bereit. Mehr in der [Einführung](/docs/getting-started/introduction).'
		},
		{
			q: 'Was braucht der Server?',
			a: 'Docker mit Compose 2.24 oder neuer, oder einen Linux-Rechner mit systemd, oder 64-Bit-Windows. Go und Node.js braucht er nicht: Die Installer nehmen das veröffentlichte Image oder laden ein Release herunter. RustDesk-Clients müssen ihn über {ports} erreichen. Mehr unter [Was du brauchst](/docs/getting-started/introduction#what-you-need).'
		},
		{
			q: 'Wie installiere ich NeoDesk?',
			a: 'Am schnellsten geht es mit Docker: auf einem Linux-Server mit `curl -fsSL https://neode.sk/install.sh | sudo bash`. Das Skript installiert Docker, falls es fehlt, startet Server und Web-Konsole in einem Container und zeigt am Ende die Adresse der Konsole und das Admin-Passwort. Mehr unter [Installation mit Docker](/docs/getting-started/docker), oder ohne Docker [unter Linux](/docs/getting-started/linux) und [unter Windows](/docs/getting-started/windows).'
		},
		{
			q: 'Welche Ports nutzt NeoDesk?',
			a: 'RustDesk-Clients verbinden sich über {ports}. Die Web-Konsole lauscht auf 3375. Unter Docker ist das unverschlüsseltes HTTP: Stell einen Reverse Proxy mit TLS davor, bevor jemand sie über das Internet nutzt. Die Installer für Linux und Windows geben der Konsole HTTPS auf 5443, und 3375 schickt Browser dorthin. Mehr unter [Ports und Firewall](/docs/operations/ports).'
		},
		{
			q: 'Wie füge ich einen Computer hinzu?',
			a: 'Öffne in der Konsole „Geräte“ und dann „Computer hinzufügen“. Der Einladungslink installiert den NeoDesk-Client und verbindet den Computer mit deinem Server. Mit dem normalen RustDesk-Client trägst du stattdessen ID-Server, Relay-Server, API-Server und Schlüssel von der Übersicht der Konsole ein. Mehr unter [Computer hinzufügen](/docs/console/add-a-computer) und [Einen RustDesk-Client verbinden](/docs/getting-started/connect-a-client).'
		},
		{
			q: 'Kann ich mich verbinden, wenn niemand am Computer sitzt?',
			a: 'Ja, mit einem dauerhaften Passwort, das auf dem Gerät selbst gesetzt wird, im NeoDesk-Client oder im normalen RustDesk. Die Konsole kann dieses Passwort nicht setzen. Mehr unter [Unbeaufsichtigter Zugriff](/docs/console/unattended-access).'
		},
		{
			q: 'Ist NeoDesk kostenlos?',
			a: 'Ja. Es ist Open Source unter der AGPL-3.0, es gibt keine bezahlte Version, und jede Funktion steckt in dem Release, das alle bekommen. Mehr unter [Preis und Support](/docs/project/license#price-and-support).'
		},
		{
			q: 'Gibt es eine kostenlose Web-Konsole für RustDesk?',
			a: 'Ja, NeoDesk. Der kostenlose Server von RustDesk, hbbs und hbbr, hat keine Konsole, und die Konsole von RustDesk gehört zum bezahlten Server Pro. NeoDesk ist ein kostenloser Server für den normalen RustDesk-Client mit eingebauter Konsole: Geräteliste, Konten und Adressbuch im Client, Anmeldung über LDAP oder OIDC, Freigabe neuer Geräte und ein Audit-Protokoll. Mehr unter [Eine kostenlose Web-Konsole für deine RustDesk-Clients](/docs/use-cases/rustdesk-web-console).'
		},
		{
			q: 'Ist NeoDesk eine kostenlose Alternative zu RustDesk Server Pro?',
			a: 'Für das meiste, wofür man Pro kauft, ja: Web-Konsole, Konten, Zwei-Faktor-Anmeldung, LDAP und OIDC, Adressbuch und Audit-Protokoll, ohne Lizenzgebühr, ohne Grenze für Benutzer oder Geräte und ohne Lizenzprüfung. Pro hat mehrere Relay-Server und einen Generator für eigene Clients, NeoDesk nicht. Mehr unter [NeoDesk und RustDesk Server Pro im Vergleich](/docs/compare/rustdesk-server-pro).'
		},
		{
			q: 'Gibt es bezahlten Support?',
			a: 'Ja, auf Anfrage: Bezahlten Support und Hilfe bei der Einrichtung gibt es über support@neode.sk. Hilfe bei Fragen und Fehlern ist kostenlos auf dem [NeoDesk-Discord](https://discord.gg/nwERSawufr) und in den [Diskussionen auf GitHub](https://github.com/neodeskapp/neodesk/discussions).'
		},
		{
			q: 'Wo lade ich den NeoDesk-Client herunter?',
			a: 'Auf [der Download-Seite](/download). Sie empfiehlt die Datei für deinen Computer und nennt jede Datei des neuesten Releases mit ihrer SHA-256: `.exe` und `.msi` für Windows, `.dmg` für macOS sowie `.deb`, `.rpm` und ein portables Archiv für Linux. Die Dateien liegen auch auf [der Release-Seite des Clients](https://github.com/neodeskapp/neodesk-client/releases). Unter Linux gibt es ihn auch im Paket-Repository auf pkg.neode.sk: Die Suite `testing` hat die Release Candidates, die Suite `stable` bleibt bis zum ersten finalen Release des Clients leer. Eine Einladung aus „Computer hinzufügen“ lädt ihn herunter und installiert ihn. Mehr unter [Aus dem Paket-Repository installieren](/docs/getting-started/connect-a-client#install-from-the-package-repository).'
		},
		{
			q: 'Welche Version ist aktuell, und ist sie final?',
			a: '{version} Mehr unter [Updates](/docs/operations/updating).'
		},
		{
			q: 'Unter welcher Lizenz steht NeoDesk?',
			a: 'Unter der GNU Affero General Public License, Version 3 (AGPL-3.0). Du darfst NeoDesk nutzen, ändern und betreiben, privat und geschäftlich. Wenn du es änderst und als Netzwerkdienst betreibst, musst du deine Änderungen den Menschen zugänglich machen, die diesen Dienst nutzen. Mehr unter [Lizenz](/docs/project/license).'
		}
	]
};

/** The answer to "which version is current", from the version the build is for. */
export function versionAnswer(code: string, version: string) {
	const base = version.split('-')[0];
	const pre = version.includes('-');
	const rc = /-rc\.\d+$/.test(version);
	if (code === 'de')
		return pre
			? `NeoDesk ${version}, ${rc ? 'ein Release Candidate' : 'eine Vorabversion'}. Ein finales ${base} gibt es noch nicht, alle bisherigen Releases sind Vorabversionen.`
			: `NeoDesk ${version}, ein finales Release.`;
	return pre
		? `NeoDesk ${version}, ${rc ? 'a release candidate' : 'a pre-release'}. There is no final ${base} yet; every release so far is a pre-release.`
		: `NeoDesk ${version}, a final release.`;
}

/** The answers of a language with {ports} and {version} filled in. */
export function answersOf(code: string, ports: string, version: string): Answer[] {
	return (ANSWERS[code] ?? ANSWERS.en).map((x) => ({ q: x.q, a: x.a.replace('{ports}', ports).replace('{version}', versionAnswer(code, version)) }));
}

const escHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** An answer as HTML; `href` turns a link's address into the one a visitor uses. */
export function answerHtml(a: string, href: (p: string) => string) {
	return escHtml(a)
		.replace(/`([^`]+)`/g, '<code>$1</code>')
		.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, text: string, p: string) => `<a class="teal" href="${escHtml(href(p.replace(/&amp;/g, '&')))}"${/^https?:/.test(p) ? ' rel="noopener"' : ''}>${text}</a>`)
		.replace(/support@neode\.sk/g, '<a class="teal" href="mailto:support@neode.sk">support@neode.sk</a>');
}

/** An answer as plain text, for structured data. */
export const answerText = (a: string) => a.replace(/`([^`]+)`/g, '$1').replace(/\[([^\]]+)\]\([^)\s]+\)/g, '$1');

/** An answer as Markdown with absolute links, for llms.txt; `href` gives a link's address. */
export const answerMarkdown = (a: string, href: (p: string) => string) => a.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, text: string, p: string) => `[${text}](${href(p)})`);
