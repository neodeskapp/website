// The brand page, /brand/ and /de/brand/: the logo files, how to place them, the
// colours, the fonts, the name and the voice. Everything comes from
// .ui-rework/brand/BRAND.md; what it does not say is not on the page. The logo files
// in public/brand/files/ are the owner's artwork, copied unchanged; the wrong uses
// are drawn with CSS on the real files, never by editing them.

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export interface BrandStrings {
	title: string;
	/** <title>, at most 60 characters */
	pageTitle: string;
	description: string;
	lead: string;
	logoTitle: string;
	logoLead: string;
	fullLogo: string;
	mark: string;
	appIcon: string;
	onDark: string;
	onLight: string;
	zip: string;
	zipNote: string;
	spaceTitle: string;
	spaceText: string;
	sizeText: string;
	spaceAlt: string;
	dontTitle: string;
	dontLead: string;
	dont: Record<'recolour' | 'stretch' | 'rotate' | 'shadow' | 'outline' | 'gradient' | 'pill' | 'small', string>;
	colourTitle: string;
	colourLead: string;
	colourHead: [string, string, string, string];
	colours: [string, string, string, string][];
	textColourLead: string;
	textColours: [string, string, string, string][];
	oneColour: string;
	surfaceLead: string;
	surfaces: [string, string, string][];
	fontTitle: string;
	fonts: { name: string; use: string; licence: string; source: string; href: string }[];
	nameTitle: string;
	name: string[];
	voiceTitle: string;
	voiceLead: string;
	voice: { rule: string; do: string; dont: string }[];
	rustdeskTitle: string;
	rustdesk: string[];
	rustdeskDo: string;
	rustdeskDont: string;
	doLabel: string;
	dontLabel: string;
	download: string;
}

export const BRAND: Record<string, BrandStrings> = {
	en: {
		title: 'Brand and logo',
		pageTitle: 'NeoDesk brand and logo files',
		description: 'The NeoDesk logo files to download, how to place them, the colours, the fonts, how to write the name, and the voice.',
		lead: 'The NeoDesk logo, its colours and fonts, and how to write about NeoDesk. Use the files as they are.',
		logoTitle: 'Logo files',
		logoLead: 'The logo is a rounded square and a circle that overlap, and the word neodesk. The square is your desktop, the circle is the person on the other end, the overlap is what you share. Use the version for the background it sits on.',
		fullLogo: 'Full logo',
		mark: 'Mark',
		appIcon: 'App icon and favicon',
		onDark: 'On dark',
		onLight: 'On light',
		zip: 'Download every file as a zip',
		zipNote: 'SVG and PNG, the app icon in every size, and the ICO and ICNS files.',
		spaceTitle: 'Clear space and size',
		spaceText: 'Keep at least the circle\'s radius free around the whole logo. Nothing else goes into that space.',
		sizeText: 'Below 24 px of height, use the mark or the favicon instead of the full logo.',
		spaceAlt: 'The full logo with its clear space marked around it, as wide as the circle\'s radius',
		dontTitle: 'What not to do',
		dontLead: 'Use the logo as it is. Each example below is the real file with something added on top of it, the way it must not look.',
		dont: {
			recolour: 'Don\'t recolour it.',
			stretch: 'Don\'t stretch it.',
			rotate: 'Don\'t rotate it.',
			shadow: 'No shadow or glow.',
			outline: 'No outline.',
			gradient: 'No gradient.',
			pill: 'No pill or card behind it.',
			small: 'Not the full logo below 24 px.'
		},
		colourTitle: 'Colours',
		colourLead: 'The logo\'s colours, for a dark and a light background:',
		colourHead: ['Part', 'On dark', 'On light', 'Stands for'],
		colours: [
			['Square', '#58a6ff', '#1f6feb', 'Your side: the server'],
			['Circle', '#a3e635', '#4d8f06', 'Their side: the RustDesk client'],
			['Overlap', '#3fd0c4', '#0f9e96', 'What both share: the console'],
			['Wordmark', '#e4e7e7', '#1b1e1f', '']
		],
		textColourLead: 'For text in the logo colours, such as a key word on a web page, use these values; they reach 4.5:1 on their background. Body text stays neutral, and colour marks a key word, not a whole paragraph.',
		textColours: [
			['Blue', '#58a6ff', '#1f6feb', 'Your server, the primary button, Install'],
			['Lime', '#a3e635', '#3d7a06', 'The RustDesk client, client ports'],
			['Teal', '#3fd0c4', '#0b7a74', 'The console, links in text']
		],
		oneColour: 'In one colour, draw the square and the circle in the ink colour and the overlap in the background colour.',
		surfaceLead: 'Surfaces and text around the logo:',
		surfaces: [
			['Background', '#141616', '#ffffff'],
			['Text', '#e4e7e7', '#1b1e1f'],
			['Muted text', '#a3abad', '#566064'],
			['Rules', '#2c3131', '#dde1e2']
		],
		fontTitle: 'Fonts',
		fonts: [
			{
				name: 'Funnel Display',
				use: 'The wordmark, weight 700, letter-spacing -0.03em, lower case. In files the wordmark is converted to outlines. Large headlines on marketing material, such as the website\'s first heading, use it too.',
				licence: 'SIL Open Font License 1.1',
				source: 'github.com/google/fonts, folder ofl/funneldisplay',
				href: 'https://github.com/google/fonts/tree/main/ofl/funneldisplay'
			},
			{
				name: 'IBM Plex Sans',
				use: 'Everything else: text, labels, the console\'s interface.',
				licence: 'SIL Open Font License 1.1',
				source: 'github.com/IBM/plex',
				href: 'https://github.com/IBM/plex'
			},
			{
				name: 'IBM Plex Mono',
				use: 'Only for what people copy: commands, IDs, addresses.',
				licence: 'SIL Open Font License 1.1',
				source: 'github.com/IBM/plex',
				href: 'https://github.com/IBM/plex'
			}
		],
		nameTitle: 'The name',
		name: [
			'Write <b>NeoDesk</b>: one word, capital N and capital D. Not Neo Desk, not Neodesk.',
			'The command is <code>neodesk</code>, in lower case, as people type it.',
			'The lower-case <span class="mono">neodesk</span> of the wordmark belongs to the logo only. In text, write NeoDesk.'
		],
		voiceTitle: 'Voice',
		voiceLead: 'NeoDesk writes plainly and says what is true today.',
		voice: [
			{ rule: 'Plain words, short sentences, active voice. Start with the point.', do: 'NeoDesk is a remote desktop server you run yourself.', dont: 'Unlock the next level of remote access.' },
			{ rule: 'Facts, not marketing. No exclamation marks.', do: 'One Go binary does the work of hbbs and hbbr.', dont: 'The fastest, most powerful server ever!' },
			{ rule: 'Sentence case everywhere: headings, buttons, labels.', do: 'Add a computer', dont: 'Add A Computer' },
			{ rule: 'Write a sentence instead of stringing attributes together with dots.', do: 'NeoDesk is self-hosted, works with RustDesk clients and is open source under AGPL-3.0.', dont: 'A tagline of three attributes with middle dots between them.' }
		],
		rustdeskTitle: 'NeoDesk and RustDesk',
		rustdesk: [
			'RustDesk is made by Purslane Tech Pte. Ltd. NeoDesk is not affiliated with or endorsed by RustDesk or Purslane Tech. NeoDesk is an independent project that implements the RustDesk protocol for client compatibility, and its use of the name RustDesk is descriptive.',
			'Use the name RustDesk only to say what NeoDesk works with: the RustDesk client, the RustDesk protocol.'
		],
		rustdeskDo: 'NeoDesk works with RustDesk clients. It is a RustDesk-compatible server.',
		rustdeskDont: 'NeoDesk, the official RustDesk server.',
		doLabel: 'Do',
		dontLabel: 'Don\'t',
		download: 'Download'
	},
	de: {
		title: 'Logo und Marke',
		pageTitle: 'NeoDesk: Logo-Dateien und Markenregeln',
		description: 'Die Logo-Dateien von NeoDesk zum Herunterladen, wie du sie platzierst, die Farben, die Schriften, wie der Name geschrieben wird, und der Ton.',
		lead: 'Das Logo von NeoDesk, seine Farben und Schriften, und wie man über NeoDesk schreibt. Nutze die Dateien so, wie sie sind.',
		logoTitle: 'Logo-Dateien',
		logoLead: 'Das Logo ist ein abgerundetes Quadrat und ein Kreis, die sich überlappen, und das Wort neodesk. Das Quadrat ist dein Desktop, der Kreis die Person am anderen Ende, die Überlappung das, was ihr teilt. Nimm die Fassung für den Hintergrund, auf dem es steht.',
		fullLogo: 'Ganzes Logo',
		mark: 'Zeichen',
		appIcon: 'App-Symbol und Favicon',
		onDark: 'Auf dunkel',
		onLight: 'Auf hell',
		zip: 'Alle Dateien als ZIP herunterladen',
		zipNote: 'SVG und PNG, das App-Symbol in allen Größen sowie die ICO- und ICNS-Dateien.',
		spaceTitle: 'Schutzraum und Größe',
		spaceText: 'Halte rund um das ganze Logo mindestens den Radius des Kreises frei. In diesen Raum kommt nichts anderes.',
		sizeText: 'Unter 24 px Höhe nimm das Zeichen oder das Favicon statt des ganzen Logos.',
		spaceAlt: 'Das ganze Logo mit seinem Schutzraum ringsum, so breit wie der Radius des Kreises',
		dontTitle: 'Was du nicht tun solltest',
		dontLead: 'Nutze das Logo so, wie es ist. Jedes Beispiel unten ist die echte Datei mit etwas darüber, so wie es nicht aussehen darf.',
		dont: {
			recolour: 'Nicht umfärben.',
			stretch: 'Nicht verzerren.',
			rotate: 'Nicht drehen.',
			shadow: 'Kein Schatten, kein Leuchten.',
			outline: 'Keine Kontur.',
			gradient: 'Kein Verlauf.',
			pill: 'Keine Pille und keine Karte dahinter.',
			small: 'Nicht das ganze Logo unter 24 px.'
		},
		colourTitle: 'Farben',
		colourLead: 'Die Farben des Logos, für einen dunklen und einen hellen Hintergrund:',
		colourHead: ['Teil', 'Auf dunkel', 'Auf hell', 'Steht für'],
		colours: [
			['Quadrat', '#58a6ff', '#1f6feb', 'Deine Seite: der Server'],
			['Kreis', '#a3e635', '#4d8f06', 'Ihre Seite: der RustDesk-Client'],
			['Überlappung', '#3fd0c4', '#0f9e96', 'Was beide teilen: die Konsole'],
			['Wortmarke', '#e4e7e7', '#1b1e1f', '']
		],
		textColourLead: 'Für Text in den Logofarben, etwa ein Schlüsselwort auf einer Webseite, nimm diese Werte; sie erreichen 4,5:1 auf ihrem Hintergrund. Fließtext bleibt neutral, und Farbe hebt ein Schlüsselwort hervor, keinen ganzen Absatz.',
		textColours: [
			['Blau', '#58a6ff', '#1f6feb', 'Dein Server, die Hauptschaltfläche, Installieren'],
			['Limette', '#a3e635', '#3d7a06', 'Der RustDesk-Client, Client-Ports'],
			['Türkis', '#3fd0c4', '#0b7a74', 'Die Konsole, Links im Text']
		],
		oneColour: 'Einfarbig zeichnest du Quadrat und Kreis in der Druckfarbe und die Überlappung in der Hintergrundfarbe.',
		surfaceLead: 'Flächen und Text rund um das Logo:',
		surfaces: [
			['Hintergrund', '#141616', '#ffffff'],
			['Text', '#e4e7e7', '#1b1e1f'],
			['Gedämpfter Text', '#a3abad', '#566064'],
			['Linien', '#2c3131', '#dde1e2']
		],
		fontTitle: 'Schriften',
		fonts: [
			{
				name: 'Funnel Display',
				use: 'Die Wortmarke, Stärke 700, Laufweite -0,03em, klein geschrieben. In Dateien ist die Wortmarke in Pfade umgewandelt. Große Überschriften auf Werbematerial, etwa die erste Überschrift der Website, nutzen sie auch.',
				licence: 'SIL Open Font License 1.1',
				source: 'github.com/google/fonts, Ordner ofl/funneldisplay',
				href: 'https://github.com/google/fonts/tree/main/ofl/funneldisplay'
			},
			{
				name: 'IBM Plex Sans',
				use: 'Alles andere: Text, Beschriftungen, die Oberfläche der Konsole.',
				licence: 'SIL Open Font License 1.1',
				source: 'github.com/IBM/plex',
				href: 'https://github.com/IBM/plex'
			},
			{
				name: 'IBM Plex Mono',
				use: 'Nur für das, was man kopiert: Befehle, IDs, Adressen.',
				licence: 'SIL Open Font License 1.1',
				source: 'github.com/IBM/plex',
				href: 'https://github.com/IBM/plex'
			}
		],
		nameTitle: 'Der Name',
		name: [
			'Schreib <b>NeoDesk</b>: ein Wort, großes N und großes D. Nicht Neo Desk, nicht Neodesk.',
			'Der Befehl heißt <code>neodesk</code>, klein geschrieben, so wie man ihn tippt.',
			'Das kleine <span class="mono">neodesk</span> der Wortmarke gehört nur zum Logo. Im Text schreibst du NeoDesk.'
		],
		voiceTitle: 'Ton',
		voiceLead: 'NeoDesk schreibt schlicht und sagt, was heute stimmt.',
		voice: [
			{ rule: 'Einfache Wörter, kurze Sätze, aktiv. Fang mit dem Wichtigsten an.', do: 'NeoDesk ist ein Remote-Desktop-Server, den du selbst betreibst.', dont: 'Erlebe Fernzugriff auf einem neuen Level.' },
			{ rule: 'Fakten statt Werbung. Keine Ausrufezeichen.', do: 'Ein Go-Binary erledigt die Arbeit von hbbs und hbbr.', dont: 'Der schnellste und stärkste Server aller Zeiten!' },
			{ rule: 'Satzanfang groß, sonst wie im Satz: Überschriften, Schaltflächen, Beschriftungen.', do: 'Computer hinzufügen', dont: 'Computer Hinzufügen' },
			{ rule: 'Schreib einen Satz, statt Eigenschaften mit Punkten aneinanderzureihen.', do: 'NeoDesk läuft auf deinem Server, funktioniert mit RustDesk-Clients und ist Open Source unter der AGPL-3.0.', dont: 'Ein Slogan aus drei Eigenschaften mit Mittelpunkten dazwischen.' }
		],
		rustdeskTitle: 'NeoDesk und RustDesk',
		rustdesk: [
			'RustDesk stammt von der Purslane Tech Pte. Ltd. NeoDesk ist weder mit RustDesk noch mit Purslane Tech verbunden und wird von ihnen nicht unterstützt. NeoDesk ist ein unabhängiges Projekt, das das RustDesk-Protokoll für die Kompatibilität mit den Clients umsetzt, und nennt RustDesk nur beschreibend.',
			'Nenne RustDesk nur, um zu sagen, womit NeoDesk funktioniert: dem RustDesk-Client, dem RustDesk-Protokoll.'
		],
		rustdeskDo: 'NeoDesk funktioniert mit RustDesk-Clients. Es ist ein RustDesk-kompatibler Server.',
		rustdeskDont: 'NeoDesk, der offizielle RustDesk-Server.',
		doLabel: 'So',
		dontLabel: 'Nicht so',
		download: 'Herunterladen'
	}
};

const F = '/brand/files';
const swatch = (hex: string) => `<span class="swatch" style="background:${hex}"></span><code>${hex}</code>`;

/** The brand page's main content in one language. */
export function brandMain(code: string, zipBytes: number) {
	const b = BRAND[code] ?? BRAND.en;
	const pngs = (stem: string, sizes: string[]) => sizes.map((s) => `<a href="${F}/png/${stem}-${s}.png" download>PNG ${s.replace('h', ' px high').replace(/^(\d+)$/, '$1 px')}</a>`).join(', ');
	const tile = (theme: 'dark' | 'light', img: string, w: number, h: number, alt: string, links: string) => `
        <figure class="brand-tile">
          <div class="brand-bg brand-${theme}"><img src="${img}" width="${w}" height="${h}" alt="${esc(alt)}"></div>
          <figcaption><b>${theme === 'dark' ? b.onDark : b.onLight}</b> ${links}</figcaption>
        </figure>`;
	const dont = (key: keyof BrandStrings['dont'], cls: string) => `
        <figure class="brand-dont">
          <div class="brand-bg brand-light"><img class="dont-${cls}" src="${F}/svg/logo-on-light.svg" width="236" height="56" alt=""></div>
          <figcaption><b>${b.dontLabel}:</b> ${b.dont[key]}</figcaption>
        </figure>`;
	return `    <h1 class="display">${b.title}</h1>
    <p class="lead">${b.lead}</p>

    <h2 id="logo-files">${b.logoTitle}</h2>
    <p>${b.logoLead}</p>
    <h3>${b.fullLogo}</h3>
    <div class="brand-grid">${tile('dark', `${F}/svg/logo-on-dark.svg`, 236, 56, `${b.fullLogo}, ${b.onDark}`, `<a href="${F}/svg/logo-on-dark.svg" download>SVG</a>, ${pngs('logo-on-dark', ['64h', '128h', '256h', '914x542'])}`)}${tile('light', `${F}/svg/logo-on-light.svg`, 236, 56, `${b.fullLogo}, ${b.onLight}`, `<a href="${F}/svg/logo-on-light.svg" download>SVG</a>, ${pngs('logo-on-light', ['64h', '128h', '256h', '914x542'])}`)}
    </div>
    <h3>${b.mark}</h3>
    <div class="brand-grid">${tile('dark', `${F}/svg/mark-on-dark.svg`, 72, 72, `${b.mark}, ${b.onDark}`, `<a href="${F}/svg/mark-on-dark.svg" download>SVG</a>, ${pngs('mark-on-dark', ['64', '128', '256', '512'])}`)}${tile('light', `${F}/svg/mark-on-light.svg`, 72, 72, `${b.mark}, ${b.onLight}`, `<a href="${F}/svg/mark-on-light.svg" download>SVG</a>, ${pngs('mark-on-light', ['64', '128', '256', '512'])}`)}
    </div>
    <h3>${b.appIcon}</h3>
    <div class="brand-grid">
        <figure class="brand-tile">
          <div class="brand-bg brand-plain"><img src="${F}/svg/app-icon.svg" width="72" height="72" alt="${esc(b.appIcon)}"></div>
          <figcaption><a href="${F}/svg/app-icon.svg" download>SVG</a>, <a href="${F}/svg/favicon.svg" download>favicon SVG</a>, ${pngs('app-icon', ['16', '32', '64', '128', '256', '512', '1024'])}, <a href="${F}/png/favicon.ico" download>favicon.ico</a>, <a href="${F}/png/app-icon.ico" download>ICO</a>, <a href="${F}/png/app-icon.icns" download>ICNS</a></figcaption>
        </figure>
    </div>
    <p class="brand-zip"><a class="btn-link" href="/brand/neodesk-logo.zip" download>${b.zip}</a> <span>(${Math.round(zipBytes / 1024)} KB)</span><br>${b.zipNote}</p>

    <h2 id="clear-space-and-size">${b.spaceTitle}</h2>
    <p>${b.spaceText}</p>
    <figure class="brand-space">
      <div class="brand-bg brand-light"><span class="space-box"><img src="${F}/svg/logo-on-light.svg" width="236" height="56" alt="${esc(b.spaceAlt)}"></span></div>
    </figure>
    <p>${b.sizeText}</p>

    <h2 id="what-not-to-do">${b.dontTitle}</h2>
    <p>${b.dontLead}</p>
    <div class="brand-grid brand-donts">${dont('recolour', 'recolour')}${dont('stretch', 'stretch')}${dont('rotate', 'rotate')}${dont('shadow', 'shadow')}${dont('outline', 'outline')}${dont('gradient', 'gradient')}${dont('pill', 'pill')}${dont('small', 'small')}
    </div>

    <h2 id="colours">${b.colourTitle}</h2>
    <p>${b.colourLead}</p>
    <div class="table-wrap" tabindex="0"><table>
      <thead><tr>${b.colourHead.map((h) => `<th>${h}</th>`).join('')}</tr></thead>
      <tbody>
${b.colours.map(([part, dark, light, means]) => `        <tr><td>${part}</td><td>${swatch(dark)}</td><td>${swatch(light)}</td><td>${means}</td></tr>`).join('\n')}
      </tbody>
    </table></div>
    <p>${b.oneColour}</p>
    <p>${b.textColourLead}</p>
    <div class="table-wrap" tabindex="0"><table>
      <thead><tr>${b.colourHead.map((h) => `<th>${h}</th>`).join('')}</tr></thead>
      <tbody>
${b.textColours.map(([part, dark, light, means]) => `        <tr><td>${part}</td><td>${swatch(dark)}</td><td>${swatch(light)}</td><td>${means}</td></tr>`).join('\n')}
      </tbody>
    </table></div>
    <p>${b.surfaceLead}</p>
    <div class="table-wrap" tabindex="0"><table>
      <thead><tr><th>${b.colourHead[0]}</th><th>${b.colourHead[1]}</th><th>${b.colourHead[2]}</th></tr></thead>
      <tbody>
${b.surfaces.map(([part, dark, light]) => `        <tr><td>${part}</td><td>${swatch(dark)}</td><td>${swatch(light)}</td></tr>`).join('\n')}
      </tbody>
    </table></div>

    <h2 id="fonts">${b.fontTitle}</h2>
    <ul class="rows">
${b.fonts.map((f) => `      <li><b>${f.name}</b><p>${f.use}</p><p>${f.licence}, <a href="${f.href}" rel="noopener">${f.source}</a></p></li>`).join('\n')}
    </ul>

    <h2 id="the-name">${b.nameTitle}</h2>
${b.name.map((p) => `    <p>${p}</p>`).join('\n')}

    <h2 id="voice">${b.voiceTitle}</h2>
    <p>${b.voiceLead}</p>
    <ul class="rows brand-voice">
${b.voice.map((v) => `      <li><b>${v.rule}</b><p><span class="ok">${b.doLabel}:</span> ${esc(v.do)}</p><p><span class="no">${b.dontLabel}:</span> ${esc(v.dont)}</p></li>`).join('\n')}
    </ul>

    <h2 id="neodesk-and-rustdesk">${b.rustdeskTitle}</h2>
${b.rustdesk.map((p) => `    <p>${esc(p)}</p>`).join('\n')}
    <ul class="rows brand-voice">
      <li><p><span class="ok">${b.doLabel}:</span> ${esc(b.rustdeskDo)}</p><p><span class="no">${b.dontLabel}:</span> ${esc(b.rustdeskDont)}</p></li>
    </ul>`;
}
