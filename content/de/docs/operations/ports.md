---
title: Ports und Firewall
description: Auf welchen Ports NeoDesk lauscht, wer sich mit welchem verbindet, welche du zum Internet öffnest, und Firewall-Befehle für Linux und Windows.
order: 2
seoTitle: NeoDesk: Ports und Firewall für RustDesk-Clients
---

RustDesk-Clients erreichen den Server über eine Handvoll Ports, und die Web-Konsole öffnen Menschen im Browser auf einem weiteren Port. Diese Seite listet die Ports auf, sagt, welche aus dem Internet erreichbar sein müssen, und zeigt, wie du sie öffnest.

## Die Ports {#the-ports}

| Port | Protokoll | Wer sich verbindet | Zum Internet offen |
|---|---|---|---|
| 21115 | TCP | RustDesk-Clients, für den Test des NAT-Typs | Ja, für Clients außerhalb deines Netzes |
| 21116 | TCP und UDP | RustDesk-Clients: der ID-Server, bei dem sie sich registrieren und Verbindungen anfragen | Ja |
| 21117 | TCP | RustDesk-Clients: das Relay, das einspringt, wenn keine direkte Verbindung klappt | Ja |
| 21118 | TCP | RustDesk-Clients, die auf WebSocket eingestellt sind: der ID-Server | Nur für solche Clients |
| 21119 | TCP | RustDesk-Clients, die auf WebSocket eingestellt sind: das Relay | Nur für solche Clients |
| 21121 | TCP (HTTP) | RustDesk-Clients: die Client-API, für Systeminformationen, Anmeldung und das Adressbuch | Ja |
| 21114 | TCP (HTTP) | Nur Linux und Windows: die eigene API des Servers, mit `/metrics` für Prometheus. Die Konsole reicht die Aufrufe der Client-API von 21121 innerhalb des Servers an sie weiter, Clients und Browser verbinden sich hier also nicht | Nur von einem Prometheus-Server, der `/metrics` liest. Die Installer öffnen den Port nicht |
| 21122 | TCP | CDAP-Geräte-Agents | Nur, wenn du sie nutzt |
| 3375 | TCP (HTTP) | Browser: die Web-Konsole und Remote Desktop im Browser | Nur über einen Reverse Proxy mit TLS |
| 5443 | TCP (HTTPS) | Browser: die Konsole, wenn sie HTTPS selbst ausliefert | Nur, wenn kein Reverse Proxy davor steht |
| 80, 443 | TCP (HTTP, HTTPS) | Browser und Let's Encrypt: Traefik vor der Konsole, unter Docker mit [HTTPS mit Let's Encrypt](/docs/getting-started/docker#https-with-lets-encrypt) | Ja, wenn du es nutzt |

Drei davon leitet der Server aus den anderen ab: Der Port für den NAT-Test liegt eins unter dem Port des ID-Servers, und die beiden WebSocket-Ports liegen zwei über den Ports von ID-Server und Relay.

Die Konsole auf Port 3375 spricht unverschlüsseltes HTTP. Öffne sie als `http://<server-address>:3375`, oder setze einen Reverse Proxy mit TLS davor, bevor Menschen sie über das Internet nutzen; siehe [Reverse Proxy und TLS](/docs/operations/reverse-proxy-tls). Die Installer für Linux und Windows schalten HTTPS mit einem selbst signierten Zertifikat ein. Bei diesen Installationen liegt die Konsole deshalb auf 5443, und der unverschlüsselte Port leitet dorthin weiter; siehe [HTTPS ohne Proxy](/docs/operations/reverse-proxy-tls#https-without-a-proxy).

Die letzte Spalte der Tabelle sagt, was das Internet erreichen soll, sobald Menschen die Konsole nutzen. Die Installer öffnen die Ports der Konsole trotzdem, damit du dich gleich nach der Installation anmelden kannst. [Firewall unter Linux](#firewall-on-linux) sagt, welche Ports jeder Installer wann öffnet.

### Der Port der Konsole vor 3.6.0-rc.5 {#the-consoles-port-before-360-rc5}

Bis 3.6.0-rc.4 war der Standardport der Konsole 5000. Welche Installationen gewechselt haben:

- Neue Installationen jeder Art nutzen 3375.
- Installationen unter Linux und Windows, die vor 3.6.0-rc.5 entstanden sind, behalten 5000, weil die Installer den Port in ihre env-Datei geschrieben haben und eine Installation, deren Einstellungen einen Port nennen, ihn behält.
- Docker-Installationen mit der mitgelieferten Compose-Datei wechseln beim nächsten Update mit dem Skript auf 3375, und das Update sagt das. Mit `NEODESK_CONSOLE_PORT=5000` in `/opt/neodesk/docker/.env` bleiben sie bei 5000. Ein Reverse Proxy vor einer Docker-Installation muss nach dem Update an 3375 weiterleiten, außer du bleibst bei 5000.

`CONSOLE_PORT` oder `PORT` in der env-Datei (`NEODESK_CONSOLE_PORT` in der `.env` unter Docker) zeigt, welchen Port eine Installation nutzt.

### Der API-Port unter Linux und Windows {#the-api-port-on-linux-and-windows}

Clients nutzen 21121 bei jeder Installationsart. Unter Docker lauscht dort die API des Servers selbst. Bei einer Installation unter Linux oder Windows lauscht die API des Servers auf 21114, und die Konsole beantwortet die Client-API auf 21121 und reicht sie an 21114 weiter. Die Installer öffnen 21121, und die Konsole gibt den Clients `http://<server-address>:21121` als API-Server. **Was Clients jetzt erhalten** unter **Einstellungen**, **Allgemein** zeigt die Adresse, die gerade gilt.

In einem normalen RustDesk-Client kann **API-Server** leer bleiben oder `http://<server-address>:21121` sein; beides funktioniert. Bleibt das Feld leer, schickt der Client seine API-Aufrufe über den ID-Server auf 21116.

Das selbst signierte Zertifikat der Installer wird auf 21121 nicht genutzt. Die Installer setzen `RUSTDESK_API_TLS=false` in der env-Datei, was den Port bei unverschlüsseltem HTTP hält, weil RustDesk-Clients kein selbst signiertes Zertifikat akzeptieren. Hast du in `SSL_CERT_PATH` und `SSL_KEY_PATH` ein Zertifikat, dem die Clients vertrauen, setze `RUSTDESK_API_TLS=auto`. Nach einem Neustart liefert 21121 dann HTTPS aus, und die Clients bekommen eine `https://`-Adresse.

### Weitere Ports {#other-ports}

- 21118 und 21119 nehmen nur TLS an, solange ID-Server und Relay TLS nutzen (`TLS_SIGNAL` und `TLS_RELAY`). Die Installer für Linux und Windows schalten das mit ihrem selbst signierten Zertifikat ein.
- 21122, das CDAP-Gateway, ist standardmäßig an. RustDesk-Clients nutzen ihn nicht. Die Docker-Compose-Dateien veröffentlichen ihn, und die Ein-Zeilen-Installation für Docker öffnet ihn in ufw oder firewalld, ob das Gateway an oder aus ist. Die Installer für Linux und Windows öffnen ihn, außer die env-Datei setzt `CDAP_ENABLED=N`; **Gateway ausschalten** auf der Seite der IoT-Geräte ändert nichts daran, was sie öffnen. [Das Gateway](/docs/console/cdap#the-gateway) erklärt, wie du es ausschaltest.
- `ADMIN_PORT`: eine Verwaltungsschnittstelle, die standardmäßig aus ist, immer nur auf 127.0.0.1 lauscht und nur startet, wenn `ADMIN_PASSWORD` gesetzt ist.
- PostgreSQL: Der Dienst `postgres` in der Compose-Datei veröffentlicht keinen Port.

## Remote Desktop im Browser {#remote-desktop-in-the-browser}

Der Browser öffnet zwei WebSockets auf der Adresse der Konsole, `/ws/rendezvous` und `/ws/relay`, und die Konsole reicht sie innerhalb des Servers an ID-Server und Relay weiter. Der Browser braucht deshalb nur die Adresse der Konsole, also Port 3375 oder deinen Reverse Proxy. Das Gerät, mit dem du dich verbindest, erreicht den Server wie jeder RustDesk-Client auf 21116 und 21117.

Hinter einem Reverse Proxy muss der Proxy WebSocket-Upgrades für diese Pfade durchreichen. Wie du Remote Desktop im Browser benutzt, steht unter [Remote Desktop im Browser](/docs/console/remote-in-browser).

## Firewall unter Linux {#firewall-on-linux}

Mit ufw:

```bash
sudo ufw allow 21115/tcp
sudo ufw allow 21116/tcp
sudo ufw allow 21116/udp
sudo ufw allow 21117/tcp
sudo ufw allow 21121/tcp
```

Füge `21118/tcp` und `21119/tcp` nur für Clients hinzu, die WebSocket nutzen, `21122/tcp` für CDAP-Agents und 443 auf dem Rechner, auf dem dein Reverse Proxy läuft.

Mit firewalld:

```bash
sudo firewall-cmd --permanent --add-port=21115-21117/tcp
sudo firewall-cmd --permanent --add-port=21116/udp
sudo firewall-cmd --permanent --add-port=21121/tcp
sudo firewall-cmd --reload
```

Der Linux-Installer öffnet die Ports selbst, wenn ufw oder firewalld aktiv ist, und legt iptables-Regeln nur an, wenn keins von beiden installiert ist. Ein ufw oder firewalld, das installiert, aber ausgeschaltet ist, bleibt, wie es ist, ohne neue Regeln. Er öffnet 21115 bis 21117 über TCP, 21116 über UDP, den Port 21121 der Client-API, 21122, außer die env-Datei setzt `CDAP_ENABLED=N`, sowie den Port der Konsole (3375 bei einer neuen Installation) und, mit eingeschaltetem HTTPS, 5443. Ist `TRUST_PROXY` eingeschaltet, lässt er die Ports der Konsole geschlossen. Die Ports von ID-Server und Relay nimmt er aus der env-Datei, und am Ende gibt er die Liste für eine Firewall außerhalb des Rechners aus, etwa die deines Cloud-Anbieters.

Die Ein-Zeilen-Installation für Docker öffnet ihre Ports in ufw oder firewalld nur, wenn eines davon aktiv ist, und legt keine iptables-Regeln an. Sie öffnet 21115 bis 21119, 21121, 21122 und die Ports 3375 und 5443 der Konsole über TCP sowie 21116 über UDP. Mit `--domain` öffnet sie 80 und 443 statt 3375 und 5443. `TRUST_PROXY` beachtet sie nicht; siehe [Mit dem Skript installieren](/docs/getting-started/docker#install-with-the-script).

::: note
Docker veröffentlicht Container-Ports über eigene Firewall-Regeln, und ufw filtert sie nicht. Um die Konsole vom Netz fernzuhalten, veröffentliche sie nur auf der Loopback-Adresse: Setze `NEODESK_CONSOLE_BIND=127.0.0.1` in der Datei `.env` neben der Compose-Datei und erstelle den Container in diesem Ordner neu:

```bash
docker compose up -d
```
:::

## Firewall unter Windows {#firewall-on-windows}

In PowerShell als Administrator:

```powershell
New-NetFirewallRule -DisplayName "NeoDesk TCP" -Direction Inbound -Protocol TCP -LocalPort 21115,21116,21117,21121 -Action Allow
New-NetFirewallRule -DisplayName "NeoDesk UDP" -Direction Inbound -Protocol UDP -LocalPort 21116 -Action Allow
```

Der Windows-Installer legt eingehende Regeln für dieselben Ports an wie der Linux-Installer. Ihre Namen beginnen mit „NeoDesk - “, gefolgt vom Zweck des Ports.

## Ports von außen prüfen {#check-the-ports-from-outside}

Prüfe von einem Rechner außerhalb deines Netzes, ob die TCP-Ports Verbindungen annehmen und die Client-API antwortet. Setze für `<server-address>` die Adresse deines Servers ein:

```bash
nc -vz <server-address> 21115
nc -vz <server-address> 21116
nc -vz <server-address> 21117
curl http://<server-address>:21121/api/health
```

Die API antwortet mit `{"status":"ok","version":"..."}`. UDP kennt keinen Handshake, deshalb kann `nc` nicht zeigen, ob UDP 21116 offen ist. Prüfe stattdessen die Firewall-Regel dafür.

## Einen Port ändern {#changing-a-port}

Der Port der Konsole:

- Docker: Setze `NEODESK_CONSOLE_PORT=8080` in der Datei `.env` neben der Compose-Datei, für 5443 `NEODESK_CONSOLE_HTTPS_PORT`, und erstelle den Container danach in diesem Ordner neu. Im Container bleibt die Konsole auf 3375 und 5443.

  ```bash
  docker compose up -d
  ```

- Linux und Windows: Setze `CONSOLE_PORT` (und `HTTPS_PORT`) in der env-Datei und starte den Dienst neu.

Die RustDesk-Ports lassen sich auch verlegen, aber dann braucht jeder Client den Port in seinen Serveradressen. Behalte deshalb die Standardwerte, solange nichts anderes sie belegt.

- Docker: Ändere in `docker-compose.yml` die Host-Seite jeder Zuordnung und lass die Container-Seite, wie sie ist. Behalte die Anordnung der Standardwerte bei (NAT-Test eins unter dem Port des ID-Servers, WebSocket-Ports zwei darüber), und setze `RELAY_SERVERS` auf den Host und den neuen Port des Relays.
- Linux und Windows: Setze `SIGNAL_PORT` und `RELAY_PORT` in der env-Datei und starte den Dienst neu. Die Ports für NAT-Test und WebSocket ziehen mit, ebenso der Relay-Port, den der Server den Geräten gibt, außer die Relay-Adresse nennt einen Port. Update und Reparatur der Installer behalten diese Ports bei. Öffne die neuen Ports in der Firewall.

Erreichen Clients die API auf einem anderen Port als dem, auf dem der Server lauscht, etwa über einen anderen Host-Port unter Docker oder über einen Reverse Proxy, setze **Öffentliche API-URL** unter **Einstellungen**, **Allgemein**. Die Konsole baut die API-Adresse aus dem Port, auf dem der Server lauscht.
