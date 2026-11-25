---
title: Icons
description: Material Symbols Outlined im 20-px-Design, ein Icon pro Bedeutung, gleich in der Konsole und im Desktop-Client.
order: 3
---

NeoDesk nutzt einen Icon-Satz: Material Symbols Outlined, selbst gehostet,
ohne Füllung, Stärke 400, Grad 0 und die optische Größe des 20-px-Designs. In
der Konsole ist das die Klasse `.material-icons` in
`web-ui/src/lib/styles/base.css`, 18 px als Standard und 20 px in
Schaltflächen nur mit Icon (`--icon-btn-glyph`). Dieselbe Aktion bekommt in
der Konsole und im Desktop-Client dasselbe Icon.

## Ein Icon pro Bedeutung {#one-icon-per-meaning}

Ein Icon steht für eine Bedeutung, nicht für ein Aussehen. Die Konsole nennt
die Bedeutung, und die Tabelle `ICONS` in `web-ui/src/lib/util/display.ts`
wählt das Zeichen, damit eine Aktion auf jeder Seite gleich aussieht. Einige
davon:

| Bedeutung | Zeichen |
|---|---|
| connect | `desktop_windows` |
| connect_app | `open_in_new` |
| details | `info` |
| edit | `edit` |
| delete | `delete` |
| copy | `content_copy` |
| download | `download` |
| add | `add` |
| approve | `check` |
| reject | `close` |
| password | `key` |
| user | `person` |
| terminal | `terminal` |
| files | `folder_open` |
| settings | `settings` |
| search | `search` |
| enrollment_request | `how_to_reg` |
| help_request | `support_agent` |

Trag eine Bedeutung in `ICONS` ein, bevor du ein neues Icon nutzt, und nimm die
Bedeutungen, die es schon gibt.

## So nutzt du sie {#how-to-use-them}

- Die Komponente `Icon` zeichnet ein Zeichen. Sie ist Dekoration: Der Text
  daneben sagt, was gemeint ist, und Screenreader überspringen das Icon.
- Eine Schaltfläche nur mit Icon gibt es für Schließen, das Zeilenmenü,
  Kopieren und den Pfeil zum Aufklappen. Alles andere bekommt eine sichtbare
  Beschriftung.
- Der Kasten des Icons hält sein Quadrat, auch bevor die Schrift geladen ist,
  damit nichts springt, wenn sie ankommt.

## Die Schrift aktualisieren {#updating-the-font}

Die Konsole liefert einen Ausschnitt der Schrift mit nur den Icons aus, die sie
nutzt. `web-ui/scripts/update-material-symbols.ts` lädt ihn neu; es liest die
Namen aus einem Durchlauf über die Konsole und die Navigation des Servers, und
ein Unit-Test prüft die Schrift gegen denselben Durchlauf. Nichts im Server
oder in der Konsole führt es aus.
