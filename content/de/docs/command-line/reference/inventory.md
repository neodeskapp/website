---
title: neodesk inventory
description: 2 Befehle. Hardware- und Software-Inventar der Geräte.
order: 29
quoted: true
---

Hardware- und Software-Inventar der Geräte.

Die Befehle stehen hier auf Englisch, so wie die Kommandozeile sie mit `neodesk inventory --help` zeigt. Die Flags, die jeder Befehl kennt, stehen in der [Befehlsreferenz](/docs/command-line/reference#flags-for-every-command).

## neodesk inventory get

Show one device's hardware and software.

```text quoted
neodesk inventory get <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

Needs a signed-in account; only reads. Calls `GET /api/inventory/{id}`.

## neodesk inventory list

List the inventory of every device.

```text quoted
neodesk inventory list [flags]
```

Needs a signed-in account; only reads. Calls `GET /api/inventory`.
