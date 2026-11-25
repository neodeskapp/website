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

- Windows: `C:\NeoDesk\logs\server.log`.

`LOG_LEVEL` in the env file decides how much the log holds; a new install sets `info`. With `warn` or `error`, the lines at info level don't show, such as the start summary, `[console] listening on ...` and most lines quoted on this page. Set `LOG_LEVEL=info` in `/opt/NeoDeskConsole/.env` or `C:\NeoDeskConsole\.env` and restart the service to see them.

## Health checks

The console answers `/health` and the API answers `/api/health`, both without signing in. On a Linux or Windows install made before 3.6.0-rc.5, put the console's port 5000 in place of 3375:

```bash
curl http://localhost:3375/health
curl http://localhost:21121/api/health
```

```text
{"status":"ok","timestamp":"..."}
{"status":"ok","version":"..."}
```

Port 21121 answers on every install type; on Linux and Windows the console passes the request on to the server's API on 21114. In Docker, `docker compose ps` shows the container as healthy when both answer.

The binary can check the health addresses and ports in one go and prints a PASS or FAIL line for each:

```bash
docker compose exec neodesk neodesk-server check --port 21116 --port 21117
```

On a Linux install, name the API's port:

```bash
sudo /opt/neodesk/neodesk-server check --api http://127.0.0.1:21114/api/health --port 21116 --port 21117
```

`/api/health/detail` and `/metrics` give more, but only to the addresses in `METRICS_IP_ALLOWLIST` or with an API key.

## The console does not open

- Use `http://`, not `https://`, unless you set up HTTPS. The console's port speaks plain HTTP: 3375, or 5000 on a Linux or Windows install made before 3.6.0-rc.5.
- A Docker install that answered on 5000 moves to 3375 at its first update to 3.6.0-rc.5 or later, unless `NEODESK_CONSOLE_PORT` in its `.env` names a port. See [The console's port after the update](/docs/operations/updating#the-consoles-port-after-the-update).
- With `CONSOLE_PORT=0` the console is off. A minimal install (`--minimal`) sets that.
- With `HOST=127.0.0.1` the console answers only on the machine itself, which is what you want behind a reverse proxy on the same machine.
- `[console] ERROR: HTTP port 3375 is already in use` in the log means another program holds the port. When `CONSOLE_PORT` is not set at all, the server keeps running without its console and logs `the server runs without its console`; set `CONSOLE_PORT` to a free port. In Docker, Compose refuses to start the container when the host port is taken.
- With `HTTPS_ENABLED=true` and a certificate, the console is on port 5443 and the plain port redirects there, or shows a page that asks you to set `PANEL_PUBLIC_HOST`.
- The firewall. The Linux and Windows installers open the console's ports in the machine's own firewall; a firewall in front of the machine, such as a cloud provider's, is up to you. See [Ports and firewall](/docs/operations/ports).

## Forgot the admin password

In Docker, `neodesk-show-admin-credentials` prints the first password only until someone changes it; see [Get the admin password](/docs/getting-started/docker#get-the-admin-password). On an install made with the script, `sudo bash neodesk-docker.sh reset-password`, run in `/opt/neodesk/docker`, gives `admin` a new random password and prints it once. To choose the password yourself, and on an install with the compose file, type it after the first command (it does not show), then run the second in the folder with the compose file:

```bash
read -rs NEWPASS
printf '%s\n' "$NEWPASS" | docker compose exec -T -u neodesk neodesk neodesk-server reset-password admin
```

On Linux, `sudo neodesk-setup --reset-password` sets the password from `ADMIN_PASSWORD`, or a random one, and shows it once. In the menu of `sudo neodesk-setup`, **Reset admin password** also lets you type one. The server's own command works too, run as the service account:

```bash
read -rs NEWPASS
printf '%s\n' "$NEWPASS" | sudo -u neodesk env NEODESK_ENV_FILE=/opt/NeoDeskConsole/.env /opt/neodesk/neodesk-server reset-password admin
```

On Windows, run `C:\NeoDesk\neodesk.ps1` as Administrator and choose **Reset admin password**.

`reset-password` works on SQLite and PostgreSQL and takes effect at once. It reads the password from standard input and refuses to read it from a terminal, so that it never shows. The password needs at least 8 characters, the same rule as everywhere else. Without an account of that name, it creates one with the admin role. It does not turn off two-factor sign-in; for that, see [Two-factor sign-in](/docs/people/two-factor). A lock from failed attempts ends by itself, 15 minutes after the last one.

## Sign-in says "Too many attempts"

The console refuses a sign-in with "Too many attempts. Please try again later." when one of these limits is reached:

- 5 sign-in attempts from one address within a minute,
- 10 failed sign-ins of one account from one address within 15 minutes, which lock that account for that address for 15 minutes after the last one,
- 30 failed sign-ins from one address, for any account, within 15 minutes.

Behind a reverse proxy without `TRUST_PROXY`, all people share the proxy's address and reach these limits together. Set it as described in [Reverse proxy and TLS](/docs/operations/reverse-proxy-tls#trusting-the-proxy). Otherwise wait, or change the limits; see [Configuration](/docs/operations/configuration#sign-in-and-rate-limits).

## Clients show "not ready" or cannot connect

- Compare the client's ID server and Key with **What clients get now** under **Settings**, **General**. See [Connect a client](/docs/getting-started/connect-a-client).
- Make sure the client's network reaches port 21116 over TCP and UDP, and 21115.
- In the `managed` and `locked` enrollment modes, a new device cannot register until someone approves it under **Enrollment requests**. A new install starts in `managed`. The log shows `Rejected new peer <id> from <address> (enrollment policy)`. See [Enrollment](/docs/console/enrollment).
- `Rate limited RegisterPk for new peer` in the log means more than `SIGNAL_RATE_LIMIT_PER_IP` new devices (20 a minute) registered from one address. Raise it when many devices share a public address.
- If the server lost its key file, it made a new key, and clients with the old one cannot connect. Restore the old key file or give clients the new key; see [why the key file matters](/docs/operations/backup#why-the-key-file-matters).
- A RustDesk client shows online in the console, but without host name, user or OS, or signing in from it fails: its **API server** names the wrong address or port. Leave it empty or set it to `http://<server-address>:21121` in the client's network settings. See [the API port](/docs/operations/ports#the-api-port-on-linux-and-windows).
- The first time a client registers after the server started, the log shows `[signal] New peer registered: <id> from <address>`.
- `Rejected outbound from <address> (... reason=...)` names why the server refused to start a session for the computer that asked. `initiator_pending_enrollment`: it waits under **Enrollment requests**. `initiator_not_registered`: no device registered with this server from that address. `initiator_banned`: the device is banned. `initiator_ambiguous_same_nat`: several devices share the public address of the computer that asked, as in an office behind one router, and the server can't tell which one it is. The client then shows "ID does not exist". Setting `ALLOW_SHARED_NAT_INITIATOR=Y` lets a computer at such an address start sessions anyway, without the server knowing which device asked; see [Configuration](/docs/operations/configuration).
- A computer that was set up again or reset can come back with its old ID and a new key. The log shows `[signal] PK mismatch for <id>`, and the console shows the device offline with a **New key** notice on its **Overview** tab. Approve the new key or delete the device; see [A reinstalled or reset computer](/docs/console/add-a-computer#a-reinstalled-or-reset-computer).
- After a move from a RustDesk server, see [Move from a RustDesk server](/docs/getting-started/migrate-from-rustdesk).

## The server's key

At every start the server logs its public key as `Server public key: <key>`. The **Key** in every client must be the same.

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

- On Linux and Windows the installer put the relay address into the service's arguments at install time, the public or the LAN address. If it is wrong or your public address changed, set `RELAY_SERVERS` in the env file, which wins over the argument, and restart the service.
- Port 21117 has to be open for TCP.
- `[relay] Pair timeout for UUID ...` in the log means only one device reached the relay within 30 seconds. The other one cannot reach the relay address.
- `[relay] Pair established: <address> <-> <address>` means both devices reached the relay and it carries the session.

## Behind a proxy: signed out, or the wrong address

Signed out right after signing in:

- One account may have one session at a time (`SESSION_MAX_PER_USER=1`). Signing in with the same account in another browser ends the earlier session.
- With `HTTPS_ENABLED=true` and a certificate, the plain port only redirects to the console's own HTTPS port, and a proxy that sends requests to the plain port gets no console. Behind a proxy, see [Secure cookies](/docs/operations/reverse-proxy-tls#secure-cookies).
- A new session secret signs everyone out. Without `SESSION_SECRET` the console keeps it in its data folder, so a lost `neodesk-console-data` volume makes a new one.

Client setup, QR codes or install commands show the wrong address: without settings of its own, the console takes the host from `PANEL_PUBLIC_HOST`, from its API address, or from the address the browser used. Enter the addresses under **Public client endpoints** in **Settings**, **General**; see [Check the addresses clients get](/docs/operations/reverse-proxy-tls#check-the-addresses-clients-get).

## Docker: the container does not stay up

- `ERROR: /opt/neodesk/data is NOT writable by the neodesk user` appears with a bind mount whose folder belongs to another user. Set `PUID` and `PGID` in `.env` to the folder's owner, change the owner to 10001, or use the named volumes of the compose file.
- `Failed to open database` with PostgreSQL: check `DATABASE_URL` and that the `postgres` container runs. Without `COMPOSE_PROFILES=postgres` in `.env`, start it with `--profile postgres`. See [PostgreSQL](/docs/operations/postgresql).
