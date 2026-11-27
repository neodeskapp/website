---
title: Aktualisieren
description: Eine Installation mit Docker, Linux oder Windows aktualisieren, den Release-Kanal wählen, die Seite Updates nutzen, die Version prüfen und zurückrollen.
order: 5
---

Wie du aktualisierst, hängt davon ab, wie du installiert hast. Eine Docker-Installation zieht ein neueres Image. Die Installer für Linux und Windows ersetzen das Binary des Servers und behalten deine Daten und Einstellungen, und die Seite **Updates** der Konsole kann das Binary ebenfalls ersetzen. Alle beziehen ihre Releases von neodeskapp/neodesk auf GitHub. Jedes Release bringt seine Installer und Compose-Dateien mit, und ein Update nimmt den neuen Installer aus dem Release, das es installiert.

## Die Releases bisher {#releases-so-far}

NeoDesk hat noch kein stabiles Release. Das neueste Release, {{VERSION}}, ist ein Release Candidate, und ein fertiges 3.6.0 gibt es noch nicht. Bis es das gibt, installiert der Kanal Stabil den neuesten Release Candidate, und das Image `latest` unter Docker ebenso.

## Eine Installation von 3.6.0-rc.4 aktualisieren {#update-a-360-rc4-install}

Eine Installation von 3.6.0-rc.4 oder älter braucht einen Schritt von Hand. Ihr Update-Befehl holt den Installer aus dem Branch main des Repositorys, wo er nicht mehr liegt. Unter Linux und Windows aktualisiert er den Server trotzdem, behält aber den alten Installer. Unter Docker bricht er mit einem Downloadfehler ab, bevor er etwas ändert. Führe den neuen Installer einmal so aus wie unten. Danach funktionieren die Update-Befehle weiter unten wieder. Die Seite **Updates** der Konsole ersetzt nur das Binary des Servers, deshalb ist der Schritt in jedem Fall einmal nötig.

Unter Linux:

```bash
curl -fsSL https://neode.sk/neodesk.sh | sudo bash -s -- --update
```

Er aktualisiert den Server, speichert den Installer als `neodesk-setup`, legt die Befehlszeile `neodesk` nach `/usr/local/bin` und verschiebt die Backups von `/opt/rustdesk-backups` nach `/opt/neodesk-backups`.

Unter Docker:

```bash
curl -fsSL https://neode.sk/install.sh | sudo bash
```

Eine Installation, die auf eine Version festgelegt ist, bleibt mit diesem Befehl auf ihr, zum Beispiel eine, die mit `--version 3.6.0-rc.4` installiert wurde; die Zusammenfassung am Ende sagt dann „pinned“. So bringst du sie auf das neueste Release und lässt sie wieder neuen Releases folgen:

```bash
curl -fsSL https://neode.sk/install.sh | sudo bash -s -- --version latest
```

Unter Windows öffnest du PowerShell als Administrator, lädst den Installer herunter und startest sein Update:

```powershell
Invoke-WebRequest https://neode.sk/neodesk.ps1 -OutFile $env:TEMP\neodesk.ps1 -UseBasicParsing
powershell -NoProfile -ExecutionPolicy Bypass -File $env:TEMP\neodesk.ps1 -Update
```

`-ExecutionPolicy Bypass` lässt das Skript auch laufen, wo die Ausführungsrichtlinie Skripte sperrt, wie unter Windows 10 und 11 standardmäßig.

Er speichert sich als `C:\NeoDesk\neodesk.ps1` und legt `neodesk` in den `Path` des Rechners.

## Der Port der Konsole nach dem Update {#the-consoles-port-after-the-update}

Der Standardport der Konsole ist seit 3.6.0-rc.5 3375; vorher war es 5000. HTTPS bleibt auf 5443.

- Installationen unter Linux und Windows behalten ihren Port. Die Installer haben den Port in die env-Datei jeder Installation geschrieben, und eine Installation, deren Einstellungen einen Port nennen, behält ihn.
- Docker-Installationen mit der mitgelieferten Compose-Datei wechseln beim nächsten Update mit dem Skript auf 3375, und das Update endet mit „The console now answers on port 3375; it was 5000“. Um bei 5000 zu bleiben, füge diese Zeile vor dem Update in `/opt/neodesk/docker/.env` ein, oder danach und aktualisiere noch einmal:

  ```ini
  NEODESK_CONSOLE_PORT=5000
  ```

- Ein eigener Reverse Proxy vor einer Docker-Installation muss nach dem Update an 3375 weiterleiten, außer du bleibst bei 5000. Mit `--domain` (Traefik) ändert sich für dich nichts: Die Konsole bleibt auf 443.

## Vor dem Update {#before-you-update}

Mach ein Backup, siehe [Backup und Wiederherstellung](/docs/operations/backup), und notiere die Version, die gerade läuft (siehe [Die Version prüfen](#check-the-version)), damit du zu ihr zurückkehren kannst.

## Release-Kanäle {#release-channels}

| Kanal | Was er installiert |
|---------|------------------|
| Stabil | Das neueste Release. Solange das Repository kein stabiles Release hat, das neueste Pre-Release, etwa einen Release Candidate. |
| Entwicklung | Den Entwicklungs-Build: das Pre-Release mit dem Tag `dev`, das neu aus `main` gebaut wird, wenn sich dort der Server oder die Web-App ändert. Dabei kann etwas kaputtgehen. |

Stabil ist der Standard. Eine Installation unter Linux oder Windows speichert ihren Kanal als `UPDATE_GITHUB_BRANCH` in der env-Datei: `main` für Stabil, `dev` für Entwicklung. Die Werte benennen den Kanal, keinen Git-Branch. Ändern kannst du ihn mit `--channel` (`-Channel` unter Windows), im Menü des Installers mit **Update**, dann **Switch update channel**, oder mit **Update-Kanal** auf der Seite **Updates** der Konsole.

Hat das Repository noch gar kein Release, nimmt eine neue Installation unter Linux oder Windows ohne angegebenen Kanal den Entwicklungs-Build und bleibt auf diesem Kanal. Wechsle zu Stabil, sobald ein Release erschienen ist, zum Beispiel unter Linux:

```bash
sudo neodesk-setup --update --channel stable
```

Unter Docker ist der Image-Tag der Kanal: `latest` ist das neueste Release (das neueste Pre-Release, solange es kein stabiles Release gibt, wie bei Stabil oben), `dev` der Entwicklungs-Build, und die Versionsnummer eines Releases legt dich auf genau dieses Release fest.

## Docker {#docker}

Im Ordner mit `docker-compose.yml` (`/opt/neodesk/docker` bei einer Installation mit dem Skript):

```bash
docker compose pull
docker compose up -d
```

Compose ersetzt den Container durch einen aus dem neuen Image, und die Datenbank, die Schlüssel und die Dateien der Konsole bleiben in ihren Volumes. Der Server aktualisiert seine Datenbanktabellen beim Start. Verfolge den Start und prüfe, ob der Container „healthy“ wird:

```bash
docker compose logs -f neodesk
docker compose ps
```

Mit dem Skript führst du es erneut aus oder gibst ihm den Befehl `update`:

```bash
sudo bash /opt/neodesk/docker/neodesk-docker.sh update
```

Es behält Kopien von `.env` und den Compose-Dateien, zieht das Image, stoppt den Container, speichert die Datenvolumes mit diesen Kopien als `.tar.gz` in `backups` im Installationsordner und startet das neue Image. Ist der neue Container nicht innerhalb von drei Minuten „healthy“, legt es die alten Einstellungen zurück und kehrt zum vorherigen Image zurück. Startet auch das nicht, spielt es die Daten aus dem Backup zurück. Haben sich Image und Einstellungen nicht geändert, ändert es nichts.

Das Skript ersetzt außerdem `docker-compose.yml` durch die Fassung des Releases, das der Image-Tag nennt, und sich selbst durch das `neodesk-docker.sh` dieses Releases, beide gegen die `SHA256SUMS` des Releases geprüft. Eine Compose-Datei, die du von Hand geändert hast, bleibt, und die neue wird daneben als `docker-compose.yml.new` gespeichert. Halte deine eigenen Änderungen in `docker-compose.override.yml` im selben Ordner, das Docker Compose ebenfalls liest.

Seit 3.6.0-rc.5 ist das Daten-Volume im Container unter `/opt/neodesk/data` eingebunden statt unter `/opt/rustdesk`. Das Update des Skripts ändert `/opt/rustdesk` in `.env`, in einer Compose-Datei, die du geändert hast, und in `docker-compose.override.yml` zu `/opt/neodesk/data`, und die alten Dateien bleiben in seinem Backup. Eine eigene Compose-Datei, die das Volume noch unter `/opt/rustdesk` einbindet, funktioniert weiter, und das Log des Containers sagt, dass du sie auf `/opt/neodesk/data` ändern sollst.

`NEODESK_IMAGE_TAG` in `.env` entscheidet, welches Image du bekommst, `latest`, solange du keinen Tag setzt. Ist dort eine Version festgelegt, holt `docker compose pull` nichts Neueres. Ändere dann zuerst den Tag, oder gib dem Skript `--tag latest` mit.

### Aus dem Repository gebaut {#built-from-the-repository}

Ein mit `install/docker-compose.single.yml` gebautes Image wird nicht gezogen. Hol den aktuellen Stand des Repositorys und baue im geklonten Ordner neu:

```bash
git pull
```

```bash
NEODESK_COMMIT_SHA=$(git rev-parse HEAD) docker compose -f install/docker-compose.single.yml up -d --build
```

## Linux {#linux}

```bash
sudo neodesk-setup --update
```

`neodesk-setup` ist der Installer, den die Installation als Befehl hinterlassen hat. `sudo neodesk --update` erreicht ihn ebenfalls. `--update` läuft ohne Rückfragen. Im Menü (`sudo neodesk-setup`) heißt dasselbe **Update**, dann **Update now**. Das Update:

1. erstellt das Backup des Installers in `/opt/neodesk-backups/neodesk_backup_<time>.tar.gz`, siehe [Backup und Wiederherstellung](/docs/operations/backup#cold-backup-of-a-linux-install),
2. holt das neue Binary und behält das alte als `neodesk-server.prev`,
3. ergänzt die env-Datei um Einstellungen, die in dieser Version neu sind, und behält deine Werte,
4. schreibt die systemd-Unit neu, startet den Dienst neu und prüft, ob API, Konsole, ID-Server und Relay antworten,
5. legt das alte Binary zurück, wenn das neue nicht hochkommt,
6. ersetzt `neodesk-setup` durch den Installer des Releases, das es installiert hat, geprüft gegen die signierten `SHA256SUMS` des Releases, und die Befehlszeile `neodesk` durch eine Kopie des neuen Binarys.

Ohne Optionen ist das neue Binary das neueste Release aus dem Kanal der Installation. Bevor es das alte ersetzt, wird es über seinen SHA-256-Hash und die Release-Signatur geprüft. Diese Optionen ändern, woher es kommt:

- `--channel dev` oder `--channel stable` wechselt zuerst den Kanal.
- `--from-source` baut es aus einem Checkout. Dafür brauchst du Go, und Node.js, außer `web-ui/build` existiert schon. Im Checkout:

  ```bash
  git pull
  sudo ./install/neodesk.sh --update --from-source
  ```

- `--binary <file>` installiert ein Binary, das du selbst gebaut hast.

## Windows {#windows}

In PowerShell als Administrator:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File C:\NeoDesk\neodesk.ps1 -Update
```

Es läuft wie das Update unter Linux ab: ein Backup nach `C:\NeoDesk-Backups`, das neue Binary, wobei das alte als `.prev` bleibt, die env-Datei zusammengeführt, der Dienst oder die geplante Aufgabe `NeoDeskServer` neu geschrieben und neu gestartet, das alte Binary zurück, wenn das neue scheitert, und die Kopie des Skripts durch das `neodesk.ps1` des Releases ersetzt, das es installiert hat. `-Channel`, `-FromSource` und `-Binary <path>` funktionieren wie unter Linux.

## Die Seite „Updates“ in der Konsole {#the-updates-page-in-the-console}

**Server**, **Updates** fragt GitHub nach einem neueren Release und kann es installieren.

Was die Seite tut:

- **Jetzt prüfen** sucht das neueste Release des Update-Kanals in neodeskapp/neodesk oder in dem Repository, das `UPDATE_GITHUB_OWNER` und `UPDATE_GITHUB_REPO` nennen. Solange es kein stabiles Release gibt, nimmt Stabil das neueste Pre-Release, wie die Installer. Die Seitenspalte zeigt den Kanal und das Repository, das die Seite fragt.
- **Install Update** lädt bei einer Installation unter Linux oder Windows das Binary dieses Releases für diesen Rechner in den Datenordner und prüft seine Größe, seinen SHA-256-Hash und die Release-Signatur. Dann startet es das Binary, um seine Version und seinen Commit mit dem Release zu vergleichen. Ist **Vor dem Update eine Sicherung erstellen** angehakt, speichert es das laufende Binary und ein vollständiges Backup der Daten. Danach setzt es das neue Binary ein und behält das alte als `neodesk-server.prev`, und der Dienst startet das neue. Wird das neue Binary innerhalb von drei Starts nicht bereit, legt der vierte Start das alte zurück, und die Seite zeigt das gescheiterte Update.
- **Update-Kanal** wählt **Stabil** oder **Entwicklung**. Die Wahl wird als `UPDATE_GITHUB_BRANCH` in der env-Datei gespeichert.
- **Sicherungen vor Updates** unter **Server**, **Sicherungen** listet die Backups auf, die jede Installation angelegt hat, mit **Diese Dateien wiederherstellen**, um das jeweilige Binary zurückzulegen. **Update-Sicherungen behalten** auf derselben Seite legt fest, wie viele es behält.

Release-Signaturen: Der Release-Schlüssel ist in den Server eingebaut. Ein Release ohne gültige Signatur wird abgelehnt. `UPDATE_MANIFEST_PUBLIC_KEY` fügt weitere Schlüssel hinzu, etwa für die eigenen Releases eines Forks.

Was die Seite nicht kann:

- Eine Docker-Installation aktualisieren. Unter Docker schaltet sie **Install Update** aus und zeigt `docker compose pull` und `docker compose up -d` mit dem Namen des Images, zum Beispiel `ghcr.io/neodeskapp/neodesk:latest`. Führe diese Befehle auf dem Host aus, wie oben gezeigt. Ein aus dem Repository gebautes Image zeigt dieselben Befehle, aber sie aktualisieren es nicht: Baue es stattdessen neu.
- Ein Update für ein Binary anbieten, das ohne seinen Commit gebaut wurde. Die Prüfung meldet dann, dass der Commit unbekannt ist.
- Ein Release installieren, das älter ist als die laufende Version.
- Den Dienst oder die Installer-Skripte neu schreiben. Nur das Binary wird ersetzt. Beim ersten Start ergänzt das neue Binary die env-Datei um die Einstellungen, die in diesem Release neu sind, wie es auch das Update des Installers tut. Sagen die Release Notes, dass sich der Dienst geändert hat, führe zusätzlich das Update des Installers aus.
- Die Befehlszeile einer Linux-Installation aktualisieren. `/usr/local/bin/neodesk` ist eine Kopie des Binarys, die nur root ersetzen darf, deshalb bleibt sie auf der älteren Version. Die Seite zeigt dann **Auch die Befehlszeile aktualisieren** mit `sudo neodesk-setup --update`, und `neodesk` meldet auf seiner Fehlerausgabe, dass es älter ist als der Server.

## Die Version prüfen {#check-the-version}

- In der Konsole: **Server**, **Updates** zeigt **Installierte Version**, und **Einstellungen**, **Allgemein** zeigt **Serverversion** unter **Serverinformationen**.
- Das Binary gibt sie aus. Unter Docker:

  ```bash
  docker compose exec neodesk neodesk-server -version
  ```

  Unter Linux:

  ```bash
  sudo /opt/neodesk/neodesk-server -version
  ```

  Unter Windows:

  ```powershell
  C:\NeoDesk\neodesk-server.exe -version
  ```

  Die Ausgabe sieht so aus:

  ```text
  neodesk-server {{VERSION}} (built <date>, commit <commit>)
  ```

  Ein mit `--from-source` gebautes Binary zeigt `built unknown`, und eines, das ohne seinen Commit gebaut wurde, lässt den Commit weg.

- Der Health-Check der API nennt sie ebenfalls:

  ```bash
  curl http://localhost:21121/api/health
  ```

- Mit dem Docker-Skript zeigt `sudo bash neodesk-docker.sh status` sie an.

## Zurückrollen {#roll-back}

Unter Linux und Windows behält das Update das vorherige Binary als `neodesk-server.prev`. Der Befehl `rollback` legt es zurück und behält das ersetzte als `.prev`, sodass ein zweiter Rollback den ersten rückgängig macht. Starte den Dienst danach neu:

```bash
sudo /opt/neodesk/neodesk-server rollback
sudo systemctl restart neodesk-server
```

```powershell
Stop-Service NeoDeskServer
& 'C:\NeoDesk\neodesk-server.exe' rollback
Start-Service NeoDeskServer
```

Unter Docker legst du in `.env` die Version fest, die vorher lief. Setze sie für `<previous-version>` ein und erstelle den Container danach neu:

```ini
NEODESK_IMAGE_TAG=<previous-version>
```

```bash
docker compose up -d
```

Bei einem aus dem Repository gebauten Image checkst du den Commit aus, der vorher lief, und baust neu. Check vor dem nächsten Update wieder deinen Branch aus.

Eine neuere Version kann die Datenbanktabellen geändert haben, und ein älteres Binary funktioniert damit vielleicht nicht. Verhält sich die alte Version nach einem Rollback seltsam, spiele das Backup zurück, das du vor dem Update gemacht hast.
