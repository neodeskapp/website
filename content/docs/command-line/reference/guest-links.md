---
title: neodesk guest-links
description: 3 commands. Guest links that let someone without an account connect.
order: 27
quoted: true
---

Guest links that let someone without an account connect.

`neodesk guest-links --help` lists the same commands in the terminal. The flags every command takes are in the [command reference](/docs/command-line/reference#flags-for-every-command).

## neodesk guest-links create

Make a guest link that lets someone connect to devices for a while.

```text quoted
neodesk guest-links create [flags]
```

| Flag | What it is |
|---|---|
| `--peer-ids PEER_IDS` |  |
| `--ttl-minutes TTL_MINUTES` |  |
| `--view-only VIEW_ONLY` |  |
| `--label LABEL` |  |
| `--max-uses N` |  |

Needs guest.create; changes something: needs a token with read and write access; the answer holds secrets or private content. Calls `POST /api/guest/access-links`.

## neodesk guest-links list

List guest links.

```text quoted
neodesk guest-links list [flags]
```

Needs guest.create; only reads. Calls `GET /api/guest/access-links`.

## neodesk guest-links revoke

Revoke a guest link.

```text quoted
neodesk guest-links revoke <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

Needs guest.create; changes something: needs a token with read and write access; deletes or ends something for good, so it asks first unless --yes is given. Calls `DELETE /api/guest/access-links/{id}`.
