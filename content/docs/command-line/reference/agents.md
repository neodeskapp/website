---
title: neodesk agents
description: 7 commands. NeoDesk agent releases, templates and installer files.
order: 3
quoted: true
icon: package_2
---

NeoDesk agent releases, templates and installer files.

`neodesk agents --help` lists the same commands in the terminal. The flags every command takes are in the [command reference](/docs/command-line/reference#flags-for-every-command).

## neodesk agents installers

List the agent installer files this server serves.

```text quoted
neodesk agents installers [flags]
```

Needs a signed-in account; only reads. Calls `GET /api/portal/installers`.

## neodesk agents release-signing

Show whether agent releases are signed and checked.

```text quoted
neodesk agents release-signing [flags]
```

Needs enrollment.manage; only reads. Calls `GET /api/agent-releases/signing-status`.

## neodesk agents releases

List the NeoDesk agent releases this server keeps.

```text quoted
neodesk agents releases [flags]
```

Needs enrollment.manage; only reads. Calls `GET /api/agent-releases`.

## neodesk agents releases-sync

Fetch the newest agent release from GitHub.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk agents releases-sync [flags]
```

Needs enrollment.manage; changes something: needs a token with read and write access. Calls `POST /api/agent-releases/sync`.

## neodesk agents template-create

Make an agent template: settings new agents start with.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk agents template-create [flags]
```

Needs enrollment.manage; changes something: needs a token with read and write access. Calls `POST /api/agent-templates`.

## neodesk agents template-delete

Delete an agent template.

```text quoted
neodesk agents template-delete <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

Needs enrollment.manage; changes something: needs a token with read and write access; deletes or ends something for good, so it asks first unless --yes is given. Calls `DELETE /api/agent-templates/{id}`.

## neodesk agents templates

List agent templates.

```text quoted
neodesk agents templates [flags]
```

Needs enrollment.manage; only reads. Calls `GET /api/agent-templates`.
