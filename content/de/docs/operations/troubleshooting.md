---
title: Fehlersuche
description: Logs, Health-Checks und was du prüfst, wenn Konsole, Anmeldung, Client-Verbindungen, der Schlüssel oder das Relay Probleme machen.
order: 7
---

Fang mit dem Log und den Health-Checks unten an. Die Abschnitte danach gehen nach Symptomen vor und nennen die Log-Zeilen und Einstellungen, die auf die Ursache zeigen.

## Wo die Logs liegen {#where-the-logs-are}

Server und Konsole schreiben ein gemeinsames Log.

- Docker, im Ordner mit der Compose-Datei, nach einer Installation mit dem Skript also in `/opt/neodesk/docker`:

  ```bash
  docker compose logs -f neodesk
  ```

- Linux, wo der Menüpunkt **Diagnostics** des Installers mehr sammelt:

  ```bash
  journalctl -u neodesk-server -f
  ```

- Windows: `C:\NeoDesk\logs\server.log`. Der Menüpunkt **Diagnostics** von `C:\NeoDesk\neodesk.ps1` prüft die Ports und den Dienst.

Der Linux-Installer schreibt außerdem für jeden Lauf ein eigenes Log, `/tmp/neodesk_<date>_<time>.log`. Schau dort nach, wenn eine Installation oder ein Update mit einem Fehler abbricht.

`LOG_LEVEL` in der env-Datei bestimmt, wie viel im Log steht; eine neue Installation setzt `info`. Mit `warn` oder `error` fehlen die Zeilen der Stufe info, etwa die Startübersicht, `[console] listening on ...` und die meisten Zeilen, die diese Seite zitiert. Um sie zu sehen, setze `LOG_LEVEL=info` in `/opt/NeoDeskConsole/.env` oder `C:\NeoDeskConsole\.env` und starte den Dienst neu.

## Health-Checks {#health-checks}

Die Konsole beantwortet `/health` und die API `/api/health`, beide ohne Anmeldung. Wo die Konsole antwortet, hängt von der Installationsart ab, weil die Installer für Linux und Windows HTTPS mit einem selbst signierten Zertifikat einschalten.

Docker, wo die Konsole auf 3375 unverschlüsseltes HTTP spricht:

```bash
curl http://localhost:3375/health
curl http://localhost:21121/api/health
```

Linux, wo die Konsole auf 5443 liegt und der unverschlüsselte Port 3375 nur dorthin weiterleitet. `-k` nimmt das selbst signierte Zertifikat an:

```bash
curl -k https://localhost:5443/health
curl http://localhost:21121/api/health
```

Windows, in PowerShell. Tippe `curl.exe`, weil `curl` allein in Windows PowerShell ein anderer Befehl ist:

```powershell
curl.exe -k https://localhost:5443/health
curl.exe http://localhost:21121/api/health
```

Jeder antwortet mit JSON:

```text
{"status":"ok","timestamp":"..."}
{"status":"ok","version":"..."}
```

Unter Linux und Windows antwortet `curl http://localhost:3375/health` stattdessen mit `Temporary Redirect`. Läuft die Konsole ohne HTTPS, etwa hinter einem Reverse Proxy, nimm die Zeile für Docker. Bei einer Installation unter Linux oder Windows, die vor 3.6.0-rc.5 entstanden ist, setze für 3375 den Port 5000 der Konsole ein.

Port 21121 antwortet bei jeder Installationsart; unter Linux und Windows reicht die Konsole die Anfrage an die API des Servers auf 21114 weiter. Unter Docker zeigt `docker compose ps` den Container als „healthy“, wenn beide antworten.

Das Binary kann die Health-Adressen und Ports in einem Durchgang prüfen und gibt für jede Prüfung eine Zeile PASS oder FAIL aus:

```bash
docker compose exec neodesk neodesk-server check --port 21116 --port 21117
```

Bei einer Linux-Installation gibst du den Port der API und die HTTPS-Adresse der Konsole an. `--insecure` nimmt das selbst signierte Zertifikat an:

```bash
sudo /opt/neodesk/neodesk-server check --api http://127.0.0.1:21114/api/health --panel https://127.0.0.1:5443/health --insecure --port 21116 --port 21117
```

Unter Windows, in PowerShell als Administrator, ist das die Prüfung, die der Installer ausführt:

```powershell
& C:\NeoDesk\neodesk-server.exe check --api http://127.0.0.1:21114/api/health --panel https://127.0.0.1:5443/health --insecure --port 127.0.0.1:21116 --port 127.0.0.1:21117
```

`/api/health/detail` und `/metrics` liefern mehr, aber nur an die Adressen in `METRICS_IP_ALLOWLIST` oder mit einem API-Schlüssel.

## Die Konsole öffnet nicht {#the-console-does-not-open}

- Nutze die Adresse deiner Installationsart. Docker: `http://<server-address>:3375`, unverschlüsseltes HTTP, außer du hast HTTPS eingerichtet. Linux und Windows: `https://<server-address>:5443`, weil die Installer HTTPS mit einem selbst signierten Zertifikat einschalten, vor dem der Browser warnt. Ihr unverschlüsselter Port, 3375 (oder 5000 bei einer Installation, die vor 3.6.0-rc.5 entstanden ist), leitet nur dorthin weiter.
- Der unverschlüsselte Port leitet auf den Host in `PANEL_PUBLIC_HOST` weiter. Die Installer setzen dort die Adresse, die die Clients nutzen, oft die öffentliche IP-Adresse. Aus demselben Netz antwortet diese Adresse manchmal nicht, etwa hinter einem Router ohne Hairpin-NAT. Öffne dann `https://<lan-address>:5443` direkt; das Zertifikat der Installer gilt auch für die LAN-Adresse des Rechners.
- Eine Docker-Installation, die auf 5000 antwortete, wechselt beim ersten Update auf 3.6.0-rc.5 oder neuer auf 3375, außer `NEODESK_CONSOLE_PORT` in ihrer `.env` nennt einen Port. Siehe [Der Port der Konsole nach dem Update](/docs/operations/updating#the-consoles-port-after-the-update).
- Mit `CONSOLE_PORT=0` ist die Konsole aus. Eine Minimalinstallation (`--minimal`) setzt das.
- Mit `HOST=127.0.0.1` antwortet die Konsole nur auf dem Rechner selbst. Das willst du hinter einem Reverse Proxy auf demselben Rechner.
- `[console] ERROR: HTTP port 3375 is already in use` im Log heißt, dass ein anderes Programm den Port belegt. Ist `CONSOLE_PORT` gar nicht gesetzt, läuft der Server ohne seine Konsole weiter und loggt `the server runs without its console`. Setze `CONSOLE_PORT` auf einen freien Port. Unter Docker startet Compose den Container nicht, wenn der Host-Port belegt ist.
- Mit `HTTPS_ENABLED=true` und einem Zertifikat liegt die Konsole auf Port 5443, und der unverschlüsselte Port leitet dorthin weiter oder zeigt eine Seite, die dich bittet, `PANEL_PUBLIC_HOST` zu setzen.
- Die Firewall. Die Installer für Linux und Windows öffnen die Ports der Konsole in der Firewall des Rechners; eine Firewall vor dem Rechner, etwa die eines Cloud-Anbieters, ist deine Sache. Siehe [Ports und Firewall](/docs/operations/ports).

## Admin-Passwort vergessen {#forgot-the-admin-password}

Unter Docker gibt `neodesk-show-admin-credentials` das erste Passwort nur so lange aus, bis jemand es ändert; siehe [Das Admin-Passwort holen](/docs/getting-started/docker#get-the-admin-password). Bei einer Installation mit dem Skript gibt `sudo bash neodesk-docker.sh reset-password`, ausgeführt in `/opt/neodesk/docker`, `admin` ein neues zufälliges Passwort und zeigt es einmal an. Um das Passwort selbst zu wählen, und bei einer Installation mit der Compose-Datei, tippe es nach dem ersten Befehl ein (es wird nicht angezeigt) und führe dann den zweiten im Ordner mit der Compose-Datei aus:

```bash
read -rs NEWPASS
printf '%s\n' "$NEWPASS" | docker compose exec -T -u neodesk neodesk neodesk-server reset-password admin
```

Unter Linux setzt `sudo neodesk-setup --reset-password` das Passwort aus `ADMIN_PASSWORD` oder auf ein zufälliges und zeigt es einmal an. Im Menü von `sudo neodesk-setup` kannst du unter **Reset admin password** auch selbst eines eintippen. Der eigene Befehl des Servers funktioniert ebenfalls, ausgeführt als Dienstkonto:

```bash
read -rs NEWPASS
printf '%s\n' "$NEWPASS" | sudo -u neodesk env NEODESK_ENV_FILE=/opt/NeoDeskConsole/.env /opt/neodesk/neodesk-server reset-password admin
```

Unter Windows öffnest du PowerShell als Administrator, startest das Menü des Skripts und wählst **Reset admin password**. Das setzt das Konto `admin` zurück, auf ein zufälliges Passwort oder eines, das du eintippst. `-ExecutionPolicy Bypass` lässt das Skript in jedem neuen Fenster laufen, auch wo Skripte gesperrt sind:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File C:\NeoDesk\neodesk.ps1
```

Der eigene Befehl des Servers funktioniert auch unter Windows, für jeden Kontonamen. Tippe das Passwort an der Eingabeaufforderung ein; es wird nicht angezeigt:

```powershell
$env:NEODESK_ENV_FILE = 'C:\NeoDeskConsole\.env'
$pass = Read-Host 'New password' -AsSecureString
[Net.NetworkCredential]::new('', $pass).Password | & C:\NeoDesk\neodesk-server.exe reset-password admin
```

`reset-password` funktioniert mit SQLite und PostgreSQL und wirkt sofort. Es liest das Passwort von der Standardeingabe und weigert sich, es von einem Terminal zu lesen, damit es nie sichtbar wird. Das Passwort braucht mindestens 8 Zeichen, dieselbe Regel wie überall sonst. Gibt es kein Konto mit diesem Namen, legt der Befehl eines mit der Admin-Rolle an. Eine Sperre nach Fehlversuchen endet von selbst, 15 Minuten nach dem letzten Versuch.

`reset-password` lässt die Zwei-Faktor-Anmeldung, wie sie ist. Hat der einzige Admin Handy und Wiederherstellungscodes verloren, gib dem Befehl einen Namen, den es noch nicht gibt, etwa `recovery`, damit er ein zweites Admin-Konto anlegt. Melde dich damit an, öffne **Personen**, **Benutzer** und wähle im Zeilenmenü des ersten Kontos **Zwei-Faktor-Anmeldung ausschalten…**, oder **Zwei-Faktor-Anmeldung zurücksetzen…**, wenn die Zwei-Faktor-Anmeldung für das Konto verlangt ist. Lösche danach das zusätzliche Konto. Siehe [Zwei-Faktor-Anmeldung](/docs/people/two-factor).

## Anmeldung meldet „Zu viele Versuche“ {#sign-in-says-too-many-attempts}

Die Konsole lehnt eine Anmeldung mit „Zu viele Versuche. Bitte versuche es später erneut.“ ab, wenn eines dieser Limits erreicht ist:

- 5 Anmeldeversuche von einer Adresse innerhalb einer Minute,
- 10 fehlgeschlagene Anmeldungen eines Kontos von einer Adresse innerhalb von 15 Minuten. Sie sperren dieses Konto für diese Adresse bis 15 Minuten nach der letzten,
- 30 fehlgeschlagene Anmeldungen von einer Adresse, für beliebige Konten, innerhalb von 15 Minuten.

Hinter einem Reverse Proxy ohne `TRUST_PROXY` teilen sich alle Menschen die Adresse des Proxys und erreichen diese Limits gemeinsam. Setze die Variable wie unter [Reverse Proxy und TLS](/docs/operations/reverse-proxy-tls#trusting-the-proxy) beschrieben. Sonst warte, oder ändere die Limits; siehe [Konfiguration](/docs/operations/configuration#sign-in-and-rate-limits).

## Clients zeigen „not ready“ oder bekommen keine Verbindung {#clients-show-not-ready-or-cannot-connect}

- Vergleiche ID-Server und Schlüssel des Clients mit **Client-Einrichtung** auf der **Übersicht**. **Was Clients jetzt erhalten** unter **Einstellungen**, **Allgemein** zeigt dieselben Adressen, aber nicht den Schlüssel. Siehe [Einen RustDesk-Client verbinden](/docs/getting-started/connect-a-client).
- Stelle sicher, dass das Netz des Clients Port 21116 über TCP und UDP erreicht, und 21115.
- In den Beitrittsmodi `managed` und `locked` kann sich ein neues Gerät erst registrieren, wenn jemand es unter **Beitrittsanfragen** freigibt. Eine neue Installation startet in `managed`. Das Log zeigt `Rejected new peer <id> from <address> (enrollment policy)`. Siehe [Beitrittsanfragen](/docs/console/enrollment).
- `Rate limited RegisterPk for new peer` im Log heißt, dass sich mehr als `SIGNAL_RATE_LIMIT_PER_IP` neue Geräte (20 pro Minute) von einer Adresse registriert haben. Erhöhe den Wert, wenn sich viele Geräte eine öffentliche Adresse teilen.
- Hat der Server seine Schlüsseldatei verloren, hat er einen neuen Schlüssel erzeugt, und Clients mit dem alten können sich nicht verbinden. Stelle die alte Schlüsseldatei wieder her oder gib den Clients den neuen Schlüssel; siehe [warum die Schlüsseldatei zählt](/docs/operations/backup#why-the-key-file-matters).
- Ein RustDesk-Client erscheint in der Konsole als online, aber ohne Hostname, Benutzer oder Betriebssystem, oder die Anmeldung aus dem Client scheitert: Sein **API-Server** nennt die falsche Adresse oder den falschen Port. Setze es in den Netzwerkeinstellungen des Clients auf `http://<server-address>:21121`. Bleibt es leer, ruft der normale RustDesk-Client Port 21114 auf der Adresse des ID-Servers auf, den die Installer nicht öffnen und Docker nicht veröffentlicht. Siehe [den API-Port](/docs/operations/ports#the-api-port-on-linux-and-windows).
- Registriert sich ein Client zum ersten Mal, seit der Server gestartet ist, zeigt das Log `[signal] New peer registered: <id> from <address>`.
- `Rejected outbound from <address> (... reason=...)` nennt, warum der Server keine Sitzung für den anfragenden Computer gestartet hat. `initiator_pending_enrollment`: Er wartet unter **Beitrittsanfragen**. `initiator_not_registered`: Von dieser Adresse hat sich kein Gerät bei diesem Server registriert. `initiator_banned`: Das Gerät ist gesperrt. `initiator_ambiguous_same_nat`: Mehrere Geräte teilen sich die öffentliche Adresse des anfragenden Computers, etwa in einem Büro hinter einem Router, und der Server kann nicht erkennen, welches davon es ist. Der Client zeigt dann „ID does not exist“. `ALLOW_SHARED_NAT_INITIATOR=Y` lässt einen Computer an einer solchen Adresse trotzdem Sitzungen starten, ohne dass der Server weiß, welches Gerät gefragt hat; siehe [Konfiguration](/docs/operations/configuration).
- Ein Computer, der neu eingerichtet oder zurückgesetzt wurde, kann mit seiner alten ID und einem neuen Schlüssel zurückkommen. Das Log zeigt `[signal] PK mismatch for <id>`, und die Konsole zeigt das Gerät offline mit einem Hinweis **Neuer Schlüssel** im Tab **Übersicht**. Genehmige den neuen Schlüssel oder lösche das Gerät; siehe [Ein neu installierter oder zurückgesetzter Computer](/docs/console/add-a-computer#a-reinstalled-or-reset-computer).
- Nach einem Umzug von einem RustDesk-Server siehe [Umzug von einem RustDesk-Server](/docs/getting-started/migrate-from-rustdesk).

## Der Schlüssel des Servers {#the-servers-key}

Bei jedem Start loggt der Server seinen öffentlichen Schlüssel als `Server public key: <key>`. Der **Schlüssel** in jedem Client muss derselbe sein.

Das Schlüsselpaar sind `id_ed25519` und `id_ed25519.pub`: unter Linux in `/opt/neodesk/`, unter Windows in `C:\NeoDesk\` und unter Docker im Volume `neodesk-data`, das der Container unter `/opt/neodesk/data/` einbindet.

- `Failed to initialize keypair: keys: public key file does not match private key`, und der Server startet nicht: `id_ed25519.pub` gehört nicht zu `id_ed25519`, zum Beispiel weil nur eine der beiden Dateien ersetzt wurde. Lege das Paar zurück, das zusammengehört.
- `Failed to initialize keypair: keys: failed to read private key ...`: Das Konto, unter dem der Server läuft, kann `id_ed25519` nicht lesen. Unter Linux startest du das Menü des Installers und wählst **Repair installation**, dann **Repair permissions**:

  ```bash
  sudo neodesk-setup
  ```

- `Failed to initialize keypair: keys: invalid base64` oder `invalid private key size`: `id_ed25519` ist keine Schlüsseldatei, die der Server lesen kann. Schlüsseldateien von `ssh-keygen` gehören dazu. Der Server liest die Dateien, die er selbst erzeugt, und die eines RustDesk-Servers.

Für ein neues Paar stoppst du den Server, verschiebst beide Dateien an einen anderen Ort und startest ihn wieder: Ohne `id_ed25519` erzeugt er ein neues Paar. Jeder Client braucht dann den neuen Schlüssel.

## Verbindungen über das Relay scheitern {#connections-fail-through-the-relay}

Können sich zwei Geräte nicht direkt verbinden, schickt der Server beide zu seinem Relay. Als Adresse gibt er ihnen die erste dieser drei, die gesetzt ist:

1. **Öffentlicher Relay-Server** unter **Einstellungen**, **Allgemein**. Der Server übernimmt einen gespeicherten Wert sofort, und sein Log meldet beim Start `Relay for devices: <address>, the public relay server of the console's settings`.
2. `RELAY_SERVERS`.
3. Die öffentliche Adresse, die der Server erkannt hat, sonst seine LAN-Adresse.

Steht in **Öffentlicher Relay-Server** also eine falsche Adresse, korrigiere sie dort; `RELAY_SERVERS` zählt nicht, solange das Feld gesetzt ist.

- Unter Docker ohne `RELAY_SERVERS` in `.env` ermittelt der Container die öffentliche Adresse bei jedem Start und loggt `Relay IP: ... (auto-detected)`. `Auto-detected IP ... is private` oder `Could not auto-detect public IP for relay` heißen, dass das nicht geklappt hat. Setze dann `RELAY_SERVERS=<public-address>` in der Datei `.env` neben der Compose-Datei, mit der Adresse, unter der die Clients den Server erreichen, und erstelle den Container neu. Siehe [Die Relay-Adresse](/docs/getting-started/docker#the-relay-address).

  ```bash
  docker compose up -d
  ```

- Unter Linux und Windows hat der Installer die Relay-Adresse bei der Installation in die Argumente des Dienstes geschrieben, die öffentliche oder die LAN-Adresse. Ist sie falsch oder hat sich deine öffentliche Adresse geändert, setze `RELAY_SERVERS` in der env-Datei, das gegen das Argument gewinnt, und starte den Dienst neu. Unter Linux:

  ```bash
  sudo systemctl restart neodesk-server
  ```

  Unter Windows heißen Dienst und geplante Aufgabe `NeoDeskServer`; [Dateien und der Dienst](/docs/getting-started/windows#files-and-the-service) zeigt, wie du beide neu startest.
- Port 21117 muss für TCP offen sein.
- `[relay] Pair timeout for UUID ...` im Log heißt, dass nur ein Gerät das Relay innerhalb von 30 Sekunden erreicht hat. Das andere erreicht die Relay-Adresse nicht.
- `[relay] Pair established: <address> <-> <address>` heißt, dass beide Geräte das Relay erreicht haben und es die Sitzung trägt.

## Hinter einem Proxy: abgemeldet oder die falsche Adresse {#behind-a-proxy-signed-out-or-the-wrong-address}

Direkt nach der Anmeldung wieder abgemeldet:

- Mit **Eine Sitzung pro Konto** unter **Einstellungen**, **Anmeldung** oder mit `SESSION_MAX_PER_USER=1` darf ein Konto nur eine Sitzung zur selben Zeit haben. Eine Anmeldung mit demselben Konto in einem anderen Browser beendet die frühere Sitzung.
- Mit `HTTPS_ENABLED=true` und einem Zertifikat leitet der unverschlüsselte Port nur auf den eigenen HTTPS-Port der Konsole weiter, und ein Proxy, der Anfragen an den unverschlüsselten Port schickt, bekommt keine Konsole. Hinter einem Proxy siehe [Sichere Cookies](/docs/operations/reverse-proxy-tls#secure-cookies).
- Ein neues Sitzungsgeheimnis meldet alle ab. Ohne `SESSION_SECRET` hält die Konsole es in ihrem Datenordner, ein verlorenes Volume `neodesk-console-data` erzeugt also ein neues.

Client-Einrichtung, QR-Codes oder Installationsbefehle zeigen die falsche Adresse: Ohne eigene Einstellungen nimmt die Konsole den Host aus `PANEL_PUBLIC_HOST`, aus ihrer API-Adresse oder aus der Adresse, die der Browser genutzt hat. Trage die Adressen unter **Öffentliche Client-Endpunkte** in **Einstellungen**, **Allgemein** ein; siehe [Die Adressen prüfen, die Clients bekommen](/docs/operations/reverse-proxy-tls#check-the-addresses-clients-get).

## Docker: Der Container bleibt nicht am Laufen {#docker-the-container-does-not-stay-up}

- `ERROR: /opt/neodesk/data is NOT writable by the neodesk user` erscheint bei einem Bind-Mount, dessen Ordner einem anderen Benutzer gehört. Setze `PUID` und `PGID` in `.env` auf den Besitzer des Ordners, ändere den Besitzer auf 10001 oder nutze die benannten Volumes der Compose-Datei.
- `Failed to open database` mit PostgreSQL: Prüfe `DATABASE_URL` und ob der Container `postgres` läuft. Ohne `COMPOSE_PROFILES=postgres` in `.env` startest du ihn mit `--profile postgres`. Siehe [PostgreSQL](/docs/operations/postgresql).
