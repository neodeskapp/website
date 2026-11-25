---
title: neodesk inventory
description: 2 commands. Hardware and software inventory of devices.
order: 29
quoted: true
---

Hardware and software inventory of devices.

`neodesk inventory --help` lists the same commands in the terminal. The flags every command takes are in the [command reference](/docs/command-line/reference#flags-for-every-command).

## neodesk inventory get

Show one device's hardware and software.

```text quoted
neodesk inventory get <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

Needs device.view; only reads. Calls `GET /api/inventory/{id}`.

## neodesk inventory list

List the inventory of every device.

```text quoted
neodesk inventory list [flags]
```

Needs device.view; only reads. Calls `GET /api/inventory`.
