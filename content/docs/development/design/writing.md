---
title: Writing for the interface
description: How labels, buttons and messages in the console and the client are written, and the glossary of the words to use and the ones not to.
order: 5
icon: edit_note
---

The console and the client talk to people who want to get something done.
Their texts follow the same rules as the docs, plus a few for the interface.
The texts themselves live in the language files; see
[Translations](/docs/development/translations).

## Rules

- Plain words, short sentences, active voice. No marketing tone and no
  exclamation marks.
- Sentence case for every label, button, heading and menu item: "Add a
  computer", not "Add A Computer".
- One primary button per view.
- A button that asks for confirmation before it acts ends its label in "…".
- A field's hint says what goes in, and its effect line says when a change
  applies: "Applies right away", "After a restart".
- An empty value is one muted dash, or a word such as "Never".
- Use the same word for the same thing everywhere, from the glossary below.

## Glossary

| Use | Not |
|---|---|
| device | peer, machine, client (for the computer) |
| computer | device, in Add a computer and the join steps, where a person thinks of their PC |
| join, join requests, join mode | enroll, enrollment, registration, register |
| pairing code | pair agent, activation code |
| sign in, sign-in, sign out | log in, login, log out, authentication, auth |
| two-factor sign-in | 2FA, MFA, TOTP in labels (fine as search words) |
| single sign-on | OIDC / OAuth2 (SSO) as a title; the technical names stay in hints |
| directory (LDAP) | LDAP / Active Directory as a title |
| console | panel, web panel, dashboard (for the whole app) |
| Overview | dashboard, for the first page |
| appearance | branding, for colours and fonts |
| branding | appearance, for the name, the logo and the pages others see |
| theme | colour scheme, mode |
| setup profile | access rule, strategy |
| policy | rule, for policies |
| relay server | scaling |
| capacity test | server attestation |
| device identity | attestation |
| backup | archive, snapshot |
| time | time zones, as the name of the tab |
| network tools | toolkit |
| translations | languages, for the editor |
| remote session | remote desktop in browser, web client |
| help request | support request |
| quick support | support session, in labels |
| billing | commercialization |

German follows the same split: Gerät and Computer, beitreten and
Beitrittsanfragen (not Registrierung), anmelden (not einloggen),
Zwei-Faktor-Anmeldung, Darstellung and Branding, Sicherung.
