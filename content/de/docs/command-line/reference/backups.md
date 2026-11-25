---
title: neodesk backups
description: 10 Befehle. Vollständige Sicherungen, der Sicherungsplan und Wiederherstellungen.
order: 8
quoted: true
---

Vollständige Sicherungen, der Sicherungsplan und Wiederherstellungen.

Die Befehle stehen hier auf Englisch, so wie die Kommandozeile sie mit `neodesk backups --help` zeigt. Die Flags, die jeder Befehl kennt, stehen in der [Befehlsreferenz](/docs/command-line/reference#flags-for-every-command).

## neodesk backups destination-test

Check that the backup destination can be written.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk backups destination-test [flags]
```

Needs server.config; changes something: needs a token with read and write access. Calls `POST /api/settings/backup/destination/test`.

## neodesk backups download

Download a full backup of the server (use --output). It holds the password hashes and the API key: keep it safe.

The archive holds the databases with the accounts, their password hashes and the settings, the console's API key and the server's public key. API tokens can download it only when they carry all of their account's permissions and may write.

```text quoted
neodesk backups download [flags]
```

Needs server.config; only reads; the answer holds secrets or private content. Calls `GET /api/settings/backup`.

```bash quoted
neodesk backups download --output neodesk-backup.tar.gz
```

## neodesk backups restore

Restore a backup file. Replaces the current data.

```text quoted
neodesk backups restore --file PATH [flags]
```

| Flag | What it is |
|---|---|
| `--file PATH` | the file to upload |

Needs server.config; changes something: needs a token with read and write access; deletes or ends something for good, so it asks first unless --yes is given. Calls `POST /api/settings/restore`.

```bash quoted
neodesk backups restore --file neodesk-backup.tar.gz --yes
```

## neodesk backups retention

Show how many update backups are kept.

```text quoted
neodesk backups retention [flags]
```

Needs server.config; only reads. Calls `GET /api/settings/backup/retention`.

## neodesk backups retention-set

Set how many update backups are kept (0 keeps all).

```text quoted
neodesk backups retention-set --keep N [flags]
```

| Flag | What it is |
|---|---|
| `--keep N` | how many, 0 to 1000 (required) |

Needs server.config; changes something: needs a token with read and write access. Calls `PUT /api/settings/backup/retention`.

## neodesk backups run

Make a backup now, to the scheduled destination.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk backups run [flags]
```

Needs server.config; changes something: needs a token with read and write access. Calls `POST /api/settings/backup/schedule/run`.

```bash quoted
neodesk backups run
neodesk backups schedule-status
```

## neodesk backups schedule

Show the backup schedule and destination.

```text quoted
neodesk backups schedule [flags]
```

Needs server.config; only reads. Calls `GET /api/settings/backup/schedule`.

## neodesk backups schedule-set

Set the backup schedule and destination.

```text quoted
neodesk backups schedule-set [flags]
```

| Flag | What it is |
|---|---|
| `--enabled` | turn scheduled backups on or off |
| `--interval-hours N` | hours between backups, like 24 |
| `--destination-type DESTINATION_TYPE` | where backups go, like local |
| `--destination-path DESTINATION_PATH` | the folder to write backups to |
| `--keep N` | how many backups to keep |

Needs server.config; changes something: needs a token with read and write access. Calls `PUT /api/settings/backup/schedule`.

## neodesk backups schedule-status

Show the last and next scheduled backup.

```text quoted
neodesk backups schedule-status [flags]
```

Needs server.config; only reads. Calls `GET /api/settings/backup/schedule/status`.

## neodesk backups stats

Show what a full backup would hold and how big it is.

```text quoted
neodesk backups stats [flags]
```

Needs server.config; only reads. Calls `GET /api/settings/backup/stats`.
