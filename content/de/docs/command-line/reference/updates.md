---
title: neodesk updates
description: 16 Befehle. Updates des Servers und die Sicherungen davor.
order: 58
quoted: true
---

Updates des Servers und die Sicherungen davor.

Die Befehle stehen hier auf Englisch, so wie die Kommandozeile sie mit `neodesk updates --help` zeigt. Die Flags, die jeder Befehl kennt, stehen in der [Befehlsreferenz](/docs/command-line/reference#flags-for-every-command).

## neodesk updates backup-delete

Delete a backup taken before an update.

```text quoted
neodesk updates backup-delete <name> [flags]
```

| Argument | What it is |
|---|---|
| `<name>` | The backup's name |

Needs server.config; changes something: needs a token with read and write access; deletes or ends something for good, so it asks first unless --yes is given. Calls `DELETE /api/settings/updates/backups/{name}`.

## neodesk updates backups

List the backups taken before updates.

```text quoted
neodesk updates backups [flags]
```

Needs server.config; only reads. Calls `GET /api/settings/updates/backups`.

## neodesk updates backups-prune

Delete all but the newest update backups.

```text quoted
neodesk updates backups-prune --keep N [flags]
```

| Flag | What it is |
|---|---|
| `--keep N` | how many to keep (required) |

Needs server.config; changes something: needs a token with read and write access; deletes or ends something for good, so it asks first unless --yes is given. Calls `POST /api/settings/updates/backups/prune`.

## neodesk updates binary-rebuild

Build the server binary again from source.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk updates binary-rebuild [flags]
```

Needs server.config; changes something: needs a token with read and write access. Calls `POST /api/settings/updates/server-binary/rebuild`.

## neodesk updates binary-status

Show the state of the server binary.

```text quoted
neodesk updates binary-status [flags]
```

Needs server.config; only reads. Calls `GET /api/settings/updates/server-binary/status`.

## neodesk updates changes

Show what changed in the newer release.

```text quoted
neodesk updates changes [flags]
```

Needs server.config; only reads. Calls `GET /api/settings/updates/changes`.

## neodesk updates channel

Show the update channel: stable or development.

```text quoted
neodesk updates channel [flags]
```

Needs server.config; only reads. Calls `GET /api/settings/updates/channel`.

## neodesk updates channel-set

Choose the update channel.

```text quoted
neodesk updates channel-set --channel stable|development [flags]
```

| Flag | What it is |
|---|---|
| `--channel stable\|development` | stable or development (required) |

Needs server.config; changes something: needs a token with read and write access. Calls `POST /api/settings/updates/channel`.

## neodesk updates check

Check for a newer release.

```text quoted
neodesk updates check [flags]
```

Needs server.config; only reads. Calls `GET /api/settings/updates/check`.

## neodesk updates install

Install the newest release (a backup is made first unless told not to).

```text quoted
neodesk updates install [flags]
```

| Flag | What it is |
|---|---|
| `--backup` | make a backup first (default true) |

Needs server.config; changes something: needs a token with read and write access. Calls `POST /api/settings/updates/install`.

## neodesk updates install-go

Install the Go toolchain (for source builds).

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk updates install-go [flags]
```

Needs server.config; changes something: needs a token with read and write access. Calls `POST /api/settings/updates/install-go`.

## neodesk updates last-result

Show how the last update ended.

```text quoted
neodesk updates last-result [flags]
```

Needs server.config; only reads. Calls `GET /api/settings/updates/last-result`.

## neodesk updates preflight

Check that an update can be installed here.

```text quoted
neodesk updates preflight [flags]
```

Needs server.config; only reads. Calls `GET /api/settings/updates/preflight`.

## neodesk updates rollback

Go back to the version before an update, from its backup.

```text quoted
neodesk updates rollback --backup BACKUP [flags]
```

| Flag | What it is |
|---|---|
| `--backup BACKUP` | the backup (see updates backups) (required) |

Needs server.config; changes something: needs a token with read and write access; deletes or ends something for good, so it asks first unless --yes is given. Calls `POST /api/settings/updates/restore`.

## neodesk updates server-info

Show the running version and how it was installed.

```text quoted
neodesk updates server-info [flags]
```

Needs server.config; only reads. Calls `GET /api/settings/updates/server-info`.

## neodesk updates status

Show how far an update got.

```text quoted
neodesk updates status [flags]
```

Needs server.config; only reads. Calls `GET /api/settings/updates/install-status`.
