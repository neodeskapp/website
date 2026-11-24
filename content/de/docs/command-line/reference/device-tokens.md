---
title: neodesk device-tokens
description: 6 Befehle. Tokens, mit denen ein neues Gerät ohne Genehmigung beitritt.
order: 21
quoted: true
---

Tokens, mit denen ein neues Gerät ohne Genehmigung beitritt.

Die Befehle stehen hier auf Englisch, so wie die Kommandozeile sie mit `neodesk device-tokens --help` zeigt. Die Flags, die jeder Befehl kennt, stehen in der [Befehlsreferenz](/docs/command-line/reference#flags-for-every-command).

## neodesk device-tokens bind

Tie a device token to one device.

```text quoted
neodesk device-tokens bind <id> --device DEVICE [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The device token ID (see device-tokens list) |

| Flag | What it is |
|---|---|
| `--device DEVICE` | the device ID (required) |

Needs enrollment.manage; changes something: needs a token with read and write access. Calls `POST /api/panel/tokens/{id}/bind`.

## neodesk device-tokens create

Make a device token (shown once).

```text quoted
neodesk device-tokens create --name NAME [flags]
```

| Flag | What it is |
|---|---|
| `--name NAME` | what it is for (required) |
| `--max-uses N` | how many devices may use it (0: no limit) |
| `--expires-in N` | seconds it lasts (0: never) |
| `--note NOTE` | a note |

Needs enrollment.manage; changes something: needs a token with read and write access; the answer holds secrets or private content. Calls `POST /api/panel/tokens`.

## neodesk device-tokens create-many

Make several device tokens at once.

```text quoted
neodesk device-tokens create-many --count N [flags]
```

| Flag | What it is |
|---|---|
| `--count N` | how many (required) |
| `--name-prefix NAME_PREFIX` | their names start with this |
| `--max-uses N` | uses each |
| `--expires-in N` | seconds each lasts |

Needs enrollment.manage; changes something: needs a token with read and write access; the answer holds secrets or private content. Calls `POST /api/panel/tokens/generate-bulk`.

## neodesk device-tokens list

List device tokens.

```text quoted
neodesk device-tokens list [flags]
```

| Flag | What it is |
|---|---|
| `--include-revoked` | list revoked tokens too |

Needs enrollment.manage; only reads. Calls `GET /api/panel/tokens`.

## neodesk device-tokens revoke

Revoke a device token.

```text quoted
neodesk device-tokens revoke <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The device token ID (see device-tokens list) |

Needs enrollment.manage; changes something: needs a token with read and write access; deletes or ends something for good, so it asks first unless --yes is given. Calls `DELETE /api/panel/tokens/{id}`.

## neodesk device-tokens update

Change a device token.

```text quoted
neodesk device-tokens update <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The device token ID (see device-tokens list) |

| Flag | What it is |
|---|---|
| `--name NAME` | new name |
| `--max-uses N` | uses |
| `--note NOTE` | note |

Needs enrollment.manage; changes something: needs a token with read and write access. Calls `PUT /api/panel/tokens/{id}`.
