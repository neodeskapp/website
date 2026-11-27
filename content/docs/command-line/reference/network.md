---
title: neodesk network
description: 15 commands. Network checks: targets, monitoring, ping and port tests.
order: 34
quoted: true
icon: network_check
---

Network checks: targets, monitoring, ping and port tests.

`neodesk network --help` lists the same commands in the terminal. The flags every command takes are in the [command reference](/docs/command-line/reference#flags-for-every-command).

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
| `--interval-ms N` | milliseconds between checks, at least 1000 (left out: 60000); a running monitor keeps its interval |

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

Needs device.view; only reads. Calls `GET /api/network/stats`.

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
| `--name NAME` | target name |
| `--host HOST` | host name or IP address to check; ping and tcp need it, http and https need it or --value-url |
| `--port N` | the port, 1 to 65535 (left out: 80 for tcp and http, 443 for https) |
| `--value-url VALUE_URL` | the URL for an http or https check; without it the URL is made from the host and port |
| `--check-type ping\|tcp\|http\|https` | how to check the target |
| `--timeout-ms N` | how long a check waits, in milliseconds, 1 to 60000 (left out: 5000) |
| `--interval-ms N` | how often to check this target, in milliseconds (left out: 60000); never more often than the monitor runs |
| `--enabled` | check this target or not (left out: on) |

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
