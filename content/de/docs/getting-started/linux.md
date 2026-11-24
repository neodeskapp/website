---
title: Installation unter Linux
description: Installiere Server und Web-Konsole mit dem Skript neodesk.sh als einen systemd-Dienst.
order: 3
---

Das Skript `neodesk.sh` installiert NeoDesk auf einem Linux-Server als einen
systemd-Dienst, `neodesk-server`. Es lädt das neueste Release von
`neodesk-server` von GitHub herunter und prüft es vor der Installation.
Außerdem bleibt es als Befehl `neodesk` auf dem Rechner. Damit aktualisierst
und reparierst du die Installation später, legst Backups an und
deinstallierst sie. Diese Seite beschreibt die erste Installation.

## Voraussetzungen {#requirements}

- Root-Zugriff über `sudo`.
- systemd.
- Einer der Paketmanager, die das Skript kennt: apt-get, dnf, yum oder pacman.
  Damit installiert es `sqlite3`, `curl`, `wget`, `openssl`,
  `ca-certificates`, `iproute2` und `lsof`. Auf anderen Systemen installiere
  curl, openssl und SQLite selbst, bevor du anfängst.
- Ein 64-Bit-x86-, arm64- oder armv7-Prozessor.
- Zugriff auf github.com, wo die Releases liegen.
- Nur um den Server aus dem Repository zu bauen (`--from-source`): Node.js
  22.17 oder neuer mit npm. Fehlt Go 1.26.11 oder neuer, lädt das Skript es
  nach `/usr/local/go` herunter. Der Build braucht HTTPS-Zugriff auf die
  npm-Registry und auf proxy.golang.org, sum.golang.org und go.dev.

## Installieren {#install}

```bash
curl -fsSL https://raw.githubusercontent.com/neodeskapp/neodesk/main/neodesk.sh | sudo bash
```

Per Pipe an `bash` übergeben, hat das Skript kein Terminal für seine Fragen.
Es installiert deshalb mit den Standardwerten, wie bei `--auto`: SQLite,
die öffentliche IP-Adresse des Servers für das Relay und „P2P first“.

Willst du die Fragen beantworten, lade das Skript herunter und führe es aus:

```bash
curl -fsSL https://raw.githubusercontent.com/neodeskapp/neodesk/main/neodesk.sh -o neodesk.sh
sudo bash neodesk.sh
```

Das Skript öffnet sein Menü. Bewege dich mit den Pfeiltasten und wähle
**Fresh installation**, oder tippe `1`.

### Woher der Server kommt {#where-the-server-comes-from}

Standardmäßig installiert das Skript das neueste stabile Release von
neodeskapp/neodesk für diesen Prozessor. Solange es kein stabiles Release
gibt, nimmt es das neueste Pre-Release, etwa einen Release Candidate. Gibt es
auch das nicht und hast du keinen Kanal angegeben, installiert es den
Entwicklungs-Build. Spätere Updates folgen dann dem Entwicklungskanal, bis du
auf den stabilen Kanal umstellst:

```bash
sudo neodesk --update --channel stable
```

Bevor es einen Download installiert, prüft das Skript dessen SHA-256 gegen die
`SHA256SUMS` des Releases und das signierte Manifest des Releases gegen den
Release-Schlüssel. Ein Release ohne gültige Signatur lehnt es ab. Kann openssl
auf diesem Rechner die Signatur nicht prüfen (dafür braucht es OpenSSL 3),
meldet das Skript das und installiert nach der SHA-256-Prüfung; ab dem
nächsten Update prüft der installierte Server die Signatur selbst.

| Option | Woher der Server kommt |
|--------|------------------------|
| `--channel dev` | Der Entwicklungs-Build. Die Installation behält diesen Kanal für spätere Updates. |
| `--from-source` | Ein Build des Checkouts, in dem das Skript läuft, siehe [Aus dem Repository bauen](#build-from-the-repository). |
| `--binary <file>` | Ein `neodesk-server`-Binary, das du schon hast. |

### Was das Skript fragt {#what-the-script-asks}

1. **Datenbank.** SQLite, der Standard, oder PostgreSQL. Für PostgreSQL fragt
   das Skript nach Host, Port, Datenbank, Benutzer und Passwort, installiert
   PostgreSQL auf diesem Rechner und legt Benutzer und Datenbank an. Siehe
   [PostgreSQL](/docs/operations/postgresql).
2. **Relay-Adresse.** Die Adresse, die Clients für das Relay bekommen: die
   öffentliche IP-Adresse des Servers (der Standard), seine LAN-Adresse für
   einen Server, der nur dein lokales Netzwerk bedient, oder eine IP-Adresse
   oder ein Hostname, den du eintippst.
3. **Verbindungsstrategie.** „P2P first“, der empfohlene Standard, versucht
   eine direkte Verbindung zwischen den beiden Computern, bevor es das Relay
   nutzt. „Relay only“ schickt jede Sitzung über das Relay.
4. **TLS, am Ende.** Ob TLS an einem Reverse Proxy vor dem Server endet und ob
   HTTPS jetzt eingerichtet werden soll. Antworte bei beiden mit `n`, um die
   unten beschriebenen Standardwerte zu behalten. Siehe
   [Reverse Proxy und TLS](/docs/operations/reverse-proxy-tls).

### Was das Skript macht {#what-the-script-does}

- Installiert die Pakete von oben und legt den Systembenutzer `neodesk` an.
- Lädt oder baut `neodesk-server` und installiert ihn in `/opt/neodesk`.
- Schreibt die Einstellungen nach `/opt/NeoDeskConsole/.env`, mit einem
  zufälligen Admin-Passwort und Session-Secret. Außerdem setzt es die Adresse,
  an die der HTTP-Port der Konsole Browser weiterleitet
  (`PANEL_PUBLIC_HOST`): die Relay-Adresse, die du gewählt hast.
- Erzeugt in `/opt/neodesk/ssl` ein selbstsigniertes Zertifikat, das zehn
  Jahre gilt. Damit schaltet es HTTPS für die Konsole ein und TLS für ID- und
  Relay-Server. Die Client-API auf 21121 bleibt bei einfachem HTTP, weil
  RustDesk-Clients ein selbstsigniertes Zertifikat ablehnen. RustDesk-Clients
  ohne TLS können sich weiterhin verbinden.
- Schreibt `neodesk-server.service`, startet den Dienst und wartet, bis die
  API, die Konsole und die Ports 21116 und 21117 antworten.
- Öffnet diese Ports in ufw oder firewalld, wenn eines davon aktiv ist, oder
  legt iptables-Regeln an, wenn keines von beiden installiert ist: 21115, 21116
  für TCP und UDP, 21117, 21121, 21122 für CDAP-Geräte-Agents, außer die
  env-Datei setzt `CDAP_ENABLED=N`, und die Ports 5000 und 5443 der Konsole.
  Ein ufw oder firewalld, das installiert, aber ausgeschaltet ist, bleibt, wie
  es ist, und der Installer legt dann gar keine Regeln an. Wählst du danach
  bei der TLS-Frage einen Reverse Proxy auf demselben Server, schließt es die
  Ports der Konsole wieder. Ein Proxy auf einem anderen Rechner braucht sie:
  Beschränke ihre Regeln selbst auf die Adresse des Proxys. Firewalls
  außerhalb des Servers, etwa die eines Cloud-Anbieters, sind deine Sache; das
  Skript gibt die Liste aus.
- Speichert sich selbst als `/usr/local/sbin/neodesk`.

## Ohne Rückfragen installieren {#install-without-questions}

```bash
sudo bash neodesk.sh --auto
```

`--auto` überspringt das Menü und alle Fragen. Es wählt SQLite, die
öffentliche IP-Adresse für das Relay und „P2P first“ und fragt nichts zu TLS.
Läuft es erneut auf einem Rechner, auf dem NeoDesk installiert ist,
aktualisiert es die Installation. Diese Flags ändern, was es tut:

| Flag | Was es macht |
|------|--------------|
| `--relay-servers <address>` | Gibt Clients diese Relay-Adresse, eine IP-Adresse oder `host:port`. |
| `--relay-mode local` | Nutzt die LAN-Adresse des Servers für das Relay. |
| `--postgresql` | Installiert PostgreSQL auf diesem Rechner und nutzt es statt SQLite. |
| `--pg-uri <uri>` | Nutzt diese vorhandene PostgreSQL-Datenbank statt SQLite und installiert kein PostgreSQL. |
| `--minimal` | Installiert den Server mit ausgeschalteter Web-Konsole. |
| `--channel dev`, `--from-source`, `--binary <file>` | Woher der Server kommt, siehe oben. |

Die Flags funktionieren auch mit der Ein-Zeilen-Installation, hinter
`bash -s --`:

```bash
curl -fsSL https://raw.githubusercontent.com/neodeskapp/neodesk/main/neodesk.sh | sudo bash -s -- --relay-mode local
```

Das Skript liest auch Umgebungsvariablen, etwa `ADMIN_PASSWORD` für dein
eigenes Admin-Passwort. `sudo` verwirft Variablen, die du davor setzt, also
schreibe sie hinter `sudo`. Setze für `<admin-password>` dein Passwort ein:

```bash
sudo ADMIN_PASSWORD='<admin-password>' bash neodesk.sh --auto
```

`sudo bash neodesk.sh --help` listet alle Flags und Variablen.

## Admin-Zugangsdaten {#admin-credentials}

Während der Installation gibt das Skript das Konto aus, mit dem du dich
anmeldest:

```text
PANEL LOGIN CREDENTIALS
Login:    admin
Password: <password>
```

Das Passwort besteht aus 32 zufälligen Zeichen. Kopiere es jetzt. Das Skript
zeigt es nur einmal und entfernt es aus der env-Datei, sobald der Server
gestartet ist. Geht es verloren, setzt dieser Befehl das Passwort aus
`ADMIN_PASSWORD` oder ein zufälliges und zeigt es einmal an:

```bash
sudo neodesk --reset-password
```

Im Menü kannst du unter **Reset admin password** auch selbst eines eintippen,
mit mindestens 8 Zeichen.

## Adresse für die erste Anmeldung {#first-sign-in-address}

Am Ende gibt das Skript aus, was du als Nächstes brauchst:

```text
NeoDesk is installed

  Web console:   https://203.0.113.10:5443  (http://203.0.113.10:5000 leads there)
                 The certificate is self-signed, so the browser warns once.
  First sign-in: user admin, with the password shown above (it is not shown again)
  RustDesk clients (Settings > Network > ID/Relay server):
    ID server:     203.0.113.10
    Relay server:  203.0.113.10
    API server:    http://203.0.113.10:21121
    Key:           <the server's public key>
  Log:           sudo journalctl -u neodesk-server -f
  Settings:      /opt/NeoDeskConsole/.env (then: sudo systemctl restart neodesk-server)
  Update:        sudo neodesk --update
  Uninstall:     sudo neodesk --uninstall
```

Die Zeile **Web console** ist die Adresse der Konsole. Dein Browser warnt
wegen des Zertifikats, weil keine Stelle, der er vertraut, es signiert hat.
Die RustDesk-Zeilen sind das, was Clients brauchen, siehe
[Einen RustDesk-Client verbinden](/docs/getting-started/connect-a-client).

Weiter geht es mit [Die erste Anmeldung](/docs/getting-started/first-sign-in).

## Dateien und der Dienst {#files-and-the-service}

| Pfad | Inhalt |
|------|--------|
| `/opt/neodesk` | Das Binary `neodesk-server`, die Datenbank `db_v2.sqlite3`, das Schlüsselpaar `id_ed25519` und `id_ed25519.pub`, der API-Schlüssel `.api_key` und `ssl/` |
| `/opt/NeoDeskConsole` | Die Einstellungsdatei `.env` und der Ordner `data/` der Konsole |
| `/etc/systemd/system/neodesk-server.service` | Der Dienst. Er läuft als Benutzer `neodesk` und liest `/opt/NeoDeskConsole/.env`. |
| `/opt/rustdesk-backups` | Backups, die das Skript anlegt, zum Beispiel vor einem Update |
| `/usr/local/sbin/neodesk` | Das Skript, als Befehl für später |

```bash
sudo systemctl status neodesk-server
sudo journalctl -u neodesk-server -f
sudo systemctl restart neodesk-server
```

Eine neue Installation startet im Registrierungsmodus **Verwaltet**: Ein neuer
RustDesk-Client wartet unter **Registrierungsanfragen**, bis jemand ihn
genehmigt. Die env-Datei setzt das nur als ersten Modus; ein Modus, den du in
der Konsole wählst, bleibt. Siehe
[Registrierungsanfragen](/docs/console/enrollment).

## Später: der Befehl neodesk {#later-the-neodesk-command}

`sudo neodesk` öffnet dasselbe Menü wie das Skript. Ohne das Menü:

```bash
sudo neodesk --update
sudo neodesk --reset-password
sudo neodesk --uninstall
```

`--uninstall` macht ein Backup, entfernt dann den Dienst und behält die Daten.
Es listet, was auf dem Rechner übrig bleibt. `--uninstall --purge` löscht
außerdem `/opt/neodesk`, `/opt/NeoDeskConsole` und den Befehl.

## Aus dem Repository bauen {#build-from-the-repository}

Willst du eigene Änderungen betreiben, baue den Server aus einem Checkout:

```bash
git clone https://github.com/neodeskapp/neodesk.git
cd neodesk
sudo ./neodesk.sh --from-source
```

Wähle im Menü **Fresh installation** oder ergänze `--auto`. `--from-source`
baut die Web-App mit npm, baut sie in den Server ein und kompiliert den Server
mit Go. Siehe die Voraussetzungen oben.

## Nächste Schritte {#next-steps}

- [Die erste Anmeldung](/docs/getting-started/first-sign-in)
- [Einen RustDesk-Client verbinden](/docs/getting-started/connect-a-client)
- [Aktualisieren](/docs/operations/updating) und
  [Backup und Wiederherstellung](/docs/operations/backup)
