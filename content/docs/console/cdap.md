---
title: CDAP devices
description: Let sensors, controllers and agents connect over CDAP, see their values and controls, and send them commands.
order: 13
icon: settings_input_component
---

CDAP is the server's own protocol for devices that are not RustDesk clients: sensors, controllers, cameras, SCADA systems, network devices and agents. A device connects to the server's CDAP gateway, says which values and controls it has, and the console shows them under **IoT devices (CDAP)**. This page is about running the gateway and using those devices. How to build a device or a bridge for CDAP is in [CDAP protocol](/docs/development/cdap-protocol) and [CDAP SDKs and bridges](/docs/development/cdap-sdks).

## The gateway

The gateway listens on port 21122 and is on unless it is turned off. **Disable gateway** and **Enable gateway** on the IoT devices page turn it off and on at the server's next restart, and what you choose there stays in place over `CDAP_ENABLED`. The variable decides only as long as nobody has used those buttons. `CDAP_PORT` moves the gateway to another port. The Linux and Windows installers open 21122 in the firewall unless the env file sets `CDAP_ENABLED=N`; they don't look at the buttons. The Docker compose files publish 21122, and the one-line Docker install opens it in ufw or firewalld whether the gateway is on or off. Devices have to reach it directly; it doesn't go through the console or a reverse proxy.

Without further settings the gateway takes plain connections. `CDAP_TLS=Y` adds TLS with the server's certificate (`TLS_CERT` and `TLS_KEY`), and `CDAP_TLS_REQUIRED=Y` refuses plain connections. Both need that certificate. See [Configuration](/docs/operations/configuration) and [Ports](/docs/operations/ports).

## How a device signs in

The device's software or bridge decides how it signs in to the gateway. There are three ways:

- **A console account** with its password.
- **An API key** of the server.
- **A device token** that belongs to that device. The device must already be on the server and must not be banned, disabled or deleted.

A device that signs in with an account or an API key joins the server under the ID it gives, so that account's or key's role needs the **Approve enrollment** permission. An ID that another account or key registered is refused, and so is a banned device.

A device that has signed in shows on the **IoT devices (CDAP)** page while it is connected, and in [the device list](/docs/console/devices) with the name and type it gave.

## The IoT devices page

Open **Devices**, then **IoT devices (CDAP)**; in the sidebar it is usually under **More**. The page needs the **View CDAP devices** permission.

| Column | Shows |
|---|---|
| **Device** | The device's name and ID |
| **Type** | The type the device gave, such as **IoT**, **SCADA**, **OS agent**, **Network**, **Camera** or **Custom** |
| **Status** | **Connected** or **Disconnected** |
| **Address** | The address it connected from |
| **Connected for** | How long the current connection has lasted |
| **Values and controls** | How many the device declared |
| **Check-ins** | How many times it has checked in on this connection |

**Search by name, ID or address** and the **Device type** buttons narrow the list. The page loads again every 10 seconds while the tab is visible. The **Gateway** section beside the list shows the port and whether connections are encrypted, for example "Gateway on, port 21122. Connections are not encrypted."

## A device's page

Click a device to open its page. The top shows its type, status, how long it has been connected and its firmware. While it is offline, the page says "The device is offline. The values below may be out of date."

- **Values and controls**: what the device declared, such as gauges, switches, buttons, sliders, lists, charts and tables, and for some devices a terminal, its screen, a video stream or its files. Values load again every 3 seconds. A control the device marked for it asks "Send this command?" first.
- **Active alerts**: the alerts the device has raised that are still open.
- **Commands sent**: the last 50 commands sent from this page, with their result. **Clear list** empties it.
- **Linked remote desktop devices**: devices from the device list that belong to this IoT device. **Link device** asks for the device ID.

What each account may do there depends on its permissions:

| Permission | Allows |
|---|---|
| **Send CDAP commands** | Changing controls, pressing buttons, the video stream, and linking devices |
| **CDAP terminal access** | The terminal and the screen |
| **CDAP file access** | The file browser |

Without them the values still show, but the controls can't be changed. The defaults per role are in [What each role can do](/docs/people/users-and-roles#what-each-role-can-do).
