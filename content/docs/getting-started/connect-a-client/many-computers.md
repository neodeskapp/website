---
title: Set up many computers at once
description: Join a batch of computers with one invite link, or hand the stock RustDesk client its server settings from an install script.
order: 1
icon: devices_other
---

There are two ways to set up many computers. An invite from **Add a computer**
that works several times installs the NeoDesk client and joins each computer
approved. For the stock RustDesk client, the console gives you the four values
as one config string, and a PowerShell script that applies it on Windows. This
page covers both, and what happens when many new devices join at once.

## With one invite

1. Open **Devices**, then **All devices**, and choose **Add a computer**.
2. Choose a **Folder** for the computers, and leave **Name** empty so that each
   one keeps its own name.
3. Under **Can be used**, choose **5 times**, **25 times** or
   **Until it expires**, and under **Works for** how long the link works:
   1, 7 or 30 days. **Until it expires** still ends after 1000 computers.
4. Choose **Create invite** and send the link to the people at the computers.

Each computer that opens the link gets the NeoDesk client: a download on
Windows and macOS, one command to paste on Linux. It joins approved, in the
folder you chose, without a stop under **Join requests**. **Open invites**
in the same sheet shows how many uses are left, and **Revoke** ends an invite
early. [Add a computer](/docs/console/add-a-computer) explains the invite in
detail.

## With the stock RustDesk client

### Check the address first

The config string and the script are built from the address clients use. Set it
before you copy anything, under **Settings**, **General**,
**Public client endpoints**, see
[Set the address clients use](/docs/getting-started/first-sign-in#set-the-address-clients-use).
A computer set up with the wrong address has to be set up again.

If you typed another address into **Client server address** on **Overview**,
the string and the script use that address as long as the browser tab stays
open.

### The config string

The config string holds the ID server, relay server, API server and key in one
line. Copy it from either place:

- **Devices**, **Overview**: under **Client setup**, open **More** and choose
  **Copy deploy string**.
- **Devices**, **Add computers**, **Manual setup**: the **Config string**
  field, with its **Copy** button.

Both give the same string. On a single computer, import it in the RustDesk
network settings with Import server config. In an install script, hand it to
RustDesk with the `--config` option.

To build the string in your own script, for example with different values, start
from the four values as JSON with the keys `host`, `relay`, `api` and `key`.
Encode that in base64, drop the `=` signs at the end, and reverse the result.
The Windows install script below does exactly this in PowerShell.

### Windows: the install script

On **Overview**, under **Client setup**, open **More** and choose
**Windows install script (Intune)**. A side sheet shows a PowerShell script,
`install-rustdesk-config.ps1`, with this server's values filled in. The code
block has a copy button.

1. Roll out the RustDesk MSI as you normally do, for example as an Intune Win32
   app or with PSADT.
2. Run the script as administrator after the installer has finished, as a
   post-install step.

The script builds the config string and runs `rustdesk.exe --config` with it,
from the RustDesk folder under `%ProgramFiles%`.

It sets the same relay server as the config string, with its port: the
**Public relay server** when one is set, otherwise the ID server.

The last line of the script is commented out. It sets a permanent password for
unattended access, see
[Set the permanent password](/docs/console/unattended-access#set-the-permanent-password).

### Other systems

The console has an install script for Windows only. On other systems, pass the
config string to RustDesk's `--config` option in your own script, or have
people import it in the RustDesk network settings. On Linux the option needs
root. Put the config string in place of `<config-string>`:

```bash
sudo rustdesk --config '<config-string>'
```

For scripts that read the server's key from a file, **Devices**,
**Add computers**, **Manual setup** has **Download key file** under
**Downloads**. It saves the key as `id_ed25519.pub`.

## When the new devices join

Computers that join with an invite are approved already. A stock RustDesk
client registers with the server once it runs with the new settings, and what
happens then depends on the join mode:

- **Open**: every computer joins at once and shows up under **Devices**, then
  **All devices**. While the mode is Open, any RustDesk client that reaches
  your server can join.
- **Managed**: every computer waits under **Devices**, then
  **Join requests**, until someone approves it. Approving sets its name,
  folder, tags and groups. At most 1000 RustDesk clients can wait at a time;
  while the list is that full, new ones don't get into it until there is room
  again.
- **Locked**: new RustDesk clients are turned away. The stock RustDesk client
  has no way to send a device token, so tokens from **Add computers**,
  **Device tokens** don't help here.

A new install starts in **Managed**. For a large rollout of stock clients you
can switch to **Open** while the computers join and back to **Managed** when
they are all there: a device the server already knows can register again in
every mode. A computer that was already waiting when you switch is approved
the next time it registers. See
[Changing the mode](/docs/console/enrollment#changing-the-mode) and
[Approving a device](/docs/console/enrollment#approving-a-device).

Computers in one office often reach the server through one public address.
While several of them are online, a session started from one of them to
another device can fail with "ID does not exist". See
[Troubleshooting](/docs/operations/troubleshooting#clients-show-not-ready-or-cannot-connect)
for the setting that allows it.
