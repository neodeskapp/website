---
title: neodesk account
description: 3 Befehle. Du selbst: das Konto und die Berechtigungen, mit denen das Token handelt.
order: 1
quoted: true
---

Du selbst: das Konto und die Berechtigungen, mit denen das Token handelt.

Die Befehle stehen hier auf Englisch, so wie die Kommandozeile sie mit `neodesk account --help` zeigt. Die Flags, die jeder Befehl kennt, stehen in der [Befehlsreferenz](/docs/command-line/reference#flags-for-every-command).

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
