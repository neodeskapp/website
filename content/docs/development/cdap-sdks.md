---
title: CDAP SDKs and bridges
description: What the Python and Node.js SDKs and the three reference bridges in the repository do, how to start one against a server, and what the console's flow builder does.
order: 14
---

The repository has two SDKs for writing a CDAP device or bridge, three bridges built on the Python SDK, and the console has a flow builder. This page says what each one does today and how to start it. The messages they exchange with the gateway are on [CDAP protocol](/docs/development/cdap-protocol); running the gateway and using the devices is on [CDAP devices](/docs/console/cdap).

## What a device needs

- **The gateway's address**: `ws://<server>:21122/cdap`, or `wss://` with TLS on; see [The gateway](/docs/console/cdap#the-gateway).
- **A credential**: an API key, a console account or a device token, as in [Signing in](/docs/development/cdap-protocol#signing-in). An API key's or account's role needs **Approve enrollment**, which super admins, admins and global admins have by default; see [What each role can do](/docs/people/users-and-roles#what-each-role-can-do). Keys come from the API, see [API keys](/docs/development/api#api-keys).
- **A device ID** of 1 to 64 letters, digits, `-` and `_`. Neither SDK makes one up: without one, the Python SDK raises `ValueError` and the Node.js SDK throws.
- **A device type** the gateway takes: `scada`, `iot`, `os_agent`, `network`, `camera`, `desktop` or `custom`.

Both SDKs have the same example, a simulated greenhouse with a temperature, a humidity, a heater switch, a status text and a frost alert. It warms up while you switch the heater on in the console. The server's tests run both examples and the three bridges against a gateway, and CI runs them whenever the SDKs, the bridges or the gateway change.

## Python SDK

The package `betterdesk_cdap` is in [`sdks/python`](https://github.com/neodeskapp/betterdesk/tree/main/sdks/python). It needs Python 3.9 or newer and `websockets` 12 or newer. Install it from a checkout of the repository and start the example:

```bash
pip install ./sdks/python
CDAP_SERVER=ws://desk.example.com:21122/cdap CDAP_API_KEY=... python sdks/python/examples/greenhouse.py
```

A small device with a temperature, a switch and an alert:

```python
import asyncio
import os

from betterdesk_cdap import CDAPBridge, gauge, toggle

bridge = CDAPBridge(
    server="ws://desk.example.com:21122/cdap",
    auth_method="api_key",
    api_key=os.environ["CDAP_API_KEY"],
    device_id="greenhouse-1",
    device_name="Greenhouse",
    device_type="iot",
)
bridge.add_widget(gauge("temp", "Temperature", unit="°C", min_val=-10, max_val=50))
bridge.add_widget(toggle("heater", "Heater"))
bridge.add_alert("frost", "temp < 2", label="Frost", message="Temperature is {temp} °C")


@bridge.on_command("heater")
async def heater(action, value, **kw):
    if action == "set":
        switch_heater(bool(value))  # your code
    return {"heater": bool(value)}


async def main():
    runner = asyncio.create_task(bridge.run_async())
    while True:
        await bridge.update_state("temp", read_temperature())  # your code
        await asyncio.sleep(10)


asyncio.run(main())
```

`bridge.run()` does the same as `run_async()` and blocks, for a device that only answers commands.

What the SDK does:

- **Connecting**: it asks for the subprotocol `cdap-v1` and signs in with `auth_method` `api_key` (`api_key`), `device_token` (`device_token`) or `user_password` (`username`, `password`). It has no field for a two-factor code. Then it registers a manifest built from the constructor (`device_name`, `device_type`, `vendor`, `model`, `firmware`, `tags`, `capabilities`, `heartbeat_sec`, and a bridge block when `bridge_name` is set, with `bridge_version` and `bridge_protocol`), the widgets and the alerts, and waits for the gateway to confirm it. `capabilities` is `["telemetry", "commands"]` unless you pass others.
- **Reconnecting**: after a lost or refused connection it waits `reconnect_sec` (5 by default), twice as long each time up to `max_reconnect` (300), plus up to a quarter more at random. It keeps trying after a refused sign-in or registration; the gateway's reason is in its log, the logger `betterdesk_cdap`.
- **Values**: `update_state(id, value)` and `bulk_update({id: value, ...})` send values at once; both are coroutines to `await`. Values set before the device is registered are kept and go out with the first heartbeat. Every heartbeat, each `heartbeat_sec` seconds (15 by default, 5 to 300), sends again all values the SDK knows.
- **Commands**: `on_command("widget id")` registers a handler for one widget, `on_command()` one for all others. A handler may be a coroutine function or a plain function, and gets `action`, `value`, `widget_id`, `operator` and `reason` as keyword arguments. What it returns goes back as the result with status `ok`; an exception goes back as `error` with its message, and so does a command for a widget without a handler. After a `set` the SDK sends the new value at once, so the console shows the control's new state.
- **Alerts**: `add_alert(id, condition, label=, severity=, message=)` adds an alert to the manifest, as in [Alerts](/docs/development/cdap-protocol#alerts). The gateway shows it under **Active alerts** while the condition holds. A device can't raise an alert any other way.
- **Logs**: `send_log(level, message, context)` sends a `log` message, with `level` `debug`, `info`, `warning`, `error` or `critical`.
- **Widgets**: `gauge`, `toggle`, `button`, `text_widget`, `led`, `slider`, `select`, `chart` and `table` build the widget types of the same names, each with a default `permissions` entry. `Widget(...)` takes every field of [Widgets](/docs/development/cdap-protocol#widgets).

The [package README](https://github.com/neodeskapp/betterdesk/blob/main/sdks/python/README.md) lists the methods.

## Node.js SDK

The package `betterdesk-cdap` in [`sdks/nodejs`](https://github.com/neodeskapp/betterdesk/tree/main/sdks/nodejs) is written in TypeScript and needs Node.js 22 or newer (22.18 or newer for the example, which Node runs as TypeScript). Build it and start the example:

```bash
cd sdks/nodejs
npm ci
npm run build
CDAP_SERVER=ws://desk.example.com:21122/cdap CDAP_API_KEY=... node examples/greenhouse.mts
```

To use it in your project, run `npm install /path/to/betterdesk/sdks/nodejs` there after the build. A small device:

```js
const { CDAPBridge, gauge, toggle } = require('betterdesk-cdap');

const bridge = new CDAPBridge({
  server: 'ws://desk.example.com:21122/cdap',
  apiKey: process.env.CDAP_API_KEY,
  deviceId: 'greenhouse-1',
  deviceName: 'Greenhouse',
  deviceType: 'iot',
});

bridge
  .addWidget(gauge('temp', 'Temperature', { unit: '°C', min: -10, max: 50 }))
  .addWidget(toggle('heater', 'Heater'))
  .addAlert('frost', 'temp < 2', { label: 'Frost', message: 'Temperature is {temp} °C' });

bridge.onCommand('heater', ({ value }) => {
  switchHeater(Boolean(value)); // your code
  return Boolean(value);
});
bridge.on('error', (err) => console.error(err.message));

bridge.run();
setInterval(() => bridge.updateState('temp', readTemperature()), 10000); // your code
```

It works like the Python SDK, with these differences:

- **Names**: `addWidget`, `addAlert`, `onCommand`, `updateState`, `bulkUpdate`, `sendLog`, `run` (a promise that reconnects until `stop()`), and `textWidget` for text.
- **Defaults**: `deviceType` is `custom`, `heartbeatSec` 15, `reconnectSec` 5 and `maxReconnect` 120. The manifest's capabilities are always `telemetry`, `commands`, `alerts` and `logs`.
- **Commands**: the handler gets the command (`command_id`, `widget_id`, `action`, `value`, `operator`, `reason`) and may return a value or a promise. What it returns goes back as the result and becomes the widget's value at once.
- **Events**: `connected`, `registered`, `command`, `disconnected`, `error`, `message`, and the type of any other message the server sends. Listen for `error`: as with any Node.js event emitter, an `error` event without a listener throws.

The [package README](https://github.com/neodeskapp/betterdesk/blob/main/sdks/nodejs/README.md) has the details.

## Reference bridges

The bridges in [`bridges`](https://github.com/neodeskapp/betterdesk/tree/main/bridges) are Python scripts on the Python SDK. Each reads a JSON config file: a `cdap` block for the connection (`server`, `api_key`, `device_id`, `device_name`, `device_type`, `bridge_name`, `heartbeat_sec`) and a block for the other side. `device_id` is required, and two bridges on one server need different ones. Without a `device_type` the Modbus bridge registers as `scada`, the SNMP bridge as `network` and the REST bridge as `iot`.

| Bridge | Script | Talks to | What it does |
|---|---|---|---|
| Modbus | `modbus/bridge_modbus.py` | Modbus TCP, or Modbus RTU over a serial port (`pymodbus` 3.10 or newer) | Reads holding and input registers, coils and discrete inputs every `poll_interval_sec`, as `int16`, `uint16`, `int32`, `uint32` or `float32` with `scale` and `offset`, and writes commands for entries that are not `readonly` back to the register or coil |
| SNMP | `snmp/bridge_snmp.py` | SNMP v2c or v3 (`pysnmp`) | Polls OIDs, shows time ticks and kilobytes readably, turns counters into rates, and applies a `transform` such as `100 - x` |
| REST and webhooks | `rest-webhook/bridge_rest.py` | HTTP (`aiohttp`) | Polls URLs and picks a value by a dotted path (the `jmespath` key), switches a toggle by calling a `write_url`, and listens for webhooks on `webhook_port` and `webhook_path` |

When the Modbus device or the REST API refuses a write, the bridge answers the command with an error and the control keeps its value.

A webhook entry of the REST bridge with `alert_severity` (`critical`, `warning` or `info`) adds an alert to the manifest. Once a matching webhook has set the entry's widget, the alert shows under **Active alerts** with `alert_message`, and it stays there until the bridge reconnects. Its `widget_id` has to start with a letter or `_` and hold only letters, digits, `_` and `.`.

To start one, install the SDK and the bridge's packages, copy the example config, set `server`, `api_key` and `device_id` in it and run the script with it:

```bash
pip install ./sdks/python
cd bridges/modbus
pip install -r requirements.txt
cp config.example.json config.json
python bridge_modbus.py --config config.json --log-level INFO
```

The [bridges README](https://github.com/neodeskapp/betterdesk/blob/main/bridges/README.md) describes the config pattern.

## The flow builder

The console's **Flow builder (SDK)** page, at `/cdap-studio`, is an editor for data flows. The sidebar shows it to the operator role and to super admins.

- **Nodes**: you drag nodes from three groups onto the canvas and connect them. **Sources**: Modbus TCP, Modbus RTU, SNMP Poll, REST Poll, MQTT Subscribe, Webhook, Device Telemetry, Database Query, File Watch. **Processing**: Filter, Transform, Aggregate, Delay, Debounce, Switch, Merge, Script. **Outputs**: Widget Update, Alert, Command, Log, REST Call, MQTT Publish, Database Write, Email, Modbus Write. **Node settings** holds each node's settings.
- **Saving**: **Save flow** stores the flow on the server. Each flow belongs to the account that made it; super admins see and change all of them. **Open flow** lists the saved ones.
- **Templates**: five flows to start from: Temperature Monitor, SNMP Health Dashboard, REST API Aggregator, Modbus PLC Control and File Change Detector.
- **Test run**: the server answers with a made-up result for each node and the number of nodes and connections. Nothing of the flow runs.
- **Deploy**: marks the saved flow as deployed. Nothing on the server runs flows, so a deployed flow does nothing yet either.
- **Files**: under **More**, **Download as file** saves a saved flow as a `.bdflow` file (JSON), and **Import flow** reads one back.

To get values from a device into the console, use one of the SDKs or the protocol; the flow builder does not connect to anything.
