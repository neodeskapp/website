---
title: neodesk enrollment
description: 7 Befehle. Wer beitreten darf, und Geräte, die auf ihre Genehmigung warten.
order: 23
quoted: true
---

Wer beitreten darf, und Geräte, die auf ihre Genehmigung warten.

Die Befehle stehen hier auf Englisch, so wie die Kommandozeile sie mit `neodesk enrollment --help` zeigt. Die Flags, die jeder Befehl kennt, stehen in der [Befehlsreferenz](/docs/command-line/reference#flags-for-every-command).

## neodesk enrollment approve

Approve a waiting device.

```text quoted
neodesk enrollment approve <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The device ID (see devices list) |

| Flag | What it is |
|---|---|
| `--name NAME` | its display name |
| `--folder-id N` | put it into this folder |
| `--tags A,B` | its tags |

Needs enrollment.approve; changes something: needs a token with read and write access. Calls `POST /api/enrollment/approve/{id}`.

## neodesk enrollment history

List approved and rejected devices.

```text quoted
neodesk enrollment history [flags]
```

Needs enrollment.approve; only reads. Calls `GET /api/enrollment/history`.

## neodesk enrollment mode

Show the enrollment mode: open, managed or locked.

```text quoted
neodesk enrollment mode [flags]
```

Needs enrollment.manage; only reads. Calls `GET /api/panel/enrollment/mode`.

## neodesk enrollment mode-set

Set the enrollment mode.

```text quoted
neodesk enrollment mode-set --mode open|managed|locked [flags]
```

| Flag | What it is |
|---|---|
| `--mode open\|managed\|locked` | open, managed or locked (required) |

Needs enrollment.manage; changes something: needs a token with read and write access. Calls `PUT /api/panel/enrollment/mode`.

## neodesk enrollment pending

List devices waiting for approval.

```text quoted
neodesk enrollment pending [flags]
```

Needs enrollment.approve; only reads. Calls `GET /api/enrollment/pending`.

## neodesk enrollment reject

Reject a waiting device.

```text quoted
neodesk enrollment reject <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The device ID (see devices list) |

| Flag | What it is |
|---|---|
| `--ban` | also ban it |

Needs enrollment.approve; changes something: needs a token with read and write access; deletes or ends something for good, so it asks first unless --yes is given. Calls `POST /api/enrollment/reject/{id}`.

## neodesk enrollment unreject

Let a rejected device ask again.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk enrollment unreject <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The device ID (see devices list) |

Needs enrollment.approve; changes something: needs a token with read and write access; deletes or ends something for good, so it asks first unless --yes is given. Calls `POST /api/enrollment/clear-rejection/{id}`.
