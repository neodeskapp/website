---
title: Install on Windows
description: Install the server and the web console as a Windows service with the neodesk.ps1 script.
order: 4
seoTitle: Install NeoDesk on Windows: a RustDesk-compatible server
related: /docs/getting-started/first-sign-in, /docs/operations/ports, /docs/operations/reverse-proxy-tls, /docs/operations/updating
howto: requirements, install, admin-credentials, first-sign-in-address
icon: window
---

The `neodesk.ps1` script installs NeoDesk on a Windows machine. It runs the
server as the Windows service `NeoDeskServer`. It downloads the newest release of
`neodesk-server.exe` from GitHub and keeps a copy of itself in
`C:\NeoDesk`, which you use later to update, repair and back up the install.
This page covers the first install.

::: note
Windows support is experimental, and the script says so when it starts. Linux
is the main platform: if you have the choice, install with
[Docker](/docs/getting-started/docker) or on [Linux](/docs/getting-started/linux).
Report problems on [GitHub](https://github.com/neodeskapp/neodesk/issues).
:::

## Requirements

- 64-bit Windows.
- PowerShell, run as Administrator. The script stops if it isn't.
- Access to neode.sk for the first download, and to github.com,
  api.github.com and release-assets.githubusercontent.com, where the releases
  are. To look up the machine's public IP address the script asks
  ipv4.icanhazip.com, ifconfig.me and icanhazip.com. Allow these hosts if a
  proxy or firewall only lets listed hosts through.
- Only to build the server from the repository (`-FromSource`): git, and Node.js
  22.17 or newer with npm on the `PATH`. If the `go` command is missing, the
  script downloads Go 1.26.11 into `C:\Go` and adds it to the system `PATH`.

## Install

Open PowerShell as Administrator, download the script into your temp folder and
run it:

```powershell
Invoke-WebRequest https://neode.sk/neodesk.ps1 -OutFile $env:TEMP\neodesk.ps1 -UseBasicParsing
& $env:TEMP\neodesk.ps1
```

The install keeps its own copy in `C:\NeoDesk`, so you can delete the
downloaded file afterwards.

### When PowerShell refuses the script {#when-powershell-refuses-the-script}

Windows' execution policy decides whether a script may run:

- "running scripts is disabled on this system": the default on Windows 10 and
  11. Allow scripts for this window only and run the script again:

  ```powershell
  Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
  ```

- "is not digitally signed": the file came from a browser, which marks
  downloads from the internet. Remove the mark, then run it again:

  ```powershell
  Unblock-File $env:TEMP\neodesk.ps1
  ```

- A group policy that allows only signed scripts: the script isn't signed, so it
  can't run on that machine, and `-Scope Process` doesn't override the policy.

`Set-ExecutionPolicy -Scope Process` lasts only until you close the window. For
the commands you run later, start the script through `powershell` with the
policy for that one run, as the commands on this page do:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File C:\NeoDesk\neodesk.ps1
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

It asks nothing about HTTPS: the install turns on HTTPS with a self-signed
certificate by itself.

### What the script does

- Downloads or builds the server and installs it as
  `C:\NeoDesk\neodesk-server.exe`.
- Writes the settings to `C:\NeoDeskConsole\.env`, with a random admin
  password.
- Creates a self-signed certificate in `C:\NeoDesk\ssl`, valid for ten years,
  and turns on HTTPS for the console with it. The client API on 21121 stays on
  plain HTTP, because RustDesk clients refuse a self-signed certificate.
- Sets the join mode of a new install to **Managed**, so new RustDesk
  clients wait for approval.
- Limits `C:\NeoDesk`, `C:\NeoDeskConsole` and `C:\NeoDesk-Backups` to
  Administrators, SYSTEM and `NT SERVICE\NeoDeskServer`, because they hold the
  server's keys and settings. Other users of the machine can't read them.
- Registers the Windows service `NeoDeskServer`, display name "NeoDesk Server".
  `neodesk-server.exe` is the service itself. It starts with Windows and runs
  under its own low-privilege account, `NT SERVICE\NeoDeskServer`; the
  summary's **Runs as** line shows it.
- Opens these ports in Windows Firewall, for every network profile: 21114 for
  RustDesk clients without an API server setting, 21115, 21116 for TCP and UDP,
  21117, 21121, 21122 for CDAP device agents unless the env
  file sets `CDAP_ENABLED=N`, and the console's 3375 and 5443. When
  `TRUST_PROXY` says a reverse proxy is in front, it closes the console's two
  rules again.
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

`.\neodesk.ps1 -Help`, or `Get-Help .\neodesk.ps1 -Full`, lists every parameter
and variable.

## Admin credentials

The summary at the end shows the account to sign in with:

```text
  First sign-in: user admin, password <password>
                 Copy the password now: it is not shown again.
```

The password is 16 random letters and digits. Copy it now. The script removes it
from the env file when the server has started, and an interactive install ends
with "Copy the admin password above, then press Enter" before anything clears
the screen.

If you lose it, this gives the account `admin` a new password, the one in
`ADMIN_PASSWORD` or a random one, and shows it once:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File "C:\NeoDesk\neodesk.ps1" -ResetPassword
```

**Reset admin password** in the script's menu also lets you type one, with at
least 8 characters. When the admin has lost the phone and the recovery codes of
two-factor sign-in too, use `-ResetTwoFactor` instead: it also turns off the
account's two-factor sign-in. See
[If the only admin is locked out](/docs/people/two-factor#if-the-only-admin-is-locked-out).

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File "C:\NeoDesk\neodesk.ps1" -ResetTwoFactor
```

For another account, see
[Forgot the admin password](/docs/operations/troubleshooting#forgot-the-admin-password).

## First sign-in address

At the end the script prints what you need next: the ports a firewall outside
this machine has to let through, then the **Web console** line with the
console's address, **On your LAN** with its address in your own network, the
first sign-in, the ID server, relay server, API server and key for RustDesk
clients, how the server runs, and the commands for later. With the self-signed
certificate of a fresh install, the console is at
`https://<server-address>:5443`, and `http://<server-address>:3375` leads there.
Your browser warns about the certificate because nobody it trusts signed it.

From inside your network, use the **On your LAN** address:
`http://<lan-address>:3375` leads to `https://<lan-address>:5443`. On the
machine itself, `http://localhost:3375` leads to `https://localhost:5443`. Any
other name on the plain port goes to the address the install saved, the public
IP address unless you chose another relay address. The certificate covers the
public address, the LAN address and `localhost`. To add a host name, set it in
the same window before you run the script, with the name in place of
`<host-name>`:

```powershell
$env:SSL_DOMAIN = '<host-name>'
```

For a certificate that browsers trust, put a reverse proxy with TLS in front, or
bring your own certificate: get one with an ACME client or from your certificate
authority, then in the script's menu choose **Configure SSL certificates**, then
**Custom certificate**. The script doesn't get Let's Encrypt certificates on
Windows itself.

Keep the console away from the internet unless a reverse proxy with TLS is in
front of it, see [Reverse proxy and TLS](/docs/operations/reverse-proxy-tls).
With `TRUST_PROXY` set for the proxy, the script closes the console's firewall
rules itself. If this machine is reachable from the internet without a proxy,
remove the two rules the script made for the console's ports:

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

Only Administrators, SYSTEM and the service account `NT SERVICE\NeoDeskServer`
can open the three folders. An install made by an older script gets these
rights at its next update, or with `-RepairPermissions`. The command line
`neodesk` reads the API key in `C:\NeoDesk`, so run it in a window started as
administrator.

The server writes its log itself to `C:\NeoDesk\logs\server.log` and moves it
to `server.log.1` at 10 MB, keeping one old file. Windows' System event log has
the service's starts, stops and crashes, from the Service Control Manager.

Manage it like any Windows service, here or in `services.msc`:

```powershell
Get-Service NeoDeskServer
Stop-Service NeoDeskServer
Start-Service NeoDeskServer
Restart-Service NeoDeskServer
```

A stop shuts the server down cleanly. When the server ends any other way, after
a crash or when the console restarts it for a restart, an update or a restore,
Windows starts it again after 2, 5 and then 10 seconds, as the service's
**Recovery** tab shows. Besides `C:\NeoDeskConsole\.env`, the service starts
with a few settings of its own in the registry, the value `Environment` of
`HKLM\SYSTEM\CurrentControlSet\Services\NeoDeskServer`; they win over the env
file.

An install made by an older script ran the server through NSSM or as a
scheduled task under SYSTEM. Its next update with the script (`-Update`, or
the menu's **Repair installation**, then **Repair services**) makes it the
Windows service, keeping its settings, and removes the task and
`C:\NeoDesk\start-neodesk-server.cmd`. An update from the console's
**Updates** page replaces only the binary, so run the script's update once.
Until then, an NSSM install restarts as a service as before, and a task
install restarts when you stop the server, because the task starts it again:

```powershell
Stop-Process -Name neodesk-server -Force
```

The env file sets **Managed** only as the first join mode. A mode you pick in
the console stays after a restart. See [Join requests](/docs/console/enrollment) for
what the modes do.

## Later: update, diagnostics and uninstall {#later-update-and-uninstall}

Run these in a PowerShell or cmd window started as administrator:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File "C:\NeoDesk\neodesk.ps1" -Update
powershell -NoProfile -ExecutionPolicy Bypass -File "C:\NeoDesk\neodesk.ps1" -Uninstall
```

Without a parameter the script opens its menu. **Diagnostics** there shows the
server process, the database, the ports, and whether the API and the console answer.

`-Uninstall` stops and removes the service, its firewall
rules and the `C:\NeoDesk\bin` entry on the machine's `Path`. It asks whether to
make a backup first, and whether to delete `C:\NeoDesk`, `C:\NeoDeskConsole`
and the backups in `C:\NeoDesk-Backups`. With `-Auto` added it makes the backup
and keeps the folders; with `-Purge` added it deletes all three. At the end it
lists what it kept. Updates are covered in [Updating](/docs/operations/updating).

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
