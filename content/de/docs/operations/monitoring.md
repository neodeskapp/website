---
title: Monitoring
description: Health-Checks für ein externes Monitoring, Prometheus-Metriken und wer sie lesen darf, wohin Audit-Einträge gehen und wie lange der Server Daten behält.
order: 9
---

Diese Seite listet auf, was ein externes Monitoring den Server fragen kann, wer die Antworten lesen darf und wo die Audit-Einträge landen. Für die Logs und schnelle Prüfungen von Hand siehe [Fehlersuche](/docs/operations/troubleshooting#where-the-logs-are).

## Health-Checks {#health-checks}

| Adresse | Port | Wer sie lesen darf | Antwort |
|---|---|---|---|
| `/health` | Der Port der Konsole: 3375 (5000 bei Installationen von vor 3.6.0-rc.5), oder 5443, wenn sie HTTPS ausliefert | Alle | `{"status":"ok","timestamp":"..."}` |
| `/api/health` | 21121 bei jeder Installationsart, außerdem die API des Servers auf 21114 unter Linux und Windows | Alle | `{"status":"ok","version":"..."}` |
| `/api/health/detail` | Die API des Servers: 21121 unter Docker, 21114 unter Linux und Windows | Wie bei den Metriken unten | Geräte (registriert und online), Relay-Sitzungen, Laufzeit, ob die Uhr synchronisiert ist, und die Verbindungsstrategie |
| `/api/server/stats` | Die API des Servers | Wie bei den Metriken unten | Version, Arbeitsspeicher, Laufzeit und Gerätezahlen |

Ein Check von `/health` über deinen Reverse Proxy testet Proxy und Konsole zusammen. ID-Server und Relay sprechen kein HTTP. Prüfe, ob ihre TCP-Ports Verbindungen annehmen, oder nutze `neodesk-server check`, wie unter [Fehlersuche](/docs/operations/troubleshooting#health-checks) gezeigt.

Unter Docker fragt der Health-Check des Containers die Konsole und die API ab, zuerst über HTTPS, wenn `HTTPS_ENABLED` oder `TLS_API` eingeschaltet ist, und `docker compose ps` zeigt das Ergebnis.

## Prometheus-Metriken {#prometheus-metrics}

`/metrics` auf dem API-Port des Servers liefert Prometheus-Text. Es antwortet:

- allen, mit `METRICS_PUBLIC=Y`,
- den Adressen und Adressbereichen in `METRICS_IP_ALLOWLIST`, kommagetrennt. Der Server prüft die Adresse, von der die Verbindung kommt, und hinter einem Reverse Proxy ist das die des Proxys,
- einer Anfrage mit API-Schlüssel oder mit dem Anmelde-Token eines Kontos, das Metriken sehen darf. Unter Linux und Windows nimmt Port 21114 einen Schlüssel von einem anderen Rechner nur an, wenn dessen Adresse in `API_ALLOW_FROM` steht; vom Server selbst aus immer.

Alles andere weist es ab. Um einen Prometheus-Server zuzulassen, trage diese Zeile in die env-Datei ein (unter Docker in die Datei `.env` neben der Compose-Datei) und starte neu. Setze für `<prometheus-address>` die Adresse des Prometheus-Servers ein:

```ini
METRICS_IP_ALLOWLIST=<prometheus-address>
```

Füge dann das Ziel in Prometheus hinzu. Setze für `<server-address>` die Adresse deines Servers ein:

```yaml
scrape_configs:
  - job_name: neodesk
    static_configs:
      - targets: ["<server-address>:21114"]
```

Unter Docker ist der Port 21121. Unter Linux und Windows öffnen die Installer 21114 für RustDesk-Clients, Aufrufer von anderen Rechnern bekommen dort aber nur die Client-API: `/metrics`, `/api/health/detail` und `/api/server/stats` antworten einem Prometheus-Server auf einem anderen Rechner nur, wenn seine Adresse in `METRICS_IP_ALLOWLIST` (ohne Schlüssel) oder in `API_ALLOW_FROM` (mit API-Schlüssel) steht, oder mit `METRICS_PUBLIC=Y`. Siehe [Der API-Port unter Linux und Windows](/docs/operations/ports#the-api-port-on-linux-and-windows).

Für einen Blick von Hand auf dem Server selbst schickst du den API-Schlüssel des Servers mit. Du findest ihn unter **Geräte**, **Computer hinzufügen**, **Manuelle Einrichtung** bei **Für Skripte**, nachdem du auf **Ganzen Schlüssel zeigen** geklickt hast; das können Konten mit der Rolle Super-Admin oder Administrator. Mit dem Schlüssel in `NEODESK_API_KEY`:

```bash
curl -H "X-API-Key: $NEODESK_API_KEY" http://127.0.0.1:21114/metrics
```

Dieser Schlüssel kann den ganzen Server verwalten. Trage einen Scraper deshalb lieber in die Allowlist ein, statt ihm den Schlüssel zu geben.

| Metrik | Was sie zeigt |
|---|---|
| `neodesk_peers_total` | Geräte, die der ID-Server gerade hält |
| `neodesk_peers_online`, `neodesk_peers_degraded`, `neodesk_peers_critical`, `neodesk_peers_offline` | Diese Geräte nach Zustand: beeinträchtigt nach 2 verpassten Heartbeats, kritisch nach 4 |
| `neodesk_peers_udp`, `neodesk_peers_tcp`, `neodesk_peers_ws` | Geräte, die über UDP, TCP und WebSocket verbunden sind |
| `neodesk_peers_banned` | Gesperrte Geräte |
| `neodesk_registrations_total` | Geräte, die sich seit dem Start des ID-Servers dort registriert haben |
| `neodesk_expired_total` | Geräte, die der ID-Server seit seinem Start entfernt hat, weil ihre Heartbeats ausblieben |
| `neodesk_relay_active_sessions` | Sitzungen, die gerade über das Relay laufen |
| `neodesk_relay_sessions_total` | Relay-Sitzungen seit dem Start des Servers |
| `neodesk_bandwidth_throttle_hits_total` | Wie oft das Gesamtlimit für die Bandbreite des Relays seit dem Start des Servers Daten zurückgehalten hat |
| `neodesk_blocklist_entries` | Einträge in der Sperrliste |
| `neodesk_event_subscribers` | Offene Event-Streams der API |
| `neodesk_audit_events_total` | Server-Ereignisse, die seit dem Start des Servers protokolliert wurden |
| `neodesk_uptime_seconds` | Zeit seit dem Start des Servers |
| `neodesk_goroutines`, `neodesk_memory_alloc_bytes`, `neodesk_memory_sys_bytes` | Der Serverprozess |
| `neodesk_client_api_dropped_total{limit="device"}`, `{limit="address"}` | Heartbeats und Systeminfos von Clients, die die Client-API wegen einer Grenze abgelehnt hat |

Die Client-API nimmt von einem Gerät bis zu 40 Heartbeats pro Minute an und von einer Adresse bis zu 6000 pro Minute. So passen auch viele Computer hinter einer Büroadresse. Eine IPv6-Adresse zählt als ihr /64. Ein Aufruf über einer Grenze bekommt 429 mit `Retry-After`, und das Log hat pro Adresse und Grenze eine Zeile pro Minute.

## Log-Format {#log-format}

Mit `LOG_FORMAT=json` schreibt der Server ein JSON-Objekt pro Zeile, mit `timestamp`, `level`, `component` und `message`. Log-Sammler lesen das, ohne es parsen zu müssen. `LOG_LEVEL` legt fest, wie viel er schreibt; siehe [Konfiguration](/docs/operations/configuration#console-sessions-and-logs).

## Audit-Einträge {#audit-entries}

Konsole und Server führen getrennte Audit-Aufzeichnungen, beide in der Datenbank:

- Das Audit-Protokoll der Konsole: was Menschen in der Konsole getan haben, etwa Anmeldungen, Freigaben und Änderungen an Geräten, Personen und Einstellungen.
- Die Ereignisse des Servers: Anmeldungen an der API, fehlgeschlagene Anmeldungen, Sperren, blockierte Adressen, Konfigurationsänderungen und abgewiesene Verbindungen. Jedes davon geht außerdem als Zeile mit `[audit]` ins Log, wobei Passwörter, Geheimnisse, Token und Schlüssel in den Details verborgen sind.

Beide erscheinen unter **Aktivität**, **Audit-Protokoll**; siehe [Aktivität und Audit-Protokoll](/docs/console/activity#audit-log). Skripte lesen die Ereignisse des Servers von `/api/audit/events` auf dem API-Port, mit `limit`, `offset` und `action` in der Query. Das Konto oder der API-Schlüssel, mit dem sie das tun, braucht die Berechtigung, Audit-Protokolle zu sehen.

Mit `AUDIT_LOG_FILE` hängt der Server außerdem jedes seiner Ereignisse an diese Datei an, ein JSON-Objekt pro Zeile mit `timestamp`, `action`, `actor`, `target` und `details`. Nur das Konto, unter dem der Server läuft, darf die Datei lesen. Der Server hält die Datei offen und kürzt sie nie. Rotiere sie deshalb mit einem Werkzeug, das die Datei an Ort und Stelle kürzt, etwa mit `copytruncate` von logrotate.

## Wie lange Einträge aufbewahrt werden {#how-long-records-are-kept}

Einmal pro Stunde löscht der Server, was älter ist als diese Grenzen:

| Einträge | Aufbewahrt für |
|---|---|
| Das Audit-Protokoll der Konsole | 90 Tage |
| Die Ereignisse des Servers | 90 Tage |
| Verbindungs-, Dateiübertragungs- und Alarmeinträge, die Clients senden | 90 Tage |
| Verbindungssitzungen | 90 Tage |
| Warnungsverlauf, Fernbefehle, App-Nutzung, Ereignisse der Data Loss Prevention und Netzwerkprüfungen | 90 Tage |
| Gerätemetriken (CPU, Arbeitsspeicher, Datenträger) | 7 Tage |
| Beitrittsanfragen, die niemand beantwortet hat | 30 Tage |
| Verfügbarkeitsverlauf, wenn er eingeschaltet ist | 30 Tage, oder was **Verlauf aufbewahren (Tage)** unter **Einstellungen**, **Beitritt**, **Verfügbarkeitsverlauf** sagt |

Nur die Aufbewahrung des Verfügbarkeitsverlaufs lässt sich ändern. Das Log und die Datei aus `AUDIT_LOG_FILE` räumt der Server nicht auf.
