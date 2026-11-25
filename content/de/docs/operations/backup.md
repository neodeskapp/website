---
title: Backup und Wiederherstellung
description: Was du je Installationsart sicherst, was die Konsole sichert, kalte Backups der Docker-Volumes, das Wiederherstellen und warum die Schlüsseldatei zählt.
order: 6
---

Eine NeoDesk-Installation hält ihren Zustand in einer Datenbank und in einigen Dateien daneben. Diese Seite listet sie für jede Installationsart auf, erklärt, was die Seite **Sicherung** der Konsole speichert, und zeigt, wie du eine vollständige Kopie anlegst und wiederherstellst.

## Warum die Schlüsseldatei zählt {#why-the-key-file-matters}

Die Identität des Servers ist sein Ed25519-Schlüsselpaar, `id_ed25519` und `id_ed25519.pub`. Die öffentliche Hälfte ist der **Schlüssel**, den jeder RustDesk-Client in seinen Netzwerkeinstellungen hat, und die Clients prüfen ihn bei jeder Verbindung. Findet der Server beim Start keine Schlüsseldatei, erzeugt er ohne Rückfrage ein neues Paar. Danach braucht jeder Client den neuen Schlüssel, bevor er sich wieder verbindet.

Sichere die Schlüsseldateien deshalb zusammen mit der Datenbank, und stelle beide gemeinsam wieder her. Eine Datenbank ohne ihre Schlüssel gibt dir deine Geräte und Konten zurück, aber nicht deine Clients.

`.device_vault_key` liegt im selben Ordner wie das Schlüsselpaar und enthält den Schlüssel der Angaben für die [gespeicherte Anmeldung](/docs/console/saved-sign-in) und der Gerätepasswörter, die Organisationen in ihrem Adressbuch speichern. Der Server legt die Datei beim ersten Start an. Weder die vollständige Sicherung der Konsole noch die Backups der Installer für Linux und Windows enthalten sie, damit ein Backup allein diese Passwörter nicht öffnet. Das Backup des Docker-Skripts enthält sie, weil es das ganze Daten-Volume kopiert. Ziehst du mit dem Server um, kopiere die Datei mit den Daten. Ein Server ohne sie erzeugt einen neuen Schlüssel, und die Angaben der gespeicherten Anmeldung und die Gerätepasswörter im Adressbuch müssen neu gespeichert werden. Bewahre die Datei so sicher auf wie das Schlüsselpaar: Die Datei und eine Kopie der Datenbank öffnen zusammen die Passwörter.

`mesh_agent_server.pem` funktioniert für Mesh-Agents genauso. Ihre `.msh`-Dateien nennen den Server über eine ID, die aus dem Schlüssel dieser Datei entsteht. Fehlt die Datei beim Start, erzeugt der Server eine neue, und die ID ändert sich. Agents, die mit der alten `.msh`-Datei eingerichtet wurden, akzeptieren den Server dann nicht mehr und müssen mit einer neuen Datei neu installiert werden.

## Was du sichern musst {#what-to-back-up}

Docker hält alles in benannten Volumes:

| Volume | Pfad im Container | Inhalt |
|---|---|---|
| `neodesk-data` | `/opt/neodesk/data` | Die SQLite-Datenbank `db_v2.sqlite3`, das Schlüsselpaar, der API-Schlüssel `.api_key`, `mesh_agent_server.pem`, der Schlüssel für die gespeicherten RDP- und VNC-Passwörter `.remote_target_vault_key`, der Schlüssel der gespeicherten Anmeldung und der Gerätepasswörter im Adressbuch `.device_vault_key` und das erste Admin-Passwort `.admin_credentials`, bis der Admin es ändert |
| `neodesk-console-data` | `/app/data` | Das Sitzungsgeheimnis, hochgeladene Bilder und Schriften, die öffentlichen Client-Endpunkte, Chat-Dateien und Ticket-Anhänge, die eigenen Backups der Konsole |
| `neodesk-postgres-data` | `/var/lib/postgresql/data` | Die Datenbank, wenn du PostgreSQL nutzt |

Bis 3.6.0-rc.4 war das Daten-Volume unter `/opt/rustdesk` eingebunden. Das Update auf 3.6.0-rc.5 verlegt den Einhängepunkt; die Daten bleiben im selben Volume.

Sichere außerdem die Datei `.env` neben der Compose-Datei und `docker-compose.override.yml`, falls du eine angelegt hast. Die Compose-Datei benennt die Volumes selbst, deshalb hängen die Namen nicht vom Ordner ab; `docker volume ls` listet sie auf. Nur `docker-compose.single.yml`, das das Image aus dem Repository baut, setzt den Ordnernamen davor, zum Beispiel `neodesk_neodesk-data`; siehe [Installation mit Docker](/docs/getting-started/docker#build-the-image-from-the-repository).

Eine Linux-Installation mit den Standardordnern des Installers:

| Pfad | Inhalt |
|---|---|
| `/opt/neodesk` | Das Binary, die SQLite-Datenbank, das Schlüsselpaar, `.device_vault_key`, der API-Schlüssel, `ssl/` mit den Zertifikaten, `mesh_agent_server.pem` |
| `/opt/NeoDeskConsole` | Die env-Datei `.env` und der Ordner `data/` der Konsole |
| `/etc/systemd/system/neodesk-server.service` | Der Dienst mit seinen Argumenten |

Eine Windows-Installation nutzt `C:\NeoDesk` und `C:\NeoDeskConsole` auf dieselbe Weise. Unter Linux und Windows enthält die env-Datei den Schlüssel für die gespeicherten RDP- und VNC-Passwörter, `REMOTE_TARGET_VAULT_KEY`. Mit PostgreSQL sicherst du die Datenbank wie unter [PostgreSQL](/docs/operations/postgresql#back-up-the-database) beschrieben, und die Ordner ebenfalls.

## Die Seite „Sicherung“ in der Konsole {#the-backup-page-in-the-console}

**Einstellungen**, **Sicherung** erstellt Backups, während der Server läuft.

Eine vollständige Sicherung enthält jedes Geheimnis des Servers. Deshalb dürfen nur Konten mit der Rolle Super-Admin oder Administrator eine herunterladen, wiederherstellen oder planen oder ihr Ziel testen. Andere Konten mit **Server konfigurieren**, etwa Serveradministratoren, sehen die Statistik und den Zeitplan; den Rest lehnt der Server mit „Only a super admin can download, restore or send a full backup: it holds every secret of the server“ ab.

**Sicherung herunterladen** speichert eine `.tar.gz`-Datei mit:

- einem Dump jeder Tabelle der Datenbank, unter SQLite wie unter PostgreSQL,
- unter SQLite einer konsistenten Kopie der Datenbankdatei,
- dem Schlüsselpaar, dem API-Schlüssel und `mesh_agent_server.pem`,
- dem Sitzungsgeheimnis der Konsole, hochgeladenen Bildern, installierten Schriften, Chat-Dateien und Ticket-Anhängen,
- den öffentlichen Client-Endpunkten, die in der Konsole gespeichert sind,
- dem TLS-Zertifikat der Konsole, seinem Schlüssel und seiner CA-Datei, wenn `SSL_CERT_PATH` und die übrigen Variablen sie nennen,
- der `.env` der Konsole, wenn ihr Ordner eine hat (eine Docker-Installation hat keine),
- einer Übersicht über die Geräte, die Sperrliste und die letzten Audit-Ereignisse.

Die Compose-Dateien, die systemd-Unit und `.device_vault_key` sind nicht darin, und unter Docker auch nicht `.remote_target_vault_key`. Bewahre von diesen Dateien eine Kopie auf, sonst lassen sich die Angaben der gespeicherten Anmeldung, die Gerätepasswörter im Adressbuch und die gespeicherten RDP- und VNC-Passwörter nach einer Wiederherstellung auf einem neuen Server oder Volume nicht mehr lesen. Das Archiv enthält Geheimnisse: die Schlüssel, Passwort-Hashes und die Geheimnisse der Zwei-Faktor-Anmeldung. Bewahre es auf wie ein Passwort.

**Geplante vollständige Sicherung** erstellt dasselbe Archiv nach Zeitplan: jede Stunde, alle 6, 12 oder 24 Stunden oder jede Woche. Jedes Archiv wird nach dem Schreiben geprüft und bekommt seinen SHA-256-Hash in einer Datei daneben, und **Aufzubewahrende Archive** (7, solange du nichts änderst) entfernt die ältesten. Standardziel ist der Datenordner der Konsole, darin `scheduled-backups`. Unter Docker liegt das im Volume `neodesk-console-data` und schützt dich deshalb nicht davor, das Volume zu verlieren. Wähle **Benutzerdefinierter lokaler oder eingebundener Netzwerkpfad**, gib einen **Zielpfad** auf einer anderen Platte oder einer Netzwerkfreigabe ein und klicke auf **Ziel testen**. Der Pfad muss absolut sein und darf weder das Wurzelverzeichnis einer Platte noch der Ordner der Konsole selbst sein.

### Auf eine Netzwerkfreigabe sichern {#back-up-to-a-network-share}

Die Konsole schreibt in einen Ordner, binde die Freigabe deshalb zuerst auf dem Server ein. Für eine SMB-Freigabe unter Linux installierst du `cifs-utils`, legst den Ordner an und schreibst die Zugangsdaten in eine Datei, die nur root lesen kann:

```bash
sudo apt install cifs-utils
sudo mkdir -p /mnt/neodesk-backups
sudo install -m 600 /dev/null /root/.neodesk-smb
sudoedit /root/.neodesk-smb
```

Die Datei enthält zwei Zeilen, `username=...` und `password=...`. Füge dann diese Zeile in `/etc/fstab` ein, damit die Freigabe bei jedem Systemstart eingebunden wird und das Dienstkonto `neodesk` darauf schreiben darf. Setze für `<nas-address>` den Hostnamen oder die Adresse des NAS ein:

```fstab
//<nas-address>/backups /mnt/neodesk-backups cifs credentials=/root/.neodesk-smb,uid=neodesk,gid=neodesk,file_mode=0600,dir_mode=0700,_netdev 0 0
```

Binde sie ein:

```bash
sudo mount /mnt/neodesk-backups
```

Wähle in der Konsole **Benutzerdefinierter lokaler oder eingebundener Netzwerkpfad** und gib `/mnt/neodesk-backups` als **Zielpfad** ein.

Unter Docker liegt der Pfad im Container. Binde die Freigabe auf dem Host genauso ein, mit `uid=10001,gid=10001` (oder deinen Werten für `PUID` und `PGID`) statt `neodesk`, und gib dem Container den Ordner in `docker-compose.override.yml` neben `docker-compose.yml`. Docker Compose liest diese Datei zusammen mit der Compose-Datei, und das Installationsskript lässt sie in Ruhe, wenn es `docker-compose.yml` aktualisiert:

```yaml
services:
  neodesk:
    volumes:
      - /mnt/neodesk-backups:/backups
```

Erstelle den Container in diesem Ordner neu:

```bash
docker compose up -d
```

Gib dann `/backups` als **Zielpfad** ein.

Unter Windows funktioniert auch ein UNC-Pfad wie `\\<nas-address>\backups`, wenn das Konto, unter dem der Dienst läuft, dort schreiben darf.

## Kaltes Backup einer Docker-Installation {#cold-backup-of-a-docker-install}

Stoppst du den Container vorher, bekommst du eine konsistente Kopie von allem. Bei einer Installation mit dem Skript erledigt das `sudo bash neodesk-docker.sh backup`. Es stoppt den Container, speichert beide Volumes als eine `.tar.gz` mit einer Kopie von `docker-compose.yml`, `docker-compose.override.yml` und `.env` in `backups` im Installationsordner und startet den Container wieder. Mit PostgreSQL kommt ein Dump der Datenbank dazu. Es behält die letzten fünf Backups. Siehe [Installation mit Docker](/docs/getting-started/docker#other-commands-of-the-script).

Von Hand führst du das im Ordner mit der Compose-Datei aus:

```bash
docker compose stop
mkdir -p backup
docker run --rm -v neodesk-data:/data:ro -v "$PWD/backup":/backup alpine:3.22 tar czf /backup/neodesk-data.tar.gz -C /data .
docker run --rm -v neodesk-console-data:/data:ro -v "$PWD/backup":/backup alpine:3.22 tar czf /backup/console-data.tar.gz -C /data .
docker compose start
```

Mit PostgreSQL sicherst du das Volume `neodesk-postgres-data` auf dieselbe Weise, solange es gestoppt ist, oder du nutzt `pg_dump`; siehe [PostgreSQL](/docs/operations/postgresql#back-up-the-database).

## Kaltes Backup einer Linux-Installation {#cold-backup-of-a-linux-install}

```bash
sudo systemctl stop neodesk-server
sudo tar czf /root/neodesk-backup.tar.gz /opt/neodesk /opt/NeoDeskConsole /etc/systemd/system/neodesk-server.service
sudo systemctl start neodesk-server
```

Der Menüpunkt **Backup** des Installers, den jedes Update als Erstes ausführt, funktioniert bei laufendem Server. Er schreibt `/opt/neodesk-backups/neodesk_backup_<time>.tar.gz` mit demselben Archiv wie **Sicherung herunterladen** auf der Seite **Sicherung** der Konsole (unter SQLite wie unter PostgreSQL) und dazu eine Kopie des Schlüsselpaars, des API-Schlüssels und von `.admin_credentials`. Die systemd-Unit und `.device_vault_key` lässt er weg. Bis 3.6.0-rc.4 landeten die Backups in `/opt/rustdesk-backups`; der erste Lauf des neuen Installers als root verschiebt sie nach `/opt/neodesk-backups`. Unter Windows schreibt derselbe Menüpunkt eine ZIP-Datei nach `C:\NeoDesk-Backups`.

## Wiederherstellen {#restore}

### Über die Seite „Sicherung“ {#from-the-backup-page}

Wähle unter **Aus einer Sicherung wiederherstellen** eine `.tar.gz`, die auf dieser Seite erstellt wurde (oder eine ältere `.json`-Einstellungsdatei), hake an, was du wiederherstellen willst, und klicke auf **Wiederherstellen…**:

- **Konsolendaten**: Benutzer, Rollen, Einstellungen, Ordner, Gruppen und die übrigen Tabellen der Datenbank, Tabelle für Tabelle ersetzt, dazu die öffentlichen Client-Endpunkte. Das gilt sofort.
- **Hochgeladene Bilder**: die hochgeladenen Bilder und die installierten Schriften. Dateien mit demselben Namen werden ersetzt.
- **Serverschlüssel und Geheimnisse**: das Schlüsselpaar, der API-Schlüssel, `mesh_agent_server.pem`, das Sitzungsgeheimnis und die TLS-Dateien der Konsole. Alle werden abgemeldet, und die Clients brauchen den Schlüssel neu, wenn das Backup von einem anderen Server stammt.
- **Umgebungsdatei (.env)**: die Ports der Konsole, die Datenbankverbindung und Geheimnisse.
- **Gerätedatenbank des Servers**: die SQLite-Datei des Servers, nur unter SQLite. Sie wird geprüft, neben die Datenbank geschrieben und beim nächsten Start an ihren Platz gesetzt.

Die letzten drei brauchen einen Neustart des Dienstes. Eine Wiederherstellung ersetzt Daten auf diesem Server und lässt sich nicht rückgängig machen. Lade deshalb vorher ein Backup des aktuellen Stands herunter.

### Ein kaltes Docker-Backup {#a-docker-cold-backup}

Für die beiden Dateien, die du oben von Hand erstellt hast, im Ordner mit der Compose-Datei:

```bash
docker compose stop
docker run --rm -v neodesk-data:/data -v "$PWD/backup":/backup alpine:3.22 sh -c 'find /data -mindepth 1 -delete && tar xzf /backup/neodesk-data.tar.gz -C /data'
docker run --rm -v neodesk-console-data:/data -v "$PWD/backup":/backup alpine:3.22 sh -c 'find /data -mindepth 1 -delete && tar xzf /backup/console-data.tar.gz -C /data'
docker compose start
```

Ein Backup von `neodesk-docker.sh backup` enthält beide Volumes in einer Datei, in den Ordnern `neodesk` und `console`. In einem Backup von 3.6.0-rc.4 oder älter heißt der erste Ordner `rustdesk`; der Befehl unten bindet das Daten-Volume unter beiden Namen ein und stellt deshalb beide wieder her. Führe Folgendes in `/opt/neodesk/docker` aus und setze für `neodesk-<time>.tar.gz` den Namen der Datei ein:

```bash
docker compose stop
docker run --rm -v neodesk-data:/restore/neodesk -v neodesk-data:/restore/rustdesk -v neodesk-console-data:/restore/console -v "$PWD/backups":/in:ro alpine:3.22 sh -c 'find /restore/neodesk /restore/console -mindepth 1 -delete && tar xzf /in/neodesk-<time>.tar.gz -C /restore'
docker compose start
```

Der Container setzt beim Start den Besitzer beider Ordner neu.

### Ein kaltes Linux-Backup {#a-linux-cold-backup}

```bash
sudo systemctl stop neodesk-server
sudo tar xzf /root/neodesk-backup.tar.gz -C /
sudo systemctl daemon-reload
sudo systemctl start neodesk-server
```

### Auf einem neuen Server {#on-a-new-machine}

Installiere NeoDesk auf demselben Weg wie vorher ([Docker](/docs/getting-started/docker), [Linux](/docs/getting-started/linux) oder [Windows](/docs/getting-started/windows)), stoppe es, stelle die Dateien oder Volumes wie oben beschrieben wieder her, lege `.device_vault_key` neben das Schlüsselpaar, falls dein Backup die Datei nicht enthält, und starte es. Lass die öffentliche Adresse des Servers auf den neuen Server zeigen oder gib den Clients die neue Adresse. Liegt die alte Schlüsseldatei an ihrem Platz, brauchen die Clients sonst nichts.
