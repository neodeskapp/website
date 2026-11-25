---
title: Icons
description: Material Symbols Outlined at the 20 px design, one icon for each meaning, the same in the console and the desktop client.
order: 3
---

NeoDesk uses one icon set: Material Symbols Outlined, self-hosted, with no
fill, weight 400, grade 0 and the optical size of the 20 px design. In the
console that is the `.material-icons` class in `web-ui/src/lib/styles/base.css`,
18 px by default and 20 px in icon-only buttons (`--icon-btn-glyph`). The same
action gets the same icon in the console and in the desktop client.

## One icon per meaning

An icon stands for a meaning, not for a look. The console names the meaning,
and the table `ICONS` in `web-ui/src/lib/util/display.ts` picks the glyph, so
an action looks the same on every page. Some of them:

| Meaning | Glyph |
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

Add a meaning to `ICONS` before you use a new icon, and reuse the meanings
that are there.

## How to use them

- The `Icon` component draws a glyph. It is decorative: the text next to it
  says what it means, and screen readers skip the icon.
- A button with only an icon is for close, the row menu, copy and the
  disclosure chevron. Everything else gets a visible label.
- The icon box keeps its square before the font has loaded, so nothing moves
  when it arrives.

## Updating the font

The console ships a subset of the font with only the icons it uses.
`web-ui/scripts/update-material-symbols.ts` downloads it again; it reads the
names from a scan of the console and the server's navigation, and a unit test
checks the font against the same scan. Nothing in the server or the console
runs it.
