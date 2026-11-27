---
title: Ports and firewall
description: Which ports NeoDesk listens on, who connects to each, which to open to the internet, and firewall commands for Linux and Windows.
order: 2
seoTitle: NeoDesk ports and firewall for RustDesk clients
related: /docs/operations/reverse-proxy-tls, /docs/operations/configuration, /docs/operations/troubleshooting
icon: router
---

RustDesk clients reach the server on a handful of ports, and people open the web console in a browser on another. This page lists them, says which ones the internet has to reach, and shows how to open them.

## The ports

| Port | Protocol | Who connects | Open to the internet |
|---|---|---|---|
| 21115 | TCP | RustDesk clients, for the NAT type test | Yes, for clients outside your network |
| 21116 | TCP and UDP | RustDesk clients: the ID server, where they register and ask for connections | Yes |
| 21117 | TCP | RustDesk clients: the relay, used when no direct connection works | Yes |
| 21118 | TCP | RustDesk clients set to use WebSocket: the ID server | Only for such clients |
| 21119 | TCP | RustDesk clients set to use WebSocket: the relay | Only for such clients |
| 21121 | TCP (HTTP) | RustDesk clients: the client API, for system information, sign-in and the address book | Yes |
| 21114 | TCP (HTTP) | Docker: the client API for RustDesk clients whose **API server** is empty. Linux and Windows: the server's own API, with `/metrics` for Prometheus; the console passes the client API calls from 21121 to it inside the server | Docker: yes, for clients without an API server setting; the compose file publishes it. Linux and Windows: only from a Prometheus server that reads `/metrics`; the installers don't open it |
| 21122 | TCP | CDAP device agents | Only when you use them |
| 3375 | TCP (HTTP) | Browsers: the web console, and remote desktop in the browser | Only through a reverse proxy with TLS |
| 5443 | TCP (HTTPS) | Browsers: the console when it serves HTTPS itself | Only when no reverse proxy is in front |
| 80, 443 | TCP (HTTP, HTTPS) | Browsers and Let's Encrypt: Traefik in front of the console, on Docker with [HTTPS with Let's Encrypt](/docs/getting-started/docker#https-with-lets-encrypt) | Yes, when you use it |

The server works out three of these from the others: the NAT test port is one below the ID server port, and the two WebSocket ports are two above the ID server and relay ports.

The console on port 3375 speaks plain HTTP. Open it as `http://<server-address>:3375`, or put it behind a reverse proxy with TLS before people use it over the internet; see [Reverse proxy and TLS](/docs/operations/reverse-proxy-tls). The Linux and Windows installers turn on HTTPS with a self-signed certificate, so on those installs the console is on 5443 and the plain port redirects there; see [HTTPS without a proxy](/docs/operations/reverse-proxy-tls#https-without-a-proxy).

The last column of the table says what the internet should reach once people use the console. The installers open the console's port anyway, so you can sign in right after the install: 3375, and 5443 only while HTTPS is on. With `TRUST_PROXY` on, or with `--domain` on Docker, they leave both closed. [Firewall on Linux](#firewall-on-linux) says which ports each installer opens and when.

### The console's port before 3.6.0-rc.5

Up to 3.6.0-rc.4 the console's default port was 5000. Which installs moved:

- New installs of any kind use 3375.
- Linux and Windows installs made before 3.6.0-rc.5 keep 5000, because the installers wrote the port into their env file, and an install whose settings name a port keeps it.
- Docker installs with the default compose file move to 3375 at their next update with the script, which says so. With `NEODESK_CONSOLE_PORT=5000` in `/opt/neodesk/docker/.env` they keep 5000. A reverse proxy in front of a Docker install has to forward to 3375 after the update unless you keep 5000.

`CONSOLE_PORT` or `PORT` in the env file (`NEODESK_CONSOLE_PORT` in Docker's `.env`) shows the port an install uses.

### The API port on Linux and Windows

Clients use 21121 on every install type. In Docker the server's API itself listens there. On a Linux or Windows install the server's API listens on 21114, and the console answers the client API on 21121 and passes it on to 21114. The installers open 21121, and the console gives clients `http://<server-address>:21121` as their API server. **What clients get now** under **Settings**, **General** shows the address in use.

In a stock RustDesk client, set **API server** to `http://<server-address>:21121`. Left empty, the client sends its API calls to port 21114 on the ID server's address:

- Docker answers there: when the API listens on another port than 21114, the server also serves it on 21114, and the compose file publishes that port. A compose file of your own needs `- "21114:21114"` in the `neodesk` service's ports.
- Linux and Windows answer there only when 21114 is open in the firewall, which the installers don't do, because the server's own API listens on that port.

Where no API answers on 21114, the device connects, but the device list shows it without host name, OS or version, and signing in from the client and the address book don't work.

The installers' self-signed certificate is not used on 21121: they set `RUSTDESK_API_TLS=false` in the env file, which keeps the port on plain HTTP, because RustDesk clients don't accept a self-signed certificate. With a certificate clients trust in `SSL_CERT_PATH` and `SSL_KEY_PATH`, set `RUSTDESK_API_TLS=auto`, and after a restart 21121 serves HTTPS and clients get an `https://` address.

### Other ports

- 21118 and 21119 take TLS only while the ID server and relay use TLS (`TLS_SIGNAL` and `TLS_RELAY`), which the Linux and Windows installers turn on with their self-signed certificate.
- 21122, the CDAP gateway, is on by default. RustDesk clients don't use it. The Docker compose files publish it, and the Docker install script opens it in ufw or firewalld whether the gateway is on or off. The Linux and Windows installers open it unless the env file sets `CDAP_ENABLED=N`; **Disable gateway** on the IoT devices page doesn't change what they open. [The gateway](/docs/console/cdap#the-gateway) explains how to turn it off.
- `ADMIN_PORT`: a management interface that is off by default, only ever listens on 127.0.0.1, and starts only with `ADMIN_PASSWORD` set.
- PostgreSQL: the `postgres` service in the compose file publishes no port.

## Remote desktop in the browser

The browser opens two WebSockets on the console's own address, `/ws/rendezvous` and `/ws/relay`, and the console passes them to the ID server and the relay inside the server. The browser therefore needs only the console's address, port 3375 or your reverse proxy. The device you connect to reaches the server on 21116 and 21117 like any RustDesk client.

Behind a reverse proxy, the proxy has to pass WebSocket upgrades for those paths. See [Remote desktop in the browser](/docs/console/remote-in-browser) for using it.

## Firewall on Linux

With ufw:

```bash
sudo ufw allow 21115/tcp
sudo ufw allow 21116/tcp
sudo ufw allow 21116/udp
sudo ufw allow 21117/tcp
sudo ufw allow 21121/tcp
```

Open the console's port too as long as no reverse proxy is in front of it, or you can't reach the console from other machines: `3375/tcp`, and `5443/tcp` on a Linux or Windows install, where the console serves HTTPS on it.

```bash
sudo ufw allow 3375/tcp
sudo ufw allow 5443/tcp
```

Add `21118/tcp` and `21119/tcp` only for clients that use WebSocket, `21122/tcp` for CDAP agents, and 443 on the machine that runs your reverse proxy.

With firewalld:

```bash
sudo firewall-cmd --permanent --add-port=21115-21117/tcp
sudo firewall-cmd --permanent --add-port=21116/udp
sudo firewall-cmd --permanent --add-port=21121/tcp
sudo firewall-cmd --permanent --add-port=3375/tcp
sudo firewall-cmd --permanent --add-port=5443/tcp
sudo firewall-cmd --reload
```

The lines with 3375 and 5443 are for the console, as long as no reverse proxy is in front of it.

The Linux installer opens the ports itself when ufw or firewalld is active, and adds iptables rules only when neither of them is installed. A ufw or firewalld that is installed but switched off stays as it is, with no rules added. The ports it opens are 21115 to 21117 over TCP, 21116 over UDP, the client API port 21121, 21122 unless the env file sets `CDAP_ENABLED=N`, and the console's port (3375 on a new install) and, with HTTPS on, 5443. With `TRUST_PROXY` on it leaves the console's ports closed. It takes the ID server and relay ports from the env file, and at the end it prints the list for a firewall outside the machine, such as your cloud provider's.

The Docker install script, `neodesk-docker.sh`, opens its ports in ufw or firewalld only when one of them is active, before the container starts, and adds no iptables rules. `install.sh` leaves this step to it, so both paths do the same. It opens 21114 to 21119, 21121 and 21122 over TCP and 21116 over UDP. It opens the console's ports by the same rule as the Linux installer, read from the `.env` file: 3375, plus 5443 with `HTTPS_ENABLED=true`, and neither with `TRUST_PROXY` on or `NEODESK_CONSOLE_BIND=127.0.0.1`. With `--domain` it opens 80 and 443 instead. Its rules carry the comment "NeoDesk port ...". A later run closes the rules it added for ports it no longer serves, so `--no-traefik` closes 80 and 443, and `uninstall` closes all of them. When `TRUST_PROXY` keeps the console's port closed, it prints the command to open it by hand. `--skip-firewall`, on both scripts, or `NEODESK_SKIP_FIREWALL=true` leaves ufw and firewalld as they are; see [Install with the script](/docs/getting-started/docker#install-with-the-script).

::: note
Docker publishes container ports over IPv4 through its own firewall rules, and ufw doesn't filter them. Visitors over IPv6 come in through the host's firewall, which is why the script opens the ports there. To keep the console off the network, publish it on the loopback address only: set `NEODESK_CONSOLE_BIND=127.0.0.1` in the `.env` file next to the compose file, or `[::1]` for IPv6 loopback, and recreate the container in that folder:

```bash
docker compose up -d
```
:::

## Firewall on Windows

In PowerShell as Administrator:

```powershell
New-NetFirewallRule -DisplayName "NeoDesk TCP" -Direction Inbound -Protocol TCP -LocalPort 21115,21116,21117,21121 -Action Allow
New-NetFirewallRule -DisplayName "NeoDesk UDP" -Direction Inbound -Protocol UDP -LocalPort 21116 -Action Allow
New-NetFirewallRule -DisplayName "NeoDesk console" -Direction Inbound -Protocol TCP -LocalPort 3375,5443 -Action Allow
```

The last line opens the console, for as long as no reverse proxy is in front of it.

The Windows installer creates inbound rules for the same ports as the Linux installer, for every network profile, each named "NeoDesk - " and what the port is for. With `TRUST_PROXY` on it removes the two rules of the console's ports, and an uninstall removes every "NeoDesk - " rule.

## Check the ports from outside

From a machine outside your network, check that the TCP ports accept connections and that the client API answers. Put your server's address in place of `<server-address>`:

```bash
nc -vz <server-address> 21115
nc -vz <server-address> 21116
nc -vz <server-address> 21117
curl http://<server-address>:21121/api/health
```

The API answers `{"status":"ok","version":"..."}`. UDP has no handshake, so `nc` can't show whether UDP 21116 is open; check the firewall rule for it instead.

## Changing a port

The console's port:

- Docker: set `NEODESK_CONSOLE_PORT=8080` in the `.env` file next to the compose file, and `NEODESK_CONSOLE_HTTPS_PORT` for 5443, then recreate the container in that folder. Inside the container the console stays on 3375 and 5443.

  ```bash
  docker compose up -d
  ```

- Linux and Windows: set `CONSOLE_PORT` (and `HTTPS_PORT`) in the env file and restart the service. On Linux:

  ```bash
  sudo systemctl restart neodesk-server
  ```

  On Windows, restart the Windows service `NeoDeskServer`. Without NSSM the server runs as the scheduled task `NeoDeskServer`; stop the server, and the task starts it again:

  ```powershell
  Restart-Service NeoDeskServer
  Stop-Process -Name neodesk-server -Force
  ```

  The first line is for the service, the second for the scheduled task.

The RustDesk ports can move too, but then every client needs the port in its server addresses, so keep the defaults unless something else holds them.

- Docker: change the host side of each mapping in `docker-compose.yml` and keep the container side. Keep the layout of the defaults (NAT test one below the ID server port, WebSocket ports two above), and set `RELAY_SERVERS` to the relay's host and new port.
- Linux and Windows: set `SIGNAL_PORT` and `RELAY_PORT` in the env file and restart the service. The NAT test and WebSocket ports move with them, and so does the relay port the server gives devices, unless the relay address names a port. The installers' update and repair keep these ports. Open the new ports in the firewall.

If clients reach the API on another port than the server listens on, for example through a different host port in Docker or a reverse proxy, set **Public API URL** under **Settings**, **General**. The console builds the API address from the port the server listens on.
