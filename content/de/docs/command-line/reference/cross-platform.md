---
title: neodesk cross-platform
description: 3 Befehle. Was jede Geräteplattform unterstützt.
order: 15
quoted: true
---

Was jede Geräteplattform unterstützt.

Die Befehle stehen hier auf Englisch, so wie die Kommandozeile sie mit `neodesk cross-platform --help` zeigt. Die Flags, die jeder Befehl kennt, stehen in der [Befehlsreferenz](/docs/command-line/reference#flags-for-every-command).

## neodesk cross-platform device

Show what one device supports.

```text quoted
neodesk cross-platform device <deviceId> [flags]
```

| Argument | What it is |
|---|---|
| `<deviceId>` | The device ID |

Needs device.view; only reads. Calls `GET /api/panel/cross-platform/capabilities/{deviceId}`.

## neodesk cross-platform distribution

Count devices per platform.

```text quoted
neodesk cross-platform distribution [flags]
```

Needs device.view; only reads. Calls `GET /api/panel/cross-platform/distribution`.

## neodesk cross-platform protocols

List the remote protocols and the platforms each runs on.

```text quoted
neodesk cross-platform protocols [flags]
```

Needs device.view; only reads. Calls `GET /api/panel/cross-platform/protocols`.
