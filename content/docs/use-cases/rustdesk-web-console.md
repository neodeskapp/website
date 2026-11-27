---
title: A free web console for your RustDesk clients
description: NeoDesk gives stock RustDesk clients a free web console on your own server: device list, accounts, address book, LDAP or OIDC sign-in and an audit log.
order: 4
og: use-case
seoTitle: Free RustDesk web console on your own server - NeoDesk
related: /docs/compare/rustdesk-server-pro, /docs/compare/rustdesk-server-oss, /docs/getting-started/migrate-from-rustdesk
icon: dashboard
---

You use RustDesk and want a web console for it: one list of your devices,
accounts for the people who help, and a record of who connected where.
RustDesk's free server, hbbs and hbbr, has no console, and RustDesk's console
comes with Server Pro, which is paid. NeoDesk is a server for the stock
RustDesk client that has the console built in, and it is free and open source
under the AGPL-3.0. There is no paid plan and no limit on users or devices.

## What the console does for RustDesk clients

These work with the stock RustDesk client, with nothing else installed:

- **The device list.** Every client that registers shows up with its ID,
  hostname, platform, last seen and status. Search it, and sort devices into
  folders, groups and tags. See [The device list](/docs/console/devices).
- **Connect from the browser.** Open a device and start a remote session in
  the console, without an app on your side. See
  [Remote desktop in the browser](/docs/console/remote-in-browser).
- **Accounts in the client.** People sign in to the RustDesk client with their
  console account and get their address book, personal or shared per
  organization. See [Organizations](/docs/people/organizations).
- **Sign-in your company already has.** [LDAP and Active Directory](/docs/people/ldap),
  [OIDC](/docs/people/oidc) and [two-factor sign-in](/docs/people/two-factor),
  with [roles and permissions](/docs/people/users-and-roles) for each person.
- **Approval before access.** In the Managed mode a new client waits under
  [Join requests](/docs/console/enrollment) until someone approves it.
- **An audit log.** What people do in the console, and the connection and file
  transfer records the clients send. See [Activity](/docs/console/activity).

Telemetry, hardware inventory, client branding, Add a computer, Quick support
and Pair with code need NeoDesk's own client. The
[RustDesk compatibility page](/docs/development/rustdesk-compatibility#what-needs-neodesks-client)
lists what needs it and why.

## Set it up

1. Install NeoDesk. On a Linux server with Docker that is one command:

   ```sh
   curl -fsSL https://neode.sk/install.sh | sudo bash
   ```

   It prints the console's address and the admin password at the end. See
   [Install with Docker](/docs/getting-started/docker), or install
   [on Linux](/docs/getting-started/linux) or [on Windows](/docs/getting-started/windows)
   without Docker.
2. Open the console and sign in. See [First sign-in](/docs/getting-started/first-sign-in).
3. Copy the ID server, relay server, API server and key from **Client setup**
   on the console's [overview page](/docs/console/overview) into each RustDesk
   client's network settings, or scan **Show QR** on a phone. See
   [Connect a RustDesk client](/docs/getting-started/connect-a-client).

## Already running hbbs and hbbr

NeoDesk takes the place of RustDesk's free server. Give it the old server's key
pair and address, and the clients connect to it as before, now with the
console. See [Move from a RustDesk server](/docs/getting-started/migrate-from-rustdesk).

## Next to RustDesk Server Pro

Server Pro is RustDesk's paid server with its own console. NeoDesk has no
license fee and no license check, and Pro has things NeoDesk doesn't, such as
several relay servers and a custom client generator.
[NeoDesk and RustDesk Server Pro compared](/docs/compare/rustdesk-server-pro)
puts the facts side by side, with their sources.

NeoDesk is not affiliated with or endorsed by RustDesk or Purslane Tech; see
[License](/docs/project/license#trademark).
