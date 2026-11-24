---
title: neodesk panel-access
description: 5 Befehle. Welche Bereiche der Konsole und Funktionen der Clients jedes Konto nutzen darf.
order: 37
quoted: true
---

Welche Bereiche der Konsole und Funktionen der Clients jedes Konto nutzen darf.

Die Befehle stehen hier auf Englisch, so wie die Kommandozeile sie mit `neodesk panel-access --help` zeigt. Die Flags, die jeder Befehl kennt, stehen in der [Befehlsreferenz](/docs/command-line/reference#flags-for-every-command).

## neodesk panel-access catalog

List the console sections and client features access rules can name.

```text quoted
neodesk panel-access catalog [flags]
```

Needs a signed-in account; only reads. Calls `GET /api/panel/access/catalog`.

## neodesk panel-access group

Show a user group's section and feature rules.

```text quoted
neodesk panel-access group <guid> [flags]
```

| Argument | What it is |
|---|---|
| `<guid>` | The user group's GUID |

Needs a signed-in account; only reads. Calls `GET /api/panel/access/groups/{guid}`.

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

Needs a signed-in account; changes something: needs a token with read and write access. Calls `PUT /api/panel/access/groups/{guid}`.

## neodesk panel-access user

Show an account's own section and feature rules.

```text quoted
neodesk panel-access user <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The account ID |

Needs a signed-in account; only reads. Calls `GET /api/panel/access/users/{id}`.

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

Needs a signed-in account; changes something: needs a token with read and write access. Calls `PUT /api/panel/access/users/{id}`.
