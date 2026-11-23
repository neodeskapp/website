---
title: Ports and firewall
description: Which ports NeoDesk listens on, who connects to each, which to open to the internet, and firewall commands for Linux and Windows.
order: 2
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
| 21114 | TCP (HTTP) | Linux and Windows only: the server's own API, which answers the client API calls the console passes on from 21121 | No, only to a Prometheus server |
| 21122 | TCP | CDAP device agents | Only when you use them |
| 5000 | TCP (HTTP) | Browsers: the web console, and remote desktop in the browser | Only through a reverse proxy with TLS |
| 5443 | TCP (HTTPS) | Browsers: the console when it serves HTTPS itself | Only when no reverse proxy is in front |
| 80, 443 | TCP (HTTP, HTTPS) | Browsers and Let's Encrypt: Traefik in front of the console, on Docker with [HTTPS with Let's Encrypt](/docs/getting-started/docker#https-with-lets-encrypt) | Yes, when you use it |

The server works out three of these from the others: the NAT test port is one below the ID server port, and the two WebSocket ports are two above the ID server and relay ports.

The console on port 5000 speaks plain HTTP. Open it as `http://<server-address>:5000`, or put it behind a reverse proxy with TLS before people use it over the internet; see [Reverse proxy and TLS](/docs/operations/reverse-proxy-tls). The Linux and Windows installers turn on HTTPS with a self-signed certificate, so on those installs the console is on 5443 and port 5000 redirects there; see [HTTPS without a proxy](/docs/operations/reverse-proxy-tls#https-without-a-proxy).

### The API port on Linux and Windows

Clients use 21121 on every install type. In Docker the server's API itself listens there. On a Linux or Windows install the server's API listens on 21114, and the console answers the client API on 21121 and passes it on to 21114. The installers open 21121, and the console gives clients `http://<server-address>:21121` as their API server. **What clients get now** under **Settings**, **General** shows the address in use.

In a stock RustDesk client, **API server** can stay empty or be `http://<server-address>:21121`; both work. Left empty, the client sends its API calls through the ID server on 21116.

The installers' self-signed certificate is not used on 21121: they set `RUSTDESK_API_TLS=false` in the env file, which keeps the port on plain HTTP, because RustDesk clients don't accept a self-signed certificate. With a certificate clients trust in `SSL_CERT_PATH` and `SSL_KEY_PATH`, set `RUSTDESK_API_TLS=auto`, and after a restart 21121 serves HTTPS and clients get an `https://` address.

### Other ports

- 21118 and 21119 take TLS only while the ID server and relay use TLS (`TLS_SIGNAL` and `TLS_RELAY`), which the Linux and Windows installers turn on with their self-signed certificate.
- 21122 is on by default. Docker publishes it, and the installers open it while CDAP is on. RustDesk clients don't use it. `CDAP_ENABLED=N` turns it off.
- `ADMIN_PORT`: a management interface that is off by default, only ever listens on 127.0.0.1, and starts only with `ADMIN_PASSWORD` set.
- PostgreSQL: the `postgres` service in the compose file publishes no port.

## Remote desktop in the browser

The browser opens two WebSockets on the console's own address, `/ws/rendezvous` and `/ws/relay`, and the console passes them to the ID server and the relay inside the server. The browser therefore needs only the console's address, port 5000 or your reverse proxy. The device you connect to reaches the server on 21116 and 21117 like any RustDesk client.

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

Add `21118/tcp` and `21119/tcp` only for clients that use WebSocket, `21122/tcp` for CDAP agents, and 443 on the machine that runs your reverse proxy.

With firewalld:

```bash
sudo firewall-cmd --permanent --add-port=21115-21117/tcp
sudo firewall-cmd --permanent --add-port=21116/udp
sudo firewall-cmd --permanent --add-port=21121/tcp
sudo firewall-cmd --reload
```

The Linux installer opens the ports itself when ufw or firewalld is active, and adds iptables rules when neither is: 21115 to 21117 over TCP, 21116 over UDP, the client API port 21121, 21122 while CDAP is on, and the console's port 5000 and, with HTTPS on, 5443. With `TRUST_PROXY` on it leaves the console's ports closed. It takes the ID server and relay ports from the env file, and at the end it prints the list for a firewall outside the machine, such as your cloud provider's.

::: note
Docker publishes container ports through its own firewall rules, and ufw does not filter them. To keep the console off the network, publish it on the loopback address only: set `NEODESK_CONSOLE_BIND=127.0.0.1` in the `.env` file next to the compose file and recreate the container in that folder:

```bash
docker compose up -d
```
:::

## Firewall on Windows

In PowerShell as Administrator:

```powershell
New-NetFirewallRule -DisplayName "NeoDesk TCP" -Direction Inbound -Protocol TCP -LocalPort 21115,21116,21117,21121 -Action Allow
New-NetFirewallRule -DisplayName "NeoDesk UDP" -Direction Inbound -Protocol UDP -LocalPort 21116 -Action Allow
```

The Windows installer creates inbound rules for the same ports as the Linux installer, each named "NeoDesk - " and what the port is for.

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

- Docker: set `NEODESK_CONSOLE_PORT=8080` in the `.env` file next to the compose file, and `NEODESK_CONSOLE_HTTPS_PORT` for 5443, then recreate the container in that folder. Inside the container the console stays on 5000 and 5443.

  ```bash
  docker compose up -d
  ```

- Linux and Windows: set `CONSOLE_PORT` (and `HTTPS_PORT`) in the env file and restart the service.

The RustDesk ports can move too, but then every client needs the port in its server addresses, so keep the defaults unless something else holds them.

- Docker: change the host side of each mapping in `docker-compose.yml` and keep the container side. Keep the layout of the defaults (NAT test one below the ID server port, WebSocket ports two above), and set `RELAY_SERVERS` to the relay's host and new port.
- Linux and Windows: set `SIGNAL_PORT` and `RELAY_PORT` in the env file and restart the service. The NAT test and WebSocket ports move with them, and so does the relay port the server gives devices, unless the relay address names a port. The installers' update and repair keep these ports. Open the new ports in the firewall.

If clients reach the API on another port than the server listens on, for example through a different host port in Docker or a reverse proxy, set **Public API URL** under **Settings**, **General**. The console builds the API address from the port the server listens on.
