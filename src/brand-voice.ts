// The guide's page on writing, /brand/voice/: how NeoDesk writes, the words it leaves
// out, how text in the console works, how to describe NeoDesk, the name, and how to
// mention RustDesk. The interface examples are the console's own strings
// (console/static/files/lang/en.json and de.json). voiceProblems() checks that the
// good examples follow the page's own rules.

import { esc, brandNav, brandPath, doDont, table } from './brand-shared.ts';

interface VoiceStrings {
	title: string;
	pageTitle: string;
	description: string;
	lead: string;
	readersTitle: string;
	readers: string[];
	principlesTitle: string;
	principles: { rule: string; do: string; dont: string }[];
	wordsTitle: string;
	wordsLead: string;
	wordsHead: [string, string];
	words: [string, string][];
	uiTitle: string;
	uiLead: string;
	uiHead: [string, string];
	ui: [string, string][];
	rewritesTitle: string;
	rewritesLead: string;
	before: string;
	after: string;
	rewrites: [string, string, string][];
	formatTitle: string;
	format: string[];
	describeTitle: string;
	describeLead: string;
	short: string;
	long: string;
	shortLabel: string;
	longLabel: string;
	nameTitle: string;
	name: string[];
	rustdeskTitle: string;
	rustdesk: string[];
	rustdeskDo: string;
	rustdeskDont: string;
	germanTitle: string;
	german: string[];
}

const S: Record<string, VoiceStrings> = {
	en: {
		title: 'Voice and writing',
		pageTitle: 'NeoDesk voice and writing guide',
		description: 'How NeoDesk writes: plain words, facts that are true today, words to leave out, text in the console, describing NeoDesk and mentioning RustDesk.',
		lead: 'NeoDesk writes plainly and says what is true today. It sounds like a colleague who runs the server next to you: exact, calm, and done when the point is made.',
		readersTitle: 'Who reads it',
		readers: [
			'Most readers run their own server, often alone, and come to the docs or the console with a task. They want the next step, not a pitch.',
			'Some sit at a computer that someone is helping them with. They see a window from the desktop client and need to know what it means and whether to say yes.'
		],
		principlesTitle: 'Principles',
		principles: [
			{ rule: 'Start with the point.', do: 'NeoDesk is a remote desktop server you run yourself.', dont: 'In today\'s world, remote access matters more than ever.' },
			{ rule: 'Plain words, short sentences, active voice.', do: 'Every client stops connecting until it gets the new key.', dont: 'Upon regeneration of the key, client connectivity will be interrupted pending redistribution.' },
			{ rule: 'Facts, not marketing. No exclamation marks.', do: 'One Go binary does the work of hbbs and hbbr.', dont: 'The fastest, most powerful server ever!' },
			{ rule: 'Say what works today. No promises, no roadmap in product text.', do: 'NeoDesk works with RustDesk clients.', dont: 'Soon NeoDesk will replace every remote desktop tool you use.' },
			{ rule: 'Use the words on the screen. Name a button or setting the way the console shows it.', do: 'Open Settings, then Sign-in.', dont: 'Head over to the authentication configuration area.' },
			{ rule: 'Numbers as digits, next to what they count.', do: '4 users, 2 pending', dont: 'Four (4) users in total, of which two are still pending approval' },
			{ rule: 'Sentence case everywhere: headings, buttons, labels.', do: 'Add a computer', dont: 'Add A Computer' },
			{ rule: 'Write a sentence instead of stringing attributes together with dots.', do: 'NeoDesk is self-hosted, works with RustDesk clients and is open source under AGPL-3.0.', dont: 'A tagline of three attributes with middle dots between them.' }
		],
		wordsTitle: 'Words to leave out',
		wordsLead: 'These words make a sentence sound bigger and say less. Test: delete the word. If the sentence still says the same, leave it deleted.',
		wordsHead: ['Instead of', 'Write'],
		words: [
			['seamless, seamlessly', 'What happens: "the client reconnects on its own"'],
			['powerful, robust', 'What it handles, or the number'],
			['comprehensive', 'Nothing, or "complete" when it is'],
			['cutting-edge, next-generation, innovative', 'Nothing'],
			['leverage, utilize', 'use'],
			['empower, enable', 'let'],
			['unlock, take to the next level', 'What gets better'],
			['in order to', 'to'],
			['It\'s worth noting, Notably, Importantly', 'Nothing; say the thing'],
			['simply, just, easy', 'Nothing; it isn\'t easy for the person who is stuck']
		],
		uiTitle: 'Text in the console',
		uiLead: 'The console\'s text is short and tells people what happened and what they can do. The examples are the console\'s own strings.',
		uiHead: ['Rule', 'Example'],
		ui: [
			['A button names the action and the thing.', 'Save sign-in settings'],
			['A confirmation asks about the exact thing, and its button repeats the verb.', 'Restore from this backup?'],
			['An error says what failed, and why when that is known.', 'Could not reach {host} on port {port}.'],
			['When people can fix it themselves, the error says how.', 'Could not copy. Select the text and copy it yourself.'],
			['An empty list says when it will fill.', 'No enrollment requests yet. They appear here when a new device asks to join.'],
			['A setting says when a change takes effect.', 'Applies right away to the next email.'],
			['A limit says what people can still do.', 'You can view this page but not change it.']
		],
		rewritesTitle: 'Before and after',
		rewritesLead: 'The same message, written the NeoDesk way.',
		before: 'Before',
		after: 'After',
		rewrites: [
			['On the website', 'Experience seamless, enterprise-grade remote access with our cutting-edge platform!', 'A RustDesk-compatible server written in Go, with a web console for the devices you look after.'],
			['An error', 'Oops! Something went wrong. Please try again later.', 'Could not reach desk.example.com on port 21116.'],
			['A release note', 'We\'re thrilled to announce that the console moved to a brand-new port!', 'The console\'s default port is now 3375.'],
			['A settings hint', 'This section allows you to configure various email-related options.', 'Applies right away to the next email.']
		],
		formatTitle: 'Formatting',
		format: [
			'Bold only for the one or two things that must not be missed.',
			'Monospace only for what people copy or type: commands, IDs, addresses, keys.',
			'Lists only for things that are a list: steps, options, parameters. Each item is a sentence or a clear phrase, not a row of loose nouns.',
			'No emojis. Few em dashes; a comma, colon or full stop usually does it.',
			'Headings in sentence case, without "Overview" or "Conclusion".'
		],
		describeTitle: 'Describing NeoDesk',
		describeLead: 'For a listing, an article or an introduction, use one of these as they are, or take the facts from them.',
		shortLabel: 'One sentence',
		short: 'NeoDesk is a self-hosted, RustDesk-compatible server written in Go, with a web console for the devices you look after.',
		longLabel: 'A paragraph',
		long: 'NeoDesk is a remote desktop server you run yourself. It works with RustDesk clients, and one Go binary does the work of hbbs and hbbr. A web console shows the devices you look after and the people who use them. Your data stays on your server, and NeoDesk is open source under the AGPL-3.0.',
		nameTitle: 'The name',
		name: [
			'Write <b>NeoDesk</b>: one word, capital N and capital D. Not Neo Desk, not Neodesk, not NEODESK.',
			'The command is <code>neodesk</code>, in lower case, as people type it.',
			'The lower-case <span class="mono">neodesk</span> of the wordmark belongs to the logo only. In text, write NeoDesk.',
			'The website is neode.sk, in lower case. The GitHub organization is neodeskapp.'
		],
		rustdeskTitle: 'NeoDesk and RustDesk',
		rustdesk: [
			'RustDesk is made by Purslane Tech Pte. Ltd. NeoDesk is not affiliated with or endorsed by RustDesk or Purslane Tech. NeoDesk is an independent project that implements the RustDesk protocol for client compatibility, and its use of the name RustDesk is descriptive.',
			'Use the name RustDesk only to say what NeoDesk works with: the RustDesk client, the RustDesk protocol.'
		],
		rustdeskDo: 'NeoDesk works with RustDesk clients. It is a RustDesk-compatible server.',
		rustdeskDont: 'NeoDesk, the official RustDesk server.',
		germanTitle: 'In German',
		german: [
			'The website and the docs say <i>du</i>. The console says <i>Sie</i>.',
			'The same rules apply: sentence case, short sentences, no exclamation marks. Keep the product\'s terms as the German console shows them.'
		]
	},
	de: {
		title: 'Ton und Sprache',
		pageTitle: 'NeoDesk: Ton und Sprache',
		description: 'Wie NeoDesk schreibt: einfache Wörter, Fakten, die heute stimmen, Wörter, die rausfliegen, Text in der Konsole und wie man NeoDesk und RustDesk nennt.',
		lead: 'NeoDesk schreibt schlicht und sagt, was heute stimmt. Es klingt wie jemand aus dem Team, der den Server neben dir betreibt: genau, ruhig, und fertig, wenn der Punkt gemacht ist.',
		readersTitle: 'Wer es liest',
		readers: [
			'Die meisten Leser betreiben ihren eigenen Server, oft allein, und kommen mit einer Aufgabe in die Doku oder die Konsole. Sie wollen den nächsten Schritt, keine Werbung.',
			'Manche sitzen an einem Computer, bei dem ihnen jemand hilft. Sie sehen ein Fenster des Desktop-Clients und müssen wissen, was es bedeutet und ob sie zustimmen sollen.'
		],
		principlesTitle: 'Grundsätze',
		principles: [
			{ rule: 'Fang mit dem Wichtigsten an.', do: 'NeoDesk ist ein Remote-Desktop-Server, den du selbst betreibst.', dont: 'In der heutigen Zeit ist Fernzugriff wichtiger denn je.' },
			{ rule: 'Einfache Wörter, kurze Sätze, aktiv.', do: 'Jeder Client verbindet sich nicht mehr, bis er den neuen Schlüssel hat.', dont: 'Nach erfolgter Neugenerierung des Schlüssels erfolgt eine Unterbrechung der Client-Konnektivität bis zur Neuverteilung.' },
			{ rule: 'Fakten statt Werbung. Keine Ausrufezeichen.', do: 'Ein Go-Binary erledigt die Arbeit von hbbs und hbbr.', dont: 'Der schnellste und stärkste Server aller Zeiten!' },
			{ rule: 'Sag, was heute funktioniert. Keine Versprechen, keine Roadmap im Produkttext.', do: 'NeoDesk funktioniert mit RustDesk-Clients.', dont: 'Bald ersetzt NeoDesk jedes Fernwartungstool, das du nutzt.' },
			{ rule: 'Nimm die Wörter vom Bildschirm. Nenne eine Schaltfläche oder Einstellung so, wie die Konsole sie zeigt.', do: 'Öffne Einstellungen, dann Anmeldung.', dont: 'Begib dich in den Konfigurationsbereich für die Authentifizierung.' },
			{ rule: 'Zahlen als Ziffern, neben dem, was sie zählen.', do: '4 Benutzer, 2 ausstehend', dont: 'Insgesamt vier (4) Benutzer, von denen zwei noch auf Freigabe warten' },
			{ rule: 'Satzanfang groß, sonst wie im Satz: Überschriften, Schaltflächen, Beschriftungen.', do: 'Computer hinzufügen', dont: 'Computer Hinzufügen' },
			{ rule: 'Schreib einen Satz, statt Eigenschaften mit Punkten aneinanderzureihen.', do: 'NeoDesk läuft auf deinem Server, funktioniert mit RustDesk-Clients und ist Open Source unter der AGPL-3.0.', dont: 'Ein Slogan aus drei Eigenschaften mit Mittelpunkten dazwischen.' }
		],
		wordsTitle: 'Wörter, die rausfliegen',
		wordsLead: 'Diese Wörter lassen einen Satz größer klingen und sagen weniger. Probe: Streich das Wort. Sagt der Satz noch dasselbe, bleibt es gestrichen.',
		wordsHead: ['Statt', 'Schreib'],
		words: [
			['nahtlos', 'Was passiert: "der Client verbindet sich von selbst neu"'],
			['leistungsstark, robust', 'Was es aushält, oder die Zahl'],
			['umfassend', 'Nichts, oder "vollständig", wenn es stimmt'],
			['hochmodern, innovativ, der nächsten Generation', 'Nichts'],
			['ermöglichen', 'lässt, kann'],
			['auf ein neues Level heben', 'Was besser wird'],
			['Es ist erwähnenswert, dass', 'Nichts; sag die Sache'],
			['einfach, nur, ganz leicht', 'Nichts; für den, der feststeckt, ist es nicht leicht'],
			['Englische Werbewörter wie Game-Changer', 'Nichts']
		],
		uiTitle: 'Text in der Konsole',
		uiLead: 'Der Text der Konsole ist kurz und sagt, was passiert ist und was man tun kann. Die Beispiele sind Texte aus der Konsole selbst.',
		uiHead: ['Regel', 'Beispiel'],
		ui: [
			['Eine Schaltfläche nennt die Aktion und die Sache.', 'Anmeldeeinstellungen speichern'],
			['Eine Bestätigung fragt nach genau der Sache, und ihre Schaltfläche wiederholt das Verb.', 'Aus dieser Sicherung wiederherstellen?'],
			['Ein Fehler sagt, was fehlschlug, und warum, wenn es bekannt ist.', '{host} ist auf Port {port} nicht erreichbar.'],
			['Wenn man es selbst beheben kann, sagt der Fehler wie.', 'Kopieren nicht möglich. Bitte markieren Sie den Text und kopieren Sie ihn selbst.'],
			['Eine leere Liste sagt, wann sie sich füllt.', 'Noch keine Anmeldeanfragen. Sie erscheinen hier, wenn sich ein neues Gerät anmelden möchte.'],
			['Eine Einstellung sagt, wann eine Änderung wirkt.', 'Gilt sofort für die nächste E-Mail.'],
			['Eine Grenze sagt, was man noch tun kann.', 'Sie können diese Seite ansehen, aber nicht ändern.']
		],
		rewritesTitle: 'Vorher und nachher',
		rewritesLead: 'Dieselbe Nachricht, so geschrieben, wie NeoDesk schreibt.',
		before: 'Vorher',
		after: 'Nachher',
		rewrites: [
			['Auf der Website', 'Erlebe nahtlosen Fernzugriff auf Enterprise-Niveau mit unserer hochmodernen Plattform!', 'Ein RustDesk-kompatibler Server in Go, mit einer Web-Konsole für die Geräte, die du betreust.'],
			['Ein Fehler', 'Hoppla! Da ist etwas schiefgelaufen. Bitte versuchen Sie es später erneut.', 'desk.example.com ist auf Port 21116 nicht erreichbar.'],
			['Eine Release-Notiz', 'Wir freuen uns riesig: Die Konsole ist auf einen brandneuen Port umgezogen!', 'Der Standardport der Konsole ist jetzt 3375.'],
			['Ein Hinweis in den Einstellungen', 'In diesem Bereich können Sie verschiedene E-Mail-bezogene Optionen konfigurieren.', 'Gilt sofort für die nächste E-Mail.']
		],
		formatTitle: 'Formatierung',
		format: [
			'Fett nur für das eine oder die zwei Dinge, die man nicht übersehen darf.',
			'Monospace nur für das, was man kopiert oder tippt: Befehle, IDs, Adressen, Schlüssel.',
			'Listen nur für das, was eine Liste ist: Schritte, Optionen, Parameter. Jeder Eintrag ist ein Satz oder eine klare Wendung, keine Reihe loser Substantive.',
			'Keine Emojis. Wenige Gedankenstriche; ein Komma, ein Doppelpunkt oder ein Punkt reicht meist.',
			'Überschriften mit normaler Satzschreibung, ohne "Überblick" oder "Fazit".'
		],
		describeTitle: 'NeoDesk beschreiben',
		describeLead: 'Für einen Eintrag, einen Artikel oder eine Vorstellung nimm einen dieser Texte so, wie er ist, oder die Fakten daraus.',
		shortLabel: 'Ein Satz',
		short: 'NeoDesk ist ein selbst gehosteter, RustDesk-kompatibler Server in Go, mit einer Web-Konsole für die Geräte, die du betreust.',
		longLabel: 'Ein Absatz',
		long: 'NeoDesk ist ein Remote-Desktop-Server, den du selbst betreibst. Er funktioniert mit RustDesk-Clients, und ein Go-Binary erledigt die Arbeit von hbbs und hbbr. Eine Web-Konsole zeigt die Geräte, die du betreust, und die Leute, die sie nutzen. Deine Daten bleiben auf deinem Server, und NeoDesk ist Open Source unter der AGPL-3.0.',
		nameTitle: 'Der Name',
		name: [
			'Schreib <b>NeoDesk</b>: ein Wort, großes N und großes D. Nicht Neo Desk, nicht Neodesk, nicht NEODESK.',
			'Der Befehl heißt <code>neodesk</code>, klein geschrieben, so wie man ihn tippt.',
			'Das kleine <span class="mono">neodesk</span> der Wortmarke gehört nur zum Logo. Im Text schreibst du NeoDesk.',
			'Die Website ist neode.sk, klein geschrieben. Die GitHub-Organisation heißt neodeskapp.'
		],
		rustdeskTitle: 'NeoDesk und RustDesk',
		rustdesk: [
			'RustDesk stammt von der Purslane Tech Pte. Ltd. NeoDesk ist weder mit RustDesk noch mit Purslane Tech verbunden und wird von ihnen nicht unterstützt. NeoDesk ist ein unabhängiges Projekt, das das RustDesk-Protokoll für die Kompatibilität mit den Clients umsetzt, und nennt RustDesk nur beschreibend.',
			'Nenne RustDesk nur, um zu sagen, womit NeoDesk funktioniert: dem RustDesk-Client, dem RustDesk-Protokoll.'
		],
		rustdeskDo: 'NeoDesk funktioniert mit RustDesk-Clients. Es ist ein RustDesk-kompatibler Server.',
		rustdeskDont: 'NeoDesk, der offizielle RustDesk-Server.',
		germanTitle: 'Auf Deutsch',
		german: [
			'Die Website und die Doku sagen <i>du</i>. Die Konsole sagt <i>Sie</i>.',
			'Es gelten dieselben Regeln: normale Satzschreibung, kurze Sätze, keine Ausrufezeichen. Übernimm die Begriffe des Produkts so, wie die deutsche Konsole sie zeigt.'
		]
	}
};

// Words and marks a good example must not contain; the same list in both languages
const BANNED = /\b(seamless\w*|powerful|robust|comprehensive|cutting-edge|innovative|leverage|utili[sz]e|empower|unlock|nahtlos\w*|leistungsstark\w*|umfassend\w*|hochmodern\w*|innovativ\w*)\b|!|\s·\s/i;

/** Good examples that break the page's own rules: a banned word, an exclamation mark, a middle-dot list. */
export function voiceProblems() {
	const problems: string[] = [];
	for (const [code, v] of Object.entries(S)) {
		const good = [...v.principles.map((p) => p.do), ...v.rewrites.map((r) => r[2]), v.short, v.long, v.rustdeskDo];
		for (const text of good) {
			const hit = text.match(BANNED);
			if (hit) problems.push(`src/brand-voice.ts (${code}): the good example "${text}" contains "${hit[0]}", which the page says to leave out`);
		}
		if (v.principles.length < 1 || v.words.length < 1) problems.push(`src/brand-voice.ts (${code}): no principles or words`);
	}
	return problems;
}

export function voicePage(code: string, prefix: string) {
	const v = S[code] ?? S.en;
	return {
		slug: 'voice' as const,
		path: brandPath('voice'),
		title: v.title,
		pageTitle: v.pageTitle,
		description: v.description,
		main: `${brandNav(code, prefix, 'voice')}
    <h1 class="display">${v.title}</h1>
    <p class="lead">${v.lead}</p>

    <h2 id="who-reads-it">${v.readersTitle}</h2>
${v.readers.map((p) => `    <p>${p}</p>`).join('\n')}

    <h2 id="principles">${v.principlesTitle}</h2>
${doDont(code, v.principles)}

    <h2 id="words-to-leave-out">${v.wordsTitle}</h2>
    <p>${v.wordsLead}</p>
${table(v.wordsHead, v.words.map(([a, b]) => [`<s>${esc(a)}</s>`, esc(b)]), 'voice-words')}

    <h2 id="text-in-the-console">${v.uiTitle}</h2>
    <p>${v.uiLead}</p>
${table(v.uiHead, v.ui.map(([rule, ex]) => [rule, `<q>${esc(ex)}</q>`]), 'voice-ui')}

    <h2 id="before-and-after">${v.rewritesTitle}</h2>
    <p>${v.rewritesLead}</p>
    <ul class="rows brand-voice voice-rewrites">
${v.rewrites.map(([where, before, after]) => `      <li><b>${where}</b><p><span class="no">${v.before}:</span> ${esc(before)}</p><p><span class="ok">${v.after}:</span> ${esc(after)}</p></li>`).join('\n')}
    </ul>

    <h2 id="formatting">${v.formatTitle}</h2>
    <ul>
${v.format.map((x) => `      <li>${x}</li>`).join('\n')}
    </ul>

    <h2 id="describing-neodesk">${v.describeTitle}</h2>
    <p>${v.describeLead}</p>
    <h3>${v.shortLabel}</h3>
    <blockquote class="voice-quote"><p>${esc(v.short)}</p></blockquote>
    <h3>${v.longLabel}</h3>
    <blockquote class="voice-quote"><p>${esc(v.long)}</p></blockquote>

    <h2 id="the-name">${v.nameTitle}</h2>
${v.name.map((p) => `    <p>${p}</p>`).join('\n')}

    <h2 id="neodesk-and-rustdesk">${v.rustdeskTitle}</h2>
${v.rustdesk.map((p) => `    <p>${esc(p)}</p>`).join('\n')}
${doDont(code, [{ rule: '', do: v.rustdeskDo, dont: v.rustdeskDont }]).replace('<b></b>', '')}

    <h2 id="in-german">${v.germanTitle}</h2>
${v.german.map((p) => `    <p>${p}</p>`).join('\n')}`
	};
}
