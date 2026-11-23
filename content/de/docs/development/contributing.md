---
title: Mitmachen
description: Änderungen an NeoDesk vorschlagen: was ein Pull Request braucht, wie Commit-Nachrichten aussehen und was für Urheberrecht und Herkunft von Beiträgen gilt.
order: 1
---

NeoDesk wird im Repository [neodeskapp/neodesk](https://github.com/neodeskapp/neodesk) auf GitHub entwickelt. Änderungen kommen als Pull Requests gegen `main`, den einzigen Branch des Repositorys. Diese Seite beschreibt, was ein Pull Request braucht; [Aus dem Quellcode bauen](/docs/development/building) und [Tests und Prüfungen](/docs/development/tests-and-checks) beschreiben die Arbeit davor.

## Eine Änderung vorschlagen {#propose-a-change}

1. Forke das Repository und klone deinen Fork.
2. Lege einen Branch vom aktuellen `main` an.
3. Mach die kleinste Änderung, die das Problem löst. Ein Pull Request behandelt nur ein Anliegen.
4. Baue, was du geändert hast, und führe seine Tests aus, siehe [Tests und Prüfungen](/docs/development/tests-and-checks). CI führt am Pull Request alle Prüfungen aus.
5. Öffne den Pull Request gegen `main`.

Releases werden auf `main` getaggt. Die Details stehen in [Branches, Versionen und Releases](/docs/development/releasing).

Melde Sicherheitsprobleme vertraulich und nicht in einem öffentlichen Issue: Lege auf GitHub ein [Security Advisory](https://github.com/neodeskapp/neodesk/security/advisories/new) an. Den Ablauf beschreibt [SECURITY.md](https://github.com/neodeskapp/neodesk/blob/main/SECURITY.md).

## Regeln für Pull Requests {#pull-request-rules}

Die [Vorlage für Pull Requests](https://github.com/neodeskapp/neodesk/blob/main/.github/pull_request_template.md) fragt nach jedem dieser Punkte:

- **Ziel:** `main`.
- **Keine privaten Daten:** keine Zugangsdaten, privaten Schlüssel, Hostnamen, IP-Adressen, Pfade oder Konfiguration einer echten Installation. Nimm in Docs, Tests und Beispielen Beispieladressen wie `203.0.113.10`. Der Workflow Secret Scan schlägt bei einer Liste bekannter Fingerprints von Betreibern fehl.
- **Keine Secrets für Code aus Forks:** Füge keinen Workflow hinzu, der Code aus einem Fork mit den Secrets des Repositorys ausführt.
- **Herkunft:** Gib an, woher externer Code, erzeugte Dateien, Code für die Protokollkompatibilität und alles aus Upstream Übernommene stammen.
- **Sicherheitsänderungen:** Eine Änderung an Authentifizierung, Autorisierung oder einem Netzwerkpfad erklärt die Vertrauensgrenze, wer was darf, wo ihre Grenzen liegen und wie sie sich im Fehlerfall verhält.
- **Auslieferbar:** Die Änderung erreicht die Benutzer über den Updater der Konsole, die Installationsskripte oder das Docker-Image.
- **Datenbankänderungen:** additiv und sicher auf SQLite wie auf PostgreSQL, oder der Pull Request beschreibt den manuellen Schritt.
- **Änderungen an der env-Datei:** Neue Einstellungen kommen als fehlende Einträge dazu. Ein Update überschreibt nie, was ein Betreiber gesetzt hat.
- **Update und Rollback:** Berührt die Änderung Dateien der Installation oder den Server, prüfe, dass Update, Neustart und Rollback weiter funktionieren.
- **Tests:** Liste die genauen Befehle auf, die du ausgeführt hast, und ihre Ergebnisse.
- **Texte der Konsole:** Ein neuer oder geänderter Text hat seinen Schlüssel in jeder Sprachdatei, siehe [Übersetzungen](/docs/development/translations#add-a-text-to-the-console).
- **Namensnennung:** Nenne Mitwirkende und die Quellen von Meldungen und Entwürfen korrekt, und behalte Autor und Lizenz von wiederverwendetem Code bei.

Der Maintainer prüft jeden Pull Request (`.github/CODEOWNERS` trägt ihn für jeden Pfad ein). Er entscheidet, ob er den Patch so übernimmt oder eine geprüfte Alternative schreibt, und hält die Namensnennung in beiden Fällen korrekt.

## Code {#code}

- Der Server und seine Werkzeuge sind in Go geschrieben und liegen in `neodesk-server`. Die Web-Konsole ist Svelte und TypeScript und liegt in `web-ui`; ihre Regeln (nur Runes, keine Textliterale im Markup, Tokens für Styles, ein Unit-Test pro Komponente) stehen in [web-ui/README.md](https://github.com/neodeskapp/neodesk/blob/main/web-ui/README.md).
- Das Repository enthält kein eigenes JavaScript. Der Befehl `go run ./cmd/repotool check-js` in `neodesk-server` schlägt bei jeder eingecheckten `.js`-, `.mjs`- oder `.cjs`-Datei fehl, die nicht in `.github/javascript-allowlist.txt` steht. Jeder Eintrag dort braucht einen Kommentar, der sagt, warum die Datei JavaScript bleiben muss.
- Ein neues npm-Paket, dessen Code im Browser landet, muss unter MIT, ISC, 0BSD, BSD-2-Clause, BSD-3-Clause, Apache-2.0 oder der Unlicense stehen und seinen Lizenztext mitliefern. Sonst schlägt der Build der Web-App fehl. `THIRD_PARTY_NOTICES.md` listet dieselben Pakete.
- Schreibe Tests, die fehlschlagen, wenn das Verhalten kaputt ist, das sie abdecken, und prüfe, dass sie das tun, bevor du dich auf sie verlässt.

## Commit-Nachrichten {#commit-messages}

Commits auf `main` haben einen Betreff nach Conventional Commits, ohne Scope:

```text
fix: never press Ctrl+C on the device when a drag reaches the edge of the remote screen
feat: move a database between SQLite and PostgreSQL with neodesk-server migrate
```

- Der Typ ist einer von `feat`, `fix`, `refactor`, `chore`, `docs`, `test` und `ci`.
- Nach dem Doppelpunkt: kleingeschrieben, im Imperativ, ohne Punkt am Ende. Schreib, was sich für den Benutzer ändert, nicht welche Datei du angefasst hast.
- Setze die Nummer des Issues ans Ende des Betreffs, wenn es eins gibt: `... #1039`.
- Die meisten Commits brauchen nur einen Betreff. Eine große Änderung bekommt einen Nachrichtentext in normaler Prosa, der erklärt, warum.
- Schreibe nie `[version-bump]` in eine Commit-Nachricht, und beginne keinen Betreff mit `chore: bump version` oder `chore: release version`. Das gehört dem Workflow Version Bump: Go Server CI, Web UI CI und CDAP SDK CI überspringen einen Push, dessen letzter Commit die Markierung trägt, und Version Bump läuft bei diesen Betreffzeilen nicht.

Eine Änderung, die Benutzer bemerken, kann eine Zeile unter `## [Unreleased]` in `CHANGELOG.md` bekommen. Der Versions-Bump nach dem Merge legt diesen Abschnitt unter der neuen Versionsnummer ab.

## Lizenzierung von Beiträgen {#contributor-licensing}

NeoDesk wird unter der AGPL-3.0 verbreitet, wie [LICENSE](https://github.com/neodeskapp/neodesk/blob/main/LICENSE) und die Seite [Lizenz](/docs/project/license) beschreiben. Dieser Abschnitt ist die Richtlinie des Maintainers für Beiträge. Er ist keine Rechtsberatung.

### Urheberrecht {#copyright}

- Der Urheberrechtsvermerk in LICENSE nennt den Urheberrechtsinhaber des Projekts, UNITRONIX. Er überträgt das Urheberrecht an späteren Beiträgen nicht auf UNITRONIX. Mitwirkende behalten das Urheberrecht an originalem Code, den sie schreiben, sofern keine gesonderte schriftliche Vereinbarung etwas anderes sagt.
- Ein `Co-authored-by`-Trailer hält die Urheberschaft fest. Er ist keine Abtretung des Urheberrechts, keine Lizenzgewährung über die Projektlizenz hinaus und kein Versprechen exklusiven Eigentums. Erfinde dafür keine E-Mail-Adresse.
- Wo UNITRONIX keine Abtretung hat, bleiben das Urheberrecht der Mitwirkenden und die AGPL-Behandlung ihres Codes erhalten, und niemand beansprucht exklusives Eigentum daran.
- Wo UNITRONIX die exklusive Kontrolle über einen Beitrag braucht, bekommt es vor der Annahme des Codes eine schriftliche Abtretung des Urheberrechts oder eine passende Vereinbarung mit den Mitwirkenden. Diese Vereinbarung bleibt außerhalb des öffentlichen Repositorys; das Beitragsregister des Maintainers hält einen Verweis darauf fest.

### Direkter Beitrag und Clean-Room-Arbeit {#direct-contribution-and-clean-room-work}

Es gibt zwei Wege, und beide lassen sich offen prüfen:

- **Direkter Beitrag:** Urheberrecht, Herkunft, AGPL-Lizenz und Namensnennung der Mitwirkenden bleiben erhalten. Ein Pull Request ist keine Abtretung des Urheberrechts.
- **Clean-Room-Implementierung:** Der Code entsteht nur aus der geprüften Spezifikation, aus beobachtbarem Verhalten und aus unabhängig geschriebenen Testvektoren. Die Person, von der die Meldung oder der Entwurf stammt, wird dafür genannt, nicht als Autorin von Code, den sie nicht geschrieben hat.

Wenn ein externer Patch nicht direkt übernommen wird:

1. Die Spezifikationsrolle hält das Problem, das öffentliche Verhalten, die Sicherheitsinvarianten und unabhängig geschriebene Testvektoren fest.
2. Die Implementierungsrolle bekommt diese Spezifikation. Sie bekommt nicht den externen Patch, keine Kommentare aus dessen Quellcode, keine kopierten Tests und keine erzeugten Dateien.
3. Die Implementierung wird unabhängig für die Architektur von NeoDesk geschrieben und vor dem Merge auf ihre Herkunft geprüft.
4. Wer das Problem von außen gemeldet hat, wird für die Meldung, den Beitrag zum Entwurf oder das Testszenario genannt, und nur für das, was tatsächlich von ihm kam.

Fehlerberichte, Anforderungen, Beobachtungen am Protokoll und Testideen übertragen für sich genommen kein Urheberrecht an Implementierungscode. Kopiere keinen Code, keine Kommentare, keine Tests, keine erzeugten Ausgaben und keine markante Struktur eines externen Pull Requests in eine Clean-Room-Implementierung.

Code, der das Protokoll von RustDesk spricht, hat eigene Regeln und ein Release-Gate, siehe [Clean-Room-Herkunftsnachweis](/docs/development/provenance).

### Pflichten aus der AGPL {#agpl-obligations}

Diese Richtlinie fügt Code unter der AGPL keine proprietären Einschränkungen hinzu. Veränderter NeoDesk-Code, der weitergegeben wird, behält die AGPL-Hinweise, die Verfügbarkeit seines Quellcodes und das Angebot des Quellcodes an Benutzer über ein Netzwerk. Eine kommerzielle Rechteeinräumung oder eine Doppellizenz lässt sich nur für Material anbieten, dessen Urheberrecht und Genehmigungen Dritter UNITRONIX tatsächlich kontrolliert.

Bevor eine Implementierung, die auf fremder Arbeit beruht, gemergt wird, hält der Maintainer fest:

- das ursprüngliche Issue oder den ursprünglichen Pull Request und was davon tatsächlich verwendet wurde;
- ob der Code direkt übernommen, im Clean-Room-Verfahren neu geschrieben oder unter einer schriftlichen Abtretung oder Vereinbarung geliefert wurde;
- die Urheberrechts- und Lizenzhinweise, die gelten;
- die geplante Namensnennung in `CHANGELOG.md` oder in den Release Notes.
