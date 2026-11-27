---
title: neodesk dashboard
description: 6 commands. The numbers on the dashboard and the server status.
order: 16
quoted: true
icon: dashboard
---

The numbers on the dashboard and the server status.

`neodesk dashboard --help` lists the same commands in the terminal. The flags every command takes are in the [command reference](/docs/command-line/reference#flags-for-every-command).

## neodesk dashboard activity

Show the recent activity the dashboard lists.

```text quoted
neodesk dashboard activity [flags]
```

Needs audit.view; only reads. Calls `GET /api/dashboard/activity`.

## neodesk dashboard bandwidth

Show the relay bandwidth.

```text quoted
neodesk dashboard bandwidth [flags]
```

Needs a signed-in account; only reads. Calls `GET /api/server/bandwidth`.

## neodesk dashboard client-config

Show the addresses and key a client needs to connect.

```text quoted
neodesk dashboard client-config [flags]
```

Needs a signed-in account; only reads. Calls `GET /api/dashboard/client-config`.

## neodesk dashboard stats

Show the counts of the dashboard: devices online, offline, banned.

```text quoted
neodesk dashboard stats [flags]
```

Needs a signed-in account; only reads. Calls `GET /api/stats`.

## neodesk dashboard status

Show whether the signal, relay and API servers run.

```text quoted
neodesk dashboard status [flags]
```

Needs a signed-in account; only reads. Calls `GET /api/server/status`.

## neodesk dashboard sync

Sync the online status of devices now.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk dashboard sync [flags]
```

Needs a signed-in account; changes something: needs a token with read and write access. Calls `POST /api/sync-status`.
