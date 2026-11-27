---
title: neodesk api-tokens
description: 4 commands. API tokens for scripts, this command line and AI agents.
order: 4
quoted: true
icon: token
---

API tokens for scripts, this command line and AI agents.

`neodesk api-tokens --help` lists the same commands in the terminal. The flags every command takes are in the [command reference](/docs/command-line/reference#flags-for-every-command).

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

What was made with the token ends with it: guest links, device tokens, support sessions, invites, pairing codes, guest desktop links and organization invitations. The answer counts them under ended; api-tokens list shows what is still open under ends_with_it. The same happens when a token expires. The computers it let in (joined through its invites or pairing codes, or approved with it) stay; api-tokens list names them under let_in.

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
