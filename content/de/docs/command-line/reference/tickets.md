---
title: neodesk tickets
description: 11 Befehle. Tickets mit Kommentaren und Anhängen.
order: 54
quoted: true
---

Tickets mit Kommentaren und Anhängen.

Die Befehle stehen hier auf Englisch, so wie die Kommandozeile sie mit `neodesk tickets --help` zeigt. Die Flags, die jeder Befehl kennt, stehen in der [Befehlsreferenz](/docs/command-line/reference#flags-for-every-command).

## neodesk tickets attach

Attach a file to a ticket.

```text quoted
neodesk tickets attach <id> --filename FILENAME --content CONTENT [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ticket number (see tickets list) |

| Flag | What it is |
|---|---|
| `--filename FILENAME` | the file name (required) |
| `--content CONTENT` | the content as base64 (required) |
| `--mimetype MIMETYPE` | its type |

Needs device.edit; changes something: needs a token with read and write access. Calls `POST /api/tickets/{id}/attachments`.

## neodesk tickets attachment

Download an attachment (use --output).

```text quoted
neodesk tickets attachment <aid> [flags]
```

| Argument | What it is |
|---|---|
| `<aid>` | The attachment ID |

Needs device.view; only reads. Calls `GET /api/tickets/attachments/{aid}`.

## neodesk tickets attachments

List a ticket's attachments.

```text quoted
neodesk tickets attachments <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ticket number (see tickets list) |

Needs device.view; only reads. Calls `GET /api/tickets/{id}/attachments`.

## neodesk tickets comment

Add a comment to a ticket.

```text quoted
neodesk tickets comment <id> --text TEXT [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ticket number (see tickets list) |

| Flag | What it is |
|---|---|
| `--text TEXT` | the comment (required) |
| `--internal` | only staff see it |

Needs device.edit; changes something: needs a token with read and write access. Calls `POST /api/tickets/{id}/comments`.

## neodesk tickets comments

List a ticket's comments.

```text quoted
neodesk tickets comments <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ticket number (see tickets list) |

Needs device.view; only reads. Calls `GET /api/tickets/{id}/comments`.

## neodesk tickets create

Open a ticket.

```text quoted
neodesk tickets create --title TITLE [flags]
```

| Flag | What it is |
|---|---|
| `--title TITLE` | the title (required) |
| `--description DESCRIPTION` | what is wrong |
| `--priority PRIORITY` | like low, medium or high |
| `--category CATEGORY` | the category |
| `--device DEVICE` | the device it is about |
| `--assigned-to ASSIGNED_TO` | the user name of who handles it |

Needs a signed-in account; changes something: needs a token with read and write access. Calls `POST /api/tickets`.

## neodesk tickets delete

Delete a ticket.

```text quoted
neodesk tickets delete <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ticket number (see tickets list) |

Needs server.config; changes something: needs a token with read and write access; deletes or ends something for good, so it asks first unless --yes is given. Calls `DELETE /api/tickets/{id}`.

## neodesk tickets get

Show a ticket.

```text quoted
neodesk tickets get <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ticket number (see tickets list) |

Needs audit.view; only reads. Calls `GET /api/tickets/{id}`.

## neodesk tickets list

List tickets. Filter with -q, like -q status=open.

```text quoted
neodesk tickets list [flags]
```

Needs a signed-in account; only reads. Calls `GET /api/tickets`.

## neodesk tickets stats

Count tickets by status and priority.

```text quoted
neodesk tickets stats [flags]
```

Needs audit.view; only reads. Calls `GET /api/tickets/stats`.

## neodesk tickets update

Change a ticket: status, priority, who handles it.

```text quoted
neodesk tickets update <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ticket number (see tickets list) |

| Flag | What it is |
|---|---|
| `--status STATUS` | the new status |
| `--priority PRIORITY` | the new priority |
| `--category CATEGORY` | the category |
| `--assigned-to ASSIGNED_TO` | the user name of who handles it |
| `--title TITLE` | new title |
| `--description DESCRIPTION` | new description |
| `--device DEVICE` | the device it is about |

Needs a signed-in account; changes something: needs a token with read and write access. Calls `PATCH /api/tickets/{id}`.
