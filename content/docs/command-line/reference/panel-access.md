---
title: neodesk panel-access
description: 5 commands. Which console sections and client features each account may use.
order: 37
quoted: true
---

Which console sections and client features each account may use.

`neodesk panel-access --help` lists the same commands in the terminal. The flags every command takes are in the [command reference](/docs/command-line/reference#flags-for-every-command).

## neodesk panel-access catalog

List the console sections and client features access rules can name.

```text quoted
neodesk panel-access catalog [flags]
```

Needs user.view; only reads. Calls `GET /api/panel/access/catalog`.

## neodesk panel-access group

Show a user group's section and feature rules.

```text quoted
neodesk panel-access group <guid> [flags]
```

| Argument | What it is |
|---|---|
| `<guid>` | The user group's GUID |

Needs user.view; only reads. Calls `GET /api/panel/access/groups/{guid}`.

## neodesk panel-access group-set

Replace a user group's section and feature rules.

```text quoted
neodesk panel-access group-set <guid> [flags]
```

| Argument | What it is |
|---|---|
| `<guid>` | The user group's GUID |

| Flag | What it is |
|---|---|
| `--sections JSON` | section to level, like {"settings":"none"} |
| `--features JSON` | client feature to on or off, like {"terminal":false} |

Needs user.edit; changes something: needs a token with read and write access. Calls `PUT /api/panel/access/groups/{guid}`.

## neodesk panel-access user

Show an account's own section and feature rules.

```text quoted
neodesk panel-access user <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The account ID |

Needs user.view; only reads. Calls `GET /api/panel/access/users/{id}`.

## neodesk panel-access user-set

Replace an account's section and feature rules.

```text quoted
neodesk panel-access user-set <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The account ID |

| Flag | What it is |
|---|---|
| `--sections JSON` | section to level, like {"settings":"none","devices":"read"} |
| `--features JSON` | client feature to on or off, like {"terminal":false} |

Needs user.edit; changes something: needs a token with read and write access. Calls `PUT /api/panel/access/users/{id}`.
