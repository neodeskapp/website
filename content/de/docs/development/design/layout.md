---
title: Layout und Dialoge
description: Der Rahmen der Konsole und seine Größen, Abstände zwischen Dingen, und wann ein Dialog oder ein Seitenpanel passt.
order: 4
---

Die Konsole hat eine Seitenleiste, eine obere Leiste und die Seite daneben.
Die Größen sind Tokens in `web-ui/src/lib/styles/tokens.css`.

## Der Rahmen {#the-frame}

| Token | Wert | Was es ist |
|---|---|---|
| `--sidebar-w` | 232 px | Die Seitenleiste |
| `--topbar-h` | 48 px | Die obere Leiste |
| `--page-pad` | 24 px, 16 px bis 640 px | Der Raum um den Inhalt einer Seite |
| `--measure` | 640 px | Die Breite von Fließtext |
| `--content-max` | 1600 px | Die größte Breite des Inhalts einer Seite |
| `--side-w` | 360 px | Eine Seitenspalte neben dem Inhalt |

## Abstände {#spacing}

- Abstände kommen aus der 4-px-Stufung, `--space-1` bis `--space-7`; siehe
  [Design-Tokens](/docs/development/design/tokens#space).
- Eine Spalte, eine linke Kante. Überschriften, Zeilen und Felder stehen
  daran.
- Zeilen trennen Dinge: eine Linie zwischen Zeilen, kein Kasten um jede.
  Jede Zeile hat denselben Einzug, `--row-pad-x` und `--row-pad-y`.
- Keine Karten, und keine Karten in Karten.

## Dialoge und Sheets {#dialogs-and-sheets alias=dialog-or-sheet}

- **Wähl das Fenster nach der Aufgabe.** Ein `Dialog` steht in der Mitte und
  blockiert die Seite: eine Bestätigung, eine Frage oder ein kurzes Ergebnis.
  Ein `Sheet` kommt in voller Höhe vom Ende her, um etwas mit mehr als etwa
  vier Feldern anzulegen oder zu bearbeiten, und für die Details eines
  Eintrags. Einstellungen stehen auf der Seite selbst. Steck kein langes
  Formular in einen Dialog, nur weil es hineinpasst.
- **Nimm eine der festen Breiten.** Dialoge sind klein (400 px) für eine
  Bestätigung, normal (520 px) für ein kurzes Formular oder ein Ergebnis und
  groß (760 px) für zwei Blöcke nebeneinander. Sheets sind 560 px breit, oder
  720 px (`wide`) für Editoren und Tabellen. Leg keine eigene Breite für
  einen einzelnen Dialog fest.
- **Stell zusammengehörige Blöcke nebeneinander, wenn Platz ist.** Pack sie in
  `.dialog-cols`: Das zeigt zwei Spalten, wenn jede 240 px bekommt, und stapelt
  sie auf dem Handy. Lass keinen kleinen Block allein am Anfang einer Zeile
  stehen, mit leerem Platz daneben.
- **Mach Felder so breit wie ihre Zeile.** Felder in Dialogen und Sheets
  füllen die Zeile; nur Zahlen und Ports bleiben kurz. Gib einem Namens- oder
  Adressfeld keine feste schmale Breite neben Feldern in voller Breite.
- **Setz Beschriftungen unter oder neben das, was sie beschreiben.** Ein
  QR-Code hat seine Beschriftung daneben, über die ganze Zeile. Quetsch keine
  Beschriftung in eine schmale Spalte unter einem Bild, wo sie in vier kurze
  Zeilen umbricht.
- **Ordne den Inhalt nach der Aufgabe.** Was die Leute zuerst tun, steht
  zuerst (den Link kopieren oder mailen), der andere Weg danach (der QR-Code).
  Fang nicht mit der Möglichkeit an, die weniger Leute nutzen.
- **Eine Hauptaktion, am Ende.** Abbrechen zuerst, die Antwort zuletzt und als
  Hauptaktion; ein Detail-Sheet endet mit Schließen. Keine zwei
  Hauptschaltflächen und keine Hauptaktion auf der Anfangsseite.
- **Halte zerstörende Aktionen getrennt und benenne sie.** Setz sie neben das,
  was sie beenden („Link zurückziehen“ neben der Zeile, die sagt, dass der
  Link wartet), oder an die Anfangsseite der Fußzeile, mit einem Verb, das
  sagt, was passiert. Eine zerstörende Antwort ist eine danger-Schaltfläche.
  Kein rotes „Löschen“ oder „Abbrechen“ ganz am Ende der Fußzeile, weit weg
  von dem, was es beendet. Auf einer Seite kommen zerstörende Aktionen in die
  `DangerZone` am Ende.
- **Scroll innen.** Der Inhalt scrollt; Kopf und Fußzeile bleiben stehen.
  Lass nicht den ganzen Dialog scrollen, sodass die Schaltflächen aus dem Bild
  rutschen.
- **Kein Scrollen zur Seite.** Brich lange Namen um, und gib breiten Tabellen
  einen eigenen Scrollrahmen oder mach gestapelte Zeilen daraus. Lass keine
  lange ID einen Dialog breiter als den Bildschirm machen.

### Auf dem Handy {#on-a-phone}

Bei 640 px und darunter ist jeder Dialog ein Sheet in voller Höhe: Die
Fußzeile sitzt unten, ihre Schaltflächen teilen sich die Zeile und sind
mindestens 44 px hoch, ein Abstand hält runde Ecken und die Home-Leiste frei
(die Safe Areas), und das Feld mit dem Fokus scrollt in den Teil des
Bildschirms, den die Tastatur frei lässt. Kein schwebender Kasten, hinter dem
ein Teil der Seite zu sehen ist, und keine Fußzeile, die die Tastatur
verdeckt.

## Seitenlayouts {#page-layouts}

- **Nutz die Breite.** Zwei Spalten, wo der Inhalt zwei Teile hat, die Aufgabe
  und das, was dabei hilft; Tabellen und Diagramme in voller Breite. Keine
  einzelne schmale Spalte auf einem 1920 px breiten Bildschirm, während der
  Rest leer bleibt.
- **Halte Lesetext lesbar.** Absätze, Beschreibungen und Formulare bleiben
  innerhalb von `--measure` (640 px). Zieh keinen Absatz über 1600 px.
- **Prüf vier Breiten.** Sieh dir jede Seite bei 390, 768, 1280 und 1920 px an,
  und bei 200 % Zoom. Gib keine Seite heraus, die du nur in der Breite deines
  eigenen Bildschirms gesehen hast.

## Komponenten und Größen {#components-and-sizes}

- **Nimm die Tokens.** `--space-*` für Abstände und Innenabstände,
  `--control-h` für die Höhe von Bedienelementen, `--radius` für Ecken.
  Schreib keinen Pixelwert, für den es schon ein Token gibt.
- **Touch-Ziele.** Schaltflächen und Zeilen sind auf Touchscreens 44 px hoch,
  ebenso die Schaltflächen in der Fußzeile eines Dialogs in Handybreite. Ein
  30 px großer Symbolknopf darf auf dem Handy nicht der einzige Weg zu einer
  Aktion sein.
- **Symbole.** Nimm die Komponente `Icon` mit Material Symbols und gib jedem
  Symbol eine Beschriftung oder einen zugänglichen Namen. Keine anderen
  Symbolsätze, keine Emoji als Symbole und kein Symbol ohne Namen. Siehe
  [Icons](/docs/development/design/icons).
- **Lange Namen.** Brich sie in der Navigation und in Überschriften um.
  Kürze sie mit Auslassungszeichen nur in Tabellenzellen, wenn der volle Name
  erreichbar bleibt: Die Zeile öffnet ihn. Kürze nicht den Namen, den die
  Leute brauchen, um eine Seite zu finden.

## Texte der Oberfläche {#interface-texts}

[Texte in der Oberfläche](/docs/development/design/writing) hat die Regeln
und das Glossar. Vier mehr für Dialoge und Seiten:

- **Benenne Dinge nach dem, was sie tun.** „Single Sign-on“,
  „Beitrittsanfragen“. Nicht danach, wie sie gebaut sind („OIDC / OAuth2
  (SSO)“, „Registrierungen“).
- **Sag, was passiert ist und was zu tun ist.** „Nichts passt zu "abc".
  Weniger oder andere Wörter versuchen.“ Nicht nur „Keine Ergebnisse.“
- **Zähl richtig.** „1 Ergebnis“, „3 Ergebnisse“. Nicht „1 Ergebnisse“.
- **Übersetz jeden neuen Text.** Schreib ihn auf Englisch und Deutsch und
  ergänze den Schlüssel in jeder Sprachdatei, die die Übersetzungsprüfung
  verlangt. Lass keinen Schlüssel nur auf Englisch stehen.
