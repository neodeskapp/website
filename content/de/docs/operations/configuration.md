---
title: Konfiguration
description: Wie der Server seine Einstellungen liest, wo du sie für Docker, Linux und Windows setzt, und die Einstellungen, die Betreiber am häufigsten ändern.
order: 1
---

Der Server und die Web-Konsole laufen in einem Prozess, und beide lesen ihre Einstellungen aus Umgebungsvariablen. Diese Seite zeigt, wo du sie für jede Installationsart setzt, und listet die auf, die du am ehesten änderst.

## Wie der Server seine Einstellungen liest {#how-the-server-reads-its-settings}

- Umgebungsvariablen: Jede Einstellung auf dieser Seite ist eine. Ein/Aus-Einstellungen akzeptieren `1` oder `0`, `true` oder `false`, `yes` oder `no`, `y` oder `n` und `on` oder `off`, in beliebiger Groß- und Kleinschreibung.
- Kommandozeilen-Flags: Manche Einstellungen haben zusätzlich ein Flag, das in den Tabellen unten steht, und `neodesk-server -h` gibt alle aus. Wird eine Einstellung auf beiden Wegen gesetzt, gewinnt die Umgebungsvariable.
- Eine env-Datei: Wenn `NEODESK_ENV_FILE` eine Datei nennt, liest der Server sie einmal beim Start. Jede Zeile hat die Form `KEY=value`, und Zeilen, die mit `#` beginnen, sind Kommentare. Werte dürfen in Anführungszeichen stehen, und ` #` nach einem Wert beginnt einen Kommentar, wie in anderen `.env`-Dateien. Die Datei füllt nur Variablen, die in der Umgebung leer sind, und für jede Variable zählt die erste Zeile mit einem Wert. Bei jedem Start ergänzt der Server außerdem die Einstellungen seines Releases, die in der Datei fehlen, mit ihren Standardwerten.
- In der Konsole gespeicherte Einstellungen: Sobald du sie speicherst, liegen manche Einstellungen in der Datenbank und gewinnen gegen die Umgebung, die dann nur noch den ersten Standardwert liefert. Das sind die Verbindungsstrategie, die Einstellungen zur Zeitsynchronisation, die Sitzungsdauern der RustDesk-Clients und der Registrierungsmodus. **Öffentliche Client-Endpunkte** liegen in `public-endpoints.env` im Datenordner und gewinnen gegen `PUBLIC_SERVER_ID`, `PUBLIC_RELAY_SERVER` und `PUBLIC_API_URL`; speicherst du eine Adresse leer, zählt ihre Variable wieder. Zwei Schalter lassen stattdessen die Umgebung gewinnen: `ENROLLMENT_MODE_ENV_OVERRIDE` für den Registrierungsmodus und `PUBLIC_ENDPOINTS_ENV_OVERRIDE` für die öffentlichen Client-Endpunkte.

Starte den Server neu, nachdem du eine Variable geändert hast. Er liest seine Umgebung und die env-Datei nur beim Start.

## Docker {#docker}

Die Compose-Datei gibt jede Zeile der Datei `.env` daneben an den Container weiter (Docker Compose 2.24 oder neuer), deshalb gehören deine Einstellungen dorthin. Nach einer Installation mit dem Skript ist das `/opt/neodesk/docker/.env`. Ein Beispiel; setze für `<public-address>` die Adresse ein, unter der die Clients den Server erreichen:

```ini
RELAY_SERVERS=<public-address>
TRUST_PROXY=Y
LOGIN_RATE_LIMIT_MAX=10
```

Erstelle den Container danach im selben Ordner neu:

```bash
docker compose up -d
```

[Einstellungen in .env](/docs/getting-started/docker#settings-in-env) listet die Einstellungen der Compose-Datei selbst auf, etwa den Image-Tag.

Die Liste `environment:` in der Compose-Datei gewinnt gegen `.env`. Die meisten Einträge haben die Form `NAME=${NAME:-default}` und nehmen ihren Wert ohnehin aus `.env`, manche sind aber fest, darunter `HOST=0.0.0.0`, `CONSOLE_PORT=3375`, `API_ENABLED=false`, `DATA_DIR=/app/data` und die Pfade in den Volumes. Um die Konsole auf einem anderen Host-Port oder nur auf einer Adresse des Hosts zu veröffentlichen, setze `NEODESK_CONSOLE_PORT`, `NEODESK_CONSOLE_HTTPS_PORT` und `NEODESK_CONSOLE_BIND` in `.env`; siehe [Einen Port ändern](/docs/operations/ports#changing-a-port).

`ADMIN_USERNAME` und `ADMIN_PASSWORD` zählen nur vor dem ersten Start; die Compose-Datei gibt sie als erstes Admin-Konto weiter.

## Linux {#linux}

Der Installer betreibt den Server als systemd-Dienst `neodesk-server`, definiert in `/etc/systemd/system/neodesk-server.service`. Die Unit setzt `NEODESK_ENV_FILE` auf die env-Datei der Konsole, standardmäßig `/opt/NeoDeskConsole/.env`, und diese Datei enthält die meisten Einstellungen.

Die Unit setzt außerdem selbst ein paar Variablen, und die gewinnen gegen die env-Datei: `GO_API_PORT=21114`, `MESH_ENABLED=Y` und die bei der Installation gewählte Verbindungsstrategie (`P2P_FIRST`, `ALWAYS_USE_RELAY`, `P2P_FALLBACK_MS` und `SAME_NAT_RELAY`). Ihre Kommandozeile übergibt die Relay-Adresse, die Schlüsseldatei, den API-Port, das Ratenlimit für Registrierungen und, wenn der Installer Zertifikate erzeugt hat, die TLS-Flags. Eine Variable in der env-Datei überschreibt das passende Flag, zum Beispiel überschreibt `RELAY_SERVERS` das Flag `-relay-servers`. Der Installer schreibt die Unit bei jedem Update und jeder Reparatur neu, mit den Argumenten und zusätzlichen Einstellungen, die sie vorher hatte.

Bearbeite die env-Datei und starte danach neu:

```bash
sudoedit /opt/NeoDeskConsole/.env
sudo systemctl restart neodesk-server
```

Der Installer kann auch Einstellungen ändern, die seine eingebaute Vorlage kennt, und startet den Dienst danach neu:

```bash
sudo neodesk-setup --set-config TRUST_PROXY=Y --set-config LOG_LEVEL=info
```

## Windows {#windows}

Der Installer registriert den Dienst `NeoDeskServer`. Seine env-Datei ist `C:\NeoDeskConsole\.env`, und der Dienst setzt `NEODESK_ENV_FILE`, `GO_API_PORT=21114` und `MESH_ENABLED=Y` selbst. Bearbeite die Datei und starte den Dienst danach neu:

```powershell
Restart-Service NeoDeskServer
```

In PowerShell als Administrator ändert `& 'C:\NeoDesk\neodesk.ps1' -SetConfig KEY=VALUE` Einstellungen der Vorlage, wie `--set-config` unter Linux.

## Adressen und Ports {#addresses-and-ports}

| Variable | Standard | Flag | Was sie bewirkt |
|---|---|---|---|
| `SIGNAL_PORT` | `21116` | `-port` | Port des ID-Servers, TCP und UDP. Der Port für den NAT-Test liegt eins darunter, der WebSocket-ID-Server zwei darüber. Der Server liest `PORT` nicht. |
| `RELAY_PORT` | `21117` | `-relay-port` | Port des Relays. Das WebSocket-Relay liegt zwei darüber. |
| `GO_API_PORT` | `21114` | `-api-port` | Port der API des Servers. Ohne diese Variable nimmt der Server `API_PORT`, den auch die Client-API der Konsole nutzt, und bricht deshalb beim Start ab, solange diese Client-API eingeschaltet ist. Docker startet den Server mit `-api-port 21121`. |
| `RELAY_SERVERS` | erkannt | `-relay-servers` | Relay-Adresse, die der Server den Geräten gibt, als Host oder Host:Port, wenn in der Konsole kein **Öffentlicher Relay-Server** gespeichert ist. Ohne beides nutzt der Server seine erkannte öffentliche Adresse, danach seine LAN-Adresse. Unter Docker ermittelt der Entrypoint die öffentliche Adresse bei jedem Start. |
| `CONSOLE_PORT` | `3375` | | Port der Web-Konsole (bis 3.6.0-rc.4 5000; ältere Installationen behalten ihn, siehe [Ports und Firewall](/docs/operations/ports#the-consoles-port-before-360-rc5)). `0` schaltet die Konsole aus. |
| `HOST` | `127.0.0.1` | | Adresse, auf der die Konsole lauscht. Docker und die Installer setzen `0.0.0.0`. |
| `API_ENABLED`, `API_PORT`, `API_HOST` | `true`, `21121`, `0.0.0.0` | | Unter Linux und Windows beantwortet die Konsole auch die Client-API von RustDesk auf `API_PORT`, reicht sie an die API des Servers weiter und gibt den Clients diesen Port in ihrer API-Server-Adresse. Docker setzt `API_ENABLED=false`, weil die API des Servers dort auf 21121 liegt. |
| `RUSTDESK_API_TLS` | `auto` | | `false` hält den Port der Client-API bei unverschlüsseltem HTTP. Sonst liefert er HTTPS aus, wenn sich das Zertifikat der Konsole laden lässt. Die Installer setzen `false`, wenn sie ihr selbst signiertes Zertifikat erzeugen. |
| `PUBLIC_SERVER_ID`, `PUBLIC_RELAY_SERVER`, `PUBLIC_API_URL` | | | Die Adressen, die Clients bekommen, dieselben wie **Öffentliche Client-Endpunkte** unter **Einstellungen**, **Allgemein**. Ein dort gespeicherter Wert gewinnt, außer `PUBLIC_ENDPOINTS_ENV_OVERRIDE` ist eingeschaltet. |
| `PANEL_PUBLIC_HOST` | | | Hostname der Konsole. Die Konsole nutzt ihn für die Client-Einrichtung, wenn nichts Genaueres gesetzt ist, und als Ziel ihrer HTTPS-Weiterleitung. Die Installer setzen ihn auf die Adresse, die die Clients nutzen, außer die env-Datei enthält schon einen. |
| `PANEL_PUBLIC_URL` | | | Adresse der Konsole in E-Mails. |

Der Server startet nicht, wenn zwei seiner Listener denselben Port nutzen würden. Das Log nennt dann beide Einstellungen.

## Datenbank {#database}

| Variable | Standard | Flag | Was sie bewirkt |
|---|---|---|---|
| `DATABASE_URL` | | | Die Datenbank: ein Pfad zu einer SQLite-Datei oder eine `postgres://`-URL. Den Typ entnimmt der Server dem Schema. |
| `DB_URL`, `DB_TYPE` | `./db_v2.sqlite3` | `-db` | Werden weiterhin gelesen: `DB_URL` nennt die Datenbank, wenn `DATABASE_URL` leer ist. Ein `DB_TYPE`, der dem Schema von `DATABASE_URL` widerspricht, gewinnt, und das Log sagt das. Ein relativer Pfad beginnt im Arbeitsordner. |

Siehe [PostgreSQL](/docs/operations/postgresql).

## Verbindungen {#connections}

Die ersten sechs liefern die Anfangswerte für **Verbindungsstrategie** unter **Einstellungen**, **Allgemein**. Sobald du diesen Abschnitt speicherst, gewinnen die gespeicherten Werte.

| Variable | Standard | Flag | Was sie bewirkt |
|---|---|---|---|
| `P2P_FIRST` | an | `-p2p-first` | Direkte Verbindungen zuerst. Aus schickt jede Sitzung über das Relay, ebenso `ALWAYS_USE_RELAY` (`-always-relay`). |
| `P2P_FALLBACK_MS` | `2000` | `-p2p-fallback-ms` | Wie lange ein Client eine direkte Verbindung versucht, bevor er das Relay nutzt, in Millisekunden. |
| `SAME_NAT_RELAY` | an | `-same-nat-relay` | Das Relay nutzen, wenn beide Computer dieselbe öffentliche IP-Adresse haben. |
| `ALLOW_SHARED_NAT_INITIATOR` | aus | `-allow-shared-nat-initiator` | Geräte, die sich eine öffentliche IP-Adresse teilen, Sitzungen ohne Anmeldung starten lassen. Siehe [Härtung](/docs/operations/security#limit-who-can-start-sessions). |
| `LOGGED_IN_ONLY_INITIATOR` | aus | `-logged-in-only-initiator` | Nur angemeldete RustDesk-Apps können Sitzungen starten. |
| `OPERATOR_ONLY_OUTBOUND` | aus | `-operator-only-outbound` | Nur Konten, die sich mit Geräten verbinden dürfen, können Sitzungen starten. |
| `ALLOW_LEGACY_OUTBOUND` | aus | | Lässt eine RustDesk-App, die sich nie als Gerät registriert hat, Sitzungen starten, immer über das Relay. Nur im Registrierungsmodus `open`. |
| `MASK` | | `-mask` | Der Adressbereich deines LANs, zum Beispiel `192.168.0.0/16`. Daran erkennt der Server, dass zwei Geräte im selben Netz sind. Ohne ihn gelten Adressen im selben /24 als ein Netz. |
| `PANEL_SIGNAL_PROXY_CIDRS` | `127.0.0.0/8,::1/128` | | Adressen, von denen aus die Brücke der Konsole für Remote Desktop im Browser den ID-Server erreicht. Ändere sie nur, wenn `WS_HBBS_HOST` eine andere Adresse dieses Servers nennt. |

## Geräte-Agents {#device-agents}

| Variable | Standard | Flag | Was sie bewirkt |
|---|---|---|---|
| `CDAP_ENABLED`, `CDAP_PORT` | an, `21122` | `-cdap`, `-cdap-port` | Das CDAP-Gateway für Geräte-Agents. Sobald **Gateway einschalten** oder **Gateway ausschalten** auf der Seite IoT-Geräte benutzt wurde, gewinnt diese Wahl gegen `CDAP_ENABLED`. |
| `CDAP_TLS`, `CDAP_TLS_REQUIRED` | aus | `-tls-cdap` | TLS auf dem CDAP-Port, mit `TLS_CERT` und `TLS_KEY`. `CDAP_TLS_REQUIRED` lehnt zusätzlich unverschlüsselte Verbindungen ab. |
| `MESH_ENABLED` | an | | Unterstützung für MeshAgent-Geräte. |
| `MESH_AGENT_CERT_FILE` | `mesh_agent_server.pem` | | Das Zertifikat, an dem Mesh-Agents den Server erkennen. Einen bloßen Dateinamen sucht der Server neben seiner Schlüsseldatei. Fehlt die Datei beim Start, erzeugt der Server eine neue; siehe [Backup und Wiederherstellung](/docs/operations/backup#why-the-key-file-matters). |
| `MESH_WEB_CERT_FILE` | | | Das TLS-Zertifikat, das Mesh-Agents beim Verbinden sehen, wenn ein Reverse Proxy es hält. Ohne diese Variable nimmt der Server `TLS_CERT`. Siehe [Reverse Proxy und TLS](/docs/operations/reverse-proxy-tls#mesh-agents-behind-a-proxy). |

## Konsole, Sitzungen und Logs {#console-sessions-and-logs}

| Variable | Standard | Was sie bewirkt |
|---|---|---|
| `DATA_DIR` | `/app/data` unter Docker, sonst `data` im Ordner der Konsole | Wo die Konsole ihre Dateien ablegt: Sitzungsgeheimnis, Uploads, Backups. |
| `SESSION_SECRET` | erzeugt und in `DATA_DIR/.session_secret` gespeichert | Signiert das Sitzungs-Cookie. Änderst du es, werden alle abgemeldet. |
| `SESSION_IDLE_TIMEOUT` | `1800000` | Millisekunden ohne Aktivität, nach denen eine Sitzung der Konsole endet (1 Minute bis 24 Stunden). |
| `SESSION_MAX_AGE` | `86400000` | Millisekunden nach der Anmeldung, nach denen eine Sitzung in jedem Fall endet (5 Minuten bis 7 Tage). |
| `SESSION_IDLE_WARN_MS` | `60000` | Wie lange vor dem Ende durch Inaktivität die Konsole warnt. |
| `SESSION_MAX_PER_USER` | `1` | Sitzungen, die ein Konto gleichzeitig haben darf. Eine weitere Anmeldung darüber hinaus beendet die Sitzung, die am längsten nicht aktiv war; `0` erlaubt beliebig viele. |
| `CLIENT_SESSION_EXPIRY_DAYS`, `CLIENT_SESSION_SLIDING`, `CLIENT_SESSION_MAX_DAYS` | `7`, an, `30` | Anmeldesitzungen von RustDesk-Clients. Werte, die unter **Einstellungen**, **Anmeldung** gespeichert sind, gewinnen. |
| `DEFAULT_LANGUAGE` | `en` | Sprache für einen Browser, der keine verlangt. |
| `LOG_LEVEL` | `info` | `error`, `warn`, `info` oder `debug`, für den ganzen Prozess. Die env-Datei der Installer setzt `info`. |
| `LOG_FORMAT` | `text` | `text` oder `json`. |

## Sicherheit {#security}

| Variable | Standard | Flag | Was sie bewirkt |
|---|---|---|---|
| `ENROLLMENT_MODE` | `open` | | `open`, `managed` oder `locked`, der Modus beim ersten Start. Die Installer und ein neues Docker-Volume setzen `managed`. Danach gewinnt der in der Konsole gewählte Modus, außer `ENROLLMENT_MODE_ENV_OVERRIDE` ist eingeschaltet. Siehe [Registrierungsanfragen](/docs/console/enrollment). |
| `TRUST_PROXY`, `TRUSTED_PROXIES` | aus | `-trust-proxy`, `-trusted-proxies` | Den weitergeleiteten Headern eines Reverse Proxys vertrauen. Siehe [Reverse Proxy und TLS](/docs/operations/reverse-proxy-tls#trusting-the-proxy). |
| `HTTPS_ENABLED`, `HTTPS_PORT`, `SSL_CERT_PATH`, `SSL_KEY_PATH` | aus, `5443` | | HTTPS, das die Konsole selbst ausliefert. Siehe [HTTPS ohne Proxy](/docs/operations/reverse-proxy-tls#https-without-a-proxy). |
| `TLS_CERT`, `TLS_KEY`, `TLS_SIGNAL`, `TLS_RELAY`, `TLS_API` | aus | `-tls-cert`, `-tls-key`, `-tls-signal`, `-tls-relay`, `-tls-api` | TLS auf den eigenen Ports des Servers. Signal und Relay nehmen dann unverschlüsselte und TLS-Verbindungen auf demselben Port an, ihre WebSocket-Ports nur noch TLS; `TLS_API` lässt auf dem API-Port nur noch HTTPS zu. |
| `JWT_SECRET` | erzeugt und in der Datenbank gespeichert | `-jwt-secret` | Signiert API-Token. |
| `PANEL_TRUST_SECRET`, `PANEL_TRUST_ALLOWED_HOSTS` | aus | | Ein gemeinsames Geheimnis mit mindestens 32 Zeichen. Damit erreichen die Änderungen der Konsole an Gerätegruppen die API als das angemeldete Konto statt als der API-Schlüssel der Konsole. Außerdem nimmt der API-Port dann Anfragen, die mit diesem Geheimnis signiert sind, vom selben Rechner oder von den Adressen in `PANEL_TRUST_ALLOWED_HOSTS` an, als das Konto, das sie nennen. Lass die Variable ungesetzt, außer ein Programm von dir signiert Anfragen auf diese Weise. |
| `REMOTE_TARGET_VAULT_KEY` | | | Verschlüsselt gespeicherte RDP- und VNC-Zugangsdaten. Ohne diese Variable ist dieser Speicher aus. Die Installer schreiben einen Schlüssel in die env-Datei; Docker erzeugt beim ersten Start einen und legt ihn im Datenvolume als `.remote_target_vault_key` ab. |
| `WS_ALLOWED_ORIGINS`, `API_WS_ALLOWED_ORIGINS` | | | Kommagetrennte Origins von Browserseiten, die WebSockets auf den Ports des Servers öffnen dürfen: `WS_ALLOWED_ORIGINS` für ID-Server und Relay, `API_WS_ALLOWED_ORIGINS` für den Event-Stream der API. Ist die Variable leer, nehmen ID-Server und Relay nur Seiten von localhost an und der Event-Stream nur Seiten von seinem eigenen Host. RustDesk-Clients senden keinen Origin und sind nicht betroffen. |
| `METRICS_IP_ALLOWLIST`, `METRICS_PUBLIC` | | | Wer `/metrics` und `/api/health/detail` auf dem API-Port ohne API-Schlüssel lesen darf. Siehe [Monitoring](/docs/operations/monitoring#prometheus-metrics). |
| `BLOCKLIST_FILE` | `blocklist.txt` neben der Schlüsseldatei | `-blocklist` | Datei mit IP-Adressen, Adressbereichen und Geräte-IDs, die abgewiesen werden. Siehe [Härtung](/docs/operations/security#block-addresses-and-devices). |
| `AUDIT_LOG_FILE` | | `-audit-log` | Schreibt die Audit-Ereignisse des Servers als JSON-Zeilen in diese Datei. Siehe [Monitoring](/docs/operations/monitoring#audit-entries). |

## Anmeldung und Ratenlimits {#sign-in-and-rate-limits}

Diese Limits zählen nach der Adresse des Clients. Hinter einem Reverse Proxy setzt du `TRUST_PROXY`, sonst zählt jede Anfrage so, als käme sie vom Proxy.

| Variable | Standard | Was sie bewirkt |
|---|---|---|
| `LOGIN_RATE_LIMIT_MAX` | `5` | Anmeldeversuche und Codes für den zweiten Faktor pro Adresse und Zeitfenster. |
| `RATE_LIMIT_WINDOW_MS` | `60000` | Das Zeitfenster des Anmeldelimits und von `RATE_LIMIT_MAX`. |
| `RATE_LIMIT_MAX` | `100` | Andere Anfragen an die API der Konsole pro Adresse und Zeitfenster. |
| `PANEL_READ_RATE_LIMIT_MAX` | `600` | Lesende Anfragen eines angemeldeten Kontos pro Zeitfenster. Sie zählen nicht zu `RATE_LIMIT_MAX`. |
| `API_MAX_FAILED_ATTEMPTS` | `10` | Fehlgeschlagene Anmeldungen eines Kontos von einer Adresse innerhalb des Versuchsfensters, nach denen das Konto für diese Adresse gesperrt wird. |
| `API_LOCKOUT_MINUTES` | `15` | Wie lange diese Sperre nach dem letzten Fehlversuch dauert. |
| `API_ATTEMPT_WINDOW` | `15` | Das Versuchsfenster in Minuten. |
| `API_IP_RATE_LIMIT` | `30` | Fehlgeschlagene Anmeldungen von einer Adresse, für beliebige Konten, innerhalb des Fensters, bevor die Adresse abgewiesen wird. |
| `SIGNAL_RATE_LIMIT_PER_IP` | `20` | Neue Geräteregistrierungen pro Adresse und Minute (Flag `-signal-rate-limit-per-ip`). Erhöhe den Wert, wenn sich viele Geräte eine öffentliche Adresse teilen; `0` schaltet das Limit aus. |
| `RELAY_MAX_CONNS_PER_IP` | `20` | Relay-Verbindungen pro Adresse (Flag `-relay-max-conns-ip`). `0` heißt kein Limit. |

## E-Mail {#mail}

Die Konsole nutzt diese Variablen nur, solange unter **Einstellungen**, **E-Mail** kein Mailserver gespeichert ist. Sie liest sie bei jedem Versand.

| Variable | Standard | Was sie bewirkt |
|---|---|---|
| `SMTP_HOST` | | Mailserver. Ohne ihn ist der Mailversand aus. |
| `SMTP_PORT` | `587` | Port des Mailservers. |
| `SMTP_SECURE` | `false` | `true` für TLS ab dem ersten Byte, meist Port 465. |
| `SMTP_USER`, `SMTP_PASS` | | Zugangsdaten. |
| `SMTP_FROM` | `neodesk@localhost` | Absenderadresse. |
| `SMTP_ALERT_EMAIL` | | Wohin Warnungen gehen. |
| `SMTP_TLS_VERIFY` | `true` | `false` überspringt die Prüfung des Zertifikats des Mailservers. |
| `SMTP_REQUIRE_TLS` | `true` | `false` erlaubt die Anmeldung ohne TLS, für einen Mailserver in einem vertrauenswürdigen Netz. |
