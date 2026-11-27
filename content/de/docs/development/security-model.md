---
title: Sicherheitsmodell
description: Wem der Server vertraut und wie der Code jede Grenze schützt: Geräteidentität, Verschlüsselung, Konten, Tokens, gespeicherte Geheimnisse und offene Lücken.
order: 11
---

Diese Seite beschreibt das Sicherheitsdesign so, wie der Code es umsetzt, für alle, die es prüfen oder ändern. Die Einstellungen, die ein Betreiber einschaltet, stehen unter [Härtung](/docs/operations/security). Wo du eine Schwachstelle meldest, steht in der [Sicherheitsrichtlinie](https://github.com/neodeskapp/neodesk/blob/main/SECURITY.md) des Repositorys.

## Vertrauensgrenzen {#trust-boundaries}

| Grenze | Wer sie überschreitet | Was sie schützt |
|---|---|---|
| Internet zum ID-Server und Relay (21115 bis 21119) | RustDesk-Clients | Geräteidentität, der Schlüsselaustausch über TCP, optionales TLS, die Registrierung, die Prüfung, wer eine Sitzung starten darf, Rate Limits |
| Internet zur Client-API (21121, und 21114 für Clients ohne API-Server-Einstellung) und Skripte zur API (21114 unter Linux und Windows) | RustDesk-Clients, Skripte | Anmelde-Tokens, API-Schlüssel in einem Header, Geräte-Tokens, Rate Limits. Unter Linux und Windows gibt 21114 anderen Rechnern nur die Client-API; die ganze API bekommen dieser Rechner und die Adressen in `API_ALLOW_FROM` |
| Browser zur Konsole (3375 oder 5443) | Menschen | Das Sitzungs-Cookie, der CSRF-Token, Rollen und Berechtigungen, TLS von der Konsole oder einem Reverse Proxy |
| Einladungs- und Schnellhilfe-Links der Konsole | Jeder mit einem Link, der NeoDesk-Client | Ein Code, der für begrenzte Zeit und begrenzt oft gilt, ein Rate Limit pro Adresse, siehe [Beitritts- und Support-Codes](#join-and-support-codes) |
| Konsole zum API-Server | Die Konsole | Nichts geht über ein Netzwerk: Die Konsole ruft den Handler des API-Servers im selben Prozess auf, unter dem API-Schlüssel der Konsole |
| Konsole zum ID-Server und Relay | Remote Desktop im Browser | Ein Nachweis, den nur dieser Prozess erbringen kann, siehe [Die Brücke für den Browser](#the-browsers-bridge) |
| Client zu Client | Die Remote-Sitzung | Von den beiden Clients Ende-zu-Ende verschlüsselt; das Relay kopiert nur Bytes |
| Geräte zum CDAP-Gateway (21122) | CDAP-Agents und Bridges | Das Passwort eines Kontos, ein API-Schlüssel oder ein Geräte-Token, optionales TLS, siehe [CDAP-Geräte](/docs/console/cdap#how-a-device-signs-in) |
| Agents zur MeshCentral-Schicht | MeshAgent | Das Agent-Zertifikat und die Prüfung des Web-Zertifikats, siehe [MeshAgent-Geräte](/docs/console/meshagent#certificates) |

## Geräteidentität {#device-identity}

Beim ersten Start erzeugt der Server ein Ed25519-Schlüsselpaar: `id_ed25519` enthält den privaten Schlüssel in Base64 und wird mit dem Modus 0600 geschrieben, `id_ed25519.pub` enthält den öffentlichen Schlüssel. Die Clients bekommen den öffentlichen Schlüssel als Wert **Schlüssel** und prüfen damit, dass sie mit diesem Server sprechen.

- Bittet ein Client um eine Verbindung zu einem Gerät, signiert der Server das Paar aus ID und öffentlichem Schlüssel dieses Geräts (die Nachricht `IdPk`) mit seinem Schlüssel. Der Client prüft die Signatur mit dem öffentlichen Schlüssel des Servers und weiß so, dass der Schlüssel des Geräts von diesem Server kommt.
- Eine Geräte-ID ist an die UUID und den öffentlichen Schlüssel gebunden, mit denen sie sich zuerst registriert hat, im Speicher und in der Datenbank. Eine Registrierung mit einer anderen UUID wird mit `UUID_MISMATCH` abgelehnt, eine mit einem anderen Schlüssel mit `NOT_SUPPORT`. So kann keine andere Installation eine ID übernehmen.
- Der Beitrittsmodus entscheidet, ob eine neue ID überhaupt aufgenommen wird; siehe [Beitrittsanfragen](/docs/console/enrollment#enrollment-modes). Ein gesperrtes oder gelöschtes Gerät kann sich nicht registrieren, und weder diese Geräte noch ein Gerät, das auf Freigabe wartet, können eine Sitzung starten.

## Die Verbindung zum ID-Server {#the-id-server-connection}

Über TCP beginnt der ID-Server mit einem Schlüsselaustausch, den RustDesk-Clients ab 1.2 verstehen:

1. Der Server erzeugt einen Curve25519-Schlüssel nur für diese Verbindung und schickt ihn, signiert mit seinem langlebigen Ed25519-Schlüssel (96 Byte: die Signatur und der Schlüssel).
2. Der Client prüft die Signatur, verschlüsselt einen frischen symmetrischen Schlüssel mit NaCl box an den Schlüssel des Servers und schickt ihn zusammen mit seinem eigenen öffentlichen Schlüssel.
3. Ab dann ist jede Nachricht mit NaCl secretbox (XSalsa20 und Poly1305) verschlüsselt. Die Nonce ist ein Zähler, der pro Nachricht um eins steigt.

Weil der Curve25519-Schlüssel zur Verbindung gehört, öffnet ein geleaktes `id_ed25519` keine aufgezeichneten Verbindungen. Ein Client, der zuerst etwas anderes als den Schlüsselaustausch schickt, wird ohne Verschlüsselung bedient. Nachrichten über UDP werden nie verschlüsselt.

### TLS {#tls}

Mit `TLS_SIGNAL=Y` und `TLS_RELAY=Y` und einem Zertifikat in `TLS_CERT` und `TLS_KEY` nehmen die TCP-Ports auch TLS an. Eine TLS-Verbindung beginnt mit dem Byte `0x16`, mit dem keine RustDesk-Nachricht beginnt, deshalb bedient ein Port beide Arten; die WebSocket-Ports nehmen dann nur noch TLS an. Jeder TLS-Listener im Server und in der Konsole verlangt TLS 1.2 oder neuer.

### WebSocket-Origins {#websocket-origins}

Die WebSockets des ID-Servers und des Relays akzeptieren die Origins in `WS_ALLOWED_ORIGINS`. Ohne diese Einstellung akzeptieren sie einen Browser nur von `localhost`, `127.0.0.1` oder `::1`, außerdem jeden Client, der kein `Origin` schickt, so wie native RustDesk-Clients.

## Sitzungen zwischen Geräten {#sessions-between-devices}

- **Wer eine starten darf.** Für jede Verbindungsanfrage ermittelt der ID-Server, welches registrierte Gerät fragt, oder er lehnt ab. Die Reihenfolge der Prüfungen steht unter [Wer eine Sitzung starten darf](/docs/development/rustdesk-compatibility#who-may-start-a-session).
- **Das Relay.** Der ID-Server hält die UUID jeder Relay-Sitzung, die er autorisiert, zusammen mit den beiden Geräten fest, bevor eines davon das Relay erreicht. Das Relay führt nur diese UUIDs zusammen, jede einmal; eine benutzte UUID kann erst nach ihrem Ablauf wieder autorisiert werden. Diese Tickets liegen nur im Speicher des Prozesses, deshalb können ID-Server und Relay nicht getrennt laufen. Nach dem Zusammenführen kopiert das Relay Bytes zwischen den beiden Enden, ohne sie zu lesen, und schließt ein Paar, das 30 Sekunden lang still ist.
- **Die Sitzung.** Die beiden Clients verschlüsseln die Sitzung untereinander; das Relay hat keinen Schlüssel dafür.
- **Der Viewer im Browser.** Er drückt auf dem Gerät nie von sich aus Strg+C, und Dateien kommen nur dann vom Gerät, wenn der Operator sie dorthin kopiert.

### Die Brücke für den Browser {#the-browsers-bridge}

Remote Desktop im Browser erreicht den ID-Server über die Konsole, die im selben Prozess eine TCP-Verbindung zum ID-Server öffnet. Ihr erster Frame ist ein Nachweis: ein Geheimnis aus 32 Byte, das der Server beim Start erzeugt und nur im Speicher hält, plus die ID des angemeldeten Kontos. Eine Verbindung, die mit dem Nachweis beginnt und von einer Adresse in `PANEL_SIGNAL_PROXY_CIDRS` kommt (standardmäßig Loopback), darf Sitzungen ohne registriertes Gerät starten. Die Konsole hat nämlich das Konto oder den Gast-Link schon geprüft, als der Browser den WebSocket geöffnet hat, und sie prüft jedes Gerät, das der Browser anfragt. Eine Verbindung von einer Loopback-Adresse ohne den Nachweis wird wie jeder andere Client behandelt.

## Konten und Anmeldung {#accounts-and-sign-in}

### Passwörter {#passwords}

Neue Passwort-Hashes sind PBKDF2 mit HMAC-SHA256, 600.000 Iterationen, einem zufälligen Salt aus 16 Byte und einem Ergebnis aus 32 Byte, gespeichert als `pbkdf2-sha256$<iterations>$<salt>$<hash>`. Der API-Server und die Konsole erzeugen sie auf dieselbe Weise, ebenso der Befehl `reset-password`. bcrypt-Hashes und eine ältere PBKDF2-Form aus früheren Versionen lassen sich weiterhin prüfen. Eine Anmeldung über den API-Server ersetzt einen solchen Hash durch einen neuen; die Konsole prüft jede Form und ersetzt keine. Ein neues Passwort muss 8 bis 128 Zeichen haben, und der Server prüft das auf jedem Weg, der eins setzt.

Die Passwörter der Richtlinie für unbeaufsichtigten Zugriff eines Geräts sind bcrypt-Hashes.

### Zwei-Faktor-Codes {#two-factor-codes}

Die Codes folgen RFC 6238: HMAC-SHA1, 6 Ziffern, Schritte von 30 Sekunden, mit einem Geheimnis aus 20 Byte. Die Konsole akzeptiert nur den Code des aktuellen Schritts und lehnt einen Code aus einem Schritt ab, mit dem sich das Konto schon angemeldet hat. Der API-Server, über den sich RustDesk-Clients anmelden, akzeptiert auch die Codes des Schritts davor und danach. Die 8 Wiederherstellungscodes werden einmal angezeigt und als bcrypt-Hashes gespeichert, und jeder funktioniert einmal.

### Tokens {#tokens}

- **API-Tokens.** Der API-Server signiert seine Tokens mit HMAC-SHA256 (JWT). Das Geheimnis ist `JWT_SECRET` oder eins, das der Server beim ersten Start erzeugt hat (32 zufällige Bytes) und in der Datenbank hält. Ein Token gilt `JWT_EXPIRY_HOURS` Stunden lang, standardmäßig 24.
- **Anmelde-Tokens der Clients.** Ein RustDesk-Client, der sich anmeldet, bekommt einen Token aus 32 zufälligen Bytes in Hex. Der Server hält nur dessen SHA-256-Hash. Der Token gilt `CLIENT_SESSION_EXPIRY_DAYS` Tage (7), jede Nutzung verlängert ihn, und er endet spätestens `CLIENT_SESSION_MAX_DAYS` Tage (30) nach der Anmeldung. Er gehört zum Konto und weist nie ein Gerät nach.
- **Geräte-Tokens.** Der Server gibt einem Gerät einen Token aus 32 zufälligen Bytes in Hex, wenn er es aufnimmt: bei einer freigegebenen Registrierung, einem Beitritt über eine Einladung, einer Agent-Vorlage oder einer Registrierung, die mit dem eigenen Schlüssel des Geräts signiert ist. Der Token ist an die Geräte-ID gebunden und wird als SHA-256-Hash mit seinen ersten 8 Zeichen gespeichert, im Namen keines Kontos. Das Löschen eines Kontos beendet deshalb keinen Geräte-Token. Er läuft nicht nach Zeit ab; das Löschen oder Sperren des Geräts, eine Änderung seiner ID oder ein neu ausgegebener Token beenden ihn. Eine signierte Registrierung gilt fünf Minuten vor und nach der Uhrzeit des Servers. Ein Gerät, dessen Uhr weiter abweicht, wird deshalb abgelehnt, bis seine Uhr stimmt.
- **API-Schlüssel.** Skripte schicken einen Schlüssel im Header `X-API-Key`; der Server nimmt ihn nirgends sonst an, damit er nicht über die URL in Logs und Proxys landet. Der eigene Schlüssel des Servers besteht aus 32 zufälligen Bytes in Hex und wird beim ersten Start mit dem Modus 0600 nach `.api_key` geschrieben, wenn noch keiner existiert. Die Datenbank hält API-Schlüssel als SHA-256-Hashes und speichert außerdem den eigenen Schlüssel des Servers unverändert in `server_config`.

### Client-Adressen hinter einem Proxy {#client-addresses-behind-a-proxy}

Rate Limits, Kontosperren und die Logs nutzen die Adresse des Clients. API und Konsole lesen sie nur dann aus `X-Forwarded-For`, wenn die Verbindung von einem Proxy kommt, dem sie vertrauen (`TRUST_PROXY`, und für die API `TRUSTED_PROXIES`). Dann nehmen sie den Eintrag ganz rechts, der kein vertrauenswürdiger Proxy ist. Einträge weiter links hat der Client selbst geschrieben, und sie zählen nie.

### Die Sitzung in der Konsole {#the-console-session}

Das Cookie heißt `nd.sid`, oder `neodesk.sid`, wenn die Konsole für HTTPS eingerichtet ist. Sein Wert ist eine zufällige ID aus 24 Byte mit einem HMAC-SHA256 darüber, das mit dem Sitzungsgeheimnis als Schlüssel gebildet wird. Die Sitzung selbst ist eine Zeile in `panel_sessions`; das Cookie enthält nichts anderes. Das Cookie ist `HttpOnly` und `SameSite=Lax`. Es ist `Secure`, wenn die Konsole HTTPS ausliefert, und auch dann, wenn eine Anfrage über HTTPS durch einen Reverse Proxy kam, dem die Konsole vertraut (`TRUST_PROXY`) und der das in `X-Forwarded-Proto` meldet. Eine Sitzung endet, wenn sie zu lange untätig war oder ihre absolute Lebensdauer abgelaufen ist; die Standardwerte stehen unter [Härtung](/docs/operations/security#sign-in).

Schreibende Anfragen an die API der Konsole brauchen einen CSRF-Token, abgesehen von der Client- und der Geräte-API. Der Token besteht aus 64 zufälligen Bytes, kommt im Header `X-CSRF-Token` zurück und wird gegen ein Cookie geprüft, das den Token und den SHA-256 aus dem Token gefolgt vom Sitzungsgeheimnis enthält.

Das Sitzungsgeheimnis ist `SESSION_SECRET`, sonst die Datei `.session_secret` im Datenordner der Konsole. Gibt es keins von beiden, erzeugt die Konsole 32 zufällige Bytes und speichert sie dort mit dem Modus 0600.

## Beitritts- und Support-Codes {#join-and-support-codes}

[Computer hinzufügen](/docs/console/add-a-computer) und [Schnellhilfe](/docs/console/quick-support) geben Links heraus, die einen Code tragen.

- Ein Code besteht aus 8 Zeichen eines Alphabets ohne 0, 1, I, L, O und U, das sind etwa 39 Bit. Der Server hält nur seinen SHA-256-Hash, in `server_config`, mit Art, Ablaufzeit und verbleibenden Nutzungen.
- Jede Route, die einen Code annimmt (die Seitendaten, der Download des Pakets, die Linux-Skripte und das Einlösen), zählt gegen ein gemeinsames Limit von 20 Anfragen pro Minute und Adresse. Falsche, abgelaufene, benutzte und widerrufene Codes bekommen alle dieselbe Antwort.
- Ein Beitrittscode gilt 7 Tage, sofern sein Ersteller keine andere Laufzeit gewählt hat (höchstens 30 Tage), und so oft, wie beim Erstellen festgelegt. Sein Einlösen gibt das Gerät frei, egal welcher Beitrittsmodus gilt, und gibt dem Client die Adressen des Servers, seinen Schlüssel und einen Geräte-Token.
- Ein Support-Code gilt eine Stunde lang und einmal. Sein Einlösen gibt der Schnellhilfe-App einen Sitzungs-Token, als Hash gespeichert, der nur die Routen dieser Sitzung öffnet. Die Person am Computer muss die Sitzung auf ihrem Bildschirm erlauben. Die App übergibt dann ihr Sitzungspasswort an den Server, der es nur im Speicher hält und einmal an das Konto weitergibt, das die Sitzung angelegt hat. Die Sitzung endet, wenn die App geschlossen wird, der Supporter sie beendet oder die App sich 3 Minuten lang nicht meldet.
- Die Seiten und der Client warnen, wenn die Konsole über einfaches HTTP läuft.

## Geheimnisse, die der Server speichert {#secrets-the-server-stores}

| Geheimnis | Wo | Wie |
|---|---|---|
| Der private Schlüssel des Servers | `id_ed25519` | Base64, Dateimodus 0600 |
| Der API-Schlüssel des Servers | `.api_key` und `server_config` | Im Klartext, Dateimodus 0600 |
| Das erste Admin-Passwort, wenn der Server es selbst erzeugt hat | `.admin_credentials` | Im Klartext, Dateimodus 0600 |
| Das Sitzungsgeheimnis | `SESSION_SECRET` oder `.session_secret` | Im Klartext, Dateimodus 0600 |
| Das Geheimnis, das API-Tokens signiert | `JWT_SECRET` oder `server_config` | Im Klartext |
| Anmelde-Tokens der Clients, Geräte-Tokens, Sitzungs-Tokens der Schnellhilfe | Datenbank | SHA-256-Hashes |
| Beitritts-, Support- und Kopplungscodes | `server_config` | SHA-256-Hashes |
| Sitzungspasswörter der Schnellhilfe | Nur im Speicher | Einmal an den Supporter gegeben, dann vergessen |
| Der Telemetrie-Schlüssel | `server_config` | Ein privater X25519-Schlüssel, siehe [Das Envelope](/docs/development/architecture#the-envelope) |
| Der Schlüssel der Gerätegeheimnisse | `.device_vault_key`, neben `id_ed25519` | 32 zufällige Bytes als Hex, Dateimodus 0600; beim ersten Start angelegt, in keiner Sicherung außer der des Docker-Verwalters |
| Gerätepasswörter, die eine Organisation speichert | Datenbank | AES-256-GCM mit dem Schlüssel in `.device_vault_key`, für Organisation und Gerät versiegelt. Zeilen von vor 3.6.0-rc.5, versiegelt mit einem Schlüssel aus `ORG_PEER_VAULT_KEY` oder sonst aus dem Geheimnis, das API-Tokens signiert, ziehen beim nächsten Start auf den neuen Schlüssel um |
| Gespeicherte Anmeldedaten (Kontoname und Passwort) | Datenbank | AES-256-GCM mit dem Schlüssel in `.device_vault_key`, für Gerät und Feld versiegelt; siehe [Gespeicherte Anmeldung](/docs/console/saved-sign-in) |
| Passwörter von RDP- und VNC-Zielen | Datenbank | AES-256-GCM, mit einem Schlüssel aus `REMOTE_TARGET_VAULT_KEY`; ohne diesen Schlüssel speichert der Server keine |
| Zwei-Faktor-Geheimnisse | Datenbank | Im Klartext |
| Das LDAP-Bind-Passwort und das OIDC-Client-Secret | `server_config` | Im Klartext; die API antwortet stattdessen mit einer Maske |

Die Datenbank selbst ist nicht verschlüsselt. Behandle sie, die env-Datei und jedes Backup als geheim; siehe [Backup und Wiederherstellung](/docs/operations/backup).

## Audit-Trail {#audit-trail}

Die Ereignisse des Servers (Anmeldungen, abgelehnte Registrierungen, erlaubte und verweigerte Sitzungen, Änderungen an Geräten, Konten und Einstellungen) und das eigene Audit-Protokoll der Konsole bleiben 90 Tage in der Datenbank. Jedes Ereignis des Servers nennt das Konto oder den API-Schlüssel, der gehandelt hat. Wo kein Konto gehandelt hat, etwa bei einer Anmeldung oder bei einem Gerät, nennt es die Adresse des Clients. `AUDIT_LOG_FILE` hängt die Ereignisse des Servers außerdem an eine Datei an.

## Releases {#releases}

Jedes Release hat ein Manifest seiner Binaries und ihrer SHA-256-Summen, signiert mit einem Ed25519-Schlüssel, dessen öffentliche Hälfte in den Server einkompiliert ist. Der Updater und die Installer lehnen ein Release ohne gültige Signatur ab und prüfen die SHA-256-Summe jedes Binarys (die Installer überspringen beides nur mit `--skip-verify` oder `-SkipVerify`), und `neodesk-server verify-release` prüft ein heruntergeladenes Binary von Hand. Derselbe Schlüssel signiert die Releases des Clients: Der Release-Cache nutzt eins nur, wenn seine `SHA256SUMS` eine gültige Signatur tragen, und prüft jedes Paket dagegen. Siehe [Was ein Release enthält](/docs/development/releasing#what-a-release-holds).

## Verbleibende Lücken {#gaps-that-remain}

- Wer in die Datenbank schreiben kann, kann den Audit-Trail ändern; nichts verkettet oder signiert die Einträge.
- Zwei-Faktor-Geheimnisse, das LDAP-Bind-Passwort und das OIDC-Client-Secret werden unverschlüsselt gespeichert.
- Nachrichten an den ID-Server über UDP werden nie verschlüsselt. Solange TLS ausgeschaltet ist, gilt das auch für TCP-Nachrichten von Clients, die den Schlüsselaustausch auslassen.
- Die Konsole spricht auf ihrem Port, von Haus aus 3375, einfaches HTTP, außer sie liefert selbst HTTPS aus oder sitzt hinter einem Reverse Proxy mit TLS.
