---
title: neodesk activity
description: 3 commands. What people did on devices: the activity agents report.
order: 2
quoted: true
---

What people did on devices: the activity agents report.

`neodesk activity --help` lists the same commands in the terminal. The flags every command takes are in the [command reference](/docs/command-line/reference#flags-for-every-command).

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
