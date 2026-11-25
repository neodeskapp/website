---
title: Design
description: How NeoDesk's interfaces look and read: the design tokens, the components, the icons, layout and dialogs, and the words.
order: 15
related: /docs/development/translations, /docs/development/architecture
icon: palette
---

These pages are for people who work on the web console or the desktop client.
They describe the console's design system as the code has it, in
`web-ui/src/lib/styles/tokens.css` and the components in `web-ui/src/lib/ui/`.
The logo, its colours and the voice are on the
[brand page](/brand/).

- [Design tokens](/docs/development/design/tokens): colours, type, space,
  shape, motion and the sizes of controls.
- [Components](/docs/development/design/components): the building blocks of
  every page and which one to use for what.
- [Icons](/docs/development/design/icons): Material Symbols Outlined, one icon
  per meaning.
- [Layout and dialogs](/docs/development/design/layout): the page frame,
  spacing, and when to use a dialog or a sheet.
- [Writing for the interface](/docs/development/design/writing): the rules for
  labels and messages, and the words to use.

## Rules for every screen

- Sentence case everywhere. No upper-case, letter-spaced labels.
- No pills, badges or chips, and no cards inside cards. Plain text on the
  background, rules between rows.
- No gradients, blur, glow or decorative shadows. Only things that float, such
  as menus and dialogs, cast a shadow.
- Corners of 2 to 4 px, buttons included.
- One primary action per view. Everything else is a plain button or a link.
- Monospace only for what people copy: commands, IDs, addresses.
- One column, one left edge.
- No fake interface and no filler pictures. Show the console with a real
  screenshot.
