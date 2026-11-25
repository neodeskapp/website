---
title: Install on Linux
description: Install the server and the web console as one systemd service with the neodesk.sh script.
order: 3
seoTitle: Install NeoDesk on Linux: a RustDesk-compatible server
related: /docs/getting-started/first-sign-in, /docs/operations/ports, /docs/operations/reverse-proxy-tls, /docs/operations/updating
howto: requirements, install, admin-credentials, first-sign-in-address
icon: dns
---

The `neodesk.sh` script installs NeoDesk on a Linux server as one systemd
service, `neodesk-server`. It downloads the newest release of
`neodesk-server` from GitHub and checks it before it installs it. It also stays
on the machine as the command `neodesk-setup`, which you use later to update,
repair, back up and uninstall, and puts the command line
[`neodesk`](/docs/command-line/neodesk) in `/usr/local/bin`. This page covers the
first install.

## Requirements

- Root access through `sudo`.
- systemd.
- One of the package managers the script knows: apt-get, dnf, yum or pacman. It
  installs `sqlite3`, `curl`, `wget`, `openssl`, `ca-certificates`, `iproute2` and
  `lsof` with it. On other systems, install curl, openssl and SQLite yourself
  before you start.
- A 64-bit x86, arm64 or armv7 processor.
- Access to github.com, where the releases are.
- Only to build the server from the repository (`--from-source`): Node.js 22.17
  or newer with npm. If Go 1.26.11 or newer is missing, the script downloads it
  into `/usr/local/go`. The build needs HTTPS access to the npm registry and to
  proxy.golang.org, sum.golang.org and go.dev.

## Install

```bash
curl -fsSL https://neode.sk/neodesk.sh | sudo bash
```

Piped into `bash` like this, the script has no terminal to ask questions on, so
it installs with the defaults, as `--auto` does: SQLite, the server's public IP
address for the relay and P2P first.

To answer the questions, download the script and run it:

```bash
curl -fsSL https://neode.sk/neodesk.sh -o neodesk.sh
sudo bash neodesk.sh
```

The script opens its menu. Move with the arrow keys and choose
**Fresh installation**, or type `1`.

### Where the server comes from

By default the script installs the newest stable release of
neodeskapp/neodesk for this processor. While there is no stable release, it
takes the newest pre-release, such as a release candidate. When there is none
either and you gave no channel, it installs the development build, and later
updates follow the development channel until you switch to stable:

```bash
sudo neodesk-setup --update --channel stable
```

Before it installs a download, the script checks its SHA-256 against the
release's `SHA256SUMS` and the release's signed manifest against the release key.
It refuses a release without a valid signature. If this machine's openssl can't
check the signature (it needs OpenSSL 3), the script says so and installs after
the SHA-256 check; from the next update on, the installed server checks the
signature itself.

| Option | Where the server comes from |
|--------|-----------------------------|
| `--channel dev` | The development build. The install keeps this channel for later updates. |
| `--from-source` | A build of the checkout the script runs in, see [Build from the repository](#build-from-the-repository). |
| `--binary <file>` | A `neodesk-server` binary you have. |

### What the script asks

1. **Database.** SQLite, the default, or PostgreSQL. For PostgreSQL the script
   asks for the host, port, database, user and password, installs PostgreSQL on
   this machine and creates the user and the database. See
   [PostgreSQL](/docs/operations/postgresql).
2. **Relay address.** The address clients get for the relay: the server's public
   IP address (the default), its LAN address for a server that only serves your
   local network, or an IP address or host name you type.
3. **Connection strategy.** P2P first, the recommended default, tries a direct
   connection between the two computers before it uses the relay. Relay only
   sends every session through the relay.
4. **TLS, at the end.** Whether TLS ends at a reverse proxy in front of the
   server, and whether to set up HTTPS now. Answer `n` to both to keep the
   defaults described below. See [Reverse proxy and TLS](/docs/operations/reverse-proxy-tls).

### What the script does

- Installs the packages above and creates the system user `neodesk`.
- Downloads or builds `neodesk-server` and installs it in `/opt/neodesk`.
- Writes the settings to `/opt/NeoDeskConsole/.env`, with a random admin
  password and session secret. It also sets the address the console's HTTP port
  sends browsers to (`PANEL_PUBLIC_HOST`): the relay address you chose.
- Creates a self-signed certificate in `/opt/neodesk/ssl`, valid for ten years.
  It turns on HTTPS for the console with it, and TLS for the ID and relay
  servers. The client API on 21121 stays on plain HTTP, because RustDesk clients
  refuse a self-signed certificate. RustDesk clients without TLS can still
  connect.
- Writes `neodesk-server.service`, starts it, and waits until the API, the
  console and the ports 21116 and 21117 answer.
- Opens these ports in ufw or firewalld when one of them is active, or adds
  iptables rules when neither is installed: 21115, 21116 for TCP and UDP,
  21117, 21121, 21122 for CDAP device agents unless the env file sets
  `CDAP_ENABLED=N`, and the console's 3375 and 5443. A ufw or firewalld that
  is installed but switched off stays as it is, and the installer adds no rules
  at all then. When you then choose a reverse proxy
  on the same server at the TLS question, it closes the console's ports again.
  A proxy on another machine needs them: limit their rules to the proxy's
  address yourself. Firewalls outside the server, such as a cloud provider's,
  are up to you; the script prints the list.
- Saves itself as `/usr/local/sbin/neodesk-setup`, and a copy of the server
  binary as `/usr/local/bin/neodesk`, the command line, which every user on the
  server can run. It needs an API token to do anything; see
  [The neodesk command line](/docs/command-line/neodesk).

## Install without questions

```bash
sudo bash neodesk.sh --auto
```

`--auto` skips the menu and every question. It picks SQLite, the public IP
address for the relay and P2P first, and asks nothing about TLS. Run again on a
machine where NeoDesk is installed, it updates the install. These flags change
what it does:

| Flag | What it does |
|------|--------------|
| `--relay-servers <address>` | Gives clients this relay address, an IP address or `host:port`. |
| `--relay-mode local` | Uses the server's LAN address for the relay. |
| `--postgresql` | Installs PostgreSQL on this machine and uses it instead of SQLite. |
| `--pg-uri <uri>` | Uses this existing PostgreSQL database instead of SQLite, and installs no PostgreSQL. |
| `--minimal` | Installs the server with the web console turned off. |
| `--channel dev`, `--from-source`, `--binary <file>` | Where the server comes from, see above. |

The flags also work with the one-line install, after `bash -s --`:

```bash
curl -fsSL https://neode.sk/neodesk.sh | sudo bash -s -- --relay-mode local
```

The script also reads environment variables, such as `ADMIN_PASSWORD` for your
own admin password. `sudo` drops variables you set in front of it, so put them
after `sudo`. Put your password in place of `<admin-password>`:

```bash
sudo ADMIN_PASSWORD='<admin-password>' bash neodesk.sh --auto
```

`sudo bash neodesk.sh --help` lists every flag and variable.

## Admin credentials

During the install the script prints the account to sign in with:

```text
PANEL LOGIN CREDENTIALS
Login:    admin
Password: <password>
```

The password is 32 random characters. Copy it now. The script shows it once and
removes it from the env file when the server has started. If you lose it, this
sets the password from `ADMIN_PASSWORD`, or a random one, and shows it once:

```bash
sudo neodesk-setup --reset-password
```

In the menu, **Reset admin password** also lets you type one, with at least 8
characters.

## First sign-in address

At the end the script prints what you need next:

```text
NeoDesk is installed

  Web console:   https://203.0.113.10:5443  (http://203.0.113.10:3375 leads there)
                 The certificate is self-signed, so the browser warns once.
  First sign-in: user admin, with the password shown above (it is not shown again)
  RustDesk clients (Settings > Network > ID/Relay server):
    ID server:     203.0.113.10
    Relay server:  203.0.113.10
    API server:    http://203.0.113.10:21121
    Key:           <the server's public key>
  Log:           sudo journalctl -u neodesk-server -f
  Settings:      /opt/NeoDeskConsole/.env (then: sudo systemctl restart neodesk-server)
  Update:        sudo neodesk-setup --update
  Uninstall:     sudo neodesk-setup --uninstall
  Command line:  sudo neodesk --help
  Help:          https://discord.gg/nwERSawufr
```

The **Web console** line is the console's address. Your browser warns about the
certificate because nobody it trusts signed it. The RustDesk lines are what
clients need, see [Connect a RustDesk client](/docs/getting-started/connect-a-client).

Continue with [First sign-in](/docs/getting-started/first-sign-in).

## Files and the service

| Path | What it holds |
|------|---------------|
| `/opt/neodesk` | The binary `neodesk-server`, the database `db_v2.sqlite3`, the key pair `id_ed25519` and `id_ed25519.pub`, the API key `.api_key`, the key file of saved sign-in `.device_vault_key`, and `ssl/` |
| `/opt/NeoDeskConsole` | The settings file `.env` and the console's `data/` folder |
| `/etc/systemd/system/neodesk-server.service` | The service. It runs as the user `neodesk` and reads `/opt/NeoDeskConsole/.env`. |
| `/opt/neodesk-backups` | Backups the script makes, for example before an update. Up to 3.6.0-rc.4 they went to `/opt/rustdesk-backups`; the first run of the new script moves them here. |
| `/usr/local/sbin/neodesk-setup` | The script, as the command for later. Up to 3.6.0-rc.4 it was `/usr/local/sbin/neodesk`. |
| `/usr/local/bin/neodesk` | The command line, a copy of the server binary that every user can run |

```bash
sudo systemctl status neodesk-server
sudo journalctl -u neodesk-server -f
sudo systemctl restart neodesk-server
```

A new install starts in the **Managed** enrollment mode: a new RustDesk client
waits under **Enrollment requests** until someone approves it. The env file sets
this only as the first mode; a mode you pick in the console stays. See
[Enrollment](/docs/console/enrollment).

## Later: neodesk-setup {#later-the-neodesk-command}

`sudo neodesk-setup` opens the same menu as the script. Without the menu:

```bash
sudo neodesk-setup --update
sudo neodesk-setup --reset-password
sudo neodesk-setup --uninstall
```

`neodesk` is the [command line](/docs/command-line/neodesk). It hands the
script's options to `neodesk-setup`, so `sudo neodesk --update` works too, and a
bare `sudo neodesk` on a terminal opens the menu.

`--uninstall` makes a backup, then removes the service and keeps the data. It
lists what is left on the machine. `--uninstall --purge` also deletes
`/opt/neodesk`, `/opt/NeoDeskConsole` and the commands `neodesk-setup` and
`neodesk`.

## Build from the repository

To run your own changes, build the server from a checkout:

```bash
git clone https://github.com/neodeskapp/neodesk.git
cd neodesk
sudo ./install/neodesk.sh --from-source
```

Choose **Fresh installation** in the menu, or add `--auto`. `--from-source` builds
the web app with npm, puts it into the server, and compiles the server with Go.
See the requirements above.

## Next steps

- [First sign-in](/docs/getting-started/first-sign-in)
- [Connect a RustDesk client](/docs/getting-started/connect-a-client)
- [Updating](/docs/operations/updating) and [Backup](/docs/operations/backup)
