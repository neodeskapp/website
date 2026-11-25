---
title: Saved sign-in
description: Keep a Windows account's name and password for a device, and let the browser viewer sign in with them at the computer's lock screen.
order: 11
icon: key
---

Saved sign-in keeps the name and password of a Windows account for a device.
When a session in the [browser viewer](/docs/console/remote-in-browser) opens
on the computer's lock or sign-in screen, the viewer signs in with them, so you
don't need to know the password. It works on Windows computers where NeoDesk
runs as a service, in the browser viewer, over a session encrypted end to end
with the computer.

## Permissions

Two permissions belong to saved sign-in:

| Permission | Short name | What it allows |
|---|---|---|
| **Use saved sign-in** | `device.signin_use` | Sign in with the saved details in the viewer. It also needs **Connect to devices**. |
| **Manage saved sign-in** | `device.signin_manage` | Save, replace and clear the details, and turn automatic sign-in on or off. |

Only super admins and administrators have them by default. Give them to
another role on the [Permissions](/docs/people/permissions) page. Both only
reach the devices the account may see.

## Save the details

1. Open the device, and on its **Actions** tab, or in its menu in the device
   list, choose **Saved sign-in**.
2. Under **Account name**, type the account as you type it at the sign-in
   screen: `name`, `DOMAIN\name` or `name@domain`.
3. Under **Password**, type its password.
4. Under **The sign-in screen asks for**, choose **Only the password (the
   account is shown)** or **Account name and password**. A locked computer
   shows its account and asks only for the password. After a restart, Windows
   shows the last account or asks for both, depending on its settings.
5. Turn on **Sign in automatically when a session opens on the lock screen** if
   you want the viewer to sign in by itself. It is off by default.
6. Save.

The password can't be shown again. Open **Saved sign-in** later to see the
account, who saved it and when, and to replace the password or change the
switch; leave the password empty to keep the saved one. **Clear saved
sign-in** deletes the account name and password from the server.

The account name and the password take at most 256 characters each. Tabs, line
breaks and characters such as emoji can't be typed at a sign-in screen, so the
form refuses them.

## Sign in from the viewer

When a sign-in is saved, the viewer says "A sign-in is saved for this
computer." It signs in at most once per session:

- **By itself**, when the switch is on and the session opens on the lock or
  sign-in screen. A reconnect in the same browser tab doesn't do it again. A
  session that opens while you are on another page of the console waits and
  signs in once you come back to it.
- **With Sign in**, in the bar or as **Sign in with the saved details** under
  **Actions**, in every other case.

To sign in, the viewer presses Ctrl+Alt+Del, waits for the sign-in screen, and
types the password, or the account name, Tab and the password, then Enter. It
types each character as a character, so the keyboard layout of the computer
doesn't matter.

The viewer can't see whether Windows took the password. Afterwards it says
"The saved details were typed. If Windows shows an error, sign in by hand:
they are not tried again in this session." So a wrong saved password costs at
most one failed sign-in per session and can't lock the account by retries.

## What works with which client

How the details reach the lock screen depends on the NeoDesk client on the
computer.

### The client 1.5.0-rc.7 and older

The browser viewer types the details. The password comes from the server over
HTTPS at the moment of use and stays in the browser for about two seconds,
while the viewer types it.

These clients don't report whether the computer is locked. So the viewer signs
in by itself only while nobody is signed in on the computer, for example after
a restart. When someone is signed in, the bar says "Someone is signed in on
this computer. Use Sign in only while the screen shows the lock screen." and
**Sign in** asks first, because on an open desktop the password would be typed
into whatever has the focus.

### Clients after 1.5.0-rc.7

A later NeoDesk client, not released yet, opens the details itself. The server
seals them for that computer's NeoDesk, the viewer only passes the sealed packet
on, and the computer's NeoDesk service types at its own lock screen. The
password never reaches the browser.

That client also reports its lock screen. Saved sign-in then acts only on the
lock or sign-in screen: by itself with the switch on, or with **Sign in**
without asking first. On an open desktop, and on the screens of a signed-in
session such as the Ctrl+Alt+Del options, nothing is offered.

Once a computer's NeoDesk has reported that it opens sealed sign-ins, the server
hands out no readable details for it any more, also when an older client is
installed on it again. The viewer then says to update NeoDesk on the computer.

### Where it doesn't work

- Linux and macOS computers: the viewer says "Saved sign-in works on Windows
  computers only.", and so does the **Saved sign-in** sheet when the device
  reports another system.
- A computer where NeoDesk runs without its service, such as a portable copy:
  "NeoDesk on this computer runs without its service, so it can't type at the
  lock screen."
- Guest links: the viewer never offers saved sign-in to a guest.
- API tokens, and with them the command line and MCP, never use the details.

## Where the details are kept {#where-the-details-are-kept}

The server keeps the account name and the password encrypted (AES-256-GCM),
each sealed for its device, so a value can't be moved to another device. The
key is the file `.device_vault_key` next to the server's key pair:

| Install | Key file |
|---|---|
| Linux | `/opt/neodesk/.device_vault_key` |
| Windows | `C:\NeoDesk\.device_vault_key` |
| Docker | `/opt/neodesk/data/.device_vault_key` in the data volume |

The server makes it at its first start. The same file holds the key of the
device passwords an organization's address book stores, see
[Share the password with your team](/docs/console/unattended-access#share-the-password-with-your-team).

- The console's full backup holds the saved details but not the key file, and
  so do the backups of the Linux and Windows installers. The Docker manager's
  backup copies the whole data volume, the key file included. See
  [Backup and restore](/docs/operations/backup).
- A restore on the same server opens the details again. A server with another
  key file can't: the viewer says "The saved details can't be read with this
  server's key. Save them again."
- When you move the server, copy the key file with the data.
- Keep the file as safe as the server's key: the file and a copy of the
  database together open the details.

Changing a device's ID or deleting it for good deletes its saved sign-in.

## The audit log

Every step is in the [audit log](/docs/console/activity): **Saved sign-in set**,
**Saved sign-in replaced**, **Saved sign-in changed**, **Saved sign-in
cleared**, **Saved sign-in used** and **Saved sign-in refused**, with the device
and, for a refusal, the reason. An entry names the account name, never the
password. The server writes the entry before it hands out the details; when it
can't, it hands out nothing.

## On the command line

With **Manage saved sign-in**, the command line shows, saves and clears the
details. Put the device's ID in place of `<device-id>` and the account in
place of `<account-name>`, with the password in a file:

```bash
neodesk devices signin-set <device-id> --username '<account-name>' --password-stdin < password.txt
```

- `neodesk devices signin <device-id>` shows whether details are saved, for
  which account, and who saved them, never the password.
- `neodesk devices signin-auto <device-id> --auto` turns automatic sign-in on;
  `--form name_password` says the screen asks for both.
- `neodesk devices signin-clear <device-id>` deletes the details.

No command uses the details or reads the password back.
