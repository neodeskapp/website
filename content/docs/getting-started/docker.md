---
title: Install with Docker
description: Run the server and the web console in one container from the published image, with the install script or a compose file.
order: 2
---

The Docker setup runs `betterdesk-server` in one container: the ID server, the
relay, the API for RustDesk clients and the web console. The image is published
as `ghcr.io/neodeskapp/betterdesk`, so nothing is built on your machine. You
can install it with the script `betterdesk-docker.sh` or with the compose file by
hand. Building the image from the repository is covered at the end.

## Requirements

- Docker with Docker Compose 2.24 or newer, so that `docker compose` works.
  `docker compose version` shows it. The compose file reads its settings from a
  `.env` file, which older versions can't do.
- Access to `ghcr.io`, where the image is published.
- Free ports on the host: 5000 and 5443 for the console, 21115 to 21119, 21121
  and 21122 over TCP, and 21116 over UDP. The container publishes all of them.

The install script below installs Docker with Docker's own install script from
get.docker.com when it is missing. It stops when Compose is older than 2.24.

## Install with the script

```bash
curl -fsSL https://raw.githubusercontent.com/neodeskapp/betterdesk/main/install.sh | sudo bash
```

This saves `betterdesk-docker.sh` in `/opt/betterdesk/docker` and runs it there.
When ufw or firewalld is active, it then opens 5000, 5443, 21115 to 21119, 21121
and 21122 over TCP and 21116 over UDP. To read the script before it runs, download it
and start it yourself:

```bash
curl -fsSL https://raw.githubusercontent.com/neodeskapp/betterdesk/main/betterdesk-docker.sh -o betterdesk-docker.sh
sudo bash betterdesk-docker.sh
```

What the script does:

- It checks that the ports are free and that it can reach `ghcr.io`.
- It writes `docker-compose.yml` and `.env` into `/opt/betterdesk/docker`.
- It looks up the address clients reach this server at and saves it as
  `RELAY_SERVERS` in `.env`. It asks checkip.amazonaws.com, then api.ipify.org.
  When neither answers, it uses the LAN address and warns.
- It pulls the image, starts the container and waits up to three minutes until
  the API and the console answer.
- It prints the console's address, the admin password, the four values for
  RustDesk clients and the ports a firewall in front of the machine has to let
  through.

The admin password is shown once, at the end of the first install. Copy it.

Run the script again later to update the install; see
[Updating](/docs/operations/updating).

### Options

| Option | What it does |
|--------|--------------|
| `--relay ADDRESS` | Gives clients this address, a public IP address or a DNS name, instead of looking it up. |
| `--relay-mode local` | Gives clients the machine's LAN address, for a server that only serves your local network. |
| `--tag TAG` | Runs this image tag instead of `latest`, for example a version number. |
| `--console-port PORT` | Publishes the console on this host port instead of 5000. |
| `--postgres` | Installs on PostgreSQL instead of SQLite, in a second container. |
| `--dir PATH` | Installs into this folder instead of `/opt/betterdesk/docker`. |
| `--no-install-docker` | Stops with an error when Docker is missing instead of installing it. |

To choose the admin password yourself, put it after `sudo`, because `sudo` drops
variables you set in front of it:

```bash
sudo ADMIN_PASSWORD='choose-a-long-password' bash betterdesk-docker.sh
```

With `install.sh`, options go after `bash -s --`, for example
`curl -fsSL https://raw.githubusercontent.com/neodeskapp/betterdesk/main/install.sh | sudo bash -s -- --relay-mode local`.
There they are called `--relay-servers`, `--relay-mode`, `--version` and
`--admin-password`.

### Other commands of the script

| Command | What it does |
|---------|--------------|
| `update` | Backs up the data, pulls the image and starts it. When the new container does not get healthy, it goes back to the old image. |
| `status` | Shows the container, its health, the version and the values for clients. |
| `logs` | Follows the container's log. |
| `backup` | Stops the container, saves the data volumes as a `.tar.gz` in `backups` in the install folder, and starts it again. It keeps the last five. |
| `reset-password` | Gives `admin` a new random password and prints it once. `--user NAME` picks another account. |
| `postgres` | Moves the install from SQLite to PostgreSQL; see [PostgreSQL](/docs/operations/postgresql). |
| `uninstall` | Removes the containers. The volumes, the image and the folder stay; `--purge` also deletes the volumes, after a backup. |
| `menu` | The same commands as a menu. |

For example `sudo bash betterdesk-docker.sh status`; after the one-line install
the script is in `/opt/betterdesk/docker`. `--help` lists every command and
option.

### An older BetterDesk container

When the script finds a BetterDesk container from another install, such as one
made by an older script, a two-container install or an install in another folder,
it stops and changes nothing. `--adopt` takes it over: the script copies the old container's
data into this install's volumes, and keeps the old container, stopped and
renamed. An install that runs on PostgreSQL can't be taken over this way.

## Install with the compose file

Create a folder for BetterDesk and put the compose file in it:

```bash
mkdir betterdesk && cd betterdesk
curl -fsSL https://raw.githubusercontent.com/neodeskapp/betterdesk/main/docker-compose.quick.single.yml -o docker-compose.yml
docker compose up -d
```

Docker pulls the image and starts the container. Its health check asks the API and
the console whether they answer, and the status turns to healthy:

```bash
docker compose ps
```

Run the `docker compose` commands on this page in that folder. On a Synology NAS,
see [Docker on a Synology NAS](/docs/getting-started/docker/synology).

### Settings in .env

Settings go into a file called `.env` next to `docker-compose.yml`, one
`KEY=value` per line. Every key in it reaches the server, except the few the
compose file fixes itself, such as the ports inside the container. After a change,
run `docker compose up -d` to recreate the container with it.

| Setting | What it does |
|---------|--------------|
| `RELAY_SERVERS` | The address clients reach this server at. Empty, the container looks it up at every start; see [The relay address](#the-relay-address). |
| `BETTERDESK_IMAGE_TAG` | The image tag. `latest`, the default, is the newest release, or the newest pre-release while there is no stable release; a version number pins one. |
| `BETTERDESK_CONSOLE_PORT` | The host port of the console, 5000 by default. |
| `BETTERDESK_CONSOLE_HTTPS_PORT` | The host port of the console's HTTPS, 5443 by default. The install checks that it is free, also while HTTPS is off. |
| `BETTERDESK_CONSOLE_BIND` | The host address the console is published on, for example `127.0.0.1` behind a reverse proxy on the same machine. |
| `ADMIN_PASSWORD` | The admin's password at the first start. |
| `TRUST_PROXY` | `1` when the console is behind one reverse proxy. |

[Configuration](/docs/operations/configuration) lists more settings.

## Get the admin password

The container creates the account `admin` with a random password at its first
start. The script prints it at the end of the install. Print it again with:

```bash
docker compose exec betterdesk betterdesk-show-admin-credentials
```

```text
Admin Username: admin
Admin Password: <32 random characters>
Generated by: BetterDesk Docker bootstrap
Timestamp: <time of the first start>
```

For an install made with the script, run it in `/opt/betterdesk/docker`.

The command reads `/opt/rustdesk/.admin_credentials` in the data volume. Once you
change the admin password in the console, the server deletes that file, and the
command says so and how to set a new password:
`sudo bash betterdesk-docker.sh reset-password` prints a new random one.

If it answers "No readable admin credentials file found", the first start has not
finished yet. Wait a moment and run it again, or follow the start with
`docker compose logs -f betterdesk`.

### Choose the password yourself

To start with your own password instead, put `ADMIN_PASSWORD` into `.env` before
the first start, or pass it to the script as shown above. `ADMIN_USERNAME` changes
the account name the same way.

```ini
ADMIN_PASSWORD=choose-a-long-password
```

This only works while the data volume is empty. An account that already exists
keeps its password. The password needs at least 8 characters, and the log warns
about one shorter than 12.

## Sign in

Open `http://<server>:5000` in a browser, or the port you chose, and sign in as
`admin` with the password from above. The console speaks plain HTTP on this port,
not HTTPS.

Continue with [First sign-in](/docs/getting-started/first-sign-in).

::: note
Port 5000 has no TLS. Before the console is reachable from the internet, put a
reverse proxy with TLS in front of it and set `TRUST_PROXY=1`. See
[Reverse proxy and TLS](/docs/operations/reverse-proxy-tls).
:::

The console can also serve HTTPS itself on port 5443: set `HTTPS_ENABLED=true`,
and `SSL_CERT_PATH` and `SSL_KEY_PATH` to a certificate and key in the data
volume, under `/opt/rustdesk`.

## The relay address

Clients need the relay's address, so the server has to know its own public
address. The script looks it up once and saves it as `RELAY_SERVERS` in `.env`.

Without a value there, the container looks it up at every start: it asks
checkip.amazonaws.com for its public IPv4 address, then api.ipify.org or
ifconfig.me if that fails, and uses the answer. The log shows the result on a line
that starts with `Relay IP:`.

If the lookup fails or returns a private address, the log shows a warning and
clients outside your network can't use the relay. Set the address yourself in
`.env`:

```ini
RELAY_SERVERS=203.0.113.10
```

Then run `docker compose up -d`. For a server that only serves your local network,
put its LAN address there.

## Where the data lives

| Volume | Mounted at | What it holds |
|--------|------------|---------------|
| `betterdesk-data` | `/opt/rustdesk` | The database `db_v2.sqlite3`, the key pair `id_ed25519` and `id_ed25519.pub`, the API key `.api_key`, `.admin_credentials` and the key for stored remote target passwords, `.remote_target_vault_key` |
| `betterdesk-console-data` | `/app/data` | The console's own files, such as uploaded pictures, fonts, support agent builds and the public client endpoints saved in the console |
| `betterdesk-postgres-data` | `/var/lib/postgresql/data` | Only with PostgreSQL |

The compose file names the volumes itself, so the names are the same whatever the
folder is called. `docker volume ls` lists them.

::: warning
Clients trust the server's key pair in `betterdesk-data`. If you delete that
volume, the server creates a new key at its next start and every client needs
the new key. `docker compose down -v` deletes the volumes.
:::

For backups, see [Backup](/docs/operations/backup).

## Stop, start and logs

```bash
docker compose stop
docker compose start
docker compose logs -f betterdesk
```

`docker compose down` removes the container and its network and keeps the volumes.
The container has the restart policy `unless-stopped`: it comes back after a
reboot of the host unless you stopped it.

The first lines of the log show the version, the database and the relay address.
On the first start they also show the enrollment mode.

## Enrollment mode

On a new data volume the container starts in the **Managed** enrollment mode. A
RustDesk client that connects for the first time waits under **Enrollment
requests** until someone approves it. You can change the mode in the console, see
[Enrollment](/docs/console/enrollment). The mode you pick there stays after a
restart.

`ENROLLMENT_MODE=open`, `managed` or `locked` in `.env` only sets the mode the
server starts with while none is saved. To make the server apply it at every
start, over what the console saved, also add `ENROLLMENT_MODE_ENV_OVERRIDE=Y`.

## PostgreSQL

SQLite is the default. The compose file also has a `postgres` service that runs
PostgreSQL in a second container: `--postgres` installs on it, and the script's
`postgres` command moves an install over. How to do it by hand is in
[PostgreSQL](/docs/operations/postgresql).

## Updating

```bash
docker compose pull
docker compose up -d
```

This pulls the newest image of your tag and recreates the container; the volumes
stay. Running the script again does the same with a backup first.
[Updating](/docs/operations/updating) has the details.

## Build the image from the repository

To run your own changes, build the image from a checkout instead. The repository
has a second compose file for that, `docker-compose.single.yml`:

```bash
git clone https://github.com/neodeskapp/betterdesk.git
cd betterdesk
docker compose -f docker-compose.single.yml up -d --build
```

The build runs in containers: it builds the web app with Node.js, builds the
server with the web app inside it, and copies the one binary into a small Alpine
image called `betterdesk:local`. The host needs no Node.js or Go, but the build
downloads npm packages, Go modules and Alpine packages, and the first one takes a
few minutes.

This file works like the published one, with these differences:

- Every command needs `-f docker-compose.single.yml`, for example
  `docker compose -f docker-compose.single.yml exec betterdesk betterdesk-show-admin-credentials`.
- Compose puts the folder name in front of each volume name, so after the clone
  above the data volume is `betterdesk_betterdesk-data`.
- Its PostgreSQL password is `PG_PASSWORD`, not `POSTGRES_PASSWORD`.
- `docker compose pull` does not update it. Pull the repository and build again;
  `BETTERDESK_COMMIT_SHA` tells the binary its commit:

  ```bash
  git pull
  BETTERDESK_COMMIT_SHA=$(git rev-parse HEAD) docker compose -f docker-compose.single.yml up -d --build
  ```

`sudo bash betterdesk-docker.sh --build`, run from the checkout, builds the same
image as `ghcr.io/neodeskapp/betterdesk:local` and installs it like the
published one.
