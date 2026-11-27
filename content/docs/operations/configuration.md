---
title: Configuration
description: How the server reads its settings, where to set them for Docker, Linux and Windows, and the settings an operator changes most.
order: 1
icon: settings
---

The server and the web console run in one process, and both read their settings from environment variables. This page shows where to set them for each install type and lists the ones you are most likely to change.

## How the server reads its settings

- Environment variables: every setting on this page is one. On/off settings take `1` or `0`, `true` or `false`, `yes` or `no`, `y` or `n`, and `on` or `off`, in any letter case.
- Command-line flags: some settings also have a flag, listed in the tables below, and `neodesk-server -h` prints them all. When a setting is given both ways, the environment variable wins.
- An env file: when `NEODESK_ENV_FILE` names a file, the server reads it once at start. Each line is `KEY=value`, and lines starting with `#` are comments. Values may be quoted, and ` #` after a value starts a comment, as in other `.env` files. The file only fills variables the environment leaves empty, and the first line with a value for a key counts. At each start the server also adds the settings of its release that the file lacks, with their defaults.
- Settings saved in the console: once you save them, some settings live in the database and win over the environment, which then only gives the first default. These are the connection strategy, the time sync settings, the RustDesk client session lengths and the join mode. **Public client endpoints** are kept in `public-endpoints.env` in the data folder and win over `PUBLIC_SERVER_ID`, `PUBLIC_RELAY_SERVER` and `PUBLIC_API_URL`; an address saved empty lets its variable count again. Two switches make the environment win instead: `ENROLLMENT_MODE_ENV_OVERRIDE` for the join mode and `PUBLIC_ENDPOINTS_ENV_OVERRIDE` for the public client endpoints.

Restart the server after changing a variable. It reads its environment and the env file only at start.

## Docker

The compose file passes every line of the `.env` file next to it to the container (Docker Compose 2.24 or newer), so put your settings there. After an install with the script, that is `/opt/neodesk/docker/.env`. For example, with the address clients reach the server at in place of `<public-address>`:

```ini
RELAY_SERVERS=<public-address>
TRUST_PROXY=Y
LOGIN_RATE_LIMIT_MAX=10
```

Then recreate the container, in the same folder:

```bash
docker compose up -d
```

[Settings in .env](/docs/getting-started/docker#settings-in-env) lists the settings of the compose file itself, such as the image tag.

The `environment:` list in the compose file wins over `.env`. Most of its entries have the form `NAME=${NAME:-default}` and take their value from `.env` anyway, but some are fixed, among them `HOST=0.0.0.0`, `CONSOLE_PORT=3375`, `API_ENABLED=false`, `DATA_DIR=/app/data` and the paths inside the volumes. To publish the console on another host port, or on one address of the host only, set `NEODESK_CONSOLE_PORT`, `NEODESK_CONSOLE_HTTPS_PORT` and `NEODESK_CONSOLE_BIND` in `.env`; see [Changing a port](/docs/operations/ports#changing-a-port).

`ADMIN_USERNAME` and `ADMIN_PASSWORD` only count before the first start; the compose file passes them on as the first admin account.

## Linux

The installer runs the server as the systemd service `neodesk-server`, defined in `/etc/systemd/system/neodesk-server.service`. The unit sets `NEODESK_ENV_FILE` to the console's env file, by default `/opt/NeoDeskConsole/.env`, and that file holds most settings.

The unit also sets a few variables itself, and those win over the env file: `GO_API_PORT=21114`, `MESH_ENABLED=Y`, and the connection strategy chosen at install (`P2P_FIRST`, `ALWAYS_USE_RELAY`, `P2P_FALLBACK_MS` and `SAME_NAT_RELAY`). Its command line passes the relay address, the key file, the API port, the registration rate limit and, when the installer made certificates, the TLS flags. A variable in the env file overrides the matching flag, for example `RELAY_SERVERS` overrides `-relay-servers`. The installer writes the unit again on every update and repair, with the arguments and extra settings the unit had.

Edit the env file, then restart:

```bash
sudoedit /opt/NeoDeskConsole/.env
sudo systemctl restart neodesk-server
```

The installer can also change settings that its built-in template knows, and restarts the service afterwards:

```bash
sudo neodesk-setup --set-config TRUST_PROXY=Y --set-config LOG_LEVEL=info
```

## Windows

The installer registers the Windows service `NeoDeskServer`. Its env file is `C:\NeoDeskConsole\.env`. The service sets a few variables itself, in the value `Environment` of its registry key `HKLM\SYSTEM\CurrentControlSet\Services\NeoDeskServer`, and those win over the env file: `NEODESK_ENV_FILE`, `NEODESK_SUPERVISOR`, `GO_API_PORT=21114`, `MESH_ENABLED=Y` and the connection strategy chosen at install. Edit the env file, then restart the service:

```powershell
Restart-Service NeoDeskServer
```

In PowerShell as Administrator, this changes template settings, like `--set-config` on Linux:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File C:\NeoDesk\neodesk.ps1 -SetConfig KEY=VALUE
```

## Addresses and ports

| Variable | Default | Flag | What it does |
|---|---|---|---|
| `SIGNAL_PORT` | `21116` | `-port` | ID server port, TCP and UDP. The NAT test port is one below it, the WebSocket ID server two above. The server does not read `PORT`. |
| `RELAY_PORT` | `21117` | `-relay-port` | Relay port. The WebSocket relay is two above it. |
| `GO_API_PORT` | `21114` | `-api-port` | Port of the server's API. Without it the server takes `API_PORT`, which the console's client API uses as well, so the start stops while that client API is on. Docker starts the server with `-api-port 21121`. |
| `RELAY_SERVERS` | detected | `-relay-servers` | Relay address the server gives devices, as host or host:port, when no **Public relay server** is saved in the console. Without either, the server uses its detected public address, then its LAN address. In Docker the entrypoint looks up the public address at every start. |
| `CONSOLE_PORT` | `3375` | | Port of the web console (5000 up to 3.6.0-rc.4; installs made before keep it, see [Ports and firewall](/docs/operations/ports#the-consoles-port-before-360-rc5)). `0` turns the console off. |
| `HOST` | `127.0.0.1` | | Address the console listens on. Docker and the installers set `0.0.0.0`. |
| `API_ENABLED`, `API_PORT`, `API_HOST` | `true`, `21121`, `0.0.0.0` | | On Linux and Windows the console also answers the RustDesk client API on `API_PORT`, passes it to the server's API, and gives clients this port in their API server address. Docker sets `API_ENABLED=false`, because the server's API is on 21121 there. |
| `RUSTDESK_API_TLS` | `auto` | | `false` keeps the client API port on plain HTTP. Otherwise it serves HTTPS when the console's certificate loads. The installers set `false` when they make their self-signed certificate. |
| `PUBLIC_SERVER_ID`, `PUBLIC_RELAY_SERVER`, `PUBLIC_API_URL` | | | The addresses clients get, the same as **Public client endpoints** in **Settings**, **General**. A value saved there wins, unless `PUBLIC_ENDPOINTS_ENV_OVERRIDE` is on. |
| `PANEL_PUBLIC_HOST` | | | Host name of the console. The console uses it for client setup when nothing more specific is set, and as the target of its HTTPS redirect. The installers set it to the address clients use, unless the env file has one. |
| `PANEL_PUBLIC_URL` | | | Address of the console in mails. |

The server does not start when two of its listeners would use the same port. The log names both settings.

## Database

| Variable | Default | Flag | What it does |
|---|---|---|---|
| `DATABASE_URL` | | | The database: a SQLite file path or a `postgres://` URL. The server takes the type from the scheme. |
| `DB_URL`, `DB_TYPE` | `./db_v2.sqlite3` | `-db` | Still read: `DB_URL` names the database when `DATABASE_URL` is empty. A `DB_TYPE` that contradicts the scheme of `DATABASE_URL` wins, and the log says so. A relative path starts in the working folder. |

See [PostgreSQL](/docs/operations/postgresql).

## Connections

The first six are the first defaults of **Connection strategy** under **Settings**, **General**. Once you save that section, the saved values win.

| Variable | Default | Flag | What it does |
|---|---|---|---|
| `P2P_FIRST` | on | `-p2p-first` | Direct connections first. Off sends every session through the relay, and so does `ALWAYS_USE_RELAY` (`-always-relay`). |
| `P2P_FALLBACK_MS` | `2000` | `-p2p-fallback-ms` | How long a client tries a direct connection before it uses the relay, in milliseconds. |
| `SAME_NAT_RELAY` | on | `-same-nat-relay` | Use the relay when both computers have the same public IP address. |
| `ALLOW_SHARED_NAT_INITIATOR` | off | `-allow-shared-nat-initiator` | Let devices that share a public IP address start sessions without signing in. See [Hardening](/docs/operations/security#limit-who-can-start-sessions). |
| `LOGGED_IN_ONLY_INITIATOR` | off | `-logged-in-only-initiator` | Only signed-in RustDesk apps can start sessions. |
| `OPERATOR_ONLY_OUTBOUND` | off | `-operator-only-outbound` | Only accounts that may connect to devices can start sessions. |
| `ALLOW_LEGACY_OUTBOUND` | off | | Lets a RustDesk app that never registered as a device start sessions, always through the relay. Only in the `open` join mode. |
| `MASK` | | `-mask` | Your LAN's range, for example `192.168.0.0/16`, which tells the server when two devices are on the same network. Without it, addresses in the same /24 count as one network. |
| `PANEL_SIGNAL_PROXY_CIDRS` | `127.0.0.0/8,::1/128` | | Addresses from which the console's bridge for remote desktop in the browser reaches the ID server. Change it only when `WS_HBBS_HOST` names another address of this machine. |

## Device agents

| Variable | Default | Flag | What it does |
|---|---|---|---|
| `CDAP_ENABLED`, `CDAP_PORT` | on, `21122` | `-cdap`, `-cdap-port` | The CDAP gateway for device agents. Once **Enable gateway** or **Disable gateway** on the IoT devices page has been used, that choice wins over `CDAP_ENABLED`. |
| `CDAP_TLS`, `CDAP_TLS_REQUIRED` | off | `-tls-cdap` | TLS on the CDAP port, with `TLS_CERT` and `TLS_KEY`. `CDAP_TLS_REQUIRED` also refuses plain connections. |
| `MESH_ENABLED` | on | | Support for MeshAgent devices. |
| `MESH_AGENT_CERT_FILE` | `mesh_agent_server.pem` | | The certificate mesh agents know the server by. A bare file name is looked up next to the server's key file. The server makes a new one at start when the file is missing; see [Backup and restore](/docs/operations/backup#why-the-key-file-matters). |
| `MESH_WEB_CERT_FILE` | | | The TLS certificate mesh agents see when they connect, when a reverse proxy holds it. Without it the server takes `TLS_CERT`. See [Reverse proxy and TLS](/docs/operations/reverse-proxy-tls#mesh-agents-behind-a-proxy). |

## Console, sessions and logs

| Variable | Default | What it does |
|---|---|---|
| `DATA_DIR` | `/app/data` in Docker, else `data` in the console folder | Where the console keeps its files: session secret, uploads, backups. |
| `SESSION_SECRET` | made and saved in `DATA_DIR/.session_secret` | Signs the session cookie. Changing it signs everyone out. |
| `SESSION_IDLE_TIMEOUT` | `1800000` | Milliseconds without activity before a console session ends (1 minute to 24 hours). |
| `SESSION_MAX_AGE` | `86400000` | Milliseconds after sign-in when a session ends anyway (5 minutes to 7 days). |
| `SESSION_IDLE_WARN_MS` | `60000` | How long before the idle end the console warns. |
| `SESSION_MAX_PER_USER` | not set | Sessions one account may have at once. While it is not set, **One session per account** under **Settings**, **Sign-in** decides: 1 when it is on, 10 when it is off. A value here decides instead and locks that switch. A new sign-in beyond the limit ends the least recently active session; `0` allows any number. See [Your account](/docs/people/your-account). |
| `CLIENT_SESSION_EXPIRY_DAYS`, `CLIENT_SESSION_SLIDING`, `CLIENT_SESSION_MAX_DAYS` | `7`, on, `30` | Sign-in sessions of RustDesk clients. Values saved under **Settings**, **Sign-in** win. |
| `DEFAULT_LANGUAGE` | `en` | Language for a browser that asks for none. |
| `LOG_LEVEL` | `info` | `error`, `warn`, `info` or `debug`, for the whole process. The installers' env file sets `info`. |
| `LOG_FORMAT` | `text` | `text` or `json`. |

## Security

| Variable | Default | Flag | What it does |
|---|---|---|---|
| `ENROLLMENT_MODE` | `open` | | `open`, `managed` or `locked`, the mode of the first start. The installers and a new Docker volume set `managed`. After that the mode chosen in the console wins, unless `ENROLLMENT_MODE_ENV_OVERRIDE` is on. See [Join requests](/docs/console/enrollment). |
| `TRUST_PROXY`, `TRUSTED_PROXIES` | off | `-trust-proxy`, `-trusted-proxies` | Trust a reverse proxy's forwarded headers. The console needs only `TRUST_PROXY`. `TRUSTED_PROXIES` is for a proxy in front of the server's API and WebSocket ports; without it those ports ignore forwarded headers, and the server says so at start. See [Reverse proxy and TLS](/docs/operations/reverse-proxy-tls#trusting-the-proxy). |
| `HTTPS_ENABLED`, `HTTPS_PORT`, `SSL_CERT_PATH`, `SSL_KEY_PATH` | off, `5443` | | HTTPS served by the console itself. See [HTTPS without a proxy](/docs/operations/reverse-proxy-tls#https-without-a-proxy). |
| `TLS_CERT`, `TLS_KEY`, `TLS_SIGNAL`, `TLS_RELAY`, `TLS_API` | off | `-tls-cert`, `-tls-key`, `-tls-signal`, `-tls-relay`, `-tls-api` | TLS on the server's own ports. Signal and relay then take plain and TLS connections on the same port, and their WebSocket ports TLS only; `TLS_API` makes the API port HTTPS only. |
| `JWT_SECRET` | made and stored in the database | `-jwt-secret` | Signs API tokens. |
| `PANEL_TRUST_SECRET`, `PANEL_TRUST_ALLOWED_HOSTS` | off | | A shared secret of at least 32 characters. With it, the console's changes to device groups reach the API as the signed-in account instead of as the console's API key, and the API port also takes requests signed with this secret from the same machine, or from the addresses in `PANEL_TRUST_ALLOWED_HOSTS`, as the account they name. Leave it unset unless a program of yours signs requests this way. |
| `REMOTE_TARGET_VAULT_KEY` | | | Encrypts stored RDP and VNC credentials. Without it, that store is off. The installers write one into the env file; Docker makes one at the first start and keeps it in the data volume as `.remote_target_vault_key`. |
| `WS_ALLOWED_ORIGINS`, `API_WS_ALLOWED_ORIGINS` | | | Comma-separated origins of browser pages allowed to open WebSockets on the server's ports: `WS_ALLOWED_ORIGINS` for the ID server and the relay, `API_WS_ALLOWED_ORIGINS` for the API's event stream. Empty lets the ID server and relay take pages from localhost only, and the event stream pages from its own host only. RustDesk clients send no origin and are not affected. |
| `API_ALLOW_FROM` | | | Comma-separated IP addresses and CIDR ranges, such as `192.0.2.10,198.51.100.0/24`, that get the whole API on 21114 on Linux and Windows, besides this machine. Other hosts get only the client API there. For scripts, SDK clients and monitoring on other hosts. See [The API port on Linux and Windows](/docs/operations/ports#the-api-port-on-linux-and-windows). |
| `METRICS_IP_ALLOWLIST`, `METRICS_PUBLIC` | | | Who may read `/metrics` and `/api/health/detail` on the API port without an API key. See [Monitoring](/docs/operations/monitoring#prometheus-metrics). |
| `BLOCKLIST_FILE` | `blocklist.txt` next to the key file | `-blocklist` | File of IP addresses, ranges and device IDs to refuse. See [Hardening](/docs/operations/security#block-addresses-and-devices). |
| `AUDIT_LOG_FILE` | | `-audit-log` | Write the server's audit events to this file, as JSON lines. See [Monitoring](/docs/operations/monitoring#audit-entries). |

## Sign-in and rate limits

These limits count the client's address. Behind a reverse proxy, set `TRUST_PROXY`, or every request counts as coming from the proxy.

| Variable | Default | What it does |
|---|---|---|
| `LOGIN_RATE_LIMIT_MAX` | `5` | Sign-in attempts, and second-factor codes, per address per window. |
| `RATE_LIMIT_WINDOW_MS` | `60000` | The window of the sign-in limit and of `RATE_LIMIT_MAX`. |
| `RATE_LIMIT_MAX` | `100` | Other requests to the console's API per address per window. |
| `PANEL_READ_RATE_LIMIT_MAX` | `600` | Reads by a signed-in account per window. They don't count toward `RATE_LIMIT_MAX`. |
| `API_MAX_FAILED_ATTEMPTS` | `10` | Failed sign-ins of one account from one address within the attempt window that lock the account for that address. |
| `API_LOCKOUT_MINUTES` | `15` | How long that lock lasts after the last failure. |
| `API_ATTEMPT_WINDOW` | `15` | The attempt window, in minutes. |
| `API_IP_RATE_LIMIT` | `30` | Failed sign-ins from one address, for any account, within the window before the address is refused. |
| `SIGNAL_RATE_LIMIT_PER_IP` | `20` | New device registrations per address per minute (flag `-signal-rate-limit-per-ip`). Raise it when many devices share one public address; `0` turns it off. |
| `RELAY_MAX_CONNS_PER_IP` | `20` | Relay connections per address (flag `-relay-max-conns-ip`). `0` means no limit. |

## Mail

The console uses these only while no mail server is saved under **Settings**, **Email**. It reads them at every send.

| Variable | Default | What it does |
|---|---|---|
| `SMTP_HOST` | | Mail server. Mail is off without it. |
| `SMTP_PORT` | `587` | Port of the mail server. |
| `SMTP_SECURE` | `false` | `true` for TLS from the first byte, usually port 465. |
| `SMTP_USER`, `SMTP_PASS` | | Login. |
| `SMTP_FROM` | `neodesk@localhost` | Sender address. |
| `SMTP_ALERT_EMAIL` | | Where alerts go. |
| `SMTP_TLS_VERIFY` | `true` | `false` skips the check of the mail server's certificate. |
| `SMTP_REQUIRE_TLS` | `true` | `false` allows the login without TLS, for a mail server on a trusted network. |
