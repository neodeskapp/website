---
title: Accessibility
description: The accessibility rules for console, client, website and mails, the components that keep them, how to test, and the screen reader checklist.
order: 6
icon: checklist
---

NeoDesk aims at WCAG 2.2 level AA in the console, the desktop client, the
website and the mails. That also covers EN 301 549 and the German BITV 2.0.
Where AAA costs little (7:1 for body text, 44 px targets, no time limits) we
do it. The [accessibility statement](/docs/project/accessibility) says what
conforms today and what doesn't yet.

Most of it comes for free if you build from the shared components. The
checks in CI catch most of what slips through, but not all: automated tools
find about a third of real problems, so every new screen also gets the
manual checks below.

## Rules

- Every control has a name that matches what it shows. Voice control users
  say the visible words, screen readers read the name.
- Everything works with the keyboard alone: Tab and Shift+Tab move, Enter
  and Space act, arrow keys move inside a group (tabs, menus, radio groups,
  lists), Escape closes. Nothing traps the keyboard. The remote screen keeps
  every key, so F8 or Ctrl+Alt+Shift+K always gives the keyboard back.
- Focus is always visible (the 2 px ring, 3:1 against what is around it)
  and never hidden under the top bar, the save bar, the phone navigation or
  a pinned table column.
- State is never shown by colour alone: online and offline, errors,
  required fields, the selected item, chart series. In Windows contrast
  themes the selected item takes the system's selection colours.
- Text reaches 4.5:1 and borders, focus and chart lines 3:1, in light and
  dark and in every contrast mode.
- Results are said, not only shown: loading, errors, saved, the number of
  rows. Use `announce()`, never a live region you add yourself.
- Every page has one `h1`, a title that names it ("Devices - NeoDesk"),
  landmarks for its parts, and the skip link.
- Time limits warn before they end and can be extended. Lists that update
  by themselves can be paused.
- Single-key shortcuts can be turned off. Use Ctrl or Alt with a letter.
- Every action that drags also works with a click or the keyboard.
- Words: say what happened and what to do next. Don't point at a colour,
  a shape or a place on the screen ("the green button on the right").

## Components to use

In `web-ui/src/lib/ui/`:

| Need | Use | What it does for you |
|---|---|---|
| A button or a link | `Button`, `IconButton` | Name, focus ring, disabled state. `IconButton` requires `label`. |
| A field | `Field` with `Input`, `Select`, `Textarea` | Label, hint and error tied to the control, `aria-invalid`, "(required)" next to the label when the control is required. |
| One of a few | `ChoiceList`, `Radio` | A real radio group with arrow keys. |
| A dialog or a side panel | `Dialog`, `Sheet` | Focus moves in and stays in, Escape closes, focus returns, the page behind is inert. |
| A menu | `MenuButton`, `Menu`, `MenuItem` | The ARIA menu pattern: arrows, Home, End, letters, Escape. |
| Tabs | `Tabs` | Roving focus, arrow keys, Home and End. |
| A table | `Table` | Caption, header cells, sort buttons, the number of rows said when loading ends. |
| Loading, empty and error | `States` | The sentence, and it is announced. |
| A short message | `toast.success()`, `toast.error()` | Announced; errors stay until closed and say "Error:" in words. |
| Anything else to say | `announce(text)` from `announce.svelte.ts` | One polite and one assertive live region that always exist. |
| A skip link | `SkipLink` | Already in every layout. |

A lint rule (`local/named-icon-control`) rejects a button or link that shows
only an icon without `aria-label`. Svelte's own checks reject positive
`tabindex` and click handlers on elements that aren't controls; don't
silence them without a comment that says why.

In the desktop client, use the shared widgets in `flutter/lib/common/widgets/`
(the `Nd*` widgets). They carry focus, `Semantics` with role, name and
state, and keyboard handling. A `GestureDetector` or `InkWell` alone is not
a control.

## How to test

In CI, on every pull request:

```sh
# Contrast of every colour pair in every palette, the lint rule, the components
cd web-ui && npx vitest run tests/unit/contrast.test.ts tests/unit/lint-named-icon-control.test.ts tests/unit/ui
# axe on every page, light and dark, 320 and 1280 px; keyboard-only tasks; focus not hidden; forced colours
npx playwright test e2e/a11y-routes.spec.ts e2e/a11y-tasks.spec.ts e2e/a11y-focus-obscured.spec.ts e2e/a11y-forced-colors.spec.ts
# The website: build checks and the headless accessibility test
npm run build && npm run test:a11y
```

`expectNoAxeViolations(page)` from `e2e/fixtures.ts` checks a state of a
page, such as an open dialog. Use it in the spec of every new dialog. Find
controls in tests by role and name (`getByRole('button', { name: 'Save
changes' })`), not by CSS class: a test that can't find a control by its
name has found a bug.

By hand, for every new screen:

1. Tab through it. Is every control reached, in an order that makes sense,
   with a visible focus ring? Can you leave every part of it?
2. Zoom to 200 %, then make the window 320 px wide. Nothing is cut off and
   nothing scrolls sideways except tables and code.
3. Turn on a Windows contrast theme (or emulate `forced-colors: active` in
   the browser's rendering tools). Can you still see the selected item, the
   focus and every border?
4. Turn on reduced motion in the system. Nothing slides or fades.
5. Run the screen reader checklist below.

## Screen reader checklist

Use NVDA with Firefox and Chrome, Narrator with Edge, and VoiceOver with
Safari on a Mac when you can. For the client: Narrator and NVDA on Windows,
Orca on Linux.

- [ ] The page title is read when the page opens, and the `h1` gets focus.
- [ ] The heading list (NVDA: Insert+F7) shows the page's outline.
- [ ] The landmark list shows banner, navigation, main and the page's own
      parts, each with a different name.
- [ ] Every control says its role, its name and its state ("Online, toggle
      button, pressed").
- [ ] A field says its label, "required" when it is, its hint, and its
      error after a failed save.
- [ ] A dialog says its title when it opens; browse mode can't leave it.
- [ ] Loading, saving, errors and new messages are said once, without
      moving focus.
- [ ] Tables say their caption, the number of rows and columns, and which
      column is sorted.
- [ ] On the remote screen, keys go to the remote computer, and F8 or
      Ctrl+Alt+Shift+K gives them back, which is said.
