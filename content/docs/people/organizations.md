---
title: Organizations
description: Group people and devices per customer or site, share an address book with the members, and know what membership changes and what it does not.
order: 6
---

An organization groups people and devices that belong together, for example one customer or one site. It has members, assigned devices, a shared address book for the RustDesk client and some stored settings.

![The Organizations page with three organizations and their user and device counts](shot:organizations)

## What membership does and does not do

Being a member of an organization does not change what a person sees or may do in the console. That comes from their [role and device access](/docs/people/users-and-roles) alone: the **Organizations** page lists every organization to everyone who may open it, and the device list does not filter by organization.

What membership does give is the organization's shared address book. Members who sign in to the RustDesk client find its contacts in their address book (see [the shared address book](#the-shared-address-book)). Members have no role inside the organization.

## Who can manage organizations

The page is under **People**, **Organizations** for roles with **Create organizations**, **Edit organizations** or **Manage organization users**: Super admin, Administrator and Global admin by default.

| Action | Permission |
| --- | --- |
| See organizations, their devices, settings and address book | View users |
| See the members | View users and Manage organization users |
| Create an organization | Create organizations |
| Change name, slug, logo and address book | Edit organizations |
| Add and remove members, create and revoke invitations | Manage organization users |
| Assign and remove devices | Manage organization devices |
| Delete an organization | Delete organizations |

## Create an organization

1. Open **People**, then **Organizations**, and click **Create organization**.
2. Enter a **Name**.
3. Enter a **Slug**: a unique short name of 3 to 64 lower-case letters, digits and hyphens, such as `example-clinic`.
4. Optionally enter a **Logo URL**, the web address of an image.
5. Click **Create organization**.

The list shows each organization's name and slug, its number of users and devices, and when it was made. Click a row to open the organization. Its page has the tabs **Users**, **Devices**, **Address book** and **Settings**, and a **Details** column with the slug, the date, the logo address and the ID.

## Add people

Open the organization, go to the **Users** tab and click **Add user**. The dialog has two tabs:

- **New account**: a **Username** and a **Password** of at least 8 characters. This makes a [client sign-in](#client-sign-ins) that exists only in this organization.
- **Existing server user**: pick a console account under **Select user**. The person keeps signing in with their own account.

You can also add a console account from the **Users** page: choose **Organizations…** in its row menu, pick the **Organization** and click **Add to organization**. The same sheet lists where the person is a member and takes them out with **Remove**. The **Organizations** column of the Users page shows where each person is a member.

**Remove from organization** in a member's row menu deletes an account that was made only for this organization. A server account stays and only leaves the organization.

## Client sign-ins

An account made in the organization, with **New account** or by an [invitation](#invitations), has the tag **Client sign-in** in the member list. It is a sign-in for the BetterDesk client: the person signs in there to the organization, by its slug, with that username and password, and the client shows the organization's shared address book. It cannot sign in to the console or to the standard RustDesk client, and it is not on the Users page.

Besides the shared address book, a client sign-in can read only the organization's name, slug and logo. It cannot read the members, invitations, assigned devices, settings or policies.

### Invitations

With an invitation, the person chooses the username and password themselves:

1. On the **Users** tab, under **Invitations**, click **Create invitation**.
2. Optionally enter the person's **Email**, and set **Valid for (hours)**: 1 to 720, 72 by default.
3. Click **Create invitation** and copy the **Invitation link**. It is shown only now and works once.
4. Send the link to the person. BetterDesk sends no email itself.

The link opens a page of the console where the person enters a **Username** of 3 to 64 letters, digits and `.`, `_`, `@` or `-`, a **Password** of at least 8 characters and **Password again**, and clicks **Create sign-in**. The page then tells them to sign in to the organization in the BetterDesk client. A username the organization already has is refused with "This organization already has that username. Choose another one."

The list under **Invitations** shows each invitation's email, when it expires and when it was used. **Revoke** cancels an invitation that was not used.

## Assign devices

On the **Devices** tab, click **Assign device** and enter the **Device ID** shown in the RustDesk client on that device. **Department** and **Building** are optional notes. **Remove from organization** in a device's row menu takes it out again; the device stays on the server.

The tab also lists the device groups and user groups linked to the organization. **Create device group** makes a device group linked to it, for accounts with **Edit devices**. You manage that group's devices and who may use it on the [Devices](/docs/console/devices) page, where a linked user group can be allowed on it.

## The shared address book

On the **Address book** tab you keep the contacts that members get in the RustDesk client.

1. Tick **Share this address book with organization members**.
2. Click **Add contact** and enter a **Device ID**, an optional **Alias** and **Contact tags**, or click **Add organization devices** to add every assigned device at once.
3. Click **Save address book**.

Members who sign in to the RustDesk client get these contacts in their address book. Their personal entries stay private and win when both have the same device. Contacts for devices the person may not see are left out.

**Set password** on a contact stores the permanent password of that device, encrypted in the database, so members can connect without typing it. It must match the password set on the device. Anyone who can see the contact may receive that password when connecting, so set it only on contacts every member may use.

## Settings and deleting

The **Settings** tab lists under **All stored settings** every value saved for the organization, including policies set on the **Policies** page. The rules that devices follow when someone connects are set on that page, which **Open Policies** on this tab opens; what each person may do in a session is set with the [client features](/docs/people/permissions#client-features).

To delete an organization, click **Delete organization…** under **Delete** on the Settings tab, or **Delete** in its row menu on the list, and confirm. This deletes the client sign-ins, invitations, settings and shared address book of the organization and the stored device passwords. Server accounts stay, and the devices stay on the server without an organization. It cannot be undone.
