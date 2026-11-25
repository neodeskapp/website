---
title: The device list
description: Find, filter, sort and organize devices, act on several at once, and add RDP or VNC computers.
order: 2
---

Open **Devices**, then **All devices** to see every device your account may see. Folders and groups sit on the left, the search and the filters above the table. A click anywhere on a row opens the device in a side panel, described in [Device details and connecting](/docs/console/device-details).

![The device list with folders and groups on the left](shot:devices)

The heading says how many devices there are and how many of them are online. Status changes arrive live, and the whole list loads again every 60 seconds while the tab is visible.

To get a client onto a new computer, click **Add a computer** above the list: it makes an invite link that installs the client and joins the computer to this server. See [Add a computer](/docs/console/add-a-computer).

## Searching

Type into **Search by ID, name, user or tag**. The search looks through the ID, the display name, the hostname, the user, the platform, the type, the tags, the note and the IP address. Every word you type has to appear somewhere, in any order. Case doesn't matter.

You can also find a device from the top bar. **Search pages, devices and people** (Ctrl K) lists matching devices, and choosing one opens the device list filtered to that device, with its panel open.

## Status filters

The buttons next to the search narrow the list by status:

| Filter | Shows |
|---|---|
| **All** | Every device |
| **Online** | Devices that are online now |
| **Offline** | Devices that are offline and not banned |
| **Mesh agents** | Devices that connect through a MeshAgent |
| **Banned** | Banned devices |

The **Tags** menu narrows the list further: tick one or more tags to show only the devices that have all of them. The button then shows which tags are on.

When a filter is on, a line above the table says how many devices it shows, for example "Showing 4 of 30".

## Columns and sorting

| Column | Shows |
|---|---|
| **ID** | The device's ID, with a button to copy it |
| **Hostname** | The display name if one is set, otherwise the hostname the device reported |
| **Type** | The kind of client, for example **RustDesk**, **Mobile** or **Mesh agent** |
| **Platform** | The operating system and its version, as the device reported them |
| **Last seen** | When the device last contacted the server, or **Never** |
| **Status** | **Online**, **Offline**, **Banned**, **No signal**, **Deleted**, or **Disabled** for an RDP/VNC target that is switched off |
| **Tags** | The device's tags |

**No signal** means the client contacted the server's API recently but is not registered on the signal server. The hint on the status says to restart the client after moving to a new server.

**Columns** hides or shows **Type**, **Platform**, **Last seen**, **Status** and **Tags**. **ID** and **Hostname** always stay. This browser remembers your choice. On narrow screens some columns fold away by themselves.

To sort, click a column heading; click it again to reverse the order. **ID**, **Hostname**, **Type**, **Platform** and **Last seen** can be sorted. The list starts sorted by **Last seen**, newest first.

## Folders

Folders are on the left. **All devices** shows everything, **Unassigned** shows devices without a folder, and each folder shows its devices. The number next to each entry is how many devices it holds. Folders and groups work as one filter: picking a group shows devices from every folder, and picking a folder shows devices from every group.

A device is in one folder at a time. To move devices:

- Drag a row onto a folder with the mouse. Drop it on **Unassigned** to take it out of its folder.
- Choose **Move to folder** in the row menu, or for several devices in the bar above the table.
- Pick the folder when you edit the device or approve it.

**New folder** asks for a name of up to 50 characters and a colour. Accounts that may change users also get **Allowed users** and **Allowed user groups**: who may see the folder. Leave both empty to keep the folder visible to everyone who may see devices.

Each folder has a menu (the three dots, or a right-click) with **Edit** and **Delete**. Deleting a folder doesn't delete its devices; they become unassigned.

## Groups

Groups are a second way to organize devices, listed below the folders. A group is a set of devices you can filter the list by, apply access rules to, and limit to some people. **New group** asks for:

- **Group name**.
- **Dynamic group from tag**: when ticked, every device with the tag in **Tag filter** joins the group by itself. When not ticked, you add devices yourself.
- **Who can see it**: **Allowed users** and **Allowed user groups**, as for folders, for accounts that may change users.

To put a device into a group by hand, drag its row onto the group, or use **Manage groups** in the row menu. A device can be in only one group you fill by hand. Dropping it on another group moves it there, and ticking two groups in **Manage groups** fails with "A device can belong to only one group". Dynamic groups don't take dropped devices: change the device's tags instead.

The group menu has **Edit** and **Delete**, and **Commercialization** for accounts that manage billing, to give the group a support package.

## Tags

A tag is a short word on a device, up to 50 characters. Add or remove tags when you edit a device, in the **Tags & notes** tab of its panel, or with **Manage tags** in the row menu. Removing a tag there takes it off that device only.

To rename or delete a tag on every device you can see, open the **Tags** menu above the table and choose **Manage tags**. Dynamic groups that use the tag are updated with a rename; after a delete they stay empty until you change them.

## Selecting several devices

Accounts that may edit, delete or share devices get a checkbox on each row and one in the header to select all. When devices are selected, a bar above the table shows how many and offers:

- **Tags**: ticked tags go on every selected device, cleared ones come off, half-ticked ones stay as they are.
- **Move to folder**: puts all of them into one folder.
- **Guest access link**: a time-limited link to the web viewer for these devices, for someone without a console account. See [Device details and connecting](/docs/console/device-details#guest-access-links).
- **Delete**: deletes them after one confirmation. They can be restored, see [Deleted devices](#deleted-devices).
- **Clear selection**.

The bulk actions skip deleted devices and RDP/VNC targets in the selection.

## The row menu

Each row has a menu at its end (the three dots); a right-click on the row opens it too. It holds only what your account may do with that device:

- **Web remote**, **Guest access link**, **CDAP snapshot viewer** and **Connect via desktop client**. What each one does and needs is in [Device details and connecting](/docs/console/device-details#connecting).
- **Details** opens the panel, **Edit** opens it ready to edit.
- **Manage tags**, **Manage groups** and **Move to folder**.
- **Change ID** gives the device a new ID of 6 to 16 letters, digits, dashes and underscores on the server. The server sends the new ID to the device when it is online at that moment, and the NeoDesk client takes it on. A NeoDesk client that is offline then, and a stock RustDesk client, keep their old ID until you set the new one in the client by hand. Where you can, change the ID in the client on the device instead. For a device that is online the console warns first.
- **Issue a new token** ends the device's current device token. The device gets a new one the next time it checks in, by proving its key with a signature that carries the time. A device whose clock is more than 5 minutes off the server's gets no new token. Stock RustDesk clients don't use device tokens.
- **Ban** or **Unban**, and **Delete**, described below.

A device that connects through a MeshAgent also gets the MeshAgent tools while it is online, such as **Terminal**, **File browser** and the power commands. See [MeshAgent devices](/docs/console/meshagent).

## Banned devices

**Ban** asks for an optional reason, which shows in the device's panel and in the audit log. The device is disconnected and can't connect to this server until you unban it. The RustDesk client on the device only says that the server is not reachable. Banned devices stay in the list with the status **Banned**; the **Banned** filter shows only them. **Unban** lets the device connect again.

## Deleted devices

**Delete** opens a dialog whose **Delete** button unlocks after three seconds. Every delete disconnects the device. By default the device is hidden and its ID stays reserved: the server refuses a registration under that ID until you restore the device or delete it for good. Two options change this:

- **Permanently delete (release ID)** removes the device record and frees the ID, so the client can register again. Everything the server kept for the ID goes with it: its key and key requests, stored device passwords and saved sign-in, grants, groups, folders, access rules and settings. A new install under the same ID inherits none of it. The audit log and the connection history stay.
- **Revoke device** also blocks the device ID, so the device can't connect again under it. The block is stored and stays after a restart, also together with **Permanently delete (release ID)**.

Tick **Show deleted** to see hidden devices. They show greyed out with **Deleted** next to the name, and their menu offers **Restore** and **Permanently delete device**. This browser remembers whether **Show deleted** is on.

## Add RDP/VNC target

**Add RDP/VNC target** adds a computer that has no RustDesk or NeoDesk client, such as a Windows PC with Remote Desktop turned on or a Linux machine with a VNC server. People then connect to it in the browser, through this server. The target shows in the list like any other device, and **Connect** opens it in the browser.

The server reaches these computers through guacd, the Apache Guacamole daemon, which is not part of the server and has to be set up first. The form, the setup and what a session can do are described in [RDP and VNC targets](/docs/console/remote-targets).

## Access rules

**Access rules** is folded under the list. A rule turns RustDesk client features such as file transfer, clipboard and sound on or off for chosen users and devices. Clients that match a rule get its settings from the server.

## What your role allows

Everyone who may see devices can search, filter and open the list. The rest depends on the role. These are the defaults; an administrator can change them, see [Users and roles](/docs/people/users-and-roles).

| Action | Roles |
|---|---|
| Edit, tags, folders, groups, **Move to folder**, **Issue a new token** | Super admin, Global admin, Remote operator |
| **Guest access link** | Super admin, Global admin, Remote operator |
| **Ban**, **Delete**, **Change ID** | Super admin, Global admin |
| **Add a computer** | Super admin, Global admin |
| **Add RDP/VNC target** | Super admin, Global admin |
