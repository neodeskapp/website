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

## Dialog or sheet

- A `Dialog` is centred and blocks the page: confirmations, one question, a
  prompt of one to three fields.
- A `Sheet` comes in from the end side at full height, for creating or
  editing a thing with more than a few fields, and for the details of one
  item. It is 560 px wide, 720 px for editors and tables, and takes the whole
  screen at 640 px and below.
- A destructive answer in a dialog is a danger button. On a page, destructive
  actions go into the `DangerZone` at the end, and a button that asks for
  confirmation ends its label in "…".

::: note
Not written yet: the full rules for dialogs and page layouts at every screen
size, which the console work on dialogs and layouts is drawing up. They go
here once they are final. Until then, the points above and the components'
own comments are the rules.
:::
