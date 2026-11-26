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
level AA. That also covers the European standard EN 301 549 and the German
BITV 2.0.

- **Web console:** partly conforms. The parts that don't yet are listed
  below.
- **Desktop client:** does not conform yet. On Windows, screen readers get
  nothing from it. We are fixing this first.
- **Website and documentation:** partly conforms. One colour pair is below
  the limit.
- **Mails:** conform, as far as we could test without real mail programs.

## How we tested

Last check: 26 November 2026.

- **Automated:** axe-core 4.14 on every page of the console, signed in and
  signed out, in light and dark, at 320 and 1280 pixels wide; on every
  template of the website at 320, 768 and 1280 pixels; on all 24 mails in
  light and dark. These checks run on every change to the code and stop it
  when they find a problem.
- **Contrast:** every colour pair the console uses, in every built-in theme
  and contrast mode, computed from the design tokens.
- **Keyboard:** the main tasks of the console, done with the keyboard
  alone in automated tests: find a computer and read its details, add a
  computer with an invite, answer a help request, send a chat message,
  change a setting and learn it was saved, create a user, read and act on a
  sign-in error, sign in with a pasted two-factor code.
- **By hand:** a review of the console, the website and the mails against
  each WCAG 2.2 A and AA success criterion, with 200 % zoom, a 320 pixel
  wide window, wider text spacing, forced colours as in Windows contrast
  themes, and reduced motion.
- **Desktop client:** Flutter's accessibility checks (tap targets, labels,
  text contrast) on the screens that can be tested without a server, and a
  review of its code.
- **Screen readers: not yet.** We have not yet tested with NVDA, JAWS,
  Narrator, VoiceOver, TalkBack or Orca. These tests are planned in our lab.
  We have no way to test VoiceOver on iOS and TalkBack yet. Until these
  tests are done, everything above about screen readers is what the code
  should give them, not what we heard.

## What doesn't work yet

| What | Who it affects | Planned |
|---|---|---|
| The desktop client on Windows gives screen readers no information at all. | Screen reader users | February 2027 |
| In the desktop client 1.5, several controls (title bar, tabs, settings pages, file lists, the connection request) can't be reached with the keyboard, and a remote session keeps the keyboard. | Keyboard and switch users | Fixed for the next client release, once checked in our lab |
| The desktop client 1.5 ignores the system's text size and high contrast setting. | People with low vision | Fixed for the next client release, once checked in our lab |
| On the website, code examples show keywords and the copy button in a blue that reaches 4.27:1 in light mode instead of 4.5:1. | People with low vision | Open |
| Mails were checked in a browser, not in real mail programs such as Outlook and Gmail, and not in their dark modes. | People who read mail with a screen reader or in dark mode | January 2027 |

The picture of a remote computer is a picture. Its content can't be read
out by NeoDesk. Everything around it can: the controls, the connection
state, who is connected, recording and privacy, chat, file transfer and the
clipboard. A screen reader user who needs the content of the remote screen
can run a screen reader on the remote computer and turn on the session's
sound. The remote screen never traps the keyboard. In the browser, F8 or
Ctrl+Alt+Shift+G gives it back; in the desktop client, Ctrl+Alt+Shift+G
(Command+Option+Shift+G on a Mac).

## Report a problem

Write to [support@neode.sk](mailto:support@neode.sk). Please tell us:

- where it happened: the page or window, and what you wanted to do
- what went wrong: what you expected and what you got
- what you use: your assistive technology and its version (for example NVDA
  2025.3), the browser or the NeoDesk client and its version, and the
  operating system
