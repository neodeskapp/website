---
title: neodesk generator
description: 18 Befehle. Der Generator für den Support-Client: Pakete und Builds.
order: 26
quoted: true
---

Der Generator für den Support-Client: Pakete und Builds.

Die Befehle stehen hier auf Englisch, so wie die Kommandozeile sie mit `neodesk generator --help` zeigt. Die Flags, die jeder Befehl kennt, stehen in der [Befehlsreferenz](/docs/command-line/reference#flags-for-every-command).

## neodesk generator accept-terms

Accept the generator module's terms.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk generator accept-terms [flags]
```

Needs a signed-in account; changes something: needs a token with read and write access. Calls `POST /api/generator/module/accept-terms`.

## neodesk generator build-status

Show the queue of client builds.

```text quoted
neodesk generator build-status [flags]
```

Needs a signed-in account; only reads. Calls `GET /api/generator/build-status`.

## neodesk generator bundle

Show one support client bundle.

```text quoted
neodesk generator bundle <bundleId> [flags]
```

| Argument | What it is |
|---|---|
| `<bundleId>` | The bundle id |

Needs a signed-in account; only reads. Calls `GET /api/generator/bundles/{bundleId}`.

## neodesk generator bundle-create

Make a support client bundle.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk generator bundle-create [flags]
```

Needs a signed-in account; changes something: needs a token with read and write access. Calls `POST /api/generator/bundles`.

## neodesk generator bundle-delete

Delete a support client bundle.

```text quoted
neodesk generator bundle-delete <bundleId> [flags]
```

| Argument | What it is |
|---|---|
| `<bundleId>` | The bundle id |

Needs a signed-in account; changes something: needs a token with read and write access; deletes or ends something for good, so it asks first unless --yes is given. Calls `DELETE /api/generator/bundles/{bundleId}`.

## neodesk generator bundle-revoke

Stop a bundle from being downloaded.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk generator bundle-revoke <bundleId> [flags]
```

| Argument | What it is |
|---|---|
| `<bundleId>` | The bundle id |

Needs a signed-in account; changes something: needs a token with read and write access; deletes or ends something for good, so it asks first unless --yes is given. Calls `POST /api/generator/bundles/{bundleId}/revoke`.

## neodesk generator bundle-set

Change a support client bundle.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk generator bundle-set <bundleId> [flags]
```

| Argument | What it is |
|---|---|
| `<bundleId>` | The bundle id |

Needs a signed-in account; changes something: needs a token with read and write access. Calls `PUT /api/generator/bundles/{bundleId}`.

## neodesk generator bundles

List support client bundles.

```text quoted
neodesk generator bundles [flags]
```

Needs a signed-in account; only reads. Calls `GET /api/generator/bundles`.

## neodesk generator config

Show the settings the generator builds with.

```text quoted
neodesk generator config [flags]
```

Needs a signed-in account; only reads. Calls `GET /api/generator/config`.

## neodesk generator defaults

Show the defaults of a new bundle.

```text quoted
neodesk generator defaults [flags]
```

Needs a signed-in account; only reads. Calls `GET /api/generator/defaults`.

## neodesk generator generate-config

Make a client settings file (TOML).

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk generator generate-config [flags]
```

Needs a signed-in account; changes something: needs a token with read and write access. Calls `POST /api/generator/generate-config`.

## neodesk generator install

Install the generator module.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk generator install [flags]
```

Needs a signed-in account; changes something: needs a token with read and write access. Calls `POST /api/generator/module/install`.

## neodesk generator install-local

Install the generator module from a local file.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk generator install-local [flags]
```

Needs a signed-in account; changes something: needs a token with read and write access; runs something on a device or the server. Calls `POST /api/generator/module/install-local`.

## neodesk generator platforms

List the platforms clients can be built for.

```text quoted
neodesk generator platforms [flags]
```

Needs a signed-in account; only reads. Calls `GET /api/generator/platforms`.

## neodesk generator preview

Show what a bundle would hold, without saving it.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk generator preview [flags]
```

Needs a signed-in account; changes something: needs a token with read and write access. Calls `POST /api/generator/preview`.

## neodesk generator rebuild

Build every file of a bundle again.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk generator rebuild <bundleId> [flags]
```

| Argument | What it is |
|---|---|
| `<bundleId>` | The bundle id |

Needs a signed-in account; changes something: needs a token with read and write access. Calls `POST /api/generator/bundles/{bundleId}/rebuild`.

## neodesk generator rebuild-one

Build one file of a bundle again.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk generator rebuild-one <bundleId> <platform> <arch> <format> [flags]
```

| Argument | What it is |
|---|---|
| `<bundleId>` | The bundle id |
| `<platform>` | The platform |
| `<arch>` | The arch |
| `<format>` | The format |

Needs a signed-in account; changes something: needs a token with read and write access. Calls `POST /api/generator/bundles/{bundleId}/rebuild/{platform}/{arch}/{format}`.

## neodesk generator status

Show whether the generator module is installed.

```text quoted
neodesk generator status [flags]
```

Needs a signed-in account; only reads. Calls `GET /api/generator/module/status`.
