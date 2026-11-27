---
title: neodesk dataguard
description: 7 commands. Data guard policies and the events devices report.
order: 17
quoted: true
icon: encrypted
---

Data guard policies and the events devices report.

`neodesk dataguard --help` lists the same commands in the terminal. The flags every command takes are in the [command reference](/docs/command-line/reference#flags-for-every-command).

## neodesk dataguard create

Make a data guard policy.

```text quoted
neodesk dataguard create [flags]
```

| Flag | What it is |
|---|---|
| `--name NAME` | policy name |
| `--description DESCRIPTION` | what the policy is for |
| `--policy-type POLICY_TYPE` | what the policy covers: usb, file_type, clipboard, screen_share or file_transfer |
| `--action ACTION` | what happens on a match: block, log or allow (left out: log) |
| `--scope SCOPE` | device IDs it applies to, comma separated; empty or all for every device |
| `--enabled` | turn the policy on or off (left out: on) |
| `--rules JSON` | conditions the device checks, a JSON array like [{"key":"file_ext","value":".exe,.bat"}] (left out: none) |

Needs server.config; changes something: needs a token with read and write access. Calls `POST /api/dataguard/policies`.

## neodesk dataguard delete

Delete a data guard policy.

```text quoted
neodesk dataguard delete <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

Needs server.config; changes something: needs a token with read and write access; deletes or ends something for good, so it asks first unless --yes is given. Calls `DELETE /api/dataguard/policies/{id}`.

## neodesk dataguard events

List the events devices reported, newest first.

```text quoted
neodesk dataguard events [flags]
```

Needs audit.view; only reads. Calls `GET /api/dataguard/events`.

## neodesk dataguard get

Show one data guard policy.

```text quoted
neodesk dataguard get <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

Needs device.view; only reads. Calls `GET /api/dataguard/policies/{id}`.

## neodesk dataguard list

List data guard policies.

```text quoted
neodesk dataguard list [flags]
```

Needs device.view; only reads. Calls `GET /api/dataguard/policies`.

## neodesk dataguard stats

Count events by kind.

```text quoted
neodesk dataguard stats [flags]
```

Needs audit.view; only reads. Calls `GET /api/dataguard/stats`.

## neodesk dataguard update

Change a data guard policy.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk dataguard update <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

Needs server.config; changes something: needs a token with read and write access. Calls `PATCH /api/dataguard/policies/{id}`.
