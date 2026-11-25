---
title: NeoDesk and RustDesk Server Pro compared
description: NeoDesk is a free, open-source alternative to RustDesk Server Pro. What each one has, what Pro does better, licenses, prices and how to move over.
order: 1
og: comparison
product: RustDesk Server Pro
---

Both are servers for the RustDesk client that you run yourself, with a web
console, accounts and an audit log. RustDesk Server Pro is RustDesk's paid
server. NeoDesk is open source under the AGPL-3.0 and has no paid plan. Every
fact about Server Pro on this page comes from RustDesk's own pages, read on
23 November 2026 and listed under [Sources](#sources).

## Who each one suits

**RustDesk Server Pro** suits you when you want to buy the server from the
company that makes the client, when you want clients that come with your server
already set (the custom client generator, from the Basic plan), or when you
need relay servers in more than one place.

**NeoDesk** suits you when you want the console, accounts, LDAP or OIDC sign-in
and an audit log on your own server without a license fee, a limit on users or
devices, or a license check. It also puts computers with MeshCentral's agent
and RDP or VNC hosts into the same device list.

## The facts side by side

| | NeoDesk | RustDesk Server Pro |
|---|---|---|
| License | AGPL-3.0 | Proprietary: "commercial, proprietary self-hosted server software" |
| Price | Free | From $11.88 a month, billed annually, as of 23 November 2026 |
| Users and devices | No limit set by a license | Individual plan: 1 login user and 20 managed devices. Basic: 10 users and 100 devices. More on the Customized plans |
| License check | None | The server contacts rustdesk.com about once a day. A fully air-gapped install isn't supported |
| Install | Docker, Linux with systemd, or 64-bit Windows | Docker, or install.sh on Linux with systemd. RustDesk marks the Windows install as deprecated |
| Web console | Yes | Yes, on every paid plan |
| Two-factor sign-in | Yes | Yes, on every paid plan |
| LDAP and OIDC | Yes | From the Basic plan |
| Address book | Personal address books, and a shared one per organization | Yes, on every paid plan |
| Logs | Console actions, server events, and the connection, file transfer and alarm records clients send. Kept 90 days | Connection, file transfer, alarm and console logs. You set how long they are kept, or keep them indefinitely |
| Remote desktop in the browser | The console's web viewer, on every install | The self-hosted web client, only on plans where users × 10 + devices comes to 400 or more |
| Relay servers | One relay, built into the server | Distributed relay servers on every paid plan |
| Client with your server preset | No custom build. NeoDesk's own client joins your server from an invite link | Custom client generator, from the Basic plan |
| What connects | The stock RustDesk client, NeoDesk's client, the unmodified MeshAgent, and RDP and VNC hosts | The RustDesk client |

## What Server Pro does better

- **One vendor for client and server.** RustDesk makes the client and Server
  Pro. NeoDesk is a separate project that speaks the client's protocol.
- **Clients with your server built in.** The custom client generator, from the
  Basic plan, builds a client that already points at your server. NeoDesk
  builds no custom client: you enter four values in the stock client, or
  import them as one string, and only NeoDesk's own client sets itself up from
  an invite link.
- **Several relays.** Every paid plan has distributed relay servers. NeoDesk
  gives every device one relay address.
- **Longer log retention.** Pro keeps logs as long as you set, indefinitely
  too. NeoDesk deletes its records after 90 days. Only the server's own events
  can also go to a file you keep, with `AUDIT_LOG_FILE`; see
  [Monitoring](/docs/operations/monitoring#audit-entries).

## What NeoDesk does differently

- **No license to buy.** There is no fee, no plan and no user or device limit,
  and the server checks no license with anyone. [Privacy](/docs/project/privacy)
  lists every host it contacts.
- **Sign-in options on every install.** [LDAP and Active Directory](/docs/people/ldap),
  [OIDC](/docs/people/oidc) and [two-factor sign-in](/docs/people/two-factor)
  are all there. Directory and single sign-on accounts also sign in to the
  stock RustDesk client.
- **Approval before access.** In the Managed mode a new device waits under
  **Enrollment requests** until someone approves it; see
  [Enrollment](/docs/console/enrollment).
- **Remote desktop in the browser** on every install, for desktop and tablet
  browsers; see [Remote desktop in the browser](/docs/console/remote-in-browser).
- **Help without setup.** [Quick support](/docs/console/quick-support) makes a
  link that works once for one hour: the person downloads a small app, clicks
  **Allow**, and nothing gets installed. [Add a computer](/docs/console/add-a-computer)
  makes an invite link that installs NeoDesk's client and joins the computer,
  already approved.
- **Other kinds of device.** Computers with the unmodified
  [MeshAgent](/docs/console/meshagent), and [RDP and VNC hosts](/docs/console/remote-targets)
  through the Guacamole daemon, show in the same device list.
- **Windows and PostgreSQL.** [Windows](/docs/getting-started/windows) is a
  normal install, and the database is SQLite or
  [PostgreSQL](/docs/operations/postgresql).

It also has limits that Pro users may not expect. Browser sessions to RustDesk
devices always go through the relay. There is no NeoDesk app for phones: phones
use the RustDesk app. A guest access link can't be ended before it expires.

## License and cost

RustDesk sells Server Pro as annual plans in US dollars. RustDesk's pricing
page says it is "NOT a SaaS subscription": you run the server yourself. Plans
don't renew on their own, and RustDesk emails a reminder 14 days before a
license expires. The plans as of 23 November 2026, each billed annually:

| Plan | Price | Includes |
|---|---|---|
| Free | $0 | Online status and community support |
| Individual | $11.88 a month | 1 login user, 20 managed devices, unlimited concurrent connections, 2FA, web console, address book, audit log, change ID, access control, centralized settings, distributed relay servers |
| Basic | $23.88 a month | 10 login users and 100 managed devices, plus OIDC, LDAP, cross-group access and the custom client generator |
| Customized | from $23.88 a month | Basic, plus $1.20 for each additional user and $0.12 for each additional device |
| Customized V2 | from $23.88 a month | Basic with limited concurrent connections, plus $24 for each additional concurrent connection |

NeoDesk costs nothing. The AGPL-3.0 lets you use, change and run it, for
commercial work too. If you change it and offer it as a network service, you
share your changes with the people who use it. An optional Commercial Grant
for private changes comes with a sponsorship of $50 a month or more; nobody
needs it to run NeoDesk. There is no paid support and no guaranteed SLA. See
[License](/docs/project/license).

## Move from Server Pro to NeoDesk

NeoDesk's [move guide](/docs/getting-started/migrate-from-rustdesk) is written
for RustDesk's free server, hbbs and hbbr: you keep the key pair and the
address, so the clients connect to NeoDesk as before. For Server Pro, keep
these points in mind:

- RustDesk's own docs move a free server to Pro by copying its `id_ed25519`
  file, so a Pro server keeps its key in the same kind of file. NeoDesk's docs
  don't cover a Pro install, so try the key with one test client before you
  move everyone.
- NeoDesk imports nothing from Pro. Set up users, groups, address books and
  sign-in again in the console. Pro's logs stay with Pro.
- Each client joins as a new device. In the Managed mode it waits for
  approval, or you switch to Open while the clients come back; see
  [Let the clients back in](/docs/getting-started/migrate-from-rustdesk#let-the-clients-back-in).
- Pro plans don't renew on their own, so nothing needs cancelling.

"RustDesk" is a trademark of the RustDesk Team. NeoDesk is not affiliated with
or endorsed by the RustDesk Team; see [License](/docs/project/license#trademark).

## Sources

Every page below was read on 23 November 2026.

- [rustdesk.com, pricing](https://rustdesk.com/pricing): plans, prices,
  limits, billing, renewal and the web client condition.
- [rustdesk.com, Server Pro docs](https://rustdesk.com/docs/en/self-host/rustdesk-server-pro/):
  install methods and the deprecated Windows install.
- [rustdesk.com, Server Pro web console docs](https://rustdesk.com/docs/en/self-host/rustdesk-server-pro/console/):
  log types and how long logs are kept.
- [rustdesk.com, Server Pro installation docs](https://rustdesk.com/docs/en/self-host/rustdesk-server-pro/installscript/):
  moving the `id_ed25519` key from the free server to Pro.
- [rustdesk.com, blog post on offline and air-gapped use](https://rustdesk.com/blog/rustdesk-server-pro-offline-air-gapped/):
  the daily license check and air-gapped installs.
- [rustdesk.com, blog post on unattended access](https://rustdesk.com/blog/rustdesk-unattended-access-setup/):
  "Server Pro is commercial, proprietary self-hosted server software."
