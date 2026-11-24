---
title: neodesk device-groups
description: 3 Befehle. Gerätegruppen, von Hand oder nach Tag.
order: 20
quoted: true
---

Gerätegruppen, von Hand oder nach Tag.

Die Befehle stehen hier auf Englisch, so wie die Kommandozeile sie mit `neodesk device-groups --help` zeigt. Die Flags, die jeder Befehl kennt, stehen in der [Befehlsreferenz](/docs/command-line/reference#flags-for-every-command).

## neodesk device-groups delete

Delete a device group.

```text quoted
neodesk device-groups delete <guid> [flags]
```

| Argument | What it is |
|---|---|
| `<guid>` | The group's GUID |

Needs a signed-in account; changes something: needs a token with read and write access; deletes or ends something for good, so it asks first unless --yes is given. Calls `DELETE /api/device-groups/{guid}`.

## neodesk device-groups list

List device groups.

```text quoted
neodesk device-groups list [flags]
```

Needs a signed-in account; only reads. Calls `GET /api/device-groups`.

## neodesk device-groups save

Create a device group, or change one when --guid is given.

```text quoted
neodesk device-groups save [flags]
```

| Flag | What it is |
|---|---|
| `--guid GUID` | the group to change |
| `--name NAME` | the name |
| `--note NOTE` | a note |
| `--tag-filter TAG_FILTER` | devices with this tag join by themselves |

Needs a signed-in account; changes something: needs a token with read and write access. Calls `POST /api/device-groups`.
