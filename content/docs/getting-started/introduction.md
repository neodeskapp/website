---
title: Introduction
description: What NeoDesk is, what it is made of, and what you need to run it.
order: 1
seoTitle: What NeoDesk is: a RustDesk-compatible server - NeoDesk
icon: rocket_launch
---

NeoDesk is a self-hosted server for the RustDesk remote desktop client, with a
web console for your devices and the people who use them. This page explains
what it is made of and what you need before you install it. It describes
NeoDesk {{VERSION}}.

## What it does

A RustDesk client needs a server to register with, to find other clients, and to
relay a session when two computers can't connect directly. RustDesk's
open-source server does this with two programs, hbbs and hbbr. NeoDesk does
the same work and adds:

- the API that the RustDesk client uses to sign in and to sync its address book
- a web console with the device list, join requests, users and roles, an
  activity log and remote desktop in the browser
- sign-in to the console with two-factor codes, LDAP or Active Directory, or OIDC

Your devices can keep using the standard RustDesk client, on computers and on
phones: you point it at your server and nothing else changes on the client side.
NeoDesk also has its own client for Windows, macOS and Linux, which joins
your server from an invite link. Its releases are on
[github.com/neodeskapp/neodesk-client](https://github.com/neodeskapp/neodesk-client/releases):
`.exe` and `.msi` for Windows, `.dmg` for macOS, and `.deb`, `.rpm` and a
portable archive for Linux. The [download page](/download/) recommends the
file for your computer and lists every file with its checksum.

## What it is made of

One program, `neodesk-server`, does all of it. All three install methods start
it in the same mode, where one process runs:

- the ID server, which does hbbs's job: clients register here and find each other
- the relay server, which does hbbr's job: it carries a session when the two
  computers can't reach each other directly
- the API for RustDesk clients
- the web console

Each part listens on its own port. The ID server and the relay use 21115 to
21117, and 21118 and 21119 for clients that connect over WebSocket. The API for
clients uses 21121. The console uses 3375; the Linux and Windows installers
give it HTTPS on 5443, and 3375 sends browsers there. On a Linux or Windows
install the server's own API listens on 21114, and CDAP device agents connect
on 21122. [Ports](/docs/operations/ports) lists them all and says which ones
clients need.

The web console is a Svelte app. It is built into the binary when the binary is
built, so the running server needs no Node.js. Only a build from source needs
Node.js, and the Docker build brings its own.

The server keeps most of its data in two places:

- **A database.** By default it is a SQLite file, `db_v2.sqlite3`. PostgreSQL works
  too, see [PostgreSQL](/docs/operations/postgresql). Devices, accounts and the
  console's settings all live in it.
- **A key pair.** At its first start the server creates `id_ed25519` and
  `id_ed25519.pub`. Clients get the public key and use it to check that they talk
  to your server. If you lose the private key, the server makes a new pair and
  every client needs the new key.

The console also keeps files in its data folder, such as uploaded pictures and
fonts, chat files and its own backups. Nothing of it leaves the server on its
own; [Privacy](/docs/project/privacy) lists every host NeoDesk contacts.

## NeoDesk and RustDesk

NeoDesk works with the stock RustDesk client from RustDesk's own release
page. You don't build a custom client. The console's Overview page shows the
four values a client needs: ID server, relay server, API server and key.

The NeoDesk client needs none of them typed in. **Add a computer** on the
Devices page makes an invite link that installs it and joins the computer to
your server, see [Add a computer](/docs/console/add-a-computer).

The code is at [github.com/neodeskapp/neodesk](https://github.com/neodeskapp/neodesk)
and is licensed under the [AGPL-3.0](/docs/project/license).

## What you need

There are three ways to install it. Each installs the same server.

| Method | What the machine needs |
|--------|------------------------|
| [Docker](/docs/getting-started/docker) | Docker with Compose 2.24 or newer, and access to `ghcr.io`, where the image is published. The install script installs Docker when it is missing. |
| [Linux](/docs/getting-started/linux) | Root access, systemd, and apt-get, dnf, yum or pacman. A 64-bit x86, arm64 or armv7 processor, and access to github.com, where the releases are. |
| [Windows](/docs/getting-started/windows) | 64-bit Windows, PowerShell run as Administrator, and access to github.com. NSSM is optional and turns the server into a Windows service; without it the server runs as a scheduled task. |

None of them needs Go or Node.js on the machine: Docker runs the published
image, and the Linux and Windows scripts download a release. Only a build from
the repository with the Linux or Windows script needs them; the install pages
say how.

Docker is the shortest path: one command installs it, see
[Install with the script](/docs/getting-started/docker#install-with-the-script).

Whichever method you pick, the clients must reach the server on 21115 to 21117
and 21121 over TCP and on 21116 over UDP. If your devices
connect over the internet, the server needs an address they can reach from
there, such as a public IP address or a domain name.

## Where to go next

1. Install NeoDesk with [Docker](/docs/getting-started/docker), on
   [Linux](/docs/getting-started/linux) or on [Windows](/docs/getting-started/windows).
2. [Sign in for the first time](/docs/getting-started/first-sign-in), change the
   admin password and set the address clients use.
3. Add your computers: with the NeoDesk client through
   [Add a computer](/docs/console/add-a-computer), or
   [connect a RustDesk client](/docs/getting-started/connect-a-client).
4. Learn the console, starting with the [Overview page](/docs/console/overview)
   and the [device list](/docs/console/devices).

Before you open the console to the internet, put it behind a reverse proxy with
TLS: see [Reverse proxy and TLS](/docs/operations/reverse-proxy-tls).

## Getting help

Ask questions and get help on the [NeoDesk Discord](https://discord.gg/nwERSawufr) or in the [discussions on GitHub](https://github.com/neodeskapp/neodesk/discussions). Report a security problem as [SECURITY.md](https://github.com/neodeskapp/neodesk/blob/main/SECURITY.md) describes, not in public.
