---
title: neodesk roles
description: 5 Befehle. Rollen und ihre Berechtigungen.
order: 45
quoted: true
---

Rollen und ihre Berechtigungen.

Die Befehle stehen hier auf Englisch, so wie die Kommandozeile sie mit `neodesk roles --help` zeigt. Die Flags, die jeder Befehl kennt, stehen in der [Befehlsreferenz](/docs/command-line/reference#flags-for-every-command).

## neodesk roles list

List the roles with their levels. roles permissions &lt;role> shows what a role may do.

```text quoted
neodesk roles list [flags]
```

Needs user.view; only reads. Calls `GET /api/panel/roles`.

## neodesk roles override-delete

Undo a change to a role: back to its built-in permission.

```text quoted
neodesk roles override-delete <role> <permission> [flags]
```

| Argument | What it is |
|---|---|
| `<role>` | The role |
| `<permission>` | The permission |

Needs the super_admin role, and a token with all of its account's permissions; changes something: needs a token with read and write access; deletes or ends something for good, so it asks first unless --yes is given. Calls `DELETE /api/panel/role-permissions/{role}/{permission}`.

## neodesk roles override-set

Give a role a permission or take one away (super admins).

```text quoted
neodesk roles override-set --role ROLE --permission PERMISSION --granted  [flags]
```

| Flag | What it is |
|---|---|
| `--role ROLE` | the role (required) |
| `--permission PERMISSION` | the permission, like device.edit (required) |
| `--granted` | true gives it, false takes it away (required) |

Needs the super_admin role, and a token with all of its account's permissions; changes something: needs a token with read and write access. Calls `POST /api/panel/role-permissions`.

```bash quoted
neodesk roles override-set --role operator --permission device.delete --granted false
```

## neodesk roles overrides

List the permissions changed from the built-in roles.

```text quoted
neodesk roles overrides [flags]
```

Needs server.config; only reads. Calls `GET /api/panel/role-permissions`.

## neodesk roles permissions

Show the permissions a role has now, overrides included.

```text quoted
neodesk roles permissions <role> [flags]
```

| Argument | What it is |
|---|---|
| `<role>` | The role, like operator |

Needs user.view; only reads. Calls `GET /api/panel/roles/{role}/permissions`.

```bash quoted
neodesk roles permissions operator
```
