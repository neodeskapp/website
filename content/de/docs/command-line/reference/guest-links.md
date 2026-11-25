---
title: neodesk guest-links
description: 3 Befehle. Gastlinks, mit denen sich jemand ohne Konto verbindet.
order: 27
quoted: true
---

Gastlinks, mit denen sich jemand ohne Konto verbindet.

Die Befehle stehen hier auf Englisch, so wie die Kommandozeile sie mit `neodesk guest-links --help` zeigt. Die Flags, die jeder Befehl kennt, stehen in der [Befehlsreferenz](/docs/command-line/reference#flags-for-every-command).

## neodesk guest-links create

Make a guest link that lets someone connect to devices for a while.

```text quoted
neodesk guest-links create [flags]
```

| Flag | What it is |
|---|---|
| `--peer-ids A,B` | the devices the link opens, by ID, comma separated |
| `--ttl-minutes N` | minutes the link works, at most 1440 (left out: 60) |
| `--view-only` | watch only, no control; for mesh and CDAP devices only |
| `--label LABEL` | a name for the link |
| `--max-uses N` | how many times the link may be used (left out or 0: no limit) |

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
