---
title: Monitoring
description: Health checks for an outside monitor, the Prometheus metrics and who may read them, where audit entries go, and how long the server keeps its records.
order: 9
---

This page lists what an outside monitor can ask the server, who may read it, and where the audit entries end up. For the logs and quick checks by hand, see [Troubleshooting](/docs/operations/troubleshooting#where-the-logs-are).

## Health checks

| Address | Port | Who may read it | Answer |
|---|---|---|---|
| `/health` | The console's: 3375 (5000 on installs from before 3.6.0-rc.5), or 5443 when it serves HTTPS | Anyone | `{"status":"ok","timestamp":"..."}` |
| `/api/health` | 21121 on every install type, and the server's API on 21114 on Linux and Windows | Anyone | `{"status":"ok","version":"..."}` |
| `/api/health/detail` | The server's API: 21121 in Docker, 21114 on Linux and Windows | As for the metrics below | Devices registered and online, relay sessions, uptime, whether the clock is synced, and the connection strategy |
| `/api/server/stats` | The server's API | As for the metrics below | Version, memory, uptime and device counts |

A check of `/health` through your reverse proxy tests the proxy and the console together. The ID server and the relay speak no HTTP; check that their TCP ports accept connections, or run `neodesk-server check` as shown in [Troubleshooting](/docs/operations/troubleshooting#health-checks).

In Docker the container's own health check asks the console and the API, over HTTPS first when `HTTPS_ENABLED` or `TLS_API` is on, and `docker compose ps` shows the result.

## Prometheus metrics

`/metrics` on the server's API port serves Prometheus text. It answers:

- everyone, with `METRICS_PUBLIC=Y`,
- the addresses and ranges in `METRICS_IP_ALLOWLIST`, comma-separated. The server checks the address the connection comes from, which behind a reverse proxy is the proxy's,
- a request with an API key, or a sign-in token of an account that may view metrics.

It refuses everything else. To let a Prometheus server in, set this in the env file (in Docker, the `.env` file next to the compose file), with its address in place of `<prometheus-address>`, and restart:

```ini
METRICS_IP_ALLOWLIST=<prometheus-address>
```

Then add the target to Prometheus, with your server's address in place of `<server-address>`:

```yaml
scrape_configs:
  - job_name: neodesk
    static_configs:
      - targets: ["<server-address>:21114"]
```

In Docker the port is 21121. On Linux and Windows the installers don't open 21114 in the firewall, so allow it from the Prometheus server only.

For a look by hand from the server itself, send the server API key, which **Settings**, **Client setup** shows under **For scripts** after **Show whole key**, for Super admin and Administrator accounts. With the key in `NEODESK_API_KEY`:

```bash
curl -H "X-API-Key: $NEODESK_API_KEY" http://127.0.0.1:21114/metrics
```

That key can manage the whole server, so give a scraper the allowlist rather than the key.

| Metric | What it shows |
|---|---|
| `neodesk_peers_total` | Devices the ID server holds right now |
| `neodesk_peers_online`, `neodesk_peers_degraded`, `neodesk_peers_critical`, `neodesk_peers_offline` | Those devices by state: degraded after 2 missed heartbeats, critical after 4 |
| `neodesk_peers_udp`, `neodesk_peers_tcp`, `neodesk_peers_ws` | Devices connected over UDP, TCP and WebSocket |
| `neodesk_peers_banned` | Banned devices |
| `neodesk_registrations_total` | Devices that registered with the ID server since it started |
| `neodesk_expired_total` | Devices the ID server dropped since it started because their heartbeats stopped |
| `neodesk_relay_active_sessions` | Sessions going through the relay now |
| `neodesk_relay_sessions_total` | Relay sessions since the server started |
| `neodesk_bandwidth_throttle_hits_total` | How often the relay's overall bandwidth limit held data back since the server started |
| `neodesk_blocklist_entries` | Entries in the blocklist |
| `neodesk_event_subscribers` | Open event streams of the API |
| `neodesk_audit_events_total` | Server events logged since the server started |
| `neodesk_uptime_seconds` | Time since the server started |
| `neodesk_goroutines`, `neodesk_memory_alloc_bytes`, `neodesk_memory_sys_bytes` | The server process |

## Log format

`LOG_FORMAT=json` makes the server write one JSON object per line, with `timestamp`, `level`, `component` and `message`, which log collectors read without parsing. `LOG_LEVEL` sets how much it writes; see [Configuration](/docs/operations/configuration#console-sessions-and-logs).

## Audit entries

The console and the server keep separate audit records, both in the database:

- The console's audit log: what people did in the console, such as sign-ins, approvals and changes to devices, people and settings.
- The server's events: sign-ins to the API, failed sign-ins, bans, blocked addresses, configuration changes and refused connections. Each one also goes to the log as a line with `[audit]`, with passwords, secrets, tokens and keys in its details hidden.

Both show under **Activity**, **Security and audit**; see [Activity and audit log](/docs/console/activity#security-and-audit). Scripts read the server's events from `/api/audit/events` on the API port, with `limit`, `offset` and `action` in the query, as an account or API key that may view audit logs.

With `AUDIT_LOG_FILE`, the server also appends each of its events to that file, one JSON object per line with `timestamp`, `action`, `actor`, `target` and `details`. Only the server's own account may read the file. The server keeps the file open and never shortens it, so rotate it with a tool that truncates in place, such as logrotate's `copytruncate`.

## How long records are kept

Once an hour the server deletes what is older than these limits:

| Record | Kept for |
|---|---|
| The console's audit log | 90 days |
| The server's events | 90 days |
| Connection, file transfer and alarm records that clients send | 90 days |
| Connection sessions | 90 days |
| Alert history, remote commands, app usage, data loss prevention events and network checks | 90 days |
| Device metrics (CPU, memory, disk) | 7 days |
| Enrollment requests nobody answered | 30 days |
| Availability history, when it is on | 30 days, or what **Keep history for (days)** under **Settings**, **General**, **Availability history** says |

Only the availability history can be changed. The log and the `AUDIT_LOG_FILE` file are not pruned by the server.
