---
title: Docker on a Synology NAS
description: Run the published NeoDesk image in Synology's Container Manager, with the settings a NAS usually needs.
order: 1
---

A Synology NAS runs NeoDesk with the same compose file as any other Docker
host. The screens of Container Manager change between DSM versions, so this page
names the files and settings NeoDesk needs, not every click. Read
[Install with Docker](/docs/getting-started/docker) first.

## Before you start

- Docker Compose 2.24 or newer: the compose file reads its settings from `.env`
  in a way older versions refuse. Check it over SSH:

  ```bash
  sudo docker compose version
  ```
- Free ports for the console, 3375 and 5443. DSM's own web interface listens on
  5000 and 5001, so they don't collide. If another package on the NAS has 3375,
  give the console another host port with `NEODESK_CONSOLE_PORT` in `.env`.

## Set it up

1. Create a folder for NeoDesk on the NAS, for example
   `/volume1/docker/neodesk`.
2. Put the compose file in it as `docker-compose.yml`. Download it from
   `https://neode.sk/install/docker-compose.quick.single.yml`, which leads to
   the copy of the newest release.
3. Put a file called `.env` next to it:

   ```ini
   RELAY_SERVERS=<nas-address>
   ```

   Put the address RustDesk clients reach the NAS at in place of `<nas-address>`:
   its LAN address when only devices in your network connect, or your public
   address or DNS name when devices connect over the internet. Without
   `RELAY_SERVERS`, the container looks up its public address at every start.
4. In Container Manager, create a project from that folder's
   `docker-compose.yml` and start it. Over SSH, the same in the folder is:

   ```bash
   sudo docker compose up -d
   ```

The console is then at `http://<nas-address>:3375`. Print the admin password over SSH:

```bash
sudo docker exec neodesk neodesk-show-admin-credentials
```

Continue with [First sign-in](/docs/getting-started/first-sign-in).

## Data in a shared folder

By default the data lives in Docker volumes. To keep it in folders on the NAS
instead, replace the two volume lines of the `neodesk` service with folders and
set `PUID` and `PGID` in `.env` to the numbers of the user and group that own
them. `id <user>` over SSH prints them as `uid` and `gid`; put them in place of
`<uid>` and `<gid>`.

```yaml
    volumes:
      - /volume1/docker/neodesk/data:/opt/neodesk/data
      - /volume1/docker/neodesk/console:/app/data
```

```ini
PUID=<uid>
PGID=<gid>
```

The container starts as root, gives its `neodesk` user these numbers, and runs
the server as that user. Without `PUID` and `PGID` the user is 10001. Neither may
be 0. Don't add `user:` to the compose file: the container has to start as root to
do this. When the user can't write `/opt/neodesk/data`, the log says
`/opt/neodesk/data is NOT writable by the neodesk user`.

## Firewall and router

If the DSM firewall is on, allow 21115 to 21119, 21121 and 21122 over TCP, 21116
over UDP, and the console's port. For devices outside your network, forward
21115 to 21117 and 21121 over TCP and 21116 over UDP on your router. RustDesk
clients send their system information and sign-ins to the API on 21121. Keep the console's port off the internet unless a reverse proxy with
TLS is in front of it; see [Ports and firewall](/docs/operations/ports).

## Updating

Pull the image again and recreate the container. Over SSH, in the folder:

```bash
sudo docker compose pull
sudo docker compose up -d
```

A compose file from 3.6.0-rc.4 or older keeps working with the new image. To
change to the new one, download it again as in [Set it up](#set-it-up), and
change `/opt/rustdesk` to `/opt/neodesk/data` in a folder line you added. That
file publishes the console on 3375 instead of 5000; a `NEODESK_CONSOLE_PORT` in
`.env` keeps the port you set.
