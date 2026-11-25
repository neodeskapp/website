---
title: NeoDesk and MeshCentral compared
description: MeshCentral manages computers through its own agent. NeoDesk serves RustDesk clients and also takes MeshAgent devices. Facts and moving over.
order: 3
og: comparison
product: MeshCentral
logo: meshcentral.webp
---

MeshCentral and NeoDesk are both open-source servers you run yourself, with a
web console for remote access. MeshCentral is built around its own agent,
MeshAgent. NeoDesk is built around the RustDesk client, and it also speaks
MeshAgent's protocol, so the same agent can connect to either. Every fact about
MeshCentral on this page comes from its own site, docs and repository, read on
25 November 2026 and listed under [Sources](#sources).

## Who each one suits

**MeshCentral** suits you when you manage your own computers from a browser
through one agent, want a terminal and files on every one of them, use Intel
AMT, or need SAML sign-in or a server on macOS or FreeBSD.

**NeoDesk** suits you when your devices use the RustDesk client, when people
should also connect from the RustDesk app, or when you want RustDesk devices,
MeshAgent devices and RDP or VNC hosts in one device list.

## The facts side by side

| | NeoDesk | MeshCentral |
|---|---|---|
| License | AGPL-3.0 | Apache 2.0 |
| Price | Free | Free, available on npm |
| Server runs on | Docker, Linux with systemd (x86-64, arm64, armv7), 64-bit Windows | Windows, Linux, macOS and FreeBSD |
| Install | The published Docker image, or install scripts that download a release. No Node.js needed | `npm install meshcentral`, with Node.js and npm. Its docs also have a Docker guide with an official image |
| Database | SQLite or PostgreSQL | MongoDB, PostgreSQL, MariaDB or MySQL, or a local database: NeDB by default, SQLite or AceBase |
| What connects | The stock RustDesk client, NeoDesk's client, the unmodified MeshAgent, and RDP and VNC hosts without an agent | MeshAgent on Windows, Linux, macOS and FreeBSD, an Android agent, and Intel AMT computers |
| Controlling side | A desktop or tablet browser, the RustDesk app, NeoDesk's client | The browser; it also has a mobile web site |
| Sign-in | Password with authenticator codes, LDAP or Active Directory, OIDC | SAML, OAuth2 and OpenID Connect, LDAP; two-step sign-in with an authenticator app; YubiKey |
| Tools on a device | Remote desktop with file transfer. On MeshAgent devices also a terminal, files, port relays and power commands | Desktop, Terminal and Files tabs, plus General, Events, Details, Intel AMT and Console tabs |
| Recording | In the browser viewer as a WebM file; on the server for MeshAgent sessions | "Record Session to file" in the Desktop tab |
| Audit | An audit log of the console and the server's events, kept 90 days | The Events tab of each agent, "your audit log" |
| Asking for help | A quick support link, and help requests from NeoDesk's client | MeshCentral Assistant, a tray tool that shows the agent's state and can send a help request |

## What MeshCentral does better

- **It is MeshAgent's own server.** NeoDesk speaks the agent's protocol and
  offers the tools its [MeshAgent page](/docs/console/meshagent#using-a-meshagent-device)
  lists. For anything else the agent can do, MeshCentral is the reference.
- **More sign-in options.** SAML and YubiKey, which NeoDesk doesn't have.
- **More places to run.** MeshCentral's server and agent also run on macOS and
  FreeBSD, and its database can also be MongoDB, MariaDB, MySQL, NeDB or
  AceBase. NeoDesk installs with Docker, on Linux or on Windows.
- **Intel AMT.** MeshCentral reaches computers with Intel AMT activated.
  NeoDesk doesn't.
- **A mobile web site.** MeshCentral has one. NeoDesk's browser viewer needs a
  desktop or tablet screen; on a phone you use the RustDesk app.
- **A permissive license.** Apache 2.0 lets you change it and run it as a
  service without publishing your changes. NeoDesk's AGPL-3.0 asks you to share
  changes with the people who use the service.

## What NeoDesk does differently

- **RustDesk clients.** The stock RustDesk client connects without changes, on
  computers and phones, and people sign in to it with their console account;
  see [Connect a RustDesk client](/docs/getting-started/connect-a-client).
- **Both kinds of device in one list.** RustDesk devices, [MeshAgent devices](/docs/console/meshagent)
  and [RDP and VNC hosts](/docs/console/remote-targets) sit side by side under
  **Devices**.
- **Approval for every agent.** A new MeshAgent always waits under
  **Join requests** until someone approves it, whatever the
  [join mode](/docs/console/enrollment).
- **Help for a computer that isn't set up.** [Quick support](/docs/console/quick-support)
  makes a link that works once for one hour. The person downloads a small app,
  clicks **Allow**, and nothing gets installed.
- **One Go program.** `neodesk-server` runs without Node.js; the console is
  built into the binary.

## License and cost

Both are free. MeshCentral is under the Apache 2.0 license; its site names no
paid tier. NeoDesk is under the AGPL-3.0: you may use, change and run it, for
commercial work too, and if you change it and offer it as a network service,
you share your changes with its users. See [License](/docs/project/license).

## Move from MeshCentral to NeoDesk

NeoDesk takes the unmodified MeshAgent, so you keep the agent and point it at
NeoDesk. [MeshAgent devices](/docs/console/meshagent) has the steps:

1. Make the console reachable over HTTPS, at the address the agents will use,
   behind a [reverse proxy with TLS](/docs/operations/reverse-proxy-tls) or with
   the console's own HTTPS.
2. Under **Settings**, **MeshCentral**, **MeshCentral compatibility**, open
   **Install MeshAgent on a device** and download the .msh file. Check its
   `MeshServer=` line.
3. Install MeshAgent on each device with that .msh file.
4. Approve each agent under **Join requests**.

NeoDesk imports nothing from MeshCentral: set up users, groups and sign-in
again in the console. Recordings and events stay with MeshCentral.

NeoDesk is not affiliated with the MeshCentral project.

## Sources

Every page below was read on 25 November 2026.

- [meshcentral.com](https://meshcentral.com/): what MeshCentral is, that its
  server and agent run on Windows, Linux, macOS and FreeBSD, and that it is
  free on npm. The site names no paid tier.
- [github.com, Ylianst/MeshCentral](https://github.com/Ylianst/MeshCentral): the
  remote desktop, terminal and file management, the Android agent and the
  Apache 2.0 license.
- [github.com, MeshCentral license file](https://github.com/Ylianst/MeshCentral/blob/master/LICENSE):
  the text of the Apache License 2.0.
- [docs.meshcentral.com, home page](https://docs.meshcentral.com/): the guides
  for each database and for Docker.
- [docs.meshcentral.com, quick start](https://docs.meshcentral.com/install/quickstart/):
  the npm install, with Node.js and npm as the only prerequisites, and NeDB as
  the default database.
- [docs.meshcentral.com, container](https://docs.meshcentral.com/install/container/):
  the Docker guide and the official image at ghcr.io/ylianst/meshcentral.
- [docs.meshcentral.com, PostgreSQL](https://docs.meshcentral.com/install/database/postgresql/),
  [MariaDB and MySQL](https://docs.meshcentral.com/install/database/mariadb/),
  [MongoDB](https://docs.meshcentral.com/install/database/mongodb/) and
  [local databases](https://docs.meshcentral.com/install/database/local/):
  the database choices, with NeDB, SQLite and AceBase as local databases.
- [docs.meshcentral.com, user guide](https://docs.meshcentral.com/meshcentral/):
  SAML, OAuth2 and OpenID Connect, LDAP, two-step sign-in with an authenticator
  app, YubiKey, and the mobile web site.
- [docs.meshcentral.com, device tabs](https://docs.meshcentral.com/meshcentral/devicetabs/):
  the device tabs, "Record Session to file" in the Desktop tab, and the Events
  tab as "your audit log".
- [docs.meshcentral.com, agents](https://docs.meshcentral.com/meshcentral/agents/):
  the Mesh Agent on Windows, Linux and BSD, macOS and Android.
- [docs.meshcentral.com, Intel AMT](https://docs.meshcentral.com/intelamt/):
  managing computers with Intel AMT activated.
- [github.com, Ylianst/MeshCentralAssistant](https://github.com/Ylianst/MeshCentralAssistant):
  MeshCentral Assistant as a tray tool that shows the agent's state and sends
  help requests.
