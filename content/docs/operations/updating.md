---
title: Updating
description: Update a Docker, Linux or Windows install, choose the release channel, what the console's Updates page can and cannot do, how to check the version and how to roll back.
order: 5
---

How you update depends on how you installed. A Docker install pulls a newer image. The Linux and Windows installers replace the server binary and keep your data and settings, and the console's **Updates** page can replace the binary too. All of them take their releases from neodeskapp/betterdesk on GitHub.

## Before you update

Make a backup, see [Backup and restore](/docs/operations/backup), and note the version you run now (see [Check the version](#check-the-version)), so that you can go back to it.

## Release channels

| Channel | What it installs |
|---------|------------------|
| Stable | The newest release. While the repository has no stable release, the newest pre-release, such as a release candidate. |
| Development | The development build: the pre-release tagged `dev`, built again from `main` when the server or the web app changes there. Things can break. |

Stable is the default. A Linux or Windows install keeps its channel as `UPDATE_GITHUB_BRANCH` in the env file: `main` for Stable, `dev` for Development. The values name the channel, not a git branch. Change it with `--channel` (`-Channel` on Windows), with **Update**, then **Switch update channel** in the installer's menu, or with **Update channel** on the console's **Updates** page.

When the repository has no release at all, a new Linux or Windows install without a channel given takes the development build and stays on that channel. Switch to Stable once a release is out, for example with `sudo betterdesk --update --channel stable`.

In Docker the image tag is the channel: `latest` is the newest release (the newest pre-release while there is no stable release, as for Stable above), `dev` the development build, and a release's version number pins that release.

## Docker

In the folder with `docker-compose.yml` (`/opt/betterdesk/docker` for an install made with the script):

```bash
docker compose pull
docker compose up -d
```

Compose replaces the container with one from the new image, and the database, the keys and the console's files stay in their volumes. The server updates its database tables at start. Follow the start and check that the container becomes healthy:

```bash
docker compose logs -f betterdesk
docker compose ps
```

With the script, run it again or give it the `update` command:

```bash
sudo bash betterdesk-docker.sh update
```

It pulls the image, stops the container, saves the data volumes as a `.tar.gz` in `backups` in the install folder, and starts the new image. If the new container is not healthy within three minutes, it goes back to the previous image, and if that does not start either, it puts the data from the backup back. When the image and the settings have not changed, it changes nothing.

The script also replaces `docker-compose.yml` with the newest one. A file you changed by hand stays, and the new one is saved next to it as `docker-compose.yml.new`. Keep your own changes in `docker-compose.override.yml` in the same folder, which Docker Compose reads as well.

`BETTERDESK_IMAGE_TAG` in `.env` decides which image you get, `latest` unless you set one. With a version pinned there, `docker compose pull` gets nothing newer: change the tag first, or give the script `--tag latest`.

### Built from the repository

An image built with `docker-compose.single.yml` is not pulled. Pull the repository and build again in the folder you cloned:

```bash
git pull
BETTERDESK_COMMIT_SHA=$(git rev-parse HEAD) docker compose -f docker-compose.single.yml up -d --build
```

## Linux

```bash
sudo betterdesk --update
```

`betterdesk` is the installer, which the install left as a command. `--update` runs without questions. In the menu (`sudo betterdesk`), the same is **Update**, then **Update now**. The update:

1. makes the installer's backup in `/opt/rustdesk-backups/betterdesk_backup_<time>.tar.gz`, see [Backup and restore](/docs/operations/backup#cold-backup-of-a-linux-install),
2. gets the new binary and keeps the old one as `betterdesk-server.prev`,
3. adds settings that are new in this version to the env file, keeping the values you have,
4. writes the systemd unit again, restarts the service and checks that the API, the console, the ID server and the relay answer,
5. puts the old binary back if the new one does not come up,
6. replaces the `betterdesk` command with the newest installer.

Without options, the new binary is the newest release of the install's channel, checked by its SHA-256 and the release signature before it replaces the old one. These options change where it comes from:

- `--channel dev` or `--channel stable` switches the channel first.
- `--from-source` builds it from a checkout: run `git pull` there first, then `sudo ./betterdesk.sh --update --from-source`. That needs Go, and Node.js unless `web-ui/build` exists.
- `--binary FILE` installs a binary you built yourself.

## Windows

In PowerShell as Administrator:

```powershell
& 'C:\BetterDesk\betterdesk.ps1' -Update
```

It works like the Linux update: a backup to `C:\BetterDesk-Backups`, the new binary with the old one kept as `.prev`, the env file merged, the service `BetterDeskServer` written again and restarted, the old binary back if the new one fails, and the copy of the script replaced with the newest one. `-Channel`, `-FromSource` and `-Binary PATH` work as on Linux.

## The Updates page in the console

**Settings**, **Updates** checks GitHub for a newer release and can install it.

What it does:

- **Check for updates** looks up the newest release of the update channel in neodeskapp/betterdesk, or in the repository that `UPDATE_GITHUB_OWNER` and `UPDATE_GITHUB_REPO` name. While there is no stable release, Stable takes the newest pre-release, as the installers do. The side column shows the channel and the repository it asks.
- **Install**, on a Linux or Windows install, downloads that release's binary for this machine into the data folder and checks its size, its SHA-256 and the release signature. It runs the binary to compare its version and commit with the release. With **Create backup before updating** ticked, it saves the running binary and a full backup of the data. Then it puts the new binary in place, keeps the old one as `betterdesk-server.prev`, and the service starts the new one. If the new binary does not get ready within three starts, the fourth start puts the old one back and the page shows the failed update.
- **Update channel** picks **Stable** or **Development**. The choice is saved as `UPDATE_GITHUB_BRANCH` in the env file.
- **Backups made before updates** lists the backups each install made, with **Restore these files** to put that binary back.

Release signatures: the release key is built into the server. A release without a valid signature is refused. `UPDATE_MANIFEST_PUBLIC_KEY` adds keys, for example for a fork's own releases.

What it cannot do:

- Update a Docker install. In Docker it turns **Install** off and shows `docker compose pull` and `docker compose up -d` with the image name, for example `ghcr.io/neodeskapp/betterdesk:latest`; run them on the host as shown above. An image built from the repository shows the same commands, but they don't update it: build again instead.
- Offer an update for a binary built without its commit. The check then says that the commit is unknown.
- Install a release older than the running version.
- Rewrite the service or the installer scripts. Only the binary is replaced. At its first start the new binary adds the settings that are new in this release to the env file, as the installer's update does. When a release's notes say that the service changed, run the installer's update as well.

## Check the version

- In the console: **Settings**, **Updates** shows **Installed version**, and **Settings**, **General** shows **Server version** under **Server information**.
- The binary prints it. In Docker:

  ```bash
  docker compose exec betterdesk betterdesk-server -version
  ```

  On Linux, `sudo /opt/betterdesk/betterdesk-server -version`, and on Windows `C:\BetterDesk\betterdesk-server.exe -version`. The output looks like this:

  ```text
  betterdesk-server {{VERSION}} (built <date>, commit <commit>)
  ```

  A binary built with `--from-source` shows `built unknown`, and one built without its commit leaves the commit out.

- The API's health check answers with it: `curl http://localhost:21121/api/health`.
- With the Docker script, `sudo bash betterdesk-docker.sh status` shows it.

## Roll back

On Linux and Windows the update keeps the previous binary as `betterdesk-server.prev`. The `rollback` command puts it back and keeps the replaced one as `.prev`, so a second rollback undoes the first. Restart the service afterwards:

```bash
sudo /opt/betterdesk/betterdesk-server rollback
sudo systemctl restart betterdesk-server
```

```powershell
Stop-Service BetterDeskServer
& 'C:\BetterDesk\betterdesk-server.exe' rollback
Start-Service BetterDeskServer
```

In Docker, pin the version you ran before in `.env` and recreate the container:

```ini
BETTERDESK_IMAGE_TAG=<the previous version>
```

```bash
docker compose up -d
```

For an image built from the repository, check out the commit you ran before and build again, and check out your branch again before the next update.

A newer version may have changed the database tables, and an older binary may not work with them. If the old version misbehaves after a rollback, restore the backup you made before the update.
