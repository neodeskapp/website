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
At its first start it makes a key pair of its own. Replace it with the old one
and restart the container. Run these commands in the folder that holds the old
key files:

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

## Let the clients back in

A new install starts in the **Managed** enrollment mode. To NeoDesk, your
RustDesk clients are new devices, so each one waits under **Devices**,
**Enrollment requests** until someone approves it. Until then nobody can reach
it, and it cannot start a session.

There are two ways to let them in:

- Approve each one under **Enrollment requests**.
- Switch to **Open** while the clients come back, then switch back to
  **Managed**. Waiting devices connect the next time they try, and a device the
  server knows can register again in every mode. Do this when you have more
  than 1000 clients: the queue holds at most 1000 waiting devices, and turns
  away the rest without a request.

See [Changing the mode](/docs/console/enrollment#changing-the-mode).

The clients' **API server** can stay empty, as a RustDesk server setup usually
leaves it, or be `http://<server-address>:21121`; both work. See
[Connect a client](/docs/getting-started/connect-a-client#get-the-four-values).

## Keep the device list on PostgreSQL

On an install that runs on PostgreSQL, the installer can copy the devices from
RustDesk's database into NeoDesk's. A copied device counts as known: it
registers again without approval in every mode, and shows under **Devices**
before it connects.

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
