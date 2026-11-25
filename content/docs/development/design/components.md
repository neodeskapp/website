---
title: Components
description: The console's building blocks in web-ui/src/lib/ui, and which one to use for buttons, forms, lists, status, messages and panels.
order: 2
---

Pages are built from the components in `web-ui/src/lib/ui/`. Each file starts
with a comment that says what it is for; this page sums them up. Use the
component rather than markup of your own, so a page looks and behaves like
the others.

## Buttons and menus

| Component | Use it for |
|---|---|
| `Button` | Every button. One primary per view; secondary (outlined) by default; ghost; danger for a dialog's answer; danger-quiet for a destructive action on the page; link for an action inside running text. Two sizes, default and small. |
| `IconButton` | A glyph without a label, only for close, the row menu, copy and the disclosure chevron. Its label becomes the accessible name. |
| `MenuButton`, `Menu`, `MenuItem`, `MenuDivider` | A small menu behind a button with a caret, or the row menu. Arrow keys move, Home and End jump, a letter moves to the next item with it. |
| `SegmentedFilter` | View filters: status filters above a list, list or grid, date presets. |
| `Tabs` | Parts of one thing, such as a detail panel or a settings page. |

## Forms

| Component | Use it for |
|---|---|
| `Field` | A labelled field: the label above, the control, a hint under it, the error, then what happens after a change ("Applies right away", "After a restart"). |
| `Input`, `Textarea`, `Select` | Text and choices inside a `Field`. Inputs come in widths: short for ports and numbers, medium for names, host for addresses. |
| `Checkbox`, `Switch`, `Radio`, `ChoiceList` | On and off, and one of a few. A switch is a checkbox with the same keyboard: Space toggles. The whole label is the click target. |
| `FormSection` | A named group of fields in a sheet or dialog. |
| `SaveBar` | The end of a form: its status line and the one save button. |
| `SearchField` | A search field with a leading icon; its label is required. |

## Lists and data

| Component | Use it for |
|---|---|
| `Table` | Data tables, with sorting by column. |
| `RowList`, `ListRow` | Things people open or act on, as rows on rules with the height of table rows. A row that goes somewhere is one click target. |
| `Facts` | Label and value pairs, one column on narrow screens. |
| `Toolbar` | The row above a list: search first, then filters and controls, then actions. |
| `Pagination` | Page controls under a list. |
| `Split` | A list with the open item beside it; one pane at a time below 768 px. |
| `ValueCopy`, `CodeBlock` | A value people copy (ID, address, key), in mono with a copy button; and a block of text to copy, such as a script. |
| `Empty` | No value: one muted dash, or a word such as "Never". Never in mono. |

## Status and people

| Component | Use it for |
|---|---|
| `Status` | A mark and a word for a state. Each tone has its own shape, so colour is never the only cue. |
| `Presence` | A person's status: online, away, busy, offline. |
| `Tag`, `TagSet` | A value from a set, or tags people set: a quiet token, a faint tint of the text colour, 3 px corners, never a pill, never coloured per value. |
| `Avatar` | A profile picture or initials in a fixed box with 4 px corners, never round. |
| `Meter` | The share of a limit, always with the number as text. |

## Messages and panels

| Component | Use it for |
|---|---|
| `Notice` | One message that must stand out on a page or in a sheet: a rule on the start side in the tone's colour, no box. |
| `Toast` | A short message after an action, shown by `ToastHost`. |
| `Dialog` | Confirmations, one question, a prompt of one to three fields, anything that must block. |
| `Sheet` | A side panel for creating or editing something with more than a few fields, and for the details of one item. |
| `Disclosure` | A section that starts closed. |
| `DangerZone` | Dangerous actions together at the end of a page, each with its consequence in one sentence. |
| `Steps` | A real sequence, numbered. |
