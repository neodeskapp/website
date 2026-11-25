// The guide's page on the console's interface, /brand/elements/. Each element is
// drawn with the console's own tokens and rules (web-ui/src/lib/styles/tokens.css and
// the components in web-ui/src/lib/ui), in the dark and the light theme. The styles
// are in brand.css under "Interface elements", scoped to .ds so they don't reach the
// rest of the site. The example strings come from the console's design guide.

import { esc, brandNav, brandPath, pair, table } from './brand-shared.ts';

const icon = (d: string, label = '') => `<svg class="ds-icon" viewBox="0 0 24 24" width="20" height="20"${label ? ` role="img" aria-label="${esc(label)}"` : ' aria-hidden="true"'}><path d="${d}"/></svg>`;
const I = {
	chevron: 'M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z',
	more: 'M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z',
	close: 'M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
	copy: 'M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z',
	search: 'M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z'
};

interface ElementStrings {
	title: string;
	pageTitle: string;
	description: string;
	lead: string;
	principlesTitle: string;
	principles: string[];
	shapeTitle: string;
	shapeLead: string;
	head: { token: string; value: string; use: string };
	shape: [string, string, string][];
	buttons: {
		title: string;
		lead: string;
		primary: string;
		plain: string;
		cancel: string;
		small: [string, string];
		link: string;
		dangerQuiet: string;
		disabled: string;
		focus: string;
		rules: string[];
	};
	fields: {
		title: string;
		lead: string;
		label: string;
		hint: string;
		effect: string;
		hostLabel: string;
		hostValue: string;
		hostError: string;
		check: string;
		checkHint: string;
		choiceLabel: string;
		choices: [string, string][];
		search: string;
		rules: string[];
	};
	filters: {
		title: string;
		lead: string;
		segments: string[];
		segmentsLabel: string;
		tabs: string[];
		rules: string[];
	};
	status: {
		title: string;
		lead: string;
		words: string[];
		tags: string[];
		tagSet: string[];
		rules: string[];
	};
	values: {
		title: string;
		lead: string;
		facts: { version: string; id: string; address: string; lastSeen: string; owner: string; user: string };
		ago: string;
		agoTitle: string;
		copy: string;
		none: string;
		rules: string[];
	};
	tables: {
		title: string;
		lead: string;
		head: [string, string, string, string];
		actions: string;
		approve: string;
		rows: [string, string, string, string, string][];
		count: string;
		menuFor: string;
		listTitle: string;
		list: [string, string][];
		rules: string[];
	};
	notices: {
		title: string;
		lead: string;
		warning: string;
		loading: string;
		error: string;
		retry: string;
		empty: string;
		rules: string[];
	};
	code: {
		title: string;
		lead: string;
		file: string;
		copy: string;
		meter: string;
		rules: string[];
	};
	floating: {
		title: string;
		lead: string;
		dialogTitle: string;
		dialogText: string;
		cancel: string;
		confirm: string;
		close: string;
		menu: [string, string, string];
		whenTitle: string;
		whenHead: [string, string];
		when: [string, string][];
		rules: string[];
	};
}

const S: Record<string, ElementStrings> = {
	en: {
		title: 'Interface elements',
		pageTitle: 'NeoDesk interface elements: the console\'s controls',
		description: 'How the NeoDesk console\'s buttons, fields, tables, status words, notices, menus and dialogs look in dark and light, with the sizes and rules behind them.',
		lead: 'The console is built from a small set of plain elements: text on the page, rules between rows, and controls with 4 px corners. Every element below is drawn with the console\'s tokens, in the dark and the light theme.',
		principlesTitle: 'Principles',
		principles: [
			'No cards and no cards in cards. Tables, row lists and plain text sit on the page; a box needs a reason, such as a dialog, a menu or a code block.',
			'One primary button per view. Everything else is a plain button, a link, or an entry in a menu.',
			'One left edge per page. Everything starts at the same line.',
			'No pills, badges or counters in bubbles. A status is a word with a small mark.',
			'Sentence case everywhere, no upper-case or letter-spaced labels.',
			'No icon before headings, tabs or ordinary buttons. Icons only where they help scanning: the operating system, the row menu, close, and the chevron on rows that open something.',
			'No gradients, blur, glow, shadows on flat things or load animations. Motion only for a change of state, at most 150 ms.',
			'Every action says that it worked, or why it failed, near where people acted.'
		],
		shapeTitle: 'Spacing, size and shape',
		shapeLead: 'Space comes in 4 px steps. Controls share one height, so a button, a field and a filter line up in a toolbar.',
		head: { token: 'Token', value: 'Value', use: 'Use' },
		shape: [
			['--space-1 to --space-7', '4, 8, 12, 16, 24, 32, 48 px', 'All spacing'],
			['--radius', '4 px', 'Buttons, fields, dialogs, menus, screenshots'],
			['--radius-sm', '3 px', 'Tags'],
			['--control-h', '36 px, 44 px on touch', 'Buttons, fields, selects, filters'],
			['--control-h-sm', '30 px, 44 px on touch', 'Small buttons in table rows and pagination'],
			['--row-h', '44 px, 48 px on touch', 'Rows of lists, tables, menus and the navigation'],
			['--focus-ring', '2 px in the accent, 2 px outside', 'Every element people can reach with the keyboard'],
			['--motion', '120 ms, none with reduced motion', 'Hover and state changes'],
			['--measure', '640 px', 'The width of running text and settings forms']
		],
		buttons: {
			title: 'Buttons',
			lead: 'A plain button has an outline and the page\'s background. The primary button takes the accent. Its label says what happens.',
			primary: 'Save sign-in settings',
			plain: 'Export',
			cancel: 'Cancel',
			small: ['Approve', 'Rename'],
			link: 'Show all requests',
			dangerQuiet: 'Regenerate key…',
			disabled: 'Export',
			focus: 'Export',
			rules: [
				'The label is a verb and names the thing: Save sign-in settings, not Submit or OK.',
				'A label ends with an ellipsis when the button opens a dialog that asks for more.',
				'Destructive actions on a page are quiet: red text, plain button. The solid red button is only the answer in a confirmation dialog.',
				'Small buttons are for dense rows only.'
			]
		},
		fields: {
			title: 'Fields',
			lead: 'One column of fields. The label sits above the field, a hint under it, and under that what happens after a change.',
			label: 'Session timeout',
			hint: 'Minutes without activity before someone is signed out.',
			effect: 'Applies to new sessions.',
			hostLabel: 'Server address',
			hostValue: 'desk.example',
			hostError: 'Enter the full host name, such as desk.example.com.',
			check: 'Require two-factor sign-in',
			checkHint: 'Everyone has to set up an authenticator app at next sign-in.',
			choiceLabel: 'Enrollment mode',
			choices: [
				['Open', 'Any device can join without approval.'],
				['Approval', 'New devices wait until someone approves them.']
			],
			search: 'Search requests',
			rules: [
				'Every field has a visible label. Hints go under the field, never into the placeholder.',
				'The field\'s width fits what goes in: short for ports and numbers, medium for names, wide for host names.',
				'An error says what to enter, in the danger colour, under the field.',
				'One save button per form, at its end. It says when there are unsaved changes.'
			]
		},
		filters: {
			title: 'Filters and tabs',
			lead: 'A segmented filter narrows a list. Tabs switch between two to five views of one thing.',
			segments: ['All', 'Pending', 'Approved'],
			segmentsLabel: 'Status',
			tabs: ['Overview', 'Sessions', 'Settings'],
			rules: [
				'The selected segment has the accent outline and a light tint of it, not a solid fill.',
				'The selected tab is underlined in the accent. Tabs carry no icons and no counts.',
				'When the views are separate tasks, such as settings, they become pages with their own address instead of tabs.'
			]
		},
		status: {
			title: 'Status and tags',
			lead: 'A status is a word with a small mark in its tone. A tag is a value from a set, in one quiet style.',
			words: ['Online', 'Waiting', 'Offline', 'No signal', 'Failed'],
			tags: ['Local network', 'RustDesk', 'Operator'],
			tagSet: ['office', 'finance'],
			rules: [
				'Each tone has its own mark, so the status reads without colour too.',
				'Tags are never coloured and never pills. They are for categories, sources, roles and the tags people set, not for sentences, numbers or actions.'
			]
		},
		values: {
			title: 'Values',
			lead: 'Every kind of value has one form, on every page.',
			facts: { version: 'Version', id: 'ID', address: 'Address', lastSeen: 'Last seen', owner: 'Owner', user: 'Signed in as' },
			ago: '3 h ago',
			agoTitle: '25 Nov 2026, 14:05',
			copy: 'Copy 900100001',
			none: 'None',
			rules: [
				'IDs, addresses and keys are in Plex Mono and can be copied. Names and words are not.',
				'A version has no "v" in front: 1.4.2.',
				'Times are relative, with the exact date on hover. Where the date matters more than how recent it is, such as an expiry, show the date.',
				'A missing value is a dash, read out as "None", and never in mono.',
				'Initials sit in a square with the 4 px corners, never in a circle.'
			]
		},
		tables: {
			title: 'Tables and row lists',
			lead: 'Tables for things people compare, row lists for things people open or act on. Rules separate the rows; there are no boxes around them.',
			head: ['Device', 'Status', 'Asked', 'Actions'],
			actions: 'Actions',
			approve: 'Approve',
			rows: [
				['900100001', 'demo-reception-01', 'waiting', 'Waiting', '12 min ago'],
				['900100002', 'demo-office-02', 'good', 'Approved', '2 h ago'],
				['900100003', 'demo-lab-03', 'neutral', 'Rejected', '1 d ago']
			],
			count: '<strong>1</strong> pending, 2 decided',
			menuFor: 'Actions for',
			listTitle: 'Settings',
			list: [
				['Sign-in', 'How people sign in to this console.'],
				['Backup', 'Create a backup or restore from one.']
			],
			rules: [
				'Numbers in a sentence go next to what they count: 1 pending, 2 decided. No big number tiles.',
				'Numbers in a table are aligned to the end of the cell.',
				'Rarely used row actions go into the row menu. The one common action can sit in the row as a small button.',
				'Rows that open something end in a chevron.'
			]
		},
		notices: {
			title: 'Notices and states',
			lead: 'A notice is one message that has to stand out. Every list has a loading, an empty and an error state, each one sentence.',
			warning: 'Restoring secrets replaces the server key. Every client must be set up again.',
			loading: 'Loading requests…',
			error: 'Could not load requests.',
			retry: 'Try again',
			empty: 'No help requests. They appear here when someone asks for help from the desktop app.',
			rules: [
				'A notice is not decoration. If nothing would go wrong without reading it, it is a hint, not a notice.',
				'An error state offers to try again.',
				'An empty state says when the list will fill.'
			]
		},
		code: {
			title: 'Code and meters',
			lead: 'Commands sit in a code block with a copy button. A meter shows a share of a limit, with the number next to it.',
			file: 'Linux',
			copy: 'Copy',
			meter: 'Disk',
			rules: ['A code block holds only what people run or paste. Explanations go in the text around it.']
		},
		floating: {
			title: 'Menus, dialogs and sheets',
			lead: 'Only things that float above the page get a shadow: menus, dialogs and side sheets.',
			dialogTitle: 'Regenerate the server key?',
			dialogText: 'Every client stops connecting until it gets the new key.',
			cancel: 'Cancel',
			confirm: 'Regenerate',
			close: 'Close',
			menu: ['Rename', 'Move to group', 'Delete'],
			whenTitle: 'Dialog or sheet',
			whenHead: ['Use', 'When'],
			when: [
				['Side sheet', 'Creating or editing something with more than about four fields, and details of one item. People fill it in while they see the list behind it.'],
				['Centred dialog', 'A confirmation, one question, or a short prompt of one to three fields. Anything that must block, such as a destructive confirmation.'],
				['The page itself', 'The main settings forms and any long configuration that is the reason to open the page.']
			],
			rules: [
				'A confirmation says what will happen, and its button repeats the action: Regenerate, not OK.',
				'Escape and a click on the dimmed page close it, and focus goes back to what opened it.',
				'In a sheet, Cancel sits on the start side and Save last on the end side.'
			]
		}
	},
	de: {
		title: 'Bedienelemente',
		pageTitle: 'NeoDesk-Bedienelemente: so sieht die Konsole aus',
		description: 'Wie Schaltflächen, Felder, Tabellen, Statuswörter, Hinweise, Menüs und Dialoge der NeoDesk-Konsole in dunkel und hell aussehen, mit Größen und Regeln.',
		lead: 'Die Konsole besteht aus wenigen schlichten Elementen: Text auf der Seite, Linien zwischen Zeilen und Bedienelemente mit 4 px Ecken. Jedes Element unten ist mit den Tokens der Konsole gezeichnet, im dunklen und im hellen Theme.',
		principlesTitle: 'Grundsätze',
		principles: [
			'Keine Karten und keine Karten in Karten. Tabellen, Zeilenlisten und einfacher Text stehen auf der Seite; ein Kasten braucht einen Grund, etwa einen Dialog, ein Menü oder einen Codeblock.',
			'Eine Hauptschaltfläche pro Ansicht. Alles andere ist eine einfache Schaltfläche, ein Link oder ein Eintrag in einem Menü.',
			'Eine linke Kante pro Seite. Alles beginnt an derselben Linie.',
			'Keine Pillen, Badges oder Zahlen in Blasen. Ein Status ist ein Wort mit einer kleinen Marke.',
			'Normale Satzschreibung überall, keine Beschriftungen in Großbuchstaben oder gesperrt.',
			'Kein Symbol vor Überschriften, Tabs oder normalen Schaltflächen. Symbole nur, wo sie beim Überfliegen helfen: das Betriebssystem, das Zeilenmenü, Schließen und der Pfeil an Zeilen, die etwas öffnen.',
			'Keine Verläufe, Unschärfe, Leuchten, Schatten auf flachen Dingen oder Ladeanimationen. Bewegung nur bei einem Zustandswechsel, höchstens 150 ms.',
			'Jede Aktion sagt, dass sie geklappt hat oder warum nicht, nah an der Stelle, wo man gehandelt hat.'
		],
		shapeTitle: 'Abstände, Größe und Form',
		shapeLead: 'Abstände kommen in 4-px-Schritten. Bedienelemente teilen eine Höhe, damit Schaltfläche, Feld und Filter in einer Werkzeugleiste auf einer Linie stehen.',
		head: { token: 'Token', value: 'Wert', use: 'Wofür' },
		shape: [
			['--space-1 bis --space-7', '4, 8, 12, 16, 24, 32, 48 px', 'Alle Abstände'],
			['--radius', '4 px', 'Schaltflächen, Felder, Dialoge, Menüs, Screenshots'],
			['--radius-sm', '3 px', 'Tags'],
			['--control-h', '36 px, 44 px bei Touch', 'Schaltflächen, Felder, Auswahlen, Filter'],
			['--control-h-sm', '30 px, 44 px bei Touch', 'Kleine Schaltflächen in Tabellenzeilen und Seitenwechsel'],
			['--row-h', '44 px, 48 px bei Touch', 'Zeilen von Listen, Tabellen, Menüs und der Navigation'],
			['--focus-ring', '2 px im Akzent, 2 px außen', 'Alles, was man mit der Tastatur erreicht'],
			['--motion', '120 ms, keine bei reduzierter Bewegung', 'Hover und Zustandswechsel'],
			['--measure', '640 px', 'Die Breite von Fließtext und Einstellungsformularen']
		],
		buttons: {
			title: 'Schaltflächen',
			lead: 'Eine einfache Schaltfläche hat eine Kontur und den Hintergrund der Seite. Die Hauptschaltfläche trägt den Akzent. Ihre Beschriftung sagt, was passiert.',
			primary: 'Anmeldeeinstellungen speichern',
			plain: 'Exportieren',
			cancel: 'Abbrechen',
			small: ['Genehmigen', 'Umbenennen'],
			link: 'Alle Anfragen zeigen',
			dangerQuiet: 'Schlüssel neu erzeugen…',
			disabled: 'Exportieren',
			focus: 'Exportieren',
			rules: [
				'Die Beschriftung ist ein Verb und nennt die Sache: Anmeldeeinstellungen speichern, nicht Absenden oder OK.',
				'Eine Beschriftung endet mit Auslassungspunkten, wenn die Schaltfläche einen Dialog öffnet, der nach mehr fragt.',
				'Zerstörende Aktionen auf einer Seite sind leise: roter Text, einfache Schaltfläche. Die volle rote Schaltfläche ist nur die Antwort in einem Bestätigungsdialog.',
				'Kleine Schaltflächen nur in dichten Zeilen.'
			]
		},
		fields: {
			title: 'Felder',
			lead: 'Eine Spalte von Feldern. Die Beschriftung steht über dem Feld, ein Hinweis darunter und darunter, was nach einer Änderung passiert.',
			label: 'Sitzungsdauer',
			hint: 'Minuten ohne Aktivität, bevor jemand abgemeldet wird.',
			effect: 'Gilt für neue Sitzungen.',
			hostLabel: 'Serveradresse',
			hostValue: 'desk.example',
			hostError: 'Gib den vollen Hostnamen ein, etwa desk.example.com.',
			check: 'Zwei-Faktor-Anmeldung verlangen',
			checkHint: 'Alle müssen bei der nächsten Anmeldung eine Authenticator-App einrichten.',
			choiceLabel: 'Aufnahmemodus',
			choices: [
				['Offen', 'Jedes Gerät kann ohne Freigabe beitreten.'],
				['Freigabe', 'Neue Geräte warten, bis jemand sie freigibt.']
			],
			search: 'Anfragen durchsuchen',
			rules: [
				'Jedes Feld hat eine sichtbare Beschriftung. Hinweise stehen unter dem Feld, nie im Platzhalter.',
				'Die Breite passt zum Inhalt: kurz für Ports und Zahlen, mittel für Namen, breit für Hostnamen.',
				'Ein Fehler sagt, was einzugeben ist, in der Gefahrenfarbe, unter dem Feld.',
				'Eine Speichern-Schaltfläche pro Formular, an seinem Ende. Sie sagt, wenn es ungespeicherte Änderungen gibt.'
			]
		},
		filters: {
			title: 'Filter und Tabs',
			lead: 'Ein Segmentfilter grenzt eine Liste ein. Tabs wechseln zwischen zwei bis fünf Ansichten einer Sache.',
			segments: ['Alle', 'Ausstehend', 'Genehmigt'],
			segmentsLabel: 'Status',
			tabs: ['Übersicht', 'Sitzungen', 'Einstellungen'],
			rules: [
				'Das gewählte Segment hat die Akzentkontur und einen hellen Hauch davon, keine volle Füllung.',
				'Der gewählte Tab ist im Akzent unterstrichen. Tabs tragen keine Symbole und keine Zahlen.',
				'Sind die Ansichten getrennte Aufgaben, etwa Einstellungen, werden sie Seiten mit eigener Adresse statt Tabs.'
			]
		},
		status: {
			title: 'Status und Tags',
			lead: 'Ein Status ist ein Wort mit einer kleinen Marke in seinem Ton. Ein Tag ist ein Wert aus einer Menge, in einem ruhigen Stil.',
			words: ['Online', 'Wartet', 'Offline', 'Kein Signal', 'Fehlgeschlagen'],
			tags: ['Lokales Netz', 'RustDesk', 'Operator'],
			tagSet: ['büro', 'buchhaltung'],
			rules: [
				'Jeder Ton hat seine eigene Marke, damit der Status auch ohne Farbe lesbar ist.',
				'Tags sind nie farbig und nie Pillen. Sie sind für Kategorien, Quellen, Rollen und die Tags, die Leute setzen, nicht für Sätze, Zahlen oder Aktionen.'
			]
		},
		values: {
			title: 'Werte',
			lead: 'Jede Art von Wert hat eine Form, auf jeder Seite.',
			facts: { version: 'Version', id: 'ID', address: 'Adresse', lastSeen: 'Zuletzt gesehen', owner: 'Besitzer', user: 'Angemeldet als' },
			ago: 'vor 3 Std.',
			agoTitle: '25.11.2026, 14:05',
			copy: '900100001 kopieren',
			none: 'Keiner',
			rules: [
				'IDs, Adressen und Schlüssel stehen in Plex Mono und lassen sich kopieren. Namen und Wörter nicht.',
				'Eine Version hat kein "v" davor: 1.4.2.',
				'Zeiten sind relativ, mit dem genauen Datum beim Überfahren. Wo das Datum wichtiger ist als die Nähe, etwa beim Ablauf, steht das Datum.',
				'Ein fehlender Wert ist ein Strich, vorgelesen als "Keiner", und nie in Mono.',
				'Initialen stehen in einem Quadrat mit den 4-px-Ecken, nie in einem Kreis.'
			]
		},
		tables: {
			title: 'Tabellen und Zeilenlisten',
			lead: 'Tabellen für das, was man vergleicht, Zeilenlisten für das, was man öffnet oder bearbeitet. Linien trennen die Zeilen; Kästen gibt es keine.',
			head: ['Gerät', 'Status', 'Angefragt', 'Aktionen'],
			actions: 'Aktionen',
			approve: 'Genehmigen',
			rows: [
				['900100001', 'demo-reception-01', 'waiting', 'Wartet', 'vor 12 Min.'],
				['900100002', 'demo-office-02', 'good', 'Genehmigt', 'vor 2 Std.'],
				['900100003', 'demo-lab-03', 'neutral', 'Abgelehnt', 'vor 1 Tag']
			],
			count: '<strong>1</strong> ausstehend, 2 entschieden',
			menuFor: 'Aktionen für',
			listTitle: 'Einstellungen',
			list: [
				['Anmeldung', 'Wie man sich bei dieser Konsole anmeldet.'],
				['Sicherung', 'Eine Sicherung erstellen oder aus einer wiederherstellen.']
			],
			rules: [
				'Zahlen im Satz stehen neben dem, was sie zählen: 1 ausstehend, 2 entschieden. Keine großen Zahlenkacheln.',
				'Zahlen in einer Tabelle stehen am Ende der Zelle.',
				'Selten genutzte Zeilenaktionen kommen ins Zeilenmenü. Die eine häufige Aktion darf als kleine Schaltfläche in der Zeile stehen.',
				'Zeilen, die etwas öffnen, enden mit einem Pfeil.'
			]
		},
		notices: {
			title: 'Hinweise und Zustände',
			lead: 'Ein Hinweis ist eine Nachricht, die herausstechen muss. Jede Liste hat einen Lade-, einen Leer- und einen Fehlerzustand, jeder ein Satz.',
			warning: 'Das Wiederherstellen der Geheimnisse ersetzt den Serverschlüssel. Jeder Client muss neu eingerichtet werden.',
			loading: 'Anfragen werden geladen…',
			error: 'Anfragen konnten nicht geladen werden.',
			retry: 'Erneut versuchen',
			empty: 'Keine Hilfeanfragen. Sie erscheinen hier, wenn jemand in der Desktop-App um Hilfe bittet.',
			rules: [
				'Ein Hinweis ist keine Dekoration. Wenn ohne ihn nichts schiefgeht, ist er ein Hinweistext, kein Hinweis.',
				'Ein Fehlerzustand bietet an, es erneut zu versuchen.',
				'Ein Leerzustand sagt, wann sich die Liste füllt.'
			]
		},
		code: {
			title: 'Code und Anzeigen',
			lead: 'Befehle stehen in einem Codeblock mit Kopierschaltfläche. Eine Anzeige zeigt den Anteil an einer Grenze, mit der Zahl daneben.',
			file: 'Linux',
			copy: 'Kopieren',
			meter: 'Festplatte',
			rules: ['Ein Codeblock enthält nur, was man ausführt oder einfügt. Erklärungen stehen im Text drumherum.']
		},
		floating: {
			title: 'Menüs, Dialoge und Seitenleisten',
			lead: 'Nur was über der Seite schwebt, bekommt einen Schatten: Menüs, Dialoge und Seitenleisten.',
			dialogTitle: 'Serverschlüssel neu erzeugen?',
			dialogText: 'Jeder Client verbindet sich nicht mehr, bis er den neuen Schlüssel hat.',
			cancel: 'Abbrechen',
			confirm: 'Neu erzeugen',
			close: 'Schließen',
			menu: ['Umbenennen', 'In Gruppe verschieben', 'Löschen'],
			whenTitle: 'Dialog oder Seitenleiste',
			whenHead: ['Element', 'Wann'],
			when: [
				['Seitenleiste', 'Etwas mit mehr als etwa vier Feldern anlegen oder bearbeiten, und Details eines Eintrags. Man füllt sie aus und sieht dabei die Liste dahinter.'],
				['Dialog in der Mitte', 'Eine Bestätigung, eine Frage oder eine kurze Eingabe mit einem bis drei Feldern. Alles, was blockieren muss, etwa eine zerstörende Bestätigung.'],
				['Die Seite selbst', 'Die großen Einstellungsformulare und jede lange Konfiguration, für die man die Seite öffnet.']
			],
			rules: [
				'Eine Bestätigung sagt, was passiert, und ihre Schaltfläche wiederholt die Aktion: Neu erzeugen, nicht OK.',
				'Escape und ein Klick auf die abgedunkelte Seite schließen sie, und der Fokus geht zurück zu dem, was sie geöffnet hat.',
				'In einer Seitenleiste steht Abbrechen auf der Anfangsseite und Speichern zuletzt auf der Endseite.'
			]
		}
	}
};

const rules = (list: string[]) => `    <ul class="ds-rules">
${list.map((x) => `      <li>${x}</li>`).join('\n')}
    </ul>`;

export function elementsPage(code: string, prefix: string) {
	const e = S[code] ?? S.en;
	const b = e.buttons;
	const f = e.fields;
	const v = e.values;
	const t = e.tables;
	const n = e.notices;
	const c = e.code;
	const fl = e.floating;

	const buttons = pair(
		code,
		() => `<div class="ds-row"><button type="button" class="ds-btn ds-primary">${b.primary}</button><button type="button" class="ds-btn">${b.plain}</button><button type="button" class="ds-btn">${b.cancel}</button></div>
        <div class="ds-row"><button type="button" class="ds-btn ds-sm">${b.small[0]}</button><button type="button" class="ds-btn ds-sm">${b.small[1]}</button><a class="ds-link" href="#buttons">${b.link}</a></div>
        <div class="ds-row"><button type="button" class="ds-btn ds-danger-quiet">${b.dangerQuiet}</button><button type="button" class="ds-btn ds-danger">${fl.confirm}</button></div>
        <div class="ds-row"><button type="button" class="ds-btn" disabled>${b.disabled}</button><button type="button" class="ds-btn is-focus" tabindex="-1">${b.focus}</button></div>`
	);

	const fields = pair(
		code,
		(x) => `<div class="ds-field"><label class="ds-label" for="ds-timeout-${x}">${f.label}</label><input class="ds-input is-short" id="ds-timeout-${x}" type="text" inputmode="numeric" value="30" aria-describedby="ds-timeout-${x}-hint"><p class="ds-hint" id="ds-timeout-${x}-hint">${f.hint}</p><p class="ds-hint">${f.effect}</p></div>
        <div class="ds-field"><label class="ds-label" for="ds-host-${x}">${f.hostLabel}</label><input class="ds-input is-host" id="ds-host-${x}" type="text" value="${f.hostValue}" aria-invalid="true" aria-describedby="ds-host-${x}-error"><p class="ds-hint ds-error" id="ds-host-${x}-error">${f.hostError}</p></div>
        <label class="ds-check"><input type="checkbox" checked><span class="ds-check-label">${f.check}</span><span class="ds-hint">${f.checkHint}</span></label>
        <fieldset class="ds-choices"><legend class="ds-label">${f.choiceLabel}</legend>${f.choices.map(([title, desc], i) => `<label class="ds-check"><input type="radio" name="ds-mode-${x}"${i === 1 ? ' checked' : ''}><span class="ds-check-label">${title}</span><span class="ds-hint">${desc}</span></label>`).join('')}</fieldset>
        <div class="ds-search">${icon(I.search)}<input class="ds-input" type="search" aria-label="${f.search}" placeholder="${f.search}"></div>`
	);

	const filters = pair(
		code,
		() => `<div class="ds-segmented" role="group" aria-label="${e.filters.segmentsLabel}">${e.filters.segments.map((s, i) => `<button type="button" class="ds-segment" aria-pressed="${i === 1}">${s}</button>`).join('')}</div>
        <div class="ds-tabs">${e.filters.tabs.map((s, i) => `<span class="ds-tab${i === 0 ? ' is-selected' : ''}">${s}</span>`).join('')}</div>`
	);

	const tones = ['good', 'waiting', 'neutral', 'warning', 'danger'];
	const status = pair(
		code,
		() => `<ul class="ds-inline">${e.status.words.map((w, i) => `<li><span class="ds-status is-${tones[i]}">${w}</span></li>`).join('')}</ul>
        <ul class="ds-inline">${e.status.tags.map((w) => `<li><span class="ds-tag">${w}</span></li>`).join('')}</ul>
        <ul class="ds-inline ds-tag-set">${e.status.tagSet.map((w) => `<li><span class="ds-tag">${w}</span></li>`).join('')}</ul>`
	);

	const values = pair(
		code,
		() => `<dl class="ds-facts">
          <dt>${v.facts.version}</dt><dd>1.4.2</dd>
          <dt>${v.facts.id}</dt><dd><span class="ds-copy"><span class="ds-mono">900100001</span><button type="button" class="ds-icon-btn" aria-label="${v.copy}">${icon(I.copy)}</button></span></dd>
          <dt>${v.facts.address}</dt><dd><span class="ds-mono">10.0.9.14</span></dd>
          <dt>${v.facts.lastSeen}</dt><dd><time datetime="2026-11-25T14:05" title="${v.agoTitle}">${v.ago}</time></dd>
          <dt>${v.facts.owner}</dt><dd><span class="ds-empty" title="${v.none}">–</span></dd>
          <dt>${v.facts.user}</dt><dd><span class="ds-user"><span class="ds-avatar" aria-hidden="true">DA</span>Demo Admin</span></dd>
        </dl>`
	);

	const tableEx = pair(
		code,
		() => `<p class="ds-count">${t.count}</p>
        <div class="ds-table-wrap"><table class="ds-table">
          <thead><tr><th>${t.head[0]}</th><th>${t.head[1]}</th><th>${t.head[2]}</th><th class="ds-actions"><span class="ds-sr">${t.head[3]}</span></th></tr></thead>
          <tbody>${t.rows
				.map(
					([id, name, tone, word, when], i) =>
						`<tr><td><span class="ds-mono">${id}</span><span class="ds-sub">${name}</span></td><td><span class="ds-status is-${tone}">${word}</span></td><td>${when}</td><td class="ds-actions">${i === 0 ? `<button type="button" class="ds-btn ds-sm">${t.approve}</button>` : ''}<button type="button" class="ds-icon-btn" aria-label="${t.menuFor} ${name}">${icon(I.more)}</button></td></tr>`
				)
				.join('')}</tbody>
        </table></div>
        <p class="ds-list-title">${t.listTitle}</p>
        <ul class="ds-list">${t.list.map(([title, sub]) => `<li><a class="ds-list-row" href="#tables-and-row-lists"><span class="ds-row-main"><span class="ds-row-title">${title}</span><span class="ds-sub">${sub}</span></span>${icon(I.chevron)}</a></li>`).join('')}</ul>`
	);

	const notices = pair(
		code,
		() => `<p class="ds-notice is-warning">${n.warning}</p>
        <p class="ds-state">${n.loading}</p>
        <p class="ds-state is-error">${n.error} <button type="button" class="ds-btn ds-sm">${n.retry}</button></p>
        <p class="ds-state">${n.empty}</p>`
	);

	const codeEx = pair(
		code,
		() => `<div class="ds-code"><div class="ds-code-head"><span>${c.file}</span><button type="button" class="ds-btn ds-sm">${c.copy}</button></div><pre><code>curl -fsSL https://neode.sk/install.sh | sudo bash</code></pre></div>
        <div class="ds-meter"><span class="ds-meter-label">${c.meter}</span><span class="ds-meter-bar"><span style="width:62%"></span></span><span class="ds-meter-value">62 %</span></div>`
	);

	const floating = pair(
		code,
		() => `<div class="ds-float-row">
          <div class="ds-menu" role="presentation">${fl.menu.map((m, i) => `${i === 2 ? '<span class="ds-menu-divider"></span>' : ''}<span class="ds-menu-item${i === 2 ? ' is-danger' : ''}">${m}</span>`).join('')}</div>
          <div class="ds-dialog" role="presentation">
            <div class="ds-dialog-head"><p class="ds-dialog-title">${fl.dialogTitle}</p><span class="ds-icon-btn" aria-hidden="true">${icon(I.close)}</span></div>
            <p>${fl.dialogText}</p>
            <div class="ds-dialog-foot"><span class="ds-btn">${fl.cancel}</span><span class="ds-btn ds-danger">${fl.confirm}</span></div>
          </div>
        </div>`,
		'ds-pair-dim'
	);

	return {
		slug: 'elements' as const,
		path: brandPath('elements'),
		title: e.title,
		pageTitle: e.pageTitle,
		description: e.description,
		main: `${brandNav(code, prefix, 'elements')}
    <h1 class="display">${e.title}</h1>
    <p class="lead">${e.lead}</p>

    <h2 id="principles">${e.principlesTitle}</h2>
    <ul>
${e.principles.map((x) => `      <li>${x}</li>`).join('\n')}
    </ul>

    <h2 id="spacing-size-and-shape">${e.shapeTitle}</h2>
    <p>${e.shapeLead}</p>
    <div class="ds-scale" aria-hidden="true">${[4, 8, 12, 16, 24, 32, 48].map((px) => `<span><i style="width:${px}px;height:${px}px"></i>${px}</span>`).join('')}</div>
${table([e.head.token, e.head.value, e.head.use], e.shape.map(([tok, val, use]) => [`<code>${tok}</code>`, val, use]))}

    <h2 id="buttons">${b.title}</h2>
    <p>${b.lead}</p>
${buttons}
${rules(b.rules)}

    <h2 id="fields">${f.title}</h2>
    <p>${f.lead}</p>
${fields}
${rules(f.rules)}

    <h2 id="filters-and-tabs">${e.filters.title}</h2>
    <p>${e.filters.lead}</p>
${filters}
${rules(e.filters.rules)}

    <h2 id="status-and-tags">${e.status.title}</h2>
    <p>${e.status.lead}</p>
${status}
${rules(e.status.rules)}

    <h2 id="values">${v.title}</h2>
    <p>${v.lead}</p>
${values}
${rules(v.rules)}

    <h2 id="tables-and-row-lists">${t.title}</h2>
    <p>${t.lead}</p>
${tableEx}
${rules(t.rules)}

    <h2 id="notices-and-states">${n.title}</h2>
    <p>${n.lead}</p>
${notices}
${rules(n.rules)}

    <h2 id="code-and-meters">${c.title}</h2>
    <p>${c.lead}</p>
${codeEx}
${rules(c.rules)}

    <h2 id="menus-dialogs-and-sheets">${fl.title}</h2>
    <p>${fl.lead}</p>
${floating}
${rules(fl.rules)}
    <h3 id="dialog-or-sheet">${fl.whenTitle}</h3>
${table(fl.whenHead, fl.when.map(([use, when]) => [`<b>${use}</b>`, when]))}`
	};
}
