---
title: neodesk transfers
description: 5 commands. File transfers between the console and devices.
order: 57
quoted: true
---

File transfers between the console and devices.

`neodesk transfers --help` lists the same commands in the terminal. The flags every command takes are in the [command reference](/docs/command-line/reference#flags-for-every-command).

## neodesk transfers cancel

Cancel a file transfer.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk transfers cancel <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

Needs device.connect; changes something: needs a token with read and write access. Calls `POST /api/files/transfers/{id}/cancel`.

## neodesk transfers download

Download the file of a transfer (use --output).

```text quoted
neodesk transfers download <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

Needs device.connect; only reads; the answer holds secrets or private content. Calls `GET /api/files/transfers/{id}/download`.

## neodesk transfers get

Show one file transfer.

```text quoted
neodesk transfers get <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

Needs device.connect; only reads. Calls `GET /api/files/transfers/{id}`.

## neodesk transfers list

List file transfers.

```text quoted
neodesk transfers list [flags]
```

Needs device.connect; only reads. Calls `GET /api/files/transfers`.

## neodesk transfers start

Start a file transfer to or from a device.

```text quoted
neodesk transfers start [flags]
```

| Flag | What it is |
|---|---|
| `--direction upload\|download` | upload (console to device) or download (device to console) |
| `--device-id DEVICE_ID` | the device's ID |
| `--filename FILENAME` | the file's name; only its last part is kept |
| `--size N` | file size in bytes, at most 4 GiB (left out: unknown) |
| `--mime-type MIME_TYPE` | the file's content type, at most 255 characters (left out: application/octet-stream) |

Needs device.connect; changes something: needs a token with read and write access; runs something on a device or the server. Calls `POST /api/files/transfer`.
