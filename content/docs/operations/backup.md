---
title: Backup and restore
description: What to back up for each install type, what the console's Backup page covers, cold backups of the Docker volumes, restoring, and why the key file matters.
order: 6
related: /docs/operations/updating, /docs/operations/postgresql
icon: backup
---

A NeoDesk install keeps its state in a database and in a few files next to it. This page lists them for each install type, explains what the console's **Backup** page saves, and shows how to make and restore a full copy.

## Why the key file matters

The server's identity is its Ed25519 key pair, `id_ed25519` and `id_ed25519.pub`. The public half is the **Key** every RustDesk client has in its network settings, and clients check it on each connection. When the server starts and finds no key file, it makes a new pair without asking. After that, every client needs the new key before it connects again.

So back up the key files with the database, and restore both together. A database without its keys gives you your devices and accounts back, but not your clients.

`.device_vault_key`, in the same folder as the key pair, holds the key of the details saved for [saved sign-in](/docs/console/saved-sign-in) and of the device passwords that organisations store in their address book. The server makes it at its first start. Neither the console's full backup nor the Linux and Windows installers' backups hold it, so a backup alone can't open those passwords. The Docker script's backup does hold it, since it copies the whole data volume. When you move the server, copy the file with the data. A server without it makes a new key, and the saved sign-in details and the address book's device passwords have to be saved again. Keep the file as safe as the key pair: the file and a copy of the database together open the passwords.

`mesh_agent_server.pem` works the same way for mesh agents. Their `.msh` files name the server by an ID made from this file's key. When the file is missing at start, the server makes a new one and the ID changes, so agents set up with the old `.msh` file no longer accept the server and have to be installed again with a new one.

## What to back up

Docker keeps everything in named volumes:

| Volume | Path in the container | What is in it |
|---|---|---|
| `neodesk-data` | `/opt/neodesk/data` | The SQLite database `db_v2.sqlite3`, the key pair, the API key `.api_key`, `mesh_agent_server.pem`, the key of the stored RDP and VNC passwords `.remote_target_vault_key`, the key of saved sign-in and the address book's device passwords `.device_vault_key`, and the first admin password `.admin_credentials` until the admin changes it |
| `neodesk-console-data` | `/app/data` | The session secret, uploaded pictures and fonts, the public client endpoints, chat files and ticket attachments, the console's own backups |
| `neodesk-postgres-data` | `/var/lib/postgresql/data` | The database, when you run PostgreSQL |

Up to 3.6.0-rc.4 the data volume was mounted at `/opt/rustdesk`. The update to 3.6.0-rc.5 moves the mount; the data stays in the same volume.

Also keep the `.env` file next to the compose file, and `docker-compose.override.yml` if you made one. The compose file names the volumes itself, so the names don't depend on the folder; `docker volume ls` lists them. Only `docker-compose.single.yml`, which builds the image from the repository, puts the name of its folder, `install`, in front, so its data volume is `install_neodesk-data`; see [Install with Docker](/docs/getting-started/docker#build-the-image-from-the-repository).

A Linux install, with the installer's default folders:

| Path | What is in it |
|---|---|
| `/opt/neodesk` | The binary, the SQLite database, the key pair, `.device_vault_key`, the API key, `ssl/` with the certificates, `mesh_agent_server.pem` |
| `/opt/NeoDeskConsole` | The env file `.env` and the console's `data/` folder |
| `/etc/systemd/system/neodesk-server.service` | The service with its arguments |

A Windows install uses `C:\NeoDesk` and `C:\NeoDeskConsole` the same way. On Linux and Windows the env file holds the key of the stored RDP and VNC passwords, `REMOTE_TARGET_VAULT_KEY`. With PostgreSQL, back up the database as described in [PostgreSQL](/docs/operations/postgresql#back-up-the-database), and the folders as well.

## The Backup page in the console

**Server**, **Backups** makes backups while the server runs.

A full backup holds every secret of the server, so only Super admin and Administrator accounts may download, restore or schedule one, or test its destination. Other accounts with **Server configuration**, such as Server admin, see the statistics and the schedule; the server refuses the rest with "Only a super admin can download, restore or send a full backup: it holds every secret of the server".

**Download backup** saves one `.tar.gz` file with:

- a dump of every table of the database, on SQLite and on PostgreSQL,
- on SQLite, a consistent copy of the database file,
- the key pair, the API key and `mesh_agent_server.pem`,
- the console's session secret, uploaded pictures, installed fonts, chat files and ticket attachments,
- the public client endpoints saved in the console,
- the console's TLS certificate, its key and its CA file, when `SSL_CERT_PATH` and the others name them,
- the console's `.env`, when its folder has one (a Docker install has none),
- a summary of devices, the blocklist and recent audit events.

It does not hold the compose files, the systemd unit or `.device_vault_key`, and in Docker not `.remote_target_vault_key`: keep a copy of those files, or the saved sign-in details, the address book's device passwords and the stored RDP and VNC passwords can't be read after a restore onto a new server or volume. The archive contains secrets: the keys, password hashes and two-factor secrets. Store it like a password.

**Scheduled full backup** makes the same archive on a schedule: every hour, 6 hours, 12 hours, 24 hours or week. Each archive is checked after it is written and gets its SHA-256 in a file next to it, and **Archives to keep** (7 unless you change it) removes the oldest. The default destination is the console's data folder, `scheduled-backups` in it. In Docker that is inside the `neodesk-console-data` volume, so it does not protect you against losing the volume. Choose **Custom local or mounted network path** and enter a **Destination path** on another disk or on a network share, then click **Test destination**. The path has to be absolute, and it can't be the root of a disk or the console's own folder.

### Back up to a network share

The console writes to a folder, so mount the share on the machine first. On Linux, for an SMB share, install `cifs-utils`, create the folder and put the login in a file only root can read:

```bash
sudo apt install cifs-utils
sudo mkdir -p /mnt/neodesk-backups
sudo install -m 600 /dev/null /root/.neodesk-smb
sudoedit /root/.neodesk-smb
```

The file holds two lines, `username=...` and `password=...`. Then add this line to `/etc/fstab`, so the share is mounted at every boot and the service account `neodesk` may write to it. Put the NAS's host name or address in place of `<nas-address>`:

```fstab
//<nas-address>/backups /mnt/neodesk-backups cifs credentials=/root/.neodesk-smb,uid=neodesk,gid=neodesk,file_mode=0600,dir_mode=0700,_netdev 0 0
```

Mount it:

```bash
sudo mount /mnt/neodesk-backups
```

In the console, choose **Custom local or mounted network path**, and enter `/mnt/neodesk-backups` as the **Destination path**.

In Docker the path is inside the container. Mount the share on the host the same way, with `uid=10001,gid=10001` (or your `PUID` and `PGID`) in place of `neodesk`, and give the container the folder in `docker-compose.override.yml` next to `docker-compose.yml`. Docker Compose reads that file together with the compose file, and the install script leaves it alone when it updates `docker-compose.yml`:

```yaml
services:
  neodesk:
    volumes:
      - /mnt/neodesk-backups:/backups
```

Recreate the container in that folder:

```bash
docker compose up -d
```

Then enter `/backups` as the **Destination path**.

On Windows, a UNC path such as `\\<nas-address>\backups` works as well, when the account the service runs as may write there.

## Cold backup of a Docker install

Stopping the container first gives a consistent copy of everything. For an install made with the script, `sudo bash neodesk-docker.sh backup` does that: it stops the container, saves both volumes as one `.tar.gz` with a copy of `docker-compose.yml`, `docker-compose.override.yml` and `.env` in `backups` in the install folder, and starts the container again. With PostgreSQL it adds a dump of the database. It keeps the last five backups. See [Install with Docker](/docs/getting-started/docker#other-commands-of-the-script).

By hand, run this in the folder with the compose file:

```bash
docker compose stop
mkdir -p backup
docker run --rm -v neodesk-data:/data:ro -v "$PWD/backup":/backup alpine:3.22 tar czf /backup/neodesk-data.tar.gz -C /data .
docker run --rm -v neodesk-console-data:/data:ro -v "$PWD/backup":/backup alpine:3.22 tar czf /backup/console-data.tar.gz -C /data .
docker compose start
```

With PostgreSQL, add the `neodesk-postgres-data` volume the same way while it is stopped, or use `pg_dump`; see [PostgreSQL](/docs/operations/postgresql#back-up-the-database).

## Cold backup of a Linux install

```bash
sudo systemctl stop neodesk-server
sudo tar czf /root/neodesk-backup.tar.gz /opt/neodesk /opt/NeoDeskConsole /etc/systemd/system/neodesk-server.service
sudo systemctl start neodesk-server
```

The installer's **Backup** menu item, which every update runs first, works while the server runs. It writes `/opt/neodesk-backups/neodesk_backup_<time>.tar.gz` with the same archive as **Download backup** on the console's Backup page (on SQLite and on PostgreSQL), and a copy of the key pair, the API key and `.admin_credentials`. It leaves out the systemd unit and `.device_vault_key`. Only root can read the backups: the folder is 0700 and each archive 0600. The newest five stay and older ones are removed; `BACKUP_KEEP=<number>` in the installer's environment keeps another number, and `BACKUP_KEEP=0` keeps them all. An update that finds the release installed already makes no backup. Up to 3.6.0-rc.4 the backups went to `/opt/rustdesk-backups`; the first run of the new installer as root moves them to `/opt/neodesk-backups`. On Windows the same item writes a zip file to `C:\NeoDesk-Backups`, which only Administrators and SYSTEM can open.

## Restore

### From the Backup page

Under **Restore from a backup**, choose a `.tar.gz` made on this page (or an older `.json` settings file), tick what to restore and click **Restore…**:

- **Console data**: users, roles, settings, folders, groups and the rest of the database tables, replaced table by table, and the public client endpoints. It applies at once.
- **Uploaded images**: the uploaded pictures and the installed fonts. Files with the same name are replaced.
- **Server keys and secrets**: the key pair, the API key, `mesh_agent_server.pem`, the session secret and the console's TLS files. Everyone is signed out, and clients need the key again if the backup comes from another server.
- **Environment file (.env)**: the console's ports, database connection and secrets.
- **Server device database**: the SQLite file of the server, on SQLite only. It is checked, written next to the database, and put in place at the next start.

The last three need a restart of the service. Restoring replaces data on this server and cannot be undone, so download a backup of the current state first.

### A Docker cold backup

For the two files made by hand above, in the folder with the compose file:

```bash
docker compose stop
docker run --rm -v neodesk-data:/data -v "$PWD/backup":/backup alpine:3.22 sh -c 'find /data -mindepth 1 -delete && tar xzf /backup/neodesk-data.tar.gz -C /data'
docker run --rm -v neodesk-console-data:/data -v "$PWD/backup":/backup alpine:3.22 sh -c 'find /data -mindepth 1 -delete && tar xzf /backup/console-data.tar.gz -C /data'
docker compose start
```

A backup made with `neodesk-docker.sh backup` holds both volumes in one file, in the folders `neodesk` and `console`. In a backup of 3.6.0-rc.4 or older the first folder is called `rustdesk`; the command below mounts the data volume under both names, so it restores either. In `/opt/neodesk/docker`, with the file's name in place of `neodesk-<time>.tar.gz`:

```bash
docker compose stop
docker run --rm -v neodesk-data:/restore/neodesk -v neodesk-data:/restore/rustdesk -v neodesk-console-data:/restore/console -v "$PWD/backups":/in:ro alpine:3.22 sh -c 'find /restore/neodesk /restore/console -mindepth 1 -delete && tar xzf /in/neodesk-<time>.tar.gz -C /restore'
docker compose start
```

The container sets the owner of both folders again when it starts.

### A Linux cold backup

```bash
sudo systemctl stop neodesk-server
sudo tar xzf /root/neodesk-backup.tar.gz -C /
sudo systemctl daemon-reload
sudo systemctl start neodesk-server
```

### On a new machine

Install NeoDesk the same way as before ([Docker](/docs/getting-started/docker), [Linux](/docs/getting-started/linux) or [Windows](/docs/getting-started/windows)), stop it, restore the files or volumes as above, put `.device_vault_key` next to the key pair if your backup doesn't hold it, and start it. Point the server's public address at the new machine, or give clients the new address; with the old key file in place they need nothing else.
