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

::: note
Die Unterstützung für Windows ist experimentell, und das Skript sagt das beim
Start. Linux ist die Hauptplattform: Hast du die Wahl, installiere mit
[Docker](/docs/getting-started/docker) oder unter [Linux](/docs/getting-started/linux).
Probleme meldest du auf [GitHub](https://github.com/neodeskapp/neodesk/issues).
:::

## Voraussetzungen {#requirements}

- 64-Bit-Windows.
- PowerShell, als Administrator ausgeführt. Sonst bricht das Skript ab.
- Zugriff auf neode.sk für den ersten Download und auf github.com,
  api.github.com und release-assets.githubusercontent.com, wo die Releases
  liegen. Für die öffentliche IP-Adresse des Rechners fragt das Skript
  ipv4.icanhazip.com, ifconfig.me und icanhazip.com. Gib diese Hosts frei, wenn
  ein Proxy oder eine Firewall nur bestimmte Hosts durchlässt.
- [NSSM](https://nssm.cc), wenn du einen Windows-Dienst willst. Das Skript
  findet es im `PATH` oder als `tools\nssm.exe` neben dem Skript. Es
  installiert NSSM nicht. Ohne NSSM läuft der Server als geplante Aufgabe unter
  SYSTEM, dem Konto mit den meisten Rechten unter Windows, statt unter einem
  eigenen Konto.
- Nur um den Server aus dem Repository zu bauen (`-FromSource`): git und
  Node.js 22.17 oder neuer mit npm im `PATH`. Fehlt der Befehl `go`, lädt das
  Skript Go 1.26.11 nach `C:\Go` herunter und trägt es in den System-`PATH`
  ein.

## Installieren {#install}

Öffne PowerShell als Administrator, lade das Skript in deinen Temp-Ordner und
führe es aus:

```powershell
Invoke-WebRequest https://neode.sk/neodesk.ps1 -OutFile $env:TEMP\neodesk.ps1 -UseBasicParsing
& $env:TEMP\neodesk.ps1
```

Die Installation legt eine eigene Kopie in `C:\NeoDesk` ab, die heruntergeladene
Datei kannst du danach löschen.

### Wenn PowerShell das Skript verweigert {#when-powershell-refuses-the-script}

Die Ausführungsrichtlinie von Windows entscheidet, ob ein Skript laufen darf:

- „Die Ausführung von Skripts ist auf diesem System deaktiviert“: der Standard
  unter Windows 10 und 11. Erlaube Skripte nur für dieses Fenster und führe das
  Skript erneut aus:

  ```powershell
  Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
  ```

- „ist nicht digital signiert“: Die Datei kam aus einem Browser, der Downloads
  aus dem Internet markiert. Entferne die Markierung und führe es erneut aus:

  ```powershell
  Unblock-File $env:TEMP\neodesk.ps1
  ```

- Eine Gruppenrichtlinie, die nur signierte Skripte erlaubt: Das Skript ist
  nicht signiert und läuft auf diesem Rechner nicht, und `-Scope Process`
  hebt die Richtlinie nicht auf.

`Set-ExecutionPolicy -Scope Process` gilt nur, bis du das Fenster schließt. Für
die Befehle, die du später ausführst, startest du das Skript über `powershell`
mit der Richtlinie für diesen einen Lauf, wie es die Befehle auf dieser Seite
tun:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File C:\NeoDesk\neodesk.ps1
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

Nach HTTPS fragt es nicht: Die Installation schaltet HTTPS mit einem
selbstsignierten Zertifikat selbst ein.

### Was das Skript macht {#what-the-script-does}

- Lädt oder baut den Server und installiert ihn als
  `C:\NeoDesk\neodesk-server.exe`.
- Schreibt die Einstellungen nach `C:\NeoDeskConsole\.env`, mit einem
  zufälligen Admin-Passwort.
- Erzeugt in `C:\NeoDesk\ssl` ein selbstsigniertes Zertifikat, das zehn Jahre
  gilt, und schaltet damit HTTPS für die Konsole ein. Die Client-API auf 21121
  bleibt bei einfachem HTTP, weil RustDesk-Clients ein selbstsigniertes
  Zertifikat ablehnen.
- Setzt den Beitrittsmodus einer neuen Installation auf **Verwaltet**,
  damit neue RustDesk-Clients auf eine Genehmigung warten.
- Beschränkt `C:\NeoDesk`, `C:\NeoDeskConsole` und `C:\NeoDesk-Backups` auf
  Administratoren, SYSTEM und `NT SERVICE\NeoDeskServer`, weil sie die
  Schlüssel und Einstellungen des Servers enthalten. Andere Benutzer des
  Rechners können sie nicht lesen.
- Registriert `NeoDeskServer`. Mit NSSM ist das ein Dienst, der mit Windows
  startet und unter einem eigenen Konto mit wenigen Rechten läuft,
  `NT SERVICE\NeoDeskServer`. Ohne NSSM ist es eine geplante Aufgabe, die beim
  Systemstart als SYSTEM läuft. Die Zeile **Runs as** der Zusammenfassung
  sagt, was du hast.
- Öffnet diese Ports in der Windows-Firewall, für alle Netzwerkprofile: 21115,
  21116 für TCP und UDP, 21117, 21121, 21122 für CDAP-Geräte-Agents, außer die
  env-Datei setzt `CDAP_ENABLED=N`, und die Ports 3375 und 5443 der Konsole.
  Sagt `TRUST_PROXY`, dass ein Reverse Proxy davor steht, schließt es die
  beiden Regeln der Konsole wieder.
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
| `-RunAsRoot` | Betreibt den Dienst mit NSSM als LocalSystem statt unter seinem eigenen Konto. Die geplante Aufgabe läuft ohnehin als SYSTEM. |
| `-Channel dev`, `-FromSource`, `-Binary <path>` | Woher der Server kommt, siehe oben. |

Willst du mit deinem eigenen Admin-Passwort starten, setze es zuerst im selben
Fenster. Setze für `<admin-password>` dein Passwort ein:

```powershell
$env:ADMIN_PASSWORD = '<admin-password>'
.\neodesk.ps1 -Auto
```

`.\neodesk.ps1 -Help` oder `Get-Help .\neodesk.ps1 -Full` listet alle
Parameter und Variablen.

## Admin-Zugangsdaten {#admin-credentials}

Die Zusammenfassung am Ende zeigt das Konto, mit dem du dich anmeldest:

```text
  First sign-in: user admin, password <password>
                 Copy the password now: it is not shown again.
```

Das Passwort besteht aus 16 zufälligen Buchstaben und Ziffern. Kopiere es
jetzt. Das Skript entfernt es aus der env-Datei, sobald der Server gestartet
ist, und eine Installation mit Rückfragen endet mit „Copy the admin password
above, then press Enter“, bevor etwas den Bildschirm leert.

Geht es verloren, gibt dieser Befehl dem Konto `admin` ein neues Passwort, das
aus `ADMIN_PASSWORD` oder ein zufälliges, und zeigt es einmal an:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File "C:\NeoDesk\neodesk.ps1" -ResetPassword
```

Im Menü des Skripts kannst du unter **Reset admin password** auch selbst eines
eintippen, mit mindestens 8 Zeichen. Hat der Admin auch Handy und
Wiederherstellungscodes der Zwei-Faktor-Anmeldung verloren, nimm stattdessen
`-ResetTwoFactor`: Das schaltet auch die Zwei-Faktor-Anmeldung des Kontos aus.
Siehe [Wenn der einzige Admin ausgesperrt ist](/docs/people/two-factor#if-the-only-admin-is-locked-out).

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File "C:\NeoDesk\neodesk.ps1" -ResetTwoFactor
```

Für ein anderes Konto siehe
[Admin-Passwort vergessen](/docs/operations/troubleshooting#forgot-the-admin-password).

## Adresse für die erste Anmeldung {#first-sign-in-address}

Am Ende gibt das Skript aus, was du als Nächstes brauchst: die Ports, die eine
Firewall außerhalb dieses Rechners durchlassen muss, dann die Zeile
**Web console** mit der Adresse der Konsole, **On your LAN** mit ihrer Adresse
in deinem eigenen Netzwerk, die erste Anmeldung, ID-Server, Relay-Server,
API-Server und Schlüssel für RustDesk-Clients, wie der Server läuft, und die
Befehle für später. Mit dem selbstsignierten Zertifikat einer frischen
Installation ist die Konsole unter `https://<server-address>:5443` erreichbar,
und `http://<server-address>:3375` führt dorthin. Dein Browser warnt wegen des
Zertifikats, weil keine Stelle, der er vertraut, es signiert hat.

In deinem eigenen Netzwerk nimmst du die Adresse aus **On your LAN**:
`http://<lan-address>:3375` führt zu `https://<lan-address>:5443`. Auf dem
Rechner selbst führt `http://localhost:3375` zu `https://localhost:5443`. Jeder
andere Name auf dem einfachen Port führt zur Adresse, die die Installation
gespeichert hat, der öffentlichen IP-Adresse, außer du hast eine andere
Relay-Adresse gewählt. Das Zertifikat deckt die öffentliche Adresse, die
LAN-Adresse und `localhost` ab. Für einen Hostnamen setzt du ihn im selben
Fenster, bevor du das Skript startest, mit dem Namen statt `<host-name>`:

```powershell
$env:SSL_DOMAIN = '<host-name>'
```

Für ein Zertifikat, dem Browser vertrauen, stellst du einen Reverse Proxy mit
TLS davor oder bringst dein eigenes Zertifikat mit: Hol es mit einem
ACME-Client oder von deiner Zertifizierungsstelle und wähle dann im Menü des
Skripts **Configure SSL certificates**, dann **Custom certificate**. Zertifikate
von Let's Encrypt holt das Skript unter Windows nicht selbst.

Halte die Konsole vom Internet fern, außer ein Reverse Proxy mit TLS steht
davor, siehe [Reverse Proxy und TLS](/docs/operations/reverse-proxy-tls). Ist
`TRUST_PROXY` für den Proxy gesetzt, schließt das Skript die Firewall-Regeln
der Konsole selbst. Ist dieser Rechner ohne Proxy aus dem Internet erreichbar,
entferne die beiden Regeln, die das Skript für die Ports der Konsole angelegt
hat:

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

Nur Administratoren, SYSTEM und das Dienstkonto `NT SERVICE\NeoDeskServer`
können die drei Ordner öffnen. Eine Installation von einem älteren Skript
bekommt diese Rechte beim nächsten Update oder mit `-RepairPermissions`. Die
Kommandozeile `neodesk` liest den API-Schlüssel in `C:\NeoDesk`, führe sie also
in einem Fenster aus, das als Administrator gestartet ist.

Der Server schreibt sein Log nach `C:\NeoDesk\logs\server.log`, als Dienst wie
als geplante Aufgabe. Ein Log über 10 MB wird beim nächsten Start zu
`server.log.1`.

Mit NSSM verwaltest du ihn wie jeden anderen Dienst:

```powershell
Get-Service NeoDeskServer
Restart-Service NeoDeskServer
```

Ohne NSSM führt die geplante Aufgabe `C:\NeoDesk\start-neodesk-server.cmd`
aus. Das startet den Server jedes Mal neu, wenn er sich beendet. Zum Neustarten
beendest du also den Server, und die Aufgabe startet ihn wieder:

```powershell
Get-ScheduledTask -TaskName NeoDeskServer
Stop-Process -Name neodesk-server -Force
```

Um eine Installation von der geplanten Aufgabe auf den Dienst umzustellen,
legst du `nssm.exe` in den `Path` oder nach `C:\NeoDesk\tools`, öffnest das
Menü des Skripts und wählst **Repair installation**, dann **Repair services**,
oder führst `-Update` aus.

Die env-Datei setzt **Verwaltet** nur als ersten Beitrittsmodus. Ein
Modus, den du in der Konsole wählst, bleibt nach einem Neustart erhalten. Was
die Modi bewirken, steht unter
[Beitrittsanfragen](/docs/console/enrollment).

## Später: aktualisieren, Diagnose und deinstallieren {#later-update-and-uninstall}

Führe sie in einem PowerShell- oder cmd-Fenster aus, das als Administrator
gestartet ist:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File "C:\NeoDesk\neodesk.ps1" -Update
powershell -NoProfile -ExecutionPolicy Bypass -File "C:\NeoDesk\neodesk.ps1" -Uninstall
```

Ohne Parameter öffnet das Skript sein Menü. **Diagnostics** zeigt dort den
Serverprozess, die Datenbank, die Ports und ob die API und die Konsole
antworten.

`-Uninstall` stoppt und entfernt den Dienst oder die geplante Aufgabe, seine
Firewall-Regeln und den Eintrag `C:\NeoDesk\bin` im `Path` des Rechners. Es
fragt, ob es vorher ein Backup machen soll und ob es `C:\NeoDesk`,
`C:\NeoDeskConsole` und die Backups in `C:\NeoDesk-Backups` löschen soll. Mit
zusätzlich `-Auto` macht es das Backup und behält die Ordner; mit zusätzlich
`-Purge` löscht es alle drei. Am Ende listet es, was es behalten hat. Updates
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
