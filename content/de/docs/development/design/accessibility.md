---
title: Barrierefreiheit
description: Die Regeln zur Barrierefreiheit, die Komponenten, die sie einhalten, wie du testest, und die Prüfliste für Screenreader.
order: 6
---

NeoDesk zielt in Konsole, Desktop-Client, Website und Mails auf WCAG 2.2
Stufe AA. EN 301 549 und die BITV 2.0 bauen auf diesen Kriterien auf und
stellen eigene Anforderungen dazu, die wir noch nicht geprüft haben. Wo AAA
wenig kostet (7:1 für Fließtext, 44 px große Ziele, keine Zeitlimits),
machen wir es. Die
[Erklärung zur Barrierefreiheit](/docs/project/accessibility) sagt, was
heute erfüllt ist und was noch nicht.

Das meiste bekommst du geschenkt, wenn du aus den gemeinsamen Komponenten
baust. Die Prüfungen in der CI fangen vieles ab, aber nicht alles:
automatische Werkzeuge finden etwa ein Drittel der echten Probleme. Deshalb
bekommt jede neue Ansicht auch die Prüfungen von Hand weiter unten.

## Regeln

- Jedes Bedienelement hat einen Namen, der zu dem passt, was es zeigt.
  Wer per Sprache steuert, sagt die sichtbaren Wörter, Screenreader lesen
  den Namen.
- Alles geht allein mit der Tastatur: Tab und Umschalt+Tab bewegen, Enter
  und Leertaste lösen aus, Pfeiltasten bewegen innerhalb einer Gruppe
  (Tabs, Menüs, Optionsgruppen, Listen), Escape schließt. Nichts hält die
  Tastatur fest. Der entfernte Bildschirm bekommt jede Taste, deshalb gibt
  Strg+Alt+Umschalt+G die Tastatur immer zurück, im Browser und im Client
  (im Browser auch F8).
- Der Fokus ist immer sichtbar (der 2-px-Ring, 3:1 zu seiner Umgebung) und
  nie unter der oberen Leiste, der Speicherleiste, der Navigation auf dem
  Telefon oder einer fixierten Tabellenspalte versteckt.
- Ein Zustand zeigt sich nie nur über die Farbe: online und offline,
  Fehler, Pflichtfelder, das gewählte Element, Linien in Diagrammen. In den
  Kontrastdesigns von Windows nimmt das gewählte Element die Auswahlfarben
  des Systems.
- Text erreicht 4.5:1, Ränder, Fokus und Diagrammlinien 3:1, hell und
  dunkel und in jedem Kontrastmodus.
- Ergebnisse werden gesagt, nicht nur gezeigt: Laden, Fehler, gespeichert,
  die Zahl der Zeilen. Nimm `announce()`, nie eine eigene Live-Region.
- Jede Seite hat genau ein `h1`, einen Titel, der sie nennt („Geräte -
  NeoDesk"), Landmarks für ihre Teile und den Link zum Inhalt.
- Zeitlimits warnen, bevor sie ablaufen, und lassen sich verlängern.
  Listen, die sich selbst aktualisieren, lassen sich anhalten.
- Tastenkürzel aus einer einzelnen Taste lassen sich abschalten. Nimm Strg
  oder Alt mit einem Buchstaben.
- Alles, was man ziehen kann, geht auch mit einem Klick oder der Tastatur.
- Wörter: sag, was passiert ist und was als Nächstes zu tun ist. Zeig
  nicht auf eine Farbe, eine Form oder eine Stelle am Bildschirm („der
  grüne Knopf rechts").

## Komponenten

In `web-ui/src/lib/ui/`:

| Wofür | Nimm | Was sie dir abnimmt |
|---|---|---|
| Ein Knopf oder ein Link | `Button`, `IconButton` | Name, Fokusring, deaktivierter Zustand. `IconButton` braucht `label`. |
| Ein Feld | `Field` mit `Input`, `Select`, `Textarea` | Beschriftung, Hinweis und Fehler am Feld, `aria-invalid`, „(Pflichtfeld)" neben der Beschriftung, wenn das Feld Pflicht ist. |
| Eins von wenigen | `ChoiceList`, `Radio` | Eine echte Optionsgruppe mit Pfeiltasten. |
| Ein Dialog oder ein Seitenpanel | `Dialog`, `Sheet` | Der Fokus geht hinein und bleibt dort, Escape schließt, der Fokus kehrt zurück, die Seite dahinter ist inert. |
| Ein Menü | `MenuButton`, `Menu`, `MenuItem` | Das ARIA-Menümuster: Pfeile, Pos1, Ende, Buchstaben, Escape. |
| Tabs | `Tabs` | Wandernder Fokus, Pfeiltasten, Pos1 und Ende. |
| Eine Tabelle | `Table` | Beschriftung, Kopfzellen, Sortierknöpfe, die Zahl der Zeilen wird gesagt, wenn das Laden endet. |
| Laden, leer und Fehler | `States` | Der Satz, und er wird angesagt. |
| Eine kurze Meldung | `toast.success()`, `toast.error()` | Wird angesagt; Fehler bleiben, bis man sie schließt, und sagen „Fehler:" in Worten. |
| Alles andere, was gesagt werden muss | `announce(text)` aus `announce.svelte.ts` | Eine höfliche und eine sofortige Live-Region, die immer da sind. |
| Ein Link zum Inhalt | `SkipLink` | Steckt schon in jedem Layout. |

Eine Lint-Regel (`local/named-icon-control`) lehnt Knöpfe und Links ab, die
nur ein Symbol zeigen und kein `aria-label` haben. Die Prüfungen von Svelte
lehnen positives `tabindex` und Klick-Handler auf Elementen ab, die keine
Bedienelemente sind; schalte sie nicht ohne einen Kommentar ab, der sagt,
warum.

Im Desktop-Client nimm die gemeinsamen Widgets in
`flutter/lib/common/widgets/` (die `Nd*`-Widgets). Sie bringen Fokus,
`Semantics` mit Rolle, Name und Zustand und die Tastatur mit. Ein
`GestureDetector` oder `InkWell` allein ist kein Bedienelement.

## Testen

Die Prüfungen der Konsole laufen in der CI bei jedem Pull Request. Auf der
Website laufen die Prüfungen des Markups bei jedem Build; den Test im
Headless-Browser startest du von Hand, er braucht Playwright und axe-core:

```sh
# Kontrast jedes Farbpaars in jeder Palette, die Lint-Regel, die Komponenten
cd web-ui && npx vitest run tests/unit/contrast.test.ts tests/unit/lint-named-icon-control.test.ts tests/unit/ui
# axe auf jeder Seite, hell und dunkel, 320 und 1280 px; Aufgaben nur mit Tastatur; Fokus nicht verdeckt; Kontrastdesigns
npx playwright test e2e/a11y-routes.spec.ts e2e/a11y-tasks.spec.ts e2e/a11y-focus-obscured.spec.ts e2e/a11y-forced-colors.spec.ts
# Die Website: Build-Prüfungen, dann der Test im Headless-Browser
npm run build && npm run test:a11y
```

`expectNoAxeViolations(page)` aus `e2e/fixtures.ts` prüft einen Zustand
einer Seite, etwa einen offenen Dialog. Nimm es im Spec jedes neuen
Dialogs. Such Bedienelemente in Tests über Rolle und Namen
(`getByRole('button', { name: 'Save changes' })`), nicht über CSS-Klassen:
Ein Test, der ein Element nicht über seinen Namen findet, hat einen Fehler
gefunden.

Von Hand, für jede neue Ansicht:

1. Geh mit Tab hindurch. Erreichst du jedes Bedienelement, in einer
   sinnvollen Reihenfolge, mit sichtbarem Fokusring? Kommst du aus jedem
   Teil wieder heraus?
2. Zoom auf 200 %, dann mach das Fenster 320 px breit. Nichts ist
   abgeschnitten, nichts scrollt seitlich außer Tabellen und Code.
3. Schalte ein Kontrastdesign von Windows ein (oder emuliere
   `forced-colors: active` in den Entwicklerwerkzeugen). Siehst du das
   gewählte Element, den Fokus und jeden Rand noch?
4. Schalte im System „Animationen reduzieren" ein. Nichts gleitet oder
   blendet.
5. Geh die Prüfliste für Screenreader unten durch.

## Prüfliste für Screenreader

Nimm NVDA mit Firefox und Chrome, die Sprachausgabe von Windows mit Edge
und, wenn du kannst, VoiceOver mit Safari auf einem Mac. Für den Client:
Sprachausgabe und NVDA unter Windows, Orca unter Linux.

- [ ] Der Seitentitel wird beim Öffnen gelesen, und das `h1` bekommt den
      Fokus.
- [ ] Die Liste der Überschriften (NVDA: Einfg+F7) zeigt die Gliederung.
- [ ] Die Liste der Landmarks zeigt Banner, Navigation, Hauptinhalt und
      die Teile der Seite, jeden mit einem anderen Namen.
- [ ] Jedes Bedienelement sagt Rolle, Namen und Zustand („Online,
      Umschaltfläche, gedrückt").
- [ ] Ein Feld sagt seine Beschriftung, „erforderlich", wenn es das ist,
      seinen Hinweis und nach einem misslungenen Speichern den Fehler.
- [ ] Ein Dialog sagt beim Öffnen seinen Titel; der Lesemodus kommt nicht
      aus ihm heraus.
- [ ] Laden, Speichern, Fehler und neue Nachrichten werden einmal gesagt,
      ohne dass der Fokus springt.
- [ ] Tabellen sagen ihre Beschriftung, die Zahl der Zeilen und Spalten
      und welche Spalte sortiert ist.
- [ ] Auf dem entfernten Bildschirm gehen die Tasten an den entfernten
      Computer, und F8 oder Strg+Alt+Umschalt+G gibt sie zurück; das wird
      gesagt.
