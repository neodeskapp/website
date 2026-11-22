---
title: CDAP protocol
description: The WebSocket protocol between a device or a bridge and the server's CDAP gateway, message by message, as the server implements it.
order: 13
---

CDAP is the server's protocol for devices that are not RustDesk clients: sensors, controllers, bridges to other systems and agents. A device opens a WebSocket to the gateway, signs in, sends a manifest with its values and controls, and then keeps the server up to date and answers commands. This page is for people who write such a device or bridge. Running the gateway and using the devices in the console is on [CDAP devices](/docs/console/cdap), and ready-made clients are on [CDAP SDKs and bridges](/docs/development/cdap-sdks).

The reference is the Go code in [`betterdesk-server/cdap`](https://github.com/neodeskapp/betterdesk/tree/main/betterdesk-server/cdap); its types name every field.

## Connecting

The gateway listens on port 21122 (`CDAP_PORT`) at the path `/cdap`:

```text
ws://desk.example.com:21122/cdap
wss://desk.example.com:21122/cdap
```

`wss://` works when the server runs with `CDAP_TLS=Y` and a certificate; plain `ws://` keeps working on the same port unless `CDAP_TLS_REQUIRED=Y`. The gateway runs unless **Disable gateway** on the IoT devices page, or `CDAP_ENABLED=N` while nothing is saved there, turned it off for the next start. See [The gateway](/docs/console/cdap#the-gateway).

- The gateway offers the WebSocket subprotocol `cdap-v1`. Ask for it or for none. A client that asks only for another one gets no subprotocol back, and most WebSocket libraries then drop the connection.
- Messages are JSON in text frames. Binary frames are only for desktop frames (see [Sessions](#sessions)). One message may be up to 8 MiB.
- Each connection and each sign-in counts against `CDAP_RATE_LIMIT` per address and minute, 30 by default. Above it the gateway answers 429 instead of opening the WebSocket, or refuses the sign-in. An address on the server's blocklist gets 403.
- A browser page on another host needs its origin in `WS_ALLOWED_ORIGINS`. Agents that send no `Origin` header are not affected.
- `GET /cdap/health` on the same port answers `{"status": "ok", "connections": 3, "total": 41, "version": "..."}` without signing in.

## Messages

Every message has the same frame:

```json
{"type": "state_update", "timestamp": "2026-11-22T10:15:00Z", "payload": {"widget_id": "temp", "value": 21.5}}
```

`type` and `payload` are required. The server fills `timestamp` (RFC 3339, UTC) on what it sends and doesn't need it on what it gets. `id` carries the command ID on commands and the session ID on session starts.

A connection goes through three steps:

1. Sign in: the first message is `auth`, within 30 seconds.
2. Register: the second message is `register`, within 30 seconds.
3. From then on, both sides send the messages below until one closes the connection.

When step 1 fails, the server sends an `error` with code 1001 and the reason, and closes. When step 2 fails, it sends an `error` with code 2001 and closes.

## Signing in

```json
{
  "type": "auth",
  "payload": {
    "method": "api_key",
    "key": "3f1c9a20...",
    "device_id": "greenhouse-1",
    "client_version": "1.0.0"
  }
}
```

| Field | Used with | What it is |
|---|---|---|
| `method` | all | `api_key`, `user_password` or `device_token` |
| `device_id` | all | The ID the device registers under: 1 to 64 letters, digits, `-` and `_`. Required |
| `key` | `api_key` | An API key of the server |
| `username`, `password` | `user_password` | A console account |
| `totp_code` | `user_password` | The current code, for an account with two-factor sign-in |
| `token` | `device_token` | A device token bound to this device |
| `client_version` | all | Optional |

- `api_key`: the device acts with the key's role. An expired key is refused. Keys are made through the API; see [API keys](/docs/development/api#api-keys).
- `user_password`: the device acts with the account's role. For an account with two-factor sign-in the code goes in `totp_code` of the same message; without it the server answers `2fa_required` and closes. After 5 failed password sign-ins within 5 minutes for one account, or from one address, the gateway refuses that account or address until the 5 minutes have passed.
- `device_token`: the token has to be active and bound to exactly this `device_id`, and the device has to be on the server already and not banned, disabled or deleted. Tokens are bound to IDs of 6 to 16 characters; see [Device tokens](/docs/development/api#device-tokens).

With `api_key` or `user_password` the device enrolls itself, so the role needs the **Approve enrollment** permission, as [How a device signs in](/docs/console/cdap#how-a-device-signs-in) explains.

The answer:

```json
{"type": "auth_result", "payload": {"success": true, "token": "eyJhbGciOi...", "role": "admin", "device_id": "greenhouse-1", "session_token": "..."}}
```

`token` is valid as long as an API sign-in token (24 hours by default) and can be renewed with `token_refresh`. A device needs it for nothing else in this protocol.

## Registering

```json
{
  "type": "register",
  "payload": {
    "manifest": {
      "manifest_version": "1.0",
      "device": {"name": "Greenhouse", "type": "iot", "firmware": "2.1.0", "tags": ["site-a"]},
      "capabilities": ["telemetry", "commands"],
      "heartbeat_interval": 15,
      "widgets": [
        {"id": "temp", "type": "gauge", "label": "Temperature", "unit": "°C", "min": -10, "max": 50},
        {"id": "heater", "type": "toggle", "label": "Heater", "group": "Controls"}
      ],
      "alerts": [
        {"id": "frost", "label": "Frost", "severity": "warning", "condition": "temp < 2", "message": "Temperature is {temp} °C"}
      ]
    }
  }
}
```

The server refuses the registration when the ID is banned, or when another account or API key registered the ID before (a device token is bound to its device and is exempt). A second connection with the same ID replaces the first one, which the server closes with code 4001.

The answer is `{"type": "registered", "payload": {"device_id": "greenhouse-1", "server_time": "..."}}`. The device now shows in the device list: the manifest's name as its host name, its type, tags and linked device, and as its user the account, `apikey:<key name>` or `device:<id>`. When the device disconnects, the server marks it offline and drops the stored manifest.

### The manifest

| Field | What the server takes |
|---|---|
| `manifest_version` | `1.0`, or empty for `1.0`. Anything else is refused |
| `device.name` | Required, up to 128 characters |
| `device.type` | `scada`, `iot`, `os_agent`, `network`, `camera`, `desktop` or `custom`; empty means `custom`, anything else is refused |
| `device.vendor`, `model`, `firmware`, `serial`, `location`, `icon`, `description` | Optional text |
| `device.tags` | Up to 20 tags of up to 64 characters |
| `device.linked_peer_id` | The ID of a device in the device list that belongs to this one |
| `bridge.name`, `version`, `protocol`, `target_host`, `target_port` | Optional, for a bridge; the server stores `protocol` as the device's operating system and `version` as its version |
| `capabilities` | Any of `telemetry`, `commands`, `terminal`, `alerts`, `logs`, `remote_desktop`, `video_stream`, `audio`, `clipboard`, `file_transfer`, `input_control`, `keyboard_input`, `mouse_input`, `multi_monitor`, `unattended_access`. An unknown one is refused |
| `heartbeat_interval` | Seconds between heartbeats: 15 when missing, at most 300 |
| `widgets` | Up to 200, see below |
| `alerts` | Up to 200, see below |

### Widgets

Each widget needs an `id` (up to 64 characters, unique in the manifest) and a `type`: `toggle`, `gauge`, `button`, `led`, `chart`, `select`, `slider`, `text`, `table`, `terminal`, `desktop`, `video_stream`, `file_browser` or `audio`. `label` defaults to the ID. The other fields are optional:

| Fields | For |
|---|---|
| `group`, `value` (the first value), `readonly` | All widgets |
| `unit`, `min`, `max`, `step`, `precision`, `warning_low`, `warning_high` | Gauges and sliders |
| `confirm`, `confirm_message`, `style`, `icon`, `cooldown` (seconds) | Buttons |
| `options`: `[{"label": "Auto", "value": "auto"}]` | Lists |
| `chart_type`, `points`, `series`: `[{"id", "label", "color", "unit"}]`, `retention` | Charts |
| `columns`: `[{"id", "label", "type"}]`, `max_rows`, `sortable` | Tables |
| `permissions`: `{"read", "control", "execute"}` | All widgets, see below |

### Widget permissions

A command names an action, and the widget's `permissions` say which role it needs: `query` needs `read`, `execute` needs `execute`, and `set`, `trigger`, `reset` and any other action need `control`. Each takes `viewer`, `operator` or `admin`. Without a value, `read` is `viewer` and `control` and `execute` are `operator`; for `terminal`, `desktop` and `file_browser` widgets `control` and `execute` are `admin`.

The roles rank viewer, operator, admin. Server admins and global admins rank between operator and admin, and super admins count as admin. A command also needs the **Send CDAP commands** permission.

### Alerts

An alert in the manifest fires while its `condition` holds and clears when it no longer does. The server checks every alert each time a value changes.

- `severity` is `critical`, `warning` or `info`.
- `condition` is `<widget id> <operator> <value>`, with `==`, `!=`, `>`, `<`, `>=` or `<=`. The widget ID there has to start with a letter or `_` and hold only letters, digits, `_` and `.`. When both sides are numbers they are compared as numbers (`true` and `false` count as 1 and 0). Otherwise only `==` and `!=` work, comparing the text without regard to case; quotes around the value are optional. A condition the server can't read, or a widget without a value yet, doesn't fire.
- `message` may hold `{widget id}`, which the server replaces with the current value.

Firing alerts show under **Active alerts** on the device's page and in `GET /api/cdap/alerts`, and each change is an event on the API's event stream. They clear when the device disconnects.

## From the device

| Type | Payload | What the server does |
|---|---|---|
| `heartbeat` | `metrics` (`{"cpu", "memory", "disk"}`), `widget_values` (`{"temp": 21.5}`), both optional | Keeps the device online, stores the metrics when one of them is above 0 and the values, and answers `ping` with `server_time` |
| `state_update` | `widget_id`, `value` | Stores one value |
| `bulk_update` | `updates`: `[{"widget_id", "value"}]` | Stores several values |
| `command_response` | `command_id`, `status`, `result`, `error_message`, `execution_time_ms` | Records the answer to a command |
| `event` | `event_type`, `data` | Passes it on as a `cdap_event` event |
| `log` | `level`, `message`, `context` | Passes it on as a `cdap_log` event; `error` and `critical` also go to the server log |
| `help_request` | `message`, `hostname` | Adds a request under **Help requests**, with the first 2048 characters of the message, and answers `help_request_ack` with its `id` |
| `chat_message` | `text`, `to_id` | Stores the first 4096 characters as a chat message from the device and answers `chat_message_ack` with its `id` |
| `token_refresh` | `{}` | Answers `token_refreshed` with a new `token` and `expires_at` |
| `unregister` | `reason` | Closes the connection |

The heartbeat is what keeps the connection: a device that sends none for three heartbeat intervals, and at least 60 seconds, is closed with "heartbeat timeout". Other messages don't count.

The server keeps a value only for a widget of the manifest, and only when it takes at most 64 KiB as JSON; it drops other values without an answer. The console's device page reads the values every 3 seconds.

### Errors

An error from the server is `{"type": "error", "payload": {"code": 3003, "message": "widget_id is required"}}`. After 1001 and 2001 the server closes the connection; after the others it carries on.

| Code | Meaning |
|---|---|
| 1001 | Sign-in failed |
| 2001 | Registration failed |
| 1003 | `token_refresh` with a token that is no longer valid |
| 1006 | Unknown message type |
| 3001 to 3009 | A payload the server can't read: 3001 `heartbeat`, 3002 `state_update`, 3003 `state_update` without `widget_id`, 3004 `bulk_update`, 3005 `command_response`, 3006 `event`, 3007 `log`, 3008 `help_request` or `token_refresh`, 3009 `chat_message` |
| 5001, 5002 | The server could not store a help request or a new token (5001) or a chat message (5002) |

## From the server

| Type | Payload | When |
|---|---|---|
| `command` | `command_id`, `widget_id`, `action`, `value`, `operator`, `reason` | Someone used a control in the console or the API sent a command |
| `ping` | `server_time` | The answer to each heartbeat |
| `chat_message` | `from_id`, `from_name`, `text` | A console user wrote to the device |
| `revoke` | `reason` | The device was revoked; the server then closes with code 4003 |
| `error` | `code`, `message` | See above |

The console sends `set` with the new value for toggles, sliders and lists, and `trigger` without a value for buttons; the API also takes `execute`, `reset` and `query`. `POST /api/peers/{id}/exec` reaches a CDAP device as a command for the widget `shell` with the action `run` and the value `{"command": "..."}`.

Answer every command with a `command_response` that carries its `command_id`, and a `status` such as `ok` or `error`:

```json
{"type": "command_response", "payload": {"command_id": "cmd_greenhouse-1_17", "status": "ok", "result": {"heater": true}, "execution_time_ms": 12}}
```

The server writes the answer to the audit log and passes it on as a `cdap_command_response` event. The console reads a control's state from the device's values, so send the new value with `state_update` after a change.

## Sessions

The console opens terminal, file, desktop, video and audio sessions with a device. Each starts with a `*_start` message whose `session_id` is also in the frame's `id`; every later message of the session carries the `session_id`. The server opens a session only when the manifest has the capability for it, and ignores a device's message for a session that belongs to another device.

| Session | Capability | Server sends | Device sends |
|---|---|---|---|
| Terminal | `terminal` or `commands` | `terminal_start` (`cols`, `rows`, `operator_name`), `terminal_input` (`data`), `terminal_resize` (`cols`, `rows`), `terminal_end` | `terminal_output` (`data`, `stream`: `stdout` or `stderr`), `terminal_end` (`reason`) |
| Files | `file_transfer` | `file_start`, then `file_list`, `file_read`, `file_write` and `file_delete` as the console sends them, `file_end` | `file_list_response`, `file_read_response`, `file_write_response`, `file_delete_response`, `file_end` |
| Desktop | `remote_desktop` | `desktop_start` (`width`, `height`, `quality`, `fps`, `fps_mode`, `codecs`, `video_codec`, `operator_name`), `desktop_input`, `desktop_control`, `desktop_resize`, `clipboard_set`, `codec_offer`, `key_exchange`, `keyframe_request`, `monitor_select`, `quality_adjust`, `desktop_end` | `desktop_frame` or binary frames, `desktop_meta`, `monitor_list`, `codec_answer`, `cursor_update`, `key_exchange`, `clipboard_update`, `desktop_input_error`, `desktop_consent_denied`, `desktop_end` |
| Video | `video_stream` | `video_start` (`stream_id`, `quality`, `fps`), `video_end` | `video_frame` (`format`, `width`, `height`, `data`, `timestamp`, `key_frame`), `video_end` |
| Audio | `audio` | `audio_start` (`codec`, `sample_rate`, `channels`, `direction`), `audio_input`, `audio_end` | `audio_frame` (`codec`, `data`, `timestamp`, `duration`, `sequence`), `audio_end` |

- The file requests carry `request_id` and `path`, reads also `offset` and `length`, writes `data` in base64, `offset` and `done`. The server passes the console's request on unchanged and the device's answer back; answers carry `session_id` and `request_id`. Keep file access inside a folder the device's owner chose.
- `desktop_frame` carries `format` (`jpeg`, `png` or `raw`), `width`, `height`, `data` in base64 and `timestamp` in milliseconds. A binary frame is faster: 64 bytes of session ID, padded with zero bytes, then the frame itself, which the server passes to the browser as it is. `desktop_meta` (`format`, `width`, `height`, `binary`, `codec_string`) tells the browser how to decode the stream.
- `desktop_input` has a `type` (`mouse_move`, `mouse_down`, `mouse_up`, `mouse_scroll`, `key_press`, `key_release` or `text`) with `x`, `y`, `button`, `delta_x`, `delta_y`, `key`, `code`, `modifiers` or `text`.
- `clipboard_update` has `format` (`text`, `image` or `html`) and `data`.
- For a device of type `os_agent`, or tagged `support-agent`, `desktop_start` also carries a `session_grant` signed with the server's key, valid for 5 minutes, which a support agent checks before it asks the person at the device for consent.
