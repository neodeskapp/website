---
title: neodesk fleet
description: 23 Befehle. Flottenaufgaben, Workflows, Compliance und Ressourcen.
order: 24
quoted: true
---

Flottenaufgaben, Workflows, Compliance und Ressourcen.

Die Befehle stehen hier auf Englisch, so wie die Kommandozeile sie mit `neodesk fleet --help` zeigt. Die Flags, die jeder Befehl kennt, stehen in der [Befehlsreferenz](/docs/command-line/reference#flags-for-every-command).

## neodesk fleet availability

Show whether the fleet tools are on.

```text quoted
neodesk fleet availability [flags]
```

Needs org.manage_devices; only reads. Calls `GET /api/panel/fleet/availability`.

## neodesk fleet compliance

List the compliance state of devices.

```text quoted
neodesk fleet compliance [flags]
```

Needs org.manage_devices; only reads. Calls `GET /api/panel/fleet/compliance`.

## neodesk fleet compliance-device

Show the compliance of one device.

```text quoted
neodesk fleet compliance-device <deviceId> [flags]
```

| Argument | What it is |
|---|---|
| `<deviceId>` | The device ID |

Needs org.manage_devices; only reads. Calls `GET /api/panel/fleet/compliance/{deviceId}`.

## neodesk fleet remediate

Fix what a device fails in its compliance checks.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk fleet remediate <deviceId> [flags]
```

| Argument | What it is |
|---|---|
| `<deviceId>` | The device ID |

Needs org.manage_devices; changes something: needs a token with read and write access. Calls `POST /api/panel/fleet/compliance/{deviceId}/remediate`.

## neodesk fleet resource-create

Add a fleet resource to an organization.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk fleet resource-create <orgId> [flags]
```

| Argument | What it is |
|---|---|
| `<orgId>` | The organization ID |

Needs org.manage_devices; changes something: needs a token with read and write access. Calls `POST /api/panel/fleet/resources/{orgId}`.

## neodesk fleet resource-delete

Delete a fleet resource.

```text quoted
neodesk fleet resource-delete <orgId> <resourceId> [flags]
```

| Argument | What it is |
|---|---|
| `<orgId>` | The organization ID |
| `<resourceId>` | The resource id |

Needs org.manage_devices; changes something: needs a token with read and write access; deletes or ends something for good, so it asks first unless --yes is given. Calls `DELETE /api/panel/fleet/resources/{orgId}/{resourceId}`.

## neodesk fleet resource-set

Change a fleet resource.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk fleet resource-set <orgId> <resourceId> [flags]
```

| Argument | What it is |
|---|---|
| `<orgId>` | The organization ID |
| `<resourceId>` | The resource id |

Needs org.manage_devices; changes something: needs a token with read and write access. Calls `PUT /api/panel/fleet/resources/{orgId}/{resourceId}`.

## neodesk fleet resources

List an organization's fleet resources.

```text quoted
neodesk fleet resources <orgId> [flags]
```

| Argument | What it is |
|---|---|
| `<orgId>` | The organization ID |

Needs org.manage_devices; only reads. Calls `GET /api/panel/fleet/resources/{orgId}`.

## neodesk fleet scan

Check the compliance of a device now.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk fleet scan <deviceId> [flags]
```

| Argument | What it is |
|---|---|
| `<deviceId>` | The device ID |

Needs org.manage_devices; changes something: needs a token with read and write access. Calls `POST /api/panel/fleet/compliance/{deviceId}/scan`.

## neodesk fleet task

Show one fleet task.

```text quoted
neodesk fleet task <taskId> [flags]
```

| Argument | What it is |
|---|---|
| `<taskId>` | The task id |

Needs org.manage_devices; only reads. Calls `GET /api/panel/fleet/tasks/{taskId}`.

## neodesk fleet task-create

Make a fleet task.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk fleet task-create [flags]
```

Needs org.manage_devices; changes something: needs a token with read and write access. Calls `POST /api/panel/fleet/tasks`.

## neodesk fleet task-delete

Delete a fleet task.

```text quoted
neodesk fleet task-delete <taskId> [flags]
```

| Argument | What it is |
|---|---|
| `<taskId>` | The task id |

Needs org.manage_devices; changes something: needs a token with read and write access; deletes or ends something for good, so it asks first unless --yes is given. Calls `DELETE /api/panel/fleet/tasks/{taskId}`.

## neodesk fleet task-output

Show what a fleet task printed.

```text quoted
neodesk fleet task-output <taskId> [flags]
```

| Argument | What it is |
|---|---|
| `<taskId>` | The task id |

Needs org.manage_devices; only reads. Calls `GET /api/panel/fleet/tasks/{taskId}/output`.

## neodesk fleet task-retry

Run a fleet task again.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk fleet task-retry <taskId> [flags]
```

| Argument | What it is |
|---|---|
| `<taskId>` | The task id |

Needs org.manage_devices; changes something: needs a token with read and write access. Calls `POST /api/panel/fleet/tasks/{taskId}/retry`.

## neodesk fleet task-set

Change a fleet task.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk fleet task-set <taskId> [flags]
```

| Argument | What it is |
|---|---|
| `<taskId>` | The task id |

Needs org.manage_devices; changes something: needs a token with read and write access. Calls `PUT /api/panel/fleet/tasks/{taskId}`.

## neodesk fleet tasks

List fleet tasks.

```text quoted
neodesk fleet tasks [flags]
```

Needs org.manage_devices; only reads. Calls `GET /api/panel/fleet/tasks`.

## neodesk fleet workflow

Show one workflow.

```text quoted
neodesk fleet workflow <workflowId> [flags]
```

| Argument | What it is |
|---|---|
| `<workflowId>` | The workflow id |

Needs org.manage_devices; only reads. Calls `GET /api/panel/fleet/workflows/{workflowId}`.

## neodesk fleet workflow-create

Make a workflow.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk fleet workflow-create [flags]
```

Needs org.manage_devices; changes something: needs a token with read and write access. Calls `POST /api/panel/fleet/workflows`.

## neodesk fleet workflow-delete

Delete a workflow.

```text quoted
neodesk fleet workflow-delete <workflowId> [flags]
```

| Argument | What it is |
|---|---|
| `<workflowId>` | The workflow id |

Needs org.manage_devices; changes something: needs a token with read and write access; deletes or ends something for good, so it asks first unless --yes is given. Calls `DELETE /api/panel/fleet/workflows/{workflowId}`.

## neodesk fleet workflow-history

List the runs of a workflow.

```text quoted
neodesk fleet workflow-history <workflowId> [flags]
```

| Argument | What it is |
|---|---|
| `<workflowId>` | The workflow id |

Needs org.manage_devices; only reads. Calls `GET /api/panel/fleet/workflows/{workflowId}/history`.

## neodesk fleet workflow-run

Run a workflow.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk fleet workflow-run <workflowId> [flags]
```

| Argument | What it is |
|---|---|
| `<workflowId>` | The workflow id |

Needs org.manage_devices; changes something: needs a token with read and write access; runs something on a device or the server. Calls `POST /api/panel/fleet/workflows/{workflowId}/execute`.

## neodesk fleet workflow-set

Change a workflow.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk fleet workflow-set <workflowId> [flags]
```

| Argument | What it is |
|---|---|
| `<workflowId>` | The workflow id |

Needs org.manage_devices; changes something: needs a token with read and write access. Calls `PUT /api/panel/fleet/workflows/{workflowId}`.

## neodesk fleet workflows

List workflows.

```text quoted
neodesk fleet workflows [flags]
```

Needs org.manage_devices; only reads. Calls `GET /api/panel/fleet/workflows`.
