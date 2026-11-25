---
title: Unattended access and Wake-on-LAN
description: Reach a device when nobody is at it, with a permanent password in the NeoDesk client or in RustDesk, and wake a sleeping computer from the server.
order: 10
seoTitle: Unattended access with RustDesk and NeoDesk - NeoDesk docs
related: /docs/console/add-a-computer, /docs/console/device-details
---

Unattended access means connecting to a device when nobody is there to accept the connection. It works with a permanent password that is set on the device itself, in the NeoDesk client or in stock RustDesk. This page covers where to set that password, how the console helps you share it, and how to wake a computer that is asleep.

## Set the permanent password

The console can't set the password or how the device accepts a session. An invite from [Add a computer](/docs/console/add-a-computer) sets the NeoDesk client's server, key and device token, not its password. Strategies, the settings the server pushes to desktop clients, carry only session permissions such as file transfer and the clipboard. Set the password on the device, in one of the ways below.

### In the NeoDesk client

The client has to be installed: NeoDesk that isn't installed takes connections only while its window is open. The download of an invite installs it on Windows and Linux.

1. In NeoDesk, open **Settings**, then **Security**. On an installed client the page is locked at first: click **Unlock** and confirm with administrator rights, or with your PIN when one is set.
2. In the **Password** section, pick how a session gets accepted. **Accept sessions via both**, the default, takes the password or a click on **Allow** at the computer. **Accept sessions via password** takes only the password. **Accept sessions via click** takes no password at all, so someone has to be at the computer.
3. Pick which password works: **Use permanent password**, or **Use both passwords**, the default, which keeps the one-time password as well.
4. Click **Set permanent password** and type the password twice. It needs at least 8 characters, with a digit, an upper-case and a lower-case letter.

The client doesn't show the permanent password again.

An administrator can also set the password on the command line of an installed client, for example from a deployment tool. On Windows, in PowerShell as Administrator, with the client in its default folder and the password in place of `<permanent-password>`:

```powershell
Start-Process -FilePath "$env:ProgramFiles\NeoDesk Client\neodesk.exe" -ArgumentList @('--password', '<permanent-password>') -Wait -NoNewWindow
```

On Linux, again with the password in place of `<permanent-password>`:

```bash
sudo neodesk --password '<permanent-password>'
```

The same program sets the other two choices with `--option`: `--option approve-mode password` is **Accept sessions via password**, and `--option verification-method use-permanent-password` is **Use permanent password**.

The console's **Windows install script (Intune)** doesn't reach the NeoDesk client: it runs `rustdesk.exe` from the RustDesk folder, for stock RustDesk.

### In stock RustDesk

Set the password in RustDesk on the device, or set it during the rollout with the Windows install script. On **Overview**, under **Client setup**, open **More** and choose **Windows install script (Intune)**. The script ends with two lines that are commented out:

```powershell quoted
# Optional unattended password:
# Start-Process -FilePath $RustDesk -ArgumentList @('--password', 'YourPermanentPassword') -Wait -NoNewWindow
```

Remove the `#` at the start of the second line and put the password in place of `YourPermanentPassword`. Every computer the script runs on then gets that password. Anyone who can read the script can read the password, so keep it where only administrators see it. [Set up many computers at once](/docs/getting-started/connect-a-client/many-computers) explains the rest of the script.

## Share the password with your team

People who sign in to the RustDesk client with their account can get a device's password from the server, so they don't have to type it. Add the device as a contact to an organization's shared address book and choose **Set password** on the contact. The password must match the one set on the device. [The shared address book](/docs/people/organizations#the-shared-address-book) explains who receives it.

**Connect** in the console's browser viewer uses that password too, for members of the organization, also when the device isn't assigned to it. The server answers the device's password question itself, so the browser never gets the password. If the device refuses it, the viewer says so and asks for the password, once. The console, the command line and MCP don't show the stored password: its `devices connect-password` command says only whether one is stored. The server keeps these passwords encrypted with the key file described in [Saved sign-in](/docs/console/saved-sign-in#where-the-details-are-kept).

## Sign in at the lock screen

The device password gets you to the computer's screen, which may be a locked Windows desktop. [Saved sign-in](/docs/console/saved-sign-in) keeps a Windows account's name and password for a device, and the browser viewer signs in with them at the lock screen.

The console has no access schedule or list of allowed operators per device: whether a connection needs the password or someone at the device to accept it is decided by the client on the device, NeoDesk or RustDesk. An access policy that was saved for a device stays stored, but nothing checks it when someone connects.

## Wake-on-LAN

The server can send a Wake-on-LAN packet to a computer in its own network. The packet leaves from the server, so it only reaches computers in the server's network.

1. Open **Support**, then **Network tools**. It is under **More** in the sidebar.
2. On the **Network** tab, open **Wake-on-LAN**.
3. Enter the computer's **MAC address**, for example `AA:BB:CC:DD:EE:FF`.
4. Leave **Broadcast address** empty to send the packet to `255.255.255.255`, or enter the IPv4 broadcast address of the computer's network, such as `192.168.1.255`.
5. Click **Send wake-up packet**.

The server sends the packet to UDP port 9 of the broadcast address, and the console says where it went. The tool needs the permission **Connect to devices**, which Super admin, Global admin and Remote operator accounts have by default.

A device that connects through a MeshAgent has **Wake** in its **Actions** tab. While the agent is offline, the server sends the packet itself when it knows the device's MAC address. **Wake** needs the permission **Power actions on MeshCentral agents**.
