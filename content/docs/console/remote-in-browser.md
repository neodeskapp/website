---
title: Remote desktop in the browser
description: Control a device from a browser tab through the server, what that needs, and where it differs from the RustDesk app.
order: 7
icon: desktop_windows
---

The console has its own remote desktop client, the web viewer. It runs in a browser tab and talks only to the server, so the computer you sit at needs nothing installed. This page covers how to open it, what it needs and what it can do.

## Opening the viewer

There are four ways in:

- From a device: click **Connect** in the [device panel](/docs/console/device-details#connecting), or **Web remote** in the row menu of the device list. The viewer opens in a new browser tab. If a viewer tab is already open, the device is added there as another tab.
- From the sidebar: **Devices**, then **Remote desktop in browser** opens the viewer's start page in a new tab. Type a device's ID into **Device ID** and click **Connect**, or find the device in the list below, which has folders, groups, tags, a search, the filters **All**, **Online** and **Offline**, and a **List** or **Grid** view. The list refreshes every 30 seconds. **Open console** takes you back to the console.
- From a quick support session: once the person has clicked **Allow**, **Connect** opens their computer in the viewer, without a password. See [Quick support](/docs/console/quick-support).
- By address: `/remote/` followed by the device's ID opens the viewer for that device directly, so you can bookmark it.

If your console session has ended, the viewer shows its own sign-in page first, with the username, the password and, for accounts that use one, the authenticator code.

Someone without a console account can use the viewer through a [guest access link](/docs/console/device-details#guest-access-links).

## What it needs

### An account that may connect

Connecting needs permission to connect to devices, and for RDP/VNC targets permission to connect to those. By default Super admin, Global admin and Remote operator accounts have both. Other accounts get "Access denied". See [Users and roles](/docs/people/users-and-roles).

### A large enough screen

The viewer runs on desktop computers and tablets. On a phone, a narrow screen without a mouse, the start page opens devices in the RustDesk app instead, and **Connect** in the console offers the choice. On a tablet the viewer adds buttons to switch between **Touch** and **Touchpad** input and to bring up the **Keyboard**.

### Only the console's address

The browser connects to nothing but the console's own address and port. The console carries the session over two WebSocket paths, `/ws/rendezvous` and `/ws/relay`, to the signal and relay servers, which run in the same program. You don't open extra ports for the browser.

If a reverse proxy sits in front of the console, it has to pass WebSocket connections on those paths. See [Reverse proxy and TLS](/docs/operations/reverse-proxy-tls).

A session to a RustDesk device always goes through the relay server, never directly, so the device has to be able to reach the relay port. See [Ports](/docs/operations/ports).

### HTTPS for every device {alias=https-for-full-speed}

Over plain HTTP from another computer (not `localhost`), the browser plays only H.264 video. A RustDesk device, the NeoDesk client included, sends H.264 only when its computer has a hardware H.264 encoder. Every other device sends VP9, and the viewer can't show it over plain HTTP. Over HTTPS the browser decodes the video with WebCodecs, VP9 included, in hardware where it can, so every device shows.

When the console is opened over plain HTTP from another computer, the viewer says so in a bar: "Over plain HTTP this browser plays only H.264 video. Devices without an H.264 encoder can't be shown. Open the console over HTTPS to see every device." A session to a device without an H.264 encoder then ends with the device's name and "can't be shown over plain HTTP.", followed by "This device has no H.264 encoder, and over HTTP the browser plays only H.264. Open the console over HTTPS to see its screen." **How to set up HTTPS** next to it opens [Reverse proxy and TLS](/docs/operations/reverse-proxy-tls). A device with an H.264 encoder shows. Over plain HTTP, **Video codec** offers only **Auto (recommended)** and **H264**, and the viewer asks the device for at most 30 frames per second.

Pasting the clipboard can also fail over HTTP, and browsing whole local folders in the file transfer needs Chrome or Edge over HTTPS. Give the console HTTPS before you use the viewer every day; see [Reverse proxy and TLS](/docs/operations/reverse-proxy-tls).

## How it connects

The server decides how to reach each device:

| Device | How the viewer connects |
|---|---|
| RustDesk client | The RustDesk protocol, through the relay server |
| Device with the agent connected over CDAP | Through the server, over CDAP, see [CDAP devices](/docs/console/cdap) |
| MeshAgent that is online | Through the server, over the MeshAgent, see [MeshAgent devices](/docs/console/meshagent) |
| RDP/VNC target | Through the server and the Guacamole daemon, see [RDP and VNC targets](/docs/console/remote-targets) |

While it connects, the viewer lists the steps in plain words: find the device on the server, connect through the relay server, wait for the device to answer, sign in if the device asks for a password, receive the screen. When a step takes long, a hint says what usually causes it. If the connection fails, the viewer says why and what to try, and **Details** has the technical facts to copy for an administrator.

When the device asks for a password, enter the one set in RustDesk on that device. Tick **Remember the password in this browser** to keep it, encrypted, in this browser; signing out of the console forgets it. If an organization stored a password for the device with **Set password** in its [shared address book](/docs/people/organizations#the-shared-address-book), the viewer fills that one in instead and doesn't keep it in the browser unless you tick the box. It does so only for members of that organization and for Super admin and Global admin accounts; anyone else types the password. A device with two-factor sign-in asks for the 6-digit code from its authenticator app as well.

For a RustDesk device, the viewer stops before it sends a password if the connection to the device can't be secured. **Session info** shows whether a running session is end-to-end encrypted.

## During a session

Each device opens as a tab in the viewer; **New connection** adds another. **Controls**, or F8, shows the row of session controls, and **Keep open** keeps it there:

| Control | What it does |
|---|---|
| **Actions** | **Ctrl+Alt+Del**, **Lock screen**, **Restart remote device**, **Refresh screen**, **Paste clipboard**, **Reset keyboard**, **Block input**, and **Windows sessions** when the device has several |
| **Type text** | Types text on the remote keyboard, for example a password. Ctrl+Enter sends it |
| **Display** | **Image quality** (**Best**, **Balanced**, **Performance**), **Frame rate** (30, 60 or **Adaptive**), **Scaling**, **Keyboard mode**, **Video codec**, and the options **Show remote cursor**, **Lock after session**, **Privacy mode** and **Disable clipboard** |
| **Displays** | For a device that sends several displays at once: the layout, the display you work on, a window of its own for a display, and virtual displays. See [Several displays](#several-displays) |
| **Monitors** | For other devices: picks the screen to show, and adds or removes virtual displays when the device supports them. A device with two to four screens gets one button per screen instead |
| **Chat** | Messages appear on the device's screen; replies show here |
| **File transfer** | Copies files between this computer and the device |
| **Session info** | The device, the connection, encryption, round trip time, frame rate, screen size and video format |
| Sound, **Record**, **View only** | Turn the sound on or off, record the session, or watch without sending input |
| **Disconnect** | Ends the session |

Text and pictures you copy on the device reach this computer's clipboard when the browser allows it; **Paste clipboard** sends this computer's clipboard to the device. The viewer never presses Ctrl+C on the device by itself. Files go both ways through **File transfer**.

**Record** records the screen in the browser. When you stop, the recording downloads to this computer as a WebM file. In a MeshAgent session, **Record** instead turns recording on the server on or off, and the session reconnects.

Not every control works on every connection. **Type text** works in RustDesk and CDAP sessions and says it is not available in the others. What an RDP or VNC session can do is in [RDP and VNC targets](/docs/console/remote-targets#in-the-viewer). A view-only guest link has no **Actions**, **Type text**, **Chat** or **File transfer**.

**Image quality**, **Frame rate**, **Scaling**, **Keyboard mode** and **Video codec** are remembered for your account in this browser and apply to the next session too.

## Several displays

A RustDesk device of version 1.2.4 or later, the NeoDesk client included, sends all its displays in one session. When such a device has more than one display, the controls row has **Displays** in place of **Monitors**. Older devices switch between their screens one at a time, as in the table above.

**Displays** has these parts:

- **Layout**: **One at a time** shows one display. **As arranged** shows every display where it sits on the device's desktop. **Grid** shows them side by side in a grid. As arranged and Grid need a window at least 900 pixels wide and a mouse, so narrower windows and touch tablets show one display at a time.
- **Show**, or **Work on** in the other two layouts: a small map of the displays as they sit on the device's desktop. Click a display to show it, or to pick the one you work on.
- The picked display, by its number: **Original size (1:1)** shows it pixel for pixel instead of fitting it into its space, in As arranged and Grid or when it has a window of its own. **Open in a window of its own** opens it in a new browser window; once it is open, the entry says **Go to its window**.
- **Windows**: **One display on each of my screens** puts one display on each screen of this computer and keeps one in this window. It shows when the browser knows of more than one screen, and the browser may ask first whether the site may place windows on them. Otherwise the entry is **Each display in a window of its own**, and you move the windows yourself. **Bring the displays back** closes those windows and shows their displays here again.
- **Displays you are not working on**: **Live**, **A new picture every few seconds** or **Paused**. The last two take less bandwidth and less of the browser's time.
- **Virtual displays**, when the device supports them.

A display in a window of its own still uses the viewer's one connection to the device, so closing the viewer's tab closes the window too. Keys you type in that window go to the device. If the browser blocks the new window, the viewer says "The browser blocked the new window. Allow pop-ups for this site, then try again."

On the remote screen, Ctrl+Alt+Shift with a number from 1 to 9 picks a display, Ctrl+Alt+Shift+L changes the layout, Ctrl+Alt+Shift+Z switches the zoom of the display you work on, and Ctrl+Alt+Shift+P opens it in a window of its own. The end of the **Displays** menu lists these too.

**Session info** shows the frame rate and bitrate of each display, and the video of all displays together. The viewer keeps the layout, the display shown, each display's zoom and the setting for the other displays per device and console account in this browser, for the 50 devices used last.

## Keyboard

What you type goes to the device. In a session with a RustDesk device, **Keyboard mode** under **Display** decides how:

| Mode | What the device gets |
|---|---|
| **Auto (Map, like RustDesk)** | The default. For a Windows device, letters, Shift, Ctrl, Alt, Enter, the arrows, the function keys and every key pressed together with a modifier go as key positions; digits and symbols typed alone go as characters. For other devices it works like Legacy |
| **Legacy (character)** | The character this computer's keyboard layout types. Enter, the arrows and the other special keys go as named keys |
| **Map (physical scancode)** | The position of every key. The device's own keyboard layout decides which character it becomes |

If characters come out wrong, for example because this computer and the device use different keyboard layouts, try another mode.

When a key seems stuck on a RustDesk device, for example everything comes out in capitals or as shortcuts, choose **Reset keyboard** under **Actions**. It releases every key the viewer still holds down, and Shift, Ctrl, Alt and the Windows key in any case. The viewer also releases the keys it holds when you switch to another window or browser tab.

## Compared with the RustDesk app

The viewer covers daily remote support, with these differences:

- It doesn't run on phones. Use the RustDesk app there.
- Over plain HTTP it shows only devices with an H.264 encoder, as described above.
- In **File transfer**, **Download folder** saves a folder from the device as one ZIP archive, of at most 4 GB and 65,535 files and folders. Browsing local folders needs Chrome or Edge over HTTPS; other browsers can still upload and download single files.
- Sessions to RustDesk devices always use the relay server, so they use the server's bandwidth.
- The console holds at most five of these WebSocket connections per client address at a time, and closes one that carries nothing for 120 seconds.
