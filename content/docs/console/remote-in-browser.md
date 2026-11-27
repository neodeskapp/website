---
title: Remote desktop in the browser
description: Control a device from a browser tab through the server, what that needs, and where it differs from the RustDesk app.
order: 7
icon: desktop_windows
---

The console has its own remote desktop client, the web viewer. It runs inside the console in your browser and talks only to the server, so the computer you sit at needs nothing installed. This page covers how to open a session, what it needs and what it can do.

## Opening a session {alias=opening-the-viewer}

A session opens inside the console, in the main area of the page. The ways in:

- From a device: click **Connect** in the [device panel](/docs/console/device-details#connecting), or **Web remote** in the row menu of the device list. The device panel closes and the session opens in its place. A device that has a session open already goes back to it.
- From the sidebar: **Devices**, then **Remote sessions**. Under **Open sessions** the page lists the sessions open in this console, each with its state, a link back to it and a button to close it. Below that, type a device's ID into **Device ID** and click **Connect**, or find the device in the list, which has folders, groups, tags, a search, the filters **All**, **Online** and **Offline**, and a **List** or **Grid** view. The list refreshes every 30 seconds.
- From a quick support session: once the person has clicked **Allow**, **Connect** opens their computer in the viewer in a new browser tab, without a password. See [Quick support](/docs/console/quick-support).
- By address: `/remote/session/` followed by the device's ID opens its session in the console, so you can bookmark it. `/remote/` followed by the ID leads there too.

Some sessions open in the viewer in a browser tab of its own instead: RDP and VNC targets, guest links, and a device that connects another way than the sessions already open in the console, for example a MeshAgent device next to RustDesk sessions. In a tab of its own, the viewer shows its own sign-in page when your console session has ended, with the username, the password and, for accounts that use one, the authenticator code.

Someone without a console account can use the viewer through a [guest access link](/docs/console/device-details#guest-access-links).

### Working on other pages

Each device is a tab in the viewer's bar, and **New connection** adds another. When you open another page of the console, the sessions stay connected. A strip under the top bar lists them under **Open sessions**: click one to go back to it, or close it with its close button or a middle click. While a session is not on screen, it gets no keys, no mouse and no clipboard from this computer.

The viewer's bar also has:

- **Hide the sidebar** and **Show the sidebar**, which fold the console's sidebar away to give the screen more room. This browser remembers the choice.
- **Open in new tab**, which moves the session to a browser tab of its own: it connects again there and ends in the console.
- **Full screen**, or F11, where the console's own bars step aside too.

When you close the last session, the viewer goes back to the console. Signing out ends every session; the question before it says how many are open: "Your open remote sessions end too (2)." Closing the browser tab ends them as well.

## What it needs

### An account that may connect

Connecting needs permission to connect to devices, and for RDP/VNC targets permission to connect to those. By default Super admin, Global admin and Remote operator accounts have both. Other accounts get "Access denied". See [Users and roles](/docs/people/users-and-roles).

### A large enough screen

The viewer runs on desktop computers and tablets, and on a phone held sideways when the screen is at least 640 pixels wide. A phone held upright shows "The web viewer needs a larger screen", and adds "Or turn the phone sideways: in landscape the session opens here in the browser." when turning it would be enough. On a phone, **Remote sessions** also offers to open devices in the RustDesk app, and **Connect** in the console offers the choice. On a tablet and a phone held sideways, the viewer adds buttons to switch between **Touch** and **Touchpad** input and to bring up the **Keyboard**.

### Only the console's address

The browser connects to nothing but the console's own address and port. The console carries the session over two WebSocket paths, `/ws/rendezvous` and `/ws/relay`, to the signal and relay servers, which run in the same program. You don't open extra ports for the browser.

If a reverse proxy sits in front of the console, it has to pass WebSocket connections on those paths. See [Reverse proxy and TLS](/docs/operations/reverse-proxy-tls).

A session to a RustDesk device always goes through the relay server, never directly, so the device has to be able to reach the relay port. See [Ports](/docs/operations/ports).

### HTTPS for every device {alias=https-for-full-speed}

Over plain HTTP from another computer (not `localhost`), the browser plays only H.264 video. A RustDesk device, the NeoDesk client included, sends H.264 only when its computer has a hardware H.264 encoder. Every other device sends VP9, and the viewer can't show it over plain HTTP. Over HTTPS the browser decodes the video with WebCodecs, VP9 included, in hardware where it can, so every device shows.

When the console is opened over plain HTTP from another computer, the viewer says so in a bar: "Over plain HTTP this browser plays only H.264 video. Devices without an H.264 encoder can't be shown. Open the console over HTTPS to see every device." A session to a device without an H.264 encoder then ends with the device's name and "can't be shown over plain HTTP.", followed by "This device has no H.264 encoder, and over HTTP the browser plays only H.264. Open the console over HTTPS to see its screen." **How to set up HTTPS** next to it opens [Reverse proxy and TLS](/docs/operations/reverse-proxy-tls). A device with an H.264 encoder shows. Over plain HTTP, **Video codec** offers only **Auto (recommended)** and **H264**, and the viewer asks the device for at most 30 frames per second.

Over HTTP the clipboard works only in part, see [Copy and paste](#copy-and-paste), and browsing whole local folders in the file transfer needs Chrome or Edge over HTTPS. Give the console HTTPS before you use the viewer every day; see [Reverse proxy and TLS](/docs/operations/reverse-proxy-tls).

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

While the password form shows, the viewer already asks the device without a password. A computer where the person there accepts sessions by clicking shows its prompt at once, and once they accept, the session opens without a password.

When a computer that shares several Windows sessions asks which one to show, the viewer takes the one that is current on the computer, so the picture comes without a question. **Windows sessions** under **Actions** switches to another.

For a RustDesk device, the viewer stops before it sends a password if the connection to the device can't be secured. **Session info** shows whether a running session is end-to-end encrypted.

## During a session

**Controls**, or F8, shows the row of session controls, and **Keep open** keeps it there:

| Control | What it does |
|---|---|
| **Actions** | **Ctrl+Alt+Del**, **Lock screen**, **Restart remote device**, **Refresh screen**, **Paste clipboard**, **Reset keyboard**, **Windows key**, **Alt+Tab**, **Block input**, and **Windows sessions** when the device has several |
| **Type text** | Types text on the remote keyboard, for example a password. Ctrl+Enter sends it |
| **Display** | **Image quality** (**Best**, **Balanced**, **Performance**), **Frame rate** (30, 60 or **Adaptive**), **Scaling**, **Keyboard mode**, **Video codec**, and the options **Show remote cursor**, **Lock after session**, **Privacy mode** and **Disable clipboard** |
| **Displays** | For a device that sends several displays at once: the layout, the display you work on, a window of its own for a display, and virtual displays. See [Several displays](#several-displays) |
| **Monitors** | For other devices: picks the screen to show, and adds or removes virtual displays when the device supports them. A device with two to four screens gets one button per screen instead |
| **Chat** | Messages appear on the device's screen; replies show here. With **Answer support chat**, both go into the computer's conversation, see [Chat](/docs/console/chat#in-a-remote-session) |
| **File transfer** | Copies files between this computer and the device |
| **Session info** | The device, the connection, encryption, round trip time, frame rate, screen size and video format |
| Sound, **Record**, **View only** | Turn the sound on or off, record the session, or watch without sending input |
| **Disconnect** | Ends the session |

Files go both ways through **File transfer**; text and images go through the clipboard, see [Copy and paste](#copy-and-paste).

**Record** records the screen in the browser. When you stop, the recording downloads to this computer as a WebM file. In a MeshAgent session, **Record** instead turns recording on the server on or off, and the session reconnects.

Not every control works on every connection. **Type text** works in RustDesk and CDAP sessions and says it is not available in the others. What an RDP or VNC session can do is in [RDP and VNC targets](/docs/console/remote-targets#in-the-viewer). A view-only guest link has no **Actions**, **Type text**, **Chat** or **File transfer**.

**Image quality**, **Frame rate**, **Scaling**, **Keyboard mode**, **Video codec** and, on a Mac, **Send Cmd as Ctrl for common shortcuts** are remembered for your account in this browser and apply to the next session too.

## Copy and paste

Copy and paste work both ways, for text and images, with the usual keys and no button. On a Mac, Cmd works in place of Ctrl.

- From this computer to the remote one: press Ctrl+V in the remote screen. The viewer sends this computer's clipboard first, then the remote computer pastes it. This works in every browser, also over plain HTTP.
- From the remote computer to this one: copy there as usual. The copy reaches this computer's clipboard at once when the browser lets the page write it: Chrome and Edge while the viewer has the focus, Firefox within 5 seconds of a key press or click in the viewer. Otherwise it waits, and arrives with your next key press or click in the remote screen.

The session bar shows the clipboard's state, and a click on it does what the state needs:

| State | What a click does |
|---|---|
| **Clipboard on** | Turns the clipboard off, the same as **Disable clipboard** under **Display** |
| **Clipboard off** | Turns it on again. When the remote computer or this server turned it off for the session, or the session is view only, the bar only says so |
| **Allow clipboard** | In Chrome and Edge: asks the browser once to let the page read the clipboard. After that, what you copy here also reaches the remote computer as soon as you come back to the viewer |
| **Copy here** | Something was copied on the remote computer and waits: the click copies it to this computer |

Text up to 4 MB and images up to 8 MB go to the remote computer, and the remote computer can send up to 40 MB. The viewer says when a copy is larger and leaves it out.

Over plain HTTP the browser gives the page no clipboard access. Ctrl+V in the remote screen still sends text and images. Text copied on the remote computer reaches this computer with your next key press or click in the remote screen; images can't. The viewer says this once per browser.

**Paste clipboard** under **Actions** sends this computer's clipboard too. When the browser doesn't let the page read it, the viewer says to press Ctrl+V in the remote screen instead.

A copy made in Notepad on a Windows computer with the NeoDesk client has been seen to reach the viewer only with the next copy, one copy late.

## Several displays

A RustDesk device of version 1.2.4 or later, the NeoDesk client included, sends all its displays in one session. When such a device has more than one display, the controls row has **Displays** in place of **Monitors**. Older devices switch between their screens one at a time, as in the table above.

**Displays** has these parts:

- **Layout**: **One at a time** shows one display. **As arranged** shows every display where it sits on the device's desktop. **Grid** shows them side by side in a grid. As arranged and Grid need a window at least 900 pixels wide and a mouse, so narrower windows and touch tablets show one display at a time.
- **Show**, or **Work on** in the other two layouts: a small map of the displays as they sit on the device's desktop. Click a display to show it, or to pick the one you work on.
- The picked display, by its number: **Original size (1:1)** shows it pixel for pixel instead of fitting it into its space, in As arranged and Grid or when it has a window of its own. **Open in a window of its own** opens it in a new browser window; once it is open, the entry says **Go to its window**.
- **Windows**: **One display on each of my screens** puts one display on each screen of this computer and keeps one in this window. It shows when the browser knows of more than one screen, and the browser may ask first whether the site may place windows on them. Otherwise the entry is **Each display in a window of its own**, and you move the windows yourself. Firefox and Safari can't place windows on other screens; there the viewer says "This browser can't put windows on your other screens. Drag each display's window to the screen you want it on." **Bring the displays back** closes those windows and shows their displays here again.
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

On a Mac, Cmd with C, V, X, A, Z, S or F goes to a remote computer that isn't a Mac as Ctrl with the same key, so copy, paste, undo, save and find work as there. **Send Cmd as Ctrl for common shortcuts** under **Display**, next to **Keyboard mode**, turns this off. It shows only on a Mac and is on by default.

The browser keeps some shortcuts for itself. In full screen, Chrome and Edge pass them to the remote computer. Firefox and Safari can't, so in full screen the viewer says "This browser keeps some shortcuts for itself, also in full screen: Ctrl+W, Ctrl+T, Ctrl+N, the Windows key, and Esc leaves full screen. Actions sends the Windows key, Alt+Tab and Ctrl+Alt+Del to the remote computer." **Windows key**, **Alt+Tab** and **Ctrl+Alt+Del** under **Actions** work in every browser.

A touchpad scrolls the remote computer one notch for each step of a swipe, in Chrome, Edge and Firefox alike.

## Compared with the RustDesk app

The viewer covers daily remote support, with these differences:

- On a phone it runs only held sideways, at 640 pixels wide or more. Use the RustDesk app there otherwise.
- Over plain HTTP it shows only devices with an H.264 encoder, as described above.
- In **File transfer**, **Download folder** saves a folder from the device as one ZIP archive, of at most 4 GB and 65,535 files and folders. Browsing local folders needs Chrome or Edge over HTTPS; other browsers can still upload and download single files.
- Sessions to RustDesk devices always use the relay server, so they use the server's bandwidth.
- The console holds at most five of these WebSocket connections per client address at a time, and closes one that carries nothing for 120 seconds.
