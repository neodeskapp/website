---
title: neodesk billing
description: 27 Befehle. Abrechnung: Pakete, Verträge, Sitzungen, Berichte und die Uhr.
order: 9
quoted: true
---

Abrechnung: Pakete, Verträge, Sitzungen, Berichte und die Uhr.

Die Befehle stehen hier auf Englisch, so wie die Kommandozeile sie mit `neodesk billing --help` zeigt. Die Flags, die jeder Befehl kennt, stehen in der [Befehlsreferenz](/docs/command-line/reference#flags-for-every-command).

## neodesk billing check

Check whether a device may start a billed session.

```text quoted
neodesk billing check [flags]
```

Needs device.connect; only reads. Calls `GET /api/panel/billing/check`.

## neodesk billing clock

Show the billing clock settings.

```text quoted
neodesk billing clock [flags]
```

Needs a signed-in account; only reads. Calls `GET /api/panel/billing/clock/settings`.

## neodesk billing clock-set

Change the billing clock settings (they apply after a restart).

```text quoted
neodesk billing clock-set [flags]
```

| Flag | What it is |
|---|---|
| `--ntp-servers NTP_SERVERS` | NTP servers to check the clock against, comma separated (left out: pool.ntp.org, time.google.com and time.cloudflare.com) |
| `--max-skew-ms N` | largest clock offset that still counts as synced, in milliseconds, 1 to 600000 (left out: 2000) |
| `--require-synced-clock` | block billable sessions while the clock is not synced (left out: on) |
| `--trust-os-ntp` | count the clock as synced when no NTP server answers but the system says it is synced (left out: on for Linux, off elsewhere) |
| `--billing-timezone BILLING_TIMEZONE` | time zone of the billing months, a name like Europe/Berlin (left out: UTC) |

Needs server.config; changes something: needs a token with read and write access. Calls `PUT /api/panel/billing/clock/settings`.

## neodesk billing contract-create

Make a billing contract.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk billing contract-create [flags]
```

Needs billing.manage; changes something: needs a token with read and write access. Calls `POST /api/panel/billing/contracts`.

## neodesk billing contract-delete

Delete a billing contract.

```text quoted
neodesk billing contract-delete <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

Needs billing.manage; changes something: needs a token with read and write access; deletes or ends something for good, so it asks first unless --yes is given. Calls `DELETE /api/panel/billing/contracts/{id}`.

## neodesk billing contract-set

Change a billing contract.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk billing contract-set <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

Needs billing.manage; changes something: needs a token with read and write access. Calls `PUT /api/panel/billing/contracts/{id}`.

## neodesk billing contracts

List billing contracts.

```text quoted
neodesk billing contracts [flags]
```

Needs billing.view; only reads. Calls `GET /api/panel/billing/contracts`.

## neodesk billing currencies

List currencies and their rates.

```text quoted
neodesk billing currencies [flags]
```

Needs billing.view; only reads. Calls `GET /api/panel/billing/currencies`.

## neodesk billing currency-set

Change a currency.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk billing currency-set <code> [flags]
```

| Argument | What it is |
|---|---|
| `<code>` | The language code, like de |

Needs billing.manage; changes something: needs a token with read and write access. Calls `PUT /api/panel/billing/currencies/{code}`.

## neodesk billing mail-settings

Show the mail settings of help requests.

```text quoted
neodesk billing mail-settings [flags]
```

Needs billing.view; only reads. Calls `GET /api/panel/commercialization/email-config`.

## neodesk billing mail-settings-set

Change the mail settings of help requests.

```text quoted
neodesk billing mail-settings-set [flags]
```

| Flag | What it is |
|---|---|
| `--help-requests-enabled` | send a mail for each help request a device raises (left out: on) |
| `--notify-assigned-operators` | mail the operators on the access lists of the device's folder and groups (left out: on) |
| `--fallback-alert-email` | mail the alert address of the mail settings when no operator gets the mail (left out: on) |
| `--include-folder-in-subject` | put the device's folder name in the mail subject (left out: on) |

Needs billing.manage; changes something: needs a token with read and write access. Calls `PUT /api/panel/commercialization/email-config`.

## neodesk billing mail-status

Show whether help request mails can go out.

```text quoted
neodesk billing mail-status [flags]
```

Needs billing.view; only reads. Calls `GET /api/panel/commercialization/smtp-status`.

## neodesk billing package-create

Make a billing package.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk billing package-create [flags]
```

Needs billing.manage; changes something: needs a token with read and write access. Calls `POST /api/panel/billing/packages`.

## neodesk billing package-delete

Delete a billing package.

```text quoted
neodesk billing package-delete <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

Needs billing.manage; changes something: needs a token with read and write access; deletes or ends something for good, so it asks first unless --yes is given. Calls `DELETE /api/panel/billing/packages/{id}`.

## neodesk billing package-preview

Show what a package would bill.

```text quoted
neodesk billing package-preview <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

Needs billing.view; only reads. Calls `GET /api/panel/billing/packages/{id}/preview`.

## neodesk billing package-set

Change a billing package.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk billing package-set <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

Needs billing.manage; changes something: needs a token with read and write access. Calls `PUT /api/panel/billing/packages/{id}`.

## neodesk billing packages

List billing packages.

```text quoted
neodesk billing packages [flags]
```

Needs billing.view; only reads. Calls `GET /api/panel/billing/packages`.

## neodesk billing reports

List billing reports.

```text quoted
neodesk billing reports [flags]
```

Needs billing.view; only reads. Calls `GET /api/panel/billing/reports`.

## neodesk billing reports-export

Export billing reports as CSV (use --output).

```text quoted
neodesk billing reports-export [flags]
```

Needs billing.export; only reads. Calls `GET /api/panel/billing/reports/export`.

## neodesk billing session-report

Write the report of a billed session.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk billing session-report <id> [flags]
```

| Argument | What it is |
|---|---|
| `<id>` | The ID |

Needs billing.reports; changes something: needs a token with read and write access. Calls `POST /api/panel/billing/sessions/{id}/report`.

## neodesk billing sessions

List billed sessions.

```text quoted
neodesk billing sessions [flags]
```

Needs billing.view; only reads. Calls `GET /api/panel/billing/sessions`.

## neodesk billing sessions-export

Export billed sessions as CSV (use --output).

```text quoted
neodesk billing sessions-export [flags]
```

Needs billing.export; only reads. Calls `GET /api/panel/billing/sessions/export`.

## neodesk billing sessions-pending

Show the billed session of a device that waits for its report.

```text quoted
neodesk billing sessions-pending [flags]
```

Needs billing.reports; only reads. Calls `GET /api/panel/billing/sessions/pending`.

## neodesk billing stats

Show billing totals.

```text quoted
neodesk billing stats [flags]
```

Needs billing.view; only reads. Calls `GET /api/panel/billing/stats`.

## neodesk billing timesync

Show how far the server's clock is off.

```text quoted
neodesk billing timesync [flags]
```

Needs a signed-in account; only reads. Calls `GET /api/panel/billing/timesync/status`.

## neodesk billing timesync-check

Check the server's clock against time servers now.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk billing timesync-check [flags]
```

Needs server.config; changes something: needs a token with read and write access. Calls `POST /api/panel/billing/timesync/check`.

## neodesk billing timezone

Show the server's time zone as the billing clock sees it.

```text quoted
neodesk billing timezone [flags]
```

Needs a signed-in account; only reads. Calls `GET /api/panel/billing/clock/detect-timezone`.
