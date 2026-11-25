---
title: Design tokens
description: The console's colours in light and dark, type sizes, the space scale, corners, shadows, motion, layers and the sizes of controls and rows.
order: 1
icon: tune
---

Every value a component uses is a token in `web-ui/src/lib/styles/tokens.css`.
Use the token, not the value, so a theme, a custom palette or the
accessibility panel reaches every component.

## Colours

The colours come from the active palette: the built-in light or dark one in
`config/theme-palettes.json`, or an admin's custom colours. The tokens give
them plain names.

| Token | Palette key | Light | Dark | Use |
|---|---|---|---|---|
| `--bg` | `bgPrimary` | `#ffffff` | `#141616` | The page |
| `--bg-subtle` | `bgSecondary` | `#f3f4f4` | `#1b1e1e` | Quiet areas |
| `--hover` | `bgTertiary` | `#e8ebeb` | `#262a2a` | A row under the pointer |
| `--bg-float` | `bgElevated` | `#ffffff` | `#1f2323` | Menus, dialogs, sheets |
| `--text` | `textPrimary` | `#1b1e1f` | `#e4e7e7` | Text |
| `--text-muted` | `textSecondary` | `#566064` | `#a3abad` | Hints, secondary text |
| `--border` | `borderPrimary` | `#7e888b` | `#6a7474` | Outlines of fields and controls, 3:1 on every surface |
| `--rule` | `borderSecondary` | `#dde1e2` | `#2c3131` | Lines between rows and sections |
| `--accent` | `accentBlue` | `#1b62cf` | `#58a6ff` | Primary buttons, links, focus |
| `--success` | `accentGreen` | `#1c7a3b` | `#72c98c` | Done, online |
| `--danger` | `accentRed` | `#b3261e` | `#ff8f80` | Errors, destructive actions |
| `--warning` | `accentYellow` | `#875b00` | `#e3b85a` | Needs attention |
| `--info` | `accentPurple` | `#4a5a62` | `#a9bcc4` | Neutral information |

The accent is the logo blue. In light mode it is a step darker than the logo's
`#1f6feb`, because `#1f6feb` reaches only 4.2:1 as text on `--bg-subtle`.
Lime is a logo colour only, never a state. `--accent-tint` is the accent at
15 % over the background, with `--text` on it. Tags and initials sit on
`--tag-bg`, the text colour at 9 %.

The logo has fixed colours, `--logo-square`, `--logo-circle` and
`--logo-overlap`, which never come from a custom accent. Chart series take
`--series-1` to `--series-3` (blue, orange, teal), operating system marks
`--os-windows` and its neighbours, and avatar initials `--avatar-1` to
`--avatar-6`, kept apart from the state colours so an avatar never reads as a
state.

## Type

| Token | Size |
|---|---|
| `--text-xs` | 12 px |
| `--text-sm` | 13 px |
| `--text-base` | 14 px |
| `--text-md` | 16 px |
| `--text-lg` | 20 px |
| `--text-xl` | 24 px, page titles |

The sizes follow `--font-scale`, which the accessibility panel's text size
sets. Line height is `--leading`, 1.45. The font is IBM Plex Sans (`--font`);
IBM Plex Mono (`--mono`) is only for values people copy: IDs, keys,
addresses.

## Space

Space comes in 4 px steps:

| Token | Size |
|---|---|
| `--space-1` | 4 px |
| `--space-2` | 8 px |
| `--space-3` | 12 px |
| `--space-4` | 16 px |
| `--space-5` | 24 px |
| `--space-6` | 32 px |
| `--space-7` | 48 px |

## Shape, shadow and motion

- `--radius` is 4 px, `--radius-sm` 3 px.
- Only floating things cast a shadow: `--shadow-float`.
- Motion is for state changes only: `--motion`, 120 ms, and 0 ms when the
  reader asks for reduced motion.

## Controls and rows

| Token | Value | What it is |
|---|---|---|
| `--control-h` | 36 px | Buttons, fields, selects, search fields, menu buttons, segmented filters |
| `--control-h-sm` | 30 px | The small size for dense rows: row actions, pagination |
| `--control-pad-x` | 12 px | Side padding of a button |
| `--control-weight` | 500 | The label weight of every button, menu button, segment and tab |
| `--icon-btn-size` | 30 px | The square of an icon-only button |
| `--icon-btn-glyph` | 20 px | Its glyph |
| `--check-size` | 16 px | Checkboxes and radios |
| `--row-h` | 44 px | Every row: navigation, lists, facts, tables, menus |
| `--focus-ring` | 2 px | One focus ring, outside the control, 2 px away |

On touch screens (`pointer: coarse`) controls and small controls grow to
44 px, checkboxes to 20 px and rows to 48 px.

## Layers

From the bottom: sticky table headers (`--layer-sticky`), the top bar
(`--layer-topbar`), menus (`--layer-menu`), dialogs and sheets
(`--layer-dialog`), search (`--layer-search`), toasts (`--layer-toast`), and
the reading guide of the accessibility panel (`--layer-reading`).
