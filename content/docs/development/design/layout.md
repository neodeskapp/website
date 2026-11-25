---
title: Layout and dialogs
description: The console's page frame and its sizes, spacing between things, and when to use a dialog or a side sheet.
order: 4
icon: view_quilt
---

The console has a sidebar, a top bar and the page beside them. The sizes are
tokens in `web-ui/src/lib/styles/tokens.css`.

## The frame

| Token | Value | What it is |
|---|---|---|
| `--sidebar-w` | 232 px | The sidebar |
| `--topbar-h` | 48 px | The top bar |
| `--page-pad` | 24 px, 16 px up to 640 px | The space around a page's content |
| `--measure` | 640 px | The width of running text |
| `--content-max` | 1600 px | The widest a page's content gets |
| `--side-w` | 360 px | A side column beside the content |

## Spacing

- Space comes from the 4 px scale, `--space-1` to `--space-7`; see
  [Design tokens](/docs/development/design/tokens#space).
- One column, one left edge. Headings, rows and fields line up on it.
- Rows separate things: a rule between rows, not a box around each.
  Every row has the same inset, `--row-pad-x` and `--row-pad-y`.
- No cards, and no cards inside cards.

## Dialogs and sheets {alias=dialog-or-sheet}

- **Pick the window by the task.** A `Dialog` is centred and blocks the page:
  a confirmation, one question, or a short result. A `Sheet` comes in from the
  end side at full height, for creating or editing a thing with more than
  about four fields, and for the details of one item. Settings go on the page
  itself. Don't put a long form in a dialog because it fits.
- **Use one of the fixed widths.** Dialogs are small (400 px) for a
  confirmation, default (520 px) for a short form or a result, and large
  (760 px) for two blocks side by side. Sheets are 560 px, or 720 px
  (`wide`) for editors and tables. Don't set a width per dialog.
- **Put related blocks side by side when there is room.** Wrap them in
  `.dialog-cols`: it shows two columns when each gets 240 px and stacks them
  on a phone. Don't leave a small block alone at the start of a row with
  empty space beside it.
- **Make fields as wide as their row.** Fields in dialogs and sheets fill the
  row; only numbers and ports stay short. Don't give a name or address field
  a fixed narrow width next to full-width fields.
- **Put captions under or beside what they describe.** A QR code has its
  caption beside it, filling the row. Don't squeeze a caption into a narrow
  column under a picture, where it wraps into four short lines.
- **Order the content by the task.** What people do first comes first (copy
  or mail the link), the other way after it (the QR code). Don't lead with
  the option fewer people use.
- **One primary action, at the end.** Cancel first, the answer last and
  primary; a details sheet ends with Close. Don't use two primary buttons, or
  put the main action on the start side.
- **Keep destructive actions apart and name them.** Put them next to what they
  end ("Cancel the link" beside the line that says the link is waiting), or on
  the start side of the footer, with a verb that says what happens. A
  destructive answer is a danger button. Don't put a red "Delete" or "Cancel"
  at the far end of the footer, away from the thing it ends. On a page,
  destructive actions go into the `DangerZone` at the end.
- **Scroll inside.** The body scrolls; the header and the footer stay in
  place. Don't let the whole dialog scroll so the buttons leave the screen.
- **No sideways scrolling.** Wrap long names, and give wide tables their own
  scrolling frame or turn them into stacked rows. Don't let one long ID push
  a dialog wider than the screen.

### On a phone

At 640 px and below every dialog is a full-height sheet: the footer sits at
the bottom, its buttons share the row and are at least 44 px high, padding
keeps clear of rounded corners and the home bar (the safe areas), and the
field that has the focus scrolls into the part of the screen the keyboard
leaves free. Don't show a floating box with part of the page visible behind
it, or a footer the keyboard covers.

## Page layouts

- **Use the width.** Two columns where the content has two parts, the task
  and what helps with it; tables and charts at full width. Don't leave a
  single narrow column on a 1920 px screen with the rest empty.
- **Keep reading text readable.** Paragraphs, descriptions and forms stay
  within `--measure` (640 px). Don't stretch a paragraph across 1600 px.
- **Check four widths.** Look at every page at 390, 768, 1280 and 1920 px,
  and at 200 % zoom. Don't ship a page you only saw at the width of your own
  screen.

## Components and sizes

- **Use the tokens.** `--space-*` for gaps and paddings, `--control-h` for
  the height of controls, `--radius` for corners. Don't write a pixel value
  that a token already names.
- **Touch targets.** Buttons and rows are 44 px high on touch screens, and so
  are the footer buttons of a dialog at phone width. Don't make a 30 px icon
  button the only way to do something on a phone.
- **Icons.** Use the `Icon` component, with Material Symbols, and give each
  icon a text label or an accessible name. Don't use other icon sets, emoji
  as icons, or an icon without a name. See
  [Icons](/docs/development/design/icons).
- **Long names.** Wrap them in navigation and headings. Cut them off with an
  ellipsis only in table cells, with the full name in reach: the row opens
  it. Don't cut off the name people need to find a page.

## Interface texts

[Writing for the interface](/docs/development/design/writing) has the rules
and the glossary. Four more for dialogs and pages:

- **Name things by what they do.** "Single sign-on", "Join requests". Don't
  name them by how they are built ("OIDC / OAuth2 (SSO)", "registrations").
- **Say what happened and what to do.** "Nothing matches "abc". Try fewer or
  other words." Don't write "No results." alone.
- **Count correctly.** "1 result", "3 results". Don't write "1 results".
- **Translate every new text.** Write it in English and German, and add the
  key to every language file the translation check asks for. Don't leave a
  key in English only.
