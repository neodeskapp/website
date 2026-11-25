---
title: neodesk setup-guide
description: 3 commands. The setup guide a new install shows its first admin on the overview.
order: 50
quoted: true
---

The setup guide a new install shows its first admin on the overview.

`neodesk setup-guide --help` lists the same commands in the terminal. The flags every command takes are in the [command reference](/docs/command-line/reference#flags-for-every-command).

## neodesk setup-guide hide

Hide the setup guide on the overview for your account.

setup-guide show brings it back. The answer is the guide's status, as setup-guide status shows it.

```text quoted
neodesk setup-guide hide [flags]
```

Needs server.config; changes something: needs a token with read and write access. Calls `POST /api/setup-guide/hide`.

```bash quoted
neodesk setup-guide hide
```

## neodesk setup-guide show

Show the setup guide on the overview for your account again.

The answer is the guide's status, as setup-guide status shows it.

```text quoted
neodesk setup-guide show [flags]
```

Needs server.config; changes something: needs a token with read and write access. Calls `POST /api/setup-guide/show`.

```bash quoted
neodesk setup-guide show
```

## neodesk setup-guide status

Show the setup guide's steps and which of them the server sees done.

visible says whether the overview shows the guide to your account. A step is done when the server sees it done, not when someone ticks it, and an account gets only the steps it may do itself.

```text quoted
neodesk setup-guide status [flags]
```

Needs server.config; only reads. Calls `GET /api/setup-guide`.

```bash quoted
neodesk setup-guide status
neodesk setup-guide status --json
```
