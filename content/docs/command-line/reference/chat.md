---
title: neodesk chat
description: 23 commands. Chat search and files.
order: 13
quoted: true
icon: chat
---

Chat search and files.

`neodesk chat --help` lists the same commands in the terminal. The flags every command takes are in the [command reference](/docs/command-line/reference#flags-for-every-command).

## neodesk chat assign

Give a support conversation to a colleague (-F account_id=N, 0 for nobody); needs chat.assign too.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk chat assign <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The conversation id: a device id, dm:&lt;id>:&lt;id> or group:&lt;id> |

Needs chat.support; changes something: needs a token with read and write access. Calls `POST /api/chat/conversations/{id}/assign`.

## neodesk chat canned

List the shared canned replies and your own.

```text quoted
neodesk chat canned [flags]
```

Needs chat.support or chat.team; only reads. Calls `GET /api/chat/canned`.

## neodesk chat canned-add

Add a canned reply (-f title=..., -f body=..., -F shared=true needs chat.canned_manage).

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk chat canned-add [flags]
```

Needs chat.support or chat.team; changes something: needs a token with read and write access. Calls `POST /api/chat/canned`.

## neodesk chat canned-remove

Delete a canned reply.

```text quoted
neodesk chat canned-remove <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The reply's ID |

Needs chat.support or chat.team; changes something: needs a token with read and write access. Calls `DELETE /api/chat/canned/{id}`.

## neodesk chat canned-set

Change a canned reply.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk chat canned-set <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The reply's ID |

Needs chat.support or chat.team; changes something: needs a token with read and write access. Calls `PATCH /api/chat/canned/{id}`.

## neodesk chat close

Close a support conversation (-f note=..., -F resolve_help_request=true).

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk chat close <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The conversation id: a device id, dm:&lt;id>:&lt;id> or group:&lt;id> |

Needs chat.support; changes something: needs a token with read and write access. Calls `POST /api/chat/conversations/{id}/close`.

## neodesk chat conversation

Show a conversation with its computer or its people.

```text quoted
neodesk chat conversation <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The conversation id: a device id, dm:&lt;id>:&lt;id> or group:&lt;id> |

Needs chat.support or chat.team; only reads. Calls `GET /api/chat/conversations/{id}`.

## neodesk chat devices

Find computers to start a support conversation with (-f q=name, ID, host name, owner or folder).

```text quoted
neodesk chat devices [flags]
```

Needs chat.support; only reads. Calls `GET /api/chat/devices`.

## neodesk chat direct

Open the direct conversation with a colleague (-F account_id=N).

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk chat direct [flags]
```

Needs chat.team; changes something: needs a token with read and write access. Calls `POST /api/chat/team/direct`.

## neodesk chat file

Download a file sent in a chat (use --output).

```text quoted
neodesk chat file <fileId> [flags]
```

| Argument | What it is |
|---|---|
| `<fileId>` | The file id |

Needs chat.support or chat.team; only reads; the answer holds secrets or private content. Calls `GET /api/chat/files/{fileId}`.

## neodesk chat group-add

Make a group of colleagues (-f title=..., -F members='[2,3]').

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk chat group-add [flags]
```

Needs chat.team; changes something: needs a token with read and write access. Calls `POST /api/chat/team/groups`.

## neodesk chat group-set

Rename a group or change its members.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk chat group-set <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The conversation id: a device id, dm:&lt;id>:&lt;id> or group:&lt;id> |

Needs chat.team; changes something: needs a token with read and write access. Calls `PATCH /api/chat/team/groups/{id}`.

## neodesk chat inbox

List support conversations: open (the default), mine or closed (-f filter=...), optionally matching -f q=...

```text quoted
neodesk chat inbox [flags]
```

Needs chat.support; only reads. Calls `GET /api/chat/inbox`.

## neodesk chat link

Link a support conversation to a ticket or help request (-F ticket_id=N, -F help_request_id=N).

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk chat link <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The conversation id: a device id, dm:&lt;id>:&lt;id> or group:&lt;id> |

Needs chat.support; changes something: needs a token with read and write access. Calls `POST /api/chat/conversations/{id}/link`.

## neodesk chat notifications

Show your chat notifications (browser, sound, mail).

```text quoted
neodesk chat notifications [flags]
```

Needs chat.support or chat.team; only reads. Calls `GET /api/chat/me`.

## neodesk chat notifications-set

Change your chat notifications (-F browser=true -F sound=false -F mail=true).

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk chat notifications-set [flags]
```

Needs chat.support or chat.team; changes something: needs a token with read and write access. Calls `PUT /api/chat/me`.

## neodesk chat reopen

Open a closed support conversation again.

```text quoted
neodesk chat reopen <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The conversation id: a device id, dm:&lt;id>:&lt;id> or group:&lt;id> |

Needs chat.support; changes something: needs a token with read and write access. Calls `POST /api/chat/conversations/{id}/reopen`.

## neodesk chat search

Find messages by their text in the conversations you read (-f q=text, two characters at least; -f section=support or team; -f conversation_id=...).

```text quoted
neodesk chat search [flags]
```

Needs chat.support or chat.team; only reads. Calls `GET /api/chat/search`.

## neodesk chat settings

Show when the chat mails about a waiting person, whether the mail quotes it, and whether computers may open the chat.

```text quoted
neodesk chat settings [flags]
```

Needs chat.support or chat.team; only reads. Calls `GET /api/chat/settings`.

## neodesk chat settings-set

Change the chat's mail (-F mail_after_minutes=15, 0 is off; -F mail_preview=false) and chat with computers (-F computers=false turns it off; left out keeps it).

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk chat settings-set [flags]
```

Needs server.config; changes something: needs a token with read and write access. Calls `PUT /api/chat/settings`.

## neodesk chat summary

Count unread support and team messages.

```text quoted
neodesk chat summary [flags]
```

Needs chat.support or chat.team; only reads. Calls `GET /api/chat/summary`.

## neodesk chat team

List your direct and group conversations and the colleagues you can write to.

```text quoted
neodesk chat team [flags]
```

Needs chat.team; only reads. Calls `GET /api/chat/team`.

## neodesk chat trail

Show the earlier texts of an edited or deleted chat message.

```text quoted
neodesk chat trail <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The message ID |

Needs audit.view; only reads. Calls `GET /api/chat/messages/{id}/trail`.
