---
title: neodesk invites
description: 7 commands. Invites that add a computer to this server.
order: 30
quoted: true
icon: add_to_queue
---

Invites that add a computer to this server.

`neodesk invites --help` lists the same commands in the terminal. The flags every command takes are in the [command reference](/docs/command-line/reference#flags-for-every-command).

## neodesk invites approve-key

Accept the new key of a computer that joined with an invite and was reinstalled.

The computer then rejoins with the same invite. Its old tokens and sessions end.

```text quoted
neodesk invites approve-key <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The device's ID |

Needs enrollment.approve; changes something: needs a token with read and write access. Calls `POST /api/onboard/devices/{id}/approve-key`.

```bash quoted
neodesk invites approve-key 123456789
```

## neodesk invites create

Make an invite: a link and a code to add a computer to this server.

```text quoted
neodesk invites create [flags]
```

| Flag | What it is |
|---|---|
| `--name NAME` | who or what it is for |
| `--folder-id N` | put the new computer into this folder |
| `--email EMAIL` | send the invite to this address |
| `--hours N` | how long it works, in hours (default 168, at most 720) |
| `--uses N` | how many computers may use it (default 1) |
| `--send-email` | mail it to --email |

Needs enrollment.approve; changes something: needs a token with read and write access. Calls `POST /api/onboard/invites`.

```bash quoted
neodesk invites create --name "Reception PC"
neodesk invites create --name Laptops --uses 5 --hours 24
```

## neodesk invites list

List the open invites to add a computer.

```text quoted
neodesk invites list [flags]
```

Needs enrollment.approve; only reads. Calls `GET /api/onboard/invites`.

## neodesk invites mail

Mail an invite. The server keeps only a hash of the code, so give the code you got when you made it.

```text quoted
neodesk invites mail <id> (--code-stdin | --code CODE) --to TO [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The invite ID (see invites list) |

| Flag | What it is |
|---|---|
| `--code-stdin` | read the code from standard input (its first line), so it stays out of the command line |
| `--code CODE` | the invite code from invites create (this or --code-stdin is required) |
| `--to TO` | the address (required) |

Needs enrollment.approve; changes something: needs a token with read and write access. Calls `POST /api/onboard/invites/{id}/mail`.

## neodesk invites revoke

Revoke an invite.

```text quoted
neodesk invites revoke <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The invite ID (see invites list) |

Needs enrollment.approve; changes something: needs a token with read and write access; deletes or ends something for good, so it asks first unless --yes is given. Calls `DELETE /api/onboard/invites/{id}`.

## neodesk invites show

Show an invite and the computers that joined with it, also once they used it up, until it would have expired.

devices are the computers that joined with the invite, with their name, folder and when they joined. refused is the last computer the invite turned away; reason key_changed means its ID is enrolled with another key, which invites approve-key accepts.

```text quoted
neodesk invites show <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The invite ID (see invites list) |

Needs enrollment.approve; only reads. Calls `GET /api/onboard/invites/{id}`.

```bash quoted
neodesk invites show 0123456789abcdef
```

## neodesk invites status

Show what invites use here: the address in their links, whether mail can be sent, and the client release.

console.base is the address the links point to: another computer must reach it, so set the console's public address when it is localhost. mail says whether invites can be mailed. release is the client release the join page offers for download.

```text quoted
neodesk invites status [flags]
```

Needs enrollment.approve or device.connect; only reads. Calls `GET /api/onboard/status`.
