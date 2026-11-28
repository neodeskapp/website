---
title: The receiver app
description: Put the NeoDesk app on the computers you support, so people can get help, write to you and open tickets, and install it silently with an MSI.
order: 6.5
related: /docs/console/quick-support, /docs/console/chat, /docs/console/add-a-computer
icon: install_desktop
---

The receiver app is the NeoDesk app on the computer you support. It is made
for the person who sits there, not for the people who help: it has no
settings, no ID or password and can't connect to other computers. Its window
has three areas:

- **Get help**: the person enters the code or link you gave them, and a
  support session starts.
- **Messages**: the chat with your team.
- **My tickets**: the person reports a problem with **Something isn't
  working** and reads your answers.

The company name, logo and accent colour come from your server's branding.
[Using the NeoDesk app](/docs/console/receiver-app/using-the-app) describes
the app for the person at the computer; you can send them that page.

The same app runs in two ways:

- **Without installing**, for [quick support](/docs/console/quick-support):
  one session from a link, and nothing stays on the computer.
- **Installed**, as a Windows service with an icon in the notification area.
  It joins your server by itself, shows up under **Devices** and keeps
  Messages and My tickets open between sessions.

This page covers the installed app. It exists for Windows only; macOS and
Linux don't have it yet.

## Deploy it

Open **Devices**, then **Add computers**, tab **Receiver app**. The tab needs
the permission **Manage joining**.

![The Receiver app tab with a rollout token filled in, the MSI properties on the right and the silent install command at the bottom](shot:receiver-app)

### The token

The token admits the computers to your server in every
[join mode](/docs/console/enrollment#enrollment-modes), without a stop under
**Join requests**. The tab shows the command and the download once a token is
filled in.

Click **Create rollout token** for a token that many computers join with:

![The Create token dialog with For many computers chosen, a name, Computers allowed and Expires after](shot:receiver-rollout-token)

| Field | What it does |
|---|---|
| Name | Shown in the list of tokens, so you know what the token was for. |
| Computers allowed | How many computers can join with this token in total, 1 to 100,000. 100 at first. |
| Expires after | 24 hours, 7 days, 30 days (the default), 90 days or 1 year. After that no more computers join with it; the ones that joined keep working. |
| Folder | The folder every computer that joins with the token goes into. |
| Policies | The organization whose policies these computers get. |

Click **Create token**, and the tab fills the token in. It is shown only this
once. Each computer gets its own access when it joins, so the rollout token
is never the computer's credential. On **Device tokens** the token's row shows
how many computers joined and how many places are left, for example
"12 joined, 88 left". **Revoke** there stops new joins and leaves the
computers that joined alone; you can also raise the limit there.

A token from **Device tokens** made **For one computer** works too, for just
that one computer.

**Folder** on the Receiver app tab is used only when the token has no folder
of its own.

### The download

**Download installer** gives a zip with `neodesk-support.msi` and
`install.cmd`. The MSI is the NeoDesk Support Agent release your server
imported on the **Support agents** tab; without one, the tab says so and
links there. Under **Processor** you pick x64 or ARM64 when the release has
both.

To install on one computer, run `install.cmd` as administrator. It runs the
MSI with the properties of your server and stops when it doesn't have
administrator rights.

## Install it silently

The MSI takes your server's values as properties. **MSI properties** on the
tab shows each one with a copy button, and **Silent install** shows the whole
command.

| Property | What goes in | Needed |
|---|---|---|
| `SERVER` | The ID server, host name and optional port | Yes, for a silent install |
| `KEY` | The server's public key | Yes, for a silent install |
| `API` | The API address. Without it the app uses `https://` and the host of `SERVER`. | No |
| `TOKEN` | A rollout token or a token for one computer | On **Managed** and **Locked** servers |
| `GROUP` | A folder, by id or name. The token's own folder wins. | No |

Run the command where `neodesk-support.msi` is, for example as the install
command of a Win32 app in Intune, in a script of your RMM tool, or in a
computer startup script set by group policy:

```powershell
msiexec /i neodesk-support.msi /qn SERVER=<id-server> KEY=<server-key> API=<api-address> TOKEN=<rollout-token> GROUP=<folder-id>
```

Put in the values from the tab: `SERVER` for `<id-server>`, `KEY` for
`<server-key>`, `API` for `<api-address>`, your token for `<rollout-token>`
and the folder's id for `<folder-id>`. Or copy the whole command from
**Silent install**. Leave out `GROUP` when the token has a folder. Put a value in double quotes
only when it holds a space or a quote, and double a quote inside it.

`TOKEN` is a hidden property: the MSI keeps it out of its log. A value that a
signed configuration of the app already fixes wins over a property; the
NeoDesk Support Agent release has none, so for its MSI the properties are
the only server settings.

## What happens on the computer

The MSI installs the app to `C:\Program Files\NeoDesk Support Agent\` and
writes the properties into `neodesk-install.txt` in that folder. The app
reads the file only when it is in its own folder under Program Files and only
administrators and the system can change it.

When the service starts for the first time, the app joins your server with
the token and shows up under **Devices**, in the token's folder and
organization. Once the server has answered, the app removes the token from
the file. An icon in the notification area opens the app for each person who
signs in.

Installing the MSI again without properties keeps the existing settings, so
an upgrade doesn't need them.

An installed receiver counts as a device, also for a tenant's device limit.

## Unattended access

The installed app follows **Session approval** in the policies of the
computer's organization, under **Rules**, **Policies**, group **Connection**.
It checks them every five minutes.

| Session approval | Who gets in |
|---|---|
| **Unattended: connect without asking** | An operator with the computer's permanent password, or anyone the person allows. |
| **Always ask** | Only someone the person at the computer allows. |
| **Attended: the person at the device must accept**, or not set | The device's own access policy decides. Without one, only someone the person at the computer allows. |

The app has no settings of its own for this. A support session from **Get
help** always starts with the person clicking **Allow**.

## Removing the app

A person with administrator rights removes the app in Windows under
**Settings**, **Apps**, **Installed apps**. That stops and deletes the
service and removes the files, including `neodesk-install.txt`. From a
deployment tool, run as administrator where the MSI is:

```powershell
msiexec /x neodesk-support.msi /qn
```

To keep people from removing it, turn off **People can remove the app** in
the policies of the computers' organization, under **Rules**, **Policies**,
group **Security**. The app then hides its entry from **Installed apps** and
from Programs and Features and takes its uninstall shortcut out of the Start
menu. When the switch is on or not set, removing is allowed. An administrator
can still remove the app with `msiexec /x`.

## The offer after quick support

At the end of a [quick support](/docs/console/quick-support) session, after
the feedback, the app asks "Keep Fernhill IT support on this computer?" with
your company's name, and **Install** or **No thanks**.

![The quick support window asking Keep Fernhill IT support on this computer? with Install and No thanks](shot:receiver-offer)

**Install** asks Windows for administrator rights, installs the app and
joins the computer to your server. It needs no token: the session carries a
one-time admission that is valid for 24 hours, for this one computer, also
on a **Managed** or **Locked** server. The computer lands in no folder.

The app doesn't ask on a computer that has NeoDesk already, and asks only on
Windows. Turn the offer off under **Settings**, **Quick support**, with
**Offer to install after quick support**. It is on by default and applies to
sessions that start after the change.

## Where you answer

- **Messages** in the app is the computer's conversation under **Support**,
  **Chat**. See [Chat](/docs/console/chat).
- A ticket from the app shows under **Support**, **Tickets**. The picker next
  to the priority, set to **From computers**, lists only these tickets.

![The tickets list filtered to From computers, with two tickets opened by people at their computers](shot:tickets-from-computers)

Such a ticket says who opened it, for example "Opened by Anna Weber at the
computer 900100001", with a link to the computer. The server adds what it
knows about the computer as `computer-info.json`. Your public answers and
status changes reach the app at once while it is online and show the person
a notification; internal notes stay in the console. The bell in the top bar
tells you about new tickets and replies from computers.
