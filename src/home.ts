// The words of the home page in each language. src/home.html holds the layout, the
// styles and the script, and names each of these with {{t:key}}. A value is HTML: it may
// hold markup such as <span class="blue">, and must escape & and < itself. Links into
// the site start with {{PREFIX}}, which becomes /de for German.
//
// A language that has docs pages needs every key here, or the build fails.

export interface HomeStrings {
	/** <title>, at most 60 characters */
	title: string;
	/** The meta description, at most 155 characters */
	description: string;
	/** The description in the home page's structured data; English uses config.summary */
	summary?: string;
	heroTitle: string;
	heroLead: string;
	install: string;
	/** The link next to Install, to the download page */
	downloadClient: string;
	readDocs: string;
	markLabel: string;
	serverTitle: string;
	serverLead: string;
	/** {{CLIENT_PORTS}} is the list of ports from the ports page */
	clientPorts: string;
	/** Joins the last two ports of that list */
	and: string;
	clientTitle: string;
	clientLead: string;
	clientBody: string;
	overviewAlt: string;
	/** The hero's two screenshots */
	heroConsoleAlt: string;
	heroClientAlt: string;
	consoleTitle: string;
	consoleLead: string;
	devicesAlt: string;
	detailTitle: string;
	detailLead: string;
	factApproval: string;
	factAudit: string;
	factSignIn: string;
	detailAlt: string;
	dataTitle: string;
	dataLead: string;
	/** The heading over the short answers (src/answers.ts) */
	questionsTitle: string;
	/** The link that skips the header */
	skip: string;
	copy: string;
	copied: string;
	/** What the copy button says when the browser didn't let it copy */
	copyFailed: string;
	/** The install tabs, built from src/install.ts; {os} is the tab's name, {href} the docs page */
	installOn: string;
	docsPageHas: string;
	copyCommands: string;
}

export const HOME: Record<string, Partial<HomeStrings>> = {
	en: {
		title: 'NeoDesk: your own RustDesk-compatible remote desktop server',
		description: 'NeoDesk is a self-hosted, RustDesk-compatible server written in Go, with a web console for the devices you look after.',
		heroTitle: 'Your <span class="blue">own</span> remote desktop server',
		heroLead: 'A RustDesk-compatible server written in Go, with a web console for the devices you look after.',
		install: 'Install',
		downloadClient: 'Download the client',
		readDocs: 'Read the docs',
		markLabel: 'The NeoDesk mark: a square for your server and a circle for the RustDesk client, overlapping where they share the console',
		serverTitle: 'One binary on <span class="blue">your server</span>',
		serverLead: 'RustDesk\'s own server is two programs, hbbs and hbbr. NeoDesk does both jobs in one Go binary, and the same binary serves the web console.',
		clientPorts: 'RustDesk clients connect on {{CLIENT_PORTS}}. The <a class="teal" href="{{PREFIX}}/docs/operations/ports/">ports page</a> in the docs lists every port.',
		and: 'and',
		clientTitle: 'Works with the <span class="lime">RustDesk client</span>',
		clientLead: 'The stock RustDesk client works for remote sessions. Enter four values in its network settings: the ID server, the relay server, the API server and the key.',
		clientBody: 'The console\'s overview page shows all four with a copy button, and Show QR puts them in one code for a phone. Add a computer, Pair with code, hardware inventory and client branding need the NeoDesk client. Quick support needs it only on the computer you help, where the person runs NeoDesk Quick Support; you connect from the browser or your desktop app.',
		heroConsoleAlt: 'The device list of the NeoDesk web console: folders and groups, and a table of devices with ID, hostname, platform, last seen and status',
		heroClientAlt: 'The NeoDesk desktop client: this computer\'s ID and one-time password, and a list of recent computers to connect to',
		overviewAlt: 'The Client setup section of the console overview: the client server address, then the ID server, relay server, API server and key, each with a copy button, and the Show QR button',
		consoleTitle: 'Every device in <span class="teal">one list</span>',
		consoleLead: 'Search by ID, name, user or platform. Put devices in folders and groups, and give them your own tags.',
		devicesAlt: 'The device list in the NeoDesk web console: folders and groups on the left, and a table of devices with ID, hostname, platform, last seen, status and tags',
		detailTitle: 'Open a device and <span class="teal">connect</span>',
		detailLead: 'Click a device to open its details. Connect to it from there, or look first at what it is and what it is doing.',
		factApproval: '<b>Approval before access:</b> in managed mode, a new RustDesk client waits under Enrollment requests until someone approves it.',
		factAudit: '<b>Audit log</b> of what people do in the console.',
		factSignIn: '<b>Sign-in</b> with LDAP, Active Directory or OIDC.',
		detailAlt: 'A device opened in the console: its current load and identity, with tabs for hardware, metrics, live data, tags and notes, and actions, and a Connect button',
		dataTitle: 'Your data stays on <span class="blue">your server</span>',
		dataLead: 'NeoDesk sends no analytics, crash reports or usage data to its developers. The code is licensed under AGPL-3.0. Read the <a class="teal" href="{{PREFIX}}/docs/project/privacy">privacy notes</a> and the <a class="teal" href="{{PREFIX}}/docs/project/license">license</a>.',
		questionsTitle: 'Questions',
		skip: 'Skip to the content',
		copy: 'Copy',
		copied: 'Copied',
		copyFailed: "Couldn't copy",
		installOn: 'Install on',
		docsPageHas: '<a class="teal" href="{href}">The docs page</a> has every option.',
		copyCommands: 'Copy the {os} install commands'
	},
	de: {
		title: 'NeoDesk: eigener Remote-Desktop-Server, RustDesk-kompatibel',
		description: 'NeoDesk ist ein selbst gehosteter, RustDesk-kompatibler Server in Go, mit einer Web-Konsole für die Geräte, die du betreust.',
		summary:
			'NeoDesk ist ein Remote-Desktop-Server, den du selbst betreibst. Er spricht das RustDesk-Protokoll, deshalb verbindet sich der normale RustDesk-Client mit ihm. Ein einziges Go-Binary stellt den ID-Server, das Relay, die Client-API und eine Web-Konsole für die Geräte bereit, die du betreust. NeoDesk ist Open Source unter der AGPL-3.0.',
		heroTitle: 'Dein <span class="blue">eigener</span> Remote-Desktop-Server',
		heroLead: 'Ein RustDesk-kompatibler Server in Go, mit einer Web-Konsole für die Geräte, die du betreust.',
		install: 'Installieren',
		downloadClient: 'Client herunterladen',
		readDocs: 'Zur Doku',
		markLabel: 'Das NeoDesk-Zeichen: ein Quadrat für deinen Server und ein Kreis für den RustDesk-Client. Wo sie sich überlappen, teilen sie sich die Konsole.',
		serverTitle: 'Ein Binary auf <span class="blue">deinem Server</span>',
		serverLead: 'Der Server von RustDesk besteht aus zwei Programmen, hbbs und hbbr. NeoDesk erledigt beides in einem Go-Binary, und dasselbe Binary liefert auch die Web-Konsole aus.',
		clientPorts: 'RustDesk-Clients verbinden sich über die Ports {{CLIENT_PORTS}}. Alle Ports stehen auf der <a class="teal" href="{{PREFIX}}/docs/operations/ports/">Seite Ports</a> in der Doku.',
		and: 'und',
		clientTitle: 'Funktioniert mit dem <span class="lime">RustDesk-Client</span>',
		clientLead: 'Für Remote-Sitzungen reicht der normale RustDesk-Client. Trage in seinen Netzwerkeinstellungen vier Werte ein: ID-Server, Relay-Server, API-Server und Schlüssel.',
		clientBody: 'Die Übersicht der Konsole zeigt alle vier mit einer Schaltfläche zum Kopieren, und „QR anzeigen“ packt sie für ein Handy in einen Code. „Computer hinzufügen“, „Mit Code koppeln“, das Hardware-Inventar und ein eigenes Branding des Clients brauchen den NeoDesk-Client. Die „Schnellhilfe“ braucht ihn nur auf dem Computer, dem du hilfst: Dort startet die Person die NeoDesk Schnellhilfe, und du verbindest dich im Browser oder in deiner Desktop-App.',
		heroConsoleAlt: 'Die Geräteliste der NeoDesk-Web-Konsole: Ordner und Gruppen und eine Tabelle der Geräte mit ID, Hostname, Plattform, zuletzt gesehen und Status',
		heroClientAlt: 'Der NeoDesk-Desktop-Client: ID und Einmalpasswort dieses Computers und eine Liste der letzten Computer zum Verbinden',
		overviewAlt: 'Der Bereich Client-Einrichtung auf der Übersicht der Konsole: die Serveradresse für die Clients, darunter ID-Server, Relay-Server, API-Server und Schlüssel, jeder mit einer Schaltfläche zum Kopieren, und die Schaltfläche für den QR-Code',
		consoleTitle: 'Alle Geräte in <span class="teal">einer Liste</span>',
		consoleLead: 'Suche nach ID, Name, Benutzer oder Plattform. Sortiere Geräte in Ordner und Gruppen und vergib eigene Tags.',
		devicesAlt: 'Die Geräteliste in der Web-Konsole von NeoDesk: links Ordner und Gruppen, daneben eine Tabelle der Geräte mit ID, Hostname, Plattform, zuletzt gesehen, Status und Tags',
		detailTitle: 'Gerät öffnen und <span class="teal">verbinden</span>',
		detailLead: 'Ein Klick auf ein Gerät öffnet seine Details. Von dort verbindest du dich, oder du schaust erst nach, was es ist und was es gerade tut.',
		factApproval: '<b>Freigabe vor dem Zugriff:</b> Im Modus „Verwaltet“ wartet ein neuer RustDesk-Client unter „Registrierungsanfragen“, bis ihn jemand genehmigt.',
		factAudit: '<b>Audit-Protokoll</b> über alles, was Benutzer in der Konsole tun.',
		factSignIn: '<b>Anmeldung</b> über LDAP, Active Directory oder OIDC.',
		detailAlt: 'Ein Gerät in der Konsole: seine aktuelle Auslastung und Identität, mit Tabs für Hardware, Metriken, Live-Daten, Tags und Notizen sowie Aktionen, und die Schaltfläche Verbinden',
		dataTitle: 'Deine Daten bleiben auf <span class="blue">deinem Server</span>',
		dataLead: 'NeoDesk schickt seinen Entwicklern keine Analysedaten, keine Absturzberichte und keine Nutzungsdaten. Der Code steht unter der AGPL-3.0. Mehr dazu in den <a class="teal" href="{{PREFIX}}/docs/project/privacy">Hinweisen zum Datenschutz</a> und in der <a class="teal" href="{{PREFIX}}/docs/project/license">Lizenz</a>.',
		questionsTitle: 'Fragen und Antworten',
		skip: 'Zum Inhalt springen',
		copy: 'Kopieren',
		copied: 'Kopiert',
		copyFailed: 'Kopieren fehlgeschlagen',
		installOn: 'Installieren auf',
		docsPageHas: '<a class="teal" href="{href}">Auf der Doku-Seite</a> stehen alle Optionen.',
		copyCommands: 'Die Installationsbefehle für {os} kopieren'
	}
};

const KEYS = (Object.keys(HOME.en) as (keyof HomeStrings)[]).filter((k) => k !== 'summary');

/** The home page strings a language still lacks; empty when it has them all. */
export function missingHomeStrings(code: string): string[] {
	const have = HOME[code] ?? {};
	const missing: string[] = KEYS.filter((k) => !have[k]).map((k) => `home.${k}`);
	if (code !== 'en' && !have.summary) missing.push('home.summary');
	return missing;
}

/** The home page strings of a language. Only call it for a language that has them all. */
export const homeStringsOf = (code: string) => ({ ...HOME.en, ...HOME[code] }) as HomeStrings;
