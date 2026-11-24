---
title: neodesk mesh
description: 16 commands. MeshCentral devices, groups and recordings.
order: 33
quoted: true
---

MeshCentral devices, groups and recordings.

`neodesk mesh --help` lists the same commands in the terminal. The flags every command takes are in the [command reference](/docs/command-line/reference#flags-for-every-command).

## neodesk mesh agent-config

Download the MeshAgent settings file (.msh) for this server (use --output).

```text quoted
neodesk mesh agent-config [flags]
```

| Flag | What it is |
|---|---|
| `--name NAME` | the device group name |
| `--mesh-id MESH_ID` | the MeshCentral group ID |

Needs server.config; only reads. Calls `GET /api/mesh/download.msh`.

## neodesk mesh exec

Run a command on a MeshCentral device.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk mesh exec <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

Needs mesh.terminal; changes something: needs a token with read and write access; runs something on a device or the server. Calls `POST /api/mesh/devices/{id}/exec`.

## neodesk mesh files

Open the files of a MeshCentral device.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk mesh files <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

Needs mesh.files; changes something: needs a token with read and write access; runs something on a device or the server. Calls `POST /api/mesh/devices/{id}/files`.

## neodesk mesh group-create

Make a MeshCentral device group.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk mesh group-create [flags]
```

Needs server.config; changes something: needs a token with read and write access. Calls `POST /api/mesh/groups`.

## neodesk mesh groups

List MeshCentral device groups.

```text quoted
neodesk mesh groups [flags]
```

Needs server.config; only reads. Calls `GET /api/mesh/groups`.

## neodesk mesh move

Move a MeshCentral device to another group.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk mesh move <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

Needs server.config; changes something: needs a token with read and write access. Calls `POST /api/mesh/devices/{id}/group`.

## neodesk mesh power

Wake, sleep, restart or turn off a MeshCentral device.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk mesh power <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

Needs mesh.power; changes something: needs a token with read and write access; runs something on a device or the server. Calls `POST /api/mesh/devices/{id}/power`.

## neodesk mesh recording

Download a session recording (use --output).

```text quoted
neodesk mesh recording <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

Needs device.connect; only reads; the answer holds secrets or private content. Calls `GET /api/mesh/recordings/{id}`.

## neodesk mesh recordings

List MeshCentral session recordings.

```text quoted
neodesk mesh recordings [flags]
```

Needs device.view; only reads. Calls `GET /api/mesh/recordings`.

## neodesk mesh server-id

Show the MeshCentral server's ID.

```text quoted
neodesk mesh server-id [flags]
```

Needs server.config; only reads. Calls `GET /api/mesh/server-id`.

## neodesk mesh session-recordings

List the recorded remote sessions.

```text quoted
neodesk mesh session-recordings [flags]
```

Needs device.view; only reads. Calls `GET /api/session/recordings`.

## neodesk mesh share

Make a share link for a MeshCentral device.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk mesh share <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

Needs device.connect; changes something: needs a token with read and write access; the answer holds secrets or private content. Calls `POST /api/mesh/devices/{id}/share`.

## neodesk mesh status

Show whether MeshCentral support runs.

```text quoted
neodesk mesh status [flags]
```

Needs a signed-in account; only reads. Calls `GET /api/mesh/status`.

## neodesk mesh tcp

Open a TCP tunnel to a MeshCentral device.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk mesh tcp <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

Needs device.connect; changes something: needs a token with read and write access; runs something on a device or the server. Calls `POST /api/mesh/devices/{id}/tcp`.

## neodesk mesh terminal

Open a terminal on a MeshCentral device.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk mesh terminal <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

Needs mesh.terminal; changes something: needs a token with read and write access; runs something on a device or the server. Calls `POST /api/mesh/devices/{id}/terminal`.

## neodesk mesh udp

Open a UDP tunnel to a MeshCentral device.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk mesh udp <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

Needs device.connect; changes something: needs a token with read and write access; runs something on a device or the server. Calls `POST /api/mesh/devices/{id}/udp`.
