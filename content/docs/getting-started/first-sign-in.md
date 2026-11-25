---
title: First sign-in
description: Sign in as admin, secure the account, set the address clients use, and find your way around the console.
order: 5
related: /docs/console/add-a-computer, /docs/getting-started/connect-a-client, /docs/people/two-factor
howto: open-the-console, sign-in, change-the-admin-password, turn-on-two-factor-sign-in, set-the-address-clients-use
icon: login
---

After the install, sign in to the web console as `admin`. This page covers the
first things to do there: change the password, turn on two-factor sign-in and
check the address that RustDesk clients get.

## Open the console

The address depends on how you installed NeoDesk:

| Install | Console address |
|---------|-----------------|
| Docker | `http://<server-address>:3375` |
| Linux script | `https://<server-address>:5443`. `http://<server-address>:3375` redirects there. |
| Windows script | `https://<server-address>:5443`, on the **Web console** line the script printed. `http://<server-address>:3375` redirects there. |

Linux and Windows installs made with 3.6.0-rc.4 or older keep port 5000 instead
of 3375.

The Linux and Windows scripts use a self-signed certificate for HTTPS, so the
browser warns about it the first time. That is expected for a new install. A
reverse proxy with a real certificate removes the warning, see
[Reverse proxy and TLS](/docs/operations/reverse-proxy-tls).

## Sign in

![The sign-in page with Username and Password](shot:login)

Type `admin` under **Username**, the password from the install under
**Password**, and choose **Sign in**. The password is where the install put it:

- Docker: [the credentials command](/docs/getting-started/docker#get-the-admin-password)
- Linux: [the box the script printed](/docs/getting-started/linux#admin-credentials)
- Windows: [the box the script printed](/docs/getting-started/windows#admin-credentials)

The console opens on **Overview**. By default a session ends after 30 minutes
without activity, and 24 hours after you signed in at the latest. The console
warns you a minute before it signs you out for inactivity. An account can be
signed in on up to 10 browsers at once; **Signed-in devices** in the account
menu lists them. [Your account](/docs/people/your-account) explains the list
and the setting **One session per account**, and
[Configuration](/docs/operations/configuration) explains how to change the
limits.

On a new install the overview starts with **Set up this server**, a checklist
of the first steps that ticks itself as you go. This page covers its first
three steps in detail; [The setup guide](/docs/getting-started/first-sign-in/setup-guide)
explains all eight.

## Change the admin password

1. Open the account menu, your initials at the end of the top bar, and choose
   **Your account**.
2. Under **Password**, fill in **Current password**, **New password** and
   **New password again**. The new password needs at least 8 characters.
3. Choose **Change password**.

Use the new password the next time you sign in. On Docker, the credentials
command no longer prints the first password after this: the server deletes it,
and the command says so and how to set a new password.

## Turn on two-factor sign-in

With two-factor sign-in, the console asks for a 6-digit code after the password.
The code comes from an authenticator app on your phone, such as Google
Authenticator, Microsoft Authenticator or Authy.

1. On the same page, under **Two-factor sign-in**, choose
   **Set up two-factor sign-in**.
2. Scan the QR code with the app. If you can't scan it, type the **Manual key**
   into the app instead.
3. Enter the 6-digit code the app shows and choose **Verify and turn on**.
4. The console shows recovery codes once. Store them somewhere safe, then choose
   **I have saved the codes**. Each recovery code works once and lets you sign
   in without the app.

From now on the sign-in page asks for the code after the password. It also
offers **Use a recovery code instead**. More in
[Two-factor sign-in](/docs/people/two-factor).

## Set the address clients use

The values a RustDesk client needs are on **Overview**, under **Client setup**.
The console works out the server's address by itself, for example from the
address you opened the console with. That is wrong when clients reach the
server under another name: when you opened the console as `localhost`, or when
a reverse proxy or a router stands in between.

To set the address for every client:

1. Open **Settings**, then **General**.
2. Under **Public client endpoints**, fill in **Public ID server**: the host name
   or IP address of the server as clients on the internet reach it.
3. Leave **Public relay server** empty to use the same address for the relay.
   Leave **Public API URL** empty to build it from the ID server's address, or
   enter the full address with `http://` or `https://`.
4. Choose **Save changes**, then **Save addresses**.

The side column, **What clients get now**, shows the result. The new addresses
apply right away to the client setup values, QR codes and install commands.
Devices that are already set up keep their old address until you set them up
again. While any of these fields has a value, the **Client server address**
field on **Overview** is locked.

## Find your way around

### The sidebar

The sidebar has seven sections. Each shows the pages used most, and the rest
sit under **Show N more** at the end of the section, where N is the number of
hidden pages; **Show fewer** folds them again. A section that hides only one
page shows it right away. Long page names wrap onto a second line. This is
what a super admin sees; other accounts see the pages their role allows, see
[Users and roles](/docs/people/users-and-roles).

| Section | Pages shown at first | Under Show N more |
|---------|----------------------|-------------------|
| Devices | Overview, All devices, Join requests, Add computers, Remote desktop in browser | Inventory, Network monitoring, Fleet tasks, IoT devices |
| Support | Help requests, Tickets, Chat, Network tools | |
| People | Users | Organizations, Roles and permissions |
| Activity | Audit log, Security checks, Reports | App usage, Billing |
| Rules | Policies, Alerts and automation | USB and drive access, Data loss prevention, Device identity |
| Server | Server status, Relay servers, Backups, Updates | Configuration files, Capacity test |
| Settings | General, Sign-in | Directory (LDAP), Single sign-on, Joining, Appearance, Branding, Email, Time, MeshCentral, Translations, and under Developer tools, Flow builder |

**Add computers** gathers every way a computer gets onto the server, as tabs:
**Invites and install links**, **Device tokens**, **Pairing codes**,
**Support agents** and **Manual setup**. Each tab shows only for accounts that
may use it; **Manual setup**, with the values a client needs, shows for
everyone. See [Add a computer](/docs/console/add-a-computer).

**Settings** holds only the settings of the server and the console. Your own
password, two-factor sign-in, signed-in devices and API tokens are on
[Your account](/docs/people/your-account).

### The top bar

From left to right:

- **The breadcrumb**: the section and the page you are on.
- **The search field**, see [Search](#search) below.
- **Quick support** makes a link for one support session, see
  [Quick support](/docs/console/quick-support). It shows for accounts that may
  connect to devices.
- **Chat** opens the chat panel over the page you are on, with the number of
  unread messages, see [Chat](/docs/console/chat). It shows for accounts with
  **Support chat** or **Team chat**.
- **Notifications** lists new help requests and devices that ask to join.
- **Help**, the book icon, opens a panel with **Show the setup guide** (for
  accounts that may see the guide), **Keyboard shortcuts**, **Platform
  support**, and the links **Documentation**, **Community on Discord** and
  **GitHub repository**. On a phone, Help is at the end of the sidebar.
- **The account menu**, your initials at the end. It has **My status** for the
  chat, **Your account**, **Signed-in devices**, **API tokens** (for accounts
  that may make them), **Theme** with **Console default**, **Light** and
  **Dark** for this browser, **Language**, **Accessibility** and **Sign out**.

There is no button to load a page again. Pages that change while you look at
them load again by themselves: the audit log, network monitoring, users,
organizations, device tokens and the billing sessions every 30 seconds while
they are on screen.

A right-click on the NeoDesk logo at the top of the sidebar opens the
[brand guide](https://neode.sk/brand) in a new tab. A logo of your own keeps the
browser's menu.

### Search

Press Ctrl+K (⌘K on a Mac) or `/`, or click the search field in the top bar,
and type. The search finds:

- **Pages**: any page in the sidebar, also by other words and former names.
- **Actions**: **Quick support**, **Add a computer**, **New device token**,
  **Add user**, **New API token**, **Chat settings for this server**,
  **Accessibility options**, **Switch to the dark theme** (or the light one)
  and **Sign out**. Each shows only for accounts that see its button in the
  console.
- **Settings**: every setting on the Settings tabs, on the Server pages and on
  Your account, with where it lives. Picking one opens its tab, scrolls to the
  setting and outlines it for a moment. Accounts see only the settings they
  may open.
- **Devices** and **People**, by name, ID or user name.

Every word you type has to match; case and accents don't matter. English and
German words find the same setting, whatever language the console is in. A
group with more hits than it shows says so, for example "8 of 23". Use the
arrow keys to move, Enter to open and Esc to close. With the field empty, the
search shows your recent searches in this browser, with
**Clear recent searches**.

### Where things moved

The console's pages were sorted into the sections above. The old addresses
lead to the new pages, so bookmarks and links in mails keep working.

| Before | Now |
|--------|-----|
| Settings, Backup | Server, Backups |
| Settings, Updates | Server, Updates; the backups made before updates are on Server, Backups |
| Settings, Advanced | Server, Configuration files |
| Settings, Server status | Server, Server status |
| Settings, Relay servers | Server, Relay servers |
| Settings, Sign-in: your password and two-factor sign-in | Your account |
| Settings, Sign-in: LDAP and OIDC | Settings, Directory (LDAP) and Settings, Single sign-on |
| Settings, General: device visibility and availability history | Settings, Joining |
| Settings, General: MeshCentral compatibility | Settings, MeshCentral |
| Settings, Appearance: name, logo, sign-in page, download page and remote viewer | Settings, Branding |
| Client app branding | Settings, Branding, Client app |
| Client setup, Device tokens, Pairing codes, Support agents, NeoDesk Agents | Devices, Add computers, one tab each |
| Enrollment requests | Devices, Join requests |
| Security and audit: Audit log and Server events | Activity, Audit log |
| Security and audit: Security checks and Hardening | Activity, Security checks |
| Security and audit: Your sessions | Your account, Signed-in devices |
| API tokens | Your account, API tokens |
| Commercialization and Billable sessions | Activity, Billing |
| Policies, Alerts and automation, USB and drive access, Data loss prevention, Device identity | Rules |
| Platform support | Help, in the top bar |
| Theme, language and accessibility buttons in the top bar | The account menu |

## Next steps

- [Add a computer](/docs/console/add-a-computer) with the NeoDesk client, or
  [connect a RustDesk client](/docs/getting-started/connect-a-client)
- [The Overview page](/docs/console/overview) and [the device list](/docs/console/devices)
- [Join requests](/docs/console/enrollment), if new devices should wait for approval
- [Users and roles](/docs/people/users-and-roles), to give other people their own accounts
