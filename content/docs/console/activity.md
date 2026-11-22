---
title: Activity and audit log
description: The audit log, the server's own events, the security checks, reports and app usage, and who can see them.
order: 8
---

The **Activity** group in the sidebar holds what the console and the server recorded: who did what, what the server logged itself, reports you can generate and keep, and which apps are used on devices. **Security and audit** and **Reports** are listed first; **App usage** and **Billable sessions** usually sit under **More**.

## Who can see it

**Security and audit**, **Reports** and **App usage** need permission to view the audit log. By default every console role has it: Super admin, Server admin, Global admin, Remote operator and Viewer. **Billable sessions** needs permission to view billing, which Super admin, Global admin and Remote operator accounts have by default. An administrator can change both, and can hide whole sections from an account; see [Users and roles](/docs/people/users-and-roles).

## Security and audit

The page has five tabs: **Audit log**, **Server events**, **Security checks**, **Hardening** and **Your sessions**. Each tab loads when you first open it, and the refresh button in the top bar loads the open tab again.

![The audit log with sign-ins and device group changes](shot:security-audit)

### Audit log

Every action people took in this console: sign-ins, bans, approvals, and changes to devices, people and settings.

| Column | Shows |
|---|---|
| **When** | Date and time, to the second |
| **Who** | The account that did it |
| **Action** | What was done, for example "Signed in" or "Device groups changed" |
| **Device** | The device's ID, when the action was about one |
| **Details** | More about the action. Long details are cut after two lines; **Show all** opens them |
| **IP address** | The address the request came from |

Type into **Search by person, action, device or details** to find entries, or narrow the list with **Show**:

- **All actions**
- **Bans and unbans**
- **Sign-ins and sessions**
- **Failed sign-ins**
- **Devices and enrollment**
- **People and roles**
- **Settings and server**

The tab loads the newest 2,000 entries and shows 50 per page. The search and the filter go into the address bar, so you can share or bookmark a filtered view. **Refresh** loads the entries again.

The console replaces passwords, secrets, tokens and keys in the details with three stars before it stores them. It deletes entries older than 90 days.

### Server events

Events the server records itself, 25 per page. **Show** narrows them to one kind: **Failed sign-ins**, **Sign-ins**, **Device banned**, **Device unbanned**, **Address blocked**, **Device approved**, **Configuration changed** or **API key created**. The columns are **When**, **Action**, **Actor**, **Target** and **Details**.

**Actor** names who acted: the account, for an action taken in the console, else the account or API key that called the server, else the address the request came from, as for a sign-in or a device.

The server keeps these events in its database and deletes them after 90 days, so they stay across restarts. Above the table, a chart shows events per day for the last 14 days once the events reach back that far; until then one sentence says which range they cover.

### Security checks

A list of checks, each **Passed** or **Failed**, with what to do about a failed one:

| Check | Passes when |
|---|---|
| **Server API uses TLS** | The server's API is encrypted |
| **No API key is older than 90 days** | Every API key is younger than 90 days |
| **Fewer than 10 failed sign-ins in 24 hours** | The server counted fewer than 10 |
| **Server blocklist is empty** | The server's blocklist has no entries |
| **Server audit log can be read** | The console could read the server's events |
| **Server blocklist can be read** | The console could read the blocklist |

Under the checks are the numbers behind them and whether each server connection is encrypted. **Unknown** means the server doesn't report it.

### Hardening

The hardening settings this server runs with, read from its configuration, each marked **On** or **Off** with its severity and area. There are two:

- **Panel Idle and Absolute Session Timeout** is always on. It says after how many minutes without a request, and how many minutes after sign-in, a console session ends (`SESSION_IDLE_TIMEOUT`, `SESSION_MAX_AGE`).
- **Concurrent Panel Session Limit per Account** is on while `SESSION_MAX_PER_USER` is above 0, and names the current limit. A new sign-in then ends an account's least recently active sessions beyond it.

See [Console, sessions and logs](/docs/operations/configuration#console-sessions-and-logs) to change them.

### Your sessions

Your own sign-ins to this console: whether each is active, the address, when it started, the last activity, when and why it ended, and the browser. By default each account can have one active session, and signing in again ends the previous one; `SESSION_MAX_PER_USER` changes the limit. A line above the table says after how many minutes without activity and how many hours at most a session ends.

## Reports

**Reports** generates summaries and keeps copies.

Under **Create a report**, choose the period with **From** and **To**, or leave both empty for all dates. The period applies to app usage, security events, tickets, network checks and alerts; the device and inventory reports show the current state. Then click **Generate** next to one of the seven reports:

| Report | Contents |
|---|---|
| **Devices** | How many devices there are, how many are online or banned, and which platforms they run |
| **App usage** | Active and idle time and the most used apps, from devices with activity tracking |
| **Security** | Banned devices, data loss prevention events and recent audit log entries |
| **Tickets** | Tickets by status, category and priority |
| **Network checks** | Which monitored hosts are up or down, with their last response time |
| **Inventory** | Operating systems and average memory of devices that send an inventory |
| **Alerts** | Alert rules and the alerts they triggered |

The report shows on the page and isn't kept until you save it. **Download** offers it **As JSON** or **As CSV (main table)**. **Save report** keeps a copy under a name you choose; the copy stays as it was and later changes don't update it.

**Saved reports** in the side column lists the copies with who saved them and when. **Open** shows one again. Saving and deleting copies is limited to Super admin and Global admin accounts.

Below the reports are the same **Trends** charts as on [the overview page](/docs/console/overview#trends).

## App usage

**App usage** shows which apps people use on each device and for how long. The data comes from devices that run the BetterDesk agent with activity tracking turned on; each one reports once a day.

![App usage with daily reports per device and the most used apps](shot:activity)

Find reports with **Search by device name or ID**, a date range with **From** and **To**, or **Last 7 days**, **Last 30 days** and **All dates**. The table lists one row per daily report, newest first, with **Device**, **Report date**, **Active time**, **Idle time** and **App sessions**. **Details** opens the device's time per app and its latest app sessions for the chosen dates.

The side column adds the reports up: **Active and idle time** says how much of the recorded time was active, and **Most used apps** lists the apps with the most time over all devices.

The console deletes app usage data older than 90 days.

## Billable sessions

**Billable sessions** lists the remote sessions counted against support packages: the sessions that still wait for a work report, how much included time each package assignment has used this month, and every session with filters for organization, status and device. It is part of the billing features and only shows for accounts that may view billing.

An ended session waits for a work report only when the server runs with `BILLING_REQUIRE_WORK_REPORT=Y`; without it, a session is closed when it ends. Each session is rounded up to whole blocks of minutes: `BILLING_ROUNDING_MINUTES` sets the block, 1 by default, and a package's contract can set its own.
