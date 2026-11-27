---
title: neodesk cross-platform
description: 3 commands. What each device platform supports.
order: 15
quoted: true
icon: devices_other
---

What each device platform supports.

`neodesk cross-platform --help` lists the same commands in the terminal. The flags every command takes are in the [command reference](/docs/command-line/reference#flags-for-every-command).

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
