---
title: Installation unter Windows
description: Installiere Server und Web-Konsole mit dem Skript neodesk.ps1 als Windows-Dienst.
order: 4
seoTitle: NeoDesk unter Windows installieren, RustDesk-kompatibel
---

Das Skript `neodesk.ps1` installiert NeoDesk auf einem Windows-Rechner. Es
betreibt den Server als Windows-Dienst namens `NeoDeskServer` oder, wenn NSSM
nicht installiert ist, als geplante Aufgabe mit demselben Namen. Es lädt das
neueste Release von `neodesk-server.exe` von GitHub herunter und legt eine
Kopie von sich selbst in `C:\NeoDesk` ab. Damit aktualisierst und reparierst
du die Installation später und legst Backups an. Diese Seite beschreibt die
erste Installation.

## Voraussetzungen {#requirements}

- 64-Bit-Windows.
- PowerShell, als Administrator ausgeführt. Sonst bricht das Skript ab.
- Zugriff auf github.com, wo die Releases liegen.
- [NSSM](https://nssm.cc), wenn du einen Windows-Dienst willst. Das Skript
  findet es im `PATH` oder als `tools\nssm.exe` neben dem Skript. Es
  installiert NSSM nicht. Ohne NSSM läuft der Server als geplante Aufgabe.
- Nur um den Server aus dem Repository zu bauen (`-FromSource`): git und
  Node.js 22.17 oder neuer mit npm im `PATH`. Fehlt der Befehl `go`, lädt das
  Skript Go 1.26.11 nach `C:\Go` herunter und trägt es in den System-`PATH`
  ein.

## Installieren {#install}

Öffne PowerShell als Administrator, lade das Skript herunter und führe es aus:

```powershell
Invoke-WebRequest https://neode.sk/neodesk.ps1 -OutFile neodesk.ps1 -UseBasicParsing
.\neodesk.ps1
```

Verweigert PowerShell das, weil das Ausführen von Skripten auf diesem System
deaktiviert ist, erlaube Skripte nur für dieses Fenster und führe das Skript
erneut aus:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

Das Skript öffnet sein Menü. Bewege dich mit den Pfeiltasten und wähle
**Fresh installation**, oder tippe `1`.

### Woher der Server kommt {#where-the-server-comes-from}

Standardmäßig installiert das Skript das neueste stabile Release von
neodeskapp/neodesk. Solange es kein stabiles Release gibt, nimmt es das
neueste Pre-Release, etwa einen Release Candidate. Gibt es auch das nicht und
hast du keinen Kanal angegeben, installiert es den Entwicklungs-Build. Spätere
Updates folgen dann dem Entwicklungskanal, bis du mit
`-Update -Channel stable` umstellst.

Das Skript prüft den SHA-256 des Downloads gegen die `SHA256SUMS` des
Releases. Windows hat kein Werkzeug, um die Signatur des Releases zu prüfen,
bevor `neodesk-server` installiert ist. Die erste Installation meldet das
deshalb und verlässt sich auf die SHA-256-Prüfung über HTTPS. Ab dem nächsten
Update prüft der installierte Server die Signatur und lehnt ein Release ohne
gültige Signatur ab.

| Parameter | Woher der Server kommt |
|-----------|------------------------|
| `-Channel dev` | Der Entwicklungs-Build. Die Installation behält diesen Kanal für spätere Updates. |
| `-FromSource` | Ein Build des Checkouts, in dem das Skript läuft, siehe [Aus dem Repository bauen](#build-from-the-repository). |
| `-Binary <path>` | Eine `neodesk-server.exe`, die du schon hast. |

### Was das Skript fragt {#what-the-script-asks}

1. **Datenbank.** SQLite, der Standard, oder PostgreSQL. Unter Windows
   installiert das Skript PostgreSQL nicht: Server und Datenbank müssen
   existieren, bevor du PostgreSQL wählst, und das Skript fragt nach ihrer
   Adresse und dem Passwort. Siehe [PostgreSQL](/docs/operations/postgresql).
2. **Relay-Adresse.** Die Adresse, die Clients für das Relay bekommen: die
   öffentliche IP-Adresse des Rechners (der Standard), seine LAN-Adresse für
   einen Server, der nur dein lokales Netzwerk bedient, oder eine IP-Adresse
   oder ein Hostname, den du eintippst.
3. **Verbindungsstrategie.** „P2P first“, der empfohlene Standard, versucht
   eine direkte Verbindung zwischen den beiden Computern, bevor es das Relay
   nutzt. „Relay only“ schickt jede Sitzung über das Relay.
4. **HTTPS, am Ende.** Ob HTTPS jetzt eingerichtet werden soll. Antworte mit
   `n`, um die unten beschriebenen Standardwerte zu behalten.

### Was das Skript macht {#what-the-script-does}

- Lädt oder baut den Server und installiert ihn als
  `C:\NeoDesk\neodesk-server.exe`.
- Schreibt die Einstellungen nach `C:\NeoDeskConsole\.env`, mit einem
  zufälligen Admin-Passwort.
- Erzeugt in `C:\NeoDesk\ssl` ein selbstsigniertes Zertifikat, das zehn Jahre
  gilt, und schaltet damit HTTPS für die Konsole ein. Die Client-API auf 21121
  bleibt bei einfachem HTTP, weil RustDesk-Clients ein selbstsigniertes
  Zertifikat ablehnen.
- Setzt den Registrierungsmodus einer neuen Installation auf **Verwaltet**,
  damit neue RustDesk-Clients auf eine Genehmigung warten.
- Registriert `NeoDeskServer`. Mit NSSM ist das ein Dienst, der mit Windows
  startet und unter einem eigenen Konto mit wenigen Rechten läuft,
  `NT SERVICE\NeoDeskServer`. Ohne NSSM ist es eine geplante Aufgabe, die beim
  Systemstart als SYSTEM läuft.
- Öffnet diese Ports in der Windows-Firewall, für alle Netzwerkprofile: 21115,
  21116 für TCP und UDP, 21117, 21121, 21122 für CDAP-Geräte-Agents, außer die
  env-Datei setzt `CDAP_ENABLED=N`, und die Ports 3375 und 5443 der Konsole.
- Startet den Server und wartet, bis die API, die Konsole und die Ports 21116
  und 21117 antworten.
- Speichert sich selbst als `C:\NeoDesk\neodesk.ps1`.
- Legt die Kommandozeile [`neodesk`](/docs/command-line/neodesk) in den `Path`
  des Rechners: `C:\NeoDesk\bin\neodesk.exe`, ein Link auf
  `neodesk-server.exe`. Ein neues Terminal findet sie.

## Ohne Rückfragen installieren {#install-without-questions}

```powershell
.\neodesk.ps1 -Auto
```

`-Auto` überspringt das Menü und alle Fragen. Es wählt SQLite, die öffentliche
IP-Adresse für das Relay und „P2P first“ und fragt nichts zu HTTPS. Läuft es
erneut auf einem Rechner, auf dem NeoDesk installiert ist, aktualisiert es die
Installation. Diese Parameter ändern, was es tut:

| Parameter | Was er macht |
|-----------|--------------|
| `-RelayServers <address>` | Gibt Clients diese Relay-Adresse, eine IP-Adresse oder `host:port`. |
| `-RelayMode local` | Nutzt die LAN-Adresse des Rechners für das Relay. |
| `-PgUri <uri>` | Nutzt diese vorhandene PostgreSQL-Datenbank statt SQLite. |
| `-Minimal` | Installiert den Server mit ausgeschalteter Web-Konsole. |
| `-RunAsRoot` | Betreibt den Dienst als LocalSystem statt unter seinem eigenen Konto. |
| `-Channel dev`, `-FromSource`, `-Binary <path>` | Woher der Server kommt, siehe oben. |

Willst du mit deinem eigenen Admin-Passwort starten, setze es zuerst im selben
Fenster. Setze für `<admin-password>` dein Passwort ein:

```powershell
$env:ADMIN_PASSWORD = '<admin-password>'
.\neodesk.ps1 -Auto
```

`.\neodesk.ps1 -Help` listet alle Parameter und Variablen.

## Admin-Zugangsdaten {#admin-credentials}

Während der Installation gibt das Skript das Konto aus, mit dem du dich
anmeldest:

```text
PANEL LOGIN CREDENTIALS
Login:    admin
Password: <password>
```

Das Passwort besteht aus 16 zufälligen Buchstaben und Ziffern. Kopiere es
jetzt. Das Skript zeigt es nur einmal und entfernt es aus der env-Datei,
sobald der Server gestartet ist. Geht es verloren, starte
`C:\NeoDesk\neodesk.ps1` und wähle **Reset admin password**. Das erzeugt ein
neues zufälliges Passwort oder setzt eines, das du eintippst, mit mindestens 8
Zeichen.

## Adresse für die erste Anmeldung {#first-sign-in-address}

Am Ende gibt das Skript aus, was du als Nächstes brauchst: die Zeile
**Web console** mit der Adresse der Konsole, dann ID-Server, Relay-Server,
API-Server und Schlüssel für RustDesk-Clients und die Ports, die eine Firewall
außerhalb dieses Rechners durchlassen muss. Mit dem selbstsignierten
Zertifikat einer frischen Installation ist die Konsole unter
`https://<server-address>:5443` erreichbar, und `http://<server-address>:3375`
führt dorthin. Dein Browser warnt wegen des Zertifikats, weil keine Stelle,
der er vertraut, es signiert hat.

Halte die Konsole vom Internet fern, außer ein Reverse Proxy mit TLS steht
davor, siehe [Reverse Proxy und TLS](/docs/operations/reverse-proxy-tls). Ist
dieser Rechner aus dem Internet erreichbar, entferne die beiden Regeln, die das
Skript für die Ports der Konsole angelegt hat:

```powershell
Remove-NetFirewallRule -DisplayName "NeoDesk - NeoDesk web console", "NeoDesk - NeoDesk web console HTTPS"
```

Weiter geht es dann mit
[Die erste Anmeldung](/docs/getting-started/first-sign-in).

## Dateien und der Dienst {#files-and-the-service}

| Pfad | Inhalt |
|------|--------|
| `C:\NeoDesk` | Der Server `neodesk-server.exe`, die Datenbank `db_v2.sqlite3`, das Schlüsselpaar `id_ed25519` und `id_ed25519.pub`, der API-Schlüssel `.api_key`, die Schlüsseldatei der gespeicherten Anmeldung `.device_vault_key`, `ssl\`, `logs\`, die Kopie des Skripts, `neodesk.ps1`, und `bin\neodesk.exe`, die Kommandozeile |
| `C:\NeoDeskConsole` | Die Einstellungsdatei `.env` und der Ordner `data\` der Konsole |
| `C:\NeoDesk-Backups` | Backups, die das Skript anlegt, zum Beispiel vor einem Update |

Der Server schreibt sein Log nach `C:\NeoDesk\logs\server.log`, als Dienst wie
als geplante Aufgabe.

Mit NSSM verwaltest du ihn wie jeden anderen Dienst:

```powershell
Get-Service NeoDeskServer
Restart-Service NeoDeskServer
```

Ohne NSSM führt die geplante Aufgabe `C:\NeoDesk\start-neodesk-server.cmd`
aus. Das startet den Server jedes Mal neu, wenn er sich beendet:

```powershell
Get-ScheduledTask -TaskName NeoDeskServer
Start-ScheduledTask -TaskName NeoDeskServer
```

Die env-Datei setzt **Verwaltet** nur als ersten Registrierungsmodus. Ein
Modus, den du in der Konsole wählst, bleibt nach einem Neustart erhalten. Was
die Modi bewirken, steht unter
[Registrierungsanfragen](/docs/console/enrollment).

## Später: aktualisieren und deinstallieren {#later-update-and-uninstall}

```powershell
& 'C:\NeoDesk\neodesk.ps1' -Update
& 'C:\NeoDesk\neodesk.ps1' -Uninstall
```

`-Uninstall` stoppt und entfernt den Dienst oder die geplante Aufgabe. Es
fragt, ob es vorher ein Backup machen soll und ob es `C:\NeoDesk` und
`C:\NeoDeskConsole` löschen soll. Mit zusätzlich `-Auto` macht es das Backup
und behält beide Ordner; mit zusätzlich `-Purge` löscht es sie. Updates
beschreibt [Aktualisieren](/docs/operations/updating).

## Aus dem Repository bauen {#build-from-the-repository}

Willst du eigene Änderungen betreiben, baue den Server aus einem Checkout:

```powershell
git clone https://github.com/neodeskapp/neodesk.git
cd neodesk
.\install\neodesk.ps1 -FromSource
```

Wähle im Menü **Fresh installation** oder ergänze `-Auto`. `-FromSource` baut
die Web-App mit npm, baut sie in den Server ein und kompiliert den Server mit
Go. Siehe die Voraussetzungen oben.

## Nächste Schritte {#next-steps}

- [Die erste Anmeldung](/docs/getting-started/first-sign-in)
- [Einen RustDesk-Client verbinden](/docs/getting-started/connect-a-client)
- [Aktualisieren](/docs/operations/updating) und
  [Backup und Wiederherstellung](/docs/operations/backup)
