---
title: neodesk registrations
description: 7 commands. Devices that asked to register.
order: 39
quoted: true
---

Devices that asked to register.

`neodesk registrations --help` lists the same commands in the terminal. The flags every command takes are in the [command reference](/docs/command-line/reference#flags-for-every-command).

## neodesk registrations approve

Approve a registration.

```text quoted
neodesk registrations approve <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The registration ID (see registrations list) |

| Flag | What it is |
|---|---|
| `--name NAME` | display name |
| `--folder-id N` | folder |
| `--tags A,B` | tags |

Needs enrollment.approve; changes something: needs a token with read and write access. Calls `PUT /api/registrations/{id}/approve`.

## neodesk registrations count

Count waiting registrations.

```text quoted
neodesk registrations count [flags]
```

Needs enrollment.approve; only reads. Calls `GET /api/registrations/count`.

## neodesk registrations delete

Delete a registration.

```text quoted
neodesk registrations delete <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The registration ID (see registrations list) |

Needs enrollment.manage; changes something: needs a token with read and write access; deletes or ends something for good, so it asks first unless --yes is given. Calls `DELETE /api/registrations/{id}`.

## neodesk registrations get

Show a registration.

```text quoted
neodesk registrations get <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The registration ID (see registrations list) |

Needs enrollment.approve; only reads. Calls `GET /api/registrations/{id}`.

## neodesk registrations list

List devices that asked to register.

```text quoted
neodesk registrations list [flags]
```

Needs enrollment.approve; only reads. Calls `GET /api/registrations`.

## neodesk registrations options

Show the folders, groups and tags an approval can use.

```text quoted
neodesk registrations options [flags]
```

Needs enrollment.approve; only reads. Calls `GET /api/registrations/enrollment-ui`.

## neodesk registrations reject

Reject a registration.

```text quoted
neodesk registrations reject <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The registration ID (see registrations list) |

| Flag | What it is |
|---|---|
| `--reason REASON` | why |

Needs enrollment.approve; changes something: needs a token with read and write access; deletes or ends something for good, so it asks first unless --yes is given. Calls `PUT /api/registrations/{id}/reject`.
