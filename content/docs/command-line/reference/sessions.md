---
title: neodesk sessions
description: 4 commands. Console sign-ins: the browsers and devices an account is signed in on.
order: 48
quoted: true
---

Console sign-ins: the browsers and devices an account is signed in on.

`neodesk sessions --help` lists the same commands in the terminal. The flags every command takes are in the [command reference](/docs/command-line/reference#flags-for-every-command).

## neodesk sessions end

Sign an account out on one browser or device.

That browser goes to the sign-in page at its next request and is told an administrator signed it out. Ending your own account's sessions is refused to API tokens: use Signed-in devices in the account menu.

```text quoted
neodesk sessions end <user> <session> [flags]
```

| Argument | What it is |
|---|---|
| `<user>` | The account ID (see users list) |
| `<session>` | The session ID (see sessions list-for) |

Needs user.edit; changes something: needs a token with read and write access; deletes or ends something for good, so it asks first unless --yes is given. Calls `DELETE /api/users/{id}/sessions/{sessionId}`.

```bash quoted
neodesk sessions end 7 3f2a9c0d41b7e8a65d2c19f0b4e7a3d1
```

## neodesk sessions end-all

Sign an account out on every browser and device.

Ending your own account's sessions is refused to API tokens: use Signed-in devices in the account menu.

```text quoted
neodesk sessions end-all <user> [flags]
```

| Argument | What it is |
|---|---|
| `<user>` | The account ID (see users list) |

Needs user.edit; changes something: needs a token with read and write access; deletes or ends something for good, so it asks first unless --yes is given. Calls `POST /api/users/{id}/sessions/end-all`.

## neodesk sessions list

List the browsers and devices your account is signed in on.

Each entry shows the browser and system, the address, when it signed in and when it was last used. An API token has no browser session of its own, so no entry is marked current.

```text quoted
neodesk sessions list [flags]
```

Needs a signed-in account; only reads. Calls `GET /api/users/me/sessions`.

## neodesk sessions list-for

List the browsers and devices an account is signed in on.

```text quoted
neodesk sessions list-for <user> [flags]
```

| Argument | What it is |
|---|---|
| `<user>` | The account ID (see users list) |

Needs user.edit; only reads. Calls `GET /api/users/{id}/sessions`.
