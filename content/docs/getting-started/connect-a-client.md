---
title: Connect a RustDesk client
description: Point a RustDesk client at your server with the four values from the Overview page.
order: 6
seoTitle: Connect a RustDesk client to your NeoDesk server
related: /docs/console/add-a-computer, /docs/console/unattended-access, /docs/operations/troubleshooting
howto: install-the-rustdesk-client, get-the-four-values, enter-the-values-in-the-client
icon: link
---

A RustDesk client connects to your server once it knows four values: the ID
server, the relay server, the API server and the server's key. The console shows
all four on the Overview page. This page explains where they go in the client
and what happens after the client connects.

The NeoDesk client needs none of this typed in: an invite link from
**Add a computer** installs it and joins the computer, see
[Add a computer](/docs/console/add-a-computer). To install it without an
invite, take the file for your system from the [download page](/download/).

The NeoDesk client has no ID server built in. Until an invite, a pairing code
or its settings give it your server, it connects to no server, and it never
falls back to a public one. A stock RustDesk client with no ID server set uses
RustDesk's public server instead.

## Install the RustDesk client

NeoDesk works with the standard RustDesk client. Get it from RustDesk's
release page on GitHub; **Overview** links to it under **Download RustDesk**.
There are versions for computers and for phones.

## Get the four values

In the console, open **Devices**, then **Overview**. The side column,
**Client setup**, holds the values:

| Value | What it is |
|-------|------------|
| ID server | The host name or IP address clients register with |
| Relay server | The relay's address with its port, usually 21117 |
| API server | The full address of the API, with `http://` or `https://` and the port, 21121 |
| Key | The server's public key. **Show** reveals it. |

![The Overview page with the Client setup column marked](shot:client-setup)

Above the values, **Client server address** shows the address they are built
for. Check that it is an address your devices can reach. If it says `localhost`,
the console warns you, because no other computer or phone can reach that.

To see the values for another address, type it into **Client server address**
and choose **Show values**. This changes only what you see in this browser tab.
To set the address for every client, use **Public client endpoints** in the
settings, see [Set the address clients use](/docs/getting-started/first-sign-in#set-the-address-clients-use).

**Devices**, **Add computers**, tab **Manual setup** shows the same values
on a page of their own; **Server key and QR code** on **Overview** opens it. It
adds the **Config string**, which holds all four in one line (the same string
that **Copy deploy string** copies on **Overview**), the QR code for
phones under **Set up a phone**, and the key as the file `id_ed25519.pub` under
**Downloads**.

## Enter the values in the client

In the RustDesk client, open **Settings**, then **Network**. If it shows
**Unlock network settings**, choose that first. Then open **ID/Relay server**.
Copy each value with its **Copy** button and paste it into the field of the
same name: ID server, relay server, API server and key.

Fill in **API server** in a stock RustDesk client, here
`http://desk.example.com:21121`. Left empty, the client sends its API calls to
port 21114 on the ID server's host. A Docker install answers there and opens
the port; on Linux and Windows the installers keep 21114 closed to clients.
When the calls don't arrive, the device still connects, but the console never
gets its name, operating system or version, and signing in to the client and
its address book don't work. A
NeoDesk client set up by hand with **API server** left empty uses port 21121
on the ID server's host, `http://desk.example.com:21121` here. Fill the field
in there too when the API is at another address, such as a reverse proxy's.

**Copy all** copies the four values at once, one per line, to send to someone
who sets up the client:

```text
ID server: desk.example.com
Relay server: desk.example.com:21117
API server: http://desk.example.com:21121
Key: <the server's public key>
```

### Phones and tablets

**Show QR** shows the configuration as a QR code. Scan it with the RustDesk app
to fill in the server settings.

On phones and tablets with RustDesk 1.4.9 or later, the app first has to allow
server settings from links, with its setting `allow-deep-link-server-settings`.
If it doesn't, open **More** next to **Show QR**, choose **Copy deploy string**,
and import that string in the app under Network, Import server config.

### Many computers

For many computers, an invite from **Add a computer** can work several times.
For the stock RustDesk client, a script or a tool such as Intune can hand it the
config string from **More**, then **Copy deploy string**, or on Windows run the
script from **More**, then **Windows install script (Intune)**.
[Set up many computers at once](/docs/getting-started/connect-a-client/many-computers)
explains these.

## Pair with code

**Pair with code** is for NeoDesk's own client apps. The stock RustDesk client
has no field for a code, so use the four values above for it.

1. Choose **Pair with code**. **Server address** is filled in with the client
   address from **Overview**: a domain name or IP address, without a port.
2. Optionally give the code a **Label**, such as the name of the laptop.
3. Choose **Create code**.

The console shows a code of six characters. It is shown only once, works once,
and is valid for 10 minutes. On the device, type the server address and the
code. The client then gets the same values as a manual setup, and the join
mode applies to the device as to any other.

**Devices**, **Add computers**, tab **Pairing codes** lists the codes that
are still active and lets you revoke one. The
**Pair with code** button only shows for accounts that may approve new devices.

## Install from the package repository

::: note
Today only the `testing` suite has packages: the release candidates, 1.5.0-rc.7
at the moment. The `stable` suite stays empty until the client has a final
release, so the steps below, which use `stable`, find no `neodesk` package yet
on any of the three systems. Until then, install from `testing`: on Debian and
Ubuntu, write `testing` in place of `stable` in step 3; on Fedora and openSUSE,
use the commands under [Release candidates](#release-candidates). Or install
the client with an invite from [Add a computer](/docs/console/add-a-computer).
:::

The NeoDesk client for Linux also comes from a signed package repository at
pkg.neode.sk, for amd64 (x86_64) and arm64 (aarch64). Your system then updates
NeoDesk with its normal updates. The same packages are on the
[download page](/download/) as files. The repository key has the fingerprint
`D9D7 D06A FB85 0424 31C6 08AB 79E8 A31B 2625 AA7B` and is valid until
22 November 2029.

After the install, join the computer to your server with the code of an
invite: in NeoDesk, **Settings**, **Server**, **Join a server**.

### Debian and Ubuntu

1. Install curl:

   ```bash
   sudo apt install curl
   ```

2. Make the folder for the key, then download the key into it:

   ```bash
   sudo install -d -m 0755 /etc/apt/keyrings
   ```

   ```bash
   sudo curl -fsSLo /etc/apt/keyrings/neodesk.gpg https://pkg.neode.sk/neodesk.gpg
   ```

3. Add the repository:

   ```bash
   echo "deb [signed-by=/etc/apt/keyrings/neodesk.gpg] https://pkg.neode.sk/deb stable main" | sudo tee /etc/apt/sources.list.d/neodesk.list
   ```

4. Read the package lists, then install NeoDesk:

   ```bash
   sudo apt update
   ```

   ```bash
   sudo apt install neodesk
   ```

The key only applies to this repository (`signed-by`), not to your other
package sources.

### Fedora, RHEL, Rocky Linux and AlmaLinux

Add the repository:

```bash
sudo curl -fsSLo /etc/yum.repos.d/neodesk.repo https://pkg.neode.sk/rpm/neodesk.repo
```

Then install NeoDesk:

```bash
sudo dnf install neodesk
```

dnf asks once whether to import the NeoDesk key. Compare the fingerprint above
before you answer yes.

### openSUSE and SLES

Add the repository, read it, then install NeoDesk:

```bash
sudo zypper addrepo https://pkg.neode.sk/suse/neodesk.repo
```

```bash
sudo zypper refresh
```

```bash
sudo zypper install neodesk
```

zypper asks whether to trust the NeoDesk key. Compare the fingerprint above,
then choose to trust it always.

### Release candidates

The `testing` suite has release candidates as well as releases. You get
whichever is newer.

On Debian and Ubuntu, write `testing` instead of `stable` in the `echo` line
above.

On Fedora and the like, install from it once:

```bash
sudo dnf --enablerepo=neodesk-testing install neodesk
```

To keep it on, set `enabled=1` under `[neodesk-testing]` in
`/etc/yum.repos.d/neodesk.repo`.

On openSUSE, turn it on:

```bash
sudo zypper modifyrepo --enable neodesk-testing
```

### Remove

On Debian and Ubuntu, remove NeoDesk, then the repository and its key:

```bash
sudo apt remove neodesk
```

```bash
sudo rm /etc/apt/sources.list.d/neodesk.list /etc/apt/keyrings/neodesk.gpg
```

On Fedora and the like:

```bash
sudo dnf remove neodesk
```

```bash
sudo rm /etc/yum.repos.d/neodesk.repo
```

On openSUSE:

```bash
sudo zypper remove neodesk
```

```bash
sudo zypper removerepo neodesk neodesk-testing
```

## Links that open the app

A link can start a client app on the computer it is clicked on:

- `neodesk://` links open the NeoDesk client. It takes this scheme on Windows,
  macOS and Linux.
- `rustdesk://` links belong to stock RustDesk. On Windows the NeoDesk client
  takes them only on a computer without stock RustDesk, where no other program
  has them, and gives them back when it is removed. On Linux and macOS it never
  takes them.

The console opens a device in the NeoDesk client with a `neodesk://` link:
**Open in NeoDesk** in the device list, the **NeoDesk app** action on the
device's page, and **NeoDesk** under **Open in the desktop app** in
[Quick support](/docs/console/quick-support). **Open in RustDesk** and the
other RustDesk choices next to them use `rustdesk://` for stock RustDesk.
Phones have no NeoDesk app, so there the console offers the RustDesk app.

These links open the session on your side. Quick support needs NeoDesk only on
the computer you help, where the person runs NeoDesk Quick Support; you
connect from the browser or your desktop app.

## After the client connects

What happens next depends on the server's join mode:

- **Open**: the device joins right away and shows up under **Devices**, then
  **All devices**.
- **Managed**: the device waits under **Devices**, then **Join requests**.
  It can't connect until someone chooses **Approve** and gives it a name. The
  stock RustDesk client shows **Ready** while it waits. The request shows its
  name once the client has sent its system information to the API server;
  until then, compare the ID in the request with the one in the RustDesk
  window.
- **Locked**: only devices with a device token can join. Others are turned away.
  The stock RustDesk client has no way to send a device token, so a new
  RustDesk client can't join in this mode.

A new install starts in **Managed**, with Docker, on Linux and on Windows. A
computer that joins with an invite from **Add a computer** skips the wait in
every mode: it joins approved.
[Join requests](/docs/console/enrollment) explains the modes and how to
change them, and [Devices](/docs/console/devices) covers the device list.

## Sign in from the client

People with an account on the server can sign in to the client. The client
then gets their address book from the server. Members of an organization also
get the contacts it shares, see
[The shared address book](/docs/people/organizations#the-shared-address-book).

### Sign in through the browser

The sign-in dialog of the NeoDesk client starts with **Sign in with NeoDesk**.
The stock RustDesk client shows the same option as **Continue with NeoDesk**
under the password form.

1. Click **Sign in with NeoDesk**. The client opens the web console in the
   computer's browser and shows "Waiting for you to allow the sign-in in the
   browser".
2. If the browser isn't signed in to the console, sign in there first, the
   way you always do: password, two-factor code or
   [single sign-on](/docs/people/oidc). The console then comes back to the
   request.
3. The page **Sign in to the NeoDesk app** shows the computer that asks: its
   name, system, NeoDesk ID, IP address and when it asked. Check that it is
   the computer in front of you, then click **Allow**.
4. The page says "The app is signed in" and the client is signed in as you.
   You can close the tab.

Click **Allow** only for a sign-in you just started yourself. Someone who
sends you such a link wants their own computer signed in to your account;
click **Deny** then. **Deny** ends the request, and the client shows "Sign-in
was declined in the browser".

A request lasts five minutes and can be answered once. After that the page
says "This sign-in has ended" and the client asks you to start again. When the
account is disabled, or has to set up two-factor sign-in or choose a new
password first, the page says so and the client is not signed in.

The link in the browser points at the console's address: **Console address**
under **Settings**, **Single sign-on** when it is set, otherwise
`PANEL_PUBLIC_URL` or `PUBLIC_URL` (see
[Configuration](/docs/operations/configuration)). Without any of these, the
server uses the host name the client reached it at, with the console's port.
Behind a reverse proxy, set `PANEL_PUBLIC_URL` to the public address; the
installer does that when it sets up the proxy. When the server finds no
address at all, the client shows "The web console's address is not set."

Allowed and denied requests are in the console's audit log, and the sign-in
of the client is recorded with the method `console_device_login`.

### Sign in with a password

The client's sign-in dialog also takes the account's username and password.
When the account uses two-factor sign-in, the client asks for the code too.
Accounts that use single sign-on can't sign in with a password; they use the
browser, or the provider's own button when
[single sign-on](/docs/people/oidc#single-sign-on-in-the-client) is on.

How long the client stays signed in is set under **Settings**, **Sign-in**,
**RustDesk client sessions**, see
[Sessions and failed sign-ins](/docs/people/users-and-roles#sessions-and-failed-sign-ins).

## It does not connect

Go through these in order:

- **Ports.** The client's network must reach the server on 21116 over TCP and
  UDP, 21115 and 21117 over TCP, and the port in the API server value. The install opens
  them on the server where it can, but a router or a cloud firewall in front of
  the server needs them open too. See [Ports](/docs/operations/ports).
- **Address.** The ID and relay server must be an address the device can reach
  from where it is. A LAN address only works inside that network. With Docker,
  check the `Relay IP:` line in the container's log, see
  [The relay address](/docs/getting-started/docker#the-relay-address).
- **Key.** Paste the key again with **Copy**. If the server's key pair was
  deleted, the server made a new one and every client needs the new key.
- **API server.** Starting with `http://` or `https://` and ending with the
  port that **Overview** shows, 21121. The console's own port, 3375 (5000 on
  older installs), is the wrong one. Left empty, the client uses 21114, which
  answers on Docker only. When the device connects but shows no name or
  operating system in the console, the field is usually empty.
- **One public address.** When several computers in one office reach the
  server through the same public address, a session started from one of them
  can fail with "ID does not exist". See
  [Troubleshooting](/docs/operations/troubleshooting#clients-show-not-ready-or-cannot-connect).
- **Approval.** In **Managed** mode, look under **Join requests**. The
  device can't connect until someone approves it, even though the RustDesk
  client shows **Ready**.

[Troubleshooting](/docs/operations/troubleshooting) goes further.
