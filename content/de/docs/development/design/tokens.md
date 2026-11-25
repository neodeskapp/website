---
title: Design-Tokens
description: Die Farben der Konsole in hell und dunkel, Schriftgrößen, die Abstandsstufen, Ecken, Schatten, Bewegung, Ebenen und die Größen von Bedienelementen.
order: 1
---

Jeder Wert, den eine Komponente nutzt, ist ein Token in
`web-ui/src/lib/styles/tokens.css`. Nimm das Token, nicht den Wert, damit ein
Theme, eine eigene Palette oder das Bedienungshilfen-Menü jede Komponente
erreicht.

## Farben {#colours}

Die Farben kommen aus der aktiven Palette: der eingebauten hellen oder dunklen
in `config/theme-palettes.json` oder den eigenen Farben eines Admins. Die
Tokens geben ihnen einfache Namen.

| Token | Schlüssel der Palette | Hell | Dunkel | Wofür |
|---|---|---|---|---|
| `--bg` | `bgPrimary` | `#ffffff` | `#141616` | Die Seite |
| `--bg-subtle` | `bgSecondary` | `#f3f4f4` | `#1b1e1e` | Ruhige Flächen |
| `--hover` | `bgTertiary` | `#e8ebeb` | `#262a2a` | Eine Zeile unter dem Mauszeiger |
| `--bg-float` | `bgElevated` | `#ffffff` | `#1f2323` | Menüs, Dialoge, Sheets |
| `--text` | `textPrimary` | `#1b1e1f` | `#e4e7e7` | Text |
| `--text-muted` | `textSecondary` | `#566064` | `#a3abad` | Hinweise, Nebentext |
| `--border` | `borderPrimary` | `#7e888b` | `#6a7474` | Umrisse von Feldern und Bedienelementen, 3:1 auf jeder Fläche |
| `--rule` | `borderSecondary` | `#dde1e2` | `#2c3131` | Linien zwischen Zeilen und Abschnitten |
| `--accent` | `accentBlue` | `#1b62cf` | `#58a6ff` | Hauptschaltflächen, Links, Fokus |
| `--success` | `accentGreen` | `#1c7a3b` | `#72c98c` | Erledigt, online |
| `--danger` | `accentRed` | `#b3261e` | `#ff8f80` | Fehler, zerstörende Aktionen |
| `--warning` | `accentYellow` | `#875b00` | `#e3b85a` | Braucht Aufmerksamkeit |
| `--info` | `accentPurple` | `#4a5a62` | `#a9bcc4` | Neutrale Information |

Der Akzent ist das Blau des Logos. Im hellen Modus ist er eine Stufe dunkler
als das `#1f6feb` des Logos, weil `#1f6feb` als Text auf `--bg-subtle` nur
4,2:1 erreicht. Limette ist nur eine Logofarbe, nie ein Zustand.
`--accent-tint` ist der Akzent zu 15 % über dem Hintergrund, mit `--text`
darauf. Tags und Initialen liegen auf `--tag-bg`, der Textfarbe zu 9 %.

Das Logo hat feste Farben, `--logo-square`, `--logo-circle` und
`--logo-overlap`, die nie aus einem eigenen Akzent kommen. Diagrammreihen
nehmen `--series-1` bis `--series-3` (Blau, Orange, Türkis), Zeichen der
Betriebssysteme `--os-windows` und seine Nachbarn, und Initialen von Avataren
`--avatar-1` bis `--avatar-6`, getrennt von den Zustandsfarben, damit ein
Avatar nie wie ein Zustand aussieht.

## Schrift {#type}

| Token | Größe |
|---|---|
| `--text-xs` | 12 px |
| `--text-sm` | 13 px |
| `--text-base` | 14 px |
| `--text-md` | 16 px |
| `--text-lg` | 20 px |
| `--text-xl` | 24 px, Seitentitel |

Die Größen folgen `--font-scale`, das die Textgröße im Bedienungshilfen-Menü
setzt. Die Zeilenhöhe ist `--leading`, 1,45. Die Schrift ist IBM Plex Sans
(`--font`); IBM Plex Mono (`--mono`) gibt es nur für Werte, die man kopiert:
IDs, Schlüssel, Adressen.

## Abstände {#space}

Abstände gibt es in Stufen von 4 px:

| Token | Größe |
|---|---|
| `--space-1` | 4 px |
| `--space-2` | 8 px |
| `--space-3` | 12 px |
| `--space-4` | 16 px |
| `--space-5` | 24 px |
| `--space-6` | 32 px |
| `--space-7` | 48 px |

## Form, Schatten und Bewegung {#shape-shadow-and-motion}

- `--radius` ist 4 px, `--radius-sm` 3 px.
- Nur was schwebt, wirft einen Schatten: `--shadow-float`.
- Bewegung gibt es nur bei Zustandswechseln: `--motion`, 120 ms, und 0 ms,
  wenn jemand weniger Bewegung eingestellt hat.

## Bedienelemente und Zeilen {#controls-and-rows}

| Token | Wert | Was es ist |
|---|---|---|
| `--control-h` | 36 px | Schaltflächen, Felder, Auswahllisten, Suchfelder, Menüschaltflächen, Segmentfilter |
| `--control-h-sm` | 30 px | Die kleine Größe für dichte Zeilen: Zeilenaktionen, Seitenwechsel |
| `--control-pad-x` | 12 px | Seitlicher Innenabstand einer Schaltfläche |
| `--control-weight` | 500 | Die Stärke der Beschriftung jeder Schaltfläche, Menüschaltfläche, jedes Segments und Tabs |
| `--icon-btn-size` | 30 px | Das Quadrat einer Schaltfläche nur mit Icon |
| `--icon-btn-glyph` | 20 px | Ihr Icon |
| `--check-size` | 16 px | Kontrollkästchen und Optionsfelder |
| `--row-h` | 44 px | Jede Zeile: Navigation, Listen, Fakten, Tabellen, Menüs |
| `--focus-ring` | 2 px | Ein Fokusrahmen, außerhalb des Elements, 2 px Abstand |

Auf Touchscreens (`pointer: coarse`) wachsen Bedienelemente und kleine
Bedienelemente auf 44 px, Kontrollkästchen auf 20 px und Zeilen auf 48 px.

## Ebenen {#layers}

Von unten: feste Tabellenköpfe (`--layer-sticky`), die obere Leiste
(`--layer-topbar`), Menüs (`--layer-menu`), Dialoge und Sheets
(`--layer-dialog`), die Suche (`--layer-search`), Toasts (`--layer-toast`) und
die Lesehilfe aus dem Bedienungshilfen-Menü (`--layer-reading`).
