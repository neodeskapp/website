---
title: Härtung
description: Was einen NeoDesk-Server im Internet sicherer macht, von TLS für die Konsole bis dazu, wer Sitzungen starten darf, und was jede Einstellung ändert.
order: 8
---

Diese Seite geht die Einstellungen durch, die einen Server im Internet sicherer machen, und sagt, was jede davon ändert. Manche sperren Geräte aus, die vorher funktioniert haben. Prüfe deshalb jede Einstellung daran, wie sich deine Geräte verbinden, bevor du sie einschaltest.

## Die Konsole hinter TLS halten {#keep-the-console-behind-tls}

Die Konsole spricht auf Port 5000 unverschlüsseltes HTTP. Setze einen Reverse Proxy mit Zertifikat davor und lass nur den Proxy an den Port; siehe [Die Konsole lokal halten](/docs/operations/reverse-proxy-tls#keep-the-console-local).

Setze `TRUST_PROXY` nur, wenn niemand außer dem Proxy die Konsole erreicht. Ist es eingeschaltet, kann jeder, der die Konsole direkt erreicht, eine beliebige Client-Adresse vorgeben, und die Anmeldelimits zählen diese Adresse. Die API des Servers ist strenger und glaubt nur den Adressen in `TRUSTED_PROXIES`. Siehe [Dem Proxy vertrauen](/docs/operations/reverse-proxy-tls#trusting-the-proxy).

Die Konsole sendet `Strict-Transport-Security` nur, wenn sie HTTPS selbst ausliefert. Hinter einem Proxy fügst du den Header dort hinzu, zum Beispiel in nginx:

```nginx
add_header Strict-Transport-Security "max-age=31536000" always;
```

## Neue Geräte nur mit Freigabe zulassen {#admit-new-devices-only-with-approval}

Im Registrierungsmodus `managed` wartet ein neues Gerät unter **Registrierungsanfragen**, bis jemand es freigibt; `locked` lässt nur Geräte mit gültigem Token zu. Die Installer und ein neues Docker-Volume starten in `managed`. Siehe [Registrierungsmodi](/docs/console/enrollment#enrollment-modes).

Nach dem ersten Start gewinnt der in der Konsole gewählte Modus gegen `ENROLLMENT_MODE`. Soll die Variable bei jedem Start gewinnen, sodass eine Änderung in der Konsole nur bis zum nächsten Neustart gilt, setze zusätzlich `ENROLLMENT_MODE_ENV_OVERRIDE=Y`.

Ist der Modus `open` und laufen ID-Server oder Relay ohne TLS, schreibt der Server bei jedem Start eine Fehlerzeile ins Log, die das meldet.

Lass `ALLOW_LEGACY_OUTBOUND` aus. Im Modus `open` lässt es eine RustDesk-App, die sich nie als Gerät registriert hat, Sitzungen starten.

## Einschränken, wer Sitzungen starten darf {#limit-who-can-start-sessions}

Standardmäßig kann jedes registrierte Gerät eine Sitzung zu einem anderen starten; das entfernte Gerät fragt trotzdem nach seinem Passwort oder seiner Zustimmung. Zwei Schalter unter **Einstellungen**, **Allgemein**, **Verbindungsstrategie**, **Erweiterte Optionen** schränken das ein:

- **Nur angemeldete RustDesk-Apps können Sitzungen starten**: Die RustDesk-App muss an einem NeoDesk-Konto angemeldet sein. Ohne gültige Anmeldung lehnt der Server die Sitzung ab und loggt `Rejected outbound from ...` mit `reason=initiator_login_required`. Sitzungen aus dem Browser sind nicht betroffen.
- **Nur Konten, die sich mit Geräten verbinden dürfen, können Sitzungen starten**: Das Konto, an dem die App angemeldet ist, braucht außerdem die Berechtigung, sich mit Geräten zu verbinden. Der Server liest die Rolle des Kontos bei jeder neuen Sitzung, eine geänderte Rolle gilt also sofort.

Klicke nach dem Ändern auf **Verbindungsstrategie speichern**. Beide Schalter gibt es auch als Variablen, `LOGGED_IN_ONLY_INITIATOR` und `OPERATOR_ONLY_OUTBOUND`; siehe [Verbindungen](/docs/operations/configuration#connections).

Lass **Geräte mit gemeinsamer öffentlicher IP-Adresse Sitzungen ohne Anmeldung starten lassen** aus. Ohne diese Option gilt: Teilen sich mehrere Geräte eine öffentliche Adresse und kann die App nicht zeigen, welches davon sie ist, lehnt der Server die Sitzung ab (`reason=initiator_ambiguous_same_nat`), statt eines davon auszuwählen.

## ID-Server und Relay verschlüsseln {#encrypt-the-id-server-and-relay}

`TLS_SIGNAL=Y` und `TLS_RELAY=Y` fügen mit `TLS_CERT` und `TLS_KEY` dem ID-Server, dem NAT-Test und dem Relay TLS hinzu. Clients ohne TLS verbinden sich weiterhin auf diesen Ports, weil der Server TLS- und unverschlüsselte Verbindungen am ersten Byte unterscheidet. Die WebSocket-Ports 21118 und 21119 nehmen dann nur noch TLS an. Die Installer für Linux und Windows schalten das mit ihrem selbst signierten Zertifikat ein; der Modus **External reverse proxy** des Linux-Installers schaltet es wieder aus.

Für CDAP-Geräte-Agents schaltet `CDAP_TLS_REQUIRED=Y` mit `TLS_CERT` und `TLS_KEY` TLS auf Port 21122 ein und lehnt dort unverschlüsselte Verbindungen ab.

## Anmeldung {#sign-in}

- **Einstellungen**, **Anmeldung**, **Zwei-Faktor-Anmeldung verlangen** sorgt dafür, dass ein lokales Konto ohne Zwei-Faktor-Anmeldung sie direkt nach seiner nächsten Anmeldung mit Passwort einrichtet. Konten aus einem Verzeichnisdienst oder aus Single Sign-on bleiben ihrem Anbieter überlassen, und Konten mit Pro-Lizenz sind davon ausgenommen. Siehe [Zwei-Faktor-Anmeldung](/docs/people/two-factor).
- Ein Konto darf eine Konsolensitzung zur selben Zeit haben. Sie endet nach 30 Minuten ohne Aktivität und 24 Stunden nach der Anmeldung. `SESSION_MAX_PER_USER`, `SESSION_IDLE_TIMEOUT` und `SESSION_MAX_AGE` ändern das; siehe [Konfiguration](/docs/operations/configuration#console-sessions-and-logs). Der Tab **Härtung** unter **Aktivität**, **Sicherheit und Protokoll** zeigt die Werte, mit denen der Server läuft.
- Die Anmeldelimits und Sperren stehen unter [Anmeldung und Ratenlimits](/docs/operations/configuration#sign-in-and-rate-limits). Hinter einem Proxy brauchen sie `TRUST_PROXY`.

## Schließen, was du nicht nutzt {#close-what-you-dont-use}

- Öffne nur die Ports aus [Ports und Firewall](/docs/operations/ports), und 21118 und 21119 nur für Clients, die WebSocket nutzen.
- Ohne CDAP-Geräte-Agents setzt du `CDAP_ENABLED=N`, dann bleibt Port 21122 zu.
- Beschränke `/metrics` und `/api/health/detail` auf die Adressen in `METRICS_IP_ALLOWLIST`, und lass `METRICS_PUBLIC` aus. Siehe [Monitoring](/docs/operations/monitoring#prometheus-metrics).
- Lass `ADMIN_PORT` ungesetzt, außer du brauchst die Verwaltungsschnittstelle. Sie lauscht nur auf 127.0.0.1 und startet nur, wenn `ADMIN_PASSWORD` gesetzt ist.

## Adressen und Geräte sperren {#block-addresses-and-devices}

Sperren und Blockaden, die du in der Konsole setzt, liegen in der Datenbank. Für eine Liste, die du selbst pflegst, lass `BLOCKLIST_FILE` auf eine Datei mit einem Eintrag pro Zeile zeigen: eine IP-Adresse, ein Adressbereich oder `id:` und eine Geräte-ID, jeweils mit einem optionalen Grund nach einem Komma.

```text
# Lines starting with # are comments
203.0.113.7
198.51.100.0/24, scanner
id:123456789, stolen laptop
```

Der Server liest die Datei beim Start. Unter Linux liest er sie erneut, wenn er `SIGHUP` bekommt:

```bash
sudo systemctl kill -s HUP neodesk-server
```

## Die Geheimnisse schützen {#protect-the-secrets}

- Das Schlüsselpaar, `.api_key`, `mesh_agent_server.pem` und die env-Datei mit `SESSION_SECRET`, `REMOTE_TARGET_VAULT_KEY` und dem Datenbankpasswort sind Geheimnisse, ebenso die Backups der Konsole, die sie enthalten. Bewahre sie auf wie Passwörter; siehe [Backup und Wiederherstellung](/docs/operations/backup).
- Der API-Schlüssel des Servers unter **Einstellungen**, **Client-Einrichtung**, **Für Skripte** kann den ganzen Server verwalten. Gib ihn nur Skripten, die ihn brauchen.
- Lass `SMTP_TLS_VERIFY` eingeschaltet, damit die Konsole das Zertifikat des Mailservers prüft.
