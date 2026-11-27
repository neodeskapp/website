---
title: Härtung
description: Was einen NeoDesk-Server im Internet sicherer macht, von TLS für die Konsole bis dazu, wer Sitzungen starten darf, und was jede Einstellung ändert.
order: 8
---

Diese Seite geht die Einstellungen durch, die einen Server im Internet sicherer machen, und sagt, was jede davon ändert. Manche sperren Geräte aus, die vorher funktioniert haben. Prüfe deshalb jede Einstellung daran, wie sich deine Geräte verbinden, bevor du sie einschaltest.

## Die Konsole hinter TLS halten {#keep-the-console-behind-tls}

Die Konsole spricht auf Port 3375 unverschlüsseltes HTTP (5000 bei Installationen unter Linux und Windows von vor 3.6.0-rc.5). Die Installer für Linux und Windows fügen HTTPS auf 5443 mit einem selbst signierten Zertifikat hinzu, vor dem Browser warnen. Setze einen Reverse Proxy mit Zertifikat davor und lass nur den Proxy an den Port; siehe [Die Konsole lokal halten](/docs/operations/reverse-proxy-tls#keep-the-console-local).

Setze `TRUST_PROXY` nur, wenn niemand außer dem Proxy die Konsole erreicht. Ist es eingeschaltet, kann jeder, der die Konsole direkt erreicht, eine beliebige Client-Adresse vorgeben, und die Anmeldelimits zählen diese Adresse. Die API des Servers ist strenger und glaubt nur den Adressen in `TRUSTED_PROXIES`. Siehe [Dem Proxy vertrauen](/docs/operations/reverse-proxy-tls#trusting-the-proxy).

Die Konsole sendet `Strict-Transport-Security` nur, wenn sie HTTPS selbst ausliefert, und Traefik sendet den Header unter Docker mit `--domain`. Hinter einem eigenen Proxy fügst du ihn dort hinzu, wie es die Beispiele für [nginx](/docs/operations/reverse-proxy-tls#nginx) und [Caddy](/docs/operations/reverse-proxy-tls#caddy) tun. In nginx:

```nginx
add_header Strict-Transport-Security "max-age=31536000" always;
```

## Neue Geräte nur mit Freigabe zulassen {#admit-new-devices-only-with-approval}

Im Beitrittsmodus `managed` wartet ein neues Gerät unter **Beitrittsanfragen**, bis jemand es freigibt; `locked` lässt nur Geräte mit gültigem Token zu. Die Installer und ein neues Docker-Volume starten in `managed`. Siehe [Beitrittsmodi](/docs/console/enrollment#enrollment-modes).

Nach dem ersten Start gewinnt der in der Konsole gewählte Modus gegen `ENROLLMENT_MODE`. Soll die Variable bei jedem Start gewinnen, sodass eine Änderung in der Konsole nur bis zum nächsten Neustart gilt, setze zusätzlich `ENROLLMENT_MODE_ENV_OVERRIDE=Y`.

Ist der Modus `open` und laufen ID-Server oder Relay ohne TLS, schreibt der Server bei jedem Start eine Fehlerzeile ins Log, die das meldet.

Lass `ALLOW_LEGACY_OUTBOUND` aus. Im Modus `open` lässt es eine RustDesk-App, die sich nie als Gerät registriert hat, Sitzungen starten.

## Einschränken, wer Sitzungen starten darf {#limit-who-can-start-sessions}

Standardmäßig kann jedes registrierte Gerät eine Sitzung zu einem anderen starten; das entfernte Gerät fragt trotzdem nach seinem Passwort oder seiner Zustimmung. Zwei Schalter unter **Einstellungen**, **Allgemein**, **Verbindungsstrategie**, **Erweiterte Optionen** schränken das ein:

- **Nur angemeldete RustDesk-Apps können Sitzungen starten**: Die RustDesk-App muss an einem NeoDesk-Konto angemeldet sein. Ohne gültige Anmeldung lehnt der Server die Sitzung ab und loggt `Rejected outbound from ...` mit `reason=initiator_login_required`. Sitzungen aus dem Browser sind nicht betroffen.
- **Nur Konten, die sich mit Geräten verbinden dürfen, können Sitzungen starten**: Das Konto, an dem die App angemeldet ist, braucht außerdem die Berechtigung, sich mit Geräten zu verbinden. Der Server liest die Rolle des Kontos bei jeder neuen Sitzung, eine geänderte Rolle gilt also sofort.

Klicke nach dem Ändern auf **Änderungen speichern**. Beide Schalter gibt es auch als Variablen, `LOGGED_IN_ONLY_INITIATOR` und `OPERATOR_ONLY_OUTBOUND`; siehe [Verbindungen](/docs/operations/configuration#connections).

Lass **Geräte mit gemeinsamer öffentlicher IP-Adresse Sitzungen ohne Anmeldung starten lassen** aus. Ohne diese Option gilt: Teilen sich mehrere Geräte eine öffentliche Adresse und kann die App nicht zeigen, welches davon sie ist, lehnt der Server die Sitzung ab (`reason=initiator_ambiguous_same_nat`), statt eines davon auszuwählen.

## ID-Server und Relay verschlüsseln {#encrypt-the-id-server-and-relay}

`TLS_SIGNAL=Y` und `TLS_RELAY=Y` fügen mit `TLS_CERT` und `TLS_KEY` dem ID-Server, dem NAT-Test und dem Relay TLS hinzu. Clients ohne TLS verbinden sich weiterhin auf diesen Ports, weil der Server TLS- und unverschlüsselte Verbindungen am ersten Byte unterscheidet. Die WebSocket-Ports 21118 und 21119 nehmen dann nur noch TLS an. Die Installer für Linux und Windows schalten das mit ihrem selbst signierten Zertifikat ein; der Modus **External reverse proxy** des Linux-Installers schaltet es wieder aus.

Für CDAP-Geräte-Agents schaltet `CDAP_TLS_REQUIRED=Y` mit `TLS_CERT` und `TLS_KEY` TLS auf Port 21122 ein und lehnt dort unverschlüsselte Verbindungen ab.

## Anmeldung {#sign-in}

- **Einstellungen**, **Anmeldung**, **Zwei-Faktor-Anmeldung verlangen** sorgt dafür, dass ein lokales Konto ohne Zwei-Faktor-Anmeldung sie direkt nach seiner nächsten Anmeldung mit Passwort einrichtet. Konten aus einem Verzeichnisdienst oder aus Single Sign-on bleiben ihrem Anbieter überlassen. Konten mit der [Rolle](/docs/people/users-and-roles#roles) Pro-Lizenz sind davon ausgenommen, weil sie sich nicht an der Konsole anmelden können, wo die Einrichtung stattfindet. Siehe [Zwei-Faktor-Anmeldung](/docs/people/two-factor).
- Ein Konto kann auf bis zu 10 Browsern gleichzeitig angemeldet sein; eine Anmeldung darüber hinaus meldet den am längsten nicht verwendeten ab. Für eine Sitzung pro Konto schalte **Eine Sitzung pro Konto** unter **Einstellungen**, **Anmeldung** ein. Jede Person prüft ihre eigenen Browser unter **Angemeldete Geräte** und meldet die ab, die sie nicht kennt; siehe [Dein Konto](/docs/people/your-account). Eine Sitzung endet nach 30 Minuten ohne Aktivität und 24 Stunden nach der Anmeldung. `SESSION_MAX_PER_USER`, `SESSION_IDLE_TIMEOUT` und `SESSION_MAX_AGE` ändern das; siehe [Konfiguration](/docs/operations/configuration#console-sessions-and-logs). Der Tab **Härtung** unter **Aktivität**, **Sicherheitsprüfungen** zeigt die Werte, mit denen der Server läuft.
- Die Anmeldelimits und Sperren stehen unter [Anmeldung und Ratenlimits](/docs/operations/configuration#sign-in-and-rate-limits). Hinter einem Proxy brauchen sie `TRUST_PROXY`.

## Schließen, was du nicht nutzt {#close-what-you-dont-use}

- Öffne nur die Ports aus [Ports und Firewall](/docs/operations/ports), und 21118 und 21119 nur für Clients, die WebSocket nutzen.
- Ohne CDAP-Geräte-Agents schaltest du das Gateway aus, siehe [Das Gateway](/docs/console/cdap#the-gateway), und hältst 21122 in der Firewall geschlossen. Die Installer für Linux und Windows lassen ihn nur mit `CDAP_ENABLED=N` in der env-Datei zu, und die Ein-Zeilen-Installation für Docker öffnet ihn in jedem Fall.
- Beschränke `/metrics` und `/api/health/detail` auf die Adressen in `METRICS_IP_ALLOWLIST`, und lass `METRICS_PUBLIC` aus. Siehe [Monitoring](/docs/operations/monitoring#prometheus-metrics).
- Lass `ADMIN_PORT` ungesetzt, außer du brauchst die Verwaltungsschnittstelle. Sie lauscht nur auf 127.0.0.1 und startet nur, wenn `ADMIN_PASSWORD` gesetzt ist.

## Adressen und Geräte sperren {#block-addresses-and-devices}

Sperren und Blockaden, die du in der Konsole setzt, liegen in der Datenbank. Für eine Liste, die du selbst pflegst, liest der Server eine Datei mit einem Eintrag pro Zeile: eine IP-Adresse, ein Adressbereich oder `id:` und eine Geräte-ID, jeweils mit einem optionalen Grund nach einem Komma. Das ist `blocklist.txt` neben der Schlüsseldatei des Servers (`/opt/neodesk/data/blocklist.txt` unter Docker) oder die Datei, die `BLOCKLIST_FILE` nennt. **Server**, **Konfigurationsdateien** bearbeitet genau diese Datei als **Sperrliste des Servers (blocklist.txt)**.

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

- Das Schlüsselpaar, `.api_key`, `mesh_agent_server.pem` und die env-Datei mit `SESSION_SECRET`, `REMOTE_TARGET_VAULT_KEY` und dem Datenbankpasswort sind Geheimnisse, ebenso die Backups der Konsole, die sie enthalten. Bewahre sie auf wie Passwörter; siehe [Backup und Wiederherstellung](/docs/operations/backup). Die Installer schützen sie vor anderen Benutzern des Rechners: Die Backups des Linux-Installers in `/opt/neodesk-backups` kann nur root lesen, und der Windows-Installer beschränkt `C:\NeoDesk`, `C:\NeoDeskConsole` und `C:\NeoDesk-Backups` auf Administratoren, SYSTEM und das Dienstkonto `NT SERVICE\NeoDeskServer`. Eine ältere Windows-Installation bekommt diese Rechte bei ihrem nächsten Update. Deshalb führst du die Kommandozeile `neodesk` unter Windows in einem Fenster aus, das als Administrator geöffnet ist.
- Der **API-Schlüssel des Servers** unter **Geräte**, **Computer hinzufügen**, **Manuelle Einrichtung**, **Für Skripte** darf fast alles auf dem Server. Konten, Rollenberechtigungen, API-Schlüssel und zweite Faktoren kann er nicht ändern, und ganz sehen ihn nur Konten mit der Rolle Super-Admin oder Administrator. Gib ihn nur Skripten, die ihn brauchen; siehe [API-Schlüssel](/docs/development/api#api-keys).
- Eine vollständige Sicherung enthält jedes Geheimnis. Deshalb laden nur Konten mit der Rolle Super-Admin oder Administrator eine herunter, stellen sie wieder her oder planen sie. Siehe [Die Seite „Sicherung“ in der Konsole](/docs/operations/backup#the-backup-page-in-the-console).
- Einige Einstellungen werden nur auf dem Host des Servers gesetzt: die Release-Schlüssel und Signaturschalter (`UPDATE_MANIFEST_PUBLIC_KEY`, `UPDATE_REQUIRE_SIGNED_MANIFEST`, `NEODESK_SUPPORT_RELEASE_PUBLIC_KEY`), der Signatur-Seed und der Build-Befehl eigener Clients (`NEODESK_CUSTOM_CLIENT_SIGNING_SEED`, `NEODESK_CLIENT_BUILD_COMMAND`) und die Geheimnisse `SESSION_SECRET`, `PANEL_TRUST_SECRET`, `ORG_PEER_VAULT_KEY`, `REMOTE_TARGET_VAULT_KEY`, `UPDATE_GITHUB_TOKEN` und `NEODESK_GITHUB_TOKEN`. Die Konsole schreibt sie nicht: **Server**, **Konfigurationsdateien** speichert keine env-Datei, die einen davon hinzufügt, ändert oder entfernt, und die Einstellungs-API ebenso wenig. Eine gestohlene Admin-Sitzung kann den Updater so nicht dazu bringen, ihrem eigenen Release-Schlüssel zu vertrauen. Ändere sie in der env-Datei auf dem Server und starte ihn neu.
- Lass `SMTP_TLS_VERIFY` eingeschaltet, damit die Konsole das Zertifikat des Mailservers prüft.
