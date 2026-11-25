---
title: Install on Windows
description: Install the server and the web console as a Windows service with the neodesk.ps1 script.
order: 4
seoTitle: Install NeoDesk on Windows: a RustDesk-compatible server
related: /docs/getting-started/first-sign-in, /docs/operations/ports, /docs/operations/reverse-proxy-tls, /docs/operations/updating
howto: requirements, install, admin-credentials, first-sign-in-address
---

The `neodesk.ps1` script installs NeoDesk on a Windows machine. It runs the
server as a Windows service called `NeoDeskServer`, or as a scheduled task of
the same name when NSSM is not installed. It downloads the newest release of
`neodesk-server.exe` from GitHub and keeps a copy of itself in
`C:\NeoDesk`, which you use later to update, repair and back up the install.
This page covers the first install.

## Requirements

- 64-bit Windows.
- PowerShell, run as Administrator. The script stops if it isn't.
- Access to github.com, where the releases are.
- [NSSM](https://nssm.cc), if you want a Windows service. The script finds it on
  the `PATH` or as `tools\nssm.exe` next to the script. It does not install NSSM.
  Without it, the server runs as a scheduled task.
- Only to build the server from the repository (`-FromSource`): git, and Node.js
  22.17 or newer with npm on the `PATH`. If the `go` command is missing, the
  script downloads Go 1.26.11 into `C:\Go` and adds it to the system `PATH`.

## Install

Open PowerShell as Administrator, download the script and run it:

```powershell
Invoke-WebRequest https://neode.sk/neodesk.ps1 -OutFile neodesk.ps1 -UseBasicParsing
.\neodesk.ps1
```

If PowerShell refuses because running scripts is disabled on this system, allow
scripts for this window only and run the script again:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

The script opens its menu. Move with the arrow keys and choose
**Fresh installation**, or type `1`.

### Where the server comes from

By default the script installs the newest stable release of
neodeskapp/neodesk. While there is no stable release, it takes the newest
pre-release, such as a release candidate. When there is none either and you gave
no channel, it installs the development build, and later updates follow the
development channel until you switch with `-Update -Channel stable`.

The script checks the download's SHA-256 against the release's `SHA256SUMS`.
Windows has no tool to check the release signature before `neodesk-server` is
installed, so the first install says so and relies on the SHA-256 check over
HTTPS. From the next update on, the installed server checks the signature and
refuses a release without a valid one.

| Parameter | Where the server comes from |
|-----------|-----------------------------|
| `-Channel dev` | The development build. The install keeps this channel for later updates. |
| `-FromSource` | A build of the checkout the script runs in, see [Build from the repository](#build-from-the-repository). |
| `-Binary <path>` | A `neodesk-server.exe` you have. |

### What the script asks

1. **Database.** SQLite, the default, or PostgreSQL. On Windows the script does
   not install PostgreSQL: the server and the database must exist before you
   choose it, and the script asks for their address and password. See
   [PostgreSQL](/docs/operations/postgresql).
2. **Relay address.** The address clients get for the relay: the machine's public
   IP address (the default), its LAN address for a server that only serves your
   local network, or an IP address or host name you type.
3. **Connection strategy.** P2P first, the recommended default, tries a direct
   connection between the two computers before it uses the relay. Relay only
   sends every session through the relay.
4. **HTTPS, at the end.** Whether to configure HTTPS now. Answer `n` to keep the
   defaults described below.

### What the script does

- Downloads or builds the server and installs it as
  `C:\NeoDesk\neodesk-server.exe`.
- Writes the settings to `C:\NeoDeskConsole\.env`, with a random admin
  password.
- Creates a self-signed certificate in `C:\NeoDesk\ssl`, valid for ten years,
  and turns on HTTPS for the console with it. The client API on 21121 stays on
  plain HTTP, because RustDesk clients refuse a self-signed certificate.
- Sets the enrollment mode of a new install to **Managed**, so new RustDesk
  clients wait for approval.
- Registers `NeoDeskServer`. With NSSM it is a service that starts with
  Windows and runs under its own low-privilege account,
  `NT SERVICE\NeoDeskServer`. Without NSSM it is a scheduled task that runs as
  SYSTEM at startup.
- Opens these ports in Windows Firewall, for every network profile: 21115, 21116
  for TCP and UDP, 21117, 21121, 21122 for CDAP device agents unless the env
  file sets `CDAP_ENABLED=N`, and the console's 3375 and 5443.
- Starts the server and waits until the API, the console and the ports 21116 and
  21117 answer.
- Saves itself as `C:\NeoDesk\neodesk.ps1`.
- Puts the command line [`neodesk`](/docs/command-line/neodesk) on the machine's
  `Path`: `C:\NeoDesk\bin\neodesk.exe`, a link to `neodesk-server.exe`. A new
  terminal finds it.

## Install without questions

```powershell
.\neodesk.ps1 -Auto
```

`-Auto` skips the menu and every question. It picks SQLite, the public IP address
for the relay and P2P first, and asks nothing about HTTPS. Run again on a machine
where NeoDesk is installed, it updates the install. These parameters change
what it does:

| Parameter | What it does |
|-----------|--------------|
| `-RelayServers <address>` | Gives clients this relay address, an IP address or `host:port`. |
| `-RelayMode local` | Uses the machine's LAN address for the relay. |
| `-PgUri <uri>` | Uses this existing PostgreSQL database instead of SQLite. |
| `-Minimal` | Installs the server with the web console turned off. |
| `-RunAsRoot` | Runs the service as LocalSystem instead of its own account. |
| `-Channel dev`, `-FromSource`, `-Binary <path>` | Where the server comes from, see above. |

To start with your own admin password, set it in the same window first. Put
your password in place of `<admin-password>`:

```powershell
$env:ADMIN_PASSWORD = '<admin-password>'
.\neodesk.ps1 -Auto
```

`.\neodesk.ps1 -Help` lists every parameter and variable.

## Admin credentials

During the install the script prints the account to sign in with:

```text
PANEL LOGIN CREDENTIALS
Login:    admin
Password: <password>
```

The password is 16 random letters and digits. Copy it now. The script shows it once and removes it from the env file
when the server has started. If you lose it, run
`C:\NeoDesk\neodesk.ps1` and choose **Reset admin password**. It generates a
new random password, or sets one you type, with at least 8 characters.

## First sign-in address

At the end the script prints what you need next: the **Web console** line with the
console's address, then the ID server, relay server, API server and key for
RustDesk clients, and the ports a firewall outside this machine has to let
through. With the self-signed certificate of a fresh install, the console is at
`https://<server-address>:5443`, and `http://<server-address>:3375` leads there. Your browser
warns about the certificate because nobody it trusts signed it.

Keep the console away from the internet unless a reverse proxy with TLS is in
front of it, see [Reverse proxy and TLS](/docs/operations/reverse-proxy-tls). If
this machine is reachable from the internet, remove the two rules the script made
for the console's ports:

```powershell
Remove-NetFirewallRule -DisplayName "NeoDesk - NeoDesk web console", "NeoDesk - NeoDesk web console HTTPS"
```

Then continue with [First sign-in](/docs/getting-started/first-sign-in).

## Files and the service

| Path | What it holds |
|------|---------------|
| `C:\NeoDesk` | The server `neodesk-server.exe`, the database `db_v2.sqlite3`, the key pair `id_ed25519` and `id_ed25519.pub`, the API key `.api_key`, the key file of saved sign-in `.device_vault_key`, `ssl\`, `logs\`, the copy of the script, `neodesk.ps1`, and `bin\neodesk.exe`, the command line |
| `C:\NeoDeskConsole` | The settings file `.env` and the console's `data\` folder |
| `C:\NeoDesk-Backups` | Backups the script makes, for example before an update |

The server writes its log to `C:\NeoDesk\logs\server.log`, as a service and as
a scheduled task.

With NSSM, manage it like any service:

```powershell
Get-Service NeoDeskServer
Restart-Service NeoDeskServer
```

Without NSSM, the scheduled task runs `C:\NeoDesk\start-neodesk-server.cmd`,
which starts the server again whenever it exits:

```powershell
Get-ScheduledTask -TaskName NeoDeskServer
Start-ScheduledTask -TaskName NeoDeskServer
```

The env file sets **Managed** only as the first enrollment mode. A mode you pick in
the console stays after a restart. See [Enrollment](/docs/console/enrollment) for
what the modes do.

## Later: update and uninstall

```powershell
& 'C:\NeoDesk\neodesk.ps1' -Update
& 'C:\NeoDesk\neodesk.ps1' -Uninstall
```

`-Uninstall` stops and removes the service or the scheduled task. It asks whether
to make a backup first and whether to delete `C:\NeoDesk` and
`C:\NeoDeskConsole`. With `-Auto` added it makes the backup and keeps both
folders; with `-Purge` added it deletes them. Updates are covered in
[Updating](/docs/operations/updating).

## Build from the repository

To run your own changes, build the server from a checkout:

```powershell
git clone https://github.com/neodeskapp/neodesk.git
cd neodesk
.\install\neodesk.ps1 -FromSource
```

Choose **Fresh installation** in the menu, or add `-Auto`. `-FromSource` builds
the web app with npm, puts it into the server, and compiles the server with Go.
See the requirements above.

## Next steps

- [First sign-in](/docs/getting-started/first-sign-in)
- [Connect a RustDesk client](/docs/getting-started/connect-a-client)
- [Updating](/docs/operations/updating) and [Backup](/docs/operations/backup)
