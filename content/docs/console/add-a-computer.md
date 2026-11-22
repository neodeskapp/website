---
title: Add a computer
description: Make an invite link that installs NeoDesk on a computer and joins it to your server, approved and in its folder.
order: 3
---

An invite link sets up the NeoDesk client on a computer and joins it to your
server. The person at the computer opens the link, installs the client, and the
computer shows up under **Devices**, already approved, with the name and folder
you picked. Nobody types a server address or a key.

You need the **Approve enrollment** permission. For a stock RustDesk client,
use the values from **Client setup** instead; see
[Connect a RustDesk client](/docs/getting-started/connect-a-client).

## Make an invite

Open **Devices**, then **All devices**, and click **Add a computer** above the
list.

![The device list with the Add a computer button marked](shot:add-computer-start)

Every field is optional:

| Field | What it does |
|---|---|
| Name | The name the computer gets in Devices. Empty uses the computer's own name. |
| Folder | The folder it joins. **Unassigned** puts it in none. |
| Send to | An email address that gets the link. Shown only when email is set up under **Settings**, **Email**. |
| Works for | 1 day, 7 days (the default) or 30 days. |
| Can be used | **Once** (the default), **5 times**, **25 times** or **Until it expires**. Use more than once to set up several computers with one link; leave **Name** empty then. |

Click **Create invite**.

## Send the link

![The invite with its link, code and QR code](shot:add-computer)

The invite shows:

- **Invite link**, with **Copy**. Send it to the person at the computer.
- **Code**, such as `BWC8-AY6F`, for a computer that has NeoDesk already:
  in the client, **Settings**, **Server**, **Join a server**.
- A QR code of the link, to open it on a phone and send it on from there.
- **Send by email**, when email is set up.

The link uses the console's public address (`PANEL_PUBLIC_URL` or
`PANEL_PUBLIC_HOST`, see [Configuration](/docs/operations/configuration)), or
the address you opened the console under. When that address is plain HTTP, the
invite warns that the computer cannot check it talks to your server. Use such a
link only on a network you trust, or put the console behind
[a reverse proxy with TLS](/docs/operations/reverse-proxy-tls).

**Add another computer** makes the next invite; **Done** closes the sheet.

## What the person sees

The link opens a page that names your server and offers the download for the
person's system: an installer for Windows, a disk image for Mac, and a command
to paste on Linux. The page lists the steps for that system and shows the code
as well. On a phone it asks them to open the link on the computer instead.

The downloads are the official NeoDesk client releases. Your server fetches
them from GitHub, checks their signature, and serves them itself. When it has
no release yet, the page says there is no download right now.

If the computer has not shown up after the install, have the person open
**Settings**, **Server**, **Join a server** in NeoDesk and type the code.

## Open invites

**Open invites** at the bottom of the sheet lists the invites that still work,
with how many uses are left and until when. **Revoke** ends an invite at once.
An invite ends by itself when its time is up or its last use is taken.

A computer that joins with an invite is approved in every
[enrollment mode](/docs/console/enrollment#enrollment-modes) and gets its
device token at once.
