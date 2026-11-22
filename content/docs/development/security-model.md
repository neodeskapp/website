---
title: Security model
description: What the server trusts and how the code protects each boundary, from device identity and the encryption on each connection to accounts, tokens and the secrets it stores, and the gaps that remain.
order: 11
---

This page describes the security design as the code implements it, for people who review or change it. The settings an operator turns on are on [Hardening](/docs/operations/security), and the place to report a vulnerability is the repository's [security policy](https://github.com/neodeskapp/betterdesk/blob/main/SECURITY.md).

## Trust boundaries

| Boundary | Who crosses it | What protects it |
|---|---|---|
| Internet to the ID server and relay (21115 to 21119) | RustDesk clients | Device identity, the key exchange on TCP, optional TLS, enrollment, the check of who may start a session, rate limits |
| Internet to the client API (21121), and scripts to the API (21114 on Linux and Windows) | RustDesk clients, scripts | Sign-in tokens, API keys in a header, device tokens, rate limits |
| Browser to the console (5000 or 5443) | People | The session cookie, the CSRF token, roles and permissions, TLS from the console or a reverse proxy |
| Invite and quick support links on the console | Anyone with a link, BetterDesk's client | A code that works for a limited time and number of uses, a rate limit per address, see [Join and support codes](#join-and-support-codes) |
| Console to the API server | The console | Nothing crosses a network: the console calls the API server's handler in the same process, as the console's API key |
| Console to the ID server and relay | The browser's remote desktop | A proof only this process can make, see [The browser's bridge](#the-browsers-bridge) |
| Client to client | The remote session | Encrypted end to end by the two clients; the relay only copies bytes |
| Devices to the CDAP gateway (21122) | CDAP agents and bridges | An account's password, an API key or a device token, optional TLS, see [CDAP devices](/docs/console/cdap#how-a-device-signs-in) |
| Agents to the MeshCentral layer | MeshAgent | The agent certificate and the check of the web certificate, see [MeshAgent devices](/docs/console/meshagent#certificates) |

## Device identity

At its first start the server makes an Ed25519 key pair: `id_ed25519` holds the private key in base64 and is written with mode 0600, `id_ed25519.pub` the public key. Clients get the public key as the **Key** value and use it to check that they talk to this server.

- When a client asks to connect to a device, the server signs the pair of that device's ID and public key (the `IdPk` message) with its key. The client checks the signature with the server's public key, and so knows the device's key came from this server.
- A device ID is bound to the UUID and the public key it first registered with, in memory and in the database. A registration with another UUID is refused with `UUID_MISMATCH`, one with another key with `NOT_SUPPORT`, so an ID can't be taken over by another installation.
- The enrollment mode decides whether a new ID is admitted at all; see [Enrollment](/docs/console/enrollment#enrollment-modes). A banned or deleted device can't register, and neither they nor a device that waits for approval can start a session.

## The ID server connection

On TCP, the ID server begins with a key exchange that RustDesk clients from 1.2 on understand:

1. The server makes a Curve25519 key for this connection only and sends it signed with its long-term Ed25519 key (96 bytes: the signature and the key).
2. The client checks the signature, encrypts a fresh symmetric key with NaCl box to the server's key, and sends it with its own public key.
3. From then on every message is encrypted with NaCl secretbox (XSalsa20 and Poly1305). The nonce is a counter that goes up by one per message.

Because the Curve25519 key belongs to the connection, a leaked `id_ed25519` doesn't open recorded connections. A client that sends anything other than the key exchange first is served without encryption. Messages over UDP are never encrypted.

### TLS

With `TLS_SIGNAL=Y` and `TLS_RELAY=Y`, and a certificate in `TLS_CERT` and `TLS_KEY`, the TCP ports take TLS as well. A TLS connection starts with the byte `0x16`, which no RustDesk message does, so one port serves both kinds; the WebSocket ports then take TLS only. Every TLS listener in the server and the console requires TLS 1.2 or newer.

### WebSocket origins

The ID server's and the relay's WebSockets accept the origins in `WS_ALLOWED_ORIGINS`. Without that setting they accept a browser only from `localhost`, `127.0.0.1` or `::1`, and any client that sends no `Origin`, as native RustDesk clients do.

## Sessions between devices

- **Who may start one.** For each connection request the ID server works out which registered device is asking, or refuses. See [Who may start a session](/docs/development/rustdesk-compatibility#who-may-start-a-session) for the order of the checks.
- **The relay.** The ID server records the UUID of each relay session it authorizes, with the two devices, before either reaches the relay. The relay pairs only those UUIDs, once each; a UUID that was used can't be authorized again until it expires. These tickets live only in the process's memory, which is why the ID server and the relay can't run apart. After pairing the relay copies bytes between the two ends without reading them, and closes a pair that is silent for 30 seconds.
- **The session.** The two clients encrypt the session between themselves; the relay has no key for it.
- **The browser viewer.** It never presses Ctrl+C on the device by itself, and files come from the device only when the operator copies them there.

### The browser's bridge

Remote desktop in the browser reaches the ID server through the console, which opens a TCP connection to the ID server inside the same process. Its first frame is a proof: a 32-byte secret the server makes at start and keeps only in memory, plus the ID of the signed-in account. A connection that starts with the proof and comes from an address in `PANEL_SIGNAL_PROXY_CIDRS` (loopback by default) may start sessions without a registered device, because the console checked the account or the guest link when the browser opened the WebSocket, and checks every device it asks for. A connection from a loopback address without the proof is treated as any other client.

## Accounts and sign-in

### Passwords

New password hashes are PBKDF2 with HMAC-SHA256, 600,000 iterations, a 16-byte random salt and a 32-byte result, stored as `pbkdf2-sha256$<iterations>$<salt>$<hash>`. The API server and the console make them the same way, and so does the `reset-password` command. bcrypt hashes and an older PBKDF2 form from earlier versions still verify. A sign-in through the API server replaces such a hash with a new one; the console checks every form and replaces none. A new password must have 8 to 128 characters, checked by the server on every path that sets one.

The passwords of a device's unattended access policy are bcrypt hashes.

### Two-factor codes

Codes follow RFC 6238: HMAC-SHA1, 6 digits, 30-second steps, with a 20-byte secret. The console accepts only the code of the current step, and refuses a code from a step that already signed the account in. The API server, which RustDesk clients sign in through, also accepts the codes of the step before and after. The 8 recovery codes are shown once and stored as bcrypt hashes, and each works once.

### Tokens

- **API tokens.** The API server signs its tokens with HMAC-SHA256 (JWT). The secret is `JWT_SECRET`, or one the server made at its first start (32 random bytes) and keeps in the database. A token lasts `JWT_EXPIRY_HOURS`, 24 hours by default.
- **Client sign-in tokens.** A RustDesk client that signs in gets a token of 32 random bytes in hex. The server keeps only its SHA-256 hash. The token lasts `CLIENT_SESSION_EXPIRY_DAYS` (7), each use extends it, and it ends `CLIENT_SESSION_MAX_DAYS` (30) after the sign-in at the latest. It belongs to the account and never proves a device.
- **Device tokens.** The server gives a device a token of 32 random bytes in hex when it admits it: an approved registration, a join through an invite, an agent template, or a registration signed with the device's own key. The token is bound to the device ID and kept as a SHA-256 hash with its first 8 characters, on behalf of no account, so deleting an account ends none. It doesn't expire by time; deleting or banning the device, changing its ID or issuing a new token ends it. A signed registration is good for five minutes either side of the server's clock, so a device whose clock is off by more is refused until its clock is right.
- **API keys.** Scripts send a key in the `X-API-Key` header; the server takes it nowhere else, so it doesn't end up in logs and proxies through the URL. The server's own key is 32 random bytes in hex, written to `.api_key` with mode 0600 at the first start when none exists. The database holds API keys as SHA-256 hashes, and also keeps the server's own key itself in `server_config`.

### Client addresses behind a proxy

Rate limits, lockouts and the logs use the client's address. The API and the console read it from `X-Forwarded-For` only when the connection comes from a proxy they trust (`TRUST_PROXY`, and `TRUSTED_PROXIES` for the API), and then take the rightmost entry that is not a trusted proxy. Entries further left are what the client wrote itself and never count.

### The console session

The cookie is `bd.sid`, or `betterdesk.sid` when the console is set up for HTTPS. Its value is a random 24-byte ID with an HMAC-SHA256 over it, keyed with the session secret. The session itself is a row in `panel_sessions`; the cookie holds nothing else. The cookie is `HttpOnly` and `SameSite=Lax`. It is `Secure` when the console serves HTTPS, and also when a request came over HTTPS through a reverse proxy the console trusts (`TRUST_PROXY`), which reports it in `X-Forwarded-Proto`. A session ends when it was idle too long or when its absolute lifetime is over; the defaults are on [Hardening](/docs/operations/security#sign-in).

Writes to the console's API, apart from the client and device API, need a CSRF token: 64 random bytes, sent back in the `X-CSRF-Token` header and checked against a cookie that holds the token and the SHA-256 of the token followed by the session secret.

The session secret is `SESSION_SECRET`, or else the file `.session_secret` in the console's data folder. When neither exists the console makes 32 random bytes and saves them there with mode 0600.

## Join and support codes

[Add a computer](/docs/console/add-a-computer) and [Quick support](/docs/console/quick-support) hand out links that carry a code.

- A code is 8 symbols from an alphabet without 0, 1, I, L, O and U, about 39 bits. The server keeps only its SHA-256 hash, in `server_config`, with its kind, expiry and uses left.
- Every route that takes a code (the page data, the package download, the Linux scripts and the redeem) counts against one limit of 20 requests a minute per address. Wrong, expired, used and revoked codes all get the same answer.
- A join code works for 7 days unless its maker chose another lifetime (at most 30 days), for the number of uses it was made with. Its redeem approves the device whatever the enrollment mode and gives the client the server's addresses, its key and a device token.
- A support code works for one hour and once. Its redeem gives the quick support app a session token, kept as a hash, that opens only that session's routes. The person at the computer has to allow the session on their screen. The app then hands its session password to the server, which keeps it in memory only and gives it once to the account that made the session. The session ends when the app closes, the supporter ends it, or the app stops calling in for 3 minutes.
- The pages and the client warn when the console runs on plain HTTP.

## Secrets the server stores

| Secret | Where | How |
|---|---|---|
| The server's private key | `id_ed25519` | Base64, file mode 0600 |
| The server's API key | `.api_key` and `server_config` | As it is, file mode 0600 |
| The first admin password, when the server made one up | `.admin_credentials` | As it is, file mode 0600 |
| The session secret | `SESSION_SECRET` or `.session_secret` | As it is, file mode 0600 |
| The secret that signs API tokens | `JWT_SECRET` or `server_config` | As it is |
| Client sign-in tokens, device tokens, quick support session tokens | Database | SHA-256 hashes |
| Join, support and pairing codes | `server_config` | SHA-256 hashes |
| Quick support session passwords | Memory only | Given once to the supporter, then forgotten |
| The telemetry key | `server_config` | An X25519 private key, see [The envelope](/docs/development/architecture#the-envelope) |
| Device passwords an organization stores | Database | AES-256-GCM, with a key from `ORG_PEER_VAULT_KEY`, or else from the secret that signs API tokens |
| Passwords of RDP and VNC targets | Database | AES-256-GCM, with a key from `REMOTE_TARGET_VAULT_KEY`; without that key the server stores none |
| Two-factor secrets | Database | As they are |
| The LDAP bind password and the OIDC client secret | `server_config` | As they are; the API answers with a mask instead |

The database itself is not encrypted. Treat it, the env file and every backup as secrets; see [Backup and restore](/docs/operations/backup).

## Audit trail

The server's events (sign-ins, refused registrations, sessions allowed and denied, changes to devices, accounts and settings) and the console's own audit log are kept in the database for 90 days. Each server event names the account or API key that acted, or the client's address where no account acted, as for a sign-in or a device. `AUDIT_LOG_FILE` also appends the server's events to a file.

## Releases

Each release has a manifest of its binaries and their SHA-256 sums, signed with an Ed25519 key whose public half is compiled into the server. The updater and the installers refuse a release without a valid signature and check each binary's SHA-256 (the installers skip both only with `--skip-verify` or `-SkipVerify`), and `betterdesk-server verify-release` checks a downloaded binary by hand. The same key signs the client's releases: the release cache uses one only when its `SHA256SUMS` carries a valid signature, and checks each package against it. See [What a release holds](/docs/development/releasing#what-a-release-holds).

## Gaps that remain

- The audit trail can be changed by whoever can write to the database; nothing chains or signs the entries.
- Two-factor secrets, the LDAP bind password and the OIDC client secret are stored unencrypted.
- Messages to the ID server over UDP are never encrypted, and neither are TCP messages from clients that skip the key exchange while TLS is off.
- The console speaks plain HTTP on port 5000 unless it serves HTTPS itself or sits behind a reverse proxy with TLS.
