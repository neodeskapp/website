---
title: neodesk support
description: 7 commands. Quick support sessions.
order: 51
quoted: true
---

Quick support sessions.

`neodesk support --help` lists the same commands in the terminal. The flags every command takes are in the [command reference](/docs/command-line/reference#flags-for-every-command).

## neodesk support create

Start a quick support session: a code the customer types in.

```text quoted
neodesk support create [flags]
```

| Flag | What it is |
|---|---|
| `--name NAME` | the customer |
| `--email EMAIL` | mail the link to this address |
| `--send-email` | mail it |

Needs a signed-in account; changes something: needs a token with read and write access. Calls `POST /api/support/sessions`.

## neodesk support device-password

Get a one-time password for a device joined through support.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk support device-password <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The device ID (see devices list) |

Needs a signed-in account; changes something: needs a token with read and write access; the answer holds secrets or private content. Calls `POST /api/support/devices/{id}/password`.

## neodesk support end

End a quick support session.

```text quoted
neodesk support end <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The session ID (see support list) |

Needs a signed-in account; changes something: needs a token with read and write access; deletes or ends something for good, so it asks first unless --yes is given. Calls `DELETE /api/support/sessions/{id}`.

## neodesk support get

Show a quick support session.

```text quoted
neodesk support get <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The session ID (see support list) |

Needs a signed-in account; only reads. Calls `GET /api/support/sessions/{id}`.

## neodesk support list

List quick support sessions.

```text quoted
neodesk support list [flags]
```

Needs a signed-in account; only reads. Calls `GET /api/support/sessions`.

## neodesk support mail

Mail the session link. Give the code you got from support create.

```text quoted
neodesk support mail <id> (--code-stdin | --code CODE) --to TO [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The session ID (see support list) |

| Flag | What it is |
|---|---|
| `--code-stdin` | read the code from standard input (its first line), so it stays out of the command line |
| `--code CODE` | the support code (this or --code-stdin is required) |
| `--to TO` | the address (required) |

Needs a signed-in account; changes something: needs a token with read and write access. Calls `POST /api/support/sessions/{id}/mail`.

## neodesk support password

Take the one-time password of an allowed session.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk support password <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The session ID (see support list) |

Needs a signed-in account; changes something: needs a token with read and write access; the answer holds secrets or private content. Calls `POST /api/support/sessions/{id}/password`.
