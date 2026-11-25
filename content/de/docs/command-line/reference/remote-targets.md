---
title: neodesk remote-targets
description: 11 Befehle. RDP-, VNC- und SSH-Ziele.
order: 41
quoted: true
---

RDP-, VNC- und SSH-Ziele.

Die Befehle stehen hier auf Englisch, so wie die Kommandozeile sie mit `neodesk remote-targets --help` zeigt. Die Flags, die jeder Befehl kennt, stehen in der [Befehlsreferenz](/docs/command-line/reference#flags-for-every-command).

## neodesk remote-targets certificate-accept

Trust a remote target's certificate.

```text quoted
neodesk remote-targets certificate-accept <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

| Flag | What it is |
|---|---|
| `--fingerprint FINGERPRINT` | SHA-256 of the target's TLS certificate, 64 hex characters without colons |

Needs remote_target.connect; changes something: needs a token with read and write access. Calls `POST /api/remote-targets/{id}/certificate/accept`.

## neodesk remote-targets create

Add an RDP, VNC or SSH target.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk remote-targets create [flags]
```

Needs remote_target.edit; changes something: needs a token with read and write access. Calls `POST /api/remote-targets`.

## neodesk remote-targets credentials

Show whether a remote target has a saved sign-in (never the password).

```text quoted
neodesk remote-targets credentials <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

Needs remote_target.view; only reads; the answer holds secrets or private content. Calls `GET /api/remote-targets/{id}/credentials`.

## neodesk remote-targets credentials-delete

Delete a remote target's saved sign-in.

```text quoted
neodesk remote-targets credentials-delete <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

Needs remote_target.edit; changes something: needs a token with read and write access; deletes or ends something for good, so it asks first unless --yes is given. Calls `DELETE /api/remote-targets/{id}/credentials`.

## neodesk remote-targets credentials-set

Save a remote target's sign-in (stored encrypted).

```text quoted
neodesk remote-targets credentials-set <id> (--password-stdin | --password PASSWORD) [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

| Flag | What it is |
|---|---|
| `--username USERNAME` | user name to sign in to the target with, at most 256 characters (empty clears it) |
| `--password-stdin` | read the password from standard input (its first line), so it stays out of the command line |
| `--password PASSWORD` | password to sign in to the target with, stored encrypted, at most 4096 characters (this or --password-stdin is required) |

Needs remote_target.edit; changes something: needs a token with read and write access. Calls `PUT /api/remote-targets/{id}/credentials`.

## neodesk remote-targets delete

Delete a remote target.

```text quoted
neodesk remote-targets delete <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

Needs remote_target.delete; changes something: needs a token with read and write access; deletes or ends something for good, so it asks first unless --yes is given. Calls `DELETE /api/remote-targets/{id}`.

## neodesk remote-targets get

Show one remote target.

```text quoted
neodesk remote-targets get <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

Needs remote_target.view; only reads. Calls `GET /api/remote-targets/{id}`.

## neodesk remote-targets list

List remote targets.

```text quoted
neodesk remote-targets list [flags]
```

Needs remote_target.view; only reads. Calls `GET /api/remote-targets`.

## neodesk remote-targets readiness

Show whether remote targets can be reached from here.

```text quoted
neodesk remote-targets readiness [flags]
```

Needs remote_target.view; only reads. Calls `GET /api/remote-targets/readiness`.

## neodesk remote-targets test

Check that an address answers, before adding it as a target.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk remote-targets test [flags]
```

Needs remote_target.test; changes something: needs a token with read and write access. Calls `POST /api/remote-targets/test`.

## neodesk remote-targets update

Change a remote target.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk remote-targets update <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

Needs remote_target.edit; changes something: needs a token with read and write access. Calls `PATCH /api/remote-targets/{id}`.
