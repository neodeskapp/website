---
title: Die Kommandozeile neodesk
description: Wo der Befehl neodesk liegt, die Anmeldung mit einem API-Token, die ersten Befehle, Tabellen oder JSON und die Exit-Codes für Skripte.
order: 1
---

`neodesk` erledigt im Terminal, was die Web-Konsole kann: Geräte, Benutzer,
Einstellungen, Sicherungen und den Rest. Die Kommandozeile meldet sich mit
einem API-Token an und spricht mit der Adresse der Konsole, wie dein Browser,
und läuft deshalb auf dem Server oder auf deinem eigenen Computer. Diese Seite
hilft dir beim Einstieg; die [Befehlsreferenz](/docs/command-line/reference)
nennt jeden Befehl.

## Wo du sie findest {#where-to-find-it}

Die Kommandozeile steckt im Server-Binary. Sie läuft, wenn das Programm
`neodesk` heißt, oder als `neodesk-server cli` unter jedem Namen.

Im Docker-Image heißt der Befehl `neodesk`. Führ ihn im Container aus:

```bash
docker compose exec neodesk neodesk --help
```

Auf einer Linux-Installation ist `neodesk` der eigene Verwalter des
Installers, `/usr/local/sbin/neodesk`, nimm deshalb das Server-Binary mit
`cli`. Sein Ordner ist nur für root und den Dienst offen:

```bash
sudo /opt/neodesk/neodesk-server cli --help
```

Auf einer Windows-Installation:

```powershell
& 'C:\NeoDesk\neodesk-server.exe' cli --help
```

Für deinen eigenen Computer lade das Server-Binary für sein System von den
[Releases auf GitHub](https://github.com/neodeskapp/neodesk/releases): Linux
auf amd64, arm64 und armv7 oder Windows auf amd64. Speicher es als `neodesk`,
unter Windows als `neodesk.exe`, und mach es unter Linux ausführbar. Für macOS
gibt es keinen Build.

Die Beispiele unten schreiben `neodesk`. Auf einer Linux- oder
Windows-Installation setz den Befehl von oben an seine Stelle.

## Anmelden {#sign-in}

Erstell zuerst in der Konsole ein API-Token, siehe
[API-Tokens](/docs/command-line/api-tokens). Dann melde dich an:

```bash
neodesk login --url https://<console-address>
```

Setz für `<console-address>` die Adresse ein, mit der du die Konsole öffnest.
`neodesk login` fragt nach dem Token und zeigt es beim Einfügen nicht an. Es
prüft das Token bei der Konsole, speichert Adresse und Token für die nächsten
Befehle und nennt das Konto und das Token, mit dem es angemeldet ist. Ein Token
als Argument lehnt es ab, weil es sonst im Verlauf deiner Shell stehen bliebe;
leite es stattdessen aus einer Datei ein:

```bash
neodesk login --url https://<console-address> < token.txt
```

Die Einstellungen landen in `neodesk/config.json` im Konfigurationsordner
deines Benutzers, etwa `~/.config` unter Linux und `%AppData%` unter Windows.
Die Datei gehört dir allein: Die Kommandozeile lehnt eine Konfigurationsdatei
ab, die andere lesen dürfen oder die einem anderen Konto gehört. Das
gespeicherte Token geht nur an die Adresse, für die es gespeichert wurde.

- `neodesk config` zeigt die Datei und woher Adresse und Token kommen. Das
  Token selbst gibt es nie aus.
- `neodesk logout` vergisst das Token; mit `--revoke` widerruft es das Token
  vorher in der Konsole.

### Zertifikate und einfaches HTTP {#certificates-and-plain-http}

Die Kommandozeile prüft das Zertifikat der Konsole und folgt keinen
Weiterleitungen.

Die Skripte für Linux und Windows geben der Konsole auf Port 5443 ein
selbstsigniertes Zertifikat, das die Kommandozeile ablehnt (Exit-Code 9), bis
du ihm vertraust. Gib ihr die Zertifikatsdatei mit `--ca-cert`, und `login`
speichert sie mit der Adresse. Mit der Adresse deines Servers statt
`<server-address>`, auf dem Linux-Server:

```bash
sudo /opt/neodesk/neodesk-server cli login --url https://<server-address>:5443 \
  --ca-cert /opt/neodesk/ssl/neodesk.crt
```

Unter Windows ist die Datei `C:\NeoDesk\ssl\neodesk.crt`. Auf einem anderen
Computer kopier die Datei zuerst dorthin. `--insecure` überspringt die Prüfung
für einen Befehl und wird nie gespeichert. Hinter einem Reverse Proxy mit
einem Zertifikat, dem Browser vertrauen, meldest du dich mit der Adresse des
Proxys an und lässt `--ca-cert` weg.

Einfaches `http://` geht nur zum selben Rechner, `localhost` oder
`127.0.0.1`. Zu einem anderen Rechner braucht es `--allow-http`, und das Token
geht dann unverschlüsselt durchs Netz. Unter Docker, auf dem Server selbst:

```bash
docker compose exec neodesk neodesk login --url http://127.0.0.1:5000
```

Diese Anmeldung liegt im Container und ist weg, wenn der Container neu
angelegt wird, etwa bei einem Update.

### In Skripten {#in-scripts}

Ein Skript kann Adresse und Token bei jedem Aufruf nennen, statt sich
anzumelden. Mit dem Token in einer Datei und der Adresse deiner Konsole statt
`<console-address>`:

```bash
neodesk devices list --json \
  --url https://<console-address> --token-file token.txt
```

`NEODESK_URL` und `NEODESK_TOKEN` tun dasselbe wie `--url` und
`--token-file`. Ein Token aus einem Flag oder der Umgebung geht nur an eine
Adresse aus einem Flag oder der Umgebung, nie an die gespeicherte. `--token`
geht auch, zeigt das Token aber in der Prozessliste.

## Die ersten Befehle {#first-commands}

Jeder Befehl erklärt sich mit `--help`: seine Argumente, Flags, die
Berechtigung, die er braucht, und die Route der Konsole, die er aufruft.

```bash
neodesk devices list --help
```

Zeig, als wer die Kommandozeile handelt, was das Token darf und wann es
abläuft:

```bash
neodesk whoami
```

Zeig die Versionen, den Status und die Pfade des Servers:

```bash
neodesk server info
```

Liste die Geräte, die online sind:

```bash
neodesk devices list --status online
```

Zeig ein Gerät mit allen Details. Setz für `<device-id>` eine Geräte-ID aus der
Liste ein:

```bash
neodesk devices get <device-id>
```

Erstell eine Einladung mit Link und Code, die einen Computer hinzufügt, wie
[Computer hinzufügen](/docs/console/add-a-computer) in der Konsole. Das
braucht **Registrierungen genehmigen** und ein Token mit Lese- und
Schreibzugriff:

```bash
neodesk invites create --name "Empfang-PC"
```

Lies die letzten 20 Einträge des Audit-Protokolls, wofür du **Audit anzeigen**
brauchst:

```bash
neodesk audit list --limit 20
```

Sieh auf einer neuen Installation nach, welche Schritte der
[Einrichtungsanleitung](/docs/getting-started/first-sign-in/setup-guide)
erledigt sind:

```bash
neodesk setup-guide status
```

## Ausgabe {#output}

- Eine Liste erscheint als Tabelle, ein einzelner Datensatz als Zeilen
  `key: value`. Tabellen kürzen lange Werte mit „…“.
- `--json` gibt die ganze Antwort des Servers als JSON aus, für Skripte und
  `jq`.
- `--output` mit einem Dateinamen (oder `-o`) speichert die Antwort in diese
  Datei, für Downloads. Eine Datei gibt die Kommandozeile nicht im Terminal
  aus.
- Fehler gehen auf die Standardfehlerausgabe, als `neodesk:`, die Meldung des
  Servers und der HTTP-Status. Mit `--json` geht die Fehlerantwort des Servers
  auch auf die Standardausgabe.
- `-v` schreibt Methode, Adresse und Status jeder Anfrage auf die
  Standardfehlerausgabe.

Ein Befehl, der etwas endgültig löscht oder beendet, fragt vorher. Im Terminal
wartet er, bis du `yes` tippst; in einem Skript bricht er mit Exit-Code 2 ab,
außer du gibst `--yes` an.

## Exit-Codes {#exit-codes}

Die Exit-Codes bleiben von Release zu Release gleich, Skripte können sie also
prüfen:

| Code | Bedeutung |
|---|---|
| 0 | Erledigt |
| 1 | Der Server hat aus einem anderen Grund abgelehnt, oder etwas Unerwartetes ist schiefgegangen |
| 2 | Falscher Befehl, falsches Argument oder Flag, oder ein Befehl, der vorher fragt, bekam kein Ja |
| 3 | Kein Token, oder das Token wurde abgelehnt (HTTP 401) |
| 4 | Das Konto oder das Token darf das nicht (HTTP 403) |
| 5 | Nichts hat diese ID oder Adresse (HTTP 404) |
| 6 | Der Server hat die Eingabe abgelehnt, oder sie passt nicht zum Bestand (HTTP 400, 409, 413, 422) |
| 7 | Zu viele Anfragen, später noch einmal versuchen (HTTP 429) |
| 8 | Der Server ist gescheitert (HTTP 5xx) |
| 9 | Die Konsole war nicht erreichbar, oder ihr Zertifikat wurde abgelehnt |
| 10 | Die Konfigurationsdatei ist nicht nutzbar |

## Weitere Befehle der Kommandozeile selbst {#more-commands-of-the-command-line-itself}

- `neodesk describe` gibt jeden Befehl mit Argumenten, Flags, Berechtigung und
  Route als JSON aus; `--format markdown` gibt dasselbe als Markdown aus, und
  der Name einer Gruppe dahinter beschränkt es auf diese Gruppe.
- `neodesk api` schickt eine beliebige Anfrage an die API der Konsole, für das,
  was kein Befehl abdeckt, etwa `neodesk api GET /api/stats`.
- `neodesk completion` gibt ein Skript zur Vervollständigung für bash, zsh,
  fish oder PowerShell aus.
- `neodesk local` führt die eigenen Befehle des Server-Binarys auf diesem
  Rechner aus, etwa `backup`, `check` und `reset-password`. Sie lesen die
  Dateien des Servers und brauchen kein Token, sind also nur dort sinnvoll, wo
  der Server läuft.

Die [Befehlsreferenz](/docs/command-line/reference) hat jeden Befehl mit
seinen Flags, und die Flags, die jeder Befehl kennt.
