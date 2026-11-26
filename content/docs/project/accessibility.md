---
title: Accessibility statement
description: How accessible the NeoDesk console, desktop client, website and mails are today, how we tested, what doesn't work yet, and how to report a problem.
order: 3
icon: fact_check
---

NeoDesk wants everyone to be able to use it: with a screen reader, with a
keyboard alone, with a screen magnifier, in a high contrast theme, by voice
or with a switch. This statement says how far we are. It covers the web
console of NeoDesk {{VERSION}}, the desktop client 1.5, this website with
its documentation, and the mails the server sends.

## Standard and status

We measure against the Web Content Accessibility Guidelines (WCAG) 2.2,
level AA. The European standard EN 301 549 and the German BITV 2.0 use these
criteria for web content and add requirements of their own, which we have not
checked yet.

- **Web console:** partially conforms, not fully reviewed. The parts that
  don't yet are listed below.
- **Desktop client:** does not conform yet. On Windows, screen readers get
  nothing from it. We are fixing this first.
- **Website and documentation:** partially conforms, not fully reviewed. One
  colour pair is below the limit.
- **Mails:** partially conforms, not fully reviewed. They were only checked
  in a browser, not in real mail programs.

A full manual review against every WCAG 2.2 A and AA success criterion and
tests with screen readers are still open.

## How we tested

Last check: 26 November 2026. The checks of the console and the desktop
client belong to the changes for their next releases, which are in review.

- **Automated:** axe-core 4.14 on every page of the console, signed in and
  signed out, in light and dark, at 320 and 1280 pixels wide, and on all 24
  mails in light and dark. These checks run on every change to the console's
  code and stop it when they find a problem. On the website, axe-core checks
  sample pages of each kind in light and dark at 320 and 1280 pixels in a
  test we run by hand, and every build checks the markup (skip link,
  headings, the names of links, buttons, tables and scrolling areas) and
  stops when it finds a problem.
- **Contrast:** every colour pair the console uses, in every built-in theme
  and contrast mode, computed from the design tokens.
- **Keyboard:** the main tasks of the console, done with the keyboard
  alone in automated tests: find a computer and read its details, add a
  computer with an invite, answer a help request, send a chat message,
  change a setting and learn it was saved, create a user, read and act on a
  sign-in error, sign in with a pasted two-factor code.
- **Desktop client:** Flutter's accessibility checks (tap targets, labels,
  text contrast) on the screens that can be tested without a server.
- **Screen readers: not yet.** We have not yet tested with NVDA, JAWS,
  Narrator, VoiceOver, TalkBack or Orca. These tests are planned in our lab.
  We have no way to test VoiceOver on iOS and TalkBack yet. Until these
  tests are done, everything above about screen readers is what the code
  should give them, not what we heard.

## What doesn't work yet

| What | Who it affects | Status |
|---|---|---|
| The desktop client on Windows gives screen readers no information at all. | Screen reader users | Open |
| In the desktop client 1.5, several controls (title bar, tabs, settings pages, file lists, the connection request) can't be reached with the keyboard, and a remote session keeps the keyboard. | Keyboard and switch users | A fix for the next client release is in review; it ships once checked in our lab |
| The desktop client 1.5 ignores the system's text size and high contrast setting. | People with low vision | A fix for the next client release is in review; it ships once checked in our lab |
| On the website, code examples show keywords and the copy button in a blue that reaches 4.27:1 in light mode instead of 4.5:1. | People with low vision | Open |
| Mails were checked in a browser, not in real mail programs such as Outlook and Gmail, and not in their dark modes. | People who read mail with a screen reader or in dark mode | Open |

The picture of a remote computer is a picture. Its content can't be read
out by NeoDesk. Everything around it can: the controls, the connection
state, who is connected, recording and privacy, chat, file transfer and the
clipboard. A screen reader user who needs the content of the remote screen
can run a screen reader on the remote computer and turn on the session's
sound. In the browser the remote screen never traps the keyboard: F8 or
Ctrl+Alt+Shift+G gives it back. The desktop client 1.5 still keeps it (see
the table); the fix for the next client release gives it back with
Ctrl+Alt+Shift+G (Command+Option+Shift+G on a Mac).

## Report a problem

Write to [support@neode.sk](mailto:support@neode.sk). Please tell us:

- where it happened: the page or window, and what you wanted to do
- what went wrong: what you expected and what you got
- what you use: your assistive technology and its version (for example NVDA
  2025.3), the browser or the NeoDesk client and its version, and the
  operating system
