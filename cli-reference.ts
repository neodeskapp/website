// Writes the command reference of the docs from what the server's own generator printed.
//
//   cd <neodesk>/neodesk-server && go run ./cmd/clidocs -out <folder> -version <version>
//   node cli-reference.ts <folder>
//
// clidocs writes index.md, one <group>.md per command group, excluded.md and commands.json,
// all from the command table the command line runs on (ndcli/commands.json). This script
// turns them into docs pages, keeping the text as clidocs wrote it:
//
//   content/docs/command-line/reference.md                    from index.md
//   content/docs/command-line/reference/<group>.md            from <group>.md
//   content/docs/command-line/reference/routes-left-out.md    from excluded.md
//
// and the same pages under content/de/docs/. The commands stay in English there, as the
// command line prints them; the German pages get a German title, description and intro.
// Every run rewrites the folder, so a group that is gone loses its page, and it drops the
// recorded heading ids of these pages from content/anchors.json: the next build records the
// ids of the commands that exist now.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const REF = 'command-line/reference';

interface Description {
	version: string;
	groups: { name: string; summary: string; commands: unknown[] }[];
	excluded: unknown[];
	counts: Record<string, number>;
}

// The groups' summaries in German, for the German pages' descriptions and intros. A group
// the command table gains needs its line here, or the script stops.
const GERMAN: Record<string, string> = {
	account: 'Du selbst: das Konto und die Berechtigungen, mit denen das Token handelt',
	activity: 'Was Personen auf Geräten getan haben: die Aktivität, die Agenten melden',
	agents: 'Releases, Vorlagen und Installationsdateien der NeoDesk-Agenten',
	'api-tokens': 'API-Tokens für Skripte, diese Kommandozeile und KI-Agenten',
	attestation: 'Der Leistungstest des Servers und sein Abzeichen',
	audit: 'Das Audit-Protokoll und die Sicherheitsübersicht',
	automation: 'Alarmregeln, Alarme, wartende Gerätebefehle und Alarm-Mails',
	backups: 'Vollständige Sicherungen, der Sicherungsplan und Wiederherstellungen',
	billing: 'Abrechnung: Pakete, Verträge, Sitzungen, Berichte und die Uhr',
	branding: 'Das Aussehen der Konsole: Logo, Farben, Profile und Schriften',
	cdap: 'CDAP-Geräte, ihre Widgets und Befehle',
	'cdap-studio': 'Abläufe in CDAP Studio',
	chat: 'Chat-Suche und Dateien',
	'client-branding': 'Name, Logo und Links, die die Desktop-Clients zeigen',
	'cross-platform': 'Was jede Geräteplattform unterstützt',
	dashboard: 'Die Zahlen auf dem Dashboard und der Status des Servers',
	dataguard: 'Data-Guard-Richtlinien und die Ereignisse, die Geräte melden',
	'device-control': 'Bildschirm, Tastatur, Maus, Zwischenablage und Terminal eines NeoDesk-Agenten',
	'device-files': 'Dateien auf einem Gerät mit NeoDesk-Agent',
	'device-groups': 'Gerätegruppen, von Hand oder nach Tag',
	'device-tokens': 'Tokens, mit denen ein neues Gerät ohne Genehmigung beitritt',
	devices: 'Geräte: Liste, Details, Notizen, Tags, Sperren, Verbindungseinstellungen',
	enrollment: 'Wer beitreten darf, und Geräte, die auf ihre Genehmigung warten',
	fleet: 'Flottenaufgaben, Workflows, Compliance und Ressourcen',
	folders: 'Ordner, die Geräte sortieren',
	generator: 'Der Generator für den Support-Client: Pakete und Builds',
	'guest-links': 'Gastlinks, mit denen sich jemand ohne Konto verbindet',
	'help-requests': 'Hilfeanfragen, die von Geräten kommen',
	inventory: 'Hardware- und Software-Inventar der Geräte',
	invites: 'Einladungen, die einen Computer zu diesem Server hinzufügen',
	keys: 'Der Schlüssel des Servers, die Client-Einstellungen und der QR-Code',
	languages: 'Die Sprachen und Übersetzungen der Konsole',
	mesh: 'MeshCentral-Geräte, ihre Gruppen und Aufzeichnungen',
	network: 'Netzwerkprüfungen: Ziele, Überwachung, Ping und Port-Tests',
	organizations: 'Organisationen mit ihren Benutzern, Geräten und Einstellungen',
	pairing: 'Kopplungscodes für Agenten',
	'panel-access': 'Welche Bereiche der Konsole und Funktionen der Clients jedes Konto nutzen darf',
	policies: 'Richtlinien von Organisationen und die Attestierung von Geräten',
	registrations: 'Geräte, die sich registrieren wollen',
	remote: 'Laufende Fernsitzungen',
	'remote-targets': 'RDP-, VNC- und SSH-Ziele',
	reports: 'Berichte und Trends',
	'resource-control': 'USB, Laufwerke, Monitore und Kontingente auf Geräten',
	restart: 'Neustarts des Servers, die nach einer Änderung anstehen',
	roles: 'Rollen und ihre Berechtigungen',
	scaling: 'Relay-Server und Regeln zur Skalierung',
	server: 'Der Server: Zustand, Versionen, Ressourcen, Dienste und Logs',
	sessions: 'Anmeldungen an der Konsole: die Browser und Geräte, auf denen ein Konto angemeldet ist',
	settings: 'Einstellungen des Servers: Mail, Anmeldung, Adressen, Registrierung, Sitzungen',
	'setup-guide': 'Die Einrichtungsanleitung, die eine neue Installation ihrem ersten Admin auf der Übersicht zeigt',
	strategies: 'Strategien: Einstellungen, die an Desktop-Clients gehen',
	support: 'Schnellhilfe-Sitzungen',
	tags: 'Tags von Geräten',
	tenants: 'Mandanten mit ihren Geräten und Benutzern',
	tickets: 'Tickets mit Kommentaren und Anhängen',
	toolkit: 'Kleine Werkzeuge für Netzwerk und Text',
	transfers: 'Dateiübertragungen zwischen der Konsole und Geräten',
	updates: 'Updates des Servers und die Sicherungen davor',
	'user-groups': 'Benutzergruppen',
	users: 'Konten der Konsole: anlegen, ändern, deaktivieren, löschen'
};

const dir = process.argv[2];
if (!dir || !fs.existsSync(path.join(dir, 'commands.json'))) {
	console.error('Usage: node cli-reference.ts <folder that go run ./cmd/clidocs -out wrote>');
	process.exit(2);
}
const read = (name: string) => fs.readFileSync(path.join(dir, name), 'utf8').replace(/\r\n?/g, '\n');
const d = JSON.parse(read('commands.json')) as Description;
const missing = d.groups.filter((g) => !GERMAN[g.name]).map((g) => g.name);
if (missing.length) {
	console.error(`No German summary for the group${missing.length > 1 ? 's' : ''} ${missing.join(', ')}; add ${missing.length > 1 ? 'them' : 'it'} to GERMAN in cli-reference.ts`);
	process.exit(1);
}
if (!d.version) {
	console.error('commands.json names no version; run clidocs with -version <version>');
	process.exit(1);
}

const pageOf = (name: string) => (name === 'excluded' ? 'routes-left-out' : name);

/**
 * clidocs' Markdown as a docs page body: links between its files become docs addresses,
 * every code block is marked quoted (it is the command line's own text), a usage line
 * becomes a text block without a copy button, and a < outside code is escaped, since the
 * docs allow HTML and <role> would vanish as a tag. In a table row, a | inside code (the
 * choices of a flag, `--status online|offline`) is escaped, or it would split the cell.
 */
function adapt(md: string): string {
	const out: string[] = [];
	const lines = md.split('\n');
	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		if (line.startsWith('```')) {
			const end = lines.indexOf('```', i + 1);
			const body = lines.slice(i + 1, end);
			const usage = body.every((l) => l.endsWith('[flags]') || l.includes('<'));
			out.push(usage ? '```text quoted' : '```bash quoted', ...body, '```');
			i = end;
			continue;
		}
		const linked = line
			.replace('[excluded.md](excluded.md)', '[Routes without a command](excluded.md)')
			.replace(/\]\(([a-z][a-z0-9-]*)\.md\)/g, (_, name: string) => `](/docs/${REF}/${pageOf(name)})`);
		const row = linked.startsWith('|');
		out.push(
			linked
				.split('`')
				.map((part, n) => (n % 2 ? (row ? part.replace(/(?<!\\)\|/g, '\\|') : part) : part.replace(/</g, '&lt;')))
				.join('`')
		);
	}
	return out.join('\n');
}

function frontMatter(fields: Record<string, string | number | boolean>): string {
	return `---\n${Object.entries(fields)
		.map(([k, v]) => `${k}: ${v}`)
		.join('\n')}\n---\n\n`;
}

const pages = new Map<string, string>();
const put = (rel: string, text: string) => pages.set(rel, text.replace(/\n{3,}/g, '\n\n').trim() + '\n');
const commands = d.counts.commands;
const groupCount = d.counts.groups;

// The reference's own page: what clidocs put in index.md, without its h1
{
	const body = adapt(read('index.md').replace(/^# .*\n+/, ''));
	const [summary, ...rest] = body.split('\n\n');
	put(
		`docs/${REF}.md`,
		frontMatter({
			title: 'Command reference',
			description: 'Every command of the neodesk command line by group, the flags every command takes, its environment variables and its exit codes.',
			order: 9,
			fold: true,
			quoted: true,
			icon: 'menu_book'
		}) +
			`${summary}\n\nThis reference is made from the command table of the release ${d.version}: ${commands} commands in ${groupCount} groups. Each group has a page with its commands, their arguments and flags, the permission each needs and the console route it calls.\n\n${rest.join('\n\n')}`
	);
	put(
		`de/docs/${REF}.md`,
		frontMatter({
			title: 'Befehlsreferenz',
			description: 'Alle Befehle der Kommandozeile neodesk nach Gruppen, die Flags, die jeder Befehl kennt, ihre Umgebungsvariablen und ihre Exit-Codes.',
			order: 9,
			fold: true,
			quoted: true
		}) +
			`Die Referenz aller Befehle der Kommandozeile neodesk, erzeugt aus der Befehlstabelle des Releases ${d.version}: ${commands} Befehle in ${groupCount} Gruppen. Jede Gruppe hat eine Seite mit ihren Befehlen, deren Argumenten und Flags, der Berechtigung, die jeder braucht, und der Route der Konsole, die er aufruft.\n\nDer Text unten und auf den Seiten der Gruppen steht auf Englisch, so wie die Kommandozeile selbst ihn mit \`--help\` zeigt.\n\n${body}`
	);
}

// One page per group: its commands, as clidocs wrote them, one level up
d.groups.forEach((g, i) => {
	const raw = read(`${g.name}.md`);
	// The group's heading and its summary line go; the page's title and intro take their place
	const commandsPart = raw.slice(raw.indexOf('\n### '));
	const body = adapt(commandsPart.replace(/^### /gm, '## '));
	const n = g.commands.length;
	const summary = g.summary.replace(/\.$/, '');
	const intro = `\`neodesk ${g.name} --help\` lists the same commands in the terminal. The flags every command takes are in the [command reference](/docs/${REF}#flags-for-every-command).`;
	put(
		`docs/${REF}/${g.name}.md`,
		frontMatter({ title: `neodesk ${g.name}`, description: `${n} command${n === 1 ? '' : 's'}. ${summary}.`, order: i + 1, quoted: true }) + `${summary}.\n\n${intro}\n\n${body}`
	);
	const de = GERMAN[g.name];
	put(
		`de/docs/${REF}/${g.name}.md`,
		frontMatter({ title: `neodesk ${g.name}`, description: `${n} ${n === 1 ? 'Befehl' : 'Befehle'}. ${de}.`, order: i + 1, quoted: true }) +
			`${de}.\n\nDie Befehle stehen hier auf Englisch, so wie die Kommandozeile sie mit \`neodesk ${g.name} --help\` zeigt. Die Flags, die jeder Befehl kennt, stehen in der [Befehlsreferenz](/docs/${REF}#flags-for-every-command).\n\n${body}`
	);
});

// The routes the command line leaves out, by reason
{
	const body = adapt(read('excluded.md').replace(/^## .*\n+/, ''));
	put(
		`docs/${REF}/routes-left-out.md`,
		frontMatter({
			title: 'Routes without a command',
			description: 'The console routes the command line leaves out, by reason: routes for devices and clients, pages of the console, signing in and old addresses.',
			order: 100,
			quoted: true
		}) + body
	);
	put(
		`de/docs/${REF}/routes-left-out.md`,
		frontMatter({
			title: 'Routen ohne Befehl',
			description: 'Die Routen der Konsole, die die Kommandozeile auslässt, nach dem Grund: für Geräte und Clients, Seiten der Konsole, Anmeldung und alte Adressen.',
			order: 100,
			quoted: true
		}) + `Die Gründe stehen hier auf Englisch, wie der Generator der Kommandozeile sie schreibt.\n\n${body}`
	);
}

// Write: the group folders are the script's alone, so they are made new
for (const base of ['content/docs', 'content/de/docs']) fs.rmSync(path.join(root, base, REF), { recursive: true, force: true });
for (const [rel, text] of pages) {
	const file = path.join(root, 'content', rel);
	fs.mkdirSync(path.dirname(file), { recursive: true });
	fs.writeFileSync(file, text);
}

// Forget the heading ids of these pages; the next build records the ones that exist now
const anchorsFile = path.join(root, 'content/anchors.json');
if (fs.existsSync(anchorsFile)) {
	const anchors = JSON.parse(fs.readFileSync(anchorsFile, 'utf8')) as Record<string, string[]>;
	for (const slug of Object.keys(anchors)) if (slug === REF || slug.startsWith(`${REF}/`)) delete anchors[slug];
	fs.writeFileSync(anchorsFile, JSON.stringify(anchors, null, '\t') + '\n');
}

console.log(`Wrote ${pages.size} pages: ${commands} commands in ${groupCount} groups, ${d.excluded.length} routes left out, from the release ${d.version}`);
