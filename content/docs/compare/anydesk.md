---
title: NeoDesk and AnyDesk compared
description: A self-hosted alternative to AnyDesk. How NeoDesk and AnyDesk differ in hosting, plans, sign-in and platforms, and how to move over.
order: 5
og: comparison
product: AnyDesk
---

AnyDesk is a remote access service with yearly subscriptions. Its top plan,
Ultimate, can be hosted in AnyDesk's cloud or On-Premises, on an appliance in
your network. NeoDesk is a server you run yourself, open source
under the AGPL-3.0, that the RustDesk client and NeoDesk's own client connect
to. Every fact about AnyDesk on this page comes from AnyDesk's own help
center, read on 23 November 2026 and listed under [Sources](#sources).

## Who each one suits

**AnyDesk** suits you when you want a hosted service and no server of your
own, when you need its clients on older or unusual systems, or when you need a
vendor's appliance that works without an internet connection.

**NeoDesk** suits you when you want your own server and directory sign-in
without buying the top plan, or when your devices already use the RustDesk
client.

## The facts side by side

| | NeoDesk | AnyDesk |
|---|---|---|
| Who runs the servers | You | AnyDesk, in its cloud. Ultimate can also be hosted On-Premises |
| Own servers | The whole server is yours | On-Premises, on Ultimate only: an appliance on physical or virtual hardware in your network. "Only custom AnyDesk clients created in your my.anydesk portal can connect to each other" |
| License | AGPL-3.0 | Paid subscriptions. For commercial use, only outgoing clients that start connections need a license |
| Price | Free | Not quoted here; see AnyDesk's pricing page |
| Billing | None | Yearly, paid upfront, in a currency set by your country. Renews every year unless you cancel at least 30 days before |
| Users | No limit set by a license | Solo 1, Standard 20, Advanced 100, Ultimate on request |
| Directory and single sign-on | LDAP and Active Directory, and OIDC, on every install | OIDC and LDAP on Ultimate Cloud |
| API | An HTTP API with API keys | A REST API on Standard, Advanced, Ultimate Cloud and On-Premises |
| Console | The web console on your server | The my.anydesk portal |
| Phones and tablets | Phones control through the RustDesk app. NeoDesk's browser viewer runs on tablets | Android 5 and newer, where control needs a plugin. iOS and iPadOS 16 and newer can't be controlled remotely |
| Computers it reaches | Devices with the RustDesk client, NeoDesk's client on Windows, macOS and Linux, the MeshAgent, and RDP and VNC hosts | Windows XP SP2 and newer, macOS 11 and newer, Linux with Xorg for incoming sessions, Raspberry Pi OS 12 |

AnyDesk's plans, from its licenses page:

| Plan | Licensed users | Outgoing connections at a time | Managed devices |
|---|---|---|---|
| Solo | 1 | 1 | Up to 100 |
| Standard | 20 | 1, up to 19 more as an add-on | Up to 500 |
| Advanced | 100 | 2, up to 48 more as an add-on | Up to 1,000 |
| Ultimate | On request | On request | On request |

## What AnyDesk does better

- **No server to run.** On the cloud plans AnyDesk runs everything. With
  NeoDesk you install, update and back up the server, and relayed sessions use
  your bandwidth.
- **Sessions without the internet.** AnyDesk On-Premises starts sessions
  without an internet connection, as long as both devices reach the appliance.
  NeoDesk's docs don't cover running without internet access;
  [Privacy](/docs/project/privacy) lists the outside hosts the server contacts.
- **Older and unusual systems.** AnyDesk lists Windows back to XP SP2,
  Raspberry Pi OS and tvOS.

## What NeoDesk does differently

- **Your server, whatever you use it for.** The ID server, the relay and the
  console run where you put them, and there is no top tier to buy first. The
  stock RustDesk client connects without a custom build; see
  [Connect a RustDesk client](/docs/getting-started/connect-a-client).
- **Directory sign-in on every install.** [LDAP and Active Directory](/docs/people/ldap)
  and [OIDC](/docs/people/oidc) sign people in to the console and to the
  RustDesk client.
- **No licensed clients.** You don't count users, outgoing connections or
  managed devices. [Users and roles](/docs/people/users-and-roles) decide what
  each person may do and which devices they see.
- **RDP and VNC.** [RDP and VNC hosts](/docs/console/remote-targets) open in
  the browser viewer without an agent on them.
- **No analytics.** NeoDesk sends no analytics, crash reports or usage data.

## License and cost

AnyDesk sells subscriptions that are billed yearly and paid upfront, in a
currency set by your country. They renew every year unless you cancel at
least 30 days before the renewal date. For commercial use, only the clients
that start connections need a license; clients that only receive sessions
don't. The free version has session timeouts, and AnyDesk suggests a paid
license to avoid them. This page quotes no prices; AnyDesk's pricing page has
them.

NeoDesk costs nothing. You may use, change and run it, for commercial work
too. If you change it and offer it as a network service, you share your
changes with the people who use it. There is no paid support. See
[License](/docs/project/license).

## Move from AnyDesk to NeoDesk

NeoDesk imports nothing from AnyDesk, so you set the devices up again:

1. Install the server with [Docker](/docs/getting-started/docker), on
   [Linux](/docs/getting-started/linux) or on [Windows](/docs/getting-started/windows),
   and put the console behind [TLS](/docs/operations/reverse-proxy-tls).
2. Roll out a client. [Set up many computers at once](/docs/getting-started/connect-a-client/many-computers)
   covers an invite link that installs NeoDesk's client on many computers, and
   a Windows script that sets up the stock RustDesk client.
3. For access when nobody is at a computer, set a permanent password on it;
   see [Unattended access](/docs/console/unattended-access).
4. For one-off help, send a [quick support](/docs/console/quick-support) link.
5. Cancel AnyDesk at least 30 days before its renewal date.

AnyDesk is a trademark of its owner. NeoDesk is not affiliated with AnyDesk.

## Sources

Every page below was read on 23 November 2026.

- [support.anydesk.com, AnyDesk licenses](https://support.anydesk.com/docs/anydesk-licenses):
  users, connections and managed devices per plan, and Ultimate in the cloud
  or On-Premises.
- [support.anydesk.com, On-Premises](https://support.anydesk.com/docs/on-premises):
  the appliance, sessions without internet, and custom clients only.
- [support.anydesk.com, billing](https://support.anydesk.com/docs/billing-pricing-subscriptions):
  yearly billing, currency, renewal and the 30 days' notice.
- [support.anydesk.com, licensing model](https://support.anydesk.com/docs/how-does-the-anydesk-licensing-model-work):
  only outgoing clients need a license for commercial use.
- [support.anydesk.com, single sign-on](https://support.anydesk.com/docs/single-sign-on-sso):
  OIDC and LDAP on Ultimate Cloud.
- [support.anydesk.com, REST API](https://support.anydesk.com/docs/rest-api):
  the plans with the REST API.
- [support.anydesk.com, supported operating systems](https://support.anydesk.com/docs/supported-operating-systems):
  the systems AnyDesk runs on, and what works on phones.
- [support.anydesk.com, longer sessions on the free version](https://support.anydesk.com/docs/what-if-i-need-longer-sessions-time-on-the-free-version):
  session timeouts on the free version.
