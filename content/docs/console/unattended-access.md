---
title: Unattended access and Wake-on-LAN
description: Reach a RustDesk device when nobody is at it, and wake a sleeping computer from the server.
order: 10
---

Unattended access means connecting to a device when nobody is there to accept the connection. With the RustDesk client this works with a permanent password that is set on the device itself. This page covers how the console helps you set that password and share it, and how to wake a computer that is asleep.

## Set the permanent password

Set the password in RustDesk on the device, or set it during the rollout with the Windows install script. On **Overview**, under **Client setup**, open **More** and choose **Windows install script (Intune)**. The script ends with two lines that are commented out:

```powershell
# Optional unattended password:
# Start-Process -FilePath $RustDesk -ArgumentList @('--password', 'YourPermanentPassword') -Wait -NoNewWindow
```

Remove the `#` at the start of the second line and put the password in place of `YourPermanentPassword`. Every computer the script runs on then gets that password. Anyone who can read the script can read the password, so keep it where only administrators see it. [Set up many computers at once](/docs/getting-started/connect-a-client/many-computers) explains the rest of the script.

## Share the password with your team

People who sign in to the RustDesk client with their account can get a device's password from the server, so they don't have to type it. Add the device as a contact to an organization's shared address book and choose **Set password** on the contact. The password must match the one set on the device. [The shared address book](/docs/people/organizations#the-shared-address-book) explains who receives it.

The console has no access schedule or list of allowed operators per device: whether a connection needs the password or someone at the device to accept is decided by RustDesk on the device. An access policy that was saved for a device stays stored, but nothing checks it when someone connects.

## Wake-on-LAN

The server can send a Wake-on-LAN packet to a computer in its own network. The packet leaves from the server, so it only reaches computers in the server's network.

1. Open **Support**, then **Network tools**. It is under **More** in the sidebar.
2. On the **Network** tab, open **Wake-on-LAN**.
3. Enter the computer's **MAC address**, for example `AA:BB:CC:DD:EE:FF`.
4. Leave **Broadcast address** empty to send the packet to `255.255.255.255`, or enter the IPv4 broadcast address of the computer's network, such as `192.168.1.255`.
5. Click **Send wake-up packet**.

The server sends the packet to UDP port 9 of the broadcast address, and the console says where it went. The tool needs the permission **Connect to devices**, which Super admin, Global admin and Remote operator accounts have by default.

A device that connects through a MeshAgent has **Wake** in its **Actions** tab. While the agent is offline, the server sends the packet itself when it knows the device's MAC address. **Wake** needs the permission **Power actions on MeshCentral agents**.
