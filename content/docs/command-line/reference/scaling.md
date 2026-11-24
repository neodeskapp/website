---
title: neodesk scaling
description: 12 commands. Relay servers and scaling rules.
order: 46
quoted: true
---

Relay servers and scaling rules.

`neodesk scaling --help` lists the same commands in the terminal. The flags every command takes are in the [command reference](/docs/command-line/reference#flags-for-every-command).

## neodesk scaling capacity

Show how many sessions the relays can take.

```text quoted
neodesk scaling capacity [flags]
```

Needs a signed-in account; only reads. Calls `GET /api/panel/scaling/capacity`.

## neodesk scaling relay

Show one relay server.

```text quoted
neodesk scaling relay <nodeId> [flags]
```

| Argument | What it is |
|---|---|
| `<nodeId>` | The node id |

Needs a signed-in account; only reads. Calls `GET /api/panel/scaling/relays/{nodeId}`.

## neodesk scaling relay-create

Add a relay server.

```text quoted
neodesk scaling relay-create [flags]
```

| Flag | What it is |
|---|---|
| `--name NAME` |  |
| `--address ADDRESS` |  |
| `--location LOCATION` |  |
| `--max-sessions MAX_SESSIONS` |  |
| `--max-bandwidth-mbps MAX_BANDWIDTH_MBPS` |  |

Needs a signed-in account; changes something: needs a token with read and write access. Calls `POST /api/panel/scaling/relays`.

## neodesk scaling relay-delete

Delete a relay server.

```text quoted
neodesk scaling relay-delete <nodeId> [flags]
```

| Argument | What it is |
|---|---|
| `<nodeId>` | The node id |

Needs a signed-in account; changes something: needs a token with read and write access; deletes or ends something for good, so it asks first unless --yes is given. Calls `DELETE /api/panel/scaling/relays/{nodeId}`.

## neodesk scaling relay-health

Show whether a relay server answers.

```text quoted
neodesk scaling relay-health <nodeId> [flags]
```

| Argument | What it is |
|---|---|
| `<nodeId>` | The node id |

Needs a signed-in account; only reads. Calls `GET /api/panel/scaling/relays/{nodeId}/health`.

## neodesk scaling relay-metrics

Show the load of a relay server.

```text quoted
neodesk scaling relay-metrics <nodeId> [flags]
```

| Argument | What it is |
|---|---|
| `<nodeId>` | The node id |

Needs a signed-in account; only reads. Calls `GET /api/panel/scaling/relays/{nodeId}/metrics`.

## neodesk scaling relay-set

Change a relay server.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk scaling relay-set <nodeId> [flags]
```

| Argument | What it is |
|---|---|
| `<nodeId>` | The node id |

Needs a signed-in account; changes something: needs a token with read and write access. Calls `PUT /api/panel/scaling/relays/{nodeId}`.

## neodesk scaling relays

List relay servers.

```text quoted
neodesk scaling relays [flags]
```

Needs a signed-in account; only reads. Calls `GET /api/panel/scaling/relays`.

## neodesk scaling rule-create

Add a rule that picks the relay for a session.

```text quoted
neodesk scaling rule-create [flags]
```

| Flag | What it is |
|---|---|
| `--name NAME` |  |
| `--match-type MATCH_TYPE` |  |
| `--match-value MATCH_VALUE` |  |
| `--target-relay TARGET_RELAY` |  |
| `--fallback FALLBACK` |  |
| `--priority PRIORITY` |  |
| `--enabled` |  |

Needs a signed-in account; changes something: needs a token with read and write access. Calls `POST /api/panel/scaling/rules`.

## neodesk scaling rule-delete

Delete a relay rule.

```text quoted
neodesk scaling rule-delete <ruleId> [flags]
```

| Argument | What it is |
|---|---|
| `<ruleId>` | The rule id |

Needs a signed-in account; changes something: needs a token with read and write access; deletes or ends something for good, so it asks first unless --yes is given. Calls `DELETE /api/panel/scaling/rules/{ruleId}`.

## neodesk scaling rule-set

Change a relay rule.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk scaling rule-set <ruleId> [flags]
```

| Argument | What it is |
|---|---|
| `<ruleId>` | The rule id |

Needs a signed-in account; changes something: needs a token with read and write access. Calls `PUT /api/panel/scaling/rules/{ruleId}`.

## neodesk scaling rules

List relay rules.

```text quoted
neodesk scaling rules [flags]
```

Needs a signed-in account; only reads. Calls `GET /api/panel/scaling/rules`.
