---
title: Troubleshooting
description: Logs, health checks, and what to check when the console does not open, sign-in fails, clients cannot connect, the key does not match or the relay fails.
order: 7
icon: troubleshoot
---

Start with the log and the health checks below. The sections after them go by symptom and name the log lines and settings that point to the cause.

## Where the logs are

The server and the console write one log.

- Docker, in the folder with the compose file, `/opt/neodesk/docker` after an install with the script:

  ```bash
  docker compose logs -f neodesk
  ```

- Linux, where the installer's **Diagnostics** menu item collects more:

  ```bash
  journalctl -u neodesk-server -f
  ```

- Windows: `C:\NeoDesk\logs\server.log`, which the server moves to `server.log.1` at 10 MB. The service's starts, stops and crashes are in Windows' System event log, from the Service Control Manager. The **Diagnostics** item in the menu of `C:\NeoDesk\neodesk.ps1` checks the ports and the service.

The Linux installer also keeps a log of each run, `/tmp/neodesk_<date>_<time>.log`. Look there when an install or update stops with an error.

`LOG_LEVEL` in the env file decides how much the log holds; a new install sets `info`. With `warn` or `error`, the lines at info level don't show, such as the start summary, `[console] listening on ...` and most lines quoted on this page. Set `LOG_LEVEL=info` in `/opt/NeoDeskConsole/.env` or `C:\NeoDeskConsole\.env` and restart the service to see them.

## Health checks

The console answers `/health` and the API answers `/api/health`, both without signing in. Where the console answers depends on the install type, because the Linux and Windows installers turn on HTTPS with a self-signed certificate.

Docker, where the console speaks plain HTTP on 3375:

```bash
curl http://localhost:3375/health
curl http://localhost:21121/api/health
```

Linux, where the console is on 5443 and the plain port 3375 only redirects there. `-k` accepts the self-signed certificate:

```bash
curl -k https://localhost:5443/health
curl http://localhost:21121/api/health
```

Windows, in PowerShell. Type `curl.exe`, because `curl` alone is another command in Windows PowerShell:

```powershell
curl.exe -k https://localhost:5443/health
curl.exe http://localhost:21121/api/health
```

Each answers with JSON:

```text
{"status":"ok","timestamp":"..."}
{"status":"ok","version":"..."}
```

On Linux and Windows, `curl http://localhost:3375/health` answers `Temporary Redirect` to `https://localhost:5443/health` instead. Use the Docker line on an install whose console runs without HTTPS, such as one behind a reverse proxy. On a Linux or Windows install made before 3.6.0-rc.5, put the console's port 5000 in place of 3375.

Port 21121 answers on every install type; on Linux and Windows the console passes the request on to the server's API on 21114. In Docker, `docker compose ps` shows the container as healthy when both answer.

The binary can check the health addresses and ports in one go and prints a PASS or FAIL line for each:

```bash
docker compose exec neodesk neodesk-server check --port 21116 --port 21117
```

On a Linux install, name the API's port and the console's HTTPS address. `--insecure` accepts the self-signed certificate:

```bash
sudo /opt/neodesk/neodesk-server check --api http://127.0.0.1:21114/api/health --panel https://127.0.0.1:5443/health --insecure --port 21116 --port 21117
```

On Windows, in PowerShell as Administrator, this is the check the installer runs:

```powershell
& C:\NeoDesk\neodesk-server.exe check --api http://127.0.0.1:21114/api/health --panel https://127.0.0.1:5443/health --insecure --port 127.0.0.1:21116 --port 127.0.0.1:21117
```

`/api/health/detail` and `/metrics` give more, but only to the addresses in `METRICS_IP_ALLOWLIST` or with an API key. On Linux and Windows an API key works on 21114 only from this machine or from an address in `API_ALLOW_FROM`; other hosts get only the client API there.

## The console does not open

- Use the address for your install type. Docker: `http://<server-address>:3375`, plain HTTP, unless you set up HTTPS. Linux and Windows: `https://<server-address>:5443`, because the installers turn on HTTPS with a self-signed certificate, which the browser warns about. Their plain port, 3375 (or 5000 on an install made before 3.6.0-rc.5), only redirects there.
- On Linux and Windows the plain port keeps the address you typed when it is the machine's own IP address, or `localhost` on the machine itself: `http://<lan-address>:3375` leads to `https://<lan-address>:5443`, and the installers' certificate covers the LAN address. A host name, or an address the connection didn't reach directly, goes to the host in `PANEL_PUBLIC_HOST` instead, which the installers set to the address clients use, often the public IP address. Behind a router without hairpin NAT that address doesn't answer from inside the network; open `https://<lan-address>:5443` then.
- A Docker install that answered on 5000 moves to 3375 at its first update to 3.6.0-rc.5 or later, unless `NEODESK_CONSOLE_PORT` in its `.env` names a port. See [The console's port after the update](/docs/operations/updating#the-consoles-port-after-the-update).
- With `CONSOLE_PORT=0` the console is off. A minimal install (`--minimal`) sets that.
- With `HOST=127.0.0.1` the console answers only on the machine itself, which is what you want behind a reverse proxy on the same machine.
- `[console] ERROR: HTTP port 3375 is already in use` in the log means another program holds the port. When `CONSOLE_PORT` is not set at all, the server keeps running without its console and logs `the server runs without its console`; set `CONSOLE_PORT` to a free port. In Docker, Compose refuses to start the container when the host port is taken.
- With `HTTPS_ENABLED=true` and a certificate, the console is on port 5443 and the plain port redirects there, or shows a page that asks you to set `PANEL_PUBLIC_HOST`.
- The firewall. The Linux and Windows installers open the console's ports in the machine's own firewall; a firewall in front of the machine, such as a cloud provider's, is up to you. See [Ports and firewall](/docs/operations/ports).

## Forgot the admin password

In Docker, `neodesk-show-admin-credentials` prints the first password only until someone changes it; see [Get the admin password](/docs/getting-started/docker#get-the-admin-password). On an install made with the script, this gives `admin` a new random password and prints it once; `--user <name>` picks another account:

```bash
sudo bash /opt/neodesk/docker/neodesk-docker.sh reset-password
```

To choose the password yourself, and on an install with the compose file, type it after the first command (it does not show), then run the second in the folder with the compose file:

```bash
read -rs NEWPASS
printf '%s\n' "$NEWPASS" | docker compose exec -T -u neodesk neodesk neodesk-server reset-password admin
```

On Linux, `sudo neodesk-setup --reset-password` sets the password from `ADMIN_PASSWORD`, or a random one, and shows it once. In the menu of `sudo neodesk-setup`, **Reset admin password** also lets you type one. The server's own command works too, run as the service account:

```bash
read -rs NEWPASS
printf '%s\n' "$NEWPASS" | sudo -u neodesk env NEODESK_ENV_FILE=/opt/NeoDeskConsole/.env /opt/neodesk/neodesk-server reset-password admin
```

On Windows, open PowerShell as Administrator. `-ResetPassword` gives the account `admin` the password from `ADMIN_PASSWORD`, or a random one, and shows it once. Without it, the script's menu has **Reset admin password**, which also lets you type one. `-ExecutionPolicy Bypass` lets the script run in any new window, also where scripts are blocked:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File C:\NeoDesk\neodesk.ps1 -ResetPassword
```

The server's own command works on Windows too, for any account name. Type the password at the prompt; it doesn't show:

```powershell
$env:NEODESK_ENV_FILE = 'C:\NeoDeskConsole\.env'
$pass = Read-Host 'New password' -AsSecureString
[Net.NetworkCredential]::new('', $pass).Password | & C:\NeoDesk\neodesk-server.exe reset-password admin
```

`reset-password` works on SQLite and PostgreSQL and takes effect at once. It reads the password from standard input and refuses to read it from a terminal, so that it never shows. The password needs at least 8 characters, the same rule as everywhere else. It prints one line, `Password updated for admin; its console sessions were signed out.`, and signs that account out of the console everywhere. Without an account of that name, it creates one with the admin role and prints `Created admin user: <name>`. `--verbose` also names the database. A lock from failed attempts ends by itself, 15 minutes after the last one.

### Lost the phone and the recovery codes too {#lost-the-phone-and-the-recovery-codes-too}

The password reset leaves two-factor sign-in as it is. When the only admin has lost both the phone and the recovery codes, add `--reset-two-factor`: it sets the new password, turns off the account's two-factor sign-in and deletes its authenticator secret and recovery codes. Where two-factor sign-in is required, the account sets it up again at its next sign-in.

- Docker, an install made with the script (`--user <name>` for another account):

  ```bash
  sudo bash /opt/neodesk/docker/neodesk-docker.sh reset-password --reset-two-factor
  ```

- Docker, an install with the compose file, in its folder:

  ```bash
  read -rs NEWPASS
  printf '%s\n' "$NEWPASS" | docker compose exec -T -u neodesk neodesk neodesk-server reset-password --reset-two-factor admin
  ```

- Linux:

  ```bash
  sudo neodesk-setup --reset-password --reset-two-factor
  ```

- Windows, in PowerShell as Administrator:

  ```powershell
  powershell -NoProfile -ExecutionPolicy Bypass -File C:\NeoDesk\neodesk.ps1 -ResetTwoFactor
  ```

The scripts' options are for the account `admin` (Docker: `--user`). For another account, give the server's own command above `--reset-two-factor` before the name. A server older than the option refuses it; update it first. See [If the only admin is locked out](/docs/people/two-factor#if-the-only-admin-is-locked-out).

## Sign-in says "Too many attempts"

The console refuses a sign-in with "Too many attempts. Please try again later." when one of these limits is reached:

- 5 sign-in attempts from one address within a minute,
- 10 failed sign-ins of one account from one address within 15 minutes, which lock that account for that address for 15 minutes after the last one,
- 30 failed sign-ins from one address, for any account, within 15 minutes.

Behind a reverse proxy without `TRUST_PROXY`, all people share the proxy's address and reach these limits together. Set it as described in [Reverse proxy and TLS](/docs/operations/reverse-proxy-tls#trusting-the-proxy). Otherwise wait, or change the limits; see [Configuration](/docs/operations/configuration#sign-in-and-rate-limits).

## Clients show "not ready" or cannot connect

- Compare the client's ID server and Key with **Client setup** on the **Overview**. **What clients get now** under **Settings**, **General** shows the same addresses, but not the key. See [Connect a client](/docs/getting-started/connect-a-client).
- Make sure the client's network reaches port 21116 over TCP and UDP, and 21115.
- In the `managed` and `locked` join modes, a new device cannot register until someone approves it under **Join requests**. A new install starts in `managed`. The log shows `Rejected new peer <id> from <address> (enrollment policy)`. See [Join requests](/docs/console/enrollment).
- `Rate limited RegisterPk for new peer` in the log means more than `SIGNAL_RATE_LIMIT_PER_IP` new devices (20 a minute) registered from one address. Raise it when many devices share a public address.
- If the server lost its key file, it made a new key, and clients with the old one cannot connect. Restore the old key file or give clients the new key; see [why the key file matters](/docs/operations/backup#why-the-key-file-matters).
- A RustDesk client shows online in the console, but without host name, user or OS, or signing in from it fails: its **API server** names the wrong address or port. Set it to `http://<server-address>:21121` in the client's network settings. Left empty, the stock RustDesk client calls port 21114 on the ID server's address. Every install type answers there once the port is open: Docker publishes it, and the Linux and Windows installers open it in the firewall. An install made by an older installer opens it when you run the installer again, or add the rule for 21114/tcp by hand. See [the API port](/docs/operations/ports#the-api-port-on-linux-and-windows).
- The first time a client registers after the server started, the log shows `[signal] New peer registered: <id> from <address>`.
- `Rejected outbound from <address> (... reason=...)` names why the server refused to start a session for the computer that asked. `initiator_pending_enrollment`: it waits under **Join requests**. `initiator_not_registered`: no device registered with this server from that address. `initiator_banned`: the device is banned. `initiator_ambiguous_same_nat`: several devices share the public address of the computer that asked, as in an office behind one router, and the server can't tell which one it is. The client then shows "ID does not exist". Setting `ALLOW_SHARED_NAT_INITIATOR=Y` lets a computer at such an address start sessions anyway, without the server knowing which device asked; see [Configuration](/docs/operations/configuration).
- A computer that was set up again or reset can come back with its old ID and a new key. The log shows `[signal] PK mismatch for <id>`, and the console shows the device offline with a **New key** notice on its **Overview** tab. Approve the new key or delete the device; see [A reinstalled or reset computer](/docs/console/add-a-computer#a-reinstalled-or-reset-computer).
- After a move from a RustDesk server, see [Move from a RustDesk server](/docs/getting-started/migrate-from-rustdesk).

## The server's key

At every start the server logs its public key as `Server public key: <key>`. The **Key** in every client must be the same.

The key pair is `id_ed25519` and `id_ed25519.pub`: in `/opt/neodesk/` on Linux, in `C:\NeoDesk\` on Windows, and in Docker in the volume `neodesk-data`, which the container mounts at `/opt/neodesk/data/`.

- `Failed to initialize keypair: keys: public key file does not match private key`, and the server does not start: `id_ed25519.pub` does not belong to `id_ed25519`, for example because only one of the two was replaced. Put back the pair that belongs together.
- `Failed to initialize keypair: keys: failed to read private key ...`: the account the server runs as cannot read `id_ed25519`. On Linux, start the installer's menu and choose **Repair installation**, then **Repair permissions**:

  ```bash
  sudo neodesk-setup
  ```

- `Failed to initialize keypair: keys: invalid base64` or `invalid private key size`: `id_ed25519` is not a key file the server can read. Key files from `ssh-keygen` are of this kind. The server reads the files it makes itself and those of a RustDesk server.

To make a new pair, stop the server, move both files away and start it again: with no `id_ed25519` it makes a new pair. Every client then needs the new key.

## Connections fail through the relay

When two devices cannot connect directly, the server tells both to meet at its relay. The address it gives them is the first of these that is set:

1. **Public relay server** under **Settings**, **General**. The server takes a saved value at once, and its log says `Relay for devices: <address>, the public relay server of the console's settings` at start.
2. `RELAY_SERVERS`.
3. The public address the server detected, else its LAN address.

So when **Public relay server** holds a wrong address, correct it there; `RELAY_SERVERS` doesn't count while it is set.

- In Docker without `RELAY_SERVERS` in `.env`, the container looks the public address up at every start and logs `Relay IP: ... (auto-detected)`. `Auto-detected IP ... is private` or `Could not auto-detect public IP for relay` mean the lookup failed: set `RELAY_SERVERS=<public-address>` in the `.env` file next to the compose file, with the address clients reach the server at, and recreate the container. See [The relay address](/docs/getting-started/docker#the-relay-address).

  ```bash
  docker compose up -d
  ```

- On Linux and Windows the installer put the relay address into the service's arguments at install time, the public or the LAN address. If it is wrong or your public address changed, set `RELAY_SERVERS` in the env file, which wins over the argument, and restart the service. On Linux:

  ```bash
  sudo systemctl restart neodesk-server
  ```

  On Windows:

  ```powershell
  Restart-Service NeoDeskServer
  ```

  An install made by an older script that still runs as a scheduled task restarts when you stop the server, until its next update makes it the service; see [Install on Windows](/docs/getting-started/windows#files-and-the-service):

  ```powershell
  Stop-Process -Name neodesk-server -Force
  ```
- Port 21117 has to be open for TCP.
- `[relay] Pair timeout for UUID ...` in the log means only one device reached the relay within 30 seconds. The other one cannot reach the relay address.
- `[relay] Pair established: <address> <-> <address>` means both devices reached the relay and it carries the session.

## Behind a proxy: signed out, or the wrong address

Signed out right after signing in:

- With **One session per account** on under **Settings**, **Sign-in**, or with `SESSION_MAX_PER_USER=1`, an account may have one session at a time. Signing in with the same account in another browser ends the earlier session.
- With `HTTPS_ENABLED=true` and a certificate, the plain port only redirects to the console's own HTTPS port, and a proxy that sends requests to the plain port gets no console. Behind a proxy, see [Secure cookies](/docs/operations/reverse-proxy-tls#secure-cookies).
- A new session secret signs everyone out. Without `SESSION_SECRET` the console keeps it in its data folder, so a lost `neodesk-console-data` volume makes a new one.

Client setup, QR codes or install commands show the wrong address: without settings of its own, the console takes the host from `PANEL_PUBLIC_HOST`, from its API address, or from the address the browser used. Enter the addresses under **Public client endpoints** in **Settings**, **General**; see [Check the addresses clients get](/docs/operations/reverse-proxy-tls#check-the-addresses-clients-get).

## Docker: the container does not stay up

- `ERROR: /opt/neodesk/data is NOT writable by the neodesk user` appears with a bind mount whose folder belongs to another user. Set `PUID` and `PGID` in `.env` to the folder's owner, change the owner to 10001, or use the named volumes of the compose file.
- `Failed to open database` with PostgreSQL: check `DATABASE_URL` and that the `postgres` container runs. Without `COMPOSE_PROFILES=postgres` in `.env`, start it with `--profile postgres`. See [PostgreSQL](/docs/operations/postgresql).
