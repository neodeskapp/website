---
title: Quick support
description: Help someone on a computer that is not set up, with a link that works once for one hour and needs no install.
order: 6
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

Send the **Session link** with **Copy**, the QR code, or **Send by email** when
email is set up under **Settings**, **Email**. As for invites, the link uses
the console's public address and warns when that is plain HTTP; see
[Add a computer](/docs/console/add-a-computer#send-the-link).

## Follow the session

The dialog shows where things stand:

- Waiting for the person to open the link, and when the link expires.
- The app is open on their computer and waits for them to click **Allow**.
- The computer allowed access. **Connect** opens the session in
  [the browser](/docs/console/remote-in-browser); **Open in the desktop app**
  opens it in the NeoDesk client. You don't need a password: the app hands
  it to the server for you.
- They declined, the session ended, or the link expired. **Make a new link**
  starts again.

**Cancel the link** ends an unused link. **End session** ends a running one.
You can close the dialog at any time: the session stays open, and
**Your quick support sessions** on the **Help requests** page lists it with
**Open** to come back to it.

## What the person sees

The link opens a page that says who wants to help and offers
**Download NeoDesk Quick Support** for their system, with the steps: open
the file, check that it names you, and click **Allow**. When they are done,
they click **Stop** at the top of their screen or close the app. The app
comes from the same signed client releases as
[Add a computer](/docs/console/add-a-computer#what-the-person-sees).
