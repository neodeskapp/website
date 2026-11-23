---
title: CDAP-Protokoll
description: Das WebSocket-Protokoll zwischen einem Gerät oder einer Bridge und dem CDAP-Gateway des Servers, Nachricht für Nachricht, so wie der Server es umsetzt.
order: 13
---

CDAP ist das Protokoll des Servers für Geräte, die keine RustDesk-Clients sind: Sensoren, Steuerungen, Bridges zu anderen Systemen und Agenten. Ein Gerät öffnet einen WebSocket zum Gateway, meldet sich an und schickt ein Manifest mit seinen Werten und Bedienelementen. Danach hält es den Server auf dem Laufenden und beantwortet Befehle. Diese Seite ist für alle, die so ein Gerät oder so eine Bridge schreiben. Wie du das Gateway betreibst und die Geräte in der Konsole nutzt, steht unter [CDAP-Geräte](/docs/console/cdap); fertige Clients findest du unter [CDAP-SDKs und Bridges](/docs/development/cdap-sdks).

Maßgeblich ist der Go-Code in [`neodesk-server/cdap`](https://github.com/neodeskapp/neodesk/tree/main/neodesk-server/cdap); seine Typen benennen jedes Feld.

## Verbinden {#connecting}

Das Gateway lauscht auf Port 21122 (`CDAP_PORT`) unter dem Pfad `/cdap`:

```text
ws://desk.example.com:21122/cdap
wss://desk.example.com:21122/cdap
```

`wss://` funktioniert, wenn der Server mit `CDAP_TLS=Y` und einem Zertifikat läuft. Einfaches `ws://` funktioniert auf demselben Port weiter, außer bei `CDAP_TLS_REQUIRED=Y`. Das Gateway läuft, solange es nicht für den nächsten Start ausgeschaltet wurde: mit **Gateway ausschalten** auf der Seite IoT-Geräte oder, solange dort nichts gespeichert ist, mit `CDAP_ENABLED=N`. Siehe [Das Gateway](/docs/console/cdap#the-gateway).

- Das Gateway bietet das WebSocket-Subprotokoll `cdap-v1` an. Fordere dieses an oder gar keins. Ein Client, der nur ein anderes anfordert, bekommt kein Subprotokoll zurück, und die meisten WebSocket-Bibliotheken trennen dann die Verbindung.
- Nachrichten sind JSON in Text-Frames. Binäre Frames gibt es nur für Desktop-Bilder (siehe [Sitzungen](#sessions)). Eine Nachricht darf bis zu 8 MiB groß sein.
- Jede Verbindung und jede Anmeldung zählt gegen `CDAP_RATE_LIMIT` pro Adresse und Minute, standardmäßig 30. Darüber antwortet das Gateway mit 429, statt den WebSocket zu öffnen, oder lehnt die Anmeldung ab. Eine Adresse auf der Sperrliste des Servers bekommt 403.
- Eine Browserseite auf einem anderen Host braucht ihren Origin in `WS_ALLOWED_ORIGINS`. Agenten, die keinen `Origin`-Header schicken, betrifft das nicht.
- `GET /cdap/health` auf demselben Port antwortet ohne Anmeldung mit `{"status": "ok", "connections": 3, "total": 41, "version": "..."}`.

## Nachrichten {#messages}

Jede Nachricht hat denselben Rahmen:

```json
{"type": "state_update", "timestamp": "2026-11-22T10:15:00Z", "payload": {"widget_id": "temp", "value": 21.5}}
```

`type` und `payload` sind Pflicht. Der Server füllt `timestamp` (RFC 3339, UTC) in allem, was er schickt, und braucht es nicht in dem, was er bekommt. `id` trägt bei Befehlen die Befehls-ID und beim Start einer Sitzung die Sitzungs-ID.

Eine Verbindung durchläuft drei Schritte:

1. Anmelden: Die erste Nachricht ist `auth`, innerhalb von 30 Sekunden.
2. Registrieren: Die zweite Nachricht ist `register`, innerhalb von 30 Sekunden.
3. Danach schicken beide Seiten die Nachrichten unten, bis eine Seite die Verbindung schließt.

Scheitert Schritt 1, schickt der Server einen `error` mit Code 1001 und dem Grund und schließt die Verbindung. Scheitert Schritt 2, schickt er einen `error` mit Code 2001 und schließt sie.

## Anmelden {#signing-in}

```json
{
  "type": "auth",
  "payload": {
    "method": "api_key",
    "key": "3f1c9a20...",
    "device_id": "greenhouse-1",
    "client_version": "1.0.0"
  }
}
```

| Feld | Verwendet mit | Was es ist |
|---|---|---|
| `method` | allen | `api_key`, `user_password` oder `device_token` |
| `device_id` | allen | Die ID, unter der sich das Gerät registriert: 1 bis 64 Buchstaben, Ziffern, `-` und `_`. Pflicht |
| `key` | `api_key` | Ein API-Schlüssel des Servers |
| `username`, `password` | `user_password` | Ein Konto der Konsole |
| `totp_code` | `user_password` | Der aktuelle Code, für ein Konto mit Zwei-Faktor-Anmeldung |
| `token` | `device_token` | Ein Gerätetoken, der an dieses Gerät gebunden ist |
| `client_version` | allen | Optional |

- `api_key`: Das Gerät handelt mit der Rolle des Schlüssels. Ein abgelaufener Schlüssel wird abgelehnt. Schlüssel werden über die API angelegt; siehe [API-Schlüssel](/docs/development/api#api-keys).
- `user_password`: Das Gerät handelt mit der Rolle des Kontos. Bei einem Konto mit Zwei-Faktor-Anmeldung gehört der Code in `totp_code` derselben Nachricht; fehlt er, antwortet der Server mit `2fa_required` und schließt die Verbindung. Nach 5 fehlgeschlagenen Anmeldungen mit Passwort innerhalb von 5 Minuten für ein Konto oder von einer Adresse lehnt das Gateway dieses Konto oder diese Adresse ab, bis die 5 Minuten vorbei sind.
- `device_token`: Der Token muss aktiv und genau an diese `device_id` gebunden sein. Das Gerät muss schon auf dem Server sein und darf nicht gesperrt, deaktiviert oder gelöscht sein. Tokens werden an IDs mit 6 bis 16 Zeichen gebunden; siehe [Gerätetokens](/docs/development/api#device-tokens).

Mit `api_key` oder `user_password` registriert sich das Gerät selbst. Deshalb braucht die Rolle die Berechtigung **Registrierungen genehmigen**, wie [Wie sich ein Gerät anmeldet](/docs/console/cdap#how-a-device-signs-in) erklärt.

Die Antwort:

```json
{"type": "auth_result", "payload": {"success": true, "token": "eyJhbGciOi...", "role": "admin", "device_id": "greenhouse-1", "session_token": "..."}}
```

`token` gilt so lange wie ein Anmelde-Token der API (standardmäßig 24 Stunden) und lässt sich mit `token_refresh` erneuern. Für sonst nichts in diesem Protokoll braucht ein Gerät ihn.

## Registrieren {#registering}

```json
{
  "type": "register",
  "payload": {
    "manifest": {
      "manifest_version": "1.0",
      "device": {"name": "Greenhouse", "type": "iot", "firmware": "2.1.0", "tags": ["site-a"]},
      "capabilities": ["telemetry", "commands"],
      "heartbeat_interval": 15,
      "widgets": [
        {"id": "temp", "type": "gauge", "label": "Temperature", "unit": "°C", "min": -10, "max": 50},
        {"id": "heater", "type": "toggle", "label": "Heater", "group": "Controls"}
      ],
      "alerts": [
        {"id": "frost", "label": "Frost", "severity": "warning", "condition": "temp < 2", "message": "Temperature is {temp} °C"}
      ]
    }
  }
}
```

Der Server lehnt die Registrierung ab, wenn die ID gesperrt ist oder wenn ein anderes Konto oder ein anderer API-Schlüssel die ID schon registriert hat (ein Gerätetoken ist an sein Gerät gebunden und davon ausgenommen). Eine zweite Verbindung mit derselben ID ersetzt die erste, die der Server mit Code 4001 schließt.

Die Antwort ist `{"type": "registered", "payload": {"device_id": "greenhouse-1", "server_time": "..."}}`. Das Gerät erscheint jetzt in der Geräteliste: mit dem Namen aus dem Manifest als Hostname, mit seinem Typ, seinen Tags und seinem verknüpften Gerät, und als Benutzer mit dem Konto, `apikey:<key-name>` oder `device:<id>`. Trennt das Gerät die Verbindung, markiert der Server es als offline und verwirft das gespeicherte Manifest.

### Das Manifest {#the-manifest}

| Feld | Was der Server annimmt |
|---|---|
| `manifest_version` | `1.0`, oder leer für `1.0`. Alles andere wird abgelehnt |
| `device.name` | Pflicht, bis zu 128 Zeichen |
| `device.type` | `scada`, `iot`, `os_agent`, `network`, `camera`, `desktop` oder `custom`; leer bedeutet `custom`, alles andere wird abgelehnt |
| `device.vendor`, `model`, `firmware`, `serial`, `location`, `icon`, `description` | Optionaler Text |
| `device.tags` | Bis zu 20 Tags mit je bis zu 64 Zeichen |
| `device.linked_peer_id` | Die ID eines Geräts in der Geräteliste, das zu diesem gehört |
| `bridge.name`, `version`, `protocol`, `target_host`, `target_port` | Optional, für eine Bridge; der Server speichert `protocol` als Betriebssystem des Geräts und `version` als seine Version |
| `capabilities` | Beliebige aus `telemetry`, `commands`, `terminal`, `alerts`, `logs`, `remote_desktop`, `video_stream`, `audio`, `clipboard`, `file_transfer`, `input_control`, `keyboard_input`, `mouse_input`, `multi_monitor`, `unattended_access`. Eine unbekannte wird abgelehnt |
| `heartbeat_interval` | Sekunden zwischen zwei Heartbeats: 15, wenn der Wert fehlt, höchstens 300 |
| `widgets` | Bis zu 200, siehe unten |
| `alerts` | Bis zu 200, siehe unten |

### Widgets {#widgets}

Jedes Widget braucht eine `id` (bis zu 64 Zeichen, eindeutig im Manifest) und einen `type`: `toggle`, `gauge`, `button`, `led`, `chart`, `select`, `slider`, `text`, `table`, `terminal`, `desktop`, `video_stream`, `file_browser` oder `audio`. `label` ist standardmäßig die ID. Die anderen Felder sind optional:

| Felder | Für |
|---|---|
| `group`, `value` (der Anfangswert), `readonly` | Alle Widgets |
| `unit`, `min`, `max`, `step`, `precision`, `warning_low`, `warning_high` | Messanzeigen und Schieberegler |
| `confirm`, `confirm_message`, `style`, `icon`, `cooldown` (Sekunden) | Schaltflächen |
| `options`: `[{"label": "Auto", "value": "auto"}]` | Auswahllisten |
| `chart_type`, `points`, `series`: `[{"id", "label", "color", "unit"}]`, `retention` | Diagramme |
| `columns`: `[{"id", "label", "type"}]`, `max_rows`, `sortable` | Tabellen |
| `permissions`: `{"read", "control", "execute"}` | Alle Widgets, siehe unten |

### Widget-Berechtigungen {#widget-permissions}

Ein Befehl nennt eine Aktion, und die `permissions` des Widgets legen fest, welche Rolle sie braucht: `query` braucht `read`, `execute` braucht `execute`, und `set`, `trigger`, `reset` und jede andere Aktion brauchen `control`. Jeder dieser Einträge nimmt `viewer`, `operator` oder `admin`. Ohne Wert ist `read` gleich `viewer`, und `control` und `execute` sind `operator`; bei Widgets vom Typ `terminal`, `desktop` und `file_browser` sind `control` und `execute` gleich `admin`.

Die Rollen steigen in der Reihenfolge viewer, operator, admin. Serveradministratoren und globale Administratoren liegen zwischen operator und admin, und Super-Admins zählen als admin. Ein Befehl braucht außerdem die Berechtigung **CDAP-Befehle ausführen**.

### Warnungen {#alerts}

Eine Warnung im Manifest ist ausgelöst, solange ihre `condition` zutrifft, und wird aufgehoben, sobald sie nicht mehr zutrifft. Der Server prüft jede Warnung, sobald sich ein Wert ändert.

- `severity` ist `critical`, `warning` oder `info`.
- `condition` ist `<widget-id> <operator> <value>`, mit `==`, `!=`, `>`, `<`, `>=` oder `<=`. Die Widget-ID darin muss mit einem Buchstaben oder `_` beginnen und darf nur Buchstaben, Ziffern, `_` und `.` enthalten. Sind beide Seiten Zahlen, werden sie als Zahlen verglichen (`true` und `false` zählen als 1 und 0). Sonst funktionieren nur `==` und `!=`, die den Text ohne Rücksicht auf Groß- und Kleinschreibung vergleichen; Anführungszeichen um den Wert sind optional. Eine Bedingung, die der Server nicht lesen kann, oder ein Widget, das noch keinen Wert hat, löst nichts aus.
- `message` darf `{widget id}` enthalten; der Server ersetzt das durch den aktuellen Wert.

Ausgelöste Warnungen erscheinen unter **Aktive Warnungen** auf der Seite des Geräts und in `GET /api/cdap/alerts`, und jede Änderung ist ein Ereignis im Ereignisstrom der API. Sie werden aufgehoben, wenn das Gerät die Verbindung trennt.

## Vom Gerät {#from-the-device}

| Typ | Payload | Was der Server macht |
|---|---|---|
| `heartbeat` | `metrics` (`{"cpu", "memory", "disk"}`), `widget_values` (`{"temp": 21.5}`), beide optional | Hält das Gerät online, speichert die Metriken, wenn eine davon über 0 liegt, speichert die Werte und antwortet mit `ping` und `server_time` |
| `state_update` | `widget_id`, `value` | Speichert einen Wert |
| `bulk_update` | `updates`: `[{"widget_id", "value"}]` | Speichert mehrere Werte |
| `command_response` | `command_id`, `status`, `result`, `error_message`, `execution_time_ms` | Hält die Antwort auf einen Befehl fest |
| `event` | `event_type`, `data` | Gibt es als Ereignis `cdap_event` weiter |
| `log` | `level`, `message`, `context` | Gibt es als Ereignis `cdap_log` weiter; `error` und `critical` gehen außerdem ins Server-Log |
| `help_request` | `message`, `hostname` | Legt eine Anfrage unter **Hilfeanfragen** an, mit den ersten 2048 Zeichen der Nachricht, und antwortet mit `help_request_ack` und deren `id` |
| `chat_message` | `text`, `to_id` | Speichert die ersten 4096 Zeichen als Chatnachricht vom Gerät und antwortet mit `chat_message_ack` und deren `id` |
| `token_refresh` | `{}` | Antwortet mit `token_refreshed`, einem neuen `token` und `expires_at` |
| `unregister` | `reason` | Schließt die Verbindung |

Der Heartbeat hält die Verbindung am Leben: Schickt ein Gerät drei Heartbeat-Intervalle lang, mindestens aber 60 Sekunden, keinen, schließt der Server die Verbindung mit „heartbeat timeout“. Andere Nachrichten zählen dafür nicht.

Der Server speichert einen Wert nur für ein Widget aus dem Manifest und nur, wenn er als JSON höchstens 64 KiB groß ist; andere Werte verwirft er ohne Antwort. Die Geräteseite der Konsole liest die Werte alle 3 Sekunden.

### Fehler {#errors}

Ein Fehler vom Server sieht so aus: `{"type": "error", "payload": {"code": 3003, "message": "widget_id is required"}}`. Nach 1001 und 2001 schließt der Server die Verbindung; nach den anderen macht er weiter.

| Code | Bedeutung |
|---|---|
| 1001 | Anmeldung fehlgeschlagen |
| 2001 | Registrierung fehlgeschlagen |
| 1003 | `token_refresh` mit einem Token, der nicht mehr gültig ist |
| 1006 | Unbekannter Nachrichtentyp |
| 3001 bis 3009 | Ein Payload, den der Server nicht lesen kann: 3001 `heartbeat`, 3002 `state_update`, 3003 `state_update` ohne `widget_id`, 3004 `bulk_update`, 3005 `command_response`, 3006 `event`, 3007 `log`, 3008 `help_request` oder `token_refresh`, 3009 `chat_message` |
| 5001, 5002 | Der Server konnte eine Hilfeanfrage oder einen neuen Token (5001) oder eine Chatnachricht (5002) nicht speichern |

## Vom Server {#from-the-server}

| Typ | Payload | Wann |
|---|---|---|
| `command` | `command_id`, `widget_id`, `action`, `value`, `operator`, `reason` | Jemand hat ein Bedienelement in der Konsole benutzt, oder die API hat einen Befehl geschickt |
| `ping` | `server_time` | Die Antwort auf jeden Heartbeat |
| `chat_message` | `from_id`, `from_name`, `text` | Ein Benutzer der Konsole hat dem Gerät geschrieben |
| `revoke` | `reason` | Das Gerät wurde widerrufen; der Server schließt danach mit Code 4003 |
| `error` | `code`, `message` | Siehe oben |

Die Konsole schickt `set` mit dem neuen Wert für Schalter, Schieberegler und Auswahllisten und `trigger` ohne Wert für Schaltflächen; die API nimmt außerdem `execute`, `reset` und `query` an. `POST /api/peers/<id>/exec` erreicht ein CDAP-Gerät als Befehl für das Widget `shell` mit der Aktion `run` und dem Wert `{"command": "..."}`.

Beantworte jeden Befehl mit einer `command_response`, die seine `command_id` trägt, und einem `status` wie `ok` oder `error`:

```json
{"type": "command_response", "payload": {"command_id": "cmd_greenhouse-1_17", "status": "ok", "result": {"heater": true}, "execution_time_ms": 12}}
```

Der Server schreibt die Antwort ins Audit-Protokoll und gibt sie als Ereignis `cdap_command_response` weiter. Die Konsole liest den Zustand eines Bedienelements aus den Werten des Geräts. Schicke also nach einer Änderung den neuen Wert mit `state_update`.

## Sitzungen {#sessions}

Die Konsole öffnet Terminal-, Datei-, Desktop-, Video- und Audio-Sitzungen mit einem Gerät. Jede beginnt mit einer Nachricht `*_start`, deren `session_id` auch in der `id` des Rahmens steht; jede spätere Nachricht der Sitzung trägt die `session_id`. Der Server öffnet eine Sitzung nur, wenn das Manifest die passende Fähigkeit hat, und ignoriert eine Nachricht eines Geräts für eine Sitzung, die zu einem anderen Gerät gehört.

| Sitzung | Fähigkeit | Server schickt | Gerät schickt |
|---|---|---|---|
| Terminal | `terminal` oder `commands` | `terminal_start` (`cols`, `rows`, `operator_name`), `terminal_input` (`data`), `terminal_resize` (`cols`, `rows`), `terminal_end` | `terminal_output` (`data`, `stream`: `stdout` oder `stderr`), `terminal_end` (`reason`) |
| Dateien | `file_transfer` | `file_start`, dann `file_list`, `file_read`, `file_write` und `file_delete`, wie die Konsole sie schickt, `file_end` | `file_list_response`, `file_read_response`, `file_write_response`, `file_delete_response`, `file_end` |
| Desktop | `remote_desktop` | `desktop_start` (`width`, `height`, `quality`, `fps`, `fps_mode`, `codecs`, `video_codec`, `operator_name`), `desktop_input`, `desktop_control`, `desktop_resize`, `clipboard_set`, `codec_offer`, `key_exchange`, `keyframe_request`, `monitor_select`, `quality_adjust`, `desktop_end` | `desktop_frame` oder binäre Frames, `desktop_meta`, `monitor_list`, `codec_answer`, `cursor_update`, `key_exchange`, `clipboard_update`, `desktop_input_error`, `desktop_consent_denied`, `desktop_end` |
| Video | `video_stream` | `video_start` (`stream_id`, `quality`, `fps`), `video_end` | `video_frame` (`format`, `width`, `height`, `data`, `timestamp`, `key_frame`), `video_end` |
| Audio | `audio` | `audio_start` (`codec`, `sample_rate`, `channels`, `direction`), `audio_input`, `audio_end` | `audio_frame` (`codec`, `data`, `timestamp`, `duration`, `sequence`), `audio_end` |

- Die Dateianfragen tragen `request_id` und `path`, Lesezugriffe zusätzlich `offset` und `length`, Schreibzugriffe `data` in base64, `offset` und `done`. Der Server reicht die Anfrage der Konsole unverändert weiter und die Antwort des Geräts zurück; Antworten tragen `session_id` und `request_id`. Beschränke den Dateizugriff auf einen Ordner, den der Besitzer des Geräts gewählt hat.
- `desktop_frame` trägt `format` (`jpeg`, `png` oder `raw`), `width`, `height`, `data` in base64 und `timestamp` in Millisekunden. Ein binärer Frame ist schneller: 64 Bytes Sitzungs-ID, mit Nullbytes aufgefüllt, dann das Bild selbst, das der Server unverändert an den Browser weitergibt. `desktop_meta` (`format`, `width`, `height`, `binary`, `codec_string`) sagt dem Browser, wie er den Stream dekodiert.
- `desktop_input` hat einen `type` (`mouse_move`, `mouse_down`, `mouse_up`, `mouse_scroll`, `key_press`, `key_release` oder `text`) mit `x`, `y`, `button`, `delta_x`, `delta_y`, `key`, `code`, `modifiers` oder `text`.
- `clipboard_update` hat `format` (`text`, `image` oder `html`) und `data`.
- Bei einem Gerät vom Typ `os_agent` oder mit dem Tag `support-agent` trägt `desktop_start` außerdem einen `session_grant`. Er ist mit dem Schlüssel des Servers signiert und 5 Minuten gültig. Ein Support-Agent prüft ihn, bevor er die Person am Gerät um Zustimmung bittet.
