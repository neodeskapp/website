---
title: RDP and VNC targets
description: Add computers that have no RustDesk client, set up the gateway the server reaches them through, and what a session can do.
order: 9
---

An RDP or VNC target is a computer without a RustDesk or NeoDesk client, such as a Windows PC with Remote Desktop turned on or a Linux machine with a VNC server. The server connects to it, and people use it in a browser tab through the [web viewer](/docs/console/remote-in-browser). The browser talks only to the console. The server opens the connection to the computer and fills in a saved password itself, so that password never reaches the browser.

## What the server needs

The server reaches RDP and VNC computers through guacd, the daemon of Apache Guacamole. guacd is not part of the server binary or its Docker image. The server talks to it only on a loopback address, `127.0.0.1:4822` unless `GUACD_ADDRESS` says otherwise, and refuses an address that isn't loopback.

- **Docker**: `docker-compose.quick.single.yml`, which `neodesk-docker.sh` installs as `docker-compose.yml`, has guacd as an optional service. Add `guacd` to `COMPOSE_PROFILES` in the `.env` file next to it, for example `COMPOSE_PROFILES=guacd`, or `COMPOSE_PROFILES=postgres,guacd` with PostgreSQL, and recreate the containers in that folder:

  ```bash
  docker compose up -d
  ```

- **Linux and Windows**: the installers set `GUACD_ADDRESS=127.0.0.1:4822` but don't install guacd. Install it yourself and have it listen on `127.0.0.1` port 4822 only. The repository's `remote-gateway` folder has an example systemd unit that does this.

Passwords saved on the server are encrypted with the key in `REMOTE_TARGET_VAULT_KEY`. The Linux and Windows installers write one into the env file. The Docker image makes one at its first start and keeps it in the data volume as `/opt/neodesk/data/.remote_target_vault_key`. Without the key the server can't read the saved passwords, so keep it in your [backups](/docs/operations/backup).

The target form says what is missing. While guacd doesn't answer, it shows "Connections cannot start yet: guacd, the RDP and VNC gateway of this server, does not answer." While the key is missing and **Save on this server** is chosen, it says that the server cannot save passwords yet.

The server won't connect to a target at `localhost`, at a loopback, link-local, multicast or unspecified address, or at the cloud metadata address 169.254.169.254.

## Add a target

In [the device list](/docs/console/devices), click **Add RDP/VNC target**. The form asks for:

| Field | What to enter |
|---|---|
| **Display name** | How it appears in the device list |
| **Technology** | **RDP** for Windows computers, **VNC** for most Linux and macOS screens |
| **Host or IP** and **Port** | The address this server uses to reach the computer. RDP usually uses 3389, VNC 5900 |
| **Operating system** | Shown in the device list, for example Windows 11 |
| **Username** and **Password** | **Ask at every connection**, **Save on this server** or **No password** |
| **TLS encryption** | **Required**, **When the computer supports it** or **Off** |
| **Trusted certificate fingerprint** | A SHA-256 fingerprint. Leave it empty to confirm the certificate at the first connection |
| **Enabled** | When off, the target stays in the list but nobody can connect to it |

**Test connection** checks that the server can open a connection to the host and port within five seconds. It doesn't sign in. The answer is "Reached ... on port ...", "Could not reach ... on port ..." or, for one of the addresses the server won't connect to, "This server is not allowed to connect to that address."

After **Save** the target shows in the device list like a device, and **Connect** opens it in the web viewer. **Edit** opens the same form; leave **Saved password** empty to keep the saved one. **Delete** in the row menu removes the target after a confirmation, and nobody can connect to it afterwards.

## Passwords and certificates

With **Ask at every connection** the server keeps the username, and the viewer asks for the password each time someone connects. With **Save on this server** the password is stored encrypted and filled in at each connection, so the viewer connects without asking. **No password** sends none.

With a fingerprint in **Trusted certificate fingerprint**, the server checks the computer's certificate before every session and refuses one with another fingerprint. Leave the field empty and the viewer can ask instead: when the connection fails on a certificate whose fingerprint it receives, it shows **Untrusted certificate** with that fingerprint. **Trust certificate** saves the fingerprint on the target and connects again. Trusting a certificate needs permission to connect to RDP and VNC targets.

## In the viewer

An RDP or VNC session shows the screen and passes the mouse and the keyboard. Text you paste onto the screen goes to the computer's clipboard, and text copied on the computer reaches this computer's clipboard when the browser allows it. There is no sound, no file transfer and no choice of screens, and **Type text** isn't available. Of the settings under **Display**, only **Disable clipboard** has an effect; **View only** works as in other sessions.

A person's **Client features** in [panel access](/docs/people/permissions#panel-access) narrow the session. Without **Remote control** the session is view only, and without **Clipboard** nothing is copied in either direction.

Which targets someone may open follows the same access rules as devices, see [Which devices a user sees](/docs/people/users-and-roles#which-devices-a-user-sees).

## Who can do what

Seeing, connecting to, testing, adding and editing, and deleting targets are separate permissions. By default Super admin and Global admin accounts have all of them, Remote operator accounts may see, test and connect, and Server admin and Viewer accounts only see targets. See [What each role can do](/docs/people/users-and-roles#what-each-role-can-do).
