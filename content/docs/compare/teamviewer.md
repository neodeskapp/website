---
title: NeoDesk and TeamViewer compared
description: A self-hosted alternative to TeamViewer. How NeoDesk and TeamViewer differ in hosting, plans, sign-in and platforms, and how to move over.
order: 4
seoTitle: Free self-hosted TeamViewer alternative: NeoDesk compared
og: comparison
product: TeamViewer
logo: teamviewer.svg
---

TeamViewer is a remote access service: TeamViewer runs the servers, and you
buy a yearly subscription. NeoDesk is a server you run yourself, open source
under the AGPL-3.0, that the RustDesk client and NeoDesk's own client connect
to. Every fact about TeamViewer on this page comes from TeamViewer's own pages,
read on 25 November 2026 and listed under [Sources](#sources).

## Who each one suits

**TeamViewer** suits you when you don't want to run a server, when you support
many phones and tablets, when you need single sign-on with user provisioning
from Entra ID, or when you need a vendor that is audited against ISO 27001 and
SOC 2.

**NeoDesk** suits you when the server should run on your own machine or in
your own data center, or when you want no licensing per user or per channel
for work use.

## The facts side by side

| | NeoDesk | TeamViewer |
|---|---|---|
| Who runs the servers | You | TeamViewer. A connection starts with a handshake through TeamViewer's master servers, then goes direct or through TeamViewer's routers. Session traffic is end-to-end encrypted |
| Own servers | The whole server is yours | Only for Tensor customers with the Conditional Access add-on: routers on your premises, bought from TeamViewer and set up with a paid services package, while "initial connection setup is made via the TeamViewer cloud" |
| License | AGPL-3.0 | Paid subscriptions. The free version is for personal, non-commercial use |
| Price | Free | Not quoted here; see TeamViewer's pricing page |
| Billing | None | Paid yearly. The subscription renews every 12 months unless you cancel at least 28 days before the term ends |
| Users and sessions | No limit set by a license | Per plan, from 1 user and 3 sessions on Remote Access to 30 users and 15 sessions on Corporate |
| Two-factor sign-in | Yes | Yes, in every plan |
| Directory and single sign-on | LDAP and Active Directory, and OIDC, on every install | AD Connector on Corporate and Tensor. On Tensor, single sign-on with Entra ID, Okta, OneLogin, Google, ADFS and Centrify, and SCIM provisioning from Entra ID |
| Audit | The console's audit log and the server's events | Connection reports on Corporate and Tensor. An audit log and API on Tensor |
| Help without setup | A quick support link and a small app that installs nothing | QuickSupport, listed for Business, Corporate and Tensor |
| Recording sessions | In the browser viewer, as a WebM file | "Record and playback remote sessions" on Business, Corporate and Tensor |
| Phones and tablets | Phones control through the RustDesk app. NeoDesk's browser viewer runs on tablets | Remote Control and QuickSupport apps for Android 8 and newer and for iOS and iPadOS 17 and newer, plus a Host app for Android. Connecting to mobile devices needs the Mobile Device Support add-on, which Business, Premium, Corporate and Tensor can buy |
| Computers it reaches | Devices with the RustDesk client, NeoDesk's client on Windows, macOS and Linux, the MeshAgent, and RDP and VNC hosts | Windows 11, also on ARM, and macOS 14 and newer. Windows 10 22H2 and Windows Server 2016 to 2022 are listed with support until October 2026. Linux through TeamViewer Classic. ChromeOS through the Android apps, as screen sharing only |

TeamViewer's plans, from its licenses overview:

| Plan | Licensed users | Sessions at a time | Managed devices |
|---|---|---|---|
| Remote Access | 1 | Up to 3, on one device, to at most 3 remote devices | Not stated |
| Business | 1 | Up to 3, on one device, from a fixed set of 3 devices | 200 |
| Premium | 15 | Up to 10, on one device | 300 |
| Corporate | 30 | Up to 15, on three devices | 500 |

## What TeamViewer does better

- **No server to run.** TeamViewer runs the infrastructure, with a network of
  routers for connections that can't go direct, and you don't open any ports.
  With NeoDesk you install, update and back up the server, and relayed
  sessions use your bandwidth.
- **Phones and tablets.** TeamViewer has its own apps for Android and iOS, and
  with an add-on it connects to mobile devices. NeoDesk has no app for phones;
  phones use the RustDesk app, and RustDesk's docs say an iPhone or iPad can't
  be controlled remotely.
- **User provisioning.** Tensor has single sign-on with several identity
  providers and SCIM provisioning from Entra ID. NeoDesk signs people in
  through OIDC or LDAP and makes their account at the first sign-in, but has
  no SCIM.
- **Audits and compliance.** TeamViewer says it is audited against ISO 27001,
  SOC 2 Type 2, SOC 3 and HIPAA HITECH, that its data centers comply with
  ISO 27001, and that servers storing sensitive data are in Germany or
  Austria. With NeoDesk, those checks fall to whoever runs the server.

## What NeoDesk does differently

- **Your server.** The ID server, the relay and the console run where you put
  them. NeoDesk sends no analytics, crash reports or usage data;
  [Privacy](/docs/project/privacy) lists every host the server contacts.
- **Work use is allowed.** The AGPL-3.0 lets you use NeoDesk for commercial
  work. TeamViewer's free version is for personal use, and TeamViewer counts
  home office as commercial use.
- **No seats or channels.** Add as many accounts and devices as you need.
  [Users and roles](/docs/people/users-and-roles) decide what each person may
  do and which devices they see.
- **Sign-in from your directory on every install.**
  [LDAP and Active Directory](/docs/people/ldap) and [OIDC](/docs/people/oidc)
  sign people in to the console and to the RustDesk client.
- **RDP and VNC.** [RDP and VNC hosts](/docs/console/remote-targets) open in
  the browser viewer without an agent on them.

## License and cost

TeamViewer sells subscriptions that are paid and renewed every year, and they
renew on their own unless you cancel at least 28 days before the term ends.
The free version is for personal use: helping family and friends, or reaching
your own computers, not servers, that aren't used in a commercial
environment. TeamViewer defines commercial use as "any use of TeamViewer for
purposes that are either directly or indirectly paid for", home office
included. This page quotes no prices; TeamViewer's pricing page has them.

NeoDesk costs nothing. You may use, change and run it, for commercial work
too. If you change it and offer it as a network service, you share your
changes with the people who use it. There is no paid version. Help is free on the
[NeoDesk Discord](https://discord.gg/nwERSawufr) and in the
[discussions on GitHub](https://github.com/neodeskapp/neodesk/discussions);
paid support and help with a setup are available on request at
[support@neode.sk](mailto:support@neode.sk). See
[Price and support](/docs/project/license#price-and-support).

## Move from TeamViewer to NeoDesk

NeoDesk imports nothing from TeamViewer, so you set the devices up again:

1. Install the server with [Docker](/docs/getting-started/docker), on
   [Linux](/docs/getting-started/linux) or on [Windows](/docs/getting-started/windows),
   and put the console behind [TLS](/docs/operations/reverse-proxy-tls).
2. Roll out a client. [Set up many computers at once](/docs/getting-started/connect-a-client/many-computers)
   covers an invite link that installs NeoDesk's client on many computers, and
   a Windows script that sets up the stock RustDesk client.
3. For access when nobody is at a computer, set a permanent password on it;
   see [Unattended access](/docs/console/unattended-access).
4. For one-off help, send a [quick support](/docs/console/quick-support) link.
5. Cancel TeamViewer at least 28 days before its term ends, in the TeamViewer
   Customer Portal, with a written ticket or by phone.

TeamViewer is a trademark of its owner. NeoDesk is not affiliated with
TeamViewer.

## Sources

Every page below was read on 25 November 2026.

- [teamviewer.com, pricing](https://www.teamviewer.com/en/pricing/): yearly
  billing, automatic renewal every 12 months and the 28 days' notice.
- [teamviewer.com, all about subscription](https://www.teamviewer.com/en-us/global/support/knowledge-base/teamviewer-classic/licensing/subscription/all-about-subscription/):
  yearly billing, automatic renewal, the 28 days' notice and the three ways
  to cancel.
- [teamviewer.com, licenses overview](https://www.teamviewer.com/en/global/support/knowledge-base/teamviewer-classic/licensing/purchase/licenses-overview/):
  users, sessions, devices and managed devices per plan, and the Mobile
  Device Support add-on and the plans that can buy it.
- [teamviewer.com, product description of TeamViewer Remote, formerly TeamViewer Core](https://www.teamviewer.com/en/product-descriptions/teamviewer-core/):
  the free version for personal, non-commercial use, and two-factor
  authentication in every plan.
- [teamviewer.com, suspected commercial use](https://www.teamviewer.com/en/global/support/knowledge-base/teamviewer-classic/licensing/personal-use/commercial-use-suspected/):
  what counts as commercial use and as personal use, home office included.
- [teamviewer.com, security statement](https://www.teamviewer.com/en/global/support/knowledge-base/teamviewer-remote/security/security-statement/):
  the handshake through the master servers, the router network, no open
  ports, end-to-end encryption, the audits and where the servers are.
- [teamviewer.com, hybrid conditional access](https://www.teamviewer.com/en/global/support/knowledge-base/teamviewer-tensor/conditional-access/hybrid-conditional-access/):
  routers on your premises for Tensor with the Conditional Access add-on,
  bought from TeamViewer and set up with a services package.
- [teamviewer.com, Business license features](https://www.teamviewer.com/en-us/global/support/knowledge-base/teamviewer-remote/licenses/licenses-and-features/business-license-feature-overview/):
  QuickSupport, recording and two-factor authentication on Business.
- [teamviewer.com, Corporate license features](https://www.teamviewer.com/en/global/support/knowledge-base/teamviewer-remote/licenses/licenses-and-features/corporate-license-feature-overview/):
  the AD Connector, connection reports, QuickSupport and recording on
  Corporate.
- [teamviewer.com, Tensor license features](https://www.teamviewer.com/en/global/support/knowledge-base/teamviewer-remote/licenses/licenses-and-features/tensor-license-feature-overview/):
  single sign-on and its identity providers, SCIM from Entra ID, the AD
  Connector, the audit log, connection reports, QuickSupport and recording on
  Tensor.
- [teamviewer.com, supported operating systems](https://www.teamviewer.com/en/global/support/knowledge-base/teamviewer-remote/download-and-installation/supported-operating-systems-for-teamviewer-remote/):
  the systems TeamViewer Remote runs on, the mobile app versions and the
  support end dates.
- [rustdesk.com, client docs](https://rustdesk.com/docs/en/client/): iOS
  can't be controlled remotely.
