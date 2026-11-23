---
title: CDAP-SDKs und Bridges
description: Was die SDKs für Python und Node.js und die drei Referenz-Bridges tun, wie du sie gegen einen Server startest und was der Ablauf-Editor der Konsole macht.
order: 14
---

Das Repository hat zwei SDKs, mit denen du ein CDAP-Gerät oder eine Bridge schreibst, und drei Bridges, die auf dem Python-SDK aufbauen. Die Konsole hat dazu einen Ablauf-Editor. Diese Seite sagt, was jedes davon heute kann und wie du es startest. Die Nachrichten, die sie mit dem Gateway austauschen, stehen unter [CDAP-Protokoll](/docs/development/cdap-protocol); wie du das Gateway betreibst und die Geräte nutzt, steht unter [CDAP-Geräte](/docs/console/cdap).

## Was ein Gerät braucht {#what-a-device-needs}

- **Die Adresse des Gateways**: `ws://<server-address>:21122/cdap`, oder `wss://` mit eingeschaltetem TLS; siehe [Das Gateway](/docs/console/cdap#the-gateway).
- **Zugangsdaten**: ein API-Schlüssel, ein Konto der Konsole oder ein Gerätetoken, wie unter [Anmelden](/docs/development/cdap-protocol#signing-in). Die Rolle eines API-Schlüssels oder Kontos braucht **Registrierungen genehmigen**. Super-Admins, Administratoren und globale Administratoren haben diese Berechtigung standardmäßig; siehe [Was jede Rolle darf](/docs/people/users-and-roles#what-each-role-can-do). Schlüssel bekommst du über die API, siehe [API-Schlüssel](/docs/development/api#api-keys).
- **Eine Geräte-ID** aus 1 bis 64 Buchstaben, Ziffern, `-` und `_`. Keines der beiden SDKs denkt sich eine aus: Ohne ID wirft das Python-SDK `ValueError`, und das Node.js-SDK wirft einen Fehler.
- **Ein Gerätetyp**, den das Gateway annimmt: `scada`, `iot`, `os_agent`, `network`, `camera`, `desktop` oder `custom`.

Beide SDKs haben dasselbe Beispiel: ein simuliertes Gewächshaus mit Temperatur, Luftfeuchtigkeit, einem Schalter für die Heizung, einem Statustext und einer Frostwarnung. Es wird wärmer, wenn du in der Konsole die Heizung einschaltest. Die Tests des Servers lassen beide Beispiele und die drei Bridges gegen ein Gateway laufen, und die CI führt sie aus, sobald sich die SDKs, die Bridges oder das Gateway ändern.

## Python-SDK {#python-sdk}

Das Paket `neodesk_cdap` liegt in [`sdks/python`](https://github.com/neodeskapp/neodesk/tree/main/sdks/python). Es braucht Python 3.9 oder neuer und `websockets` 12 oder neuer. Installiere es aus einem Checkout des Repositorys und starte das Beispiel. Setze für `<server-address>` die Adresse deines Servers und für `<api-key>` einen CDAP-API-Schlüssel ein:

```bash
pip install ./sdks/python
CDAP_SERVER=ws://<server-address>:21122/cdap CDAP_API_KEY=<api-key> python sdks/python/examples/greenhouse.py
```

Ein kleines Gerät mit Temperatur, Schalter und Warnung:

```python
import asyncio
import os

from neodesk_cdap import CDAPBridge, gauge, toggle

bridge = CDAPBridge(
    server="ws://<server-address>:21122/cdap",
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

`bridge.run()` macht dasselbe wie `run_async()` und blockiert dabei. Das passt für ein Gerät, das nur Befehle beantwortet.

Was das SDK macht:

- **Verbinden**: Es fordert das Subprotokoll `cdap-v1` an und meldet sich mit `auth_method` `api_key` (`api_key`), `device_token` (`device_token`) oder `user_password` (`username`, `password`) an. Ein Feld für einen Zwei-Faktor-Code hat es nicht. Dann registriert es ein Manifest und wartet, bis das Gateway es bestätigt. Das Manifest baut es aus dem Konstruktor (`device_name`, `device_type`, `vendor`, `model`, `firmware`, `tags`, `capabilities`, `heartbeat_sec` und einem Bridge-Block mit `bridge_version` und `bridge_protocol`, wenn `bridge_name` gesetzt ist), den Widgets und den Warnungen. `capabilities` ist `["telemetry", "commands"]`, wenn du keine anderen übergibst.
- **Neu verbinden**: Nach einer verlorenen oder abgelehnten Verbindung wartet es `reconnect_sec` (standardmäßig 5), jedes Mal doppelt so lange bis zu `max_reconnect` (300), plus zufällig bis zu einem Viertel mehr. Es versucht es auch nach einer abgelehnten Anmeldung oder Registrierung weiter. Den Grund des Gateways findest du in seinem Log, beim Logger `neodesk_cdap`.
- **Werte**: `update_state(id, value)` und `bulk_update({id: value, ...})` schicken Werte sofort; beide sind Coroutinen, die du mit `await` aufrufst. Werte, die vor der Registrierung des Geräts gesetzt werden, bleiben erhalten und gehen mit dem ersten Heartbeat hinaus. Jeder Heartbeat, alle `heartbeat_sec` Sekunden (standardmäßig 15, erlaubt 5 bis 300), schickt alle Werte, die das SDK kennt, noch einmal.
- **Befehle**: `on_command("widget id")` registriert einen Handler für ein Widget, `on_command()` einen für alle anderen. Ein Handler darf eine Coroutine-Funktion oder eine normale Funktion sein und bekommt `action`, `value`, `widget_id`, `operator` und `reason` als Keyword-Argumente. Was er zurückgibt, geht als Ergebnis mit Status `ok` zurück. Eine Exception geht als `error` mit ihrer Meldung zurück, ebenso ein Befehl für ein Widget ohne Handler. Nach einem `set` schickt das SDK den neuen Wert sofort, damit die Konsole den neuen Zustand des Bedienelements zeigt.
- **Warnungen**: `add_alert(id, condition, label=, severity=, message=)` fügt dem Manifest eine Warnung hinzu, wie unter [Warnungen](/docs/development/cdap-protocol#alerts) beschrieben. Das Gateway zeigt sie unter **Aktive Warnungen**, solange die Bedingung zutrifft. Auf anderem Weg kann ein Gerät keine Warnung auslösen.
- **Logs**: `send_log(level, message, context)` schickt eine Nachricht `log`, mit `level` `debug`, `info`, `warning`, `error` oder `critical`.
- **Widgets**: `gauge`, `toggle`, `button`, `text_widget`, `led`, `slider`, `select`, `chart` und `table` bauen die gleichnamigen Widget-Typen, jeweils mit einem Standardeintrag für `permissions`. `Widget(...)` nimmt jedes Feld aus [Widgets](/docs/development/cdap-protocol#widgets).

Die [README des Pakets](https://github.com/neodeskapp/neodesk/blob/main/sdks/python/README.md) listet die Methoden auf.

## Node.js-SDK {#nodejs-sdk}

Das Paket `neodesk-cdap` in [`sdks/nodejs`](https://github.com/neodeskapp/neodesk/tree/main/sdks/nodejs) ist in TypeScript geschrieben und braucht Node.js 22 oder neuer (22.18 oder neuer für das Beispiel, das Node als TypeScript ausführt). Baue es und starte das Beispiel. Setze für `<server-address>` die Adresse deines Servers und für `<api-key>` einen CDAP-API-Schlüssel ein:

```bash
cd sdks/nodejs
npm ci
npm run build
CDAP_SERVER=ws://<server-address>:21122/cdap CDAP_API_KEY=<api-key> node examples/greenhouse.mts
```

Um es in deinem Projekt zu nutzen, führe nach dem Build dort diesen Befehl aus. Setze für `<checkout>` den Pfad deines Checkouts ein:

```bash
npm install <checkout>/sdks/nodejs
```

Ein kleines Gerät:

```js
const { CDAPBridge, gauge, toggle } = require('neodesk-cdap');

const bridge = new CDAPBridge({
  server: 'ws://<server-address>:21122/cdap',
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

Es funktioniert wie das Python-SDK, mit diesen Unterschieden:

- **Namen**: `addWidget`, `addAlert`, `onCommand`, `updateState`, `bulkUpdate`, `sendLog`, `run` (ein Promise, das sich neu verbindet, bis `stop()` aufgerufen wird) und `textWidget` für Text.
- **Standardwerte**: `deviceType` ist `custom`, `heartbeatSec` 15, `reconnectSec` 5 und `maxReconnect` 120. Die Fähigkeiten im Manifest sind immer `telemetry`, `commands`, `alerts` und `logs`.
- **Befehle**: Der Handler bekommt den Befehl (`command_id`, `widget_id`, `action`, `value`, `operator`, `reason`) und darf einen Wert oder ein Promise zurückgeben. Was er zurückgibt, geht als Ergebnis zurück und wird sofort zum Wert des Widgets.
- **Ereignisse**: `connected`, `registered`, `command`, `disconnected`, `error`, `message` und der Typ jeder anderen Nachricht, die der Server schickt. Registriere einen Listener für `error`: Wie bei jedem Event-Emitter in Node.js wirft ein `error`-Ereignis ohne Listener eine Exception.

Die [README des Pakets](https://github.com/neodeskapp/neodesk/blob/main/sdks/nodejs/README.md) enthält die Details.

## Referenz-Bridges {#reference-bridges}

Die Bridges in [`bridges`](https://github.com/neodeskapp/neodesk/tree/main/bridges) sind Python-Skripte auf Basis des Python-SDK. Jede liest eine JSON-Konfigurationsdatei: einen Block `cdap` für die Verbindung (`server`, `api_key`, `device_id`, `device_name`, `device_type`, `bridge_name`, `heartbeat_sec`) und einen Block für die andere Seite. `device_id` ist Pflicht, und zwei Bridges auf einem Server brauchen verschiedene IDs. Ohne `device_type` registriert sich die Modbus-Bridge als `scada`, die SNMP-Bridge als `network` und die REST-Bridge als `iot`.

| Bridge | Skript | Spricht mit | Was sie macht |
|---|---|---|---|
| Modbus | `modbus/bridge_modbus.py` | Modbus TCP oder Modbus RTU über eine serielle Schnittstelle (`pymodbus` 3.10 oder neuer) | Liest alle `poll_interval_sec` Holding- und Input-Register, Coils und Discrete Inputs, als `int16`, `uint16`, `int32`, `uint32` oder `float32` mit `scale` und `offset`. Befehle für Einträge, die nicht `readonly` sind, schreibt sie zurück ins Register oder in die Coil |
| SNMP | `snmp/bridge_snmp.py` | SNMP v2c oder v3 (`pysnmp`) | Fragt OIDs ab, zeigt Timeticks und Kilobytes lesbar an, macht aus Zählern Raten und wendet eine `transform` wie `100 - x` an |
| REST und Webhooks | `rest-webhook/bridge_rest.py` | HTTP (`aiohttp`) | Fragt URLs ab und wählt einen Wert über einen Pfad mit Punkten aus (der Schlüssel `jmespath`), schaltet einen Schalter über einen Aufruf von `write_url` und lauscht auf Webhooks an `webhook_port` und `webhook_path` |

Lehnt das Modbus-Gerät oder die REST-API einen Schreibzugriff ab, beantwortet die Bridge den Befehl mit einem Fehler, und das Bedienelement behält seinen Wert.

Ein Webhook-Eintrag der REST-Bridge mit `alert_severity` (`critical`, `warning` oder `info`) fügt dem Manifest eine Warnung hinzu. Sobald ein passender Webhook das Widget des Eintrags gesetzt hat, erscheint die Warnung mit `alert_message` unter **Aktive Warnungen** und bleibt dort, bis sich die Bridge neu verbindet. Ihre `widget_id` muss mit einem Buchstaben oder `_` beginnen und darf nur Buchstaben, Ziffern, `_` und `.` enthalten.

Um eine Bridge zu starten, installiere das SDK und die Pakete der Bridge, kopiere die Beispielkonfiguration, setze darin `server`, `api_key` und `device_id` und starte das Skript damit:

```bash
pip install ./sdks/python
cd bridges/modbus
pip install -r requirements.txt
cp config.example.json config.json
python bridge_modbus.py --config config.json --log-level INFO
```

Die [README der Bridges](https://github.com/neodeskapp/neodesk/blob/main/bridges/README.md) beschreibt den Aufbau der Konfiguration.

## Der Ablauf-Editor {#the-flow-builder}

Die Seite **Ablauf-Editor (SDK)** der Konsole, unter `/cdap-studio`, ist ein Editor für Datenflüsse. Die Seitenleiste zeigt sie der Rolle Remote-Operator und Super-Admins.

- **Knoten**: Du ziehst Knoten aus drei Gruppen auf die Arbeitsfläche und verbindest sie. **Quellen**: Modbus TCP, Modbus RTU, SNMP-Abfrage, REST-Abfrage, MQTT abonnieren, Webhook, Gerätetelemetrie, Datenbankabfrage, Dateiüberwachung. **Verarbeitung**: Filter, Umwandeln, Zusammenfassen, Verzögerung, Entprellen, Verzweigung, Zusammenführen, Skript. **Ausgaben**: Widget aktualisieren, Alarm, Befehl, Protokoll, REST-Aufruf, MQTT veröffentlichen, In Datenbank schreiben, E-Mail, Modbus schreiben. Unter **Knoteneinstellungen** stehen die Einstellungen jedes Knotens.
- **Speichern**: **Flow speichern** legt den Flow auf dem Server ab. Jeder Flow gehört dem Konto, das ihn angelegt hat; Super-Admins sehen und ändern alle. **Flow öffnen** listet die gespeicherten Flows auf.
- **Vorlagen**: fünf Flows zum Starten: Temperature Monitor, SNMP Health Dashboard, REST API Aggregator, Modbus PLC Control und File Change Detector.
- **Testlauf**: Der Server antwortet mit einem erfundenen Ergebnis für jeden Knoten und mit der Zahl der Knoten und Verbindungen. Vom Flow selbst läuft nichts.
- **Bereitstellen**: markiert den gespeicherten Flow als bereitgestellt. Auf dem Server führt nichts Flows aus, also tut auch ein bereitgestellter Flow noch nichts.
- **Dateien**: Unter **Mehr** speichert **Als Datei herunterladen** einen gespeicherten Flow als `.bdflow`-Datei (JSON), und **Flow importieren** liest so eine Datei wieder ein.

Um Werte von einem Gerät in die Konsole zu bekommen, nutze eines der SDKs oder das Protokoll; der Ablauf-Editor verbindet sich mit nichts.
