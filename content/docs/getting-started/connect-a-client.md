---
title: Connect a RustDesk client
description: Point a RustDesk client at your server with the four values from the Overview page.
order: 6
---

A RustDesk client connects to your server once it knows four values: the ID
server, the relay server, the API server and the server's key. The console shows
all four on the Overview page. This page explains where they go in the client
and what happens after the client connects.

The BetterDesk client needs none of this typed in: an invite link from
**Add a computer** installs it and joins the computer, see
[Add a computer](/docs/console/add-a-computer).

## Install the RustDesk client

BetterDesk works with the standard RustDesk client. Get it from RustDesk's
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

**Settings**, then **Client setup** shows the same values on a page of their
own. It adds the **Config string**, which holds all four in one line, the QR
code for phones under **Set up a phone**, and the key as the file
`id_ed25519.pub` under **Downloads**.

## Enter the values in the client

In the RustDesk client, open the network settings and their **ID/Relay server**
section. Copy each value with its **Copy** button and paste it into the field of
the same name: ID server, relay server, API server and key.

In a stock RustDesk client, **API server** can stay empty or be
`http://desk.example.com:21121`; both work. Left empty, the client sends its
API calls through the ID server, which answers them. A BetterDesk client set up
by hand needs **API server** filled in.

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

**Pair with code** is for BetterDesk's own client apps. The stock RustDesk client
has no field for a code, so use the four values above for it.

1. Choose **Pair with code**. **Server address** is filled in with the client
   address from **Overview**: a domain name or IP address, without a port.
2. Optionally give the code a **Label**, such as the name of the laptop.
3. Choose **Create code**.

The console shows a code of six characters. It is shown only once, works once,
and is valid for 10 minutes. On the device, type the server address and the
code. The client then gets the same values as a manual setup, and the device
still goes through enrollment like any other.

**Pairing codes**, under **More** in the **Settings** section of the sidebar,
lists the codes that are still active and lets you revoke one. The
**Pair with code** button only shows for accounts that may approve new devices.

## After the client connects

What happens next depends on the server's enrollment mode:

- **Open**: the device joins right away and shows up under **Devices**, then
  **All devices**.
- **Managed**: the device waits under **Devices**, then **Enrollment requests**.
  It can't connect until someone chooses **Approve** and gives it a name.
- **Locked**: only devices with a device token can join. Others are turned away.
  The stock RustDesk client has no way to send a device token, so a new
  RustDesk client can't join in this mode.

A new install starts in **Managed**, with Docker, on Linux and on Windows. A
computer that joins with an invite from **Add a computer** skips the wait in
every mode: it joins approved.
[Enrollment](/docs/console/enrollment) explains the modes and how to change
them, and [Devices](/docs/console/devices) covers the device list.

## Sign in from the client

People with an account on the server can sign in to the RustDesk client with
its username and password. The client then gets their address book from the
server. Members of an organization also get the contacts it shares, see
[The shared address book](/docs/people/organizations#the-shared-address-book).
When the account uses two-factor sign-in, the client asks for the code too.

How long the client stays signed in is set under **Settings**, **Sign-in**,
**RustDesk client sessions**, see
[Sessions and failed sign-ins](/docs/people/users-and-roles#sessions-and-failed-sign-ins).
Accounts that use single sign-on sign in to the client through their provider,
see [Single sign-on with OIDC](/docs/people/oidc).

## It does not connect

Go through these in order:

- **Ports.** The client's network must reach the server on 21116 over TCP and
  UDP, 21117 over TCP, and the port in the API server value. The install opens
  them on the server where it can, but a router or a cloud firewall in front of
  the server needs them open too. See [Ports](/docs/operations/ports).
- **Address.** The ID and relay server must be an address the device can reach
  from where it is. A LAN address only works inside that network. With Docker,
  check the `Relay IP:` line in the container's log, see
  [The relay address](/docs/getting-started/docker#the-relay-address).
- **Key.** Paste the key again with **Copy**. If the server's key pair was
  deleted, the server made a new one and every client needs the new key.
- **API server.** Empty, or starting with `http://` or `https://` and ending
  with the port that **Overview** shows, 21121. The console's own port, 5000,
  is the wrong one.
- **One public address.** When several computers in one office reach the
  server through the same public address, a session started from one of them
  can fail with "ID does not exist". See
  [Troubleshooting](/docs/operations/troubleshooting#clients-show-not-ready-or-cannot-connect).
- **Approval.** In **Managed** mode, look under **Enrollment requests**. The
  device can't connect until someone approves it.

[Troubleshooting](/docs/operations/troubleshooting) goes further.
