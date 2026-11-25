---
title: Architecture
description: How the repository is laid out, what runs inside the one neodesk-server process, where the data lives, and the telemetry contract for NeoDesk's clients.
order: 4
icon: schema
---

This page is for people who change NeoDesk's code. It explains where things are in the repository, what the server binary starts, how the web console and its web app fit into it, how the data is stored, and the contract between the server and NeoDesk's own desktop clients.

## The repository

| Path | What it holds |
|---|---|
| `neodesk-server/` | The Go server: ID server, relay, API, web console and the gateways for CDAP and MeshAgent. One Go module, built without cgo. |
| `web-ui/` | The console's pages: Svelte 5 and SvelteKit as a single-page app, built with Vite. The server binary carries the build. |
| `sdks/` | CDAP client libraries for Python and Node.js. |
| `bridges/` | Example CDAP bridges for Modbus, SNMP and REST webhooks, built on the Python SDK. |
| `remote-gateway/` | Service files and the pinned version of guacd, the gateway for RDP and VNC targets. |
| `docker/` | `Dockerfile` and `Dockerfile.server`, which build the `neodesk` and `neodesk-server` images: both build the web app with Node.js and the server with Go, and run on Alpine. Next to them the images' entrypoints, the health check and the admin password helpers. |
| `install/` | The installers `install.sh`, `neodesk.sh`, `neodesk.ps1` and `neodesk-docker.sh`, and the compose files `docker-compose.single.yml` and `docker-compose.quick.single*.yml`. Every release carries them as files of its own. |
| `config/` | The state of the RustDesk upstream watch, see [RustDesk compatibility](/docs/development/rustdesk-compatibility#the-upstream-watch). |
| `scripts/` | Installer tests, the security suite, the local gate, the build toolchain installer, the upstream watch. |
| `contrib/` | Additions from the community, such as an rc.d script for FreeBSD. |
| `.github/` | CI workflows, Dependabot, CodeQL, the gitleaks config `gitleaks.toml` and the pull request template. |
| `VERSION`, `CHANGELOG.md` | The product version and the change log. |
| `release-notes/` | The notes of each release, see [Releasing](/docs/development/releasing). |

Some folders have a short README of their own, which stays next to the code: [web-ui](https://github.com/neodeskapp/neodesk/blob/main/web-ui/README.md), [sdks](https://github.com/neodeskapp/neodesk/blob/main/sdks/README.md), [bridges](https://github.com/neodeskapp/neodesk/blob/main/bridges/README.md), [remote-gateway](https://github.com/neodeskapp/neodesk/blob/main/remote-gateway/README.md) and the [console's contract suite](https://github.com/neodeskapp/neodesk/blob/main/neodesk-server/console/contract/README.md).

## One binary

`neodesk-server` is the whole server. It replaces RustDesk's hbbs and hbbr and runs one mode, `all`. `MODE=signal` and `MODE=relay` are refused at start: the relay pairs only connections that the ID server of the same process authorized, and that authorization lives in memory, so the two can't run apart.

### What the process starts

In this order:

1. It reads the env file that `NEODESK_ENV_FILE` names, adds the settings a new release brought to it, and checks whether a freshly installed binary has to be rolled back.
2. It stops before anything listens when two listeners would take the same port.
3. It loads the key pair (`id_ed25519` and `id_ed25519.pub`) or makes one.
4. It opens the database and creates what is missing in it.
5. It loads the API key, marks every device offline, and settles the enrollment mode: the mode saved in the console wins over `ENROLLMENT_MODE` unless `ENROLLMENT_MODE_ENV_OVERRIDE=Y`.
6. It loads the secret that signs API tokens and creates the first admin account on an empty database.
7. It starts the audit log, the metrics, the reload on `SIGHUP`, the clock check and the billing service.
8. It starts the ID server, the relay, the API server, the CDAP gateway, the MeshCentral gateway (on unless `MESH_ENABLED=N`), the local admin interface and the web console. The CDAP gateway is on unless **Disable gateway** on the IoT devices page turned it off; while nothing is saved there, `CDAP_ENABLED=N` turns it off.

When the console asks for a restart after an update or a restore, the process ends with an exit status that tells its supervisor to start it again.

### The packages

| Package | What it does |
|---|---|
| `signal` | The ID server: UDP and TCP on 21116, the NAT test one port below, WebSocket two ports above. Registration, hole punching, relay requests and who may start a session. |
| `relay` | The relay on 21117 and its WebSocket two ports above. It pairs two connections by the UUID the ID server authorized and copies bytes between them without reading them. |
| `peer` | The in-memory map of online devices. |
| `api` | The HTTP API: the RustDesk client API, the REST API for scripts, device telemetry. See [The HTTP API](/docs/development/api). |
| `auth` | Password hashes, API tokens, two-factor codes, roles and permissions, LDAP and OIDC. |
| `db` | The server's database interface, with SQLite and PostgreSQL behind it. |
| `console` | The web console and its sub-packages, see below. |
| `cdap` | The CDAP gateway on 21122, see [CDAP protocol](/docs/development/cdap-protocol). |
| `meshcentral` | The MeshCentral agent protocol: `/agent.ashx`, `/meshrelay.ashx` and `/control.ashx`. |
| `crypto` | The key pair, address encoding, the secure TCP handshake of the ID server, `devicevault`, which encrypts saved sign-in details and the device passwords organizations store with the key file `.device_vault_key`, and `peervault`, the older key that only opens passwords stored before 3.6.0-rc.5. |
| `codec` | RustDesk's wire framing. |
| `config` | Settings from flags and the environment, and the TLS listeners. |
| `audit`, `events` | Server events, kept in the database for 90 days with the account or API key that acted, and the event bus that feeds the console. |
| `security`, `ratelimit` | The blocklist, and the rate, connection and bandwidth limits. |
| `policy` | Organization network policies: a forced relay and allowed relay servers. |
| `guestaccess`, `sessiongrant` | Guest links, and signed short grants for support sessions. |
| `billing`, `timesync` | Billable sessions and the NTP clock check. |
| `admin` | The management interface on `ADMIN_PORT`, which listens on 127.0.0.1 only. |
| `cli`, `migrate` | The commands besides running the server. |
| `metrics`, `logging`, `reload` | Prometheus metrics, the log format, reloading the settings. |
| `protos`, `proto` | The protocol schemas and the Go code generated from them. |

`cmd/` holds tools that are not part of the binary: `embed-webui` (below), `repotool` (version bumps, the translation check and the [repository checks](/docs/development/tests-and-checks#repository-checks)), `release-manifest` (writes a release's manifest and its signature), `devseed` (fills a local console with fake data) and `ws-register-test` (sends a registration over the ID server's WebSocket).

### The commands

A first argument that doesn't start with `-` runs a command instead of the server:

| Command | What it does |
|---|---|
| `update`, `rollback` | Install the newest release of the update channel, or put the previous binary back. |
| `backup` | Write the console's full backup, also while the server runs. |
| `migrate` | Move a whole install from SQLite to PostgreSQL or back (`sqlite2pg`, `pg2sqlite`), convert a RustDesk server's database to the server's schema (`rust2go`), or copy a SQLite file aside (`backup`). |
| `reset-password` | Set an account's password, read from standard input. |
| `config` | Check what the console can do, or set settings from an allowlist. |
| `check`, `cert` | Check an install's addresses and ports, or make its self-signed certificate. |
| `env merge`, `upgrade-env` | Merge settings into the env file, or turn an older console's env file into the server's. |
| `verify-release` | Check a downloaded binary against its release's signed manifest. |

An unknown command prints the list of commands with their usage.

## The web console

The console is the package `console`. It listens on its own port, `CONSOLE_PORT` (3375, 5000 before 3.6.0-rc.5; `0` turns the console off while the rest of the server runs), or on 5443 in HTTPS mode, and serves three things: a JSON API under `/api`, websockets under `/ws`, and the web app.

- Every request passes one pipeline (`console/pipeline.go`). Route groups live in `console/routes`, one package per area, and add their routes to one of two tables: the client and device API, which comes before the language and CSRF checks, and everything else.
- The console calls the API server inside the same process, through its handler and without a socket (`console/goapi`). The API server sees these calls as the console's API key.
- The client API port, `API_PORT` (21121), faces the internet for RustDesk clients. With `RUSTDESK_API_PROXY` on, which is the default, it passes the client API to the API server in the same process. See [Ports](/docs/operations/ports#the-api-port-on-linux-and-windows) for which port clients use on which install.
- Remote desktop in the browser opens `/ws/rendezvous` and `/ws/relay` on the console. `console/wsrelay` bridges them to the ID server and the relay in the same process. The bridge's first frame on the ID server connection is a proof that only this process can make, see [Security model](/docs/development/security-model#the-browsers-bridge).
- `console/onboard` and `console/routes/onboard` are [Add a computer](/docs/console/add-a-computer) and [Quick support](/docs/console/quick-support): invites (join codes), quick support sessions (support codes), the data behind the pages `/join/<code>` and `/s/<code>`, and the client package served under the code's file name. The API server keeps the codes and answers their routes only to the console in the same process.
- `console/clientrelease` is the client release cache. It takes the official client packages from the releases of the client fork (`NEODESK_CLIENT_REPO`; the newest pre-release while the fork has no stable release, or the release in `NEODESK_CLIENT_RELEASE_TAG`), uses a release only when its `SHA256SUMS` carries a valid release signature, and downloads each package once, checks it against the sums and keeps it in `client-releases` in the data folder.
- `console/meshproxy` passes the MeshCentral sockets to the MeshCentral gateway in the same process. `console/cdapproxy` passes the browser's sockets for a CDAP device's terminal, desktop, video, files and audio to the API server, after the console's own checks.
- The console's texts are in `console/static/files/lang`, one file per language, 26 in all, with English in `en.json`. `go run ./cmd/repotool i18n-check --system console` checks that the files agree; see [Translations](/docs/development/translations).
- `console/contract` is a black-box suite with recorded answers for every console route and every role; it checks that the console still gives them. See [The contract suite](/docs/development/tests-and-checks#the-contract-suite).

### How the web app gets into the binary

1. `npm run build` in `web-ui` writes the app to `web-ui/build`. Building it needs Node.js 22.17 or newer; the running server needs no Node.js.
2. `go run ./cmd/embed-webui` in `neodesk-server` copies the build into `console/webui/dist` and records each file's modification time.
3. `go build` embeds that folder. A binary built without step 2 has no web app; `WEB_UI_DIR` then names a build on disk, which is also how development works.

[Building from source](/docs/development/building) has the commands.

The console's own files in `console/static/files` (languages, images, themes and the protocol schemas it serves at `/protos`) are embedded where they are. `CONSOLE_STATIC_DIR` reads them from disk instead.

The console serves the app at the root. Hashed files under `/_ui/immutable/` are cached for a year and sent precompressed, other files of the build for an hour, and every other GET gets the app's page. An address that no page of the app has gets the page with status 404, and `/api` and `/ws` never get it. Console pages need a session; the sign-in pages, the portal, device links, the invitation page, the invite and quick support pages (`/join/<code>`, `/s/<code>`) and the remote viewer open without one. The page's Content-Security-Policy comes from the build.

### The support client generator

`console/generator` holds the support client bundles of the older generator: their profiles, the queue that builds them, and the download pages of their links (`/d/<id>`). The web app has no page to make bundles; [Add a computer](/docs/console/add-a-computer) and [Quick support](/docs/console/quick-support) hand out the official client from the release cache instead. The build worker runs inside the server unless `AGENT_BUILD_WORKER=off` and keeps the finished installers in `AGENT_ARTIFACT_DIR` (`DATA_DIR/agent-builds` by default).

## The database

The server works on one database. `DATABASE_URL` names it: an address that starts with `postgres://` or `postgresql://` is PostgreSQL, through pgx, and anything else is a SQLite file, `db_v2.sqlite3` by default, through a SQLite driver written in Go. `DB_URL` and `DB_TYPE` are still read for older installs. See [PostgreSQL](/docs/operations/postgresql) for running on it.

Two stores share that database:

- **The server's store**, package `db`. One interface (`db/database.go`) with a SQLite and a PostgreSQL implementation. It holds devices, accounts, API keys, device tokens, the server events, device groups and folders, organizations, billing, telemetry, and `server_config`, a table of keys and values for settings, secrets the server makes, the hashes of join, support and pairing codes, and queue entries such as `pending_device_<id>`.
- **The console's store**, package `console/store`. Its queries are written once, with `?` placeholders, and run on both databases. It creates 55 tables (tickets, activity, alerts, reports, agent bundles and more), and the session package adds `panel_sessions`. [schema.md](https://github.com/neodeskapp/neodesk/blob/main/neodesk-server/console/store/schema.md) lists every step of its migration.

On PostgreSQL the console uses the server's connection pool. On SQLite it opens the same file itself, with one connection for writes and four read-only ones, in WAL mode, and waits up to five seconds when the file is locked.

At every start both stores create the tables and columns that are missing. The console's migration drops and renames nothing, and leaves a table that exists as it is, even when the server's store created it with other column types. On PostgreSQL it holds an advisory lock, so a second process waits until the first is done.

### Older installs with auth.db

Installs from before the console was part of the server kept the console's accounts, groups, folders, tickets, settings and audit log in a second SQLite file, `auth.db`. At its first start the console imports that file into the main database by itself, when the file exists, `SQLITE_AUTH_DB_MODE` is not `consolidated` and the main database has no completion marker yet. It looks for the file at `AUTH_DB_PATH`, else `auth.db` in the console's data folder.

The import:

1. takes snapshots of both files into `backups` next to the main database (`db_v2.sqlite3.pre-auth-consolidation-<time>` and `auth.db.legacy-auth-<time>`);
2. copies the data in one transaction, so it applies completely or not at all;
3. matches accounts that exist in both files by name: the account keeps its row and id in the main database and takes the console's profile, two-factor settings and password hash;
4. writes the marker `sqlite_auth_consolidation_v1`, so an older version started after a rollback also reads the main database.

`auth.db` is only read, never changed or deleted. To run the import by hand without starting the server, stop the server first and use the flags below. `-migrate-sqlite-auth-dry-run` imports into a copy in a temporary folder; both print a JSON report of what they did. Put the folder that holds the two databases in place of `<data-dir>`, and a folder for the snapshot in place of `<backup-dir>`:

```bash
AUTH_DB_PATH=<data-dir>/auth.db neodesk-server -db <data-dir>/db_v2.sqlite3 \
  -migrate-sqlite-auth -migrate-sqlite-auth-dry-run

AUTH_DB_PATH=<data-dir>/auth.db neodesk-server -db <data-dir>/db_v2.sqlite3 \
  -migrate-sqlite-auth -migrate-sqlite-auth-backup-dir <backup-dir>
```

`-rollback-sqlite-auth` with the snapshot's path puts the snapshot back and keeps the failed database next to it as `db_v2.sqlite3.failed-auth-consolidation-<time>`. The snapshot has no marker, so the console imports `auth.db` again at its next start unless you move `auth.db` away or set `SQLITE_AUTH_DB_MODE=consolidated` first.

## The device telemetry contract

NeoDesk's own desktop clients report more than the stock RustDesk client: their kind, their capabilities, inventory, and the results of commands. They do it through the same `POST /api/heartbeat` the RustDesk client uses, with extra fields. A heartbeat without them is an ordinary RustDesk heartbeat and is answered as before.

### Heartbeat fields

| Field | Meaning |
|---|---|
| `id`, `uuid` | The device ID and the UUID it registered with. A plain heartbeat with another UUID is answered as for an unknown device. |
| `cpu`, `memory`, `disk` | Usage in percent, stored when above 0, also from a plain heartbeat. |
| `telemetry_schema` | The contract's version, `1`. |
| `product_sku` | `neodesk-desktop` for the managed desktop client, `neodesk-support` for the support client. |
| `conn_mode` | `normal` or `incoming-only`. |
| `capabilities` | What the client can do, such as `connection-mode.remote-control`. |
| `telemetry` | Metrics, snapshots and command results, see below. |
| `neodesk_envelope`, `telemetry_envelope` | The signed and encrypted forms, see below. |
| `effective_conn_mode`, `policy_revision`, `policy_status`, `last_command_id`, `policy_error` | The client's report on the last connection mode command. |

The server classifies a device from `product_sku`: `neodesk-support` is a support client, `neodesk-desktop` is a desktop client, also while it runs incoming-only. A device without a SKU that reports `incoming-only` counts as a support client. What a client reports about itself never authorizes anything by itself: the server also checks the operator's permission.

### Telemetry, snapshots and commands

The `telemetry` object holds `telemetry_schema`, `sample_id`, `collected_at`, `metrics`, a `status` map, `snapshots` and `results`. The server stores it only when the device signed it: inside `neodesk_envelope`, or in its own `telemetry_envelope`. A plain heartbeat's `telemetry` is ignored.

- A snapshot has `kind`, `sample_id`, `status`, `collected_at` and `data`. `GET /api/peers/<id>/telemetry` returns the latest of each kind: `identity`, `metrics`, `hardware`, `services`, `processes`, `events`, `activity` and `files`.
- A status is `ok`, `unsupported`, `permission_denied`, `unavailable` or `error`; anything else is stored as `error`.
- The telemetry may be up to 512 KiB, a command's result up to 256 KiB.

Commands are on an allowlist: `collect.hardware`, `collect.metrics`, `collect.services`, `collect.processes`, `collect.events`, `collect.activity`, `files.browse`, `files.read`, `service.control` and `process.terminate`. An operator queues one with `POST /api/peers/<id>/telemetry/command` (permission to connect) or asks for a hardware inventory with `POST /api/peers/<id>/telemetry/refresh` (permission to edit). For a support client the server queues only `collect.metrics`. A command lives 10 minutes. It goes out only in the sealed answer to a signed heartbeat, as `telemetry_commands` with `id`, `command`, `args` and `expires_at`, at most 10 at a time. The client returns each result in `results` with the command's `id` and a status of `queued`, `ok`, `rejected`, `unsupported`, `permission_denied` or `error`. The server accepts results only for commands it queued for that device.

### The envelope

The envelope protects telemetry and commands also where the API runs on plain HTTP. Use HTTPS in production anyway.

1. The client fetches `GET /api/telemetry/key`. It answers `version`, `key_id`, `public_key` (the server's X25519 key) and `signature`, made with the server's Ed25519 key over `1|<key-id>|<public-key>`. The client checks it against the key in its own settings, the same key it uses for the ID server.
2. The client encrypts the JSON with NaCl box between a fresh X25519 key of its own and the server's key, and sends `version` (1), `device_id`, `sequence`, `server_key_id`, `ephemeral_public_key`, `nonce` (24 bytes), `ciphertext`, `signature` and, to get a sealed answer, `response_public_key`. Binary values are base64.
3. The signature is Ed25519 with the device's own key, the one it registered with the ID server, over `version|device_id|sequence|server_key_id|ephemeral_public_key|nonce|ciphertext`, with `|response_public_key` at the end when present.
4. The server refuses a wrong signature, another device ID, another server key and a `sequence` that is not higher than the last one. It keeps the last sequence per device in `server_config` (`telemetry_seq_<id>`), so a restart doesn't reset it; a permanent delete of the device removes it.

The answer to a heartbeat in `neodesk_envelope` is sealed the same way to the client's response key and signed with the server's Ed25519 key. NeoDesk's clients take strategy options and connection mode commands only from inside such a sealed answer.

After that first signed heartbeat, any other API request can go sealed too: the client sends `X-NeoDesk-Envelope: 1` and `X-NeoDesk-Device: <id>`, with the envelope as the body. The server opens it, runs the normal handler, and seals the answer.

### Connection mode

An operator with the permission `device.connection_mode` can switch a desktop client between `normal` and `incoming-only`: `POST /api/peers/<id>/connection-mode` on the API, `POST /api/devices/<id>/connection-mode` in the console, both with `mode` and a required `reason` of up to 500 characters.

- Only a device whose signed identity is `neodesk-desktop` with the capability `connection-mode.remote-control` can be switched. A support client stays incoming-only.
- The server stores the requested mode and sends the command, as `connection_mode_command` with `command_id`, `revision`, `target_id`, `target_uuid`, `mode`, `issued_at`, `expires_at` and `reason`, only inside the sealed answer to a signed heartbeat. Never in a plain answer and never in `strategy` or `config_options`. The command lives 10 minutes.
- The client's next signed heartbeat reports the outcome in `effective_conn_mode`, `policy_revision`, `policy_status`, `last_command_id` and `policy_error`.
- The server sends no RustDesk strategy options to a support client or to a device set to incoming-only.
