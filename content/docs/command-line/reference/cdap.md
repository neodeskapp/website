---
title: neodesk cdap
description: 10 commands. CDAP devices, their widgets and commands.
order: 11
quoted: true
---

CDAP devices, their widgets and commands.

`neodesk cdap --help` lists the same commands in the terminal. The flags every command takes are in the [command reference](/docs/command-line/reference#flags-for-every-command).

## neodesk cdap alerts

List CDAP alerts.

```text quoted
neodesk cdap alerts [flags]
```

Needs a signed-in account; only reads. Calls `GET /api/cdap/alerts`.

## neodesk cdap command

Send a command to a widget of a CDAP device.

```text quoted
neodesk cdap command <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

| Flag | What it is |
|---|---|
| `--widget-id WIDGET_ID` |  |
| `--action ACTION` |  |
| `--value VALUE` |  |
| `--reason REASON` |  |

Needs cdap.command; changes something: needs a token with read and write access; runs something on a device or the server. Calls `POST /api/cdap/devices/{id}/command`.

## neodesk cdap get

Show one CDAP device.

```text quoted
neodesk cdap get <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

Needs a signed-in account; only reads. Calls `GET /api/cdap/devices/{id}`.

## neodesk cdap link

Link a CDAP device to a desktop device (empty to unlink).

```text quoted
neodesk cdap link <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

| Flag | What it is |
|---|---|
| `--linked-peer-id LINKED_PEER_ID` |  |

Needs cdap.command; changes something: needs a token with read and write access. Calls `POST /api/cdap/devices/{id}/link`.

## neodesk cdap linked

Show the desktop device a CDAP device is linked to.

```text quoted
neodesk cdap linked <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

Needs a signed-in account; only reads. Calls `GET /api/cdap/devices/{id}/linked`.

## neodesk cdap list

List CDAP devices.

```text quoted
neodesk cdap list [flags]
```

Needs a signed-in account; only reads. Calls `GET /api/cdap/devices`.

## neodesk cdap manifest

Show a CDAP device's widgets.

```text quoted
neodesk cdap manifest <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

Needs a signed-in account; only reads. Calls `GET /api/cdap/devices/{id}/manifest`.

## neodesk cdap state

Show a CDAP device's widget values.

```text quoted
neodesk cdap state <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

Needs a signed-in account; only reads. Calls `GET /api/cdap/devices/{id}/state`.

## neodesk cdap status

Show whether the CDAP gateway runs.

```text quoted
neodesk cdap status [flags]
```

Needs a signed-in account; only reads. Calls `GET /api/cdap/status`.

## neodesk cdap toggle

Turn the CDAP gateway on or off (after a restart).

```text quoted
neodesk cdap toggle [flags]
```

| Flag | What it is |
|---|---|
| `--enabled` |  |

Needs server.config; changes something: needs a token with read and write access. Calls `POST /api/cdap/toggle`.
