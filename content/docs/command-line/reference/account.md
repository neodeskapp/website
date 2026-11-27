---
title: neodesk account
description: 3 commands. You: the account and permissions the token acts with.
order: 1
quoted: true
icon: person
---

You: the account and permissions the token acts with.

`neodesk account --help` lists the same commands in the terminal. The flags every command takes are in the [command reference](/docs/command-line/reference#flags-for-every-command).

## neodesk account access

Show the console sections and client features the account may use.

```text quoted
neodesk account access [flags]
```

Needs a signed-in account; only reads. Calls `GET /api/panel/access/effective`.

## neodesk account profile

Show the account's own profile: name, email, phone.

```text quoted
neodesk account profile [flags]
```

Needs a signed-in account; only reads. Calls `GET /api/users/me/profile`.

## neodesk account verify

Check that the token works and show the account it signs in as.

```text quoted
neodesk account verify [flags]
```

Needs a signed-in account; only reads. Calls `GET /api/auth/verify`.

```bash quoted
neodesk account verify
```
