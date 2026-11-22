---
title: RustDesk compatibility
description: How the server stays compatible with the stock RustDesk client, the checklist to run when RustDesk releases a client or server version, and what the upstream watch does.
order: 9
---

BetterDesk works with the stock RustDesk client from RustDesk's own releases. Nothing in the client is changed: the server speaks the client's protocol and HTTP API. This page says what the server speaks, which choices in the code keep stock clients working, and how to check a new RustDesk release.

BetterDesk's server is a separate program written in Go, not RustDesk's server. Track RustDesk's server releases only to keep the wire and the API in step, and copy nothing from RustDesk's sources into the repository; see [Clean-room provenance](/docs/development/provenance).

## What the server speaks

### Ports and transports

The ID server listens on 21116 over UDP and TCP, the NAT test one port below it, the relay on 21117, and a WebSocket for each two ports above them (21118 and 21119). [Ports](/docs/operations/ports) has the full list.

- **UDP**: one datagram is one message.
- **TCP**: each message has RustDesk's variable header of 1 to 4 bytes. The two low bits of the first byte are the header's length minus one; the rest of the header, read little-endian and shifted right by two, is the payload's length. The server accepts messages up to 64 KiB on the ID server and up to 16 MiB of session data when it bridges a TCP and a WebSocket end of a relay.
- **WebSocket**: one binary message is one protobuf message.

On TCP the ID server first offers newer clients a key exchange and then encrypts the connection; an older client that sends something else is served unencrypted. TLS on these ports is optional, and the server tells a TLS connection from a plain one by its first byte. See [Security model](/docs/development/security-model#the-id-server-connection).

### The messages

The messages are protobuf, defined in `betterdesk-server/protos/rendezvous.proto` (the ID server's messages) and `message.proto` (what two clients send each other), in the package `hbb`. The Go code generated from them is committed in `betterdesk-server/proto/`. The browser viewer generates its own from the same files at every build. The relay reads only the first message of each connection, to pair the two ends by their UUID, and copies everything after it without reading it.

### The client API

The RustDesk client signs in, syncs its address book and reports itself over HTTP. The API server answers these routes, and the console's client API port passes them on to it:

| Route | What the client does |
|---|---|
| `POST /api/login`, `GET /api/login-options`, `POST /api/oidc/auth`, `POST /api/logout`, `/api/currentUser` | Sign in and out |
| `/api/ab`, `/api/ab/personal`, `/api/ab/tags` | The address book |
| `/api/group`, `/api/device-group/accessible` | Groups and folders the account may see |
| `POST /api/heartbeat`, `POST /api/sysinfo` | Report that it is online, and its system information |
| `POST /api/audit/conn`, `/api/audit/file`, `/api/audit/alarm` | Report connections, file transfers and alarms |

## Choices that keep stock clients working

### The client's settings

A client needs four values: ID server, relay server, API server and key. It gets them from its own settings, from the config string or from the QR code (`rustdesk://config/...` with the same string); see [Connect a RustDesk client](/docs/getting-started/connect-a-client). The relay address the console gives always carries a port, because RustDesk 1.4.8 and 1.4.9 clients that get a bare relay host ask the API port for the relay, and the session ends with "Pair timeout".

**API server** can stay empty or be `http://<server>:21121`, the client API port on every install type, or the HTTPS address of a reverse proxy in front of it; both work. A stock client that leaves it empty tries the ID server's port minus 2 (21114), which no install opens, and then sends its API calls through the ID server as `HttpProxyRequest`. The signal server answers them itself, so heartbeat, system information, sign-in and the address book still arrive. A BetterDesk client set up by hand needs the field filled in: its enrollment calls go only over HTTP.

The server can also send ID servers in `ConfigUpdate`, in its answer to the NAT test, but only when `RENDEZVOUS_SERVERS` is set, and never relay addresses. Don't use it to move clients to another server: set the servers in the client.

### The relay address a device is sent

A RustDesk device checks the relay in an incoming relay request against the relay it was told about and silently drops a mismatch. So when the server asks a device to join a relay, it sends the relay address that device reported itself, and when it has none, the bare host without a port, which the device's own check completes with its relay port. This holds for the normal path and for sessions forced through the relay: **Relay only** under **Connection strategy**, or an organization with **Always connect through a relay server**.

### Strategy options

The heartbeat answer can carry `config_options` for the client. The server sends only these keys from the strategies assigned to a device: `enable-file-transfer`, `disable-clipboard`, `enable-clipboard`, `enable-audio`, `enable-tunnel`, `enable-camera`, `enable-remote-restart` and `enable-block-input`, each `Y` or `N`. Other keys are dropped when a strategy is saved and again when the answer is built.

RustDesk 1.5.3 and later ignore heartbeat changes to `api-server`, `custom-rendezvous-server`, `relay-server`, `key`, `2fa`, `bot`, `enable-trusted-devices`, `trusted-device-expiration-days` and `websocket-port`. None of them is on the list, and a test keeps it that way.

Branding adds one option, `display-name`, when the company name is set and is not "BetterDesk". A branding value always wins over a strategy's value for the same key.

A stock client applies these options from the plain heartbeat answer. BetterDesk's own clients take them only from inside a sealed answer; see [The envelope](/docs/development/architecture#the-envelope).

### Messages the server doesn't serve

- `HttpProxyRequest` gets an `HttpProxyResponse` with the error "not supported": the ID server is no proxy.
- `IceCandidate` is passed on only between the two ends of a punch the server started.
- A `FetchLocalAddr` that comes from a client is dropped: only the server sends it.
- A new device that the enrollment mode turns away gets `RegisterPkResponse` with `NOT_DEPLOYED`.
- A known ID is bound to the UUID and key it registered with. A `RegisterPk` with another UUID gets `UUID_MISMATCH`, one with another key `NOT_SUPPORT`.

### Who may start a session

The ID server decides for each `PunchHoleRequest` and `RequestRelay` which device asks. The first of these that fits wins:

1. The same TCP connection already registered a device with `RegisterPk`.
2. The message carries the token of a client signed in to BetterDesk.
3. The connection is the console's bridge for remote desktop in the browser.
4. A registered device has exactly this address and port.
5. The `udp_port` in the request matches exactly one live device at this public address.
6. Exactly one live device has this public address.
7. `ALLOW_LEGACY_OUTBOUND` is on and the enrollment mode is Open: an app that never registered gets a temporary identity and is sent through the relay.

Several live devices at one public address and no better match refuse the session (`initiator_ambiguous_same_nat`), unless `ALLOW_SHARED_NAT_INITIATOR` is on. This hits offices where several clients share one public address, also when all of them are approved: a client often sends its request on a new TCP port, so sources 4 and 5 miss, and the session is refused. `ALLOW_SHARED_NAT_INITIATOR` lets such requests through without naming the device that asks. With **Only signed-in RustDesk apps can start sessions** on, only sources 2 and 3 count. In Managed and Locked mode the device must also be approved; a device that still waits for approval can't start a session. In Managed mode, a client that sends a valid sign-in token for a device the server doesn't know is put under **Enrollment requests**, so phones that only control others can be approved too.

A refused `PunchHoleRequest` gets a `PunchHoleResponse` with the failure `ID_NOT_EXIST`, so the stock client says the ID does not exist. That often means the computer that asked isn't allowed, not that the remote ID is missing. The server's log names the reason. [Hardening](/docs/operations/security#limit-who-can-start-sessions) explains the switches for operators.

## What needs BetterDesk's client

A stock client registers, connects in both directions, runs the remote session itself (screen, input, file transfer, clipboard, chat in the session, audio, terminal, TCP tunnels), signs in with a console account and gets the address book. These need BetterDesk's own client, because a stock client doesn't send what they are built on:

- **Telemetry and hardware inventory**: BetterDesk's client seals them into its heartbeat; the server ignores them in a plain one.
- **Logo and colours** from **Client app branding**: only BetterDesk's client fetches them. A stock client gets only the `display-name` option.
- **Add a computer, Quick support and Pair with code**: they install or configure BetterDesk's client. A stock client is set up by hand; see [Add a computer](/docs/console/add-a-computer) and [Quick support](/docs/console/quick-support).
- **Connection mode**: switching a device to incoming-only.
- **A device token**: the server issues one only when a device joins through one of BetterDesk's own steps, and an account's sign-in proves no device. Without it the device routes stay closed: help requests from the device, chat with an operator outside a session, remote commands, files sent from the console and data loss prevention policies.

## The browser viewer

Remote desktop in the browser speaks the same protocol from `web-ui/src/lib/remote/client`:

- Its message classes are generated from `betterdesk-server/protos` by `web-ui/vite-plugins/protos.ts` at every build, dev server start and test run, into `src/lib/remote/client/generated`, which git ignores.
- It encodes a message with `fromObject()`, not `create()`. `create()` keeps an enum name such as `Backspace` as a string, which goes on the wire as 0, and the device drops the key. `fromObject()` turns names into numbers and keeps byte fields as they are. `web-ui/tests/unit/remote/wire-bytes.test.ts` pins the bytes of every message the viewer sends.
- A mouse event's mask is the event type in the low three bits and the button shifted left by three.
- Over HTTPS it decodes with WebCodecs. A WebCodecs decoder must start from a keyframe, so after it is set up or after an error the viewer drops frames until a keyframe arrives, and asks the device for one with `refresh_video`; it does the same when no frames arrive for 3 seconds, or frames arrive and none decodes for 2. Where the browser has no WebCodecs, as on a console opened over plain HTTP from another computer, it falls back to JMuxer, which decodes H.264 only.
- It introduces itself to the device as `BetterDesk-Web/1.4.9`.

## The checklist for a new RustDesk release

Run this when the upstream watch opens an issue, or when you notice a new release of the RustDesk client or of RustDesk's server yourself. Most of it needs a lab with real RustDesk clients, which CI doesn't have.

### Before you start

- Note the tags under review: the client (`rustdesk/rustdesk`), RustDesk's server (`rustdesk/rustdesk-server`), or both.
- Read the release notes, and the pull requests they link that touch security, policy, configuration, the relay, the API or the handshake.
- Compare `rendezvous.proto` and `message.proto` of the release with `betterdesk-server/protos`, for reference only. Take nothing over except through the [clean-room workflow](/docs/development/provenance#clean-room-workflow).

### 1. Client settings

- The config string, the QR code and the four values on the console's **Client setup** still give the new client its ID server, relay (`host:port`), API server (`http://<server>:21121`) and key.
- On phones, the setting `allow-deep-link-server-settings`, or importing the config string, still works.
- A client with wrong settings stays offline and doesn't fall back to RustDesk's public servers.
- Check whether the client still applies a `ConfigUpdate` from the NAT test, and note it when it doesn't.

### 2. Registration and enrollment

- A new device registers over UDP, TCP and WebSocket, as each is deployed.
- In Managed and Locked mode: the request appears, rejecting works, approving works, and the device can ask again.
- A rejected device stays out until someone clicks **Allow again**.
- With **Only signed-in RustDesk apps can start sessions** and **Only accounts that may connect to devices can start sessions** on, a client without a valid sign-in still can't start a session.

### 3. ID server and relay

- Two stock clients connect through BetterDesk, directly and through the relay.
- The same with **Relay only**, and with an organization that has **Always connect through a relay server** on.
- A client whose relay setting has no port still pairs.
- A relay request with a UUID the ID server didn't hand out is still refused.
- TLS on the ID server and relay, WebSocket, and a reverse proxy work as on [Reverse proxy and TLS](/docs/operations/reverse-proxy-tls).

### 4. Client API

- Sign-in with a local account, an LDAP account and a two-factor code, and sign-out.
- Address book, groups and the device list sync.
- Heartbeat and sysinfo; the client's version is stored.
- Strategy options: list which ones the new client applies, and which it ignores or locks.
- BetterDesk sets up no client through a key the client locks against heartbeat changes.
- Connection reports (`POST /api/audit/conn`) still arrive.

### 5. Sessions

- Remote desktop: picture and input.
- Clipboard: text, and images when the release claims them.
- File transfer.
- Terminal, privacy mode and several screens when the release notes change them.
- Connection approval and trusted devices, when the release has them.
- Remote desktop in the browser to a device with the new client.

### 6. A release of RustDesk's server

- Read its release notes for changes to the handshake, hole punching, the relay, or fixes against amplification.
- Map each change of the wire or of behaviour to BetterDesk's ID server, relay and API.
- BetterDesk never needs RustDesk's server binaries in production.

### 7. Close out

- Write the result in the review issue: OK, partial or blocker, with the steps that check it.
- Set `last_reviewed_tag` in `config/rustdesk-upstream-watch.json` for each component you reviewed.
- Open or update an issue with the label `Next Updates` for each follow-up in code or docs. Close issues only when the maintainer asks.
- Make the fixes on `main`.

## The upstream watch

`.github/workflows/rustdesk-upstream-watch.yml` runs on Mondays, Wednesdays and Fridays at 04:19 UTC, and when started by hand. It checks out `main` and runs `python3 scripts/watch_rustdesk_upstream.py --write`, which:

1. reads `config/rustdesk-upstream-watch.json`;
2. asks the GitHub API for the newest 30 releases of `rustdesk/rustdesk` and `rustdesk/rustdesk-server`, and takes the highest stable version among them (no draft, no pre-release, a tag of the form `1.2.3` with an optional `v`);
3. sets `last_seen_tag` and `last_seen_published_at` of a component when that version is newer;
4. for each component whose `last_seen_tag` differs from its `last_reviewed_tag`, opens an issue titled `compat: review RustDesk client <tag> vs BetterDesk` (or `OSS server`) with the labels from `issue_labels`, unless an open issue already carries the marker `<!-- rustdesk-upstream-watch: client=<tag> -->` (`server_oss=` for the server). It creates the labels when they are missing. The issue links the checklist and lists its steps.

When the manifest changed, the workflow commits it to `main`. The watch never changes `last_reviewed_tag`: setting it by hand after a review is what stops new issues for that tag.

| Field | Meaning |
|---|---|
| `issue_labels` | Labels of the review issues: `Next Updates` and `compatibility` |
| `checklist_url` | The checklist the issue links to: this page's checklist |
| `client`, `server_oss` | One entry per watched repository |
| `repository` | `rustdesk/rustdesk` or `rustdesk/rustdesk-server` |
| `last_seen_tag`, `last_seen_published_at` | The newest stable release the watch saw, and when it was published |
| `last_reviewed_tag` | The release someone checked with the checklist |

To run it yourself, from the repository root:

```bash
python3 scripts/watch_rustdesk_upstream.py --dry-run
```

`--dry-run` fetches and prints what it would change and which issues it would open, and writes nothing. `--no-issues` opens no issues. Without `--write` the manifest stays unchanged. Opening issues needs the `gh` command, and the script sends `GITHUB_TOKEN` or `GH_TOKEN` to the GitHub API when one is set.
