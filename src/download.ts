// The download page, /download/ and /de/download/: the desktop client's file for the
// visitor's computer beside the mark, a one-line warning about phone scams that opens
// into its details, every file of the release with its checksum, and what the client needs. The release comes from src/client-release.ts at
// build time; the recommendation from src/detect.ts, in the visitor's browser.
//
// The page is static. Every recommendation the script can make is in the HTML as a hidden
// block, and the script only shows one of them; without scripts the page shows "Pick
// your system" and the full list, which links every file. A click on a recommended
// download opens a window with the steps that follow; where the browser has no
// <dialog>, the steps stay under the button.
import type { ClientFile, ClientOffer, ClientRelease, ClientOs, ClientArch, FileKind } from './client-release.ts';
import { detectSystem, recommendationOf, RECOMMENDATIONS } from './detect.ts';

const esc = (s: unknown) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export interface DownloadStrings {
	/** The h1 */
	title: string;
	/** <title>, at most 60 characters */
	pageTitle: string;
	/** The meta description, at most 155 characters */
	description: string;
	lead: string;
	pick: string;
	pickNote: string;
	forThis: string;
	downloadFor: Record<ClientOs, string>;
	/** x64 and ARM64 as buttons and labels say them; for a Mac, Apple silicon and Intel */
	arch: Record<ClientArch, string>;
	macArch: Record<ClientArch, string>;
	/** What to do with the file, a step each; the join step follows */
	windowsSteps: string[];
	windowsGuess: string;
	/** HTML */
	macSteps: string[];
	macWhich: string;
	/** {command} is the install command */
	linuxAfter: string;
	linuxWhich: string;
	join: string;
	/** Above the steps where they stay on the page */
	stepsTitle: string;
	/** The window that opens after a click on a recommended download; {file} is the file's name */
	windowTitle: string;
	windowFile: string;
	windowAgain: string;
	windowClose: string;
	phoneTitle: string;
	phoneText: string;
	phoneHere: string;
	/** For the screen reader's one announcement: "Recommended download: {what}" */
	said: string;
	candidate: string;
	/** {version}, {date} */
	releaseLine: string;
	releaseNotes: string;
	noRelease: string;
	scamTitle: string;
	/** What opens the notice's details */
	scamMore: string;
	scam: string[];
	scamAfterTitle: string;
	/** HTML: the last one holds the links to the reporting pages */
	scamAfter: string[];
	allTitle: string;
	/** {version} */
	allLead: string;
	jump: string;
	os: Record<ClientOs, string>;
	osNote: Partial<Record<ClientOs, string>>;
	kinds: Record<FileKind | 'linuxPortable' | 'macPortable', { title: string; text: string }>;
	sha: string;
	/** "{arch}, {size}: {file}", the accessible name of a file's link */
	fileLabel: string;
	repoTitle: string;
	repoText: string;
	/** While there is no final release */
	repoTesting: string;
	repoFamilies: { deb: string; rpm: string; suse: string };
	repoMore: string;
	checkTitle: string;
	/** HTML; {sums} is the address of SHA256SUMS */
	checkText: string;
	checkHow: string;
	previewTitle: string;
	/** {version}, {date} */
	previewText: string;
	previewFiles: string;
	needsTitle: string;
	needs: { title: string; text: string }[];
	adminTitle: string;
	admin: { title: string; text: string }[];
	helpTitle: string;
	help: string;
	copy: string;
	copyCode: string;
	copied: string;
	copyFailed: string;
}

export const DOWNLOAD: Record<string, DownloadStrings> = {
	en: {
		title: 'Download NeoDesk',
		pageTitle: 'Download the NeoDesk client for Windows, macOS and Linux',
		description: 'The NeoDesk desktop client for Windows, macOS and Linux. The page picks the file for your computer and lists every file with its checksum.',
		lead: 'The desktop client for Windows, macOS and Linux.',
		pick: 'Pick your system',
		pickNote: 'Every file is listed below, for x64 (Intel and AMD) and ARM64 processors.',
		forThis: 'For this computer',
		downloadFor: { windows: 'Download for Windows', macos: 'Download for Mac', linux: 'Download for Linux' },
		arch: { x64: 'x64', arm64: 'ARM64' },
		macArch: { x64: 'Intel', arm64: 'Apple silicon' },
		windowsSteps: ['Open the file and click Install.', 'Windows asks if Windows Command Processor, by Microsoft Windows, may make changes. That is the NeoDesk setup installing itself: click Yes.'],
		windowsGuess: 'For Intel and AMD processors. On a PC with an ARM processor, such as a Snapdragon, take the <a href="#windows">ARM64 file</a>.',
		macSteps: ['Open the file and drag NeoDesk into Applications.', 'If your Mac says it can\'t check the app, open System Settings, Privacy &amp; Security, and click Open Anyway.', 'When NeoDesk asks, allow Screen Recording and Accessibility.'],
		macWhich: 'Which Mac is this? In the Apple menu, choose About This Mac. If it lists a chip, such as Apple M1, take Apple silicon. If it lists an Intel processor, take Intel.',
		linuxAfter: 'In the folder with the file, install it with your package manager: {command}',
		linuxWhich: 'Take the .deb for Debian and Ubuntu, the .rpm for Fedora and RHEL. openSUSE has its own .rpm, <a href="#linux">listed below</a>.',
		join: 'Join the computer to your server with the code of an invite: in NeoDesk, Settings, Server, Join a server.',
		stepsTitle: 'After the download',
		windowTitle: 'Your download has started',
		windowFile: '{file} is downloading. Then:',
		windowAgain: 'Download again',
		windowClose: 'Close',
		phoneTitle: 'NeoDesk has no app for phones and tablets.',
		phoneText: 'From a phone or tablet, use the RustDesk app with your NeoDesk server: <a href="{phones}">Phones and tablets</a> says how. On a tablet, <a href="{browser}">remote desktop in the browser</a> works too.',
		phoneHere: 'To install NeoDesk on a computer, open this page there. Every file is listed below.',
		said: 'Recommended download: {what}',
		candidate: 'Release candidate, for testing',
		releaseLine: 'Version {version}, published {date}.',
		releaseNotes: 'Release notes',
		noRelease: 'There is no published release of the client yet.',
		scamTitle: 'Only install NeoDesk if you, or someone you know and trust, asked for it.',
		scamMore: 'How phone scams work, and what to do if it happened',
		scam: [
			'Banks, Microsoft, the police, delivery firms and "refund departments" don\'t call and ask you to install a remote desktop app.',
			'If a stranger on the phone tells you to install this right now, hang up.',
			'Never give your ID and password to someone you don\'t know, and don\'t accept their session.'
		],
		scamAfterTitle: 'If it already happened',
		scamAfter: [
			'Disconnect the computer from the internet.',
			'Uninstall NeoDesk.',
			'Call your bank on the number on your card.',
			'Change your passwords from another device, email and online banking first.',
			'Report it to the police: in Germany at the <a href="https://portal.onlinewache.polizei.de/de/" rel="noopener">police online station</a>. Elsewhere, at your local police or <a href="https://econsumer.gov/" rel="noopener">econsumer.gov</a>.'
		],
		allTitle: 'All downloads',
		allLead: 'Every file of version {version}, from GitHub. x64 is for Intel and AMD processors, ARM64 for ARM processors.',
		jump: 'Systems',
		os: { windows: 'Windows', macos: 'macOS', linux: 'Linux' },
		osNote: { linux: 'The packages install next to a stock RustDesk and leave it in place. NeoDesk runs as its own service, neodesk.service.' },
		kinds: {
			exe: { title: 'Installer', text: 'Opens NeoDesk right away. Click Install in it to keep NeoDesk on the computer.' },
			msi: { title: 'MSI package', text: 'Installs NeoDesk, or updates an installed one. For deployment tools such as Intune.' },
			portable: { title: 'Portable', text: 'NeoDesk without installing: unpack the archive and run it.' },
			macPortable: { title: 'Portable', text: 'NeoDesk without installing: unpack the zip and run it.' },
			dmg: { title: 'Disk image', text: 'Open it and drag NeoDesk into Applications.' },
			deb: { title: 'Debian and Ubuntu', text: 'For apt: Debian, Ubuntu and the systems built on them.' },
			rpm: { title: 'Fedora and RHEL', text: 'For dnf: Fedora, RHEL, Rocky Linux and AlmaLinux.' },
			suse: { title: 'openSUSE and SLES', text: 'For zypper.' },
			linuxPortable: { title: 'Portable', text: 'NeoDesk without installing: unpack the archive and run it.' }
		},
		sha: 'SHA-256',
		fileLabel: '{arch}, {size}: {file}',
		repoTitle: 'Package repository',
		repoText: 'On Linux, the signed repository at pkg.neode.sk keeps NeoDesk up to date with your system\'s updates, for x64 and ARM64.',
		repoTesting: 'Its stable suite stays empty until the client\'s first final release. Until then the commands below use the testing suite, which has the release candidates.',
		repoFamilies: { deb: 'Debian and Ubuntu', rpm: 'Fedora, RHEL, Rocky Linux and AlmaLinux', suse: 'openSUSE and SLES' },
		repoMore: 'The key\'s fingerprint, the stable suite and how to remove the repository are in <a href="{docs}">Install from the package repository</a>.',
		checkTitle: 'Check a download',
		checkText: 'Each file\'s SHA-256 is under its row and in <a href="{sums}" rel="noopener">SHA256SUMS</a>. Compute the hash of the file you downloaded and compare:',
		checkHow: 'In PowerShell: <code>Get-FileHash &lt;file&gt;</code>. On a Mac: <code>shasum -a 256 &lt;file&gt;</code>. On Linux: <code>sha256sum &lt;file&gt;</code>.',
		previewTitle: 'Preview',
		previewText: 'The next version, {version}, published {date}.',
		previewFiles: 'Files of the preview',
		needsTitle: 'Before you install',
		needs: [
			{ title: 'It needs a NeoDesk server', text: 'The client has no server built in and never falls back to a public one. It connects to your IT team\'s NeoDesk server, or to one you <a href="{server}">install yourself</a>.' },
			{ title: 'An invite does it for you', text: 'An invite link from <a href="{invite}">Add a computer</a> offers the right file and joins the computer to the server by itself.' },
			{ title: 'RustDesk clients work too', text: 'A NeoDesk server also works with the stock RustDesk client. See <a href="{rustdesk}">Connect a RustDesk client</a>.' }
		],
		adminTitle: 'For administrators',
		admin: [
			{ title: 'Many computers', text: '<a href="{many}">Set up many computers at once</a> with one invite, or hand the stock RustDesk client its settings from a script.' },
			{ title: 'Linux updates', text: '<a href="{repo}">Install from the package repository</a> and your system updates NeoDesk with everything else.' }
		],
		helpTitle: 'Help',
		help: 'Ask on the <a href="{discord}" rel="noopener">NeoDesk Discord</a> or in the <a href="{discussions}" rel="noopener">discussions on GitHub</a>.',
		copy: 'Copy',
		copyCode: 'Copy these commands',
		copied: 'Copied',
		copyFailed: "Couldn't copy"
	},
	de: {
		title: 'NeoDesk herunterladen',
		pageTitle: 'NeoDesk-Client für Windows, macOS und Linux herunterladen',
		description: 'Der Desktop-Client von NeoDesk für Windows, macOS und Linux. Die Seite wählt die Datei für deinen Computer und nennt jede Datei mit Prüfsumme.',
		lead: 'Der Desktop-Client für Windows, macOS und Linux.',
		pick: 'Wähle dein System',
		pickNote: 'Alle Dateien stehen weiter unten, für x64-Prozessoren (Intel und AMD) und ARM64.',
		forThis: 'Für diesen Computer',
		downloadFor: { windows: 'Für Windows herunterladen', macos: 'Für Mac herunterladen', linux: 'Für Linux herunterladen' },
		arch: { x64: 'x64', arm64: 'ARM64' },
		macArch: { x64: 'Intel', arm64: 'Apple-Chip' },
		windowsSteps: ['Öffne die Datei und klick auf Installieren.', 'Windows fragt, ob der Windows-Befehlsprozessor von Microsoft Windows Änderungen vornehmen darf. Das ist die Einrichtung von NeoDesk, die sich installiert: Klick auf Ja.'],
		windowsGuess: 'Für Prozessoren von Intel und AMD. Auf einem PC mit ARM-Prozessor, etwa einem Snapdragon, nimm die <a href="#windows">ARM64-Datei</a>.',
		macSteps: ['Öffne die Datei und zieh NeoDesk in „Programme“.', 'Meldet dein Mac, dass er die App nicht prüfen kann: Systemeinstellungen öffnen, Datenschutz &amp; Sicherheit, dort auf „Dennoch öffnen“ klicken.', 'Wenn NeoDesk fragt, erlaube Bildschirmaufnahme und Bedienungshilfen.'],
		macWhich: 'Welcher Mac ist das? Wähl im Apple-Menü „Über diesen Mac“. Steht dort ein Chip, etwa Apple M1, nimm Apple-Chip. Steht dort ein Intel-Prozessor, nimm Intel.',
		linuxAfter: 'Installiere sie im Ordner mit der Datei über deine Paketverwaltung: {command}',
		linuxWhich: 'Nimm die .deb für Debian und Ubuntu, die .rpm für Fedora und RHEL. openSUSE hat eine eigene .rpm, sie steht <a href="#linux">weiter unten</a>.',
		join: 'Lass den Computer mit dem Code einer Einladung deinem Server beitreten: in NeoDesk unter Einstellungen, Server, Server beitreten.',
		stepsTitle: 'Nach dem Download',
		windowTitle: 'Dein Download hat begonnen',
		windowFile: '{file} wird heruntergeladen. Danach:',
		windowAgain: 'Erneut herunterladen',
		windowClose: 'Schließen',
		phoneTitle: 'Für Handys und Tablets gibt es keine NeoDesk-App.',
		phoneText: 'Vom Handy oder Tablet aus nimmst du die RustDesk-App mit deinem NeoDesk-Server: <a href="{phones}">Handys und Tablets</a> erklärt, wie. Auf einem Tablet geht auch <a href="{browser}">Remote Desktop im Browser</a>.',
		phoneHere: 'Um NeoDesk auf einem Computer zu installieren, öffne diese Seite dort. Alle Dateien stehen weiter unten.',
		said: 'Empfohlener Download: {what}',
		candidate: 'Release Candidate, zum Testen',
		releaseLine: 'Version {version}, veröffentlicht am {date}.',
		releaseNotes: 'Release Notes',
		noRelease: 'Vom Client gibt es noch kein veröffentlichtes Release.',
		scamTitle: 'Installiere NeoDesk nur, wenn du oder jemand, den du kennst und dem du vertraust, darum gebeten hat.',
		scamMore: 'Wie Telefonbetrug abläuft, und was du tust, wenn es passiert ist',
		scam: [
			'Banken, Microsoft, die Polizei, Paketdienste und „Rückerstattungsabteilungen“ rufen nicht an, damit du ein Fernwartungsprogramm installierst.',
			'Sagt dir ein Fremder am Telefon, du sollst das jetzt sofort installieren: Leg auf.',
			'Gib deine ID und dein Passwort nie an Fremde weiter, und nimm keine Sitzung von ihnen an.'
		],
		scamAfterTitle: 'Wenn es schon passiert ist',
		scamAfter: [
			'Trenn den Computer vom Internet.',
			'Deinstalliere NeoDesk.',
			'Ruf deine Bank an, unter der Nummer auf deiner Karte.',
			'Ändere deine Passwörter auf einem anderen Gerät, zuerst E-Mail und Online-Banking.',
			'Zeig es bei der Polizei an, in Deutschland über die <a href="https://portal.onlinewache.polizei.de/de/" rel="noopener">Onlinewache</a>. Anderswo bei der Polizei vor Ort oder auf <a href="https://econsumer.gov/" rel="noopener">econsumer.gov</a>.'
		],
		allTitle: 'Alle Downloads',
		allLead: 'Jede Datei der Version {version}, von GitHub. x64 ist für Prozessoren von Intel und AMD, ARM64 für ARM-Prozessoren.',
		jump: 'Systeme',
		os: { windows: 'Windows', macos: 'macOS', linux: 'Linux' },
		osNote: { linux: 'Die Pakete installieren sich neben einem normalen RustDesk und lassen es, wie es ist. NeoDesk läuft als eigener Dienst, neodesk.service.' },
		kinds: {
			exe: { title: 'Installer', text: 'Startet NeoDesk sofort. Ein Klick auf Installieren behält NeoDesk auf dem Computer.' },
			msi: { title: 'MSI-Paket', text: 'Installiert NeoDesk oder aktualisiert eine Installation. Für Verteilwerkzeuge wie Intune.' },
			portable: { title: 'Portabel', text: 'NeoDesk ohne Installation: Archiv entpacken und starten.' },
			macPortable: { title: 'Portabel', text: 'NeoDesk ohne Installation: ZIP entpacken und starten.' },
			dmg: { title: 'Disk-Image', text: 'Öffnen und NeoDesk in „Programme“ ziehen.' },
			deb: { title: 'Debian und Ubuntu', text: 'Für apt: Debian, Ubuntu und die Systeme, die darauf aufbauen.' },
			rpm: { title: 'Fedora und RHEL', text: 'Für dnf: Fedora, RHEL, Rocky Linux und AlmaLinux.' },
			suse: { title: 'openSUSE und SLES', text: 'Für zypper.' },
			linuxPortable: { title: 'Portabel', text: 'NeoDesk ohne Installation: Archiv entpacken und starten.' }
		},
		sha: 'SHA-256',
		fileLabel: '{arch}, {size}: {file}',
		repoTitle: 'Paket-Repository',
		repoText: 'Unter Linux hält das signierte Repository auf pkg.neode.sk NeoDesk mit den normalen Updates deines Systems aktuell, für x64 und ARM64.',
		repoTesting: 'Seine Suite stable bleibt bis zum ersten finalen Release des Clients leer. Bis dahin nehmen die Befehle unten die Suite testing, die die Release Candidates hat.',
		repoFamilies: { deb: 'Debian und Ubuntu', rpm: 'Fedora, RHEL, Rocky Linux und AlmaLinux', suse: 'openSUSE und SLES' },
		repoMore: 'Den Fingerabdruck des Schlüssels, die Suite stable und wie du das Repository wieder entfernst, findest du unter <a href="{docs}">Aus dem Paket-Repository installieren</a>.',
		checkTitle: 'Einen Download prüfen',
		checkText: 'Die SHA-256 jeder Datei steht unter ihrer Zeile und in <a href="{sums}" rel="noopener">SHA256SUMS</a>. Berechne den Hash der heruntergeladenen Datei und vergleiche:',
		checkHow: 'In PowerShell: <code>Get-FileHash &lt;datei&gt;</code>. Auf dem Mac: <code>shasum -a 256 &lt;datei&gt;</code>. Unter Linux: <code>sha256sum &lt;datei&gt;</code>.',
		previewTitle: 'Vorschau',
		previewText: 'Die nächste Version, {version}, veröffentlicht am {date}.',
		previewFiles: 'Dateien der Vorschau',
		needsTitle: 'Vor der Installation',
		needs: [
			{ title: 'Er braucht einen NeoDesk-Server', text: 'Der Client hat keinen eingebauten Server und weicht nie auf einen öffentlichen aus. Er verbindet sich mit dem NeoDesk-Server deiner IT oder mit einem, den du <a href="{server}">selbst installierst</a>.' },
			{ title: 'Eine Einladung erledigt das', text: 'Ein Einladungslink aus <a href="{invite}">Computer hinzufügen</a> bietet die passende Datei an und lässt den Computer von selbst dem Server beitreten.' },
			{ title: 'RustDesk-Clients gehen auch', text: 'Ein NeoDesk-Server funktioniert auch mit dem normalen RustDesk-Client. Siehe <a href="{rustdesk}">Einen RustDesk-Client verbinden</a>.' }
		],
		adminTitle: 'Für Administratoren',
		admin: [
			{ title: 'Viele Computer', text: '<a href="{many}">Viele Computer auf einmal einrichten</a>, mit einer Einladung, oder dem normalen RustDesk-Client seine Einstellungen aus einem Skript geben.' },
			{ title: 'Updates unter Linux', text: '<a href="{repo}">Aus dem Paket-Repository installieren</a>, dann aktualisiert dein System NeoDesk mit allem anderen.' }
		],
		helpTitle: 'Hilfe',
		help: 'Frag auf dem <a href="{discord}" rel="noopener">NeoDesk-Discord</a> oder in den <a href="{discussions}" rel="noopener">Diskussionen auf GitHub</a>.',
		copy: 'Kopieren',
		copyCode: 'Diese Befehle kopieren',
		copied: 'Kopiert',
		copyFailed: 'Kopieren fehlgeschlagen'
	}
};

/** Where the page links to, in the page's language */
export interface DownloadLinks {
	/** A docs page by its logical address (/docs/...), in the page's language */
	docs: (p: string) => string;
	/** The home page's server install section */
	server: string;
	discord: string;
	discussions: string;
	/** The client's releases on GitHub, for when the build has no release to show */
	releases: string;
}

const fill = (s: string, v: Record<string, string>) => s.replace(/\{(\w+)\}/g, (m, k: string) => v[k] ?? m);

export const sizeOf = (bytes: number, code: string) => `${(bytes / 1048576).toFixed(1).replace('.', code === 'de' ? ',' : '.')} MB`;
export const dateOf = (iso: string, dateLocale: string) => new Date(iso).toLocaleDateString(dateLocale, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

/** The suite of pkg.neode.sk the page's commands use: testing while the client has no final release */
const suiteOf = (r: ClientRelease) => (r.prerelease ? 'testing' : 'stable');

/** The package repository's commands for each family, as the docs give them (the build checks they are in the docs) */
export function repoCommands(suite: string): Record<'deb' | 'rpm' | 'suse', string[]> {
	return {
		deb: [
			'sudo apt install curl',
			'sudo install -d -m 0755 /etc/apt/keyrings',
			'sudo curl -fsSLo /etc/apt/keyrings/neodesk.gpg https://pkg.neode.sk/neodesk.gpg',
			`echo "deb [signed-by=/etc/apt/keyrings/neodesk.gpg] https://pkg.neode.sk/deb ${suite} main" | sudo tee /etc/apt/sources.list.d/neodesk.list`,
			'sudo apt update',
			'sudo apt install neodesk'
		],
		rpm: ['sudo curl -fsSLo /etc/yum.repos.d/neodesk.repo https://pkg.neode.sk/rpm/neodesk.repo', suite === 'testing' ? 'sudo dnf --enablerepo=neodesk-testing install neodesk' : 'sudo dnf install neodesk'],
		suse: [
			'sudo zypper addrepo https://pkg.neode.sk/suse/neodesk.repo',
			...(suite === 'testing' ? ['sudo zypper modifyrepo --enable neodesk-testing'] : []),
			'sudo zypper refresh',
			'sudo zypper install neodesk'
		]
	};
}

const linuxInstall = (f: ClientFile) => (f.kind === 'deb' ? `sudo apt install ./${f.name}` : f.kind === 'suse' ? `sudo zypper install ./${f.name}` : `sudo dnf install ./${f.name}`);

/** The warning sign of the scam notice, drawn like the site's other icons */
const WARN_ICON =
	'<svg class="dl-scam-icon" viewBox="0 0 24 24" width="28" height="28" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.9 2.6 17.3A2 2 0 0 0 4.3 20.3h15.4a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9.2v4.6M12 17h.01" stroke-width="2.2"/></svg>';

/** The logo's square and circle, as the home page draws them beside its sections */
const MARK =
	'<svg class="dl-mark" viewBox="10 10 44 44" width="200" height="200" aria-hidden="true" focusable="false"><defs><clipPath id="dl-mark-clip"><circle cx="38" cy="26" r="16"/></clipPath></defs><rect class="sq" x="10" y="22" width="32" height="32" rx="10"/><circle class="ci" cx="38" cy="26" r="16"/><rect class="ov" x="10" y="22" width="32" height="32" rx="10" clip-path="url(#dl-mark-clip)"/></svg>';

/** The script that shows the recommendation for this computer; the two functions come from src/detect.ts as they are */
function recommendScript() {
	const source = (fn: (...a: never[]) => unknown) =>
		fn
			.toString()
			.split('\n')
			.map((l) => l.trim())
			.filter((l) => l && !l.startsWith('//'))
			.join('\n');
	return `<script>
(function () {
var detect = ${source(detectSystem)};
var recommend = ${source(recommendationOf)};
var box = document.getElementById('dl-rec');
if (!box) return;
var blocks = box.querySelectorAll('[data-rec]');
var ud = navigator.userAgentData;
var seen = { userAgent: navigator.userAgent || '', hints: ud ? { platform: ud.platform, mobile: ud.mobile } : null, touchPoints: navigator.maxTouchPoints || 0 };
var done = false;
function show() {
if (done) return;
done = true;
var key = recommend(detect(seen));
var pick = box.querySelector('[data-rec="' + key + '"]') || box.querySelector('[data-rec="other"]');
for (var i = 0; i < blocks.length; i++) blocks[i].hidden = blocks[i] !== pick;
box.classList.remove('dl-wait');
var said = document.getElementById('dl-said');
if (said && pick.getAttribute('data-said')) said.textContent = pick.getAttribute('data-said');
}
var os = detect(seen).os;
if (ud && ud.getHighEntropyValues && (os === 'windows' || os === 'macos' || os === 'linux')) {
box.classList.add('dl-wait');
ud.getHighEntropyValues(['architecture']).then(function (v) { seen.hints.architecture = v.architecture; show(); }, show);
setTimeout(show, 600);
} else show();
var win = document.getElementById('dl-window');
if (win && win.showModal) {
box.classList.add('dl-has-window');
box.addEventListener('click', function (e) {
var a = e.target && e.target.closest ? e.target.closest('a.dl-btn') : null;
if (!a) return;
var card = a.closest('[data-rec]');
var file = a.getAttribute('href').split('/').pop();
var lists = card ? card.querySelectorAll('.dl-steps') : [];
var steps = null;
for (var i = 0; i < lists.length; i++) if (!steps || lists[i].getAttribute('data-for') === file) steps = lists[i];
if (!steps) return;
win.querySelector('.dl-window-steps').innerHTML = steps.querySelector('ol').innerHTML;
var line = win.querySelector('.dl-window-file');
line.textContent = line.getAttribute('data-text').replace('{file}', file);
win.querySelector('.dl-window-again').href = a.href;
win.showModal();
});
win.querySelector('.dl-window-close').addEventListener('click', function () { win.close(); });
win.addEventListener('click', function (e) { if (e.target === win) win.close(); });
}
})();
</script>`;
}

/** The main content of the download page in one language. */
export function downloadMain(code: string, dateLocale: string, offer: ClientOffer, links: DownloadLinks) {
	const d = DOWNLOAD[code] ?? DOWNLOAD.en;
	const r = offer.main;
	const archOf = (f: ClientFile) => (f.os === 'macos' ? d.macArch : d.arch)[f.arch];
	const size = (f: ClientFile) => sizeOf(f.size, code);
	const find = (rel: ClientRelease | null, os: ClientOs, kind: FileKind, arch: ClientArch) => rel?.files.find((f) => f.os === os && f.kind === kind && f.arch === arch);
	const extOf = (f: ClientFile) => (f.name.endsWith('.tar.gz') ? '.tar.gz' : f.name.slice(f.name.lastIndexOf('.')));

	/* ---- the recommendation: one block per key, all hidden but "Pick your system" ---- */
	const button = (f: ClientFile, label: string, small = false) =>
		`<a class="dl-btn${small ? ' dl-btn-small' : ''}" href="${esc(f.url)}"><span class="dl-btn-main">${esc(label)}</span><span class="dl-btn-file">${esc(f.name)}, ${size(f)}</span></a>`;
	const card = (key: string, said: string, forWhat: string, body: string) =>
		`        <div class="dl-card" data-rec="${key}" data-said="${esc(fill(d.said, { what: said }))}" hidden>
          <p class="dl-for">${esc(d.forThis)}: <b>${esc(forWhat)}</b></p>
${body}
        </div>`;
	const after = (html: string) => `          <p class="dl-after">${html}</p>`;
	/** What to do after downloading a file, a step each; the window shows the list of the file that was clicked */
	const steps = (f: ClientFile, items: string[]) =>
		`          <div class="dl-steps" data-for="${esc(f.name)}"><p class="dl-steps-title">${esc(d.stepsTitle)}</p><ol>${items.map((x) => `<li>${x}</li>`).join('')}</ol></div>`;
	const blocks: string[] = [];
	for (const key of RECOMMENDATIONS) {
		if (key === 'other' || !r) continue;
		if (key === 'phone') {
			blocks.push(`        <div class="dl-card dl-phone" data-rec="phone" data-said="${esc(d.phoneTitle)}" hidden>
          <p class="dl-phone-title">${esc(d.phoneTitle)}</p>
${after(fill(d.phoneText, { phones: links.docs('/docs/getting-started/connect-a-client#phones-and-tablets'), browser: links.docs('/docs/console/remote-in-browser') }))}
${after(esc(d.phoneHere))}
        </div>`);
			continue;
		}
		const [os, ...rest] = key.split('-') as [ClientOs, ...string[]];
		if (os === 'windows') {
			const arch: ClientArch = rest[0] === 'arm64' ? 'arm64' : 'x64';
			const f = find(r, 'windows', 'exe', arch);
			if (!f) continue;
			const what = rest[0] === 'guess' ? 'Windows' : `Windows, ${d.arch[arch]}`;
			blocks.push(card(key, what, what, [`          ${button(f, d.downloadFor.windows)}`, ...(rest[0] === 'guess' ? [after(d.windowsGuess)] : []), steps(f, [...d.windowsSteps.map(esc), esc(d.join)])].join('\n')));
		} else if (os === 'macos') {
			if (rest.length) {
				const arch = rest[0] as ClientArch;
				const f = find(r, 'macos', 'dmg', arch);
				if (!f) continue;
				const what = `macOS, ${d.macArch[arch]}`;
				blocks.push(card(key, what, what, [`          ${button(f, d.downloadFor.macos)}`, steps(f, [...d.macSteps, esc(d.join)])].join('\n')));
			} else {
				const arm = find(r, 'macos', 'dmg', 'arm64');
				const intel = find(r, 'macos', 'dmg', 'x64');
				if (!arm || !intel) continue;
				blocks.push(card(key, 'macOS', 'macOS', [`          <div class="dl-pair">${button(arm, d.macArch.arm64, true)}${button(intel, d.macArch.x64, true)}</div>`, after(esc(d.macWhich)), steps(arm, [...d.macSteps, esc(d.join)])].join('\n')));
			}
		} else {
			const arch = rest[rest.length - 1] as ClientArch;
			const family = rest.length === 2 ? (rest[0] as 'deb' | 'rpm' | 'suse') : null;
			if (family) {
				const f = find(r, 'linux', family, arch);
				if (!f) continue;
				const what = `Linux, ${d.kinds[family].title}, ${d.arch[arch]}`;
				blocks.push(card(key, what, what, [`          ${button(f, `${d.downloadFor.linux} (${extOf(f)})`)}`, steps(f, [fill(esc(d.linuxAfter), { command: `<code>${esc(linuxInstall(f))}</code>` }), esc(d.join)])].join('\n')));
			} else {
				const deb = find(r, 'linux', 'deb', arch);
				const rpm = find(r, 'linux', 'rpm', arch);
				if (!deb || !rpm) continue;
				const what = `Linux, ${d.arch[arch]}`;
				blocks.push(card(key, what, what, [`          <div class="dl-pair">${button(deb, `Debian, Ubuntu (.deb)`, true)}${button(rpm, `Fedora, RHEL (.rpm)`, true)}</div>`, after(d.linuxWhich), ...[deb, rpm].map((f) => steps(f, [fill(esc(d.linuxAfter), { command: `<code>${esc(linuxInstall(f))}</code>` }), esc(d.join)]))].join('\n')));
			}
		}
	}
	const neutral = `        <div class="dl-card" data-rec="other">
          <p class="dl-for">${esc(d.pick)}</p>
          <div class="dl-picks">${(['windows', 'macos', 'linux'] as const).map((os) => `<a class="dl-pick" href="${r ? `#${os}` : esc(links.releases)}">${esc(d.os[os])}</a>`).join('')}</div>
          <p class="dl-after">${esc(r ? d.pickNote : d.noRelease)}</p>
        </div>`;
	const releaseLine = r
		? `        <p class="dl-release">${r.prerelease ? `<span class="dl-badge">${esc(d.candidate)}</span> ` : ''}${esc(fill(d.releaseLine, { version: r.version, date: dateOf(r.published, dateLocale) }))} <a href="${esc(r.page)}" rel="noopener">${esc(d.releaseNotes)}</a></p>`
		: '';

	/* ---- the scam notice ---- */
	const scam = `    <section class="dl-scam" aria-labelledby="scam-title">
      ${WARN_ICON}
      <h2 id="scam-title">${esc(d.scamTitle)}</h2>
      <details class="dl-scam-more">
        <summary>${esc(d.scamMore)}</summary>
        <ul>
${d.scam.map((s) => `          <li>${esc(s)}</li>`).join('\n')}
        </ul>
        <h3>${esc(d.scamAfterTitle)}</h3>
        <ol>
${d.scamAfter.map((s) => `          <li>${s}</li>`).join('\n')}
        </ol>
      </details>
    </section>`;

	/* ---- every file, by system, a row per kind with a link per processor ---- */
	const KINDS: Record<ClientOs, FileKind[]> = { windows: ['exe', 'msi', 'portable'], macos: ['dmg', 'portable'], linux: ['deb', 'rpm', 'suse', 'portable'] };
	const fileList = (rel: ClientRelease, idPrefix: string) =>
		(['windows', 'macos', 'linux'] as const)
			.map((os) => {
				const rows = KINDS[os]
					.map((kind) => {
						const files = (os === 'macos' ? (['arm64', 'x64'] as const) : (['x64', 'arm64'] as const)).map((a) => find(rel, os, kind, a)).filter((f): f is ClientFile => !!f);
						if (!files.length) return '';
						const k = kind === 'portable' ? (os === 'macos' ? d.kinds.macPortable : os === 'linux' ? d.kinds.linuxPortable : d.kinds.portable) : d.kinds[kind];
						const sums = files.filter((f) => f.sha256);
						return `          <li class="dl-row">
            <div class="dl-row-text"><h4>${esc(k.title)} <span class="dl-ext">${esc(extOf(files[0]))}</span></h4><p>${esc(k.text)}</p></div>
            <div class="dl-row-get">${files.map((f) => `<a class="dl-get" href="${esc(f.url)}" aria-label="${esc(fill(d.fileLabel, { arch: archOf(f), size: size(f), file: f.name }))}">${esc(archOf(f))}<span>${size(f)}</span></a>`).join('')}</div>
${sums.length ? `            <details class="dl-sha"><summary>${esc(d.sha)}</summary>${sums.map((f) => `<p><span>${esc(archOf(f))}</span><code>${f.sha256}</code></p>`).join('')}</details>\n` : ''}          </li>`;
					})
					.filter(Boolean)
					.join('\n');
				return `      <section class="dl-os" id="${idPrefix}${os}" aria-labelledby="${idPrefix}${os}-title">
        <h3 id="${idPrefix}${os}-title">${esc(d.os[os])}</h3>
${d.osNote[os] ? `        <p class="dl-os-note">${esc(d.osNote[os])}</p>\n` : ''}        <ul class="dl-rows">
${rows}
        </ul>
      </section>`;
			})
			.join('\n');

	const codeBlock = (lines: string[]) =>
		`<div class="code"><button type="button" class="copy" aria-label="${esc(d.copyCode)}" data-copied="${esc(d.copied)}" data-failed="${esc(d.copyFailed)}">${esc(d.copy)}</button><pre tabindex="0"><code>${lines.map(esc).join('\n')}</code></pre></div>`;
	const repo = r
		? `      <section class="dl-os dl-repo" id="repository" aria-labelledby="repository-title">
        <h3 id="repository-title">${esc(d.repoTitle)}</h3>
        <p>${esc(d.repoText)}${r.prerelease ? ` ${esc(d.repoTesting)}` : ''}</p>
${(['deb', 'rpm', 'suse'] as const).map((fam) => `        <details class="dl-cmds"><summary>${esc(d.repoFamilies[fam])}</summary>${codeBlock(repoCommands(suiteOf(r))[fam])}</details>`).join('\n')}
        <p>${fill(d.repoMore, { docs: links.docs('/docs/getting-started/connect-a-client#install-from-the-package-repository') })}</p>
      </section>`
		: '';
	const check = r?.sums
		? `      <section class="dl-os dl-check" id="check" aria-labelledby="check-title">
        <h3 id="check-title">${esc(d.checkTitle)}</h3>
        <p>${fill(d.checkText, { sums: esc(r.sums) })}</p>
        <p>${d.checkHow}</p>
      </section>`
		: '';
	const all = r
		? `  <section class="dl-all" id="all" aria-labelledby="all-title">
      <div class="dl-all-head">
        <div>
          <h2 id="all-title">${esc(d.allTitle)}</h2>
          <p class="dl-lead">${esc(fill(d.allLead, { version: r.version }))}</p>
          <nav class="dl-jump" aria-label="${esc(d.jump)}">${(['windows', 'macos', 'linux'] as const).map((os) => `<a href="#${os}">${esc(d.os[os])}</a>`).join('')}<a href="#repository">${esc(d.repoTitle)}</a>${check ? `<a href="#check">${esc(d.checkTitle)}</a>` : ''}</nav>
        </div>
      </div>
${fileList(r, '')}
${repo}
${check}
    </section>`
		: '';
	const p = offer.preview;
	const preview = p
		? `    <section class="dl-preview" id="preview" aria-labelledby="preview-title">
      <h2 id="preview-title">${esc(d.previewTitle)}</h2>
      <p><span class="dl-badge">${esc(d.candidate)}</span> ${esc(fill(d.previewText, { version: p.version, date: dateOf(p.published, dateLocale) }))} <a href="${esc(p.page)}" rel="noopener">${esc(d.releaseNotes)}</a></p>
      <details class="dl-preview-files"><summary>${esc(d.previewFiles)}</summary>
${fileList(p, 'preview-')}
      </details>
    </section>`
		: '';

	/* ---- what the client needs, for administrators, help ---- */
	const vars = {
		server: links.server,
		invite: links.docs('/docs/console/add-a-computer'),
		rustdesk: links.docs('/docs/getting-started/connect-a-client'),
		many: links.docs('/docs/getting-started/connect-a-client/many-computers'),
		repo: links.docs('/docs/getting-started/connect-a-client#install-from-the-package-repository'),
		discord: links.discord,
		discussions: links.discussions
	};
	const infoList = (items: { title: string; text: string }[]) => `<ul class="dl-info-list">${items.map((x) => `<li><b>${esc(x.title)}</b><p>${fill(x.text, vars)}</p></li>`).join('')}</ul>`;
	const info = `    <div class="dl-info">
      <section aria-labelledby="needs-title"><h2 id="needs-title">${esc(d.needsTitle)}</h2>${infoList(d.needs)}</section>
      <section aria-labelledby="admin-title"><h2 id="admin-title">${esc(d.adminTitle)}</h2>${infoList(d.admin)}</section>
      <section aria-labelledby="help-title"><h2 id="help-title">${esc(d.helpTitle)}</h2><p>${fill(d.help, vars)}</p></section>
    </div>`;

	return `    <div class="dl">
    <div class="dl-hero">
      <div class="dl-start">
        <h1 class="display">${esc(d.title)}</h1>
        <p class="lead">${esc(d.lead)}</p>
        <div class="dl-rec" id="dl-rec">
${neutral}
${blocks.join('\n')}
${releaseLine}
          <p class="dl-vh" role="status" id="dl-said"></p>
${r ? `          <dialog class="dl-window" id="dl-window" aria-labelledby="dl-window-title">
            <h2 id="dl-window-title">${esc(d.windowTitle)}</h2>
            <p class="dl-window-file" data-text="${esc(d.windowFile)}"></p>
            <ol class="dl-window-steps"></ol>
            <div class="dl-window-end"><button type="button" class="dl-window-close">${esc(d.windowClose)}</button><a class="dl-window-again">${esc(d.windowAgain)}</a></div>
          </dialog>` : ''}
        </div>
${r ? recommendScript() : ''}
      </div>
      ${MARK}
    </div>
${scam}
${all}
${preview}
${info}
    </div>`;
}

/** The client's SoftwareApplication data, for the page's JSON-LD */
export function clientSoftware(code: string, offer: ClientOffer, pageUrl: string, siteUrl: string) {
	const d = DOWNLOAD[code] ?? DOWNLOAD.en;
	const r = offer.main;
	return {
		'@context': 'https://schema.org',
		'@type': 'SoftwareApplication',
		name: 'NeoDesk client',
		description: d.lead,
		url: pageUrl,
		applicationCategory: 'UtilitiesApplication',
		applicationSubCategory: 'Remote desktop client',
		operatingSystem: 'Windows, macOS, Linux',
		...(r ? { softwareVersion: r.version, datePublished: r.published.slice(0, 10), downloadUrl: r.files.filter((f) => f.kind === 'exe' || f.kind === 'dmg' || f.kind === 'deb' || f.kind === 'rpm').map((f) => f.url) } : { downloadUrl: pageUrl }),
		license: 'https://www.gnu.org/licenses/agpl-3.0.html',
		isAccessibleForFree: true,
		offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
		publisher: { '@id': `${siteUrl}/#organization` },
		sameAs: ['https://github.com/neodeskapp/neodesk-client']
	};
}
