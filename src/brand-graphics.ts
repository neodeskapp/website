// The guide's page on graphics for marketing, /brand/graphics/: the mark's shapes as
// large graphics, screenshots, link previews and badges. The rules are the ones in
// BRAND.md; the example is drawn the way the home page draws its scenes, with the
// mark's own geometry and a real screenshot from public/img.

import { brandNav, brandPath } from './brand-shared.ts';

interface GraphicStrings {
	title: string;
	pageTitle: string;
	description: string;
	lead: string;
	shapesTitle: string;
	shapesLead: string;
	meanings: [string, string][];
	exampleAlt: string;
	shapeRules: string[];
	shotsTitle: string;
	shotsLead: string;
	shotRules: string[];
	previewsTitle: string;
	previewsLead: string;
	previewAlt: [string, string];
	previewRules: string[];
	badgesTitle: string;
	badges: string;
	neverTitle: string;
	neverLead: string;
	never: string[];
}

const S: Record<string, GraphicStrings> = {
	en: {
		title: 'Graphics',
		pageTitle: 'NeoDesk graphics: shapes, screenshots, previews',
		description: 'How NeoDesk marketing graphics are made: the mark\'s shapes behind real screenshots, how screenshots look, the link previews, and what NeoDesk never uses.',
		lead: 'NeoDesk\'s graphics show the product. The mark\'s three shapes give a page its colour, and a real screenshot or the install terminal sits in front of them.',
		shapesTitle: 'The shapes',
		shapesLead: 'On marketing pages, the parts of the mark work as large graphics. Each keeps the meaning of its colour:',
		meanings: [
			['The blue square', 'your side, the server'],
			['The lime circle', 'their side, the RustDesk client'],
			['The teal overlap', 'what both share, the console']
		],
		exampleAlt: 'The NeoDesk console\'s device list in front of the mark\'s square and circle',
		shapeRules: [
			'Keep the mark\'s proportions: the square\'s corner radius is 31.25 % of its side, and the circle is a true circle.',
			'Solid colours only, in the logo values for the background they sit on.',
			'The shapes may run off the edge of the page. Text and buttons stay inside it.',
			'Real content overlaps the shapes: a screenshot or a terminal in front, never text inside a shape as if it were a card.',
			'No other shapes. No blobs, waves, dots or grids next to them.'
		],
		shotsTitle: 'Screenshots',
		shotsLead: 'To show the console, use a real screenshot of it. Demo data is fine; invented interfaces are not.',
		shotRules: [
			'Take each screenshot in the dark and the light theme, and show the one that matches the reader\'s theme.',
			'A screenshot gets a 1 px border in the rule colour and 4 px corners, nothing else.',
			'A shadow only when one window floats above another, such as the desktop client in front of the console.',
			'No device frames, browser chrome or blurred parts. Crop to what the text talks about.'
		],
		previewsTitle: 'Link previews',
		previewsLead: 'Every page of the website gets its own preview image, 1200 by 630 px, drawn by the build: the logo, the page\'s title in Funnel Display, and the shapes.',
		previewAlt: ['The link preview of the home page', 'The link preview of the brand page'],
		previewRules: [
			'The title is the page\'s title. If it doesn\'t fit, shorten the title, don\'t shrink the type further.',
			'Only the shapes go past the edge. The logo and the title stay inside it.',
			'One useful fact, such as the address of the repository, instead of a row of attributes.'
		],
		badgesTitle: 'Badges',
		badges: 'The README of the neodesk repository uses NeoDesk\'s own badges instead of shields.io: two parts, a dark or white label side with an icon and a value side in a logo colour, 28 px high, 4 px corners, every value at 4.5:1 or better. They are the only badges; don\'t add other badge styles anywhere.',
		neverTitle: 'What NeoDesk never uses',
		neverLead: 'These make a page look like any other software site, or hide what the product does.',
		never: [
			'Gradients, blur, glow, decorative shadows and animations that play on load',
			'Stock photos and filler illustrations: people at laptops, abstract networks, rockets',
			'Fake interfaces, and screenshots with invented features',
			'Pills, chips and cards, upper-case eyebrows above headings',
			'Taglines that string attributes together with middle dots',
			'Dark navy with electric blue, the purple SaaS look, cream with rust'
		]
	},
	de: {
		title: 'Grafiken',
		pageTitle: 'NeoDesk-Grafiken: Formen, Screenshots, Vorschauen',
		description: 'Grafiken für NeoDesk: die Formen des Zeichens hinter echten Screenshots, wie Screenshots aussehen, die Linkvorschauen und was NeoDesk nie verwendet.',
		lead: 'Die Grafiken von NeoDesk zeigen das Produkt. Die drei Formen des Zeichens geben einer Seite ihre Farbe, und ein echter Screenshot oder das Installationsterminal steht davor.',
		shapesTitle: 'Die Formen',
		shapesLead: 'Auf Werbeseiten werden die Teile des Zeichens zu großen Grafiken. Jeder behält die Bedeutung seiner Farbe:',
		meanings: [
			['Das blaue Quadrat', 'deine Seite, der Server'],
			['Der limettengrüne Kreis', 'ihre Seite, der RustDesk-Client'],
			['Die türkise Überlappung', 'was beide teilen, die Konsole']
		],
		exampleAlt: 'Die Geräteliste der NeoDesk-Konsole vor dem Quadrat und dem Kreis des Zeichens',
		shapeRules: [
			'Behalte die Proportionen des Zeichens: Der Eckenradius des Quadrats ist 31,25 % seiner Seite, und der Kreis ist ein echter Kreis.',
			'Nur volle Farben, in den Logowerten für den Hintergrund, auf dem sie stehen.',
			'Die Formen dürfen über den Seitenrand laufen. Text und Schaltflächen bleiben innerhalb.',
			'Echte Inhalte überlappen die Formen: ein Screenshot oder ein Terminal davor, nie Text in einer Form, als wäre sie eine Karte.',
			'Keine anderen Formen. Keine Blobs, Wellen, Punkte oder Raster daneben.'
		],
		shotsTitle: 'Screenshots',
		shotsLead: 'Um die Konsole zu zeigen, nimm einen echten Screenshot davon. Demodaten sind in Ordnung, erfundene Oberflächen nicht.',
		shotRules: [
			'Nimm jeden Screenshot im dunklen und im hellen Theme auf und zeig den, der zum Theme der Leser passt.',
			'Ein Screenshot bekommt einen 1 px Rand in der Linienfarbe und 4 px Ecken, sonst nichts.',
			'Ein Schatten nur, wenn ein Fenster über einem anderen schwebt, etwa der Desktop-Client vor der Konsole.',
			'Keine Geräterahmen, keine Browserleisten und keine unscharfen Stellen. Schneide auf das zu, worüber der Text spricht.'
		],
		previewsTitle: 'Linkvorschauen',
		previewsLead: 'Jede Seite der Website bekommt ihr eigenes Vorschaubild, 1200 mal 630 px, vom Build gezeichnet: das Logo, der Titel der Seite in Funnel Display und die Formen.',
		previewAlt: ['Die Linkvorschau der Startseite', 'Die Linkvorschau der Markenseite'],
		previewRules: [
			'Der Titel ist der Titel der Seite. Passt er nicht, kürze den Titel, statt die Schrift weiter zu verkleinern.',
			'Nur die Formen gehen über den Rand. Logo und Titel bleiben innerhalb.',
			'Eine nützliche Tatsache, etwa die Adresse des Repositorys, statt einer Reihe von Eigenschaften.'
		],
		badgesTitle: 'Badges',
		badges: 'Das README des neodesk-Repositorys nutzt eigene Badges statt shields.io: zwei Teile, eine dunkle oder weiße Beschriftungsseite mit Symbol und eine Wertseite in einer Logofarbe, 28 px hoch, 4 px Ecken, jeder Wert mit 4,5:1 oder besser. Es sind die einzigen Badges; füge nirgends andere Badge-Stile hinzu.',
		neverTitle: 'Was NeoDesk nie verwendet',
		neverLead: 'Damit sieht eine Seite aus wie jede andere Software-Seite, oder es verdeckt, was das Produkt tut.',
		never: [
			'Verläufe, Unschärfe, Leuchten, dekorative Schatten und Animationen beim Laden',
			'Stockfotos und Füllillustrationen: Leute am Laptop, abstrakte Netzwerke, Raketen',
			'Falsche Oberflächen und Screenshots mit erfundenen Funktionen',
			'Pillen, Chips und Karten, Großbuchstabenzeilen über Überschriften',
			'Slogans, die Eigenschaften mit Mittelpunkten aneinanderreihen',
			'Dunkles Marineblau mit grellem Blau, den lila SaaS-Look, Creme mit Rost'
		]
	}
};

/** The mark's three shapes on its 64 unit grid, cropped to the mark; the colours come from brand.css. */
const shapes = (id: string) => `<svg class="gx-shapes" viewBox="10 10 44 44" aria-hidden="true">
        <defs><clipPath id="${id}"><circle cx="38" cy="26" r="16"/></clipPath></defs>
        <rect class="gx-sq" x="10" y="22" width="32" height="32" rx="10"/>
        <circle class="gx-ci" cx="38" cy="26" r="16"/>
        <rect class="gx-ov" x="10" y="22" width="32" height="32" rx="10" clip-path="url(#${id})"/>
      </svg>`;

const shot = (name: string, theme: 'dark' | 'light', alt: string) =>
	`<picture class="only-${theme}"><source type="image/webp" srcset="/img/${name}-${theme}.webp"><img class="gx-shot" src="/img/${name}-${theme}.png" width="1200" height="680" alt="${alt}"></picture>`;

export function graphicsPage(code: string, prefix: string) {
	const g = S[code] ?? S.en;
	const og = (p: string) => `/og${prefix}/${p}.png`;
	return {
		slug: 'graphics' as const,
		path: brandPath('graphics'),
		title: g.title,
		pageTitle: g.pageTitle,
		description: g.description,
		main: `${brandNav(code, prefix, 'graphics')}
    <h1 class="display">${g.title}</h1>
    <p class="lead">${g.lead}</p>

    <h2 id="the-shapes">${g.shapesTitle}</h2>
    <p>${g.shapesLead}</p>
    <ul class="gx-meanings">
${g.meanings.map(([what, means], i) => `      <li><span class="gx-key gx-key-${['sq', 'ci', 'ov'][i]}" aria-hidden="true"></span><span><b>${what}</b>: ${means}</span></li>`).join('\n')}
    </ul>
    <figure class="gx-scene">
      ${shapes('gx-clip')}
      <div class="gx-scene-shot">${shot('devices', 'dark', g.exampleAlt)}${shot('devices', 'light', g.exampleAlt)}</div>
    </figure>
    <ul>
${g.shapeRules.map((x) => `      <li>${x}</li>`).join('\n')}
    </ul>

    <h2 id="screenshots">${g.shotsTitle}</h2>
    <p>${g.shotsLead}</p>
    <ul>
${g.shotRules.map((x) => `      <li>${x}</li>`).join('\n')}
    </ul>

    <h2 id="link-previews">${g.previewsTitle}</h2>
    <p>${g.previewsLead}</p>
    <div class="brand-grid gx-previews">
      <figure><img src="${og('index')}" width="1200" height="630" alt="${g.previewAlt[0]}" loading="lazy"></figure>
      <figure><img src="${og('brand')}" width="1200" height="630" alt="${g.previewAlt[1]}" loading="lazy"></figure>
    </div>
    <ul>
${g.previewRules.map((x) => `      <li>${x}</li>`).join('\n')}
    </ul>

    <h2 id="badges">${g.badgesTitle}</h2>
    <p>${g.badges}</p>

    <h2 id="what-neodesk-never-uses">${g.neverTitle}</h2>
    <p>${g.neverLead}</p>
    <ul>
${g.never.map((x) => `      <li>${x}</li>`).join('\n')}
    </ul>`
	};
}
