---
title: neodesk devices
description: 27 Befehle. Geräte: Liste, Details, Notizen, Tags, Sperren, Verbindungseinstellungen.
order: 22
quoted: true
---

Geräte: Liste, Details, Notizen, Tags, Sperren, Verbindungseinstellungen.

Die Befehle stehen hier auf Englisch, so wie die Kommandozeile sie mit `neodesk devices --help` zeigt. Die Flags, die jeder Befehl kennt, stehen in der [Befehlsreferenz](/docs/command-line/reference#flags-for-every-command).

## neodesk devices access-policy

Show who may connect to a device and how.

```text quoted
neodesk devices access-policy <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The device ID (see devices list) |

Needs a signed-in account; only reads. Calls `GET /api/devices/{id}/access-policy`.

## neodesk devices access-policy-delete

Remove a device's own access policy.

```text quoted
neodesk devices access-policy-delete <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The device ID (see devices list) |

Needs a signed-in account; changes something: needs a token with read and write access; deletes or ends something for good, so it asks first unless --yes is given. Calls `DELETE /api/devices/{id}/access-policy`.

## neodesk devices access-policy-set

Set who may connect to a device and how.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk devices access-policy-set <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The device ID (see devices list) |

Needs a signed-in account; changes something: needs a token with read and write access. Calls `PUT /api/devices/{id}/access-policy`.

## neodesk devices activity

Show what a device reported about its use (NeoDesk agent).

```text quoted
neodesk devices activity <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The device ID (see devices list) |

Needs a signed-in account; only reads. Calls `GET /api/devices/{id}/activity`.

## neodesk devices availability

Show when a device was online over a day.

```text quoted
neodesk devices availability <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The device ID (see devices list) |

| Flag | What it is |
|---|---|
| `--day DAY` | the day, like 2026-11-23 (default today) |

Needs a signed-in account; only reads. Calls `GET /api/devices/{id}/availability`.

## neodesk devices ban

Ban a device: it can no longer connect.

```text quoted
neodesk devices ban <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The device ID (see devices list) |

| Flag | What it is |
|---|---|
| `--reason REASON` | why, for the audit log |

Needs device.ban; changes something: needs a token with read and write access; deletes or ends something for good, so it asks first unless --yes is given. Calls `POST /api/devices/{id}/ban`.

## neodesk devices bulk-delete

Delete several devices at once.

```text quoted
neodesk devices bulk-delete --ids A,B [flags]
```

| Flag | What it is |
|---|---|
| `--ids A,B` | the device IDs (required) |

Needs device.delete; changes something: needs a token with read and write access; deletes or ends something for good, so it asks first unless --yes is given. Calls `POST /api/devices/bulk-delete`.

```bash quoted
neodesk devices bulk-delete --ids 111111111,222222222 --yes
```

## neodesk devices change-id

Give a device a new ID (6 to 16 letters, digits, - and _).

```text quoted
neodesk devices change-id <id> --new-id NEW_ID [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The device ID (see devices list) |

| Flag | What it is |
|---|---|
| `--new-id NEW_ID` | the new ID (required) |

Needs device.change_id; changes something: needs a token with read and write access. Calls `POST /api/devices/{id}/change-id`.

## neodesk devices connect-password

Show the one-time password to connect to a device.

```text quoted
neodesk devices connect-password <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The device ID (see devices list) |

Needs device.connect; only reads; the answer holds secrets or private content. Calls `GET /api/devices/{id}/connect-password`.

## neodesk devices connection-mode

Let a device accept only incoming connections, or both ways again.

```text quoted
neodesk devices connection-mode <id> --mode normal|incoming-only [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The device ID (see devices list) |

| Flag | What it is |
|---|---|
| `--mode normal\|incoming-only` | normal or incoming-only (required) |
| `--reason REASON` | why, for the audit log |

Needs device.connection_mode; changes something: needs a token with read and write access. Calls `POST /api/devices/{id}/connection-mode`.

## neodesk devices delete

Delete a device and revoke its tokens. devices restore brings it back.

```text quoted
neodesk devices delete <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The device ID (see devices list) |

Needs device.delete; changes something: needs a token with read and write access; deletes or ends something for good, so it asks first unless --yes is given. Calls `DELETE /api/devices/{id}`.

## neodesk devices device-token

Issue a new device token for a device (shown once).

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk devices device-token <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The device ID (see devices list) |

Needs a signed-in account; changes something: needs a token with read and write access; the answer holds secrets or private content. Calls `POST /api/devices/{id}/device-token`.

## neodesk devices events

Show the newest system events of a device (NeoDesk agent).

```text quoted
neodesk devices events <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The device ID (see devices list) |

| Flag | What it is |
|---|---|
| `--limit N` | how many |

Needs a signed-in account; only reads. Calls `GET /api/devices/{id}/events`.

## neodesk devices get

Show one device with all its details.

```text quoted
neodesk devices get <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The device ID (see devices list) |

Needs a signed-in account; only reads. Calls `GET /api/devices/{id}`.

```bash quoted
neodesk devices get 123456789
```

## neodesk devices groups

List the device groups a device is in.

```text quoted
neodesk devices groups <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The device ID (see devices list) |

Needs a signed-in account; only reads. Calls `GET /api/devices/{id}/groups`.

## neodesk devices groups-set

Replace the manual device groups of a device.

```text quoted
neodesk devices groups-set <id> --group-guids A,B [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The device ID (see devices list) |

| Flag | What it is |
|---|---|
| `--group-guids A,B` | the device groups (required) |

Needs a signed-in account; changes something: needs a token with read and write access. Calls `PUT /api/devices/{id}/groups`.

## neodesk devices list

List devices with their status, folder and groups.

```text quoted
neodesk devices list [flags]
```

| Flag | What it is |
|---|---|
| `--search SEARCH` | only devices whose ID, name, user or note contains this |
| `--status online\|offline` | only online or offline devices |
| `--sort-by last_online\|id\|hostname\|created_at\|os\|version\|username\|note` | order by this field |
| `--order asc\|desc` | asc or desc |
| `--include-deleted` | list deleted devices too |

Needs a signed-in account; only reads. Calls `GET /api/devices`.

```bash quoted
neodesk devices list
neodesk devices list --status online --search office
neodesk devices list --json
```

## neodesk devices processes

List the processes on a device (NeoDesk agent).

```text quoted
neodesk devices processes <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The device ID (see devices list) |

Needs a signed-in account; only reads. Calls `GET /api/devices/{id}/processes`.

## neodesk devices rename

Set a device's display name.

```text quoted
neodesk devices rename <id> --name NAME [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The device ID (see devices list) |

| Flag | What it is |
|---|---|
| `--name NAME` | the display name (required) |

Needs a signed-in account; changes something: needs a token with read and write access. Calls `POST /api/devices/{id}/rename`.

## neodesk devices restore

Bring back a deleted device.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk devices restore <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The device ID (see devices list) |

Needs device.delete; changes something: needs a token with read and write access; deletes or ends something for good, so it asks first unless --yes is given. Calls `POST /api/devices/{id}/restore`.

## neodesk devices services

List the services on a device (NeoDesk agent).

```text quoted
neodesk devices services <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The device ID (see devices list) |

Needs a signed-in account; only reads. Calls `GET /api/devices/{id}/services`.

## neodesk devices sessions

List the remote sessions to a device, newest first.

```text quoted
neodesk devices sessions <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The device ID (see devices list) |

| Flag | What it is |
|---|---|
| `--limit N` | how many, 1 to 200 (default 50) |

Needs a signed-in account; only reads. Calls `GET /api/devices/{id}/connection-sessions`.

## neodesk devices tags-set

Replace a device's tags.

```text quoted
neodesk devices tags-set <id> --tags A,B [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The device ID (see devices list) |

| Flag | What it is |
|---|---|
| `--tags A,B` | the tags (required) |

Needs a signed-in account; changes something: needs a token with read and write access. Calls `PUT /api/devices/{id}/tags`.

```bash quoted
neodesk devices tags-set 123456789 --tags office,printer
```

## neodesk devices telemetry-command

Queue an allowed command for a device's next heartbeat.

```text quoted
neodesk devices telemetry-command <id> --command COMMAND [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The device ID (see devices list) |

| Flag | What it is |
|---|---|
| `--command COMMAND` | the command (required) |
| `--args JSON` | its arguments |

Needs a signed-in account; changes something: needs a token with read and write access; runs something on a device or the server. Calls `POST /api/devices/{id}/telemetry/command`.

## neodesk devices telemetry-refresh

Ask a device's agent for fresh system details.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk devices telemetry-refresh <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The device ID (see devices list) |

Needs a signed-in account; changes something: needs a token with read and write access. Calls `POST /api/devices/{id}/telemetry/refresh`.

## neodesk devices unban

Lift the ban of a device.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk devices unban <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The device ID (see devices list) |

Needs device.ban; changes something: needs a token with read and write access. Calls `POST /api/devices/{id}/unban`.

## neodesk devices update

Change a device's note, display name or user. Give only what changes.

```text quoted
neodesk devices update <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The device ID (see devices list) |

| Flag | What it is |
|---|---|
| `--note NOTE` | the note |
| `--display-name DISPLAY_NAME` | the name shown in the console |
| `--user USER` | the user name |

Needs a signed-in account; changes something: needs a token with read and write access. Calls `PATCH /api/devices/{id}`.

```bash quoted
neodesk devices update 123456789 --note "Front desk"
```
