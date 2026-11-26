// The guide's font page, /brand/fonts/: each of the three fonts set in itself, its
// weights and sizes, and where it goes. The console's type scale is the one in
// web-ui/src/lib/styles/tokens.css; the headline settings are the website's.

import { brandNav, brandPath, table } from './brand-shared.ts';

interface FontStrings {
	title: string;
	pageTitle: string;
	description: string;
	lead: string;
	head: { setting: string; value: string; size: string; token: string; use: string; sample: string };
	display: {
		title: string;
		lead: string;
		headline: string;
		settings: [string, string][];
		where: string;
		not: string;
	};
	sans: {
		title: string;
		lead: string;
		paragraph: string;
		weightsTitle: string;
		weights: [number, string, string][];
		scaleTitle: string;
		scaleLead: string;
		scale: [string, string, string][];
		scaleSample: string;
		siteNote: string;
		apart: string;
	};
	mono: {
		title: string;
		lead: string;
		samples: [string, string][];
		zero: string;
		rule: string;
	};
	togetherTitle: string;
	togetherLead: string;
	together: { headline: string; lead: string; body: string; command: string };
	rulesTitle: string;
	rules: string[];
	filesTitle: string;
	licence: string;
	files: [string, string, string][];
}

const S: Record<string, FontStrings> = {
	en: {
		title: 'Fonts',
		pageTitle: 'NeoDesk fonts: Funnel Display and IBM Plex',
		description: 'How the three NeoDesk fonts look and where each goes: Funnel Display for the wordmark and large headlines, IBM Plex Sans and IBM Plex Mono for the rest.',
		lead: 'Three fonts, each with one job. Funnel Display gives the name and the big headlines their shape, IBM Plex Sans carries everything people read, and IBM Plex Mono shows what people copy.',
		head: { setting: 'Setting', value: 'Value', size: 'Size', token: 'Token', use: 'Use', sample: 'Sample' },
		display: {
			title: 'Funnel Display',
			lead: 'The wordmark\'s font. On marketing material it also sets the large headlines, always in weight 700 and set tight.',
			headline: 'Your own remote desktop server',
			settings: [
				['Weight', '700'],
				['Letter spacing', '-0.03em in the wordmark, about -0.045em in headlines'],
				['Line height', '0.9 to 0.95 in headlines'],
				['Case', 'Lower case in the wordmark, sentence case in headlines']
			],
			where: 'It appears in the logo (converted to outlines in the files), the website\'s first heading and page titles, the titles of link previews and the titles of release cards.',
			not: 'It never sets body text, labels or anything in the console. Don\'t type the wordmark as live text either; use the logo files.'
		},
		sans: {
			title: 'IBM Plex Sans',
			lead: 'The font for everything people read: the website\'s text, the docs, and the whole console.',
			paragraph: 'NeoDesk is a remote desktop server you run yourself. It works with RustDesk clients, keeps the data on your server, and comes with a web console for the devices you look after.',
			weightsTitle: 'Weights',
			weights: [
				[400, 'Regular', 'Text, hints and table cells'],
				[500, 'Medium', 'The labels of buttons, tabs, menus and segments'],
				[600, 'Semibold', 'Headings, field labels and bold words']
			],
			scaleTitle: 'Sizes in the console',
			scaleLead: 'The console sets text at 14 px and steps from 12 to 24 px. The accessibility panel scales all of them together.',
			scale: [
				['24 px', '--text-xl', 'Page titles'],
				['20 px', '--text-lg', 'Rarely: a value that has to stand out'],
				['16 px', '--text-md', 'Section headings'],
				['14 px', '--text-base', 'Text, tables, buttons, smaller headings'],
				['13 px', '--text-sm', 'Hints, small buttons, tags'],
				['12 px', '--text-xs', 'The smallest text, used sparingly']
			],
			scaleSample: 'Devices waiting for approval',
			siteNote: 'The website sets text at 16 px with a line height of 1.65, and 17 px on the home page.',
			apart: 'Plex Sans tells a capital I, a lower-case l and the digit 1 apart, so names and IDs read right even outside the monospace font.'
		},
		mono: {
			title: 'IBM Plex Mono',
			lead: 'Only for what people type or copy exactly: commands, IDs, addresses, keys and file paths.',
			samples: [
				['neodesk login --url https://desk.example.com', 'A command'],
				['900100001', 'A device ID'],
				['10.0.9.14:21116', 'An address and port'],
				['/opt/neodesk/data/id_ed25519.pub', 'A file path']
			],
			zero: 'Its zero has a dot, so 0 and O never mix up in a key.',
			rule: 'A word that is only a name, such as a setting or a menu entry, stays in Plex Sans. So does the dash that stands for "no value".'
		},
		togetherTitle: 'Together',
		togetherLead: 'A headline in Funnel Display, then text in Plex Sans and the command in Plex Mono. This is how the website\'s pages are built.',
		together: {
			headline: 'Your own remote desktop server',
			lead: 'A RustDesk-compatible server written in Go, with a web console for the devices you look after.',
			body: 'Sign in to your console from the command line:',
			command: 'neodesk login --url https://desk.example.com'
		},
		rulesTitle: 'Rules',
		rules: [
			'Sentence case everywhere. No upper-case labels and no letter-spaced eyebrows above headings.',
			'Bold only for the one or two things that must not be missed.',
			'Running text keeps to about 68 characters per line.'
		],
		filesTitle: 'Where to get them',
		licence: 'All three are under the SIL Open Font License 1.1, so you can use them anywhere, also in print.',
		files: [
			['Funnel Display', 'github.com/google/fonts, folder ofl/funneldisplay', 'https://github.com/google/fonts/tree/main/ofl/funneldisplay'],
			['IBM Plex Sans', 'github.com/IBM/plex', 'https://github.com/IBM/plex'],
			['IBM Plex Mono', 'github.com/IBM/plex', 'https://github.com/IBM/plex']
		]
	},
	de: {
		title: 'Schriften',
		pageTitle: 'NeoDesk-Schriften: Funnel Display und IBM Plex',
		description: 'Wie die drei Schriften von NeoDesk aussehen und wohin sie gehören: Funnel Display für Wortmarke und Überschriften, IBM Plex für den Rest.',
		lead: 'Drei Schriften, jede mit einer Aufgabe. Funnel Display gibt dem Namen und den großen Überschriften ihre Form, IBM Plex Sans trägt alles, was man liest, und IBM Plex Mono zeigt, was man kopiert.',
		head: { setting: 'Einstellung', value: 'Wert', size: 'Größe', token: 'Token', use: 'Wofür', sample: 'Probe' },
		display: {
			title: 'Funnel Display',
			lead: 'Die Schrift der Wortmarke. Auf Werbematerial setzt sie auch die großen Überschriften, immer in Stärke 700 und eng gesetzt.',
			headline: 'Dein eigener Remote-Desktop-Server',
			settings: [
				['Stärke', '700'],
				['Laufweite', '-0,03em in der Wortmarke, etwa -0,045em in Überschriften'],
				['Zeilenhöhe', '0,9 bis 0,95 in Überschriften'],
				['Schreibung', 'Klein in der Wortmarke, normale Satzschreibung in Überschriften']
			],
			where: 'Sie steht im Logo (in den Dateien in Pfade umgewandelt), in der ersten Überschrift und den Seitentiteln der Website, in den Titeln der Linkvorschauen und der Release-Karten.',
			not: 'Sie setzt nie Fließtext, Beschriftungen oder irgendetwas in der Konsole. Tipp die Wortmarke auch nicht als Text; nimm die Logo-Dateien.'
		},
		sans: {
			title: 'IBM Plex Sans',
			lead: 'Die Schrift für alles, was man liest: den Text der Website, die Doku und die ganze Konsole.',
			paragraph: 'NeoDesk ist ein Remote-Desktop-Server, den du selbst betreibst. Er funktioniert mit RustDesk-Clients, behält die Daten auf deinem Server und bringt eine Web-Konsole für die Geräte mit, die du betreust.',
			weightsTitle: 'Stärken',
			weights: [
				[400, 'Regular', 'Text, Hinweise und Tabellenzellen'],
				[500, 'Medium', 'Die Beschriftung von Schaltflächen, Tabs, Menüs und Segmenten'],
				[600, 'Semibold', 'Überschriften, Feldbeschriftungen und fette Wörter']
			],
			scaleTitle: 'Größen in der Konsole',
			scaleLead: 'Die Konsole setzt Text in 14 px und stuft von 12 bis 24 px. Das Barrierefreiheits-Panel skaliert alle gemeinsam.',
			scale: [
				['24 px', '--text-xl', 'Seitentitel'],
				['20 px', '--text-lg', 'Selten: ein Wert, der herausstechen muss'],
				['16 px', '--text-md', 'Abschnittsüberschriften'],
				['14 px', '--text-base', 'Text, Tabellen, Schaltflächen, kleinere Überschriften'],
				['13 px', '--text-sm', 'Hinweise, kleine Schaltflächen, Tags'],
				['12 px', '--text-xs', 'Der kleinste Text, sparsam eingesetzt']
			],
			scaleSample: 'Geräte, die auf Freigabe warten',
			siteNote: 'Die Website setzt Text in 16 px mit einer Zeilenhöhe von 1,65, auf der Startseite in 17 px.',
			apart: 'Plex Sans unterscheidet ein großes I, ein kleines l und die Ziffer 1, damit Namen und IDs auch außerhalb der Monospace-Schrift richtig lesbar sind.'
		},
		mono: {
			title: 'IBM Plex Mono',
			lead: 'Nur für das, was man genau so tippt oder kopiert: Befehle, IDs, Adressen, Schlüssel und Dateipfade.',
			samples: [
				['neodesk login --url https://desk.example.com', 'Ein Befehl'],
				['900100001', 'Eine Geräte-ID'],
				['10.0.9.14:21116', 'Eine Adresse mit Port'],
				['/opt/neodesk/data/id_ed25519.pub', 'Ein Dateipfad']
			],
			zero: 'Ihre Null hat einen Punkt, damit 0 und O in einem Schlüssel nie verwechselt werden.',
			rule: 'Ein Wort, das nur ein Name ist, etwa eine Einstellung oder ein Menüeintrag, bleibt in Plex Sans. Ebenso der Strich, der für "kein Wert" steht.'
		},
		togetherTitle: 'Zusammen',
		togetherLead: 'Eine Überschrift in Funnel Display, dann Text in Plex Sans und der Befehl in Plex Mono. So sind die Seiten der Website gebaut.',
		together: {
			headline: 'Dein eigener Remote-Desktop-Server',
			lead: 'Ein RustDesk-kompatibler Server in Go, mit einer Web-Konsole für die Geräte, die du betreust.',
			body: 'Melde dich auf der Kommandozeile bei deiner Konsole an:',
			command: 'neodesk login --url https://desk.example.com'
		},
		rulesTitle: 'Regeln',
		rules: [
			'Normale Satzschreibung überall. Keine Beschriftungen in Großbuchstaben und keine gesperrten Zeilen über Überschriften.',
			'Fett nur für das eine oder die zwei Dinge, die man nicht übersehen darf.',
			'Fließtext bleibt bei etwa 68 Zeichen pro Zeile.'
		],
		filesTitle: 'Woher du sie bekommst',
		licence: 'Alle drei stehen unter der SIL Open Font License 1.1, du kannst sie also überall nutzen, auch im Druck.',
		files: [
			['Funnel Display', 'github.com/google/fonts, Ordner ofl/funneldisplay', 'https://github.com/google/fonts/tree/main/ofl/funneldisplay'],
			['IBM Plex Sans', 'github.com/IBM/plex', 'https://github.com/IBM/plex'],
			['IBM Plex Mono', 'github.com/IBM/plex', 'https://github.com/IBM/plex']
		]
	}
};

const LETTERS = 'Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz';
const DIGITS = '0 1 2 3 4 5 6 7 8 9';

export function fontsPage(code: string, prefix: string) {
	const f = S[code] ?? S.en;
	const h = f.head;
	return {
		slug: 'fonts' as const,
		path: brandPath('fonts'),
		title: f.title,
		pageTitle: f.pageTitle,
		description: f.description,
		main: `${brandNav(code, prefix, 'fonts')}
    <h1 class="display">${f.title}</h1>
    <p class="lead">${f.lead}</p>

    <h2 id="funnel-display">${f.display.title}</h2>
    <p>${f.display.lead}</p>
    <div class="type-specimen">
      <p class="type-display-big" lang="${code}">${f.display.headline}</p>
      <p class="type-display-set">${LETTERS}</p>
      <p class="type-display-set">${DIGITS}</p>
    </div>
${table([h.setting, h.value], f.display.settings)}
    <p>${f.display.where}</p>
    <p>${f.display.not}</p>

    <h2 id="ibm-plex-sans">${f.sans.title}</h2>
    <p>${f.sans.lead}</p>
    <div class="type-specimen">
      <p class="type-sans-big">${LETTERS}<br>${DIGITS}</p>
      <p class="type-sans-para">${f.sans.paragraph}</p>
    </div>
    <h3 id="weights">${f.sans.weightsTitle}</h3>
    <ul class="type-weights">
${f.sans.weights.map(([w, name, use]) => `      <li><span class="type-weight-sample" style="font-weight:${w}">${name} ${w}</span><span class="type-weight-use">${use}</span></li>`).join('\n')}
    </ul>
    <h3 id="sizes-in-the-console">${f.sans.scaleTitle}</h3>
    <p>${f.sans.scaleLead}</p>
    <div class="table-wrap"><table class="type-scale">
      <thead><tr><th>${h.size}</th><th>${h.token}</th><th>${h.sample}</th><th>${h.use}</th></tr></thead>
      <tbody>
${f.sans.scale.map(([size, token, use]) => `        <tr><td>${size}</td><td><code>${token}</code></td><td><span style="font-size:${size.replace(' ', '')};font-weight:${/xl|md/.test(token) ? 600 : 400}">${f.sans.scaleSample}</span></td><td>${use}</td></tr>`).join('\n')}
      </tbody>
    </table></div>
    <p>${f.sans.siteNote}</p>
    <p class="type-apart" aria-hidden="true">I l 1</p>
    <p>${f.sans.apart}</p>

    <h2 id="ibm-plex-mono">${f.mono.title}</h2>
    <p>${f.mono.lead}</p>
    <ul class="type-mono-list">
${f.mono.samples.map(([sample, what]) => `      <li><code>${sample}</code><span>${what}</span></li>`).join('\n')}
    </ul>
    <p class="type-zero" aria-hidden="true"><code>0O</code></p>
    <p>${f.mono.zero}</p>
    <p>${f.mono.rule}</p>

    <h2 id="together">${f.togetherTitle}</h2>
    <p>${f.togetherLead}</p>
    <div class="type-together">
      <p class="type-together-head">${f.together.headline}</p>
      <p class="type-together-lead">${f.together.lead}</p>
      <p>${f.together.body}</p>
      <pre><code>${f.together.command}</code></pre>
    </div>

    <h2 id="rules">${f.rulesTitle}</h2>
    <ul>
${f.rules.map((x) => `      <li>${x}</li>`).join('\n')}
    </ul>

    <h2 id="where-to-get-them">${f.filesTitle}</h2>
    <p>${f.licence}</p>
    <ul class="rows">
${f.files.map(([name, source, href]) => `      <li><b>${name}</b><p><a href="${href}" rel="noopener">${source}</a></p></li>`).join('\n')}
    </ul>`
	};
}
