---
title: neodesk client-branding
description: 2 commands. Name, logo and links the desktop clients show.
order: 14
quoted: true
---

Name, logo and links the desktop clients show.

`neodesk client-branding --help` lists the same commands in the terminal. The flags every command takes are in the [command reference](/docs/command-line/reference#flags-for-every-command).

## neodesk client-branding set

Change the name, logo and links the desktop clients show.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk client-branding set [flags]
```

Needs branding.edit; changes something: needs a token with read and write access. Calls `POST /api/client-branding`.

## neodesk client-branding show

Show the name, logo and links the desktop clients show.

```text quoted
neodesk client-branding show [flags]
```

Needs branding.edit; only reads. Calls `GET /api/client-branding`.
