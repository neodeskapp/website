---
title: neodesk cdap-studio
description: 10 commands. CDAP Studio flows.
order: 12
quoted: true
---

CDAP Studio flows.

`neodesk cdap-studio --help` lists the same commands in the terminal. The flags every command takes are in the [command reference](/docs/command-line/reference#flags-for-every-command).

## neodesk cdap-studio create

Make a flow.

```text quoted
neodesk cdap-studio create [flags]
```

| Flag | What it is |
|---|---|
| `--name NAME` |  |
| `--description DESCRIPTION` |  |
| `--flow-json FLOW_JSON` |  |

Needs the operator role, and a token with all of its account's permissions; changes something: needs a token with read and write access. Calls `POST /api/cdap-studio/flows`.

## neodesk cdap-studio delete

Delete a flow.

```text quoted
neodesk cdap-studio delete <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

Needs the operator role, and a token with all of its account's permissions; changes something: needs a token with read and write access; deletes or ends something for good, so it asks first unless --yes is given. Calls `DELETE /api/cdap-studio/flows/{id}`.

## neodesk cdap-studio deploy

Mark a flow as deployed.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk cdap-studio deploy <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

Needs the operator role, and a token with all of its account's permissions; changes something: needs a token with read and write access. Calls `POST /api/cdap-studio/flows/{id}/deploy`.

## neodesk cdap-studio export

Export a flow as a file (use --output).

```text quoted
neodesk cdap-studio export <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

Needs a signed-in account; only reads. Calls `GET /api/cdap-studio/flows/{id}/export`.

## neodesk cdap-studio get

Show one flow.

```text quoted
neodesk cdap-studio get <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

Needs a signed-in account; only reads. Calls `GET /api/cdap-studio/flows/{id}`.

## neodesk cdap-studio import

Import a flow file (give it with --data @flow.json).

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk cdap-studio import [flags]
```

Needs the operator role, and a token with all of its account's permissions; changes something: needs a token with read and write access. Calls `POST /api/cdap-studio/flows/import`.

## neodesk cdap-studio list

List flows.

```text quoted
neodesk cdap-studio list [flags]
```

Needs a signed-in account; only reads. Calls `GET /api/cdap-studio/flows`.

## neodesk cdap-studio set

Change a flow.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk cdap-studio set <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

Needs the operator role, and a token with all of its account's permissions; changes something: needs a token with read and write access. Calls `PUT /api/cdap-studio/flows/{id}`.

## neodesk cdap-studio templates

List flow templates.

```text quoted
neodesk cdap-studio templates [flags]
```

Needs a signed-in account; only reads. Calls `GET /api/cdap-studio/templates`.

## neodesk cdap-studio test

Check a flow without running it.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk cdap-studio test <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

Needs the operator role, and a token with all of its account's permissions; changes something: needs a token with read and write access. Calls `POST /api/cdap-studio/flows/{id}/test`.
