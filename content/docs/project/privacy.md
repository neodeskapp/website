---
title: Privacy
description: What NeoDesk keeps on your server, and every host the server, the console and the installers contact, and when.
order: 2
icon: privacy_tip
---

NeoDesk runs on a machine you control. The project runs no service that receives your devices, accounts or sessions, and the code sends no analytics, crash reports or usage data to anyone. This page lists what the server keeps and every host it contacts. It describes the code of NeoDesk {{VERSION}} from [neodeskapp/neodesk](https://github.com/neodeskapp/neodesk); other builds may differ.

## What stays on your server

The database, a SQLite file or PostgreSQL, holds:

- devices: the ID, IP address, host name, operating system, client version, when the device was last online, and its notes and tags
- accounts: user name, email address, display name, password hash, role, two-factor secret and last sign-in
- the address books that RustDesk clients sync
- device metrics (CPU, memory and disk use), the console's audit log, the server's events, and records of connections and file transfers
- the messages sent in **Chat**

The server stores chat messages as they were written. They are not end-to-end encrypted, so anyone who can read the database can read them, and the hourly clean-up doesn't delete them.

The console also keeps files in its data folder, such as uploaded pictures and fonts, chat files and its own backups. [Backup and restore](/docs/operations/backup#what-to-back-up) lists every file for each install type, and [Monitoring](/docs/operations/monitoring#how-long-records-are-kept) says how long the server keeps each kind of record.

## What the server contacts on its own

These connections happen without anyone doing anything.

### The public IP address

At every start the server asks `https://checkip.amazonaws.com`, then `https://api.ipify.org`, then `https://ifconfig.me/ip` for its public IPv4 address, and tries the same hosts over plain HTTP when HTTPS fails. Clients get that address as the relay address unless `RELAY_SERVERS` or the console's settings name a relay. The lookup runs at start even when one is named. When the server finds no public address and no relay is named, it asks again every 60 seconds until it finds one.

To learn its address on the local network, the server asks the operating system which address it would use to reach 8.8.8.8. That sends no packet.

### Time servers

Every 60 seconds the server asks each time server on its list for the time over NTP (UDP port 123) and compares it with its own clock. The list is pool.ntp.org, time.google.com and time.cloudflare.com. Change it under **Settings**, **Time zones**, **Time servers**, or with `NTP_SERVERS` in the env file. With your own time server on the list, these queries stay in your network.

### The local network

The console answers discovery probes on UDP port 21119 (`DISCOVERY_PORT`), so that apps on the same network can find it. It answers only senders on a local network: loopback, the private and link-local ranges, carrier-grade NAT, and the networks of the server's own interfaces. The answer holds the machine's name, the NeoDesk version, the ports, the server's public key, the server's IPv4 addresses and the console's address. The console sends nothing until a probe arrives.

With `PANEL_MDNS` set to on, the console also announces itself over mDNS (UDP port 5353) as `_neodesk._tcp`, with its port, address and version. Without that setting there is no announcement.

## What the server contacts when someone uses a feature

### Updates

When someone opens **Settings**, **Updates**, and when they click **Check for updates**, the console asks GitHub's API (api.github.com) for the releases of neodeskapp/neodesk, or of the repository that `UPDATE_GITHUB_OWNER` and `UPDATE_GITHUB_REPO` name. It keeps the answers for two minutes. **Install** downloads the release from github.com and GitHub's file hosts.

The requests carry the user agent `NeoDesk-Console/<version>` and no ID of your install. GitHub sees the server's IP address, as with any download. A token in `UPDATE_GITHUB_TOKEN` or `GITHUB_TOKEN` goes to api.github.com only. See [Updating](/docs/operations/updating#the-updates-page-in-the-console).

### Client downloads for invites

An invite link from **Add a computer** or **Quick support** opens a page with the client to download. To fill it, the server looks up the newest release of neodeskapp/neodesk-client on GitHub, or the newest pre-release while there is no stable one, at most every six hours. It downloads a package the first time someone asks for it, checks it against the release's signed checksums and keeps it in its data folder. `NEODESK_CLIENT_REPO` names another repository. With `NEODESK_CLIENT_RELEASE_DIR` the server takes the packages from that folder and doesn't ask GitHub.

### Support agents

**Import latest release** on the **Support agents** page downloads the newest signed release of the support agent from neodeskapp/neodesk-client on GitHub, or from the repository `NEODESK_SUPPORT_RELEASE_REPO` names. Nothing is fetched until someone clicks it.

### Mail

The console sends mail only through the mail server set under **Settings**, **Email** or in `SMTP_HOST` (see [Configuration](/docs/operations/configuration#mail)). It mails alerts, help requests from devices, and invite and quick support links that someone chooses to send by mail. The connection test signs in to the mail server without sending a mail. Without a mail server the console sends no mail.

### Fonts

Picking a font from **Google Fonts** under **Settings**, **Appearance** makes the server download it from fonts.googleapis.com and fonts.gstatic.com. From then on the console serves the font itself.

### Sign-in providers

With single sign-on, the server talks to the provider's addresses when someone signs in and when someone clicks **Test discovery**. With **Auto-discovery** on, it also fetches the provider's discovery document when it starts, and every two minutes until it gets one. When the provider sends a picture address with the sign-in, the console downloads the picture and stores it as the account's picture. See [Single sign-on with OIDC](/docs/people/oidc).

With LDAP or Active Directory, the server connects to the directory server when someone signs in with a directory account or tests the settings. See [LDAP and Active Directory](/docs/people/ldap).

### Hosts an administrator names

These reach only the addresses someone enters in the console:

- **Network monitoring** pings the targets, opens their ports or requests their URLs.
- **Network tools** checks certificates and looks up DNS records of the names you enter.
- [Remote targets](/docs/console/remote-targets) connect to the RDP and VNC hosts you add, through guacd.
- Wake-on-LAN sends a broadcast on the server's own network.

## What the browser loads

The console's pages carry a Content-Security-Policy that lets the browser load scripts, styles, fonts and images from the console only, and connect to nothing else. The console's links to GitHub, such as the project and RustDesk's releases, are plain links: nothing is sent until someone clicks one.

## Installers and Docker

The install scripts download NeoDesk from GitHub, and the Docker compose files pull the image `ghcr.io/neodeskapp/neodesk`. When Docker is missing, `neodesk-docker.sh` downloads Docker's install script from get.docker.com. A build from source downloads Go from go.dev, Go modules from proxy.golang.org and the web app's npm packages.

With [HTTPS with Let's Encrypt](/docs/getting-started/docker#https-with-lets-encrypt), the compose file also pulls the image `traefik` from Docker Hub. Traefik asks Let's Encrypt (acme-v02.api.letsencrypt.org, or its staging server with `--letsencrypt-staging`) for the certificate and each renewal, and gives it the email address from `--email` as the contact. Traefik's own update check and usage statistics are turned off.

The installers look up the server's public IP address too:

| Where | Hosts it asks, in order |
|---|---|
| `neodesk.sh` on Linux | ifconfig.me, icanhazip.com |
| `neodesk.ps1` on Windows | ipv4.icanhazip.com, ifconfig.me, icanhazip.com |
| The Docker image, at each start while `RELAY_SERVERS` is empty | checkip.amazonaws.com, api.ipify.org, ifconfig.me |

## Report a connection this page misses

If you find NeoDesk contacting a host that this page doesn't list, report it the way [SECURITY.md](https://github.com/neodeskapp/neodesk/blob/main/SECURITY.md) describes, not in a public issue.

## This website

neode.sk counts its visits with [Umami](https://umami.is), an open-source analytics tool that we run ourselves on our server in Germany, at stats.neode.sk. No data goes to anyone else.

- No cookies and nothing in your browser's storage.
- For each page view we store the page and its title, the page you came from, your browser, operating system, device type, screen size and language, and the country, region and city that your IP address points to.
- Your IP address is not stored. The stats server keeps no access log. Umami uses the address only while it handles the page view: together with your browser's user agent and a value that changes every day, it turns it into a visitor ID. So we can count visitors per day but can't follow anyone from one day to the next.
- The address in the browser is recorded without the part after `?` or `#`.
- If your browser sends Do Not Track or Global Privacy Control, nothing is recorded.
- beta.neode.sk records nothing.

The web server of neode.sk itself logs every request with the visitor's IP address, like most web servers, and deletes these logs after 14 days; copies in our encrypted nightly backup are kept for up to four months.
