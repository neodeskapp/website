---
title: Texte in der Oberfläche
description: Wie Beschriftungen, Schaltflächen und Meldungen in Konsole und Client geschrieben werden, und das Glossar der Wörter, die gelten, und die nicht.
order: 5
---

Konsole und Client sprechen mit Menschen, die etwas erledigen wollen. Ihre
Texte folgen denselben Regeln wie die Doku, dazu ein paar für die Oberfläche.
Die Texte selbst stehen in den Sprachdateien; siehe
[Übersetzungen](/docs/development/translations).

Die Oberfläche der Konsole spricht auf Deutsch mit „Sie“, die Doku mit „du“.

## Regeln {#rules}

- Einfache Wörter, kurze Sätze, aktiv. Kein Werbeton und keine Ausrufezeichen.
- Satzanfang groß, sonst wie im Satz, bei jeder Beschriftung, Schaltfläche,
  Überschrift und jedem Menüeintrag: „Computer hinzufügen“, nicht „Computer
  Hinzufügen“.
- Eine Hauptschaltfläche pro Ansicht.
- Eine Schaltfläche, die vor der Aktion nachfragt, endet in ihrer
  Beschriftung auf „…“.
- Der Hinweis eines Felds sagt, was hineingehört, und seine Zeile zur Wirkung
  sagt, wann eine Änderung gilt: „Gilt sofort“, „Nach einem Neustart“.
- Ein leerer Wert ist ein gedämpfter Strich, oder ein Wort wie „Nie“.
- Dasselbe Ding hat überall dasselbe Wort, aus dem Glossar unten.

## Glossar {#glossary}

Die Wörter der englischen Oberfläche, wie sie gelten:

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

Deutsch folgt derselben Teilung: Gerät und Computer, beitreten und
Beitrittsanfragen (nicht Registrierung), anmelden (nicht einloggen),
Zwei-Faktor-Anmeldung, Darstellung und Branding, Sicherung.
