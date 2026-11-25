---
title: Install with Docker
description: Run the server and the web console in one container from the published image, with the install script or a compose file.
order: 2
---

The Docker setup runs `neodesk-server` in one container: the ID server, the
relay, the API for RustDesk clients and the web console. The image is published
as `ghcr.io/neodeskapp/neodesk`, so nothing is built on your machine. You
can install it with the script `neodesk-docker.sh` or with the compose file by
hand. Building the image from the repository is covered at the end.

## Requirements

- Docker with Docker Compose 2.24 or newer, so that `docker compose` works.
  `docker compose version` shows it. The compose file reads its settings from a
  `.env` file, which older versions can't do.
- Access to `ghcr.io`, where the image is published.
- Free ports on the host: 3375 and 5443 for the console, 21115 to 21119, 21121
  and 21122 over TCP, and 21116 over UDP. The container publishes all of them.
  [HTTPS with Let's Encrypt](#https-with-lets-encrypt) needs 80 and 443 as
  well.

The install script below installs Docker with Docker's own install script from
get.docker.com when it is missing. It stops when Compose is older than 2.24.

## Install with the script

```bash
curl -fsSL https://neode.sk/install.sh | sudo bash
```

This saves `neodesk-docker.sh` in `/opt/neodesk/docker` and runs it there.
When ufw or firewalld is active, it then opens 3375, 5443, 21115 to 21119, 21121
and 21122 over TCP and 21116 over UDP. It opens 21122, the CDAP gateway's
port, whether the gateway is on or off. With `--domain` it opens 80 and 443
instead of 3375 and 5443. To read the script before it runs, download it
and start it yourself:

```bash
curl -fsSL https://neode.sk/neodesk-docker.sh -o neodesk-docker.sh
sudo bash neodesk-docker.sh
```

What the script does:

- It checks that the ports are free and that it can reach `ghcr.io`.
- It writes `docker-compose.yml` and `.env` into `/opt/neodesk/docker`.
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
| `--relay <address>` | Gives clients this address, a public IP address or a DNS name, instead of looking it up. |
| `--relay-mode local` | Gives clients the machine's LAN address, for a server that only serves your local network. |
| `--tag <tag>` | Runs this image tag instead of `latest`, for example a version number. |
| `--console-port <port>` | Publishes the console on this host port instead of 3375. |
| `--postgres` | Installs on PostgreSQL instead of SQLite, in a second container. |
| `--dir <path>` | Installs into this folder instead of `/opt/neodesk/docker`. |
| `--no-install-docker` | Stops with an error when Docker is missing instead of installing it. |
| `--domain <domain>` | Serves the console over HTTPS at this DNS name, with a certificate from Let's Encrypt. See [HTTPS with Let's Encrypt](#https-with-lets-encrypt). |
| `--email <email-address>` | The address Let's Encrypt sends notices about the certificate to. Needed with `--domain`. |
| `--letsencrypt-staging` | Gets the certificate from Let's Encrypt's staging server, which browsers don't trust. For a test run. |
| `--no-traefik` | Takes HTTPS with Let's Encrypt out again. |

To choose the admin password yourself, put it after `sudo`, because `sudo` drops
variables you set in front of it. Put the password in place of `<admin-password>`:

```bash
sudo ADMIN_PASSWORD='<admin-password>' bash neodesk-docker.sh
```

With `install.sh`, options go after `bash -s --`. For example, for a server that
only serves your local network:

```bash
curl -fsSL https://neode.sk/install.sh | sudo bash -s -- --relay-mode local
```

There they are called `--relay-servers`, `--relay-mode`, `--version`,
`--admin-password`, `--domain`, `--letsencrypt-email` and
`--letsencrypt-staging`.

### Other commands of the script

| Command | What it does |
|---------|--------------|
| `update` | Backs up the data, pulls the image and starts it. When the new container does not get healthy, it goes back to the old image. |
| `status` | Shows the container, its health, the version and the values for clients. |
| `logs` | Follows the container's log. |
| `backup` | Stops the container, saves the data volumes as a `.tar.gz` in `backups` in the install folder, and starts it again. It keeps the last five. |
| `reset-password` | Gives `admin` a new random password and prints it once. `--user <name>` picks another account. |
| `postgres` | Moves the install from SQLite to PostgreSQL; see [PostgreSQL](/docs/operations/postgresql). |
| `uninstall` | Removes the containers. The volumes, the image and the folder stay; `--purge` also deletes the volumes, after a backup. `--purge` asks you to type `delete` first; without a terminal, as in a script, it needs `--yes` instead. |
| `menu` | The same commands as a menu. |

After the one-line install the script is in `/opt/neodesk/docker`. For example,
to see the status:

```bash
cd /opt/neodesk/docker
sudo bash neodesk-docker.sh status
```

`--help` lists every command and option.

### An older NeoDesk container

When the script finds a NeoDesk container from another install, such as one
made by an older script, a two-container install or an install in another folder,
it stops and changes nothing. `--adopt` takes it over: the script copies the old container's
data into this install's volumes, and keeps the old container, stopped and
renamed. An install that runs on PostgreSQL can't be taken over this way.

## Install with the compose file

Create a folder for NeoDesk and put the compose file in it:

```bash
mkdir neodesk && cd neodesk
curl -fsSL https://neode.sk/install/docker-compose.quick.single.yml -o docker-compose.yml
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
recreate the container with it:

```bash
docker compose up -d
```

| Setting | What it does |
|---------|--------------|
| `RELAY_SERVERS` | The address clients reach this server at. Empty, the container looks it up at every start; see [The relay address](#the-relay-address). |
| `NEODESK_IMAGE_TAG` | The image tag. `latest`, the default, is the newest release, or the newest pre-release while there is no stable release; a version number pins one. |
| `NEODESK_CONSOLE_PORT` | The host port of the console, 3375 by default. Up to 3.6.0-rc.4 it was 5000. |
| `NEODESK_CONSOLE_HTTPS_PORT` | The host port of the console's HTTPS, 5443 by default. The install checks that it is free, also while HTTPS is off. |
| `NEODESK_CONSOLE_BIND` | The host address the console is published on, for example `127.0.0.1` behind a reverse proxy on the same machine. |
| `ADMIN_PASSWORD` | The admin's password at the first start. |
| `TRUST_PROXY` | `1` when the console is behind one reverse proxy. |

[Configuration](/docs/operations/configuration) lists more settings.

## Get the admin password

The container creates the account `admin` with a random password of 32
characters at its first start. The script prints it at the end of the install. Print it again with:

```bash
docker compose exec neodesk neodesk-show-admin-credentials
```

```text
Admin Username: admin
Admin Password: <password>
Generated by: NeoDesk Docker bootstrap
Timestamp: <first-start-time>
```

For an install made with the script, run it in `/opt/neodesk/docker`.

The command reads `/opt/neodesk/data/.admin_credentials` in the data volume. If it
answers "No readable admin credentials file found", the first start has not
finished yet. Wait a moment and run it again, or follow the start in the log:

```bash
docker compose logs -f neodesk
```

Once you change the admin password in the console, the server deletes that file,
and the command says so and how to set a new password. On an install made with
the script, this prints a new random one:

```bash
sudo bash neodesk-docker.sh reset-password
```

On an install with the compose file, choose the new password yourself: type it
after the first command (it does not show), then run the second in the folder
with the compose file:

```bash
read -rs NEWPASS
printf '%s\n' "$NEWPASS" | docker compose exec -T -u neodesk neodesk neodesk-server reset-password admin
```

### Choose the password yourself

To start with your own password instead, put `ADMIN_PASSWORD` into `.env` before
the first start, or pass it to the script as shown above. `ADMIN_USERNAME` changes
the account name the same way. Put your password in place of `<admin-password>`:

```ini
ADMIN_PASSWORD=<admin-password>
```

This only works while the data volume is empty. An account that already exists
keeps its password. The password needs at least 8 characters, and the log warns
about one shorter than 12.

## Sign in

Open `http://<server-address>:3375` in a browser, or the port you chose, and sign in as
`admin` with the password from above. The console speaks plain HTTP on this port,
not HTTPS.

With [HTTPS with Let's Encrypt](#https-with-lets-encrypt), open
`https://<domain>` instead.

Continue with [First sign-in](/docs/getting-started/first-sign-in).

::: note
Port 3375 has no TLS. Before the console is reachable from the internet, give
it HTTPS: with `--domain` as below, or with a reverse proxy of your own in front
of it and `TRUST_PROXY=1`. See
[Reverse proxy and TLS](/docs/operations/reverse-proxy-tls).
:::

The console can also serve HTTPS itself on port 5443: set `HTTPS_ENABLED=true`,
and `SSL_CERT_PATH` and `SSL_KEY_PATH` to a certificate and key in the data
volume, under `/opt/neodesk/data`.

## HTTPS with Let's Encrypt {#https-with-lets-encrypt}

When people reach the server under a DNS name, the script can give the console
HTTPS. It adds a small Traefik container in front of the console. Traefik gets a
certificate for the name from Let's Encrypt, renews it by itself and sends
plain HTTP on to HTTPS.

It needs:

- A DNS name that points at this server. Let's Encrypt gives no certificate for
  an IP address or a name without a dot.
- Ports 80 and 443, free on the host and reachable from the internet. Let's
  Encrypt checks the name over port 80.
- An email address, which Let's Encrypt sends notices about the certificate to.

For a new install, put the DNS name in place of `<domain>` and your email
address in place of `<email-address>`:

```bash
curl -fsSL https://neode.sk/install.sh | sudo bash -s -- --domain <domain> --letsencrypt-email <email-address>
```

For an install that runs already, run the script in `/opt/neodesk/docker`, with
the same values in place of `<domain>` and `<email-address>`. It updates the
install as `update` does, backup included, and turns HTTPS on:

```bash
sudo bash neodesk-docker.sh --domain <domain> --email <email-address>
```

The script stops when another program has port 80 or 443, and warns when the
name doesn't point at this server yet. It then waits up to two minutes for the
certificate, and the summary shows the console at `https://<domain>`. When the
certificate hasn't come by then, it warns, and Traefik keeps trying. Traefik's
log, in `/opt/neodesk/docker`, says why:

```bash
docker compose logs traefik
```

### What it changes

The script writes these settings into `.env`:

| Setting | Value |
|---------|-------|
| `COMPOSE_PROFILES` | Gets `traefik`, which starts the Traefik container. |
| `NEODESK_DOMAIN` | The DNS name. |
| `LETSENCRYPT_EMAIL` | The email address. |
| `NEODESK_CONSOLE_BIND` | `127.0.0.1`: the console's own ports, 3375 and 5443, answer only on the host itself. |
| `TRUST_PROXY` | `1`: the console takes each visitor's address from Traefik. |
| `PANEL_PUBLIC_URL` | `https://<domain>`, for the links in mails, unless you set another address there yourself. |
| `LETSENCRYPT_CA_SERVER` | Only with `--letsencrypt-staging`: Let's Encrypt's staging server. |

Traefik takes ports 80 and 443, so a firewall in front of the machine needs
those two instead of 3375 and 5443. It speaks TLS 1.2 or newer and tells
browsers with HSTS to use only HTTPS for this name for a year. The
certificate is kept in the volume `neodesk-traefik-letsencrypt`.

Traefik carries only the console. The ID server, the relay and the client API
on 21121 stay as they are, so clients keep their values and ports.

To set it up with the compose file by hand, put these lines into `.env`, with
the DNS name in place of `<domain>` and your email address in place of
`<email-address>`. With PostgreSQL, the first line is
`COMPOSE_PROFILES=traefik,postgres`.

```ini
COMPOSE_PROFILES=traefik
NEODESK_DOMAIN=<domain>
LETSENCRYPT_EMAIL=<email-address>
NEODESK_CONSOLE_BIND=127.0.0.1
TRUST_PROXY=1
PANEL_PUBLIC_URL=https://<domain>
```

Then recreate the containers:

```bash
docker compose up -d
```

### When not to use it

- Another web server or a reverse proxy of your own has ports 80 and 443 on
  this host. Put the console behind that proxy instead; see
  [Reverse proxy and TLS](/docs/operations/reverse-proxy-tls).
- The server can't be reached from the internet on port 80. Let's Encrypt
  can't check the name then.

### Turn it off

In `/opt/neodesk/docker`:

```bash
sudo bash neodesk-docker.sh --no-traefik
```

This removes the Traefik container and takes `traefik` out of
`COMPOSE_PROFILES`. It removes `NEODESK_DOMAIN`, `LETSENCRYPT_CA_SERVER` and
`TRUST_PROXY` from `.env`, and `NEODESK_CONSOLE_BIND` and `PANEL_PUBLIC_URL`
while they still have the values it set, so the console is published on port
3375 for every address again. It removes `TRUST_PROXY` even when you set it
yourself: set it again when a proxy of your own stands in front. The volume with
the certificate stays.

## The relay address

Clients need the relay's address, so the server has to know its own public
address. The script looks it up once and saves it as `RELAY_SERVERS` in `.env`.

Without a value there, the container looks it up at every start: it asks
checkip.amazonaws.com for its public IPv4 address, then api.ipify.org or
ifconfig.me if that fails, and uses the answer. The log shows the result on a line
that starts with `Relay IP:`.

The server itself also asks these services for its address once at every start,
whether `RELAY_SERVERS` has a value or not, and logs the answer as
`Detected public IP`. With a value in `RELAY_SERVERS`, clients still get that
value. [Privacy](/docs/project/privacy#the-public-ip-address) lists the hosts.

If the lookup fails or returns a private address, the log shows a warning and
clients outside your network can't use the relay. Set the address yourself in
`.env`, with the public IP address or DNS name clients reach the server at in
place of `<public-address>`:

```ini
RELAY_SERVERS=<public-address>
```

For a server that only serves your local network, put its LAN address there.
Then recreate the container:

```bash
docker compose up -d
```

## Where the data lives

| Volume | Mounted at | What it holds |
|--------|------------|---------------|
| `neodesk-data` | `/opt/neodesk/data` | The database `db_v2.sqlite3`, the key pair `id_ed25519` and `id_ed25519.pub`, the API key `.api_key`, `.admin_credentials` and the key for stored remote target passwords, `.remote_target_vault_key` |
| `neodesk-console-data` | `/app/data` | The console's own files, such as uploaded pictures, fonts, support agent builds and the public client endpoints saved in the console |
| `neodesk-postgres-data` | `/var/lib/postgresql/data` | Only with PostgreSQL |
| `neodesk-traefik-letsencrypt` | `/letsencrypt` in the Traefik container | Only with [HTTPS with Let's Encrypt](#https-with-lets-encrypt): the certificate and the Let's Encrypt account |

The compose file names the volumes itself, so the names are the same whatever the
folder is called. `docker volume ls` lists them. An install of 3.6.0-rc.4 or
older mounted `neodesk-data` at `/opt/rustdesk`, and the script's update moves
the mount to `/opt/neodesk/data`. A compose file of your own that still mounts it
at `/opt/rustdesk` keeps working, and the log says to change it.

::: warning
Clients trust the server's key pair in `neodesk-data`. If you delete that
volume, the server creates a new key at its next start and every client needs
the new key. `docker compose down -v` deletes the volumes.
:::

For backups, see [Backup](/docs/operations/backup).

## Stop, start and logs

```bash
docker compose stop
docker compose start
docker compose logs -f neodesk
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
has a second compose file for that, `install/docker-compose.single.yml`:

```bash
git clone https://github.com/neodeskapp/neodesk.git
cd neodesk
docker compose -f install/docker-compose.single.yml up -d --build
```

The build runs in containers: it builds the web app with Node.js, builds the
server with the web app inside it, and copies the one binary into a small Alpine
image called `neodesk:local`. The host needs no Node.js or Go, but the build
downloads npm packages, Go modules and Alpine packages, and the first one takes a
few minutes.

This file works like the published one, with these differences:

- Every command needs `-f install/docker-compose.single.yml`. To print the admin
  password, for example:

  ```bash
  docker compose -f install/docker-compose.single.yml exec neodesk neodesk-show-admin-credentials
  ```
- Compose puts the name of the compose file's folder, `install`, in front of
  each volume name, so the data volume is `install_neodesk-data`.
- Its PostgreSQL password is `PG_PASSWORD`, not `POSTGRES_PASSWORD`.
- `docker compose pull` does not update it. Pull the repository and build again;
  `NEODESK_COMMIT_SHA` tells the binary its commit:

  ```bash
  git pull
  NEODESK_COMMIT_SHA=$(git rev-parse HEAD) docker compose -f install/docker-compose.single.yml up -d --build
  ```

`sudo bash install/neodesk-docker.sh --build`, run from the checkout, builds the same
image as `ghcr.io/neodeskapp/neodesk:local` and installs it like the
published one.
