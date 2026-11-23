---
title: Die Installer
description: Für die Arbeit an den Installationsskripten: was jedes macht, woher es den Server holt, welche Regeln jeder Installer einhält und wie sie getestet werden.
order: 8
---

Das Repository hat vier Installationsskripte. Diese Seite ist für alle, die sie ändern. Wie du mit ihnen installierst, steht in [Installation mit Docker](/docs/getting-started/docker), [Installation unter Linux](/docs/getting-started/linux) und [Installation unter Windows](/docs/getting-started/windows).

## Die Skripte {#the-scripts}

| Skript | Läuft unter | Was es macht |
|--------|---------|--------------|
| `install.sh` | Linux | Der Einzeiler-Installer. Standardmäßig holt er `neodesk-docker.sh` und installiert mit Docker; mit `--native` klont er das Repository und führt `neodesk.sh --auto` aus. |
| `neodesk.sh` | Linux | Installiert `neodesk-server` als systemd-Dienst `neodesk-server`, und aktualisiert, repariert, sichert, diagnostiziert und entfernt ihn. |
| `neodesk.ps1` | Windows | Dasselbe unter Windows, mit dem Dienst `NeoDeskServer` oder einer geplanten Aufgabe mit diesem Namen. |
| `neodesk-docker.sh` | Linux mit Docker | Betreibt das veröffentlichte Image `ghcr.io/neodeskapp/neodesk` in einem Container, mit `docker-compose.yml` und `.env` in `/opt/neodesk/docker`. |

`install.sh` holt die anderen Skripte vom Branch `main`, außer `--branch` oder `NEODESK_BRANCH` nennt einen anderen. `--channel stable|dev` wählt den Release-Kanal einer nativen Installation.

Beide nativen Installer legen für spätere Läufe eine Kopie von sich ab: `neodesk.sh` als Befehl `/usr/local/sbin/neodesk`, `neodesk.ps1` als `C:\NeoDesk\neodesk.ps1`. Startest du eine Installation oder ein Update aus dieser Kopie, ersetzt sie sich durch die neueste aus `main` (`INSTALLER_REF` nennt einen anderen Branch).

Was beide nativen Installer brauchen, steckt als Befehle im Server-Binary, damit Bash und PowerShell nicht jeweils eine eigene Kopie davon mitbringen:

| Befehl | Wofür die Installer ihn nutzen |
|---------|--------------------------------|
| `neodesk-server check` | Der Health-Check nach einem Start: die Health-Adressen der API und der Konsole und die Signal- und Relay-Ports. |
| `neodesk-server backup` | Das Backup vor einem Update oder einer Deinstallation. |
| `neodesk-server env merge` | Schreibt bei einer Neuinstallation die env-Datei aus der Vorlage, die ins Binary eingebaut ist, und ergänzt bei einem Update nur die fehlenden Einträge. |
| `neodesk-server config check`, `config set` | Der Bericht über die Fähigkeiten und die Einstellungen der Allowlist, siehe [Konfigurationsbefehle](#configuration-commands). |
| `neodesk-server reset-password` | Ein neues Passwort für ein Konto, gelesen von der Standardeingabe. |
| `neodesk-server cert` | Das selbst signierte Zertifikat einer Installation. |
| `neodesk-server verify-release` | Prüft ein heruntergeladenes Binary gegen das signierte Manifest des Release. |
| `neodesk-server migrate` | Zieht eine Datenbank zwischen SQLite und PostgreSQL um. |
| `neodesk-server upgrade-env` | Macht aus der env-Datei der alten Node.js-Konsole die des Servers. |

## Woher der Server kommt {#where-the-server-comes-from}

`neodesk.sh` und `neodesk.ps1` installieren eins von drei Dingen:

- **Das Release des Update-Kanals** (Standard). Solange das Repository kein stabiles Release hat, nimmt der stabile Kanal das neueste Pre-Release, oder den Entwicklungs-Build, wenn es auch kein Pre-Release gibt; das Skript sagt, welches. Die Skripte laden das Binary für den Rechner herunter, prüfen seine SHA-256-Summe und prüfen es gegen das signierte `manifest.json` und `manifest.sig` des Release. Ein installierter Server prüft die Signatur mit `verify-release`. Unter Linux ohne installierten Server prüft `openssl` sie mit dem Release-Schlüssel im Skript. Eine Erstinstallation unter Windows prüft nur die SHA-256-Summe über HTTPS, weil Windows kein Werkzeug für die Signatur hat, bevor der Server installiert ist. `--skip-verify` (`-SkipVerify`) überspringt die Prüfungen.
- **Ein Binary, das du angibst:** `--binary <file>` (`-Binary <path>`).
- **Ein Build des Checkouts, in dem das Skript läuft:** `--from-source` (`-FromSource`). Das braucht Go, und Node.js, wenn `web-ui/build` nicht existiert. Das Go, das die Installer für diesen Build herunterladen oder akzeptieren, muss die Toolchain sein, die `neodesk-server/go.mod` nennt; `scripts/check-go-toolchain-pins.sh` prüft das.

`neodesk-docker.sh` zieht das Image mit dem Tag aus `.env` (`NEODESK_IMAGE_TAG`, Standard `latest`), nimmt mit `--no-pull` ein Image, das schon auf dem Rechner liegt, oder baut mit `--build` eins aus dem Checkout. Es liest kein GitHub-Release. Fehlt Docker, installiert es Docker mit dem Skript von get.docker.com; mit `--no-install-docker` bricht es stattdessen mit einem Fehler ab.

## Der Vertrag der Installer {#the-installer-contract}

Jeder Installer bietet diese Operationen an, oder er lehnt eine mit einer klaren Meldung und einem Exit-Code ungleich null ab:

1. **Preflight:** prüft Plattform, Rechte, Abhängigkeiten, beschreibbare Ordner, freien Speicherplatz, die Ports und den Netzwerkzugang. `--check-permissions` meldet, was die Konsole bei dieser Installation kann: aktualisieren, Einstellungen ändern, neu starten, Berechtigungen reparieren, sichern und den Zustand prüfen.
2. **Neuinstallation:** legt nur die Ordner und Dienste an, die sie braucht, behält Geheimnisse, die der Betreiber angegeben hat, richtet die gewählte Datenbank ein, setzt `PANEL_PUBLIC_HOST` auf die Adresse, die der Admin angibt oder die sie selbst erkennt, und endet mit einem Health-Check. Beide nativen Installer öffnen dieselben Ports: 21115 bis 21117 TCP und 21116 UDP, den Client-API-Port 21121, 21122, solange CDAP eingeschaltet ist, und die Ports der Konsole, außer `TRUST_PROXY` ist eingeschaltet, weil ein Reverse Proxy davor sitzt. Siehe [Ports und Firewall](/docs/operations/ports).
3. **Update:** holt ein vollständiges, geprüftes Binary oder Image, behält Daten und Einstellungen, startet den Dienst neu und prüft ihn. `neodesk-docker.sh` sichert zuerst die Daten und geht zum alten Image zurück, wenn der neue Container nicht healthy wird.
4. **Reparatur:** stellt fehlende Binaries, Berechtigungen, Dienstdefinitionen und TLS-Dateien wieder her. `--repair-permissions` kann beliebig oft laufen und löscht nie eine Datenbank, Schlüssel oder Docker-Volumes.
5. **Diagnose:** meldet Fehler und Warnungen, ohne etwas zu ändern.
6. **Backup:** Der Befehl `neodesk-server backup` kopiert die Datenbank konsistent (SQLite oder PostgreSQL), die env-Datei, die Daten der Konsole und die Zertifikate.
7. **Deinstallation:** entfernt jeden Dienst und jede Aufgabe, die der Installer angelegt hat, und behält die Daten. Nur `--purge` (`-Purge`) löscht auch Daten und Schlüssel, unter Docker die Volumes.
8. **Erneute Installation:** funktioniert nach einer Deinstallation ohne `--purge` und behält den Stand, den diese hinterlassen hat.

Eine Operation gilt erst als erledigt, wenn das Skript mit 0 endet, die installierte Version dem ausgerollten Code entspricht, der Dienst unter seinem vorgesehenen Konto läuft, die Health-Checks bestehen, Datenbank, Schlüssel und Einstellungen weiter funktionieren und ein erneuter Lauf keinen zweiten Dienst, keine zweite Regel, Datei oder Daten anlegt. Schlägt eine Operation fehl, bleiben das vorherige Binary und die Einstellungen nutzbar.

Regeln für jede Änderung:

- Überschreibe nie einen Wert in einer vorhandenen env-Datei mit einem Wert aus der Vorlage.
- Entferne nie eine Datenbank, Schlüssel, Volumes oder Firewall-Regeln ohne Bestätigung oder Purge-Flag.
- Richte nie eine sudoers-Regel ein, die ein Skript aus dem Repository als root ausführt. Ein Neustart aus der Konsole beendet den Prozess `neodesk-server`, und der Supervisor, den der Installer in `NEODESK_SUPERVISOR` nennt, startet ihn wieder: unter Linux die systemd-Unit, unter Windows NSSM oder die geplante Aufgabe, im Image die Restart-Policy von Docker.
- Melde nach einem teilweisen Update nie Erfolg, nur weil der Prozess neu gestartet ist.

### Konfigurationsbefehle {#configuration-commands}

Die Konsole und die Installer ändern Einstellungen nur über eine Allowlist: jeden Eintrag der env-Vorlage `neodesk-server/console/managedconfig/env.example`. Pfade, Ports und Schalter werden geprüft, die env-Datei wird vor dem Schreiben gesichert, und unbekannte Einträge werden abgelehnt. `neodesk-server config check` gibt den Bericht über die Fähigkeiten als JSON aus und endet mit 1, wenn ein Teil nicht bereit ist. Die Allowlist ist ins Binary einkompiliert. Wenn du `env.example` geändert hast, führe in `neodesk-server/console/managedconfig` diesen Befehl aus:

```bash
go generate
```

```bash
sudo ./neodesk.sh --check-permissions
sudo ./neodesk.sh --repair-permissions
sudo ./neodesk.sh --set-config HTTPS_ENABLED=true --set-config HTTPS_PORT=5443
```

```powershell
.\neodesk.ps1 -CheckPermissions
.\neodesk.ps1 -RepairPermissions
.\neodesk.ps1 -SetConfig "HTTPS_ENABLED=true","HTTPS_PORT=5443"
```

```bash
sudo bash neodesk-docker.sh --check-permissions
sudo bash neodesk-docker.sh --repair-permissions
sudo bash neodesk-docker.sh --set-config LOG_LEVEL=info
```

Die Konsole hat denselben Bericht unter `GET /api/settings/management/capabilities` und die Einstellungen der Allowlist unter `GET` und `PUT /api/settings/management/config`. `PUT` lehnt die Schlüssel ab, die nur auf dem Host gesetzt werden; siehe [Die Geheimnisse schützen](/docs/operations/security#protect-the-secrets).

### Health-Checks {#health-checks}

`neodesk-server check` ist auf jeder Plattform dieselbe Prüfung. Der Befehl erwartet von jeder Health-Adresse eine 2xx-Antwort oder eine 3xx mit `Location`, prüft über HTTPS, dass das Zertifikat für den Host gilt, und verbindet sich mit jedem `--port`. Er gibt pro Prüfung eine Zeile `PASS` oder `FAIL` aus und endet mit 1, wenn eine fehlgeschlagen ist. `--insecure` überspringt die Prüfung des Zertifikats, für ein selbst signiertes Zertifikat.

```bash
neodesk-server check \
  --api http://127.0.0.1:21114/api/health \
  --panel http://127.0.0.1:5000/health \
  --port 127.0.0.1:21116 --port 127.0.0.1:21117
```

Unter Linux und Windows liegt die API auf 21114 und die Client-API auf 21121. Unter Docker liegt die API auf 21121. Die Konsole liegt auf 5000, mit HTTPS auf 5443.

## Menüs {#menus}

`neodesk.sh` und `neodesk.ps1` zeigen Menüs, die du mit den Pfeiltasten bedienst, wenn sie in einem Terminal laufen, und sonst eine nummerierte Liste. `NEODESK_CLASSIC_MENU=1` erzwingt die nummerierte Liste; `neodesk.ps1` nutzt sie außerdem im Auto-Modus und wenn seine Ein- oder Ausgabe umgeleitet ist. Nur die Menüs nutzen Pfeiltasten; Fragen nach Hostname, Port, Passwort oder Pfad sind einfache Eingabeaufforderungen. `neodesk-docker.sh` nimmt Befehle an (`install`, `update`, `status`, `logs`, `backup`, `reset-password`, `postgres`, `uninstall`), und `menu` bietet dieselben Befehle als Menü an.

Jeder Installer trägt die Produktversion in seiner Versionszeile, die der Versions-Bump schreibt, siehe [die Produktversion](/docs/development/releasing#the-product-version).

## Tests {#tests}

Diese Tests laufen in Installer CI, ohne den Rechner zu verändern, auf dem sie laufen. Das [lokale Gate](/docs/development/tests-and-checks#the-local-gate) führt sie auch aus, außer dem Test des Windows-Installers:

| Test | Was er abdeckt |
|------|----------------|
| `bash -n` und `shellcheck --severity=error` | Jeder Bash-Installer und jedes Testskript. |
| `--help` von `install.sh`, `neodesk.sh` und `neodesk-docker.sh` | Die Hilfepfade, die den Host nicht verändern dürfen. |
| `scripts/test-go-installer.sh` | Das Upgrade von der Node.js-Konsole in `neodesk.sh`: die alten Units lesen, ihre Einstellungen in die env-Datei übernehmen und die eine neue Unit schreiben, in einem temporären Ordner ohne systemd. |
| `scripts/test-native-installer.sh` | Der Watchdog von `neodesk.sh` für lange Go-Befehle und seine Reparatur eines kaputten Clones. |
| `scripts/test-postgresql-hba.sh` | Die Einrichtung von `pg_hba.conf` für PostgreSQL. |
| `scripts/test-docker-installer.sh` | Die Funktionen von `neodesk-docker.sh`, mit Stubs für `docker`, `curl`, `ss` und `id`, danach `scripts/test-docker-entrypoint.sh` für die Startskripte des Images, die Dockerfiles und die Compose-Dateien. |
| `scripts/test-windows-installer.ps1` | Die Einrichtung von Dienst und Aufgabe in `neodesk.ps1`, mit Stubs für geplante Aufgaben, `icacls` und NSSM. Der Test läuft auch unter PowerShell auf Linux. |
| `scripts/check-supervisor-env.sh` | Die systemd-Unit und das Image nennen ihren Supervisor. |
| `scripts/check-go-toolchain-pins.sh` | Die Go-Versionen der Installer und der Docker-Builds passen zu `go.mod`. |
| PowerShell-Parsing | `neodesk.ps1` lässt sich ohne Fehler parsen. |
| `go test ./cli/... ./console/safepath/... ./console/updater/...` | Die Server-Befehle, die die Installer aufrufen, die Pfadprüfungen und der Updater. |

`scripts/test-docker-hardening.sh` braucht Docker: Es startet ein Image mit gehärteten Bind-Mounts und startet es neu. Installer CI führt es bei einem Start von Hand gegen einen veröffentlichten Tag aus, das lokale Gate gegen `neodesk:local`.

Was kein Skript testen kann, ist ein Installer auf einem echten Host. Führe vor einem Release jeden Installer auf Wegwerf-Rechnern mit Linux und Windows aus: Neuinstallation, Update, Reparatur, Backup und Wiederherstellung, Deinstallation und erneute Installation. Prüfe dabei, dass nichts doppelt angelegt wird (siehe [die Checkliste](/docs/development/releasing#before-a-stable-release)).
