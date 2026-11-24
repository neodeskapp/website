---
title: neodesk chat
description: 2 Befehle. Chat-Suche und Dateien.
order: 13
quoted: true
---

Chat-Suche und Dateien.

Die Befehle stehen hier auf Englisch, so wie die Kommandozeile sie mit `neodesk chat --help` zeigt. Die Flags, die jeder Befehl kennt, stehen in der [Befehlsreferenz](/docs/command-line/reference#flags-for-every-command).

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
