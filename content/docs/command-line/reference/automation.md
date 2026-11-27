---
title: neodesk automation
description: 13 commands. Alert rules, alerts, queued device commands and alert mail.
order: 7
quoted: true
icon: notifications_active
---

Alert rules, alerts, queued device commands and alert mail.

`neodesk automation --help` lists the same commands in the terminal. The flags every command takes are in the [command reference](/docs/command-line/reference#flags-for-every-command).

## neodesk automation alert-ack

Acknowledge an alert.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk automation alert-ack <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The alert ID |

Needs server.config; changes something: needs a token with read and write access. Calls `POST /api/automation/alerts/{id}/ack`.

## neodesk automation alerts

List alerts. Filter with -q, like -q severity=critical.

```text quoted
neodesk automation alerts [flags]
```

Needs server.config; only reads. Calls `GET /api/automation/alerts`.

## neodesk automation command

Show one queued device command and its result.

```text quoted
neodesk automation command <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

Needs device.connect and server.config; only reads. Calls `GET /api/automation/commands/{id}`.

## neodesk automation command-create

Queue a command for a device's agent.

```text quoted
neodesk automation command-create --device DEVICE --type TYPE [flags]
```

| Flag | What it is |
|---|---|
| `--device DEVICE` | the device ID (required) |
| `--type TYPE` | the kind of command (required) |
| `--payload JSON` | its data |

Needs device.connect and server.config; changes something: needs a token with read and write access; runs something on a device or the server. Calls `POST /api/automation/commands`.

## neodesk automation commands

List commands queued for devices.

```text quoted
neodesk automation commands [flags]
```

Needs device.connect and server.config; only reads. Calls `GET /api/automation/commands`.

## neodesk automation rule

Show one alert rule.

```text quoted
neodesk automation rule <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

Needs server.config; only reads. Calls `GET /api/automation/rules/{id}`.

## neodesk automation rule-create

Create an alert rule. Give it as --data JSON, shaped like the rules automation rules lists.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk automation rule-create [flags]
```

Needs server.config; changes something: needs a token with read and write access. Calls `POST /api/automation/rules`.

```bash quoted
neodesk automation rule-create --data @rule.json
```

## neodesk automation rule-delete

Delete an alert rule and its alerts.

```text quoted
neodesk automation rule-delete <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

Needs server.config; changes something: needs a token with read and write access; deletes or ends something for good, so it asks first unless --yes is given. Calls `DELETE /api/automation/rules/{id}`.

## neodesk automation rule-update

Change an alert rule. Give the fields to change.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk automation rule-update <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

Needs server.config; changes something: needs a token with read and write access. Calls `PATCH /api/automation/rules/{id}`.

## neodesk automation rules

List alert rules.

```text quoted
neodesk automation rules [flags]
```

Needs server.config; only reads. Calls `GET /api/automation/rules`.

## neodesk automation smtp

Show the mail settings for alerts.

```text quoted
neodesk automation smtp [flags]
```

Needs server.config; only reads. Calls `GET /api/automation/smtp`.

## neodesk automation smtp-set

Set the mail settings for alerts.

```text quoted
neodesk automation smtp-set --host HOST [flags]
```

| Flag | What it is |
|---|---|
| `--host HOST` | the mail server (required) |
| `--port N` | its port |
| `--user USER` | user name |
| `--password-stdin` | read the password from standard input (its first line), so it stays out of the command line |
| `--password PASSWORD` | password; prefer --password-stdin |
| `--from FROM` | sender |
| `--alert-email ALERT_EMAIL` | where alerts go |

Needs server.config; changes something: needs a token with read and write access. Calls `PUT /api/automation/smtp`.

## neodesk automation smtp-test

Send a test alert mail.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk automation smtp-test [flags]
```

Needs server.config; changes something: needs a token with read and write access. Calls `POST /api/automation/smtp/test`.
