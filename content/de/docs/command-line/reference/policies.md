---
title: neodesk policies
description: 10 Befehle. Richtlinien von Organisationen und die Attestierung von Geräten.
order: 38
quoted: true
---

Richtlinien von Organisationen und die Attestierung von Geräten.

Die Befehle stehen hier auf Englisch, so wie die Kommandozeile sie mit `neodesk policies --help` zeigt. Die Flags, die jeder Befehl kennt, stehen in der [Befehlsreferenz](/docs/command-line/reference#flags-for-every-command).

## neodesk policies attestation

Show what one device reported about its state.

```text quoted
neodesk policies attestation <deviceId> [flags]
```

| Argument | What it is |
|---|---|
| `<deviceId>` | The device ID |

Needs an admin role, and a token with all of its account's permissions; only reads. Calls `GET /api/panel/attestation/{deviceId}`.

## neodesk policies attestations

List what devices reported about their state.

```text quoted
neodesk policies attestations [flags]
```

Needs an admin role, and a token with all of its account's permissions; only reads. Calls `GET /api/panel/attestation`.

## neodesk policies audit

List the changes to an organization's policies.

```text quoted
neodesk policies audit <orgId> [flags]
```

| Argument | What it is |
|---|---|
| `<orgId>` | The organization ID |

Needs an admin role, and a token with all of its account's permissions; only reads. Calls `GET /api/panel/policies/{orgId}/audit`.

## neodesk policies connection-set

Set an organization's connection policy.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk policies connection-set <orgId> [flags]
```

| Argument | What it is |
|---|---|
| `<orgId>` | The organization ID |

Needs org.edit; changes something: needs a token with read and write access. Calls `PUT /api/panel/policies/{orgId}/connection`.

## neodesk policies effective

Show the policy one device gets.

```text quoted
neodesk policies effective <orgId> <deviceId> [flags]
```

| Argument | What it is |
|---|---|
| `<orgId>` | The organization ID |
| `<deviceId>` | The device ID |

Needs an admin role, and a token with all of its account's permissions; only reads. Calls `GET /api/panel/policies/{orgId}/effective/{deviceId}`.

## neodesk policies features-set

Set an organization's feature policy.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk policies features-set <orgId> [flags]
```

| Argument | What it is |
|---|---|
| `<orgId>` | The organization ID |

Needs org.edit; changes something: needs a token with read and write access. Calls `PUT /api/panel/policies/{orgId}/features`.

## neodesk policies get

Show an organization's policies.

```text quoted
neodesk policies get <orgId> [flags]
```

| Argument | What it is |
|---|---|
| `<orgId>` | The organization ID |

Needs an admin role, and a token with all of its account's permissions; only reads. Calls `GET /api/panel/policies/{orgId}`.

## neodesk policies network-set

Set an organization's network policy.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk policies network-set <orgId> [flags]
```

| Argument | What it is |
|---|---|
| `<orgId>` | The organization ID |

Needs org.edit; changes something: needs a token with read and write access. Calls `PUT /api/panel/policies/{orgId}/network`.

## neodesk policies security-set

Set an organization's security policy.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk policies security-set <orgId> [flags]
```

| Argument | What it is |
|---|---|
| `<orgId>` | The organization ID |

Needs org.edit; changes something: needs a token with read and write access. Calls `PUT /api/panel/policies/{orgId}/security`.

## neodesk policies update-set

Set an organization's update policy.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk policies update-set <orgId> [flags]
```

| Argument | What it is |
|---|---|
| `<orgId>` | The organization ID |

Needs org.edit; changes something: needs a token with read and write access. Calls `PUT /api/panel/policies/{orgId}/update`.
