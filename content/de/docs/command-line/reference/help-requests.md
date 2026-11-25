---
title: neodesk help-requests
description: 3 Befehle. Hilfeanfragen, die von Geräten kommen.
order: 28
quoted: true
---

Hilfeanfragen, die von Geräten kommen.

Die Befehle stehen hier auf Englisch, so wie die Kommandozeile sie mit `neodesk help-requests --help` zeigt. Die Flags, die jeder Befehl kennt, stehen in der [Befehlsreferenz](/docs/command-line/reference#flags-for-every-command).

## neodesk help-requests accept

Take a help request.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk help-requests accept <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

Needs chat.support; changes something: needs a token with read and write access. Calls `POST /api/help/requests/{id}/accept`.

## neodesk help-requests list

List help requests.

```text quoted
neodesk help-requests list [flags]
```

Needs chat.support; only reads. Calls `GET /api/help/requests`.

## neodesk help-requests resolve

Close a help request as solved.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk help-requests resolve <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

Needs chat.support; changes something: needs a token with read and write access. Calls `POST /api/help/requests/{id}/resolve`.
