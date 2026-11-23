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
	/** What happens, for the home page: plain text, one or two short sentences */
	note: string;
	/** For llms.txt: set on an install that is a single command, with what it gives you */
	oneLine?: string;
}

export const INSTALLS: InstallMethod[] = [
	{
		id: 'docker',
		tab: 'Docker',
		docs: '/docs/getting-started/docker',
		lang: 'bash',
		lines: ['curl -fsSL https://raw.githubusercontent.com/neodeskapp/neodesk/main/install.sh | sudo bash'],
		note: 'The script installs Docker when it is missing, pulls the published image and runs the server and the web console in one container. At the end it prints the console\'s address and the admin password. The console speaks plain HTTP on port 5000.',
		oneLine: 'Docker: the server and the web console in one container, from the published image'
	},
	{
		id: 'linux',
		tab: 'Linux',
		docs: '/docs/getting-started/linux',
		lang: 'bash',
		lines: ['curl -fsSL https://raw.githubusercontent.com/neodeskapp/neodesk/main/neodesk.sh | sudo bash'],
		note: 'The script downloads the newest release, checks it and installs it as one systemd service. Piped into bash like this, it asks nothing and installs with the defaults. It shows the admin password once.',
		oneLine: 'Linux: one systemd service. Piped into bash like this, the script asks nothing and installs with the defaults'
	},
	{
		id: 'windows',
		tab: 'Windows',
		docs: '/docs/getting-started/windows',
		lang: 'powershell',
		lines: [
			'Invoke-WebRequest https://raw.githubusercontent.com/neodeskapp/neodesk/main/neodesk.ps1 -OutFile neodesk.ps1 -UseBasicParsing',
			'.\\neodesk.ps1'
		],
		note: 'Run it in PowerShell as Administrator and choose Fresh installation in the menu. The script downloads the newest release and runs it as the Windows service NeoDeskServer, or as a scheduled task when NSSM is missing. It shows the admin password once.'
	}
];

/** The lines of every fenced block of a language in a Markdown body. */
export function blocksOf(markdown: string, lang: string): string[] {
	const lines: string[] = [];
	for (const m of markdown.matchAll(/^( *)```(\w+)[^\n]*\n([\s\S]*?)^\1```/gm)) {
		if (m[2] === lang) lines.push(...m[3].split('\n').map((l) => l.slice(m[1].length).trimEnd()));
	}
	return lines;
}
