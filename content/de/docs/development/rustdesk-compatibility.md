---
title: Kompatibilität mit RustDesk
description: Wie der Server mit dem normalen RustDesk-Client kompatibel bleibt, die Checkliste für ein neues RustDesk-Release und was die Upstream-Überwachung macht.
order: 9
---

NeoDesk funktioniert mit dem normalen RustDesk-Client aus den Releases von RustDesk. Am Client wird nichts geändert: Der Server spricht das Protokoll und die HTTP-API des Clients. Diese Seite beschreibt, was der Server spricht, welche Entscheidungen im Code dafür sorgen, dass normale Clients funktionieren, und wie du ein neues RustDesk-Release prüfst.

Der Server von NeoDesk ist ein eigenes Programm in Go und nicht der Server von RustDesk. Verfolge die Server-Releases von RustDesk nur, um Protokoll und API auf demselben Stand zu halten, und kopiere nichts aus den Quellen von RustDesk ins Repository; siehe [Clean-Room-Herkunftsnachweis](/docs/development/provenance).

## Was der Server spricht {#what-the-server-speaks}

### Ports und Transportwege {#ports-and-transports}

Der ID-Server lauscht auf 21116 über UDP und TCP, der NAT-Test einen Port darunter und das Relay auf 21117. Beide haben zwei Ports höher einen WebSocket (21118 und 21119). [Ports](/docs/operations/ports) hat die vollständige Liste.

- **UDP**: Ein Datagramm ist eine Nachricht.
- **TCP**: Jede Nachricht hat den variablen Header von RustDesk mit 1 bis 4 Byte. Die zwei niedrigsten Bits des ersten Bytes sind die Länge des Headers minus eins; der Rest des Headers, als Little Endian gelesen und um zwei Bits nach rechts verschoben, ist die Länge der Nutzdaten. Der Server nimmt auf dem ID-Server Nachrichten bis 64 KiB an, und bis 16 MiB Sitzungsdaten, wenn er ein TCP-Ende und ein WebSocket-Ende eines Relays verbindet.
- **WebSocket**: Eine binäre Nachricht ist eine Protobuf-Nachricht.

Über TCP bietet der ID-Server neueren Clients zuerst einen Schlüsselaustausch an und verschlüsselt dann die Verbindung; ein älterer Client, der etwas anderes schickt, wird unverschlüsselt bedient. TLS auf diesen Ports ist optional, und der Server unterscheidet eine TLS-Verbindung an ihrem ersten Byte von einer einfachen. Siehe [Sicherheitsmodell](/docs/development/security-model#the-id-server-connection).

### Die Nachrichten {#the-messages}

Die Nachrichten sind Protobuf, definiert in `neodesk-server/protos/rendezvous.proto` (die Nachrichten des ID-Servers) und `message.proto` (was zwei Clients einander schicken), im Paket `hbb`. Der daraus erzeugte Go-Code ist in `neodesk-server/proto/` eingecheckt. Der Viewer im Browser erzeugt bei jedem Build seinen eigenen aus denselben Dateien. Das Relay liest nur die erste Nachricht jeder Verbindung, um die beiden Enden über ihre UUID zusammenzuführen, und kopiert alles danach, ohne es zu lesen.

### Die Client-API {#the-client-api}

Der RustDesk-Client meldet sich über HTTP an, gleicht sein Adressbuch ab und meldet Daten über sich. Der API-Server beantwortet diese Routen, und der Client-API-Port der Konsole reicht sie an ihn weiter:

| Route | Was der Client macht |
|---|---|
| `POST /api/login`, `GET /api/login-options`, `POST /api/oidc/auth`, `POST /api/logout`, `/api/currentUser` | An- und abmelden |
| `/api/ab`, `/api/ab/personal`, `/api/ab/tags` | Das Adressbuch |
| `/api/group`, `/api/device-group/accessible` | Gruppen und Ordner, die das Konto sehen darf |
| `POST /api/heartbeat`, `POST /api/sysinfo` | Melden, dass er online ist, und seine Systeminformationen |
| `POST /api/audit/conn`, `/api/audit/file`, `/api/audit/alarm` | Verbindungen, Dateiübertragungen und Alarme melden |

## Entscheidungen, die normale Clients am Laufen halten {#choices-that-keep-stock-clients-working}

### Die Einstellungen des Clients {#the-clients-settings}

Ein Client braucht vier Werte: ID-Server, Relay-Server, API-Server und Schlüssel. Er bekommt sie aus seinen eigenen Einstellungen, aus dem Konfigurations-String oder aus dem QR-Code (`rustdesk://config/...` mit demselben String); siehe [Einen RustDesk-Client verbinden](/docs/getting-started/connect-a-client). Die Relay-Adresse, die die Konsole angibt, enthält immer einen Port. RustDesk-Clients 1.4.8 und 1.4.9, die nur einen Relay-Host ohne Port bekommen, fragen nämlich den API-Port nach dem Relay, und die Sitzung endet mit „Pair timeout“.

**API-Server** kann leer bleiben oder `http://<server-address>:21121` sein, der Client-API-Port bei jeder Installationsart, oder die HTTPS-Adresse eines Reverse Proxys davor; alle drei funktionieren. Ein normaler Client, bei dem das Feld leer ist, versucht den Port des ID-Servers minus 2 (21114), den keine Installation öffnet, und schickt seine API-Aufrufe dann als `HttpProxyRequest` über den ID-Server. Der ID-Server reicht sie an die eigene API des Servers weiter, deshalb kommen Heartbeat, Systeminformationen, Anmeldung und Adressbuch trotzdem an. Ein NeoDesk-Client, bei dem das Feld leer ist, nutzt `http://` mit dem Host des ID-Servers und Port 21121. Seine Aufrufe zur Registrierung schickt er nur über HTTP, nie über den ID-Server. Fülle das Feld deshalb aus, wenn die API unter einer anderen Adresse liegt, etwa hinter einem Reverse Proxy.

Der Server kann in seiner Antwort auf den NAT-Test auch ID-Server in `ConfigUpdate` schicken, aber nur, wenn `RENDEZVOUS_SERVERS` gesetzt ist, und nie Relay-Adressen. Nutze das nicht, um Clients auf einen anderen Server umzuziehen: Trage die Server im Client ein.

### Die Relay-Adresse, die ein Gerät bekommt {#the-relay-address-a-device-is-sent}

Ein RustDesk-Gerät vergleicht das Relay in einer eingehenden Relay-Anfrage mit dem Relay, das ihm mitgeteilt wurde, und verwirft eine Abweichung ohne Meldung. Wenn der Server ein Gerät bittet, einem Relay beizutreten, schickt er deshalb die Relay-Adresse, die dieses Gerät selbst gemeldet hat. Hat er keine, schickt er den Host ohne Port, und die eigene Prüfung des Geräts ergänzt ihn um seinen Relay-Port. Das gilt für den normalen Weg und für Sitzungen, die über das Relay erzwungen werden: **Nur Relay** unter **Verbindungsstrategie** oder eine Organisation mit **Immer über einen Relay-Server verbinden**.

### Strategie-Optionen {#strategy-options}

Die Antwort auf den Heartbeat kann `config_options` für den Client enthalten. Aus den Strategien, die einem Gerät zugewiesen sind, schickt der Server nur diese Schlüssel: `enable-file-transfer`, `disable-clipboard`, `enable-clipboard`, `enable-audio`, `enable-tunnel`, `enable-camera`, `enable-remote-restart` und `enable-block-input`, jeweils `Y` oder `N`. Andere Schlüssel werden beim Speichern einer Strategie verworfen und noch einmal, wenn die Antwort entsteht.

RustDesk 1.5.3 und neuer ignorieren Änderungen per Heartbeat an `api-server`, `custom-rendezvous-server`, `relay-server`, `key`, `2fa`, `bot`, `enable-trusted-devices`, `trusted-device-expiration-days` und `websocket-port`. Keiner davon steht auf der Liste, und ein Test sorgt dafür, dass das so bleibt.

Das Branding fügt eine Option hinzu, `display-name`, wenn der Firmenname gesetzt ist und nicht „NeoDesk“ lautet. Ein Wert aus dem Branding gewinnt immer gegen den Wert einer Strategie für denselben Schlüssel.

Ein normaler Client übernimmt diese Optionen aus der einfachen Antwort auf den Heartbeat. Die eigenen Clients von NeoDesk übernehmen sie nur aus einer versiegelten Antwort; siehe [Das Envelope](/docs/development/architecture#the-envelope).

### Nachrichten, die der Server nicht bedient {#messages-the-server-doesnt-serve}

- `HttpProxyRequest` wird nur für einen Pfad unter `/api/` mit GET, POST, PUT, PATCH oder DELETE beantwortet, und nur von der eigenen API dieses Servers; der ID-Server schickt nichts an einen anderen Host weiter. Jede andere Anfrage bekommt eine `HttpProxyResponse` mit einem Fehler, ebenso eine Antwort, deren Inhalt größer als 60 KiB ist.
- `IceCandidate` wird nur zwischen den beiden Enden eines Hole Punchings weitergereicht, das der Server gestartet hat.
- Ein `FetchLocalAddr`, das von einem Client kommt, wird verworfen: Nur der Server schickt diese Nachricht.
- Ein neues Gerät, das der Registrierungsmodus abweist, bekommt `RegisterPkResponse` mit `NOT_DEPLOYED`.
- Eine bekannte ID ist an die UUID und den Schlüssel gebunden, mit denen sie sich registriert hat. Ein `RegisterPk` mit einer anderen UUID bekommt `UUID_MISMATCH`, eins mit einem anderen Schlüssel `NOT_SUPPORT`.

### Wer eine Sitzung starten darf {#who-may-start-a-session}

Der ID-Server entscheidet bei jedem `PunchHoleRequest` und `RequestRelay`, welches Gerät fragt. Die erste dieser Quellen, die passt, gewinnt:

1. Dieselbe TCP-Verbindung hat schon ein Gerät mit `RegisterPk` registriert.
2. Die Nachricht trägt den Token eines Clients, der bei NeoDesk angemeldet ist.
3. Die Verbindung ist die Brücke der Konsole für Remote Desktop im Browser.
4. Ein registriertes Gerät hat genau diese Adresse und diesen Port.
5. Der `udp_port` in der Anfrage passt zu genau einem aktiven Gerät an dieser öffentlichen Adresse.
6. Genau ein aktives Gerät hat diese öffentliche Adresse.
7. `ALLOW_LEGACY_OUTBOUND` ist eingeschaltet und der Registrierungsmodus ist Offen: Eine App, die sich nie registriert hat, bekommt eine vorübergehende Identität und wird über das Relay geleitet.

Mehrere aktive Geräte an einer öffentlichen Adresse ohne bessere Übereinstimmung führen zur Ablehnung der Sitzung (`initiator_ambiguous_same_nat`), außer `ALLOW_SHARED_NAT_INITIATOR` ist eingeschaltet. Das trifft Büros, in denen sich mehrere Clients eine öffentliche Adresse teilen, auch wenn alle freigegeben sind: Ein Client schickt seine Anfrage oft über einen neuen TCP-Port, deshalb greifen die Quellen 4 und 5 nicht, und die Sitzung wird abgelehnt. `ALLOW_SHARED_NAT_INITIATOR` lässt solche Anfragen durch, ohne das fragende Gerät zu benennen. Ist **Nur angemeldete RustDesk-Apps können Sitzungen starten** eingeschaltet, zählen nur die Quellen 2 und 3. In den Modi Verwaltet und Gesperrt muss das Gerät außerdem freigegeben sein; ein Gerät, das noch auf Freigabe wartet, kann keine Sitzung starten. Schickt ein Client im Modus Verwaltet einen gültigen Anmelde-Token für ein Gerät, das der Server nicht kennt, landet der Client unter **Registrierungsanfragen**. So lassen sich auch Handys freigeben, die nur andere Geräte steuern.

Ein abgelehnter `PunchHoleRequest` bekommt eine `PunchHoleResponse` mit dem Fehler `ID_NOT_EXIST`, deshalb meldet der normale Client, die ID existiere nicht. Oft heißt das, dass der fragende Computer nicht zugelassen ist, und nicht, dass die entfernte ID fehlt. Das Log des Servers nennt den Grund. [Härtung](/docs/operations/security#limit-who-can-start-sessions) erklärt die Schalter für Betreiber.

### Link-Schemata {#link-schemes}

`rustdesk://` gehört dem normalen RustDesk, mit seinen Verbindungslinks und dem `rustdesk://config/...` des QR-Codes. Der NeoDesk-Client hat sein eigenes Schema, `neodesk://`, unter Windows, macOS und Linux. `rustdesk://` übernimmt er nur unter Windows, und nur auf einem Computer, auf dem kein normales RustDesk installiert ist und kein anderes Programm das Schema hat. Einen Handler, der auf ein anderes Programm zeigt, überschreibt oder entfernt er nie, und wenn er entfernt wird, löscht er seinen `rustdesk://`-Eintrag, solange dieser noch NeoDesk startet. Unter Linux und macOS registriert er `rustdesk://` nie. Ein Computer mit beiden öffnet die Links von RustDesk also weiter in RustDesk.

Die eigenen Links der Konsole, die ein Gerät in einer App öffnen, nutzen `rustdesk://`; siehe [Links, die die App öffnen](/docs/getting-started/connect-a-client#links-that-open-the-app).

## Was den NeoDesk-Client braucht {#what-needs-neodesks-client}

Ein normaler Client registriert sich, verbindet sich in beide Richtungen, führt die Remote-Sitzung selbst (Bildschirm, Eingabe, Dateiübertragung, Zwischenablage, Chat in der Sitzung, Audio, Terminal, TCP-Tunnel), meldet sich mit einem Konto der Konsole an und bekommt das Adressbuch. Die folgenden Funktionen brauchen den eigenen Client von NeoDesk, weil ein normaler Client nicht schickt, worauf sie aufbauen:

- **Telemetrie und Hardware-Inventar**: Der NeoDesk-Client versiegelt sie in seinem Heartbeat; in einem einfachen Heartbeat ignoriert der Server sie.
- **Logo und Farben** aus **Branding der Client-App**: Nur der NeoDesk-Client holt sie ab. Ein normaler Client bekommt nur die Option `display-name`.
- **Computer hinzufügen, Schnellhilfe und Mit Code koppeln**: Sie installieren oder konfigurieren den NeoDesk-Client. Ein normaler Client wird von Hand eingerichtet; siehe [Computer hinzufügen](/docs/console/add-a-computer) und [Schnellhilfe](/docs/console/quick-support).
- **Verbindungsmodus**: ein Gerät auf nur eingehende Verbindungen umstellen.
- **Ein Geräte-Token**: Der Server gibt nur dann einen aus, wenn ein Gerät über einen der eigenen Wege von NeoDesk beitritt, und die Anmeldung eines Kontos beweist kein Gerät. Ohne ihn bleiben die Geräte-Routen geschlossen: Hilfeanfragen vom Gerät, Chat mit einem Operator außerhalb einer Sitzung, Remote-Befehle, Dateien aus der Konsole und Richtlinien zum Schutz vor Datenabfluss.

## Der Viewer im Browser {#the-browser-viewer}

Der Viewer für Remote Desktop im Browser spricht dasselbe Protokoll. Sein Code liegt in `web-ui/src/lib/remote/client`:

- Seine Nachrichtenklassen erzeugt `web-ui/vite-plugins/protos.ts` bei jedem Build, jedem Start des Dev-Servers und jedem Testlauf aus `neodesk-server/protos`, und zwar in `src/lib/remote/client/generated`, das git ignoriert.
- Er kodiert eine Nachricht mit `fromObject()`, nicht mit `create()`. `create()` behält einen Enum-Namen wie `Backspace` als String, der auf der Leitung als 0 ankommt, und das Gerät verwirft die Taste. `fromObject()` macht aus Namen Zahlen und lässt Byte-Felder, wie sie sind. `web-ui/tests/unit/remote/wire-bytes.test.ts` legt die Bytes jeder Nachricht fest, die der Viewer schickt.
- Die Maske eines Mausereignisses ist der Ereignistyp in den drei niedrigsten Bits und die Taste, um drei Bits nach links verschoben.
- Über HTTPS dekodiert er mit WebCodecs. Ein WebCodecs-Decoder muss mit einem Keyframe beginnen. Nach dem Einrichten oder nach einem Fehler verwirft der Viewer deshalb Frames, bis ein Keyframe kommt, und bittet das Gerät mit `refresh_video` um einen. Dasselbe macht er, wenn 3 Sekunden lang keine Frames ankommen, oder wenn 2 Sekunden lang Frames ankommen und keiner sich dekodieren lässt. Hat der Browser kein WebCodecs, etwa bei einer Konsole, die von einem anderen Computer über einfaches HTTP geöffnet wurde, weicht er auf JMuxer aus, das nur H.264 dekodiert. Ein Gerät ohne Hardware-Encoder für H.264 schickt VP9, egal was der Viewer anbietet, und übernimmt eine Vorliebe für VP9, ohne auf die Fähigkeiten des Viewers zu schauen. Ohne WebCodecs bevorzugt der Viewer deshalb nur Auto oder H.264 und beendet die Sitzung mit einem Hinweis auf HTTPS, wenn die `PeerInfo` des Geräts sagt, dass es keinen H.264-Encoder hat, oder wenn der erste Frame in einem anderen Codec kommt.
- Er stellt sich dem Gerät als `NeoDesk-Web/1.4.9` vor.

## Die Checkliste für ein neues RustDesk-Release {#the-checklist-for-a-new-rustdesk-release}

Arbeite sie ab, wenn die Upstream-Überwachung ein Issue öffnet oder wenn du selbst ein neues Release des RustDesk-Clients oder des RustDesk-Servers bemerkst. Das meiste davon braucht ein Labor mit echten RustDesk-Clients, das CI nicht hat.

### Bevor du anfängst {#before-you-start}

- Notiere die Tags, die du prüfst: den Client (`rustdesk/rustdesk`), den Server von RustDesk (`rustdesk/rustdesk-server`) oder beide.
- Lies die Release Notes und die Pull Requests, auf die sie verweisen und die Sicherheit, Richtlinien, Konfiguration, das Relay, die API oder den Handshake betreffen.
- Vergleiche `rendezvous.proto` und `message.proto` des Release mit `neodesk-server/protos`, nur zur Orientierung. Übernimm nichts, außer über den [Clean-Room-Ablauf](/docs/development/provenance#clean-room-workflow).

### 1. Client-Einstellungen {#1-client-settings}

- Der Konfigurations-String, der QR-Code und die vier Werte unter **Client-Einrichtung** in der Konsole geben dem neuen Client weiterhin seinen ID-Server, das Relay (`host:port`), den API-Server (`http://<server-address>:21121`) und den Schlüssel.
- Auf Handys funktionieren die Einstellung `allow-deep-link-server-settings` oder der Import des Konfigurations-Strings weiterhin.
- Ein Client mit falschen Einstellungen bleibt offline und weicht nicht auf die öffentlichen Server von RustDesk aus.
- Prüfe, ob der Client ein `ConfigUpdate` aus dem NAT-Test noch übernimmt, und notiere es, wenn nicht.

### 2. Registrierung und Freigabe {#2-registration-and-enrollment}

- Ein neues Gerät registriert sich über UDP, TCP und WebSocket, je nachdem, was eingerichtet ist.
- In den Modi Verwaltet und Gesperrt: Die Anfrage erscheint, Ablehnen funktioniert, Freigeben funktioniert, und das Gerät kann erneut anfragen.
- Ein abgelehntes Gerät bleibt draußen, bis jemand auf **Wieder zulassen** klickt.
- Sind **Nur angemeldete RustDesk-Apps können Sitzungen starten** und **Nur Konten, die sich mit Geräten verbinden dürfen, können Sitzungen starten** eingeschaltet, kann ein Client ohne gültige Anmeldung weiterhin keine Sitzung starten.

### 3. ID-Server und Relay {#3-id-server-and-relay}

- Zwei normale Clients verbinden sich über NeoDesk, direkt und über das Relay.
- Dasselbe mit **Nur Relay** und mit einer Organisation, bei der **Immer über einen Relay-Server verbinden** eingeschaltet ist.
- Ein Client, dessen Relay-Einstellung keinen Port hat, wird am Relay trotzdem verbunden.
- Eine Relay-Anfrage mit einer UUID, die der ID-Server nicht ausgegeben hat, wird weiterhin abgelehnt.
- TLS auf ID-Server und Relay, WebSocket und ein Reverse Proxy funktionieren wie unter [Reverse Proxy und TLS](/docs/operations/reverse-proxy-tls) beschrieben.

### 4. Client-API {#4-client-api}

- Anmeldung mit einem lokalen Konto, einem LDAP-Konto und einem Zwei-Faktor-Code, und Abmeldung.
- Adressbuch, Gruppen und Geräteliste werden abgeglichen.
- Heartbeat und Sysinfo; die Version des Clients wird gespeichert.
- Strategie-Optionen: Liste auf, welche der neue Client übernimmt und welche er ignoriert oder sperrt.
- NeoDesk richtet keinen Client über einen Schlüssel ein, den der Client gegen Änderungen per Heartbeat sperrt.
- Verbindungsberichte (`POST /api/audit/conn`) kommen weiterhin an.

### 5. Sitzungen {#5-sessions}

- Remote Desktop: Bild und Eingabe.
- Zwischenablage: Text, und Bilder, wenn das Release sie verspricht.
- Dateiübertragung.
- Terminal, Datenschutzmodus und mehrere Bildschirme, wenn die Release Notes daran etwas ändern.
- Verbindungsbestätigung und vertrauenswürdige Geräte, wenn das Release sie hat.
- Remote Desktop im Browser zu einem Gerät mit dem neuen Client.

### 6. Ein Release des RustDesk-Servers {#6-a-release-of-rustdesks-server}

- Lies seine Release Notes und achte auf Änderungen am Handshake, am Hole Punching und am Relay oder auf Korrekturen gegen Amplification-Angriffe.
- Ordne jede Änderung am Protokoll oder am Verhalten dem ID-Server, dem Relay und der API von NeoDesk zu.
- NeoDesk braucht im Betrieb nie die Server-Binaries von RustDesk.

### 7. Abschließen {#7-close-out}

- Schreibe das Ergebnis in das Issue zur Prüfung: OK, teilweise oder Blocker, mit den Schritten, die es belegen.
- Setze `last_reviewed_tag` in `config/rustdesk-upstream-watch.json` für jede Komponente, die du geprüft hast.
- Öffne oder aktualisiere für jede Nacharbeit in Code oder Doku ein Issue mit dem Label `Next Updates`. Schließe Issues nur, wenn der Maintainer darum bittet.
- Mach die Korrekturen auf `main`.

## Die Upstream-Überwachung {#the-upstream-watch}

Der Workflow `.github/workflows/rustdesk-upstream-watch.yml` läuft montags, mittwochs und freitags um 04:19 UTC und wenn er von Hand gestartet wird. Er checkt `main` aus und führt `python3 scripts/watch_rustdesk_upstream.py --write` aus. Das Skript:

1. liest `config/rustdesk-upstream-watch.json`;
2. fragt die GitHub-API nach den neuesten 30 Releases von `rustdesk/rustdesk` und `rustdesk/rustdesk-server` und nimmt davon die höchste stabile Version (kein Entwurf, kein Pre-Release, ein Tag der Form `1.2.3` mit optionalem `v`);
3. setzt `last_seen_tag` und `last_seen_published_at` einer Komponente, wenn diese Version neuer ist;
4. öffnet für jede Komponente, deren `last_seen_tag` sich von ihrem `last_reviewed_tag` unterscheidet, ein Issue mit dem Titel `compat: review RustDesk client <tag> vs NeoDesk` (oder `OSS server`) und den Labels aus `issue_labels`, außer ein offenes Issue trägt schon die Markierung `<!-- rustdesk-upstream-watch: client=<tag> -->` (`server_oss=` für den Server). Fehlende Labels legt es an. Das Issue verlinkt die Checkliste und listet ihre Schritte auf.

Hat sich das Manifest geändert, committet der Workflow es auf `main`. Die Überwachung ändert `last_reviewed_tag` nie: Erst wenn du es nach einer Prüfung von Hand setzt, kommen für diesen Tag keine neuen Issues mehr.

| Feld | Bedeutung |
|---|---|
| `issue_labels` | Labels der Issues zur Prüfung: `Next Updates` und `compatibility` |
| `checklist_url` | Die Checkliste, auf die das Issue verweist: die Checkliste dieser Seite |
| `client`, `server_oss` | Ein Eintrag pro überwachtem Repository |
| `repository` | `rustdesk/rustdesk` oder `rustdesk/rustdesk-server` |
| `last_seen_tag`, `last_seen_published_at` | Das neueste stabile Release, das die Überwachung gesehen hat, und wann es veröffentlicht wurde |
| `last_reviewed_tag` | Das Release, das jemand mit der Checkliste geprüft hat |

So startest du es selbst, vom Wurzelordner des Repositorys aus:

```bash
python3 scripts/watch_rustdesk_upstream.py --dry-run
```

`--dry-run` ruft die Daten ab, gibt aus, was es ändern und welche Issues es öffnen würde, und schreibt nichts. `--no-issues` öffnet keine Issues. Ohne `--write` bleibt das Manifest unverändert. Zum Öffnen von Issues braucht es den Befehl `gh`, und das Skript schickt `GITHUB_TOKEN` oder `GH_TOKEN` an die GitHub-API, wenn eins davon gesetzt ist.
