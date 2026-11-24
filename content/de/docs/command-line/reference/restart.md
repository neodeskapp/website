---
title: neodesk restart
description: 6 Befehle. Neustarts des Servers, die nach einer Änderung anstehen.
order: 44
quoted: true
---

Neustarts des Servers, die nach einer Änderung anstehen.

Die Befehle stehen hier auf Englisch, so wie die Kommandozeile sie mit `neodesk restart --help` zeigt. Die Flags, die jeder Befehl kennt, stehen in der [Befehlsreferenz](/docs/command-line/reference#flags-for-every-command).

## neodesk restart advanced

Restart after a change to an advanced settings file.

```text quoted
neodesk restart advanced [flags]
```

| Flag | What it is |
|---|---|
| `--file-id FILE_ID` | the file |

Needs server.config; changes something: needs a token with read and write access. Calls `POST /api/settings/advanced/restart`.

## neodesk restart cancel

Undo the changes waiting for a restart.

```text quoted
neodesk restart cancel [flags]
```

| Flag | What it is |
|---|---|
| `--id ID` | the restart to undo |

Needs server.config; changes something: needs a token with read and write access; deletes or ends something for good, so it asks first unless --yes is given. Calls `POST /api/settings/restart/cancel`.

## neodesk restart complete

Clear a restart that finished or failed.

```text quoted
neodesk restart complete [flags]
```

| Flag | What it is |
|---|---|
| `--id ID` | the restart |

Needs server.config; changes something: needs a token with read and write access. Calls `POST /api/settings/restart/complete`.

## neodesk restart confirm

Restart the server now to apply the waiting changes.

```text quoted
neodesk restart confirm [flags]
```

| Flag | What it is |
|---|---|
| `--id ID` | the restart to run (see restart pending) |

Needs server.config; changes something: needs a token with read and write access. Calls `POST /api/settings/restart/confirm`.

## neodesk restart pending

Show the changes waiting for a server restart.

```text quoted
neodesk restart pending [flags]
```

Needs server.config; only reads. Calls `GET /api/settings/restart/pending`.

## neodesk restart status

Show whether a restart is running and how far it got.

```text quoted
neodesk restart status [flags]
```

Needs a signed-in account; only reads. Calls `GET /api/settings/restart-status`.
