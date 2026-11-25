---
title: neodesk users
description: 10 Befehle. Konten der Konsole: anlegen, ändern, deaktivieren, löschen.
order: 60
quoted: true
---

Konten der Konsole: anlegen, ändern, deaktivieren, löschen.

Die Befehle stehen hier auf Englisch, so wie die Kommandozeile sie mit `neodesk users --help` zeigt. Die Flags, die jeder Befehl kennt, stehen in der [Befehlsreferenz](/docs/command-line/reference#flags-for-every-command).

## neodesk users avatar

Download an account's profile picture (use --output).

```text quoted
neodesk users avatar <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The account ID |

Needs a signed-in account; only reads. Calls `GET /api/users/{id}/avatar`.

```bash quoted
neodesk users avatar 7 --output anna.png
```

## neodesk users avatars

List which accounts have a profile picture.

```text quoted
neodesk users avatars [flags]
```

Needs a signed-in account; only reads. Calls `GET /api/users/avatars`.

## neodesk users create

Create a console account with a role.

The password takes 8 to 128 characters; nothing else about it is checked. You can only give a role whose permissions you have yourself.

```text quoted
neodesk users create --username USERNAME (--password-stdin | --password PASSWORD) [flags]
```

| Flag | What it is |
|---|---|
| `--username USERNAME` | the sign-in name (required) |
| `--password-stdin` | read the password from standard input (its first line), so it stays out of the command line |
| `--password PASSWORD` | the first password; prefer --password-stdin (this or --password-stdin is required) |
| `--role super_admin\|admin\|global_admin\|server_admin\|operator\|viewer\|guest_issuer\|pro` | the role |
| `--email EMAIL` | email address |
| `--group-guids A,B` | user groups to put the account in |
| `--folder-ids A,B` | folders whose devices it may see (restricted scope) |
| `--peer-ids A,B` | devices it may see (restricted scope) |

Needs user.create; changes something: needs a token with read and write access. Calls `POST /api/users`.

```bash quoted
printf '%s\n' "$PASSWORD" | neodesk users create --username anna --role operator --password-stdin
neodesk users create --username bob --role viewer --email bob@example.com --password-stdin < pw.txt
```

## neodesk users delete

Delete an account. Its history stays in the audit log.

```text quoted
neodesk users delete <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The account ID |

Needs user.delete; changes something: needs a token with read and write access; deletes or ends something for good, so it asks first unless --yes is given. Calls `DELETE /api/users/{id}`.

```bash quoted
neodesk users delete 7 --yes
```

## neodesk users list

List console accounts with their role and status.

```text quoted
neodesk users list [flags]
```

Needs user.view; only reads. Calls `GET /api/users`.

```bash quoted
neodesk users list
neodesk users list --json
```

## neodesk users organization-add

Add an account to an organization.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk users organization-add <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The account ID |

Needs org.manage_users; changes something: needs a token with read and write access. Calls `POST /api/users/{id}/organizations`.

## neodesk users organizations

List the organizations an account belongs to.

```text quoted
neodesk users organizations <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The account ID |

Needs user.view; only reads. Calls `GET /api/users/{id}/organizations`.

## neodesk users reset-password

Set a new password for an account and end its sessions.

```text quoted
neodesk users reset-password <id> (--password-stdin | --password PASSWORD) [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The account ID |

| Flag | What it is |
|---|---|
| `--password-stdin` | read the password from standard input (its first line), so it stays out of the command line |
| `--password PASSWORD` | the new password; prefer --password-stdin (this or --password-stdin is required) |

Needs user.edit; changes something: needs a token with read and write access; deletes or ends something for good, so it asks first unless --yes is given. Calls `POST /api/users/{id}/reset-password`.

## neodesk users scope

Show which devices an account may see.

```text quoted
neodesk users scope <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The account ID |

Needs user.view; only reads. Calls `GET /api/users/{id}/effective-scope`.

## neodesk users update

Change an account: name, role, email, groups, disabled. Give only what changes.

```text quoted
neodesk users update <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The account ID (see users list) |

| Flag | What it is |
|---|---|
| `--username USERNAME` | new sign-in name |
| `--role super_admin\|admin\|global_admin\|server_admin\|operator\|viewer\|guest_issuer\|pro` | new role |
| `--email EMAIL` | email address |
| `--password-stdin` | read the password from standard input (its first line), so it stays out of the command line |
| `--password PASSWORD` | new password; prefer --password-stdin |
| `--disabled` | true stops the account from signing in, false lets it again |
| `--group-guids A,B` | the user groups, replacing the old list |

Needs user.edit; changes something: needs a token with read and write access. Calls `PATCH /api/users/{id}`.

```bash quoted
neodesk users update 7 --role viewer
neodesk users update 7 --disabled true
```
