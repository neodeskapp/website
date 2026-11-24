---
title: neodesk device-files
description: 6 commands. Files on a device with a NeoDesk agent.
order: 19
quoted: true
---

Files on a device with a NeoDesk agent.

`neodesk device-files --help` lists the same commands in the terminal. The flags every command takes are in the [command reference](/docs/command-line/reference#flags-for-every-command).

## neodesk device-files delete

Delete a file or folder on a device.

```text quoted
neodesk device-files delete <id> --path PATH [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The device ID (see devices list) |

| Flag | What it is |
|---|---|
| `--path PATH` | what to delete (required) |
| `--recursive` | a folder with everything in it |

Needs agent.files; changes something: needs a token with read and write access; deletes or ends something for good, so it asks first unless --yes is given; runs something on a device or the server. Calls `POST /api/devices/{id}/files/delete`.

## neodesk device-files list

List a folder on a device.

```text quoted
neodesk device-files list <id> --path PATH [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The device ID (see devices list) |

| Flag | What it is |
|---|---|
| `--path PATH` | the folder (required) |
| `--show-hidden` | list hidden files too |

Needs agent.files; changes something: needs a token with read and write access. Calls `POST /api/devices/{id}/files/browse`.

```bash quoted
neodesk device-files list 123456789 --path C:\\Users
```

## neodesk device-files mkdir

Make a folder on a device.

```text quoted
neodesk device-files mkdir <id> --path PATH [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The device ID (see devices list) |

| Flag | What it is |
|---|---|
| `--path PATH` | the folder (required) |
| `--recursive` | make the folders above too |

Needs agent.files; changes something: needs a token with read and write access; runs something on a device or the server. Calls `POST /api/devices/{id}/files/mkdir`.

## neodesk device-files read

Read a file on a device (up to 1 MiB per call).

```text quoted
neodesk device-files read <id> --path PATH [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The device ID (see devices list) |

| Flag | What it is |
|---|---|
| `--path PATH` | the file (required) |
| `--offset N` | where to start, in bytes |
| `--length N` | how many bytes (default 64 KiB) |

Needs agent.files; changes something: needs a token with read and write access; the answer holds secrets or private content. Calls `POST /api/devices/{id}/files/read`.

## neodesk device-files rename

Rename or move a file on a device.

```text quoted
neodesk device-files rename <id> --from FROM --to TO [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The device ID (see devices list) |

| Flag | What it is |
|---|---|
| `--from FROM` | the old path (required) |
| `--to TO` | the new path (required) |

Needs agent.files; changes something: needs a token with read and write access; runs something on a device or the server. Calls `POST /api/devices/{id}/files/rename`.

## neodesk device-files write

Write a file on a device.

```text quoted
neodesk device-files write <id> --path PATH --content CONTENT [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The device ID (see devices list) |

| Flag | What it is |
|---|---|
| `--path PATH` | the file (required) |
| `--content CONTENT` | the content (required) |
| `--mode overwrite\|append\|create` | overwrite, append or create |

Needs agent.files; changes something: needs a token with read and write access; runs something on a device or the server. Calls `POST /api/devices/{id}/files/write`.
