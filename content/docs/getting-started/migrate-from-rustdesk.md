---
title: Move from a RustDesk server
description: Replace a RustDesk server (hbbs and hbbr) with NeoDesk and keep its key, so the RustDesk clients keep working without changes.
order: 7
seoTitle: Replace hbbs and hbbr with NeoDesk and keep the key
related: /docs/getting-started/connect-a-client, /docs/operations/ports
icon: move_up
---

NeoDesk takes the place of hbbs and hbbr. A RustDesk client checks the server
by its key, so when NeoDesk has the old server's key pair and answers at the
old address, the clients connect to it as before. This page covers a RustDesk
server on Linux, on Windows or in Docker.

## What carries over

- **The key pair**, `id_ed25519` and `id_ed25519.pub`. NeoDesk reads
  RustDesk's key files as they are. Without them it makes a new pair at its
  first start, and every client then needs the new key. See
  [why the key file matters](/docs/operations/backup#why-the-key-file-matters).
- **The address.** Clients keep the ID server they have. Install NeoDesk on
  the same machine, or point the old DNS name at the new one.
- **The device IDs.** The ID lives on the client, so each device keeps it.
  NeoDesk's device list starts empty and fills as the clients connect. It
  does not read RustDesk's database, except on PostgreSQL, see
  [Keep the device list on PostgreSQL](#keep-the-device-list-on-postgresql).

The relay address does not carry over by itself. hbbs without `-r` sent
clients to the relay at the address they used, but the NeoDesk installers give
clients the public IP address they detect. When your clients reach the old
server at a LAN address or a name, relayed sessions then go to the public
address, which often doesn't work from inside the network. Give the installer
the address your clients use today, see [The relay address](#the-relay-address).

## The relay address

Pass the address your clients have as ID server when you install, in place of
`<old-server-address>`. Each installer spells the option its own way:

```bash
# Docker, with the one-line install
curl -fsSL https://neode.sk/install.sh | sudo bash -s -- --relay-servers <old-server-address>
# Linux
curl -fsSL https://neode.sk/neodesk.sh | sudo bash -s -- --relay-servers <old-server-address>
```

```powershell
# Windows
.\neodesk.ps1 -RelayServers <old-server-address>
```

`neodesk-docker.sh` takes it as `--relay <old-server-address>`. In an interactive
install on Linux or Windows you can also choose **Custom address** when the
script asks for the relay. For a server that only clients in the same network
use, `--relay-mode local` (`-RelayMode local` on Windows) picks the server's
LAN address instead.

## Before you start

1. Copy the old server's data folder somewhere safe, with `id_ed25519`,
   `id_ed25519.pub` and `db_v2.sqlite3`. If the old server runs in Docker, the
   files are in the folder or volume it mounts; `docker inspect <container>`
   lists its mounts.
2. Stop the old server and keep it from starting again: disable its services,
   or, when it runs in Docker, run this in the folder of its containers:

   ```bash
   docker compose down
   ```

   NeoDesk
   needs the same ports, and the Linux and Docker installers stop with an
   error while another program holds them. The Linux script stops and removes
   services named `rustdesksignal` and `rustdeskrelay` itself, so copy their
   unit files first if you may want to go back.
3. If the old server lives in a folder the installer searches, with `hbbs` in
   it, move that folder away, so that NeoDesk starts in a folder of its
   own. Otherwise the installer installs into that folder, and at its first
   start the server renames RustDesk's database to
   `db_v2.sqlite3.rustdesk-<date>-<time>` and makes its own. The log says so
   in a line that starts with `WARN:`. The folders are `/opt/rustdesk`,
   `/usr/local/rustdesk`, `/var/lib/rustdesk`, `/home/rustdesk` and
   `$HOME/rustdesk` on Linux, and `C:\RustDesk` and `C:\Program Files\RustDesk`
   on Windows.

```bash
sudo mv /opt/rustdesk /opt/rustdesk-old
```

```powershell
Rename-Item C:\RustDesk RustDesk-old
```

## On Linux or Windows

Put the key pair into the folder the installer uses, then install. At its first
start the server finds the files and uses them instead of making new ones.

On Linux:

```bash
sudo mkdir -p /opt/neodesk
sudo cp /opt/rustdesk-old/id_ed25519 /opt/rustdesk-old/id_ed25519.pub /opt/neodesk/
```

Then install as described in [Install on Linux](/docs/getting-started/linux).
The script hands the files to the `neodesk` account the server runs as.

On Windows, in PowerShell as Administrator, with the old files in
`C:\RustDesk-old`:

```powershell
New-Item -ItemType Directory -Force C:\NeoDesk
Copy-Item C:\RustDesk-old\id_ed25519, C:\RustDesk-old\id_ed25519.pub C:\NeoDesk\
```

Then install as described in [Install on Windows](/docs/getting-started/windows).

After the install, the public key must be the same as the old
`id_ed25519.pub`. On Linux, show it with:

```bash
sudo cat /opt/neodesk/id_ed25519.pub
```

On Windows it is `C:\NeoDesk\id_ed25519.pub`. The server also writes it to
its log at every start, as `Server public key: <key>`.

## In Docker

Install NeoDesk as described in [Install with Docker](/docs/getting-started/docker).
At its first start it makes a key pair of its own, and the installer prints
that new key under **Key**: don't hand it to clients. Replace it with the old
one and restart the container, right after the install. Run these commands in
the folder that holds the old key files:

```bash
docker exec -i -u neodesk neodesk sh -c 'umask 077; cat > /opt/neodesk/data/id_ed25519' < id_ed25519
docker exec -i -u neodesk neodesk sh -c 'cat > /opt/neodesk/data/id_ed25519.pub' < id_ed25519.pub
docker restart neodesk
```

Write both files before the restart: the server does not start when
`id_ed25519.pub` does not belong to `id_ed25519`. Then check that the container
has the old public key:

```bash
docker exec -u neodesk neodesk cat /opt/neodesk/data/id_ed25519.pub
```

Clients that reach the server between the install and the restart already
show up under **Join requests**. That does no harm: they stay there, and you
approve them as described below once the old key is in place.

## Let the clients back in

A new install starts in the **Managed** join mode. To NeoDesk, your
RustDesk clients are new devices, so each one waits under **Devices**,
**Join requests** until someone approves it. Until then nobody can reach
it, and it cannot start a session.

Approve each one under **Join requests**. A stock RustDesk client sends no
name before it is approved, so its request shows **No name sent**, its ID and
the address it came from. Tell the devices apart by ID: it is the ID the
RustDesk window shows on each computer, and the same one the old server knew.
Give each device its name when you approve it.

The queue holds at most 1000 waiting devices and turns away new ones while it
is full. A device turned away asks again, so with more clients than that,
approve the waiting ones and the rest come in as room frees up.

::: warning
Don't switch to **Open** to let the waiting clients in. A device that was
waiting when you switch connects and can be reached, but it stays under
**Join requests** as waiting, and it can't start a session to another device
until someone approves it. RustDesk then shows "ID does not exist".
:::

See [Approving a device](/docs/console/enrollment#approving-a-device).

## Set the API server on the clients

RustDesk server setups usually leave the clients' **API server** empty. Set it
to `http://<server-address>:21121` on each client, or hand the clients the
config string from the console, see
[Connect a client](/docs/getting-started/connect-a-client#get-the-four-values).

With **API server** empty, a stock RustDesk client sends its API calls to port
21114 on the ID server's host. NeoDesk answers them on 21121, and none of the
installers opens 21114 to clients. The device then connects and can be
reached, but the console never gets its name, operating system or version,
and signing in to the client and its address book don't work.

## Keep the device list on PostgreSQL

On a Linux or Windows install that runs on PostgreSQL, the installer can copy
the devices from RustDesk's database into NeoDesk's. A copied device counts as
known: it registers again without approval in every mode, and shows under
**Devices** before it connects.

On Docker and on SQLite installs there is no way to copy the device list into
the running server. The devices come back as they connect, and each one waits
under **Join requests** as described above.

1. Start the installer. On Linux:

   ```bash
   sudo neodesk-setup
   ```

   On Windows:

   ```powershell
   & 'C:\NeoDesk\neodesk.ps1'
   ```

   Choose **Database migration**, then **Rust -> Go**.
2. As the source, give RustDesk's database, for example
   `/opt/rustdesk-old/db_v2.sqlite3`, or the `db_v2.sqlite3.rustdesk-<date>-<time>`
   the server renamed it to.
3. As the destination, give the install's `DATABASE_URL`, from
   `/opt/NeoDeskConsole/.env` or `C:\NeoDeskConsole\.env`.

The tool first saves a copy of the source next to it. It copies each device's
ID, key, name, operating system and version, and leaves a device that
NeoDesk has already as it is. The last line says how many it copied:

```text
Migration complete: <n> peers copied to PostgreSQL, <m> already there and left as they were
```

::: warning
On a SQLite install, don't give the install's own database file as the
destination. The tool replaces that file with a new one that holds only the
devices.
:::
