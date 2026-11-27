---
title: neodesk branding
description: 17 commands. The console's look: logo, colors, profiles and fonts.
order: 10
quoted: true
icon: palette
---

The console's look: logo, colors, profiles and fonts.

`neodesk branding --help` lists the same commands in the terminal. The flags every command takes are in the [command reference](/docs/command-line/reference#flags-for-every-command).

## neodesk branding backgrounds

List the background pictures.

```text quoted
neodesk branding backgrounds [flags]
```

Needs a signed-in account; only reads. Calls `GET /api/settings/branding/backgrounds`.

## neodesk branding export

Export the branding as JSON (use --output).

```text quoted
neodesk branding export [flags]
```

Needs branding.edit; only reads. Calls `GET /api/settings/branding/export`.

## neodesk branding font-delete

Delete an installed font.

```text quoted
neodesk branding font-delete <family> [flags]
```

| Argument | What it is |
|---|---|
| `<family>` | The family |

Needs branding.edit; changes something: needs a token with read and write access; deletes or ends something for good, so it asks first unless --yes is given. Calls `DELETE /api/settings/fonts/{family}`.

## neodesk branding font-download

Install a font from Google Fonts.

```text quoted
neodesk branding font-download [flags]
```

| Flag | What it is |
|---|---|
| `--family FAMILY` | the Google Fonts family to install, like Inter |
| `--weights A,B` | weights to install, comma separated, like 400,700 (left out: 400, 500, 600 and 700) |

Needs branding.edit; changes something: needs a token with read and write access. Calls `POST /api/settings/fonts/download`.

## neodesk branding fonts

List the fonts the console can use.

```text quoted
neodesk branding fonts [flags]
```

Needs a signed-in account; only reads. Calls `GET /api/settings/fonts`.

## neodesk branding fonts-local

List the fonts installed on this server.

```text quoted
neodesk branding fonts-local [flags]
```

Needs a signed-in account; only reads. Calls `GET /api/settings/fonts/local`.

## neodesk branding import

Import branding from exported JSON (give it with --data @file.json).

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk branding import [flags]
```

Needs branding.edit; changes something: needs a token with read and write access. Calls `POST /api/settings/branding/import`.

## neodesk branding profile-apply

Use a saved branding profile.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk branding profile-apply <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

Needs branding.edit; changes something: needs a token with read and write access. Calls `POST /api/settings/branding/profiles/{id}/apply`.

## neodesk branding profile-copy

Copy a branding profile.

```text quoted
neodesk branding profile-copy <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

| Flag | What it is |
|---|---|
| `--name NAME` | name of the copy (left out: the name with "(copy)" after it) |

Needs branding.edit; changes something: needs a token with read and write access. Calls `POST /api/settings/branding/profiles/{id}/duplicate`.

## neodesk branding profile-create

Save the branding as a profile.

```text quoted
neodesk branding profile-create [flags]
```

| Flag | What it is |
|---|---|
| `--name NAME` | profile name, at most 80 characters, not in use yet |
| `--description DESCRIPTION` | what the profile is for, at most 200 characters |
| `--branding JSON` | the settings to save, a JSON object like the data of branding show (left out: the current settings) |

Needs branding.edit; changes something: needs a token with read and write access. Calls `POST /api/settings/branding/profiles`.

## neodesk branding profile-delete

Delete a branding profile.

```text quoted
neodesk branding profile-delete <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

Needs branding.edit; changes something: needs a token with read and write access; deletes or ends something for good, so it asks first unless --yes is given. Calls `DELETE /api/settings/branding/profiles/{id}`.

## neodesk branding profile-set

Change a branding profile.

```text quoted
neodesk branding profile-set <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

| Flag | What it is |
|---|---|
| `--name NAME` | new name, at most 80 characters (left out: kept) |
| `--description DESCRIPTION` | new description, at most 200 characters (left out: kept) |
| `--branding JSON` | new settings, a JSON object like the data of branding show (left out: kept) |

Needs branding.edit; changes something: needs a token with read and write access. Calls `PUT /api/settings/branding/profiles/{id}`.

## neodesk branding profiles

List saved branding profiles.

```text quoted
neodesk branding profiles [flags]
```

Needs a signed-in account; only reads. Calls `GET /api/settings/branding/profiles`.

## neodesk branding reset

Go back to the built-in branding.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk branding reset [flags]
```

Needs branding.edit; changes something: needs a token with read and write access; deletes or ends something for good, so it asks first unless --yes is given. Calls `POST /api/settings/branding/reset`.

## neodesk branding set

Change branding settings: give the fields to change.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk branding set [flags]
```

Needs branding.edit; changes something: needs a token with read and write access. Calls `POST /api/settings/branding`.

## neodesk branding show

Show the console's branding settings.

```text quoted
neodesk branding show [flags]
```

Needs a signed-in account; only reads. Calls `GET /api/settings/branding`.

## neodesk branding theme-apply

Use a built-in theme.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk branding theme-apply <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The theme |

Needs branding.edit; changes something: needs a token with read and write access. Calls `POST /api/settings/themes/{id}/apply`.
