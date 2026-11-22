---
title: First sign-in
description: Sign in as admin, secure the account, set the address clients use, and find your way around the console.
order: 5
---

After the install, sign in to the web console as `admin`. This page covers the
first things to do there: change the password, turn on two-factor sign-in and
check the address that RustDesk clients get.

## Open the console

The address depends on how you installed BetterDesk:

| Install | Console address |
|---------|-----------------|
| Docker | `http://<server>:5000` |
| Linux script | `https://<server>:5443`. `http://<server>:5000` redirects there. |
| Windows script | `https://<server>:5443`, on the **Web console** line the script printed. `http://<server>:5000` redirects there. |

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
warns you a minute before it signs you out for inactivity. An account has one
session at a time: signing in from another browser ends the first session.
[Configuration](/docs/operations/configuration) explains how to change these
limits.

## Change the admin password

1. Open **Settings**, then **Sign-in**. The account menu at the bottom of the
   sidebar has a shortcut to the same place: **Change password**.
2. Under **Password**, fill in **Current password**, **New password** and
   **New password again**. The new password needs at least 8 characters.
3. Choose **Change password**.

Use the new password the next time you sign in. On Docker, the credentials
command no longer prints the first password after this: the server deletes it,
and the command says so and how to set a new password.

![The Sign-in settings with the Password and Two-factor sign-in sections](shot:settings-auth)

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

The sidebar has five sections. Each shows the pages used most, and the rest sit
under **More** in that section. This is what the admin sees; other accounts see
the pages their role allows, see [Users and roles](/docs/people/users-and-roles).

| Section | Pages shown at first | Under More |
|---------|----------------------|------------|
| Devices | Overview, All devices, Enrollment requests, Remote desktop in browser | Pair agent, Inventory, Network monitoring, Fleet tasks, Platform support, IoT devices (CDAP) |
| Support | Help requests, Tickets, Chat, Network tools | |
| People | Users | Organizations, Roles and permissions |
| Activity | Security and audit, Reports | App usage, Billable sessions |
| Settings | General, Client setup, Server status | The other settings, grouped as Console, Clients and enrollment, Rules, Server, Billing and Developer tools |

To jump to a page, a device or a person, press Ctrl+K or `/` and type part of
the name. **Quick support** in the top bar makes a link for one support session,
see [Quick support](/docs/console/quick-support).

## Next steps

- [Add a computer](/docs/console/add-a-computer) with the BetterDesk client, or
  [connect a RustDesk client](/docs/getting-started/connect-a-client)
- [The Overview page](/docs/console/overview) and [the device list](/docs/console/devices)
- [Enrollment](/docs/console/enrollment), if new devices should wait for approval
- [Users and roles](/docs/people/users-and-roles), to give other people their own accounts
