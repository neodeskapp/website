---
title: NeoDesk and Windows Remote Desktop compared
description: Remote Desktop is built into Windows Pro. How it differs from NeoDesk in internet access, editions, sessions and clients, and how to use both.
order: 6
og: comparison
product: Windows Remote Desktop
logo: windows.svg
---

Windows Remote Desktop is part of Windows: a Windows PC or server runs the
Remote Desktop host, and Microsoft's clients connect to it over RDP. NeoDesk
is a server you run yourself, open source under the AGPL-3.0, that the
RustDesk client and NeoDesk's own client connect to. NeoDesk can also open RDP
hosts in the browser, so you can use both. Every fact about Windows Remote
Desktop on this page comes from Microsoft's own pages, read on 25 November
2026 and listed under [Sources](#sources).

## Who each one suits

**Windows Remote Desktop** suits you when the computers run Windows Pro,
Enterprise or Windows Server and sit on a network you can already reach, for
example through a VPN, when you work on a remote Windows desktop with your own
drives, printers and monitors, or when many people share a Windows Server
through Remote Desktop Services.

**NeoDesk** suits you when computers sit behind routers you don't control,
run Windows Home, macOS or Linux, or when you help the person who sits at the
screen. It also suits you when you want one console for every device, with
accounts, roles and an audit log.

## The facts side by side

| | NeoDesk | Windows Remote Desktop |
|---|---|---|
| What it is | A server you run, and the RustDesk client or NeoDesk's client on each computer | Part of Windows: the Remote Desktop host on the PC, and Microsoft's clients that connect to it |
| How a connection is made | Clients connect out to your server's ID server and relay | Peer to peer: the client needs direct access to the PC. Over the internet that means port forwarding, a VPN, or RD Gateway, a Windows Server role |
| Computers it reaches | Devices with the RustDesk client, NeoDesk's client on Windows, macOS and Linux, the MeshAgent, and RDP and VNC hosts | Windows Pro, Enterprise and Education, and Windows Server. Home editions can't be Remote Desktop hosts |
| Clients | The RustDesk client, NeoDesk's client and the console's browser viewer. Phones control through the RustDesk app | Windows App for Windows, macOS, iOS and iPadOS, Android and ChromeOS, and Meta Quest, plus Remote Desktop Connection on Windows. Windows App in the browser can't connect to a remote PC. No Microsoft client for Linux |
| Sessions at a time | No limit set by a license | Windows 10 and 11: one user at a time. Windows Server: two administrative connections; more need the RD Session Host role and RDS CALs |
| Help for the person at the screen | You see and control the screen they see; a quick support link works without an install | Shadowing works on RD Session Host servers, and the console session can't be shadowed. For this Microsoft has Quick Assist, where the helper needs a Microsoft account |
| Sign-in | Accounts in the console, with two-factor sign-in, LDAP and Active Directory, and OIDC | Windows accounts, with Network Level Authentication recommended. Microsoft Entra ID sign-in to Entra-joined and hybrid-joined PCs, with Conditional Access when your organization uses it |
| Files, sound and devices | File transfer, the clipboard and sound, which access rules turn on or off per user and device | Local drives, audio and the clipboard on every platform. Printers on Windows and macOS. USB devices from Windows only. Multiple monitors on Windows, macOS and ChromeOS |
| Audit | The console's audit log and the server's events, for every device in one place | On each PC: sign-ins in the Security log as event 4624 with logon type 10, and the TerminalServices logs in Event Viewer |

## What Windows Remote Desktop does better

- **Already in Windows.** On Windows Pro, Enterprise and Windows Server you
  turn Remote Desktop on and connect, with no client to roll out and no server
  to run, as long as you can reach the PC.
- **A full Windows desktop with your devices.** Microsoft's clients pass your
  local drives, audio and clipboard into the session, and from Windows also
  printers and USB devices. NeoDesk copies files and the clipboard and plays
  sound, but doesn't map your drives or USB devices into the remote computer.
- **Many users on one server.** With Remote Desktop Services, a Windows Server
  hosts sessions for many people at once, licensed with RDS CALs per user or
  per device. NeoDesk connects to computers; it doesn't host desktops.
- **Sign-in to the PC with Microsoft Entra ID.** Entra-joined and hybrid-joined
  PCs take Entra sign-in for RDP, under your Conditional Access rules. NeoDesk
  signs people in to its console and the RustDesk client with
  [OIDC](/docs/people/oidc), which Entra ID can provide.

## What NeoDesk does differently

- **No open ports on the PCs.** The clients connect out to your server, so a
  computer behind a home router or a mobile connection is reachable without
  port forwarding or a VPN to it. Microsoft says opening a PC's RDP port to the
  internet "isn't recommended".
- **More than Windows Pro.** The RustDesk client and NeoDesk's client run on
  Windows Home, macOS and Linux too.
- **The same screen as the person there.** A NeoDesk session shows the screen
  the person at the computer sees, which is what help desk work needs. For one-off help,
  a [quick support](/docs/console/quick-support) link works once for an hour
  and installs nothing.
- **One console for every device.** The [device list](/docs/console/devices),
  [users and roles](/docs/people/users-and-roles) and the
  [audit log](/docs/console/activity) cover all computers, instead of a log on
  each PC.
- **RDP hosts as well.** [RDP and VNC targets](/docs/console/remote-targets)
  open in the browser viewer through your server, which fills in a saved
  password itself so it never reaches the browser. The server needs guacd for
  this, and these sessions have no sound, file transfer or choice of screens.

## License and cost

Remote Desktop comes with Windows; you need an edition that can be a host,
such as Windows Pro. Windows 10 and 11 let one user use the computer at a
time. A Windows Server allows two remote administrative connections without
extra licenses. For more connections, or for people who work on the server,
you install the RD Session Host role and buy a Remote Desktop Services client
access license (RDS CAL) for each user or each device; there is a grace period
of 120 days before a license server is needed. This page quotes no prices.

NeoDesk costs nothing. You may use, change and run it, for commercial work
too. If you change it and offer it as a network service, you share your
changes with the people who use it. There is no paid version. Help is free on the
[NeoDesk Discord](https://discord.gg/nwERSawufr) and in the
[discussions on GitHub](https://github.com/neodeskapp/neodesk/discussions);
paid support and help with a setup are available on request at
[support@neode.sk](mailto:support@neode.sk). See
[Price and support](/docs/project/license#price-and-support).

## Move from Windows Remote Desktop to NeoDesk

You can keep RDP and reach it through NeoDesk:

1. Install the server with [Docker](/docs/getting-started/docker), on
   [Linux](/docs/getting-started/linux) or on [Windows](/docs/getting-started/windows),
   and put the console behind [TLS](/docs/operations/reverse-proxy-tls).
2. Set up guacd and add each Windows PC as an
   [RDP target](/docs/console/remote-targets). The server reaches the PC on
   your network, and people open it in the browser.
3. Where you want the screen the person there sees, or the PC isn't on the
   server's network, roll out a client.
   [Set up many computers at once](/docs/getting-started/connect-a-client/many-computers)
   covers an invite link that installs NeoDesk's client on many computers, and
   a Windows script that sets up the stock RustDesk client.
4. For access when nobody is at a computer, set a permanent password on it;
   see [Unattended access](/docs/console/unattended-access).
5. Once nothing connects to port 3389 from outside, remove the port
   forwarding to it on your router.

Windows and Remote Desktop are trademarks of Microsoft. NeoDesk is not
affiliated with Microsoft.

## Sources

Every page below was read on 25 November 2026.

- [learn.microsoft.com, allow access to your PC](https://learn.microsoft.com/en-us/windows-server/remote/remote-desktop-services/remotepc/remote-desktop-allow-access):
  the editions that can be hosts, Home editions only as clients, who may
  connect, and Network Level Authentication.
- [learn.microsoft.com, supported configuration](https://learn.microsoft.com/en-us/windows-server/remote/remote-desktop-services/remotepc/remote-desktop-supported-config):
  the Windows versions that can be connected to.
- [learn.microsoft.com, access your PC from outside your network](https://learn.microsoft.com/en-us/windows-server/remote/remote-desktop-services/remotepc/remote-desktop-allow-outside-access):
  the peer-to-peer connection, port 3389, port forwarding or a VPN, and why
  opening the PC to the internet isn't recommended.
- [learn.microsoft.com, Remote Desktop Gateway role](https://learn.microsoft.com/en-us/windows-server/remote/remote-desktop-services/remote-desktop-gateway-role):
  RD Gateway as a Windows Server role for access over the internet.
- [learn.microsoft.com, Remote Desktop disconnected errors](https://learn.microsoft.com/en-us/troubleshoot/windows-server/remote/troubleshoot-remote-desktop-disconnected-errors):
  two administrative connections without RDS CALs, the RD Session Host role
  for more, and the TerminalServices logs.
- [learn.microsoft.com, RDS client access licenses](https://learn.microsoft.com/en-us/windows-server/remote/remote-desktop-services/rds-client-access-license):
  RDS CALs per user and per device, and the 120-day grace period.
- [microsoft.com, Windows license terms](https://www.microsoft.com/licensing/terms/en-US/product/WindowsDesktopOperatingSystem/all):
  one user at a time.
- [learn.microsoft.com, Windows Enterprise multi-session FAQ](https://learn.microsoft.com/en-us/azure/virtual-desktop/windows-multisession-faq):
  several sessions at once as a Windows Server ability outside Azure Virtual
  Desktop.
- [learn.microsoft.com, shadow](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/shadow):
  shadowing on RD Session Host servers, and that the console session can't be
  shadowed.
- [learn.microsoft.com, Windows App overview](https://learn.microsoft.com/en-us/windows-app/overview):
  the platforms, which of them connect to remote PCs, and that the browser
  version doesn't.
- [learn.microsoft.com, Windows App features by platform](https://learn.microsoft.com/en-us/windows-app/compare-platforms-features):
  monitors, audio, drives, printers, USB devices and the clipboard per
  platform for remote PCs.
- [learn.microsoft.com, mstsc](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/mstsc):
  Remote Desktop Connection on Windows.
- [learn.microsoft.com, connect to a Microsoft Entra joined PC](https://learn.microsoft.com/en-us/windows/client-management/client-tools/connect-to-remote-aadj-pc):
  Entra sign-in to Entra-joined and hybrid-joined PCs, and Conditional Access.
- [learn.microsoft.com, Quick Assist](https://learn.microsoft.com/en-us/windows/client-management/client-tools/quick-assist):
  what Quick Assist does and that the helper needs a Microsoft account.
- [learn.microsoft.com, event 4624](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4624):
  logon type 10 for Remote Desktop sign-ins.
