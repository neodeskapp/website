---
title: Updating
description: Update a Docker, Linux or Windows install, choose the release channel, use the console's Updates page, check the version and roll back.
order: 5
related: /docs/operations/backup, /docs/operations/troubleshooting
howto: before-you-update, docker, linux, windows, check-the-version
icon: update
---

How you update depends on how you installed. A Docker install pulls a newer image. The Linux and Windows installers replace the server binary and keep your data and settings, and the console's **Updates** page can replace the binary too. All of them take their releases from neodeskapp/neodesk on GitHub. Each release carries its installers and compose files, and an update takes the new installer from the release it installs.

## Releases so far

NeoDesk has no stable release yet. The newest release, {{VERSION}}, is a release candidate, and there is no final 3.6.0. Until there is, the Stable channel installs the newest release candidate, and so does the `latest` image in Docker.

## Update a 3.6.0-rc.4 install

An install of 3.6.0-rc.4 or older needs one step by hand. Its update command fetches the installer from the repository's main branch, where it no longer is. On Linux and Windows it still updates the server, but keeps the old installer. On Docker it stops with a download error before it changes anything. Run the new installer once as below. After that, the update commands further down work again. The console's **Updates** page replaces only the server binary, so the step is needed once in any case.

On Linux:

```bash
curl -fsSL https://neode.sk/neodesk.sh | sudo bash -s -- --update
```

It updates the server, saves the installer as `neodesk-setup`, puts the command line `neodesk` in `/usr/local/bin` and moves the backups from `/opt/rustdesk-backups` to `/opt/neodesk-backups`.

On Docker:

```bash
curl -fsSL https://neode.sk/install.sh | sudo bash
```

An install pinned to a version stays on it with this command, for example one installed with `--version 3.6.0-rc.4`; the summary at the end then says "pinned". To move it to the newest release and let it follow new releases again:

```bash
curl -fsSL https://neode.sk/install.sh | sudo bash -s -- --version latest
```

On Windows, open PowerShell as Administrator, download the installer and run its update:

```powershell
Invoke-WebRequest https://neode.sk/neodesk.ps1 -OutFile neodesk.ps1 -UseBasicParsing
```

```powershell
.\neodesk.ps1 -Update
```

It saves itself as `C:\NeoDesk\neodesk.ps1` and puts `neodesk` on the machine's `Path`.

## The console's port after the update

The console's default port is 3375 since 3.6.0-rc.5; it was 5000. HTTPS stays on 5443.

- Linux and Windows installs keep their port. The installers wrote the port into every install's env file, and an install whose settings name a port keeps it.
- Docker installs with the default compose file move to 3375 at their next update with the script, which ends with "The console now answers on port 3375; it was 5000". To keep 5000, add this line to `/opt/neodesk/docker/.env` before the update, or after it and update again:

  ```ini
  NEODESK_CONSOLE_PORT=5000
  ```

- A reverse proxy of your own in front of a Docker install has to forward to 3375 after the update, unless you keep 5000. With `--domain` (Traefik) nothing changes for you: the console stays on 443.

## Before you update

Make a backup, see [Backup and restore](/docs/operations/backup), and note the version you run now (see [Check the version](#check-the-version)), so that you can go back to it.

## Release channels

| Channel | What it installs |
|---------|------------------|
| Stable | The newest release. While the repository has no stable release, the newest pre-release, such as a release candidate. |
| Development | The development build: the pre-release tagged `dev`, built again from `main` when the server or the web app changes there. Things can break. |

Stable is the default. A Linux or Windows install keeps its channel as `UPDATE_GITHUB_BRANCH` in the env file: `main` for Stable, `dev` for Development. The values name the channel, not a git branch. Change it with `--channel` (`-Channel` on Windows), with **Update**, then **Switch update channel** in the installer's menu, or with **Update channel** on the console's **Updates** page.

When the repository has no release at all, a new Linux or Windows install without a channel given takes the development build and stays on that channel. Switch to Stable once a release is out, for example on Linux:

```bash
sudo neodesk-setup --update --channel stable
```

In Docker the image tag is the channel: `latest` is the newest release (the newest pre-release while there is no stable release, as for Stable above), `dev` the development build, and a release's version number pins that release.

## Docker

In the folder with `docker-compose.yml` (`/opt/neodesk/docker` for an install made with the script):

```bash
docker compose pull
docker compose up -d
```

Compose replaces the container with one from the new image, and the database, the keys and the console's files stay in their volumes. The server updates its database tables at start. Follow the start and check that the container becomes healthy:

```bash
docker compose logs -f neodesk
docker compose ps
```

With the script, run it again or give it the `update` command:

```bash
sudo bash /opt/neodesk/docker/neodesk-docker.sh update
```

It keeps copies of `.env` and the compose files, pulls the image, stops the container, saves the data volumes with those copies as a `.tar.gz` in `backups` in the install folder, and starts the new image. If the new container is not healthy within three minutes, it puts the old settings back and goes back to the previous image, and if that does not start either, it puts the data from the backup back. When the image and the settings have not changed, it changes nothing.

The script also replaces `docker-compose.yml` with the one of the release the image tag names, and itself with that release's `neodesk-docker.sh`, both checked against the release's `SHA256SUMS`. A compose file you changed by hand stays, and the new one is saved next to it as `docker-compose.yml.new`. Keep your own changes in `docker-compose.override.yml` in the same folder, which Docker Compose reads as well.

Since 3.6.0-rc.5 the data volume is mounted at `/opt/neodesk/data` in the container instead of `/opt/rustdesk`. The script's update changes `/opt/rustdesk` to `/opt/neodesk/data` in `.env`, in a compose file you changed and in `docker-compose.override.yml`, and the old files stay in its backup. A compose file of your own that still mounts the volume at `/opt/rustdesk` keeps working, and the container's log says to change it to `/opt/neodesk/data`.

`NEODESK_IMAGE_TAG` in `.env` decides which image you get, `latest` unless you set one. With a version pinned there, `docker compose pull` gets nothing newer: change the tag first, or give the script `--tag latest`.

### Built from the repository

An image built with `install/docker-compose.single.yml` is not pulled. Pull the repository and build again in the folder you cloned:

```bash
git pull
```

```bash
NEODESK_COMMIT_SHA=$(git rev-parse HEAD) docker compose -f install/docker-compose.single.yml up -d --build
```

## Linux

```bash
sudo neodesk-setup --update
```

`neodesk-setup` is the installer, which the install left as a command. `sudo neodesk --update` reaches it too. `--update` runs without questions. In the menu (`sudo neodesk-setup`), the same is **Update**, then **Update now**. The update:

1. makes the installer's backup in `/opt/neodesk-backups/neodesk_backup_<time>.tar.gz`, see [Backup and restore](/docs/operations/backup#cold-backup-of-a-linux-install),
2. gets the new binary and keeps the old one as `neodesk-server.prev`,
3. adds settings that are new in this version to the env file, keeping the values you have,
4. writes the systemd unit again, restarts the service and checks that the API, the console, the ID server and the relay answer,
5. puts the old binary back if the new one does not come up,
6. replaces `neodesk-setup` with the installer of the release it installed, checked against the release's signed `SHA256SUMS`, and the command line `neodesk` with a copy of the new binary.

Without options, the new binary is the newest release of the install's channel, checked by its SHA-256 and the release signature before it replaces the old one. These options change where it comes from:

- `--channel dev` or `--channel stable` switches the channel first.
- `--from-source` builds it from a checkout. That needs Go, and Node.js unless `web-ui/build` exists. In the checkout:

  ```bash
  git pull
  sudo ./install/neodesk.sh --update --from-source
  ```

- `--binary <file>` installs a binary you built yourself.

## Windows

In PowerShell as Administrator:

```powershell
& 'C:\NeoDesk\neodesk.ps1' -Update
```

It works like the Linux update: a backup to `C:\NeoDesk-Backups`, the new binary with the old one kept as `.prev`, the env file merged, the service `NeoDeskServer` written again and restarted, the old binary back if the new one fails, and the copy of the script replaced with the `neodesk.ps1` of the release it installed. `-Channel`, `-FromSource` and `-Binary <path>` work as on Linux.

## The Updates page in the console

**Settings**, **Updates** checks GitHub for a newer release and can install it.

What it does:

- **Check for updates** looks up the newest release of the update channel in neodeskapp/neodesk, or in the repository that `UPDATE_GITHUB_OWNER` and `UPDATE_GITHUB_REPO` name. While there is no stable release, Stable takes the newest pre-release, as the installers do. The side column shows the channel and the repository it asks.
- **Install**, on a Linux or Windows install, downloads that release's binary for this machine into the data folder and checks its size, its SHA-256 and the release signature. It runs the binary to compare its version and commit with the release. With **Create backup before updating** ticked, it saves the running binary and a full backup of the data. Then it puts the new binary in place, keeps the old one as `neodesk-server.prev`, and the service starts the new one. If the new binary does not get ready within three starts, the fourth start puts the old one back and the page shows the failed update.
- **Update channel** picks **Stable** or **Development**. The choice is saved as `UPDATE_GITHUB_BRANCH` in the env file.
- **Backups made before updates** lists the backups each install made, with **Restore these files** to put that binary back.

Release signatures: the release key is built into the server. A release without a valid signature is refused. `UPDATE_MANIFEST_PUBLIC_KEY` adds keys, for example for a fork's own releases.

What it cannot do:

- Update a Docker install. In Docker it turns **Install** off and shows `docker compose pull` and `docker compose up -d` with the image name, for example `ghcr.io/neodeskapp/neodesk:latest`; run them on the host as shown above. An image built from the repository shows the same commands, but they don't update it: build again instead.
- Offer an update for a binary built without its commit. The check then says that the commit is unknown.
- Install a release older than the running version.
- Rewrite the service or the installer scripts. Only the binary is replaced. At its first start the new binary adds the settings that are new in this release to the env file, as the installer's update does. When a release's notes say that the service changed, run the installer's update as well.
- Update the command line on a Linux install. `/usr/local/bin/neodesk` is a copy of the binary that only root may replace, so it stays at the older version. The page then shows **Update the command line too** with the command for it, and `neodesk` says on its error output that it is older than the server.

## Check the version

- In the console: **Settings**, **Updates** shows **Installed version**, and **Settings**, **General** shows **Server version** under **Server information**.
- The binary prints it. In Docker:

  ```bash
  docker compose exec neodesk neodesk-server -version
  ```

  On Linux:

  ```bash
  sudo /opt/neodesk/neodesk-server -version
  ```

  On Windows:

  ```powershell
  C:\NeoDesk\neodesk-server.exe -version
  ```

  The output looks like this:

  ```text
  neodesk-server {{VERSION}} (built <date>, commit <commit>)
  ```

  A binary built with `--from-source` shows `built unknown`, and one built without its commit leaves the commit out.

- The API's health check answers with it:

  ```bash
  curl http://localhost:21121/api/health
  ```

- With the Docker script, `sudo bash neodesk-docker.sh status` shows it.

## Roll back

On Linux and Windows the update keeps the previous binary as `neodesk-server.prev`. The `rollback` command puts it back and keeps the replaced one as `.prev`, so a second rollback undoes the first. Restart the service afterwards:

```bash
sudo /opt/neodesk/neodesk-server rollback
sudo systemctl restart neodesk-server
```

```powershell
Stop-Service NeoDeskServer
& 'C:\NeoDesk\neodesk-server.exe' rollback
Start-Service NeoDeskServer
```

In Docker, pin the version you ran before in `.env`, in place of `<previous-version>`, and recreate the container:

```ini
NEODESK_IMAGE_TAG=<previous-version>
```

```bash
docker compose up -d
```

For an image built from the repository, check out the commit you ran before and build again, and check out your branch again before the next update.

A newer version may have changed the database tables, and an older binary may not work with them. If the old version misbehaves after a rollback, restore the backup you made before the update.
