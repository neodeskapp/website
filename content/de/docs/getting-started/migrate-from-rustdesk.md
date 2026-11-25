---
title: Umzug von einem RustDesk-Server
description: Ersetze einen RustDesk-Server (hbbs und hbbr) durch NeoDesk und behalte seinen Schlüssel, damit die RustDesk-Clients ohne Änderung weiterlaufen.
order: 7
seoTitle: hbbs und hbbr durch NeoDesk ersetzen, Schlüssel behalten
---

NeoDesk nimmt den Platz von hbbs und hbbr ein. Ein RustDesk-Client prüft den
Server anhand seines Schlüssels. Hat NeoDesk das Schlüsselpaar des alten
Servers und antwortet unter der alten Adresse, verbinden sich die Clients also
wie bisher. Diese Seite behandelt einen RustDesk-Server unter Linux, unter
Windows oder in Docker.

## Was übernommen wird {#what-carries-over}

- **Das Schlüsselpaar**, `id_ed25519` und `id_ed25519.pub`. NeoDesk liest die
  Schlüsseldateien von RustDesk so, wie sie sind. Ohne sie erzeugt es beim
  ersten Start ein neues Paar, und jeder Client braucht dann den neuen
  Schlüssel. Siehe
  [warum die Schlüsseldatei wichtig ist](/docs/operations/backup#why-the-key-file-matters).
- **Die Adresse.** Die Clients behalten den ID-Server, den sie eingetragen
  haben. Installiere NeoDesk auf demselben Rechner, oder lass den alten
  DNS-Namen auf den neuen Rechner zeigen.
- **Die Geräte-IDs.** Die ID liegt auf dem Client, also behält jedes Gerät
  seine. Die Geräteliste von NeoDesk beginnt leer und füllt sich, wenn sich die
  Clients verbinden. NeoDesk liest die Datenbank von RustDesk nicht, außer auf
  PostgreSQL, siehe
  [Die Geräteliste auf PostgreSQL behalten](#keep-the-device-list-on-postgresql).

## Bevor du anfängst {#before-you-start}

1. Kopiere den Datenordner des alten Servers an einen sicheren Ort, mit
   `id_ed25519`, `id_ed25519.pub` und `db_v2.sqlite3`. Läuft der alte Server
   in Docker, liegen die Dateien in dem Ordner oder Volume, das er einhängt;
   `docker inspect <container>` listet seine Mounts.
2. Stoppe den alten Server und verhindere, dass er wieder startet: Deaktiviere
   seine Dienste, oder führe Folgendes im Ordner seiner Container aus, wenn er
   in Docker läuft:

   ```bash
   docker compose down
   ```

   NeoDesk braucht dieselben Ports, und die Installer für Linux und Docker
   brechen mit einem Fehler ab, solange ein anderes Programm sie belegt. Das
   Linux-Skript stoppt und entfernt Dienste namens `rustdesksignal` und
   `rustdeskrelay` selbst. Kopiere also vorher ihre Unit-Dateien, falls du
   vielleicht zurückwechseln willst.
3. Liegt der alte Server in einem Ordner, den der Installer durchsucht, mit
   `hbbs` darin, verschiebe diesen Ordner, damit NeoDesk in einem eigenen
   Ordner startet. Sonst installiert der Installer in diesen Ordner, und beim
   ersten Start benennt der Server die Datenbank von RustDesk in
   `db_v2.sqlite3.rustdesk-<date>-<time>` um und legt eine eigene an. Das Log
   meldet das in einer Zeile, die mit `WARN:` beginnt. Die Ordner sind unter
   Linux `/opt/rustdesk`, `/usr/local/rustdesk`, `/var/lib/rustdesk`,
   `/home/rustdesk` und `$HOME/rustdesk`, unter Windows `C:\RustDesk` und
   `C:\Program Files\RustDesk`.

```bash
sudo mv /opt/rustdesk /opt/rustdesk-old
```

```powershell
Rename-Item C:\RustDesk RustDesk-old
```

## Unter Linux oder Windows {#on-linux-or-windows}

Lege das Schlüsselpaar in den Ordner, den der Installer nutzt, und installiere
dann. Beim ersten Start findet der Server die Dateien und nutzt sie, statt
neue zu erzeugen.

Unter Linux:

```bash
sudo mkdir -p /opt/neodesk
sudo cp /opt/rustdesk-old/id_ed25519 /opt/rustdesk-old/id_ed25519.pub /opt/neodesk/
```

Installiere dann wie in [Installation unter Linux](/docs/getting-started/linux)
beschrieben. Das Skript übergibt die Dateien an das Konto `neodesk`, unter dem
der Server läuft.

Unter Windows, in PowerShell als Administrator, mit den alten Dateien in
`C:\RustDesk-old`:

```powershell
New-Item -ItemType Directory -Force C:\NeoDesk
Copy-Item C:\RustDesk-old\id_ed25519, C:\RustDesk-old\id_ed25519.pub C:\NeoDesk\
```

Installiere dann wie in
[Installation unter Windows](/docs/getting-started/windows) beschrieben.

Nach der Installation muss der öffentliche Schlüssel derselbe sein wie in der
alten `id_ed25519.pub`. Unter Linux zeigst du ihn so an:

```bash
sudo cat /opt/neodesk/id_ed25519.pub
```

Unter Windows liegt er in `C:\NeoDesk\id_ed25519.pub`. Der Server schreibt ihn
außerdem bei jedem Start in sein Log, als `Server public key: <key>`.

## In Docker {#in-docker}

Installiere NeoDesk wie in
[Installation mit Docker](/docs/getting-started/docker) beschrieben. Beim
ersten Start erzeugt es ein eigenes Schlüsselpaar. Ersetze es durch das alte
und starte den Container neu. Führe diese Befehle in dem Ordner aus, in dem
die alten Schlüsseldateien liegen:

```bash
docker exec -i -u neodesk neodesk sh -c 'umask 077; cat > /opt/neodesk/data/id_ed25519' < id_ed25519
docker exec -i -u neodesk neodesk sh -c 'cat > /opt/neodesk/data/id_ed25519.pub' < id_ed25519.pub
docker restart neodesk
```

Schreibe beide Dateien vor dem Neustart: Der Server startet nicht, wenn
`id_ed25519.pub` nicht zu `id_ed25519` gehört. Prüfe dann, ob der Container
den alten öffentlichen Schlüssel hat:

```bash
docker exec -u neodesk neodesk cat /opt/neodesk/data/id_ed25519.pub
```

## Die Clients wieder hereinlassen {#let-the-clients-back-in}

Eine neue Installation startet im Registrierungsmodus **Verwaltet**. Für
NeoDesk sind deine RustDesk-Clients neue Geräte, also wartet jedes unter
**Geräte**, **Registrierungsanfragen**, bis jemand es genehmigt. Bis dahin kann
es niemand erreichen, und es kann keine Sitzung starten.

Es gibt zwei Wege, die Clients hereinzulassen:

- Genehmige jedes Gerät unter **Registrierungsanfragen**.
- Stelle auf **Offen** um, solange die Clients zurückkommen, und danach wieder
  auf **Verwaltet**. Wartende Geräte verbinden sich beim nächsten Versuch, und
  ein Gerät, das der Server kennt, kann sich in jedem Modus neu registrieren.
  Nimm diesen Weg, wenn du mehr als 1000 Clients hast: Die Warteschlange fasst
  höchstens 1000 wartende Geräte und weist den Rest ohne Anfrage ab.

Siehe [Den Modus ändern](/docs/console/enrollment#changing-the-mode).

Der **API-Server** der Clients kann leer bleiben, wie ihn eine
RustDesk-Server-Einrichtung meist lässt, oder `http://<server-address>:21121`
sein; beides funktioniert. Siehe
[Einen RustDesk-Client verbinden](/docs/getting-started/connect-a-client#get-the-four-values).

## Die Geräteliste auf PostgreSQL behalten {#keep-the-device-list-on-postgresql}

Bei einer Installation, die auf PostgreSQL läuft, kann der Installer die
Geräte aus der Datenbank von RustDesk in die von NeoDesk kopieren. Ein
kopiertes Gerät gilt als bekannt: Es registriert sich in jedem Modus ohne
Genehmigung neu und erscheint unter **Geräte**, bevor es sich verbindet.

1. Starte den Installer. Unter Linux:

   ```bash
   sudo neodesk-setup
   ```

   Unter Windows:

   ```powershell
   & 'C:\NeoDesk\neodesk.ps1'
   ```

   Wähle **Database migration**, dann **Rust -> Go**.
2. Gib als Quelle die Datenbank von RustDesk an, zum Beispiel
   `/opt/rustdesk-old/db_v2.sqlite3`, oder die Datei
   `db_v2.sqlite3.rustdesk-<date>-<time>`, in die der Server sie umbenannt hat.
3. Gib als Ziel die `DATABASE_URL` der Installation an, aus
   `/opt/NeoDeskConsole/.env` oder `C:\NeoDeskConsole\.env`.

Das Werkzeug speichert zuerst eine Kopie der Quelle daneben. Es kopiert für
jedes Gerät ID, Schlüssel, Name, Betriebssystem und Version, und ein Gerät,
das NeoDesk schon hat, lässt es, wie es ist. Die letzte Zeile sagt, wie viele
es kopiert hat:

```text
Migration complete: <n> peers copied to PostgreSQL, <m> already there and left as they were
```

::: warning
Gib bei einer SQLite-Installation nicht die eigene Datenbankdatei der
Installation als Ziel an. Das Werkzeug ersetzt diese Datei durch eine neue,
die nur die Geräte enthält.
:::
