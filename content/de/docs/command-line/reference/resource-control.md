---
title: neodesk resource-control
description: 10 Befehle. USB, Laufwerke, Monitore und Kontingente auf Geräten.
order: 43
quoted: true
---

USB, Laufwerke, Monitore und Kontingente auf Geräten.

Die Befehle stehen hier auf Englisch, so wie die Kommandozeile sie mit `neodesk resource-control --help` zeigt. Die Flags, die jeder Befehl kennt, stehen in der [Befehlsreferenz](/docs/command-line/reference#flags-for-every-command).

## neodesk resource-control compliance

Show which devices follow their resource policy.

```text quoted
neodesk resource-control compliance [flags]
```

Needs a signed-in account; only reads. Calls `GET /api/panel/resource-control/compliance`.

## neodesk resource-control default

Show the default resource policy.

```text quoted
neodesk resource-control default [flags]
```

Needs a signed-in account; only reads. Calls `GET /api/panel/resource-control/org-policy`.

## neodesk resource-control default-set

Change the default resource policy.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk resource-control default-set [flags]
```

Needs a signed-in account; changes something: needs a token with read and write access. Calls `PUT /api/panel/resource-control/org-policy`.

## neodesk resource-control devices

List devices with their resource policy.

```text quoted
neodesk resource-control devices [flags]
```

Needs a signed-in account; only reads. Calls `GET /api/panel/resource-control/devices`.

## neodesk resource-control disks-set

Set the disk rules of a device.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk resource-control disks-set <deviceId> [flags]
```

| Argument | What it is |
|---|---|
| `<deviceId>` | The device ID |

Needs a signed-in account; changes something: needs a token with read and write access. Calls `POST /api/panel/resource-control/policies/{deviceId}/disks`.

## neodesk resource-control monitors-set

Set the monitor rules of a device.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk resource-control monitors-set <deviceId> [flags]
```

| Argument | What it is |
|---|---|
| `<deviceId>` | The device ID |

Needs a signed-in account; changes something: needs a token with read and write access. Calls `POST /api/panel/resource-control/policies/{deviceId}/monitors`.

## neodesk resource-control optical-set

Set the CD and DVD drive rules of a device.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk resource-control optical-set <deviceId> [flags]
```

| Argument | What it is |
|---|---|
| `<deviceId>` | The device ID |

Needs a signed-in account; changes something: needs a token with read and write access. Calls `POST /api/panel/resource-control/policies/{deviceId}/optical`.

## neodesk resource-control policy

Show a device's resource policy.

```text quoted
neodesk resource-control policy <deviceId> [flags]
```

| Argument | What it is |
|---|---|
| `<deviceId>` | The device ID |

Needs a signed-in account; only reads. Calls `GET /api/panel/resource-control/policies/{deviceId}`.

## neodesk resource-control quotas-set

Set the quotas of a device.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk resource-control quotas-set <deviceId> [flags]
```

| Argument | What it is |
|---|---|
| `<deviceId>` | The device ID |

Needs a signed-in account; changes something: needs a token with read and write access. Calls `POST /api/panel/resource-control/policies/{deviceId}/quotas`.

## neodesk resource-control usb-set

Set the USB rules of a device.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk resource-control usb-set <deviceId> [flags]
```

| Argument | What it is |
|---|---|
| `<deviceId>` | The device ID |

Needs a signed-in account; changes something: needs a token with read and write access. Calls `POST /api/panel/resource-control/policies/{deviceId}/usb`.
