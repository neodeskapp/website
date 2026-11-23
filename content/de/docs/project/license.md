---
title: Lizenz
description: Die NeoDesk-Lizenz AGPL-3.0, der Commercial Grant für Sponsoren des Upstream-Projekts BetterDesk, der Markenhinweis und die Drittanbieterhinweise.
order: 1
---

NeoDesk ist freie Software unter der GNU Affero General Public License, Version 3 (AGPL-3.0). Die [LICENSE-Datei](https://github.com/neodeskapp/neodesk/blob/main/LICENSE) im Repository enthält den vollständigen Text und die Hinweise, die diese Seite zusammenfasst. Wo die beiden voneinander abweichen, gilt die Datei. Keine von beiden ist eine Rechtsberatung.

NeoDesk ist als Fork von BetterDesk entstanden, das UNITRONIX (Krzysztof Nienartowicz) unter [UNITRONIX/BetterDesk](https://github.com/UNITRONIX/BetterDesk) geschaffen hat und pflegt. UNITRONIX hält das Urheberrecht, das die LICENSE-Datei nennt. NeoDesk wird von Linus Rath unter [neodeskapp/neodesk](https://github.com/neodeskapp/neodesk) gepflegt.

## AGPL-3.0 {#agpl-30}

- Du darfst NeoDesk nutzen, ändern und betreiben, für persönliche oder kommerzielle Zwecke.
- Änderst du NeoDesk und betreibst es als Netzwerkdienst, verlangt die AGPL, dass du deine Änderungen den Personen zugänglich machst, die diesen Dienst nutzen.
- Die AGPL-3.0 gilt für das gesamte Projekt im Repository: den Server und seine Konsole (`neodesk-server` und `web-ui`), die CDAP-SDKs (`sdks`), die CDAP-Bridges (`bridges`) und die Werkzeuge.

### Welche Versionen {#which-versions}

Die AGPL-3.0 gilt für alle Commits auf dem Entwicklungs-Branch seit Juni 2026. v3.4.0 ist das erste stabile Release unter der AGPL-3.0. Die Releases v3.3.x und älter bleiben unter der Apache License 2.0, so wie sie in ihren Release-Artefakten veröffentlicht sind.

Beiträge Dritter, die früher unter anderen Bedingungen übernommen wurden, hat der Maintainer, soweit zutreffend, zurückgezogen und unter der AGPL-3.0 neu erstellt.

## Commercial Grant {#commercial-grant}

Die AGPL-3.0 gilt für alle. Der Commercial Grant ist eine optionale Ausnahme von ihrem Copyleft für deine privaten Patches an deinem eigenen Deployment. Er gilt für:

- Sponsoren von [UNITRONIX auf GitHub Sponsors](https://github.com/sponsors/UNITRONIX) mit 50 $ im Monat oder mehr: die Stufen Bronze, Silver und Gold
- Honorary Supporters

Die Stufen für 5 $ und 15 $ und [Buy Me a Coffee](https://buymeacoffee.com/unitronix) enthalten ihn nicht.

### Was der Grant erlaubt {#what-the-grant-allows}

Solange das berechtigende Sponsoring aktiv ist, darf die Organisation ein verändertes NeoDesk (private Patches, Branding) intern oder für Kunden betreiben, ohne diese privaten Änderungen unter der AGPL zu veröffentlichen, sofern sie:

- NeoDesk nicht als eigenständiges Produkt weiterverkauft (OEM)
- die Funktionen, die in das öffentliche Repository übernommen wurden, für alle offen hält

| Wo | Was gilt |
|---|---|
| Das öffentliche NeoDesk-Repository | Immer AGPL-3.0, immer offen |
| Dein privates Deployment | Mit dem Grant sind private Patches in Ordnung, solange du berechtigt bist |

### Beginn und Ende {#start-and-end}

Der Grant beginnt mit einem aktiven GitHub-Sponsors-Abonnement von 50 $ im Monat oder mehr oder mit dem Status als Honorary Supporter. Er endet, wenn das Sponsoring endet. Es gibt keine Zertifikate.

Den Grant nimmst du selbst in Anspruch. Die einzige Prüfung ist die Abrechnung über GitHub Sponsors oder der Status als Honorary Supporter: Es gibt keine Lizenzschlüssel, keine Zählung von Endpunkten und keine Audits, und keine Verträge, außer du fragst später nach einem großen Deal. Ein garantiertes SLA gibt es auch nicht; die bevorzugte Bearbeitung geschieht nach bestem Bemühen, wenn der Maintainer Zeit hat.

Eine kostenpflichtige kommerzielle Lizenz für OEM und Sonderfälle ohne Sponsoring wird vielleicht später angeboten. Für die normale Nutzung als Sponsor brauchst du keine. Fragen zum Grant stellst du in einem GitHub-Issue in [UNITRONIX/BetterDesk](https://github.com/UNITRONIX/BetterDesk/issues), und der Maintainer antwortet, wenn er Zeit hat.

## Marke {#trademark}

„RustDesk“ ist eine Marke des RustDesk-Teams. NeoDesk ist ein unabhängiges Projekt, das das RustDesk-Protokoll für die Kompatibilität mit den Clients umsetzt. Den Namen „RustDesk“ verwendet es rein beschreibend; das bedeutet weder eine Verbindung zum RustDesk-Team noch eine Billigung durch das RustDesk-Team.

Der RustDesk-Client ist eigenständige Software unter einer eigenen Lizenz.

## Clean-Room-Hinweis {#clean-room-notice}

Die LICENSE-Datei hält fest, dass der NeoDesk-Server (`neodesk-server`) eine unabhängige Clean-Room-Implementierung des Rendezvous- und Relay-Protokolls von RustDesk ist und keinen Code enthält, der vom RustDesk-Projekt abgeleitet ist. Sie hält außerdem fest, dass die Protokolldefinitionen (die `.proto`-Dateien) Nachrichtenformate für die Interoperabilität beschreiben und von keinem urheberrechtlich geschützten Quellcode abgeleitet sind.

## Hinweise zu Drittanbietern {#third-party-notices}

[THIRD_PARTY_NOTICES.md](https://github.com/neodeskapp/neodesk/blob/main/THIRD_PARTY_NOTICES.md) im Repository listet das Material von Dritten auf, das mit NeoDesk ausgeliefert wird. Eine laufende Konsole stellt außerdem die Lizenzen des Codes in ihrer Web-App unter `/licenses.txt` bereit, zum Beispiel `https://desk.example.com/licenses.txt`.
