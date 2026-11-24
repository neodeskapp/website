---
title: neodesk folders
description: 6 Befehle. Ordner, die Geräte sortieren.
order: 25
quoted: true
---

Ordner, die Geräte sortieren.

Die Befehle stehen hier auf Englisch, so wie die Kommandozeile sie mit `neodesk folders --help` zeigt. Die Flags, die jeder Befehl kennt, stehen in der [Befehlsreferenz](/docs/command-line/reference#flags-for-every-command).

## neodesk folders add-devices

Put devices into a folder (folder 0 takes them out of theirs).

```text quoted
neodesk folders add-devices <id> --device-ids A,B [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The folder ID, or 0 for none |

| Flag | What it is |
|---|---|
| `--device-ids A,B` | the devices (required) |

Needs device.edit; changes something: needs a token with read and write access. Calls `POST /api/folders/{id}/devices`.

## neodesk folders create

Create a folder.

```text quoted
neodesk folders create --name NAME [flags]
```

| Flag | What it is |
|---|---|
| `--name NAME` | the name (required) |
| `--color COLOR` | a color like #3b82f6 |
| `--icon ICON` | an icon name |

Needs device.edit; changes something: needs a token with read and write access. Calls `POST /api/folders`.

## neodesk folders delete

Delete a folder. Its devices stay, without a folder.

```text quoted
neodesk folders delete <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The folder ID |

Needs device.edit; changes something: needs a token with read and write access; deletes or ends something for good, so it asks first unless --yes is given. Calls `DELETE /api/folders/{id}`.

## neodesk folders list

List folders with how many devices each holds.

```text quoted
neodesk folders list [flags]
```

Needs device.view; only reads. Calls `GET /api/folders`.

## neodesk folders move-device

Put one device into a folder, or take it out.

```text quoted
neodesk folders move-device <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The device ID (see devices list) |

| Flag | What it is |
|---|---|
| `--folder-id N` | the folder ID; leave out to take it out of its folder |

Needs device.edit; changes something: needs a token with read and write access. Calls `PATCH /api/devices/{id}/folder`.

## neodesk folders update

Rename a folder or change its color.

```text quoted
neodesk folders update <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The folder ID |

| Flag | What it is |
|---|---|
| `--name NAME` | new name |
| `--color COLOR` | new color |

Needs device.edit; changes something: needs a token with read and write access. Calls `PATCH /api/folders/{id}`.
