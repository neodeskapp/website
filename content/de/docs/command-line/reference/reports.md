---
title: neodesk reports
description: 8 Befehle. Berichte und Trends.
order: 42
quoted: true
---

Berichte und Trends.

Die Befehle stehen hier auf Englisch, so wie die Kommandozeile sie mit `neodesk reports --help` zeigt. Die Flags, die jeder Befehl kennt, stehen in der [Befehlsreferenz](/docs/command-line/reference#flags-for-every-command).

## neodesk reports csv

Make a report as CSV (use --output).

```text quoted
neodesk reports csv --type TYPE [flags]
```

| Flag | What it is |
|---|---|
| `--type TYPE` | the kind (required) |
| `--from FROM` | start date |
| `--to TO` | end date |

Needs a signed-in account; changes something: needs a token with read and write access. Calls `POST /api/reports/generate/csv`.

## neodesk reports generate

Make a report.

```text quoted
neodesk reports generate --type TYPE [flags]
```

| Flag | What it is |
|---|---|
| `--type TYPE` | the kind (see reports types) (required) |
| `--from FROM` | start date, like 2026-11-01 |
| `--to TO` | end date |

Needs a signed-in account; changes something: needs a token with read and write access. Calls `POST /api/reports/generate`.

## neodesk reports save

Make a report and keep it.

```text quoted
neodesk reports save --type TYPE [flags]
```

| Flag | What it is |
|---|---|
| `--type TYPE` | the kind (required) |
| `--title TITLE` | its title |
| `--from FROM` | start date |
| `--to TO` | end date |

Needs a signed-in account; changes something: needs a token with read and write access. Calls `POST /api/reports/save`.

## neodesk reports saved

List kept reports.

```text quoted
neodesk reports saved [flags]
```

Needs a signed-in account; only reads. Calls `GET /api/reports/saved`.

## neodesk reports saved-delete

Delete a kept report.

```text quoted
neodesk reports saved-delete <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The report ID |

Needs a signed-in account; changes something: needs a token with read and write access; deletes or ends something for good, so it asks first unless --yes is given. Calls `DELETE /api/reports/saved/{id}`.

## neodesk reports saved-get

Show a kept report.

```text quoted
neodesk reports saved-get <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The report ID |

Needs a signed-in account; only reads. Calls `GET /api/reports/saved/{id}`.

## neodesk reports trends

Show trends over time: devices, sessions, alerts.

```text quoted
neodesk reports trends [flags]
```

Needs audit.view; only reads. Calls `GET /api/reports/trends`.

## neodesk reports types

List the kinds of report.

```text quoted
neodesk reports types [flags]
```

Needs a signed-in account; only reads. Calls `GET /api/reports/types`.
