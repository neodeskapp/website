// The brand guide, /brand/ and its pages, in English and German. /brand/ has the
// logo files, how to place them and what not to do; the pages under it have the
// colours, the fonts, the console's interface elements, graphics for marketing,
// and the voice. The rules come from .ui-rework/brand/BRAND.md, the console's
// tokens and components (web-ui/src/lib) and its design guide; what they do not
// say is not on these pages. The logo files in public/brand/files/ are the
// owner's artwork, copied unchanged; the wrong uses are drawn with CSS on the
// real files, never by editing them.

import { esc, brandNav, GUIDE, BRAND_SLUGS, brandPath } from './brand-shared.ts';
import type { BrandPage, BrandSlug } from './brand-shared.ts';
import { coloursPage } from './brand-colours.ts';
import { fontsPage } from './brand-fonts.ts';
import { elementsPage } from './brand-elements.ts';
import { graphicsPage } from './brand-graphics.ts';
import { voicePage, voiceProblems } from './brand-voice.ts';
import { colourProblems } from './brand-colours.ts';

export { BRAND_SLUGS, brandPath };
export type { BrandPage, BrandSlug };

interface LogoStrings {
	title: string;
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
	guideTitle: string;
	guide: Record<Exclude<BrandSlug, ''>, string>;
}

const LOGO: Record<string, LogoStrings> = {
	en: {
		title: 'Brand and logo',
		pageTitle: 'NeoDesk brand and logo files',
		description: 'The NeoDesk logo files to download, how to place them, and the brand guide: colours, fonts, interface elements, graphics and voice.',
		lead: 'The NeoDesk logo and the rules for everything that carries the name: the console, the website, the README and anything else people see. Use the files as they are.',
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
		guideTitle: 'The rest of the guide',
		guide: {
			colours: 'The logo colours and what each one stands for, the colours for text, and the console\'s palette in dark and light.',
			fonts: 'Funnel Display for the wordmark and large headlines, IBM Plex Sans for everything else, IBM Plex Mono for what people copy. With samples of each.',
			elements: 'How the console\'s buttons, fields, tables, status words, notices and dialogs look, drawn in both themes, with the spacing and sizes behind them.',
			graphics: 'The mark\'s shapes as large graphics, screenshots, link previews, and what NeoDesk material never uses.',
			voice: 'How NeoDesk writes: plain words, facts that are true today, the words to leave out, text in the interface, and how to write the name and mention RustDesk.'
		}
	},
	de: {
		title: 'Logo und Marke',
		pageTitle: 'NeoDesk: Logo-Dateien und Markenregeln',
		description: 'Die Logo-Dateien von NeoDesk zum Herunterladen, wie du sie platzierst, und der Leitfaden: Farben, Schriften, Bedienelemente, Grafiken und Ton.',
		lead: 'Das Logo von NeoDesk und die Regeln für alles, was den Namen trägt: die Konsole, die Website, das README und alles andere, was Leute sehen. Nutze die Dateien so, wie sie sind.',
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
		guideTitle: 'Der Rest des Leitfadens',
		guide: {
			colours: 'Die Logofarben und wofür jede steht, die Farben für Text und die Palette der Konsole in dunkel und hell.',
			fonts: 'Funnel Display für die Wortmarke und große Überschriften, IBM Plex Sans für alles andere, IBM Plex Mono für das, was man kopiert. Mit Proben von jeder.',
			elements: 'Wie Schaltflächen, Felder, Tabellen, Statuswörter, Hinweise und Dialoge der Konsole aussehen, in beiden Themes gezeichnet, mit den Abständen und Größen dahinter.',
			graphics: 'Die Formen des Zeichens als große Grafiken, Screenshots, Linkvorschauen und was NeoDesk nie verwendet.',
			voice: 'Wie NeoDesk schreibt: einfache Wörter, Fakten, die heute stimmen, Wörter, die rausfliegen, Text in der Oberfläche, und wie man den Namen schreibt und RustDesk nennt.'
		}
	}
};

const F = '/brand/files';

function logoMain(code: string, prefix: string, zipBytes: number) {
	const b = LOGO[code] ?? LOGO.en;
	const g = GUIDE[code] ?? GUIDE.en;
	const pngs = (stem: string, sizes: string[]) => sizes.map((s) => `<a href="${F}/png/${stem}-${s}.png" download>PNG ${s.replace('h', ' px high').replace(/^(\d+)$/, '$1 px')}</a>`).join(', ');
	const tile = (theme: 'dark' | 'light', img: string, w: number, h: number, alt: string, links: string) => `
        <figure class="brand-tile">
          <div class="brand-bg brand-${theme}"><img src="${img}" width="${w}" height="${h}" alt="${esc(alt)}"></div>
          <figcaption><b>${theme === 'dark' ? b.onDark : b.onLight}</b> ${links}</figcaption>
        </figure>`;
	const dont = (key: keyof LogoStrings['dont']) => `
        <figure class="brand-dont">
          <div class="brand-bg brand-light"><img class="dont-${key}" src="${F}/svg/logo-on-light.svg" width="236" height="56" alt=""></div>
          <figcaption><b>${g.dontLabel}:</b> ${b.dont[key]}</figcaption>
        </figure>`;
	// The ids of the sections that moved to their own pages stay, on the entries that link there
	const oldIds: Partial<Record<BrandSlug, string>> = { colours: 'colours', fonts: 'fonts', voice: 'voice' };
	return `${brandNav(code, prefix, '')}
    <h1 class="display">${b.title}</h1>
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
    <div class="brand-grid brand-donts">${dont('recolour')}${dont('stretch')}${dont('rotate')}${dont('shadow')}${dont('outline')}${dont('gradient')}${dont('pill')}${dont('small')}
    </div>

    <h2 id="the-rest-of-the-guide">${b.guideTitle}</h2>
    <ul class="rows">
${BRAND_SLUGS.filter((s): s is Exclude<BrandSlug, ''> => s !== '')
	.map((s) => `      <li${oldIds[s] ? ` id="${oldIds[s]}"` : ''}><a href="${prefix}${brandPath(s)}">${esc(g.pages[s])}</a><p>${b.guide[s]}</p></li>`)
	.join('\n')}
    </ul>`;
}

/** Whether the guide has its text in a language. */
export const hasBrand = (code: string) => code in LOGO;

/** Every page of the guide in one language; prefix is the language's, such as /de. */
export function brandPages(code: string, prefix: string, zipBytes: number): BrandPage[] {
	const b = LOGO[code] ?? LOGO.en;
	const shared = ['src/brand-shared.ts', 'src/brand.css'];
	return [
		{ slug: '', path: brandPath(''), title: b.title, pageTitle: b.pageTitle, description: b.description, main: logoMain(code, prefix, zipBytes), sources: [...shared, 'src/brand.ts', 'public/brand/files'] },
		{ ...coloursPage(code, prefix), sources: [...shared, 'src/brand-colours.ts'] },
		{ ...fontsPage(code, prefix), sources: [...shared, 'src/brand-fonts.ts'] },
		{ ...elementsPage(code, prefix), sources: [...shared, 'src/brand-elements.ts'] },
		{ ...graphicsPage(code, prefix), sources: [...shared, 'src/brand-graphics.ts'] },
		{ ...voicePage(code, prefix), sources: [...shared, 'src/brand-voice.ts'] }
	];
}

/** What is wrong with the guide's text or colours, for the build to stop on. */
export function brandProblems() {
	return [...colourProblems(), ...voiceProblems()];
}
