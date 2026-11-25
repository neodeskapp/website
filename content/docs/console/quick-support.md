---
title: Quick support
description: Help someone on a computer that is not set up, with a link that works once for one hour and needs no install.
order: 6
icon: support_agent
---

Quick support lets you help a person whose computer is not on your server. You
send them a link; they download a small support app, open it and click
**Allow**. You connect without an ID or a password, and the session ends when
they close the app. Nothing gets installed.

You need the **Connect to devices** permission.

## Make a session link

Click **Quick support** in the top bar, or on the **Help requests** page.

![The top bar with the Quick support button marked](shot:quick-support-start)

The console makes the link at once. It works once, for one hour.

![The Quick support dialog with the session link and the QR code, waiting for the person](shot:quick-support)

The link comes first: send it with **Copy**, or with **Send by email** when
email is set up under **Settings**, **Email**. The QR code with its caption
sits beside it, for a phone. As for invites, the link uses
the console's public address and warns when that is plain HTTP; see
[Add a computer](/docs/console/add-a-computer#send-the-link).

## Follow the session

The dialog shows where things stand:

- Waiting for the person to open the link, and when the link expires.
- The app is open on their computer and waits for them to click **Allow**.
- The computer allowed access. **Connect** opens the session in
  [the browser](/docs/console/remote-in-browser); **Open in the desktop app**
  offers NeoDesk and RustDesk and opens it in the one you pick (see
  [Links that open the app](/docs/getting-started/connect-a-client#links-that-open-the-app)).
  You don't need a password: the app hands it to the server for you.
- They declined, the session ended, or the link expired. **Make a new link**
  starts again.

**Cancel the link**, next to the line that says the link is waiting, ends an
unused link. **End session** ends a running one.
You can close the dialog at any time: the session stays open, and
**Your quick support sessions** on the **Help requests** page lists it with
**Open** to come back to it.

## What a session gives you

A quick support session gives you the person's screen, mouse and keyboard.
That is what the app asks them to allow. The server turns every other
permission of the session off, among them the clipboard, file transfer and
printing, sound, the camera, the terminal, tunnels, restarting the computer,
recording, blocking their input and privacy mode. It refuses a file transfer,
tunnel, RDP, terminal or camera session to their computer with "The person did
not allow this in their quick support session".

Copying text and copying files are separate permissions. The person can allow
each of them on its own, and the server then turns the clipboard, or file
transfer and printing, on for that session. The support app of the current
client release asks only for the screen, mouse and keyboard, so both stay off.
The choices for them come with the next client release.

## What the person sees

The link opens a page that says who wants to help and offers
**Download NeoDesk Quick Support** for their system, with the steps: open
the file, check that it names you, and click **Allow**. When they are done,
they click **Stop** at the top of their screen or close the app. The app
comes from the same signed client releases as
[Add a computer](/docs/console/add-a-computer#what-the-person-sees).
