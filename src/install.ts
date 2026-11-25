// How to install NeoDesk, in one place: the home page's install tabs and the "For AI
// agents" section of llms.txt are built from this list. The build checks that every
// command here is in a code block of the same language on its docs page, so the home
// page cannot drift from the docs.

export interface InstallMethod {
	id: string;
	/** The tab on the home page */
	tab: string;
	/** The docs page that explains this install, without .md */
	docs: string;
	lang: 'bash' | 'powershell';
	/** The commands, one per line, as the docs page has them */
	lines: string[];
	/** What happens, for the home page, by language code: plain text, one or two short sentences */
	note: Record<string, string>;
	/** For llms.txt: set on an install that is a single command, with what it gives you */
	oneLine?: string;
}

export const INSTALLS: InstallMethod[] = [
	{
		id: 'docker',
		tab: 'Docker',
		docs: '/docs/getting-started/docker',
		lang: 'bash',
		lines: ['curl -fsSL https://neode.sk/install.sh | sudo bash'],
		note: {
			en: 'The script installs Docker when it is missing, pulls the published image and runs the server and the web console in one container. At the end it prints the console\'s address and the admin password. The console speaks plain HTTP on port 3375.',
			de: 'Das Skript installiert Docker, falls es fehlt, lädt das veröffentlichte Image und startet Server und Web-Konsole in einem Container. Am Ende zeigt es die Adresse der Konsole und das Admin-Passwort. Die Konsole spricht unverschlüsseltes HTTP auf Port 3375.'
		},
		oneLine: 'Docker: the server and the web console in one container, from the published image'
	},
	{
		id: 'linux',
		tab: 'Linux',
		docs: '/docs/getting-started/linux',
		lang: 'bash',
		lines: ['curl -fsSL https://neode.sk/neodesk.sh | sudo bash'],
		note: {
			en: 'The script downloads the newest release, checks it and installs it as one systemd service. Piped into bash like this, it asks nothing and installs with the defaults. It shows the admin password once.',
			de: 'Das Skript lädt das neueste Release herunter, prüft es und installiert es als einen systemd-Dienst. So an bash übergeben, fragt es nichts und nimmt die Standardwerte. Das Admin-Passwort zeigt es nur einmal an.'
		},
		oneLine: 'Linux: one systemd service. Piped into bash like this, the script asks nothing and installs with the defaults'
	},
	{
		id: 'windows',
		tab: 'Windows',
		docs: '/docs/getting-started/windows',
		lang: 'powershell',
		lines: [
			'Invoke-WebRequest https://neode.sk/neodesk.ps1 -OutFile neodesk.ps1 -UseBasicParsing',
			'.\\neodesk.ps1'
		],
		note: {
			en: 'Run it in PowerShell as Administrator and choose Fresh installation in the menu. The script downloads the newest release and runs it as the Windows service NeoDeskServer, or as a scheduled task when NSSM is missing. It shows the admin password once.',
			de: 'Führe es in PowerShell als Administrator aus und wähle im Menü Fresh installation. Das Skript lädt das neueste Release herunter und betreibt es als Windows-Dienst NeoDeskServer, oder als geplante Aufgabe, wenn NSSM fehlt. Das Admin-Passwort zeigt es nur einmal an.'
		}
	}
];

/** The docs page whose table of ports the home page's port list comes from. */
export const PORTS_PAGE = 'operations/ports';

export interface ClientPort {
	port: string;
	protocol: string;
}

/**
 * The ports RustDesk clients need open to the internet, from the table on the ports page:
 * the rows that RustDesk clients connect to and that say Yes under "Open to the internet".
 */
export function clientPorts(markdown: string): ClientPort[] {
	const rows = markdown
		.split('\n')
		.filter((l) => /^\|\s*\d{2,5}\s*\|/.test(l))
		.map((l) => l.split('|').slice(1, -1).map((c) => c.trim()));
	return rows.filter((r) => r.length >= 4 && /^RustDesk clients\b/.test(r[2]) && /^Yes\b/.test(r[3])).map((r) => ({ port: r[0], protocol: r[1] }));
}

/** The protocol column of the ports table, by port, in the language the page is written in. */
export function protocolsOf(markdown: string): Map<string, string> {
	const rows = markdown
		.split('\n')
		.filter((l) => /^\|\s*\d{2,5}\s*\|/.test(l))
		.map((l) => l.split('|').slice(1, -1).map((c) => c.trim()));
	return new Map(rows.filter((r) => r.length >= 2).map((r) => [r[0], r[1]]));
}

/** The lines of every fenced block of a language in a Markdown body. */
export function blocksOf(markdown: string, lang: string): string[] {
	const lines: string[] = [];
	for (const m of markdown.matchAll(/^( *)```(\w+)[^\n]*\n([\s\S]*?)^\1```/gm)) {
		if (m[2] === lang) lines.push(...m[3].split('\n').map((l) => l.slice(m[1].length).trimEnd()));
	}
	return lines;
}
