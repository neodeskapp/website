---
title: Add a computer
description: Make an invite link that installs NeoDesk on a computer and joins it to your server, approved and in its folder, and set the computer up as it joins.
order: 3
related: /docs/console/unattended-access, /docs/console/enrollment, /docs/getting-started/connect-a-client
icon: add_to_queue
---

An invite link sets up the NeoDesk client on a computer and joins it to your
server. The person at the computer opens the link, installs the client, and the
computer shows up under **Devices**, already approved, with the name and folder
you picked. Nobody types a server address or a key. While you wait, the invite
stays open in the console and walks you through the computer's first steps as
soon as it joins.

You need the **Approve join requests** permission. For a stock RustDesk client,
use the values under **Devices**, **Add computers**, **Manual setup** instead;
see [Connect a RustDesk client](/docs/getting-started/connect-a-client).

## Make an invite

Open **Add a computer** from one of these places:

- **Devices**, then **All devices**: the **Add a computer** button above the
  list.
- **Devices**, then **Add computers**, tab **Invites and install links**: the
  **Add a computer** button.
- The search in the top bar (Ctrl+K): type "add computer" and pick the action
  **Add a computer**.
- The setup guide on the overview of a new install: the step
  **Add your first computer**.

![The device list with the Add a computer button marked](shot:add-computer-start)

**Add computers** gathers every way a computer gets onto the server, each as a
tab for the accounts that may use it: **Invites and install links**,
**Device tokens**, **Pairing codes**, **Support agents** and **Manual setup**.

Every field of the invite is optional:

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

Under the link the sheet says it is waiting, for example "Still waiting for
Anna's laptop. The link works until Dec 2, 2026, 03:00 PM." Leave the sheet
open to set the computer up as it joins, or close it with **Done**.
**Add another computer** makes the next invite.

## The welcome mail

With **Send to** or **Send by email**, the server mails the link. The mail
says who invited the person and to which server, for example "Sam invited
you to Acme IT", and has:

- The server's logo at the top, in the server's accent colour. The logo shows
  when **Settings**, **Branding** has an image logo that is a PNG, JPEG or GIF
  and the mail can load it over HTTPS. Otherwise the mail shows the server's
  name.
- One button, **Set up NeoDesk**, in the accent colour.
- Three steps: download and open NeoDesk, click Install, done.
- The link written out for when the button doesn't work, until when it works,
  and the code for a NeoDesk that is installed already.

The mail has a plain text part with the same content, and the link is the only
thing in it that opens anything. It is written in the language the console
shows to the person who sends it.

## What the person sees

The link opens a page that says who invited the person and offers the download
for their system: an installer for Windows, a disk image for Mac, and a command
to paste on Linux. On Windows and Mac the page shows the mail's three steps
above the download. **Other systems** lists the downloads for the other
systems. The page also shows the code with the server address. On a
phone it asks them to open the link on the computer instead. The page works
without JavaScript too: the browser then gets the steps, the download for its
system, the other systems and the code.

On Windows the page says what Windows asks before the setup installs. For the
installer (`.exe`), the prompt names Windows Command Processor, by Microsoft
Windows, and the page says that this is the NeoDesk setup installing itself.
For the MSI, the prompt names NeoDesk, and the page asks the person to check
the publisher it names. On a Mac the page adds the Mac's own steps: drag
NeoDesk into Applications, open it, come back and click **Open NeoDesk**, and
allow Screen Recording and Accessibility.

The downloads are the official NeoDesk client releases. Your server fetches
them from GitHub, checks their signature, and serves them itself. When it has
no release yet, the page says there is no download right now.

On Linux the command installs the client's package with the system's package
manager (apt-get, dnf, zypper or yum) and then joins the computer to your
server. The NeoDesk client installs next to a stock RustDesk and leaves it in
place: it runs as its own service, `neodesk.service`, and its program is
`/usr/bin/neodesk`. The command installs the build your server offers even
when the package manager counts it as a downgrade, for example after a release
candidate, and installs it again when the same version is there already.

If the computer has not shown up after the install, have the person open
**Settings**, **Server**, **Join a server** in NeoDesk and type the code.

## Set up the computer as it joins

While the invite's sheet is open, it checks every few seconds whether a
computer joined. When one does, the sheet turns into "Anna's laptop joined"
with four short steps:

1. **Name**: the name it shows in Devices and in the viewer.
2. **Folder**: who can see and reach the computer follows its folder.
3. **How you reach it**: the two ways to connect. Without a password, the
   person at the computer sees who wants to connect and clicks Accept. With its
   password, someone at the computer sets a permanent password in NeoDesk,
   under Settings, Security, and you type it when you connect.
4. **Test session**: **Start test session** opens a session to the computer,
   and NeoDesk there asks the person to accept. While the computer is offline,
   the step says so and offers no button.

**Next** saves the step, **Back** goes one step back, and **Skip** keeps the
computer as it joined. Changing the name and the folder needs the
**Edit devices** permission; without it the sheet shows them and says that your
role can't change them. An invite for several computers keeps its link in the
sheet after the first one, and walks through each computer that joins.

## Open invites

**Open invites** at the bottom of the sheet lists the invites that still work,
with how many uses are left and until when. **Revoke** ends an invite at once.
An invite ends by itself when its time is up or its last use is taken.

A computer that joins with an invite is approved in every
[join mode](/docs/console/enrollment#enrollment-modes) and gets its device
token at once.

On the command line, `neodesk invites list` lists the open invites, and
`neodesk invites show <id>` shows one invite with the computers that joined
with it, with their name, folder and when they joined, also once the invite is
used up. See [invites](/docs/command-line/reference/invites).

## A computer that joins again

The ID of a computer is no secret, so the server checks who joins under an ID
it knows already. A NeoDesk client from 1.5.0 on proves with the computer's key
that it is that computer, and joins again as before. A new computer, which the
server doesn't know yet, joins with any client version.

An older client can't prove it. When it opens an invite under an ID the server
knows, the server refuses the join and the client shows:

```text
This computer's ID is already enrolled on this server. Update NeoDesk on this computer and open the invite again, or ask your administrator to delete the device in the console.
```

Update NeoDesk on the computer and open the invite again, or delete the device
for good (see below). The refused join uses up nothing of the invite. It shows
under **Activity**, **Audit log** as "Join refused: no proof of the computer's
key", with the device and the address. A computer that keeps trying gets one
entry a minute, which counts the refusals since the last one.

## A reinstalled or reset computer

After NeoDesk is installed again or the computer is reset, the computer can come
back with the same ID and a new key. The server knows the device with its old
key and refuses the join. The client shows the server's answer:

```text
This computer's ID is already enrolled with another key. Ask your administrator to approve the new key or to delete the device in the console.
```

Until its new key is approved, the device shows offline, also after the server
restarts, and the server stores none of the system information it sends.

A new invite doesn't help, and the refused attempt uses up nothing of the
invite. When the invite's sheet is still open, it says "This computer was here
before with another key." and offers **Approve new key**. The device's panel
shows a **New key** notice on its **Overview** tab, with the computer's name,
its address, the time and the fingerprint of the new key. Then either:

- Click **Approve new key**, in the sheet or on the device's panel. The console
  asks first: the new key becomes the device's key, and its old device tokens
  and sessions end. Click **Approve new key** in the question to go on. Then
  open the invite on the computer again; it joins with the same invite. This
  needs the **Approve join requests** permission.
- Or delete the device with **Permanently delete (release ID)** (see
  [Deleted devices](/docs/console/devices#deleted-devices)). The computer then
  joins as a new device. A delete without that option keeps the ID reserved,
  and the server refuses the computer.

A computer with a new key that comes back without an invite, for example set
up by hand, shows as offline, and its **Overview** tab says that the server
doesn't accept its new key. Send it an invite and approve the new key, or
delete the device for good.

On the command line, `neodesk invites show <id>` names the last computer the
invite turned away, and `neodesk invites approve-key <device-id>` approves its
new key.
