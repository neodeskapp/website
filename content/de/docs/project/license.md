---
title: Lizenz
description: Die NeoDesk-Lizenz AGPL-3.0, Preis und Support, der Markenhinweis und die Drittanbieterhinweise.
order: 1
---

NeoDesk ist freie Software unter der GNU Affero General Public License, Version 3 (AGPL-3.0). Die [LICENSE-Datei](https://github.com/neodeskapp/neodesk/blob/main/LICENSE) im Repository enthält den vollständigen Text und die Hinweise, die diese Seite zusammenfasst. Wo die beiden voneinander abweichen, gilt die Datei. Keine von beiden ist eine Rechtsberatung.

NeoDesk ist eine veränderte Version von BetterDesk von UNITRONIX, veröffentlicht unter der AGPL-3.0. UNITRONIX hält das Urheberrecht, das die LICENSE-Datei nennt. NeoDesk wird von Linus Rath unter [neodeskapp/neodesk](https://github.com/neodeskapp/neodesk) gepflegt.

## AGPL-3.0 {#agpl-30}

- Du darfst NeoDesk nutzen, ändern und betreiben, für persönliche oder kommerzielle Zwecke.
- Änderst du NeoDesk und betreibst es als Netzwerkdienst, verlangt die AGPL, dass du deine Änderungen den Personen zugänglich machst, die diesen Dienst nutzen.
- Die AGPL-3.0 gilt für das gesamte Projekt im Repository: den Server und seine Konsole (`neodesk-server` und `web-ui`), die CDAP-SDKs (`sdks`), die CDAP-Bridges (`bridges`) und die Werkzeuge.

### Welche Versionen {#which-versions}

Die AGPL-3.0 gilt für alle Commits auf dem Entwicklungs-Branch seit Juni 2026. Die LICENSE-Datei nennt v3.4.0 als erstes stabiles Release unter der AGPL-3.0, und die Releases v3.3.x und älter bleiben unter der Apache License 2.0, so wie sie in ihren Release-Artefakten veröffentlicht sind. Das sind Releases des ursprünglichen Projekts, aus der Zeit vor NeoDesk.

NeoDesk selbst hat noch kein stabiles Release. Die Releases in neodeskapp/neodesk sind bisher Release Candidates von 3.6.0, alle unter der AGPL-3.0; siehe [Aktualisieren](/docs/operations/updating#releases-so-far).

Beiträge Dritter, die früher unter anderen Bedingungen übernommen wurden, hat der Maintainer, soweit zutreffend, zurückgezogen und unter der AGPL-3.0 neu erstellt.

## Preis und Support {#price-and-support}

NeoDesk ist kostenlos. Es gibt keine bezahlte Version, und jede Funktion steckt in dem Release, das alle bekommen.

Hilfe bei Fragen und Fehlern gibt es kostenlos auf dem [NeoDesk-Discord](https://discord.gg/nwERSawufr) und in den [Diskussionen auf GitHub](https://github.com/neodeskapp/neodesk/discussions). Bezahlten Support und Hilfe bei der Einrichtung gibt es auf Anfrage: Schreib an [support@neode.sk](mailto:support@neode.sk).

## Marke {#trademark}

RustDesk stammt von der [Purslane Tech Pte. Ltd.](https://rustdesk.com/terms) NeoDesk ist weder mit RustDesk noch mit Purslane Tech verbunden und wird von ihnen nicht unterstützt. NeoDesk ist ein unabhängiges Projekt, das das RustDesk-Protokoll für die Kompatibilität mit den Clients umsetzt. Den Namen „RustDesk“ verwendet es rein beschreibend.

Der RustDesk-Client ist eigenständige Software unter einer eigenen Lizenz.

## Clean-Room-Hinweis {#clean-room-notice}

Die LICENSE-Datei hält fest, dass der NeoDesk-Server (`neodesk-server`) eine unabhängige Clean-Room-Implementierung des Rendezvous- und Relay-Protokolls von RustDesk ist und keinen Code enthält, der vom RustDesk-Projekt abgeleitet ist. Sie hält außerdem fest, dass die Protokolldefinitionen (die `.proto`-Dateien) Nachrichtenformate für die Interoperabilität beschreiben und von keinem urheberrechtlich geschützten Quellcode abgeleitet sind.

## Hinweise zu Drittanbietern {#third-party-notices}

[THIRD_PARTY_NOTICES.md](https://github.com/neodeskapp/neodesk/blob/main/THIRD_PARTY_NOTICES.md) im Repository listet das Material von Dritten auf, das mit NeoDesk ausgeliefert wird. Eine laufende Konsole stellt außerdem die Lizenzen des Codes in ihrer Web-App unter `/licenses.txt` bereit, zum Beispiel `https://desk.example.com/licenses.txt`.
