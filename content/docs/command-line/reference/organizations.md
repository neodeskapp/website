---
title: neodesk organizations
description: 26 commands. Organizations with their users, devices and settings.
order: 35
quoted: true
---

Organizations with their users, devices and settings.

`neodesk organizations --help` lists the same commands in the terminal. The flags every command takes are in the [command reference](/docs/command-line/reference#flags-for-every-command).

## neodesk organizations address-book

Show an organization's address book.

```text quoted
neodesk organizations address-book <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

Needs a signed-in account; only reads. Calls `GET /api/panel/org/{id}/address-book`.

## neodesk organizations address-book-set

Replace an organization's address book.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk organizations address-book-set <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

Needs a signed-in account; changes something: needs a token with read and write access. Calls `PUT /api/panel/org/{id}/address-book`.

## neodesk organizations available-users

List accounts that can join an organization.

```text quoted
neodesk organizations available-users <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

Needs a signed-in account; only reads. Calls `GET /api/panel/org/{id}/available-users`.

## neodesk organizations create

Make an organization.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk organizations create [flags]
```

Needs a signed-in account; changes something: needs a token with read and write access. Calls `POST /api/panel/org`.

## neodesk organizations credential-delete

Delete the saved sign-in of a device in an organization.

```text quoted
neodesk organizations credential-delete <id> <peerId> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |
| `<peerId>` | The peer id |

Needs a signed-in account; changes something: needs a token with read and write access; deletes or ends something for good, so it asks first unless --yes is given. Calls `DELETE /api/panel/org/{id}/peer-credentials/{peerId}`.

## neodesk organizations credential-set

Save the sign-in of a device in an organization.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk organizations credential-set <id> <peerId> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |
| `<peerId>` | The peer id |

Needs a signed-in account; changes something: needs a token with read and write access. Calls `PUT /api/panel/org/{id}/peer-credentials/{peerId}`.

## neodesk organizations credentials

List the saved device sign-ins of an organization.

```text quoted
neodesk organizations credentials <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

Needs a signed-in account; only reads; the answer holds secrets or private content. Calls `GET /api/panel/org/{id}/peer-credentials`.

## neodesk organizations delete

Delete an organization. Its devices and device groups stay.

```text quoted
neodesk organizations delete <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

Needs a signed-in account; changes something: needs a token with read and write access; deletes or ends something for good, so it asks first unless --yes is given. Calls `DELETE /api/panel/org/{id}`.

## neodesk organizations device-add

Add a device to an organization.

```text quoted
neodesk organizations device-add <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

| Flag | What it is |
|---|---|
| `--device-id DEVICE_ID` |  |

Needs a signed-in account; changes something: needs a token with read and write access. Calls `POST /api/panel/org/{id}/devices`.

## neodesk organizations device-groups

List an organization's device groups.

```text quoted
neodesk organizations device-groups <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

Needs a signed-in account; only reads. Calls `GET /api/panel/org/{id}/device-groups`.

## neodesk organizations device-remove

Take a device out of an organization.

```text quoted
neodesk organizations device-remove <id> <did> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |
| `<did>` | The did |

Needs a signed-in account; changes something: needs a token with read and write access; deletes or ends something for good, so it asks first unless --yes is given. Calls `DELETE /api/panel/org/{id}/devices/{did}`.

## neodesk organizations devices

List an organization's devices.

```text quoted
neodesk organizations devices <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

Needs a signed-in account; only reads. Calls `GET /api/panel/org/{id}/devices`.

## neodesk organizations get

Show one organization.

```text quoted
neodesk organizations get <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

Needs a signed-in account; only reads. Calls `GET /api/panel/org/{id}`.

## neodesk organizations invitation-delete

Withdraw an invitation to an organization.

```text quoted
neodesk organizations invitation-delete <id> <invId> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |
| `<invId>` | The inv id |

Needs a signed-in account; changes something: needs a token with read and write access; deletes or ends something for good, so it asks first unless --yes is given. Calls `DELETE /api/panel/org/{id}/invitations/{invId}`.

## neodesk organizations invitations

List an organization's open invitations.

```text quoted
neodesk organizations invitations <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

Needs a signed-in account; only reads. Calls `GET /api/panel/org/{id}/invitations`.

## neodesk organizations invite

Invite someone to an organization (the code is shown once).

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk organizations invite <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

Needs a signed-in account; changes something: needs a token with read and write access. Calls `POST /api/panel/org/{id}/invite`.

## neodesk organizations list

List organizations.

```text quoted
neodesk organizations list [flags]
```

Needs a signed-in account; only reads. Calls `GET /api/panel/org`.

## neodesk organizations member-add

Add a console account to an organization.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk organizations member-add <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

Needs a signed-in account; changes something: needs a token with read and write access. Calls `POST /api/panel/org/{id}/members`.

## neodesk organizations member-remove

Take a console account out of an organization.

```text quoted
neodesk organizations member-remove <id> <userId> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |
| `<userId>` | The user id |

Needs a signed-in account; changes something: needs a token with read and write access; deletes or ends something for good, so it asks first unless --yes is given. Calls `DELETE /api/panel/org/{id}/members/{userId}`.

## neodesk organizations settings

Show an organization's settings.

```text quoted
neodesk organizations settings <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

Needs a signed-in account; only reads. Calls `GET /api/panel/org/{id}/settings`.

## neodesk organizations settings-set

Change an organization's settings.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk organizations settings-set <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

Needs a signed-in account; changes something: needs a token with read and write access. Calls `PUT /api/panel/org/{id}/settings`.

## neodesk organizations update

Change an organization.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk organizations update <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

Needs a signed-in account; changes something: needs a token with read and write access. Calls `PUT /api/panel/org/{id}`.

## neodesk organizations user-create

Make a user of an organization (desktop client sign-in).

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk organizations user-create <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

Needs a signed-in account; changes something: needs a token with read and write access. Calls `POST /api/panel/org/{id}/users`.

## neodesk organizations user-delete

Delete a user of an organization.

```text quoted
neodesk organizations user-delete <id> <uid> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |
| `<uid>` | The uid |

Needs a signed-in account; changes something: needs a token with read and write access; deletes or ends something for good, so it asks first unless --yes is given. Calls `DELETE /api/panel/org/{id}/users/{uid}`.

## neodesk organizations user-set

Change a user of an organization.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk organizations user-set <id> <uid> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |
| `<uid>` | The uid |

Needs a signed-in account; changes something: needs a token with read and write access. Calls `PUT /api/panel/org/{id}/users/{uid}`.

## neodesk organizations users

List an organization's users.

```text quoted
neodesk organizations users <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

Needs a signed-in account; only reads. Calls `GET /api/panel/org/{id}/users`.
