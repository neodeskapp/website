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

## Dialog oder Sheet {#dialog-or-sheet}

- Ein `Dialog` steht in der Mitte und blockiert die Seite: Bestätigungen, eine
  Frage, eine Abfrage mit einem bis drei Feldern.
- Ein `Sheet` kommt in voller Höhe vom Ende her, um etwas mit mehr als ein
  paar Feldern anzulegen oder zu bearbeiten, und für die Details eines
  Eintrags. Es ist 560 px breit, 720 px für Editoren und Tabellen, und nimmt
  bei 640 px und darunter den ganzen Bildschirm.
- Eine zerstörende Antwort in einem Dialog ist eine danger-Schaltfläche. Auf
  einer Seite kommen zerstörende Aktionen in die `DangerZone` am Ende, und eine
  Schaltfläche, die vorher nachfragt, endet in ihrer Beschriftung auf „…“.

::: note
Noch nicht geschrieben: die vollständigen Regeln für Dialoge und
Seitenlayouts bei jeder Bildschirmgröße, die die Arbeit an Dialogen und
Layouts der Konsole gerade aufstellt. Sie kommen hierher, sobald sie fertig
sind. Bis dahin sind die Punkte oben und die Kommentare der Komponenten die
Regeln.
:::
