---
title: Linux login screen
description: Reach a Linux computer before anyone has signed in, on a Wayland or an X11 login screen, and what happens at sign-in, lock and sign-out.
order: 2
icon: login
---

With the NeoDesk package installed, a Linux computer can be reached from the
moment it has booted: the login screen shows, and you can type the password
for the person you help. This works on login screens that run on X11 and,
since client version 1.5.0, on login screens that run on Wayland, which is
the default on Ubuntu, Fedora and many other distributions.

You need the installed package, the `.deb` or `.rpm` from the
[download page](/download/). The portable `.tar.gz` has no background service,
so it can't show the login screen; its start screen says so.

## How it works {#how-it-works}

On X11, the NeoDesk service reads the login screen from the X server, as it
always did. On Wayland there is no X server, and the desktop's screen sharing
needs someone at the computer to agree, which nobody can do before signing
in. So at a Wayland login screen the NeoDesk service reads the picture
directly from the graphics driver (DRM/KMS) and types through a virtual
keyboard and mouse.

This happens at the login screen only. Once someone has signed in, NeoDesk
uses the desktop's screen sharing like before, with its prompt on the
computer. The password, the click to accept and the server's permissions
apply at the login screen exactly as in a session.

## What happens, step by step {#step-by-step}

Tested on GNOME (Ubuntu 24.04 and Fedora 45) for Wayland, and on GNOME with
an X11 login screen. On KDE, the login screen and signing in were tested.

| Step | Wayland login screen | X11 login screen |
|------|----------------------|------------------|
| Connect before anyone signed in | The login screen shows; mouse and keyboard work, also with two monitors side by side and with a scaled display (200 %) | The login screen shows; mouse and keyboard work |
| The screen was asleep | It wakes when you connect | Not tested |
| Type the password and sign in | The connection stays open. The computer then asks for screen sharing: on GNOME **Remote Desktop** with **Share**, on KDE **Remote Control Requested** with **Allow**. Someone at the computer has to accept it; until then you see "Please select the screen to be shared". On GNOME, also turn on **Allow Remote Interaction**, or your mouse and keyboard do nothing | The desktop shows right away |
| Lock the screen | The picture stops at the last frame and doesn't come back after unlocking. Close the tab and connect again; the computer asks for screen sharing again | The lock screen shows |
| Sign out | You're back at the login screen without doing anything | You're back at the login screen after a moment |
| Restart the computer | **Restart remote device** in the toolbar doesn't work at a Wayland login screen; restart from inside a session. After the restart NeoDesk connects to the login screen again by itself | Not tested |
| Someone signs in at the computer while you're connected to the login screen | The stream to the login screen ends; the new session asks for screen sharing like any other | Not tested |

If nobody can be at the computer after sign-in, use an X11 login screen and
session for the whole visit: see [Use X11 instead](#x11-fallback).

## Tested setups {#tested}

Tested with NeoDesk client 1.5.0 on virtual machines with a virtual graphics
card (virtio-gpu, no 3D acceleration). Real graphics cards haven't been
tested yet.

| Distribution | Desktop | Login screen | Login screen reachable |
|--------------|---------|--------------|------------------------|
| Ubuntu 24.04 | GNOME 46 | GDM 46 on Wayland | Yes |
| Fedora 45 | GNOME 51 | GDM 51 on Wayland | Yes |
| Fedora 45 | KDE Plasma 6.8 | SDDM 0.21 on Wayland | Yes |
| Ubuntu 24.04 | GNOME 46 | GDM 46 on X11 | Yes |

The packages also install and run on Debian 12, openSUSE Leap 15.6 and
openSUSE Tumbleweed; their login screens weren't tested.

## Known limits {#limits}

- On a computer without 3D graphics, such as a virtual machine without 3D
  acceleration, the picture of the login screen is converted in software:
  one to two CPU cores stay busy while you're connected to the login screen.
  Inside a session this doesn't happen.
- **Restart remote device** doesn't work at a Wayland login screen.
- After locking a Wayland session the picture stops, see above.

## Use X11 instead {#x11-fallback}

An X11 login screen and an X11 session give access without a prompt after
sign-in. With GDM, set this in the `[daemon]` section of
`/etc/gdm3/custom.conf` (Ubuntu), `/etc/gdm3/daemon.conf` (Debian) or
`/etc/gdm/custom.conf` (Fedora), then restart the computer:

```ini
[daemon]
WaylandEnable=false
```

The desktop also needs an X11 session to sign in to. Ubuntu 24.04 has one;
Fedora 45's GNOME has none, so there this doesn't help.

## Turn it off {#turn-off}

To keep NeoDesk away from a Wayland login screen, run:

```bash
sudo neodesk --option allow-drm-login-screen N
```

A server strategy can set the same option. Connections to the login screen
are then refused, as before version 1.5.0, and the start screen says that
access to the login screen is turned off. Set it back with `Y`. Sessions
aren't affected either way.
