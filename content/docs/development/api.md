---
title: The HTTP API
description: How a script or an integration signs in to the server's API, and the routes it can build on for devices, audit, keys, CDAP devices and MeshCentral agents.
order: 12
---

The NeoDesk server has one HTTP API. The web console, RustDesk clients and your own scripts all talk to it. This page is for scripts and integrations: where the API listens, how to sign in, and the routes worth building on. The console's own addresses under `/api/` on port 5000 serve the browser and are not covered here.

## Where it listens

| Install | Address for scripts |
|---|---|
| Linux and Windows | `http://<server>:21114` |
| Docker | `http://<server>:21121` |

On Linux and Windows the console answers the RustDesk client API on 21121 and passes only the client paths on to 21114 (see [The client API](#the-client-api)), so everything else on this page needs 21114. Call it from the server itself, or open the port in the firewall for the machines that need it. See [The API port on Linux and Windows](/docs/operations/ports#the-api-port-on-linux-and-windows).

The API speaks plain HTTP. With `TLS_API=Y` and a certificate in `TLS_CERT` and `TLS_KEY` it serves HTTPS instead; for a certificate clients trust, put a reverse proxy in front as shown in [HTTPS for the client API](/docs/operations/reverse-proxy-tls#https-for-the-client-api). With `FORCE_HTTPS=Y` the API refuses plain HTTP with 403, unless a trusted proxy reports `X-Forwarded-Proto: https`.

## Signing in

A few routes answer anyone, such as `/api/health`, `/api/server/pubkey` and the client sign-in. The other routes on this page need an API key or a sign-in token.

### API keys

Send the key in the `X-API-Key` header. The server does not read a key from the query string.

```bash
curl -H "X-API-Key: $NEODESK_API_KEY" http://127.0.0.1:21114/api/peers
```

A key acts with the role it was given. The server makes one key itself, the server API key, and gives it the admin role, so it can do everything. The server reads it from `API_KEY`, else from `.api_key` next to its key file, and writes a new one there when there is none. In the console, **Client setup** shows it under **For scripts**; **Show whole key** needs the **Manage API keys** permission.

For a script, make a key with a smaller role:

```bash
curl -X POST http://127.0.0.1:21114/api/keys \
  -H "X-API-Key: $NEODESK_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name": "inventory-export", "role": "viewer", "expires_in_days": 90}'
```

```json
{"id": 4, "key": "3f1c...", "prefix": "3f1c9a20", "name": "inventory-export", "role": "viewer", "expires_at": "2027-02-20 10:15:00"}
```

The answer is the only place the whole key appears, so store it right away.

- `role` is `viewer` when left out. A key gets only a role the caller could give an account: super admins any role, global admins `operator`, `viewer`, `pro` or `guest_issuer`. Server admins can list and delete keys but create none.
- `expires_in_days` is optional. After that day the server refuses the key like a wrong one.
- `GET /api/keys` lists the keys with their first 8 characters, name, role, dates and last use, and `DELETE /api/keys/{id}` removes one. All three routes need **Manage API keys**.

The console has no page for creating or deleting API keys; these routes are the way.

### Sign-in tokens

A script can also sign in as a console account and send the token it gets as `Authorization: Bearer <token>`:

```bash
curl -X POST http://127.0.0.1:21114/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "alice", "password": "..."}'
```

```json
{"token": "eyJhbGciOi...", "role": "operator", "username": "alice", "auth_provider": "local"}
```

The token is valid for 24 hours; `JWT_EXPIRY_HOURS` changes that. `GET /api/auth/me` shows which account a token belongs to.

When the account has two-factor sign-in, the first answer is `{"requires_2fa": true, "partial_token": "..."}`. Send that token with the code from the authenticator app, or a recovery code, to `POST /api/auth/login/2fa` within 5 minutes:

```bash
curl -X POST http://127.0.0.1:21114/api/auth/login/2fa \
  -H "Content-Type: application/json" \
  -d '{"partial_token": "eyJhbGciOi...", "code": "123456"}'
```

The server refuses a sign-in with 401 for wrong details or a single sign-on account, with 403 and `"code": "totp_setup_required"` while the account still has to set up two-factor sign-in (see [Make it mandatory](/docs/people/two-factor#make-it-mandatory)), and with 429 after 5 attempts within 5 minutes from one address or for one account name.

### What a credential may do

Each route asks for a permission, decided as in the console: the role's defaults with the changes saved under **Roles and permissions** (see [Roles and permissions](/docs/people/permissions#roles-and-permissions)). Super admins pass every check. The tables below give each route's permission by its name in the console.

Routes for one device also check that the device is one the account sees, by its folders and organization; see [Which devices a user sees](/docs/people/users-and-roles#which-devices-a-user-sees).

The API answers in JSON. An error is `{"error": "..."}`: 401 for a missing or wrong credential, 403 for a missing permission, and 404 for a path the API doesn't have. Request bodies may be up to 1 MB.

## Devices

| Method and path | Permission | What it does |
|---|---|---|
| `GET /api/peers` | View devices | The device list |
| `GET /api/peers/{id}` | View devices | One device |
| `PATCH /api/peers/{id}` | Edit devices | Changes `note`, `user`, `tags`, `display_name` or `linked_peer_id` |
| `PUT /api/peers/{id}/tags` | Edit devices | Replaces the tags: `{"tags": "a,b"}` or `{"tags": ["a", "b"]}` |
| `GET /api/tags/{tag}/peers` | View devices | Devices with a tag |
| `DELETE /api/peers/{id}` | Delete devices | Deletes the device, see below |
| `POST /api/peers/{id}/restore` | Delete devices | Brings a deleted device back |
| `POST /api/peers/{id}/ban` | Ban and unban devices | Bans it, with an optional `{"reason": "..."}`, and disconnects it |
| `POST /api/peers/{id}/unban` | Ban and unban devices | Lifts the ban |
| `POST /api/peers/{id}/change-id` | Change device ID | `{"new_id": "..."}`, 6 to 16 letters, digits, `-` or `_`; 409 when the ID is taken |
| `GET /api/peers/{id}/metrics` | View devices | The last CPU, memory and disk values the device reported; `limit` up to 1000, default 100 |
| `GET /api/peers/status/summary` | View devices | Counts of the connected devices: online, degraded, critical, by transport, banned and disabled |
| `GET /api/peers/online` | View devices | The devices online now |
| `POST /api/peers/{id}/wol` | Connect to devices | Wake-on-LAN, see below |
| `POST /api/peers/{id}/exec` | Terminal on MeshCentral agents, or CDAP terminal access | Runs a command, see below |

`GET /api/peers` answers a list. With `limit` (or `page_size`, at most 500) and `page` it answers `{"total": ..., "data": [...]}` instead. `include_deleted=true` adds deleted devices. Each device has, among others, `id`, `hostname`, `display_name`, `os`, `version`, `ip`, `tags`, `note`, `user`, `banned`, `soft_deleted`, `last_online`, `live_online` (connected now over any transport), `cdap_connected` and `mesh_connected`. Its `status` is 1 for an active and 0 for a disabled device; `status_text` holds `ONLINE`, `OFFLINE`, `DEGRADED` or `CRITICAL`.

```bash
curl -H "X-API-Key: $NEODESK_API_KEY" "http://127.0.0.1:21114/api/peers?limit=100&page=2"
```

`DELETE /api/peers/{id}` marks the device as deleted. Add to the query:

- `hard=true` to remove it from the database,
- `revoke=true` to also block its ID and disconnect it, a CDAP device included,
- `cascade=true` to do the same to the devices linked to it.

`POST /api/peers/{id}/wol` takes `{"mac": "AA:BB:CC:DD:EE:FF"}` and sends the magic packet as a broadcast from the server, so it only wakes machines in the server's own network.

`POST /api/peers/{id}/exec` takes `{"command": "...", "shell": true}` and sends the command to the device over the MeshCentral agent or CDAP, whichever it is connected over, with that transport's terminal permission. The answer `{"transport": "mesh", "status": "sent"}` only says the command left; the output does not come back. A device connected over neither gets 400.

## Audit log and live events

| Method and path | Permission | What it does |
|---|---|---|
| `GET /api/audit/events` | View audit logs | The server's audit entries, newest first: `limit` (default 50, at most 1000), `offset` and `action` |
| `GET /api/ws/events` | View audit logs | A WebSocket that sends each event as it happens |

`/api/ws/events` sends every event as `{"type": "...", "timestamp": "...", "data": {...}}`. `?filter=<type>` limits it to one type, for example `peer_online`, `peer_offline`, `peer_banned`, `peer_deleted`, `peer_revoked`, `peer_id_changed`, `enrollment_pending` or `help_request`. CDAP devices add `cdap_connect`, `cdap_disconnect`, `cdap_state_update`, `cdap_widget_update`, `cdap_command_response`, `cdap_event`, `cdap_log`, `cdap_alert_fired` and `cdap_alert_cleared`. A slow reader misses events: the server drops them instead of waiting. Browsers on another host need their origin in `API_WS_ALLOWED_ORIGINS`.

## CDAP devices

These routes read and control devices connected to the CDAP gateway. The protocol itself is on [CDAP protocol](/docs/development/cdap-protocol).

| Method and path | Permission | What it does |
|---|---|---|
| `GET /api/cdap/status` | View CDAP devices | `{"enabled": true, "connected": 3, "port": 21122, "tls": false}` |
| `GET /api/cdap/devices` | View CDAP devices | The connected devices, `{"devices": [...], "total": 3}` |
| `GET /api/cdap/devices/{id}` | View CDAP devices | One connected device: its manifest, current values, connection time, last heartbeat and counters |
| `GET /api/cdap/devices/{id}/manifest` | View CDAP devices | The manifest the device registered |
| `GET /api/cdap/devices/{id}/state` | View CDAP devices | `{"device_id": "...", "widget_state": {...}, "connected": true}` |
| `POST /api/cdap/devices/{id}/command` | Send CDAP commands | Sends a command, see below |
| `GET /api/cdap/alerts` | View CDAP devices | The alerts firing now, for one device with `device_id` |

A command names a widget of the device's manifest and an action:

```bash
curl -X POST http://127.0.0.1:21114/api/cdap/devices/greenhouse-1/command \
  -H "X-API-Key: $NEODESK_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"widget_id": "heater", "action": "set", "value": true, "reason": "frost warning"}'
```

```json
{"status": "sent", "command_id": "cmd_greenhouse-1_17", "device_id": "greenhouse-1"}
```

The action is `set`, `trigger`, `execute`, `reset` or `query`. On top of the permission, the widget's own rule decides which role may use the action; see [Widget permissions](/docs/development/cdap-protocol#widget-permissions). The server answers 202 once the command is on its way, 404 when the device has no such widget, and 502 when the device is not connected. The device's answer arrives later as a `cdap_command_response` event on `/api/ws/events`, with the same `command_id`.

Super admins can give another account a higher role on one device for a while: `POST /api/cdap/delegate` with `grantee`, `device_id`, `role` (`operator` or `admin`), `duration` in seconds (at most 86400), and optionally `widget_ids` and `reason`. `GET /api/cdap/delegations` lists them and `DELETE /api/cdap/delegate/{id}` ends one. The server keeps them in memory only, so a restart ends them all.

The WebSockets under `/api/cdap/devices/{id}/` (`terminal`, `desktop`, `files`, `video`, `audio`) carry the console's sessions with a device. Terminal, desktop and files need a super admin; video and audio need **Connect to devices**.

## MeshCentral agents

These routes act on devices that run the MeshCentral agent; see [MeshAgent devices](/docs/console/meshagent). With `MESH_ENABLED` off they answer 404 with `{"error": "mesh disabled"}`.

| Method and path | Permission | What it does |
|---|---|---|
| `GET /api/mesh/status` | View devices | Whether the layer is on, the agents online and the agent certificate |
| `GET /api/mesh/server-id` | Server configuration | The ID agents know the server by |
| `GET /api/mesh/groups`, `POST /api/mesh/groups` | Server configuration | Read or save the mesh groups |
| `GET /api/mesh/download.msh` | Server configuration | The agent's `.msh` file; `name` and `mesh_id` are optional |
| `POST /api/mesh/devices/{id}/group` | Server configuration | `{"group_id": "..."}` moves the device to a group |
| `POST /api/mesh/devices/{id}/power` | Power actions on MeshCentral agents | `{"action": "wake"}`, or `sleep`, `off`, `reset` |
| `POST /api/mesh/devices/{id}/exec` | Terminal on MeshCentral agents | `{"command": "whoami", "shell": true}` |
| `POST /api/mesh/devices/{id}/share` | Connect to devices | A link for a remote session, see below |
| `POST /api/mesh/devices/{id}/tcp`, `.../udp` | Connect to devices | `{"host": "127.0.0.1", "port": 3389}` opens a port relay and answers `relay_id` and `browser_url` |
| `GET /api/mesh/recordings` | View devices | The desktop sessions the server recorded |
| `GET /api/mesh/recordings/{id}` | Connect to devices | Downloads one recording |

`wake` for an agent that is not connected sends Wake-on-LAN instead, with the MAC from `{"mac": "..."}` in the body, else the one the agent last reported, else the one of the device linked to it.

`share` takes `{"ttl_minutes": 60, "view_only": true}` and answers a `token` and a `path` on the console, `/remote/<id>?transport=mesh&mesh_share=<token>`, that opens the session.

The server keeps recordings in the folder `mesh-recordings` next to its database.

## Device tokens

A super admin can make device tokens through the API: `POST /api/tokens` with `name`, `max_uses` (0 for no limit), `expires_in` in seconds (0 for none) and `note`. The answer holds the token once. `GET /api/tokens` lists them, `DELETE /api/tokens/{id}` revokes one, and `POST /api/tokens/{id}/bind` with `{"peer_id": "..."}` ties a token that has not been used yet to one device ID of 6 to 16 characters and makes it active. A CDAP device signs in with such a bound token; see [Signing in](/docs/development/cdap-protocol#signing-in).

The list also holds the tokens the server issues itself when it admits a device, for example at an approved registration or when a computer joins through an invite. They belong to no account, so deleting an account ends none of them. The console's **Device tokens** page lists and revokes the same tokens.

## The client API

RustDesk clients use these paths for sign-in and the address book. On Linux and Windows the console's port 21121 takes these and the other paths clients use, such as their reports and enrollment, and passes them on to the API. In Docker they are on 21121 directly. A client reaches them with its **API server** set to `http://<server>:21121`, or left empty, when the ID server passes its calls on; see [The client's settings](/docs/development/rustdesk-compatibility#the-clients-settings).

| Method and path | What it does |
|---|---|
| `POST /api/login` | Signs in, see below |
| `GET /api/login-options` | The sign-in methods: `[""]` for a password, plus an entry per single sign-on provider |
| `POST /api/logout` | Ends the session of the Bearer token |
| `GET /api/currentUser` | The signed-in account |
| `GET /api/ab`, `POST /api/ab` | Reads or saves the address book |
| `GET /api/ab/personal`, `POST /api/ab/personal` | The personal address book |
| `GET /api/peers` | The devices the account may see |

```bash
curl -X POST http://desk.example.com:21121/api/login \
  -H "Content-Type: application/json" \
  -d '{"username": "alice", "password": "..."}'
```

```json
{"type": "access_token", "access_token": "9c1e...", "user": {"name": "alice", "is_admin": false, "status": 1}}
```

With two-factor sign-in, the first answer is `{"type": "email_check", "tfa_type": "tfa_check", "secret": "..."}`. Send `{"verificationCode": "123456", "secret": "..."}` to `/api/login` within 5 minutes for the token.

The token is 64 hex characters and goes in `Authorization: Bearer`. It lasts 7 days, each use extends it, and it ends 30 days after the sign-in at the latest. It also works on the other routes on this page, with the account's permissions.

`GET /api/ab` answers `{"data": "...", "licensed_devices": 0}`, where `data` is the address book as JSON in a string, the format RustDesk clients use. `POST /api/ab` with `{"data": "..."}` replaces it; it may be up to 512 KB.

The other client paths, such as `/api/heartbeat`, `/api/sysinfo` and `/api/audit/conn`, are reports the client sends about itself and are no use to a script.
