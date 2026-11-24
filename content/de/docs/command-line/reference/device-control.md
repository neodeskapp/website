---
title: neodesk device-control
description: 7 Befehle. Bildschirm, Tastatur, Maus, Zwischenablage und Terminal eines NeoDesk-Agenten.
order: 18
quoted: true
---

Bildschirm, Tastatur, Maus, Zwischenablage und Terminal eines NeoDesk-Agenten.

Die Befehle stehen hier auf Englisch, so wie die Kommandozeile sie mit `neodesk device-control --help` zeigt. Die Flags, die jeder Befehl kennt, stehen in der [Befehlsreferenz](/docs/command-line/reference#flags-for-every-command).

## neodesk device-control clipboard

Read the text on a device's clipboard.

```text quoted
neodesk device-control clipboard <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The device ID (see devices list) |

Needs device.connect; only reads; the answer holds secrets or private content. Calls `GET /api/devices/{id}/clipboard`.

## neodesk device-control clipboard-set

Put text on a device's clipboard.

```text quoted
neodesk device-control clipboard-set <id> --text TEXT [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The device ID (see devices list) |

| Flag | What it is |
|---|---|
| `--text TEXT` | the text (required) |

Needs device.connect; changes something: needs a token with read and write access; runs something on a device or the server. Calls `POST /api/devices/{id}/clipboard`.

## neodesk device-control key

Press a key on a device.

```text quoted
neodesk device-control key <id> --key KEY [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The device ID (see devices list) |

| Flag | What it is |
|---|---|
| `--key KEY` | the key, like Enter or a (required) |
| `--action press\|down\|up` | press, down or up |

Needs device.connect; changes something: needs a token with read and write access; runs something on a device or the server. Calls `POST /api/devices/{id}/input/key`.

## neodesk device-control mouse

Move or click the mouse on a device.

```text quoted
neodesk device-control mouse <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The device ID (see devices list) |

| Flag | What it is |
|---|---|
| `--action ACTION` | move (default), down, up, click or wheel |
| `--x N` | across, in pixels |
| `--y N` | down, in pixels |
| `--button BUTTON` | left, right or middle |
| `--wheel-dy N` | wheel steps down (negative: up) |

Needs device.connect; changes something: needs a token with read and write access; runs something on a device or the server. Calls `POST /api/devices/{id}/input/mouse`.

## neodesk device-control run

Run one command on a device and print what it printed.

```text quoted
neodesk device-control run <id> --command COMMAND [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The device ID (see devices list) |

| Flag | What it is |
|---|---|
| `--command COMMAND` | the command line, at most 4096 characters (required) |

Needs agent.terminal; changes something: needs a token with read and write access; runs something on a device or the server. Calls `POST /api/devices/{id}/terminal/execute`.

```bash quoted
neodesk device-control run 123456789 --command "ipconfig /all"
```

## neodesk device-control screenshot

Take a picture of a device's screen (use --output).

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk device-control screenshot <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The device ID (see devices list) |

Needs device.connect; changes something: needs a token with read and write access; the answer holds secrets or private content. Calls `POST /api/devices/{id}/screenshot`.

```bash quoted
neodesk device-control screenshot 123456789 --json
```

## neodesk device-control type

Type text on a device.

```text quoted
neodesk device-control type <id> --text TEXT [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The device ID (see devices list) |

| Flag | What it is |
|---|---|
| `--text TEXT` | the text, at most 4096 characters (required) |

Needs device.connect; changes something: needs a token with read and write access; runs something on a device or the server. Calls `POST /api/devices/{id}/input/text`.
