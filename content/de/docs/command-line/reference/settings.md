---
title: neodesk settings
description: 28 Befehle. Einstellungen des Servers: Mail, Anmeldung, Adressen, Registrierung, Sitzungen.
order: 48
quoted: true
---

Einstellungen des Servers: Mail, Anmeldung, Adressen, Registrierung, Sitzungen.

Die Befehle stehen hier auf Englisch, so wie die Kommandozeile sie mit `neodesk settings --help` zeigt. Die Flags, die jeder Befehl kennt, stehen in der [Befehlsreferenz](/docs/command-line/reference#flags-for-every-command).

## neodesk settings addresses

Show the public addresses clients are given.

```text quoted
neodesk settings addresses [flags]
```

Needs server.config; only reads. Calls `GET /api/settings/public-endpoints`.

## neodesk settings addresses-set

Set the public addresses clients are given.

```text quoted
neodesk settings addresses-set [flags]
```

| Flag | What it is |
|---|---|
| `--id-server ID_SERVER` | the ID server, like desk.example.com |
| `--relay RELAY` | the relay server |
| `--api-url API_URL` | the API address |

Needs server.config; changes something: needs a token with read and write access. Calls `PUT /api/settings/public-endpoints`.

## neodesk settings availability-history

Show whether online history is kept and for how long.

```text quoted
neodesk settings availability-history [flags]
```

Needs server.config; only reads. Calls `GET /api/settings/availability-history`.

## neodesk settings availability-history-set

Set whether online history is kept and for how long.

Every call sets both values: without --enabled the history is switched off, and without --days it is kept 30 days.

```text quoted
neodesk settings availability-history-set [flags]
```

| Flag | What it is |
|---|---|
| `--enabled` | keep it (leave out to switch it off) |
| `--days N` | how many days, 1 to 3650 (default 30) |

Needs server.config; changes something: needs a token with read and write access. Calls `POST /api/settings/availability-history`.

```bash quoted
neodesk settings availability-history-set --enabled --days 90
```

## neodesk settings capabilities

Show what this install lets the console change.

```text quoted
neodesk settings capabilities [flags]
```

Needs server.config; only reads. Calls `GET /api/settings/management/capabilities`.

## neodesk settings client-sessions

Show how long desktop client sign-ins last.

```text quoted
neodesk settings client-sessions [flags]
```

Needs server.config; only reads. Calls `GET /api/settings/client-sessions`.

## neodesk settings client-sessions-set

Set how long desktop client sign-ins last.

```text quoted
neodesk settings client-sessions-set [flags]
```

| Flag | What it is |
|---|---|
| `--expiry-days N` | days a sign-in lasts |
| `--sliding` | each use extends it |
| `--max-days N` | longest in any case |

Needs server.config; changes something: needs a token with read and write access. Calls `PUT /api/settings/client-sessions`.

## neodesk settings connection-mode

Show how clients connect: peer to peer or through the relay.

```text quoted
neodesk settings connection-mode [flags]
```

Needs server.config; only reads. Calls `GET /api/settings/connection-mode`.

## neodesk settings connection-mode-restart

Restart to apply a new connection mode.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk settings connection-mode-restart [flags]
```

Needs server.config; changes something: needs a token with read and write access. Calls `POST /api/settings/connection-mode/restart`.

## neodesk settings connection-mode-set

Set how clients connect (may need a restart).

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk settings connection-mode-set [flags]
```

Needs server.config; changes something: needs a token with read and write access. Calls `PUT /api/settings/connection-mode`.

## neodesk settings device-scope

Show whether new accounts see every device or only those given to them.

```text quoted
neodesk settings device-scope [flags]
```

Needs server.config; only reads. Calls `GET /api/settings/device-scope`.

## neodesk settings device-scope-set

Set whether new accounts see every device.

```text quoted
neodesk settings device-scope-set --mode open|restricted [flags]
```

| Flag | What it is |
|---|---|
| `--mode open\|restricted` | open (every device) or restricted (only given ones) (required) |

Needs server.config; changes something: needs a token with read and write access. Calls `POST /api/settings/device-scope`.

## neodesk settings enrollment

Show how new devices join: open, managed or locked.

```text quoted
neodesk settings enrollment [flags]
```

Needs server.config; only reads. Calls `GET /api/settings/enrollment`.

## neodesk settings enrollment-set

Set how new devices join.

```text quoted
neodesk settings enrollment-set [flags]
```

| Flag | What it is |
|---|---|
| `--mode open\|managed\|locked` | open, managed or locked |

Needs enrollment.manage; changes something: needs a token with read and write access. Calls `PUT /api/settings/enrollment`.

## neodesk settings file

Show an advanced settings file.

```text quoted
neodesk settings file <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The file (see settings files) |

Needs server.config; only reads; the answer holds secrets or private content. Calls `GET /api/settings/advanced/files/{id}`.

## neodesk settings file-set

Replace an advanced settings file (may need a restart).

```text quoted
neodesk settings file-set <id> --content CONTENT [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The file |

| Flag | What it is |
|---|---|
| `--content CONTENT` | the new content (required) |

Needs server.config; changes something: needs a token with read and write access; runs something on a device or the server. Calls `PUT /api/settings/advanced/files/{id}`.

## neodesk settings files

List the advanced settings files.

```text quoted
neodesk settings files [flags]
```

Needs server.config; only reads. Calls `GET /api/settings/advanced/files`.

## neodesk settings ldap

Show the LDAP sign-in settings.

```text quoted
neodesk settings ldap [flags]
```

Needs server.config; only reads. Calls `GET /api/settings/ldap`.

## neodesk settings ldap-set

Set the LDAP sign-in settings (give them as --data JSON).

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk settings ldap-set [flags]
```

Needs server.config; changes something: needs a token with read and write access. Calls `PUT /api/settings/ldap`.

```bash quoted
neodesk settings ldap-set --data @ldap.json
```

## neodesk settings ldap-test

Test the LDAP settings.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk settings ldap-test [flags]
```

Needs server.config; changes something: needs a token with read and write access. Calls `POST /api/settings/ldap/test`.

## neodesk settings oidc

Show the single sign-on (OIDC) settings.

```text quoted
neodesk settings oidc [flags]
```

Needs server.config; only reads. Calls `GET /api/settings/oidc`.

## neodesk settings oidc-set

Set the single sign-on (OIDC) settings (give them as --data JSON).

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk settings oidc-set [flags]
```

Needs server.config; changes something: needs a token with read and write access. Calls `PUT /api/settings/oidc`.

## neodesk settings oidc-test

Test the single sign-on provider's address.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk settings oidc-test [flags]
```

Needs server.config; changes something: needs a token with read and write access. Calls `POST /api/settings/oidc/test`.

## neodesk settings server-config

Show the server settings the console may change.

```text quoted
neodesk settings server-config [flags]
```

Needs server.config; only reads. Calls `GET /api/settings/management/config`.

## neodesk settings server-config-set

Change server settings from the allowed list (some need a restart).

```text quoted
neodesk settings server-config-set --changes JSON [flags]
```

| Flag | What it is |
|---|---|
| `--changes JSON` | setting to value, like {"LOG_LEVEL":"debug"} (required) |
| `--dry-run` | only check, change nothing |

Needs server.config; changes something: needs a token with read and write access. Calls `PUT /api/settings/management/config`.

## neodesk settings smtp

Show the mail server settings (the password is masked).

```text quoted
neodesk settings smtp [flags]
```

Needs server.config; only reads. Calls `GET /api/settings/email/smtp`.

## neodesk settings smtp-set

Set the mail server the console sends mail with.

```text quoted
neodesk settings smtp-set --host HOST [flags]
```

| Flag | What it is |
|---|---|
| `--host HOST` | the mail server (required) |
| `--port N` | its port, like 587 |
| `--secure` | TLS from the start (port 465) |
| `--user USER` | the user name |
| `--password-stdin` | read the password from standard input (its first line), so it stays out of the command line |
| `--password PASSWORD` | the password; prefer --password-stdin |
| `--from FROM` | the sender address |
| `--alert-email ALERT_EMAIL` | where alerts go |
| `--verify-tls` | check the server's certificate |

Needs server.config; changes something: needs a token with read and write access. Calls `PUT /api/settings/email/smtp`.

```text quoted
neodesk settings smtp-set --host mail.example.com --port 587 --user desk@example.com --from desk@example.com --password-stdin < pw.txt
```

## neodesk settings smtp-test

Send a test mail with the saved settings.

```text quoted
neodesk settings smtp-test [flags]
```

| Flag | What it is |
|---|---|
| `--to TO` | who gets it |

Needs server.config; changes something: needs a token with read and write access. Calls `POST /api/settings/email/smtp/test`.
