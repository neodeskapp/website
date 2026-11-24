---
title: neodesk activity
description: 3 Befehle. Was Personen auf Geräten getan haben: die Aktivität, die Agenten melden.
order: 2
quoted: true
---

Was Personen auf Geräten getan haben: die Aktivität, die Agenten melden.

Die Befehle stehen hier auf Englisch, so wie die Kommandozeile sie mit `neodesk activity --help` zeigt. Die Flags, die jeder Befehl kennt, stehen in der [Befehlsreferenz](/docs/command-line/reference#flags-for-every-command).

## neodesk activity device

Show one device's activity.

```text quoted
neodesk activity device <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The device ID (see devices list) |

Needs audit.view; only reads. Calls `GET /api/activity/{id}`.

## neodesk activity list

List the activity agents reported, per device.

```text quoted
neodesk activity list [flags]
```

Needs a signed-in account; only reads. Calls `GET /api/activity`.

## neodesk activity top

Show the programs a device used most.

```text quoted
neodesk activity top <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The device ID (see devices list) |

Needs audit.view; only reads. Calls `GET /api/activity/{id}/top`.
