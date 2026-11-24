---
title: neodesk user-groups
description: 4 Befehle. Benutzergruppen.
order: 58
quoted: true
---

Benutzergruppen.

Die Befehle stehen hier auf Englisch, so wie die Kommandozeile sie mit `neodesk user-groups --help` zeigt. Die Flags, die jeder Befehl kennt, stehen in der [Befehlsreferenz](/docs/command-line/reference#flags-for-every-command).

## neodesk user-groups create

Create a user group.

```text quoted
neodesk user-groups create --name NAME [flags]
```

| Flag | What it is |
|---|---|
| `--name NAME` | the group's name (required) |
| `--note NOTE` | a note |
| `--team-id TEAM_ID` | its team ID |

Needs user.edit; changes something: needs a token with read and write access. Calls `POST /api/panel/user-groups`.

## neodesk user-groups delete

Delete a user group. Its members keep their accounts.

```text quoted
neodesk user-groups delete <guid> [flags]
```

| Argument | What it is |
|---|---|
| `<guid>` | The group's GUID |

Needs user.edit; changes something: needs a token with read and write access; deletes or ends something for good, so it asks first unless --yes is given. Calls `DELETE /api/panel/user-groups/{guid}`.

## neodesk user-groups list

List user groups.

```text quoted
neodesk user-groups list [flags]
```

Needs user.view or device.edit; only reads. Calls `GET /api/panel/user-groups`.

## neodesk user-groups update

Rename a user group or change its note.

```text quoted
neodesk user-groups update <guid> [flags]
```

| Argument | What it is |
|---|---|
| `<guid>` | The group's GUID (see user-groups list) |

| Flag | What it is |
|---|---|
| `--name NAME` | new name |
| `--note NOTE` | new note |

Needs user.edit; changes something: needs a token with read and write access. Calls `PATCH /api/panel/user-groups/{guid}`.
