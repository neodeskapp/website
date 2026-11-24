---
title: neodesk api-tokens
description: 4 Befehle. API-Tokens für Skripte, diese Kommandozeile und KI-Agenten.
order: 4
quoted: true
---

API-Tokens für Skripte, diese Kommandozeile und KI-Agenten.

Die Befehle stehen hier auf Englisch, so wie die Kommandozeile sie mit `neodesk api-tokens --help` zeigt. Die Flags, die jeder Befehl kennt, stehen in der [Befehlsreferenz](/docs/command-line/reference#flags-for-every-command).

## neodesk api-tokens current

Show the token this command line uses, its account and what it may do now.

```text quoted
neodesk api-tokens current [flags]
```

Needs a signed-in account; only reads. Calls `GET /api/panel/api-tokens/current`.

```bash quoted
neodesk api-tokens current
```

## neodesk api-tokens list

List your API tokens: name, access, expiry, last use.

Tokens are made in the console (account menu, API tokens): a token never makes another one.

```text quoted
neodesk api-tokens list [flags]
```

| Flag | What it is |
|---|---|
| `--all` | every account's tokens (super admins) |

Needs a signed-in account; only reads. Calls `GET /api/panel/api-tokens`.

```bash quoted
neodesk api-tokens list
neodesk api-tokens list --all
```

## neodesk api-tokens permissions

List the permissions a new token of yours could get.

```text quoted
neodesk api-tokens permissions [flags]
```

Needs a signed-in account; only reads. Calls `GET /api/panel/api-tokens/permissions`.

## neodesk api-tokens revoke

Revoke an API token at once. Scripts that use it stop working.

```text quoted
neodesk api-tokens revoke <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The token's ID: the 12 characters after ndt_ (see api-tokens list) |

Needs a signed-in account; changes something: needs a token with read and write access; deletes or ends something for good, so it asks first unless --yes is given. Calls `DELETE /api/panel/api-tokens/{id}`.

```bash quoted
neodesk api-tokens revoke k3m9x2a7pq4r --yes
```
