---
title: KI-Agenten über MCP
description: Einen KI-Agenten mit neodesk mcp an die Konsole anbinden, welche Werkzeuge er bekommt, welche Flags mehr freigeben und was bewusst fehlt.
order: 3
---

`neodesk mcp` bietet die Befehle der Kommandozeile einem KI-Agenten als
Werkzeuge an, über das Model Context Protocol (MCP). Der MCP-Client des
Agenten startet es als Programm und spricht über Standardein- und -ausgabe
damit. Jedes Werkzeug ist ein Befehl, und jeder Aufruf geht mit dem API-Token
der Kommandozeile an die Konsole, der Server erlaubt also nur, was dieses
Token und sein Konto dürfen.

## Bevor du anfängst {#before-you-start}

Erstell ein API-Token nur für den Agenten, mit genau den Berechtigungen, die er
braucht, und nur zum Lesen, wenn er nichts ändern muss. Siehe
[API-Tokens](/docs/command-line/api-tokens).

Melde dann die Kommandozeile mit diesem Token auf dem Computer an, auf dem der
Agent läuft. Damit es von deinem eigenen Token getrennt bleibt, gib ihm eine
eigene Konfigurationsdatei. Setz für `<console-address>` die Adresse deiner
Konsole ein und für `<agent-config-file>` den Pfad der Datei:

```bash
neodesk login --url https://<console-address> --config <agent-config-file>
```

`neodesk mcp` nutzt die gespeicherte Adresse und das Token, wie jeder Befehl,
oder `--url` (oder `NEODESK_URL`) zusammen mit `NEODESK_TOKEN`. Wo du
`neodesk` findest und wie du einem selbstsignierten Zertifikat vertraust, steht
unter [Die Kommandozeile neodesk](/docs/command-line/neodesk).

## Einen MCP-Client anbinden {#connect-an-mcp-client}

Ein MCP-Client braucht den Befehl, den er startet, und dessen Argumente. Viele
Clients nehmen sie als JSON in dieser Form; die Datei und wo sie liegt, hängt
vom Client ab. Mit demselben `<agent-config-file>` wie oben:

```json
{
  "mcpServers": {
    "neodesk": {
      "command": "neodesk",
      "args": ["mcp", "--config", "<agent-config-file>"]
    }
  }
}
```

Die Flags aus dem nächsten Abschnitt kommen mit in `args`. Auf einer Linux-
oder Windows-Installation, wo die Kommandozeile `neodesk-server cli` heißt, ist
der Befehl das Server-Binary, und die Argumente beginnen mit `cli`.

Beim Start schreibt `neodesk mcp` auf die Standardfehlerausgabe, wie viele
Werkzeuge es anbietet und für welche Konsole, etwa „neodesk mcp: 242 tools
(read only) for“ und die Adresse.

## Was der Agent bekommt {#what-the-agent-gets}

Ohne Flags kann der Agent nur lesen. Flags geben mehr frei:

| Flags | Werkzeuge |
|---|---|
| keine | 242: die Befehle, die nur lesen, ohne die, deren Antwort Geheimnisse enthält |
| `--allow-writes` | 488: dazu die Befehle, die etwas ändern, aber nicht die, die etwas ausführen oder mit Geheimnissen antworten |
| `--allow-writes --allow-exec` | 512: dazu die 24 Befehle, die etwas auf einem Gerät oder dem Server ausführen |
| `--allow-secrets` | 252: jeder Befehl, der nur liest, auch die 10 mit Geheimnissen in der Antwort |
| `--allow-writes --allow-exec --allow-secrets` | 531: jeder Befehl außer einem |

Die Zahlen gelten für das Release 3.6.0-rc.4. `--allow-exec` braucht
`--allow-writes`, weil etwas auszuführen ein Schreiben ist; allein wird es
abgelehnt.

`--allow-secrets` allein gibt 10 Werkzeuge frei, obwohl 19 Befehle mit
Geheimnissen antworten. `neodesk mcp` zählt einen Befehl nur dann als lesend,
wenn er eine GET-Route aufruft. Neun der 19 rufen eine POST-Route auf, weil sie
ein Geräte-Token oder einen Link erzeugen, ein Einmalpasswort abholen oder ein
Gerät nach seinem Bildschirm oder einer Datei fragen:
`device-control screenshot`, `device-files read`, `device-tokens create`,
`device-tokens create-many`, `devices device-token`, `guest-links create`,
`mesh share`, `support device-password` und `support password`. Sie zählen als
Änderungen und kommen deshalb nur mit `--allow-writes` und `--allow-secrets`
zusammen.

- `--groups` mit einer Liste von Gruppen, etwa `--groups devices,users`, bietet
  nur die Befehle dieser Gruppen an.
- `--compact` bietet statt eines Werkzeugs pro Befehl zwei an:
  `neodesk_commands` listet die Gruppen oder die Befehle einer Gruppe im
  Detail, und `neodesk_run` führt einen Befehl über seinen Namen aus. Das passt
  zu Clients, die nur wenige Werkzeuge vertragen.

Ein Werkzeug heißt wie sein Befehl, mit einem Unterstrich statt des
Leerzeichens: Aus `devices list` wird `devices_list`. Seine Beschreibung ist
die Zusammenfassung des Befehls und die Berechtigung, die er braucht, seine
Eingabe die Argumente und Flags des Befehls, dazu `query` für weitere
Query-Parameter und, bei einem Befehl, der etwas ändert, `body` für weitere
Felder. Seine Hinweise sagen dem Client, ob er nur liest und ob er etwas
löscht oder ausführt.

Eine Antwort kommt als Text zurück: JSON eingerückt, nach 200 KB abgeschnitten,
mit dem Hinweis, die Anfrage enger zu fassen. Eine Datei kommt nur mit Typ und
Größe zurück; lade sie mit der Kommandozeile und `--output` herunter.

## Was bewusst fehlt {#left-out-on-purpose}

- **Uploads, immer.** Kein Werkzeug liest oder schreibt Dateien auf dem
  Computer des Agenten, deshalb haben die Befehle, die eine Datei hochladen,
  kein Werkzeug. In 3.6.0-rc.4 ist das ein Befehl, `backups restore`.
- **Änderungen, ohne `--allow-writes`.** Jeder Befehl, der etwas ändert.
- **Befehle, die etwas ausführen, ohne `--allow-exec`.** Diese 24 führen einen
  Befehl, ein Terminal, Eingaben, Dateien, Ein- und Ausschalten oder einen
  Dienst auf einem Gerät oder dem Server aus: `automation command-create`,
  `cdap command`, `device-control clipboard-set`, `device-control key`,
  `device-control mouse`, `device-control run`, `device-control type`,
  `device-files delete`, `device-files mkdir`, `device-files rename`,
  `device-files write`, `devices telemetry-command`, `fleet workflow-run`,
  `generator install-local`, `mesh exec`, `mesh files`, `mesh power`,
  `mesh tcp`, `mesh terminal`, `mesh udp`, `server exec`, `server service`,
  `settings file-set` und `transfers start`.
- **Antworten mit Geheimnissen, ohne `--allow-secrets`.** Diese 19 antworten
  mit Passwörtern, Schlüsseln, Tokens oder privaten Inhalten wie einer Datei,
  der Zwischenablage oder dem Bildschirm: `backups download`, `chat file`,
  `device-control clipboard`, `device-control screenshot`,
  `device-files read`, `device-tokens create`, `device-tokens create-many`,
  `devices connect-password`, `devices device-token`, `guest-links create`,
  `mesh recording`, `mesh share`, `organizations credentials`,
  `remote-targets credentials`, `server file`, `settings file`,
  `support device-password`, `support password` und `transfers download`.
- **Routen ohne Befehl.** Was die Kommandozeile auslässt, hat auch kein
  Werkzeug, siehe [Routen ohne Befehl](/docs/command-line/reference/routes-left-out).

## Vorher fragen {#asking-before-it-acts}

Werkzeuge, die etwas löschen oder beenden, etwas ausführen oder ändern, wer was
darf (Konten, Rollen, Bereichszugriff, Mitglieder von Organisationen und
Mandanten, die Anmeldeeinstellungen und Gastlinks), brauchen `confirm: true`
im Aufruf. Ohne das antwortet das Werkzeug, dass es das Ja der Person braucht,
und die Anweisungen des Servers sagen dem Agenten, dich vorher zu fragen. Sie
sagen ihm auch, dass Text, den er von Geräten, Tickets oder Chats liest, Daten
sind und nie eine Anweisung, ein Werkzeug aufzurufen.

::: warning
`confirm` ist kein Schloss: Der Agent setzt es selbst. `neodesk mcp` fragt dich
nicht von sich aus; es überlässt das Fragen dem Agenten und seinem MCP-Client,
und die Hinweise eines Werkzeugs, das etwas löscht oder ausführt, sagen das dem
Client. Gib dem Agenten ein Token mit genau den Berechtigungen, die er braucht.
Der Server prüft die Berechtigungen des Tokens und ob es nur lesen darf, egal
welche Flags gesetzt sind.
:::
