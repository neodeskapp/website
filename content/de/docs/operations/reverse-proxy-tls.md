---
title: Reverse Proxy und TLS
description: Der Web-Konsole HTTPS geben, mit Let's Encrypt unter Docker, mit nginx oder Caddy davor oder mit eigenem Zertifikat, und prüfen, was Clients bekommen.
order: 3
---

Die Web-Konsole lauscht auf Port 3375 mit unverschlüsseltem HTTP. Bevor Menschen sie über das Internet nutzen, gib ihr HTTPS. Auch Remote Desktop im Browser braucht es: Über einfaches HTTP zeigt der Viewer nur Geräte mit Hardware-Encoder für H.264 (siehe [HTTPS für jedes Gerät](/docs/console/remote-in-browser#https-for-every-device)). Es gibt drei Wege zu HTTPS:

- Docker mit einem DNS-Namen für den Server: Das Installationsskript setzt Traefik vor die Konsole, mit einem Zertifikat von Let's Encrypt. Siehe [HTTPS mit Let's Encrypt unter Docker](#https-with-lets-encrypt-on-docker).
- Ein eigener Reverse Proxy, etwa nginx oder Caddy. Um diesen Weg geht es auf dem größten Teil dieser Seite, ab [Was über den Proxy läuft](#what-goes-through-the-proxy), mit vollständigen Beispielen, den Einstellungen, die NeoDesk hinter einem Proxy braucht, und dem, was ein Proxy nicht weiterleiten kann.
- Das eigene HTTPS der Konsole, mit einem Zertifikat, das du ihr gibst. Siehe [HTTPS ohne Proxy](#https-without-a-proxy).

## HTTPS mit Let's Encrypt unter Docker {#https-with-lets-encrypt-on-docker}

Bei einer Docker-Installation lassen `--domain` und `--email` das Installationsskript einen Traefik-Container vor die Konsole setzen. Traefik holt für den Namen ein Zertifikat von Let's Encrypt, erneuert es selbst und leitet einfaches HTTP auf HTTPS weiter. Der Name muss auf den Server zeigen, und die Ports 80 und 443 müssen auf dem Host frei und aus dem Internet erreichbar sein.

Für eine Installation, die schon läuft, führst du das Skript in `/opt/neodesk/docker` aus und setzt für `<domain>` den DNS-Namen und für `<email-address>` deine E-Mail-Adresse ein:

```bash
sudo bash neodesk-docker.sh --domain <domain> --email <email-address>
```

Die Ein-Zeilen-Installation nimmt dasselbe als `--domain` und `--letsencrypt-email`. Das Skript schaltet das Compose-Profil `traefik` ein, veröffentlicht die eigenen Ports der Konsole, 3375 und 5443, nur noch auf `127.0.0.1` und setzt `TRUST_PROXY=1` und `PANEL_PUBLIC_URL=https://<domain>`. `--letsencrypt-staging` holt ein Testzertifikat vom Staging-Server von Let's Encrypt, und `--no-traefik` nimmt alles wieder heraus, auch `TRUST_PROXY`. Die Details stehen unter [HTTPS mit Let's Encrypt](/docs/getting-started/docker#https-with-lets-encrypt) auf der Docker-Seite.

Nimm stattdessen einen eigenen Proxy, wenn ein anderer Webserver auf dem Host schon die Ports 80 und 443 belegt, oder wenn der Server aus dem Internet nicht auf Port 80 erreichbar ist, über den Let's Encrypt den Namen prüft.

## An welchen Port der Proxy weiterleitet {#which-port-the-proxy-forwards-to}

Der Standardport der Konsole ist seit 3.6.0-rc.5 3375; vorher war es 5000. Die Beispiele auf dieser Seite nutzen 3375.

- Neue Installationen nutzen 3375.
- Installationen unter Linux und Windows, die vor 3.6.0-rc.5 entstanden sind, behalten 5000, weil ihre env-Datei den Port nennt. Ein Proxy davor bleibt bei 5000.
- Docker-Installationen mit der mitgelieferten Compose-Datei wechseln beim nächsten Update mit dem Skript auf 3375. Nach diesem Update muss ein Proxy vor einer Docker-Installation an 3375 weiterleiten, außer du bleibst mit `NEODESK_CONSOLE_PORT=5000` in `/opt/neodesk/docker/.env` bei 5000. Traefik, eingerichtet mit `--domain`, zieht von selbst mit.

`CONSOLE_PORT` oder `PORT` in der env-Datei und `NEODESK_CONSOLE_PORT` in der `.env` unter Docker nennen den Port, den eine Installation nutzt. Siehe [Ports und Firewall](/docs/operations/ports#the-consoles-port-before-360-rc5).

## Was über den Proxy läuft {#what-goes-through-the-proxy}

- Die Konsole auf Port 3375: ihre Seiten, ihre API unter `/api/` und ihre WebSockets unter `/ws/`, über die Remote Desktop im Browser und Live-Updates laufen. Der Proxy muss WebSocket-Upgrades durchreichen.
- Wenn Clients eine HTTPS-Adresse für die API bekommen sollen, auch der API-Port, auf einem eigenen Hostnamen. Siehe [HTTPS für die Client-API](#https-for-the-client-api).

Der ID-Server (21116, TCP und UDP), das Relay (21117) und der NAT-Test (21115) sprechen das RustDesk-Protokoll, kein HTTP. Ein HTTP-Proxy kann sie nicht weiterleiten, deshalb verbinden sich Clients direkt mit diesen Ports. Siehe [Ports und Firewall](/docs/operations/ports).

Schicke jeden Pfad auf dem Hostnamen der Konsole an die Konsole. Sie nutzt `/ws/rendezvous` und `/ws/relay` selbst für Remote Desktop im Browser, leite diese Pfade also nicht auf einen anderen Port um.

## Die Konsole lokal halten {#keep-the-console-local}

Läuft der Proxy auf demselben Rechner, lass nur den Proxy an den Port der Konsole:

- Docker: Setze `NEODESK_CONSOLE_BIND=127.0.0.1` in der Datei `.env` neben der Compose-Datei und erstelle den Container danach in diesem Ordner neu. Die Ports der Konsole werden dann nur auf der Loopback-Adresse veröffentlicht. Mit `--domain` setzt das Installationsskript das selbst.

  ```bash
  docker compose up -d
  ```

- Linux und Windows: Setze `HOST=127.0.0.1` in der env-Datei. Die Installer schalten außerdem HTTPS mit einem selbst signierten Zertifikat ein, und der unverschlüsselte Port leitet dann nur auf 5443 weiter. Setze deshalb auch `HTTPS_ENABLED=false`. Starte den Dienst neu.

Läuft der Proxy auf einem anderen Rechner, behalte `HOST=0.0.0.0` und gib den Port der Konsole in der Firewall nur für die Adresse des Proxys frei.

Unter Linux kann der Installer diese Einstellungen vornehmen. Starte ihn:

```bash
sudo neodesk-setup
```

Wähle dann **Configure SSL certificates** und danach **External reverse proxy**. Eine neue Installation bietet dasselbe an ihrem Ende an. Der Installer fragt nach dem öffentlichen Hostnamen der Konsole, schaltet das eigene HTTPS der Konsole aus und setzt `HOST`, `TRUST_PROXY=Y`, `PANEL_PUBLIC_HOST`, `PANEL_PUBLIC_URL`, `PUBLIC_SERVER_ID`, `WS_ALLOWED_ORIGINS` und, für einen Proxy auf demselben Rechner, `TRUSTED_PROXIES`. Er schaltet außerdem TLS auf ID-Server und Relay aus und schreibt Beispielkonfigurationen für Caddy oder nginx nach `/opt/neodesk/reverse-proxy/`.

## nginx {#nginx}

Hol dir zuerst ein Zertifikat für den Hostnamen der Konsole, zum Beispiel mit certbot; die Pfade unten sind die, unter denen certbot es ablegt. Speichere dann diese Konfiguration als Site, zum Beispiel als `/etc/nginx/conf.d/neodesk.conf`, und setze für `<server-address>` den Hostnamen ein:

```nginx
map $http_upgrade $connection_upgrade {
    default upgrade;
    ''      close;
}

server {
    listen 80;
    listen [::]:80;
    server_name <server-address>;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name <server-address>;

    ssl_certificate     /etc/letsencrypt/live/<server-address>/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/<server-address>/privkey.pem;

    # The console takes backups of up to 200 MB for a restore
    client_max_body_size 200m;

    location / {
        proxy_pass http://127.0.0.1:3375;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;
        proxy_read_timeout 1h;
        proxy_send_timeout 1h;
    }
}
```

Die langen Timeouts halten Remote-Sitzungen im Browser offen. `$proxy_add_x_forwarded_for` funktioniert genauso wie `$remote_addr`: Die Konsole und die API des Servers gehen `X-Forwarded-For` von rechts durch und nehmen die erste Adresse, die kein vertrauenswürdiger Proxy ist. Einträge, die ein Client selbst geschrieben hat, zählen deshalb nicht.

Prüfe die Konfiguration und lade sie:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## Caddy {#caddy}

Caddy holt und erneuert das Zertifikat selbst, reicht WebSocket-Upgrades durch und setzt die Forwarded-Header. Füge das hier in `/etc/caddy/Caddyfile` ein und setze für `<server-address>` den Hostnamen der Konsole ein:

```caddy
<server-address> {
	reverse_proxy 127.0.0.1:3375
}
```

Lade Caddy dann neu:

```bash
sudo systemctl reload caddy
```

## Dem Proxy vertrauen {#trusting-the-proxy}

Hinter einem Proxy erreicht jede Anfrage NeoDesk von der Adresse des Proxys. `TRUST_PROXY` sagt NeoDesk, die Adresse des Clients, das Schema und den Host stattdessen aus den Headern des Proxys zu nehmen. Ohne die Variable zählen die Anmeldelimits und Sperren jeden Menschen als den Proxy, und das Aktivitätsprotokoll zeigt die Adresse des Proxys.

Zwei Teile des Servers lesen sie:

- Die Konsole liest nur `TRUST_PROXY`. Ein eingeschalteter Wert wie `Y`, `true` oder `1` vertraut einem Proxy davor, eine größere Zahl entsprechend vielen. Eine kommagetrennte Liste von Adressen oder Adressbereichen (oder `loopback`, `linklocal`, `uniquelocal`) vertraut Proxys mit diesen Adressen.
- Die API- und WebSocket-Ports des Servers lesen weitergeleitete Header nur mit eingeschaltetem `TRUST_PROXY` und nur von den Adressen in `TRUSTED_PROXIES`. Ohne `TRUSTED_PROXIES` loggt der Server eine Warnung und ignoriert die Header. Das betrifft Anfragen, die der Proxy an die eigenen Ports des Servers schickt, etwa beim API-Host weiter unten.

`Y` funktioniert für beide Teile. Für einen Proxy auf demselben Rechner wie eine Installation unter Linux oder Windows trägst du das in die env-Datei ein:

```ini
TRUST_PROXY=Y
TRUSTED_PROXIES=127.0.0.1/32,::1/128
```

Unter Docker kommen beide Zeilen in die Datei `.env` neben der Compose-Datei. Anfragen von einem Proxy auf dem Host erreichen den Container aus dem Docker-Netz, nimm für `TRUSTED_PROXIES` also den Adressbereich dieses Netzes. Compose stellt dem Namen des Netzes den Namen des Installationsordners voran: Eine Installation mit dem Skript, in `/opt/neodesk/docker`, hat das Netz `docker_neodesk-net`, eine Compose-Datei in einem Ordner `neodesk` hat `neodesk_neodesk-net`. `docker network ls` listet die Netze. Bei einer Installation mit dem Skript zeigt dieser Befehl den Bereich unter `Subnet`:

```bash
docker network inspect docker_neodesk-net
```

::: warning
`TRUST_PROXY=Y` vertraut jedem, der sich mit der Konsole verbindet. Stelle sicher, dass nur der Proxy den Port der Konsole erreicht, sonst kann jeder eine beliebige Adresse vorgeben.
:::

## Sichere Cookies {#secure-cookies}

Die Konsole markiert ihre Sitzungs- und Formular-Cookies als Secure, wenn die Anfrage über HTTPS kam: auf ihrem eigenen HTTPS-Port oder über einen vertrauenswürdigen Proxy, der `X-Forwarded-Proto: https` sendet. Hinter einem Proxy, der TLS beendet, setzt du `TRUST_PROXY` und lässt `HTTPS_ENABLED` aus. nginx mit der Konfiguration oben und Caddy senden diesen Header beide.

`HTTPS_ENABLED=true` gehört zu einer Konsole, die HTTPS selbst ausliefert. Mit einem Zertifikat in `SSL_CERT_PATH` und `SSL_KEY_PATH` leitet der unverschlüsselte Port dann nur auf den eigenen HTTPS-Port weiter, und ein Proxy, der Anfragen an den unverschlüsselten Port schickt, bekommt keine Konsole. Die Installer für Linux und Windows schalten es ein. Setze dort also `HTTPS_ENABLED=false`, wenn ein Proxy davor sitzt, wie unter [Die Konsole lokal halten](#keep-the-console-local).

## HTTPS für die Client-API {#https-for-the-client-api}

Um Clients eine HTTPS-Adresse für die API zu geben, leite einen zweiten Hostnamen über den Proxy an den Port der Client-API, 21121 bei jeder Installationsart. Die API braucht einen eigenen Hostnamen, weil die Konsole eigene `/api/`-Pfade hat. Für nginx fügst du diesen Server-Block neben dem oben ein und setzt für `<api-address>` den Hostnamen der API ein:

```nginx
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name <api-address>;

    ssl_certificate     /etc/letsencrypt/live/<api-address>/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/<api-address>/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:21121;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;
    }
}
```

Für Caddy setzt du für `<api-address>` ebenfalls den Hostnamen der API ein:

```caddy
<api-address> {
	reverse_proxy 127.0.0.1:21121
}
```

Trage dann `https://<api-address>` als **Öffentliche API-URL** unter **Einstellungen**, **Allgemein** ein, und setze `TRUSTED_PROXIES` wie oben beschrieben.

Der Server kann TLS auf seinem API-Port auch selbst ausliefern, mit `TLS_API=Y`, `TLS_CERT` und `TLS_KEY`. Der Port nimmt dann nur noch HTTPS an, und Clients, die mit einer `http://`-Adresse eingerichtet sind, scheitern. `TLS_SIGNAL=Y` und `TLS_RELAY=Y` funktionieren anders: Sie fügen den Ports von ID-Server und Relay TLS hinzu und nehmen dort weiterhin unverschlüsselte Verbindungen an.

## Mesh-Agents hinter einem Proxy {#mesh-agents-behind-a-proxy}

Mesh-Agents, die den Server über den Proxy erreichen, sehen das Zertifikat des Proxys. Ist `TLS_CERT` gesetzt, wie bei einer Installation unter Linux oder Windows, bei der der Installer Zertifikate erzeugt hat, prüft der Server, ob ein Mesh-Agent dieses Zertifikat gesehen hat, und weist einen Agent ab, der ein anderes gesehen hat. Lass `MESH_WEB_CERT_FILE` auf eine Kopie des Proxy-Zertifikats zeigen, die der Dienst lesen kann. Der Server liest sie beim Start, starte ihn also neu, nachdem der Proxy das Zertifikat erneuert hat.

## HTTPS ohne Proxy {#https-without-a-proxy}

Die Konsole kann HTTPS selbst ausliefern: Setze `HTTPS_ENABLED=true`, `SSL_CERT_PATH` und `SSL_KEY_PATH` (und `SSL_CA_PATH` für eine Zertifikatskette in einer eigenen Datei). Sie lauscht dann mit TLS auf `HTTPS_PORT`, standardmäßig 5443, und der unverschlüsselte Port (`CONSOLE_PORT`, standardmäßig 3375) leitet jede Anfrage dorthin weiter, an den Host, den `PANEL_PUBLIC_HOST` nennt, oder an die eine Adresse, auf der die Konsole lauscht. Lauscht die Konsole auf allen Adressen und ist `PANEL_PUBLIC_HOST` nicht gesetzt, leitet der unverschlüsselte Port nicht weiter, sondern zeigt eine Seite, die nach dem Wert fragt. `HTTP_REDIRECT_HTTPS=false` schaltet die Weiterleitung aus.

Die Installer für Linux und Windows richten das bei einer neuen Installation mit einem selbst signierten Zertifikat ein, das zehn Jahre gilt. Sie setzen `PANEL_PUBLIC_HOST` auf die Adresse, die die Clients nutzen, außer die env-Datei enthält schon eine. Unter Linux ersetzt das Menü **Configure SSL certificates** des Installers das Zertifikat durch eines von Let's Encrypt, ein eigenes oder ein neues selbst signiertes. Ein Let's-Encrypt-Zertifikat wird nach `/opt/neodesk/ssl/` kopiert, wo das Dienstkonto es lesen kann, und ein Deploy-Hook von certbot kopiert es nach jeder Erneuerung erneut und startet den Server neu. Das Menü bietet außerdem Port 443 an, mit Port 80 für die Weiterleitung, und gibt dem Dienst das Recht, Ports unter 1024 zu nutzen. Ohne dieses Recht weicht die Konsole auf 5443 und ihren unverschlüsselten Port aus.

## Die Adressen prüfen, die Clients bekommen {#check-the-addresses-clients-get}

Öffne **Einstellungen**, **Allgemein**. Trage unter **Öffentliche Client-Endpunkte** den Hostnamen, den Clients für den ID-Server nutzen, als **Öffentlicher ID-Server** ein. Hast du die API über den Proxy geleitet, trage deine API-Adresse als **Öffentliche API-URL** ein. **Was Clients jetzt erhalten** rechts daneben zeigt die Werte, die die Client-Einrichtung, die QR-Codes und die Installationsbefehle nutzen.

![Die allgemeinen Einstellungen mit den öffentlichen Client-Endpunkten und dem, was Clients jetzt erhalten](shot:settings)

Prüfe dann den Rest:

- Setze `PANEL_PUBLIC_URL=https://<server-address>`, damit Links in E-Mails auf den Proxy zeigen. Unter Docker kommt das in die Datei `.env`.
- `curl https://<server-address>/health` antwortet über den Proxy mit `{"status":"ok",...}`.
- Melde dich über den Proxy an. Die Entwicklerwerkzeuge des Browsers zeigen das Sitzungs-Cookie, `nd.sid` (oder `neodesk.sid` mit `HTTPS_ENABLED=true`), als Secure.
- Clients brauchen weiterhin offene Ports für ID-Server und Relay. Siehe [Einen RustDesk-Client verbinden](/docs/getting-started/connect-a-client).
