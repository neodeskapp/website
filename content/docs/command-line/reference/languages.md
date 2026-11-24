---
title: neodesk languages
description: 9 commands. The console's languages and translations.
order: 32
quoted: true
---

The console's languages and translations.

`neodesk languages --help` lists the same commands in the terminal. The flags every command takes are in the [command reference](/docs/command-line/reference#flags-for-every-command).

## neodesk languages available

List the languages the console speaks.

```text quoted
neodesk languages available [flags]
```

Needs a signed-in account; only reads. Calls `GET /api/i18n/languages`.

## neodesk languages choose

Choose the console language of your account.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk languages choose <code> [flags]
```

| Argument | What it is |
|---|---|
| `<code>` | The language code, like de |

Needs a signed-in account; changes something: needs a token with read and write access. Calls `POST /api/i18n/set/{code}`.

## neodesk languages delete

Delete an uploaded language.

```text quoted
neodesk languages delete <code> [flags]
```

| Argument | What it is |
|---|---|
| `<code>` | The language code, like de |

Needs server.config; changes something: needs a token with read and write access; deletes or ends something for good, so it asks first unless --yes is given. Calls `DELETE /api/i18n/{code}`.

## neodesk languages fix

Add the missing keys of a language from English.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk languages fix <code> [flags]
```

| Argument | What it is |
|---|---|
| `<code>` | The language code, like de |

Needs server.config; changes something: needs a token with read and write access. Calls `POST /api/panel/languages/{code}/fix`.

## neodesk languages list

List the languages with how complete each is.

```text quoted
neodesk languages list [flags]
```

Needs server.config; only reads. Calls `GET /api/panel/languages`.

## neodesk languages missing

List the keys a language lacks.

```text quoted
neodesk languages missing <code> [flags]
```

| Argument | What it is |
|---|---|
| `<code>` | The language code, like de |

Needs server.config; only reads. Calls `GET /api/panel/languages/{code}/missing`.

## neodesk languages strings

Show every text of a language.

```text quoted
neodesk languages strings <code> [flags]
```

| Argument | What it is |
|---|---|
| `<code>` | The language code, like de |

Needs a signed-in account; only reads. Calls `GET /api/i18n/translations/{code}`.

## neodesk languages upload

Upload a language file (give it as --data @xx.json).

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk languages upload [flags]
```

Needs server.config; changes something: needs a token with read and write access. Calls `POST /api/i18n/upload`.

## neodesk languages validate

Check a language file against English.

```text quoted
neodesk languages validate <code> [flags]
```

| Argument | What it is |
|---|---|
| `<code>` | The language code, like de |

Needs a signed-in account; only reads. Calls `GET /api/i18n/validate/{code}`.
