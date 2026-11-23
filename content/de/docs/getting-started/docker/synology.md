---
title: Docker auf einem Synology-NAS
description: Betreibe das veröffentlichte NeoDesk-Image im Container Manager von Synology, mit den Einstellungen, die ein NAS meist braucht.
order: 1
---

Ein Synology-NAS betreibt NeoDesk mit derselben Compose-Datei wie jeder andere
Docker-Host. Die Oberfläche des Container Managers ändert sich zwischen den
DSM-Versionen, deshalb nennt diese Seite die Dateien und Einstellungen, die
NeoDesk braucht, und nicht jeden Klick. Lies zuerst
[Installation mit Docker](/docs/getting-started/docker).

## Bevor du anfängst {#before-you-start}

- Docker Compose 2.24 oder neuer: Die Compose-Datei liest ihre Einstellungen
  aus `.env` auf eine Weise, die ältere Versionen ablehnen. Prüfe die Version
  über SSH:

  ```bash
  sudo docker compose version
  ```
- Ein freier Port für die Konsole: Die Weboberfläche von DSM lauscht
  standardmäßig auf Port 5000, demselben Port, den die NeoDesk-Konsole nutzt.
  Gib der Konsole mit `NEODESK_CONSOLE_PORT` in `.env` einen anderen
  Host-Port.

## Einrichten {#set-it-up}

1. Lege auf dem NAS einen Ordner für NeoDesk an, zum Beispiel
   `/volume1/docker/neodesk`.
2. Lege die Compose-Datei als `docker-compose.yml` hinein:
   [docker-compose.quick.single.yml](https://raw.githubusercontent.com/neodeskapp/neodesk/main/docker-compose.quick.single.yml).
3. Lege daneben eine Datei namens `.env` an:

   ```ini
   NEODESK_CONSOLE_PORT=5080
   RELAY_SERVERS=<nas-address>
   ```

   Setze für `<nas-address>` die Adresse ein, unter der RustDesk-Clients das
   NAS erreichen: seine LAN-Adresse, wenn sich nur Geräte aus deinem Netzwerk
   verbinden, oder deine öffentliche Adresse oder deinen DNS-Namen, wenn sich
   Geräte über das Internet verbinden. Ohne `RELAY_SERVERS` ermittelt der
   Container bei jedem Start seine öffentliche Adresse.
4. Erstelle im Container Manager ein Projekt aus der `docker-compose.yml`
   dieses Ordners und starte es. Über SSH geht dasselbe im Ordner so:

   ```bash
   sudo docker compose up -d
   ```

Die Konsole ist dann unter `http://<nas-address>:5080` erreichbar. Gib das
Admin-Passwort über SSH aus:

```bash
sudo docker exec neodesk neodesk-show-admin-credentials
```

Weiter geht es mit [Die erste Anmeldung](/docs/getting-started/first-sign-in).

## Daten in einem gemeinsamen Ordner {#data-in-a-shared-folder}

Standardmäßig liegen die Daten in Docker-Volumes. Willst du sie stattdessen in
Ordnern auf dem NAS haben, ersetze die beiden Volume-Zeilen des Services
`neodesk` durch Ordner und setze `PUID` und `PGID` in `.env` auf die Nummern
des Benutzers und der Gruppe, denen die Ordner gehören. `id <user>` über SSH
gibt sie als `uid` und `gid` aus; setze sie für `<uid>` und `<gid>` ein.

```yaml
    volumes:
      - /volume1/docker/neodesk/data:/opt/rustdesk
      - /volume1/docker/neodesk/console:/app/data
```

```ini
PUID=<uid>
PGID=<gid>
```

Der Container startet als root, gibt seinem Benutzer `neodesk` diese Nummern
und betreibt den Server als dieser Benutzer. Ohne `PUID` und `PGID` hat der
Benutzer die Nummer 10001. Keiner der beiden Werte darf 0 sein. Füge der
Compose-Datei kein `user:` hinzu: Der Container muss als root starten, um das
zu tun. Kann der Benutzer nicht in `/opt/rustdesk` schreiben, steht im Log
`/opt/rustdesk is NOT writable by the neodesk user`.

## Firewall und Router {#firewall-and-router}

Ist die DSM-Firewall eingeschaltet, erlaube 21115 bis 21119, 21121 und 21122
über TCP, 21116 über UDP und den Port der Konsole. Für Geräte außerhalb deines
Netzwerks leite auf deinem Router 21115 bis 21117 und 21121 über TCP sowie
21116 über UDP weiter. RustDesk-Clients schicken ihre Systeminformationen und
Anmeldungen an die API auf 21121. Halte den Port der Konsole vom Internet fern,
außer ein Reverse Proxy mit TLS steht davor; siehe
[Ports und Firewall](/docs/operations/ports).

## Aktualisieren {#updating}

Lade das Image neu und erstelle den Container neu. Über SSH, im Ordner:

```bash
sudo docker compose pull
sudo docker compose up -d
```
