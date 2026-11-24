---
title: neodesk tags
description: 3 Befehle. Tags von Geräten.
order: 52
quoted: true
---

Tags von Geräten.

Die Befehle stehen hier auf Englisch, so wie die Kommandozeile sie mit `neodesk tags --help` zeigt. Die Flags, die jeder Befehl kennt, stehen in der [Befehlsreferenz](/docs/command-line/reference#flags-for-every-command).

## neodesk tags delete

Remove a tag from every device.

```text quoted
neodesk tags delete --tag TAG [flags]
```

| Flag | What it is |
|---|---|
| `--tag TAG` | the tag (required) |

Needs a signed-in account; changes something: needs a token with read and write access; deletes or ends something for good, so it asks first unless --yes is given. Calls `POST /api/tags/delete`.

## neodesk tags list

List the tags in use, with how many devices have each.

```text quoted
neodesk tags list [flags]
```

Needs a signed-in account; only reads. Calls `GET /api/tags`.

## neodesk tags rename

Rename a tag on every device.

```text quoted
neodesk tags rename --from FROM --to TO [flags]
```

| Flag | What it is |
|---|---|
| `--from FROM` | the old tag (required) |
| `--to TO` | the new tag (required) |

Needs a signed-in account; changes something: needs a token with read and write access. Calls `POST /api/tags/rename`.
