---
title: Architektur
description: Wie das Repository aufgebaut ist, was im einen Prozess neodesk-server läuft, wo die Daten liegen und der Telemetrie-Vertrag der NeoDesk-Clients.
order: 4
---

Diese Seite ist für alle, die den Code von NeoDesk ändern. Sie erklärt, wo was im Repository liegt, was das Server-Binary startet, wie die Web-Konsole und ihre Web-App darin zusammenpassen, wie die Daten gespeichert werden und welchen Vertrag es zwischen dem Server und den eigenen Desktop-Clients von NeoDesk gibt.

## Das Repository {#the-repository}

| Pfad | Was darin liegt |
|---|---|
| `neodesk-server/` | Der Go-Server: ID-Server, Relay, API, Web-Konsole und die Gateways für CDAP und MeshAgent. Ein Go-Modul, gebaut ohne cgo. |
| `web-ui/` | Die Seiten der Konsole: Svelte 5 und SvelteKit als Single-Page-App, gebaut mit Vite. Das Server-Binary enthält den Build. |
| `sdks/` | CDAP-Client-Bibliotheken für Python und Node.js. |
| `bridges/` | CDAP-Beispiel-Bridges für Modbus, SNMP und REST-Webhooks, gebaut auf dem Python-SDK. |
| `remote-gateway/` | Dienstdateien und die festgeschriebene Version von guacd, dem Gateway für RDP- und VNC-Ziele. |
| `docker/` | `Dockerfile` und `Dockerfile.server`, die die Images `neodesk` und `neodesk-server` bauen: Beide bauen die Web-App mit Node.js und den Server mit Go und laufen auf Alpine. Daneben die Entrypoints der Images, der Health-Check und die Hilfsprogramme für das Admin-Passwort. |
| `install/` | Die Installer `install.sh`, `neodesk.sh`, `neodesk.ps1` und `neodesk-docker.sh` und die Compose-Dateien `docker-compose.single.yml` und `docker-compose.quick.single*.yml`. Jedes Release hat sie als eigene Dateien dabei. |
| `config/` | Der Stand der Upstream-Beobachtung von RustDesk, siehe [Kompatibilität mit RustDesk](/docs/development/rustdesk-compatibility#the-upstream-watch). |
| `scripts/` | Installer-Tests, die Sicherheits-Testsuite, das lokale Gate, der Installer für die Build-Toolchain, die Upstream-Beobachtung. |
| `contrib/` | Beiträge aus der Community, etwa ein rc.d-Skript für FreeBSD. |
| `.github/` | CI-Workflows, Dependabot, CodeQL, die gitleaks-Konfiguration `gitleaks.toml` und die Vorlage für Pull Requests. |
| `VERSION`, `CHANGELOG.md` | Die Produktversion und das Änderungsprotokoll. |
| `release-notes/` | Die Notizen jedes Release, siehe [Releases](/docs/development/releasing). |

Einige Ordner haben eine eigene kurze README, die beim Code bleibt: [web-ui](https://github.com/neodeskapp/neodesk/blob/main/web-ui/README.md), [sdks](https://github.com/neodeskapp/neodesk/blob/main/sdks/README.md), [bridges](https://github.com/neodeskapp/neodesk/blob/main/bridges/README.md), [remote-gateway](https://github.com/neodeskapp/neodesk/blob/main/remote-gateway/README.md) und die [Contract-Suite der Konsole](https://github.com/neodeskapp/neodesk/blob/main/neodesk-server/console/contract/README.md).

## Ein Binary {#one-binary}

`neodesk-server` ist der ganze Server. Er ersetzt hbbs und hbbr von RustDesk und läuft in einem einzigen Modus, `all`. `MODE=signal` und `MODE=relay` werden beim Start abgelehnt: Das Relay koppelt nur Verbindungen, die der ID-Server desselben Prozesses freigegeben hat, und diese Freigabe liegt im Arbeitsspeicher. Deshalb können die beiden nicht getrennt laufen.

### Was der Prozess startet {#what-the-process-starts}

In dieser Reihenfolge:

1. Er liest die env-Datei, die `NEODESK_ENV_FILE` nennt, ergänzt darin die Einstellungen, die ein neues Release mitgebracht hat, und prüft, ob ein frisch installiertes Binary zurückgerollt werden muss.
2. Er bricht ab, bevor irgendetwas lauscht, wenn zwei Listener denselben Port belegen würden.
3. Er lädt das Schlüsselpaar (`id_ed25519` und `id_ed25519.pub`) oder erzeugt eins.
4. Er öffnet die Datenbank und legt an, was darin fehlt.
5. Er lädt den API-Schlüssel, setzt alle Geräte auf offline und legt den Beitrittsmodus fest: Der in der Konsole gespeicherte Modus gewinnt gegen `ENROLLMENT_MODE`, außer bei `ENROLLMENT_MODE_ENV_OVERRIDE=Y`.
6. Er lädt das Geheimnis, mit dem API-Tokens signiert werden, und legt bei einer leeren Datenbank das erste Admin-Konto an.
7. Er startet das Audit-Protokoll, die Metriken, das Neuladen bei `SIGHUP`, die Prüfung der Uhrzeit und den Abrechnungsdienst.
8. Er startet den ID-Server, das Relay, den API-Server, das CDAP-Gateway, das MeshCentral-Gateway (eingeschaltet, außer bei `MESH_ENABLED=N`), die lokale Admin-Schnittstelle und die Web-Konsole. Das CDAP-Gateway läuft, außer **Gateway ausschalten** auf der Seite IoT-Geräte hat es ausgeschaltet; solange dort nichts gespeichert ist, schaltet `CDAP_ENABLED=N` es aus.

Verlangt die Konsole nach einem Update oder einer Wiederherstellung einen Neustart, endet der Prozess mit einem Exit-Status, der seinem Supervisor sagt, ihn wieder zu starten.

### Die Pakete {#the-packages}

| Paket | Was es macht |
|---|---|
| `signal` | Der ID-Server: UDP und TCP auf 21116, der NAT-Test einen Port darunter, WebSocket zwei Ports darüber. Registrierung, Hole Punching, Relay-Anfragen und die Entscheidung, wer eine Sitzung starten darf. |
| `relay` | Das Relay auf 21117 und sein WebSocket zwei Ports darüber. Es koppelt zwei Verbindungen über die UUID, die der ID-Server freigegeben hat, und kopiert die Bytes zwischen ihnen, ohne sie zu lesen. |
| `peer` | Die Map der Geräte im Arbeitsspeicher, die gerade online sind. |
| `api` | Die HTTP-API: die Client-API von RustDesk, die REST-API für Skripte, die Gerätetelemetrie. Siehe [Die HTTP-API](/docs/development/api). |
| `auth` | Passwort-Hashes, API-Tokens, Zwei-Faktor-Codes, Rollen und Berechtigungen, LDAP und OIDC. |
| `db` | Die Datenbankschnittstelle des Servers, mit SQLite und PostgreSQL dahinter. |
| `console` | Die Web-Konsole und ihre Unterpakete, siehe unten. |
| `cdap` | Das CDAP-Gateway auf 21122, siehe [CDAP-Protokoll](/docs/development/cdap-protocol). |
| `meshcentral` | Das Agentenprotokoll von MeshCentral: `/agent.ashx`, `/meshrelay.ashx` und `/control.ashx`. |
| `crypto` | Das Schlüsselpaar, die Kodierung der Adressen, der sichere TCP-Handshake des ID-Servers, `devicevault`, das gespeicherte Anmeldedaten und die Gerätepasswörter von Organisationen mit der Schlüsseldatei `.device_vault_key` verschlüsselt, und `peervault`, der ältere Schlüssel, der nur Passwörter von vor 3.6.0-rc.5 öffnet. |
| `codec` | Das Framing der RustDesk-Nachrichten auf der Leitung. |
| `config` | Einstellungen aus Flags und Umgebung sowie die TLS-Listener. |
| `audit`, `events` | Die Server-Ereignisse, 90 Tage lang in der Datenbank gespeichert, mit dem Konto oder API-Schlüssel, der gehandelt hat, und der Event-Bus, der die Konsole versorgt. |
| `security`, `ratelimit` | Die Sperrliste und die Limits für Anfragerate, Verbindungen und Bandbreite. |
| `policy` | Netzwerkrichtlinien von Organisationen: ein erzwungenes Relay und erlaubte Relay-Server. |
| `guestaccess`, `sessiongrant` | Gastlinks und signierte, kurz gültige Freigaben für Support-Sitzungen. |
| `billing`, `timesync` | Abrechenbare Sitzungen und die Prüfung der Uhrzeit per NTP. |
| `admin` | Die Verwaltungsschnittstelle auf `ADMIN_PORT`, die nur auf 127.0.0.1 lauscht. |
| `cli`, `migrate` | Die Befehle neben dem eigentlichen Serverbetrieb. |
| `metrics`, `logging`, `reload` | Prometheus-Metriken, das Log-Format, das Neuladen der Einstellungen. |
| `protos`, `proto` | Die Protokollschemas und der daraus erzeugte Go-Code. |

`cmd/` enthält Werkzeuge, die nicht zum Binary gehören: `embed-webui` (siehe unten), `repotool` (Versionsanhebungen, die Prüfung der Übersetzungen und die [Prüfungen des Repositorys](/docs/development/tests-and-checks#repository-checks)), `release-manifest` (schreibt das Manifest eines Release und seine Signatur), `devseed` (füllt eine lokale Konsole mit erfundenen Daten) und `ws-register-test` (schickt eine Registrierung über den WebSocket des ID-Servers).

### Die Befehle {#the-commands}

Beginnt das erste Argument nicht mit `-`, führt das Binary einen Befehl aus statt des Servers:

| Befehl | Was er macht |
|---|---|
| `update`, `rollback` | Installiert das neueste Release des Update-Kanals oder setzt das vorherige Binary wieder ein. |
| `backup` | Schreibt das vollständige Backup der Konsole, auch während der Server läuft. |
| `migrate` | Zieht eine ganze Installation von SQLite nach PostgreSQL um oder zurück (`sqlite2pg`, `pg2sqlite`), wandelt die Datenbank eines RustDesk-Servers in das Schema des Servers um (`rust2go`) oder legt eine Kopie einer SQLite-Datei beiseite (`backup`). |
| `reset-password` | Setzt das Passwort eines Kontos, gelesen von der Standardeingabe. |
| `config` | Prüft, was die Konsole kann, oder setzt Einstellungen aus einer Positivliste. |
| `check`, `cert` | Prüft die Adressen und Ports einer Installation oder erzeugt ihr selbstsigniertes Zertifikat. |
| `env merge`, `upgrade-env` | Führt Einstellungen in die env-Datei zusammen oder macht aus der env-Datei einer älteren Konsole die des Servers. |
| `verify-release` | Prüft ein heruntergeladenes Binary gegen das signierte Manifest seines Release. |

Ein unbekannter Befehl gibt die Liste der Befehle mit ihrer Verwendung aus.

## Die Web-Konsole {#the-web-console}

Die Konsole ist das Paket `console`. Sie lauscht auf ihrem eigenen Port, `CONSOLE_PORT` (3375, vor 3.6.0-rc.5 5000; `0` schaltet die Konsole aus, während der Rest des Servers weiterläuft), oder im HTTPS-Modus auf 5443. Sie liefert drei Dinge aus: eine JSON-API unter `/api`, WebSockets unter `/ws` und die Web-App.

- Jede Anfrage läuft durch eine Pipeline (`console/pipeline.go`). Die Routengruppen liegen in `console/routes`, ein Paket pro Bereich, und tragen ihre Routen in eine von zwei Tabellen ein: die Client- und Geräte-API, die vor den Prüfungen von Sprache und CSRF kommt, und alles andere.
- Die Konsole ruft den API-Server im selben Prozess auf, über seinen Handler und ohne Socket (`console/goapi`). Der API-Server sieht diese Aufrufe als Aufrufe mit dem API-Schlüssel der Konsole.
- Der Port der Client-API, `API_PORT` (21121), ist für RustDesk-Clients aus dem Internet erreichbar. Mit eingeschaltetem `RUSTDESK_API_PROXY`, dem Standard, reicht er die Client-API an den API-Server im selben Prozess weiter. Welchen Port die Clients bei welcher Installation nutzen, steht unter [Ports](/docs/operations/ports#the-api-port-on-linux-and-windows).
- Remote Desktop im Browser öffnet `/ws/rendezvous` und `/ws/relay` auf der Konsole. `console/wsrelay` verbindet sie mit dem ID-Server und dem Relay im selben Prozess. Der erste Frame der Brücke auf der Verbindung zum ID-Server ist ein Nachweis, den nur dieser Prozess erzeugen kann, siehe [Sicherheitsmodell](/docs/development/security-model#the-browsers-bridge).
- `console/onboard` und `console/routes/onboard` stehen hinter [Computer hinzufügen](/docs/console/add-a-computer) und [Schnellhilfe](/docs/console/quick-support): Einladungen (Beitrittscodes), Schnellhilfe-Sitzungen (Support-Codes), die Daten hinter den Seiten `/join/<code>` und `/s/<code>` und das Client-Paket, das unter dem Dateinamen des Codes ausgeliefert wird. Der API-Server verwaltet die Codes und beantwortet ihre Routen nur für die Konsole im selben Prozess.
- `console/clientrelease` ist der Cache für Client-Releases. Er holt die offiziellen Client-Pakete aus den Releases des Client-Forks (`NEODESK_CLIENT_REPO`; das neueste Pre-Release, solange der Fork kein stabiles Release hat, oder das Release in `NEODESK_CLIENT_RELEASE_TAG`). Er nutzt ein Release nur, wenn seine `SHA256SUMS` eine gültige Release-Signatur tragen. Jedes Paket lädt er einmal herunter, prüft es gegen die Prüfsummen und legt es in `client-releases` im Datenordner ab.
- `console/meshproxy` reicht die MeshCentral-Sockets an das MeshCentral-Gateway im selben Prozess weiter. `console/cdapproxy` reicht die Sockets des Browsers für Terminal, Desktop, Video, Dateien und Audio eines CDAP-Geräts an den API-Server weiter, nachdem die Konsole ihre eigenen Prüfungen gemacht hat.
- Die Texte der Konsole liegen in `console/static/files/lang`, eine Datei pro Sprache, 26 insgesamt, Englisch in `en.json`. `go run ./cmd/repotool i18n-check --system console` prüft, ob die Dateien zueinander passen; siehe [Übersetzungen](/docs/development/translations).
- `console/contract` ist eine Black-Box-Suite mit aufgezeichneten Antworten für jede Route der Konsole und jede Rolle. Sie prüft, ob die Konsole diese Antworten weiterhin gibt. Siehe [Die Contract-Suite](/docs/development/tests-and-checks#the-contract-suite).

### Wie die Web-App in das Binary kommt {#how-the-web-app-gets-into-the-binary}

1. `npm run build` in `web-ui` schreibt die App nach `web-ui/build`. Zum Bauen braucht es Node.js 22.17 oder neuer; der laufende Server braucht kein Node.js.
2. `go run ./cmd/embed-webui` in `neodesk-server` kopiert den Build nach `console/webui/dist` und hält die Änderungszeit jeder Datei fest.
3. `go build` bettet diesen Ordner ein. Ein Binary, das ohne Schritt 2 gebaut wurde, hat keine Web-App; dann nennt `WEB_UI_DIR` einen Build auf der Festplatte. So läuft auch die Entwicklung.

Die Befehle stehen unter [Aus dem Quellcode bauen](/docs/development/building).

Die eigenen Dateien der Konsole in `console/static/files` (Sprachen, Bilder, Themes und die Protokollschemas, die sie unter `/protos` ausliefert) werden dort eingebettet, wo sie liegen. Mit `CONSOLE_STATIC_DIR` liest die Konsole sie stattdessen von der Festplatte.

Die Konsole liefert die App unter der Wurzel aus. Dateien mit Hash im Namen unter `/_ui/immutable/` werden ein Jahr lang gecacht und vorkomprimiert gesendet, andere Dateien des Builds eine Stunde lang, und jedes andere GET bekommt die Seite der App. Eine Adresse, zu der die App keine Seite hat, bekommt die Seite mit Status 404, und `/api` und `/ws` bekommen sie nie. Seiten der Konsole brauchen eine Sitzung. Ohne Sitzung öffnen sich die Anmeldeseiten, das Portal, Gerätelinks, die Einladungsseite, die Seiten für Einladungen und Schnellhilfe (`/join/<code>`, `/s/<code>`) und der Remote-Viewer. Die Content-Security-Policy der Seite kommt aus dem Build.

### Der Generator für Support-Clients {#the-support-client-generator}

`console/generator` enthält die Support-Client-Pakete des älteren Generators: ihre Profile, die Warteschlange, die sie baut, und die Download-Seiten ihrer Links (`/d/<id>`). Die Web-App hat keine Seite, auf der man Pakete erstellt; [Computer hinzufügen](/docs/console/add-a-computer) und [Schnellhilfe](/docs/console/quick-support) verteilen stattdessen den offiziellen Client aus dem Release-Cache. Der Build-Worker läuft im Server, außer bei `AGENT_BUILD_WORKER=off`, und legt die fertigen Installer in `AGENT_ARTIFACT_DIR` ab (standardmäßig `DATA_DIR/agent-builds`).

## Die Datenbank {#the-database}

Der Server arbeitet mit einer Datenbank. `DATABASE_URL` nennt sie: Eine Adresse, die mit `postgres://` oder `postgresql://` beginnt, ist PostgreSQL, angebunden über pgx. Alles andere ist eine SQLite-Datei, standardmäßig `db_v2.sqlite3`, angebunden über einen SQLite-Treiber, der in Go geschrieben ist. `DB_URL` und `DB_TYPE` werden für ältere Installationen weiterhin gelesen. Wie du den Server mit PostgreSQL betreibst, steht unter [PostgreSQL](/docs/operations/postgresql).

Zwei Stores teilen sich diese Datenbank:

- **Der Store des Servers**, Paket `db`. Eine Schnittstelle (`db/database.go`) mit einer Implementierung für SQLite und einer für PostgreSQL. Er enthält Geräte, Konten, API-Schlüssel, Gerätetokens, die Server-Ereignisse, Gerätegruppen und Ordner, Organisationen, Abrechnung, Telemetrie und `server_config`. Das ist eine Tabelle mit Schlüsseln und Werten für Einstellungen, Geheimnisse, die der Server erzeugt, die Hashes von Beitritts-, Support- und Kopplungscodes und Einträge in Warteschlangen wie `pending_device_<id>`.
- **Der Store der Konsole**, Paket `console/store`. Seine Abfragen sind einmal geschrieben, mit `?` als Platzhalter, und laufen auf beiden Datenbanken. Er legt 55 Tabellen an (Tickets, Aktivität, Warnungen, Berichte, Agent-Pakete und mehr), und das Sitzungspaket fügt `panel_sessions` hinzu. [schema.md](https://github.com/neodeskapp/neodesk/blob/main/neodesk-server/console/store/schema.md) listet jeden Schritt seiner Migration auf.

Auf PostgreSQL nutzt die Konsole den Verbindungspool des Servers. Bei SQLite öffnet sie dieselbe Datei selbst, mit einer Verbindung für Schreibzugriffe und vier Verbindungen nur zum Lesen, im WAL-Modus, und wartet bis zu fünf Sekunden, wenn die Datei gesperrt ist.

Bei jedem Start legen beide Stores die fehlenden Tabellen und Spalten an. Die Migration der Konsole löscht nichts und benennt nichts um. Eine vorhandene Tabelle lässt sie, wie sie ist, auch wenn der Store des Servers sie mit anderen Spaltentypen angelegt hat. Auf PostgreSQL hält sie dabei einen Advisory Lock, sodass ein zweiter Prozess wartet, bis der erste fertig ist.

### Ältere Installationen mit auth.db {#older-installs-with-authdb}

Installationen aus der Zeit, bevor die Konsole Teil des Servers war, hielten die Konten, Gruppen, Ordner, Tickets, Einstellungen und das Audit-Protokoll der Konsole in einer zweiten SQLite-Datei, `auth.db`. Beim ersten Start importiert die Konsole diese Datei von selbst in die Hauptdatenbank. Das passiert, wenn die Datei existiert, `SQLITE_AUTH_DB_MODE` nicht `consolidated` ist und die Hauptdatenbank noch keine Abschlussmarkierung hat. Die Konsole sucht die Datei unter `AUTH_DB_PATH`, sonst als `auth.db` in ihrem Datenordner.

Der Import:

1. legt Snapshots beider Dateien in `backups` neben der Hauptdatenbank an (`db_v2.sqlite3.pre-auth-consolidation-<time>` und `auth.db.legacy-auth-<time>`);
2. kopiert die Daten in einer einzigen Transaktion, sie landen also ganz oder gar nicht;
3. ordnet Konten, die es in beiden Dateien gibt, über den Namen zu: Das Konto behält seine Zeile und seine id in der Hauptdatenbank und übernimmt das Profil, die Zwei-Faktor-Einstellungen und den Passwort-Hash aus der Konsole;
4. schreibt die Markierung `sqlite_auth_consolidation_v1`, damit auch eine ältere Version, die nach einem Rollback startet, die Hauptdatenbank liest.

`auth.db` wird nur gelesen, nie geändert oder gelöscht. Um den Import von Hand auszuführen, ohne den Server zu starten, halte zuerst den Server an und nutze die Flags unten. `-migrate-sqlite-auth-dry-run` importiert in eine Kopie in einem temporären Ordner; beide Aufrufe geben einen JSON-Bericht darüber aus, was sie getan haben. Setze für `<data-dir>` den Ordner ein, in dem die beiden Datenbanken liegen, und für `<backup-dir>` einen Ordner für den Snapshot:

```bash
AUTH_DB_PATH=<data-dir>/auth.db neodesk-server -db <data-dir>/db_v2.sqlite3 \
  -migrate-sqlite-auth -migrate-sqlite-auth-dry-run

AUTH_DB_PATH=<data-dir>/auth.db neodesk-server -db <data-dir>/db_v2.sqlite3 \
  -migrate-sqlite-auth -migrate-sqlite-auth-backup-dir <backup-dir>
```

`-rollback-sqlite-auth` mit dem Pfad des Snapshots spielt den Snapshot zurück und behält die fehlgeschlagene Datenbank daneben als `db_v2.sqlite3.failed-auth-consolidation-<time>`. Der Snapshot hat keine Markierung. Die Konsole importiert `auth.db` deshalb beim nächsten Start erneut, außer du verschiebst `auth.db` vorher oder setzt vorher `SQLITE_AUTH_DB_MODE=consolidated`.

## Der Vertrag für Gerätetelemetrie {#the-device-telemetry-contract}

Die eigenen Desktop-Clients von NeoDesk melden mehr als der normale RustDesk-Client: ihre Art, ihre Fähigkeiten, Inventar und die Ergebnisse von Befehlen. Das läuft über denselben `POST /api/heartbeat`, den auch der RustDesk-Client nutzt, mit zusätzlichen Feldern. Ein Heartbeat ohne diese Felder ist ein gewöhnlicher RustDesk-Heartbeat und wird wie gewohnt beantwortet.

### Heartbeat-Felder {#heartbeat-fields}

| Feld | Bedeutung |
|---|---|
| `id`, `uuid` | Die Geräte-ID und die UUID, mit der sich das Gerät registriert hat. Ein einfacher Heartbeat mit einer anderen UUID wird wie bei einem unbekannten Gerät beantwortet. |
| `cpu`, `memory`, `disk` | Auslastung in Prozent, gespeichert, wenn der Wert über 0 liegt, auch aus einem einfachen Heartbeat. |
| `telemetry_schema` | Die Version des Vertrags, `1`. |
| `product_sku` | `neodesk-desktop` für den verwalteten Desktop-Client, `neodesk-support` für den Support-Client. |
| `conn_mode` | `normal` oder `incoming-only`. |
| `capabilities` | Was der Client kann, etwa `connection-mode.remote-control`. |
| `telemetry` | Metriken, Snapshots und Befehlsergebnisse, siehe unten. |
| `neodesk_envelope`, `telemetry_envelope` | Die signierten und verschlüsselten Formen, siehe unten. |
| `effective_conn_mode`, `policy_revision`, `policy_status`, `last_command_id`, `policy_error` | Der Bericht des Clients über den letzten Befehl zum Verbindungsmodus. |

Der Server ordnet ein Gerät nach `product_sku` ein: `neodesk-support` ist ein Support-Client, `neodesk-desktop` ein Desktop-Client, auch wenn er nur eingehende Verbindungen annimmt. Ein Gerät ohne SKU, das `incoming-only` meldet, zählt als Support-Client. Was ein Client über sich selbst meldet, berechtigt für sich allein nie zu etwas: Der Server prüft zusätzlich die Berechtigung des Operators.

### Telemetrie, Snapshots und Befehle {#telemetry-snapshots-and-commands}

Das Objekt `telemetry` enthält `telemetry_schema`, `sample_id`, `collected_at`, `metrics`, eine Map `status`, `snapshots` und `results`. Der Server speichert es nur, wenn das Gerät es signiert hat: in `neodesk_envelope` oder in einem eigenen `telemetry_envelope`. Das `telemetry` eines einfachen Heartbeats wird ignoriert.

- Ein Snapshot hat `kind`, `sample_id`, `status`, `collected_at` und `data`. `GET /api/peers/<id>/telemetry` gibt den neuesten jeder Art zurück: `identity`, `metrics`, `hardware`, `services`, `processes`, `events`, `activity` und `files`.
- Ein Status ist `ok`, `unsupported`, `permission_denied`, `unavailable` oder `error`; alles andere wird als `error` gespeichert.
- Die Telemetrie darf bis zu 512 KiB groß sein, das Ergebnis eines Befehls bis zu 256 KiB.

Befehle stehen auf einer Positivliste: `collect.hardware`, `collect.metrics`, `collect.services`, `collect.processes`, `collect.events`, `collect.activity`, `files.browse`, `files.read`, `service.control` und `process.terminate`. Ein Operator stellt einen Befehl mit `POST /api/peers/<id>/telemetry/command` in die Warteschlange (Berechtigung zum Verbinden) oder fordert mit `POST /api/peers/<id>/telemetry/refresh` ein Hardware-Inventar an (Berechtigung zum Bearbeiten). Für einen Support-Client stellt der Server nur `collect.metrics` ein. Ein Befehl gilt 10 Minuten. Er geht nur in der versiegelten Antwort auf einen signierten Heartbeat hinaus, als `telemetry_commands` mit `id`, `command`, `args` und `expires_at`, höchstens 10 auf einmal. Der Client gibt jedes Ergebnis in `results` zurück, mit der `id` des Befehls und einem Status `queued`, `ok`, `rejected`, `unsupported`, `permission_denied` oder `error`. Der Server nimmt Ergebnisse nur für Befehle an, die er für dieses Gerät eingereiht hat.

### Das Envelope {#the-envelope}

Das Envelope schützt Telemetrie und Befehle auch dort, wo die API über unverschlüsseltes HTTP läuft. Nutze im Produktivbetrieb trotzdem HTTPS.

1. Der Client ruft `GET /api/telemetry/key` ab. Die Antwort enthält `version`, `key_id`, `public_key` (den X25519-Schlüssel des Servers) und `signature`, erstellt mit dem Ed25519-Schlüssel des Servers über `1|<key-id>|<public-key>`. Der Client prüft sie gegen den Schlüssel in seinen eigenen Einstellungen, denselben, den er für den ID-Server nutzt.
2. Der Client verschlüsselt das JSON mit NaCl box zwischen einem frischen eigenen X25519-Schlüssel und dem Schlüssel des Servers. Er schickt `version` (1), `device_id`, `sequence`, `server_key_id`, `ephemeral_public_key`, `nonce` (24 Bytes), `ciphertext`, `signature` und, wenn er eine versiegelte Antwort will, `response_public_key`. Binäre Werte sind base64-kodiert.
3. Die Signatur ist Ed25519 mit dem eigenen Schlüssel des Geräts, also dem, mit dem es sich beim ID-Server registriert hat, über `version|device_id|sequence|server_key_id|ephemeral_public_key|nonce|ciphertext`, mit `|response_public_key` am Ende, wenn vorhanden.
4. Der Server lehnt eine falsche Signatur ab, ebenso eine andere Geräte-ID, einen anderen Serverschlüssel und eine `sequence`, die nicht höher als die letzte ist. Er hält die letzte Sequenz pro Gerät in `server_config` (`telemetry_seq_<id>`), ein Neustart setzt sie also nicht zurück; endgültiges Löschen des Geräts entfernt sie.

Die Antwort auf einen Heartbeat in `neodesk_envelope` wird auf dieselbe Weise für den Antwortschlüssel des Clients versiegelt und mit dem Ed25519-Schlüssel des Servers signiert. Die Clients von NeoDesk übernehmen Strategieoptionen und Befehle zum Verbindungsmodus nur aus so einer versiegelten Antwort.

Nach diesem ersten signierten Heartbeat kann auch jede andere API-Anfrage versiegelt laufen: Der Client schickt `X-NeoDesk-Envelope: 1` und `X-NeoDesk-Device: <id>`, mit dem Envelope als Body. Der Server öffnet es, führt den normalen Handler aus und versiegelt die Antwort.

### Verbindungsmodus {#connection-mode}

Ein Operator mit der Berechtigung `device.connection_mode` kann einen Desktop-Client zwischen `normal` und `incoming-only` umschalten: mit `POST /api/peers/<id>/connection-mode` an der API oder `POST /api/devices/<id>/connection-mode` in der Konsole, beide mit `mode` und einem Pflichtfeld `reason` mit bis zu 500 Zeichen.

- Umschalten lässt sich nur ein Gerät, dessen signierte Identität `neodesk-desktop` mit der Fähigkeit `connection-mode.remote-control` ist. Ein Support-Client bleibt im Modus incoming-only.
- Der Server speichert den angeforderten Modus und schickt den Befehl als `connection_mode_command` mit `command_id`, `revision`, `target_id`, `target_uuid`, `mode`, `issued_at`, `expires_at` und `reason`, und zwar nur in der versiegelten Antwort auf einen signierten Heartbeat. Nie in einer einfachen Antwort und nie in `strategy` oder `config_options`. Der Befehl gilt 10 Minuten.
- Der nächste signierte Heartbeat des Clients meldet das Ergebnis in `effective_conn_mode`, `policy_revision`, `policy_status`, `last_command_id` und `policy_error`.
- Einem Support-Client oder einem Gerät im Modus incoming-only schickt der Server keine Strategieoptionen von RustDesk.
