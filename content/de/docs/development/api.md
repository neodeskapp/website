---
title: Die HTTP-API
description: Wie sich Skripte und Integrationen an der API des Servers anmelden und welche Routen sie für Geräte, Audit, Schlüssel, CDAP und MeshCentral nutzen.
order: 12
---

Der NeoDesk-Server hat eine einzige HTTP-API. Die Web-Konsole, die RustDesk-Clients und deine eigenen Skripte sprechen alle mit ihr. Diese Seite ist für Skripte und Integrationen: wo die API lauscht, wie du dich anmeldest und auf welche Routen du bauen kannst. Die eigenen Adressen der Konsole unter `/api/` auf dem Port der Konsole (3375 von Haus aus, 5000 bei Installationen vor 3.6.0-rc.5) bedienen den Browser und stehen nicht auf dieser Seite. Ein Skript kann sie auch nutzen, mit einem API-Token der Konsole, so wie die Kommandozeile `neodesk`; siehe [API-Tokens](/docs/command-line/api-tokens) und die [Befehlsreferenz](/docs/command-line/reference).

## Wo sie lauscht {#where-it-listens}

| Installation | Adresse für Skripte |
|---|---|
| Linux und Windows | `http://<server-address>:21114` |
| Docker | `http://<server-address>:21121` |

Unter Linux und Windows beantwortet die Konsole die Client-API von RustDesk auf 21121 und reicht nur die Client-Pfade an 21114 weiter (siehe [Die Client-API](#the-client-api)). Alles andere auf dieser Seite braucht deshalb 21114. Dort bekommen Aufrufer von anderen Rechnern nur die Client-API; der Rest antwortet 404. Rufe die API vom Server selbst aus auf oder trag die Adressen der Rechner, die sie brauchen, in `API_ALLOW_FROM` ein, IPs und CIDR-Bereiche durch Kommas getrennt, und starte den Server neu. Siehe [Der API-Port unter Linux und Windows](/docs/operations/ports#the-api-port-on-linux-and-windows).

Die API spricht unverschlüsseltes HTTP. Mit `TLS_API=Y` und einem Zertifikat in `TLS_CERT` und `TLS_KEY` spricht sie stattdessen HTTPS. Für ein Zertifikat, dem die Clients vertrauen, setze einen Reverse Proxy davor, wie unter [HTTPS für die Client-API](/docs/operations/reverse-proxy-tls#https-for-the-client-api) gezeigt. Mit `FORCE_HTTPS=Y` lehnt die API unverschlüsseltes HTTP mit 403 ab, außer ein vertrauenswürdiger Proxy meldet `X-Forwarded-Proto: https`.

## Anmelden {#signing-in}

Einige Routen antworten jedem, etwa `/api/health`, `/api/server/pubkey` und die Anmeldung der Clients. Die anderen Routen auf dieser Seite brauchen einen API-Schlüssel oder einen Anmelde-Token.

### API-Schlüssel {#api-keys}

Schicke den Schlüssel im Header `X-API-Key`. Aus dem Query-String liest der Server keinen Schlüssel.

```bash
curl -H "X-API-Key: $NEODESK_API_KEY" http://127.0.0.1:21114/api/peers
```

Ein Schlüssel handelt mit der Rolle, die er bekommen hat. Einen Schlüssel erzeugt der Server selbst, den Server-API-Schlüssel, und gibt ihm die Admin-Rolle. Der Server liest ihn aus `API_KEY`, sonst aus `.api_key` neben seiner Schlüsseldatei, und schreibt dort einen neuen, wenn es keinen gibt. In der Konsole zeigt ihn **Client-Einrichtung** unter **Für Skripte**; **Ganzen Schlüssel zeigen** können nur Konten mit der Rolle Super-Admin oder Administrator nutzen.

Kein API-Schlüssel, auch nicht der Server-API-Schlüssel, kann Konten, Rollenberechtigungen, API-Schlüssel oder zweite Faktoren ändern. Diese Routen beantworten jeden Schlüssel mit 403 und „An API key cannot change accounts, role permissions or API keys. Sign in as a person to do this.“ Sie brauchen einen [Anmelde-Token](#sign-in-tokens); siehe [Routen, die eine Person brauchen](#routes-that-need-a-person).

Lege für ein Skript einen Schlüssel mit einer kleineren Rolle an. Dafür brauchst du den Anmelde-Token eines Kontos mit **API-Schlüssel verwalten**; setze ihn für `<token>` ein:

```bash
curl -X POST http://127.0.0.1:21114/api/keys \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name": "inventory-export", "role": "viewer", "expires_in_days": 90}'
```

```json
{"id": 4, "key": "3f1c...", "prefix": "3f1c9a20", "name": "inventory-export", "role": "viewer", "expires_at": "2027-02-20 10:15:00"}
```

Nur in dieser Antwort steht der ganze Schlüssel, speichere ihn also sofort.

- `role` ist `viewer`, wenn das Feld fehlt. Ein Schlüssel bekommt nur eine Rolle, die der Aufrufer auch einem Konto geben könnte: Super-Admins jede Rolle, globale Administratoren `operator`, `viewer`, `pro` oder `guest_issuer`, und nur, solange ihre eigene Rolle jede Berechtigung dieser Rolle hat (siehe [wer welche Rolle vergeben darf](/docs/people/users-and-roles#who-can-give-which-role)). Globale Administratoren haben **API-Schlüssel verwalten** standardmäßig nicht. Sie legen deshalb erst Schlüssel an, wenn ein Super-Admin der Rolle diese Berechtigung auf der Seite [Berechtigungen](/docs/people/permissions) gibt. Serveradministratoren können Schlüssel auflisten und löschen, aber keine anlegen.
- `expires_in_days` ist optional. Nach diesem Tag lehnt der Server den Schlüssel ab wie einen falschen.
- `GET /api/keys` listet die Schlüssel mit ihren ersten 8 Zeichen, Name, Rolle, Datumsangaben und letzter Nutzung auf, und `DELETE /api/keys/<id>` entfernt einen. Alle drei Routen brauchen **API-Schlüssel verwalten**; Anlegen und Löschen brauchen außerdem einen Anmelde-Token.

Die Konsole hat keine Seite, auf der du API-Schlüssel anlegst oder löschst; das geht nur über diese Routen.

### Anmelde-Tokens {#sign-in-tokens}

Ein Skript kann sich auch als Konto der Konsole anmelden und den Token, den es dabei bekommt, als `Authorization: Bearer <token>` mitschicken. Setze für `<password>` das Passwort des Kontos ein:

```bash
curl -X POST http://127.0.0.1:21114/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "alice", "password": "<password>"}'
```

```json
{"token": "eyJhbGciOi...", "role": "operator", "username": "alice", "auth_provider": "local"}
```

Der Token gilt 24 Stunden; `JWT_EXPIRY_HOURS` ändert das. `GET /api/auth/me` zeigt, zu welchem Konto ein Token gehört.

Hat das Konto die Zwei-Faktor-Anmeldung, ist die erste Antwort `{"requires_2fa": true, "partial_token": "..."}`. Schicke diesen Token innerhalb von 5 Minuten zusammen mit dem Code aus der Authenticator-App oder einem Wiederherstellungscode an `POST /api/auth/login/2fa`:

```bash
curl -X POST http://127.0.0.1:21114/api/auth/login/2fa \
  -H "Content-Type: application/json" \
  -d '{"partial_token": "eyJhbGciOi...", "code": "123456"}'
```

Der Server lehnt eine Anmeldung so ab: mit 401 bei falschen Angaben oder einem Single-Sign-on-Konto, mit 403 und `"code": "totp_setup_required"`, solange das Konto die Zwei-Faktor-Anmeldung noch einrichten muss (siehe [Zur Pflicht machen](/docs/people/two-factor#make-it-mandatory)), und mit 429 nach 5 Versuchen innerhalb von 5 Minuten von einer Adresse oder für einen Kontonamen.

### Was die Zugangsdaten dürfen {#what-a-credential-may-do}

Jede Route verlangt eine Berechtigung, und die wird wie in der Konsole entschieden: die Standardwerte der Rolle mit den Änderungen, die unter **Rollen und Berechtigungen** gespeichert sind (siehe [Rollen und Berechtigungen](/docs/people/permissions#roles-and-permissions)). Super-Admins bestehen jede Prüfung. Die Tabellen unten nennen die Berechtigung jeder Route mit ihrem Namen in der Konsole.

Routen für ein einzelnes Gerät prüfen außerdem, ob das Konto dieses Gerät sieht, nach seinen Ordnern und seiner Organisation; siehe [Welche Geräte ein Benutzer sieht](/docs/people/users-and-roles#which-devices-a-user-sees).

Die API antwortet in JSON. Ein Fehler ist `{"error": "..."}`, mit 401 bei fehlenden oder falschen Zugangsdaten, 403 bei einer fehlenden Berechtigung und 404 für einen Pfad, den die API nicht hat. Der Body einer Anfrage darf bis zu 1 MB groß sein.

### Routen, die eine Person brauchen {#routes-that-need-a-person}

Diese Routen ändern, wer was darf. Sie nehmen nur einen Anmelde-Token an und beantworten einen API-Schlüssel mit 403:

| Methode und Pfad | Berechtigung |
|---|---|
| `POST /api/users`, `PUT /api/users/<id>`, `DELETE /api/users/<id>` | Benutzer erstellen, Benutzer bearbeiten, Benutzer löschen |
| `POST /api/role-permissions`, `DELETE /api/role-permissions/<role>/<permission>` | Server konfigurieren, und Super-Admin oder Administrator |
| `POST /api/keys`, `DELETE /api/keys/<id>` | API-Schlüssel verwalten |
| `POST /api/users/<id>/totp/setup`, `POST /api/users/<id>/totp/confirm`, `DELETE /api/users/<id>/totp` | Super-Admin oder Administrator |

Zusätzlich zur Berechtigung legt kein Konto ein Konto an oder ändert es, und kein Konto legt einen Schlüssel an, mit einer Rolle, deren Berechtigungen über die eigenen hinausgehen, die Änderungen auf der Seite Berechtigungen eingeschlossen.

## Geräte {#devices}

| Methode und Pfad | Berechtigung | Was sie macht |
|---|---|---|
| `GET /api/peers` | Geräte anzeigen | Die Geräteliste |
| `GET /api/peers/<id>` | Geräte anzeigen | Ein Gerät |
| `PATCH /api/peers/<id>` | Geräte bearbeiten | Ändert `note`, `user`, `tags`, `display_name` oder `linked_peer_id` |
| `PUT /api/peers/<id>/tags` | Geräte bearbeiten | Ersetzt die Tags: `{"tags": "a,b"}` oder `{"tags": ["a", "b"]}` |
| `GET /api/tags/<tag>/peers` | Geräte anzeigen | Geräte mit einem Tag |
| `DELETE /api/peers/<id>` | Geräte löschen | Löscht das Gerät, siehe unten |
| `POST /api/peers/<id>/restore` | Geräte löschen | Holt ein gelöschtes Gerät zurück |
| `POST /api/peers/<id>/ban` | Geräte sperren und entsperren | Sperrt es, optional mit `{"reason": "..."}`, und trennt seine Verbindung |
| `POST /api/peers/<id>/unban` | Geräte sperren und entsperren | Hebt die Sperre auf |
| `POST /api/peers/<id>/change-id` | Geräte-ID ändern | `{"new_id": "..."}`, 6 bis 16 Buchstaben, Ziffern, `-` oder `_`; 409, wenn die ID schon vergeben ist |
| `GET /api/peers/<id>/metrics` | Geräte anzeigen | Die letzten Werte für CPU, Arbeitsspeicher und Datenträger, die das Gerät gemeldet hat; `limit` bis 1000, Standard 100 |
| `GET /api/peers/status/summary` | Geräte anzeigen | Zahlen zu den verbundenen Geräten: online, beeinträchtigt, kritisch, nach Transportweg, gesperrt und deaktiviert |
| `GET /api/peers/online` | Geräte anzeigen | Die Geräte, die gerade online sind |
| `POST /api/peers/<id>/wol` | Mit Geräten verbinden | Wake-on-LAN, siehe unten |
| `POST /api/peers/<id>/exec` | Terminal auf MeshCentral-Agenten oder CDAP-Terminal verwenden | Führt einen Befehl aus, siehe unten |

`GET /api/peers` antwortet mit einer Liste. Mit `limit` (oder `page_size`, höchstens 500) und `page` antwortet die Route stattdessen mit `{"total": ..., "data": [...]}`. `include_deleted=true` nimmt gelöschte Geräte dazu. Jedes Gerät hat unter anderem `id`, `hostname`, `display_name`, `os`, `version`, `ip`, `tags`, `note`, `user`, `banned`, `soft_deleted`, `last_online`, `live_online` (gerade über irgendeinen Transportweg verbunden), `cdap_connected` und `mesh_connected`. Sein `status` ist 1 für ein aktives und 0 für ein deaktiviertes Gerät; `status_text` enthält `ONLINE`, `OFFLINE`, `DEGRADED` oder `CRITICAL`.

```bash
curl -H "X-API-Key: $NEODESK_API_KEY" "http://127.0.0.1:21114/api/peers?limit=100&page=2"
```

`DELETE /api/peers/<id>` markiert das Gerät als gelöscht. Im Query-String kannst du ergänzen:

- `hard=true`, um es aus der Datenbank zu entfernen,
- `revoke=true`, um außerdem seine ID zu sperren und seine Verbindung zu trennen, auch bei einem CDAP-Gerät,
- `cascade=true`, um dasselbe mit den Geräten zu tun, die mit ihm verknüpft sind.

`POST /api/peers/<id>/wol` nimmt `{"mac": "AA:BB:CC:DD:EE:FF"}` und sendet das Magic Packet als Broadcast vom Server aus. Es weckt deshalb nur Rechner im eigenen Netz des Servers.

`POST /api/peers/<id>/exec` nimmt `{"command": "...", "shell": true}` und schickt den Befehl über den MeshCentral-Agenten oder über CDAP an das Gerät, je nachdem, worüber es verbunden ist. Dafür gilt die Terminal-Berechtigung dieses Transportwegs. Die Antwort `{"transport": "mesh", "status": "sent"}` sagt nur, dass der Befehl abgeschickt ist; die Ausgabe kommt nicht zurück. Ist das Gerät über keins von beiden verbunden, gibt es 400.

## Audit-Protokoll und Live-Ereignisse {#audit-log-and-live-events}

| Methode und Pfad | Berechtigung | Was sie macht |
|---|---|---|
| `GET /api/audit/events` | Audit anzeigen | Die Audit-Einträge des Servers, die neuesten zuerst: `limit` (Standard 50, höchstens 1000), `offset` und `action` |
| `GET /api/ws/events` | Audit anzeigen | Ein WebSocket, der jedes Ereignis schickt, sobald es passiert |

`/api/ws/events` schickt jedes Ereignis als `{"type": "...", "timestamp": "...", "data": {...}}`. `?filter=<type>` beschränkt den Strom auf einen Typ, zum Beispiel `peer_online`, `peer_offline`, `peer_banned`, `peer_deleted`, `peer_revoked`, `peer_id_changed`, `enrollment_pending` oder `help_request`. CDAP-Geräte bringen `cdap_connect`, `cdap_disconnect`, `cdap_state_update`, `cdap_widget_update`, `cdap_command_response`, `cdap_event`, `cdap_log`, `cdap_alert_fired` und `cdap_alert_cleared` dazu. Ein langsamer Leser verpasst Ereignisse: Der Server verwirft sie, statt zu warten. Browser auf einem anderen Host brauchen ihren Origin in `API_WS_ALLOWED_ORIGINS`.

## CDAP-Geräte {#cdap-devices}

Diese Routen lesen und steuern Geräte, die mit dem CDAP-Gateway verbunden sind. Das Protokoll selbst steht unter [CDAP-Protokoll](/docs/development/cdap-protocol).

| Methode und Pfad | Berechtigung | Was sie macht |
|---|---|---|
| `GET /api/cdap/status` | CDAP anzeigen | `{"enabled": true, "connected": 3, "port": 21122, "tls": false}` |
| `GET /api/cdap/devices` | CDAP anzeigen | Die verbundenen Geräte, `{"devices": [...], "total": 3}` |
| `GET /api/cdap/devices/<id>` | CDAP anzeigen | Ein verbundenes Gerät: sein Manifest, die aktuellen Werte, Verbindungszeit, letzter Heartbeat und Zähler |
| `GET /api/cdap/devices/<id>/manifest` | CDAP anzeigen | Das Manifest, das das Gerät registriert hat |
| `GET /api/cdap/devices/<id>/state` | CDAP anzeigen | `{"device_id": "...", "widget_state": {...}, "connected": true}` |
| `POST /api/cdap/devices/<id>/command` | CDAP-Befehle ausführen | Schickt einen Befehl, siehe unten |
| `GET /api/cdap/alerts` | CDAP anzeigen | Die gerade ausgelösten Warnungen, mit `device_id` für ein einzelnes Gerät |

Ein Befehl nennt ein Widget aus dem Manifest des Geräts und eine Aktion:

```bash
curl -X POST http://127.0.0.1:21114/api/cdap/devices/greenhouse-1/command \
  -H "X-API-Key: $NEODESK_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"widget_id": "heater", "action": "set", "value": true, "reason": "frost warning"}'
```

```json
{"status": "sent", "command_id": "cmd_greenhouse-1_17", "device_id": "greenhouse-1"}
```

Die Aktion ist `set`, `trigger`, `execute`, `reset` oder `query`. Zusätzlich zur Berechtigung entscheidet die eigene Regel des Widgets, welche Rolle die Aktion nutzen darf; siehe [Widget-Berechtigungen](/docs/development/cdap-protocol#widget-permissions). Der Server antwortet mit 202, sobald der Befehl unterwegs ist, mit 404, wenn das Gerät kein solches Widget hat, und mit 502, wenn das Gerät nicht verbunden ist. Die Antwort des Geräts kommt später als Ereignis `cdap_command_response` auf `/api/ws/events`, mit derselben `command_id`.

Super-Admins können einem anderen Konto befristet eine höhere Rolle auf einem Gerät geben: `POST /api/cdap/delegate` mit `grantee`, `device_id`, `role` (`operator` oder `admin`), `duration` in Sekunden (höchstens 86400) und optional `widget_ids` und `reason`. `GET /api/cdap/delegations` listet diese Delegierungen auf, und `DELETE /api/cdap/delegate/<id>` beendet eine. Der Server hält sie nur im Arbeitsspeicher, ein Neustart beendet also alle.

Die WebSockets unter `/api/cdap/devices/<id>/` (`terminal`, `desktop`, `files`, `video`, `audio`) tragen die Sitzungen der Konsole mit einem Gerät. Terminal, Desktop und Dateien brauchen einen Super-Admin; Video und Audio brauchen **Mit Geräten verbinden**.

## MeshCentral-Agenten {#meshcentral-agents}

Diese Routen wirken auf Geräte, auf denen der MeshCentral-Agent läuft; siehe [MeshAgent-Geräte](/docs/console/meshagent). Ist `MESH_ENABLED` aus, antworten sie mit 404 und `{"error": "mesh disabled"}`.

| Methode und Pfad | Berechtigung | Was sie macht |
|---|---|---|
| `GET /api/mesh/status` | Geräte anzeigen | Ob die Schicht eingeschaltet ist, welche Agenten online sind und das Zertifikat der Agenten |
| `GET /api/mesh/server-id` | Server konfigurieren | Die ID, unter der die Agenten den Server kennen |
| `GET /api/mesh/groups`, `POST /api/mesh/groups` | Server konfigurieren | Liest oder speichert die Mesh-Gruppen |
| `GET /api/mesh/download.msh` | Server konfigurieren | Die `.msh`-Datei des Agenten; `name` und `mesh_id` sind optional |
| `POST /api/mesh/devices/<id>/group` | Server konfigurieren | `{"group_id": "..."}` verschiebt das Gerät in eine Gruppe |
| `POST /api/mesh/devices/<id>/power` | Ein-/Ausschalten von MeshCentral-Agenten | `{"action": "wake"}`, oder `sleep`, `off`, `reset` |
| `POST /api/mesh/devices/<id>/exec` | Terminal auf MeshCentral-Agenten | `{"command": "whoami", "shell": true}` |
| `POST /api/mesh/devices/<id>/share` | Mit Geräten verbinden | Ein Link für eine Remote-Sitzung, siehe unten |
| `POST /api/mesh/devices/<id>/tcp`, `.../udp` | Mit Geräten verbinden | `{"host": "127.0.0.1", "port": 3389}` öffnet ein Port-Relay und antwortet mit `relay_id` und `browser_url` |
| `GET /api/mesh/recordings` | Geräte anzeigen | Die Desktop-Sitzungen, die der Server aufgezeichnet hat |
| `GET /api/mesh/recordings/<id>` | Mit Geräten verbinden | Lädt eine Aufzeichnung herunter |

`wake` schickt für einen Agenten, der nicht verbunden ist, stattdessen Wake-on-LAN. Die MAC-Adresse kommt aus `{"mac": "..."}` im Body, sonst aus der letzten Meldung des Agenten, sonst vom Gerät, das mit ihm verknüpft ist.

`share` nimmt `{"ttl_minutes": 60, "view_only": true}` und antwortet mit einem `token` und einem `path` auf der Konsole, `/remote/<id>?transport=mesh&mesh_share=<token>`, der die Sitzung öffnet.

Der Server legt Aufzeichnungen im Ordner `mesh-recordings` neben seiner Datenbank ab.

## Gerätetokens {#device-tokens}

Ein Super-Admin kann Gerätetokens über die API anlegen: `POST /api/tokens` mit `name`, `max_uses` (0 für keine Grenze), `expires_in` in Sekunden (0 für keinen Ablauf) und `note`. Die Antwort enthält den Token ein einziges Mal. `GET /api/tokens` listet sie auf, `DELETE /api/tokens/<id>` widerruft einen, und `POST /api/tokens/<id>/bind` mit `{"peer_id": "..."}` bindet einen noch unbenutzten Token an eine Geräte-ID mit 6 bis 16 Zeichen und macht ihn aktiv. Ein CDAP-Gerät meldet sich mit so einem gebundenen Token an; siehe [Anmelden](/docs/development/cdap-protocol#signing-in).

Die Liste enthält auch die Tokens, die der Server selbst ausstellt, wenn er ein Gerät aufnimmt, etwa bei einer genehmigten Registrierung oder wenn ein Computer über eine Einladung beitritt. Sie gehören keinem Konto, deshalb beendet das Löschen eines Kontos keinen von ihnen. Die Seite **Gerätetokens** der Konsole listet und widerruft dieselben Tokens.

## Die Client-API {#the-client-api}

RustDesk-Clients nutzen diese Pfade für die Anmeldung und das Adressbuch. Unter Linux und Windows nimmt der Port 21121 der Konsole diese und die anderen Pfade der Clients an, etwa ihre Berichte und die Registrierung, und reicht sie an die API weiter. In Docker liegen sie direkt auf 21121. Ein Client erreicht sie, wenn sein **API-Server** auf `http://<server-address>:21121` steht, oder wenn das Feld leer ist und der ID-Server seine Aufrufe weiterreicht; siehe [Die Einstellungen des Clients](/docs/development/rustdesk-compatibility#the-clients-settings).

| Methode und Pfad | Was sie macht |
|---|---|
| `POST /api/login` | Meldet an, siehe unten |
| `GET /api/login-options` | Die Anmeldemethoden: `""` für ein Passwort, dann ein Eintrag `common-oidc/`, der `NeoDesk` nennt, die Anmeldung über die Konsole im Browser, und den Single-Sign-on-Anbieter, wenn einer eingeschaltet ist |
| `POST /api/logout` | Beendet die Sitzung des Bearer-Tokens |
| `GET /api/currentUser` | Das angemeldete Konto |
| `GET /api/ab`, `POST /api/ab` | Liest oder speichert das Adressbuch |
| `GET /api/ab/personal`, `POST /api/ab/personal` | Das persönliche Adressbuch |
| `GET /api/peers` | Die Geräte, die das Konto sehen darf |

Setze für `<server-address>` die Adresse deines Servers und für `<password>` das Passwort des Kontos ein:

```bash
curl -X POST http://<server-address>:21121/api/login \
  -H "Content-Type: application/json" \
  -d '{"username": "alice", "password": "<password>"}'
```

```json
{"type": "access_token", "access_token": "9c1e...", "user": {"name": "alice", "is_admin": false, "status": 1}}
```

Mit Zwei-Faktor-Anmeldung ist die erste Antwort `{"type": "email_check", "tfa_type": "tfa_check", "secret": "..."}`. Schicke innerhalb von 5 Minuten `{"verificationCode": "123456", "secret": "..."}` an `/api/login`, um den Token zu bekommen.

Der Token besteht aus 64 Hex-Zeichen und gehört in `Authorization: Bearer`. Er gilt 7 Tage, jede Nutzung verlängert ihn, und spätestens 30 Tage nach der Anmeldung läuft er ab. Er funktioniert auch auf den anderen Routen dieser Seite, mit den Berechtigungen des Kontos.

`GET /api/ab` antwortet mit `{"data": "...", "licensed_devices": 0}`. Dabei ist `data` das Adressbuch als JSON in einem String, im Format der RustDesk-Clients. `POST /api/ab` mit `{"data": "..."}` ersetzt es; es darf bis zu 512 KB groß sein.

Die anderen Client-Pfade, etwa `/api/heartbeat`, `/api/sysinfo` und `/api/audit/conn`, sind Berichte, die der Client über sich selbst schickt. Für ein Skript taugen sie nicht.
