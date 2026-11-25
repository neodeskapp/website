---
title: Installation mit Docker
description: Betreibe Server und Web-Konsole in einem Container aus dem veröffentlichten Image, mit dem Installationsskript oder einer Compose-Datei.
order: 2
---

Das Docker-Setup betreibt `neodesk-server` in einem Container: den ID-Server,
den Relay-Server, die API für RustDesk-Clients und die Web-Konsole. Das Image
ist als `ghcr.io/neodeskapp/neodesk` veröffentlicht, auf deinem Rechner wird
also nichts gebaut. Du kannst es mit dem Skript `neodesk-docker.sh`
installieren oder von Hand mit der Compose-Datei. Wie du das Image aus dem
Repository baust, steht am Ende.

## Voraussetzungen {#requirements}

- Docker mit Docker Compose 2.24 oder neuer, damit `docker compose`
  funktioniert. `docker compose version` zeigt die Version. Die Compose-Datei
  liest ihre Einstellungen aus einer `.env`-Datei, und das können ältere
  Versionen nicht.
- Zugriff auf `ghcr.io`, wo das Image veröffentlicht ist.
- Freie Ports auf dem Host: 3375 und 5443 für die Konsole, 21115 bis 21119,
  21121 und 21122 über TCP und 21116 über UDP. Der Container veröffentlicht sie
  alle. [HTTPS mit Let's Encrypt](#https-with-lets-encrypt) braucht zusätzlich
  80 und 443.

Das Installationsskript unten installiert Docker mit Dockers eigenem
Installationsskript von get.docker.com, wenn es fehlt. Es bricht ab, wenn
Compose älter als 2.24 ist.

## Mit dem Skript installieren {#install-with-the-script}

```bash
curl -fsSL https://neode.sk/install.sh | sudo bash
```

Das speichert `neodesk-docker.sh` in `/opt/neodesk/docker` und führt es dort
aus. Ist ufw oder firewalld aktiv, öffnet es danach 3375, 5443, 21115 bis
21119, 21121 und 21122 über TCP und 21116 über UDP. 21122, den Port des
CDAP-Gateways, öffnet es, ob das Gateway an oder aus ist. Mit `--domain` öffnet
es 80 und 443 statt 3375 und 5443. Willst du das Skript
lesen, bevor es läuft, lade es herunter und starte es selbst:

```bash
curl -fsSL https://neode.sk/neodesk-docker.sh -o neodesk-docker.sh
sudo bash neodesk-docker.sh
```

Was das Skript macht:

- Es prüft, ob die Ports frei sind und ob es `ghcr.io` erreicht.
- Es schreibt `docker-compose.yml` und `.env` nach `/opt/neodesk/docker`.
- Es ermittelt die Adresse, unter der Clients diesen Server erreichen, und
  speichert sie als `RELAY_SERVERS` in `.env`. Dazu fragt es
  checkip.amazonaws.com, dann api.ipify.org. Antwortet keiner von beiden,
  nimmt es die LAN-Adresse und warnt.
- Es lädt das Image, startet den Container und wartet bis zu drei Minuten,
  bis API und Konsole antworten.
- Es gibt die Adresse der Konsole aus, das Admin-Passwort, die vier Werte für
  RustDesk-Clients und die Ports, die eine Firewall vor dem Rechner
  durchlassen muss.

Das Admin-Passwort erscheint nur einmal, am Ende der ersten Installation.
Kopiere es.

Um die Installation später zu aktualisieren, führe das Skript erneut aus;
siehe [Aktualisieren](/docs/operations/updating).

### Optionen {#options}

| Option | Was sie macht |
|--------|---------------|
| `--relay <address>` | Gibt den Clients diese Adresse, eine öffentliche IP-Adresse oder einen DNS-Namen, statt sie zu ermitteln. |
| `--relay-mode local` | Gibt den Clients die LAN-Adresse des Rechners, für einen Server, der nur dein lokales Netzwerk bedient. |
| `--tag <tag>` | Startet diesen Image-Tag statt `latest`, zum Beispiel eine Versionsnummer. |
| `--console-port <port>` | Veröffentlicht die Konsole auf diesem Host-Port statt auf 3375. |
| `--postgres` | Installiert mit PostgreSQL statt SQLite, in einem zweiten Container. |
| `--dir <path>` | Installiert in diesen Ordner statt nach `/opt/neodesk/docker`. |
| `--no-install-docker` | Bricht mit einem Fehler ab, wenn Docker fehlt, statt es zu installieren. |
| `--domain <domain>` | Liefert die Konsole unter diesem DNS-Namen über HTTPS aus, mit einem Zertifikat von Let's Encrypt. Siehe [HTTPS mit Let's Encrypt](#https-with-lets-encrypt). |
| `--email <email-address>` | Die Adresse, an die Let's Encrypt Hinweise zum Zertifikat schickt. Nötig mit `--domain`. |
| `--letsencrypt-staging` | Holt das Zertifikat vom Staging-Server von Let's Encrypt, dem Browser nicht vertrauen. Für einen Testlauf. |
| `--no-traefik` | Nimmt HTTPS mit Let's Encrypt wieder heraus. |

Willst du das Admin-Passwort selbst wählen, schreibe es hinter `sudo`, denn
`sudo` verwirft Variablen, die du davor setzt. Setze für `<admin-password>`
dein Passwort ein:

```bash
sudo ADMIN_PASSWORD='<admin-password>' bash neodesk-docker.sh
```

Mit `install.sh` stehen die Optionen hinter `bash -s --`. Zum Beispiel für
einen Server, der nur dein lokales Netzwerk bedient:

```bash
curl -fsSL https://neode.sk/install.sh | sudo bash -s -- --relay-mode local
```

Dort heißen sie `--relay-servers`, `--relay-mode`, `--version`,
`--admin-password`, `--domain`, `--letsencrypt-email` und
`--letsencrypt-staging`.

### Weitere Befehle des Skripts {#other-commands-of-the-script}

| Befehl | Was er macht |
|--------|--------------|
| `update` | Macht ein Backup der Daten, lädt das Image und startet es. Wird der neue Container nicht healthy, geht es zurück zum alten Image. |
| `status` | Zeigt den Container, seinen Health-Status, die Version und die Werte für Clients. |
| `logs` | Folgt dem Log des Containers. |
| `backup` | Stoppt den Container, speichert die Daten-Volumes als `.tar.gz` in `backups` im Installationsordner und startet ihn wieder. Es behält die letzten fünf. |
| `reset-password` | Setzt für `admin` ein neues zufälliges Passwort und zeigt es einmal an. `--user <name>` wählt ein anderes Konto. |
| `postgres` | Zieht die Installation von SQLite auf PostgreSQL um; siehe [PostgreSQL](/docs/operations/postgresql). |
| `uninstall` | Entfernt die Container. Die Volumes, das Image und der Ordner bleiben; `--purge` löscht nach einem Backup auch die Volumes. `--purge` lässt dich vorher `delete` eintippen; ohne Terminal, etwa in einem Skript, braucht es stattdessen `--yes`. |
| `menu` | Dieselben Befehle als Menü. |

Nach der Ein-Zeilen-Installation liegt das Skript in `/opt/neodesk/docker`. So
siehst du zum Beispiel den Status:

```bash
cd /opt/neodesk/docker
sudo bash neodesk-docker.sh status
```

`--help` listet alle Befehle und Optionen.

### Ein älterer NeoDesk-Container {#an-older-neodesk-container}

Findet das Skript einen NeoDesk-Container aus einer anderen Installation, etwa
von einem älteren Skript, aus einer Installation mit zwei Containern oder aus
einer Installation in einem anderen Ordner, bricht es ab und ändert nichts.
`--adopt` übernimmt ihn: Das Skript kopiert die Daten des alten Containers in
die Volumes dieser Installation und behält den alten Container, gestoppt und
umbenannt. Eine Installation, die auf PostgreSQL läuft, lässt sich so nicht
übernehmen.

## Mit der Compose-Datei installieren {#install-with-the-compose-file}

Lege einen Ordner für NeoDesk an und speichere die Compose-Datei darin:

```bash
mkdir neodesk && cd neodesk
curl -fsSL https://neode.sk/install/docker-compose.quick.single.yml -o docker-compose.yml
docker compose up -d
```

Docker lädt das Image und startet den Container. Sein Healthcheck fragt API
und Konsole, ob sie antworten, und der Status wechselt auf healthy:

```bash
docker compose ps
```

Führe die `docker compose`-Befehle auf dieser Seite in diesem Ordner aus. Für
ein Synology-NAS siehe
[Docker auf einem Synology-NAS](/docs/getting-started/docker/synology).

### Einstellungen in .env {#settings-in-env}

Einstellungen kommen in eine Datei namens `.env` neben `docker-compose.yml`,
eine Zeile `KEY=value` pro Einstellung. Jede Einstellung darin kommt beim
Server an, außer den wenigen, die die Compose-Datei selbst festlegt, etwa die
Ports im Container. Erstelle den Container nach einer Änderung neu, damit er
sie übernimmt:

```bash
docker compose up -d
```

| Einstellung | Was sie macht |
|-------------|---------------|
| `RELAY_SERVERS` | Die Adresse, unter der Clients diesen Server erreichen. Ist sie leer, ermittelt der Container sie bei jedem Start; siehe [Die Relay-Adresse](#the-relay-address). |
| `NEODESK_IMAGE_TAG` | Der Image-Tag. `latest`, der Standardwert, ist das neueste Release, oder das neueste Pre-Release, solange es kein stabiles Release gibt; eine Versionsnummer legt eine Version fest. |
| `NEODESK_CONSOLE_PORT` | Der Host-Port der Konsole, standardmäßig 3375. Bis 3.6.0-rc.4 war es 5000. |
| `NEODESK_CONSOLE_HTTPS_PORT` | Der Host-Port für HTTPS der Konsole, standardmäßig 5443. Die Installation prüft, ob er frei ist, auch solange HTTPS ausgeschaltet ist. |
| `NEODESK_CONSOLE_BIND` | Die Host-Adresse, auf der die Konsole veröffentlicht wird, zum Beispiel `127.0.0.1` hinter einem Reverse Proxy auf demselben Rechner. |
| `ADMIN_PASSWORD` | Das Passwort des Admins beim ersten Start. |
| `TRUST_PROXY` | `1`, wenn die Konsole hinter genau einem Reverse Proxy steht. |

[Konfiguration](/docs/operations/configuration) listet weitere Einstellungen.

## Das Admin-Passwort holen {#get-the-admin-password}

Der Container legt beim ersten Start das Konto `admin` mit einem zufälligen
Passwort aus 32 Zeichen an. Das Skript gibt es am Ende der Installation aus.
Noch einmal ausgeben kannst du es so:

```bash
docker compose exec neodesk neodesk-show-admin-credentials
```

```text
Admin Username: admin
Admin Password: <password>
Generated by: NeoDesk Docker bootstrap
Timestamp: <first-start-time>
```

Bei einer Installation mit dem Skript führst du den Befehl in
`/opt/neodesk/docker` aus.

Der Befehl liest `/opt/neodesk/data/.admin_credentials` im Daten-Volume. Antwortet
er mit „No readable admin credentials file found“, ist der erste Start noch
nicht fertig. Warte einen Moment und versuch es noch einmal, oder verfolge den
Start im Log:

```bash
docker compose logs -f neodesk
```

Sobald du das Admin-Passwort in der Konsole änderst, löscht der Server diese
Datei. Der Befehl meldet das dann und sagt, wie du ein neues Passwort setzt.
Bei einer Installation mit dem Skript erzeugt dieser Befehl ein neues
zufälliges Passwort und gibt es aus:

```bash
sudo bash neodesk-docker.sh reset-password
```

Bei einer Installation mit der Compose-Datei wählst du das neue Passwort selbst:
Tippe es nach dem ersten Befehl ein (es wird nicht angezeigt) und führe dann den
zweiten im Ordner mit der Compose-Datei aus:

```bash
read -rs NEWPASS
printf '%s\n' "$NEWPASS" | docker compose exec -T -u neodesk neodesk neodesk-server reset-password admin
```

### Das Passwort selbst wählen {#choose-the-password-yourself}

Willst du stattdessen mit deinem eigenen Passwort starten, trag
`ADMIN_PASSWORD` vor dem ersten Start in `.env` ein, oder übergib es dem
Skript wie oben gezeigt. `ADMIN_USERNAME` ändert auf dieselbe Weise den Namen
des Kontos. Setze für `<admin-password>` dein Passwort ein:

```ini
ADMIN_PASSWORD=<admin-password>
```

Das funktioniert nur, solange das Daten-Volume leer ist. Ein Konto, das es
schon gibt, behält sein Passwort. Das Passwort braucht mindestens 8 Zeichen,
und das Log warnt bei einem, das kürzer als 12 Zeichen ist.

## Anmelden {#sign-in}

Öffne `http://<server-address>:3375` im Browser, oder den Port, den du gewählt
hast, und melde dich als `admin` mit dem Passwort von oben an. Die Konsole
spricht auf diesem Port einfaches HTTP, kein HTTPS.

Mit [HTTPS mit Let's Encrypt](#https-with-lets-encrypt) öffnest du
stattdessen `https://<domain>`.

Weiter geht es mit [Die erste Anmeldung](/docs/getting-started/first-sign-in).

::: note
Port 3375 hat kein TLS. Bevor die Konsole aus dem Internet erreichbar ist, gib
ihr HTTPS: mit `--domain` wie unten oder mit einem eigenen Reverse Proxy davor
und `TRUST_PROXY=1`. Siehe
[Reverse Proxy und TLS](/docs/operations/reverse-proxy-tls).
:::

Die Konsole kann HTTPS auch selbst auf Port 5443 anbieten: Setze
`HTTPS_ENABLED=true` sowie `SSL_CERT_PATH` und `SSL_KEY_PATH` auf ein
Zertifikat und einen Schlüssel im Daten-Volume, unter `/opt/neodesk/data`.

## HTTPS mit Let's Encrypt {#https-with-lets-encrypt}

Erreichen die Leute den Server unter einem DNS-Namen, kann das Skript der
Konsole HTTPS geben. Es setzt einen kleinen Traefik-Container vor die Konsole.
Traefik holt für den Namen ein Zertifikat von Let's Encrypt, erneuert es selbst
und leitet einfaches HTTP auf HTTPS weiter.

Dafür braucht es:

- Einen DNS-Namen, der auf diesen Server zeigt. Für eine IP-Adresse oder einen
  Namen ohne Punkt stellt Let's Encrypt kein Zertifikat aus.
- Die Ports 80 und 443, frei auf dem Host und aus dem Internet erreichbar. Let's
  Encrypt prüft den Namen über Port 80.
- Eine E-Mail-Adresse, an die Let's Encrypt Hinweise zum Zertifikat schickt.

Für eine neue Installation setzt du für `<domain>` den DNS-Namen und für
`<email-address>` deine E-Mail-Adresse ein:

```bash
curl -fsSL https://neode.sk/install.sh | sudo bash -s -- --domain <domain> --letsencrypt-email <email-address>
```

Für eine Installation, die schon läuft, führst du das Skript in
`/opt/neodesk/docker` aus, mit denselben Werten für `<domain>` und
`<email-address>`. Es aktualisiert die Installation wie `update`, mit Backup,
und schaltet HTTPS ein:

```bash
sudo bash neodesk-docker.sh --domain <domain> --email <email-address>
```

Das Skript bricht ab, wenn ein anderes Programm Port 80 oder 443 belegt, und
warnt, wenn der Name noch nicht auf diesen Server zeigt. Dann wartet es bis zu
zwei Minuten auf das Zertifikat, und die Zusammenfassung zeigt die Konsole
unter `https://<domain>`. Ist das Zertifikat bis dahin nicht da, warnt es, und
Traefik versucht es weiter. Das Log von Traefik, in `/opt/neodesk/docker`,
sagt, warum:

```bash
docker compose logs traefik
```

### Was es ändert {#what-it-changes}

Das Skript schreibt diese Einstellungen in `.env`:

| Einstellung | Wert |
|-------------|------|
| `COMPOSE_PROFILES` | Bekommt `traefik`, das den Traefik-Container startet. |
| `NEODESK_DOMAIN` | Der DNS-Name. |
| `LETSENCRYPT_EMAIL` | Die E-Mail-Adresse. |
| `NEODESK_CONSOLE_BIND` | `127.0.0.1`: Die eigenen Ports der Konsole, 3375 und 5443, antworten nur noch auf dem Host selbst. |
| `TRUST_PROXY` | `1`: Die Konsole nimmt die Adresse jedes Besuchers von Traefik. |
| `PANEL_PUBLIC_URL` | `https://<domain>`, für die Links in E-Mails, außer du hast dort selbst eine andere Adresse gesetzt. |
| `LETSENCRYPT_CA_SERVER` | Nur mit `--letsencrypt-staging`: der Staging-Server von Let's Encrypt. |

Traefik belegt die Ports 80 und 443, eine Firewall vor dem Rechner braucht
also diese beiden statt 3375 und 5443. Traefik spricht TLS 1.2 oder neuer und
sagt Browsern per HSTS, für diesen Namen ein Jahr lang nur HTTPS zu nutzen. Das
Zertifikat liegt im Volume `neodesk-traefik-letsencrypt`.

Traefik leitet nur die Konsole weiter. ID-Server, Relay und die Client-API auf
21121 bleiben, wie sie sind, Clients behalten also ihre Werte und Ports.

Willst du es von Hand mit der Compose-Datei einrichten, trag diese Zeilen in
`.env` ein und setze für `<domain>` den DNS-Namen und für `<email-address>`
deine E-Mail-Adresse ein. Mit PostgreSQL heißt die erste Zeile
`COMPOSE_PROFILES=traefik,postgres`.

```ini
COMPOSE_PROFILES=traefik
NEODESK_DOMAIN=<domain>
LETSENCRYPT_EMAIL=<email-address>
NEODESK_CONSOLE_BIND=127.0.0.1
TRUST_PROXY=1
PANEL_PUBLIC_URL=https://<domain>
```

Erstelle die Container dann neu:

```bash
docker compose up -d
```

### Wann du es nicht nutzt {#when-not-to-use-it}

- Ein anderer Webserver oder ein eigener Reverse Proxy belegt auf diesem Host
  die Ports 80 und 443. Setze die Konsole dann hinter diesen Proxy; siehe
  [Reverse Proxy und TLS](/docs/operations/reverse-proxy-tls).
- Der Server ist aus dem Internet nicht auf Port 80 erreichbar. Dann kann Let's
  Encrypt den Namen nicht prüfen.

### Wieder ausschalten {#turn-it-off}

In `/opt/neodesk/docker`:

```bash
sudo bash neodesk-docker.sh --no-traefik
```

Das entfernt den Traefik-Container und nimmt `traefik` aus
`COMPOSE_PROFILES`. Es löscht `NEODESK_DOMAIN`, `LETSENCRYPT_CA_SERVER` und
`TRUST_PROXY` aus `.env`, dazu `NEODESK_CONSOLE_BIND` und `PANEL_PUBLIC_URL`,
solange sie noch die Werte haben, die es gesetzt hat. Die Konsole ist dann
wieder für jede Adresse auf Port 3375 veröffentlicht. `TRUST_PROXY` löscht es
auch, wenn du den Wert selbst gesetzt hast: Setz ihn wieder, wenn ein eigener
Proxy davor steht. Das Volume mit dem Zertifikat bleibt.

## Die Relay-Adresse {#the-relay-address}

Clients brauchen die Adresse des Relay-Servers, also muss der Server seine
eigene öffentliche Adresse kennen. Das Skript ermittelt sie einmal und
speichert sie als `RELAY_SERVERS` in `.env`.

Steht dort kein Wert, ermittelt der Container sie bei jedem Start: Er fragt
checkip.amazonaws.com nach seiner öffentlichen IPv4-Adresse, bei einem Fehler
dann api.ipify.org oder ifconfig.me, und nimmt die Antwort. Das Log zeigt das
Ergebnis in einer Zeile, die mit `Relay IP:` beginnt.

Der Server selbst fragt diese Dienste außerdem bei jedem Start einmal nach
seiner Adresse, ob `RELAY_SERVERS` einen Wert hat oder nicht, und loggt die
Antwort als `Detected public IP`. Steht ein Wert in `RELAY_SERVERS`, bekommen
Clients trotzdem diesen Wert. [Datenschutz](/docs/project/privacy#the-public-ip-address)
listet die Hosts.

Schlägt die Abfrage fehl oder liefert sie eine private Adresse, zeigt das Log
eine Warnung, und Clients außerhalb deines Netzwerks können das Relay nicht
nutzen. Setze die Adresse dann selbst in `.env`. Setze für `<public-address>`
die öffentliche IP-Adresse oder den DNS-Namen ein, unter dem Clients den
Server erreichen:

```ini
RELAY_SERVERS=<public-address>
```

Für einen Server, der nur dein lokales Netzwerk bedient, trage dort seine
LAN-Adresse ein. Erstelle dann den Container neu:

```bash
docker compose up -d
```

## Wo die Daten liegen {#where-the-data-lives}

| Volume | Eingehängt unter | Inhalt |
|--------|------------------|--------|
| `neodesk-data` | `/opt/neodesk/data` | Die Datenbank `db_v2.sqlite3`, das Schlüsselpaar `id_ed25519` und `id_ed25519.pub`, der API-Schlüssel `.api_key`, `.admin_credentials` und der Schlüssel für gespeicherte Passwörter von Remote-Zielen, `.remote_target_vault_key` |
| `neodesk-console-data` | `/app/data` | Die eigenen Dateien der Konsole, etwa hochgeladene Bilder, Schriften, Builds des Support-Agenten und die in der Konsole gespeicherten öffentlichen Client-Endpunkte |
| `neodesk-postgres-data` | `/var/lib/postgresql/data` | Nur mit PostgreSQL |
| `neodesk-traefik-letsencrypt` | `/letsencrypt` im Traefik-Container | Nur mit [HTTPS mit Let's Encrypt](#https-with-lets-encrypt): das Zertifikat und das Konto bei Let's Encrypt |

Die Compose-Datei benennt die Volumes selbst, deshalb sind die Namen gleich,
egal wie der Ordner heißt. `docker volume ls` listet sie. Eine Installation
von 3.6.0-rc.4 oder älter hat `neodesk-data` unter `/opt/rustdesk` eingehängt,
und das Update des Skripts hängt es nach `/opt/neodesk/data` um. Eine eigene
Compose-Datei, die es noch unter `/opt/rustdesk` einhängt, funktioniert weiter,
und das Log sagt, dass du sie ändern sollst.

::: warning
Clients vertrauen dem Schlüsselpaar des Servers in `neodesk-data`. Löschst du
dieses Volume, erzeugt der Server beim nächsten Start einen neuen Schlüssel,
und jeder Client braucht den neuen Schlüssel. `docker compose down -v` löscht
die Volumes.
:::

Zu Backups siehe [Backup und Wiederherstellung](/docs/operations/backup).

## Stoppen, starten und Logs {#stop-start-and-logs}

```bash
docker compose stop
docker compose start
docker compose logs -f neodesk
```

`docker compose down` entfernt den Container und sein Netzwerk und behält die
Volumes. Der Container hat die Restart-Policy `unless-stopped`: Nach einem
Neustart des Hosts kommt er wieder hoch, außer du hast ihn gestoppt.

Die ersten Zeilen des Logs zeigen die Version, die Datenbank und die
Relay-Adresse. Beim ersten Start zeigen sie auch den Registrierungsmodus.

## Registrierungsmodus {#enrollment-mode}

Auf einem neuen Daten-Volume startet der Container im Registrierungsmodus
**Verwaltet**. Ein RustDesk-Client, der sich zum ersten Mal verbindet, wartet
unter **Registrierungsanfragen**, bis jemand ihn genehmigt. Du kannst den
Modus in der Konsole ändern, siehe
[Registrierungsanfragen](/docs/console/enrollment). Der Modus, den du dort
wählst, bleibt nach einem Neustart erhalten.

`ENROLLMENT_MODE=open`, `managed` oder `locked` in `.env` legt nur den Modus
fest, mit dem der Server startet, solange keiner gespeichert ist. Soll der
Server ihn bei jedem Start anwenden, auch gegen das, was die Konsole
gespeichert hat, setze zusätzlich `ENROLLMENT_MODE_ENV_OVERRIDE=Y`.

## PostgreSQL {#postgresql}

SQLite ist der Standard. Die Compose-Datei hat außerdem einen Service
`postgres`, der PostgreSQL in einem zweiten Container betreibt: `--postgres`
installiert darauf, und der Befehl `postgres` des Skripts zieht eine
bestehende Installation um. Wie du das von Hand machst, steht unter
[PostgreSQL](/docs/operations/postgresql).

## Aktualisieren {#updating}

```bash
docker compose pull
docker compose up -d
```

Das lädt das neueste Image deines Tags und erstellt den Container neu; die
Volumes bleiben. Führst du das Skript noch einmal aus, macht es dasselbe, mit
einem Backup vorher. [Aktualisieren](/docs/operations/updating) hat die
Details.

## Das Image aus dem Repository bauen {#build-the-image-from-the-repository}

Willst du eigene Änderungen betreiben, baue das Image stattdessen aus einem
Checkout. Das Repository hat dafür eine zweite Compose-Datei,
`install/docker-compose.single.yml`:

```bash
git clone https://github.com/neodeskapp/neodesk.git
cd neodesk
docker compose -f install/docker-compose.single.yml up -d --build
```

Der Build läuft in Containern: Er baut die Web-App mit Node.js, baut den
Server mit der Web-App darin und kopiert das eine Binary in ein kleines
Alpine-Image namens `neodesk:local`. Der Host braucht weder Node.js noch Go,
aber der Build lädt npm-Pakete, Go-Module und Alpine-Pakete herunter, und der
erste Build dauert ein paar Minuten.

Diese Datei funktioniert wie die veröffentlichte, mit diesen Unterschieden:

- Jeder Befehl braucht `-f install/docker-compose.single.yml`. So gibst du zum
  Beispiel das Admin-Passwort aus:

  ```bash
  docker compose -f install/docker-compose.single.yml exec neodesk neodesk-show-admin-credentials
  ```
- Compose stellt jedem Volume-Namen den Namen des Ordners der Compose-Datei
  voran, `install`, das Daten-Volume heißt also `install_neodesk-data`.
- Das PostgreSQL-Passwort heißt hier `PG_PASSWORD`, nicht `POSTGRES_PASSWORD`.
- `docker compose pull` aktualisiert diese Installation nicht. Hol den neuen
  Stand des Repositorys und baue neu; `NEODESK_COMMIT_SHA` teilt dem Binary
  seinen Commit mit:

  ```bash
  git pull
  NEODESK_COMMIT_SHA=$(git rev-parse HEAD) docker compose -f install/docker-compose.single.yml up -d --build
  ```

`sudo bash install/neodesk-docker.sh --build`, im Checkout ausgeführt, baut dasselbe
Image als `ghcr.io/neodeskapp/neodesk:local` und installiert es wie das
veröffentlichte.
