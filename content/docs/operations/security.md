---
title: Hardening
description: The settings and steps that make a NeoDesk server on the internet safer, from TLS for the console to who may start sessions, and what each one changes.
order: 8
icon: shield
---

This page goes through the settings that make a server on the internet safer and says what each one changes. Some of them stop devices that worked before, so check each against how your devices connect before you turn it on.

## Keep the console behind TLS

The console speaks plain HTTP on port 3375 (5000 on Linux and Windows installs from before 3.6.0-rc.5). Put a reverse proxy with a certificate in front of it and let only the proxy reach the port; see [Keep the console local](/docs/operations/reverse-proxy-tls#keep-the-console-local).

Set `TRUST_PROXY` only when nobody but the proxy can reach the console. With it on, whoever reaches the console directly can claim any client address, and the sign-in limits count that address. The server's API is stricter and believes only the addresses in `TRUSTED_PROXIES`. See [Trusting the proxy](/docs/operations/reverse-proxy-tls#trusting-the-proxy).

The console sends `Strict-Transport-Security` only when it serves HTTPS itself. Behind a proxy, add the header there, for example in nginx:

```nginx
add_header Strict-Transport-Security "max-age=31536000" always;
```

## Admit new devices only with approval

In the `managed` enrollment mode a new device waits under **Enrollment requests** until someone approves it; `locked` admits only devices with a valid token. The installers and a new Docker volume start in `managed`. See [Enrollment modes](/docs/console/enrollment#enrollment-modes).

The mode chosen in the console wins over `ENROLLMENT_MODE` after the first start. To have the variable win at every start, so that a change in the console lasts only until the next restart, set `ENROLLMENT_MODE_ENV_OVERRIDE=Y` with it.

When the mode is `open` and the ID server or the relay runs without TLS, the server logs an error line at every start that says so.

Leave `ALLOW_LEGACY_OUTBOUND` off. In the `open` mode it lets a RustDesk app that never registered as a device start sessions.

## Limit who can start sessions

By default any registered device can start a session to another one; the remote device still asks for its password or approval. Two switches under **Settings**, **General**, **Connection strategy**, **Advanced options** narrow that down:

- **Only signed-in RustDesk apps can start sessions**: the RustDesk app has to be signed in to a NeoDesk account. Without a valid sign-in the server refuses the session and logs `Rejected outbound from ...` with `reason=initiator_login_required`. Sessions from the browser are not affected.
- **Only accounts that may connect to devices can start sessions**: the account the app is signed in to also needs the permission to connect to devices. The server reads the account's role for every new session, so a changed role counts at once.

Click **Save connection strategy** after changing them. They are also the variables `LOGGED_IN_ONLY_INITIATOR` and `OPERATOR_ONLY_OUTBOUND`; see [Connections](/docs/operations/configuration#connections).

Leave **Let devices that share a public IP address start sessions without signing in** off. Without it, when several devices share one public address and the app can't show which of them it is, the server refuses the session (`reason=initiator_ambiguous_same_nat`) instead of picking one.

## Encrypt the ID server and relay

`TLS_SIGNAL=Y` and `TLS_RELAY=Y`, with `TLS_CERT` and `TLS_KEY`, add TLS to the ID server, the NAT test and the relay. Clients without TLS still connect on those ports, because the server tells TLS from plain connections by the first byte. The WebSocket ports 21118 and 21119 then take TLS only. The Linux and Windows installers turn this on with their self-signed certificate; the Linux installer's **External reverse proxy** mode turns it off again.

For CDAP device agents, `CDAP_TLS_REQUIRED=Y` with `TLS_CERT` and `TLS_KEY` turns on TLS on port 21122 and refuses plain connections there.

## Sign-in

- **Settings**, **Sign-in**, **Require two-factor sign-in** makes a local account without two-factor sign-in set it up right after its next password sign-in. Directory and single sign-on accounts are left to their provider. Accounts with the [role](/docs/people/users-and-roles#roles) Pro license are not held to it, because they can't sign in to the console, where the set-up happens. See [Two-factor sign-in](/docs/people/two-factor).
- An account can be signed in on up to 10 browsers at once; a sign-in beyond that signs out the one used longest ago. To allow one session per account, turn on **One session per account** under **Settings**, **Sign-in**. Everyone checks their own browsers under **Signed-in devices** and signs out the ones they don't know; see [Your account](/docs/people/your-account). A session ends after 30 minutes without activity and 24 hours after sign-in. `SESSION_MAX_PER_USER`, `SESSION_IDLE_TIMEOUT` and `SESSION_MAX_AGE` change that; see [Configuration](/docs/operations/configuration#console-sessions-and-logs). The **Hardening** tab under **Activity**, **Security checks** shows the values the server runs with.
- The sign-in limits and lockouts are in [Sign-in and rate limits](/docs/operations/configuration#sign-in-and-rate-limits). Behind a proxy they need `TRUST_PROXY`.

## Close what you don't use

- Open only the ports in [Ports and firewall](/docs/operations/ports), and 21118 and 21119 only for clients that use WebSocket.
- Without CDAP device agents, turn the gateway off, see [The gateway](/docs/console/cdap#the-gateway), and keep 21122 closed in the firewall. The Linux and Windows installers leave it closed only with `CDAP_ENABLED=N` in the env file, and the one-line Docker install opens it either way.
- Keep `/metrics` and `/api/health/detail` to the addresses in `METRICS_IP_ALLOWLIST`, and leave `METRICS_PUBLIC` off. See [Monitoring](/docs/operations/monitoring#prometheus-metrics).
- Leave `ADMIN_PORT` unset unless you need the management interface. It listens on 127.0.0.1 only and starts only with `ADMIN_PASSWORD` set.

## Block addresses and devices

Bans and blocks you make in the console are kept in the database. For a list you keep yourself, the server reads a file with one entry per line: an IP address, a range, or `id:` and a device ID, each with an optional reason after a comma. It is `blocklist.txt` next to the server's key file (`/opt/neodesk/data/blocklist.txt` in Docker), or the file `BLOCKLIST_FILE` names. **Settings**, **Advanced** edits that same file as **Server blocklist (blocklist.txt)**.

```text
# Lines starting with # are comments
203.0.113.7
198.51.100.0/24, scanner
id:123456789, stolen laptop
```

The server reads the file at start. On Linux it reads it again when it gets `SIGHUP`:

```bash
sudo systemctl kill -s HUP neodesk-server
```

## Protect the secrets

- The key pair, `.api_key`, `mesh_agent_server.pem` and the env file, with `SESSION_SECRET`, `REMOTE_TARGET_VAULT_KEY` and the database password, are secrets, and so are the console's backups, which hold them. Store them like passwords; see [Backup and restore](/docs/operations/backup).
- The server API key under **Settings**, **Client setup**, **For scripts** can do nearly everything on the server. It can't change accounts, role permissions, API keys or second factors, and only Super admin and Administrator accounts see it whole. Give it only to scripts that need it; see [API keys](/docs/development/api#api-keys).
- A full backup holds every secret, so only Super admin and Administrator accounts download, restore or schedule one. See [The Backup page in the console](/docs/operations/backup#the-backup-page-in-the-console).
- Some settings are set on the server's host only: the release keys and signing switches (`UPDATE_MANIFEST_PUBLIC_KEY`, `UPDATE_REQUIRE_SIGNED_MANIFEST`, `NEODESK_SUPPORT_RELEASE_PUBLIC_KEY`), the signing seed and build command of custom clients (`NEODESK_CUSTOM_CLIENT_SIGNING_SEED`, `NEODESK_CLIENT_BUILD_COMMAND`), and the secrets `SESSION_SECRET`, `PANEL_TRUST_SECRET`, `ORG_PEER_VAULT_KEY`, `REMOTE_TARGET_VAULT_KEY`, `UPDATE_GITHUB_TOKEN` and `NEODESK_GITHUB_TOKEN`. The console doesn't write them: **Server**, **Configuration files** refuses to save an env file that adds, changes or removes one, and so does the settings API. A stolen admin session can't make the updater trust its own release key that way. Change them in the env file on the server and restart it.
- Keep `SMTP_TLS_VERIFY` on, so the console checks the mail server's certificate.
