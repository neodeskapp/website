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

Die Relay-Adresse wird nicht von selbst übernommen. hbbs ohne `-r` schickte
die Clients zum Relay unter der Adresse, die sie benutzten. Die Installer von
NeoDesk geben den Clients dagegen die öffentliche IP-Adresse, die sie
ermitteln. Erreichen deine Clients den alten Server unter einer LAN-Adresse
oder einem Namen, gehen weitergeleitete Sitzungen dann an die öffentliche
Adresse, und das klappt aus dem eigenen Netz oft nicht. Gib dem Installer die
Adresse, die deine Clients heute nutzen, siehe
[Die Relay-Adresse](#the-relay-address).

## Die Relay-Adresse {#the-relay-address}

Gib bei der Installation die Adresse an, die deine Clients als ID-Server
eingetragen haben, anstelle von `<old-server-address>`. Jeder Installer
schreibt die Option etwas anders:

```bash
# Docker, mit der Installation in einer Zeile
curl -fsSL https://neode.sk/install.sh | sudo bash -s -- --relay-servers <old-server-address>
# Linux
curl -fsSL https://neode.sk/neodesk.sh | sudo bash -s -- --relay-servers <old-server-address>
```

```powershell
# Windows
.
eodesk.ps1 -RelayServers <old-server-address>
```

`neodesk-docker.sh` nimmt sie als `--relay <old-server-address>`. Bei einer
interaktiven Installation unter Linux oder Windows kannst du auch
**Custom address** wählen, wenn das Skript nach dem Relay fragt. Für einen
Server, den nur Clients im selben Netz nutzen, nimmt `--relay-mode local`
(`-RelayMode local` unter Windows) stattdessen die LAN-Adresse des Servers.

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

Das Installationsskript übernimmt das alte Schlüsselpaar im selben Lauf. Gib
ihm den Ordner mit `id_ed25519` und `id_ed25519.pub`, zum Beispiel den Ordner
`data`, den die Compose-Datei von RustDesk einhängt:

```bash
curl -fsSL https://neode.sk/install.sh | sudo bash -s -- --import-keys /opt/rustdesk-old/data
```

Bei einer Installation, die schon läuft, hält das Skript NeoDesk an, macht ein
Backup, legt das Paar hinein und startet es wieder. Den ersetzten Schlüssel
behält es im Daten-Volume als `id_ed25519.before-import-<time>`. Setze für
`<folder>` den Ordner ein:

```bash
sudo bash /opt/neodesk/docker/neodesk-docker.sh --import-keys <folder>
```

### Von Hand {#docker-by-hand}

Installiere NeoDesk wie in
[Installation mit Docker](/docs/getting-started/docker) beschrieben. Beim
ersten Start erzeugt es ein eigenes Schlüsselpaar, und der Installer gibt
diesen neuen Schlüssel unter **Key** aus: Gib ihn nicht an Clients weiter.
Ersetze ihn gleich nach der Installation durch den alten und starte den
Container neu. Führe diese Befehle in dem Ordner aus, in dem die alten
Schlüsseldateien liegen:

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

Clients, die den Server zwischen Installation und Neustart erreichen,
erscheinen schon unter **Beitrittsanfragen**. Das schadet nicht: Sie bleiben
dort, und du genehmigst sie wie unten beschrieben, sobald der alte Schlüssel
an seinem Platz ist.

## Die Clients wieder hereinlassen {#let-the-clients-back-in}

Eine neue Installation startet im Beitrittsmodus **Verwaltet**. Für
NeoDesk sind deine RustDesk-Clients neue Geräte, also wartet jedes unter
**Geräte**, **Beitrittsanfragen**, bis jemand es genehmigt. Bis dahin kann
es niemand erreichen, und es kann keine Sitzung starten.

Genehmige jedes Gerät unter **Beitrittsanfragen**. Während er wartet, schickt
ein normaler RustDesk-Client seine Systeminformationen an seinen API-Server,
und die Anfrage zeigt dann Namen, System und Version des Rechners. Bis sie
ankommen, oder wenn die API-Adresse des Clients nicht antwortet, zeigt die
Anfrage **Kein Name übermittelt**, seine ID und die Adresse, von der sie kam.
Unterscheide die Geräte dann an der ID: Es ist die ID, die das RustDesk-Fenster
auf jedem Rechner zeigt, und dieselbe, die der alte Server kannte.

Die Warteschlange fasst höchstens 1000 wartende Geräte und weist neue ab,
solange sie voll ist. Ein abgewiesenes Gerät fragt wieder an. Hast du mehr
Clients, genehmige also die wartenden, und der Rest kommt nach, sobald Platz
frei wird.

Bei vielen Clients kannst du stattdessen eine Zeit lang auf **Offen**
umstellen. Jedes wartende Gerät wird genehmigt, wenn es sich das nächste Mal
registriert, und seine Anfrage wandert in den Filter **Genehmigt**. Das
Aktivitätsprotokoll führt es als genehmigt, mit „joined in open mode“ als
Grund. Solange der Modus Offen ist, tritt jeder RustDesk-Client bei, der den
Server erreicht. Stelle also zurück auf **Verwaltet**, sobald deine Clients
drin sind.

Kannst du auf den Computern einen Befehl ausführen, tritt ein normaler
RustDesk-Client 1.5 oder neuer auch ohne Wartezeit bei:
`rustdesk --deploy --token <device-token>` mit einem Gerätetoken pro Computer,
siehe [Per Skript mit einem Gerätetoken beitreten](/docs/console/enrollment#join-by-script-with-a-device-token).

Siehe [Ein Gerät genehmigen](/docs/console/enrollment#approving-a-device).

## Den API-Server auf den Clients eintragen {#set-the-api-server-on-the-clients}

Bei einer RustDesk-Server-Einrichtung bleibt der **API-Server** der Clients
meist leer. Dann schickt ein normaler RustDesk-Client seine API-Aufrufe an
Port 21114 auf dem Host des ID-Servers.

NeoDesk antwortet dort bei jeder Installationsart mit der Client-API, und die
Installer öffnen 21114 in ihrem Firewall-Schritt, die Clients können das Feld
also leer lassen. Eine Installation von vor der Zeit, als ihr Installer 21114
öffnete, öffnet ihn, wenn du den Installer erneut ausführst; eine Firewall vor
dem Server braucht den Port auch. Eine eigene Docker-Compose-Datei braucht
`"21114:21114"` unter den Ports des Dienstes `neodesk`. **API-Server** auf
jedem Client auf `http://<server-address>:21121` zu setzen oder den Clients die
Konfigurationszeichenfolge aus der Konsole zu geben, funktioniert genauso,
siehe [Einen RustDesk-Client verbinden](/docs/getting-started/connect-a-client#get-the-four-values).

Kommen die API-Aufrufe des Clients nicht an, verbindet sich das Gerät trotzdem
und ist erreichbar, aber die Konsole bekommt nie seinen Namen, sein
Betriebssystem oder seine Version, und die Anmeldung im Client und sein
Adressbuch funktionieren nicht.

## Die Geräteliste auf PostgreSQL behalten {#keep-the-device-list-on-postgresql}

Bei einer Installation unter Linux oder Windows, die auf PostgreSQL läuft,
kann der Installer die Geräte aus der Datenbank von RustDesk in die von
NeoDesk kopieren. Ein kopiertes Gerät gilt als bekannt: Es registriert sich in
jedem Modus ohne Genehmigung neu und erscheint unter **Geräte**, bevor es sich
verbindet.

Bei Docker und bei Installationen auf SQLite gibt es keinen Weg, die
Geräteliste in den laufenden Server zu kopieren. Die Geräte kommen zurück,
wenn sie sich verbinden, und jedes wartet wie oben beschrieben unter
**Beitrittsanfragen**.

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
