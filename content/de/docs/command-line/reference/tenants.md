---
title: neodesk tenants
description: 12 Befehle. Mandanten mit ihren Geräten und Benutzern.
order: 53
quoted: true
---

Mandanten mit ihren Geräten und Benutzern.

Die Befehle stehen hier auf Englisch, so wie die Kommandozeile sie mit `neodesk tenants --help` zeigt. Die Flags, die jeder Befehl kennt, stehen in der [Befehlsreferenz](/docs/command-line/reference#flags-for-every-command).

## neodesk tenants create

Make a tenant.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk tenants create [flags]
```

Needs a signed-in account; changes something: needs a token with read and write access. Calls `POST /api/tenants`.

## neodesk tenants delete

Delete a tenant.

```text quoted
neodesk tenants delete <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

Needs server.config; changes something: needs a token with read and write access; deletes or ends something for good, so it asks first unless --yes is given. Calls `DELETE /api/tenants/{id}`.

## neodesk tenants device-add

Add devices to a tenant.

```text quoted
neodesk tenants device-add <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

| Flag | What it is |
|---|---|
| `--device-ids A,B` | devices to add, by ID, comma separated; the server must know each |

Needs a signed-in account; changes something: needs a token with read and write access. Calls `POST /api/tenants/{id}/devices`.

## neodesk tenants device-remove

Take a device out of a tenant.

```text quoted
neodesk tenants device-remove <id> <deviceId> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |
| `<deviceId>` | The device ID |

Needs a signed-in account; changes something: needs a token with read and write access; deletes or ends something for good, so it asks first unless --yes is given. Calls `DELETE /api/tenants/{id}/devices/{deviceId}`.

## neodesk tenants devices

List a tenant's devices.

```text quoted
neodesk tenants devices <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

Needs a signed-in account; only reads. Calls `GET /api/tenants/{id}/devices`.

## neodesk tenants get

Show one tenant.

```text quoted
neodesk tenants get <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

Needs audit.view; only reads. Calls `GET /api/tenants/{id}`.

## neodesk tenants list

List tenants.

```text quoted
neodesk tenants list [flags]
```

Needs a signed-in account; only reads. Calls `GET /api/tenants`.

## neodesk tenants stats

Show a tenant's numbers.

```text quoted
neodesk tenants stats <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

Needs a signed-in account; only reads. Calls `GET /api/tenants/{id}/stats`.

## neodesk tenants update

Change a tenant.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk tenants update <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

Needs a signed-in account; changes something: needs a token with read and write access. Calls `PATCH /api/tenants/{id}`.

## neodesk tenants user-add

Add a console account to a tenant.

```text quoted
neodesk tenants user-add <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

| Flag | What it is |
|---|---|
| `--user-id N` | the account's number ID |

Needs a signed-in account; changes something: needs a token with read and write access. Calls `POST /api/tenants/{id}/users`.

## neodesk tenants user-remove

Take a console account out of a tenant.

```text quoted
neodesk tenants user-remove <id> <userId> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |
| `<userId>` | The user id |

Needs a signed-in account; changes something: needs a token with read and write access; deletes or ends something for good, so it asks first unless --yes is given. Calls `DELETE /api/tenants/{id}/users/{userId}`.

## neodesk tenants users

List a tenant's accounts.

```text quoted
neodesk tenants users <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

Needs a signed-in account; only reads. Calls `GET /api/tenants/{id}/users`.
