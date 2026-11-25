// The guide's colour page, /brand/colours/. The logo colours come from BRAND.md, the
// console's palette from its built-in themes (console/static/files/config/
// theme-palettes.json) and tokens (web-ui/src/lib/styles/tokens.css). The contrast
// ratios are worked out here, and colourProblems() stops the build when one of the
// colours meant for text falls below what the page promises.

import { esc, brandNav, brandPath, swatch, ratio, contrast, pair, table } from './brand-shared.ts';

/** The console's built-in palettes, by token. */
export const CONSOLE = {
	dark: { bg: '#141616', subtle: '#1b1e1e', hover: '#262a2a', float: '#1f2323', text: '#e4e7e7', muted: '#a3abad', border: '#6a7474', rule: '#2c3131', accent: '#58a6ff', accentHover: '#79b8ff', onAccent: '#0c1b1e', success: '#72c98c', danger: '#ff8f80', warning: '#e3b85a', info: '#a9bcc4' },
	light: { bg: '#ffffff', subtle: '#f3f4f4', hover: '#e8ebeb', float: '#ffffff', text: '#1b1e1f', muted: '#566064', border: '#7e888b', rule: '#dde1e2', accent: '#1b62cf', accentHover: '#1854b3', onAccent: '#ffffff', success: '#1c7a3b', danger: '#b3261e', warning: '#875b00', info: '#4a5a62' }
};
type Token = keyof typeof CONSOLE.dark;

const LOGO_COLOURS = { square: ['#58a6ff', '#1f6feb'], circle: ['#a3e635', '#4d8f06'], overlap: ['#3fd0c4', '#0f9e96'], wordmark: ['#e4e7e7', '#1b1e1f'] };
const TEXT_COLOURS = { blue: ['#58a6ff', '#1f6feb'], lime: ['#a3e635', '#3d7a06'], teal: ['#3fd0c4', '#0b7a74'] };
const SITE = { bg: ['#141616', '#ffffff'], text: ['#e4e7e7', '#1b1e1f'], muted: ['#a3abad', '#566064'], rule: ['#2c3131', '#dde1e2'] };
const SERIES = [['#4493ec', '#1f6feb'], ['#d06a2c', '#c85a1e'], ['#22a49a', '#0f9e96']];

// The console tokens that carry text, and the surfaces they must reach 4.5:1 on
const TEXT_TOKENS: Token[] = ['text', 'muted', 'accent', 'success', 'danger', 'warning', 'info'];
const SURFACES: Token[] = ['bg', 'subtle', 'hover', 'float'];

/** Colours meant for text below 4.5:1, fields below 3:1, or text on the accent below 4.5:1. */
export function colourProblems() {
	const problems: string[] = [];
	const need = (what: string, fg: string, bg: string, min: number) => {
		const r = contrast(fg, bg);
		if (r < min) problems.push(`src/brand-colours.ts: ${what} ${fg} on ${bg} is ${r.toFixed(2)}:1, the page promises ${min}:1`);
	};
	for (const [name, [dark, light]] of Object.entries(TEXT_COLOURS)) {
		need(`the ${name} text colour`, dark, SITE.bg[0], 4.5);
		need(`the ${name} text colour`, light, SITE.bg[1], 4.5);
	}
	need('the website\'s muted text', SITE.muted[0], SITE.bg[0], 4.5);
	need('the website\'s muted text', SITE.muted[1], SITE.bg[1], 4.5);
	for (const theme of ['dark', 'light'] as const) {
		const p = CONSOLE[theme];
		// Muted and coloured text sit on --bg and --bg-subtle; a hovered row only carries --text
		for (const t of TEXT_TOKENS) for (const s of ['bg', 'subtle'] as Token[]) need(`the console's ${theme} --${t}`, p[t], p[s], 4.5);
		for (const s of SURFACES) need(`the console's ${theme} --text`, p.text, p[s], 4.5);
		for (const s of SURFACES) need(`the console's ${theme} --border`, p.border, p[s], 3);
		need(`the console's ${theme} --on-accent`, p.onAccent, p.accent, 4.5);
		need(`the console's ${theme} --on-accent`, p.onAccent, p.danger, 4.5);
	}
	return problems;
}

interface ColourStrings {
	title: string;
	pageTitle: string;
	description: string;
	lead: string;
	logoTitle: string;
	logoLead: string;
	head: { part: string; dark: string; light: string; means: string; ratio: string; token: string; use: string };
	logo: Record<keyof typeof LOGO_COLOURS, [string, string]>;
	oneColour: string;
	meaningTitle: string;
	meaningLead: string;
	text: Record<keyof typeof TEXT_COLOURS, [string, string]>;
	meaningRules: string[];
	siteTitle: string;
	siteLead: string;
	site: Record<keyof typeof SITE, string>;
	consoleTitle: string;
	consoleLead: string;
	surfacesTitle: string;
	surfacesLead: string;
	surfaceNames: Record<'bg' | 'subtle' | 'hover' | 'float', [string, string]>;
	sample: { text: string; muted: string; link: string };
	tokensTitle: string;
	tokens: Record<Token, string>;
	accentNote: string;
	statusTitle: string;
	statusLead: string;
	tones: [string, string, string][];
	chartTitle: string;
	chartLead: string;
	series: string[];
	rulesTitle: string;
	rules: string[];
}

const S: Record<string, ColourStrings> = {
	en: {
		title: 'Colours',
		pageTitle: 'NeoDesk colours: logo, text and console palette',
		description: 'The NeoDesk logo colours and what each stands for, the colours for text with their contrast, and the console\'s palette in dark and light.',
		lead: 'Three logo colours with a fixed meaning, neutral surfaces, and a few colours that mark a state. Every colour that carries text reaches 4.5:1 on its background.',
		logoTitle: 'Logo colours',
		logoLead: 'The mark has three colours, one set for dark and one for light backgrounds. Each part stands for something, and the colour keeps that meaning wherever it appears.',
		head: { part: 'Part', dark: 'On dark', light: 'On light', means: 'Stands for', ratio: 'Contrast', token: 'Token', use: 'Use' },
		logo: {
			square: ['Square', 'Your side: the server'],
			circle: ['Circle', 'Their side: the RustDesk client'],
			overlap: ['Overlap', 'What both share: the console'],
			wordmark: ['Wordmark', 'The name']
		},
		oneColour: 'In one colour, draw the square and the circle in the ink colour and the overlap in the background colour.',
		meaningTitle: 'Colour with a meaning',
		meaningLead: 'On the website and other marketing material, important words and the main action take the logo colours, with the meaning of the shapes. For text, use these values; the light lime and teal are a step darker than the logo\'s, so they pass on white.',
		text: {
			blue: ['Blue', 'Your server, the primary button, Install'],
			lime: ['Lime', 'The RustDesk client, client ports'],
			teal: ['Teal', 'The console, links in text']
		},
		meaningRules: [
			'Body text stays neutral. Colour marks a key word, not a whole paragraph.',
			'In the console, lime appears only in the logo. The accent there is the logo blue, and lime never stands for a state.',
			'Don\'t take the logo\'s colours from a customer\'s branding accent, and don\'t give the logo theirs.'
		],
		siteTitle: 'Website surfaces',
		siteLead: 'The website follows the reader\'s system setting, dark or light. It uses one background, two text colours and one colour for rules between rows.',
		site: { bg: 'Background', text: 'Text', muted: 'Muted text', rule: 'Rules' },
		consoleTitle: 'Console palette',
		consoleLead: 'The console has a dark and a light theme. Admins can set their own accent and background in the settings, so components take every colour from these tokens and never hard-code one.',
		surfacesTitle: 'Surfaces',
		surfacesLead: 'Four surfaces, from the page to things that float above it. They differ only a little; rules and spacing do the separating, not boxes.',
		surfaceNames: {
			bg: ['Background', 'The page, tables, fields'],
			subtle: ['Subtle background', 'Notices, code, a disabled field'],
			hover: ['Hover', 'A row or button under the pointer'],
			float: ['Floating', 'Menus, dialogs, sheets']
		},
		sample: { text: 'Text', muted: 'Muted text', link: 'A link' },
		tokensTitle: 'Every token',
		tokens: {
			bg: 'The page, tables and fields',
			subtle: 'Notices, code blocks, disabled fields',
			hover: 'A row, button or menu item under the pointer',
			float: 'Menus, dialogs and side sheets',
			text: 'Text',
			muted: 'Hints, secondary text, the neutral status',
			border: 'Outlines of fields and controls, 3:1 on every surface',
			rule: 'Lines between rows and sections',
			accent: 'The primary button, links, focus, the selected tab',
			accentHover: 'The primary button under the pointer',
			onAccent: 'Text on the accent and on the danger colour',
			success: 'The good status: online, running, approved',
			danger: 'Failed or blocked, destructive actions',
			warning: 'Needs a look; settings that need a restart',
			info: 'Notices that inform'
		},
		accentNote: 'The light accent is a step darker than the logo\'s #1f6feb, because #1f6feb reaches only {ratio} as text on the subtle background.',
		statusTitle: 'Status colours',
		statusLead: 'Five tones, each with a fixed meaning. A tone always comes with a word and its own small mark, so colour is never the only cue.',
		tones: [
			['Good', 'success', 'Works, done, allowed: online, approved, enabled, running'],
			['Waiting', 'accent', 'Waits for someone or something: pending, queued, checking'],
			['Neutral', 'muted', 'Off or ended, nothing wrong: offline, stopped, rejected, expired'],
			['Warning', 'warning', 'Needs a look: degraded, no signal, nearly full'],
			['Danger', 'danger', 'Failed or blocked: error, failed, banned, critical']
		],
		chartTitle: 'Charts',
		chartLead: 'Charts use three series colours taken from the logo: blue, a warm orange, then teal. The orange sits between blue and teal because blue and teal alone are hard to tell apart for people with tritan colour vision. A chart is only there when it answers a question better than a number does.',
		series: ['First series', 'Second series', 'Third series'],
		rulesTitle: 'Rules',
		rules: [
			'Text reaches 4.5:1 on its background, outlines of fields and controls 3:1.',
			'Never white text on a light colour. Text on a coloured button is the text-on-accent colour, on the accent or the danger colour only.',
			'No gradients. Every colour is solid.',
			'Avoid dark navy with electric blue, the purple SaaS look, and cream with rust.'
		]
	},
	de: {
		title: 'Farben',
		pageTitle: 'NeoDesk-Farben: Logo, Text und Konsole',
		description: 'Die Logofarben von NeoDesk und wofür jede steht, die Farben für Text mit ihrem Kontrast und die Palette der Konsole in dunkel und hell.',
		lead: 'Drei Logofarben mit fester Bedeutung, neutrale Flächen und wenige Farben für Zustände. Jede Farbe, die Text trägt, erreicht 4,5:1 auf ihrem Hintergrund.',
		logoTitle: 'Logofarben',
		logoLead: 'Das Zeichen hat drei Farben, je einen Satz für dunkle und helle Hintergründe. Jeder Teil steht für etwas, und die Farbe behält diese Bedeutung überall.',
		head: { part: 'Teil', dark: 'Auf dunkel', light: 'Auf hell', means: 'Steht für', ratio: 'Kontrast', token: 'Token', use: 'Wofür' },
		logo: {
			square: ['Quadrat', 'Deine Seite: der Server'],
			circle: ['Kreis', 'Ihre Seite: der RustDesk-Client'],
			overlap: ['Überlappung', 'Was beide teilen: die Konsole'],
			wordmark: ['Wortmarke', 'Der Name']
		},
		oneColour: 'Einfarbig zeichnest du Quadrat und Kreis in der Druckfarbe und die Überlappung in der Hintergrundfarbe.',
		meaningTitle: 'Farbe mit Bedeutung',
		meaningLead: 'Auf der Website und anderem Werbematerial tragen wichtige Wörter und die Hauptaktion die Logofarben, mit der Bedeutung der Formen. Für Text nimm diese Werte; Limette und Türkis sind hell eine Stufe dunkler als im Logo, damit sie auf Weiß bestehen.',
		text: {
			blue: ['Blau', 'Dein Server, die Hauptschaltfläche, Installieren'],
			lime: ['Limette', 'Der RustDesk-Client, Client-Ports'],
			teal: ['Türkis', 'Die Konsole, Links im Text']
		},
		meaningRules: [
			'Fließtext bleibt neutral. Farbe hebt ein Schlüsselwort hervor, keinen ganzen Absatz.',
			'In der Konsole steht Limette nur im Logo. Der Akzent ist dort das Logo-Blau, und Limette steht nie für einen Zustand.',
			'Nimm die Logofarben nicht aus dem Branding-Akzent eines Kunden, und gib dem Logo nicht dessen Farben.'
		],
		siteTitle: 'Flächen der Website',
		siteLead: 'Die Website folgt der Systemeinstellung der Leser, dunkel oder hell. Sie nutzt einen Hintergrund, zwei Textfarben und eine Farbe für Linien zwischen Zeilen.',
		site: { bg: 'Hintergrund', text: 'Text', muted: 'Gedämpfter Text', rule: 'Linien' },
		consoleTitle: 'Palette der Konsole',
		consoleLead: 'Die Konsole hat ein dunkles und ein helles Theme. Admins können in den Einstellungen eigenen Akzent und Hintergrund setzen, deshalb nehmen Komponenten jede Farbe aus diesen Tokens und schreiben keine fest hinein.',
		surfacesTitle: 'Flächen',
		surfacesLead: 'Vier Flächen, von der Seite bis zu dem, was über ihr schwebt. Sie unterscheiden sich nur wenig; Linien und Abstände trennen, nicht Kästen.',
		surfaceNames: {
			bg: ['Hintergrund', 'Die Seite, Tabellen, Felder'],
			subtle: ['Dezenter Hintergrund', 'Hinweise, Code, ein gesperrtes Feld'],
			hover: ['Hover', 'Eine Zeile oder Schaltfläche unter dem Zeiger'],
			float: ['Schwebend', 'Menüs, Dialoge, Seitenleisten']
		},
		sample: { text: 'Text', muted: 'Gedämpfter Text', link: 'Ein Link' },
		tokensTitle: 'Alle Tokens',
		tokens: {
			bg: 'Die Seite, Tabellen und Felder',
			subtle: 'Hinweise, Codeblöcke, gesperrte Felder',
			hover: 'Zeile, Schaltfläche oder Menüeintrag unter dem Zeiger',
			float: 'Menüs, Dialoge und Seitenleisten',
			text: 'Text',
			muted: 'Hinweise, Nebentext, der neutrale Status',
			border: 'Umrisse von Feldern und Bedienelementen, 3:1 auf jeder Fläche',
			rule: 'Linien zwischen Zeilen und Abschnitten',
			accent: 'Die Hauptschaltfläche, Links, Fokus, der gewählte Tab',
			accentHover: 'Die Hauptschaltfläche unter dem Zeiger',
			onAccent: 'Text auf dem Akzent und auf der Gefahrenfarbe',
			success: 'Der gute Status: online, läuft, genehmigt',
			danger: 'Fehlgeschlagen oder gesperrt, zerstörende Aktionen',
			warning: 'Braucht einen Blick; Einstellungen, die einen Neustart brauchen',
			info: 'Hinweise, die informieren'
		},
		accentNote: 'Der helle Akzent ist eine Stufe dunkler als das #1f6feb des Logos, weil #1f6feb als Text auf dem dezenten Hintergrund nur {ratio} erreicht.',
		statusTitle: 'Statusfarben',
		statusLead: 'Fünf Töne, jeder mit fester Bedeutung. Ein Ton kommt immer mit einem Wort und einer eigenen kleinen Marke, damit Farbe nie das einzige Merkmal ist.',
		tones: [
			['Gut', 'success', 'Funktioniert, erledigt, erlaubt: online, genehmigt, aktiv, läuft'],
			['Wartet', 'accent', 'Wartet auf jemanden oder etwas: ausstehend, in der Warteschlange, wird geprüft'],
			['Neutral', 'muted', 'Aus oder beendet, nichts falsch: offline, gestoppt, abgelehnt, abgelaufen'],
			['Warnung', 'warning', 'Braucht einen Blick: eingeschränkt, kein Signal, fast voll'],
			['Gefahr', 'danger', 'Fehlgeschlagen oder gesperrt: Fehler, fehlgeschlagen, gesperrt, kritisch']
		],
		chartTitle: 'Diagramme',
		chartLead: 'Diagramme nutzen drei Reihenfarben aus dem Logo: Blau, ein warmes Orange, dann Türkis. Das Orange steht zwischen Blau und Türkis, weil Blau und Türkis allein für Menschen mit Tritan-Farbsehen schwer zu unterscheiden sind. Ein Diagramm gibt es nur, wo es eine Frage besser beantwortet als eine Zahl.',
		series: ['Erste Reihe', 'Zweite Reihe', 'Dritte Reihe'],
		rulesTitle: 'Regeln',
		rules: [
			'Text erreicht 4,5:1 auf seinem Hintergrund, Umrisse von Feldern und Bedienelementen 3:1.',
			'Nie weißer Text auf einer hellen Farbe. Text auf einer farbigen Schaltfläche hat die Farbe für Text auf dem Akzent, und nur auf dem Akzent oder der Gefahrenfarbe.',
			'Keine Verläufe. Jede Farbe ist voll.',
			'Meide dunkles Marineblau mit grellem Blau, den lila SaaS-Look und Creme mit Rost.'
		]
	}
};

const TOKEN_NAMES: Record<Token, string> = {
	bg: '--bg',
	subtle: '--bg-subtle',
	hover: '--hover',
	float: '--bg-float',
	text: '--text',
	muted: '--text-muted',
	border: '--border',
	rule: '--rule',
	accent: '--accent',
	accentHover: '--accent-hover',
	onAccent: '--on-accent',
	success: '--success',
	danger: '--danger',
	warning: '--warning',
	info: '--info'
};

export function coloursPage(code: string, prefix: string) {
	const c = S[code] ?? S.en;
	const h = c.head;
	const r = (fg: string, bg: string) => ratio(fg, bg, code);
	// The surfaces in both themes, each with text, muted text and a link on it
	const surfaces = pair(
		code,
		() => `<div class="ds-ladder">${(['bg', 'subtle', 'hover', 'float'] as const)
			.map((s) => `<div class="ds-step" style="background:var(--ds-${s})"><span class="ds-step-name">${c.surfaceNames[s][0]}</span><code>${TOKEN_NAMES[s]}</code><span class="ds-step-use">${c.surfaceNames[s][1]}</span><span class="ds-step-sample"><span>${c.sample.text}</span> <span class="ds-muted">${c.sample.muted}</span> <a href="#surfaces" tabindex="-1">${c.sample.link}</a></span></div>`)
			.join('')}</div>`
	);
	// The status tones as the console draws them
	const tones = pair(code, () => `<ul class="ds-tone-list">${c.tones.map(([name], i) => `<li><span class="ds-status is-${['good', 'waiting', 'neutral', 'warning', 'danger'][i]}">${name}</span></li>`).join('')}</ul>`);
	return {
		slug: 'colours' as const,
		path: brandPath('colours'),
		title: c.title,
		pageTitle: c.pageTitle,
		description: c.description,
		main: `${brandNav(code, prefix, 'colours')}
    <h1 class="display">${c.title}</h1>
    <p class="lead">${c.lead}</p>

    <h2 id="logo-colours">${c.logoTitle}</h2>
    <p>${c.logoLead}</p>
    <div class="brand-chips">${(Object.keys(LOGO_COLOURS) as (keyof typeof LOGO_COLOURS)[])
			.filter((k) => k !== 'wordmark')
			.map((k) => `<figure class="brand-chip"><span style="background:${LOGO_COLOURS[k][0]}"></span><span style="background:${LOGO_COLOURS[k][1]}"></span><figcaption><b>${c.logo[k][0]}</b> ${c.logo[k][1]}</figcaption></figure>`)
			.join('')}</div>
${table([h.part, h.dark, h.light, h.means], (Object.keys(LOGO_COLOURS) as (keyof typeof LOGO_COLOURS)[]).map((k) => [c.logo[k][0], swatch(LOGO_COLOURS[k][0]), swatch(LOGO_COLOURS[k][1]), c.logo[k][1]]))}
    <p>${c.oneColour}</p>

    <h2 id="colour-with-a-meaning">${c.meaningTitle}</h2>
    <p>${c.meaningLead}</p>
${table(
	[h.part, h.dark, h.light, h.means],
	(Object.keys(TEXT_COLOURS) as (keyof typeof TEXT_COLOURS)[]).map((k) => [
		c.text[k][0],
		`${swatch(TEXT_COLOURS[k][0])} <span class="ratio">${r(TEXT_COLOURS[k][0], SITE.bg[0])}</span>`,
		`${swatch(TEXT_COLOURS[k][1])} <span class="ratio">${r(TEXT_COLOURS[k][1], SITE.bg[1])}</span>`,
		c.text[k][1]
	])
)}
    <ul>
${c.meaningRules.map((x) => `      <li>${x}</li>`).join('\n')}
    </ul>

    <h2 id="website-surfaces">${c.siteTitle}</h2>
    <p>${c.siteLead}</p>
${table(
	[h.part, h.dark, h.light],
	(Object.keys(SITE) as (keyof typeof SITE)[]).map((k) => [
		c.site[k],
		`${swatch(SITE[k][0])}${k === 'text' || k === 'muted' ? ` <span class="ratio">${r(SITE[k][0], SITE.bg[0])}</span>` : ''}`,
		`${swatch(SITE[k][1])}${k === 'text' || k === 'muted' ? ` <span class="ratio">${r(SITE[k][1], SITE.bg[1])}</span>` : ''}`
	])
)}

    <h2 id="console-palette">${c.consoleTitle}</h2>
    <p>${c.consoleLead}</p>
    <h3 id="surfaces">${c.surfacesTitle}</h3>
    <p>${c.surfacesLead}</p>
${surfaces}
    <h3 id="every-token">${c.tokensTitle}</h3>
${table(
	[h.token, h.dark, h.light, h.use],
	(Object.keys(TOKEN_NAMES) as Token[]).map((t) => {
		const show = (theme: 'dark' | 'light') => {
			const p = CONSOLE[theme];
			const on = TEXT_TOKENS.includes(t) ? ` <span class="ratio">${r(p[t], p.bg)}</span>` : t === 'border' ? ` <span class="ratio">${r(p[t], p.hover)}</span>` : t === 'onAccent' ? ` <span class="ratio">${r(p[t], p.accent)}</span>` : '';
			return `${swatch(p[t])}${on}`;
		};
		return [`<code>${TOKEN_NAMES[t]}</code>`, show('dark'), show('light'), c.tokens[t]];
	}),
	'token-table'
)}
    <p>${c.accentNote.replace('{ratio}', r('#1f6feb', CONSOLE.light.subtle))}</p>

    <h3 id="status-colours">${c.statusTitle}</h3>
    <p>${c.statusLead}</p>
${tones}
${table(
	[h.part, h.dark, h.light, h.means],
	c.tones.map(([name, token, means]) => [name, swatch(CONSOLE.dark[token as Token]), swatch(CONSOLE.light[token as Token]), esc(means)])
)}

    <h2 id="charts">${c.chartTitle}</h2>
    <p>${c.chartLead}</p>
    <div class="brand-series" aria-hidden="true">${SERIES.map(([d, l]) => `<span><i class="only-dark" style="background:${d}"></i><i class="only-light" style="background:${l}"></i></span>`).join('')}</div>
${table([h.part, h.dark, h.light], SERIES.map(([d, l], i) => [c.series[i], swatch(d), swatch(l)]))}

    <h2 id="rules">${c.rulesTitle}</h2>
    <ul>
${c.rules.map((x) => `      <li>${x}</li>`).join('\n')}
    </ul>`
	};
}
