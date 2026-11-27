---
title: neodesk strategies
description: 7 commands. Strategies: settings pushed to desktop clients.
order: 51
quoted: true
icon: strategy
---

Strategies: settings pushed to desktop clients.

`neodesk strategies --help` lists the same commands in the terminal. The flags every command takes are in the [command reference](/docs/command-line/reference#flags-for-every-command).

## neodesk strategies assign

Give a strategy to devices, accounts or device groups.

```text quoted
neodesk strategies assign <guid> [flags]
```

| Argument | What it is |
|---|---|
| `<guid>` | The group's GUID |

| Flag | What it is |
|---|---|
| `--peers A,B` | devices to give the strategy, by ID, comma separated |
| `--users A,B` | accounts to give the strategy, by user name, comma separated |
| `--groups A,B` | device groups to give the strategy, by name, comma separated |

Needs device.edit; changes something: needs a token with read and write access. Calls `POST /api/panel/strategies/{guid}/assign`.

## neodesk strategies create

Make a strategy: settings pushed to desktop clients.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk strategies create [flags]
```

Needs device.edit; changes something: needs a token with read and write access. Calls `POST /api/panel/strategies`.

## neodesk strategies delete

Delete a strategy and its assignments.

```text quoted
neodesk strategies delete <guid> [flags]
```

| Argument | What it is |
|---|---|
| `<guid>` | The group's GUID |

Needs device.edit; changes something: needs a token with read and write access; deletes or ends something for good, so it asks first unless --yes is given. Calls `DELETE /api/panel/strategies/{guid}`.

## neodesk strategies get

Show one strategy with whom it is given to.

```text quoted
neodesk strategies get <guid> [flags]
```

| Argument | What it is |
|---|---|
| `<guid>` | The group's GUID |

Needs device.view; only reads. Calls `GET /api/panel/strategies/{guid}`.

## neodesk strategies list

List strategies.

```text quoted
neodesk strategies list [flags]
```

Needs device.view; only reads. Calls `GET /api/panel/strategies`.

## neodesk strategies unassign

Take strategies away from devices, accounts or device groups.

```text quoted
neodesk strategies unassign [flags]
```

| Flag | What it is |
|---|---|
| `--peers A,B` | devices to take their strategy from, by ID, comma separated |
| `--users A,B` | accounts to take their strategy from, by user name, comma separated |
| `--groups A,B` | device groups to take their strategy from, by name, comma separated |

Needs device.edit; changes something: needs a token with read and write access. Calls `POST /api/panel/strategies/unassign`.

## neodesk strategies update

Change a strategy.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk strategies update <guid> [flags]
```

| Argument | What it is |
|---|---|
| `<guid>` | The group's GUID |

Needs device.edit; changes something: needs a token with read and write access. Calls `PATCH /api/panel/strategies/{guid}`.
