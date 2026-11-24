---
title: neodesk audit
description: 4 commands. The audit log and the security overview.
order: 6
quoted: true
---

The audit log and the security overview.

`neodesk audit --help` lists the same commands in the terminal. The flags every command takes are in the [command reference](/docs/command-line/reference#flags-for-every-command).

## neodesk audit events

List security events: sign-ins, refusals, changes to access.

```text quoted
neodesk audit events [flags]
```

| Flag | What it is |
|---|---|
| `--limit N` | how many, 1 to 500 |
| `--offset N` | skip this many |

Needs audit.view; only reads. Calls `GET /api/panel/security-audit/events`.

## neodesk audit hardening

Show the hardening checks of this server.

```text quoted
neodesk audit hardening [flags]
```

Needs audit.view; only reads. Calls `GET /api/panel/security-audit/hardening`.

## neodesk audit list

Show the audit log, newest first: who did what, when and from where.

The table cuts long details; --json shows them in full. Times are UTC.

```text quoted
neodesk audit list [flags]
```

| Flag | What it is |
|---|---|
| `--limit N` | how many entries, 1 to 500 (default 100) |

Needs audit.view; only reads. Calls `GET /api/settings/audit`.

```bash quoted
neodesk audit list
neodesk audit list --limit 20 --json
```

## neodesk audit overview

Show the security overview: failed sign-ins, lockouts, second factor use.

```text quoted
neodesk audit overview [flags]
```

Needs audit.view; only reads. Calls `GET /api/panel/security-audit/overview`.
