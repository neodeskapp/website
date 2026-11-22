---
title: MeshAgent devices
description: Let computers with MeshCentral's agent connect to the server, approve them, and use their terminal, files, port relays and power commands.
order: 11
---

NeoDesk speaks the protocol of MeshAgent, the agent of MeshCentral. A computer with the unmodified MeshAgent connects to the server and shows in [the device list](/docs/console/devices) as a mesh agent, next to the RustDesk clients. You open its screen in the [web viewer](/docs/console/remote-in-browser) and get a terminal, a file browser, port relays and power commands. The **Mesh agents** filter in the device list shows only these devices.

## The MeshCentral layer

The layer is on unless the server starts with `MESH_ENABLED=N`, see [Configuration](/docs/operations/configuration). Its settings are under **Settings**, **General**, in the section **MeshCentral compatibility**, for accounts that may change server settings. The section shows:

| Row | What it shows |
|---|---|
| **MeshCentral layer** | **Enabled** while the layer runs |
| **Agents connected now** | How many agents are online |
| **Server ID** | The ID of the agent certificate, which every .msh file names |
| **Agent certificate** | Whether the file `mesh_agent_server.pem` exists, and since when |

Agents connect to the console's own address, at `/agent.ashx`, over HTTPS. The console passes `/agent.ashx`, `/meshrelay.ashx` and `/control.ashx` to the layer, which runs in the same program. So the console has to be reachable over HTTPS under the address the agents use, either behind a [reverse proxy with TLS](/docs/operations/reverse-proxy-tls) that passes WebSocket upgrades, or with the [console's own HTTPS](/docs/operations/reverse-proxy-tls#https-without-a-proxy).

## Install the agent on a device

1. In **MeshCentral compatibility**, open **Install MeshAgent on a device**.
2. Enter the **Name in the .msh file**, the name MeshAgent shows for the server, and click **Download MeshAgent .msh**. This file is for the group with the ID `default`. For another group, use **Download .msh file** in that group's row under **Mesh groups**.
3. Open the file, `meshagents.msh`, in a text editor and check the `MeshServer=` line. It names the console's public address (`PANEL_PUBLIC_URL` or `PANEL_PUBLIC_HOST`), or the address you opened the console under when neither is set. It has to be `wss://`, the address under which agents reach the console over HTTPS (with the port if it isn't 443), and `/agent.ashx`, for example `MeshServer=wss://desk.example.com/agent.ashx`. Correct the line when it shows another address, such as `127.0.0.1`.
4. Install the unmodified MeshAgent on the device together with the .msh file.
5. The agent asks to join and waits under [Enrollment requests](/docs/console/enrollment), where **Came in via** says **Mesh agent**. Approve it. The agent comes in at its next connection and shows as online.

Every new agent waits for approval, whatever the enrollment mode. While 500 requests wait, the server takes no new ones from agents. A rejected, banned or deleted agent is refused, and so is an agent whose .msh file belongs to no group; the log then shows `[mesh] agent from <address> refused: unknown mesh id`.

## Mesh groups

**Mesh groups** lists the groups with their **Name**, **Group ID** and **MeshID**. Each group has its own .msh file, and a device installed with a group's file joins that group. **Add group** asks for a group ID, a short name without spaces that can't be changed later, and a display name. The row menu has **Download .msh file**, **Rename** and **Remove**.

::: warning
The server lets an agent in only while its .msh file's group exists. Removing a group also locks out the agents installed with that group's file, at their next connection.
:::

## Certificates

The agent certificate, `mesh_agent_server.pem` (`MESH_AGENT_CERT_FILE` names another file), is what agents recognise the server by: its ID is the `ServerID=` line of every .msh file. Keep it in your [backups](/docs/operations/backup).

MeshAgent also reports the TLS certificate it saw at the `MeshServer` address. When the server has a certificate for this comparison, it refuses an agent that saw a different one, and the log shows `[mesh] agent web cert hash mismatch from <address>`. The server takes the certificate from `MESH_WEB_CERT_FILE`, or else from its own TLS certificate (`TLS_CERT` or the installers' `-tls-cert`). With neither, it doesn't compare.

Behind a reverse proxy, the agents see the proxy's certificate. Set `MESH_WEB_CERT_FILE` to that certificate file, for example the `fullchain.pem` certbot made, so that the server compares against the right one. The server reads the file when it starts, so restart it after the certificate is renewed.

## Using a MeshAgent device

While the agent is online, the row menu and the **Actions** tab of the [device panel](/docs/console/device-details) offer these tools, each for accounts with the matching permission:

| Tool | What it does |
|---|---|
| **Web remote** | Opens the device's screen in the web viewer |
| **Terminal** | A shell on the device in a side panel. Escape goes to the shell, Shift+Escape closes the terminal, and closing it ends the connection |
| **File browser** | Opens the device's files in the web viewer's file transfer, in a new tab |
| **Run command** | Sends one command to the agent, with **Run in shell** to run it in a shell. The console says when the agent took it; it doesn't show the output |
| **Link to RustDesk/CDAP peer on same host** | Links the agent to the RustDesk or CDAP device on the same computer, by its ID. Leave the ID empty to unlink |
| **Guest desktop link** | A view-only link to the device's screen for someone without a console account, valid for 15 to 1440 minutes, 120 by default |
| **TCP port relay**, **UDP port relay** | Opens a connection from the agent to a host and port as seen from the device (`127.0.0.1` is the device itself), shows what comes back and sends text you type. Closing the panel ends the connection |
| **Wake**, **Sleep**, **Reset**, **Power off** | Power commands, each after a confirmation |

When the agent is offline, only **Wake** is left. The server then sends a Wake-on-LAN packet as a broadcast on its own network, to the network adapter the agent reported earlier or, failing that, to the one of the linked device. It reaches the device only when the server and the device share a local network.

In the web viewer, **Record** in a MeshAgent session turns recording on the server on or off, and the session reconnects. The recordings are listed under **Recorded sessions** in **MeshCentral compatibility**, with **Download** for accounts that may connect to devices. The server keeps them as `.mcrec` files in a `mesh-recordings` folder beside its database file.

Which role gets the terminal, the files and the power commands is in [What each role can do](/docs/people/users-and-roles#what-each-role-can-do).
