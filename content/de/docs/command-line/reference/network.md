---
title: neodesk network
description: 15 Befehle. Netzwerkprüfungen: Ziele, Überwachung, Ping und Port-Tests.
order: 34
quoted: true
---

Netzwerkprüfungen: Ziele, Überwachung, Ping und Port-Tests.

Die Befehle stehen hier auf Englisch, so wie die Kommandozeile sie mit `neodesk network --help` zeigt. Die Flags, die jeder Befehl kennt, stehen in der [Befehlsreferenz](/docs/command-line/reference#flags-for-every-command).

## neodesk network http

Fetch an address from the server and show the status.

```text quoted
neodesk network http --address ADDRESS [flags]
```

| Flag | What it is |
|---|---|
| `--address ADDRESS` | the address, like https://example.com (required) |
| `--wait N` | seconds to wait for an answer |

Needs device.connect; changes something: needs a token with read and write access. Calls `POST /api/network/http`.

## neodesk network monitor-start

Start checking the targets on a timer.

```text quoted
neodesk network monitor-start [flags]
```

| Flag | What it is |
|---|---|
| `--interval-ms N` |  |

Needs server.config; changes something: needs a token with read and write access. Calls `POST /api/network/monitor/start`.

## neodesk network monitor-status

Show whether the timed checks run.

```text quoted
neodesk network monitor-status [flags]
```

Needs device.view; only reads. Calls `GET /api/network/monitor/status`.

## neodesk network monitor-stop

Stop the timed checks.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk network monitor-stop [flags]
```

Needs server.config; changes something: needs a token with read and write access. Calls `POST /api/network/monitor/stop`.

## neodesk network ping

Ping a host from the server.

```text quoted
neodesk network ping --host HOST [flags]
```

| Flag | What it is |
|---|---|
| `--host HOST` | the host (required) |
| `--wait N` | seconds to wait for an answer |

Needs device.connect; changes something: needs a token with read and write access. Calls `POST /api/network/ping`.

```bash quoted
neodesk network ping --host 192.0.2.10
```

## neodesk network resolve

Look up a host name from the server.

```text quoted
neodesk network resolve --host HOST [flags]
```

| Flag | What it is |
|---|---|
| `--host HOST` | the host (required) |

Needs device.connect; changes something: needs a token with read and write access. Calls `POST /api/network/resolve`.

## neodesk network stats

Show uptime and response times of the targets.

```text quoted
neodesk network stats [flags]
```

Needs audit.view; only reads. Calls `GET /api/network/stats`.

## neodesk network target

Show one target.

```text quoted
neodesk network target <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

Needs device.view; only reads. Calls `GET /api/network/targets/{id}`.

## neodesk network target-check

Check one target now.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk network target-check <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

Needs device.connect; changes something: needs a token with read and write access. Calls `POST /api/network/targets/{id}/check`.

## neodesk network target-create

Add a target to check.

```text quoted
neodesk network target-create [flags]
```

| Flag | What it is |
|---|---|
| `--name NAME` |  |
| `--host HOST` |  |
| `--port N` |  |
| `--value-url VALUE_URL` |  |
| `--check-type CHECK_TYPE` |  |
| `--timeout-ms N` |  |
| `--interval-ms N` |  |
| `--enabled` |  |

Needs server.config; changes something: needs a token with read and write access. Calls `POST /api/network/targets`.

## neodesk network target-delete

Delete a target.

```text quoted
neodesk network target-delete <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

Needs server.config; changes something: needs a token with read and write access; deletes or ends something for good, so it asks first unless --yes is given. Calls `DELETE /api/network/targets/{id}`.

## neodesk network target-history

Show the past checks of a target.

```text quoted
neodesk network target-history <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

Needs device.view; only reads. Calls `GET /api/network/targets/{id}/history`.

## neodesk network target-update

Change a target.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk network target-update <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

Needs server.config; changes something: needs a token with read and write access. Calls `PATCH /api/network/targets/{id}`.

## neodesk network targets

List targets. -q enabled=true lists the enabled ones.

```text quoted
neodesk network targets [flags]
```

Needs device.view; only reads. Calls `GET /api/network/targets`.

## neodesk network tcp

Check that a TCP port answers, from the server.

```text quoted
neodesk network tcp --host HOST --port N [flags]
```

| Flag | What it is |
|---|---|
| `--host HOST` | the host (required) |
| `--port N` | the port (required) |
| `--wait N` | seconds to wait for an answer |

Needs device.connect; changes something: needs a token with read and write access. Calls `POST /api/network/tcp`.
