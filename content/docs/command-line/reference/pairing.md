---
title: neodesk pairing
description: 5 commands. Pairing codes for agents.
order: 36
quoted: true
icon: password
---

Pairing codes for agents.

`neodesk pairing --help` lists the same commands in the terminal. The flags every command takes are in the [command reference](/docs/command-line/reference#flags-for-every-command).

## neodesk pairing activate

Approve a waiting agent under a name.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk pairing activate [flags]
```

Needs enrollment.approve; changes something: needs a token with read and write access. Calls `POST /api/agent-pairing/activate`.

## neodesk pairing create

Make a pairing code.

```text quoted
neodesk pairing create [flags]
```

| Flag | What it is |
|---|---|
| `--label LABEL` | what it is for, at most 64 characters |

Needs enrollment.approve; changes something: needs a token with read and write access. Calls `POST /api/panel/pairing/codes`.

## neodesk pairing delete

Delete a pairing code.

```text quoted
neodesk pairing delete <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The code ID |

Needs enrollment.approve; changes something: needs a token with read and write access; deletes or ends something for good, so it asks first unless --yes is given. Calls `DELETE /api/panel/pairing/codes/{id}`.

## neodesk pairing host

Show the address agents pair with.

```text quoted
neodesk pairing host [flags]
```

Needs enrollment.approve; only reads. Calls `GET /api/panel/pairing/host`.

## neodesk pairing list

List pairing codes for agents.

```text quoted
neodesk pairing list [flags]
```

Needs enrollment.approve; only reads. Calls `GET /api/panel/pairing/codes`.
