---
title: NeoDesk and RustDesk Server OSS compared
description: RustDesk's free server is hbbs and hbbr. NeoDesk does their job in one program and adds a web console, accounts and sign-in. Facts and moving over.
order: 2
og: comparison
product: RustDesk Server OSS
---

RustDesk Server OSS is RustDesk's free server: two programs, hbbs and hbbr.
NeoDesk does the same work in one program and adds the API the client signs in
to, a web console, accounts and sign-in. Both are free and licensed under the
AGPL-3.0, and both work with the stock RustDesk client. Every fact about
RustDesk Server OSS on this page comes from RustDesk's own pages and its GitHub
repository, read on 25 November 2026 and listed under [Sources](#sources).

## Who each one suits

**RustDesk Server OSS** suits you when the client only needs a server to
register with and a relay: you set up each client by hand, and you need no
accounts, address book, console or log. It comes from the team that makes the
client.

**NeoDesk** suits you when you want that plus a device list, accounts that
sign in to the client, LDAP or OIDC sign-in, approval of new devices and an
audit log, without buying Server Pro. If you run hbbs and hbbr today, NeoDesk
takes over their key, so your clients keep working.

## The facts side by side

| | NeoDesk | RustDesk Server OSS |
|---|---|---|
| License | AGPL-3.0 | AGPL-3.0 |
| Price | Free | Free |
| Programs | One, `neodesk-server`: ID server, relay, client API and web console | Two: hbbs for ID, rendezvous and signaling, hbbr for the relay |
| Install | Docker, a script for Linux with systemd, a script for 64-bit Windows | Docker (recommended), an install script hosted by Techahold, .deb packages, Windows with PM2 or NSSM, Synology. Release builds for Linux on x86 and ARM and for 64-bit Windows |
| Ports clients need | 21115 to 21117 and 21121 over TCP, 21116 over UDP | 21115 to 21117 over TCP, 21116 over UDP. 21118 and 21119 only for the web client |
| Web console, accounts, API, OIDC, LDAP, 2FA, device management | Yes | Not included. RustDesk's docs point to Server Pro for these |
| Address book in the client | Yes, personal and shared per organization | RustDesk lists the address book among the reasons to choose Server Pro over OSS |
| Command-line tools | `neodesk-server reset-password`, and the installers' update, status and backup commands | rustdesk-utils |
| Key | NeoDesk reads RustDesk's `id_ed25519` key files as they are | Clients need the server's public key. hbbs keeps the key pair in `id_ed25519` and `id_ed25519.pub` |

## What RustDesk Server OSS does better

- **The client's own team.** RustDesk makes the client and this server.
  NeoDesk is a separate project that speaks the client's protocol.
- **Less to run.** Two programs with no web app and no accounts. NeoDesk adds a
  console, a client API on 21121 and accounts, which is more to set up, update
  and back up.
- **More ways to install.** RustDesk has guides for Docker, a Linux install
  script, .deb packages, Windows services and Synology NAS, and publishes
  builds for Linux on x86 and ARM, 32 and 64 bit.
- **A longer history.** Its first release on GitHub, 1.1.5, came out in March
  2022, and the latest, 1.1.16, in July 2026. NeoDesk has only pre-releases so
  far, the first from November 2026.

## What NeoDesk does differently

- **One program.** `neodesk-server` runs the ID server, the relay, the API for
  clients and the console; see [Introduction](/docs/getting-started/introduction).
- **Accounts in the client.** People sign in to the stock RustDesk client with
  their console account, a directory account through
  [LDAP or Active Directory](/docs/people/ldap), or [single sign-on](/docs/people/oidc),
  and get their address book. [Organizations](/docs/people/organizations) share
  one address book with their members.
- **Approval before access.** In the Managed mode a new device waits under
  **Enrollment requests** until someone approves it; see
  [Enrollment](/docs/console/enrollment).
- **A console.** The [device list](/docs/console/devices), users and roles, an
  [audit log](/docs/console/activity), [remote desktop in the browser](/docs/console/remote-in-browser)
  and [quick support links](/docs/console/quick-support).
- **A client without a public server.** RustDesk's client docs say the stock
  client connects to RustDesk's public servers once it is installed; you point
  it at your server in its network settings. NeoDesk's own client has no public
  server built in, and [Add a computer](/docs/console/add-a-computer) joins it
  to your server from an invite link.

## License and cost

Both servers are free and licensed under the AGPL-3.0. You may use, change and
run them, for commercial work too. If you change one and offer it as a network
service, you share your changes with the people who use it. Neither has a paid
plan; RustDesk sells its console and accounts as
[Server Pro](/docs/compare/rustdesk-server-pro). For NeoDesk, paid support and
help with a setup are available on request at
[support@neode.sk](mailto:support@neode.sk); see
[Price and support](/docs/project/license#price-and-support).

## Move from RustDesk Server OSS to NeoDesk

[Move from a RustDesk server](/docs/getting-started/migrate-from-rustdesk) has
every step, on Linux, Windows and Docker. In short:

1. Copy the old data folder with `id_ed25519`, `id_ed25519.pub` and
   `db_v2.sqlite3`, then stop hbbs and hbbr.
2. Give NeoDesk the old key pair: before the install on Linux and Windows, into
   the container after it in Docker.
3. Run NeoDesk at the old address, or point the old DNS name at the new server.
4. Let the clients in: approve them under **Enrollment requests**, or switch to
   Open while they come back.

The clients keep their settings and their IDs. The device list starts empty
and fills as the clients connect; on PostgreSQL the installer can copy the
devices from RustDesk's database.

RustDesk is made by Purslane Tech Pte. Ltd. NeoDesk is not affiliated with or
endorsed by RustDesk or Purslane Tech; see [License](/docs/project/license#trademark).

## Sources

Every page below was read on 25 November 2026.

- [rustdesk.com, Server OSS docs](https://rustdesk.com/docs/en/self-host/rustdesk-server-oss/):
  Server OSS is free and open source, hbbs handles ID, rendezvous and
  signaling, hbbr the relay, the install guides, and the web console, API,
  OIDC, LDAP, 2FA and device management that RustDesk points to Server Pro
  for.
- [rustdesk.com, Server OSS installation docs](https://rustdesk.com/docs/en/self-host/rustdesk-server-oss/install/):
  Docker as the recommended install, the install script hosted by Techahold,
  .deb packages from the releases page, and the ID server and public key
  clients need.
- [rustdesk.com, Server OSS Docker docs](https://rustdesk.com/docs/en/self-host/rustdesk-server-oss/docker/):
  the ports, and that 21118 and 21119 serve only the web client and can stay
  closed without it.
- [rustdesk.com, Server OSS on Windows](https://rustdesk.com/docs/en/self-host/rustdesk-server-oss/windows/):
  running hbbs and hbbr with PM2 or NSSM.
- [rustdesk.com, Server OSS on Synology](https://rustdesk.com/docs/en/self-host/rustdesk-server-oss/synology/):
  guides for DSM 6 and DSM 7.2 Container Manager.
- [rustdesk.com, Server Pro docs](https://rustdesk.com/docs/en/self-host/rustdesk-server-pro/):
  accounts, web console, address book and log management among the reasons
  to choose Server Pro when OSS is not enough.
- [rustdesk.com, pricing](https://rustdesk.com/pricing): self-hosting with
  OSS costs nothing, and Server Pro has paid plans.
- [github.com, rustdesk/rustdesk-server](https://github.com/rustdesk/rustdesk-server):
  the AGPL-3.0 license, and the three programs the build makes: hbbs, hbbr and
  rustdesk-utils.
- [github.com, license of rustdesk/rustdesk-server](https://github.com/rustdesk/rustdesk-server/blob/master/LICENSE):
  the AGPL-3.0 terms for use, changes and network services.
- [github.com, rustdesk-server source, common.rs](https://github.com/rustdesk/rustdesk-server/blob/master/src/common.rs)
  and [peer.rs](https://github.com/rustdesk/rustdesk-server/blob/master/src/peer.rs):
  the key files `id_ed25519` and `id_ed25519.pub`, and the database
  `db_v2.sqlite3`.
- [github.com, releases of rustdesk/rustdesk-server](https://github.com/rustdesk/rustdesk-server/releases):
  the oldest release, 1.1.5 from March 2022, the latest, 1.1.16 from July
  2026, and the builds for Linux on x86 and ARM and for 64-bit Windows.
- [rustdesk.com, client docs](https://rustdesk.com/docs/en/client/): the
  client connects to the public servers once installed, and you enter your
  ID server, relay and key under Network in its settings.
- [rustdesk.com, terms](https://rustdesk.com/terms): Purslane Tech Pte. Ltd.
  runs the public ID and relay servers and releases the client and Server OSS
  under an open source license.
