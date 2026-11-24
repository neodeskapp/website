---
title: neodesk chat
description: 2 commands. Chat search and files.
order: 13
quoted: true
---

Chat search and files.

`neodesk chat --help` lists the same commands in the terminal. The flags every command takes are in the [command reference](/docs/command-line/reference#flags-for-every-command).

## neodesk chat file

Download a file sent in a chat (use --output).

```text quoted
neodesk chat file <fileId> [flags]
```

| Argument | What it is |
|---|---|
| `<fileId>` | The file id |

Needs chat.access; only reads; the answer holds secrets or private content. Calls `GET /api/chat/files/{fileId}`.

## neodesk chat search

Search chat messages.

```text quoted
neodesk chat search [flags]
```

Needs chat.access; only reads. Calls `GET /api/chat/search`.
