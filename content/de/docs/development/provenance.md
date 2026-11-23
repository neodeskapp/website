---
title: Clean-Room-Herkunftsnachweis
description: Die Regeln für Code und Protokollschemas, die mit normalen RustDesk-Clients sprechen, der Clean-Room-Ablauf und das Release-Gate für Clean-Room-Aussagen.
order: 10
---

NeoDesk spricht mit dem normalen RustDesk-Desktop-Client. Ein Teil seines Codes folgt deshalb einem Protokoll, das NeoDesk nicht entworfen hat. Diese Seite ist das Herkunftsregister für diesen Teil: wie Kompatibilitätscode und Protokollschemas geschrieben werden und was nachgewiesen sein muss, bevor ein Release sie auf eine Weise beschreibt, die eine unabhängige Urheberschaft nahelegt. Sie gilt für alle, die das Repository ändern.

Das ist ein technischer Prozess zum Herkunftsnachweis und keine Rechtsberatung. Lizenzierung, Marken, Patente und die Rechte der Mitwirkenden brauchen eine fachkundige rechtliche Prüfung.

## Release-Gate {#release-gate}

Status: **Prüfung erforderlich.**

Der NeoDesk Support Agent ist ein NeoDesk-Produkt. Seine Kompatibilitätsschnittstelle zum normalen Desktop-Client darf nicht als Fork, als Klon, als unabhängig lizenzierbare Komponente oder als Clean-Room-Implementierung bezeichnet werden, bis dieses Register und die Nachweise dazu geprüft sind. Für den Server gilt dasselbe: Stelle in Code, Dokumentation und Release Notes keine Behauptung über Clean-Room-Entwicklung oder eine Neulizenzierung auf, bis das Register geprüft ist.

### Was die Prüfung umfasst {#what-the-review-covers}

- Die Protokollschemas in `neodesk-server/protos/`, die Kopie, die die Konsole ausliefert (`neodesk-server/console/static/files/protos/`), und den daraus erzeugten Code (`neodesk-server/proto/` und `web-ui/src/lib/remote/client/generated/`).
- Kompatibilitäts-Framing, Kryptografie, erzeugte Client-Konfiguration und Test-Fixtures.
- Binaries des Support Agent mit eigenem Branding und ihre Hinweise zu Drittkomponenten.

Ein Protokollname, eine Portnummer oder eine von außen sichtbare Interoperabilität gilt nie als Beweis, dass eine Implementierung unabhängig geschrieben wurde.

### Nachweise vor einem Kompatibilitäts-Release {#evidence-before-a-compatibility-release}

1. Halte für jedes Kompatibilitätsmodul und jedes Protokollschema Autor, Datum, maßgebliche Spezifikation und Prüfstatus fest.
2. Vergleiche die vier aktuellen Kopien der Protokollschemas mit den betreffenden externen Releases und bewahre das Ergebnis des Vergleichs für den Rechtsbeistand auf. Eine dokumentierte frühere Anweisung, ein Schema zu kopieren, ist ein Anlass für ein Audit und kein Beleg dafür, dass eine aktuelle Datei gefahrlos neu lizenziert werden kann.
3. Wo sich die Herkunft nicht nachweisen lässt, ersetze den betroffenen Code oder das Schema anhand einer neuen NeoDesk-Spezifikation. Umbenennen oder Umformatieren behebt das nicht.
4. Veröffentliche für jedes Artefakt, das verteilt wird, eine SBOM und `THIRD_PARTY_NOTICES`, auch für mitgelieferte Codec-, UI- und Vendor-Komponenten.
5. Halte das Ergebnis im Release-Protokoll fest, bevor irgendeine Aussage über Clean-Room-Entwicklung oder Lizenzierung gemacht wird.

## Clean-Room-Ablauf {#clean-room-workflow}

Die Implementierung entsteht aus zwei Eingaben, die voneinander getrennt bleiben:

1. **Die Spezifikationsrolle** hält nur öffentliche Standards und Black-Box-Beobachtungen normaler Clients fest: Paketmitschnitte, Zustandsänderungen, die von außen sichtbar sind, die öffentliche Portbelegung und Testvektoren, die sie selbst schreibt.
2. **Die Implementierungsrolle** bekommt die NeoDesk-Spezifikation und diese Vektoren. Sie bekommt keinen externen Quellcode, keine erzeugten Artefakte, keine kopierten Kommentare und keine Testdateien, die aus Quellcode abgeleitet sind.

Die Spezifikation ist versioniert. Jede neue Funktion auf Protokollebene nennt die Revision der Spezifikation, die sie umsetzt, und einen unabhängig erzeugten Testvektor.

Für Mitwirkende heißt das:

- Beurteile Herkunft oder urheberrechtlichen Status einer `.proto`-Datei nicht nach ihrer Rolle im Protokoll oder nach ihrem Dateikopf. Für die vorhandenen Schemas gilt das Release-Gate oben.
- Kopiere keinen externen Quellcode, keine erzeugten Artefakte, keine Kommentare und keine Test-Fixtures. Implementiere nur anhand der eigenen Spezifikationen von NeoDesk und unabhängig geschriebener Black-Box-Testvektoren.
- Füge keine direkten Importe von externem Quellcode hinzu, keine Anleitungen, Upstream-Code zu klonen oder zu bauen, und keine kopierten Protokollartefakte. Die einzige Ausnahme ist ein ausdrücklich genehmigtes Test-Fixture für die Kompatibilität, das seine Quellenangabe und seinen Hinweis trägt.

## Die Grenze des Support Agent {#the-support-agent-boundary}

Jede Kompatibilität des Support Agent mit dem Protokoll des Desktop-Clients muss hinter einem ausdrücklich benannten Kompatibilitätsadapter mit einer schmalen API liegen:

```text
Compatibility adapter -> Session authorizer -> Passive session core -> Platform services
```

Der Adapter darf nie eine für Benutzer sichtbare Oberfläche eines externen Clients, einen Ablauf für ausgehende Verbindungen oder eine Umgehung von Rechten schaffen. Er bekommt eine kurzlebige Sitzungsfreigabe, die der Server autorisiert hat, und kann nur eine eingehende Sitzung auf der Zielseite öffnen.

Die Seite des Servers dafür ist `neodesk-server/sessiongrant`: Es signiert eine Freigabe mit dem Ed25519-Schlüssel des Servers für genau eine Sitzung auf einem Gerät, gültig für höchstens 10 Minuten, und legt nie ein Passwort, einen Zwei-Faktor-Code, einen Geräte-Token oder ein anderes langlebiges Geheimnis hinein.

## Regeln für Schemas {#schema-rules}

- `neodesk-server/protos/` ist die maßgebliche Quelle der Schemas und gehört NeoDesk. `neodesk-server/console/static/files/protos/` ist eine eingecheckte Kopie, die die Konsole unter `/protos` ausliefert, und nie eine zweite Quelle.
- Der erzeugte Go-Code in `neodesk-server/proto/` ist eingecheckt. Kein CI-Job erzeugt ihn oder die ausgelieferte Kopie neu. Vergleiche deshalb beide von Hand mit dem maßgeblichen Schema, wenn es sich ändert. Die Nachrichten des Browsers erzeugt jeder Build, jeder Dev-Server und jeder Testlauf von `web-ui` aus dem maßgeblichen Schema (`web-ui/vite-plugins/protos.ts`); sie sind nicht eingecheckt.
- Die alten `hbb`-Namen bleiben am Rand des Protokolls. Neue Pakete, APIs und Dokumentation verwenden die Namen von NeoDesk.
- Eine Schemaänderung braucht einen Kompatibilitätstest und einen Eintrag zur Herkunft.

## Schutzmaßnahmen im Repository {#safeguards-in-the-repository}

- Die Vorlage für Pull Requests fragt, ob externer Code, erzeugte Artefakte, Code für die Protokollkompatibilität und von Upstream abgeleitetes Material eine dokumentierte Herkunft haben.
- Der Befehl `go run ./cmd/repotool check-provenance` in `neodesk-server` ist eine Leitplanke, die das [lokale Gate](/docs/development/tests-and-checks#the-local-gate) ausführt. Er prüft, dass `THIRD_PARTY_NOTICES.md` eine Kurzfassung dieser Richtlinie enthält (die Abschnitte „Clean-room workflow“ und „Release gate“) und die SBOM-Anforderung beschreibt. Außerdem prüft er, dass `.github/go-server-context.md` Mitwirkende weder anweist, externe Protokollschemas zu kopieren, noch behauptet, die `.proto`-Dateien trügen keine Urheberrechtsvermerke. Er kann keine unabhängige Urheberschaft beweisen und ersetzt weder eine Prüfung des Quellcodes noch eine rechtliche Prüfung.
